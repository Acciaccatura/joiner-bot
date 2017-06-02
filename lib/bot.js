const channel = require('./commands/channel.js')
const whitelist = require('./commands/whitelist.js')

//this is a test
module.exports = (slapp) => {

	whitelist.command(slapp)

	channel.command(slapp)
	channel.action(slapp)
	channel.test(slapp)

}
