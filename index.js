// index.js

const makeWASocket = require("@whiskeysockets/baileys").default;
const figlet = require('figlet'); // Add this line to import the figlet library
const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType
} = require("@whiskeysockets/baileys");
const util = require("util");
const {
  useMultiFileAuthState,
  jidDecode,
  makeInMemoryStore,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const logger = require("@whiskeysockets/baileys/lib/Utils/logger").default;
const pino = require("pino");
const qrcode = require('qrcode-terminal');
const gp = ["254114018035"];
const fs = require("fs");
const spinnies = new (require('spinnies'))(); // Add this line to define spinnies
const {
  Boom
} = require("@hapi/boom");

// Import the color, autostatusview, and menu functions from commands.js
const {
  color,
  autostatusview,
  menu
} = require('./commands');

global.store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
});

// Define the smsg function
function smsg(m, conn) {
  if (!m) return;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");
    m.sender = conn.decodeJid((m.fromMe && conn.user.id) || m.participant || m.key.participant || m.chat || "");
    if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || "";
  }
  return m;
}

// Define the main function
async function main() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  console.log(
    color(
      figlet.textSync("PRINCE_M-XIV"), // Remove unnecessary parameters here
      "red"
    )
  );

  const mokaya = makeWASocket({
    logger: pino({
      level: 'silent'
    }),
    printQRInTerminal: true,
    browser: ['Prince Active', 'safari', '1.0.0'],
    auth: state,
    qrTimeout: 20000000,
  });

  autostatusview(mokaya); // Attach the autostatusview event listener

  mokaya.ev.on('messages.upsert', async chatUpdate => {
    const m = smsg(chatUpdate.messages[0], mokaya);
    menu(mokaya, m); // Call the menu function
    if (!m.message) return;
  });

  mokaya.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  mokaya.ev.on('connection.update', async (update) => {
    const {
      connection,
      lastDisconnect,
      qr
    } = update;
    if (lastDisconnect == 'undefined' && qr != 'undefined') {
      qrcode.generate(qr, {
        small: true
      });
    }
    if (connection === 'connecting') {
      spinnies.add('start', {
        text: 'Connecting Now. . .'
      });
    } else if (connection === 'open') {
      spinnies.succeed('start', {
        text: Successfully Connected. You have logged in as ${mokaya.user.name}
      });
      mokaya.sendMessage(mokaya.user.jid, 'Thank you for using Prince_M-XIV.').catch(() => {});
    } else if (connection === 'close') {
      if (lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
        spinnies.fail('start', {
          text: Can't connection!
        });
        process.exit(0);
      } else {
        main().catch(() => main());
      }
    }
  });

  mokaya.ev.on('creds.update', saveCreds);
}

main();
