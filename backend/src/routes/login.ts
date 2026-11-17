import express, { Router } from 'express'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwt_secret } from '../config.js';


const router = express.Router();

router.post('/', async(req,res)=>{

    const {username,password} = await req.body;
    const user = await User.findOne({username});
    const ok = user ? await bcrypt.compare(password, user.passwordHash): false;

    if(!user||!ok){
        return res.status(401).json({
            error:'invalid username or password'
        })
    }

    const token = jwt.sign({id:user.id},jwt_secret,{expiresIn:'7d'});

    res.json({token , username:user.username});
})

export {router};