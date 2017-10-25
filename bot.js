var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// var stats = require('./index.js');
var Crawler = require("crawler");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    // console.log(user);
    // console.log(userID);
    // console.log(channelID);
    // console.log(message);
    // console.log(evt);

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var server = bot.servers[bot.channels[channelID].guild_id];

        args = args.splice(1);
        switch(cmd) {
            // !statsme
            case 'stats':
                sendStas(user, channelID)
            break;
            case 'statschat':
                var voiceChannel = server.members[userID].voice_channel_id;
                var members = server.channels[voiceChannel].members;
                console.log(members);
                for (var i = 0; i < members.length; i++) {
                    console.log(members[i]);
                    var member = server.members[members[i].user_id]
                    console.log(member);
                }
                // sendStas(user, channelID)
            break;
            // Just add any case commands if you want to..
         }
     }
});
var c = new Crawler({
    rateLimit: 2000,
    maxConnections: 1,
    callback: function(error, res, done) {
        if(error) {
            console.log(error)
        } else {
            var $ = res.$;
            console.log($('title').text())
        }
        done();
    }
})
function sendStas(user, channelID){
    c.queue([{
        uri: 'https://fortnitetracker.com/profile/pc/' + user,
        maxConnections : 10,
        rateLimit: 1000,
        jQuery: {
            name: 'cheerio',
            options: {
                normalizeWhitespace: true,
                xmlMode: true
            }
        },
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            } else {
                var $ = res.$;
                var info = [];
                var playerData;
                var accountInfo;
                var LifeTimeStats;
                var response = "";

                $(".content-container").find('script[type="text/javascript"]').each(function(i, elem) {
                    if (i <= 2) {
                        info[i] = $(this).html();
                        info[i] = info[i].replace("var playerData = ","");
                        info[i] = info[i].replace("var accountInfo = ","");
                        info[i] = info[i].replace("var LifeTimeStats = ","");
                        info[i] = info[i].substring(0, info[i].length - 1);

                        // console.log("--------"+i+"-------");
                        // console.log($(this).html());
                    }
                });

                playerData = JSON.parse(info[0]);
                accountInfo = JSON.parse(info[1]);
                LifeTimeStats = JSON.parse(info[2]);

                // console.log("https://fortnitetracker.com/profile/pc/arelam");
                var name =  accountInfo.Nickname + ": " + getPlatformName(accountInfo)
                console.log("\x1b[32m", name);

                var temp;
                var infolist;
                var stats = {};

                for (var prop in playerData) {
                    // console.log("---");
                    // console.log(playerData[prop]);
                    infolist = getPlaylistDisplay(prop)
                    // response += "\n"
                    // response += "> " + infolist
                    // response += "\n"
                    // response += "<Wins" +  playerData[prop].filter(function (item) {
                    //     if (item.field == field) {
                    //         result.push(item);
                    //     } + "temp.displayValue + >"
                    // console.log("\x1b[33m", infolist);
                    stats[infolist] = {};
                    for (var i = 0; i < playerData[prop].length; i++) {
                        temp = playerData[prop][i];
                        stats[infolist][temp.label] = temp.displayValue;
                        // switch (temp.label) {
                        //     case "Top 5":
                        //         if ( infolist == 'Duo') {
                        //             // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //             response +="\n <" +  temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //         }
                        //         break;
                        //     case "Top 6":
                        //         if (infolist == 'Squad') {
                        //             response += "<" + temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //             // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         }
                        //         break;
                        //     case "Top 10":
                        //         if (infolist == 'Solo') {
                        //             response += "<" +  temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //             // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         }
                        //         break;
                        //     case "Top 12":
                        //         if (infolist == 'Duo') {
                        //             response +="<" +  temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //             // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         }
                        //         break;
                        //     case "Top 25":
                        //         if (infolist == 'Solo') {
                        //             response += "<" + temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //             // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         }
                        //         break;
                        //     case "Wins":
                        //         // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         // response += "\n <" + temp.label + ": " + temp.displayValue + ">";
                        //         stats[infolist][temp.label] = temp.displayValue;
                        //         break;
                        //     case "Matches":
                        //         response += "<" + temp.label + ": " + temp.displayValue + ">";
                        //         // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         break;
                        //     case "Kills":
                        //         response +="<" +  temp.label + ": " + temp.displayValue + ">";
                        //         // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         break;
                        //     case "Time-Played":
                        //         response +="\n <" +  temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //         // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         break;
                        //     case "Kills Per Match":
                        //         response +=" <" +  temp.label.split(' ').join('-') + ": " + temp.displayValue + ">";
                        //         // console.log("\x1b[36m", temp.label + ": " + temp.displayValue);
                        //         break;
                        //     default:
                        // }
                    }
                }
                console.log(stats);
                response +=
                "```md" +
                "\n [" +  accountInfo.Nickname + "](" + getPlatformName(accountInfo) + ") \n"+
                "\n>/=======* Solo *========|==========* Duo *========|========* Squad *========" +
                "\n<Wins:"+ pad(stats.Solo.Wins, 4) +"> <Top-10:"+ pad(stats.Solo['Top 10'], 4) +">|<Wins:"+ pad(stats.Duo.Wins, 4) +"> <Top-12:"+ pad(stats.Duo['Top 12'], 4) +">|<Wins:"+ pad(stats.Squad.Wins, 4) +">  <Top-6:"+pad(stats.Squad['Top 6'], 4)+">" +
                "\n>-                       |                         |" +
                "\n<Games:"+ pad(stats.Solo.Matches, 4) +"> <Kills:"+ pad(stats.Solo.Kills, 4) +">|<Games:"+ pad(stats.Duo.Matches, 4) +"> <Kills:"+ pad(stats.Duo.Kills, 4) +">|<Games:"+ pad(stats.Squad.Matches, 4) +"> <Kills:"+ pad(stats.Squad.Kills, 4) +">" +
                "\n>-                       |                         |" +
                "\n<Killes-Per-Match: "+ pad(stats.Solo['Kills Per Match'], 5) +">|<Killes-Per-Match: "+ pad(stats.Duo['Kills Per Match'], 5) +">|<Killes-Per-Match: "+ pad(stats.Squad['Kills Per Match'], 5) +">" +
                "\n>-                       |                         |" +
                // "\n<Time-Played: 10d 14h 13m><Time-Played: 10d 14h 31m><Time-Played: 10d 14h 13m>"+
                "\n<Time-Played:"+ pad(stats.Solo['Time Played'], 12) +">|<Time-Played:"+ pad(stats.Duo['Time Played'], 12) +">|<Time-Played:"+ pad(stats.Squad['Time Played'], 12) +">"+
                "```";

                console.log('\x1b[37m', '====================================================');
                bot.sendMessage({
                    to: channelID,
                    message: response
                });
            }
            done();
        }
    }]);
}
function pad(num, size) {
    console.log(num);
    var s = num+"";
    while (s.length < size) s = " " + s;
    return s;
}
getPlaylistDisplay = function (id) {
    id = id.toLowerCase();

    if (id === 'p2') {
        return 'Solo';
    } else if (id === 'p10') {
        return 'Duo';
    } else if (id === 'p9') {
        return 'Squad';
    }
}
getPlatformName = function (accInfo) {
    switch (accInfo.Platform) {
        case 3:
            return "PC";
        case 2:
            return "Playstation 4";
        case 1:
            return "Xbox One";
        default:
            return "";
    }
}
// console.log("https://fortnitetracker.com/profile/pc/arelam");
c.queue('https://fortnitetracker.com/profile/pc/arelam');
/*
|        Solo         |          Duo          |          Squad        |
Wins
Kills per Match: 1.39 | Kills per Match: 1.39 | Kills per Match: 1.39 |
*/
