export function GET(request: Request): Response {
  return Response.redirect(new URL('/static/favicon.ico', request.url), 302);
}

