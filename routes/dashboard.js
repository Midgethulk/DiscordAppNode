var User = require('../models/user');
var Discord = require("discord.js");
var request = require('request');
var fs = require('fs');
var path = require('path');
var os = require('os');

var botChan;
var onlineStatus = false;

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
        if (!onlineStatus) {
            botChan = new Discord.Client();
            configureBot();
            botChan.login("jeroencornelis5@gmail.com", "dankmemer69", function (err, token) {
                if (err)
                    console.log("error logging in");

                onlineStatus = true;
                console.log("login successful\ntoken:" + token);
            });
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

    function configureBot() {
        var woorden = {};
        woorden["ping"] = "pong";
        woorden["lenny"] = "( ͡° ͜ʖ ͡°)";
        woorden["pokemon"] = "https://www.youtube.com/watch?v=JuYeHPFR3f0";
        woorden["420 moe"] = "http://420.moe";


        woorden["radioKappa"] = "\nWrong Syntax, please use one of these commands instead:\nradioKappa5\nradioKappaRandom";
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
        woorden["radioKappaPlaylist"] = "https://www.youtube.com/playlist?list=PLkiIi_Of9LY5DAlCQQa4Ps3jpNbA9YFSb";


        botChan.on("disconnected", function () {
            onlineStatus = false;
        });

        botChan.on("message", function (message) {
            if (message.content.toLocaleLowerCase() in woorden)
                botChan.reply(message, woorden[message.content.toLocaleLowerCase()]);

        });
        /*
         botChan.on("message", function (message) {
         if (message.content in woorden)
         botChan.reply(message, woorden[message.content]);

         });
         */
        botChan.on("message", function (message) {
            if (message.content === "radioKappaRandom") {
                var random = getRandomIntInclusive(1, 11);
                botChan.reply(message, woorden["radioKappa " + random.toString()]);
            }
        });


        var platform = os.platform();
        // 'linux' on Linux
        // 'win32' on Windows 32-bit
        // 'win64' on Windows 64-bit
        // 'darwin' on OSX

        if (platform === "linux")
            var prePath = "../"
        else
            var prePath = "./"

        //Send Images
        botChan.on("message", function (message) {
            var channel = message.channel;
            if (message.content === "winter2016") {
                var pathToFile = path.join(prePath, 'files', "winter2016.jpg");
                var stream = fs.createReadStream(pathToFile);
                stream.on('end', function () {
                    console.log('End of data reached.');
                });

            }
            if (message.content === "Kappa") {
                var pathToFile = path.join(prePath, 'files', "Kappa.png");
                var stream = fs.createReadStream(pathToFile);
                stream.on('end', function () {
                    console.log('End of data reached.');
                });
            }
            botChan.sendFile(channel, stream, "");
        });

        //Twitch API
        botChan.on("message", function (message) {
            var strArray = message.content.split(" ");
            if (strArray[0] == "!twitch") {
                if (strArray[1] === "") {
                    botChan.reply(message, "The !twitch command requires a channel name!\nExample: !twitch forsenlol");
                }
                else {
                    request("https://api.twitch.tv/kraken/streams/" + strArray[1], function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            var json = JSON.parse(body);

                            var jsonStreamData = json.stream;
                            if (jsonStreamData === null) {
                                botChan.reply(message, "\n" + strArray[1] + " is currently offline\nChannel: " + "http://www.twitch.tv/" + strArray[1]);
                            }
                            else {
                                var jsonChannelData = jsonStreamData.channel;
                                var name = jsonChannelData.name;
                                var game = jsonChannelData.game;
                                var title = jsonChannelData.status;
                                var viewers = jsonStreamData.viewers;
                                var url = jsonChannelData.url;
                                botChan.reply(message, "\nStatus: online\n" + "Name: " + name + "\nGame: " + game + "\nTitle: " + title + "\nViewers: " + viewers + "\nurl: " + url);
                            }
                        }
                        else {
                            if (response.statusCode == 404) {
                                botChan.reply(message, "Channel " + strArray[1] + " not found");
                            }
                        }
                    });
                }
            }
        });
        //OMDb API
        botChan.on("message", function (message) {
            var messageContent = message.content;
            var strCmd = messageContent.substr(0, messageContent.indexOf(' '));
            var movie = messageContent.substr(messageContent.indexOf(' ') + 1);

            if (strCmd == "!movie") {
                if (movie === "") {
                    botChan.reply(message, "The !movie command requires a move name!\nExample: !movie Star Wars");
                }
                else {
                    var srchString = movie.replace(/ /g, "+");
                    request("http://www.omdbapi.com/?t=" + srchString+"&type=movie&tomatoes=true&r=json", function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            var json = JSON.parse(body);
                            var response = json.Response;

                            if (response === "False") {
                                botChan.reply(message, "\nMovie: " + movie + " not found!");
                            }

                            if (response === "True") {
                                var title = json.Title;
                                var released = json.Released;
                                var genre = json.Genre;
                                var actors = json.Actors;
                                var imdbUrl = json.imdbID;
                                var tomatoMeter = json.tomatoMeter;
                                var tomatoUserMeter = json.tomatoUserMeter;
                                botChan.reply(message, "\nMovie Title: " + title
                                    + "\nReleased: " + released
                                    + "\nGenre: " + genre
                                    + "\nActors: " + actors
                                    + "\nRotten Tomato Score: "+ tomatoMeter
                                    + "\nRotten Tomato User Score: "+ tomatoUserMeter
                                    + "\nIMDB URL: http://www.imdb.com/title/" + imdbUrl
                                );
                            }

                        }
                        else {
                            if (response.statusCode == 404) {
                                botChan.reply(message, "Error with request");
                            }
                        }
                    });
                }
            }
        });
        //Shorten Links http://www.hnng.moe/api
        botChan.on("message", function (message) {
            var strArray = message.content.split(" ");
            if (strArray[0] == "!shorten") {
                if (strArray[1] === "") {
                    botChan.reply(message, "The !shorten command requires a url name!\nExample: !shorten http://www.420.moe");
                }
                else {
                    request("http://www.hnng.moe/shortapi.php?url=" + strArray[1], function (error, response, body) {
                        if (!error && response.statusCode == 200) {


                            if (body !== null || body !=="undefined") {
                                botChan.reply(message, "Shortened url: "+body);
                            }
                            else{
                                botChan.reply(message, "There was a problem creating the link.");
                            }
                        }
                        else {
                            if (response.statusCode == 404) {
                                botChan.reply(message, "Error Creating link (404 ");
                            }
                        }
                    });
                }
            }
        });
    }


    app.get('/dashboard/bots/stop', function (req, res, next) {
        if (onlineStatus == true) {
            botChan.logout(function (err) {
                if (err)
                    console.log(err)
                onlineStatus = false;
                console.log("logged out")
            });
        }
        else {
            res.render('dashboard/bots.hbs', {
                error: "Bot needs to be started first."
            });
        }
    });

    app.get('/botchan', function (req, res, next) {
        if (onlineStatus) {
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
        if (onlineStatus) {
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

    function startBot() {

    }
};
