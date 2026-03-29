require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
const TOKEN_PATH = path.join(__dirname, "tokens.json");

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// ===== LOAD SAVED TOKEN ON STARTUP =====
if (fs.existsSync(TOKEN_PATH)) {
  const saved = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(saved);
  console.log("✅ Loaded saved tokens");
}

// ===== LOGIN =====
app.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"]
  });
  res.redirect(url);
});

// ===== CALLBACK =====
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log("✅ Tokens saved");
    res.redirect("http://127.0.0.1:5500?loggedIn=true");
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).send("Auth failed");
  }
});

// ===== SEND EMAIL =====
app.post("/send", async (req, res) => {
  const { to, message, image } = req.body;
  console.log("Sending to:", to);

  if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
    return res.status(401).send("Not authenticated");
  }

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  // Build MIME email with inline image
  const boundary = "cookiegram_boundary";
  const emailLines = [
    `To: ${to}`,
    `Subject: you got a cookie!!`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/related; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    `<div style="font-family:Georgia,cursive;text-align:center;background:#fdf6ec;padding:40px;max-width:400px;margin:auto;">`,
    `<h2 style="color:#5a3e2b;">someone baked you a cookie! 🍪</h2>`,
    `<img src="cid:cookieimg" style="width:280px;height:280px;border-radius:15px;border:3px solid #5a3e2b;margin:20px 0;" />`,
    `<p style="color:#5a3e2b;font-size:18px;font-style:italic;">"${message || "thinking of you ✨"}"</p>`,
    `<p style="color:#aaa;font-size:13px;">sent with love via CookieGram 🍪</p>`,
    `</div>`,
    ``,
    `--${boundary}`,
    `Content-Type: image/png`,
    `Content-Transfer-Encoding: base64`,
    `Content-ID: <cookieimg>`,
    `Content-Disposition: inline; filename="cookie.png"`,
    ``,
    base64Data,
    ``,
    `--${boundary}--`
  ].join("\r\n");

  const raw = Buffer.from(emailLines)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw }
    });
    console.log("✅ Email sent with cookie image!");
    res.send("Email sent!");
  } catch (err) {
    console.error("Send error:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});
app.listen(5000, () => console.log("🍪 Server on http://localhost:5000"));