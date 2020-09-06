import type { Account } from '../accounts/Account';

export interface AccountResponse {
	balance: number;
}

export const mapAccount = (account: Account): AccountResponse => {
	return {
		balance: account.balance / 100,
	};
};
