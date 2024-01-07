"use client"
import { APPLICATION_CONFIG } from "@/config";
import type { IHttpServiceConfig } from "@/types"
import axios, { AxiosError } from "axios"

const { apiURL } = APPLICATION_CONFIG["PRODUCTION"];

const httpService = async<T, K>({ method = "get", url, body }: IHttpServiceConfig<T>): Promise<K> => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token") || null;
        axios.defaults.headers.common["Authorization"] = token
        try {
            const endpoint = apiURL + url;
            axios[method]<{ data: K }>(endpoint, {
                data: body,
            }).then((res) => {
                resolve(res.data?.data)
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    if (token) {
                        location.reload()
                    }
                }
                reject("An Error Occured")
            })
        } catch (error) {
            reject("An Error Occured")
        }
    })
}

export default httpService
