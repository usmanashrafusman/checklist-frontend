import { Creds, IStatus, IUser } from "@/types";
import { useState, useEffect } from "react"
import httpService from "@/services/httpService";
import { jwtDecode } from 'jwt-decode';

interface IHandleLoginResponse {
    user: IUser,
    token: string
}

const useAuth = () => {
    const [user, setUser] = useState<null | IUser>(null);
    const [status, setStatus] = useState<IStatus>("IDLE");

    useEffect(() => {
        setStatus("PENDING")
        const token = localStorage.getItem("token") || null;
        if (token) {
            const userData: IUser = jwtDecode(token)
            if (userData && userData.username && userData.id) {
                setUser({
                    username: userData.username,
                    id: userData.id
                });
                setStatus("SUCCESS")

            } else {
                setStatus("ERROR")
            }
        } else {
            setStatus("ERROR")
        }
    }, [])

    const handleLogin = async (creds: Creds) => {
        setStatus("PENDING")
        httpService<Creds, IHandleLoginResponse>({ method: "post", url: "auth", body: creds }).then(({ user, token }) => {
            if (user && token) {
                setUser({
                    username: user.username,
                    id: user.id
                });
                setStatus("SUCCESS")
                localStorage.setItem("token", token)
            } else {
                setStatus("ERROR")
            }
        }).catch(() => {
            setStatus("ERROR")
        })
    }

    return {
        user,
        handleLogin,
        status
    }
}

export default useAuth