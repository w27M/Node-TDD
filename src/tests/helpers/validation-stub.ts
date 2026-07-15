import {Validation} from "../../presentation/helpers/validators/validation"

export class ValidationStub implements Validation {
    validate (input: any): Error {
        return null
    }
}
