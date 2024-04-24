import { ListItem } from "@material-tailwind/react"
import {PrismaClient} from "@prisma/client"
import { nanoid } from "nanoid"

export const prismaClient= new PrismaClient().$extends({
    query:{
        $allModels:{
        async  create({args,query}){
            args.data={...args.data,id:nanoid()}
            return await query(args)
        },
       
    }}
})
