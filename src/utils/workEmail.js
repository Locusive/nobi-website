const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "aim.com",
  "inbox.com",
  "fastmail.com",
]);

export function isWorkEmail(email) {
  const domain = String(email || "").trim().toLowerCase().split("@")[1];
  return Boolean(domain) && !FREE_EMAIL_DOMAINS.has(domain);
}
