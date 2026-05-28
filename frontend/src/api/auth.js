import api from "./axios";


// LOGIN
export const loginUser = async (data) => {

  const res = await api.post(
    "/auth/login",
    data
  );

  return res;
};


// REGISTER
export const registerUser = async (data) => {

  const res = await api.post(
    "/auth/register",
    data
  );

  return res;
};