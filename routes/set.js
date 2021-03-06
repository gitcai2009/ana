const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const UserModel = require('../proxy/users');
const PlaceModel = require('../proxy/places');
const MachinesModel = require('../proxy/machines');
const checkLogin = require('../bin/check').checkLogin;

// GET /setting 设置页
router.get('/',checkLogin,function (req, res, next) {
    const area = req.session.user.area;
    res.render('set',{
        areas:area
    });
    next();
});

// POST /setting/add_place 添加place
router.post('/add-place',checkLogin,function (req, res, next) {
    const author = req.session.user._id;
    const name = req.fields.placename;
    const comment = req.fields.comment;
    const areaid = req.fields.area;
    const coords = req.fields.coord;
    try {
        if (!name.length) throw new Error('请填写放置点名称');
        if (!comment.length) throw new Error('请填写备注');
        if (!areaid.length) throw new Error('请选择放置点所属区域');
        if (!coords.length) throw new Error('定位失败');
    } catch(e){
        req.flash('error', e.message);
        return res.redirect('back')
    }
    const coord = coords.split(",").map(function (val) {
        return Number(val)
    });
    let place = {
        name: name,
        coord:coord,
        comment:comment,
        author: author,
        areaId: areaid
    };
    PlaceModel.create(place).then(function () {
            req.flash('success', '添加成功');
            res.redirect('/set')
        }).catch(function (e) {
        if (e.message.match('duplicate key')){
            req.flash('error', '名称已被占用');
            res.redirect('/set')
        }
        next(e)
    })

});

// POST /setting/add_machine 添加machine
router.post('/add-machine',checkLogin,function (req, res, next) {
    const author =  req.session.user._id;
    const name = req.fields.name;
    const machineNo = req.fields.machineNo;
    const initialNo = req.fields.initialNo;

    try {
        if (!name.length) throw new Error('请填写机器名称');
        if (!machineNo.length) throw new Error('请填写机器编号');
        if (!initialNo.length) throw new Error('请填写机器初始金额');
    } catch(e){
        req.flash('error', e.message);
        return res.redirect('back')
    }

    let machine = {
        name:name,
        machineNo:machineNo,
        initialNo:initialNo,
        author: author,
        placeId: null
    };

    MachinesModel.getMachine(author, machineNo).then(function (docs) {
        try {
            if (docs) throw new Error('机器编号已被占用');
        }catch (e){
            req.flash('error', e.message);
            return res.redirect('/set')
        }

        MachinesModel.create(machine).then(function () {
            req.flash('success', '添加成功');
            res.redirect('/set')
        }).catch(function (e) {
            if (e){
                req.flash('error', '添加失败');
                res.redirect('/set')
            }
            next(e)
        });
    });
});

// POST /setting/add_secondaryUser 添加子用户
router.post('/add-secondaryUser',checkLogin,function (req, res, next) {
    const name = req.session.user.name;
    const username = req.fields.name;
    let password = req.fields.password;
    const repassword = req.fields.repassword;

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
        return res.redirect('/set')
    }

    //密码加密
    password = sha1(password);
    let secondaryUser = {
        username: username,
        userpass: password
    };

    UserModel.getUser(username).then(function (user) {
        if (user) {
            req.flash('error', '用户名被占用');
            res.redirect('/set');
        }else{
            UserModel.addSecondaryUser(name,secondaryUser)
            .then(function (result) {
                req.flash('success', '注册成功');
                res.redirect('/set');
            }).catch(function (e) {
                if (e.message.match('duplicate key')){
                    req.flash('error', '注册失败');
                    res.redirect('/set');
                }
                next(e)
            })
        }
    })
});


// GET /setting/remove 删除页
router.get('/remove',checkLogin,function (req, res, next) {
    const area = req.session.user.area;
    const author = req.session.user._id;

    MachinesModel.getMachineByAuthor(author).then(function (docs) {
        if (!docs) throw new Error('没有库存');
        res.render('remove', {
            areas: area,
            machines:docs
        })
    })
        .catch(next)
});

// POST /setting/remove_area 删除area
router.get('/remove-area', checkLogin, function (req, res, next) {
    const name = req.session.user.name;
    const areaid = req.query.area;
    try {
        if (!areaid.length) throw new Error('请选择需要删除的区域');
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back')
    }

    UserModel.deleteArea(name, areaid).then(function () {
        PlaceModel.deleteAreaPlace(areaid).then(function () {
            UserModel.getUser(name).then(function (docs) {
                req.session.user.area = docs.area;
                req.session.save();
            });
            req.flash('success', '删除区域成功');
            res.redirect('/set/remove')
        });
    }).catch(function (e) {
        if (e.message.match('duplicate key')) {
            req.flash('error', '删除区域失败');
            return res.redirect('back')
        }
        next(e);
    });
});

// POST /setting/remove_machine 删除machine
router.get('/remove-machine', checkLogin, function (req, res, next) {
    const author = req.session.user._id;
    const machineNo = req.query.machineNo;
    try {
        if (!machineNo.length) throw new Error('请填写要删除的机器编号');
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back')
    }
    MachinesModel.getMachine(author, machineNo).then(function (docs) {
        try {
            if (!docs) throw new Error('输入机器编号错误');
            if (docs.placeId !== null) throw new Error('请先回收该机器');
        }catch (e){
            req.flash('error', e.message);
            return res.redirect('back')
        }

        MachinesModel.deleteMachine(author, machineNo).then(function () {
            req.flash('success', '删除成功');
            res.redirect('back')
        })
            .catch(next)
    });
});

module.exports = router;