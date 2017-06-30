const Fuse = require('fuse.js')
const whitelist = require('./whitelist.js')
const commons = require('./../commons.js')

const options = {
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name']
}

var siftChannels = function(slapp, token, query, callback) {
  slapp.client.channels.list({'token': token}, (err, channelData) => {
    slapp.client.groups.list({'token': token}, (err, groupData) => {
      let result = channelData.channels.concat(groupData.groups)
      if (err) { 
        return callback(err, null)
      } else if (query) {
        let fuse = new Fuse(result, options)
        result = fuse.search(query)
      }
      let index;
      for (index = 0; index < result.length; index++) {
        if (!result[index].is_member) {
          result.splice(index, 1)
        }
      }
      callback(err, result)
    })
  })
}

var siftWhitelist = function(slapp, token, user_id, callback) {
  slapp.client.users.info({'token': token, 'user': user_id }, (err, data) => {
    let domain_index = data.user.profile.email.indexOf('@')+1
    if (domain_index) {
      let domain = data.user.profile.email.substring(domain_index)
      whitelist.get((err, domains) => {
        callback(err, domains.includes(domain) || data.user.is_admin)
      })
    }
  })
}

var invite = function(slapp, msg, id) {
  msg.respond('You will be sent an invite momentarily.', (err) => {})
  slapp.client.channels.invite({
    'token': msg.meta.app_token, 
    'channel': id,
    'user': msg.meta.user_id
  }, (err, data) => {})
}

module.exports = {

  command: (slapp) => {
    slapp.command('/channel', '(\\w*)', (msg, text, query) => {
      let token = msg.meta.bot_token
      let userID = msg.meta.user_id

      siftWhitelist(slapp, token, userID, (err, isWhitelisted) => {
        if (err) { return }
        if (!isWhitelisted) {
          msg.respond('Your email has not been whitelisted. Please contact the team administrators for more information. Sorry for the inconvenience!', (err) => {})
          return
        }
        siftChannels(slapp, token, query, (err, channelList) => {
          if (err) { return }
          if (channelList.length == 0) { 
            msg.respond('Sorry, I could not find any channels related to "' + query + '".', (err) => {}) 
            return
          }
          let message = (query ? 'Channels related to "' + query + '":' : 'Channels available:')
          let dropdown = commons.createDropdown(message, 'channel_select', 'channel', channelList.map(
            (channel) => {
              return channel.name
            }), channelList.map(
            (channel) => {
              return channel.id
            })
          )
          msg.respond(dropdown, (err) => {}).route('someValue', null)
        })
      })
    })
  },

  action: (slapp, callback) => {
    slapp.action('channel_select', 'channel', (msg, val) => {
      val = msg.body.actions[0].selected_options[0].value
      invite(slapp, msg, val)
    })
  }
}