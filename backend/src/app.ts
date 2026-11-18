import express from 'express';
import {router as productRouter}  from './routes/product.js';
import {router as loginRouter}  from './routes/login.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { router as ordersRouter } from './routes/order.js';

const app = express();

app.use(express.json());

app.get('/api/health',(req,res)=>{
    res.json({
        status:'ok'
    });
});
app.use('/api/login',loginRouter);
app.use('/api/products',productRouter);
app.use('/api/orders', ordersRouter);
app.use((_req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' });
});
app.use(errorHandler);
export {app};