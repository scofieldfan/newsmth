var Crawler = require("crawler");
var download = require('./lib/download');


var start = 0;
var c = new Crawler({
    maxConnections : 1,
    rateLimit:2000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            console.log(res.body);
            var items  = JSON.parse(res.body).data;
            items.forEach(function(item){
                if(item && item.middleURL){
                    console.log(item.middleURL);
                        download(item.middleURL, './downloads/',function(){
                    });
                }
            });
        }
        done();
    }
});
console.log("download girls.....");
for(var i = 0 ;i< 10;i++ ){
    start = i*30;
    var downloadUrl = `http://pic.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E7%BE%8E%E5%A5%B3&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=%E7%BE%8E%E5%A5%B3&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&cg=girl&pn=${start}&rn=30&gsm=3c00000000003c&1483873708235=`;;
    console.log(downloadUrl);
     c.queue(downloadUrl);
}
