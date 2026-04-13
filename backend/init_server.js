import express from "express"
import morgan from "morgan"

const app = express();

app.use(morgan('tiny'));

app.use(express.static('frontend'));

app.use(express.json())
// app.get('/', (req, res) => {
//   return res.send('Web server initialized.');
// });

app.listen(3000, () => console.log('Server is running on port 3000'));