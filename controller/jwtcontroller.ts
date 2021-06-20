import jwt from 'jsonwebtoken';
import { RoomJwtdata } from '../models';
import { ADMIN_SECRET, SECRET } from '../config'
import { NextFunction, Request, Response } from 'express';

export class JwtController{

    /*public static create( { roomName } : RoomJwtdata ) : string {
        return jwt.sign({ roomName } , SECRET! , {expiresIn : '6h'});
    }

    public static async verify(req : Request,res : Response, next : NextFunction){
        if(['/create','/join'].includes(req.path))return next();
        const authHeader =  req.headers['authorization'];
        if(authHeader){
            if(authHeader.split(/\s+/).length !== 2)
                return res.send({message : 'Invalid token'});
            const token = authHeader.split(/\s+/)[1];
            jwt.verify( token , SECRET! , (err , data)=>{
                if(err){
                    res.status(403).send();
                }else{
                    next();
                }
            });
        }else
            res.send({message : 'Invalid header'});
    }

    public static async verifyAdmin(req : Request,res : Response, next : NextFunction){
        const { token } = req.body;                            
        if(typeof token === "string"){
            jwt.verify( token , ADMIN_SECRET! , (err , data)=>{
                if(err){
                    res.status(403).send();
                }else{
                    next();
                }
            });
        }
    }*/
}