function search(linkCommand,channel,Main,channelname,args,client) {
    switch (linkCommand) {
        case '검색':
            if (args.length < 2) {
              client.say(channel, '링크 이름을 입력하세요.');
              break;
            }
    
            const linkNameToSearch = args.slice(1).join(' ');
            const linkUrlToSearch = Main[channelname].site.link[linkNameToSearch];
    
            if (linkUrlToSearch) {
              client.say(channel, `${linkNameToSearch}: ${linkUrlToSearch}`);
            } else {
              client.say(channel, `${linkNameToSearch} 링크를 찾을 수 없습니다.`);
            }
    
            break;
        default:
          if(args.length <1){
            client.say(channel, '사용 가능한 명령어: !링크 추가 [이름] [링크], !링크 검색 [이름]');
          }
            break;
    }
}
module.exports = search