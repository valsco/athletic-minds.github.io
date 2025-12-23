export default {
  async fetch(request, env, ctx) {
    console.log("Incoming request:", request.method, request.url);

    // Optional: log body only for methods that usually have one
    if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
      try {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await request.json();
          console.log("Payload:", data);
        } else {
          console.warn("Non-JSON body. Content-Type:", contentType);
        }

      } catch (err) {
        console.error("Failed to read body:", err);
      }
    }

    return new Response("Worker is live ✅", {
      headers: { "content-type": "text/plain" },
    });
  },
};
