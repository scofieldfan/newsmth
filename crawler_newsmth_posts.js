/**
 * Created by fanzhang on 17/1/8.
 */


var Crawler = require("crawler");
var url = require('url');
var domain = "http://m.newsmth.net";

var detailCrawler = new Crawler({
    maxConnections: 1,
    rateLimit: 2000,
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

var pageCrawler = new Crawler({
    maxConnections: 1,
    rateLimit: 2000,
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            $("#m_main").find('li').each(function (index, a) {
                var title = $(this).find("a").eq(0).text();
                var url = $(this).find("a").eq(0).attr("href");


                var html = $(this).find("div").eq(1).text();
                if (html) {
                    var createHTML = html.split("|");
                    var specChar = String.fromCharCode(160);
                    var str = createHTML[0].split(specChar);
                    var createTime = str[0];
                    var createAuthor = str[1];
                    var data = {
                        title: title,
                        url: url,
                        createTime: createTime,
                        createAuthor: createAuthor,
                    };
                    console.log('index............:'+url);
                    detailCrawler.queue(domain+"/"+url);
                    console.log(data);
                }
            });

        }
        done();
    }
});

/**/
for (var i = 0; i < 2; i++) {
    pageCrawler.queue(domain + '/board/Career_Upgrade?p=' + i);
}

//detailCrawler.queue('http://m.newsmth.net/article/Career_Upgrade/486708');
console.log("........");
