import request from "supertest";
import app from "../../main/config/app";

describe("Signup routes", () => {
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
