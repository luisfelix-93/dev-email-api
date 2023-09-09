import mongoose from 'mongoose'

class Database {
    constructor(){
        mongoose.connect('mongodb+srv://luisfelixfilho:lfcf%401310@cluster0.hjmased.mongodb.net/dev-email-api',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = mongoose.connection;
        
        db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
        db.once('open', () => {
          console.log('Conectado ao banco de dados MongoDB');
        });
    }
}

export default new Database();