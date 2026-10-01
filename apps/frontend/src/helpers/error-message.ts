export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The connection could not be completed.';
}
