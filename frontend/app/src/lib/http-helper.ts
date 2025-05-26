
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CallJsonApiConfiguration {
    path: string;
    method: HttpMethod;
    body?: object;
    authToken?: string;
}

export function callJsonApi(config: CallJsonApiConfiguration): Promise<Response> {
    const headers = new Headers();
    if (config.body !== undefined) {
        headers.append('Content-Type', 'application/json');
    }

    if (config.authToken !== undefined) {
        headers.append('Authorization', `Bearer ${config.authToken}`);
    }

    return fetch(config.path, {
        method: config.method,
        headers,
        body: JSON.stringify(config.body)
    });
}
