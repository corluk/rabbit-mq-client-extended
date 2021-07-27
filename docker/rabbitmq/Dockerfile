FROM rabbitmq:3.9.0-management-alpine  
RUN mkdir -p /etc/rabbitmq
#https://stackoverflow.com/questions/30747469/how-to-add-initial-users-when-starting-a-rabbitmq-docker-container
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.config 

COPY definitions.json /etc/rabbitmq/
RUN chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.config /etc/rabbitmq/definitions.json