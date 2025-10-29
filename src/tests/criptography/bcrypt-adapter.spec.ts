import bcrypt from 'bcrypt';
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise<string>((resolve) => resolve('hashed_password'));
    }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    const salt = 12;
    it('should call bcrypt with correct value', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');
        expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return a hash on success', async () => {
        const sut = makeSut();
        const hash = await sut.encrypt('any_value');
        expect(hash).toBe('hashed_password');
    });

    it('should throw if bcrypt throws', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
            throw new Error();
        });

        await expect(sut.encrypt('any_value')).rejects.toThrow();
    });
});
