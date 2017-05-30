const userHierarchy = ['primary_owner', 'owner', 'admin', 'restricted', 'ultra_restricted']

module.exports = {

	createTable: (title, table) => {
		let formattedMessage = {
			attachments: [
				{
					fallback: JSON.stringify(table),
					'title': title,
					fields: []
				}
			]
		}
		let index;
		for (index = 0; index < table.length; index++) {
			formattedMessage.attachments[0].fields.push({
				'title': '',
				'value': table[index],
				'short': true
			})
		}
		return formattedMessage
	},

	createDropdown: (text, callback_id, name, texts, values) => {
		let index;
		let info = {
			'text': text,
			attachments: [{
				'text': '',
				'fallback': 'Sorry, failed.',
				'callback_id': callback_id,
				actions: [
				{
					'name': name,
					'text': 'Select from below...',
					'type': 'select',
					'options': []
				}]
			}]
		}
		for (index = 0; index < texts.value; index++) {
			info.attachments[0].actions[0].options.push({
				'text': texts[index],
				'value': values[index]
			})
		}
	}
}