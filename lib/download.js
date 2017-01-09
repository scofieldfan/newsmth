var fs = require('fs'),
    request = require('request');
var Puid = require('puid');
var puid = new Puid(); //

function getType(url){
   var tmp = url.split("/");
    var fileType = tmp[tmp.length-1].split(".")[1];
    return fileType
}
var download = function(uri, directory, callback){
    var id = puid.generate();
    var filename =  directory + "/"+ id +"."+getType(uri);
    request.head(uri, function(err, res, body){
        if(!res){
            return;
        }
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
module.exports = download;