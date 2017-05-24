const slackapi = require('./slackapi')

module.exports = (slapp) => {
	slapp.message('info', (msg, text) => {
		console.log(msg)
	})
	slapp.command('/channels', (msg) => {
		slackapi('channels.list', '', (err, data) => {
			if (err) { return; }
			let clist = []
			let index;
			for (index = 0; index < data.channels.length; index++) {
				let channel = '#' + data.channels[index]
				clist.push({
					text: channel,
					value: data.channels[index]
				})
			}
			msg.respond({
				text: 'Channels to join:',
				attachments: [{
					text: '',
					fallback: 'TODO',
					callback_id: 'channel_select',
					actions: clist
				}]
			}, (err) => {

			})
		})
	})
}