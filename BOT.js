require('dotenv').config();

const WebSocketClient = require('websocket').client;

const request = require('request');

const util = require("util");

const requestPromise = util.promisify(request);
//command
const channeljoin = require('./command/All command/Main/another command/channeljoin.js');

const allcommand = require('./command/All command/all command.js')

const TWITCH_API_BASE_URL = 'https://api.twitch.tv/helix';

const twitchAPIEndpoint = 'https://api.twitch.tv/helix/streams';

const tmi = require('tmi.js');

const client = new tmi.Client({	
	connection:{
		reconnect:true,
		secure: true
	},
	channels: [ 'quema_100'],
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
});


let commandUsed = false; // 명령어 사용 여부
let streamOnline = false; // 생방송 중 여부

client.connect().catch(console.error);

const Main ={}

client.on('join', (channel,username, self) => {
	channeljoin(channel, self,channelName,Twipuser,Main)
});

client.on('connected',(addr, port)=> {
	console.log(`* Connected to ${addr}:${port}`);
})

let timerId;

client.on('message', (channel, tags,message,self) => {
	const channelname = channel.replace('#', '')
	
	//메시지 기록
	console.log(`${tags['display-name']}: ${message}`);
    //!를 사용하여 명령어 사용
	if(self || !message.startsWith('!')) return;


	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
	allcommand(channel,tags,Main,channelname,tags,args,client,channelName,command)
	switch (command){
		case '정리':
			if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
			  Main[channelname].text.bannedWords=[];
			  Main[channelname].time['시간'] = '';
			  Main[channelname].text['메시지'] = '';
			  Main[channelname].time['loop'] = '';
			  Main[channelname].site.sitename = [];
			  Main[channelname].site.link = {}
			  Main[channelname].text['밴 사유']
			  client.say(channel, '정보가 정리되었습니다.');
			} else {
			  client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
			}
			break;
		case '반복':
			switch(args[0]){
				case '메시지':
					Main[channelname].text['메시지'] = '';
					Main[channelname].time['loop']= '';
					if(args.length<3){
						client.say(channel,`@${tags.username}님, 반복할 메시지를 추가하려면 '!반복 메시지 [내용] [시간]'와 같이 입력하세요.`);
						break;
					}
					const command1 = args[1]
					const time = args[2]

					if (isNaN(parseFloat(time))||time < 0){
						client.say(channel, '올바른 값이 아닙니다.');
						break;
					}

					if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
			            Main[channelname].text['메시지'] = command1
						Main[channelname].time['loop']=parseFloat(time);
			   	        client.say(channel, `${command1} 반복할 메시지가 추가되었습니다.`);
						clearInterval(timerId);
						if( Main[channelname].text['메시지'] !== '' && Main[channelname].time['loop'] > 0){
							timerId = setInterval(() => client.say(channel, `${command1}`), Main[channelname].time['loop'] * 10000);
						}
				        console.log(Main[channelname].text);
						console.log(Main[channelname].time)
			        } else {
				        client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
			        }
			        break;
			    case '값':
					if((Main[channelname].text['메시지']=== undefined &&Main[channelname].time['loop'] === undefined)|| (Main[channelname].text['메시지']=== '' &&Main[channelname].time['loop'] === '')){
						client.say(channel, '아직 설정된 값이 없습니다.');
						break;
					}else{
						client.say(channel, `시간: ${Main[channelname].time['loop']} 메시지: ${Main[channelname].text['메시지']}`);
					}
					break
				default:
					client.say(channel, '사용 가능한 명령어: !반복 명령어 [명령어] [시간], !반복 값');
					break;
			}
			break;  
		}
		if( Main[channelname].text['메시지'] === '' && (isNaN(Main[channelname].time['loop']) || Main[channelname].time['loop'] < 0||Main[channelname].time['loop']==='')){
			clearInterval(timerId);
			Main[channelname].text['메시지'] = '';
			Main[channelname].time['loop'] = '';
		}
});
//일반

