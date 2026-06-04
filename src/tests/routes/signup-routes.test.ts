import request from "supertest";
import app from "../../main/config/app";
import {MySQLHelper} from "../../infra/db/mysql/helpers/mysql-helper";
import env from "../../../env";

describe("Signup routes", () => {
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
})
