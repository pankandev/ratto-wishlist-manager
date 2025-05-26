import {AppError} from "@/lib/app-error.ts";
import {toast} from "react-toastify";


function notifyErrorApp(error: AppError): void {
    toast(error.message, {
        theme: 'dark',
        type: 'error',
    });
}

export function notifyError(error: AppError | string | unknown) {
    if (!(error instanceof AppError)) {
        if (error instanceof Error) {
            notifyErrorApp(new AppError("unknown", error.message));
        } else if (typeof error === 'string') {
            notifyErrorApp(new AppError("unknown", error));
        } else {
            notifyErrorApp(new AppError("unknown", "unknown error"));
        }
    } else {
        notifyErrorApp(error);
    }
}