let i = 1
let I = 1
client.on('message', (channel, tags, message, self) => {
	const channelname = channel.replace('#', '')

	getTwitchUser(channel.replace('#',''))
	  .then(name => {
		let i = 1
		const nameArray = name.replace(/\s+/g, '').replace(/[^\w\s\u3131-\u3163\uac00-\ud7a3]|_/gi, '').split('');
		console.log(`채널 닉네임: ${nameArray.some(word => message.toLowerCase().includes(word))}`);
		if (((nameArray.some(word => message.toLowerCase().includes(word)) && (message.endsWith('하')||message.startsWith('하',1))) || message.startsWith('hi') || message.startsWith('hello')|| message.startsWith('안녕하세요'))&&(streamOnline && !commandUsed)) {
			if(Main[channelname].commandused[tags.username]>=1)return	
		    client.say(channel, `@${tags.username} 님 안녕하세요~`);
		    commandUsed = true;
			Main[channelname].commandused[tags.username] = i++
			console.log(Main[channelname].commandused)
	    }
	  })
	  .catch(error => {
		console.error('에러 발생:', error);
	  });
	  
	if(self) return;
 
	if(Main[channelname].text.bannedWords.some(word => message.toLowerCase().includes(word))){
		if(tags.badges && (tags.badges.broadcaster || tags.badges.moderator))return
		Main[channelname].timeoutuser[tags.username] = i++
		if(Main[channelname].timeoutuser[tags.username]<=3){
			client.say(channel, `@${tags.username} 님, 예의를 지켜주세요.`);
		    console.log(Main[channelname].timeoutuser)
			console.log(Main[channelname].banuser)
		}

	}
	if(Main[channelname].timeoutuser[tags.username]>3){
		if(tags.badges && (tags.badges.broadcaster || tags.badges.moderator))return
		Main[channelname].banuser[tags.username] = I++
		//메시지 및 귓속말 전송
		client.say(channel, `@${channel.replace('#', '')} 님, @${tags.username} 님이 사용하면 안되는 말을 하였습니다.`);

		const url = `${TWITCH_API_BASE_URL}/users?login=${channel.replace('#','')}`;

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
			        message: `@${tags.username} 님이 사용하면 안되는 말을 하였습니다.`
			    }};
		        request(requestOptions, (err, res, body) => {
			        if (err) {
			            console.error(err);
			            return;
			        }
			        console.log(`Whisper sent to ${channel.replace('#','')}: ${requestOptions.body.message}`);
		        });
				const url = `${TWITCH_API_BASE_URL}/users?login=${tags.username}`;

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
					const data2 = JSON.parse(body);
		  
					console.log(`${tags.username}의 Twitch ID: ${data2.data[0].id}`);
					// Twitch API의 엔드포인트 URL
                    const url = `${TWITCH_API_BASE_URL}/moderation/bans?broadcaster_id=${data.data[0].id}&moderator_id=${process.env.TWITCH_BOT_ID}`;

                    // Twitch API 요청 헤더
                    const headers = {
						'Client-ID': process.env.TWITCH_CLIENTID,
						'Authorization':`Bearer ${process.env.TWITCH_TOKEN}`,
                        'Content-Type': 'application/json'
                    };

                    // Twitch API 요청 바디
					const body2 = {
						'data': {
						  'user_id': `${data2.data[0].id}`,
						  'duration': Main[channelname].time['시간'],
						  'reason': '규칙 위반'
						}
					  };

                   // Twitch API 요청 보내기
                   request.post({url: url, headers: headers, body: JSON.stringify(body2)}, (err, res, body) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(body);
                        }
                    });

				})
		})
		// 경고 횟수 초기화	
		Main[channelname].timeoutuser[tags.username] = 0;
		i = 1;
	}

	if(Main[channelname].banuser[tags.username] > 3 ){
		const url = `${TWITCH_API_BASE_URL}/users?login=${channel.replace('#','')}`;

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
			const url = `${TWITCH_API_BASE_URL}/users?login=${tags.username}`;

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
				const data2 = JSON.parse(body);
	  
				console.log(`${tags.username}의 Twitch ID: ${data2.data[0].id}`);
				// Twitch API의 엔드포인트 URL
				const url = `${TWITCH_API_BASE_URL}/moderation/bans?broadcaster_id=${data.data[0].id}&moderator_id=${process.env.TWITCH_BOT_ID}`;

				// Twitch API 요청 헤더
				const headers = {
					'Client-ID': process.env.TWITCH_CLIENTID,
					'Authorization':`Bearer ${process.env.TWITCH_TOKEN}`,
					'Content-Type': 'application/json'
				};

				// Twitch API 요청 바디
				const body2 = {
					'data': {
					  'user_id': `${data2.data[0].id}`,
					  'reason': `${Main[channelname].text['밴 사유']}`
					}
				  };

			   // Twitch API 요청 보내기
			   request.post({url: url, headers: headers, body: JSON.stringify(body2)}, (err, res, body) => {
					if (err) {
						console.error(err);
					} else {
						console.log(body);
					}
				});

			})
		})
		I = 1
	}
});

