var Discord = require("discord.js");
var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var opus = require('node-opus');
var sprintf = require("sprintf-js").sprintf;
var configBot = require('../config/botConfig.js');
var botChan;
var onlineStatus = false;
var prefix = "!";

var command = {};
var commandStrings = [];


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
    getUser: function () {
        return botChan.user;
    },
    getServers: function () {
        return botChan.servers;
    },
    getUptime: function () {
        return botChan.uptime;
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
        /*
        //TODO: FIX CODE ABLE TO START WHILE STARTED
        logout();
        if (getOnlineStatus() === false)
            login();
        */
    },
    loadRules: function () {
        loadRules();
    },
    configure: function () {
        var prePath = "";
        if (platform === "linux")
            prePath = "./";
        else
            prePath = "./";

        //Hardcoded Commands
        botChan.setMaxListeners(10);

        loadRules();

        //ID Kevin: <@87484590209392640>

        //Process commands in command Array
        botChan.on("message", (message) => {
            var response = "";
            var content = message.content;
            var textChannel = message.channel;
            var messages = "";

                if(content.toLocaleLowerCase() in command){

                    response = command[content.toLocaleLowerCase()];

                    //Check if array or String
                    if (response.isArray)
                    {
                        response = command[content.toLocaleLowerCase()][0];
                    }

                    textChannel.send(response)
                    .catch(console.error);
                    
                    //Single Message delete
                    //.then(message.delete().catch(console.error))

                    //Bulk delete 
                    //messages = [message];
                    //textChannel.bulkDelete(messages);
            }
        });

        botChan.on("messageUpdated", (oldMessage, newMessage) => {
            if (newMessage.content.toLocaleLowerCase() in command) {
                var textChannel = newMessage.channel;
                var response = command[newMessage.content.toLocaleLowerCase()][0];
                textChannel.send(response).catch(console.error);

                var messages = [newMessage];
                textChannel.bulkDelete(messages);
            }

        });

        //Process commands command
        botChan.on("message", (message) => {
            var commandsString = "";
            var textChannel = message.channel;
            var author = message.author;
            if (message.content.toLocaleLowerCase() === (prefix + "commands")) {
                commandsString = "Bot-Chan chat commands: \n"
                for (var i = 0; i < commandStrings.length; i++) {
                    commandsString += commandStrings[i] + "\n";
                }
                //textChannel.send(commandsString).catch(console.error);
                author.send(commandsString)
                    .then(console.log('Sent !command message to: ' + author.username))
                    .catch(console.error);
            }

            if (message.content.toLocaleLowerCase() === prefix + "commands audio") {
                var audioPath = path.join(prePath, 'files', "audio");
                //TODO: MAKE IT PRETTY
                //https://www.npmjs.com/package/sprintf-js
                fs.readdir(audioPath, function (er, files) {
                    if (files !== undefined)
                    {
                        commandsString = "Bot-Chan Audio commands: \n"
                        var cmd1 = "";
                        for (var i = 0; i < files.length; i += 1) {
                            
                            cmd1 = files[i].replace(".mp3", "").trim();
                                                        
                            commandsString += cmd1 + "\n";
                        }
                        //textChannel.send(commandsString).catch(console.error);
                        author.send(commandsString)
                            .then(console.log('Sent !command audio message to: ' + author.username))
                            .catch(console.error);
                    }
                });
            }
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
         botChan.send(message.channel, output);
         //botChan.reply(message, output);
         }
         });
         */

        //Join Channel
        botChan.on("message", (message) => {
            var textChannel = message.channel;
            var messageContent = message.content;
            var strCmd = messageContent.substr(0, messageContent.indexOf(' '));
            var voiceChannelInput = messageContent.substr(messageContent.indexOf(' ') + 1);

            if (strCmd === prefix + "join") {
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
                                textChannel.send("Failed to join voice channel").catch(console.error)
                            );
                        break;
                    }

                }
            }
        });

        // Play Sound File
        botChan.on("message", (message) => {
            //if(msg.content.startsWith(prefix+"play")) {
            var textChannel = message.channel;
            var strArray = message.content.split(" ");

            if ((strArray[0] === prefix + "play") || (strArray[0] === prefix + "p")) {

                //Get Channel current user
                let voiceChannel = message.member.voiceChannel;


                if (voiceChannel !== undefined) {

                    var fileName = "";
                    if (strArray[1] === "" || strArray[1] == undefined)
                        fileName = "nani.mp3";
                    else
                        fileName = strArray[1] + ".mp3";

                    var file = path.join(prePath, 'files', "audio", fileName);

                    //Check if file exists
                    fs.access(file, fs.F_OK, function (err) {
                        if (!err) {
                            voiceChannel.join().then(connection => {
                                const dispatcher = connection.playFile = connection.playFile(file);
                                dispatcher.on("end", () => {
                                    console.log("Playback Ended");
                                    connection.disconnect();
                                });
                                dispatcher.on("error", (err) => {
                                    console.log('Playback Error: ' + err);
                                    connection.disconnect();
                                });
                            })
                                .catch(err => {
                                    console.log('Error joining voice channel: ' + err);
                                });
                        } else {
                            var output = "Unable to find sound file for '" + strArray[1] + "'";
                            console.log("Path: " + file);
                            textChannel.send(output).catch(console.error);
                        }
                    });
                }
            }
        });

        //Send Images
        botChan.on("message", (message) => {

            var strArray = message.content.split(" ");
            var textChannel = message.channel;

            if ((strArray[0] === "Kappa") || (strArray[0] === prefix + "img")) {
                var fileName = "";
                if (strArray[0] === "Kappa")
                    fileName = "Kappa.png";
                else
                    fileName = strArray[1] + ".png";

                var file = path.join(prePath, 'files', "img", fileName);

                //Check if file exists
                fs.access(file, fs.F_OK, function (err) {
                    if (!err) {
                        textChannel.send(file).catch(console.error);
                    } else {
                        var output = "Unable to find image file for '" + strArray[1] + "'";
                        textChannel.send(output).catch(console.error);
                    }
                });
            }
        });

        //Twitch API
        /*
        botChan.on("message", (message) => {
            var textChannel = message.channel;
            var strArray = message.content.split(" ");
            var cmd = prefix + "twitch";
            if (strArray[0] == cmd ) {
                if (strArray[1] === "") {
                    textChannel.send("The " + prefix + "twitch command requires a channel name!\nExample: " + prefix + "twitch forsenlol");
                }
                else {
                    request("https://api.twitch.tv/kraken/streams/" + strArray[1], function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            var json = JSON.parse(body);

                            var jsonStreamData = json.stream;
                            if (jsonStreamData === null) {
                                textChannel.send("\n" + strArray[1] + " is currently offline\nChannel: " + "http://www.twitch.tv/" + strArray[1]);
                            }
                            else {
                                var jsonChannelData = jsonStreamData.channel;
                                var name = jsonChannelData.name;
                                var game = jsonChannelData.game;
                                var title = jsonChannelData.status;
                                var viewers = jsonStreamData.viewers;
                                var url = jsonChannelData.url;
                                textChannel.send("\nStatus: online\n" + "Name: " + name + "\nGame: " + game + "\nTitle: " + title + "\nViewers: " + viewers + "\nurl: " + url);
                            }
                        }
                        else {
                            if (response.statusCode == 404) {
                                textChannel.send("Channel " + strArray[1] + " not found");
                            }
                        }
                    });
                }
            }
        });
        */

        //OMDb API
        /*
        botChan.on("message", (message) => {
            var textChannel = message.channel;
            var messageContent = message.content;
            var strCmd = messageContent.substr(0, messageContent.indexOf(' '));
            var inputTitle = messageContent.substr(messageContent.indexOf(' ') + 1);

            if ((strCmd == prefix + "movie") || (strCmd == prefix + "series")) {
                if (inputTitle === "") {
                    textChannel.send("The" + prefix + "movie command requires a move name!\nExample:" + prefix + "movie Star Wars");
                }
                else {


                    var inputType = "";
                    if (strCmd == prefix + "movie")
                        inputType = "movie";
                    else
                        inputType = "series";

                    var srchString = inputTitle.replace(/ /g, "+");
                    request("http://www.omdbapi.com/?t=" + srchString + "&type=" + inputType + "&tomatoes=true&r=json", function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            var json = JSON.parse(body);
                            var response = json.Response;

                            if (response === "False") {
                                textChannel.send("\nMovie: " + inputTitle + " not found!");
                            }

                            if (response === "True") {
                                var title = json.Title;
                                var released = json.Released;
                                var genre = json.Genre;
                                var actors = json.Actors;
                                var imdbUrl = json.imdbID;
                                var tomatoMeter = json.tomatoMeter;
                                var tomatoUserMeter = json.tomatoUserMeter;
                                textChannel.send("\nMovie Title: " + title
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
                                textChannel.send("Error with request");
                            }
                        }
                    });
                }
            }
        });
        */
    }
};
function loadRules() {
    command = {};
    commandStrings = [];

    command["ping"] = "pong";
    command["lenny"] = "( ͡° ͜ʖ ͡°)";
    command["lenny face"] = "( ͡° ͜ʖ ͡°)";
    command["pokemon"] = "https://www.youtube.com/watch?v=JuYeHPFR3f0";
    command["420 moe"] = "http://420.moe";
    command["typing game"] = "http://zty.pe/";
    command["dance"] = "http://i.imgur.com/CbDGwLv.gifv";
    command["!disgust"] = "http://i.imgur.com/Ih7NinU.gif";
    command["facepalm"] = "https://i.imgur.com/iWKad22.jpg";
    command["pirate"] = "http://cristgaming.com/pirate.swf";
    command["hype train"] = "http://zone-archive.com/tmp/hype_train.html";
    command["❤ botchan"] = "http://i2.kym-cdn.com/photos/images/original/000/704/937/f38.jpg";

    //Database commands
    Rule.find({}, function (err, rules) {
        if (err) {
            console.log(err);
        }
        else {
            rules.forEach(function (rule) {
                command[rule.command] = rule.response;
                commandStrings.push(rule.command);
            });
        }
    });

    console.log("Reloaded rules");
}
function setOnlineStatus(status) {
    onlineStatus = status;
}
function getOnlineStatus() {
    return onlineStatus;
}
function login() {
    botChan.login(configBot.token);
    setOnlineStatus(true);
}

function logout() {
    botChan.destroy();
    setOnlineStatus(false);

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}