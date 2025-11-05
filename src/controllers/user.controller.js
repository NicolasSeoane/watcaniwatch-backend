import { User } from "../models/User.js";

//TODO: user profile

export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        next(err)
    }
}
