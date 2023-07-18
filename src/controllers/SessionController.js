import jwt from 'jsonwebtoken';
import User from '../models/User';
import { checkPassword } from '../services/auth';
import authConfig from '../config/auth'

class SessionController {
    async create(req, res) {
        const { user, password} = req.body;
        const findUser = await User.findOne({ user });

        if(!findUser) {
            return res.status(401).json({error: "User / password inválido!"});
        };

        if(!checkPassword(findUser, password)) {
            return res.status(401).json({error: "User / password inválido!"});
        };

        const {id} = findUser;

        return res.json({
            user: {
                id, 
                user
            },
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        });
    }
}

export default new SessionController();