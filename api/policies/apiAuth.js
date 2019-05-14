/**
 * Api Auth Policy
 *
 * TODO api auth policy describe
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

module.exports = function (req, res, next) {
  // sails.log.info('apiAuth', req.headers)

  // return passport.authenticate(['bearer'], {
  //   session: false
  // })(req, res, next);
  return passport.authenticate("bearer", function (err, user, info) {
    if (err || !user) {
      res.send(401);
      // res.redirect('/');
      return;
    }
    sails.log.info("oauthBearer:line 25 :", info.scope);

    delete req.query.access_token;
    req.user = user;
    req.scope = info;
    // if (info.scope.indexOf(scope) > -1) return next();
    // else {
    //   res.send(401);
    // }
    next();
  })(req, res, next);


}
