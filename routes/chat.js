const express = require('express');
const router = express.Router();

const checkLogin = require('../bin/check').checkLogin;

// GET /chat 聊天界面
router.get('/', checkLogin, function (req, res, next) {
    let user = req.session.user.secondaryUser;
    res.render('chat', {
        username: user[0].username,
        userid: user[0]._id,
        room: req.session.user.name
    });
    next();
});

module.exports = router;