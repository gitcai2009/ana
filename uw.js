var Service = require('node-windows').Service;

var svc = new Service({
    name:'analyze',
    description: 'start web server.',
    script: 'D:\MyText\analyze\index.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();