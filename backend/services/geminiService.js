let retryCount = 0;

async function generateResponse(prompt) {

    console.log("📨 Prompt Received");

    // RESET LOOP
    if (retryCount >= 3) {
        retryCount = 0;
    }

    // =========================
    // ATTEMPT 1 -> INVALID
    // =========================
    if (retryCount === 0) {

        retryCount++;

        console.log("❌ Attempt 1 -> INVALID");

        return `
        {
            "invalid": true
        }
        `;
    }

    // =========================
    // ATTEMPT 2 -> STILL INVALID
    // =========================
    if (retryCount === 1) {

        retryCount++;

        console.log("❌ Attempt 2 -> STILL INVALID");

        return `
        {
            "wrong": "format"
        }
        `;
    }

    retryCount++;

    console.log("✅ Attempt 3 -> VALID");

    // =========================
    // DEVELOPER PROFILE
    // =========================
    if (prompt.includes("developer")) {

        return `
        {
            "name": "John",
            "age": 25,
            "skills": ["React", "Node.js"]
        }
        `;
    }

    // =========================
    // PRODUCT SCHEMA
    // =========================
    if (prompt.includes("ecommerce")) {

        return `
        {
            "title": "iPhone 15",
            "price": 79999,
            "inStock": true
        }
        `;
    }

    // =========================
    // BLOG SCHEMA
    // =========================
    if (prompt.includes("blog")) {

        return `
        {
            "title": "AI Future",
            "author": "Shubham",
            "views": 1200
        }
        `;
    }

    // =========================
    // DEFAULT FALLBACK
    // =========================
    return `
    {
        "message": "Default response"
    }
    `;
}

module.exports = generateResponse;