const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserRecorded = new Schema({
    recorded:{type: Number, required: true},//机器最新记录值
    date:{type: Date, default: Date.now},
    machineId:{type: Schema.Types.ObjectId, ref: 'machine'},
    areaId:{type: Schema.Types.ObjectId, ref: 'user.area'},
    placeId:{type: Schema.Types.ObjectId, ref: 'place'}
});

UserRecorded.index({ placeId:1 , areaname:1});

mongoose.model('recorded', UserRecorded, 'recorded');