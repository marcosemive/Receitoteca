import express from 'express';
import morgan from 'morgan';
import router from './routes.js';
 
const server = express();
 
server.use(morgan('tiny'));
 
server.use(express.json());
 
server.use(express.static('public'));
 
server.use('/api', router);
 
server.get('/', (req, res) => {
  res.redirect('/paginainicial.html');
});
 
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});