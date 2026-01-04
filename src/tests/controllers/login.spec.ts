import {LoginController} from "../../presentation/controllers/login/login";
import {HttpRequest} from "../../presentation/protocols";
import {badRequest} from "../../presentation/helpers/http-helper";
import {MissingParamError} from "../../presentation/errors";

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        password_confirmation: "any_password",
    }
});

describe('Login Controller', () => {
    it('should return 400 if no email provided', async () => {
        const sut = new LoginController();
        const httpRequest = makeFakeRequest();

        delete httpRequest.body.email;
        delete httpRequest.body.name;
        delete httpRequest.body.password_confirmation;

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });
});
