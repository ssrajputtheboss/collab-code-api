/*import { Request, Response } from "express";
import { RoomAuthData } from "../models";
import { Verifier } from "../utils";
import { JwtController } from "./jwtcontroller";
import { CryptoController } from ".";
import RoomSchema from '../models/db';

export class RoomAuthController{


    public static allRoomNames : Array<string> = [];


    public static verify( authData : RoomAuthData) : boolean{
        return Verifier.verifyAll(authData);
    }

    public static async create( req : Request, res : Response ){
        const authData : RoomAuthData = req.body;
        if(RoomAuthController.verify(authData)){
            if(RoomAuthController.allRoomNames.includes(authData.roomName)){
                res.send({message : 'A room with given name already exists'});
            }else{
                RoomAuthController.allRoomNames.push(authData.roomName);
                RoomSchema.create({
                    roomName : authData.roomName ,
                    pass : await CryptoController.encode(authData.password) ,
                    users : [ authData.userName ]
                });
                res.send({ 
                    jwt : JwtController.create({roomName : authData.roomName}) ,
                    message : 'success'
                });
            }
        }else{
            res.send({ message :'Cannot create room invalid credentials' });
        }
    }


    public static async join( req : Request, res : Response ){
        const authData : RoomAuthData = req.body; 
        if(!RoomAuthController.verify(authData))   return res.send({ message : 'Invalid Credentials'});
        const room = await RoomSchema.findOne({
            roomName : authData.roomName
        });
        if(room === null) return res.send({message : 'Room Not Found'});
        if(await CryptoController.verify( authData.password , room.pass )){
            await RoomSchema.updateOne({
                roomName : room.roomName ,
                users : [ authData.userName , ...room.users ]
            });
            res.send({
                message : 'success', 
                jwt : JwtController.create({roomName : authData.roomName}) 
            });
        }else{
            res.send({ message : 'Authentication Failed' });
        }
    }
    

    public static delete( req : Request, res : Response ){
        const { roomName } = req.body;
        if(roomName){
            RoomSchema.deleteOne({
                roomName : roomName
            });
            res.send({ message : 'success' });
        }else res.send({ message : 'Invalid Credentials'});
    }
}*/