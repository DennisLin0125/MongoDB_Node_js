const express = require('express');
const router = express.Router();

// 導入 moment
const moment = require("moment");
const AccountModel = require("../../models/AccountModels");

// 導入 中間件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

// 記帳本列表
router.get('/account',checkTokenMiddleware, async (req, res) => {

  try {
    // 獲取資料庫所有帳單訊息,並按照時間做倒序排列
    const accounts = await AccountModel.find().sort({ time: -1 }).exec();

    // 響應讀取成功的json
    res.json({
        // 響應編號
        code: '0000',
        // 響應的訊息
        msg: '讀取成功',
        // 響應資料
        data: accounts
    });

  } catch (err) {
    res.json({
        code: '1001',
        msg: '讀取失敗',
        data: null
    });

    console.error(err);
    return;
  }
});

// 新增紀錄
router.post('/account',checkTokenMiddleware, function(req, res) {
  
  // 查看表單數據  2023-09-01 => new Date()
  // 將 2023-09-01 透過 moment 工具包 轉成 new Date()
  // console.log(req.body);

  // 插入數據庫
  // 使用 async/await 處理 create 方法
  async function createBook() {
    try {
        const newBook = await AccountModel.create({
          // ES6 語法 將 req.body 內的資料全部插入
          ...req.body,
          // 修改 time 轉成 new Date()
          time: moment(req.body.time).toDate()
        });

         // 響應添加成功的json
        res.json({
            // 響應編號
            code: '0000',
            // 響應的訊息
            msg: '新增成功',
            // 響應新增資料
            data: newBook
        })

    } catch (err) {
      res.json({
            // 響應編號
            code: '1002',
            // 響應的訊息
            msg: '新增失敗',
            // 響應新增資料
            data: null
        })
      console.error(err);
      return;
    }
  }
  createBook(); // 呼叫創建書籍的函數
});

// 刪除紀錄
router.delete("/account/:id",checkTokenMiddleware, async (req, res) => {
  // 獲取 param 的ID
  let id = req.params.id;
   
  try {
    // 刪除資料庫訊息
    const accounts = await AccountModel.deleteOne({ _id: id }).exec();

    // 刪除成功json
    res.json({
      code: '0000',
      msg: '刪除成功',
      data: {}
    })

  } catch (err) {
    // 刪除失敗json
    res.json({
      code: '1003',
      msg: '刪除失敗',
      data: null
    })
    console.error(err);
    return;
  }
});

// 獲取單個帳單訊息
router.get('/account/:id',checkTokenMiddleware,async (req, res) => {
  // 獲取 param 的ID
  let {id} = req.params;

  // 查詢數據庫
  try {
    // 獲取資料庫訊息
    const accounts = await AccountModel.findById(id).exec();

    // 獲取成功json
    res.json({
      code: '0000',
      msg: '獲取成功',
      data: accounts
    })

  } catch (err) {
    // 獲取失敗json
    res.json({
      code: '1004',
      msg: '獲取失敗',
      data: null
    })
    console.error(err);
    return;
  }
});

// 更新單個帳單訊息
router.patch('/account/:id',checkTokenMiddleware,async (req, res) => {
  // 獲取 param 的ID
  let {id} = req.params;
  // 更新數據庫
  try {
    // 更新資料庫訊息
    const accounts = await AccountModel.updateOne({_id:id}, req.body).exec();

    // 為了回傳為 json類型 必須在搜尋一次
    try {
      const accounts_data = await AccountModel.findById(id).exec();

      // 獲取成功json
      res.json({
        code: '0000',
        msg: '獲取成功',
        data: accounts_data
      })

    } catch (err) {
      // 獲取失敗json
      res.json({
        code: '1004',
        msg: '獲取失敗',
        data: null
      })
      console.error(err);
      return;
    }

  } catch (err) {
    // 獲取失敗json
    res.json({
      code: '1005',
      msg: '更新失敗',
      data: null
    })
    console.error(err);
    return;
  }
});

module.exports = router;
