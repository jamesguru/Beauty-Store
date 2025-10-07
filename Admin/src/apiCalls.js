import { userRequest } from "./requestMethods";

export const loginAPI = async (credentials) => {
  try {
    const response = await userRequest.post("/auth/login/", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};