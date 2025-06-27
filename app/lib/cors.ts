/**
 * CORS utility for React Router v7 API routes
 */

export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  maxAge?: number;
  allowCredentials?: boolean;
}

// Default CORS configuration
// Add .env file for additional allowed origins.
// e.g. ALLOWED_ORIGINS=https://example.com,https://example.org
const DEFAULT_CORS_CONFIG: CORSConfig = {
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173", // Vite dev server
    "http://localhost:4173", // Vite preview
    ...(process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || []),
  ],
  allowedMethods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400, // 24 hours
  allowCredentials: true,
};

/**
 * Check if an origin is allowed based on the CORS configuration
 */
export function isOriginAllowed(origin: string | null, config = DEFAULT_CORS_CONFIG): boolean {
  if (!origin) {
    // Allow requests with no origin (same-origin, mobile apps, etc.)
    return true;
  }

  // In development, be more permissive
  if (process.env.NODE_ENV === "development") {
    // Allow localhost with any port
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return true;
    }
  }

  return config.allowedOrigins.includes(origin);
}

/**
 * Create CORS headers for a response
 */
export function createCORSHeaders(
  origin: string | null,
  config = DEFAULT_CORS_CONFIG,
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Set allowed origin
  if (origin && isOriginAllowed(origin, config)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (!origin) {
    // For same-origin requests
    headers["Access-Control-Allow-Origin"] = "*";
  }

  // Set other CORS headers
  headers["Access-Control-Allow-Methods"] = config.allowedMethods.join(", ");
  headers["Access-Control-Allow-Headers"] = config.allowedHeaders.join(", ");

  if (config.maxAge !== undefined) {
    headers["Access-Control-Max-Age"] = config.maxAge.toString();
  }

  if (config.allowCredentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

/**
 * Handle CORS preflight requests and origin validation
 */
export function handleCORS(request: Request, config = DEFAULT_CORS_CONFIG): Response | null {
  const origin = request.headers.get("origin");

  // Check if origin is allowed
  if (!isOriginAllowed(origin, config)) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return new Response("Unauthorized origin", {
      status: 403,
      statusText: "Forbidden - Invalid Origin",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: createCORSHeaders(origin, config),
    });
  }

  return null; // Continue with normal processing
}

/**
 * Add CORS headers to an existing response
 */
export function addCORSHeaders(
  response: Response,
  origin?: string | null,
  config = DEFAULT_CORS_CONFIG,
): Response {
  // If origin not provided, get it from the request context if available
  const requestOrigin = origin !== undefined ? origin : null;

  const corsHeaders = createCORSHeaders(requestOrigin, config);
  const headers = new Headers(response.headers);

  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Create a JSON error response with CORS headers
 */
export function createCORSErrorResponse(
  message: string,
  status = 500,
  origin?: string | null,
  config = DEFAULT_CORS_CONFIG,
): Response {
  const response = new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return addCORSHeaders(response, origin, config);
}
