/**
 * Created by fanzhang on 17/1/8.
 */


var fs = require('fs');
var Crawler = require("crawler");
var url = require('url');
var s = new Set();
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
            if ($) {
                var url = res.request.uri.path;

                var id = url.replace('/shop/', '').trim();
                var money = $("#avgPriceTitle").text().replace("￥", "");
                ;
                var bread1 = $(".breadcrumb").find("a").eq(0).text();
                var bread2 = $(".breadcrumb").find("a").eq(1).text();
                var bread3 = $(".breadcrumb").find("a").eq(2).text();
                var bread4 = $(".breadcrumb").find("a").eq(3).text();
                var bread5 = $(".breadcrumb").find("a").eq(4).text();
                var stars = $("#basic-info").find(".brief-info").find("span").eq(0).attr("title");
                var address = $(".expand-info").eq(0).find(".item").text()
                var tel = $(".expand-info").eq(1).find(".item").text()

                var kouweiScore = $("#comment_score").find(".item").eq(0).text().replace("口味：", "").trim();
                var huanjingScore = $("#comment_score").find(".item").eq(1).text().replace("环境：", "").trim();
                var fuwuScore = $("#comment_score").find(".item").eq(2).text().replace("服务：", "").trim();

                var object = map[id];
                object["location"] = bread1.replace(/\n/g, '').trim();
                object["shangquan"] = bread2.replace(/\n/g, '').trim();
                object["type"] = bread3.replace(/\n/g, '').trim();
                object["address"] = address.replace(/\n/g, '').trim();
                object["tel"] = tel;
                object["stars"] = stars;
                object["kouweiScore"] = kouweiScore;
                object["huanjingScore"] = huanjingScore;
                object["fuwuScore"] = fuwuScore;
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
                output.push(object["kouweiScore"]);
                output.push(object["huanjingScore"]);
                output.push(object["fuwuScore"]);
                console.log("beigin crawle 详情 url:", object["dir"], url);
                console.log("...........");
                writeFile('./jiudian.csv', output.join(",") + "\r\n");
                // console.log("end crawle url:",object["dir"],url);
                writeFile('./detailIds.csv', id + ",");
            }
        }
        done();
    }
});

var listCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            var listUrl = res.request.uri.path.replace('/search/category', '');
            console.log("begin crawle 列表:", listUrl);
            $("#shop-all-list").find('li').each(function (index, a) {
                var detailUrl = $(this).find(".tit").find("a").eq(0).attr("href");
                var name = $(this).find(".tit").find("a").eq(0).attr("title");
                var money = $(this).find(".comment").find("a").eq(1).find("b").text().replace("￥", "");
                money = parseInt(money);
                if (money > 80) {
                    var id = detailUrl.replace('/shop/', '').trim();
                    var obj = {
                        id: id,
                        url: detailUrl,
                        name: name,
                        money: money,
                        dir: listUrl
                    }
                    data.push(obj);
                    map[id] = obj;
                    //console.log("queue detail:", detailUrl);
                    //detailCrawler.queue("http://www.dianping.com" + detailUrl);
                    writeFile('./listIds.csv', listUrl + ",");
                    if (!detailSet.has(id)) {
                        console.log("queue detail:", detailUrl);
                        detailCrawler.queue("http://www.dianping.com" + detailUrl);
                    } else {
                        console.log("重复 detail:", detailUrl);
                    }
                }

            });

        }
        done();
    }
});

var preUrl = 'http://www.dianping.com/search/category';
var listSet = new Set(readFile('./listIds.csv').split(","));
var detailSet = new Set(readFile('./detailIds.csv').split(","));
console.log("listSet",listSet);
console.log("detailSet",detailSet);
function init() {
    for (var city = 300; city < 600; city++)
        for (var page = 0; page < 50; page++) {
            var path = '';
            if (page > 0) {
                path = "/"+city + '/10/p' + (page + 1);
            } else {
                path = "/"+city + '/10/';
            }
            //listCrawler.queue(preUrl + path);

            if (!listSet.has(path)) {
                console.log("queue:", path);
                listCrawler.queue(preUrl + path);
            } else {
                console.log("重复:", path);
            }
        }
}


/*
 var http = require('http');
 http.createServer(function (req, res) {
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end('Hello World\n');
 }).listen(1337, '127.0.0.1');
 */

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}
function writeFile(filename, data) {
    fs.appendFile(filename, data, 'utf8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}
init();
