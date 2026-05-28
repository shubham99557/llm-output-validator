const { z } = require("zod");

// =========================
// RECURSIVE ZOD BUILDER
// =========================

function buildSchema(value) {

  // STRING
  if (value === "string") {
    return z.string();
  }

  // NUMBER
  if (value === "number") {
    return z.number();
  }

  // BOOLEAN
  if (value === "boolean") {
    return z.boolean();
  }

  // ARRAY
  if (Array.isArray(value)) {

    // EMPTY ARRAY
    if (value.length === 0) {
      return z.array(z.any());
    }

    return z.array(
      buildSchema(value[0])
    );
  }

  // OBJECT
  if (
    typeof value === "object" &&
    value !== null
  ) {

    const shape = {};

    for (const key in value) {

      shape[key] = buildSchema(value[key]);

    }

    return z.object(shape);
  }

  // FALLBACK
  return z.any();
}


// =========================
// CREATE ZOD SCHEMA
// =========================

function createZodSchema(schemaObject) {

  return buildSchema(schemaObject);

}


// =========================
// VALIDATE RESPONSE
// =========================

function validateResponse(schemaObject, data) {

  try {

    const schema =
      createZodSchema(schemaObject);

    const validated =
      schema.parse(data);

    return {
      success: true,
      data: validated,
    };

  } catch (error) {

    console.log(
      "❌ ZOD VALIDATION ERROR"
    );

    console.log(error.issues);

    return {
      success: false,
      error: error.issues,
    };
  }
}

module.exports = validateResponse;