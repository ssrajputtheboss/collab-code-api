import { Socket } from "socket.io";
import { FileSocketController, JwtSocketController, RoomSocketController } from "../socketcontrollers";
import { io } from "../app";
import { RunnerSocketController } from "../socketcontrollers/RunnerSocketController";

export const socketEventHandler = (socket : Socket)=>{

    socket.use(JwtSocketController.verify);

    RoomSocketController.create(socket);

    RoomSocketController.join(socket);

    RoomSocketController.rejoin(socket);

    RoomSocketController.leave(socket);

    FileSocketController.create(socket);

    FileSocketController.update(socket);

    FileSocketController.forward(socket);

    RunnerSocketController.run(socket);

    FileSocketController.deleteFile(socket);

    socket.on('disconnect' , ()=>{
        console.log('disconnected');
    });
}