import User from '../models/User'
import { createPasswordHash } from '../services/auth';

class UserController {
    async index(req, res) {
       try{
            const users = await User.find();
            return res.json(users);
       } catch(error) {
            console.error(error);
            return res.status(500).json({error: "Erro interno de servidor"});
       }
    }

    async show(req, res) {
     try{
          const { id } = req.params;
          const user = await User.findById(id);
          if(!user){
               return res.status(404).json({message: 'Usuário não encontrado'});
            }
          return res.status(200).json(user)

     } catch(error){
          console.error(error);
          return res.status(500).json({error: "Erro interno de servidor"});
     }
    }

    async create(req, res) {
       try {
        const { user, password } = req.body;

        const findUser = await User.findOne({user});
        
        if(findUser){
            return res.status(422).json({ message: `Usuário já existe no sistema`})
        }
        const encryptadePassword = await createPasswordHash(password);

        const newUser = await User.create( 
          { 
               user,
               password: encryptadePassword
          });
        return res.status(201).json(newUser);

       }catch(error) {
            console.error(error);
            return res.status(500).json({error: "Erro interno de servidor"});
       }
    }

    async update(req, res) {
     try {
          const { id } = req.params;
          const { email, password} = req.body;
          const user = await User.findById(id);
   
          if(!user){
             return res.status(404).json({message: 'Usuário não encontrado'});
          }
          const encryptadePassword = await createPasswordHash(password);
          await user.updateOne({ email, password: encryptadePassword});
          return res.status(200).json({message: "Usuário atualizado com sucesso"})

     } catch(error) {
            console.error(error);
            return res.status(500).json({error: "Erro interno de servidor"});
     }
    }

    async destroy(req, res) {
     try{
          const { id } = req.params;
          const user = await User.findById(id);
          if(!user){
               return res.status(404).json({message: 'Usuário não encontrado'});
            }
          
          await user.deleteOne();
          return res.status(200).json({message: "Usuário deletado com sucesso"})

     } catch(error){
          console.error(error);
          return res.status(500).json({error: "Erro interno de servidor"});
     }
    }
}

export default new UserController();