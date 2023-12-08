function Twipadd(Main,tags,args,channelname) {
    if (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) {
        const TWIP = args[0]
        Main[channelname].donation['알림창ID'] = TWIP
        console.log(Main[channelname].donation)
    }
  }
module.exports = Twipadd;
