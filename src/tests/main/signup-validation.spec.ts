import { makeSignUpValidation } from '../../main/factories/signup-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from "../../presentation/helpers/validators/validation";
import {CompareFieldValidation} from "../../presentation/helpers/validators/compare-field-validation";

jest.mock('../../presentation/helpers/validators/validation-composite');
describe('SignUpValidation Factory', () => {
    it('should call validationComposite with all validations  ', () => {
        makeSignUpValidation();
        const validation: Validation[] = [];
        const fields = ['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of fields) {
            validation.push(new RequiredFieldValidation(field));
        }
        validation.push(new CompareFieldValidation('password', 'passwordConfirmation'));
        expect(ValidationComposite).toHaveBeenCalledWith(validation);
    });

});
