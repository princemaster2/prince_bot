// commands.js
const chalk = require("chalk");
const figlet = require("figlet");

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

// Define the autostatusview function
function autostatusview(mokaya) {
  mokaya.ev.on('messages.upsert', async chatUpdate => {
    // Your autostatusview logic here
  });
}

// Define the menu function
function menu(mokaya, message) {
  // Check if the message is a command
  if (message && message.message && message.message.conversation) {
    const command = message.message.conversation.trim().toLowerCase();
    
    // Check the command and call the corresponding function
    switch (command) {
      case 'prefixmenu':
        sendMenu(mokaya, message);
        break;
      // Add more cases for other commands as needed
    }
  }
}

// Define the sendMenu function
function sendMenu(mokaya, message) {
  // Your menu logic here
  // For example, send a table with Owner, Menu, and StatusView
  const menuText = `
    | Owner | Menu | StatusView |
    |-------|------|------------|
    | User1 | ...  | ...        |
    | User2 | ...  | ...        |
    | User3 | ...  | ...        |
  `;
  
  // Send the menu to the chat
  mokaya.sendMessage(message.chat, menuText);
}

module.exports = { color, autostatusview, menu };
