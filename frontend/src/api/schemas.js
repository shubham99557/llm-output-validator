import api from "./axios";

// =========================
// CREATE SCHEMA
// =========================

export const createSchema = async (data) => {

  const res = await api.post(
    "/schemas",
    data
  );

  return res.data;
};

// =========================
// GET ALL SCHEMAS
// =========================

export const getSchemas = async () => {

  const res = await api.get(
    "/schemas"
  );

  return res.data;
};