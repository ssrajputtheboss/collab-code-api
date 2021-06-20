import { FILE_EXTENSIONS } from "../config";
import { RoomAuthData } from "../models";

export class Verifier{
    public static isPass(pass:string) :boolean {
        return typeof pass === 'string' && pass.length >=6 && pass.length <= 20 ? true : false;
    }

    public static isRoom(room:string) : boolean{
        return typeof room === 'string' && room.length >= 6;
    }

    public static isUser(user:string) : boolean{
        return typeof user === 'string' && user.length >=4;
    }

    public static isToken(token : string) : boolean {
        return true;
        //return typeof token === 'string' && /.+\..+\..+/ig.exec(token) != null;
    }

    public static isFile(fname:string):boolean{
        return (FILE_EXTENSIONS.filter((ext:string)=>{
            return fname.endsWith(ext);
        }).length === 1);
    }

    public static verifyAll(authData : RoomAuthData){
        return Verifier.isPass(authData.password)
            && Verifier.isRoom(authData.roomName)
            && Verifier.isUser(authData.userName)
            && Verifier.isToken(authData.token!);
    }
}