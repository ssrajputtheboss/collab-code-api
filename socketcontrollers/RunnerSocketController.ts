import { FILES_PATH, FILE_EXTENSIONS, PROCESS_TIMEOUT } from "../config";
import { Verifier } from "../utils";
import { Socket } from 'socket.io';
import { join } from 'path';
import { c, cpp, java , python } from "compile-run";

export class RunnerSocketController{

    public static run(socket:Socket){
        
        socket.on('run',(data:any)=>{
            const { roomName,fname,input } = data;
            if(fname && input!==undefined && roomName){
                if(!Verifier.isFile(fname))
                    socket.emit('run-res',{
                        message : 'Invalid extention',
                        result:{}
                    });
                const ext = FILE_EXTENSIONS.filter((e)=>fname.endsWith(e))[0].toLowerCase();
                let executor : typeof c | typeof java | typeof python | typeof cpp|null;
                let cpath : undefined|string;
                switch(ext){
                    case '.py':
                        cpath='python3';
                        executor=python;break;
                    case '.java':
                        executor=java;break;
                    case '.cpp':
                        executor=cpp;break;
                    case '.c':
                        executor=c;break;
                    default:
                        executor = null;
                }
                if(!executor){
                    socket.emit('run-res',{
                        message:'Cannot execute text file',
                        result:{}
                    });
                }else{
                    const p = executor.runFile(join(FILES_PATH,roomName,fname),
                    {
                        stdin: input,
                        timeout: PROCESS_TIMEOUT,
                        executionPath: cpath
                    }
                    );
                    p.then(result=>socket.emit('run-res',{
                        message : 'success',
                        result: result
                    })
                    ).catch(err=>socket.broadcast.to(roomName).emit('run-res',{
                        message : 'Execution Failed',
                        result : {}
                    })
                    );
                }
            }else {
                socket.emit('run-res',{message:'Invalid credentials'});
            }
        });
    }
}