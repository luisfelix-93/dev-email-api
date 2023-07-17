import { Router } from "express";
import UserController from "./controllers/UserController";
import MailAccountController from "./controllers/MailAccountController";
import HelloWorldController from './controllers/HelloWorldController'

const routes = new Router();

routes.get('/hello-world', HelloWorldController.index)

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.create);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);

routes.post('/users/:user_id/createAccount', MailAccountController.create);
routes.post('/users/:user_id/sendMail', MailAccountController.sendMail);
routes.get('/users/:user_id/getMail', MailAccountController.getMail);


export default routes