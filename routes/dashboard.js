var User = require('../models/user');
var request = require('request');
var fs = require('fs');
var path = require('path');

//Seperate module for botChan
var botChan = require('../models/botChan');

//Test
var Rule = require('../models/rule');
var Bot = require('../models/bot');


module.exports = function (app, passport) {

    app.get('/dashboard', function (req, res, next) {
        res.render('dashboard/dashboard.hbs', {
            title: "Dashboard"
        });
    });

    app.get('/dashboard/users', function (req, res, next) {
        var userData = [];
        User.find({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                userData = data;
                res.render('dashboard/users.hbs', {
                    title: "User Management Panel",
                    users: userData
                });
            }
        });
    });
    app.get('/dashboard/bots', function (req, res, next) {
        res.render('dashboard/bots.hbs', {
            title: "Bot Management Panel",
        });
    });

    app.get('/dashboard/bots/start', function (req, res, next) {
        if (!botChan.onlineStatus()) {
            botChan.create();
            botChan.configure();
            botChan.login();

            res.render('dashboard/bots.hbs', {
                title: "Bot Management Panel",
                message: "Started Bot-Chan!"
            });
        }
        else {
            res.render('dashboard/bots.hbs', {
                title: "Bot Management Panel",
                message: "Bot-Chan already running!"
            });
        }


    });

    app.get('/dashboard/bots/stop', function (req, res, next) {
        if (botChan.onlineStatus()) {
            botChan.logout();
        }
        else {
            res.render('dashboard/bots.hbs', {
                error: "Bot needs to be started first."
            });
        }
    });

    app.get('/botchan', function (req, res, next) {
        if (botChan.onlineStatus()) {
            res.render('botchan/status.hbs', {
                title: "Bot-Chan Status",
                onlineStatus: onlineStatus,
                //Bot-Info
                botChan: botChan.user,
                uptime: botChan.uptime / 60000,
                //Servers
                servers: botChan.servers,
                //Members
                members: botChan.servers.members
            });
        }
        else {
            res.render('botchan/status.hbs', {
                title: "Bot-Chan Status",
                onlineStatus: onlineStatus,
            });
        }

    });
    app.get('/botchan/status', function (req, res, next) {
        if (botChan.onlineStatus()) {
            res.render('botchan/status.hbs', {
                title: "Bot-Chan Status",
                onlineStatus: onlineStatus,
                //Bot-Info
                botChan: botChan.user,
                uptime: botChan.uptime / 60000,
                //Servers
                servers: botChan.servers,
                //Members
                members: botChan.servers.members
            });
        }
        else {
            res.render('botchan/status.hbs', {
                title: "Bot-Chan Status",
                onlineStatus: onlineStatus,
            });
        }
    });
    app.get('/mongoose/test', function (req, res, next) {

        /*
         var botChan = new Bot({email: "test@gmail.com", password: "test"});


         botChan.save(function (err) {
         if (err) return console.log(err);
         });
         var rulePing = new Rule({
         command:"ping",
         bot: botChan._id,
         response:{
         type:'single',
         response:['pong']
         }
         });

         rulePing.save(function (err) {
         if (err) return console.log(err);
         // thats it!
         });
         */
        res.render('error.hbs', {
            message: "Not implemented yet"
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
