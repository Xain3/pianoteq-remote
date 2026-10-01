export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 502,
    public readonly rpcCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
