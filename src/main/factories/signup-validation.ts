import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { RequiredFieldValidationComposite } from "../../presentation/helpers/validators/required-field-validation-composite";
import {Validation} from "../../presentation/helpers/validators/validation";
import {CompareFieldValidationComposite} from "../../presentation/helpers/validators/compare-field-validation-composite";
import {EmailValidationComposite} from "../../presentation/helpers/validators/email-validation-composite";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite  => {
    const validation: Validation[] = [];
    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of fields) {
        validation.push(new RequiredFieldValidationComposite(field));
    }
    validation.push(new CompareFieldValidationComposite('password', 'passwordConfirmation'));
    validation.push(new EmailValidationComposite('email', new EmailValidatorAdapter()));
    return new ValidationComposite(validation);
}
