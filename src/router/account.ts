import express, { ErrorRequestHandler, Request, Response } from 'express';

import { getAccount, transfer, validateAccountId } from '../accounts';
import { AccountResponse, mapAccount } from '../mappers/account';
import { AccountError, AccountErrorType } from '../accounts/AccountError';

import { APIError } from '../APIError';

const router = express.Router();

router.get('/account/:id', async (req: Request<{ id: number }>, res: Response<AccountResponse>) => {
	const accountId = validateAccountId(req.params.id);

	const account = await getAccount(accountId);

	res.json(mapAccount(account));
});

router.post(
	'/transfer/:sourceId/:targetId',
	async (req: Request<{ sourceId: number; targetId: number }>, res: Response<AccountResponse>) => {
		const sourceId = validateAccountId(req.params.sourceId);
		const targetId = validateAccountId(req.params.targetId);

		const amount = Number((req.body || {}).amount);
		if (!Number.isFinite(amount) || amount <= 0) {
			throw APIError.badRequest('Некорректная сумма');
		}

		// не уверен, что это правильно для банковского приложения,
		// возможно, дробные после приведения к копейкам, нужно как-то округлять банковским округлением?
		const account = await transfer(sourceId, targetId, Math.trunc(amount * 100));

		res.json(mapAccount(account));
	}
);

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
	if (error instanceof AccountError) {
		switch (error.type) {
			case AccountErrorType.NotFound:
				// 404 если счёт не найден
				throw APIError.notFound(error.message);
			case AccountErrorType.NotEnoughFunds:
				// 403 forbidden если денег не хватает (можно было бы 402, но 403 кажется в этом случае более уместным)
				throw APIError.forbidden(error.message);
			case AccountErrorType.Invalid:
				// 400 если в запросе была какая-то ошибка
				throw APIError.badRequest(error.message);
		}
	}

	throw error;
};

router.use(errorHandler);

export const accountRouter = router;
