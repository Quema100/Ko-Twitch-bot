function channeldelete(channel, tags,channelName,args,client) {
    if (tags.username === 'quema_100' && channel === '#quema_100') {
        const channelToRemove = args.join(' ').toLowerCase();
        if (!channelName || !Array.isArray(channelName)) {
          console.error('잘못된 또는 누락된 channelName 변수입니다.');
          return;
        }
    
        if (channelName.includes(channelToRemove)) {
          client.part(channelToRemove)
            .then(() => {
              console.log(`채널 연결이 해제되었습니다. (#${channelToRemove})`);
              // 특정 메시지와 동일한 요소를 배열에서 제거합니다.
              const index = channelName.findIndex(element => element === channelToRemove);
              if (index !== -1) {
                channelName.splice(index, 1);
              }
            })
            .catch((error) => {
              console.error(`Twitch API 요청 중 오류가 발생했습니다: ${error}`);
            });
        } else {
          console.log(`연결되어 있지 않은 채널입니다. (#${channelToRemove})`);
        }
      }
}

module.exports = channeldelete