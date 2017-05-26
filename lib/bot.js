const blacklist = require('./blacklist.js')
const channels = require('./channels.js')

/** Invites people to a channel
 * @param {Slapp} slapp
 * @param {Message} msg - the message leading up to the invite
 * @param {String} id - the ID of the channel
 */
function invite(slapp, msg, id) {
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

module.exports = (slapp) => {

	slapp.command('/channel', '(\\w*)', (msg, text, spec_channel) => {
		channels.siftBlacklist(msg.meta.bot_token, msg.meta.user_id, (err, isBlacklisted) => {

			//deal with blaclisted users
			if (err) { return }
			if (isBlacklisted) { 
				msg.respond('Your email domain has been blacklisted. Sorry for the inconvenience!', (err) => {})
				return 
			}

			channels.siftChannels(msg.meta.bot_token, spec_channel, (err, chan) => {
				if (err) { return; } //maybe the bot should say something here
				//if the query returned nothing, notify the caller
				if (data.length == 0) { 
					msg.respond('Sorry, I could not find any channels related to "' + spec_channel + '".', (err) => {}) 
					return
				}

				//consider moving this somewhere else for readability sake
				var clist = []
				let index;
				for (index = 0; index < data.length; index++) {
					if (data[index].is_member) {

						//check if there was an exact match to a channel
						if (data[index].name === spec_channel) {
							invite(slapp, msg, data[index].id)
							return
						}

						//make the channel name pretty
						let channel = '#' + data[index].name
						if (data[index].is_archived) {
							channel += " (archived)"
						}

						//setup the dropdown menu
						clist.push({
							'text': channel,
							'value': data[index].id
						})

					}
				}

				//customize the message to fit the spec_channel query
				let message = (spec_channel ? 'Channels related to "' + spec_channel + '":' : 'Channels available:')
				//respond with a dropdown menu
				msg.respond({
					text: message,
					attachments: [{
						text: '',
						fallback: 'TODO',
						callback_id: 'channel_select',
						actions: [
						{
							name: 'chansel',
							text: 'Select a channel',
							type: 'select',
							options: clist
						}]
					}]
				}, (err) => {})
			})
		})
	})

	slapp.action('channel_select', 'chansel', (msg, val) => {
		val = msg.body.actions[0].selected_options[0].value
		invite(slapp, msg, val)
	})
}
