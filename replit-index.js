const { create, Client } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

// Define the bot's owner and contact information
const botOwner = {
  name: 'prince',
  phoneNumber: 'https://wa.me/254768371432'
};

// Initialize the WhatsApp client
const client = create();
client.connect();

// Function to generate a QR code
function generateQRCode(data) {
  qrcode.generate(data, { small: true });
}

// Connect to WhatsApp
client.on('qr', (qr) => {
  console.log('Scan the QR code below to log in to WhatsApp:');
  generateQRCode(qr);
});

client.on('open', () => {
  console.log('WhatsApp connection established.');
});

// Handle incoming messages
client.on('message', async (message) => {
  // Extract message content and sender information
  const messageText = message.text || '';
  const senderId = message.key.remoteJid;

  // Check if the sender is the bot owner
  if (senderId === botOwner.phoneNumber) {
    console.log('Message from bot owner:', messageText);
  } else {
    // Process message (you can add your logic here)

    // Send a simple response to the sender
    await client.sendMessage(senderId, 'Hello! This is a response from your WhatsApp bot.');
  }
});
