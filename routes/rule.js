var request = require('request');
var fs = require('fs');
var path = require('path');

//Seperate module for botChan
var botChan = require('../models/botChan');

//Rule model
var Rule = require('../models/rule');


module.exports = function (app, passport) {


    app.get('/rule', function (req, res, next) {

        res.render('rule/rule.hbs', {
            title: "Bot-Chan Rule Panel",
        });
    });
    app.get('/rule/overview', function (req, res, next) {
        var ruleData = [];
        Rule.find({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                ruleData = data;
                res.render('rule/overview.hbs', {
                    title: "User Management Panel",
                    rules: ruleData
                });
            }
        });
    });
    app.get('/rule/byid/:rid', function (req, res, next) {

        var rid = req.params.rid;
        Rule.findOne({ '_id' :  rid }, function(err, rule) {

            // if there are any errors, return the error before anything else
            if (err || !rule) {
                res.jsonp({
                    error:"Error loading rule"
                });
            }
            else
            {
                res.jsonp({
                    rule : rule
                });
            }
            /*
            // if no rule is found, return the message
            if (!rule) {
                res.jsonp({
                    error:"No rule found with that id"
                });
            }
            */

        });
    });

    //TODO CREATE POST
    app.get('/rule/create', function (req, res, next) {

        var rulePing = new Rule();
        rulePing.command = "ping";
        rulePing.reply = true;
        rulePing.type =  "single";
        rulePing.response = ["pong","hello"];

        rulePing.save(function (err, resp) {
            if (err)
                return console.log(err);
            else
                res.send(resp.id);
        });
        /*
         res.render('error.hbs', {
         message: "Not implemented yet"
         });
         */
    });



    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

    function needsGroup(group) {
        return function (req, res, next) {
            if (req.user && req.user.local.group === group)
                next();
            else
                res.send(401, 'Unauthorized');
        };
    };

    function needsGroups(groups) {
        return function (req, res, next) {
            var authorized = false;
            if (req.user) {
                for (var i = 0; i < groups.length; i++)
                    if (req.user.local.group === groups[i])
                        authorized = true;
            }
            if (authorized)
                next();
            else
                res.send(401, 'Unauthorized');
        };
    };
};
