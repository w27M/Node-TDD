
import {MySQLHelper} from "../infra/db/mysql/helpers/mysql-helper";
import {MongoHelper} from "../infra/db/mongodb/helpers/mongo-helper";
import env from "../../env";

const startServer = async () => {
    if (env.featureToggleDb === 'mongodb') {
        await MongoHelper.connect(env.mongoUrl);
        console.log('Connected to MongoDB');
    } else {
        await MySQLHelper.connect(env.mysqlConfig);
        console.log('Connected to MySQL');
    }
    const app = (await import("./config/app")).default;
    app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
};

startServer().catch(console.error);
