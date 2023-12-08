const add = require('./link command/add.js');

const search = require('./link command/search.js');

function linkaddwithsearch(channel,Main,channelname, tags,args,client) {
    const linkCommand = args[0];
    Main[channelname].site.sitename =[...new Set(Main[channelname].site.sitename)];
    add(linkCommand,channel,Main,channelname, tags,args,client)
    search(linkCommand,channel,Main,channelname,args,client)
}

module.exports = linkaddwithsearch