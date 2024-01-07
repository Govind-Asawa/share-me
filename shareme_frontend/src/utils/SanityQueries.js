export const getUserQuery = (userId) => {
  return `*[_type == 'user' && _id == '${userId}']`;
};
