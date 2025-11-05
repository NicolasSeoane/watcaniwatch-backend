import bcrypt from "bcrypt";

export const hashPassword = async (password) => await bcrypt.hash(password, 10);
export const comparePassword = async (plain, hash) => await bcrypt.compare(plain, hash);