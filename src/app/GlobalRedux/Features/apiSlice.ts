import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {z} from "zod"
import { Form } from "@/app/components/Formulario";
import { logger } from "@/services/logger";
import dotenv from "dotenv"
dotenv.config()
const dotenvSchema = z.object({

DATABASE_URL:z.string(),
ORIGIN:z.string(),
data:z.string(),
type:z.string(),
project_id:z.string(),
private_key_id:z.string(),
private_key:z.string(),
client_email:z.string(),
client_id:z.string(),
auth_uri:z.string(),
token_uri:z.string(),
auth_provider_x509_cert_url:z.string(),
client_x509_cert_url:z.string(),
universe_domain:z.string(),
})
declare global{
    namespace NodeJS{
        interface ProcessEnv extends z.infer<typeof dotenvSchema>{} 
    }
}
/*************************
 * SCHEMAS
 *************************/

export const loginSchema= z.object({
    username:z.string().email({message: "Debes proveer un email valido!"}),
    password:z.string().min(6,{message:"La contraseña debe tener al menos 6 letras"})
    
})

/**
 * TYPES
 */
export type Login=z.infer<typeof loginSchema>
export type LoginResponse = Login & {isAdmin:boolean}
export const apiSlice=createApi({
    reducerPath: "api",
    baseQuery:fetchBaseQuery({baseUrl:process.env.ORIGIN,credentials:"include",mode:"same-origin"}),
        tagTypes:[],refetchOnMountOrArgChange:true,
    endpoints:(builder)=>({
        uploadPhoto:builder.mutation<{driveId:string},FormData>({
            query:(body)=>({
            url:`/api/subir`,
            method: 'POST',      
            body,     
        })
    }),
    addForm:builder.mutation<{id:string},Form>({
        query:(body)=>({
            url:'/api/agregar',
            method: 'POST',
            body
        })
    }),
    login:builder.mutation<LoginResponse,Login>({
        query:(body)=>({
            url:"/api/ingresar",
            method:"POST",
            body,
        })
    }),
    jwt:builder.query<any,undefined>({
        query:(undefined)=>({
            url:"/api/jwt",
            method:"GET"
        })
    })
})
});

export const {useJwtQuery,useUploadPhotoMutation,useAddFormMutation,useLoginMutation} = apiSlice