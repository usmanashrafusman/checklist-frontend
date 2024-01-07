import { CircularProgress, Box } from '@mui/material'
import { FC } from 'react'

interface Props {
    isLoading?: boolean
}
const Loading: FC<Props> = ({ isLoading=true }) => {
    if (isLoading) {
        return (
            <Box width="100%" display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
            </Box>
        )
    }
    return null
}

export default Loading