import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('This is Hello Books'));

app.listen(port, () => console.log(`Server is running on PORT ${port}`));


export default app;
