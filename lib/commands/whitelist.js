const fs = require('fs')
const commons = require('./../commons.js')
const whitelist = __dirname + '/whitelist.json'

// In the future it would be better to replace these with a database.

get = function(slapp, callback) {
  slapp.db.query(`SELECT * FROM domains`, (err, data) => {
    if (err) {
      callback(err, null)
      return
    }
    let domains = data.rows
    callback(null, domains)
  })
}

add = function(domain, callback) {
  if (domain.charAt(0) === '@') {
    domain = domain.substring(1)
  }
  slapp.db.query(`INSERT INTO domains (domain) VALUES ($1)`, [domain], (err, data) => {
    if (err) {
      callback(err, null)
      return
    }
    let domains = data.rows
    callback(null, domains)
  })
}

remove = function(domain, callback) {
  if (domain.charAt(0) === '@') {
    domain = domain.substring(1)
  }
  slapp.db.query(`DELETE FROM domains WHERE domain = $1`, [domain], (err, data) => {
    if (err) {
      callback(err, null)
      return
    }
    let domains = data.rows
    callback(null, domains)
  })
}

module.exports = {

  command: (slapp) => {
    slapp.command('/whitelist', '(\\w*)\\s*([\\w.]*)', (msg, text, command, argument) => {
      slapp.client.users.info({'token': msg.meta.bot_token, 'user': msg.meta.user_id}, (err, userInfo) => {
        if (err) {
          msg.respond('There was an error!')
          return
        }
        else if (!userInfo.user.is_admin) {
          msg.respond('Sorry, this command is for admins only!', (err) => {})
          return
        }
        switch (command) {
          case 'get':
            get((err, domains) => {
              if (err) {
                msg.respond('Error processing your request.')
                return
              }
              msg.respond(commons.createTable('Whitelisted domains:', domains), (err) => {})
            })
            break
          case 'add':
            add(argument, (err, domains) => {
              if (err) {
                msg.respond('Error processing your request.')
                return
              }
              msg.respond(argument + ' has been added to the whitelist.', (err) => {})
            })
            break
          case 'remove':
            remove(argument, (err) => {
              if (err) {
                msg.respond('Error processing your request.')
                return
              }
              msg.respond(argument + ' has been removed from the whitelist.', (err) => {})
            })
            break
          default:
            msg.respond('/whitelist Usage:\n/whitelist [add domain] - Adds the domain to the whitelist\n/whitelist [remove domain] - Removes the domain from the whitelist\n/whitelist [get] - Gets the whitelist', (err) => {})
            break
        }
      })
    })
  },

  'get': get

}