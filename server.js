'use strict'

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var port = process.env.PORT || 3000

var slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context({
  	app_token: SLAPP_APP_TOKEN,
  	bot_token: SLAPP_BOT_TOKEN
  })
})
console.log(slapp)
require('./lib/bot')(slapp)

var app = slapp.attachToExpress(express())

app.listen(port, () => {
  console.log('Listening on ' + port)
})
