const { Client, Message, Buttons, BaileysEventEmitter, LocalAuth } = require('@adiwajshing/baileys');

// Define the bot's owner and contact information
const botOwner = {
  name: 'prince',
  phoneNumber: 'https://wa.me/254768371432'
};

// Initialize the WhatsApp client
const client = new Client({
  auth: new LocalAuth(),
  puppeteer: true,
  sessionId: 'YOUR_SESSION_ID' // Replace with your session ID
});

// Connect to WhatsApp
client.on('qr', (qr) => {
  console.log('QR Code:', qr);
});

client.on('open', () => {
  console.log('WhatsApp connection established.');
});

// Handle incoming messages
client.on('message', async (message) => {
  // Extract message content and sender information
  const messageText = message.content ? message.content.text : '';
  const senderId = message.key.remoteJid;

  // Check if the sender is the bot owner
  if (senderId === botOwner.phoneNumber) {
    console.log('Message from bot owner:', messageText);
  } else {
    // Check if the message starts with a full stop (.)
    if (messageText.startsWith('.')) {
      // Handle special commands
      const command = messageText.substring(1).toLowerCase();

      if (command === 'owner') {
        // Respond with owner's contact information
        const ownerContact = Message.fromContactCard({
          displayName: botOwner.name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${botOwner.name}\nTEL:${botOwner.phoneNumber}\nEND:VCARD`
        });

        await client.sendMessage(senderId, ownerContact);
      } else {
        // Respond to other commands or handle as needed
        // You can add more command handling logic here
      }
    } else {
      // Process regular messages
      // Your existing logic for processing regular messages goes here
    }
  }
});
