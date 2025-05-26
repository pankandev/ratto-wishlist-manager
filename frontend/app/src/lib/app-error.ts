import {z} from "zod";


const DRFInvalidRequestErrorDetailsSchema = z.record(z.array(z.string()))

export class AppError extends Error {

    constructor(
        public readonly code: string,
        message: string,
        public readonly details: object = {}
    ) {
        super(message);
    }

    static async fromResponse(response: Response): Promise<AppError> {
        return new AppError(
            response.statusText,
            response.statusText,
            {
                'content': await response.text()
            }
        );
    }


    static async fromDRFError(response: Response): Promise<AppError> {
        if (response.status === 400) {
            const parsed = DRFInvalidRequestErrorDetailsSchema.safeParse(await response.json());
            if (parsed.success) {
                const [firstField, errors] = Object.entries(parsed.data)[0];
                return new AppError(
                    'invalid-request',
                    `${firstField}: ${errors[0]}`,
                    parsed.data
                );
            }
        }
        return AppError.fromResponse(response);
    }
}