import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const devEnv = process.env.NODE_ENV !== "production";
const API_URL = `${
  devEnv ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API
}`;
const responseFormatter = (status, data, error) => {
  return { status, data, error };
};
const handleApiError = (err) => {
  return responseFormatter(false, null, err?.response?.data);
};
export const postReq = async (endpoint, data) => {
  const url = API_URL + endpoint;

  return await axios
    .post(url, data, { withCredentials: true })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};
export const getFileUrl = async (data) => {
  return await postReq("/upload", data);
};

export const postApiReq = async (url, data, method = "POST") => {
  const route_url = API_URL + url;
  let USER = null;

  if (Cookies.get("user")) {
    USER = JSON.parse(Cookies.get("user"));
  }

  // Check if user exists and is not an admin
  if (USER && USER.role !== "admin") {
    // Block Edit, Delete, and Update Requests
    const forbiddenRoutes = ["/edit", "/delete", "/update"];
    if (forbiddenRoutes.some((route) => url.includes(route))) {
      return responseFormatter(false, null, "Permission Denied");
    }
  }

  return await axios
    .post(route_url, data, {
      method,
      headers: USER?.token
        ? {
            Accept: "application/json",
            Authorization: `Bearer ${USER.token}`,
          }
        : {
            Accept: "application/json",
          },
      withCredentials: true,
    })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e.response.status === 403) {
        Cookies.remove("user");
        window.location.href = "/";
      }
      return responseFormatter(false, null, e.response.data);
    });
};

export const getApiReq = async (url) => {
  var USER = null;
  if (Cookies.get("user")) {
    USER = JSON.parse(Cookies.get("user"));
  }
  const route_url = API_URL + url;
  return await axios
    .get(route_url, {
      headers: USER?.token
        ? {
            Accept: "application/json",
            Authorization: `Bearer ${USER.token}`,
          }
        : {
            Accept: "application/json",
          },
      withCredentials: true,
    })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e.response.status === 403) {
        Cookies.remove("user");
        window.location.href = "/";
      } else if (e.response.data.length > 0) {
        return responseFormatter(false, null, e.response.data);
      } else {
        return responseFormatter(false, null, e.response.data);
      }
    });
};

export const putApiReq = async (url, data) => {
  var USER = null;
  if (Cookies.get("user")) {
    USER = JSON.parse(Cookies.get("user"));
  }

  const route_url = API_URL + url;
  return await axios
    .put(route_url, data, {
      headers: USER?.token
        ? {
            Accept: "application/json",
            Authorization: `Bearer ${USER.token}`,
          }
        : {
            Accept: "application/json",
          },
      withCredentials: true,
    })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e.response.data.length > 0) {
        return responseFormatter(false, null, e.response.data);
      } else {
        return responseFormatter(false, null, e.response.data);
      }
    });
};

export const patchApiReq = async (url, data) => {
  var USER = null;
  if (Cookies.get("user")) {
    USER = JSON.parse(Cookies.get("user"));
  }

  const route_url = API_URL + url;
  return await axios
    .patch(route_url, data, {
      headers: USER?.token
        ? {
            Accept: "application/json",
            Authorization: `Bearer ${USER.token}`,
          }
        : {
            Accept: "application/json",
          },
      withCredentials: true,
    })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e.response.data.length > 0) {
        return responseFormatter(false, null, e.response.data);
      } else {
        return responseFormatter(false, null, e.response.data);
      }
    });
};

export const getReq = async (url) => {
  const route_url = API_URL + url;
  return await axios
    .get(route_url, {
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e) {
        return responseFormatter(false, null, e?.response?.data || null);
      } else {
        return responseFormatter(false, null, e?.response?.data || null);
      }
    });
};

export const getImageUrl = async (data) => {
  var image = false;
  await postApiReq("/user/upload-asset", data)
    .then((res) => {
      if (res.status) {
        image = res.data;
      } else {
        image = false;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  return image;
};

export const deleteApiReq = async (url, data) => {
  const route_url = API_URL + url;
  return await axios
    .delete(
      route_url,

      {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
        data,
      }
    )
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((e) => {
      if (e?.response?.status === 401) {
        // Cookies.remove(`${NETWORK}AdminLoggedIn`);
        // window.location.href = '/';
      } else if (e) {
        return responseFormatter(false, null, e?.response?.data || null);
      } else {
        return responseFormatter(false, null, e?.response?.data || null);
      }
    });
};
export const showErrorMessage = (message) => {
  if (message instanceof Array) {
    message.forEach((msg) => toast.error(msg));
  } else {
    toast.error(message);
  }
};
export const patchReq = async (endpoint, data) => {
  const url = API_URL + endpoint;

  return await axios
    .patch(url, data, { withCredentials: true })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};
