function site(channel,Main,channelname,tags,client){
    const donationSite = Main[channelname].site.sitename;
    if(donationSite.length !== 0){
      client.say(channel, `@${tags.username} 님, 지금 여기에는 ${donationSite} 사이트가 있습니다.`);
    }else{
      client.say(channel,'아직 사이트가 없습니다.')
    }
}

module.exports = site