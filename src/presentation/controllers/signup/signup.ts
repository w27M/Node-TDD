import {HttpRequest, HttpResponse, Controller, AddAccount} from "../protocols/signup-protocols";
import {badRequest, serverError, ok} from "../../helpers/http-helper";
import {Validation} from "../../helpers/validators/validation";

export class SignUpController implements Controller {

    constructor(
        private readonly addAccount: AddAccount,
        private validation: Validation) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return badRequest(error);
            }
            const {name, email, password} = httpRequest.body;

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
