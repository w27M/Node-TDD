import env from "../../../env";
import { makeSignUpController } from "../../main/factories/signup";
import { makeListAccountsController } from "../../main/factories/list-accounts";
import { makeDeleteAccountController } from "../../main/factories/delete-account";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/accounts";
import { AccountMySQLRepository } from "../../infra/db/mysql/account-repository/accounts";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/logMongoRepository";
import { LogMySQLRepository } from "../../infra/db/mysql/log-repository/log-repository";

describe("Feature Toggle Configuration", () => {
    let originalToggle: string;

    beforeAll(() => {
        originalToggle = env.featureToggleDb;
    });

    afterAll(() => {
        env.featureToggleDb = originalToggle;
    });

    it("should default to a valid database option", () => {
        expect(['mongodb', 'mysql']).toContain(env.featureToggleDb);
    });

    describe("When featureToggleDb is 'mongodb'", () => {
        beforeEach(() => {
            env.featureToggleDb = 'mongodb';
        });

        it("should inject MongoDB repositories into controllers", () => {
            const signupController: any = makeSignUpController();
            expect(signupController.logErrorRepository).toBeInstanceOf(LogMongoRepository);
            expect(signupController.logErrorRepository).not.toBeInstanceOf(LogMySQLRepository);

            const signUpInnerController = signupController.controller;
            const dbAddAccount = signUpInnerController.addAccount;
            expect(dbAddAccount.addAccountRepository).toBeInstanceOf(AccountMongoRepository);
            expect(dbAddAccount.addAccountRepository).not.toBeInstanceOf(AccountMySQLRepository);

            const listController: any = makeListAccountsController();
            expect(listController.accountRepository).toBeInstanceOf(AccountMongoRepository);
            expect(listController.accountRepository).not.toBeInstanceOf(AccountMySQLRepository);

            const deleteController: any = makeDeleteAccountController();
            expect(deleteController.accountRepository).toBeInstanceOf(AccountMongoRepository);
            expect(deleteController.accountRepository).not.toBeInstanceOf(AccountMySQLRepository);
        });
    });

    describe("When featureToggleDb is 'mysql'", () => {
        beforeEach(() => {
            env.featureToggleDb = 'mysql';
        });

        it("should inject MySQL repositories into controllers", () => {
            const signupController: any = makeSignUpController();
            expect(signupController.logErrorRepository).toBeInstanceOf(LogMySQLRepository);
            expect(signupController.logErrorRepository).not.toBeInstanceOf(LogMongoRepository);

            const signUpInnerController = signupController.controller;
            const dbAddAccount = signUpInnerController.addAccount;
            expect(dbAddAccount.addAccountRepository).toBeInstanceOf(AccountMySQLRepository);
            expect(dbAddAccount.addAccountRepository).not.toBeInstanceOf(AccountMongoRepository);

            const listController: any = makeListAccountsController();
            expect(listController.accountRepository).toBeInstanceOf(AccountMySQLRepository);
            expect(listController.accountRepository).not.toBeInstanceOf(AccountMongoRepository);

            const deleteController: any = makeDeleteAccountController();
            expect(deleteController.accountRepository).toBeInstanceOf(AccountMySQLRepository);
            expect(deleteController.accountRepository).not.toBeInstanceOf(AccountMongoRepository);
        });
    });
});
