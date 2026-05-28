import api from "./axios";

// Get failure logs
export const getFailures = async () => {
  const res = await api.get("/failures");
  return res.data;
};