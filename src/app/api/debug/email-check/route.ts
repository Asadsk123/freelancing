import { type NextRequest, NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC ENDPOINT — remove after email is confirmed working
// Calls Resend directly to surface the real error; never exposes the API key.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEnv = process.env.EMAIL_FROM_DEFAULT ?? "";
  const nodeEnv = process.env.NODE_ENV;

  if (!apiKey) {
    return NextResponse.json({
      stage: "CONFIG",
      error: "RESEND_API_KEY missing",
      from: fromEnv ? "set" : "missing",
      node_env: nodeEnv,
    });
  }

  const to = req.nextUrl.searchParams.get("to") ?? "fahadasadmuz@gmail.com";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEnv || "Royal Asad Digital Solution <onboarding@resend.dev>",
        to: [to],
        subject: "Royal Asad Digital Solution — Email Delivery Test",
        text: `Email delivery test\nTimestamp: ${new Date().toISOString()}\nEnvironment: ${nodeEnv}\nRoyal Asad Digital Solution`,
        html: `<p><strong>Royal Asad Digital Solution</strong></p><p>Email delivery test</p><p>Timestamp: ${new Date().toISOString()}</p><p>Environment: ${nodeEnv}</p>`,
      }),
    });

    const body = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(body); } catch { parsed = body; }

    return NextResponse.json({
      stage: res.ok ? "RESEND_ACCEPTED" : "RESEND_REJECTED",
      resend_status: res.status,
      resend_response: parsed,
      from_used: fromEnv || "onboarding@resend.dev",
      to_used: to,
      api_key_present: true,
      api_key_prefix: apiKey.slice(0, 3) + "***",
      node_env: nodeEnv,
    });
  } catch (err) {
    return NextResponse.json({
      stage: "FETCH_ERROR",
      error: String(err),
      node_env: nodeEnv,
    });
  }
}
