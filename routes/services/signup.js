var express = require("express");

var User = require("../../models/User");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  })
  .post(async (req, res, next) => {
    let { login, password, repassword } = req.body;

    if (!login && !password && !repassword) {
      res.statusCode = 403;
      return res.json({
        error: "unauthorized",
        msg: "Ocorreu um erro no cadastro. Por favor tente novamente.",
      });
    }

    if (password !== repassword) {
      res.statusCode = 403;
      return res.json({
        error: "Passwords entered do not match",
        msg: "Senhas informadas não coincidem. Por favor, tente novamente",
      });
    }

    try {
      let user = await User.findOne({ login }, (err) => {
        if (err) {
          res.json({
            error: err,
            msg: "Ocorreu um erro no sistema. Por favor tente mais tarde.",
          });
        }
      }).exec();

      if (user) {
        res.statusCode = 403;
        res.json({
          error: "There is a user with this login in the system",
          msg: `Já existe um usuario com o login '${login}'. Tente outro por favor.`,
        });
      } else {
        let newUser = { login, password };
        await User.create(newUser);
        console.log(`--signUp> Usuario [ ${login} ] inicio um cadastro na plataforma.` );
        return res.json({
          status: "success",
          msg: "Usuario cadastrado com sucesso.",
        });
      }
    } catch (error) {
      res.statusCode = 500;
      return res.json({
        error: error.message,
        msg: "Ocorreu um erro no sistema. Por favor tente mais tarde.",
      });
    }
  })
  .put((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  })
  .delete((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  });

module.exports = router;
