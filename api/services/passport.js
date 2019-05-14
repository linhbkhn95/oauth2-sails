var bcrypt = require("bcryptjs"),
  moment = require("moment"),
  passport = require("passport"),
  BearerStrategy = require("passport-http-bearer").Strategy,
  BasicStrategy = require("passport-http").BasicStrategy,
  LocalStrategy = require("passport-local").Strategy,
  ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
// var request = require("request");
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({
    id: id
  }, function (err, user) {
    done(err, user);
  });
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */

//check username and password registered
passport.use(
  new LocalStrategy(function (username, password, next) {
    sails.log.info("Login LocalStrategy(", username, "passsword", ") BEGIN");
    process.nextTick(function () {
      sails.log.info(
        "Login LocalStrategy(",
        username,
        "passsword",
        ") BEGIN request!!!"
      );
      try {
        // request(
        //   {
        //     url: sails.config.bpsUrl + execProcedure,
        //     method: "POST",
        //     json: {
        //       funckey: "fopks_sa.Sp_login",
        //       bindvar: {
        //         username: username,
        //         password: password,
        //         tlid: { dir: 3003, type: 2001 },
        //         tlfullname: { dir: 3003, type: 2001 },
        //         err_code: { dir: 3003, type: 2001 },
        //         err_param: { dir: 3003, type: 2001 }
        //       }
        //     },
        //     timeout: sails.config.bpsTimeout
        //   },
        // function(err, res) {
        //   if (err) {
        //     sails.log.error(
        //       "Login LocalStrategy Error.:",
        //       username,
        //       "error",
        //       err
        //     );
        //     return next(err);
        //   } else {
        //     sails.log.info(
        //       "Login LocalStrategy",
        //       username,
        //       "Result=",
        //       res.body
        //     );
        //     if (parseInt(res.body.EC) != 0) {
        //       let message = res.body.EM;
        //       ErrDefs.findOne({ ERRNUM: res.body.EC }).exec(
        //         (err, errdefs) => {
        //           if (err) {
        //             rs.EM = "Lỗi thực hiện trên redis";
        //           }
        //           message = "Mã lỗi " + res.body.EC + "-";
        //           if (errdefs) message += errdefs.ERRDESC;
        //           else {
        //             message += " Mã lỗi chưa được khai báo ";
        //           }

        //           return next(null, false, { message: message });
        //         }
        //       );
        //     } else {
        //       if (parseInt(res.body.DT.err_code) != 0) {
        //         sails.log.debug(
        //           "Login LocalStrategy",
        //           username,
        //           "BPS Error=",
        //           res.body.DT.err_code,
        //           " msg=",
        //           res.body.DT.err_param
        //         );
        //         return next(null, false, { message: res.body.DT.err_param });
        //       } else {
        //         sails.log.debug(
        //           "Login LocalStrategy",
        //           username,
        //           "Find user in redis cache"
        //         );
        User.findOne({
          username: username
        }).exec(function (err, user) {
          if (err) {
            return next(err);
          }

          if (!user) {
            // var newuser = {
            //   username: username,
            //   // tlid: res.body.DT.tlid,
            //   password: username,
            //   // fullname: res.body.DT.tlfullname
            // };
            // User.create(newuser).exec(function(err, user) {
            //   if (err) {
            //     sails.log.error(
            //       "Login LocalStrategy Error.:",
            //       username,
            //       "user error.:",
            //       err
            //     );
            //     return next(null, false, {
            //       message: "Không khởi tạo được user!"
            //     });
            //   }
            //   sails.log.info(
            //     "New user created" +
            //       "- username: " +
            //       user.username +
            //       "- tlid: " +
            //       user.tlid +
            //       "- fullname: " +
            //       user.fullname
            //   );
            //   return next(null, user);
            // });
            return next(null, false, {
              message: 'invalid username or password'
            });
          } else {
            bcrypt.compare(password, user.hashedPassword, function (err, res) {
              if (err) {
                return next(err, null, {
                  message: 'invalid username or password'
                });
              } else {
                if (!res) {
                  return next(null, false, {
                    message: "Invalid password"
                  });
                } else {
                  return next(null, user);
                }
              }
            });
          }
        });
        //     }
        //   }
        // }
        //   }
        //  );
      } catch (e) {
        sails.log.error(
          "Login LocalStrategy nextTick Error.:",
          username,
          "error.:",
          err
        );
      }
    });
  })
);

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */

passport.use(
  new BasicStrategy(function (username, password, done) {
    sails.log.info(
      "* BasicStrategy & ClientPasswordStrategy",
      "username ",
      username
    );

    User.findOne({
        username: username
      },
      function (err, user) {
        if (err) {
          console.log('err BasicStrategy', err)
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        console.log('err BasicStrategy', user, err)

        bcrypt.compare(password, user.hashedPassword, function (err, res) {
          if (err) {
            return done(err, null);
          } else {
            if (!res) {
              return done(null, false, {
                message: "Invalid password"
              });
            } else {
              return done(null, user);
            }
          }
        });
      }
    );
  })
);
//when has code and get tocken
passport.use(
  new ClientPasswordStrategy(function (clientId, clientSecret, done) {
    sails.log.info("passport.use(new ClientPasswordStrategy())");
    Client.findOne({
        clientId: clientId
      },
      function (err, client) {
        if (err) {
          return done(err);
        }
        if (!client) {
          return done(null, false);
        }
        if (client.clientSecret != clientSecret) {
          return done(null, false);
        }
        return done(null, client);
      }
    );
  })
);

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(
  new BearerStrategy(function (accessToken, done) {
    sails.log.info("passport.use(new BearerStrategy())", accessToken);

    AccessToken.findOne({
      token: accessToken
    }, function (err, token) {
      if (err) {
        return done(err);
      }
      if (!token) {
        sails.log.info("passport.use(new BearerStrategy(", "ko co token");
        return done(null, false);
      }

      var now = moment().unix();
      var creationDate = moment(token.createdAt).unix();

      if (now - creationDate > sails.config.oauth.tokenLife) {
        AccessToken.destroy({
          token: accessToken
        }, function (err) {
          if (err) return done(err);
        });
        sails.log.info(
          "Token expired",
          accessToken,
          now,
          creationDate,
          sails.config.oauth.tokenLife
        );
        return done(null, false, {
          message: "Token expired"
        });
      }
      //
      sails.log.info("passport from token=" + token.userId);
      var info = {
        scope: token.scope
      };
      User.findOne({
        username: token.userId
      }).exec(function (err, user) {
        sails.log.info("passport.use.: BearerStrategy   ", user);
        done(err, user, info);
      });
    });
  })
);
module.exports = passport;
