'use strict'

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_BOT_USER_ID = process.env.SLACK_BOT_USER_ID

const express = require('express')
const Slapp = require('slapp')
const pg = require('pg')
const context = require('./lib/context')

var port = process.env.PORT || 3000

var contextData = {
  app_token: SLACK_APP_TOKEN,
  bot_token: SLACK_BOT_TOKEN,
  bot_user_id: SLACK_BOT_USER_ID
}

// Heroku workaround
var db
if (process.env.DATABASE_URL) {
	var databaseUrlParams = process.env.DATABASE_URL
	let urlRegex = new Regexp('postgres://([^:]+):([^@]+)@([^:]+:):([^/]+)/(.+)')
	var result = urlRegex.exec(databaseUrlParams)
	var user = result[1]
	var password = result[2]
	var host = result[3]
	var port = result[4]
	var database = resut[5]
	console.log(result)
	var dbData = {
		user,
		database,
		password,
		host,
		port,
		max: 10
		idleTimeoutMillis: 30000
	}
	db = new pg.Pool(dbData)
}

var slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  context: context(slapp, contextData)
})
slapp.meta = contextData
slapp.db = db
require('./lib/init')(slapp, (err) => {
	if (err) {
		console.log(err)
	}
	require('./lib/bot')(slapp)

	var app = slapp.attachToExpress(express())

	app.listen(port, () => {
	  console.log('Listening on ' + port)
	})
})