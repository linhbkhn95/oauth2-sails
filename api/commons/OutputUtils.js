module.exports = {
  /*
  code : mã code trả về  client.
  message : message trả về  client thường dùng cho trường hợp có lỗi.
  data : dữ liệu trả về  cho client thường dùng cho trường hợp trả về  khi có kết quả không gặp lỗi.
  */
  jsonAPIOutput: function(res, code, message, errors, data, status) {
    return res.status(status).send({
      code,
      errors,
      data,
      message
    });
  },
  errServer: function(res, err_mssage, status = 400) {
    return this.jsonAPIOutput(res, -1, "Erorrs", err_mssage, null, status);
  },
  success: function(res, data, status = 200) {
    return this.jsonAPIOutput(res, 0, "Success", null, data, status);
  },
  statusServer:{
    OK:200,
    SERVER_ERROR:500,
    NOT_FOUND:404,
    BAD_REQUEST:400,
    UN_AUTHORIZED:401,
    
  }
};
