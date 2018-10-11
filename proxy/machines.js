const models = require('../models/mongo');
const Machine = models.Machine;

module.exports = {
    create: function create(date) {
        return Machine.create(date);
    },

    getMachine: function getMachine(author,maNo) {
        return Machine.findOne({author:author,machineNo:maNo}).exec();
    },

    getMachineByPlaceid: function getMachine(placeId) {
        return Machine.find({placeId: placeId}).exec();
    },

    getMachineByAuthor: function getCount(author) {
        return Machine.find({author: author}).exec()
    },

    getCount: function getCount(author) {
        return Machine.count({author: author}).exec()
    },

    getNoCount: function getNoCount(author) {
        return Machine.count({author: author,placeId:{$ne:null}}).exec()
    },

    updateMachine: function updateMachine(author,maNo,date) {
        return Machine.updateOne({author:author,machineNo:maNo},{$set:date}).exec()
    },
    updateMachineById: function updateMachineById(id,date) {
        return Machine.updateOne({_id:id},{$set:date}).exec()
    },

    deleteMachine: function deleteMachine(author,machineNo) {
        return Machine.deleteOne({author:author, machineNo: machineNo}).exec()
    }
};