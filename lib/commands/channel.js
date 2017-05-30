const Fuse = require('fuse.js')
const whitelist = require('./whitelist.js')

const options = {
	threshold: 0.5,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ['name','id']
}

var siftChannels = function(slapp, token, query, callback) {
	slapp.client.channels.list({'token': token}, (err, data) => {
		if (err || !query) { 
			//return the unmodified data if there was an error or no query. the callback function should decide what to do if an error occurred
			callback(err, data.channels)
			return
		} else if (query) {
			var fuse = new Fuse(data.channels, options)
			callback(null, fuse.search(query))
		}
	})
}

var siftWhitelist = function(slapp, token, user_id, callback) {
	slapp.client.users.info({'token': token, 'user': user_id }, (err, data) => {
		let domain_index = data.user.profile.email.indexOf('@')+1
		if (domain_index) {
			let domain = data.user.profile.email.substring(domain_index)
			whitelist.get((err, domains) => {
				console.log(domain)
				console.log(domains)
				console.log(data.user)
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
	}, (err, data) => {
		console.log(err)
		console.log(data)
	})
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
					if (chanelList.length == 0) { 
						msg.respond('Sorry, I could not find any channels related to "' + query + '".', (err) => {}) 
						return
					}

					let clist = []
					let message = (spec_channel ? 'Channels related to "' + spec_channel + '":' : 'Channels available:')
					let index;

					for (index = 0; index < channelList.length; index++) {
						if (channelList[index].is_member) {

							//check if there was an exact match to a channel
							if (channelList[index].name === spec_channel) {
								invite(slapp, msg, channelList[index].id)
								return
							}

							//setup the dropdown menu
							clist.push({
								'text': '#'+channelList[index].name,
								'value': channelList[index].id
							})

						}
					}

					//respond with a dropdown menu
					msg.respond({
						text: message,
						attachments: [{
							text: '',
							fallback: 'TODO',
							callback_id: 'channel_select',
							actions: [
							{
								name: 'channel',
								text: 'Select a channel',
								type: 'select',
								options: clist
							}]
						}]
					}, (err) => {})
				})
			})
		})
		slapp.action('channel_select','channel')
	},

	action: (slapp, callback) => {
		slapp.action('channel_select', 'channel', (msg, val) => {
			val = msg.body.actions[0].selected_options[0].value
			invite(slapp, msg, val)
		})
	}
	
}