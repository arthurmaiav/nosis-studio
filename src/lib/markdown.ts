export function heading(level: number, text: string): string {
  return `${"#".repeat(level)} ${text}`;
}

export function bullet(text: string): string {
  return `- ${text}`;
}

export function code(value: string): string {
  return `\`${value.replaceAll("`", "\\`")}\``;
}

export function excerpt(value: string, maxLength = 420): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength - 3)}...`;
}
