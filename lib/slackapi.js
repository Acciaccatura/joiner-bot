const https = require('https')
const querystring = require('querystring')

/**
 * Makes a call to the Slack API.
 * @param {String} field
 * @param {Object} params
 * @param {Function} callback(err:String, data:Object)
 */
module.exports = (field, params, callback) => {
	field = '/api/' + field
	let options = {
		'host': 'www.slack.com',
		'path': '/api/channels.list',
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
	var ret = ''
	var req = https.request(options, (res) => {
		res.setEncoding('utf-8')
		res.on('data', (data) => {
			ret += data
		})
		res.on('end', () => {
			console.log(ret)
			ret = JSON.parse(ret)
			callback(ret.error, ret)
		})
	})
	req.write(querystring.stringify(params))
	req.end()
}