import { Controller, HttpResponse, HttpRequest } from "../../protocols"
import { ok, serverError } from "../../helpers/http-helper"
import { AccountMySQLRepository } from "../../../infra/db/mysql/account-repository/accounts"

export class ListAccountsController implements Controller {
  constructor(private readonly accountRepository: AccountMySQLRepository) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accounts = await this.accountRepository.loadAll()
      return ok(accounts)
    } catch (error) {
      return serverError(error)
    }
  }
}
