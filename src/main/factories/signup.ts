import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from "../../data/usecases/add-account/db-add-account";
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMySQLRepository} from "../../infra/db/mysql/account-repository/accounts";
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/accounts";
import {Controller} from "../../presentation/protocols";
import {LogControllerDecorator} from "../decorators/log";
import {LogMySQLRepository} from "../../infra/db/mysql/log-repository/log-repository";
import {LogMongoRepository} from "../../infra/db/mongodb/log-repository/logMongoRepository";
import env from "../../../env";

export const makeSignUpController = (): Controller  => {
    const salt = 12;
    const emailValidator = new EmailValidatorAdapter();
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountRepository = env.featureToggleDb === 'mongodb'
        ? new AccountMongoRepository()
        : new AccountMySQLRepository();
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository);
    const signUpController = new SignUpController(emailValidator, dbAddAccount);
    const logRepository = env.featureToggleDb === 'mongodb'
        ? new LogMongoRepository()
        : new LogMySQLRepository();
    return new LogControllerDecorator(signUpController, logRepository);
}
