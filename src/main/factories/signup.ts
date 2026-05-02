import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from "../../data/usecases/add-account/db-add-account";
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMySQLRepository} from "../../infra/db/mysql/account-repository/accounts";
import {Controller} from "../../presentation/protocols";
import {LogControllerDecorator} from "../decorators/log";
import {LogMySQLRepository} from "../../infra/db/mysql/log-repository/log-repository";

export const makeSignUpController = (): Controller  => {
    const salt = 12;
    const emailValidator = new EmailValidatorAdapter();
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMySQLRepository = new AccountMySQLRepository();
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMySQLRepository);
    const signUpController = new SignUpController(emailValidator, dbAddAccount);
    const logMySQLRepository = new LogMySQLRepository();
    return new LogControllerDecorator(signUpController, logMySQLRepository);
}
