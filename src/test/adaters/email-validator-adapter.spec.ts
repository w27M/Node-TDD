import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
    isEmail() {
        return true;
    },
}));

const makeSut = () => {
    return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
    it('should should return true if validator returns true', () => {
        const sut = makeSut();
        const isValid = sut.isValid('valid_email@email.com');
        expect(isValid).toBe(true);
    });

    it('should should return false if validator returns false', () => {
        const sut = makeSut();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_email@email.com');
        expect(isValid).toBe(false);
    });

    it('should call emailValidator with correct email', () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        sut.isValid('any_email@email.com');
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
    });
});
