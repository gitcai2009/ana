const models = require('../models/mongo');
const Place = models.Place;

module.exports = {
    create: function create(place) {
        return Place.create(place)
    },

    //根据placeId获取一个place信息
    getPlaceById: function getPlaceById(placeId){
        return Place.find({_id:placeId}).exec()
    },
    //获取用户所有坐标
    getCoordByid: function getCoordByid(author) {
        return Place
            .find({ author:author },{_id:0})
            .exec()
    },

    //获取用户所有的place
    getPlace: function getPlace(author) {
        return Place.find({ author:author }).exec()
    },

    //获取区域所有palce
    getPlaceAreaid: function getPlaceAreaid(areaId) {
        return Place.find({ areaId:areaId }) .sort({name:1}).exec()
    },

    //用户所有place欠款
    getPlaceTime: function getPlaceTime(areaId) {
        return Place.aggregate([
            { $match:{areaId:{$in:areaId},arrears:{$ne:0}}},
            { $project:{ "time":{$dateToString: { format: "%Y-%m-%d", date: "$date" }},name:1,arrears:1,areaId:1}},
            { $sort:{ time:1 }},
        ]).exec()
    },

    //修改备注
    updataPlace: function updataPlace(placeId, data) {
        return Place.updateOne({_id: placeId},data).exec()
    },

    //删除一个放置点
    deleteOnePlace: function deleteOnePlace(placeId) {
        return Place.deleteOne({_id: placeId}).exec()
    },

    //删除区域内所有放置点
    deleteAreaPlace: function deleteAreaPlace(areaId) {
        return Place.deleteMany({areaId: areaId}).exec()
    }

};