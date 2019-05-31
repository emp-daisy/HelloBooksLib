import express from 'express';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import userRouter from "./userRoute"

const router = express();

const swaggerApiDoc = yaml.load(`${__dirname  }/../docs/hellobooks_api_doc.yaml`);

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerApiDoc));

router.get('/', (req, res) => {
    res.status(200).json({ message: 'This is Hello books' });
});

router.use('/auth', userRouter);

export default router;