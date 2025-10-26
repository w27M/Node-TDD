import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidator} from '../../presentation/protocols/email-validator';
import {InvalidParamError, MissingParamError, ServerError} from "../../presentation/errors";
import {AddAccount, AddAccountModel} from "../../domain/usecases/add-account";
import {EmailValidatorStub} from "../helpers/email-validator-stub";
import {AddAccountStub} from "../helpers/add-account-stub";

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
}

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
    return new AddAccountStub();
}

describe('SignUp Controller', () => {
    it('Should return 400 if no name is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    it('Should return 400 if no email is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if no password is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 400 if no passwordConfirmation is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('Should call email validator with correct email', async () => {
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

    it('Should return 500 if email validator throws', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
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
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
    });

    it('Should call AddAccount with correct values', async () => {
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        await sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        });
    });

    it('Should return 500 if addAccount throws', async () => {
        const {sut, addAccountStub} = makeSut();
        jest.spyOn(addAccountStub , 'add').mockImplementationOnce(async () => {
            return new Promise((_resolve, reject) => reject(new Error()));
        });
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('Should return 200 if valid data is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        });
    });
});
