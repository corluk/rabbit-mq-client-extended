import amqp from "amqplib" 
 

export default async (url)=>{


    const conn = await amqp.connect(url)
    const channel = await conn.createChannel()
    const disconnect = (second=1)=> {

        setTimeout(async()=>{
            await channel.close()
            await conn.close()
        },1000 * second)
    }
    return {channel,disconnect}
}