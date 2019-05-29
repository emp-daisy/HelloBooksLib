import express from 'express';

const router = express();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'This is Hello books' });
});

export default router;