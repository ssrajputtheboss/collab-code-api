import * as fs from 'fs';
import { FILES_PATH, SNIPPET_PATH } from '../config';
import { join } from 'path';
import { Verifier } from '../utils';
import { NextFunction, Request, Response } from 'express';


export class FileSystemController{

    /*public static create(req:Request , res : Response , next : NextFunction){
        const { roomName, fname , snippetName } = req.body;
        if(!(roomName && fname)) return res.send({ message :"Invalid Credentials" });
        if(Verifier.isFile(fname)){
            if(!fs.existsSync(join(FILES_PATH,roomName)))
                fs.mkdirSync(join(FILES_PATH,roomName));
            if(fs.existsSync(join( FILES_PATH, roomName , fname)))
                return res.send({ message : 'File Already exists'});
            if(snippetName){
                const data = fs.readFileSync(join(SNIPPET_PATH,snippetName));
                fs.writeFileSync(join( FILES_PATH, roomName , fname) , data );
            }else
                fs.writeFileSync(join( FILES_PATH, roomName , fname) , ''  );
            return res.send({ message : 'success' });
        }else
            res.send({ message : 'Invalid extention' });
    }

    public static update(req:Request , res : Response , next : NextFunction){
        const { roomName, fname } = req.body;
        if(!(roomName && fname)) return res.send({ message :"Invalid Credentials" });
        if(Verifier.isFile(fname)){
            const data = fs.readFileSync( join( FILES_PATH, roomName , fname) ).toString();
            fs.writeFileSync( join( FILES_PATH, roomName , fname) , data );
            return res.send({ message : 'success' });
        }else
            res.send({ message : 'Invalid extention' });
    }

    public static delete(req:Request , res : Response , next : NextFunction){
        if(req.path !== '/delete' || req.method !== 'DELETE') return next();
        const { roomName } = req.body;
        if(!(roomName)) return res.send({ message :"Invalid Credentials" });
        if(!fs.existsSync(join(FILES_PATH,roomName))) return next();
        const files = fs.readdirSync(join(FILES_PATH,roomName));
        files.forEach(( 
            file:string ) => fs.unlinkSync(join(FILES_PATH,roomName,file)
        ));
        fs.rmdirSync(join(FILES_PATH,roomName));
        next();
    }

    public static deleteFile(req:Request , res : Response , next : NextFunction){
        const { roomName, fname } = req.body;
        if(!(roomName && fname)) return res.send({ message :"Invalid Credentials" });
        if(fs.existsSync(join( FILES_PATH, roomName, fname))){
            fs.unlinkSync(join( FILES_PATH, roomName, fname));
        }else
            res.send({ message : 'File doesn\'t exists' });
    }*/

    public static isFileExists(roomName : string, fname: string ):boolean{
        return fs.existsSync(join( FILES_PATH, roomName, fname));
    }

    public static getFileContent(roomName : string, fname: string ):string{
        return fs.readFileSync(join( FILES_PATH, roomName, fname)).toString();
    }

    public static createFile(roomName : string, fname: string , content : string ){
        fs.writeFileSync(join( FILES_PATH, roomName, fname) , content);
    }

}