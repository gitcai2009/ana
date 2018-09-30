exports.agg =[

    //***********地图页参数*************
    // 今年总收入
    [
        { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: {"$year": "$date"}, saleSum:{ $sum: "$saleroom"}}}
    ],
    // 今年总坏账
    [
        { $project:{ "year_data":{$year:"$date"},date:1,loss:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: {"$year": "$date"}, lossSum:{ $sum: "$loss"}}}
    ],


    //**********折线图**************
    // 各月总收入
    [
        { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: {"$month": "$date"}, monthSale:{ $sum: "$saleroom"}}},
        { $sort:{_id:1}}
    ],
    // 区各月总收入
    [
        { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1,areaId:1}},
        { $match: { "year_data": (new Date()).getFullYear(), "areaId":areaid}},
        { $group: { _id: {"$month": "$date"}, monthAreaSale:{ $sum: "$saleroom"}}},
        { $sort:{_id:1}}
    ],
    //单次多量查找一般比多次少量查找效率高
    [
        { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1,areaId:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: {month:{"$month": "$date"},areaId:"$areaId"}, monthAreaSale:{ $sum: "$saleroom"}}},
        { $sort:{_id:1}}
    ],


    //**********旋风条形图**************
    // 区总收入排序***饼图***
    [
        { $project:{ "year_data":{$year:"$date"},saleroom:1,areaId:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: "$areaId", areaSaleSum:{ $sum: "$saleroom"}}}
    ],
    // 区总坏账排序
    [
        { $project:{ "year_data":{$year:"$date"},loss:1,areaId:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id: "$areaId", areaLossSum:{ $sum: "$loss"}}}
    ],


    //**********排序**************
    // 点总收入排序
    [
        { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1,placeId:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id:"$placeId", saleSum:{ $sum: "$saleroom"}}},
        { $sort:{ saleSum:-1 }},
        { $limit: 20 }
    ],
    // 点总坏账排序
    [
        { $project:{ "year_data":{$year:"$date"},date:1,loss:1,placeId:1}},
        { $match: { "year_data": (new Date()).getFullYear()}},
        { $group: { _id:"$placeId", lossSum:{ $sum: "$loss"}}},
        { $sort:{ lossSum:-1 }},
        { $limit: 20 }
    ],





// 每月损坏排序
[
    { $project:{ "year_data":{$year:"$date"},date:1,loss:1}},
    { $match: { "year_data": (new Date()).getFullYear()}},
    { $group: { _id: {"$month": "$date"}, monthLoss:{ $sum: "$loss"}}},
    { $sort:{_id:1}}
],

// 区每月损坏排序
[
    { $project:{ "year_data":{$year:"$date"},date:1,loss:1,areaId:1}},
    { $match: { "year_data": (new Date()).getFullYear(), "areaId":areaid}},
    { $group: { _id: {"$month": "$date"}, monthLoss:{ $sum: "$loss"}}},
    { $sort:{_id:1}}
],
// 点每月收入排序
[
    { $project:{ "year_data":{$year:"$date"},date:1,saleroom:1,placeId:1}},
    { $match: { "year_data": (new Date()).getFullYear(), placeId:placeid}},
    { $group: { _id: {"$month": "$date"}, monthPlaceSale:{ $sum: "$saleroom"}}},
    { $sort:{_id:1}}
],
// 点每月损坏排序
[
    { $project:{ "year_data":{$year:"$date"},date:1,loss:1,placeId:1}},
    { $match: { "year_data": (new Date()).getFullYear(), placeId:placeid}},
    { $group: { _id: {"$month": "$date"}, monthPlaceLoss:{ $sum: "$loss"}}},
    { $sort:{_id:1}}
]
];