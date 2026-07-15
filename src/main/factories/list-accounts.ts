import { ListAccountsController } from "../../presentation/controllers/accounts/list-accounts";
import { AccountMySQLRepository } from "../../infra/db/mysql/account-repository/accounts";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/accounts";
import { Controller } from "../../presentation/protocols";
import env from "../../../env";

export const makeListAccountsController = (): Controller => {
    const accountRepository = env.featureToggleDb === 'mongodb'
        ? new AccountMongoRepository()
        : new AccountMySQLRepository();
    return new ListAccountsController(accountRepository);
}
