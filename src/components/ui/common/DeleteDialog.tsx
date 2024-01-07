import { FC } from 'react'
import Dialog from "./Dialog";
import { Box, Button } from '@mui/material';

interface Props {
    isOpen?: boolean,
    title?: string,
    onConfirm: () => void,
    handleClose: () => void
}

const DeleteDialog: FC<Props> = (props) => {
    const { title, onConfirm, handleClose, isOpen = true } = props;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
            handleClose()
        }
    }

    const onClose = () => {
        if (handleClose) {
            handleClose()
        }
    }

    return (
        <Dialog isOpen={isOpen} handleClose={onClose} title={title ? title : "Are you Sure? you want to delete this item"} actions={<Box>
            <Button onClick={onClose}>No</Button>
            <Button onClick={handleConfirm}>Yes</Button>
        </Box>} />
    )
}

export default DeleteDialog