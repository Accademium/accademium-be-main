import { TokenTypes } from "../enums/token.enum";

export interface TokenPayload {
    userId: string,
    username: string,
    email: string,
    groups: string,
    organisationId: string,
    type: TokenTypes,
}