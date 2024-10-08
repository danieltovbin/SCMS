import { Error, Request, Response, Next } from 'express';
const isDev = process.env.NODE_ENVIRONMENT === 'development'

export const errorHandler = ((err:Error, req:Request, res:Response, next:Next) => {
    const status = err.status || 500;
    const message = isDev ? err.message : 'Internal Server Error';
    res.status(status).json({ message });
});