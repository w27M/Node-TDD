import {Router} from "express";
import {makeSignUpController} from "../factories/signup";
import {makeListAccountsController} from "../factories/list-accounts";
import {makeDeleteAccountController} from "../factories/delete-account";
import {adaptRoute} from "../adapters/express-routes-adapter";

export default (router: Router): void => {
    router.post("/signup", adaptRoute(makeSignUpController()));
    router.get("/accounts", adaptRoute(makeListAccountsController()));
    router.delete("/accounts/:id", adaptRoute(makeDeleteAccountController()));
}
