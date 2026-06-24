export function renderTemplate(
  template: string,
  values: Record<string, unknown>,
): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return values[key]?.toString() ?? "";
  });
}
