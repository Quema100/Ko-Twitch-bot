function add(linkCommand,channel,Main,channelname,tags,args,client){
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
            Main[channelname].site.link[linkName] = linkUrl
            Main[channelname].site.sitename.push(linkName)
            console.log(Main[channelname])
            client.say(channel, `${linkName} 링크가 추가되었습니다.`);
            console.log(Main[channelname].site.link);
          } else {
            client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
          }
  
          break;
    }
}
module.exports = add