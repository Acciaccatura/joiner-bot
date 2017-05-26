const fs = require('fs')
const whitelist = 'whitelist.json'

module.exports = {

	command: (slapp) => {
		slapp.command('/whitelist', '(\\w*)\\s*(\\w*)', (msg, text, command, argument) => {
			if (command) {
				switch (command) {
					case 'get':
						get((err, domains) => {
							let formattedMessage = {
								attachments: [
									{
										fallback: JSON.stringify(domains),
										title: 'List of all whitelisted emails',
										fields: []
									}
								]
							}
							let index;
							for (index = 0; index < domains.length; index++) {
								formattedMessage.attachments.fields.push({
									'title': '',
									'value': domains[index],
									'short': true
								})
							}
						})
						break
					case 'add':
						add(argument, (err) => {
							msg.respond(argument + ' has been added to the whitelist.', (err) => {})
						})
						break
					case 'remove':
						remove(argument, (err) => {
							msg.respond(argument + ' has been removed from the whitelist.', (err) => {})
						})
						break
				}
			} else {
				msg.respond('/whitelist Usage:\n/whitelist [add domain] - Adds the domain to the whitelist\n/whitelist [remove domain] - Removes the domain from the whitelist\n/whitelist [get] - Gets the whitelist', (err) => {})
			}
		})
	},

	get: (callback) => {
		fs.readFile('whitelist.json', (err, text) => {
			let domains = JSON.parse(text)
			callback(err, domains)
		})
	},

	add: (domain, callback) => {
		get((err, domains) => {
			let domainsList = JSON.parse(domains)
			domainsList.push(domain)
			fs.writeFile(whitelist, JSON.stringify(domainsList), callback)
		})
	},

	remove: (domain, callback) => {
		get((err, domains) => {
			let domainsList = JSON.parse(domains)
			let domainIndex = domainsList.indexOf(domain)
			if (domainIndex >= 0) {
				domainsList.splice(domainIndex, 1)
			}
			fs.writeFile(whitelist, JSON.stringify(domainList), callback)
		})
	}

}