import {Validation} from "./validation";
import {MissingParamError} from "../../errors";

export class RequiredFieldValidationComposite implements Validation{
    constructor(private readonly fieldName: string) {}

    validate(input: any): Error {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName);
        }
    }
}
