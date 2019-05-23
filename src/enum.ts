export type EnumValueType = string | number

export function getEnumKeys(e: any): string[] {
  return Object.keys(e).filter(key => !/^\d/.test(key))
}

export function getEnumValues<T extends EnumValueType>(e: any): T[] {
  return getEnumKeys(e).map(key => e[key]) as T[]
}
