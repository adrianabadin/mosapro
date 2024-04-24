import { prismaClient } from "@/services/db.service";
import { Prisma } from "@prisma/client";
import { returnPrismaError, UserExistError } from "../../../prisma/prisma.errors";
import { logger } from "@/services/logger";
import argon2 from "argon2"
import { nanoid } from "nanoid";
import { userAgent } from "next/server";
import { AuthError, LoginCredentials, UserDoesntExists, WrongPassword } from './auth.errors';
import { User, userSchema } from "./auth.schema";
import jwt from "jsonwebtoken"
export class AuthService {
    constructor(protected prisma = prismaClient){
        this.signUp=this.signUp.bind(this)
        this.signIn=this.signIn.bind(this)
        this.jwtLogin=this.jwtLogin.bind(this)
    }

    async signUp(user:User){
        try{
            const result= userSchema.safeParse(user)
            if (!result.success) {
                let errors:string[]=[""]
                result.error.issues.forEach(issue=>errors.push(`${issue.path} : ${issue.message}`))
                throw new LoginCredentials(result.error.issues,errors.join("\n"))
            }
            const userFinded = await this.prisma.users.findUnique({where:{username:user.username}})
            if (userFinded !== null) throw new UserExistError()
            const response = await this.prisma.users.create({data:{username:user.username,password:await argon2.hash(user.password),id:nanoid()}})
            return response
        }catch(e){
            let error
            if (e instanceof AuthError)  error = e
            else error = returnPrismaError(e as Error)
            logger.error({function:"AuthService",error})
            return error
        }
    }
    async signIn (user:User){
        try{
            const result= userSchema.safeParse(user)
            if (!result.success) {
                let errors:string[]=[""]
                result.error.issues.forEach(issue=>errors.push(`${issue.path} : ${issue.message}`))
                throw new LoginCredentials(result.error.issues,errors.join("\n"))
            }
            const userResponse= await this.prisma.users.findUnique({where:{username:user.username}})
            if (userResponse === null) throw new UserDoesntExists()
            if (await argon2.verify(userResponse.password,user.password)){
                return userResponse
            }else throw new WrongPassword()
        }catch(e){
            if (e instanceof AuthError) {
                logger.error({function:"signIn",error:e})
                return e}
                const error = returnPrismaError(e as Error)
                logger.error({function:"signIn",error})
                return error


        }
    }
    async jwtLogin(token:string){
        try{
            const payload = jwt.verify(token,"Grande Milei")
            if (payload instanceof jwt.TokenExpiredError || payload instanceof jwt.JsonWebTokenError|| payload instanceof jwt.NotBeforeError) throw payload
            if (typeof payload === "object"&&  "id" in payload )
            {
                const response = await this.prisma.users.findUnique({where:{id:payload.id as string}})
                if (response === null) throw new UserDoesntExists()
                return response
        }else throw new jwt.JsonWebTokenError("ID no encontrado")
        }catch(e){
            let error
            if (e instanceof jwt.TokenExpiredError || e instanceof jwt.JsonWebTokenError||e instanceof jwt.NotBeforeError) error = e
            else error= returnPrismaError(e as Error)
            logger.error({function:"JWTLogin",error})
            return error
    }
}}

export const authService = new AuthService()