async function getTwitchUser(channel) {
	const url = `${TWITCH_API_BASE_URL}/users?login=${channel.replace('#', '')}`;
	const headers = {
	  'Client-ID': process.env.TWITCH_CLIENTID,
	  'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`
	};
	const response = await fetch(url, { headers });
	const data = await response.json();
	const nickname = data.data[0].display_name;
	return nickname;
  }

let channelName=[]

async function checkStreamStatus(channelName) {
	try {
	  const response = await fetch(`${twitchAPIEndpoint}?user_login=${channelName}`, {
		headers: {
		  'Client-ID': process.env.TWITCH_CLIENTID,
		  'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`
		}
	  });
  
	  if (response.ok) {
		const data = await response.json();
		if (data.data.length > 0) {
		  // 생방송 중이면 생방송 상태를 true로 설정합니다.
		  console.log(`${channelName} is now live with ${data.data[0].viewer_count} viewers`);
		  streamOnline = true;
		} else {
		  Main[channelName].commandused = {};
		  console.log(`${channelName} is now offline`);
		  // 생방송 중이 아니면 생방송 상태를 false로 설정하고,
		  // 명령어 사용 여부를 초기화합니다.
		  streamOnline = false;
		  commandUsed = false;
		  clearInterval(timerId);
		  Main[channelName].text['메시지'] = '';
		  Main[channelName].time['loop'] = '';
		}
	  } else {
		console.log(`Error checking stream status for ${channelName}: ${response.status} - ${response.statusText}`);
		// 생방송 상태를 "오프라인"으로 처리합니다.
		Main[channelName].commandused = {};
		streamOnline = false;
		commandUsed = false;
		clearInterval(timerId);
		Main[channelName].text['메시지'] = '';
		Main[channelName].time['loop'] = '';
	  }
	} catch (error) {
	  console.log(`Error checking stream status for ${channelName}: ${error}`);
	  // 생방송 상태를 "오프라인"으로 처리합니다.
	  Main[channelName].commandused = {};
	  streamOnline = false;
	  commandUsed = false;
	  clearInterval(timerId);
	  Main[channelName].text['메시지'] = '';
	  Main[channelName].time['loop'] = '';
	}
}

setInterval(() => {
	for (let i = 0; i < channelName.length; i++) {
	  checkStreamStatus(channelName[i]);
	  console.log(channelName)
	}
  }, 10000);

// Twip configuration
const twipSettings = {
	use: true,
	alertbox_url: `https://twip.kr/widgets/alertbox/${process.env.AlertBoxId}`,
	token: null,
	version: null
  };

// Function to send a thanks message to the Twitch chat
function sendThanksMessage(message) {
	client.say('#quema_100', message);
  }

