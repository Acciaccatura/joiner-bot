const channel = require('./commands/channel.js')
const whitelist = require('./commands/whitelist.js')

module.exports = (slapp) => {

	whitelist.command(slapp)

	channel.command(slapp)
	channel.action(slapp)

}
