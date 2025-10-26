export class EncrypterStub {
    async encrypt(value: string): Promise<string> {
        return new Promise<string>((resolve) => resolve('hashed_value'));
    }
}
