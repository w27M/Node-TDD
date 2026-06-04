import { Controller, HttpResponse, HttpRequest } from "../../protocols"
import { ok, serverError, badRequest } from "../../helpers/http-helper"
import { AccountMySQLRepository } from "../../../infra/db/mysql/account-repository/accounts"

export class DeleteAccountController implements Controller {
  constructor(private readonly accountRepository: AccountMySQLRepository) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params || {}
      if (!id) {
        return badRequest(new Error('Missing id parameter'))
      }
      const success = await this.accountRepository.delete(id)
      return ok({ success })
    } catch (error) {
      return serverError(error)
    }
  }
}
