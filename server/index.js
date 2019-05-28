import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'This is Hello books' });
});

app.all('*', (req, res) => res.status(404).send('Sorry, the requested endpoint does not exist on our server'));

app.listen(port, () => console.log(`Server is running on PORT ${port}`));


export default app;
