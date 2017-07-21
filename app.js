var config = require('./config');
var express = require('express');
var app = express();
var zip = require('zippity-do-dah');
var weather = require('./home_modules/weatherio.js');
var path = require('path');

var weatherio = new weather(config.weatherKey);

app.use(express.static(path.resolve(__dirname, "public")));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get(/^\/(\d{5})$/, (req, res, next) => {
    var zipCode = req.params[0];
    var location = zip.zipcode(zipCode);
    if (!location.zipcode) {
        next();
        return;
    }

    var long = location.longitude;
    var lat = location.latitude;

    weatherio.forecast(lat, long, { units: 'uk' }, (err, data) => {
        if (err) {
            next();
            return;
        }
        res.json({
            zipcode: zipCode,
            temperature: data.currently.temperature
        });
    });
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(config.port, () => console.log("App started on port: " + config.port));

