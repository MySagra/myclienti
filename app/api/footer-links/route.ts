import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callback") || "";

  const host = request.headers.get("host") || "";
  const isMysagraDomain = host.endsWith("mysagra.com");

  const cookiePolicyUrl =
    process.env.POLICY_COOKIE_URL ||
    (isMysagraDomain ? "https://mysagra.com/it/cookie-policy" : null);

  const privacyPolicyUrl =
    process.env.POLICY_PRIVACY_URL ||
    (isMysagraDomain ? "https://mysagra.com/it/privacy-policy" : null);

  if (!cookiePolicyUrl || !privacyPolicyUrl) {
    return NextResponse.json({ links: [] });
  }

  const links = [
    {
      label: "Cookie Policy",
      url: `${cookiePolicyUrl}${callbackUrl ? `?callback=${callbackUrl}` : ""}`,
    },
    {
      label: "Privacy Policy",
      url: `${privacyPolicyUrl}${callbackUrl ? `?callback=${callbackUrl}` : ""}`,
    },
  ];

  return NextResponse.json({ links });
}
