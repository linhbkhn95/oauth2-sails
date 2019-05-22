var moment = require('moment')
module.exports = {
  JSONparseOject: function (data, type = "array") {
    try {
      return JSON.parse(data);
    } catch (error) {
      if (type === "array") return [];
      console.log("parse json to object error", error);
      return {};
    }
  },
  split: function (data, char) {
    try {
      return data.split(char)
    } catch (error) {
      return []
    }
  },
  formatDate: function (date, typeFormat) {
  }

};
