const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const fs = require('fs');
const path = require('path');
const ap = path.join(__dirname, "../tools/content/");

const checkNotLogin = require('../bin/check').checkNotLogin;
const UserModel = require('../proxy/users');

router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signup')
});

router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name;
    let password = req.fields.password;
    const repassword = req.fields.repassword;
    let contentPath = ap + name + '.txt';

    try {
        if (!(name.length >= 1 && name.length <= 10 )){
            throw new Error('名字请限制在 1-10 个字符')
        }
        if (password.length < 6){
            throw new Error('密码至少6个字符')
        }
        if (password !== repassword){
            throw new Error('两次输入的密码不一致')
        }
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('/signup')
    }

    //密码加密
    password = sha1(password);
    let user = {
        name: name,
        password: password
    };

    UserModel.getUser(name).then(function (data) { 
        if (data) {
            req.flash('error', '用户名被占用');
            res.redirect('/signup');
        } else {
            UserModel.create(user)
                .then(function (result) {
                    user = result;
                    user.password = null;
                    delete user.password;
                    user.secondaryUser = { _id: user._id, username: user.name };
                    req.session.user = user;
                    fs.writeFile(contentPath, "", function (err) {
                        if (err) {
                            console.log('创建文件失败')
                        }
                    })
                    req.flash('success', '注册成功');
                    res.redirect('/plat')
                }).catch(function (e) {
                    if (e.message.match('duplicate key')) {
                        req.flash('error', '注册失败');
                        res.redirect('/signup')
                    }
                    next(e)
                })
        }
    })
});

module.exports = router;