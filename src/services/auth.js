import bcrypt from 'bcrypt'

export const createPasswordHash = async (password) => 
    bcrypt.hash(password, 8);

export const checkPassword = (user, password) =>
    bcrypt.compare(password, user.password);