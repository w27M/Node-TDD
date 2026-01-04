import {LogControllerDecorator} from "../../main/decorators/log";
import {Controller, HttpRequest} from "../../presentation/protocols";
import {ControllerStub} from "../helpers/controller-decorator-stub";
import {serverError} from "../../presentation/helpers/http-helper";
import {LogErrorRepository} from "../../data/protocols/log-error-repository";
import {LogErrorRepositoryStub} from "../helpers/log-error-repository";

interface SutTypes {
    sut: LogControllerDecorator;
    controllerStub: Controller;
    logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
    }
});

const makeLogErrorRepository = (): LogErrorRepository => {
    return new LogErrorRepositoryStub();
}

const makeSut = ():SutTypes => {
    const controllerStub = new ControllerStub();
    const logErrorRepositoryStub = makeLogErrorRepository();
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('Log Controller Decorator', () => {
    it('should call controller handle', async () => {
        const {controllerStub, sut} = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        await sut.handle(makeFakeRequest());
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
    });

    it('should return the same result of the controller', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }});
    });

    it('Should call LogError with correct error if controller returns a ServerError', async () => {
        const {sut, controllerStub, logErrorRepositoryStub} = makeSut();
        const fakeError = new Error();
        fakeError.stack = "any_stack";
        const error =  serverError(fakeError);

        jest.spyOn(controllerStub, 'handle')
            .mockReturnValueOnce(new Promise(resolve => resolve(error)));
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        await sut.handle(makeFakeRequest());
        expect(logSpy).toHaveBeenCalledWith("any_stack");
    });
})
