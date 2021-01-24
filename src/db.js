require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    {
        logging: false,
        native: false,
    }
);

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
    .filter(
        (file) =>
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, "/models", file)));
    });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
    Product,
    Category,
    Order,
    Linea_order,
    User,
    Reviews,
} = sequelize.models;

User.beforeCreate((user, options) => {
    return bcrypt
        .hash(user.password, 10)
        .then((hash) => {
            user.password = hash;
        })
        .catch((err) => {
            throw new Error();
        });
});

User.beforeUpdate((user, options) => {
    return bcrypt
        .hash(user.password, 10)
        .then((hash) => {
            user.password = hash;
        })
        .catch((err) => {
            throw new Error();
        });
});

Product.belongsToMany(Category, { through: "product_category", foreignKey: "product_id" });
Category.belongsToMany(Product, { through: "product_category", foreignKey: "category_id" });
Product.belongsToMany(Order, { through: Linea_order, foreignKey: "product_id" });
Order.belongsTo(User);
Order.belongsToMany(Product, { through: { model: Linea_order }, foreignKey: "orderId" });
Order.belongsTo(User);
User.hasMany(Order, { foreignKey: "userId" });
User.hasMany(Linea_order, { foreignKey: "userId" });
Linea_order.belongsTo(Order, { foreignKey: "orderId" });
Product.belongsToMany(User, { through: { model: Reviews }, foreignKey: "productId" });
User.belongsToMany(Product, { through: { model: Reviews }, foreignKey: "userId" });
Reviews.belongsTo(User);

module.exports = {
    ...sequelize.models,
    conn: sequelize,
};