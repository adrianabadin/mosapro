import {z} from "zod"
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