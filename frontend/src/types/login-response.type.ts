export type LoginResponseType = {
    error: boolean,
    user: {
        name: string,
        lastName: string
    }
    tokens: {
        accessToken: string,
        refreshToken: string,
    },

    message: string,
    status: number
}