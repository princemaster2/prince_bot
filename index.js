const { Client, Message, Buttons, BaileysEventEmitter, LocalAuth } = require('@adiwajshing/baileys');
const botOwner = {
  name: 'prince',
  phoneNumber: 'https://wa.me/254768371432'
};


const client = new Client({
  auth: new LocalAuth(),
  puppeteer: true,
  sessionId: 'YOUR_SESSION_ID' 
});

client.on('qr', (qr) => {
  console.log('QR Code:', qr);
});

client.on('open', () => {
  console.log('WhatsApp connection established.');
});

client.on('message', async (message) => {

  const messageText = message.content ? message.content.text : '';
  const senderId = message.key.remoteJid;

  if (senderId === botOwner.phoneNumber) {
    console.log('Message from bot owner:', messageText);
  } else {
  
    if (messageText.startsWith('.')) {
      
      const command = messageText.substring(1).toLowerCase();

      if (command === 'owner') {
    
        const ownerContact = Message.fromContactCard({
          displayName: botOwner.name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${botOwner.name}\nTEL:${botOwner.phoneNumber}\nEND:VCARD`
        });

        await client.sendMessage(senderId, ownerContact);
      } else {
    
      }
    } else {
   
    }
  }
});
