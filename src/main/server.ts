
import {MySQLHelper} from "../infra/db/mysql/helpers/mysql-helper";
import env from "../../env";

MySQLHelper.connect(env.mysqlConfig).then(async () => {
    const app = (await import ("./config/app")).default;
    app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
}).catch(console.error);
