var User = require('../models/user');
var Discord = require("discord.js");
var fs = require('fs');

module.exports = function (app, passport) {

    /* GET home page. */
    app.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.hbs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.hbs', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        //failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, needsGroups(['pleb', 'admin']), function (req, res) {
        res.render('profile.hbs', {
            user: req.user // get the user out of session and pass to template
        });
    });


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
        var mybot = new Discord.Client();

        var woorden = {};
        woorden["ping"] = "pong";
        woorden["lenny"] = "( ͡° ͜ʖ ͡°)";
        woorden["pokemon"] = "https://www.youtube.com/watch?v=JuYeHPFR3f0";
        woorden["420 moe"] = "http://420.moe";


        woorden["radioKappa"] = "\nWrong Syntax, please use one of these commands instead:\nradioKappa5\nradioKappaRandom"
        woorden["radioKappa 1"] = "https://www.youtube.com/watch?v=pNwqlLqHkuc";
        woorden["radioKappa 2"] = "https://www.youtube.com/watch?v=w1txleejl90";
        woorden["radioKappa 3"] = "https://www.youtube.com/watch?v=nvSjfSVWgVI";
        woorden["radioKappa 4"] = "https://www.youtube.com/watch?v=e-w3oYVyl6Y";
        woorden["radioKappa 5"] = "https://www.youtube.com/watch?v=bHzMLxVdPSo";
        woorden["radioKappa 6"] = "https://www.youtube.com/watch?v=WAIOKZHIRBY";
        woorden["radioKappa 7"] = "https://www.youtube.com/watch?v=ObCkFWdcb4k";
        woorden["radioKappa 8"] = "https://www.youtube.com/watch?v=UWAxhQNDYLU";
        woorden["radioKappa 9"] = "https://www.youtube.com/watch?v=4tCJKt2R4Do";
        woorden["radioKappa 10"] = "https://www.youtube.com/watch?v=5yC00PvLqjA";
        woorden["radioKappa 11"] = "https://www.youtube.com/watch?v=pBdWuGpc_gU";


        mybot.on("message", function (message) {
            if (message.content in woorden)
                mybot.reply(message, woorden[message.content]);

        });
        mybot.on("message", function (message) {
            if (message.content === "radioKappaRandom") {
                var random = getRandomIntInclusive(1, 11);
                mybot.reply(message, woorden["radioKappa " + random.toString()]);
            }
        });

        var stream = fs.createReadStream("./files/winter2016.jpg");
        stream.on('end', function() {
            console.log('End of data reached.');
        });

        mybot.on("message", function (message) {
            if (message.content === "winter2016") {
                var channel = message.channel;
                mybot.sendFile(channel,stream,"");
            }
        });

        mybot.login("jeroencornelis5@gmail.com", "dankmemer69");

        res.render('dashboard/bots.hbs', {
            title: "Bot Management Panel",
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // route middleware to make sure a user is logged in
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
    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
