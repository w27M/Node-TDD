
import {EmailValidator} from '../../presentation/protocols/email-validator';
import {EmailValidatorStub} from "../helpers/email-validator-stub";
import {EmailValidationComposite} from "../../presentation/helpers/validators/email-validation-composite";
import {InvalidParamError} from "../../presentation/errors";

interface SutTypes {
    sut: EmailValidationComposite;
    emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidator();
    const sut = new EmailValidationComposite('email', emailValidatorStub);

    return {
        emailValidatorStub,
        sut
    }
}

const makeEmailValidator = (): EmailValidator => {
    return new EmailValidatorStub();
}

describe('Email Validation Composite', () => {
    it('Should return an error if EmailValidation returns false', () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const error = sut.validate({ email: "valid_email@mail.com" });
        expect(error).toEqual(new InvalidParamError('email'));
    });

    it('Should call AddAccount with correct values', () => {
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        sut.validate({ email: "valid_email@mail.com" });
        expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com');
    });

    it('Should throw if EmailValidator throws', () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        expect(() => {
            sut.validate({ email: 'any_email@mail.com' });
        }).toThrow();
    });
});
