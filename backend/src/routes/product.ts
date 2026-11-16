import express from 'express';
import {Product} from '../models/product.js'

const router = express.Router();

router.get('/',async (req,res)=>{
    const products= await Product.find({});
    res.json(products);
});

router.get('/:id',async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404).json({error:'Error Product Not Found'});
        return;
    }

    res.json(product);
});

router.post('/',async(req,res)=>{
    const product= new Product(req.body);
    const saved= await product.save();
    res.status(201).json(saved);
});


export {router};