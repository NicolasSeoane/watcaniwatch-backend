import { User } from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registro normal
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Mail already in use" });

    const hash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      provider: "local",
    });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

// Login normal
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.provider === "google")
      return res.status(400).json({
        message: "User registered with google, sign in with google.",
      });

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Login con Google
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        provider: "google",
      });
    }

    const jwtToken = generateToken(user);
    res.json({ user, token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error with google login" });
  }
};