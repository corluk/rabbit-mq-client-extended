 
import { Buffer } from 'buffer';

 
export const simpleProducer =  async (channel,options ) =>{

    const queue = options.queue || ""
     

 
    
    await channel.assertQueue(queue,options)
    return async (message,options)=>{

        return await channel.sendToQueue(queue,Buffer.from(message),options)
    }
}

export const pubSubProducer = async (channel,options)=>{

    console.log(options)
    const exchangeResult = await channel.assertExchange(options.exchange.name,options.exchange.type,options)
    console.log(exchangeResult)
    return async (message,routingKey='')=>{

       return  channel.publish(exchangeResult.exchange,routingKey,Buffer.from(message))
    }
}
export default simpleProducer