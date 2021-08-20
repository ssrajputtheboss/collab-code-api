import { RoomAuthData, RoomCreateResponse } from "../models";
import { Verifier } from "../utils";
import { CryptoController } from "../controller";
import { RoomSchema } from '../models';
import { Socket } from "socket.io";
import { JwtSocketController } from "./JwtSocketController";
import { FileSocketController } from "./FileSocketController";
import { io } from "../app";

export class RoomSocketController{

    public static allRoomNames : Array<string> = [];


    public static verify( authData : RoomAuthData) : boolean{
        return Verifier.verifyAll(authData);
    }

    public static create( socket : Socket ) {
        socket.on('create' , async(data:any)=>{
            const authData : RoomAuthData = data;
            if(RoomSocketController.verify(authData)){ 
                if(RoomSocketController.allRoomNames.includes(authData.roomName)){
                    socket.emit('create-res',{ message : 'Room Already Exists' , jwt : null });
                }else{
                    RoomSocketController.allRoomNames.push(authData.roomName);
                    RoomSchema.create({
                        roomName : authData.roomName ,
                        admin : authData.userName,
                        pass : await CryptoController.encode(authData.password) ,
                        users : [ authData.userName ]
                    });
                    socket.emit('create-res',{ 
                        jwt : JwtSocketController.create({roomName : authData.roomName }) ,
                        message : 'success'
                    });
                    socket.join([authData.roomName]);
                    socket.broadcast.to(authData.roomName).emit('userlist',{users:[authData.userName]});
                    //new
                    socket.emit('userlist',{users:[authData.userName]});
                }
            }else{
                socket.emit('create-res',{ message :'Cannot create room invalid credentials'  });
            }
        });
    }


    public static join( socket : Socket ){
        socket.on('join',async(data)=>{
            const userId = socket.id;
            const authData : RoomAuthData = data; 
            if( ! RoomSocketController.verify(authData) ) return socket.emit('join-res',{ message : 'Invalid Credentials'});
            const room = await RoomSchema.findOne({
                roomName : authData.roomName
            });
            if(room === null) return socket.emit('join-res',{message : 'Room Not Found'});
            else if(room.users.includes(authData.userName)) return socket.emit('join-res',{message : 'Username taken by someone in the room'});       
            if(await CryptoController.verify( authData.password , room.pass )){
                room.users = [ authData.userName , ...room.users ];
                room.save();
                socket.join([authData.roomName]);
                socket.broadcast.to(authData.roomName).emit('userlist',
                    {users : room.users}
                );
                socket.emit('join-res',{
                    message : 'success', 
                    jwt : JwtSocketController.create({roomName : authData.roomName}) ,
                    files : FileSocketController.allFilesData(authData.roomName) ,
                    users : room.users
                });
            }else{
                socket.emit('join-res',{ message : 'Authentication Failed' });
            }
        });
    }

    public static rejoin(socket: Socket){
        socket.on('rejoin' , async(data:any)=>{
            const { token,roomName,userName } = data;
            if(Verifier.isToken(token) && Verifier.isRoom(roomName)&& Verifier.isUser(userName)){
                // token has already been verified in middleware
                const room = await RoomSchema.findOne({
                    roomName : roomName
                });
                if(room == null) return socket.emit('rejoin-res',{ message: "room doesn't exists" });
                if(room.users.includes(userName)){
                    socket.join([roomName]);
                    socket.emit('rejoin-res',{ message: 'success'});
                }else
                    socket.emit('rejoin-res',{ message: 'can not find user in mentioned room' });
            }else
                socket.emit('rejoin-res',{ message: 'Invalid credentials'});
        });
    }
    

    public static leave( socket : Socket ){
        socket.on('leave',async(data : any)=>{
            const { roomName,userName } = data;
            if(roomName && userName){
                const room = await RoomSchema.findOne({
                    roomName : roomName
                });
                if(userName === room.admin){
                    RoomSocketController.allRoomNames.splice(RoomSocketController.allRoomNames.indexOf(roomName));
                    RoomSchema.deleteMany({
                        roomName : roomName
                    },(err)=>{if(err)console.log(err)});
                    FileSocketController.delete(data);
                    socket.broadcast.to(roomName).emit('leave-res',{message:'success'});
                    socket.leave(roomName);
                    socket.emit('leave-res',{ message : 'success'});
                }else{
                    room.users = room.users.filter(
                        (un : string)=>(userName !== un));
                    room.save();
                    socket.broadcast.to(roomName).emit('userlist',
                        {users : room.users }
                    );
                    socket.leave(roomName);
                    socket.emit('leave-res',{ message : 'success'});
                }
            }else 
                socket.emit('leave-res' ,{ message : 'Invalid Credentials'});
        });
    }
}