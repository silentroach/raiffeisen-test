import type { ClientBase } from 'pg';

import { pool } from '../db';

import { Account } from './Account';
import { AccountError, AccountErrorType } from './AccountError';

const getAccountWithinConnection = async (
	connection: ClientBase,
	id: number,
	lock: boolean = false
): Promise<Account> => {
	const { rows } = await connection.query(
		[`select balance from accounts where account_id = $1`, lock ? `for update` : ''].join('\n'),
		[id]
	);

	if (rows.length === 0) {
		throw new AccountError(AccountErrorType.NotFound, `Счёт ${id} не найден`);
	}

	const [{ balance }] = rows;

	return { id, balance: Number(balance) };
};

const increment = async (connection: ClientBase, id: number, diff: number): Promise<void> => {
	await connection.query(`update accounts set balance = balance + $2 where account_id = $1`, [
		id,
		diff,
	]);
};

const transferWithinConnection = async (
	connection: ClientBase,
	sourceId: number,
	targetId: number,
	amount: number
): Promise<Account> => {
	await connection.query('begin');
	try {
		const source = await getAccountWithinConnection(connection, sourceId, true);
		const target = await getAccountWithinConnection(connection, targetId, true);

		if (source.balance < amount) {
			throw new AccountError(AccountErrorType.NotEnoughFunds, 'Недостаточно средств для списания');
		}

		await increment(connection, source.id, -amount);
		await increment(connection, target.id, amount);

		await connection.query('commit');

		return {
			id: source.id,
			balance: source.balance - amount,
		};
	} catch (e) {
		await connection.query('rollback');
		throw e;
	}
};

export const getAccount = async (id: number): Promise<Account> => {
	const connection = await pool.connect();
	try {
		return getAccountWithinConnection(connection, id);
	} finally {
		connection.release();
	}
};

export const transfer = async (
	sourceId: number,
	targetId: number,
	amount: number
): Promise<Account> => {
	const connection = await pool.connect();
	try {
		return transferWithinConnection(connection, sourceId, targetId, amount);
	} finally {
		connection.release();
	}
};

export const validateAccountId = (accountId: any): number => {
	const normalized = Number(accountId);
	if (!Number.isFinite(normalized) || normalized <= 0) {
		throw new AccountError(AccountErrorType.Invalid, 'Некорректный номер счёта');
	}

	return normalized;
};
