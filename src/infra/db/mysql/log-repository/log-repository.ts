import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MySQLHelper } from '../helpers/mysql-helper'

export class LogMySQLRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const query = 'INSERT INTO errors (stack, date) VALUES (?, ?)'
    await MySQLHelper.execute(query, [stack, new Date()])
  }
}
