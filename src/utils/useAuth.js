const {
  postReq,
  showErrorMessage,
  patchReq,
  patchApiReq,
} = require("./ApiHandlers");

const useAuth = () => {
  const getFileUrl = async (data) => {
    return await postReq("/upload", data);
  };

  const verifyUser = async (data, userId) => {
    const response = await patchApiReq(
      `/admin/user-verification?userId=${userId}`,
      data
    );
    if (response.status) {
      return [response.data];
    } else {
      showErrorMessage(response?.error?.message);
    }
  };

  const verifyUserAgain = async (data) => {
    const response = await patchReq("/users/me/verification", data);
    if (response.status) {
      return [response.data];
    } else {
      showErrorMessage(response?.error?.message);
    }
  };

  return {
    getFileUrl,
    verifyUser,
    verifyUserAgain,
  };
};
export default useAuth;
