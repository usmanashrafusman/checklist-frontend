import { RxCollection, RxDatabase, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { v4 as uuidv4 } from 'uuid';

import taskSchema from './collections/task';
import checklistSchema from './collections/checklist';
import { IDatabase } from '@/types/database';
import { replicateCollection } from './replication';

const initCollections = async (database: RxDatabase<{}>) => {
  const collections = await database.addCollections({
    checklist: {
      schema: checklistSchema,
    },
    task: {
      schema: taskSchema
    }
  });

  collections.checklist.preInsert((checkListItem) => {
    checkListItem.createdAt = Date.now();
    checkListItem.id = uuidv4();
  }, false);

  collections.task.preInsert((task) => {
    task.createdAt = Date.now();
    task.id = uuidv4();
  }, false);

  replicateCollection({
    collection: collections.checklist,
    url: "checklist"
  });

  replicateCollection({
    collection: collections.task,
    url: "task"
  });

  return collections;
}

const replicateDatabase = async (collections: { checklist: RxCollection; task: RxCollection }) => {
  const checklist = await replicateCollection({
    collection: collections.checklist,
    url: "checklist"
  });

  const task = await replicateCollection({
    collection: collections.task,
    url: "task"
  });

  return {
    task, checklist
  }
}

const getCollectionSubscribers = (collections: { checklist: RxCollection; task: RxCollection }) => {
  const task = collections.task.$.subscribe()
  const checklist = collections.checklist.$.subscribe()
  return {
    task,
    checklist
  }
}

export const initDB = async (): Promise<IDatabase> => {
  const database = await createRxDatabase({
    name: 'my-checklist',
    ignoreDuplicate: true,
    storage: getRxStorageDexie()
  });

  const collections = await initCollections(database)
  const collectionSubscription = getCollectionSubscribers(collections)
  const replications = await replicateDatabase(collections)

  return { database, collections, replications, collectionSubscription };
};

