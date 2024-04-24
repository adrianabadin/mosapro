
import fs from "fs"
import { nanoid } from "nanoid";
import { googleService } from "@/services/google.service";
import { DownloadFile, GoogleError, MissingFile } from "@/services/google.errors";
export const dynamic = 'force-dynamic' // defaults to auto

export async function POST  (req:Request){
    const formData =await req.formData()
    const image=formData.get("photo")
    const id = nanoid()
    try{
    if (image !==null && image instanceof File) {
     
      const buffer=  Buffer.from(await image.arrayBuffer())

      await fs.promises.writeFile("./public/"+id+".jpeg",buffer)
      if (!fs.existsSync("./public/"+id+".jpeg")) throw new DownloadFile()
      const response =await googleService.uploadFile("./public/"+id+".jpeg")
    console.log(response,"subir a drive")
      if (response instanceof GoogleError || typeof response !=="string") throw response
     else { 
      const permisionsResponse = await googleService.publicPermisions(response)
     console.log(permisionsResponse,"subir permisos")
      if (permisionsResponse instanceof GoogleError || typeof permisionsResponse !=="string") throw permisionsResponse
    return Response.json({driveId:response})
    }  
    } else throw new MissingFile()
    
    
    return new Response("Image downloaded: "+id+".jpeg")
  }catch(e){
    return new Response(JSON.stringify(e),{status:500})
  }
}