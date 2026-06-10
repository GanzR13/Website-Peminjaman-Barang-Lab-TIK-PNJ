"use strict";

const fs = require("fs");
const { google } = require("googleapis");

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({
	version: "v3",
	auth: oauth2Client,
});

const uploadPdfToDrive = async ({ filePath, fileName }) => {
	if (!folderId) {
		throw new Error("GOOGLE_DRIVE_FOLDER_ID belum diatur di .env");
	}

	if (!fs.existsSync(filePath)) {
		throw new Error(`File tidak ditemukan: ${filePath}`);
	}

	const response = await drive.files.create({
		requestBody: {
			name: fileName,
			mimeType: "application/pdf",
			parents: [folderId],
		},
		media: {
			mimeType: "application/pdf",
			body: fs.createReadStream(filePath),
		},
		fields: "id, name, webViewLink, webContentLink",
	});

	const fileId = response.data.id;

	await drive.permissions.create({
		fileId,
		requestBody: {
			role: "reader",
			type: "anyone",
		},
	});

	const file = await drive.files.get({
		fileId,
		fields: "id, name, webViewLink, webContentLink",
	});

	return {
		file_surat_drive_id: file.data.id,
		file_surat_url: file.data.webViewLink,
		file_name: file.data.name,
	};
};

module.exports = {
	uploadPdfToDrive,
};