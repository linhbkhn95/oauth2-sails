/**
 * OAuth2Controller
 *
 * @description :: Server-side logic for managing OAuth2 process
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * GET /oauth2/authorize
   * Must go through passport basic auth policies and oauth2 to receive authorization data.
   * @param  {Object}  req - Incoming request
   * @param  {Object}  res - Outgoing response
   *
   */
  authorization: function (req, res) {

    // TRUSTED CLIENT
    // if client is trusted, skip ahead to next,
    // which is the server.decision() function
    // that normally is called when you post the auth dialog form
    if (req.oauth2.client.trusted) {
      // add needed params to simulate auth dialog being posted
      req.trusted = true;
      req.body = req.query;
      req.body.transaction_id = req.oauth2.transactionID;
      return next();
    }
    var scopeMap = {
      // ... display strings for all scope variables ...
      view_account: "view your account",
      edit_account: "view and edit your account"
    };

    return res.render("test", {
        transactionID: req.oauth2.transactionID,
        user: req.user,
        scope: req.oauth2.req.scope,
        client: req.oauth2.client,
        jwtToken: req.query.token,
        map: scopeMap
      }),

      // We added this 2 methods here in case the form is skipped (TRUSTED CLIENT)
      oauth2.decision(),
      oauth2.errorHandler()
    // //res.json({ transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client, oauth2: req.oauth2 });
    // res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  },
  // decision: oauth2.decision(),
  decision: oauth2.decision(function (req, done) {
    console.log(
      "   server.decision(function(req,done){ config/oauth2 line 254 "
    );
    console.log('req.oauth2.req', req.oauth2.req);
    if (req.body["cancel"]) {
      //clear all cookie
      var cookie = req.cookies;
      for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
          continue;
        }
        req.res.cookie(prop, "", {
          expires: new Date(0)
        });
      }
      req.session.destroy();
    }
    done(null, {
      scope: req.oauth2.req.scope
    });
  }),
  token: function (req, res) {
    res.json({});
  }
};
