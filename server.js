'use strict'

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_BOT_USER_ID = process.env.SLACK_BOT_USER_ID

const express = require('express')
const Slapp = require('slapp')
const context = require('./lib/context')

var port = process.env.PORT || 3000

var contextData = {
  app_token: SLACK_APP_TOKEN,
  bot_token: SLACK_BOT_TOKEN,
  bot_user_id: SLACK_BOT_USER_ID
}

console.log(contextData)

var slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  context: context(slapp, contextData)
})
slapp.meta = contextData
require('./lib/bot')(slapp)

var app = slapp.attachToExpress(express())

app.listen(port, () => {
  console.log('Listening on ' + port)
})