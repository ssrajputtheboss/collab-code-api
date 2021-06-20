import { NextFunction, Request, Response } from "express";
import { FILE_EXTENSIONS, PROCESS_TIMEOUT } from "../config";
import { Verifier } from "../utils";
import { FileSystemController } from "./fscontroller";
import { spawn , ChildProcessWithoutNullStreams } from "child_process";

export class RunnerController{
    public static runCode( req : Request, res : Response ){
        const {fname , input , roomName} = req.body;
        if(fname && input && roomName){
            if(FileSystemController.isFileExists(roomName,fname) && Verifier.isFile(fname)){
                const ext:string = FILE_EXTENSIONS.filter((e)=>fname.endsWith(e))[0].toLowerCase();
                if(ext === '.txt') return res.send({message :'cannot run text file'});
                const code = FileSystemController.getFileContent(roomName,fname);
                FileSystemController.createFile( roomName ,'in.txt' , input);
                var p : ChildProcessWithoutNullStreams | undefined;
                if(ext === '.py' )
                    p = spawn(
                        'python'
                        ,[fname,'<in.txt >out.txt'],{ detached : true });
                else if(ext === '.java'){
                    p = spawn(
                    'java',[fname.replace(ext,''),'<in.txt >out.txt'],{ detached : true });
                }else if(ext === '.cpp'){
                    p = spawn(
                        fname.replace(ext,'.exe'),['<in.txt >out.txt'],{ detached : true });
                } else if(ext === '.c'){
                    p = spawn(
                        fname.replace(ext,''),['<in.txt >out.txt'],{ detached : true });
                }
                setTimeout(function(){
                    if(p)
                        p.kill();
                },PROCESS_TIMEOUT);
            }else 
                res.send({message : 'Invalid file name'});
        }else 
            res.send({message : 'Invalid credentials'});
    }

    public static async compileCode( req : Request, res : Response ,next: NextFunction ){
        if(req.path !== '/exec') return next();
        const {fname , input , roomName} = req.body;
        if(fname && input && roomName){
            if(FileSystemController.isFileExists(roomName,fname) && Verifier.isFile(fname)){
                const ext:string = FILE_EXTENSIONS.filter((e)=>fname.endsWith(e))[0].toLowerCase();
                if(ext === '.txt') return res.send({message :'cannot run text file'});
                const code = FileSystemController.getFileContent(roomName,fname);
                FileSystemController.createFile( roomName ,'in.txt' , input);
                var p : ChildProcessWithoutNullStreams | undefined;
                if(ext === '.java')
                    p = spawn(
                        'javac'
                        ,[fname],{ detached : true });
                else if(ext === '.cpp'){
                    p = spawn(
                        'g++'
                        ,['-o' , fname.replace(ext,'') , fname],{ detached : true });
                } else if(ext === '.c'){
                    p = spawn(
                        'gcc'
                        ,[fname],{ detached : true });
                }
                setTimeout(function(){
                    if(p)
                        p.kill();
                },PROCESS_TIMEOUT);
                next();
            }else 
                res.send({message : 'Invalid file name'});
        }else 
            res.send({message : 'Invalid credentials'});
    }

    public static compileJava(){}
}