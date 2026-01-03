import {LogControllerDecorator} from "../../main/decorators/log";
import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";
import {ControllerStub} from "../helpers/controller-decorator-stub";

interface SutTypes {
    sut: LogControllerDecorator;
    controllerStub: Controller;
}

const makeSut = ():SutTypes => {
    const controllerStub = new ControllerStub();
    const sut = new LogControllerDecorator(controllerStub);

    return {
        sut,
        controllerStub
    }
}

describe('Log Controller Decorator', () => {
    it('should call controller handle', async () => {
        const {controllerStub, sut} = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        await sut.handle(httpRequest);
        expect(handleSpy).toHaveBeenCalledWith(httpRequest);
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
})
