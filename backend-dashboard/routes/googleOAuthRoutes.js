"use strict";

const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/drive.file"];

router.get("/auth", (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: scopes,
	});

	return res.redirect(url);
});

router.get("/callback", async (req, res) => {
	try {
		const { code } = req.query;

		if (!code) {
			return res.status(400).send("Authorization code tidak ditemukan.");
		}

		const { tokens } = await oauth2Client.getToken(code);

		console.log("TOKENS:", tokens);

		return res.send(`
			<h2>OAuth berhasil</h2>
			<p>Copy refresh_token di bawah ini ke file .env:</p>
			<textarea style="width:100%;height:160px;">${tokens.refresh_token || "Refresh token kosong. Coba revoke access lalu ulangi auth."}</textarea>
		`);
	} catch (error) {
		console.error("Google OAuth Callback Error:", error);

		return res.status(500).send(`
			<h2>OAuth gagal</h2>
			<pre>${error.message}</pre>
		`);
	}
});

module.exports = router;