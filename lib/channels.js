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

	siftChannels: function(token, query, callback) {
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

	siftBlacklist: function(token, user_id, callback) {
		slapp.client.users.info({'token': token, 'user': user_id }, (err, data) => {
			let domain_index = data.user.profile.email.indexOf('@')+1
			if (domain_index) {
				let domain = data.user.profile.email.substring(domain_index)
				callback(err, !!blacklist[domain])
			}
		})
	}
	
}