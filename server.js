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
        cor TEXT,
        status_saude TEXT,
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

app.post("/gatos", async (req, res) => {
  const { nome, idade, cor, status_saude } = req.body;

  try {
    const resultado = await db.run(
      `INSERT INTO gatos (nome, idade, cor, status_saude) VALUES (?,?,?,?)`,
      [nome, idade, cor, status_saude],
    );

    res.status(201).json({
      mensagem: `${nome} cadastrado(a) com sucesso no abrigo!`,
      id_gato: resultado.lastID,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Deu ruim ao salvar no banco de dados." });
  }
});

inicializarBanco().then(() => {
  app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORTA}`);
  });
});
