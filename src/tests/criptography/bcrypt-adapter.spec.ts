import bcrypt from 'bcrypt';
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";

describe('Bcrypt Adapter', () => {
    const salt = 12;
    it('should call bcrypt with correct value', async () => {
        const sut = new BcryptAdapter(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');
        expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
    });
});
