var db = require('../shared/config')

const sequelize = db.sequelize
const Sequelize = db.Sequelize

var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    user_type: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    mobile: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    reset_password_token: {
        type: Sequelize.TEXT(),
        allowNull: true
    },
    reset_password_expires: {
        type: Sequelize.DATE
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    last_login: Sequelize.DATE
}, {
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

User.sync({force:false,alter:false});

module.exports = User