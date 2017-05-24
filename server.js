'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var port = process.env.PORT || 3000

var slapp = Slapp({
	convo_store: ConvoStore(),
	context: Context()
})

require('./lib/bot')(slapp)

var app = slapp.attachToExpress(express())
app.listen(port, () => {
  console.log('This port: $' + port + '.00\nTeamwork: Priceless')
})