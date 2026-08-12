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

  // 🔌 KONEKSYON BOT LA
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ FAVELA PRIME BOT KONEKTE!");
    }

    if (connection === "close") {
      const reconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (reconnect) {
        console.log("🔄 Bot la ap rekonekte...");
        startBot();
      } else {
        console.log("❌ Bot la dekonekte.");
      }
    }
  });
}

startBot();
