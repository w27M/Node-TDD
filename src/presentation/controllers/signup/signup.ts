import {HttpRequest, HttpResponse, EmailValidator, Controller, AddAccount} from "../protocols/signup-protocols";
import {badRequest, serverError, ok} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";
import {Validation} from "../../helpers/validators/validation";

export class SignUpController implements Controller {

    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private validation: Validation) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            this.validation.validate(httpRequest.body);
            const {name, email, password, passwordConfirmation} = httpRequest.body;

            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError(('passwordConfirmation')));
            }

            const isValid = this.emailValidator.isValid(email);

            if (!isValid) {
                return badRequest(new InvalidParamError(('email')));
            }

            const account = await this.addAccount.add({
                name,
                email,
                password
            });

           return ok(account);
        } catch (error) {
            return serverError(error);
        }
    }
}
