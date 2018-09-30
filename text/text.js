const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Promise = require('bluebird');
const User = require('../models/mongo').User;
const Place = require('../models/mongo').Place;
const Area = require('../models/mongo').Area;
const Sale = require('../models/mongo').Sale;
const UserModel = require('../proxy/users');
const AreaModel = require('../proxy/areas');
const PlaceModel = require('../proxy/places');
const SaleModel = require('../proxy/sales');
const dataTreating = require('../tools/dataTreating');

const users = new User({
  name: 'xiao',
  password: '123456'
});

const areas = new Area({
    areaname: '三亚区'

});

const places = new Place({
    areaId: '5b39924da3ff1d2c58b2a523',
    placename: '三亚2',
    coord: [109.49,18.29],
    activate: true,
    comment: '2点'
});

const sales = new Sale({
    areaId: '5b39924da3ff1d2c58b2a523',
    placeId: '5b3997c53b41e03238a8ec83',
    saleroom: 1000,
    loss: 50,
    damage: 8
});
const ai = '5b398f6d623413103ce85fcc';
const areaid = ObjectId('5b398f6d623413103ce85fcc');
const placeid = '5b398f6d623413103ce85fcd';
const saleid = '5b398f6d623413103ce85fce';

//重命名字段
// Sale.updateMany({}, {$rename : {"damage" : "gift"}}, false, true);

// console.log(typeof j);
const text =[
    { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1,placeId:1,areaId:1}},
    { $match: { "year_data": (new Date()).getFullYear()}},
    { $group: { _id:{ placeId:"$placeId", areaId:"$areaId" }, saleSum:{ $sum: "$saleroom"}}},
    { $sort:{ saleSum:-1 }},
    { $limit: 20 }
];

Sale.find({})
    .populate(
        {path: 'areaId',
            match:{areaname:'海口区'},
            select:'areaname',
            options: {sort: { saleroom: -1 }}}
    )
    .then(function (docs) {
        console.log(docs)
});

/*const tt = PlaceModel.getCoordByid();
 tt.then(function (docs) {
 console.log(docs);

 .find(query)
 .populate({ path: 'author' })
 .sort({_id: -1})
 .lean()

 });*/

/*Place.find({areaId:areaId,activate:true},'coord').sort({_id:-1}).then(function (docs) {
    console.log(docs)
});*/

/*Place.find({_id:author},'coord',function (err, docs) {
  console.log(docs);
});*/


//spread(function(a1,a2,a3){});a1,a2,a3 分别对应了三个异步方法对应的返回值
function add() {
    Promise.all([areas.save()]).spread(function (user) {
        places.areaId = user;
        sales.areaId = user;
        return Promise.all([places.save(),sales.save()])
    }).spread(function (place, sale) {
        sale.placeId = place;
        return Promise.all([sale.save()])
    }).spread(function () {
        console.log('success');
    }).catch(function (reason) {
        console.log(reason)
    });
}
// add();