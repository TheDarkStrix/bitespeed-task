const generateUniqueId = () => {
  // for my usecase, i think this should sufficient
  const randomString = Math.random().toString(36).substring(2, 10);
  const timestamp = new Date().getTime().toString(36);
  return randomString + timestamp;
};

export { generateUniqueId };
