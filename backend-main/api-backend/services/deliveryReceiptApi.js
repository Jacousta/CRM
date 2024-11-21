const { publishToQueue } = require('./pubsubService');

const deliveryApiService = async (communicationId, customerId, status) => {
  try {
    await publishToQueue({
      type: 'deliveryReceipt',
      data: {
        communicationId,
        customerId,
        status,
      },
    });
    console.log(
      `Delivery status for customer ${customerId} (Communication ${communicationId}): ${status}`
    );
  } catch (error) {
    console.error("Error publishing delivery receipt:", error.message);
    throw new Error("Failed to publish delivery receipt.");
  }
};

module.exports = { deliveryApiService };