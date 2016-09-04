var Discord = require("discord.js");
var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var opus = require('node-opus');
var sprintf = require("sprintf-js").sprintf;
var botChan;
var onlineStatus = false;
var restartStatus = false;
var prefix = "!";


var platform = os.platform();
// 'linux' on Linux
// 'win32' on Windows 32-bit
// 'win64' on Windows 64-bit
// 'darwin' on OSX

var Rule = require('../models/rule');


exports.onlineStatus = onlineStatus;
module.exports = {
    onlineStatus: function () {
        return onlineStatus;
    },
    getUser: function() {
        return botChan.user;
    },
    getServers: function() {
        return botChan.servers;
    },
    getUptime: function() {
        return botChan.uptime;
    },
    restartStatus: function () {
        return restartStatus;
    },
    setRestartStatus: function (b) {
        setRestartStatus(b);
    },
    create: function () {
        botChan = new Discord.Client();
        //configure();
    },
    login: function () {
        login();
    },
    logout: function () {
        logout();
    },
    restart: function () {
        //TODO: FIX CODE ABLE TO START WHILE STARTED
        /*
        logout()
        if (getOnlineStatus() === false)
                login();

        */
    },
    configure: function () {
        var prePath = "";
        if (platform === "linux")
            prePath = "./";
        else
            prePath = "./";

        //Hardcoded Commands
        botChan.setMaxListeners(20);
        var command = {};
        var commands = [];

        command["ping"] = "pong";
        command["lenny"] = "( ͡° ͜ʖ ͡°)";
        command["lenny face"] = "( ͡° ͜ʖ ͡°)";
        command["pokemon"] = "https://www.youtube.com/watch?v=JuYeHPFR3f0";
        command["420 moe"] = "http://420.moe";
        command["typing game"] = "http://zty.pe/";
        command["dance"] = "http://i.imgur.com/CbDGwLv.gifv";
        command["!disgust"] = "http://i.imgur.com/Ih7NinU.gif"
        command["facepalm"] = "https://i.imgur.com/iWKad22.jpg";
        command["pirate"] = "http://cristgaming.com/pirate.swf";
        command["hype train"] = "http://zone-archive.com/tmp/hype_train.html";
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
        command["radiokappa 12"] = "https://www.youtube.com/watch?v=UXw3-pmmYf8";
        command["radiokappaplaylist"] = "https://www.youtube.com/playlist?list=PLkiIi_Of9LY5DAlCQQa4Ps3jpNbA9YFSb";

        /*
        botChan.on("disconnected", function () {
            //Check if DC or manual shutdown
            if(getOnlineStatus() === true)
            {
                setOnlineStatus(false);
                login()
            }
        });
        */

        //Database commands
        Rule.find({}, function (err, rules) {
            if (err) {
                console.log(err);
            }
            else {
                rules.forEach(function (rule) {
                    command[rule.command] = rule.response;
                    commands.push(rule.command);
                });
            }
        });

        //Process commands in command Array
        botChan.on("message", function (message) {
            if (message.content.toLocaleLowerCase() in command) {
                var textChannel = message.channel;
                textChannel.sendMessage(command[message.content.toLocaleLowerCase()]);

                var messages = [message];
                textChannel.bulkDelete(messages);
            }
        });

        botChan.on("messageUpdated", function (messageOld,messageNew) {
            if (messageNew.content.toLocaleLowerCase() in command) {
                var textChannel = message.channel;
                textChannel.sendMessage(command[message.content.toLocaleLowerCase()]);

                var messages = [messageNew];
                textChannel.bulkDelete(messages);
            }

        });

        //Process commands in command Array
        botChan.on("message", function (message) {
            var commandsString = "";
            var textChannel = message.channel;
            if (message.content.toLocaleLowerCase() === (prefix +"commands")) {

                for(var i = 0; i < commands.length; i++)
                {
                    commandsString += commands[i] + "\n";
                }
                textChannel.sendMessage(commandsString);
            }

            if (message.content.toLocaleLowerCase() === prefix+"commands audio") {
                var audioPath = path.join(prePath, 'files',"audio");
                //TODO: MAKE IT PRETTY
                //https://www.npmjs.com/package/sprintf-js
                fs.readdir(audioPath, function (er, files) {
                    for(var i = 0; i < files.length; i+=2)
                    {
                        var stringLength = 0;
                        cmd1 = "";
                        cmd2 = "";

                        var cmd1 = files[i].replace(".mp3","");
                        stringLength = 20- cmd1.trim().length;
                        if (files[i+1] !== undefined)
                        var cmd2 = files[i+1].replace(".mp3","");

                        var line = sprintf("%-"+stringLength+"s %s\n",cmd1,cmd2);
                        commandsString += line;
                    }
                    textChannel.sendMessage(commandsString);
                });
            }
        });

        //JOHN CENA! Can I speak to champ?
        botChan.on("message", function (message) {
            var textChannel = message.channel;
            var msgLwr = message.content.toLocaleLowerCase();
            var srchStr = "john cena";
            if (msgLwr.indexOf(srchStr) > -1)
                textChannel.sendMessage("https://www.youtube.com/watch?v=5LitDGyxFh4");

        });

        //TODO TEST
        /*
        botChan.on("message", function (message) {
            if (message.content === "test") {
                var output = "";
                var msg = message;
                var server = msg.channel.server;
                var members = server.members;
                output += "Online Members:\n"
                for (var i = 0; i < members.length; i++) {
                    //member is USER object
                    var member = members[i];

                    if (member.status === "online")
                        output += members[i] + "\n";
                }
                botChan.sendMessage(message.channel, output);
                //botChan.reply(message, output);
            }
        });
        */

        //Radio Kappa random
        botChan.on("message", function (message) {
            var textChannel = message.channel;
            if (message.content.toLocaleLowerCase() === "radiokapparandom") {
                var random = getRandomIntInclusive(1, 12);
                textChannel.sendMessage(command["radiokappa " + random.toString()]);
            }
        });

        //Join Channel
        botChan.on("message", function (message) {
            var textChannel = message.channel;
            var messageContent = message.content;
            var strCmd = messageContent.substr(0, messageContent.indexOf(' '));
            var voiceChannelInput = messageContent.substr(messageContent.indexOf(' ') + 1);
            var output = "";

            if (strCmd === prefix+"join") {
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
                        channel.join()
                            .then(
                                connection => console.log('Connected!')
                            )
                            .catch(
                                console.log,
                                textChannel.sendMessage("Failed to join voice channel")
                            );
                        break;
                    }

                }
            }
        });

        // Play Sound File
        botChan.on("message", function (message) {
            //if(msg.content.startsWith(prefix+"play")) {
            var strArray = message.content.split(" ");

            if ((strArray[0] === prefix+"play") || (strArray[0] === prefix+"p") ) {
                //var connection = botChan.voiceConnection;

                //Get Channel current user
                let channel = message.author.voiceChannel;

                //Get Channel bot
                let channels = botChan.voiceConnections;
                for (var c in channels)
                {
                    if (c.server === message.server)
                        var channelBot = c;
                }

                if (channel !== null) {

                    var fileName = "";
                    if (strArray[1] === "")
                        fileName = "nani.mp3";
                    else
                        fileName = strArray[1] + ".mp3";

                    var file = path.join(prePath, 'files',"audio",fileName);

                    //Check if file exists
                    fs.access(file, fs.F_OK, function(err) {
                        if (!err) {
                        botChan.leaveVoiceChannel(channelBot);
                        botChan.joinVoiceChannel(channel).then(connection => {
                                connection.playFile(file)
                                    .then(intent => {
                                        intent.on("end", () => {
                                            console.log("Playback Ended");
                                            botChan.leaveVoiceChannel(channel);
                                        });
                                        intent.on("error", (err) => {
                                            console.log('Playback Error: ' + err);
                                            botChan.leaveVoiceChannel(channel);
                                        });
                                    })
                            })
                            .catch(err => {
                                console.log('Error joining voice channel: ' + err);
                            });
                        } else {
                            output = "Unable to find sound file for '" + strArray[1] + "'";
                            console.log("Path: "+ file);
                            botChan.reply(message, output);
                        }
                    });


                }
            }
        });

        //Send Images
        botChan.on("message", function (message) {

            var strArray = message.content.split(" ");
            var textChannel = message.channel;

            if ((strArray[0] === "Kappa") || (strArray[0] === prefix + "img"))
            {
                var fileName = "";
                if (strArray[0] === "Kappa")
                    fileName = "Kappa.png";
                else
                    fileName = strArray[1] + ".png";

                var file = path.join(prePath, 'files',"img",fileName);

                //Check if file exists
                fs.access(file, fs.F_OK, function(err) {
                    if (!err) {
                        var stream = fs.createReadStream(file);
                        stream.on('end', function () {
                            console.log('End of data reached.');
                        });
                        textChannel.sendFile(stream);
                    } else {
                        output = "Unable to find image file for '" + strArray[1] + "'";
                        textChannel.sendMessage(message);
                    }
                });
            }
        });

        //Twitch API
        botChan.on("message", function (message) {
            var strArray = message.content.split(" ");
            if (strArray[0] == prefix +"twitch") {
                if (strArray[1] === "") {
                    botChan.reply(message, "The "+prefix+"twitch command requires a channel name!\nExample: "+prefix+"twitch forsenlol");
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
                            var inputTitle = messageContent.substr(messageContent.indexOf(' ') + 1);

                            if ((strCmd == prefix+"movie") || (strCmd == prefix+"series")) {
                                if (inputTitle === "") {
                                    botChan.reply(message, "The"+prefix+"movie command requires a move name!\nExample:"+prefix+"movie Star Wars");
                                }
                                else {


                                    var inputType = "";
                                    if(strCmd == prefix+"movie")
                                        inputType = "movie";
                                    else
                                        inputType = "series";

                                    var srchString = inputTitle.replace(/ /g, "+");
                                    request("http://www.omdbapi.com/?t=" + srchString + "&type="+inputType+"&tomatoes=true&r=json", function (error, response, body) {
                                        if (!error && response.statusCode == 200) {

                                            var json = JSON.parse(body);
                                            var response = json.Response;

                                            if (response === "False") {
                                                botChan.reply(message, "\nMovie: " + inputTitle + " not found!");
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
    }
};
function setOnlineStatus(status) {
    onlineStatus = status;
}
function getOnlineStatus() {
    return onlineStatus;
}
function setRestartStatus(status) {
    onlineStatus = status;
}

function login () {
    botChan.login("MTkxNTEzNTUxMzg1Mzk1MjAw.CoN1WQ.UDv9zTt70Is7gebwogGXQqx2ULs");
    setOnlineStatus(true);
    /*
    botChan.login("MTkxNTEzNTUxMzg1Mzk1MjAw.CoN1WQ.UDv9zTt70Is7gebwogGXQqx2ULs", function (err, token) {
        if (err){
            console.log("error logging in");
        }
        else{
            setOnlineStatus(true);
            console.log("login successful\ntoken:" + token);
        }
    })
    */
}

function logout() {
    botChan.logout(function (err) {
        if (err)
            console.log(err)
        setOnlineStatus(false);
        console.log("logged out")
    });
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}