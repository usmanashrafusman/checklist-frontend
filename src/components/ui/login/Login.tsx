import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import React, { FC, useState } from 'react'
import type { Validation, Creds } from '@/types'

interface IProps {
    onLogin: (creds: Creds) => Promise<void>
}

const intialState: Validation = {
    username: true,
    password: true,
    allValid: true
}
const Login: FC<IProps> = ({ onLogin }) => {
    const [creds, setCreds] = useState<Creds>({ username: "", password: "" })
    const [validation, setValidation] = useState<Validation>(intialState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreds((c: Creds) => {
            return {
                ...c,
                [e.target.name]: e.target.value
            }
        })
    };
    const handleLogin = async () => {
        const validationResult = structuredClone(intialState)
        if (5 > creds.username.length) {
            validationResult.username = false;
            validationResult.allValid = false;
        } else if (5 > creds.password.length) {
            validationResult.password = false;
            validationResult.allValid = false
        }
        setValidation(validationResult);
        if (validationResult.allValid) {
            if (onLogin) {
                await onLogin(creds)
            }
        }
    }
    return (
        <Box>
            <Grid container>
                <Grid item md={12} sm={12}>
                    <Grid container display="flex" justifyContent="center">
                        <Grid item md={6} sm={12}>
                            <Box width="100%" display="flex" alignItems="center" flexDirection="column">
                                <Typography mt={2}>Welcome</Typography>
                                <Box mt={2}>
                                    <TextField onChange={handleChange} placeholder='Username' value={creds.username} name='username' error={!validation.username} helperText={!validation.username && "Username must be atlest 5 characters"} />
                                </Box>
                                <Box mt={2}>
                                    <TextField onChange={handleChange} placeholder='Password' value={creds.password} name='password' type="password" error={!validation.password} helperText={!validation.password && "Password must be atlest 5 characters"} />
                                </Box>
                                <Box mt={2}>
                                    <Button variant='contained' onClick={handleLogin}>Login</Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login
