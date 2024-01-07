import { FC, useState } from "react"
import { useCheckList } from "@/hooks"
import { Typography, Grid, Button, Box, TextField } from "@mui/material";
import Loading from "@/components/ui/common/Loading"
import Dialog from "@/components/ui/common/Dialog"

import CheckListItems from "./CheckListItems";

interface Validation {
    name: boolean,
    allValid: boolean
}
const initialValidationState = {
    name: true,
    allValid: true
}
const CheckList: FC<{}> = () => {
    const { entities, create, status, deleteOneById } = useCheckList();
    const [checkListName, setCheckListName] = useState<string>('');
    const [validation, setValdation] = useState<Validation>(initialValidationState);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckListName(e.target.value)
    };

    const onCreateNew = () => {
        setIsCreateDialogOpen(true)
    }

    const handleClose = () => {
        setIsCreateDialogOpen(false)
        setCheckListName("")
        setValdation(initialValidationState)
    }

    const createNewCheckList = async () => {
        await create(checkListName)
        handleClose()
    };

    const handleCreateCheckList = () => {
        const validationResult = structuredClone(initialValidationState)
        if (2 > checkListName.length) {
            validationResult.name = false;
            validationResult.allValid = false
        }
        if (validationResult.allValid) {
            createNewCheckList()
        }
        setValdation(validationResult)
    }

    return <Grid mt={2}>
        <Grid item md={12} xs={12} display="flex" justifyContent="center">
            <Typography variant="h5">Your Checklist</Typography>
        </Grid>
        <Grid item md={12} xs={12} display="flex" justifyContent="flex-end">
            <Box mr={2}>
                <Button variant="contained" onClick={onCreateNew}>Create New</Button>
            </Box>
        </Grid>
        <Grid item md={12} xs={12} display="flex" justifyContent="flex-end">
            <Dialog isOpen={isCreateDialogOpen} handleClose={handleClose} title="Craete new checklist" actions={
                <Box>
                    <Button sx={{ marginRight: 2 }} onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateCheckList}>Create</Button>
                </Box>
            }>
                <TextField onChange={handleChange} value={checkListName} placeholder="Name" error={!validation.name} helperText={!validation.name && "Checklist name must be atlest 03 characters"} />
            </Dialog>
        </Grid>
        <Grid item md={12} xs={12}>
            {status === "PENDING" ? <Loading /> : null}
            {status === "SUCCESS" ? entities?.length > 0 ? <CheckListItems items={entities} onDelete={deleteOneById} /> : <Typography variant="h5">No Checklist Found !</Typography> : null}
        </Grid>
    </Grid>
}
export default CheckList;

