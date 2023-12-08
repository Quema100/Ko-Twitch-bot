function channeljoin(channel, self,channelName,Twipuser,Main) {
    if (self) { // 봇 자신이 채널에 접속했을 경우
		if (!channelName.includes(channel)) { // 이미 연결된 채널이 아닌 경우
			channelName.push(channel.replace('#', '')); // 채널 리스트에 추가
			Twipuser.push(channel.replace('#', ''))
			channelName =[...new Set(channelName)];
			Twipuser =[...new Set(Twipuser)]
		    console.log(`Joined channel ${channel}`);
			const channelconnected = channel.replace('#', '');
			Main[channelconnected] = {
				site: {
					sitename: [],
					link: {}, // 링크
				},
				time: {}, // 임시 차단 시간 & 반복 시간
				text:{ // 반복할 메시지
					bannedWords:[] // 차단할 단어들의 배열
				},
				timeoutuser:{}, // 경고 유저 정보
				banuser:{}, // 밴 유저 정보
			    // ...
				commandused:{},
				donation: {}
			};
			console.log(Main);
		}
	}
}

module.exports = channeljoin