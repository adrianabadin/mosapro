import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {z} from "zod"
import { Form } from "@/app/components/Formulario";


const dotenvSchema = z.object({
    NEXT_PUBLIC_BACKURL:z.string().url()
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
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:3000/api",credentials:"include",mode:"same-origin"}),
        tagTypes:[],refetchOnMountOrArgChange:true,
    endpoints:(builder)=>({
        uploadPhoto:builder.mutation<{driveId:string},FormData>({
            query:(body)=>({
            url:`/subir`,
            method: 'POST',      
            body,     
        })
    }),
    addForm:builder.mutation<{id:string},Form>({
        query:(body)=>({
            url:'/agregar',
            method: 'POST',
            body
        })
    }),
    login:builder.mutation<LoginResponse,Login>({
        query:(body)=>({
            url:"/ingresar",
            method:"POST",
            body,
        })
    }),
    jwt:builder.query<any,undefined>({
        query:(undefined)=>({
            url:"/jwt",
            method:"GET"
        })
    })
})
});

export const {useJwtQuery,useUploadPhotoMutation,useAddFormMutation,useLoginMutation} = apiSlice