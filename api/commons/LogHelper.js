/**
 * LogHelper
 *
 * @description :: Server-side logic for managing Fronts.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 giang.ngo: cac function helper cho log
 */
var async = require("async");
const SEPERATE = ",";
const MAX_LOG_LENGTH = 250;
var pidinfo = process.pid + "/" + process.ppid;
var logPid = "processid=" + pidinfo + ":";
function builder(params, args) {
  var logMsg = logPid;
  logMsg += params;
  if (args)
    for (var arg of args) {
      logMsg += SEPERATE;
      logMsg += arg ? JSON.stringify(arg).slice(0, MAX_LOG_LENGTH) : "null";
    }
  return logMsg;
}
module.exports = {
  Add: function(params, ...args) {
    var rs = builder(params, args);
    return rs;
  },
  getDuration: function(time) {
    return time[0] * 1000 + time[1] / 1000000;
  },

  logReq: function(req, err) {
    var logMsg = { pid: pidinfo, title: sails.config.appName };
    if (req) {
      logMsg.input = req.body ? req.body : req.query;
      var ip =
        (req.headers["x-forwarded-for"] || "").split(",").pop() ||
        (req.connection ? req.connection.remoteAddress : "") ||
        req.socket
          ? req.socket.remoteAddress
          : "" ||
            (req.connection
              ? req.connection.socket
                ? req.connection.socket.remoteAddress
                : ""
              : "");
      logMsg.remoteIp = ip;

      logMsg.action = req.url;
      let { username } = req.session
        ? req.session.user
        : { username: "nouser" };
      logMsg.username = username;
    }
    if (err) {
      logMsg.output = err;
    }
    return logMsg;
  }
};
