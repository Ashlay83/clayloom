import type{ErrorRequestHandler} from 'express';
import mongoose from 'mongoose';
import {z} from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message);
    res.status(400).json({ error: 'Validation failed', details: messages });
    return;
  }

  if (error instanceof z.ZodError) {
  res.status(400).json({ error: 'Validation failed', details: error.issues.map((i) => i.message) });
  return;
}

  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};