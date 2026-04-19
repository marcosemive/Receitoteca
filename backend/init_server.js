// npm init  -y --> o package.json é criado automaticamente; 
// npm install express e morgan baixaram as bibliotecas --> package lock é criado automaticamente;
// é preciso alterar o tipo para module de express e morgan no pjson
// node init_server.js inicializa o server
import express from "express"
import morgan from "morgan"

const app = express();

app.use(morgan('tiny'));

app.use(express.static('frontend'));

//app.use(express.json())

app.get('/', (req, res) => {
    return res.send('Web server initialized.');
});

app.listen(3000, () => console.log('Server is running on port 3000'));