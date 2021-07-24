import amqp from "amqplib" 
import { Buffer } from 'buffer';

const setupOptions = (options)=>{
    if(!options){
        options = {}
    }
    const queueOptions = options.queueOptions || {}
    return {
        queueOptions: queueOptions, 
        publishOptions : {...queueOptions, ...(options.publishOptions || {})},
        consumeOptions :  {...queueOptions, ...(options.consumeOptions || {})},
        exchangeOptions : {...queueOptions,...(options.exhangeOptions || {})}
    }
}

export default async (url)=>{ 


    const connection = await amqp.connect(url) 
    
   
    return async  (channelName,options,preMessage)=>{
        const   QueueOptions =  setupOptions(options)
        const channel =   await connection.createChannel(channelName) 
        const preMessageFn = preMessage ||   ((message) => { 
            console.log(`message : ${JSON.stringify(message)}`)    
            return Buffer.from(JSON.stringify(message))
        
        })

        const consume = async ( onMessage,options={})=>  await  channel.consume(channelName,onMessage, {...QueueOptions.consumeOptions,...options})
         
        //await channel.assertQueue(channelName,{...QueueOptions.queueOptions,...options})
        return {
            connection : connection,
            channel : channel , 
            assertQueue : async (options)=>{

                const _channelName = options.channelName|| channelName 
                return await channel.assertQueue(_channelName,{...QueueOptions.queueOptions,...options})
            },
            sendToQueue  : async (message,options)=>{
                   
                   return  await  channel.sendToQueue(channelName,preMessageFn(message),{ ...options,...QueueOptions.publishOptions})
            },
            exchange  : async(exchangeName,type,options)=>{
                const exchangeOptions = {...QueueOptions.exchangeOptions,...options}

               const exchangeResult=  await channel.assertExchange(exchangeName,type,exchangeOptions)
               console.log("exhange result") 
               console.log(exchangeResult)
                return {
                    publish :async  (message,routingKey,options)=>  {
                            
                          return  await  channel.publish(exchangeName,routingKey,preMessageFn(message),{...exchangeOptions,...options})
                          // return await channel.publish(preMessageFn(message),routingKey,{...exchangeOptions, ...options})
                    }, 
                    consume : async ( pattern = "") =>{
                        const exchangeChannel = await channel.assertExchange(exchangeResult.exchange,type,{exclusive:true})
                       console.log(`exchangeChannel :${exchangeChannel}`)
                        await channel.bindExchange(exchangeChannel.query,exchangeName,pattern)
                        return consume
                    }
                }
            },

            consume :   consume ,
            closeConnection :  ()=>{
                return  connection.close()
            },
            setPrefetch: (number)=>{
                channel.prefetch(number)

            } 

        }
    }
    
     

}