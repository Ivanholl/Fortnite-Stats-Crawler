var Crawler = require("crawler");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// var _eval = require('eval')
var response = "";

var c = new Crawler({
    maxConnections : 10,
    rateLimit: 1000,
    jQuery: {
        name: 'cheerio',
        options: {
            normalizeWhitespace: true,
            xmlMode: true
        }
    },
    // jQuery: jsdom,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        } else {
            var $ = res.$;
            var info = [];
            var playerData;
            var accountInfo;
            var LifeTimeStats;

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
            var name =  accountInfo.Nickname + " - " + getPlatformName(accountInfo)
            console.log("\x1b[32m", name);
            response += name;

            var temp;
            var infolist;
            for (var prop in playerData) {
                // console.log("---");
                infolist = getPlaylistDisplay(prop)
                console.log("\x1b[33m", infolist);
                for (var i = 0; i < playerData[prop].length; i++) {
                    temp = playerData[prop][i];

                    switch (temp.label) {
                        case "Wins":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        case "Top 5":
                            if ( infolist == 'Duo') {
                                console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            }
                            break;
                        case "Top 6":
                            if (infolist == 'Squad') {
                                console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            }
                            break;
                        case "Top 10":
                            if (infolist == 'Solo') {
                                console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            }
                            break;
                        case "Top 12":
                            if (infolist == 'Duo') {
                                console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            }
                            break;
                        case "Top 25":
                            if (infolist == 'Solo') {
                                console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            }
                            break;
                        case "Wins":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        case "Matches":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        case "Kills":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        case "Time Played":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        case "Kills Per Match":
                            console.log("\x1b[36m", temp.label + " - " + temp.displayValue);
                            break;
                        default:
                    }
                }
            }
            console.log('\x1b[37m', '====================================================');

        }
        done();
    }
});
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

// var players = ['arelam', 'qpas']
// players.forEach(function(name, index) {
//     c.queue('https://fortnitetracker.com/profile/pc/' + name);
// })

// c.queue('https://fortnitetracker.com/profile/pc/arelam');
// c.queue('https://fortnitetracker.com/profile/pc/qpas');

// c.queue(['https://fortnitetracker.com/profile/pc/arelam','https://fortnitetracker.com/profile/pc/qpas']);

module.exports = {
    c:c
};
