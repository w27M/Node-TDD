import {AccountModel, AddAccount, AddAccountModel, Encrypter} from "../../protocols/db-add-account-protocols";
import {AddAccountRepository} from "../../protocols/add-account-repository";

export class DbAddAccount implements AddAccount {
    constructor(private encrypter: Encrypter, private addAccountRepository: AddAccountRepository) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.encrypter.encrypt(accountData.password);
        return await this.addAccountRepository.add({...accountData, password: hashed_password});
    }
}

