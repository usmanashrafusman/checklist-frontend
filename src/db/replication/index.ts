// @ts-nocheck
import { replicateRxCollection } from 'rxdb/plugins/replication';
import {
    RxCollection,
    lastOfArray,
} from 'rxdb';
import httpService from '@/services/httpService';

interface IReplicateCollectionConfig {
    collection: RxCollection,
    url: string
}

interface Base {
    id: string,
    createdAt: number
}


export const replicateCollection = async<T extends Base>({ collection, url }: IReplicateCollectionConfig) => {
    const replicationState = await replicateRxCollection({
        collection,
        replicationIdentifier: url,
        retryTime: 5 * 1000,
        waitForLeadership: true,
        autoStart: true,
        deletedField: "isDeleted",
        push: {
            async handler(docs) {
                const body = docs.map((d) => {
                    return {
                        ...d.newDocumentState
                    }
                });
                const data = await httpService<T[], T[]>({
                    method: "post",
                    url,
                    body
                })
                return data;
            },
            batchSize: 5,
            modifier: (d) => {
                d.createdAt = new Date(d.createdAt)
                return d
            }
        },
        pull: {
            async handler(lastCheckpoint: { updatedAt?: number }) {
                const minTimestamp = lastCheckpoint ? lastCheckpoint?.updatedAt : 0;
                let apiURL = url;
                if (minTimestamp) {
                    apiURL = apiURL + `?minTimestamp=${minTimestamp}`
                }
                const documents = await httpService<T[], T[]>({ url: apiURL });
                if (documents && documents.length) {
                    const newLastCheckPoint = lastOfArray<T>(documents)
                    if (newLastCheckPoint && newLastCheckPoint.id && newLastCheckPoint.createdAt) {
                        return {
                            documents,
                            checkpoint: {
                                id: newLastCheckPoint.id,
                                updatedAt: new Date(newLastCheckPoint.createdAt).getTime() + 1000
                            }
                        }
                    }
                } else {
                    return {
                        documents: [],
                        checkpoint: lastCheckpoint
                    }
                }
            },
            modifier: d => {
                d.createdAt = new Date(d.createdAt).getTime()
                return d
            },
        },

    });
    return replicationState;
}
