import { Controller, HttpResponse, HttpRequest } from "../../protocols"
import { ok, serverError } from "../../helpers/http-helper"
import { LoadAllAccountsRepository } from "../../../data/protocols/load-all-accounts-repository"

export class ListAccountsController implements Controller {
  constructor(private readonly accountRepository: LoadAllAccountsRepository) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accounts = await this.accountRepository.loadAll()
      return ok(accounts)
    } catch (error) {
      return serverError(error)
    }
  }
}
