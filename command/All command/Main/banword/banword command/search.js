function search(channel,Main,channelname,args,client) {
    switch(args[0]){
        case '값':
            if( Main[channelname].text.bannedWords.length === 0){
                client.say(channel, '아직 설정된 값이 없습니다.');
                break;
            }else{
                client.say(channel, `금칙어: ${Main[channelname].text.bannedWords}, 시간:${Main[channelname].time['시간']}, 밴 사유:${Main[channelname].text['밴 사유']}`);
                console.log(Main[channelname])
            }
            break
        default:
            if (args.length <1){
                client.say(channel, '사용 가능한 명령어: !금칙어 추가 [단어] [시간] [밴 사유], !금칙어 값');
            }
            break;
    }
}

module.exports = search