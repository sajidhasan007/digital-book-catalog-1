export const filterFalsyValues = (obj: any) => {
  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      newObj[key] = value;
    }
  }
  return newObj;
};
