const server = require("./src/app.js");
const { conn } = require("./src/db.js");

conn.sync({ force: false }).then(() => {
    server.listen(process.env.PORT || 3001, () => {
        console.log(`listening at ${process.env.PORT}"); // eslint-disable-line no-console
    });
});