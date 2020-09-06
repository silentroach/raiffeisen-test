export enum AccountErrorType {
	Invalid,
	NotFound,
	NotEnoughFunds,
}

export class AccountError extends Error {
	constructor(public readonly type: AccountErrorType, message?: string) {
		super(message);
	}
}
