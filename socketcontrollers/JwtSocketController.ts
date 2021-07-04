import jwt from 'jsonwebtoken';
import { RoomJwtdata } from '../models';
import { ADMIN_SECRET, SECRET } from '../config'
import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export class JwtSocketController{

    public static create( { roomName } : RoomJwtdata ) : string {
        return jwt.sign({ roomName } , SECRET! , {expiresIn : '6h'});
    }

    public static async verify( e: any[] , next : (err?: ExtendedError | undefined) => void){
        const ename : string = e[0];
        if(['create','join'].includes(ename)) next();
        else{
            const { token ,roomName } : {token : string |undefined , roomName : string | undefined} = e[1];
            if(token && roomName){
                jwt.verify( token , SECRET! , (err , data : any)=>{
                    if(err){
                        return;
                    }else{
                        if(data.roomName === roomName){
                            next();
                        }else 
                            return;
                    }
                });
            }
        }
    }

    public static verifyAdmin(socket : Socket , next : (err?: ExtendedError | undefined) => void){
        const token : string | undefined = socket.handshake.headers.authorization;                            
        if(token){
            jwt.verify( token , ADMIN_SECRET! , (err , data)=>{
                if(err){
                    return;
                }else{
                    next();
                }
            });
        }
    }
}