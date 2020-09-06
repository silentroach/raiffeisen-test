import type { ErrorRequestHandler } from 'express';

import { HttpStatus } from '../HttpStatus';
import { APIError } from '../APIError';

export const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
	let responseCode = HttpStatus.ServerError;
	let responseMessage = 'Ошибка сервера';

	if (error instanceof APIError) {
		responseCode = error.status;

		if (error.message) {
			responseMessage = error.message;
		}
	} else {
		// клиенту отдаем 500, а у себя пишем в лог (или в sentry, что было бы вообще ок)
		console.error('API server unexpected error', error);
	}

	res.status(responseCode).json({
		message: responseMessage,
	});
};
