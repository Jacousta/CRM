const amqp = require('amqplib');
const url = process.env.RABBITMQ_URI;

let connection = null;
let channel = null;

const connectQueue = async () => {
  try {
    if (!connection || !channel) {
      connection = await amqp.connect(url);
      channel = await connection.createChannel();
      await channel.assertQueue('dataQueue', { durable: true });
      console.log('Connected to RabbitMQ');
    }
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error.message);
    throw new Error("Failed to connect to RabbitMQ.");
  }
};

const publishToQueue = async (message) => {
  try {
    const { channel } = await connectQueue();
    channel.sendToQueue('dataQueue', Buffer.from(JSON.stringify(message)));
    console.log('Message published to queue:', message);
  } catch (error) {
    console.error("Error publishing message to queue:", error.message);
    throw new Error("Failed to publish message to queue.");
  }
};

const consumeQueue = async (callback) => {
  try {
    const { channel } = await connectQueue();
    channel.consume('dataQueue', (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          callback(data);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error.message);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error("Error consuming queue:", error.message);
    throw new Error("Failed to consume queue.");
  }
};

module.exports = { publishToQueue, consumeQueue };