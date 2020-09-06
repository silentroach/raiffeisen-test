import { HttpStatus } from './HttpStatus';

export class APIError extends Error {
	public static badRequest(message: string = 'Некорректный запрос') {
		return new APIError(HttpStatus.BadRequest, message);
	}

	public static notFound(message: string = 'Не найдено') {
		return new APIError(HttpStatus.NotFound, message);
	}

	public static forbidden(message: string = 'Запрещено') {
		return new APIError(HttpStatus.Forbidden, message);
	}

	private constructor(public readonly status: HttpStatus, message?: string) {
		super(message);
	}
}
