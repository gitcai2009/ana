module.exports = {
    newtip1: function newtip1(areaId, date) {
        const text = {};
        if (areaId){
            let id = date.id;
            let index = id.indexOf(areaId);
            text.id=date.id[index];
            text.name=date.name[index];
            text.sale=date.sale[index];
            text.loss=date.loss[index];
            text.gift=date.gift[index];
            text.profit=date.profit[index];
            return text
        }else {
            let saleSum = 0;
            (date.sale).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    saleSum += item;
                }
            });
            let lossSum = 0;
            (date.loss).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    lossSum += item;
                }
            });
            let giftSum = 0;
            (date.gift).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    giftSum += item;
                }
            });
            let proSum = 0;
            (date.profit).forEach(function (item) {
                if ((typeof item != "string") && Number(item) == parseFloat(item)) {
                    proSum += item;
                }
            });
            text.sale = saleSum;
            text.loss = lossSum;
            text.gift = giftSum;
            text.profit = proSum;
            return text
        }

    },
    newtip: function newtip(areaId, data) {
        let text = {
            saleSum: 0,
            lossSum: 0,
            giftSum: 0,
            sum: 0,
        };
        if(areaId){
            let sa = 0;let l = 0;let g = 0;let su = 0;
            for(let j=0;j<data.length;j++){
                if ((data[j].areaId) == areaId) {//是否同区
                   let s= data[j].saleroom;
                   let lo= data[j].loss;
                   let gi= data[j].gift;
                   let ratio = (data[j].ratio)/100;
                   sa += s;
                   l += lo;
                   g += gi;
                   if(data[j].belong){
                       su += (s+gi)/ratio + lo + gi;
                   }else{
                       su += s/ratio + lo + gi;
                   }
                }
           }
           text.saleSum = sa;
           text.lossSum = l;
           text.giftSum = g;
           text.sum = Math.round(su);
           return text
        }else{
            let sa = 0;let l = 0;let g = 0;let su = 0;
            for(let j=0;j<data.length;j++){
                let s= data[j].saleroom;
                let lo= data[j].loss;
                let gi= data[j].gift;
                let ratio = (data[j].ratio)/100;
                sa += s;
                l += lo;
                g += gi;
                if(data[j].belong){
                    su += (s+gi)/ratio + lo + gi;
                }else{
                    su += s/ratio + lo + gi;
                }
           }
           text.saleSum = sa;
           text.lossSum = l;
           text.giftSum = g;
           text.sum = Math.round(su);
           return text
        }
    
       
    },

    lineData: function lineData(area, sale) {
        const data = [];
        for (let i=0;i<area.length;i++) {
            let monthSale = ['-','-','-','-','-','-','-','-','-','-','-','-'];
            for (let j = 0; j < sale.length; j++) {
                if ((area[i]._id) == sale[j]._id.areaId){//是否同区
                    monthSale[((sale[j]._id.month)-1)] = sale[j].monthAreaSale;
                }
            }
            const text = {name:area[i].areaname,sale:monthSale};
            data.push(text);
        }
        return data
    },

    shadowData: function shadowData(area,data) {
        let id = [],name = [],sale = [],loss = [],gift = [],sum = [];

        for (let i=0;i<area.length;i++){
            id.push(area[i]._id);
            name.push(area[i].areaname);//区域名

            let sa = 0;let l = 0;let g = 0;let su = 0;
            for(let j=0;j<data.length;j++){
                 if ((data[j].areaId)==(area[i]._id)) {//是否同区
                    let s= data[j].saleroom;
                    let lo= data[j].loss;
                    let gi= data[j].gift;
                    let ratio = (data[j].ratio)/100;
                    sa += s;
                    l += lo;
                    g += gi;
                    if(data[j].belong){
                        su += (s+gi)/ratio + lo + gi;
                    }else{
                        su += s/ratio + lo + gi;
                    }
                 }
            }
            sale.push(sa);
            loss.push(-l);
            gift.push(-g);
            sum.push(Math.round(su));
        }

        let da = {
            id:id,
            name: name,
            sale: sale,
            loss: loss,
            gift:gift,
            sum: sum
        };

        return da
    },

    tablelData: function tablelData(area, data) {
        const result = [];
        for (let i=0;i<data.length;i++){
            for (let y =0;y<area.length;y++){
                if ((data[i]._id.areaId)==(area[y]._id)) {//是否同区
                    const te = {
                        areaName: area[y].areaname,
                        placeName: data[i]._id.name[0],
                        value: data[i].Sum
                    };
                    result.push(te);
                }
            }
        }
        return result
    },

    replaceAreaid: function replaceAreaid(area, data) {
        const result = [];
         for (let y =0;y<area.length;y++){
            for (let i=0;i<data.length;i++){
                if ((data[i].areaId)==(area[y]._id)) {//是否同区
                    data[i].areaId = area[y].areaname
                }
            }
        }
        return data
    },

    placeAnalyse: function placeAnalyse(areaid,data) {
        if (areaid){
            return data.filter(function (item) {
                return item.areaId == areaid;
            })
        }
        return data
    },

    regroupRecorded: function regroupRecorded(data,areaId,placeId,saleId){
        const rData = [];
        let index = data.initial;
        for(var i = 0;i < index.length; i++){
            let count = data.initial[i] - data.oidInitial[i];
            const text = {
                recorded:count,
                machineId: data.machineId[i],
                areaId:areaId,
                placeId:placeId,
                saleId:saleId
            }
            rData.push(text);
        }
        return rData
    },

    SaleroomSum: function SaleroomSum(data){
        let loss = parseInt(data.loss);
        let gift = parseInt(data.gift);
        let belong = data.belong;
        let ratio = (data.newratio)/100;
        let index = data.initial;
        let sum = 0;
        for(var i = 0;i < index.length; i++){
            const initial = data.initial[i];
            const oidInitial = data.oidInitial[i];
            let count = initial - oidInitial;
            sum += count;
        }
        if(belong){
            return (sum - loss - gift)*ratio + gift
        }else{
            return (sum - loss - gift)*ratio
        }
    }

};