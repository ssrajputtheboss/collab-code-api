import bcrypt from 'bcrypt';

export class CryptoController{
    public static async encode(text : string) : Promise<string>{
        return await bcrypt.hash(text , 7);
    }

    public static async verify(text:string , hashed:string) : Promise<boolean>{
        return bcrypt.compareSync(text , hashed );
    }
    
}