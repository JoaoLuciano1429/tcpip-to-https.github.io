fetch("/api/sendToTcp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    server: "127.0.0.1:12345", // IP e porta do servidor TCP
    info: btoa("mensagem a ser enviada"), // Codifica a mensagem em base64
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("Resposta:", data))
  .catch((err) => console.error("Erro:", err));
