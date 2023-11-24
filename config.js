// config.js

// Define the prefix for commands
const commandPrefixes = ['.', '!', '#', '*', '^'];

// Function to check if a message is a command
function isCommand(message) {
  return commandPrefixes.some(prefix => message.startsWith(prefix));
}

// Autoviewstatus state (initially disabled)
let autoviewstatusEnabled = false;

// Function to handle incoming messages
async function handleIncomingMessage(message, mokaya) {
  const chatId = message.chat;
  const senderId = message.sender;

  // Check if the message is a command
  if (isCommand(message.content.text)) {
    const command = message.content.text.toLowerCase();

    // Check if the command is for autoviewstatus
    if (command === '.autoviewstatus') {
      const response = autoviewstatusEnabled
        ? 'Autoviewstatus is currently Enabled.'
        : 'Autoviewstatus is currently Disabled. To enable it, reply with `.enable autostatusview`, and to disable, reply with `.disable autostatusview`.';
      
      // Send the response to the sender
      await mokaya.sendMessage(chatId, response);
    } else if (command === '.enable autostatusview') {
      // Enable autoviewstatus
      autoviewstatusEnabled = true;
      await mokaya.sendMessage(chatId, 'Autoviewstatus is now Enabled.');
    } else if (command === '.disable autostatusview') {
      // Disable autoviewstatus
      autoviewstatusEnabled = false;
      await mokaya.sendMessage(chatId, 'Autoviewstatus is now Disabled.');
    }
  }
}

module.exports = {
  handleIncomingMessage,
};

