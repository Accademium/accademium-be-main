import { TokenTypes } from "../enums/token.enum";

export interface TokenPayload {
    userId: string,
    email?: string,
    groups?: string,
    organisationId?: string,
    type: TokenTypes,
}