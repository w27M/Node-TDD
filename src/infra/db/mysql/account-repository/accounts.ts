import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { LoadAllAccountsRepository } from '../../../../data/protocols/load-all-accounts-repository'
import { DeleteAccountRepository } from '../../../../data/protocols/delete-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MySQLHelper } from '../helpers/mysql-helper'

export class AccountMySQLRepository implements AddAccountRepository, LoadAllAccountsRepository, DeleteAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const query = 'INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)'
    const params = [accountData.name, accountData.email, accountData.password]
    const result: any = await MySQLHelper.execute(query, params)
    return {
      id: result.insertId.toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password
    }
  }

  async loadAll (): Promise<AccountModel[]> {
    const query = 'SELECT id, name, email FROM accounts'
    const result: any = await MySQLHelper.execute(query)
    return result.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email
    }))
  }

  async delete (id: string): Promise<boolean> {
    const query = 'DELETE FROM accounts WHERE id = ?'
    const result: any = await MySQLHelper.execute(query, [id])
    return result.affectedRows > 0
  }
}
