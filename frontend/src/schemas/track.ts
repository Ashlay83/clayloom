import {z} from 'zod';

export const trackSchema = z.object({
    code:z.string().trim().toUpperCase().regex(/^CL-[A-Z0-9]{5}$/,'Order codes look like CL-XXXXX'),
    phone:z.string().trim().regex(/^[6-9]\d{9}$/,"Enter a 10-digit  Mobile Number used at checkout"),
});

export type TrackInput = z.infer<typeof trackSchema>;

