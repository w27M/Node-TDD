import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";
import {LogErrorRepository} from "../../data/protocols/log-error-repository";

export class LogControllerDecorator implements Controller {
    constructor(private controller: Controller, private logErrorRepository: LogErrorRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest);
        if (httpResponse.statusCode === 500) {
            const errorStack = httpResponse.body.stack
           await this.logErrorRepository.logError(errorStack);
        }

        return httpResponse;
    }
}
