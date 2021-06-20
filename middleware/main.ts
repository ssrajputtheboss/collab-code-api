import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.use((req : Request , res : Response)=>{
    res.end("api");
});

export const middleware = router;