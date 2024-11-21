const { deliveryApiService } = require('./deliveryReceiptApi');

const sendToVendorAPI = async (message, communicationId, customerId) => {
  try {
    const status = Math.random() < 0.9 ? "SENT" : "FAILED";
    console.log(
      `Simulated vendor API response for customer ${customerId}: ${status}`
    );

    await deliveryApiService(communicationId, customerId, status);
    return { status };
  } catch (error) {
    console.error(
      `Error sending message for customer ${customerId} to vendor API:`,
      error.message
    );

    // Log the failure status for delivery receipt.
    try {
      await deliveryApiService(communicationId, customerId, "FAILED");
    } catch (deliveryError) {
      console.error("Error sending delivery receipt for failure:", deliveryError.message);
    }

    return { status: "FAILED" }; // Return status as "FAILED" in case of error.
  }
};

module.exports = { sendToVendorAPI };