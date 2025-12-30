import {MongoHelper as sut} from "../../../infra/db/mongodb/helpers/mongo-helper";

describe('MongoHelper', () => {
    beforeAll(async () => {
        await sut.connect('mongodb://localhost:27017/clean-node-api');
    });

    afterAll(async () => {
        await sut.disconnect();
    })
    it('should reconnect if mongoDb is down', async () => {
        let accountCollection = await sut.getCollection('accounts');
        expect(accountCollection).toBeTruthy();
        accountCollection = await sut.getCollection('accounts');
        expect(accountCollection).toBeTruthy();
    });
});
