import express from 'express';
import {router} from './routes/product.js';
import { errorHandler } from './middlewares/errorHandler.js';


const app = express();

app.use(express.json());

app.get('/api/health',(req,res)=>{
    res.json({
        status:'ok'
    });
});

app.use('/api/products',router);
app.use(errorHandler);
export {app};