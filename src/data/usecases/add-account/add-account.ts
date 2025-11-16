import {AddAccountModel} from "../../../domain/usecases/add-account";
import {AccountModel} from "../../../domain/models/account";

export class AddAccount implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        };

        return new Promise(resolve => resolve(fakeAccount));
    }
}
