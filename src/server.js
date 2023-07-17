import app from "./app";
import bodyParser from "body-parser";

app.listen(5001);
app.use(bodyParser.json());
console.log('aplicação rodando na porta 5001');

