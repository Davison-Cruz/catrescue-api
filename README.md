# 🐾 CatRescue API

Um sistema de back-end (API RESTful) desenvolvido para gerenciar abrigos de felinos, facilitando o registro de resgates, acompanhamento de saúde e o processo de adoção.

## 🚀 Tecnologias Utilizadas

- **Node.js** e **Express.js**: Arquitetura da API RESTful e mapeamento de rotas.
- **SQLite**: Banco de dados relacional integrado.
- **Git e GitHub**: Versionamento de código e _Conventional Commits_.

## ⚙️ Funcionalidades (CRUD Relacional)

- Cadastro, listagem, atualização e remoção de felinos resgatados.
- Validação de regras de negócio (Bloqueio de dados incompletos - HTTP 400).
- Cadastro de adotantes (Tutores).
- **Sistema de Adoção:** Relacionamento entre as tabelas de felinos e adotantes utilizando _Foreign Keys_.
- Relatórios de adoção gerados através de consultas avançadas (SQL JOIN).

## 🛠️ Como rodar o projeto localmente

1. Clone este repositório:
   `git clone https://github.com/Davison-Cruz/catrescue-api.git`

2. Instale as dependências:
   `npm install`

3. Inicie o servidor:
   `npm run dev`

4. A API estará respondendo em `http://localhost:3000`

## 👨‍💻 Autor

**Davison Silva da Cruz**
Analista de Tecnologia e Desenvolvedor Full-stack.

- [LinkedIn](https://www.linkedin.com/in/davison-cruz/)
- [GitHub](https://github.com/Davison-Cruz)
