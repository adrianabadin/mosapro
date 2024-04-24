import { authService } from "@/app/auth/auth.service"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { JsonWebTokenError,sign } from "jsonwebtoken"
import { PrismaError } from "../../../../prisma/prisma.errors"

export async function GET(req:NextRequest){
    const jwt= req.cookies.get("jwt")
    if (jwt === undefined) redirect("/login")
    const response = await authService.jwtLogin(jwt.value)
    if (response instanceof JsonWebTokenError) return redirect("/login")//new Response(JSON.stringify(response),{status:401})
    if (response instanceof PrismaError) return new Response(JSON.stringify(response),{status:500})
    const token = sign({id:response.id,date:new Date},"Grande Milei",{expiresIn:600})
    return new Response(JSON.stringify(response),{headers:{ 'Set-Cookie': `jwt=${token}` }})
}