const models = require('../models/mongo');
const User = models.User;

module.exports = {
    //保存聊天记录
    create: function create(data) {
        return User.insertMany(data);
    },
    //获取聊天记录
    getUser: function getUser(number) {
        return User.find().limit(number).sort({date:1}).exec()
    },
};