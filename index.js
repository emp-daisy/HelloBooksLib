import express from 'express';

const app = express();

const port = 3000;

app.get('/', (req, res) => res.send('This is Hello Books'));

app.listen(port, () => console.log(`Server is running on PORT ${port}`));


export default app;
