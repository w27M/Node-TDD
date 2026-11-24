import {Validation} from "./validation";
import {InvalidParamError, MissingParamError} from "../../errors";

export class CompareFieldValidationComposite implements Validation{
    constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}

    validate(input: any): Error {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new InvalidParamError(this.fieldToCompareName);
        }
    }
}
