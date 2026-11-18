import {randomBytes} from 'node:crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';

export const generateOrderCode=():string =>{
    let suffix= '';
    for(const byte of randomBytes(5)){
        suffix += ALPHABET[byte % ALPHABET.length];
    }
    return`CR-${suffix}`
};

