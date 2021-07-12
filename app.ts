import express from "express";
import { PORT } from "./config";
import cors from 'cors';
import { dbInit } from "./initializer";
import { ADMIN_JWT } from "./config";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketEventHandler } from "./socketroutes";
import { JwtSocketController } from "./socketcontrollers";

// Initialization
const app = express();
const server = createServer(app);
export const io = new Server(server, { cors : { origin : '*' } } );
dbInit();
console.log(ADMIN_JWT);
process.on('uncaughtException',()=> console.log('Exception Occured'));
process.on('unhandledRejection',()=> console.log('UnhandledRejection'));

// Middlewares
app.use(cors());
app.use(express.json());
io.use(JwtSocketController.verifyAdmin);

// Routes
io.on('connection' , socketEventHandler);

// Listner

server.listen(PORT , ()=> console.log(`server running at port ${PORT}`));
