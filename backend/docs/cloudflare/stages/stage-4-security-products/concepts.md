# Concepts (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.078Z
> 原始來源: waf-docs/concepts.md

> 本文檔包含 1 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.315Z

Page options # Concepts

The Cloudflare Web Application Firewall (Cloudflare WAF) checks incoming web and API requests and filters undesired traffic based on sets of rules called rulesets. The matching engine that powers the WAF rules supports the wirefilter syntax using the Rules language.

What is a Web Application Firewall?

A Web Application Firewall or WAF creates a shield between a web app and the Internet. This shield can help mitigate many common attacks. For a more thorough definition, refer to Web Application Firewall explained ↗ in the Learning Center.

## Rules and rulesets

A rule defines a filter and an action to perform on the incoming requests that match the filter.

A ruleset is an ordered set of rules that you can apply to traffic on the Cloudflare global network.

## Main components

The Cloudflare WAF includes:

- Managed Rules (for example, the Cloudflare Managed Ruleset), which are signature-based rules created by Cloudflare that provide immediate protection against known attacks.
- Traffic detections (for example, bot score and attack score) that enrich requests with metadata.
- User-defined rules for your specific needs, including custom rules and rate limiting rules.

## Detection versus mitigation

The two main roles of the Cloudflare WAF are the following:

- Detection: Run incoming requests through one or more traffic detections to find malicious or potentially malicious activity. The scores from enabled detections are available in the Security Analytics dashboard, where you can analyze your security posture and determine the most appropriate mitigation rules.
- Mitigation: Blocks, challenges, or throttles requests through different mitigation features such as custom rules, Managed Rules, and rate limiting rules. Rules that mitigate traffic can include scores from traffic scans in their expressions to better address possibly malicious requests.

Warning

Enabling traffic detections will not apply any mitigation measures to incoming traffic; detections only provide signals that you can use to define your attack mitigation strategy.

### Available traffic detections

The WAF currently provides the following detections for finding security threats in incoming requests:

- Attack score: Checks for known attack variations and malicious payloads. Scores traffic on a scale from 1 (likely to be malicious) to 99 (unlikely to be malicious).
- Leaked credentials: Scans incoming requests for credentials (usernames and passwords) previously leaked from data breaches.
- Malicious uploads: Scans content objects, such as uploaded files, for malicious signatures like malware.
- Firewall for AI: Helps protect your services powered by large language models (LLMs) against abuse.
- Bot score: Scores traffic on a scale from 1 (likely to be a bot) to 99 (likely to be human).

To enable traffic detections in the Cloudflare dashboard, go to your domain > Security > Settings.

Note

Currently, you cannot manage the bot score and attack score detections from Security > Settings. Refer to the documentation of each feature for availability details.

## Rule execution order

Cloudflare evaluates different types of rules when processing incoming requests. The rule execution order is the following:

1. IP Access Rules
2. Firewall rules (deprecated)
3. Custom rulesets
4. Custom rules
5. Rate limiting rules
6. Managed Rules
7. Cloudflare Rate Limiting (previous version, deprecated)

Rules are evaluated in order. If there is a match for a rule with a terminating action, the rule evaluation will stop and the action will be executed immediately. Rules with a non-terminating action (such as Log) will not prevent subsequent rules from being evaluated and executed. For more information on how rules are evaluated, refer to Rule evaluation in the Ruleset Engine documentation.

For more information on the phases where each WAF feature will execute, refer to WAF phases.

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

