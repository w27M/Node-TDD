import {AddAccountModel} from "../../domain/usecases/add-account";
import {AccountModel} from "../../domain/models/account";
import {Encrypter} from "../protocols/encrypter";

export class DbAddAccount implements DbAddAccount {
    constructor(private encrypter: Encrypter) {}

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password);
        return new Promise<AccountModel>((resolve) => resolve(null));
    }
}

