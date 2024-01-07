import { createContext } from "react";
import { IDatabase } from "@/types/database";

export default createContext<IDatabase>({ database: null, collections: null, replications: null, collectionSubscription: null })