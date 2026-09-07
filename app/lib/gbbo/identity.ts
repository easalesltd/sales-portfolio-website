export function gbboSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function companionIdForName(name: string): string {
  return `comp_${gbboSlug(name)}`;
}

export function bakerIdForName(name: string): string {
  return `baker_${gbboSlug(name)}`;
}
