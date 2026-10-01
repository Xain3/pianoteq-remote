/** Resolves both pre-v9 and v9 IDs; always write using the original ID returned by Pianoteq. */
export class ParameterIds {
  static normalize(id: string): string {
    return id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  static find<T extends { id: string }>(parameters: readonly T[], id: string): T | undefined {
    const normalized = ParameterIds.normalize(id);
    return parameters.find((parameter) => ParameterIds.normalize(parameter.id) === normalized);
  }
}
