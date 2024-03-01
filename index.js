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

// firebaseの初期化
const admin = require("firebase-admin");
var serviceAccount = require("./task-assign-app-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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

// userデータを取得するための記述。
app.get('/users', async(req, res) => {
  // レスポンス返却用の配列を準備
  let allUsers = [];

  // ユーザーのリストを取得するための非同期関数
  const listAllUsers = async (nextPageToken) => {
    try {
      // Firebase Authenticationからユーザー情報を取得
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      // 取得したユーザー情報を配列に追加
      allUsers = allUsers.concat(listUsersResult.users.map(userRecord => userRecord.toJSON()));
      // 次のページトークンがあれば、次のバッチのユーザーも取得
      if (listUsersResult.pageToken) {
        // 再帰的に次のバッチのユーザーを取得
        await listAllUsers(listUsersResult.pageToken);
      }
    } catch (error) {
      console.log('Error listing users:', error);
      throw error; // エラーをスローして、後続の処理を停止
    }
  };

  // リスト収集のメソッド呼び出し
  try {
    await listAllUsers();
    console.log(allUsers)
    res.json(allUsers);
  }catch(error){
    res.status(500).send("ユーザーリストの取得に失敗しました。");
  }
})

// ポート3000を使用して、読み込みができるかテストする
app.listen(3000, () => {
  console.log("listening on localhost port 3000");
})
