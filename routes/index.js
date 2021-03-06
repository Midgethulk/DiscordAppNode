var User = require('../models/user');
var Discord = require("discord.js");
var fs = require('fs');

var botChan;
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
};
