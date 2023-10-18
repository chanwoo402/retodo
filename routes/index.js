var express = require('express');
const { sql, pool } = require('../data/db');
var router = express.Router();

/* GET home page. */
router.get('/api/test', async (req, res) => {
  try {
    const query = await pool;               // Query 실행을 위한 Pool 지정
    const result = await query.request()    // Query 요청
      .input('name', sql.VarChar, 'aas')				// 하단 query에 @로 들어가는 파라미터 값을 사전에 설정
      .query("SELECT * FROM users WHERE content = @name");
    res.send(result);                       // Response에 결과값을 포함하여 전달
  } catch (err) {
    res.status(500);                        // 에러 발생시 Response 상태를 서버에러인 500에러로 세팅
    res.send(err.message);               // 에러 발생시 Response에 서버에러 내용 포함 전달
  }
})

router.get('/', function (req, res, next) {
  res.render('todo');
});


router.post('/users/content', async (req, res) => {
  const { content } = req.body
  console.log(content)
  try {
    const qu = await pool

    await qu.request()
      .input('content', sql.VarChar, content)
      .query('insert into users(content) values(@content)')
    res.status(200).json({
      message: "success"
    })
  } catch (err) {
    console.error(`err : ${err}`)
    res.status(400).json({
      message: "fail",
      error: err
    })
  }
})

router.patch('/list/content/edit', async (req, res) => {
  const { content, id } = req.body

  try {
    const qu = await pool

    await qu.request().input('content', sql.VarChar, content)
      .input('id', sql.Int, parseInt(id))
      .query('update list set content = @content where id = @id')

    res.status(200).json({
      message: "success"
    })
  } catch (err) {
    console.error(`err : ${err}`)
    res.status(400).json({
      message: "fail",
      error: err
    })
  }
})



router.get('/asd', (req, res) => {

})


router.delete('/users/delete', async (req, res) => {
  const { content } = req.body;
  try {
      const qu = await pool;
      await qu.request()
          .input('name', sql.VarChar, content)
          .query('DELETE FROM users WHERE content = @name');
      res.status(200).json({
          message: "success"
      });
  } catch (err) {
      res.status(500).json({
          message: "fail",
          error: err
      });
  }
});

router.get('/users', async (req, res) => {
  try {
    const qu = await pool
    
    const data = await qu.request().query('select content from users')
    console.log('get list')

    const result = {
      result: data.recordset
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(`err : ${err}`)
    res.status(400).json({
      message: "fail",
      error: err
    })
  }
})



module.exports = router;
