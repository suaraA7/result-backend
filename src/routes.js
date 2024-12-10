const { postPredictHandler, getHistory } = require("./handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getHistory,
  },
];

module.exports = routes;
