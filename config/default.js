module.exports = {
    post:3000,
    session: {
        secret: 'analyze',
        key: 'analyze',
        //30天
        // maxAge: 2592000000
        //一周
        // maxAge: 604800000
        //一天
        maxAge:86400000
    },
    mongodb: 'mongodb://localhost:27017/analyze'
};