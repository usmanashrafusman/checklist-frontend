import React, { FC } from 'react'
import { Dialog as MUIDialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

interface Props {
    isOpen?: boolean,
    title?: string
    actions?: React.ReactNode
    children?: React.ReactNode
    handleClose: () => void
}

const Dialog: FC<Props> = (props) => {
    const { handleClose, isOpen = true, title, actions, children } = props;

    const onClose = () => {
        if (handleClose) {
            handleClose()
        }
    }

    return (
        <MUIDialog open={isOpen} onClose={onClose}>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {children ? <DialogContent>
                {children}
            </DialogContent> : null}
            {actions ? <DialogActions>
                {actions}
            </DialogActions> : null}
        </MUIDialog>
    )
}

export default Dialog