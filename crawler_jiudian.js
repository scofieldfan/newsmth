/**
 * Created by fanzhang on 17/2/24.
 */
/**
 * Created by fanzhang on 17/1/8.
 */


var Crawler = require("crawler");
var url = require('url');
var jsdom = require('jsdom');
var domain = "http://m.newsmth.net";

var detailCrawler = new Crawler({
    maxConnections: 1,
    rateLimit: 1000,
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            $("#m_main").find('.list').each(function (index, a) {
                var content = $(this).find("li").eq(1).find(".sp").text();
                console.log(content);
                console.log("crawling....");
            });
        }
        done();
    }
});

var listCrawler = new Crawler({
    maxConnections: 1,
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
                var money = $(this).find(".comment").find("a").eq(1).find("b").text();
                console.log(name,url,money);
            });

        }
        done();
    }
});

for(var i = 0 ;i<50;i++){
    if(i>0){
        listCrawler.queue('http://www.dianping.com/search/category/5/10/p'+(i+1));
    }else{

        listCrawler.queue('http://www.dianping.com/search/category/5/10/');
    }
}

//detailCrawler.queue('http://m.newsmth.net/article/Career_Upgrade/486708');
console.log("........");
