import { FC } from "react"
import { ICheckList } from "@/types"
import TaskList from "@/components/ui/task/TaskList";
import { AccordionSummary, Accordion, AccordionDetails, Box, IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";

interface IProps extends ICheckList {
    handleDelete: (checklist: ICheckList) => void
}

const CheckListItem: FC<IProps> = (props) => {
    const { handleDelete, ...checklist } = props;
    const { name, id } = checklist;

    const handleDeleteItem = () => {
        if (handleDelete) {
            handleDelete(checklist)
        }
    };

    return (
        <Box width="100%" display="flex" justifyContent="center" mt={2}>
            <Box width="90%">
                <Accordion>
                    <AccordionSummary>
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <p>{name}</p>
                            <IconButton onClick={handleDeleteItem}>
                                <MdDelete size={22} />
                            </IconButton>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TaskList serviceId={id} />
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default CheckListItem;
