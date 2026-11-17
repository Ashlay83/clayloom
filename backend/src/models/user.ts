import mongoose, { Schema } from "mongoose";

export interface IUser {
    username:string;
    passwordHash:string;
    timeStamps:true;
}

const userSchema= new Schema<IUser>(
    {
       username:{type:String,required:true,lowercase:true},
       passwordHash:{type:String,required:true},
    },
    {
        timestamps:true
    }

);

userSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});

export const User = mongoose.model<IUser>('User',userSchema);