import {MongoHelper} from "../../../../infra/db/mongodb/helpers/mongo-helper";
import {AccountMongoRepository} from "../../../../infra/db/mongodb/account-repository/accounts";

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://localhost:27017/clean-node-api-test');
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    }

    it('should return an account on success', async () => {
        const sut = makeSut();
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        });

        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });
})
