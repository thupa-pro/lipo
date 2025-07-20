import { NextRequest, NextResponse } from "next/server";
import { openApiSpec } from "@/lib/api/openapi-spec";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'json') {
    return NextResponse.json(openApiSpec, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Return Swagger UI HTML
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loconomy API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }

    *, *:before, *:after {
      box-sizing: inherit;
    }

    body {
      margin:0;
      background: #fafafa;
    }

    .swagger-ui .topbar {
      background-color: #3b82f6;
    }

    .swagger-ui .topbar .download-url-wrapper {
      display: none;
    }

    .swagger-ui .info {
      margin: 50px 0;
    }

    .swagger-ui .info .title {
      font-size: 36px;
      color: #3b82f6;
    }

    .custom-header {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
    }

    .custom-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }

    .custom-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
  </style>
</head>

<body>
  <div class="custom-header">
    <h1>🤖 Loconomy API</h1>
    <p>AI-First Local Economy Platform - Comprehensive API Documentation</p>
  </div>
  
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs?format=json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: true,
        filter: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        onComplete: function() {
          console.log('Loconomy API Documentation loaded');
        },
        requestInterceptor: function(request) {
          // Add any default headers or modify requests here
          return request;
        },
        responseInterceptor: function(response) {
          // Handle responses here
          return response;
        }
      });

      window.ui = ui;
    };
  </script>
</body>
</html>`;

  return new NextResponse(swaggerHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}