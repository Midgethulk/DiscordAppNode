const Discord = require('discord.js');
var configBot = require('../config/botConfig.js');

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
    return client.login(configBot.token)
      //.then(console.log)
      //.catch(console.error);
  }

  stopBot(){
    client.destroy()
      .then(console.log)
      .catch(console.error);
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



