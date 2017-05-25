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

var app = slapp.attachToExpress(express())
app.listen(port, () => {
  console.log('This port: $' + port + '.00\nTeamwork: Priceless')
})

const Fuse = require('fuse.js')
var fuse = new Fuse([{'name': 'gosh'}, {'name': 'gash'}, {'name': 'rofl'}, {'name': 'tent'}], { 'threshold': 0.5, 'location': 0, 'distance': 100, 'keys': ['name']})
console.log(fuse.search('gose'))