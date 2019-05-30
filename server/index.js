import express from 'express';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import route from './route/index';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const swaggerApiDoc = yaml.load(`${__dirname  }/docs/hellobooks_api_doc.yaml`);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerApiDoc));

app.use('/api/v1/', route);

app.all('*', (req, res) => res.status(404).json({ error: 'Sorry, the requested endpoint does not exist on our server' }));

app.listen(port, () => console.log(`Server is running on PORT ${port}`));


export default app;
