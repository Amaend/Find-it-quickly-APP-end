// 失物处理函数模块

const db = require("../db");

const path = require("path");
const getLocalIP = require("../utils/getLocalIp");

let localIP = getLocalIP();
// 获取失物数据处理函数
exports.lostData = (req, res) => {
  const sql = "select * from lost";

  db.query(sql, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length <= 0) {
      return res.ss("获取数据失败！");
    }
    res.send({
      state: 200,
      message: "获取数据成功！",
      data: results,
    });
  });
};

// 管理员删除失物数据处理函数
exports.dtLost = (req, res) => {
  const id = req.query.id;
  const sql = "delete from lost where id=?";

  db.query(sql, id, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.affectedRows !== 1) {
      return res.ss("删除数据失败！");
    }
    res.ss("删除数据成功！", 200);
  });
};

// 用户添加失物信息处理函数（带有图片的处理函数）
exports.addLost = (req, res) => {
  const img =
    `http://${localIP}:3000/images/${req.body.url}/` + req.file.filename;
  const body = {
    ...JSON.parse(req.body.info),
    image: img,
    date: new Date(),
    userid: req.auth.id,
  };
  const sql = "insert into lost set ?";
  db.query(sql, body, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 400,
        message: "发布失败！",
      });
    }
    res.send({
      state: 200,
      message: "发布成功！",
      data: {
        id: results.insertId,
      },
    });
  });
};

// 用户添加失物信息处理函数（未上传图片的处理函数）
exports.addLostNotImg = (req, res) => {
  const body = {
    ...JSON.parse(req.body.info),
    image: `http://${localIP}:3000/images/default_image/none.png`,
    date: new Date(),
    userid: req.auth.id,
  };
  const sql = "insert into lost set ?";
  db.query(sql, body, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 400,
        message: "发布失败！",
      });
    }
    res.send({
      state: 200,
      message: "发布成功！",
      data: {
        id: results.insertId,
      },
    });
  });
};

// 获取当前用户发布的失物信息处理函数
exports.userLostInfo = (req, res) => {
  const sql = "select * from lost where userid=?";

  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length <= 0) {
      return res.ss("当前用户未发布失物信息!");
    }
    res.send({
      state: 200,
      message: "获取用户发布失物信息成功！",
      data: results,
    });
  });
};

// 用户删除发布的失物信息处理函数
exports.userLostdt = (req, res) => {
  const sql = "delete from lost where id=? and userid=?";

  db.query(sql, [req.query.id, req.auth.id], (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.affectedRows !== 1) {
      return res.ss("用户删除所发布的失物信息失败！");
    }
    res.ss("用户删除失物信息成功！", 200);
  });
};

// 用户更新失物状态
exports.updateState = (req, res) => {
  const body = req.body;
  const sql = "select * from lost where id=? and userid=?";
  db.query(sql, [body.id, req.auth.id], (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("获取数据失败");
    }
    const sql = "update lost set state=? where id=? and userid=?";
    const state = !results1[0].state;
    db.query(sql, [state, body.id, req.auth.id], (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.affectedRows !== 1) {
        return res.ss("更新状态失败！");
      }
      res.ss("更新状态成功！", 200);
    });
  });
};

// 获取全部发布的物品数据
exports.wholeData = (req, res) => {
  const sql = "select * from lost";
  db.query(sql, (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("获取数据失败！");
    }

    const sql = "select * from claim";
    db.query(sql, (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.lengt <= 0) {
        return res.ss("获取数据失败！");
      }
      res.send({
        state: 200,
        message: "获取数据成功！",
        data: [...results1, ...results2],
      });
    });
  });
};

// 管理员更新招领状态
exports.adminUpdateState = (req, res) => {
  const body = req.body;
  const sql = "select * from lost where id=?";
  db.query(sql, body.id, (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("获取数据失败！");
    }
    const sql = "update lost set state=? where id=?";
    const state = !results1[0].state;
    console.log(state);
    db.query(sql, [state, body.id], (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.affectedRows !== 1) {
        return res.ss("更改状态失败！");
      }
      res.ss("更改状态成功！", 200);
    });
  });
};
// 用户搜索商品接口
exports.searchData = (req, res) => {
  const name = req.body.name;
  console.log(name)
  const sql = "select * from lost where name like ?";
  db.query(sql, "%" + name + "%", (err, results1) => {
    if (err) {
      return res.send(err);
    }
    const sql = "select * from claim where name like ?";
    db.query(sql, "%" + name + "%", (err, results2) => {
      if (err) {
        return res.send(err);
      }
      let results = results1.concat(results2);
      if(results.length === 0){
        return res.send({
          state: 0,
          msg: "未查询到相关物品"
        });
      }
      const getUserInfoPromises = results.map((item) => {
        return new Promise((resolve, reject) => {
          const userSql = "select * from user where id=?";
          db.query(userSql, item.userid, (err, userResult) => {
            if (err) {
              reject(err);
            } else if (userResult.length !== 1) {
              reject({
                state: 201,
                message: "用户信息获取失败！",
              });
            } else {
              item.userInfo = userResult[0];
              resolve(item);
            }
          });
        });
      });

      Promise.all(getUserInfoPromises)
        .then((finalResults) => {
          return res.status(200).send({
            state: 200,
            message: "获取数据成功！",
            data: finalResults,
          });
        })
        .catch((error) => {
          return res.status(500).send(error);
        });
    })
});
}