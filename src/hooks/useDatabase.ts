import Database from "@/context/Database"
import { useContext } from "react"

const useDatabase = () => {
    const database = useContext(Database)
    return database
}

export default useDatabase