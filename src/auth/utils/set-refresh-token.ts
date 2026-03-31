import { Response } from "express";

export const setRefreshToken = (res:Response,refreshToken:string,) => {
    res.cookie('refreshToken',refreshToken,{
        httpOnly : true,
        secure : true,
        sameSite : true
    })
}