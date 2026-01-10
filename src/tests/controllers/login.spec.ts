import {LoginController} from "../../presentation/controllers/login/login";
import {HttpRequest} from "../../presentation/protocols";
import {badRequest} from "../../presentation/helpers/http-helper";
import {MissingParamError} from "../../presentation/errors";
import {EmailValidator} from "../../presentation/protocols/email-validator";

interface SuTypes {
    sut: LoginController;
    makeEmailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
        return true;
        }
    }

    return new EmailValidatorStub();
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        password_confirmation: "any_password",
    }
});

const makeSut = (): SuTypes => {
    const makeEmailValidatorStub = makeEmailValidator();
    const sut = new LoginController(makeEmailValidatorStub);

    return {
        sut,
        makeEmailValidatorStub
    }
}

describe('Login Controller', () => {
    it('should return 400 if email not provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();

        delete httpRequest.body.email;
        delete httpRequest.body.name;
        delete httpRequest.body.password_confirmation;

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });

    it('should return 400 if password not provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();

        delete httpRequest.body.name;
        delete httpRequest.body.password;
        delete httpRequest.body.password_confirmation;

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
    });

    it('should call EmailValidator with correct email', async () => {
        const {sut, makeEmailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(makeEmailValidatorStub, 'isValid');
        const httpRequest = makeFakeRequest();

        delete httpRequest.body.name;
        delete httpRequest.body.password_confirmation;

        await sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

});
