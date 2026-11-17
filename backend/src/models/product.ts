import mongoose,{Schema} from "mongoose";

export interface IProduct{
    name: string;
    price: number;
    description: string;
    category:'crochet'|'keychain'|'other';
    inStock:boolean;  
}

const productSchema = new Schema<IProduct>(
    {
        name:{type:String,required:true, trim:true, minlength:2},
        price:{type:Number,required:true,min:0},
        description:{type:String,default:'Made with Love'},
        category:{type:String, enum:['crochet','keychain','other'],default:'other'},
        inStock:{type:Boolean,default:true},
    },
    {
        timestamps:true
    }
);

productSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const Product  = mongoose.model<IProduct>('Product',productSchema);