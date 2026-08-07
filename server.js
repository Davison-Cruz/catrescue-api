const express = require("express");
const app = express();
const PORTA = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Sucesso",
    mensagem:
      "Bem-vindo ao CatRescue API! Sistema pronto para receber a Lua e outros gatinhos.",
  });
});

app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando lindamente na porta ${PORTA}`);
});
