import { Socket } from "socket.io";
import { FileSocketController, JwtSocketController, RoomSocketController } from "../socketcontrollers";
import { io } from "../app";

export const socketEventHandler = (socket : Socket)=>{

    console.log('user connected');

    socket.use(JwtSocketController.verify);

    socket.once('test',(data:any)=>{
        const {roomName} = data;
        io.to(roomName).emit('test-res',{messsage:'success'});
    });
    
    RoomSocketController.create(socket);

    RoomSocketController.join(socket);

    RoomSocketController.leave(socket);

    FileSocketController.create(socket);

    FileSocketController.update(socket);

    FileSocketController.deleteFile(socket);

    socket.on('disconnect' , ()=>{
        console.log('disconnected');
    });
}