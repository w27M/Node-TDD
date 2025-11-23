import request from "supertest";
import app from "../../main/config/app";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";

describe("Signup routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGODB_URI);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection("accounts");
        await accountCollection.deleteMany({});
    })
    it('should return an account on success', async () => {
        await request(app)
        .post("/api/signup")
            .send({
                name: "John Doe",
                email: "email@email.com",
                password: "123",
                passwordConfirmation: "123",
            }).expect(200);
    });
})
