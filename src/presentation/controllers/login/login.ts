import {Controller, HttpRequest, HttpResponse} from "../../protocols";
import {badRequest, serverError} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";
import {EmailValidator} from "../../protocols/email-validator";
import {Authentication} from "../../../domain/usecases/authentication";

export class LoginController implements Controller {
    constructor(private emailValidator: EmailValidator, private authentication: Authentication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const fields = ["email", "password"];

            for (const field of fields) {
                if (!httpRequest.body[field]) {
                    return new Promise(resolve => resolve(badRequest(new MissingParamError(field))));
                }
            }

            const {email, password} = httpRequest.body;

            const isValid = this.emailValidator.isValid(email);

            if (!isValid) {
                return badRequest(new InvalidParamError(('email')));
            }

            await this.authentication.auth(email, password);

        } catch (error) {
            return serverError(error)
        }
    }
}
