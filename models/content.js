const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const ContentPlace = new Schema({
    name:{ type: 'string', required: true},
    date:{type: Date, default: Date.now},
    content:{ type: 'string', required: true},
    room:{ type: 'string', required: true}

});

ContentPlace.index({ date:1});

mongoose.model('content', ContentPlace, 'content');