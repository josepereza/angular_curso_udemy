export interface AuthResponse {
    ok: boolean
    msg: string
    token?: string
    uid?: string
    name?: string
    email?: string,
    newToken?: string
}

export interface User {
    uid: string
    name: string
    email: string
}