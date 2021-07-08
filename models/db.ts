import {Schema,model} from 'mongoose';

const roomSchema = new Schema({
    roomName : String ,
    pass :  String ,
    admin : String,
    users : [],
    startTime : {
        type : Date ,
        default : Date.now()
    }
});

export const RoomSchema = model('RoomSchema', roomSchema);