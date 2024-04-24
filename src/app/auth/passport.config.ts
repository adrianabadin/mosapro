import { logger } from "@/services/logger"
import passport, { DoneCallback } from "passport"
import {Strategy} from "passport-local"
import {ExtractJwt,Strategy as JWTStrategy} from "passport-jwt"
import jwt from "jsonwebtoken"
import { prismaClient } from '../../services/db.service';
import { CreateUserError, notFound, NotFoundError, returnPrismaError, UserExistError } from "../../../prisma/prisma.errors";
import { nanoid } from "nanoid";

passport.use("jwt",new JWTStrategy({
    jwtFromRequest:ExtractJwt.fromBodyField("jwt"),secretOrKey:"Aguante Milei"

},async(payload:any,done:(...args:any)=>void)=>{
    try{
        const response = await prismaClient.users.findUnique({where:{id:payload.sub}})
        if (response === null ) throw new NotFoundError("User not found")
        done(null,response)
    }catch(err){
const error= returnPrismaError(err as Error)
logger.error({function:"jwtLogin",error})
done(error,false)
    }
}) )
passport.use("login",new Strategy(async (username:string,password:string,done:(...args:any)=>void)=>{
try{
    const user = await prismaClient.users.findUnique({where:{username}})
    if (user === null) throw new NotFoundError()
    else {
done(null,user)}
}catch(err){logger.error({function:"Login",error:err})}
}

))

passport.use("signup",new Strategy(async (username:string,password:string,done:(...args:any)=>void)=>{
    try{
        const user = await prismaClient.users.findUnique({where:{username}})
        if (user === null) {
            const response = await prismaClient.users.create({data:{username,password,id:nanoid()}})
            if (response === null) throw new CreateUserError()
            else done(null,response)
        }else throw new UserExistError()
    }catch(err){
        const error= returnPrismaError(err as Error)
        logger.error({function:"Login",error})
        done(error,false)
    }
}
))
passport.serializeUser((user:any,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async (id:string,done)=>{
try{
    const user= await prismaClient.users.findUnique({where:{id}})
    done(null,user)
}catch(err){
    const error=returnPrismaError(err as Error)
    logger.error({function:"deserializeUser",error})
    done(error,false)
}
})
export default passport
