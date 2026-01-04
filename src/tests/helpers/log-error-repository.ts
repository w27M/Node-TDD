import {LogErrorRepository} from "../../data/protocols/log-error-repository";

export class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        return new Promise(resolve => resolve());
    }
}
