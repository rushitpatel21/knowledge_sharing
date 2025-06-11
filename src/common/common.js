export const canAccess = (uId, auth) => {

  if (auth?.role === 'A') {
    return true;
  }
  else {
    if (uId === auth?._id) {
      return true;
    }
    return false;
  }
}