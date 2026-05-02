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
})
