# Get Started (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.081Z
> 原始來源: waf-docs/get-started.md

> 本文檔包含 1 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.314Z

Page options # Get started

The Cloudflare Web Application Firewall (Cloudflare WAF) checks incoming web and API requests and filters undesired traffic based on sets of rules called rulesets.

This page will guide you through the recommended initial steps for configuring the WAF to get immediate protection against the most common attacks.

Refer to Concepts for more information on WAF concepts, main components, and roles.

Note

This guide focuses on configuring WAF for individual domains, known as zones. The WAF configuration is also available at the account level for Enterprise customers with a paid add-on.

## Before you begin

- Make sure that you have set up a Cloudflare account and added your domain to Cloudflare.
- Users on the Free plan have access to the Cloudflare Free Managed Ruleset, a subset of the Cloudflare Managed Ruleset. The Free Managed Ruleset is deployed by default on Free plans and is not specifically covered in this guide.If you are on a Free plan, you may skip to 5. Review traffic in security dashboards.

## 1. Deploy the Cloudflare Managed Ruleset

The Cloudflare Managed Ruleset protects against Common Vulnerabilities and Exposures (CVEs) and known attack vectors. This ruleset is designed to identify common attacks using signatures, while generating low false positives. Rule changes are published on a weekly basis in the WAF changelog. Cloudflare may also add rules at any time during emergency releases for high profile zero-day protection.

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF and select the Managed rules tab.
3. Under Managed Rulesets, select Deploy next to the Cloudflare Managed Ruleset.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Web application exploits.
3. Turn on Cloudflare managed ruleset.

Default settings and ruleset customization

By default, the Cloudflare Managed Ruleset enables only a subset of rules and it is designed to strike a balance between protection and false positives. You can review and enable additional rules based on your application technology stack.

In particular situations, enabling the managed ruleset can cause some false positives. False positives are legitimate requests inadvertently mitigated by the WAF. For information on addressing false positives, refer to Troubleshoot managed rules.

If you are testing the WAF against pentesting tools, it is recommended that you enable all rules by using the following ruleset configuration:

- Ruleset action: Block
- Ruleset status: Enabled (enables all rules in the ruleset)

For more information on configuring the Cloudflare Managed Ruleset in the dashboard, refer to Configure field values for all the rules.

## 2. Create custom rule based on WAF attack score

Note

WAF attack score is only available to Business customers (limited access to a single field) and Enterprise customers (full access).

WAF attack score is a machine-learning layer that complements Cloudflare's managed rulesets, providing additional protection against SQL injection ↗ (SQLi), cross-site scripting ↗ (XSS), and many remote code execution ↗ (RCE) attacks. It helps identify rule bypasses and potentially new, undiscovered attacks.

If you are an Enterprise customer, do the following:

1. Reach out to your account team to get access to WAF attack score.
2. Create a custom rule using the Attack Score field:


If incoming requests match:















FieldOperatorValueWAF Attack Scoreless than20


Choose action: Block
3. If incoming requests match:















FieldOperatorValueWAF Attack Scoreless than20
4. Choose action: Block

If you are on a Business plan, create a custom rule as mentioned above but use the WAF Attack Score Class field instead. For example, you could use the following rule expression: WAF Attack Score Class equals Attack.

## 3. Create custom rule based on bot score

Note

Bot score is only available to Enterprise customers with Bot Management. Customers on Pro and Business plans may enable Super Bot Fight mode instead.

Customers with access to Bot Management can block automated traffic (for example, from bots scraping online content ↗) using a custom rule with bot score, preventing this traffic from hitting your application.

Create a custom rule using the Bot Score and Verified Bot fields:

- If incoming requests match:























FieldOperatorValueLogicBot Scoreless than20AndVerified BotequalsOff
- Choose action: Managed Challenge

For a more comprehensive example of a baseline protection against malicious bots, refer to Challenge bad bots.

For more information about the bot-related fields you can use in expressions, refer to Bot Management variables.

