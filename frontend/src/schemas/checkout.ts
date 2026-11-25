import {z} from 'zod';

export const checkoutSchema= z.object({
    name:z.string().trim().min(2,"Enter Your Name"),
    phone:z.string().trim().regex(/^[6-9]\d{9}$/,"Enter a 10-digit Indian Mobile Number"),
    address:z.string().trim().min(5,"Enter Your full delivery address"),
    notes:z.string().trim().max(1000,"notes are too long")
});

export type CheckoutFields = z.infer<typeof checkoutSchema>;
export type FieldErrors= Partial<Record<keyof CheckoutFields,string>>;

type ValidationResult =
    |{ok:true; data:CheckoutFields}
    |{ok:false; errors:FieldErrors};

export function validateCheckout(values:unknown):ValidationResult{
    const result = checkoutSchema.safeParse(values);

    if(result.success){
        return {ok:true , data:result.data};
    }

    const errors:FieldErrors={};

    for(const issue of result.error.issues){
        const field = issue.path[0];
        if(typeof field==='string'&&!(field in errors)){
            errors[field as keyof CheckoutFields]= issue.message;
        }
    }
    return{ok:false, errors};
}