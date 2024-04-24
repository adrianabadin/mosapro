import {z} from "zod"

export const userSchema= z.object({
    username:z.string().email({message: "Debes proveer un email valido!"}),
    password:z.string().min(6,{message:"La contraseña debe tener al menos 6 letras"})

})
export type User = z.infer<typeof userSchema>