function adduser(username) {
  if (!channelName || !Array.isArray(channelName)) {
    console.error('잘못된 또는 누락된 channelName 변수입니다.');
    return;
  }

  if (!channelName.includes(username)) {
    client.join(username)
      .catch((error) => {
        console.error(`Twitch API 요청 중 오류가 발생했습니다: ${error}`);
      });
  } else {
    console.log(`이미 연결된 채널입니다. (#${username})`);
  }
}
  
  // Function to initialize Twip
  async function initializeTwip() {
	console.log('Initializing Twip');
	try {
	  const response = await requestPromise(twipSettings.alertbox_url);
	  if (response.statusCode == 200) {
		const matchedToken = response.body.match(/window\.__TOKEN__ = \'(.+)\';<\/script>/);
		if (matchedToken !== null && matchedToken.length > 1) {
		  twipSettings.token = matchedToken[1];
		  console.log(`Twip token retrieved: ${twipSettings.token}`);
		} else {
		  console.error('Failed to retrieve Twip token.');
		}
  
		const matchedVersion = response.body.match(/version: \'(.+)\',/);
		if (matchedVersion !== null && matchedVersion.length > 1) {
		  twipSettings.version = matchedVersion[1];
		  console.log(`Twip version retrieved: ${twipSettings.version}`);
		} else {
		  console.error('Failed to retrieve Twip version.');
		}
	  } else {
		console.error('Failed to retrieve Twip token and version.');
	  }
	} catch (e) {
	  console.error('Error retrieving Twip token, version: ' + e.toString());
	}
  }
  
  // Function to connect to Twip WebSocket
  function connectTwip() {
	const twipClient = new WebSocketClient();
	
	twipClient.on('connectFailed', (error) => {
	  console.log('Twip Connect Error: ' + error.toString());
	});
	
	twipClient.on('connect', (connection) => {
	  console.log('Twip Connected');
	 
	  setInterval(() => {
		connection.send('2');
	  }, 22000);
	  
	  connection.on('error', (error) => {
		console.error('Twip Connection Error: ' + error.toString());
	  });
	  
	  connection.on('close', () => {
		console.error('Twip Connection Closed. Trying to reconnect after 10 seconds...');
		setTimeout(() => {
		  connectTwip();
		}, 10000);
	  });
  
	  connection.on('message', (message) => {
		try {
		  if (message.type === 'utf8') {
			const body = message.utf8Data;
			let eventName = null;
			let data = null;
			let details = null;
			if (body.charAt(body.length - 1) == ']') {
			  data = JSON.parse(body.substring(body.indexOf('['), body.length));
			  eventName = data[0];
			  details = data[1];
			}
  
			if (eventName) {
			  switch (eventName.toLowerCase()) {
				case 'new donate':
					sendThanksMessage(`@${details.nickname} 님 ${details.amount}원 감사합니다`);
					if(details.amount>= 10000){
						Main['quema_100'].donation[details.nickname] = new Date();
						adduser(details.nickname);
						channelRemove.push(details.nickname);
					};
					console.log(details);
					break
				case 'new cheer':
					sendThanksMessage(`@${details.nickname} 님 ${details.amount}비트 후원 감사합니다`);
					if(details.amount>= 500){
						Main['quema_100'].donation[details.nickname] = new Date();
						adduser(details.nickname);
						channelRemove.push(details.nickname);
					};
					console.log(details);
					break
				case 'new follow':
					sendThanksMessage(`@${details.nickname} 님 팔로우 감사합니다`);
					console.log(details);
					break
				case 'new sub':
					sendThanksMessage(`@${details.username} 님 ${details.months}개월 구독 감사합니다`);
					Main['quema_100'].donation[details.username] = new Date();
					channelRemove.push(details.username);
					adduser(details.username);
					console.log(details);
					break
				case 'new hosting':
					sendThanksMessage(`@${details.username} 님 ${details.viewers}명 호스팅 감사합니다`);
					console.log(details);
					break
				case 'new redemption':
				  sendThanksMessage(`${details.nickname} 님 영상도네 감사합니다`);
				  console.log(details);
				  break;
  
				default:
				  break;
			  }
			}
		  }
		} catch (e) {
		  console.error('Error from Twip message: ' + e.toString());
		}
	  });
	});
	
	const url_ws_twip = `wss://io.mytwip.net/socket.io/?alertbox_key=${process.env.AlertBoxId}&version=${twipSettings.version}&token=${encodeURIComponent(twipSettings.token)}&transport=websocket`;
	twipClient.connect(url_ws_twip);
  };
  
 // Initialize Twip and connect to Twip WebSocket
initializeTwip()
.then(() => {
  // Connect to Twip WebSocket
  setTimeout(() => {
	connectTwip();
  }, 1000);
})
.catch((error) => {
  console.error('Unhandled promise rejection:', error);
});

let channelRemove = [];

function date(channelRemove) {
	if (Main['quema_100'].donation === undefined) return;
	if (Main['quema_100'].donation[channelRemove] === undefined) return;
	const donationDate = new Date(Main['quema_100'].donation[channelRemove]);
	const expirationDate = new Date(donationDate.getFullYear(), donationDate.getMonth(), donationDate.getDate() + 30);
	if (expirationDate <= new Date()) {
	  if (!channelRemove || !Array.isArray(channelRemove)) {
		console.error('잘못된 또는 누락된 channelRemove 변수입니다.');
		return;
	  };
  
	  if (channelRemove.includes(channelRemove)) {
		client.part(channelRemove)
		  .then(() => {
			console.log(`채널 연결이 해제되었습니다. (#${channelRemove})`);
			Main['quema_100'].donation = {};
			// 특정 메시지와 동일한 요소를 배열에서 제거합니다.
			const index = channelRemove.findIndex(element => element === channelRemove);
			if (index !== -1) {
				channelRemove.splice(index, 1);
			};
		  })
		  .catch((error) => {
			console.error(`Twitch API 요청 중 오류가 발생했습니다: ${error}`);
		  });
	  } else {
		console.log(`연결되어 있지 않은 채널입니다. (#${channelRemove})`);
	  };
	  console.log(date);
	};
};
  
setInterval(() => {
	for (let i = 0; i < channelRemove.length; i++) {
	  if (Main['quema_100'].donation === undefined) return;

	  date(channelRemove[i]);

	  const donationDate = new Date(Main['quema_100'].donation[channelRemove[i]]);
	  const expirationDate = new Date(donationDate.getFullYear(), donationDate.getMonth(), donationDate.getDate() + 30);
	
	  const remainingTime = expirationDate.getTime() - Date.now();
	
	  console.log(`${channelRemove[i]}: ${remainingTime}ms`);

	  console.log(expirationDate);

	  console.log(Main['quema_100'].donation);
	  
	}
}, 10000);

let Twipuser = []

const twipUserSettings = {
  use: true,
  alertbox_url: null,
  token: null,
  version: null,
};

// Function to send a thanks message to the Twitch chat
function sendThanksUserMessage(channel, message) {
	client.say(channel, message);
  }
  
  // Function to initialize Twip
  async function initializeUserTwip(channel) {
	console.log(`Initializing Twip for channel ${channel}`);
	try {
	  if (
		Main[channel] &&
		Main[channel].donation &&
		Main[channel].donation['알림창ID']
	  ) {
		const alertbox_urlID = Main[channel].donation['알림창ID'];
		const alertbox_url = `https://twip.kr/widgets/alertbox/${alertbox_urlID}`;
  
		const response = await requestPromise(alertbox_url);
		if (response.statusCode == 200) {
		  const matchedToken = response.body.match(/window\.__TOKEN__ = \'(.+)\';<\/script>/);
		  if (matchedToken !== null && matchedToken.length > 1) {
			twipUserSettings.token = matchedToken[1];
			console.log(`Twip token retrieved for channel ${channel}: ${twipUserSettings.token}`);
		  } else {
			console.error(`Failed to retrieve Twip token for channel ${channel}.`);
		  }
  
		  const matchedVersion = response.body.match(/version: \'(.+)\',/);
		  if (matchedVersion !== null && matchedVersion.length > 1) {
			twipUserSettings.version = matchedVersion[1];
			console.log(`Twip version retrieved for channel ${channel}: ${twipUserSettings.version}`);
		  } else {
			console.error(`Failed to retrieve Twip version for channel ${channel}.`);
		  }
		} else {
		  console.error(`Failed to retrieve Twip token and version for channel ${channel}.`);
		}
	  } else {
		console.error(`Data for channel ${channel} is missing or incomplete.`);
	  }
	} catch (e) {
	  console.error(`Error retrieving Twip token, version for channel ${channel}: ${e.toString()}`);
	}
  }
  
  // Function to connect to Twip WebSocket
  function connectUserTwip(channel) {
	if (
	  Main[channel] &&
	  Main[channel].donation &&
	  Main[channel].donation['알림창ID']
	) {
	  const twipClient = new WebSocketClient();
  
	  twipClient.on('connectFailed', (error) => {
		console.log(`Twip Connect Error for channel ${channel}: ${error.toString()}`);
	  });
  
	  twipClient.on('connect', (connection) => {
		console.log(`Twip Connected for channel ${channel}`);
  
		setInterval(() => {
		  connection.send('2');
		}, 22000);
  
		connection.on('error', (error) => {
		  console.error(`Twip Connection Error for channel ${channel}: ${error.toString()}`);
		});
  
		connection.on('close', () => {
		  console.error(`Twip Connection Closed for channel ${channel}. Trying to reconnect after 10 seconds...`);
		  setTimeout(() => {
			connectUserTwip(channel);
		  }, 10000);
		});
  
		connection.on('message', (message) => {
		  try {
			if (message.type === 'utf8') {
			  const body = message.utf8Data;
			  let eventName = null;
			  let data = null;
			  let details = null;
			  if (body.charAt(body.length - 1) == ']') {
				data = JSON.parse(body.substring(body.indexOf('['), body.length));
				eventName = data[0];
				details = data[1];
			  }
  
			  if (eventName) {
				switch (eventName.toLowerCase()) {
				  case 'new donate':
					sendThanksUserMessage(`#${channel}`, `@${details.nickname} 님 ${details.amount}원 감사합니다`);
					console.log(details);
					break;
				  case 'new cheer':
					sendThanksUserMessage(`#${channel}`, `@${details.nickname} 님 ${details.amount}비트 후원 감사합니다`);
					console.log(details);
					break;
				  case 'new follow':
					sendThanksUserMessage(`#${channel}`, `@${details.nickname} 님 팔로우 감사합니다`);
					console.log(details);
					break;
				  case 'new sub':
					sendThanksUserMessage(`#${channel}`, `@${details.username} 님 ${details.months}개월 구독 감사합니다`);
					break;
				  case 'new hosting':
					sendThanksUserMessage(`#${channel}`, `@${details.username} 님 ${details.viewers}명 호스팅 감사합니다`);
					console.log(details);
					break;
				  case 'new redemption':
					sendThanksUserMessage(`#${channel}`, `${details.nickname} 님 영상도네 감사합니다`);
					console.log(details);
					break;
  
				  default:
					break;
				}
			  }
			}
		  } catch (e) {
			console.error(`Error from Twip message for channel ${channel}: ${e.toString()}`);
		  }
		});
	  });
  
	  const url_ws_twip = `wss://io.mytwip.net/socket.io/?alertbox_key=${Main[channel].donation['알림창ID']}&version=${twipUserSettings.version}&token=${encodeURIComponent(
		twipUserSettings.token
	  )}&transport=websocket`;
	  twipClient.connect(url_ws_twip);
	} else {
	  console.error(`Data for channel ${channel} is missing or incomplete. Cannot connect to Twip WebSocket.`);
	}
  }

  
const connectedChannels = [];
let currentChannelIndex = 0;
  // Connect all channels
async function connectAllChannels() {

  while (currentChannelIndex < Twipuser.length) {
    const channel = Twipuser[currentChannelIndex];

    if (Main[channel] && Main[channel].donation && Main[channel].donation['알림창ID']) {
      if (connectedChannels.includes(channel)) {
		
        console.log(`${channel} is already connected.`);

        currentChannelIndex++;

        continue;
      }

      console.log(`Adding channel ${channel}`);

      connectedChannels.push(channel); // Add channel to the connected channels array

      // Initialize Twip and connect to Twip WebSocket
      try {
        await initializeUserTwip(channel);

        connectUserTwip(channel);

        currentChannelIndex++;
      } catch (error) {
        console.error('Unhandled promise rejection:', error);
        currentChannelIndex++;
      }
    } else {
      console.error(`Data for channel ${channel} is missing or incomplete.`);
      currentChannelIndex++;
    }
  }

  console.log('All channels connected');

  console.log('Connected channels:', connectedChannels);

  setTimeout(connectAllChannels, 60000); // Retry connecting all channels after 10 seconds
}

// Start connecting all channels
connectAllChannels();