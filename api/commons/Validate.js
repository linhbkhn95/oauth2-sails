module.exports = {
  checkDataNull: function(data) {
    return _.isUndefined(data) || !data;
  },
  checkEmail: function(email) {
    let regex = /^([A-Za-z0-9_\-+:.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (regex.test(email) === false) {
      return false;
    }
    return true;
  },
  checkPasswordValidate: function(password) {
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)) {
      return false;
    }
    return true;
  },
  checkNumberValidate: function(number) {
    if (!number.match(/^\d+$/)) {
      return false;
    }
    return true;
  },
  checkPhoneValidate: function(phone) {
    if (!phone.match(/(09|03|07|08)+([0-9]{8})\b/)) {
      return false;
    }
    return true;
  }
  
};
