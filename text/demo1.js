const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Promise = require('bluebird');
const User = require('../models/mongo').User;
const Place = require('../models/mongo').Place;
const Machine = require('../models/mongo').Machine;
const Sale = require('../models/mongo').Sale;
const UserModel = require('../proxy/users');
const MachineModel = require('../proxy/machines');
const PlaceModel = require('../proxy/places');
const SaleModel = require('../proxy/sales');
const RecordedModel = require('../proxy/recordeds');
const dataTreating = require('../tools/dataTreating');

/*[ { _id: 5b518020c15b081ab08e6250, areaname: '海口区' },
    { _id: 5b518020c15b081ab08e624f, areaname: '三亚区' },
    { _id: 5b518020c15b081ab08e624e, areaname: '琼海区' },
    { _id: 5b518020c15b081ab08e624d, areaname: '东方区' } ]

 5b51816bea1b8918907cdb73
 5b51818999a5d804ecd8da1f
 5b5181cf4a29e70ce871fd9a
 5b5183869b34d42b148b2c02
 5b5183869b34d42b148b2c03
 5b5183869b34d42b148b2c04
 5b5183eff47c5f288c33b460
 5b5183eff47c5f288c33b461
 5b5183eff47c5f288c33b462
 5b5184559abb613ff04832b0
 5b5184559abb613ff04832b1
 5b5184559abb613ff04832b2


 用户 5b518020c15b081ab08e624c
    */
var author = '5b518020c15b081ab08e624c';
var areaid = [ObjectId('5b518020c15b081ab08e6250'),ObjectId('5b518020c15b081ab08e624f'),
    ObjectId('5b518020c15b081ab08e624e'),ObjectId('5b518020c15b081ab08e624d'),];

text = [
    { $match:{areaId:{$in:areaid}}},
    { $project:{ "year":{$year:"$date"},saleroom:1,gift:1,loss:1,areaId:1}},
    { $match: { "year": (new Date()).getFullYear()}},
    { $group: { _id: "$areaId", saleSum:{ $sum: "$saleroom"},lossSum:{$sum:'$loss'},giftSum:{$sum:'$gift'}}},
    { $sort:{_id:1}}
    ];

const area = [
    { _id:'5b518020c15b081ab08e6250', areaname: '海口区' },
    { _id:'5b518020c15b081ab08e624f', areaname: '三亚区' },
    { _id:'5b518020c15b081ab08e624e', areaname: '琼海区' },
    { _id:'5b518020c15b081ab08e624d', areaname: '东方区' }
];

var areaid1 = [ObjectId('5b518020c15b081ab08e6250')];

PlaceModel.getPlaceTime(areaid).then(function(docs){
    var data = dataTreating.replaceAreaid(area,docs);
    console.log(data);
});

/* const p = '123.12312,124.151';
const arr = p.split(",").map(function (val) {
    return Number(val) + 1
});
console.log(arr); */

/*Sale.aggregate([
    // { $project:{area:1}},
    {$match:{areaname:'海口区'}},
    {$lookup:{
        from: "place",
        localField: "placeId",
        foreignField: "_id",
        as: "place"
    }},
    {$lookup:{
        from: "user",
        localField: "place.areaid",
        foreignField: "area._id",
        as: "user"
    }}
   /!* { $project:{"area.areaname":1,
        "machine.machineNo":1,
        "sale.loss":1,
        "sale.machineNo":1}},*!/
    // { $group: { _id:"$sale.machineNo", Sum:{ $sum: "$sale.loss"}}}

]).
then(function (docs) {
    console.log(docs[0])
});*/

/*Sale.find({machineNo:1}).
    populate('placeId','name').
    exec(function(err,catetories){
        if (err) {
            console.log(err);
        }
        console.log(catetories);
});*/

/*Promise.all([
    SaleModel.getMonthAreaSale(areaname),
    SaleModel.getAreaLossSum(areaname)
]).then(function (result) {
    const lineData = dataTreating.lineData(areaname,result[0]);
    const shadowData = dataTreating.shadowData(areaname,lineData,result[1]);
console.log(shadowData)
});*/
