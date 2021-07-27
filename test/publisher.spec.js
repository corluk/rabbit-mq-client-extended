import RabbitMQ from "../src/rabbitmq/pubsub" 


const client = RabbitMQ({
    uri: "amqp://user1:pass1@localhost:5672"
})


test("01",async()=>{ 
     
    (async ()=>{

        await client.Sub("test_queue")
    })()
    

    const publisher = await client.Pub("test1","test_queue");
    
     client.EventEmitter.on("sub-message",(msg)=>{

        console.log(msg)
        expect(msg).not.null
    })
    while(true){
        
    }
})
