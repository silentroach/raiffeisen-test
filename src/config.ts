const { name, version } = require('../package.json');

export const config = {
	name,
	version,

	port: process.env.PORT || 3000,

	db: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 5432,
		db: process.env.DB_DATABASE || 'postgres',
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD,
	},
};
