import RabbitMQ from "../src/rabbitmq/pubsub" 




 
     
    (async ()=>{
        const client = RabbitMQ({
            uri: "amqp://user1:pass1@localhost:5672"
        })
        client.EventEmitter.on("sub-message",(msg)=>{

            console.log(msg)
         
        })
        await client.Sub("test_queue")
    })()
    

    
    
     
 

 
