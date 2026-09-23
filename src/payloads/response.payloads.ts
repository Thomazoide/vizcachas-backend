export interface ResponsePayload<T> {
    status_code: number;
    message: string;
    data?: T;
    error: boolean;
}