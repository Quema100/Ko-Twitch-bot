function channeladd(channel, tags,channelName,args,client) {
    if (tags.username === 'quema_100' && channel === '#quema_100') {
        const newChannel = args.join(' ').toLowerCase();
        if (!channelName || !Array.isArray(channelName)) {
            console.error('잘못된 또는 누락된 channelName 변수입니다.');
            return;
          }
        
          if (!channelName.includes(newChannel)) {
            client.join(newChannel)
              .catch((error) => {
                console.error(`Twitch API 요청 중 오류가 발생했습니다: ${error}`);
              });
          } else {
            console.log(`이미 연결된 채널입니다. (#${newChannel})`);
        }
    }
}
module.exports = channeladd;