function weatherio(key) {
    this.appkey = key;
};

weatherio.prototype.forecast = function (lat, long, options = null, callback) {
    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
    var handler = new XMLHttpRequest();

    var path = this.buildUrl(this.appkey, lat, long, options);
    if (typeof options === 'function') {
        callback = options;
    }

    handler.onload = () => {
        if (handler.readyState == 4 && handler.status == 200) {
            callback(null, JSON.parse(handler.responseText));
        }
        else {
            callback('An error occured', null);
        }
    }
    handler.open('GET', path, true);
    handler.send(null);
};

weatherio.prototype.buildUrl = function (appkey, lat, long, options = null) {
    var path = `https://api.darksky.net/forecast/${appkey}/${lat},${long}`;

    if (options != null) {
        var optionalParams = [];
        for (var property in options) {
            optionalParams.push(`${property}=${options[property]}`);
        }
        var optionalPath = optionalParams.join("&");
        path += `?${optionalPath}`;
    };

    return path;
};

module.exports = weatherio;