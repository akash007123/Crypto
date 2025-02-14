const devEnv = process.env.NODE_ENV !== "production";
const API_URL = `${
  devEnv ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API
}`;

export const imageHandler = (path, type) => {
  switch (type) {
    case 1:
      if (path && path.indexOf("http") === -1) {
        return `${API_URL}/user/profile/${path}`;
      } else {
        return path;
      }

    case 2:
      if (path && path.indexOf("http") === -1) {
        return `${API_URL}/user/banner/${path}`;
      } else {
        return path;
      }
    case 3:
      if (path && path.indexOf("http") === -1) {
        return `${API_URL}/user/verification/${path}`;
      } else {
        return path;
      }
    case 4:
      if (path && path.indexOf("http") === -1) {
        return `${API_URL}/storage/user/profile/${path}`;
      } else {
        return path;
      }

    default:
      if (path && path.indexOf("http") === -1) {
        return `${API_URL}/${path}`;
      } else {
        return path;
      }
  }
};
