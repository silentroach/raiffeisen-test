import express from 'express';

import { APIError } from '../APIError';
import { errorHandler } from './middleware';
import { accountRouter } from './account';

export const router = express.Router();

// я бы на самом деле объединил урлы по аккаунтом в общий /accounts/:id + /accounts/:id/transfer/:target
// а здесь сделал router.use('/accounts', ...)
router.use('/', accountRouter);

router.use(() => {
	// по умолчанию, если у нас нет запрашиваемого обработчика – отдаем пользователю 400
	throw APIError.badRequest();
});

// идея такая, что есть общий обработчик ошибок, а внтури под-маршрутов можно определить
// свои, которые будут обрабатывать случаи, специфичные для набора под-маршрутов
router.use(errorHandler);
