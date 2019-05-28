import express from 'express';

const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'This is Hello books' });
});

app.listen(port, () => console.log(`Server is running on PORT ${port}`));


export default app;
