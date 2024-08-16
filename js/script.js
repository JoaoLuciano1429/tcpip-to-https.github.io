const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');

const app = express();
app.use(bodyParser.json());
let lastTcpResponse = "";

app.post('/sendToTcp', (req, res) => {
    const serverInfo = req.body.server.split(':');
    const serverIp = serverInfo[0];
    const serverPort = parseInt(serverInfo[1], 10);
    const dataToSend = req.body.info;

    const tcpClient = new net.Socket();

    tcpClient.connect(serverPort, serverIp, () => {
        tcpClient.write(dataToSend);
    });

    tcpClient.on('data', (data) => {
        lastTcpResponse = data.toString(); // Armazena a última resposta do TCP
        console.log('Resposta do servidor TCP:', lastTcpResponse);
        res.json({ status: 'Data sent to TCP', response: lastTcpResponse });
        tcpClient.destroy();
    });

    tcpClient.on('error', (err) => {
        console.error('Erro ao conectar ao TCP:', err.message);
        res.status(500).json({ status: 'Error', message: err.message });
    });
});

// Endpoint para o Roblox pegar a última resposta do TCP
app.get('/getTcpResponse', (req, res) => {
    res.json({ response: lastTcpResponse });
});
