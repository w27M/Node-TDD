import { DeleteAccountController } from "../../presentation/controllers/accounts/delete-account";
import { AccountMySQLRepository } from "../../infra/db/mysql/account-repository/accounts";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/accounts";
import { Controller } from "../../presentation/protocols";
import env from "../../../env";

export const makeDeleteAccountController = (): Controller => {
    const accountRepository = env.featureToggleDb === 'mongodb'
        ? new AccountMongoRepository()
        : new AccountMySQLRepository();
    return new DeleteAccountController(accountRepository);
}
