const express = require("express");
const app = express();
app.use(express.json());

// cors対策
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// prismaの呼び出し
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// タスク保存処理の実装
app.post('/task', async(req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.json(task)
  }catch(error) {
    res.status(500).send("データの保存に失敗しました");
  }
})

//タスクデータの取得
app.get('/tasks', async(_, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks)
  }catch(error) {
    res.status(500).send("データの取得に失敗しました");
  }
})

// ポート3000を使用して、読み込みができるかテストする
app.listen(3000, () => {
  console.log("listening on localhost port 3000");
})
