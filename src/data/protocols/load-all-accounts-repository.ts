import { AccountModel } from "../../domain/models/account";

export interface LoadAllAccountsRepository {
    loadAll(): Promise<AccountModel[]>;
}
