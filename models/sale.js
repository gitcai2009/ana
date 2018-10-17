const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const Usersale = new Schema({
    saleroom:{ type: Number, required: true},//利润
    loss:{ type: Number,default: 0},//坏账金额
    gift:{ type: Number,default: 0},//礼品金额
    belong:{ type: Boolean,default: true},//购买礼品方
    ratio:{ type: Number, required: true},//分成占比
    date:{ type: Date, default: Date.now},
    areaId:{ type: Schema.Types.ObjectId, ref: 'user.area'},
    placeId:{ type: Schema.Types.ObjectId, ref: 'place'}
}); 

/* const Usersale = new Schema({
    saleroom:{type: Number, required: true},//收入金额
    loss:{ type: Number,default: 0},//坏账金额
    gift:{ type: Number,default: 0},//礼品金额
    date:{type: Date, default: Date.now},
    machineId:{type: Schema.Types.ObjectId, ref: 'machine'},
    areaId:{type: Schema.Types.ObjectId, ref: 'user.area'},
    placeId:{type: Schema.Types.ObjectId, ref: 'place'}
});
 */
Usersale.index({ areaId:1 , saleroom:1});

mongoose.model('sale', Usersale, 'sale');
