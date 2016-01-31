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

    //Get All Rules
    app.get('/rule/all', function (req, res, next) {d
        Rule.find({},function (err,rules) {
            if(err)
            {
                console.log(err);
                res.jsonp({
                    error: "Error loading rules"
                });
            }
            else {
                res.jsonp({
                    rules:rules
                });
            }
        });
    });

    //Get Rule by id
    app.get('/rule/byid/:rid', function (req, res, next) {

        var rid = req.params.rid;
        Rule.findOne({'_id': rid}, function (err, rule) {

            // if there are any errors, return the error before anything else
            if (err || !rule) {
                res.jsonp({
                    error: "Error loading rule"
                });
            }
            else {
                res.jsonp({
                    rule: rule
                });
            }
        });
    });

    //Edit rule
    app.post('/rule/edit', function (req, res, next) {
        var id = req.body.idRule;
        var command = req.body.command;
        var reply = req.body.replyRadios;
        var response = req.body.response;


        if (id !== "") {
            //Check if rule in database
            Rule.findOne({'_id': id}, function (err, ruleSrch) {
                if (err)
                    res.jsonp({
                        error: "Error looking up the requested rule!"
                    });
                if (ruleSrch) {
                    Rule.update({_id: id}, {response: response, reply: reply, command: command}, function (err, doc) {
                        if (err)
                            console.log(err);
                        else
                        {
                            res.jsonp({
                               message:"Successful edited the Rule!"
                            });
                        }
                    });
                }
                else if (!err) {
                    res.jsonp({
                        error: "Cannot find Rule with that id!"
                    });
                }
            });
        }
        else {
            res.jsonp({
                error:"Pick a rule to edit it"
            })
        }
    });

    //Add rule
    app.post('/rule/add', function (req, res, next) {
        var rule = new Rule();
        var command = req.body.command;
        var reply = req.body.replyRadios;
        var response = req.body.response;

        if(command === "" || response === "")
        {
            res.jsonp({
               error: "Command or Response cannot not be empty when adding a new command!"
            });
        }
        else {
            Rule.findOne({'command': command}, function (err, ruleSrch) {
                if (err)
                    res.jsonp({
                        error: "Error looking up database"
                    });
                if (!ruleSrch) {
                    rule.command = command;
                    rule.reply = reply;
                    rule.response = response;

                    rule.save(function (err, resp) {
                        if (err)
                            return console.log(err);
                        else {
                            res.jsonp({
                                rule: rule,
                                message: "Added new command"
                            });
                        }

                    });
                }
                else if (!err) {
                    res.jsonp({
                        error: "A rule with that command string already exists!"
                    });
                }
            })
        }
    });

    //Delete Rule
    app.get('/rule/delete/:rid', function (req, res, next) {

        var rid = req.params.rid;
        Rule.find({'_id': rid}).remove(function (err) {

            // if there are any errors, return the error before anything else
            if (err) {
                res.jsonp({
                    error: "Error deleting rule"
                });
            }
            else {
                res.jsonp({
                    message: "Deleted the rule"
                });
            }
        });
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
