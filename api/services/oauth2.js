/**
 * OAuth2orize Service
 * Defines the OAuth2 Server
 */
var oauth2orize = require("oauth2orize"),
  //  login = require("connect-ensure-login"),
  bcrypt = require("bcryptjs");
// Create OAuth 2.0 server
var server = oauth2orize.createServer();

server.serializeClient(function (client, done) {
  return done(null, client.id);
});

server.deserializeClient(function (id, done) {
  Client.findOne(id, function (err, client) {
    if (err) {
      return done(err);
    }
    return done(null, client);
  });
});

// Generate authorization code
server.grant(
  oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    console.log("server.grant(oauth2orize.grant.code(function(client", client, redirectURI, user, ares, );
    Authcode.create({
      clientId: client.clientId,
      redirectURI: redirectURI,
      userId: user.username,
      scope: ares.scope
    }).exec(function (err, code) {
      if (err) {
        return done(err, null);
      }
      return done(null, code.code);
    });
  })
);

// Generate access token for Implicit flow
// Only access token is generated in this flow, no refresh token is issued
server.grant(
  oauth2orize.grant.token(function (client, user, ares, done) {
    console.log("Generate access token for Implicit flow");
    AccessToken.destroy({
        userId: user.username,
        clientId: client.clientId
      },
      function (err) {
        if (err) {
          return done(err);
        } else {
          AccessToken.create({
              userId: user.username,
              clientId: client.clientId
            },
            function (err, accessToken) {
              if (err) {
                return done(err);
              } else {
                return done(null, accessToken.token);
              }
            }
          );
        }
      }
    );
  })
);

// Exchange authorization code for access token
//get tocken from oauth server
server.exchange(
  oauth2orize.exchange.code(function (client, code, redirectURI, scope, done) {
    console.log("Exchange authorization code for access token line 56 scope ");
    console.log(scope);
    Authcode.findOne({
      code: code
    }).exec(function (err, code) {
      console.log("  }).exec(function(err,code){ ");
      console.log(code);
      if (err || !code) {
        return done(err);
      }
      if (client.clientId !== code.clientId) {
        return done(null, false);
      }
      if (redirectURI !== code.redirectURI) {
        return done(null, false);
      }

      // Remove Refresh and Access tokens and create new ones
      RefreshToken.destroy({
          userId: code.userId,
          clientId: code.clientId
        },
        function (err) {
          if (err) {
            return done(err);
          } else {
            AccessToken.destroy({
                userId: code.userId,
                clientId: code.clientId
              },
              function (err) {
                if (err) {
                  return done(err);
                } else {
                  RefreshToken.create({
                      userId: code.userId,
                      clientId: code.clientId
                    },
                    function (err, refreshToken) {
                      if (err) {
                        return done(err);
                      } else {
                        //add scope to accessToken
                        AccessToken.create({
                            userId: code.userId,
                            clientId: code.clientId,
                            scope: code.scope
                          },
                          function (err, accessToken) {
                            if (err) {
                              return done(err);
                            } else {
                              return done(
                                null,
                                accessToken.token,
                                refreshToken.token, {
                                  expires_in: sails.config.oauth.tokenLife
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  })
);

// Exchange username & password for access token.
server.exchange(
  oauth2orize.exchange.password(function (
    client,
    username,
    password,
    scope,
    done
  ) {
    console.log("// Exchange username & password for access token.");
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      var pwdCompare = bcrypt.compareSync(password, user.hashedPassword);
      if (!pwdCompare) {
        return done(null, false);
      }

      // Remove Refresh and Access tokens and create new ones
      RefreshToken.destroy({
          userId: user.username,
          clientId: client.clientId
        },
        function (err) {
          if (err) {
            return done(err);
          } else {
            AccessToken.destroy({
                userId: user.username,
                clientId: client.clientId
              },
              function (err) {
                if (err) {
                  return done(err);
                } else {
                  RefreshToken.create({
                      userId: user.username,
                      clientId: client.clientId
                    },
                    function (err, refreshToken) {
                      if (err) {
                        return done(err);
                      } else {
                        AccessToken.create({
                            userId: user.username,
                            clientId: client.clientId
                          },
                          function (err, accessToken) {
                            if (err) {
                              return done(err);
                            } else {
                              done(
                                null,
                                accessToken.token,
                                refreshToken.token, {
                                  expires_in: sails.config.oauth.tokenLife
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  })
);

// Exchange refreshToken for access token.
server.exchange(
  oauth2orize.exchange.refreshToken(function (
    client,
    refreshToken,
    scope,
    done
  ) {
    console.log("Exchange refreshToken for access token. line 56 scope ");
    console.log(scope);
    RefreshToken.findOne({
      token: refreshToken
    }, function (err, token) {
      if (err) {
        return done(err);
      }
      if (!token) {
        return done(null, false);
      }
      if (!token) {
        return done(null, false);
      }

      User.findOne({
        id: token.userId
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }

        // Remove Refresh and Access tokens and create new ones
        RefreshToken.destroy({
            userId: user.username,
            clientId: client.clientId
          },
          function (err) {
            if (err) {
              return done(err);
            } else {
              AccessToken.destroy({
                  userId: user.username,
                  clientId: client.clientId
                },
                function (err) {
                  if (err) {
                    return done(err);
                  } else {
                    RefreshToken.create({
                        userId: user.username,
                        clientId: client.clientId
                      },
                      function (err, refreshToken) {
                        if (err) {
                          return done(err);
                        } else {
                          AccessToken.create({
                              userId: user.username,
                              clientId: client.clientId
                            },
                            function (err, accessToken) {
                              if (err) {
                                return done(err);
                              } else {
                                done(
                                  null,
                                  accessToken.token,
                                  refreshToken.token, {
                                    expires_in: sails.config.oauth.tokenLife
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });
    });
  })
);


module.exports = server;
