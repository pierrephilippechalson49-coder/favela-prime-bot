const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  // 👑 MESAJ BYENVENI NAN GROUP LA
  sock.ev.on("group-participants.update", async (update) => {
    if (update.action === "add") {
      for (const user of update.participants) {
        await sock.sendMessage(
          update.id,
          {
            text: `👑🔥 *BYENVENI NAN FAVELA PRIME* 🔥👑

🩸 *JAY DÉMON — CHÈF FAVELA* 🩸

👤 Byenvini @${user.split("@")[0]}.

⚡ Ou fèk antre nan yon fanmi ki pa tankou lòt yo.
🖤 Respè se règ.
👑 Aura se prezans.
🔥 FAVELA PRIME se non an.

🤖 Bot la ap veye gwoup la.
💀 Pa vini ak dezòd... vini ak respè.

👑 *JAY DÉMON AP DIRIJE FAVELA A* 👑
🔥 *FAVELA PRIME — NO FEAR, NO LIMITS* 🔥`,
            mentions: [user]
          }
        );
      }
    }
  });

  // 🔌 BOT CONNECTION
sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

  if (connection === "open") {
    console.log("✅ FAVELA PRIME BOT CONNECTED!");
  }

  if (connection === "close") {
    const reconnect =
      lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

    if (reconnect) {
      console.log("🔄 The bot is reconnecting...");
      startBot();
    } else {
      console.log("❌ The bot is off.");
    }
  }
});
}

startBot();sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;
    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

    if (text.trim().toLowerCase() === ".menu") {
        await sock.sendMessage(jid, {
            text: `👑 *FAVELA PRIME BOT* 👑

📋 *MENU*

1️⃣ .menu
2️⃣ .ping
3️⃣ .owner
4️⃣ .welcome

🤖 Bot aktif
👑 JAY DEMON`
        });
    }

    if (text.trim().toLowerCase() === ".ping") {
        await sock.sendMessage(jid, {
            text: "🏓 Pong! Bot la aktif ✅"
        });
    }
});
