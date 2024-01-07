import { useState, useEffect } from "react"
import { ICheckList, IStatus } from "@/types";
import useDatabase from "./useDatabase";
import { v4 as uuidv4 } from 'uuid';

const useCheckList = () => {
    const { database, collections, collectionSubscription } = useDatabase();
    const collection = collections?.checklist;
    const [entities, setEntities] = useState<ICheckList[]>([])
    const [status, setStatus] = useState<IStatus>("IDLE")



    const create = async (name: string) => {
        const newCheckList = await collection?.insert({
            id: uuidv4(),
            name
        });
        const newCheckListItem = {
            id: newCheckList.get("id"),
            name: newCheckList.get("name"),
            createdAt: newCheckList.get("createdAt"),
        };
        setEntities((prev) => {
            const newEntities = [newCheckListItem];
            if (Array.isArray(prev)) {
                return newEntities.concat(prev)
            }
            return newEntities
        })
    };

    const getAll = async (): Promise<ICheckList[]> => {
        const query = collection?.find({
            sort: [{ createdAt: "desc" }]
        });
        const data = await query?.exec();
        const list = Array.isArray(data) && data.map((d) => {
            return {
                id: d.id,
                name: d.name,
                createdAt: d.createdAt
            }
        })
        return list || [];
    };

    const deleteOneById = async (id: string): Promise<void> => {
        const query = collection?.findOne({
            selector: {
                id
            }
        });
        const taskQuery = collections?.task.find({
            selector: {
                checklist: id
            }
        });
        await query?.remove();
        await taskQuery?.remove();
        setEntities((prev) => {
            const newEntities = prev.filter((i) => i.id !== id);
            return newEntities;
        })

    };

    //getting checklist
    useEffect(() => {
        if (database) {
            setStatus("PENDING")
            getAll().then((items) => {
                setEntities(items)
                setStatus("SUCCESS")
            })
        }
    }, [database, collectionSubscription?.checklist]);
    
    return {
        create,
        database,
        deleteOneById,
        status,
        getAll,
        entities,
        collection
    }
}

export default useCheckList