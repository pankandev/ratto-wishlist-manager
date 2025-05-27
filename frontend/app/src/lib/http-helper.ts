import {z} from "zod";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CallJsonApiConfiguration {
    path: string;
    method: HttpMethod;
    body?: object;
    authToken?: string;
}

function getAuthorizedJSONHeaders(authToken?: string, body?: unknown): Headers {
    const headers = new Headers();
    if (body !== undefined) {
        headers.append('Content-Type', 'application/json');
    }

    if (authToken !== undefined) {
        headers.append('Authorization', `Bearer ${authToken}`);
    }

    return headers;
}

export function callJsonApi(config: CallJsonApiConfiguration): Promise<Response> {
    return fetch(config.path, {
        method: config.method,
        headers: getAuthorizedJSONHeaders(config.authToken, config.body),
        body: JSON.stringify(config.body)
    });
}


export function getListSchema<T>(schema: z.ZodSchema<T, z.ZodTypeDef, unknown>): z.ZodSchema<T[], z.ZodTypeDef, unknown> {
    return z.array(schema);
}

export function getJsonFetcher<T>(
    responseSchema: z.ZodSchema<T, z.ZodTypeDef, unknown>,
    authToken?: string | null,
): (url: string) => Promise<T> {
    return async (url: string) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthorizedJSONHeaders(authToken ?? undefined, undefined),
        });
        return responseSchema.parse(await response.json())
    };
}
