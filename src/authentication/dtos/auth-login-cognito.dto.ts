import { AuthenticationResultType, ChallengeNameType } from "@aws-sdk/client-cognito-identity-provider";

export class AuthResultCognito {
    authenticationResult?: AuthenticationResultType;
    challenge?: {
        name: ChallengeNameType;
        parameters?: Record<string, string>;
        session?: string;
    };
}