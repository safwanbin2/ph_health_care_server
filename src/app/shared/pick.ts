const pick = (obj: Record<string, unknown>, keys: string[]) => {
  const finalObject = {};
  for (const key of keys) {
    if (Object.keys(obj).includes(key)) {
      finalObject[key] = obj[key];
    }
  }
  return finalObject;
};

export default pick;
