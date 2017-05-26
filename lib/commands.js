const userHierarchy = ['primary_owner', 'owner', 'admin', 'restricted', 'ultra_restricted']

module.exports = {

	/** User level-restricted commands!
	 * DISCLAIMER: This function only tests if the user is the specified role, NOT if they're a role above.
	 * For instance, if you assign a command to 'restricted', admins cannot use this command. ONLY restricted can.
	 * @param {Slapp} slapp
	 * @param {String} command
	 * @param {String} regex
	 * @param {String} user_level - Make sure it's oen of these: admin, owner, primary_owner, restricted, ultra_restricted
	 * @param {Function} callback(msg, text[, match1...])
	 */
	restrictedCommand: (slapp, command, regex, userLevel, callback) => {
		slapp.command(command, regex, (msg) => {
			if (!userLevel) {
				callback.apply(this, arguments)
				return
			}

			slapp.client.users.info({
				'token': msg.meta.app_token,
				'user': msg.meta.user_id }, (err, userData) => {
					if (err) { return }
					let requiredProperty = 'is_' + userLevel
					if (userData.user[requiredProperty]) {
						callback.apply(this, arguments)
					} else {
						msg.respond('Sorry, "/' + command + '" is a restricted command.', (err) => {})
					}
				})
		})
	}

	/** Because the Slapp API does not handle all forms of response!
	 * @param {Slapp} slapp
	 * @param {String} callback_id
	 * @param {String} response
	 * @param {Function} callback({Message} msg, {String} val)
	 */
	action: (slapp, callback_id, response, callback) => {
		slapp.action(callback_id, response, (msg) => {
			let val = msg.body.actions[0].value || msg.body.actions[0].selected_options
			callback(msg, val)
		})
	}

}