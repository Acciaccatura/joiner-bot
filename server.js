'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var port = process.env.PORT || 3000

var slapp = Slapp({
	verify_token: process.env.SLACK_VERIFY_TOKEN,
	convo_store: ConvoStore(),
	context: Context()
})

require('./lib/bot')(slapp)

console.log(process.env)

var slackapi = require('./lib/slackapi')
var toke = {'token':'one'}
slackapi('channels.list', {'token': process.env.SLACK_API_TOKEN }, (err, data) => {
	if (err) { 
		console.log(err)
		return 
	}
	console.log(data)
})

var app = slapp.attachToExpress(express())
app.listen(port, () => {
  console.log('This port: $' + port + '.00\nTeamwork: Priceless')
})