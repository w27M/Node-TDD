import {EncrypterStub} from "../../helpers/encrypter-stub";
import {DbAddAccount} from "../../../data/usecases/add-account/db-add-account";
import {Encrypter} from "../../../data/protocols/encrypter";
import {AddAccountRepositoryStub} from "../../helpers/add-account-repository-stub";
import {AddAccountRepository} from "../../../data/protocols/add-account-repository";

interface sutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;
}

const makeAddAccountRepository = (): AddAccountRepository => {
    return new AddAccountRepositoryStub();
}

const makeEncrypter = (): Encrypter => {
    return new EncrypterStub();
}

const makeSut = (): sutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}
describe('Db-AddAccount use case', () => {
    it('should call Encrypter with correct password', async () => {
        const {encrypterStub, sut} = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        const accountData = {
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        }
        await sut.add(accountData);
        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });
    it('should throw if Encrypter throws', async () => {
        const {sut, encrypterStub} = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((_resolve, reject) =>
                    reject(new Error())
            )
        );
        const accountData = {
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        }
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    });
    it('should call AddAccountRepository with correct values', async () => {
        const {addAccountRepositoryStub, sut} = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        const accountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        await sut.add(accountData);
        expect(addSpy).toHaveBeenCalledWith({
            name: "valid_name",
            email: "valid_email",
            password: "hashed_password",
        });
    });
    it('should throw if Encrypter throws', async () => {
        const {sut, addAccountRepositoryStub} = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((_resolve, reject) =>
                reject(new Error())
            )
        );
        const accountData = {
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        }
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    });
});
