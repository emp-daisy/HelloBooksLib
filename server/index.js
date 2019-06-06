import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import faker from 'faker';
import routes from './routes/index';

config();

const app = express();
const log = debug('dev');

const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.status(301).redirect('/api/v1'));

app.get('/api/faker', (req, res) => {
  const no = 100;
  let index;
  const fakes = [];
  for (index = 0; index < no; index += 1) {
    fakes.push({
      title: faker.lorem.words(),
      author: faker.name.findName(),
      author_image: faker.image.avatar(),
      release_date: faker.date.recent(),
      image: faker.image.abstract(),
      price: faker.commerce.price(),
      short_description: faker.lorem.sentence(),
      long_description: faker.lorem.paragraph()
    });
  }
  res.json(fakes);
});

app.use('/api/v1', routes);

app.all('*', (req, res) =>
  res.status(404).json({
    error: 'Sorry, the requested endpoint does not exist on our server'
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => log(`Server is running on PORT ${port}`));
}
export default app;
