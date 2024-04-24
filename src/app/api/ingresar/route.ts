import { AuthError } from "@/app/auth/auth.errors"
import { User } from "@/app/auth/auth.schema"
import { authService } from "@/app/auth/auth.service"
import { PrismaError } from "../../../../prisma/prisma.errors"
import jwt from "jsonwebtoken"
export async function POST (req:Request){
    const body:User= await req.json()
    const response = await authService.signIn(body)
    if (response instanceof AuthError) return new Response(JSON.stringify(response),{status:404})
    if (response instanceof PrismaError) return new Response(JSON.stringify(response),{status:500})
    const token =  jwt.sign({id:response.id,date:new Date},"Grande Milei",{expiresIn:600})
    return new Response(JSON.stringify(response),{status:200,headers:{ 'Set-Cookie': `jwt=${token}` }})
}