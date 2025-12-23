// // // export default {
// // //   async fetch(request, env, ctx) {
// // //     console.log("Incoming request:", request.method, request.url);

// // //     // Optional: log body only for methods that usually have one
// // //     if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
// // //       try {
// // //         const contentType = request.headers.get("content-type") || "";
// // //         if (contentType.includes("application/json")) {
// // //           const data = await request.json();
// // //           console.log("Payload:", data);
// // //         } else {
// // //           console.warn("Non-JSON body. Content-Type:", contentType);
// // //         }

// // //       } catch (err) {
// // //         console.error("Failed to read body:", err);
// // //       }
// // //     }

// // //     return new Response("Worker is live ✅", {
// // //       headers: { "content-type": "text/plain" },
// // //     });
// // //   },
// // // };


// src/index.js
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    // Basic CORS (adjust domain in step 6)
    const allowedOrigins = new Set([ "http://localhost:5173", "https://valsco.github.io", "https://athleticmindstutoring.com",  "https://www.athleticmindstutoring.com"]);
    const allowed = allowedOrigins.has(origin);

    // Handle preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowed ? origin : ""),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders(allowed ? origin : ""),
      });
    }

    // Optional: hard block unknown origins
    if (!allowed) {
      return json({ error: "Forbidden origin" }, 403, origin, allowed);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin, allowed);
    }

    // Validate required fields
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const message = (data.message || "").trim();
    const sport = (data.sport || "").trim();
    const grade = (data.grade || "").trim();
    const subjects = (data.subjects || "").trim();

    if (!email || !message) {
      return json({ error: "Missing required fields" }, 400, origin, allowed);
    }

    // Send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Athletic Minds <noreply@athleticmindstutoring.com>",
        to: ["info@athleticmindstutoring.com"],
        reply_to: email,
        subject: "New Contact Form Submission",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Sport:</strong> ${escapeHtml(sport)}</p>
          <p><strong>Grade:</strong> ${escapeHtml(grade)}</p>
          <p><strong>Subjects:</strong> ${escapeHtml(subjects)}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;">${escapeHtml(message)}</pre>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      return json(
        { error: "Email failed", details: errText.slice(0, 300) },
        500,
        origin,
        allowed
      );
    }

    return json({ success: true }, 200, origin, allowed);
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(obj, status, origin, allowed) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(allowed ? origin : ""),
    },
  });
}

// Prevent HTML injection in email content
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// export default {
//   async fetch(request, env) {
//     const origin = request.headers.get("Origin") || "";

//     const allowedOrigins = new Set([
//       "http://localhost:5173",
//       "https://valsco.github.io",
//       "https://athleticmindstutoring.com",
//       "https://www.athleticmindstutoring.com"
//     ]);

//     const isAllowed = allowedOrigins.has(origin);

//     // ✅ Preflight first
//     if (request.method === "OPTIONS") {
//       return new Response(null, {
//         status: 204,
//         headers: corsHeaders(isAllowed ? origin : ""),
//       });
//     }

//     // ✅ Block other methods after preflight is handled
//     if (request.method !== "POST") {
//       return new Response("Method Not Allowed", {
//         status: 405,
//         headers: corsHeaders(isAllowed ? origin : ""),
//       });
//     }

//     // ✅ If origin is not allowed, explicitly reject
//     if (!isAllowed) {
//       return new Response("Forbidden", {
//         status: 403,
//         headers: corsHeaders(""),
//       });
//     }


//     let data;
//     try {
//       data = await request.json();
//     } catch {
//       return json({ error: "Invalid JSON" }, 400, origin, allowed);
//     }

//     // Validate required fields
//     const name = (data.name || "").trim();
//     const email = (data.email || "").trim();
//     const message = (data.message || "").trim();
//     const sport = (data.sport || "").trim();
//     const grade = (data.grade || "").trim();
//     const subjects = (data.subjects || "").trim();

//     if (!email || !message) {
//       return json({ error: "Missing required fields" }, 400, origin, allowed);
//     }

//     // Send email via Resend
//     const resendRes = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${env.RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "Athletic Minds <noreply@athleticmindstutoring.com>",
//         to: ["info@athleticmindstutoring.com"],
//         reply_to: email,
//         subject: "New Contact Form Submission",
//         html: `
//           <h2>New Contact Form Submission</h2>
//           <p><strong>Name:</strong> ${escapeHtml(name)}</p>
//           <p><strong>Email:</strong> ${escapeHtml(email)}</p>
//           <p><strong>Sport:</strong> ${escapeHtml(sport)}</p>
//           <p><strong>Grade:</strong> ${escapeHtml(grade)}</p>
//           <p><strong>Subjects:</strong> ${escapeHtml(subjects)}</p>
//           <p><strong>Message:</strong></p>
//           <pre style="white-space:pre-wrap;">${escapeHtml(message)}</pre>
//         `,
//       }),
//     });

//     if (!resendRes.ok) {
//       const errText = await resendRes.text().catch(() => "");
//       return json(
//         { error: "Email failed", details: errText.slice(0, 300) },
//         500,
//         origin,
//         allowed
//       );
//     }

//     return json({ success: true }, 200, origin, allowed);
//   },
// };

// function json(obj, status, origin, allowed) {
//   return new Response(JSON.stringify(obj), {
//     status,
//     headers: {
//       "Content-Type": "application/json",
//       ...corsHeaders(allowed ? origin : ""),
//     },
//   });
// };

// // Prevent HTML injection in email content
// function escapeHtml(str) {
//   return String(str)
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#039;");
// };

// function corsHeaders(origin) {
//   return {
//     "Access-Control-Allow-Origin": origin,
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//     "Access-Control-Max-Age": "86400",
//     "Vary": "Origin",
//   };
// }
