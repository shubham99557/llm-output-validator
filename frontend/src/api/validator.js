import api from "./axios";

export const runValidation = async (payload) => {

  try {

    const res = await api.post(
      "/call",
      payload
    );

    // RETURN DIRECT BACKEND DATA
    return res.data;

  } catch (error) {

    return {
      success: false,

      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Validation failed",

      validationErrors:
        error?.response?.data?.validationErrors ||

        null,

      rawResponse:
        error?.response?.data?.rawResponse ||

        null,
    };
  }
};