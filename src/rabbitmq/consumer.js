 
 

export const simpleConsumer  =async (channel,options)=>{

    const q = await channel.assertQueue(options.queue,options) 
    console.log(q)

    return async (onMessage,options)=>{
        console.log(q.queue)
        console.log(onMessage)
        console.log(options)
        options = options || {}
        return await channel.consume(q.queue,onMessage,options)
    }


}




export const pubSubConsumer = async (channel,options)=>{
    console.log(options)
    await  channel.assertExchange(options.exchange.name,options.exchange.type,options)
    const assertResult = await channel.assertQueue("",{exclusive:true}) 
    channel.bindQueue(assertResult.queue,options.exchange.name,"")
    return async (onMessage) =>{

        return await channel.consume(assertResult.queue,onMessage,{noAck:true})
    }
}

export default  simpleConsumer