export type RefreshResponseType = {
    error: boolean,
    // tokens: string,
    tokens: {
        accessToken: string,
        refreshToken: string ,
    }

    message: string
}