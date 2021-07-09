import { 
    FILES_PATH, 
    FILE_EXTENSIONS, 
    PROCESS_TIMEOUT, 
    JAVA_BLOCKLIST, 
    PYTHON_BLOCKLIST, 
    C_BLOCKLIST, 
    CPP_BLOCKLIST
} from "../config";
import { Verifier } from "../utils";
import { Socket } from 'socket.io';
import { join } from 'path';
import { c, cpp, java , python } from "compile-run";
import { FileSocketController } from "./FileSocketController";

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
                const content = FileSocketController.readContent(roomName,fname);
                let msg:string='';
                switch(ext){
                    case '.py':
                        msg = RunnerSocketController.pyCheck(content)
                        if(msg){
                            socket.emit('run-res',{
                                message : msg
                            })
                            return;
                        }
                        cpath='python3';
                        executor=python;break;
                    case '.java':
                        msg = RunnerSocketController.javaCheck(content)
                        if(msg){
                            socket.emit('run-res',{
                                message : msg
                            })
                            return;
                        }
                        executor=java;break;
                    case '.cpp':
                        msg = RunnerSocketController.cppCheck(content)
                        if(msg){
                            socket.emit('run-res',{
                                message : msg
                            })
                            return;
                        }
                        executor=cpp;break;
                    case '.c':
                        msg = RunnerSocketController.cCheck(content)
                        if(msg){
                            socket.emit('run-res',{
                                message : msg
                            })
                            return;
                        }
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
                    ).catch((err:any )=>socket.broadcast.to(roomName).emit('run-res',{
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

    public static cCheck(code:string):string{
        const m = code.match(/[a-zA-Z_]+/g);
        if(m){
            for( let s of C_BLOCKLIST){
                if(m.includes(s))
                    return `Use of ${s} is not allowed , remove and try again!`;
            }
        }
        return '';
    }
    
    public static cppCheck(code:string):string{
        const m = code.match(/[a-zA-Z_]+/g);
        if(m){
            for( let s of CPP_BLOCKLIST){
                if(m.includes(s))
                    return `Use of ${s} is not allowed , remove and try again!`;
            }
        }
        return '';
    }

    public static javaCheck(code:string):string{
        for( let s of JAVA_BLOCKLIST){
            if(code.match( new RegExp( s.replace('.','\\s*\\.\\s*') ) ))
                return `Use of ${s} is not allowed , remove and try again!`;
        }
        return '';
    }

    public static pyCheck(code:string):string{
        const m = code.match(/[a-zA-Z_]+/g);
        if(m){
            for( let s of PYTHON_BLOCKLIST){
                if(m.includes(s))
                    return `Use of ${s} is not allowed , remove and try again!`;
            }
        }
        return '';
    }
}