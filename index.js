const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, makeInMemoryStore, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const figlet = require("figlet");
const chalk = require("chalk");
const qrcode = require("qrcode-terminal");
const spinnies = new (require("spinnies"))();

global.store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

async function main() {
  console.log(
    chalk.red(
      figlet.textSync("PRINCE_M-XIV", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
        whitespaceBreak: false,
      })
    )
  );

  const { state, saveCreds } = await useMultiFileAuthState("session");

  const mokaya = makeWASocket({
    logger: pino({
      level: "silent",
    }),
    printQRInTerminal: true,
    browser: ["Prince Active", "safari", "1.0.0"],
    auth: state,
    qrTimeout: 20000000,
  });

  mokaya.ev.on("messages.upsert", async (chatUpdate) => {
    const m = chatUpdate.messages[0];
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.sender = mokaya.decodeJid(
      m.fromMe && mokaya.user.id
        ? m.fromMe
        : m.participant || m.key.participant || m.chat
    );

    const groupMetadata = m.isGroup
      ? await mokaya.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    if (!m.message) return;

    // Handle incoming messages
    await handleIncomingMessage(m, mokaya);

    // Add the rest of your logic here...
  });

  mokaya.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = mokaya.jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  mokaya.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (lastDisconnect == "undefined" && qr != "undefined") {
      qrcode.generate(qr, {
        small: true,
      });
    }

    if (connection === "connecting") {
      spinnies.add("start", {
        text: "Connecting Now. . .",
      });
    } else if (connection === "open") {
      spinnies.succeed("start", {
        text: `Successfully Connected. You have logged in as ${mokaya.user.name}`,
      });
    } else if (connection === "close") {
      if (lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
        spinnies.fail("start", {
          text: `Can't connection!`,
        });

        process.exit(0);
      } else {
        main().catch(() => main());
      }
    }
  });

  mokaya.ev.on("creds.update", saveCreds);
}

// Add your function to handle incoming messages
async function handleIncomingMessage(message, client) {
  // Your logic for handling incoming messages
  // You can use the 'message' and 'client' parameters here
  // For example:
  if (message.fromMe) {
    // Message is from the bot
    console.log('Message from bot:', message.content.text);
  } else {
    // Message is from a user
    console.log('Message from user:', message.content.text);
    // Your response logic here...
    await client.sendMessage(message.chat, 'Hello! This is a response from your WhatsApp bot.');
  }
}

main();
