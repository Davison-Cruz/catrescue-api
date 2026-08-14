const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const multer = require("multer");
const path = require("path");

const app = express();
const PORTA = 3000;

app.use(express.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

let db;

async function inicializarBanco() {
  db = await open({
    filename: "./banco.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS adotantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    telefone TEXT,
    cpf TEXT)
    `);

  await db.exec(`
    Create TABLE IF NOT EXISTS gatos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        idade INTEGER,
        cor TEXT,
        status_saude TEXT,
        imagem_url TEXT,
        adotado BOLEAN DEFAULT 0,
        adotante_id INTEGER,
        FOREIGN KEY (adotante_id) REFERENCES adotante(id)
        )
    `);

  console.log("📦 Banco de dados conectado e tabela criada!");
}

app.get("/gatos", async (req, res) => {
  try {
    const gatos = await db.all(`SELECT * FROM gatos`);
    res.json(gatos);
  } catch (erro) {
    console.error(500).json({ erro: "Deu ruim ao buscar os dados no banco" });
  }
});

app.put("/gatos/:id", async (req, res) => {
  const id_do_gato = req.params.id;
  const { status_saude, adotado } = req.body;
  try {
    await db.run(
      `UPDATE gatos SET status_saude = ?, adotado = ? WHERE id = ?`,
      [status_saude, adotado, id_do_gato],
    );
    res.json({ mensagem: "Ficha do felino atualizada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Deu ruim ao atualizar o cadastro." });
  }
});

app.post("/gatos", async (req, res) => {
  const { nome, idade, cor, status_saude } = req.body;

  if (!nome || !idade || !cor || !status_saude) {
    return res.status(400).json({
      erro: "Dados incompletos! Você precisa enviar nome, idade, cor e status_saude.",
    });
  }

  if (typeof idade !== "number") {
    return res.status(400).json({
      erro: "A idade do felino precisa ser um número válido.",
    });
  }
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

app.delete("/gatos/:id", async (req, res) => {
  const id_do_gato = req.params.id;
  try {
    await db.run(`DELETE FROM gatos WHERE id = ?`, [id_do_gato]);

    res.json({ mensagem: "Registro do felino removido com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Deu ruim ao tentar deletar o registro." });
  }
});

app.post("/adotantes", async (req, res) => {
  const { nome, telefone, cpf } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios!" });
  }
  try {
    const resultado = await db.run(
      `INSERT INTO adotantes (nome, telefone, cpf) VALUES (?,?,?)`,
      [nome, telefone, cpf],
    );

    res.status(201).json({
      mensagem: `Adotante ${nome} cadastrado(a) com sucesso!`,
      id_adotante: resultado.lastID,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Deu ruim ao salvar o adotante." });
  }
});

app.put("/gatos/:id/adotar", async (req, res) => {
  const id_do_gato = req.params.id;
  const { adotante_id } = req.body;

  if (!adotante_id) {
    return res
      .status(400)
      .json({ erro: " Você precisa informar o ID do adotante!" });
  }
  try {
    await db.run(`UPDATE gatos SET adotado = 1, adotante_id = ? WHERE id = ?`, [
      adotante_id,
      id_do_gato,
    ]);

    res.json({ mensagem: "Adoção realizada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao processar a adoção" });
  }
});

app.get("/relatorios/adocoes", async (req, res) => {
  try {
    const relatorio = await db.all(`
      SELECT 
      gatos.nome AS nome_do_gato,
      gatos.cor,
      adotantes.nome AS nome_do_tutor,
      adotantes.telefone AS contato
      FROM gatos
      JOIN adotantes ON gatos.adotante_id = adotantes.id
      WHERE gatos.adotado = 1
      `);

    res.json(relatorio);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Deu ruim ao gerar o relatório." });
  }
});

app.get("/adotantes", async (req, res) => {
  try {
    const adotantes = await db.all(`SELECT * FROM adotantes`);
    res.json(adotantes);
  } catch (erro) {
    console.error(500).json({ erro: "Deu ruim ao buscar os dados no banco" });
  }
});

app.post("/gatos/:id/foto", upload.single("foto"), async (req, res) => {
  const id_do_gato = req.params.id;
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhuma imagem foi enviada." });
  }
  const caminhoDaImagem = req.file.path;
  try {
    await db.run("UPDATE gatos SET imagem_url = ? WHERE id = ?", [
      caminhoDaImagem,
      id_do_gato,
    ]);
    res.json({
      mensagem: "Foto adicionada com sucesso!",
      url: caminhoDaImagem,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao salvar a URL da foto no banco." });
  }
});

inicializarBanco().then(() => {
  app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORTA}`);
  });
});
