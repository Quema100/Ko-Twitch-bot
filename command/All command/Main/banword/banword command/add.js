function add(channel,Main,channelname,tags,args,client) {
    switch(args[0]){
        case '추가':	
            Main[channelname].time['시간']=0
            if(args.length<3){
                client.say(channel,`@${tags.username}님, 금칙어를 추가하려면 '!금칙어 추가 [단어] [시간] [밴 사유]'와 같이 입력하세요.`);
                break;
            }					
            const BanReason = args[3]
            const TimeSet = args[2]
            const TimeOut = args[1]

            if ((isNaN(parseFloat(TimeSet))||TimeSet<0)||(BanReason === ''||BanReason===undefined)){
                client.say(channel, '올바른 값이 아닙니다.');
                break;
            }
            if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
                Main[channelname].text.bannedWords =[...new Set(Main[channelname].text.bannedWords)];
                Main[channelname].text['밴 사유'] = BanReason
                Main[channelname].text.bannedWords.push(TimeOut);
                Main[channelname].time['시간']=parseFloat(TimeSet)*60
                console.log(Main[channelname].text)
                console.log(BanReason)
                client.say(channel, `${TimeOut} 금칙어가 추가되었습니다. 금칙어를 총 3번 사용하였을 때 ${TimeSet}분 타임아웃 됩니다. 그 후 밴처리 됩니다. 그리고 밴 사유는 ${BanReason}로 지정되었습니다.`);
                } else {
                    client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
                }
                break;
    }
}

module.exports = add