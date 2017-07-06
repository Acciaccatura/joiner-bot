module.exports = (slapp, callback) => {
	slapp.db.query(`CREATE TABLE domains (
		id SERIAL PRIMARY KEY,
		domain VARCHAR UNIQUE
	)`, callback)
}