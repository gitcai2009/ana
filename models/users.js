const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: 'string',unique: true,required: true},
    password: {type: 'string', required:true},
    area:[{
        areaname:{type: 'string'}
    }],
    secondaryUser:[{
        username: { type: 'string'},
        userpass:{type: 'string'}
    }]
});

UserSchema.index({name: 1});

mongoose.model('user', UserSchema, 'user');