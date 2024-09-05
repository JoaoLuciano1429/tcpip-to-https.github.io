const net = require("net");
const atob = require("atob");

export default function handler(req, res) {
  if (req.method === "POST") {
    const serverInfo = req.body.server.split(":");
    const serverIp = serverInfo[0];
    const serverPort = parseInt(serverInfo[1], 10);
    const dataToSend = Buffer.from(atob(req.body.info), "binary");

    const tcpClient = new net.Socket();

    tcpClient.connect(serverPort, serverIp, () => {
      tcpClient.write(dataToSend);
    });

    tcpClient.on("data", (data) => {
      res
        .status(200)
        .json({ status: "Data sent to TCP", response: data.toString() });
      tcpClient.destroy();
    });

    tcpClient.on("error", (err) => {
      res.status(500).json({ status: "Error", message: err.message });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
