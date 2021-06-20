import { DATABASE_URL } from '../config';
import mongoose from 'mongoose';

export const dbInit = ()=>{
    mongoose.connect( DATABASE_URL! , {
        useUnifiedTopology : true ,
        useNewUrlParser : true ,
        useCreateIndex : true
    });
    mongoose.connection.on('connected' , ()=> console.log('Database Connected'));
    mongoose.connection.on('error' , ()=> console.log('error'));
    mongoose.connection.on('disconnected' , ()=> console.log('Database Disconnected'));
}