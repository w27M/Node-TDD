import {AddAccountModel, AccountModel, Encrypter, AddAccount} from "../../protocols/db-add-account-protocols";
import {AddAccountRepository} from "../../protocols/add-account-repository";

export class DbAddAccount implements AddAccount {
    constructor(private encrypter: Encrypter, private addAccountRepository: AddAccountRepository) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.encrypter.encrypt(accountData.password);
        await this.addAccountRepository.add( {... accountData, password: hashed_password});
        return new Promise<AccountModel>((resolve) => resolve(null));
    }
}

