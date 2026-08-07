const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const PORTA = 3000;

app.use(express.json());

let db;

async function inicializarBanco() {
  db = await open({
    filename: "./banco.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    Create TABLE IF NOT EXISTS gatos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        idade INTEGER,
        cor TEXT
        status_saude TEXT
        adotado BOLEAN DEFAULT 0
        )
    `);

  console.log("📦 Banco de dados conectado e tabela criada!");
}

app.get("/", (req, res) => {
  res.json({
    status: "Sucesso!",
    mensagem:
      "Bem-vindo à CatRescue API! Sistema pronto para receber a Lua e outros felinos.",
  });
});

inicializarBanco().then(() => {
  app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORTA}`);
  });
});
