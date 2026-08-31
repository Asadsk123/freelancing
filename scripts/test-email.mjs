// Quick email test — run once then delete
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) { console.error("RESEND_API_KEY not set"); process.exit(1); }

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "onboarding@resend.dev",
    to: ["fahadasadmuz@gmail.com"],
    reply_to: "fahadasadmuz@gmail.com",
    subject: "Royal Asad — Email Test ✅",
    html: "<h2>Email kaam kar raha hai!</h2><p>Royal Asad website ka email setup complete ho gaya.</p>",
    text: "Email kaam kar raha hai! Royal Asad website ka email setup complete ho gaya.",
  }),
});

const data = await res.json();
if (res.ok) console.log("✅ Email bhej diya! ID:", data.id);
else console.error("❌ Error:", data);
