# Troubleshooting (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.092Z
> 原始來源: waf-docs/troubleshooting.md

> 本文檔包含 5 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.322Z

## 目錄

1. [Bing's Site Scan blocked by a managed rule](#bings-site-scan-blocked-by-a-managed-rule)
2. [Issues sharing to Facebook](#issues-sharing-to-facebook)
3. [SameSite cookie interaction with Cloudflare](#samesite-cookie-interaction-with-cloudflare)
4. [FAQ](#faq)
5. [Troubleshooting](#troubleshooting)

---

## Bing's Site Scan blocked by a managed rule

**來源**: [https://developers.cloudflare.com/waf/troubleshooting/blocked-bing-site-scans/](https://developers.cloudflare.com/waf/troubleshooting/blocked-bing-site-scans/)

Page options # Bing's Site Scan blocked by a managed rule

Microsoft Bing Webmaster Tools ↗ provides a Site Scan feature that crawls your website searching for possible SEO improvements.

Site Scan does not use the same IP address range as Bingbot (Bing's website crawler). Additionally, the Verify Bingbot ↗ tool does not recognize Site Scan's IP addresses as Bingbot. Due to this reason, the WAF managed rule that blocks fake Bingbot requests may trigger for Site Scan requests. This is a known issue of Bing Webmaster Tools.

To allow Site Scan to run on your website, Cloudflare recommends that you temporarily skip the triggered WAF managed rule by creating an exception. After the scan finishes successfully, delete the exception to start blocking fake Bingbot requests again.

The rule you should temporarily skip is the following:

|  | Name | ID |
| --- | --- | --- |
| Managed Ruleset | Cloudflare Managed Ruleset | ...376e9aee |
| Rule | Anomaly:Header:User-Agent - Fake Bing or MSN Bot | ...c12cf9c8 |

The exception, shown as a rule with a Skip action, must appear in the rules list before the rule executing the Cloudflare Managed Ruleset, or else nothing will be skipped.

To check the rule order, use one of the following methods:

- When using the old Cloudflare dashboard, the rules listed in Security > WAF > Managed rules run in order.
- When using the new security dashboard, the rules listed in Security > Security rules run in order.
- When using the Cloudflare API, the rules in the rules object obtained using the Get a zone entry point ruleset operation (for your zone and for the http_request_firewall_managed phase) run in order.

For more information on creating exceptions, refer to Create exceptions.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Issues sharing to Facebook

**來源**: [https://developers.cloudflare.com/waf/troubleshooting/facebook-sharing/](https://developers.cloudflare.com/waf/troubleshooting/facebook-sharing/)

Page options # Issues sharing to Facebook

Cloudflare does not block or challenge requests from Facebook by default. However, a post of a website to Facebook returns an Attention Required error in the following situations:

- You have globally enabled Under Attack mode.
- There is a configuration rule or page rule setting turning on Under Attack mode.
- There is a custom rule with a challenge or block action that includes a Facebook IP address.

A country challenge can block a Facebook IP address. Facebook is known to crawl from both the US and Ireland.

## Resolution

To resolve issues sharing to Facebook, do one of the following:

- Remove the corresponding IP, ASN, or country custom rule that challenges or blocks Facebook IPs.
- Create a skip rule for ASNs AS32934 and AS63293 (use the Skip action and configure the rule to skip Security Level).
- Review existing configuration rules and Page Rules and make sure they are not affecting requests from Facebook IPs.

If you experience issues with Facebook sharing, you can re-scrape pages via the Fetch New Scrape Information option on Facebook's Object Debugger. Facebook provides an API ↗ to help update a large number of resources.

If you continue to have issues, you can contact Cloudflare Support with the URLs of your website that cannot share to Facebook, and confirming that you have re-scraped the URLs.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## SameSite cookie interaction with Cloudflare

**來源**: [https://developers.cloudflare.com/waf/troubleshooting/samesite-cookie-interaction/](https://developers.cloudflare.com/waf/troubleshooting/samesite-cookie-interaction/)

Page options # SameSite cookie interaction with Cloudflare

Google Chrome enforces SameSite cookie behavior ↗ to protect against marketing cookies that track users and Cross-site Request Forgery (CSRF) that allows attackers to steal or manipulate your cookies.

The SameSite cookie attribute has three different modes:

- Strict: Cookies are created by the first party (the visited domain). For example, a first-party cookie is set by Cloudflare when visiting cloudflare.com.
- Lax: Cookies are only sent to the apex domain (such as example.com). For example, if someone (blog.example.net) hotlinked an image (img.example.com/bar.png), the client does not send a cookie to img.example.com since it is neither the first-party nor apex context.
- None: Cookies are sent with all requests.

SameSite settings for Cloudflare cookies include:

| Cloudflare cookie | SameSite setting | HTTPS Only |
| --- | --- | --- |
| __cf_bm | SameSite=None; Secure | Yes |
| cf_clearance | SameSite=None; Secure | Yes |
| __cflb | SameSite=Lax | No |

## SameSite attribute in session affinity cookies

Currently, to configure the SameSite attribute on session affinity cookies you must use the Cloudflare API (for example, the Create Load Balancer operation).

To configure the value of the SameSite cookie attribute, include the samesite and secure JSON attributes in your HTTP request, inside the session_affinity_attributes object.

The available values for these two attributes are the following:

samesite attribute:

- Valid values: Auto (default), Lax, None, Strict.

secure attribute:

- Valid values: Auto (default), Always, Never.

The Auto value for the samesite attribute will have the following behavior:

- If Always Use HTTPS is enabled, session affinity cookies will use the Lax SameSite mode.
- If Always Use HTTPS is disabled, session affinity cookies will use the None SameSite mode.

The Auto value for the secure attribute will have the following behavior:

- If Always Use HTTPS is enabled, session affinity cookies will include Secure in the SameSite attribute.
- If Always Use HTTPS is disabled, session affinity cookies will not include Secure in the SameSite attribute.

If you set samesite to None in your API request, you cannot set secure to Never.

If you require a specific SameSite configuration in your session affinity cookies, Cloudflare recommends that you provide values for samesite and secure different from Auto, instead of relying on the default behavior. This way, the value of the SameSite cookie attribute will not change due to configuration changes (namely Always Use HTTPS).

## Known issues with SameSite and cf_clearance cookies

When a visitor solves a challenge presented due to a custom rule or an IP access rule, a cf_clearance cookie is set in the visitor's browser. The cf_clearance cookie has a default lifetime of 30 minutes, which you can configure via Challenge Passage.

Cloudflare uses SameSite=None in the cf_clearance cookie so that visitor requests from different hostnames are not met with later challenges or errors. When SameSite=None is used, it must be set in conjunction with the Secure flag.

Using the Secure flag requires sending the cookie via an HTTPS connection. If you use HTTP on any part of your website, the cf_clearance cookie defaults to SameSite=Lax, which may cause your website not to function properly.

To resolve the issue, move your website traffic to HTTPS. Cloudflare offers two features for this purpose:

- Automatic HTTPS Rewrites
- Always Use HTTPS

## Related resources

- SameSite cookies explained ↗
- Cloudflare Cookies
- Cloudflare SSL FAQ
- Automatic HTTPS Rewrites
- Always Use HTTPS

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## FAQ

**來源**: [https://developers.cloudflare.com/waf/troubleshooting/faq/](https://developers.cloudflare.com/waf/troubleshooting/faq/)

Page options # FAQ

## General questions

### Why does a security event display a Cloudflare IP address even though other fields match the client details?

This happens when a request goes through a Cloudflare Worker.

In this case, Cloudflare considers the client details, including its IP address, for triggering security settings. However, the IP displayed in Security Events will be a Cloudflare IP address.

### Do I need to escape certain characters in expressions?

Yes, you may have to escape certain characters in expressions. The exact escaping will depend on the string syntax you use:

- If you use the raw string syntax (for example, r#"this is a string"#), you will only need to escape characters that have a special meaning in regular expressions.
- If you use the quoted string syntax (for example, "this is a string"), you need to perform additional escaping, such as escaping special characters " and \ using \" and \\, both in literal strings and in regular expressions.

For more information on string syntaxes and escaping, refer to String values and regular expressions.

### Why is my regular expression pattern not working?

If you are using a regular expression, it is recommended that you test it with a tool such as Regular Expressions 101 ↗ or Rustexp ↗.

### Why are some rules bypassed when I did not create an exception?

If you have SSL/TLS certificates managed by Cloudflare, every time a certificate is issued or renewed, a domain control validation (DCV) must happen. When a certificate is in pending_validation state and there are valid DCV tokens in place, some Cloudflare security features such as custom rules and Managed Rules will be automatically disabled on specific DCV paths (for example, /.well-known/pki-validation/ and /.well-known/acme-challenge/).

### Why is Cloudflare blocking a specific IP address?

Cloudflare may block an IP address due to various reasons:

- Security mitigation actions: Cloudflare protects websites from various online threats, including malicious traffic, DDoS attacks, and common vulnerabilities. If your IP address is associated with suspicious or malicious activity, it might trigger a security check and block requests.
- High security settings: The website owner might have set their Cloudflare security settings to a high level, making the filtering of incoming traffic stricter. In this situation, even legitimate users may get blocked or have to solve challenges.
- Excessive requests: Cloudflare may block an IP address if it detects an unusually high number of requests in a short period, in which case it will rate limiting subsequent requests. This is a protective measure against potential abuse or attacks.
- Traffic from malicious bots: Cloudflare employs bot detection mechanisms to distinguish between legitimate users and automated bots. If traffic from your IP address behaves like traffic from a malicious bot, it could get blocked.
- Blocklisted IPs: Cloudflare might block IP addresses listed on public blocklists due to their association with known malicious activities.

If your IP address is blocked, try the following:

- Check Cloudflare Security Events: Use the Security Events log to check for specific reasons your IP might be getting blocked. Look for details on the type of threat or activity that triggered the block.
- Contact the website owner: If you are a legitimate user and your IP is wrongly blocked, contact the website owner or administrator. They may be able to allowlist your IP or investigate the issue further.
- Verify your own website traffic: Check for abnormal activity. If you manage a website behind Cloudflare, ensure that your site's traffic is legitimate and not triggering security measures inadvertently.
- Check your IP reputation: Verify whether your IP address is listed on public blocklists, such as Project Honey Pot ↗. If so, take steps to address any issues that may have led to the listing.
- Adjust your security settings: If you are a website owner using Cloudflare, consider adjusting security settings to find the right balance between protection and accessibility.

## Bots

### How does the WAF handle traffic from known bots?

#### Caution about potentially blocking bots

When you create a custom rule with a Block, Interactive Challenge, JS Challenge, or Managed Challenge (Recommended) action, you might unintentionally block traffic from known bots. Specifically, this might affect search engine optimization (SEO) and website monitoring when trying to enforce a mitigation action based on URI, path, host, ASN, or country.

Refer to How do I exclude certain requests from being blocked or challenged?.

#### Bots currently detected

Cloudflare Radar ↗ lists a sample of known bots that the WAF currently detects. When traffic comes from these bots and others not listed, the cf.client.bot field is set to true.

To submit a friendly bot to be verified, go to the Verified bots ↗ page in Cloudflare Radar and select Add a bot.

For more information on verified bots, refer to Bots.

Note

There is no functional difference between known and verified bots. However, the known bots field (cf.client.bot) is available for all customers, while the verified bots field (cf.bot_management.verified_bot) is available for Enterprise customers.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Troubleshooting

**來源**: [https://developers.cloudflare.com/waf/troubleshooting/](https://developers.cloudflare.com/waf/troubleshooting/)

Page options # Troubleshooting

- Bing's Site Scan blocked by a managed rule
- Issues sharing to Facebook
- SameSite cookie interaction with Cloudflare
- FAQ

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

