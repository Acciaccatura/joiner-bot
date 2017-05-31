const fs = require('fs')
const commons = require('./../commons.js')
const whitelist = __dirname + '/whitelist.json'

get = function(callback) {
	fs.readFile(whitelist, 'utf8', (err, text) => {
		let domains = JSON.parse(text)
		callback(err, domains)
	})
}

add = function(domain, callback) {
	get((err, domains) => {
		let domainsList = domains
		domainsList.push(domain)
		fs.writeFile(whitelist, JSON.stringify(domainsList), callback)
	})
}

remove = function(domain, callback) {
	get((err, domains) => {
		let domainsList = domains
		let domainIndex = domainsList.indexOf(domain)
		if (domainIndex >= 0) {
			domainsList.splice(domainIndex, 1)
		}
		fs.writeFile(whitelist, JSON.stringify(domainsList), callback)
	})
}

module.exports = {

	command: (slapp) => {
		slapp.command('/whitelist', '(\\w*)\\s*([\\w.]*)', (msg, text, command, argument) => {
			slapp.client.users.info({'token': msg.meta.bot_token, 'user': msg.meta.user_id}, (err, userInfo) => {
				if (err || !userInfo.user.is_admin) {
					msg.respond('Sorry, this command is for admins only!', (err) => {})
					return
				}
				switch (command) {
					case 'get':
						get((err, domains) => {
							msg.respond(commons.createTable('Whitelisted domains:', domains), (err) => {})
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
					default:
						msg.respond('/whitelist Usage:\n/whitelist [add domain] - Adds the domain to the whitelist\n/whitelist [remove domain] - Removes the domain from the whitelist\n/whitelist [get] - Gets the whitelist', (err) => {})
						break
				}
			})
		})
	},

	'get': get

}