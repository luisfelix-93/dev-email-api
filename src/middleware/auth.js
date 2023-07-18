import authConfig from '../config/auth'
import jwt from 'jsonwebtoken';
import {promisify} from 'util';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({message: "Usuário não autenticado"})
    }
    // Bearer XXXX
    const [, token] = authHeader.split(' ');
    try {
        const decoded = await promisify(jwt.verify)(token,authConfig.secret);
        req.userId = decoded.id;
        return next();
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: "Erro interno de servidor"});
    }

}
