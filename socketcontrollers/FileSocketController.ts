import * as fs from 'fs';
import { FILES_PATH, SNIPPET_PATH } from '../config';
import { join } from 'path';
import { Verifier } from '../utils';
import { Socket } from 'socket.io';
import { FileData } from '../models';

export class FileSocketController{

    public static create(socket : Socket){
        socket.on('createfile' , (data : any)=>{
            const { roomName, fname , snippetName } = data;
            if(!(roomName && fname)) return socket.emit('createfile-res',{ message :"Invalid Credentials" });
            if(Verifier.isFile(fname)){
                if(!fs.existsSync(join(FILES_PATH,roomName)))
                    fs.mkdirSync(join(FILES_PATH,roomName));
                if(fs.existsSync(join( FILES_PATH, roomName , fname)))
                    return socket.emit('createfile-res',{ message : 'File Already exists'});
                var content : string = '';
                if(snippetName){
                    const d = fs.readFileSync(join(SNIPPET_PATH,snippetName));
                    content = d.toString();
                    fs.writeFileSync(join( FILES_PATH, roomName , fname) , d );
                }else{
                    content = '';
                    fs.writeFileSync(join( FILES_PATH, roomName , fname) , ''  );
                }
                socket.broadcast.to(roomName).emit('createfile-res',
                { 
                    message : 'success',
                    files : FileSocketController.allFilesData(roomName)
                });
                //new
                socket.emit('createfile-res',
                { 
                    message : 'success',
                    files : FileSocketController.allFilesData(roomName)
                });
            }else
                socket.emit('createfile-res',{ message : 'Invalid extention' });
        });
    }

    public static update(socket : Socket){
        socket.on('updatefile',(data:any)=>{
            const { roomName, fname ,content } = data;
            if(!(roomName && fname && content!==undefined)) return socket.emit('updatefile-res',{ message :"Invalid Credentials" });
            if(Verifier.isFile(fname)){
                fs.writeFileSync( join( FILES_PATH, roomName , fname) , content );
                socket.broadcast.to(roomName).emit('updatefile-res',
                { 
                    message : 'success',
                    fname : fname ,
                    content : content
                });
            }else
                socket.emit('updatefile-res',{ message : 'Invalid extention' });
        })
    }

    public static forward(socket : Socket){
        socket.on('forward',(data:any)=>{
            const { roomName, fname , change} = data;
            if(!(roomName && fname && change)) return socket.emit('forward-res',{ message :"Invalid Credentials" });
            if(Verifier.isFile(fname)){
                socket.broadcast.to(roomName).emit('forward-res',
                { 
                    message : 'success',
                    fname : fname ,
                    change : change
                });
            }else
                socket.emit('forward-res',{ message : 'Invalid extention' });
        })
    }


    public static delete(data:any){
            const { roomName } = data;
            if(!(roomName)) return;
            if(!fs.existsSync(join(FILES_PATH,roomName))) return;
            const files = fs.readdirSync(join(FILES_PATH,roomName));
            files.forEach(( 
                file:string ) => fs.unlinkSync(join(FILES_PATH,roomName,file)
            ));
            fs.rmdirSync(join(FILES_PATH,roomName));
    }


    public static deleteFile(socket : Socket){
        socket.on('deletefile',(data:any)=>{
            const { roomName, fname } = data;
            if(!( roomName && fname )) return socket.emit('deletefile-res',{ message :"Invalid Credentials" });
            if(fs.existsSync(join( FILES_PATH, roomName, fname))){
                fs.unlinkSync(join( FILES_PATH, roomName, fname));
                socket.to(roomName).emit('deletefile-res',
                {
                    message : 'success',
                    fname : fname
                });
            }else
                socket.emit('deletefile-res',{ message : 'File doesn\'t exists' });
        });
    }

    public static allFilesData(roomName : string) : Array<FileData>{
        var arr : Array<FileData> = [];
        if(!fs.existsSync(join(FILES_PATH,roomName))) return arr;
        fs.readdirSync(join(FILES_PATH,roomName)).forEach((fname:string)=>{
            const  content = fs.readFileSync(join(FILES_PATH,roomName,fname)).toString();
            arr.push({
                fname : fname ,
                content : content
            });
        });
        return arr;
    }

    public static readContent(roomName:string,fname:string):string{
        return fs.readFileSync(join(FILES_PATH,roomName,fname)).toString();
    }
}