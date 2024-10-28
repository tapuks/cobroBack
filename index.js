import express, { json } from 'express';
import cors from 'cors';
import { productRouter } from './routes/products.js';

const app = express();
app.use(json()); // Middleware para parsear JSON
app.use(cors()); // Middleware para habilitar CORS
app.disable('x-powered-by'); // desabilita o header X-Powered-By

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/products', productRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
