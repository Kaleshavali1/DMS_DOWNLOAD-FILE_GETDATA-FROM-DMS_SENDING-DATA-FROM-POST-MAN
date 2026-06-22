const cds = require("@sap/cds");
const axios = require("axios");

cds.on("bootstrap", app => {

    console.log("CUSTOM SERVER LOADED");

    app.get("/download/:id", async (req, res) => {

        try {

            const id = req.params.id;

            console.log("DOWNLOAD REQUEST:", id);

            const doc = await SELECT.one
                .from("sales.db.Documents")
                .where({ id });

            if (!doc) {
                return res.status(404).send("Document not found");
            }

            const token = await getDMSToken();

            console.log("TOKEN RECEIVED");

            const response = await axios.get(
                doc.Url,
                {
                    responseType: "arraybuffer",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("FILE RECEIVED FROM DMS");

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${doc.fileName}"`
            );

            res.setHeader(
                "Content-Type",
                doc.mimeType || "application/octet-stream"
            );

            res.send(response.data);

        } catch (error) {

            console.error("DOWNLOAD ERROR");

            if (error.response) {

                console.error(
                    "Status:",
                    error.response.status
                );

                console.error(
                    "Data:",
                    error.response.data
                );
            }

            console.error(error.message);

            res.status(500).send(error.message);
        }
    });
});

async function getDMSToken() {

    const response = await axios.post(
        "https://build-ai-subaccount.authentication.us10.hana.ondemand.com/oauth/token",
        "grant_type=client_credentials",
        {
            auth: {
                username:
                    process.env.USERNAME,

                password:
                    process.env.PASSWORD
            },
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data.access_token;
}

module.exports = cds.server;