import { authService } from "@/app/auth/auth.service";
import { User } from "@/app/auth/auth.schema";
import { AuthError } from "@/app/auth/auth.errors";
import { PrismaError } from "../../../../prisma/prisma.errors";
import jwt from "jsonwebtoken"
export async function POST(req:Request){
    const body:User=await req.json()
    console.log(body)
    const response = await authService.signUp(body)
    console.log(response)
    if (response instanceof AuthError) return new Response(JSON.stringify(response),{status:404})
    if (response instanceof PrismaError) return new Response(JSON.stringify(response),{status:500})
    const token =  jwt.sign({id:response.id,date:new Date},"Grande Milei",{expiresIn:600})

return new Response(JSON.stringify(response),{status:200,headers:{ 'Set-Cookie': `jwt=${token}` }})


}