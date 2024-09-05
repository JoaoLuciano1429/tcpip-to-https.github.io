const express = require("express");
const bodyParser = require("body-parser");
const net = require("net");
const atob = require("atob");

const app = express();
app.use(bodyParser.json());

app.post("/sendToTcp", (req, res) => {
  const serverInfo = req.body.server.split(":");
  const serverIp = serverInfo[0];
  const serverPort = parseInt(serverInfo[1], 10);
  const dataToSend = Buffer.from(atob(req.body.info), "binary");

  const tcpClient = new net.Socket();

  tcpClient.connect(serverPort, serverIp, () => {
    tcpClient.write(dataToSend);
  });

  tcpClient.on("data", (data) => {
    res.json({ status: "Data sent to TCP", response: data.toString() });
    tcpClient.destroy();
  });

  tcpClient.on("error", (err) => {
    res.status(500).json({ status: "Error", message: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor HTTP escutando na porta ${PORT}`);
});
