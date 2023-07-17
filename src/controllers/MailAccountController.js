import User from "../models/User";
import MailAccount from "../models/MailAccount";
import nodemailer from 'nodemailer';
import MailLogger from "../models/MailLogger";
import imap from 'imap';

class MailAccountController {
    async create(req, res) {
    try{
        const {user_id} = req.params;
        const { email, password, host_smtp, port_smtp, host_imap, port_imap } = req.body;
        const user = await User.findById(user_id);
        if(!user) {
            return res.status(404).json({message: "usuario não encontrado"});
        };
        const account = await MailAccount.findOne({
            userId: user_id,
            email
        });
        if(account){
            return res.status(422).json({message:`Conta de  ${email} já registrado`});
        }

        const newAccount = await MailAccount.create({ email,
            password, 
            host_smtp, 
            port_smtp,
            host_imap,
            port_imap,
            userId: user_id 
        })

        return res.status(201).json({
            message: 'Email cadastrado com sucesso',
            newAccount
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: "Erro interno de servidor"});
    }
    }

    async sendMail(req, res) {
    try{
        const {user_id} = req.params;
        const {to, message, subject, replyTo} = req.body;
        const findUser = await User.findById(user_id);
        if(!findUser) {
            return res.status(404).json({message: "usuario não encontrado"});
        };

        const account = await MailAccount.findOne({
            userId: user_id,
        });
       
        if(!account) {
            return res.status(404).json({message: "usuario não encontrado"});
        }

        const user = account.email;
        const pass = account.password;
        const host = account.host_smtp;
        const port = account.port_smtp; 
        const secure = true;

        if(port =!465 ) {
            secure = false
        }

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            auth: {
                user,
                pass
            },
            secure
        });

        await transporter.sendMail({
            to: to,
            from: user,
            subject: subject,
            text: message,
            replyTo: user
        })

        const mailLogger = await MailLogger.create({
            to, 
            from: user, 
            message, 
            subject, 
            replyTo: user
        })

        return res.status(200).json({
            message: 'Email enviado com sucesso',
            mailLogger
        })
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Erro interno de servidor",
    error});
        }
    }
    async getMail(req, res) {
        try{
            const {user_id} = req.params;
            const findUser = await User.findById(user_id);
            if(!findUser) {
                res.status(404).json({message: "usuario não encontrado"});
            }
            const account = await MailAccount.findOne({
                userId: user_id
            });
            const email = account.email;
            const pass = account.password;
            const host = account.host_imap
            const port = account.port_imap;

            const client = new imap.Client();
            client.connect({
                host,
                port,
                auth:{
                    email,
                    pass,
                    isSecure: true
                }
            })

            client.login();
            const beforeDate = new Date();
            beforeDate.setDate(beforeDate.getDate()- 1);
            const searchQuery = {
                before: beforeDatwe.toISOString().slice(0, 10),
                timeout: 10000
            };
            const mails = await client(searchQuery);

            return res.status(200).json(mails);


        } catch(error) {

        }
    } 

}

export default new MailAccountController();