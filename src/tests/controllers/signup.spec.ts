import {SignUpController} from "../../presentation/controllers/signup/signup";
import {MissingParamError, ServerError} from "../../presentation/errors";
import {ValidationStub} from "../helpers/validation-stub"
import {AddAccount} from "../../data/usecases/add-account/add-account";
import {HttpRequest} from "../../presentation/protocols";
import {AccountModel} from "../../domain/models/account";
import {ok, serverError, badRequest} from "../../presentation/helpers/http-helper";
import {Validation} from "../../presentation/helpers/validators/validation";

interface SutTypes {
    sut: SignUpController;
    addAccountStub: AddAccount;
    validationStub: Validation;
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
    const addAccountStub = makeAddAccount();
    const validationStub = makeValidation();
    const sut = new SignUpController(addAccountStub, validationStub);

    return {
        addAccountStub,
        validationStub,
        sut
    }
}

const makeValidation = (): Validation => {
    return new ValidationStub();
}

const makeAddAccount = (): AddAccount => {
    return new AddAccount;
}

describe('SignUp Controller', () => {
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

    it('Should call Validation with correct value', async () => {
        const {sut, validationStub} = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');
        const httpRequest = makeFakeRequest();
        await sut.handle(httpRequest);
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('Should return 400 if Validator return an error', async () => {
        const {sut, validationStub} = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
    });
});
