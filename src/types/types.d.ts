export type IStatus = "IDLE" | "PENDING" | "SUCCESS" | "ERROR"
export type API_METHODS = "get" | "post" | "put" | "delete" | "patch"

export enum APP_ENVIROMENTS {
    DEVELOPMENT = "DEVELOPMENT",
    PRODUCTION = "PRODUCTION"
}
export interface IUser {
    username: string
    id: string
}

export interface IHttpServiceConfig<T> {
    method?: API_METHODS,
    body?: T
    url: string
}