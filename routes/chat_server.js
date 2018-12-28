const contentModel = require('../proxy/content');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const _ = require('underscore');
const ap = path.join(__dirname, "../tools/content/");

const onlineUser = {};

module.exports = function(io){
    io.on('connection', function (socket) {

        //监听新用户加入
        socket.on('login', function(data){
            let userid = data.userid;
            let username = data.username;
            let room = data.room;
            let contentPath = ap + room + '.txt';
            socket.join(room);
            socket.name = userid; 
            
            if(onlineUser.hasOwnProperty(room)){
                //房间已存在,把新用户加入房间
                let lineUser = onlineUser[room][0];
                if(!lineUser.hasOwnProperty(userid)){
                    onlineUser[room][0][userid] = username;
                }
            }else{
                 //房间不存在,创建并加入房间
                let userlien = {};
                userlien[userid] = username;
                onlineUser[room] = [userlien]
            }
            fs.readFile(contentPath,'utf8', function  (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    let chatRecords = parseContent(result, contentPath);
                    let count = chatRecords[2];
                    io.emit('login', {
                        onlineUser: onlineUser[room][0],
                        chatRecords: chatRecords[0],
                        room: room,
                        index: chatRecords[1]
                    })
                }
            })
        })

        //监听用户发布聊天内容
        socket.on('message',function (data) {
            let date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            let contentPath = ap + data.room + '.txt';
            let chatmessage = {
                username: data.username,
                content: data.content,
                date: date,
                room: data.room
            };
            let text = JSON.stringify(chatmessage);
            text = text + '\r\n';
            
            fs.writeFile(contentPath, text, {flag:"a"}, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    io.to(data.room).emit('message', data)
                }
            })
        });

        //获取更多聊天记录
        socket.on('getcontent', function (data) {
            let room = data.room;
            let index = data.index;
            let userid = data.userid;
            let contentPath = ap + room + '.txt';
           
            fs.readFile(contentPath,'utf8',function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    let chatRecords = moreInfo(result, index);
                    let tosocket;
                    tosocket = _.findWhere(io.sockets.sockets, { name: userid });
                    tosocket.emit('getcontent', {
                        chatRecords: chatRecords[0],
                        index: chatRecords[1]
                    })
                }
            })
        })

        //用户退出
        socket.on('disconnecting',function(){
            let rooms = Object.keys(socket.rooms);
            let room = rooms[1];
            if(onlineUser.hasOwnProperty(room)){
                if(onlineUser[room][0].hasOwnProperty(socket.name)){
                    delete onlineUser[room][0][socket.name];
                    io.to(room).emit('logout',{
                        onlineUser: onlineUser[room][0],
                        room: room
                    })
                }
            }
        });
    })
}

function parseContent(data, path) {
    let text = [];
    let i = 0;
    let arr = data.split("\r\n");
    arr.pop();
    let count = arr.length;
    if (count > 50) {
        i = count - 50;
    }
    let index = i;
    if (data) {
        for (i; i < count; i++) {
            text.push(JSON.parse(arr[i]));
        }
    }

    //聊天信息超过1000条时，那就删除前500条
    if (count >= 1000) {
        let newdata = JSON.stringify(arr.slice(500,count));
        newdata += '\r\n'
        fs.writeFileSync(path, newdata, { encoding: 'utf8', flag: 'w' }, function (err) {
            if (err) throw err;
            index = index - 500;
            count = count - 500;
        })
    }

    return [text, index, count]
}

function moreInfo(data, index) {
    let text = [];
    let i = 0;
    let arr = data.split("\r\n").slice(0, -1);
    if (index >= 50) {
        i = index - 49;
    }
    let ind = i;
    if (data) {
        for (i; i <= index; i++) {
            text.push(JSON.parse(arr[i]));
        }
    }
    return [text, ind]
}