Once you have deployed the Cloudflare Managed Ruleset and rules based on attack score and bot score you will have achieved substantial protection, limiting the chance of false positives.

## 4. Optional - Deploy the Cloudflare OWASP Core Ruleset

After configuring the Cloudflare Managed Ruleset and attack score, you can also deploy the Cloudflare OWASP Core Ruleset. This managed ruleset is Cloudflare's implementation of the OWASP ModSecurity Core Rule Set. Its attack coverage significantly overlaps with Cloudflare Managed Ruleset by detecting common attack vectors such as SQLi and XSS.

Warning

The Cloudflare OWASP Core Ruleset is prone to false positives and offers only marginal benefits when added on top of Cloudflare Managed Ruleset and WAF attack score. If you decide to deploy this managed ruleset, you will need to monitor and adjust its settings based on your traffic to prevent false positives.

- Old dashboard
- New dashboard

1. Go to your domain > Security > WAF and select the Managed rules tab.
2. Under Managed Rulesets, select Deploy next to the Cloudflare OWASP Core Ruleset.
This will deploy the ruleset with the default configuration: paranoia level = PL1 and score threshold = Medium - 40 and higher.

1. Go to your domain > Security > Settings and filter by Web application exploits.
2. Turn on OWASP Core.
This will deploy the Cloudflare OWASP Core Ruleset with the default configuration: paranoia level = PL1 and score threshold = Medium - 40 and higher.

Ruleset configuration

Unlike the signature-based Cloudflare Managed Ruleset, the Cloudflare OWASP Core Ruleset is score-based. You select a certain paranoia level (levels vary from PL1 to PL4, where PL1 is the lowest level), which enables an increasing larger group of rules. You also select a score threshold, which decides when to perform the configured action. Low paranoia with a high score threshold usually leads to fewer false positives. For an example of how the OWASP Core Ruleset is evaluated, refer to OWASP evaluation example.

Follow one of these strategies to configure the ruleset according to your needs:

- Start from a strict configuration (paranoia level = PL4, score threshold = Low - 60 and higher). Reduce the score threshold and paranoia level until you achieve a good false positives/true positives rate for your incoming traffic.
- Alternatively, start from a more permissive configuration (paranoia level = PL1, score threshold = High - 25 and higher) and increase both parameters to adjust your protection, trying to keep a low number of false positives.

For more information on configuring the Cloudflare OWASP Core Ruleset in the dashboard, refer to Configure field values for all the rules.

## 5. Review traffic in security dashboards

Note

Users on the Free plan only have access to Security Events.

After setting up your WAF configuration, review how incoming traffic is being affected by your current settings using the following dashboards:

- Use Security Analytics to explore all traffic, including traffic not affected by WAF mitigation measures. All data provided by traffic detections is available in this dashboard.
- Use Security Events to get more information about requests that are being mitigated by Cloudflare security products.

Enterprise customers can also obtain data about HTTP requests and security events using Cloudflare Logs.

## 6. Optional - Next steps

After configuring the WAF based on the information in the previous sections, you should have a strong base protection against possible threats to your applications.

You can explore the following recommendations to get additional protection for specific use cases.

### Allowlist certain IP addresses

Create a custom rule to allow traffic from IP addresses in allowlist only.

### Block specific countries

Create a custom rule to block traffic from specific countries.

### Define rate limits

Create a rate limiting rule to apply rate limiting on a login endpoint.

### Prevent credential stuffing attacks

Use leaked credentials detection to prevent credential stuffing attacks on your applications.

### Prevent users from uploading malware into your applications

Note

Available to Enterprise customers with a paid add-on.

Use WAF content scanning to scan content being uploaded to your application, searching for malicious content.

### Get additional security for your APIs

Note

Available to Enterprise customers.

Cloudflare protects your APIs from new and known application attacks and exploits such as SQL injection attacks. API-specific security products extend those protections to the unique risks in APIs such as API discovery and authentication management.

For more information on Cloudflare's API security features, refer to Cloudflare API Shield.

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

