import { ListAccountsController } from "../../presentation/controllers/accounts/list-accounts";
import { AccountMySQLRepository } from "../../infra/db/mysql/account-repository/accounts";
import { Controller } from "../../presentation/protocols";

export const makeListAccountsController = (): Controller => {
    const accountMySQLRepository = new AccountMySQLRepository();
    return new ListAccountsController(accountMySQLRepository);
}
