const jsonServer = require("json-server");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  const rawData = JSON.parse(fs.readFileSync("db.json", "utf-8"));

  if (typeof rawData.locations === "object" && !Array.isArray(rawData.locations)) {
    const formattedLocations = Object.keys(rawData.locations).map((key) => ({
      id: key,
      ...rawData.locations[key],
    }));

    req.url = "/locations";
    req.query = { ...req.query, _embed: "locations" };
    rawData.locations = formattedLocations;

    fs.writeFileSync("db.json", JSON.stringify(rawData, null, 2));
  }
  next();
});

server.use(middlewares);
server.use(router);

server.listen(5001, () => {
  console.log("✅ JSON Server running on http://localhost:5001");
});
