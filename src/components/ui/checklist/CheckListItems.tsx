import { FC, useState } from "react"
import { ICheckList } from "@/types"
import { Box } from "@mui/material";
import CheckListItem from "./CheckListItem";
import DeleteDialog from "@/components/ui/common/DeleteDialog";

interface Props {
    items: ICheckList[]
    onDelete: (id: string) => Promise<void>
}

const CheckListItems: FC<Props> = ({ items, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState<null | ICheckList>(null);

    const handleDelete = (checklist: ICheckList) => {
        setSelectedItem(checklist)
    };

    const handleClose = () => {
        setSelectedItem(null)
    }

    const onConfirm = () => {
        if (onDelete && selectedItem) {
            onDelete(selectedItem.id)
        }
    }

    return <Box width="100%" display="flex" alignItems="center" flexDirection="column">
        <DeleteDialog isOpen={!!selectedItem} handleClose={handleClose} onConfirm={onConfirm} />
        {Array.isArray(items) ? items.map((item) => {
            return <CheckListItem key={item.id} {...item} handleDelete={handleDelete} />
        }) : null}
    </Box>
}

export default CheckListItems;