const Fuse = require('fuse')
const options = {
	threshold: 0.5,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ['name','id']
}

/** Module to perform channel queries via Fuze
 * @param {Slapp} slapp
 * @param {String} query (optional) - returns all matching channels. Leave blank to return all channels
 * @param {Function} callback(err, list) - 
 */
module.exports = (slapp, token, query, callback) => {
	slapp.client.channels.list({'token': token}, (err, data) => {
		if (err || !query) { 
			//return the unmodified data if there was an error or no query. the callback function should decide what to do if an error occurred
			callback(err, data.channels)
			return
		} else if (query) {
			var fuse = new Fuse(data.channels, options)
			callback(null, fuse.search(query))
		}
	})
}