import bcrypt from 'bcrypt';
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise<string>((resolve) => resolve('hashed_password'));
    }
}));

describe('Bcrypt Adapter', () => {
    const salt = 12;
    it('should call bcrypt with correct value', async () => {
        const sut = new BcryptAdapter(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');
        expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return a hash on success', async () => {
        const sut = new BcryptAdapter(salt);
        const hash = await sut.encrypt('any_value');
        expect(hash).toBe('hashed_password');
    });
});
