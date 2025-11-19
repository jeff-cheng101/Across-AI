# Glossary (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.082Z
> 原始來源: waf-docs/glossary.md

> 本文檔包含 1 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.323Z

Page options # Glossary

Review the definitions for terms used across Cloudflare's WAF documentation.

| Term | Definition |
| --- | --- |
| allowlist | An allowlist is a list of items (usually websites, IP addresses, email addresses, etc.) that are permitted to access a system. |
| attack score | A number from 1 (likely malicious) to 99 (likely clean) classifying how likely an incoming request is malicious or not. Allows you to detect new attack techniques before they are publicly known. |
| blocklist | A blocklist is a list of items (usually websites, IP addresses, email addresses, etc.) that are prevented from accessing a system. |
| content object | A content object is any binary part of a request body (as detected by Cloudflare systems) that does not match any of the following content types: text/html, text/x-shellscript, application/json, text/csv, or text/xml. |
| credential stuffing | Credential stuffing is the automated injection of stolen username and password pairs (known as "credentials") into website login forms, trying to gain access to user accounts. |
| firewall | A firewall is a security system that monitors and controls network traffic based on a set of security rules. |
| leaked credentials | Leaked credentials refers to sensitive authentication information disclosed in some way (for example, due to misconfigurations, data breaches, or simple human error), allowing other parties to gain access to digital resources.
Credentials may include usernames, passwords, API keys, authentication tokens, or private keys. |
| LLM | A machine learning model that can comprehend and generate human language text. It works by analyzing massive data sets of language. |
| mitigated request | A request to which Cloudflare applied a terminating action such as block or challenge. |
| paranoia level | Classifies rules of the OWASP managed ruleset according to their aggressiveness. |
| prompt injection | The process of overwriting the system prompt for a large language model (LLM), which instructs the LLM on how to respond to user input. |
| rate limiting | Rate limiting is a technique used in computer systems to control the rate at which requests are processed. It can be used as a security measure to prevent attacks, or to limit resource usage in your origin servers. |
| SIEM | A Security Information and Event Management (SIEM) solution collects, analyzes, and correlates data to help manage security incidents, detect anomalies, and meet compliance requirements. |
| threat score | The threat score was a score from 0 (zero risk) to 100 (high risk) classifying the IP reputation of a visitor. Currently, the threat score is always 0 (zero). |

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

