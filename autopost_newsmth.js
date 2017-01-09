/**
 * Created by fanzhang on 17/1/8.
 */
var request = require('request').defaults({jar: true});
var fs = require('fs');

require('request-debug')(request);


var loginUrl = 'http://m.newsmth.net/user/login';
var postUrl = 'http://www.newsmth.net/nForum/article/HuiLongGuan/ajax_post.json';
function login() {
    request.post({
        url: loginUrl,
        form: {
            id: 'afhs324',
            passwd: '******',
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
            subject: "fan",
            content: "hello fan",
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
