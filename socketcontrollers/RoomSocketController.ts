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
            const userId = socket.id;
            const authData : RoomAuthData = data;
            if(RoomSocketController.verify(authData)){ 
                if(RoomSocketController.allRoomNames.includes(authData.roomName)){
                    socket.emit('create-res',{ message : 'Room Already Exists' , jwt : null });
                }else{
                    RoomSocketController.allRoomNames.push(authData.roomName);
                    RoomSchema.create({
                        roomName : authData.roomName ,
                        admin : userId,
                        pass : await CryptoController.encode(authData.password) ,
                        users : [ { userName : authData.userName , userId : userId } ]
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
            if( ! RoomSocketController.verify(authData) ) socket.emit('join-res',{ message : 'Invalid Credentials'});
            const room = await RoomSchema.findOne({
                roomName : authData.roomName
            });
            if(room === null) return socket.emit('join-res',{message : 'Room Not Found'});
            if(await CryptoController.verify( authData.password , room.pass )){
                room.users = [ { userName : authData.userName , userId : userId } , ...room.users ];
                room.save();
                socket.join([authData.roomName]);
                socket.broadcast.to(authData.roomName).emit('userlist',
                    {users : room.users.map((e:{userName : string , userId : string})=>e.userName)}
                );
                socket.emit('join-res',{
                    message : 'success', 
                    jwt : JwtSocketController.create({roomName : authData.roomName}) ,
                    files : FileSocketController.allFilesData(authData.roomName) ,
                    users : room.users.map((e:{userName : string , userId : string})=>e.userName)
                });
            }else{
                socket.emit('join-res',{ message : 'Authentication Failed' });
            }
        });
    }
    

    public static leave( socket : Socket ){
        socket.on('leave',async(data : any)=>{
            const userId = socket.id;
            const { roomName } = data;
            if(roomName){
                const room = await RoomSchema.findOne({
                    roomName : roomName
                });
                if(userId === room.admin){
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
                        (e:{userName : string , userId : string})=>(e.userId !== userId));
                    room.save();
                    socket.broadcast.to(roomName).emit('userlist',
                        {users : room.users.map((e:{userName : string , userId : string})=>e.userName) }
                    );
                    socket.leave(roomName);
                    socket.emit('leave-res',{ message : 'success'});
                }
            }else 
                socket.emit('leave-res' ,{ message : 'Invalid Credentials'});
        });
    }
}