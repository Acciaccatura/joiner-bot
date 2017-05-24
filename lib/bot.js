module.exports = (slapp) => {
	slapp.command('/channels', (msg) => {
		slapp.client.channels.list({ 'token': msg.meta.bot_token }, (err, data) => {
			if (err) { return; }
			let clist = []
			let index;
			for (index = 0; index < data.channels.length; index++) {
				if (data.channels[index].is_member) {
					let channel = '#' + data.channels[index].name
					if (data.channels[index].is_archived) {
						channel += " (archived)"
					}
					clist.push({
						'text': channel,
						'value': data.channels[index].id
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
		msg.respond('You will be sent an invite momentarily.', (err) => {})
		slapp.client.channels.invite({
			'token': msg.meta.app_token, 
			'channel': msg.body.actions[0].selected_options[0].value,
			'user': msg.meta.user_id
		}, (err, data) => {
			console.log(err)
			console.log(data)
		})
	})
}
