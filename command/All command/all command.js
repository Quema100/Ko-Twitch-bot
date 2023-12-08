//command
const Twipadd = require('./Main/another command/Twip.js');

const channeladd = require('./Main/channel/channeladd.js')

const channeldelete = require('./Main/channel/channeldelete.js')

const site = require('./Main/another command/site.js');

const link = require('./Main/link/link.js')

const bannedWord = require('./Main/banword/banword.js')

function allcommand(channel,tags,Main,channelname,tags,args,client,channelName,command){
	switch (command) {
		case '트윕':
			Twipadd(Main,tags,args,channelname)
			break
		case '추가':
			channeladd(channel, tags,channelName,args,client)
			break
		case '삭제':
			channeldelete(channel, tags,channelName,args,client)
			break;
	
		case '사이트':
			site(channel,Main,channelname,tags,client)
		  break;
	
		case '링크':
			link(channel,Main,channelname,tags,args,client)
		  break;

		case '금칙어':
			bannedWord(channel,Main,channelname,tags,args,client)
			break;
	
		case 'echo':
		  client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
		  break;
	
		default:
		  break;
	  }
} 

module.exports = allcommand