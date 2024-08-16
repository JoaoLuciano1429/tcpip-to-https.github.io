const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const atob = require('atob'); // para decodificar base64

const app = express();
app.use(bodyParser.json());

app.post('/sendToTcp', (req, res) => {
    const serverInfo = req.body.server.split(':');
    const serverIp = serverInfo[0];
    const serverPort = parseInt(serverInfo[1], 10);
    const dataToSend = Buffer.from(atob(req.body.info), 'binary'); // Decodifica base64 para binário

    const tcpClient = new net.Socket();

    tcpClient.connect(serverPort, serverIp, () => {
        tcpClient.write(dataToSend);
    });

    tcpClient.on('data', (data) => {
        console.log('Resposta do servidor TCP:', data.toString());
        res.json({ status: 'Data sent to TCP', response: data.toString() });
        tcpClient.destroy();
    });

    tcpClient.on('error', (err) => {
        console.error('Erro ao conectar ao TCP:', err.message);
        res.status(500).json({ status: 'Error', message: err.message });
    });
});

app.listen(3000, () => {
    console.log('Servidor HTTP escutando na porta 3000');
});
