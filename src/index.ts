import { Server } from 'http';

import 'express-async-errors';
import express from 'express';
import bodyParser from 'body-parser';

import { config } from './config';
import { pool as db } from './db';
import { router } from './router';

const app = express();

app.use(bodyParser.json());
app.set('x-powered-by', false);

app.use('/', router);

const server = new Server(app);

process.on('uncaughtException', (err) => {
	console.error('uncaught exception', err);
});

process.on('unhandledRejection', (err, promise) => {
	console.error('unhandled rejection', promise, err);
});

server.listen(config.port, () => {
	console.log(`Server listening on: ${config.port}`);
});

process.on('SIGTERM', async () => {
	console.log('Got sigterm, trying to stop gracefully...');

	server.close(async () => {
		await db.end();

		console.log('Server stopped');

		process.exit(0);
	});
});
