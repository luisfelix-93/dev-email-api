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

Mais na frente, na parte de controllers serão explicados como cada objeto se relaciona com as chamadas da API;

### MailLogger

Modelo para receber os emails enviados e recebido.
Neste modelo encontramos os seguintes objetos:

+ from
+ to
+ message
+ replyTo

## Controllers
**Até o momento, temos os seguintes controllers:**
+ UserController
+ MailAccountController

### UserController
**Apenas um CRUD básico para usuários**

   
### MailAccountController

Controller relacionados a criação de conta de email, envio e recebimento de email.

- **Método de envio de email**
⚠️
- **Método de recebimento de email**
⚠️
