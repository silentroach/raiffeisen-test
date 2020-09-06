import { Pool, PoolConfig } from 'pg';

import { config } from './config';

export const pool = new Pool({
	// полезно для pg_stat_activity
	application_name: [config.name, config.version].join(' '),

	host: config.db.host,
	port: config.db.port,
	database: config.db.db,
	user: config.db.user,
	password: config.db.password,
	idleTimeoutMillis: 20000,
	max: 5,
	maxUses: 1280,
} as PoolConfig);
