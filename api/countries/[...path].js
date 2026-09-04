export default async function handler(request, response) {
  const path = Array.isArray(request.query.path)
    ? request.query.path.join("/")
    : request.query.path || "";
  const searchParams = new URLSearchParams(request.query);
  searchParams.delete("path");
  const query = searchParams.toString();
  const upstreamUrl = `https://api.restcountries.com/countries/v5/${path}${query ? `?${query}` : ""}`;

  if (!process.env.REST_COUNTRIES_API_KEY) {
    return response.status(500).json({
      errors: [{ message: "REST_COUNTRIES_API_KEY is not configured on Vercel." }],
    });
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
    },
  });
  const body = await upstreamResponse.text();

  return response
    .status(upstreamResponse.status)
    .setHeader("Content-Type", "application/json")
    .send(body);
}
