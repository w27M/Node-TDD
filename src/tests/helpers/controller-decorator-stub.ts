import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";

    export class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        return new Promise(resolve => resolve(httpResponse))
    }
}

