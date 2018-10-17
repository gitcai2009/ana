const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const models = require('../models/mongo');
const Recorded = models.Recorded;


module.exports = {
    create: function create(data) {
        return Recorded.insertMany(data)
    },


    //根据placeId查询的recorded
    getRecordedByplaceid: function getRecordedByplaceid(placeId) {
        return Recorded.aggregate([
            {$match:{placeId:ObjectId(placeId)}},
            {$lookup:{
                from: "machine",
                localField: "machineId",
                foreignField: "_id",
                as: "ma"
            }},
            {$project:{recorded:1,"name":'$ma.name',"index":'$ma.machineNo'}},
            {$group:{_id:{index:"$index",name:"$name"}, sum:{$sum:"$recorded"}}},
            {$sort:{ sum: -1 }}
        ]).exec()
    },

};