import { prismaClient } from "@/services/db.service";
import { nanoid } from "nanoid";
import { returnPrismaError } from "../../../../prisma/prisma.errors";
import { logger } from '../../../services/logger';
import { googleService } from "@/services/google.service";
import {z} from "zod"
import { GoogleError } from "@/services/google.errors";
import { Form, formSchema } from "./add.schemas";

  
export async function POST(req:Request){
try{
    const body:Form=await req.json()
    const result =formSchema.safeParse(body)
    if (!result.success) {
        let error:string[]=[""]
        result.error.issues.forEach(issue=>error.push(`${issue.path}: ${issue.message}`))
        return new Response(error.join("\n"),{status:404,statusText:"Parametros incompletos"})
    }else{
        const response = await prismaClient.formulario.create(
            {data:
                {
                    date:body.date,
                    description:body.description,
                    driveId:'10qxqBupwpNXEIahaWNZ14eoL3h8JuihT',
                    lastname:body.lastName,
                    name:body.name,
                    place:body.place,
                    state:body.state,id:nanoid()}
                })
                const slideResponse = await googleService.createSlides(response)
                if (slideResponse instanceof GoogleError) return new Response (JSON.stringify(slideResponse),{status:500})
            return new Response(JSON.stringify(response),{status:200})
    }

}catch(e){
    const error= returnPrismaError(e as Error)
    logger.error({function:"Agregar form",error})
    return new Response(JSON.stringify(error),{status:500})

}
}