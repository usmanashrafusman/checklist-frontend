import { RxCollection, RxDatabase, } from "rxdb";
import { RxReplicationState } from "rxdb/plugins/replication";
import { Subscription } from "rxjs";

export interface ICollections {
    checklist: RxCollection
    task: RxCollection
}

export interface IReplications {
    checklist: RxReplicationState
    task: RxReplicationState
}

export interface CollectionSubscription {
    checklist: Subscription
    task: Subscription
}



export interface IDatabase {
    database: RxDatabase | null
    collections: ICollections | null
    replications: IReplications | null
    collectionSubscription: CollectionSubscription | null
}