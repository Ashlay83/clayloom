import type { Product } from "../types";

export const getProducts = async (): Promise<Product[]> =>{
    const response = await fetch('/api/products');

    if(!response.ok){
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<Product[]>;
}

export const getProduct = async (id:string): Promise<Product> =>{
    const response = await fetch(`/api/products/${id}`);
    
    if(response.status===400||response.status===404){
        throw new Error('Product not found');

    }

    if(!response.ok){
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<Product>;
};
