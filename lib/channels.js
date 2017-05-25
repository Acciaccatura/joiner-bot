const Fuse = require('fuse.js')
const blacklist = require('./blacklist.js')

const options = {
	threshold: 0.5,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ['name','id']
}

module.exports = {

	/** Module to perform channel queries via Fuze
	 * @param {Slapp} slapp
	 * @param {String} query (optional) - returns all matching channels. Leave blank to return all channels
	 * @param {Function} callback(err, list) - 
	 */
	siftChannels: function(slapp, token, query, callback) {
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
	},

	/** Module to query only channels with the correct blacklist settings
	 * @param {Slapp} slapp
	 * @param {String} token
	 * @param {String} user_id
	 * @param {Array} list - list of channels
	 * @param {Function} callback(err, list)
	 */
	siftBlacklist: function(slapp, token, user_id, list, callback) {
		slapp.client.users.info({'token': token, 'user': user_id }, (err, data) => {
			let domain = data.user.profile.email.indexOf('@')+1
			if (domain >= 0 && domain < data.user.profile.email.length) {
				let index;
				for (index = 0; index < data.length; index++) {
					if (data[index].is_member) {
						//setup the dropdown menu
						clist.push({
							'text': channel,
							'value': data[index].id
						})
					}
				}
			}
		})
	}

}