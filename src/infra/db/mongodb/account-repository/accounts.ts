import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { LoadAllAccountsRepository } from "../../../../data/protocols/load-all-accounts-repository";
import { DeleteAccountRepository } from "../../../../data/protocols/delete-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mongo-helper";
import { ObjectId } from "mongodb";

export class AccountMongoRepository implements AddAccountRepository, LoadAllAccountsRepository, DeleteAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await  MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const account = await accountCollection.findOne({ _id: result.insertedId });
        return MongoHelper.map(account);
    }

    async loadAll(): Promise<AccountModel[]> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const accounts = await accountCollection.find().toArray();
        return accounts.map(account => MongoHelper.map(account));
    }

    async delete(id: string): Promise<boolean> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}
