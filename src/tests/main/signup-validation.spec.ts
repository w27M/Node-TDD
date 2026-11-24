import { makeSignUpValidation } from '../../main/factories/signup-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidationComposite } from '../../presentation/helpers/validators/required-field-validation-composite';
import { Validation } from "../../presentation/helpers/validators/validation";
import { CompareFieldValidationComposite } from "../../presentation/helpers/validators/compare-field-validation-composite";
import { EmailValidationComposite } from "../../presentation/helpers/validators/email-validation-composite";
import { EmailValidator } from "../../presentation/protocols/email-validator";
import { EmailValidatorStub } from "../helpers/email-validator-stub";

jest.mock('../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
    return new EmailValidatorStub();
}
describe('SignUpValidation Factory', () => {
    it('should call validationComposite with all validations  ', () => {
        makeSignUpValidation();
        const validation: Validation[] = [];
        const fields = ['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of fields) {
            validation.push(new RequiredFieldValidationComposite(field));
        }
        validation.push(new CompareFieldValidationComposite('password', 'passwordConfirmation'));
        validation.push(new EmailValidationComposite('email', makeEmailValidator()));
        expect(ValidationComposite).toHaveBeenCalledWith(validation);
    });

});
