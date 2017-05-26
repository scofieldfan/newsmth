/**
 * Created by fanzhang on 17/1/8.
 */
var request = require('request').defaults({jar: true});
var fs = require('fs');

require('request-debug')(request);


var loginUrl = 'http://m.newsmth.net/user/login';
var postUrl = 'http://www.newsmth.net/nForum/article/HouseRent/ajax_post.json';
function login() {
    request.post({
        url: loginUrl,
        form: {
            id: '****',
            passwd: '****',
            save: 'on'
        }
    }).on('response', function (response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
        console.log(response.headers['set-cookie']);
        // writeFile('./cookies',response.headers['set-cookie']);
        post(response.headers['set-cookie']);
    })
};
function post(cookies) {
    if (cookies){
        console.log("error no cookies...");
    }
    var jarSelf = request.jar();
    cookies.forEach(function (item) {
        var kv = item.split(";")[0];
        jarSelf.setCookie(kv, postUrl);
    })
    /*
     jarSelf.setCookie('main[UTMPUSERID]=afhs324', postUrl);
     jarSelf.setCookie('main[UTMPKEY]=38665096', postUrl);
     jarSelf.setCookie('main[UTMPNUM]=4811', postUrl);
     jarSelf.setCookie('main[PASSWORD]=zCy-v%250E%2504%250E%25142%2503%2507%2B%250C5uZ%250C%257C%257CUd%250D%2504', postUrl);
     jarSelf.setCookie('main[XWJOKE]=hoho', postUrl);
     */
    request.post({
        url: postUrl,
        jar: jarSelf,
        form: {
            subject: "出租南邵地铁路劲世界城三居4300【个人】 ",
            content: "已经在链家上挂了，照片请见 https://bj.lianjia.com/zufang/101101508717.html 1房屋特征\n南邵的路劲世界城3居，南北通透，格局棒，房子是高层，视野和光线特别好 离地铁5分钟家具齐全 有新风系统，集中供暖，空调，洗衣机，冰箱，抽烟烟机，餐桌，餐椅，单人床，双人床，柜子，茶几等 小区环境好，绿化的特别好 有小孩娱乐设施 小区管理严格，安全 价格整租暂定4300/月\n  3.房东心态 希望生活简单，爱惜房子的有缘人士住宿，房租接受押一付三！ 我们包物业费，和每年的取暖费。 联系电话：李女士 18910873393 "
            ,
            signature: 0,
            id: 0
        },
        headers: {
            "Referer": "http://www.newsmth.net/nForum/",
            "X-Requested-With": "XMLHttpRequest",
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
        }
    }).on('response', function (response) {
        console.log(response.statusCode) // 200
        // console.log(response);
    }).debug = true;
}
function writeFile(file, content) {
    fs.writeFile(file, content, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8').replace(/\n/g, '');
}
login();
