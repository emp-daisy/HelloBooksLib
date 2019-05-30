import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import routes from './routes/index';

config();

const app = express();
const log = debug('dev');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/', routes);

app.all('*', (req, res) => res.status(404).json({ error: 'Sorry, the requested endpoint does not exist on our server' }));

app.listen(port, () => log(`Server is running on PORT ${port}`));


export default app;
