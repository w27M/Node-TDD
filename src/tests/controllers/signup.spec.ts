import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidator} from '../../presentation/protocols/email-validator';
import {InvalidParamError, MissingParamError, ServerError} from "../../presentation/errors";
import {EmailValidatorStub} from "../helpers/email-validator-stub";
import {AddAccount} from "../../data/usecases/add-account/add-account";
import {HttpRequest} from "../../presentation/protocols";
import {AccountModel} from "../../domain/models/account";
import {ok, serverError, badRequest} from "../../presentation/helpers/http-helper";

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
}

const makeFakeAccount = (): AccountModel => ({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
});

const makeFakeRequest = (): HttpRequest => ({
        body: {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password',
            passwordConfirmation: 'valid_password',
        }
});

const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return {
        addAccountStub,
        emailValidatorStub,
        sut
    }
}

const makeEmailValidator = (): EmailValidator => {
    return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
    return new AddAccount;
}

describe('SignUp Controller', () => {
    it('Should return 400 if no name is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();
        delete httpRequest.body.name;
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
    });

    it('Should return 400 if no email is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();
        delete httpRequest.body.email;
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });

    it('Should return 400 if no password is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();
        delete httpRequest.body.password;
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
    });

    it('Should return 400 if no passwordConfirmation is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = makeFakeRequest();
        delete httpRequest.body.passwordConfirmation;
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    });

    it('Should call email validator with correct email', async () => {
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith("valid_email@mail.com");
    });

    it('Should return 500 if email validator throws', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new ServerError('An error occurred')));
    });

    it('Should return 400 if password confirmation fails', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email',
                password: 'any_password',
                passwordConfirmation: 'invalid_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')));
    });

    it('Should call AddAccount with correct values', async () => {
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        await sut.handle(makeFakeRequest());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        });
    });

    it('Should return 500 if addAccount throws', async () => {
        const {sut, addAccountStub} = makeSut();
        jest.spyOn(addAccountStub , 'add').mockImplementationOnce(async () => {
            return new Promise((_resolve, reject) => reject(new Error()));
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new ServerError('An error occurred')));
    });

    it('Should return 200 if valid data is provided', async () => {
        const {sut} = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    });
});
