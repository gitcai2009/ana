const places = "<%= JSON.stringify(places) %>";
let map = new AMap.Map('container', {
    zoom:8,//级别
    center: [110.1, 19.1],//中心点坐标
    viewMode:'2D',//使用2D视图
    resizeEnable: true,//是否监控地图容器尺寸变化
});

let markers = [];
for(let i=0;i<places.length;i+=1){
    console.log(places[i]);
    markers.push(new AMap.Marker({
        position:places[i].coord,
        content: '<div style="background-color: hsla(0,95%,51%,0.7); height: 15px; width: 15px; border: 1px solid hsl(150,57%,3%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        offset: new AMap.Pixel(-15,-15)
    }))
}

map.plugin(['AMap.ToolBar','AMap.MarkerClusterer'], function() {
    let toolbar = new AMap.ToolBar({
        liteStyle:true,//精简模式
        position:'RB',
        locate:true,//定位
        noIpLocate:true//定位失败后使用IP定位
    });
    map.addControl(toolbar);//加载工具条

    let cluster = new AMap.MarkerClusterer(
        map,     // 地图实例
        markers,    // 海量点组成的数组
        {
            gridSize:80
        });
    map.addControl(cluster);
});




