function infoclean(channel,Main,channelname,tags,client,timerId) {
    if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
        Main[channelname].text.bannedWords=[];
        Main[channelname].time['시간'] = '';
        Main[channelname].text['메시지'] = '';
        Main[channelname].time['loop'] = '';
        Main[channelname].site.sitename = [];
        Main[channelname].site.link = {}
        Main[channelname].text['밴 사유'] = ''
        timerId = null
        clearInterval(timerId)
        client.say(channel, '정보가 정리되었습니다.');
      } else {
        client.say(channel, `@${tags.username} 님, 관리자 권한이 없습니다.`);
      }
}

module.exports = infoclean