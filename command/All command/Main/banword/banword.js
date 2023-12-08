const add = require('./banword command/add.js')

const search = require('./banword command/search.js')

function bannedWord(channel,Main,channelname,tags,args,client) {
    Main[channelname].text.bannedWords =[...new Set(Main[channelname].text.bannedWords)];
    add(channel,Main,channelname,tags,args,client)
    search(channel,Main,channelname,args,client)
}

module.exports = bannedWord