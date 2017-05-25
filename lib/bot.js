const getchannels = require('./channelquery.js')

function invite(slapp, msg, id) {
	msg.respond('You will be sent an invite momentarily.', (err) => {})
	slapp.client.channels.invite({
		'token': msg.meta.app_token, 
		'channel': msg.body.actions[0].selected_options[0].value,
		'user': msg.meta.user_id
	}, (err, data) => {
		console.log(err)
		console.log(data)
	})
}

module.exports = (slapp) => {
	slapp.command('/channel', '(\w*)', (msg, text, spec_channel) => {
		getchannels(slapp, msg.meta.bot_token, spec_channel, (err, data) => {
			if (err) { return; } //maybe the bot should say something here
			if (data.length == 0) { 
				msg.respond('Sorry, I could not find any channels related to "' + spec_channel + '".', (err) => {}) 
				return
			}
			if (data.length == 1 && data[0].name === spec_channel && data[index].is_member) {
				invite(slapp, msg, data[0].id)
				return
			}
			var clist = []
			let index;
			for (index = 0; index < data.length; index++) {
				if (data[index].is_member) {
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
			console.log(clist)
			msg.respond({
				text: 'Channels to join:',
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
		invite(slapp, msg, val)
	})
}
