const express = require("express");
const app = express();
app.use(express.json());

// cors対策
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// prismaの呼び出し
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// ポート3000を使用して、読み込みができるかテストする
app.listen(3000, () => {
  console.log("listening on localhost port 3000");
})
