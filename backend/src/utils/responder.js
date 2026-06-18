const responderOk = (res, status, message, data = null) => {
  return res.status(status).json({
    ok: true,
    message,
    data
  });
};

const responderError = (res, status, message, error = null) => {
  return res.status(status).json({
    ok: false,
    message,
    error: error ? error.message || error : null
  });
};

module.exports = {
  responderOk,
  responderError
};
