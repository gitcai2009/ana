const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const checkNotLogin = require('../bin/check').checkNotLogin;
const UserModel = require('../proxy/users');

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name;
    const password = req.fields.password;

    try {
        if (!name.length) throw new Error('请填写用户名');
        if (!password.length) throw new Error('请填写密码');
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back')
    }

    UserModel.getUser(name)
        .then(function (user) {
            let pw = sha1(password);
            let array = user.secondaryUser;
            let secondaryUser = array.filter(function(item){
                return item.username == name
            });

            if (!user){
                req.flash('error', '用户不存在');
                return res.redirect('back')
            }
            if(name == user.name){
                if (pw !== user.password){
                    req.flash('error', '用户名或密码错误');
                    return res.redirect('back')
                }
                user.secondaryUser = {_id:user._id, username:user.name};
            }else{
                if (pw !== secondaryUser[0].userpass){
                    req.flash('error', '用户名或密码错误');
                    return res.redirect('back')
                }
                user.secondaryUser = {_id:secondaryUser[0]._id, username:secondaryUser[0].username};
            }

            req.flash('success', '登录成功');
            user.password = null;
            result = user;
            delete result.password;
            req.session.user = result;
            res.redirect('/plat')
    }).catch(next)

});

module.exports = router;