const getchannels = require('./channelquery.js')

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
		console.log(spec_channel + " " + text)
		getchannels(slapp, msg.meta.bot_token, spec_channel, (err, data) => {
			if (err) { return; } //maybe the bot should say something here
			if (data.length == 0) { 
				msg.respond('Sorry, I could not find any channels related to "' + spec_channel + '".', (err) => {}) 
				return
			}
			var clist = []
			let index;
			for (index = 0; index < data.length; index++) {
				if (data[index].is_member) {
					if (data[index].name === spec_channel) {
						invite(slapp, msg, data[index].id)
						return
					}
					let channel = '#' + data[index].name
					if (data[index].is_archived) {
						channel += " (archived)"
					}
					clist.push({
						'text': channel,
						'value': data[index].id
					})
				}
			}
			let message = 'Channels to join:'
			if (spec_channel) {
				message = 'Channels related to "' + spec_channel + '":'
			}
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
			}, (err) => {

			})
		})
	})
	slapp.action('channel_select', 'chansel', (msg, val) => {
		val = msg.body.actions[0].selected_options[0].value
		invite(slapp, msg, val)
	})
}
