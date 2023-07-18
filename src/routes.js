import { Router } from "express";
import UserController from "./controllers/UserController";
import MailAccountController from "./controllers/MailAccountController";
import SessionController from "./controllers/SessionController";
import auth from "./middleware/auth";
const routes = new Router();

routes.post('/sessions', SessionController.create);
routes.post('/users', UserController.create);
routes.use(auth);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);




routes.post('/users/:user_id/createAccount', MailAccountController.create);
routes.post('/users/:user_id/sendMail', MailAccountController.sendMail);
routes.get('/users/:user_id/getMail', MailAccountController.getMail);


export default routes