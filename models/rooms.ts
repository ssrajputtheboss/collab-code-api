interface RoomBaseData{
    roomName : string 
}

export interface RoomAuthData extends RoomBaseData{
    token? : string ,
    userName : string ,
    password : string
}

export interface RoomJwtdata extends RoomBaseData{
    
}