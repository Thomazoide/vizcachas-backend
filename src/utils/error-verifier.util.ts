export function CheckError(e: unknown): string {
    return e instanceof Error ? e.message : "Error desconocido";
}