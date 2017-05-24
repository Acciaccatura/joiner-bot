const http = require('http')

/**
 * Makes a call to the Slack API.
 * @param {String} field
 * @param {Object} params
 * @param {Function} callback(err:String, data:Object)
 */
module.exports = (field, params, callback) => {
	field = '/api/' + field + '/'
	let options = {
		host: 'www.slack.com',
		path: field,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	var ret = ''
	var req = http.request(options, (res) => {
		res.setEncoding('utf-8')
		res.on('data', (data) => {
			ret += data
		})
		res.on('end', () => {
			ret = JSON.parse(ret)
			callback(ret.error, ret)
		})
	})
	req.write(JSON.stringify(params))
	req.end()
}