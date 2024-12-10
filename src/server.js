const Hapi = require("@hapi/hapi");
const routes = require("./routes");

(async () => {
  const server = Hapi.server({
    port: 3001,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello, World!";
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
