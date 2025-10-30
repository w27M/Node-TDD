import {Collection, MongoClient} from "mongodb";
import {AccountsInterface} from "../accounts.interface";

export const MongoHelper = {
    client: null as MongoClient,
    async connect(url: string): Promise<void> {
        this.client = await MongoClient.connect(url);
    },

    async disconnect (): Promise<void> {
        await this.client.close();
        this.client = null;
    },

    getCollection (name: string): Collection {
        return this.client.db().collection(name)
    },

    map(document: any): AccountsInterface {
        const { _id, ...rest } = document;
        return {...rest, id: _id.toString()};
    }
}
