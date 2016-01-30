var Discord = require("discord.js");
var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var onlineStatus = false;
var botChan;

var platform = os.platform();
// 'linux' on Linux
// 'win32' on Windows 32-bit
// 'win64' on Windows 64-bit
// 'darwin' on OSX
var prePath = "";
var Rule;
if (platform === "linux")
    prePath = "../"
else
    prePath = "./"

Rule = require('../models/rule');


exports.onlineStatus = onlineStatus;
module.exports = {
    onlineStatus: function () {
        return onlineStatus;
    },
    create: function () {
        botChan = new Discord.Client();
        //configure();
    },
    login: function () {
        botChan.login("jeroencornelis5@gmail.com", "dankmemer69", function (err, token) {
            if (err)
                console.log("error logging in");

            setOnlineStatus(true);
            console.log("login successful\ntoken:" + token);
        })
    },
    logout: function () {
        botChan.logout(function (err) {
            if (err)
                console.log(err)
            setOnlineStatus(false);
            console.log("logged out")
        });
    },
    configure: function () {
        var command = {};
        command["ping"] = "pong";
        command["lenny"] = "( ͡° ͜ʖ ͡°)";
        command["pokemon"] = "https://www.youtube.com/watch?v=JuYeHPFR3f0";
        command["420 moe"] = "http://420.moe";
        command["typing game"] = "http://zty.pe/";
        command["dance"] = "http://i.imgur.com/CbDGwLv.gifv";
        command["!disgust"] = "http://i.imgur.com/Ih7NinU.gif"
        command["facepalm"] = "https://i.imgur.com/iWKad22.jpg";
        command["pirate"] = "http://cristgaming.com/pirate.swf";
        command["hype"] = "http://zone-archive.com/tmp/hype_train.html";
        command["❤ botchan"] = "http://i2.kym-cdn.com/photos/images/original/000/704/937/f38.jpg";


        command["radiokappa"] =
            "\nWrong Syntax, please use one of these commands instead:" +
            "\nradioKappa 5" +
            "\nradioKappaRandom" +
            "\nradioKappaPlaylist";
        command["radiokappa 1"] = "https://www.youtube.com/watch?v=pNwqlLqHkuc";
        command["radiokappa 2"] = "https://www.youtube.com/watch?v=w1txleejl90";
        command["radiokappa 3"] = "https://www.youtube.com/watch?v=nvSjfSVWgVI";
        command["radiokappa 4"] = "https://www.youtube.com/watch?v=e-w3oYVyl6Y";
        command["radiokappa 5"] = "https://www.youtube.com/watch?v=bHzMLxVdPSo";
        command["radiokappa 6"] = "https://www.youtube.com/watch?v=WAIOKZHIRBY";
        command["radiokappa 7"] = "https://www.youtube.com/watch?v=ObCkFWdcb4k";
        command["radiokappa 8"] = "https://www.youtube.com/watch?v=UWAxhQNDYLU";
        command["radiokappa 9"] = "https://www.youtube.com/watch?v=4tCJKt2R4Do";
        command["radiokappa 10"] = "https://www.youtube.com/watch?v=5yC00PvLqjA";
        command["radiokappa 11"] = "https://www.youtube.com/watch?v=pBdWuGpc_gU";
        command["radiokappaplaylist"] = "https://www.youtube.com/playlist?list=PLkiIi_Of9LY5DAlCQQa4Ps3jpNbA9YFSb";


        botChan.on("disconnected", function () {
            setOnlineStatus(false);
        });

        //Bitch I'm Tom Hanks
        botChan.on("message", function (message) {
            var msgLwr = message.content.toLocaleLowerCase();
            var srchStr = "tom hanks"
            if (msgLwr.indexOf(srchStr) > -1)
                botChan.reply(message, "https://www.youtube.com/watch?v=JFRohrsZZO0");

        });

        //JOHN CENA! Can I speak to champ?
        botChan.on("message", function (message) {
            var msgLwr = message.content.toLocaleLowerCase();
            var srchStr = "john cena"
            if (msgLwr.indexOf(srchStr) > -1)
                botChan.reply(message, "https://www.youtube.com/watch?v=5LitDGyxFh4");

        });
        //Process commands in command Arraty
        botChan.on("message", function (message) {
            if (message.content.toLocaleLowerCase() in command)
                botChan.reply(message, command[message.content.toLocaleLowerCase()]);

        });
        /*
         botChan.on("message", function (message) {
         if (message.content in command)
         botChan.reply(message, command[message.content]);

         });
         */
        botChan.on("message", function (message) {
            if (message.content === "radioKappaRandom") {
                var random = getRandomIntInclusive(1, 11);
                botChan.reply(message, command["radioKappa " + random.toString()]);
            }
        });

        botChan.on("message", function (message) {
            var messageContent = message.content;
            var strCmd = messageContent.substr(0, messageContent.indexOf(' '));
            var voiceChannelInput = messageContent.substr(messageContent.indexOf(' ') + 1);
            var output = "";

            if (strCmd === "!join") {
                var channels = message.channel.server.channels;

                var channel;
                var channelName = "";
                var channelType = "";

                for (var i = 0; i < channels.length; i++) {
                    channel = channels[i];
                    channelName = channel.name;
                    // "voice" for voice channel
                    channelType = channel.type;
                    if (channelName.toLowerCase() === voiceChannelInput.toLowerCase() && channelType === "voice") {
                        //connection is the created Voice Connection.
                        botChan.joinVoiceChannel(channel, function (err, connection) {
                            if (err)
                                output = "Error joining joining voice channel: " + channelName;
                            else {
                                output = "Joined voice channel: " + channelName;
                                botChan.reply(message, output);
                            }
                        });
                        break;
                    }

                }
            }
        });

        botChan.on("message", function (message) {
            if (message.content === "play") {
                var connection = botChan.voiceConnection;
                if (connection !== null) {
                    var pathToFile = path.join(prePath, 'files', "nani.mp3");
                    var stream = fs.createReadStream(pathToFile);
                    stream.on('end', function () {
                        connection.play(stream, function (err, str) {
                            if (err)
                                console.log(err);
                            else
                                console.log(str)

                        });
                        console.log('End of data reached.');
                    });

                    connection.playRawStream(stream, function (err, str) {
                        if (err)
                            console.log(err);
                        else
                            console.log(str)
                    });
                }
            }
        });

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
                    request("http://www.omdbapi.com/?t=" + srchString + "&type=movie&tomatoes=true&r=json", function (error, response, body) {
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
                                    + "\nRotten Tomato Score: " + tomatoMeter
                                    + "\nRotten Tomato User Score: " + tomatoUserMeter
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


                            if (body !== null || body !== "undefined") {
                                botChan.reply(message, "Shortened url: " + body);
                            }
                            else {
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
};
function setOnlineStatus(status) {
    onlineStatus = status;
};

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}