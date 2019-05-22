/**
 * TwofactorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var speakeasy = require("speakeasy");
var QRCode = require("qrcode");
const path = require("path");
var OutputUtils = require("../commons/OutputUtils");
var LogHelper = require("../commons/LogHelper");
var {
  checkDataNull
} = require("../commons/Validate");
module.exports = {
  setUp: function (req, res) {
    try {
      sails.log.info(
        LogHelper.Add("TwoFactorController setUp =====>start")
      );
      const secret = speakeasy.generateSecret({
        length: 10
      });

      QRCode.toDataURL(secret.otpauth_url, async (err, data_url) => {
        if (err) {
          sails.log.error(
            LogHelper.Add("TwoFactorController setUp =====>err"),
            err
          );
          return OutputUtils.errServer(res, err.toString());
        }
        let user = req.session.user;
        if (!user) {
          return OutputUtils.errServer(res, 'UnAuthorized', 401);

        }
        Twofactor.create({
          secret: "",
          tempSecret: secret.base32,
          dataURL: data_url,
          userId: user.id,
          otpURL: secret.otpauth_url
        }).exec((err, twofactor) => {
          if (err) {
            sails.log.error(
              LogHelper.Add("TwoFactorController setUp =====>err"),
              err
            );
            return OutputUtils.errServer(res, err.toString());
          }
          if (twofactor) {
            //save to logged in user.
            sails.log.info(
              LogHelper.Add("TwoFactorController setUp =====>success", {
                message: "Verify OTP",
                tempSecret: secret.base32,
                dataURL: data_url,
                otpURL: secret.otpauth_url
              })
            );
            return OutputUtils.success(res, {
              message: "Verify OTP",
              tempSecret: secret.base32,
              dataURL: data_url,
              otpURL: secret.otpauth_url
            });
          } else {
            return OutputUtils.errServer(res, 'Something was Wrong');
          }
        })

      });
    } catch (error) {
      sails.log.error(
        LogHelper.Add("TwoFactorController setUp =====>err"),
        error
      );
      return OutputUtils.errServer(res, error.toString());
    }
  },
  verify: async function (req, res) {
    try {
      let data = req.body;

      if (checkDataNull(data.token)) {
        return OutputUtils.errServer(res, {
          token: "Token is required"
        });
      }
      var verified = speakeasy.totp.verify({
        secret: user.twofactor.tempSecret, //secret of the logged in user
        encoding: "base32",
        token: req.body.token
      });
      if (verified) {
        // user.twofactor.secret = user.twofactor.tempSecret;
        return OutputUtils.success(res, "Two-factor auth enabled ");
      }
      return OutputUtils.errServer(res, "Invalid token ");
    } catch (error) {
      return OutputUtils.errServer(res, error.toString());
    }
  },
  disable: function (req, res) {}
};
