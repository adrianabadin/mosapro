import {Auth, google} from "googleapis"
import fs,{ createReadStream } from "fs"
import {nanoid} from "nanoid"
import { DuplicateSlideError, FileCreateError, GoogleError, StreamError, TemplateSlideMissing, UnknownGoogleError, UnlinkError } from './google.errors';
import { logger } from "./logger"
import { Form } from "@/app/components/Formulario";
import { Prisma } from "@prisma/client";
import { text } from "stream/consumers";
export class GoogleService {
     static authClient:Auth.GoogleAuth  |undefined

    constructor(){
        this.initiateService=this.initiateService.bind(this)
        this.getFile=this.getFile.bind(this)
        this.createSlides=this.createSlides.bind(this)
        this.publicPermisions=this.publicPermisions.bind(this)
        this.uploadFile=this.uploadFile.bind(this)
    }
    async initiateService(){
        //const datab= await fs.promises.readFile("./rsx.json", "utf8");
        const buff= JSON.parse(Buffer.from(process.env.data,"base64").toString("utf8"));	
        console.log(buff)
        const authClient= new google.auth.GoogleAuth({
            credentials:{
                client_email:buff.client_email,
                private_key:buff.private_key,
                
                
                
            },
            // keyFilename:"./rsx.json",
            scopes:
                [             
                "https://www.googleapis.com/auth/documents",'https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/presentations']})
        GoogleService.authClient =  authClient
    }
    async uploadFile (path:string){
        try{
            if (GoogleService.authClient === undefined) await this.initiateService()
            const drive = google.drive({version:"v3", auth:GoogleService.authClient})
            const response = await drive.files.create({
                requestBody:{mimeType:"image/jpeg",name:nanoid()},
                media:{body:createReadStream(path)}
        })
        if(response.status !==200) throw new FileCreateError(response)
        if (response.data === undefined || response.data===null || response.data.id === undefined || response.data.id === null)throw new FileCreateError(response)
        
        fs.promises.unlink(path).then().catch(error=>{throw new UnlinkError(error)
    })
        return response.data.id
    
    }catch(error){
        if (error instanceof UnlinkError) return error
        if(typeof error ==="object" && error !==null && "code" in error && error.code===1004) {
            logger.error({function:"GoogleService.uploadFile",error})
            return error as FileCreateError
        }else {
            logger.error({function:"GoogleService.uploadFile",error:new UnknownGoogleError(error)})
            return new UnknownGoogleError(error)}
    }
    
    }
    async publicPermisions(id:string){
        try{
            if (GoogleService.authClient === undefined) await this.initiateService()
                const drive = google.drive({version:"v3", auth:GoogleService.authClient})
            const response =await  drive.permissions.create({ fileId: id as string, requestBody: { role: 'writer', type: 'anyone' } })
            return  response.data.id
        }catch(e){
            logger.error({function:"GoogleService.publicPermisions",error:new UnknownGoogleError(e)})
            return new UnknownGoogleError(e)
        }
    }
    async getFile(id:string){
        try{
            if (GoogleService.authClient === undefined) await this.initiateService()
            const drive = google.drive({version:"v3", auth:GoogleService.authClient})
        const response = await drive.files.get({
            fileId:id,
            alt:"media"
        },{responseType:"stream"})
        if (response.status !==200) throw new UnknownGoogleError(undefined,"Request failed")
        return  new Promise((resolve,reject)=>{
            let buf:Buffer[]=[]
            let data:string
            response.data.on("data",(data)=>buf.push(data))
            response.data.on("error",(e)=>reject(new StreamError(e)))
            response.data.on("end",()=>{
                 data = Buffer.concat(buf).toString("base64")
                resolve(data)
            })
            
    })
        }catch(error){
            logger.error({function:"listFiles",error})
            return new UnknownGoogleError(error)
        }
    }
async createSlides(data:Prisma.FormularioCreateInput){
    try{
        if (GoogleService.authClient === undefined) await this.initiateService()
            const slides = google.slides({version:"v1",auth:GoogleService.authClient})
        const id="1poCyEiHao6uiZ8LbXiOpqCCnJc9K2gvPU0dkawb2IVs"
        const response= await slides.presentations.get({presentationId:id})
        //logger.error(response.data)
    if (response.data.slides !== undefined)
       {
        const slideId= response.data.slides[response.data.slides.length-1].objectId
        const images=response.data.slides[response.data.slides.length-1].pageElements?.filter(element=>element.image !== undefined).map(image=>image.objectId)
        console.log(images,"images")
        if (slideId === null || slideId === undefined) throw new TemplateSlideMissing()
        
            const request =[{duplicateObject:{objectId:slideId}}]
        const duplicatedSlide = await slides.presentations.batchUpdate({
            presentationId:id,
            requestBody:{requests:request},
        })
        if (duplicatedSlide.data.replies  !== undefined)   
            {   const newRequest =[
                {replaceImage:
                    (images !==undefined &&data.driveId !== undefined) 
                    ? {imageObjectId:images[1],url:`https://drive.google.com/uc?id=${'10qxqBupwpNXEIahaWNZ14eoL3h8JuihT'}`}
                    :undefined},
                {
                    replaceAllText:{
                        containsText:{text:"NAME"},
                        replaceText:`${data.name.toUpperCase()} ${data.lastname.toUpperCase()}`,
                        pageObjectIds: [slideId] }
                    },{
                        replaceAllText:{
                            containsText:{text:"PLACE"},
                            replaceText:`${data.place}`,
                            pageObjectIds: [slideId] }
                        },{
                            replaceAllText:{
                                containsText:{text:"STATE"},
                                replaceText:`${data.state}`,
                                pageObjectIds: [slideId] }
                            },{
                                replaceAllText:{
                                    containsText:{text:"DATE"},
                                    replaceText:`${data.date !== undefined ? data.date :""}`,
                                    pageObjectIds: [slideId] }
                                },{
                                replaceAllText:{
                                    containsText:{text:"DESCRIPTION"},
                                    replaceText:`${data.description !== undefined ? data.description : ""}`,
                                    pageObjectIds: [slideId] }
                                }]
                

 const updateSlides = await slides.presentations.batchUpdate({
    presentationId:id,
                    requestBody:{
                        requests:newRequest
                    }
                })
    return updateSlides
            }else  throw new DuplicateSlideError()
       
       }else throw new TemplateSlideMissing()
       
    }catch(error ){
        logger.error({function:"CreateSlide",error})
        if (error instanceof GoogleError) return error
        else return new UnknownGoogleError(error)
    
    }
}    
}

    export const googleService= new GoogleService()