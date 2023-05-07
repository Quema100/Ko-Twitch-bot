require('dotenv').config();

const request = require('request');

const TWITCH_API_BASE_URL = 'https://api.twitch.tv/helix';

const twitchAPIEndpoint = 'https://api.twitch.tv/helix/streams';

const tmi = require('tmi.js');

const client = new tmi.Client({	
	connection:{
		reconnect:true,
		secure: true
	},
	channels: [ 'quema_100','quema_'],
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
});


let commandUsed = false; // 명령어 사용 여부
let streamOnline = false; // 생방송 중 여부

client.connect().catch(console.error);

client.on('connected',(addr, port)=> {
	console.log(`* Connected to ${addr}:${port}`);
})
const commands = {
	site: {
	  sitename: '',
	},
	link: {},
};
const commandN = {}
const Time = {}
let timerId;

client.on('message', (channel, tags,message,self) => {

	//메시지 기록
	console.log(`${tags['display-name']}: ${message}`);
    //!를 사용하여 명령어 사용
	if(self || !message.startsWith('!')) return;


	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	switch (command) {
		case '정리':
		  if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
			commandN['메시지'] = ''
			Time['시간'] = ''
			commands.site.sitename = ''
			commands.link = {};
			client.say(channel, '정보가 정리되었습니다.');
		  } else {
			client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
		  }
		  break;
	
		case '사이트':
		  const donationSite = commands.site.sitename;
		  if(donationSite!==''){
			client.say(channel, `@${tags.username} 님, 지금 여기에는 ${donationSite.slice(0, -1)} 사이트가 있습니다.`);
		  }else{
			client.say(channel,'아직 사이트가 없습니다.')
		  }
		  break;
	
		case '링크':
		  const linkCommand = args[0];
	
		  switch (linkCommand) {
			case '추가':
			  if (args.length < 3) {
				client.say(channel, '링크를 추가하려면 `!링크 추가 [이름] [링크]`와 같이 입력하세요.');
				break;
			  }
	
			  const linkName = args[1];
			  const linkUrl = args[2];
	
			  if (!linkUrl.startsWith('http')) {
				client.say(channel, '올바른 URL 형식이 아닙니다.');
				break;
			  }
	
			  if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
				commands.link[linkName] = linkUrl;
				commands.site.sitename += linkName+','
				client.say(channel, `${linkName} 링크가 추가되었습니다.`);
				console.log(commands.link);
			  } else {
				client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
			  }
	
			  break;
	
			case '검색':
			  if (args.length < 2) {
				client.say(channel, '링크 이름을 입력하세요.');
				break;
			  }
	
			  const linkNameToSearch = args.slice(1).join(' ');
			  const linkUrlToSearch = commands.link[linkNameToSearch];
	
			  if (linkUrlToSearch) {
				client.say(channel, `${linkNameToSearch}: ${linkUrlToSearch}`);
			  } else {
				client.say(channel, `${linkNameToSearch} 링크를 찾을 수 없습니다.`);
			  }
	
			  break;
	
			default:
			  client.say(channel, '사용 가능한 명령어: !링크 추가 [이름] [링크], !링크 검색 [이름]');
			  break;
		  }
		  break;
		case '반복':
			switch(args[0]){
				case '메시지':
					commandN['메시지'] = '';
					Time['시간']= '';
					if(args.length<3){
						client.say(channel,`@${tags.username}님, 반복할 메시지를 추가하려면 '!반복 메시지 [내용] [시간]'와 같이 입력하세요.`);
						break;
					}
					const command1 = args[1]
					const time = args[2]

					if (isNaN(parseFloat(time))){
						client.say(channel, '시간 값이 아닙니다.');
						break;
					}

					if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {

			            commandN['메시지'] = command1
						Time['시간']=parseFloat(time);
			   	        client.say(channel, `${command1} 반복할 메시지가 추가되었습니다.`);
						clearInterval(timerId);
						if(commandN['메시지'] !== '' && Time['시간'] > 0){
							timerId = setInterval(() => client.say(channel, `${command1}`), Time['시간'] * 10000);
						}
				        console.log(commandN);
						console.log(Time)
			        } else {
				        client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
			        }
			        break;
			    case '값':
					if(commandN['메시지']=== undefined &&Time['시간'] === undefined ){
						client.say(channel, '아직 설정된 값이 없습니다.');
						break;
					}else{
						client.say(channel, `시간: ${Time['시간']} 메시지: ${commandN['메시지']}`);
					}
					break
				default:
					client.say(channel, '사용 가능한 명령어: !반복 명령어 [명령어] [시간], !반복 값');
					break;
			}
			break;

		case '금칙어':
			switch(args[0]){
				case '추가':
					bannedWords =[...new Set(bannedWords)];
					if(args.length<2){
						client.say(channel,`@${tags.username}님, 금칙어를 추가하려면 '!금칙어 추가 [내용] [시간]'와 같이 입력하세요.`);
						break;
					}
					const TimeSet = args[2]
					const TimeOut = args[1]
					
					if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
						setTimeout(function(){
							bannedWords.push(TimeOut);
						},2000)
						console.log(bannedWords)
						client.say(channel, `${TimeOut} 금칙어가 추가되었습니다.`);
						} else {
							client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
						}
						break;
					case '값':
						if(bannedWords.length === 0){
							client.say(channel, '아직 설정된 값이 없습니다.');
							break;
						}else{
							client.say(channel, `금칙어: ${bannedWords} 시간:`);
						}
						console.log(bannedWords)
						break
					default:
						client.say(channel, '사용 가능한 명령어: !금칙어 추가 [내용] [시간], !금칙어 값');
						break;
				}
				break;

	
		case 'echo':
		  client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
		  break;
	
		default:
		  break;
	  }
	if(commandN['메시지'] === '' && (isNaN(Time['시간']) || Time['시간'] < 0||Time['시간']==='')){
		clearInterval(timerId);
		commandN['메시지'] = '';
		Time['시간'] = '';
	}
});
//일반
let bannedWords = []; // 차단할 단어들의 배열
const bancase={}
let i = 1
client.on('message', (channel, tags, message, self) => {
	if(self) return;
	if ((message.startsWith('퀘하') || message.startsWith('hi') || message.startsWith('hello')|| message.startsWith('안녕하세요'))&& streamOnline && !commandUsed) {	
		client.say(channel, `@${tags.username} 님 안녕하세요~`);
		commandUsed = true;
	}
	if(bannedWords.some(word => message.toLowerCase().includes(word))){
		bancase[tags.username] = i++
		if(bancase[tags.username]<=3){
			client.say(channel, `@${tags.username} 님, 예의를 지켜주세요.`);
		    console.log(bancase)
		}

	}
	if(bancase[tags.username]>3){
		//메시지 및 귓속말 전송
		client.say(channel, `@${channel.replace('#', '')}님, @${tags.username}님이 사용하면 안되는 말을 하였습니다.`);

		const url = `https://api.twitch.tv/helix/users?login=${channel.replace('#','')}`;

        // HTTP 요청을 보낼 때 필요한 헤더
        const headers = {
			'Client-ID': process.env.TWITCH_CLIENTID,
			'Authorization':`Bearer ${process.env.TWITCH_TOKEN}`
        };

        // HTTP GET 요청 보내기
        request.get({ url, headers }, (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }

            // API 응답이 JSON 형태이므로 파싱한다.
            const data = JSON.parse(body);
  
           console.log(`채널 주인의 Twitch ID: ${data.data[0].id}`);
		    const requestOptions = {
			    url: `${TWITCH_API_BASE_URL}/whispers?from_user_id=${process.env.TWITCH_BOT_ID}&to_user_id=${data.data[0].id}`,
		    	method: 'POST',
			    headers: {
					'Client-ID': process.env.TWITCH_CLIENTID,
					'Authorization':`Bearer ${process.env.TWITCH_TOKEN}`,
			        'Content-Type': 'application/json'
			    },
			    json: true,
			    body: {
			        message: `@${tags.username}님이 사용하면 안되는 말을 하였습니다.`
			    }};
		        request(requestOptions, (err, res, body) => {
			        if (err) {
			            console.error(err);
			            return;
			        }
			        console.log(`Whisper sent to ${channel.replace('#','')}: ${message}`);
		        });
		
		})
		// 경고 횟수 초기화	
		bancase[tags.username] = 0;
		i = 1;
	}			
});


const channelName=[]

// 1분마다 생방송 상태를 업데이트합니다.
function checkStreamStatus() {
	request({
		url: `${twitchAPIEndpoint}?user_login=${channelName}`,
		headers: {
		  'Client-ID': process.env.TWITCH_CLIENTID,
		  'Authorization':`Bearer ${process.env.TWITCH_TOKEN}`
		}
	  }, (err, res, body) => {
		  if (!err && res.statusCode === 200) {
			  const data = JSON.parse(body).data;
			  if (data.length > 0) {
				
				// 생방송 중이면 생방송 상태를 true로 설정합니다.
		        console.log(`${channelName} is now live with ${data[0].viewer_count} viewers`);
		        streamOnline = true;
			  } else {

				console.log(`${channelName} is now offline`);
		        // 생방송 중이 아니면 생방송 상태를 false로 설정하고,
		        // 명령어 사용 여부를 초기화합니다.
		        streamOnline = false;
		        commandUsed = false;
				clearInterval(timerId);
				commandN['메시지'] = '';
				Time['시간'] = '';
			  }
		  } else {
			  console.log(`Error checking stream status for ${channelName}: ${err}`);
		  }
	  });
}
setInterval(checkStreamStatus, 10000);