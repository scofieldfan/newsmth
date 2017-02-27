/**
 * Created by fanzhang on 17/2/24.
 */
/**
 * Created by fanzhang on 17/1/8.
 */


var fs = require('fs');
var Crawler = require("crawler");
var url = require('url');
var domain = "http://m.newsmth.net";
var data = [];
var map = {};
var detailCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            if($){
                var url = res.request.uri.path;
                console.log("url:",url);
                var id = url.replace('/shop/','').trim();
                var money =  $("#avgPriceTitle").text().replace("￥","");;
                var bread1 = $(".breadcrumb").find("a").eq(0).text();
                var bread2 = $(".breadcrumb").find("a").eq(1).text();
                var bread3 = $(".breadcrumb").find("a").eq(2).text();
                var bread4 = $(".breadcrumb").find("a").eq(3).text();
                var bread5 = $(".breadcrumb").find("a").eq(4).text();
                var stars = $("#basic-info").find(".brief-info").find("span").eq(0).attr("title");
                var address = $(".expand-info").eq(0).find(".item").text() 
                var tel = $(".expand-info").eq(1).find(".item").text() 
                /*
                var recommend1 = $(".recommend-name").find(".item").eq(0).attr("title") ;
                var recommend2 = $(".recommend-name").find(".item").eq(1).attr("title") ;
                var recommend3 = $(".recommend-name").find(".item").eq(2).attr("title") ;
                */
                var object  = map[id];
                object["location"] = bread1.replace(/\n/g,'').trim();
                object["shangquan"] = bread2.replace(/\n/g,'').trim();
                object["type"] = bread3.replace(/\n/g,'').trim();
                object["address"] = address.replace(/\n/g,'').trim();
                object["tel"] = tel;
                object["stars"] = stars;
                console.log("detail:",object);
                console.log("stars:",stars);
                var output = [];
                output.push(object["id"]);
                output.push(object["url"]);
                output.push(object["name"]);
                output.push(object["money"]);
                output.push(object["location"]);
                output.push(object["shangquan"]);
                output.push(object["type"]);
                output.push(object["address"]);
                output.push(object["tel"]);
                output.push(object["stars"]);
                console.log(output.join(","));
                writeFile(output.join(",")+"\r\n");
                // console.log(name,money,bread1,bread2,bread3,bread4,bread5);
            }
        }
        done();
    }
});

var listCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    userAgent:'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            $("#shop-all-list").find('li').each(function (index, a) {
                var url = $(this).find(".tit").find("a").eq(0).attr("href");
                var name = $(this).find(".tit").find("a").eq(0).attr("title");
                var money = $(this).find(".comment").find("a").eq(1).find("b").text().replace("￥","");
                money = parseInt(money);
                if(money>80){
                    var id = url.replace('/shop/','').trim();
                    var obj = {
                        id:id,
                        url:url,
                        name:name,
                        money:money
                    }
                    data.push(obj);
                    map[id]=obj;
                    detailCrawler.queue("http://www.dianping.com"+url);
                }
                
            });

        }
        done();
    }
});
for(var j = 1 ;j<10;j++)
for(var i = 0 ;i<10;i++) 

{
    if(i>0){
        listCrawler.queue('http://www.dianping.com/search/category/'+j+'/10/p'+(i+1));
    }else{

        listCrawler.queue('http://www.dianping.com/search/category/'+j+'/10/');
    }
}

//detailCrawler.queue('http://m.newsmth.net/article/Career_Upgrade/486708');
console.log("........");

function writeFile(data){
    fs.appendFile('./jiudina.csv',data,'utf8',function(err){  
    if(err)  
    {  
        console.log(err);  
    }  
});  
}
