import express from "express";
import morgan from "morgan";
import route from './routes.js';

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', route);

app.get('/', (req, res) => {
  res.redirect('/paginainicial.html');
});

app.listen(3000, () => console.log('Server is running on port 3000'));


