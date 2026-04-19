import {LoginController} from "../../presentation/controllers/login/login";
import {HttpRequest} from "../../presentation/protocols";
import {badRequest, serverError} from "../../presentation/helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../presentation/errors";
import {EmailValidator} from "../../presentation/protocols/email-validator";
import {Authentication} from "../../domain/usecases/authentication";

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'));
        }
    }

    return new AuthenticationStub();
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

interface SuTypes {
    sut: LoginController;
    makeEmailValidatorStub: EmailValidator;
    authenticationStub: Authentication;

}

const makeSut = (): SuTypes => {
    const makeEmailValidatorStub = makeEmailValidator();
    const authenticationStub = makeAuthentication();
    const sut = new LoginController(makeEmailValidatorStub, authenticationStub);

    return {
        sut,
        makeEmailValidatorStub,
        authenticationStub
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

    it('should return 400 if an invalid email is provided', async () => {
        const {sut, makeEmailValidatorStub} = makeSut();
        jest.spyOn(makeEmailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('should return 500 if emailValidator throws', async () => {
        const {sut, makeEmailValidatorStub} = makeSut();
        jest.spyOn(makeEmailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should call Authentication with correct values', async () => {
        const {sut, authenticationStub} = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password');
    });

});
