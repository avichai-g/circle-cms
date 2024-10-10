const generateUUID = () => {
  return ([1e7] as any).toString() + -1e3 + -4e3 + -8e3 + -1e11;
};

export default generateUUID;
