import { FC, useState } from "react"
import useTasks from "@/hooks/useTasks";
import { MenuItem, MenuList, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { ITask } from "@/types";
import DeleteDialog from "@/components/ui/common/DeleteDialog";
import Dialog from "@/components/ui/common/Dialog";

interface IProps {
    serviceId: string
}
interface Validation {
    name: boolean,
    allValid: boolean
}

const initialValidationState: Validation = {
    name: true,
    allValid: true
}

const TaskList: FC<IProps> = (props) => {
    const { serviceId } = props;
    const { create, entities, deleteOneById } = useTasks(serviceId);
    const [taskName, setTaskName] = useState<string>('')
    const [validation, setValdation] = useState<Validation>(initialValidationState)
    const [selectedItem, setSelectedItem] = useState<null | ITask>(null)
    const [isAddNewDialogOpen, setIsAddNewDialogOpen] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(e.target.value)
    };

    const handleDelete = (task: ITask) => {
        setSelectedItem(task)
    };

    const handleClose = () => {
        setSelectedItem(null)
    }

    const handleCloseAddNewDialog = () => {
        setIsAddNewDialogOpen(false)
        setTaskName("")
        setValdation(initialValidationState)
    }

    const handleOpenAddNewDialog = () => {
        setIsAddNewDialogOpen(true)
    }
    const createNewTask = async () => {
        await create(taskName)
        setTaskName("")
        handleCloseAddNewDialog()
    };

    const handleCreateNewTask = () => {
        const validationResult = structuredClone(initialValidationState);
        if (2 > taskName.length) {
            validationResult.name = false
            validationResult.allValid = false
        }
        if (validationResult.allValid) {
            createNewTask()
        }
        setValdation(validationResult)

    }

    const onConfirm = async () => {
        if (selectedItem) {
            await deleteOneById(selectedItem.id)
        }
        handleClose()
    }

    return <div>
        <p>Tasks</p>
        {<Dialog title="Add New Task" isOpen={isAddNewDialogOpen} actions={<Box>
            <Button sx={{ marginRight: 2 }} onClick={handleCloseAddNewDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateNewTask}>Create</Button>
        </Box>} handleClose={handleCloseAddNewDialog} >
            <TextField placeholder="Task Name" onChange={handleChange} value={taskName} error={!validation.name} helperText={!validation.name && "Task must be atlest 03 characters"} />
        </Dialog>}
        <DeleteDialog isOpen={!!selectedItem} onConfirm={onConfirm} handleClose={handleClose} />
        <MenuList>
            {entities && entities.map((item) => {
                return <MenuItem key={item.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography>{item.name}</Typography>
                        <IconButton onClick={() => handleDelete(item)}>
                            <MdDelete size={22} />
                        </IconButton>
                    </Box>
                </MenuItem>
            })}
        </MenuList>
        <Button onClick={handleOpenAddNewDialog}>Add New Task</Button>
    </div>
}
export default TaskList;
