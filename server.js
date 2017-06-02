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
console.log(slapp)
require('./lib/bot')(slapp)

var app = slapp.attachToExpress(express())

//Quick express app (move this later):
app.set('view engine', 'pug')
const fs = require('fs')
app.use('/', (req, res) => {
	fs.readFile(__dirname + '/lib/commands/whitelist.json', 'utf-8', (err, data) => {
		res.render('index', { 'whitelist': JSON.parse(data) })
	})
})

app.listen(port, () => {
  console.log('This port: $' + port + '.00\nTeamwork: Priceless')
})
