import User from "../models/User";
import MailAccount from "../models/MailAccount";
import nodemailer from 'nodemailer';
import MailLogger from "../models/MailLogger";
import imap from 'imap';
import MailException from "../models/MailException";

class MailAccountController {
    async create(req, res) {
    try{
        const {user_id} = req.params;
        const { email, password, host_smtp, port_smtp, host_imap, port_imap, isOauth, clientId, clientSecret, clientTenant, refreshToken, accessToken, accessUrl } = req.body;
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
            isOauth,
            clientId,
            clientSecret,
            clientTenant,
            refreshToken,
            accessToken,
            accessUrl,
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
    async show(req, res) {
        try {
            const {user_id} = req.params;
            const user = await User.findById(user_id);
            if(!user){
                res.status(404).json({message: 'usuário não encontrado'})
            }
            const account = await MailAccount.find({
                userId: user_id,
            })
            res.status(200).json(account)

        } catch(error) {
            console.error(error);
            return res.status(500).json({message: "Erro interno de servidor",
        error});
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
        let isOauth = account.isOauth;
        const clientId = account.clientId;
        const clientSecret = account.clientSecret;
        const clientTenant = account.clientTenant;
        const accessToken = account.accessToken;
        if(isOauth) {      
            const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            auth: {
                type: 'OAuth2',
                clientId: clientId,
                clientSecret: clientSecret,
                tenantId: clientTenant,
                accessUrl: accessToken
            },
            secure: {
                protocol: 'TLSv1.2',
            },
        });
        await transporter.sendMail({
            to: to,
            from: user,
            subject: subject,
            text: message,
            replyTo: user
        });
        }

        else {
            const transporter = nodemailer.createTransport({
                host: host,
                port: port,
                auth:{
                    user,
                    pass
                }, 
                secure: true
            });
            
            await transporter.sendMail({
                to: to,
                from: user,
                subject: subject,
                text: message,
                replyTo: user
            });
        }

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
        const newException = await MailException.create({
            message: `${error}`,
            statusCode: 500
        })
        return res.status(500).json({message: "Erro interno de servidor", newException});
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