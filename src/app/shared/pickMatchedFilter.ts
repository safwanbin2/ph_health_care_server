const pickMatchedFilter = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  keys: K[]
) => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.keys(obj).includes(key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pickMatchedFilter;
