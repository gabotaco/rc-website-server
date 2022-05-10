
module.exports = {
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
	stats: {
		colors: true
	},
}
