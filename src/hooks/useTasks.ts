import { ITask } from "@/types";
import useDatabase from "./useDatabase";
import { v4 as uuidv4 } from 'uuid';
import { FC, useState, useEffect } from "react"

const useTasks = (checklist: string) => {
    const { database, collections, replications } = useDatabase();
    const [entities, setEntities] = useState<ITask[]>([])

    const collection = collections?.task;

    const create = async (name: string) => {
        const newTask = await collection?.insert({
            id: uuidv4(),
            checklist,
            name
        });
        const newTaskItem = {
            id: newTask.get("id"),
            name: newTask.get("name"),
            createdAt: newTask.get("createdAt"),
            checklist: newTask.get("checklist"),
        };
        setEntities((prev) => {
            const newEntities = [newTaskItem];
            if (Array.isArray(prev)) {
                return newEntities.concat(prev)
            };
            return newEntities
        });
    };

    const getAll = async (): Promise<ITask[]> => {
        const query = collection?.find({
            sort: [{ createdAt: "asc" }],
            selector: {
                checklist
            }
        });
        const data = await query?.exec();
        const list = Array.isArray(data) && data.map((d) => {
            return {
                id: d.id,
                name: d.name,
                createdAt: d.createdAt,
                checklist: d.checklist,
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
        await query?.remove();
        setEntities((prev) => {
            const newEntities = prev.filter((i) => i.id !== id);
            return newEntities;
        });

    };
    useEffect(() => {
        if (database) {
            getAll().then((items) => {
                setEntities(items)
            })
        }
    }, [database, replications?.task]);

    return {
        create,
        entities,
        deleteOneById,
        database,
        getAll,
        collection
    }
}

export default useTasks