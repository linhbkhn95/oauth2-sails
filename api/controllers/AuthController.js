/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  register: function (req, res) {

  },
  login: function (req, res) {
    return res.render("login", {
      message: ""
    });
  },
  accessLogin: function (req, res) {

  },
  info: function (req, res) {
    console.log('AuthController');
    console.log(req.scope, req.info, req.user);
    //  console.log(req.info)

    //  res.json({"msg":"if you see this you successfully went through OAuth2 authorization process"});
    res.json({
      user: req.user
    })
  }
};
