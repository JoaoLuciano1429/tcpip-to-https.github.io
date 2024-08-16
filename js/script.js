const express = require("express");
const net = require("net");
const app = express();

app.use(express.json());

// Rota HTTPS para receber requisições do Roblox
app.post("/api/handle", (req, res) => {
  const playerData = req.body;

  // Conectar ao servidor TCP/IP
  const client = new net.Socket();
  client.connect(12345, "127.0.0.1", function () {
    console.log("Conectado ao servidor TCP");
    client.write(JSON.stringify(playerData));
  });

  client.on("data", function (data) {
    // Enviar resposta de volta para Roblox
    res.json({ message: "Resposta do servidor", data: data.toString() });
    client.destroy(); // Fechar conexão TCP
  });

  client.on("close", function () {
    console.log("Conexão TCP fechada");
  });

  client.on("error", function (err) {
    console.error("Erro na conexão TCP:", err);
    res.status(500).send("Erro na comunicação com o servidor.");
  });
});

// Servidor rodando na porta 3000
app.listen(3000, () => {
  console.log("Servidor HTTPS escutando na porta 3000");
});
