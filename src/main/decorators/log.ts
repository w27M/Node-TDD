import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
    constructor(private controller: Controller) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return await this.controller.handle(httpRequest);
    }
}
