<div>
    <h1 align='center' style={{margin: 0}}>Coin Keeper Api</h1>
    <p align='center' style={{margin: 0}}>A API para o guardião das suas finanças</p>
</div>

```
🚧 O Coin Keeper está em desenvolvimento
```

## 📖 Sobre

O Guardião das Suas Finanças. Gerencie suas economias com facilidade e proteja seu dinheiro
com Coin Keeper, o aplicativo de controle financeiro que ajuda você a manter suas finanças em ordem.
Com Coin Keeper, você pode controlar seus gastos, economizar dinheiro e atingir seus objetivos
financeiros com mais facilidade. Com um design intuitivo e recursos avançados, Coin Keeper é o
guardião perfeito para suas finanças.

## 🤖 Funcionalidades

- [x] Cadastro de Usuário
- [x] Login
- [x] Crud de categorias
- [x] Crud de transações
- [x] Crud de contas
- [x] Balanço de contas
- [x] Crud de cartão de crédito

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/en/) - Ambiente de execução Javascript server-side.
- [Fastify](https://www.fastify.io/) - Framework web para Node.js.
- [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript.
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional.
- [Docker](https://www.docker.com/) - Plataforma para desenvolvimento, envio e execução de aplicativos.
- [Swagger](https://swagger.io/) - Framework para documentação de API.
- [JWT](https://jwt.io/) - JSON Web Tokens.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Biblioteca para criptografia de senhas.
- [Vitest](https://vitest.dev/) - Framework de testes para Node.js.

## 📦 Instalação

```bash
# Clone o repositório
$ git clone

# Acesse a pasta do projeto
$ cd coin-keeper-api

# Instale as dependências
$ npm install

#  Duplique o arquivo .env.example e renomeie para .env
$ cp .env.example .env

# Rode o docker-compose para subir o banco de dados
$ docker-compose up -d

# Rode as migrations
$ npx prisma migrate dev

# Rode a aplicação
$ npm run dev
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

#### 🖊️ Autor - [@raniellimontagna](https://www.github.com/raniellimontagna)
