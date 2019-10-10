const Discord = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const prePath = "./";
const fs = require('fs');

//dotenv.config({path:'../.env'});

dotenv.config();

// var configBot = require('../config/botConfig.js');

const client = new Discord.Client();
const prefix = "!";

let configured = false;

class DiscordBot {
  constructor(){
      if(! DiscordBot.instance){
          DiscordBot.instance = this;
          configured = false;
      }

      return DiscordBot.instance;
  }

  startBot(){
    
    //console.log(process.env.BOT_TOKEN);
    return client.login(process.env.BOT_TOKEN)
      //.then(console.log)
      //.catch(console.error);
  }

  stopBot(){
    return client.destroy()
      //.then(console.log)
      //.catch(console.error);
  }

  configureBot(){
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });
    
    client.on('message', msg => {
      if (msg.content === 'ping') {
        msg.reply('Pong!');
      }
    });
    
    client.on('message', msg => {
      
      var textChannel = msg.channel;
      var strArray = msg.content.split(" ");

      // (strArray[0] === prefix + "play") || (strArray[0] === prefix + "p")

      switch(msg.content){
        case "a": msg.reply('b');
        case "uptime": msg.reply(this.getUptime());
      }
    });

    // Play Sound File
    client.on("message", (message) => {
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

    configured = true;
  }

  getUptime(){
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    return uptime;
  }

}

const botIstance = new DiscordBot();
Object.freeze(botIstance);

// ! Should only be called ones
if (!configured){
  botIstance.configureBot()
}
else{
  console.log("Bot is already configured");
}

botIstance.startBot()
//botIstance.stopBot()

//console.log(client)

module.exports.bot = botIstance;



