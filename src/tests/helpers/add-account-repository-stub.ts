import {AddAccountModel} from "../../domain/usecases/add-account";
import {AddAccountRepository, AccountModel} from "../../data/protocols/db-add-account-protocols";

export class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
            id: 'valid_id',
            name: "valid_name",
            email: "valid_email@email.com",
            password: "hashed_password",
        }
       return new Promise(resolve => resolve(fakeAccount));
    }
}
