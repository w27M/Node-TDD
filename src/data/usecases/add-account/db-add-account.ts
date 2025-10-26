import {AddAccountModel, AccountModel, AddAccount, Encrypter} from "./db-add-account-protocols";

export class DbAddAccount implements DbAddAccount {
    constructor(private encrypter: Encrypter) {}

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password);
        return new Promise<AccountModel>((resolve) => resolve(null));
    }
}

