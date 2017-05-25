/** Blacklists certain channels from certain domains.
 * If an array is empty, that implies all domains.
 * If a whitelist or blacklist is not present, then it will not be affected by the missing array.
 */
module.exports = {
	
	//should allow every room to be accessed except #random
	'gmail.com': {
		'blacklist': ['random'],
		'whitelist': []
	},

	//should only allow #random to be accessed
	'ea.com': {
		'blacklist': [],
		'whitelist': ['random']
	},

	//should allow all normal rooms, in addition to 'lead'
	'microsoft.com': {
		'whitelist': ['lead']
	}
}