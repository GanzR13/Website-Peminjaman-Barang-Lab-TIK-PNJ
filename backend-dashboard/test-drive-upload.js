require("dotenv").config();

const path = require("path");
const { uploadPdfToDrive } = require("./utils/googleDriveUploader");

(async () => {
	try {
		const result = await uploadPdfToDrive({
			filePath: path.join(__dirname, "test.pdf"),
			fileName: "test-upload-si-lab.pdf",
		});

		console.log("Upload berhasil:", result);
	} catch (error) {
		console.error("Upload gagal:", error.message);
		console.error(error);
	}
})();