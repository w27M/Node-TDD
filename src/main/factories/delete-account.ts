import { DeleteAccountController } from "../../presentation/controllers/accounts/delete-account";
import { AccountMySQLRepository } from "../../infra/db/mysql/account-repository/accounts";
import { Controller } from "../../presentation/protocols";

export const makeDeleteAccountController = (): Controller => {
    const accountMySQLRepository = new AccountMySQLRepository();
    return new DeleteAccountController(accountMySQLRepository);
}
