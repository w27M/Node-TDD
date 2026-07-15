import request from "supertest";
import app from "../../main/config/app";
import {MySQLHelper} from "../../infra/db/mysql/helpers/mysql-helper";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";
import {ObjectId} from "mongodb";
import env from "../../../env";

if (env.featureToggleDb === 'mongodb') {
    describe("Signup routes (MongoDB)", () => {
        beforeAll(async () => {
            await MongoHelper.connect(env.mongoUrl);
        });

        afterAll(async () => {
            await MongoHelper.disconnect();
        });

        beforeEach(async () => {
            const accountCollection = await MongoHelper.getCollection('accounts');
            await accountCollection.deleteMany({});
        });

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

        it('should return all accounts on GET', async () => {
            const accountCollection = await MongoHelper.getCollection('accounts');
            await accountCollection.insertOne({ name: 'John', email: 'john@mail.com', password: '123' });
            const response = await request(app)
                .get("/api/accounts")
                .expect(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe("John");
        });

        it('should delete an account on DELETE', async () => {
            const accountCollection = await MongoHelper.getCollection('accounts');
            const res = await accountCollection.insertOne({ name: 'John', email: 'john@mail.com', password: '123' });
            const insertedId = res.insertedId.toString();

            const response = await request(app)
                .delete(`/api/accounts/${insertedId}`)
                .expect(200);
            
            expect(response.body.success).toBe(true);

            const accounts = await accountCollection.find({ _id: new ObjectId(insertedId) }).toArray();
            expect(accounts.length).toBe(0);
        });
    });
} else {
    describe("Signup routes (MySQL)", () => {
        beforeAll(async () => {
            await MySQLHelper.connect(env.mysqlConfig);
        });

        afterAll(async () => {
            await MySQLHelper.disconnect();
        });

        beforeEach(async () => {
            await MySQLHelper.execute("DELETE FROM accounts");
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

        it('should return all accounts on GET', async () => {
            await MySQLHelper.execute("INSERT INTO accounts (name, email, password) VALUES ('John', 'john@mail.com', '123')");
            const response = await request(app)
                .get("/api/accounts")
                .expect(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe("John");
        });

        it('should delete an account on DELETE', async () => {
            const result: any = await MySQLHelper.execute("INSERT INTO accounts (name, email, password) VALUES ('John', 'john@mail.com', '123')");
            const insertedId = result.insertId;

            const response = await request(app)
                .delete(`/api/accounts/${insertedId}`)
                .expect(200);
            
            expect(response.body.success).toBe(true);

            const accounts = await MySQLHelper.execute("SELECT * FROM accounts WHERE id = ?", [insertedId]);
            expect(accounts.length).toBe(0);
        });
    });
}
