import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import {Validation} from "../../presentation/helpers/validators/validation";

export const makeSignUpValidation = (): ValidationComposite  => {
    const validation: Validation[] = [];
    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of fields) {
        validation.push(new RequiredFieldValidation(field));
    }
    return new ValidationComposite(validation);
}
