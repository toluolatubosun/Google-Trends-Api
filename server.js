var express = require('express');
var path = require('path');
const googleTrends = require('google-trends-api');

// initializing application
var app = express();
// defining port
var port = process.env.PORT || 8080;
// favicon
app.get('/favicon.ico', function(req, res) { 
    res.sendStatus(204); 
});

// api route for interestOverTime
app.get('/interestOverTime', function(req, res) {
    const keyword = req.query.keyword;
    var startTime = new Date();
    startTime.setFullYear( startTime.getFullYear() - 5);
    if(keyword && keyword.trim()) {
        const payload = {
            keyword,
            startTime,
        };
        googleTrends.interestOverTime(payload)
        .then(function(results){
            results = JSON.parse(results);
            let average = 0;
            if(results && results.default && results.default.timelineData && results.default.timelineData.length > 0){
                average = results.default.timelineData.reduce(function(total, obj){
                                return total + parseFloat(obj.formattedValue[0]);
                            }  ,0);

                average = average / results.default.timelineData.length;
                average = average.toFixed(2);
            }
            const responseJSON = {
                ...payload,
                results,
                average,
                success: true
            }
            res.status(200);
            res.type('json');
            res.send(responseJSON);
        })
        .catch(function(error){
            const responseJSON = {
                ...payload,
                error: 'Server Error',
                success: false
            }
            res.status(400);
            res.type('json');
            res.send(responseJSON);
        });
    } 
    else {
        const responseJSON = {
            error: 'Please provide the required query parameter [keyword]',
            success: false
        }
        res.status(400);
        res.type('json');
        res.send(responseJSON);
    }
});

// api route for interestByRegion
app.get('/interestByRegion', function(req, res) {
    const keyword = req.query.keyword;
    var startTime = new Date();
    startTime.setFullYear( startTime.getFullYear() - 5);
    if(keyword && keyword.trim()) {
        const payload = {
            keyword,
            startTime,
        };
        googleTrends.interestByRegion(payload)
        .then(function(results){
            results = JSON.parse(results);
            const responseJSON = {
                ...payload,
                results,
                success: true
            }
            res.status(200);
            res.type('json');
            res.send(responseJSON);
        })
        .catch(function(error){
            const responseJSON = {
                ...payload,
                error: 'Server Error',
                success: false
            }
            res.status(400);
            res.type('json');
            res.send(responseJSON);
        });
    } 
    else {
        const responseJSON = {
            error: 'Please provide the required query parameter [keyword]',
            success: false
        }
        res.status(400);
        res.type('json');
        res.send(responseJSON);
    }
});

// other uri handler
app.get('/*', function(req, res){
    const responseJSON = {
        error: 'Please use valid endpoint',
        success: false
    }
    res.status(400);
    res.type('json');
    res.send(responseJSON);
});

// listening request
app.listen(port, function () {
    console.log("app running on port: "+port);
});