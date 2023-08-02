# DEV-EMAIL-API

- **Desenvolvido por: Luis Felipe F. Filho 💻 🤓**
> Status: Developing ⚠️

**Esta API está sendo desenvolvida para ser um broker de email, no momento utilizando IMAP e SMTP, para o envio de emails e para leitura de caixas de email**

## Models

**Temos os seguintes modelos na API:**

+ Users
+ MailAccount
+ MailLogger

### Users

No modelo de usuários do sistema nós temos:
+ user
+ password

Obs:.
No futuro, faremos com esse modelo sirva para fazer autenticação da API (JWT)

### MailAccount

Modelo para receber os dados da conta de email dentro do usuário.
Neste modelo nós temos os seguintes objetos:

+ email
+ password
+ host_smtp
+ port_smtp
+ host_imap
+ port_imap
+ isOauth
+ clientId
+ clientSecret
+ clientTenant
+ refreshToken
+ accessToken
+ accessUrl

Mais na frente, na parte de controllers serão explicados como cada objeto se relaciona com as chamadas da API;

### MailLogger

Modelo para receber os emails enviados e recebido.
Neste modelo encontramos os seguintes objetos:

+ from
+ to
+ message
+ replyTo

## Middleware
### auth.js
- A função do middleware é fazer a autenticação do token, gerado na session;

## Controllers
**Até o momento, temos os seguintes controllers:**
+ UserController
+ MailAccountController

### UserController
**Apenas um CRUD básico para usuários**

   
### MailAccountController

Controller relacionados a criação de conta de email, envio e recebimento de email.

- **Trasnporter em caso de isOauth ser true**
> 
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
>

- *** Transporter em caso de isOauth ser nulo, ou falso ***
>
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
>

- *** Inserção de log no banco ***
>
    const mailLogger = await MailLogger.create({
            to, 
            from: user, 
            message, 
            subject, 
            replyTo: user
    })
>

- **Método de recebimento de email**
>
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
>

### SessionController
- Controller criado para fazer a autenticação de usuário

> 
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
>
## Rotas
### Usuários
- Com exceção da rota de criação de usuário, todas as rotas são protegidas por autenticação;
> routes.post('/users'); //CreateUser
> routes.use(auth);
> routes.get('/users'); //GetUser
> routes.get('/users/:id'); //GetUserById
> routes.put('/users/:id'); //UpdateUserById
> routes.delete('/users/:id'); //DeleteUserById

### Email
- As rotas de email são protegidas por autenticação
>routes.use(auth);
>routes.post('/users/:user_id/createAccount'); //CreateAccount
>routes.post('/users/:user_id/sendMail'); //SendMail
>routes.get('/users/:user_id/getMail'); //GetMail


