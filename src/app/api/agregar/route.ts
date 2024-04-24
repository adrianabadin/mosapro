import { prismaClient } from "@/services/db.service";
import { nanoid } from "nanoid";
import { returnPrismaError } from "../../../../prisma/prisma.errors";
import { logger } from '../../../services/logger';
import { googleService } from "@/services/google.service";
import {z} from "zod"
import { GoogleError } from "@/services/google.errors";
export const formSchema = z.object({
    driveId: z
      .string({
        invalid_type_error: "Debe ser una cadena",
      })
      .optional(),
    name: z.string({
      invalid_type_error: "Debe ser una cadena",
      required_error: "Debes proveer una cadena",
    }),
    lastName: z.string({
      invalid_type_error: "Debe ser una cadena",
      required_error: "Debes proveer una cadena",
    }),
    state: z.string({
      invalid_type_error: "Debe ser una cadena",
      required_error: "Debes proveer una cadena",
    }),
  
    place: z.string({
      invalid_type_error: "Debe ser una cadena",
      required_error: "Debes proveer una cadena",
    }),
    date: z.string().optional(),
    description: z.string({
      invalid_type_error: "Debe ser una cadena",
      required_error: "Debes proveer una cadena",
    }),
  });
  export type Form = z.infer<typeof formSchema>;
  
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
                    driveId:body.driveId,
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