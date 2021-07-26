import Channel from "./channel";
import {simpleProducer} from "./producer"
import {simpleConsumer} from "./consumer"
import { EventEmitter } from "events";

const setup = (config,defaultConfig)=>{

    config = {...defaultConfig,...config} 
    if(!config.rabbitmq_uri){
        config.rabbitmq_uri = process.env.RABBITMQ_URI
    }
    
     
    if(!config.serializer){
        config.serializer = (msg)=> JSON.stringify(msg)
    }
    if(!config.deserializer){
        config.deserializer = (msg)=> JSON.parse(msg)
    }
    return config
}

export default (config)=>{ 
const eventEmitter = new EventEmitter() 

const pub =   async  (msg,queue,options={})=>{

         
        config = setup(config,{autoDisconnect:true })   
        const {channel,disconnect} = await Channel(config.rabbitmq_uri)

        const producer=   await simpleProducer(channel,{...{
            queue: queue,  
            durable:true},...{options}
            })
        
        eventEmitter.emit("pub-pre-publish", msg,channel) 
        const isSent = await producer(config.serializer(msg)) 
        eventEmitter.emit("pub-post-publish", msg,isSent,channel)
        if(config.autoDisconnect==true){
                disconnect(2)
            }
             
         
        
}   

const sub = async (queue,options={})=>{

     

    config = setup(config,{})
    const {channel,disconnect} = await Channel(config.rabbitmq_url)
   
    
   

        const consumer = await simpleConsumer(channel,{...{
                queue: queue,
                durable : true 
            },...{options}})
        const onMessage = (msg)=>{
            const msg_deserialized = config.deserializer(msg.content)
            if(config.ack==true){
                channel.ack(msg)
            }
            
            eventEmitter.emit("sub-pre-message",msg,msg_deserialized,channel,disconnect)
            eventEmitter.emit("sub-on-message",msg,msg_deserialized,channel,disconnect)
            eventEmitter.emit("sub-message",msg_deserialized)
            eventEmitter.emit("sub-post-message",msg,msg_deserialized,channel,disconnect) 
        }

        eventEmitter.emit("sub-pre-connection",channel,disconnect)
        await consumer(onMessage)
        eventEmitter.emit("sub-post-connection",channel,disconnect)
   


}
        return  {EventEmitter:eventEmitter,Pub:pub,Sub:sub}  
}
 