import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MySQLHelper } from '../helpers/mysql-helper'

export class AccountMySQLRepository implements AddAccountRepository {
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
}
