# waf

> 本文檔包含 143 個頁面的內容
> 生成時間: 2025-09-08T04:18:09.238Z
> 產品線: 🛡️ Security Products

## 📑 目錄

1. [Cloudflare Web Application Firewall](#cloudflare-web-application-firewall)
2. [Security Events](#security-events)
3. [IP Access rules](#ip-access-rules)
4. [Custom rules](#custom-rules)
5. [Rate limiting rules](#rate-limiting-rules)
6. [Get started](#get-started)
7. [Concepts](#concepts)
8. [Traffic detections](#traffic-detections)
9. [WAF attack score](#waf-attack-score)
10. [Leaked credentials detection](#leaked-credentials-detection)
11. [Get started](#get-started)
12. [Common API calls](#common-api-calls)
13. [Terraform configuration examples](#terraform-configuration-examples)
14. [Example mitigation rules](#example-mitigation-rules)
15. [Malicious uploads detection](#malicious-uploads-detection)
16. [Get started](#get-started)
17. [Example rules](#example-rules)
18. [Common API calls](#common-api-calls)
19. [Terraform configuration examples](#terraform-configuration-examples)
20. [Firewall for AI (beta)](#firewall-for-ai-beta)
21. [Create a custom rule in the dashboard](#create-a-custom-rule-in-the-dashboard)
22. [Create a custom rule via API](#create-a-custom-rule-via-api)
23. [Configure a rule with the Skip action](#configure-a-rule-with-the-skip-action)
24. [API examples](#api-examples)
25. [Available skip options](#available-skip-options)
26. [Allow traffic from IP addresses in allowlist only](#allow-traffic-from-ip-addresses-in-allowlist-only)
27. [Allow traffic from search engine bots](#allow-traffic-from-search-engine-bots)
28. [Allow traffic from specific countries only](#allow-traffic-from-specific-countries-only)
29. [Block Microsoft Exchange Autodiscover requests](#block-microsoft-exchange-autodiscover-requests)
30. [Block requests by attack score](#block-requests-by-attack-score)
31. [Block traffic by geographical location](#block-traffic-by-geographical-location)
32. [Block traffic from specific countries](#block-traffic-from-specific-countries)
33. [Build a sequence rule within custom rules](#build-a-sequence-rule-within-custom-rules)
34. [Challenge bad bots](#challenge-bad-bots)
35. [Configure token authentication](#configure-token-authentication)
36. [Exempt partners from Hotlink Protection](#exempt-partners-from-hotlink-protection)
37. [Issue challenge for admin user in JWT claim based on attack score](#issue-challenge-for-admin-user-in-jwt-claim-based-on-attack-score)
38. [Require a specific cookie](#require-a-specific-cookie)
39. [Require known IP addresses in site admin area](#require-known-ip-addresses-in-site-admin-area)
40. [Require specific HTTP headers](#require-specific-http-headers)
41. [Require specific HTTP ports](#require-specific-http-ports)
42. [Stop R-U-Dead-Yet? (R.U.D.Y.) attacks](#stop-r-u-dead-yet-rudy-attacks)
43. [Update custom rules for customers or partners](#update-custom-rules-for-customers-or-partners)
44. [Custom rulesets](#custom-rulesets)
45. [Request rate calculation](#request-rate-calculation)
46. [Create a rate limiting rule in the dashboard](#create-a-rate-limiting-rule-in-the-dashboard)
47. [Create a rate limiting rule via API](#create-a-rate-limiting-rule-via-api)
48. [Find appropriate rate limit](#find-appropriate-rate-limit)
49. [Rate limiting parameters](#rate-limiting-parameters)
50. [Rule examples](#rule-examples)
51. [Rate limiting best practices](#rate-limiting-best-practices)
52. [Managed Rules](#managed-rules)
53. [Deploy a WAF managed ruleset in the dashboard](#deploy-a-waf-managed-ruleset-in-the-dashboard)
54. [Deploy a WAF managed ruleset via API](#deploy-a-waf-managed-ruleset-via-api)
55. [Troubleshoot managed rules](#troubleshoot-managed-rules)
56. [Create exceptions](#create-exceptions)
57. [Add an exception in the dashboard](#add-an-exception-in-the-dashboard)
58. [Add an exception via API](#add-an-exception-via-api)
59. [Log the payload of matched rules](#log-the-payload-of-matched-rules)
60. [Configure payload logging in the dashboard](#configure-payload-logging-in-the-dashboard)
61. [View the payload content in the dashboard](#view-the-payload-content-in-the-dashboard)
62. [Configure payload logging via API](#configure-payload-logging-via-api)
63. [Store decrypted matched payloads in logs](#store-decrypted-matched-payloads-in-logs)
64. [Command-line operations](#command-line-operations)
65. [Generate a key pair](#generate-a-key-pair)
66. [Decrypt the payload content](#decrypt-the-payload-content)
67. [Check for exposed credentials](#check-for-exposed-credentials)
68. [How it works](#how-it-works)
69. [Configure via API](#configure-via-api)
70. [Configure with Terraform](#configure-with-terraform)
71. [Test your configuration](#test-your-configuration)
72. [Monitor exposed credentials events](#monitor-exposed-credentials-events)
73. [Upgrade to leaked credentials detection](#upgrade-to-leaked-credentials-detection)
74. [Cloudflare Managed Ruleset](#cloudflare-managed-ruleset)
75. [Cloudflare OWASP Core Ruleset](#cloudflare-owasp-core-ruleset)
76. [Concepts](#concepts)
77. [Evaluation example](#evaluation-example)
78. [Configure in the dashboard](#configure-in-the-dashboard)
79. [Configure via API](#configure-via-api)
80. [Cloudflare Exposed Credentials Check Managed Ruleset](#cloudflare-exposed-credentials-check-managed-ruleset)
81. [Cloudflare Sensitive Data Detection](#cloudflare-sensitive-data-detection)
82. [Lists](#lists)
83. [Custom lists](#custom-lists)
84. [Managed Lists](#managed-lists)
85. [Create in the dashboard](#create-in-the-dashboard)
86. [Use lists in expressions](#use-lists-in-expressions)
87. [Lists API](#lists-api)
88. [JSON object](#json-object)
89. [Endpoints](#endpoints)
90. [Create an IP access rule](#create-an-ip-access-rule)
91. [Parameters](#parameters)
92. [Actions](#actions)
93. [Scrape Shield](#scrape-shield)
94. [Email Address Obfuscation](#email-address-obfuscation)
95. [Hotlink Protection](#hotlink-protection)
96. [User Agent Blocking](#user-agent-blocking)
97. [Zone Lockdown](#zone-lockdown)
98. [Browser Integrity Check](#browser-integrity-check)
99. [Privacy Pass](#privacy-pass)
100. [Replace insecure JS libraries](#replace-insecure-js-libraries)
101. [Security Level](#security-level)
102. [Validation checks](#validation-checks)
103. [Account-level WAF configuration](#account-level-waf-configuration)
104. [Work with custom rulesets in the dashboard](#work-with-custom-rulesets-in-the-dashboard)
105. [Create a custom ruleset using the API](#create-a-custom-ruleset-using-the-api)
106. [Rate limiting rulesets](#rate-limiting-rulesets)
107. [Create a rate limiting ruleset in the dashboard](#create-a-rate-limiting-ruleset-in-the-dashboard)
108. [Create a rate limiting ruleset via API](#create-a-rate-limiting-ruleset-via-api)
109. [Managed rulesets](#managed-rulesets)
110. [Deploy a WAF managed ruleset in the dashboard (account)](#deploy-a-waf-managed-ruleset-in-the-dashboard-account)
111. [Deploy a WAF managed ruleset via API (account)](#deploy-a-waf-managed-ruleset-via-api-account)
112. [Security Analytics](#security-analytics)
113. [Alerts](#alerts)
114. [Phases](#phases)
115. [WAF managed rules (previous version)](#waf-managed-rules-previous-version)
116. [Troubleshooting](#troubleshooting)
117. [WAF managed rules upgrade](#waf-managed-rules-upgrade)
118. [Rate Limiting (previous version)](#rate-limiting-previous-version)
119. [Troubleshooting](#troubleshooting)
120. [Rate limiting (previous version) upgrade](#rate-limiting-previous-version-upgrade)
121. [Firewall rules upgrade](#firewall-rules-upgrade)
122. [Bing's Site Scan blocked by a managed rule](#bings-site-scan-blocked-by-a-managed-rule)
123. [Issues sharing to Facebook](#issues-sharing-to-facebook)
124. [SameSite cookie interaction with Cloudflare](#samesite-cookie-interaction-with-cloudflare)
125. [FAQ](#faq)
126. [Glossary](#glossary)
127. [Changelog](#changelog)
128. [General updates](#general-updates)
129. [Scheduled changes](#scheduled-changes)
130. [Historical (2024)](#historical-2024)
131. [Historical (2023)](#historical-2023)
132. [Historical (2022)](#historical-2022)
133. [Historical (2021)](#historical-2021)
134. [Historical (2020)](#historical-2020)
135. [Historical (2019)](#historical-2019)
136. [Historical (2018)](#historical-2018)
137. [Analytics](#analytics)
138. [Additional tools](#additional-tools)
139. [Common use cases](#common-use-cases)
140. [Rulesets reference](#rulesets-reference)
141. [Reference](#reference)
142. [Legacy features](#legacy-features)
143. [Troubleshooting](#troubleshooting)

---

## Cloudflare Web Application Firewall

**來源**: [https://developers.cloudflare.com/waf/](https://developers.cloudflare.com/waf/)

Page options # Cloudflare Web Application Firewall

Get automatic protection from vulnerabilities and the flexibility to create custom rules.

Available on all plans The Cloudflare Web Application Firewall (Cloudflare WAF) checks incoming web and API requests and filters undesired traffic based on sets of rules called rulesets. The matching engine that powers the WAF rules supports the wirefilter syntax using the Rules language.

Learn how to get started.

## Features

### Custom rules

Create your own custom rules to protect your website and your APIs from
malicious incoming traffic. Use advanced features like WAF attack
score and malicious uploads
detection in your custom rules.

Use Custom rules ### Rate limiting rules

Define rate limits for incoming requests matching an expression, and the
action to take when those rate limits are reached.

Use Rate limiting rules ### Managed rules

Enable the pre-configured managed rulesets to get immediate protection. These
rulesets are regularly updated, offering advanced zero-day
vulnerability protections, and you can adjust their behavior.

Use Managed rules ### Account-level configuration

Enterprise-only paid add-on Create and deploy rulesets to multiple Enterprise zones.

Use Account-level configuration ### Security Events

Review mitigated requests (rule matches) using an intuitive interface. Tailor
your security configurations based on sampled logs.

Explore Security Events ### Security Analytics

Displays information about all incoming HTTP requests, including those not
affected by security measures.

Explore Security Analytics ## Related products

DDoS Protection Cloudflare DDoS protection secures websites, applications, and entire networks
while ensuring the performance of legitimate traffic is not compromised.

Page Shield Page Shield is a comprehensive client-side security solution to ensure the
safety of your website visitors' browser environment.

Bots Cloudflare bot solutions identify and mitigate automated traffic to protect
your domain from bad bots.

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

## Security Events

**來源**: [https://developers.cloudflare.com/waf/analytics/security-events/](https://developers.cloudflare.com/waf/analytics/security-events/)

Page options # Security Events

Security Events allows you to review mitigated requests and helps you tailor your security configurations.

The main elements of the dashboard are the following:

- Events summary: Provides the number of security events on traffic during the selected time period, grouped according to the selected dimension (for example, Action, Host, Country).
- Events by service: Lists the security-related activity per security feature (for example, WAF, API Shield).
- Top events by source: Provides details of the traffic flagged or actioned by a Cloudflare security feature (for example, IP addresses, User Agents, Paths, Countries, Hosts, ASNs).
- Sampled logs: Summarizes security events by date to show the action taken and the applied Cloudflare security product.

Security Events displays information about requests actioned or flagged by Cloudflare security products, including features such as Browser Integrity Check. Each incoming HTTP request might generate one or more security events. The Security Events dashboard only shows these events, not the HTTP requests themselves.

## Availability

Available features vary according to your Cloudflare plan:

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Dashboard features | Sampled logs only | All | All | All |
| Account-level dashboard | No | No | No | Yes |
| Historical time | Up to the last 24 hours | Up to the last 24 hours | Up to the last 72 hours | Up to the last 30 days |
| Export report | No | No | Up to 500 events | Up to 500 events |
| Print report | No | Yes | Yes | Yes |

## Location in the dashboard

To open Security Events for a given zone:

- Old dashboard: Go to Security > Events.
- New security dashboard: Go to Security > Analytics > Events tab.

Additionally, Enterprise customers have access to the account-level dashboard:

Go to Security events ## Adjust displayed data

You can apply multiple filters and exclusions to narrow the scope of Security Events and adjust the report duration. Modifying the duration, filters, or exclusions affects the analytics data displayed on the entire page including Sampled logs and all graphs.

### Add filters

You can adjust the scope of analytics by manually entering filter conditions. Alternatively, select Filter or Exclude to filter by a field value. These buttons appear when you hover the analytics data legend.

To manually add a filter:

1. Select Add filter.
2. Select a field, an operator, and a value. For example, to filter events by IP address, select IP for Action, select equals for the operator, and enter the IP address.
3. Select Apply.

Take the following into account when entering filter values:

- Do not add quotes around values.
- Do not enter the AS prefix when entering ASN numbers. For example, enter 1423 instead of AS1423.
- Wildcards are not supported.

### Adjust report duration

To adjust report duration, select the desired duration from the dropdown. The default value is Previous 24 hours.

The available report duration values depend on your Cloudflare plan. Refer to Availability for details.

## Create security rule from current filters

To create a custom rule based on your current filters and exclusions:

- Old dashboard: Select Create custom rule.
- New security dashboard: Select Create custom security rule.

## Events summary

The Events summary section provides the number of security events on traffic during the selected time period, grouped according to the selected dimension (for example, Action, Host, Country, or ASN).

You can adjust the displayed data according to one of the values by selecting Filter or Exclude when hovering the legend.

## Events by service

The Events by service section lists the activity per Cloudflare security feature (for example, Managed rules or Rate limiting rules).

You can adjust the scope of Security Events to one of the displayed services by selecting Filter or Exclude when hovering the legend or by selecting the corresponding graph bar.

## Top events by source

In Top events by source you can find details of the traffic flagged or actioned by a security feature — for example, IP Addresses, User Agents, Paths, and Countries.

You can adjust the scope of Security Events to one of the listed source values by selecting Filter or Exclude when hovering the value.

Note

A deleted custom rule or rate limiting rule will show as Rule unavailable under Firewall rules or Rate limit rules. To check the changes made within your Cloudflare account, review your Audit logs.

## Sampled logs

Sampled logs summarizes security events by date to show the action taken and the applied Cloudflare security feature.

Security events are shown by individual event rather than by request. For example, if a single request triggers three different security features, the security events will show three individual events in Sampled logs.

Expand each event to check its details, and define filters and exclusions based on the event's field values. Select the Filter or Exclude button when hovering a field to add the field value to the filters or exclusions list of the displayed analytics. To download the event data in JSON format, select Export event JSON.

### Displayed columns

To configure the columns displayed in Sampled logs, select Edit columns. This gives you flexibility depending on the type of analysis that you need to perform.

For example, if you are diagnosing a bot-related issue, you may want to display the User agent and the Country columns. On the other hand, if you are trying to identify a DDoS attack, you may want to display the IP address, ASN, and Path columns.

### Event actions

For details on most actions that appear in Sampled logs, refer to Actions.

Besides the actions you can select when configuring rules in Cloudflare security products, you may also find events with the following associated actions:

- Connection Close
- Force Connection Close

For details on these actions, refer to HTTP DDoS Attack Protection parameters.

The Managed Challenge (Recommended) action that may appear in Sampled logs is available in the following security features and products: WAF custom rules, rate limiting rules, Bot Fight Mode, IP Access rules, User Agent Blocking rules, and firewall rules (deprecated).

### Export event log data

You can export a set of up to 500 raw events from Sampled logs in JSON format. Export event data to combine and analyze Cloudflare data with your own stored in a separate system or database, such as a SIEM system. The data you export will reflect any filters you have applied.

To export the displayed events (up to 500), select Export in Sampled logs.

## Share Security Events filters

When you add a filter and specify a report duration (time window) in Security Events, the Cloudflare dashboard URL changes to reflect the parameters you configured. You can share that URL with other users so that they can analyze the same information that you see.

For example, after adding a filter for Action equals Managed Challenge and setting the report duration to 72 hours, the URL should look like the following:

https://dash.cloudflare.com/{account_id}/example.net/security/events?action=managed_challenge&time-window=4320

## Print or download PDF report

To print or download a snapshot report:

- Old dashboard: Select Print report.
- New security dashboard: Select the three dots > Print report.

Your web browser's printing interface will present you with options for printing or downloading the PDF report.

The generated report will reflect all applied filters.

## Known limitations

Security Events currently has these limitations:

- Security Events may use sampled data to improve performance. If your search uses sampled data, Security Events might not display all events and filters might not return the expected results. To display more events, select a smaller time frame.
- The Cloudflare dashboard may show an inaccurate number of events per page. Data queries are highly optimized, but this means that pagination may not always work because the source data may have been sampled. The GraphQL Analytics API does not have this pagination issue.
- Triggered OWASP rules appear in the Security Events page under Additional logs, but they are not included in exported JSON files.

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

## IP Access rules

**來源**: [https://developers.cloudflare.com/waf/tools/ip-access-rules/](https://developers.cloudflare.com/waf/tools/ip-access-rules/)

Page options # IP Access rules

Use IP Access rules to allowlist, block, and challenge traffic based on the visitor's IP address, country, or Autonomous System Number (ASN).

IP Access rules are commonly used to block or challenge suspected malicious traffic. Another common use of IP Access rules is to allow services that regularly access your site, such as APIs, crawlers, and payment providers.

Warning

- Allowing an IP, ASN, or country will bypass any configured custom rules, rate limiting rules, and firewall rules (deprecated).
- Allowing a country will not bypass WAF Managed Rules or WAF managed rules (previous version).

## Recommendation: Use custom rules instead

Cloudflare recommends that you create custom rules instead of IP Access rules to perform IP-based or geography-based blocking (geoblocking):

- For IP-based blocking, use an IP list in the custom rule expression.
- For geoblocking, use fields such as AS Num, Country, and Continent in the custom rule expression.

## Availability

IP Access rules are available to all customers.

Each Cloudflare account can have a maximum of 50,000 rules. If you are an Enterprise customer and need more rules, contact your account team.

Block by country is only available on the Enterprise plan. Other customers may perform country blocking using WAF custom rules.

## Final remarks

- By design, IP Access rules configured to Allow traffic do not show up in Security Events.
- Requests containing certain attack patterns in the User-Agent field are checked before being processed by the general firewall pipeline. Therefore, such requests are blocked before any allowlist logic takes place. When this occurs, security events downloaded from the API show rule_id as security_level and action as drop.
- Cloudflare supports use of fail2ban to block IPs on your server. However, to prevent fail2ban from inadvertently blocking Cloudflare IPs and causing errors for some visitors, ensure you restore original visitor IP in your origin server logs. For details, refer to Restoring original visitor IPs.

## Related resources

To learn more about protection options provided by Cloudflare to protect your website against malicious traffic and bad actors, refer to Secure your website.

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

## Custom rules

**來源**: [https://developers.cloudflare.com/waf/custom-rules/](https://developers.cloudflare.com/waf/custom-rules/)

Page options # Custom rules

Custom rules allow you to control incoming traffic by filtering requests to a zone. They work as customized web application firewall (WAF) rules that you can use to perform actions like Block or Managed Challenge on incoming requests.

In the new security dashboard, custom rules are one of the available types of security rules. Security rules perform security-related actions on incoming requests that match specified filters.

Like other rules evaluated by Cloudflare's Ruleset Engine, custom rules have the following basic parameters:

- An expression that specifies the criteria you are matching traffic on using the Rules language.
- An action that specifies what to perform when there is a match for the rule.

Custom rules are evaluated in order, and some actions like Block will stop the evaluation of other rules. For more details on actions and their behavior, refer to the actions reference.

To define sets of custom rules that apply to more than one zone, use custom rulesets, which require an Enterprise plan with a paid add-on.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Number of rules | 5 | 20 | 100 | 1,000 |
| Supported actions | All except Log | All except Log | All except Log | All |
| Regex support | No | No | Yes | Yes |
| Custom rulesets | No | No | No | Paid add-on |

## Next steps

To create custom rules using the Cloudflare dashboard, refer to Create custom rules in the dashboard.

You can also create custom rules via API or using Terraform.

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

## Rate limiting rules

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/](https://developers.cloudflare.com/waf/rate-limiting-rules/)

Page options # Rate limiting rules

Rate limiting rules allow you to define rate limits for requests matching an expression, and the action to perform when those rate limits are reached.

In the new security dashboard, rate limiting rules are one of the available types of security rules. Security rules perform security-related actions on incoming requests that match specified filters.

## Rule parameters

Like other rules evaluated by Cloudflare's Ruleset Engine, rate limiting rules have the following basic parameters:

- An expression that specifies the criteria you are matching traffic on using the Rules language.
- An action that specifies what to perform when there is a match for the rule and any additional conditions are met. In the case of rate limiting rules, the action occurs when the rate reaches the specified limit.

Besides these two parameters, rate limiting rules require the following additional parameters:

- Characteristics: The set of parameters that define how Cloudflare tracks the rate for this rule.
- Period: The period of time to consider (in seconds) when evaluating the rate.
- Requests per period: The number of requests over the period of time that will trigger the rate limiting rule.
- Duration (or mitigation timeout): Once the rate is reached, the rate limiting rule blocks further requests for the period of time defined in this field.
- Action behavior: By default, Cloudflare will apply the rule action for the configured duration (or mitigation timeout), regardless of the request rate during this period. Some Enterprise customers can configure the rule to throttle requests over the maximum rate, allowing incoming requests when the rate is lower than the configured limit.

Refer to Rate limiting parameters for more information on mandatory and optional parameters.

Refer to How Cloudflare determines the request rate to learn how Cloudflare uses the parameters above when determining the rate of incoming requests.

## Important remarks

- Rate limiting rules are evaluated in order, and some actions like Block will stop the evaluation of other rules. For more details on actions and their behavior, refer to the actions reference.
- Rate limiting rules are not designed to allow a precise number of requests to reach the origin server. In some situations, there may be a delay (up to a few seconds) between detecting a request and updating internal counters. Due to this delay, excess requests could still reach the origin server before Cloudflare enforces a mitigation action (such as blocking or challenging) in our global network.
- Applying rate limiting rules to verified bots might affect Search Engine Optimization (SEO). For more information, refer to Improve SEO.

## Availability

| Feature | Free | Pro | Business | Enterprise with app security | Enterprise with Advanced Rate Limiting |
| --- | --- | --- | --- | --- | --- |
| Available fieldsin rule expression | Path, Verified Bot | Host, URI, Path, Full URI, Query, Verified Bot | Host, URI, Path, Full URI, Query, Method, Source IP, User Agent, Verified Bot | General request fields, request header fields, Verified Bot, Bot Management fields1 | General request fields, request header fields, Verified Bot, Bot Management fields1, request body fields2 |
| Counting characteristics | IP | IP | IP, IP with NAT support | IP, IP with NAT support | IP, IP with NAT support, Query, Host, Headers, Cookie, ASN, Country, Path, JA3/JA4 Fingerprint1, JSON field value2, Body2, Form input value2, Custom |
| Custom counting expression | No | No | Yes | Yes | Yes |
| Available fieldsin counting expression | N/A | N/A | All rule expression fields, Response code, Response headers | All rule expression fields, Response code, Response headers | All rule expression fields, Response code, Response headers |
| Counting model | Number of requests | Number of requests | Number of requests | Number of requests | Number of requests, complexity score |
| Rate limitingaction behavior | Perform action during mitigation period | Perform action during mitigation period | Perform action during mitigation period | Perform action during mitigation period, Throttle requests above rate with block action | Perform action during mitigation period, Throttle requests above rate with block action |
| Counting periods | 10 s | All supported values up to 1 min3 | All supported values up to 10 min3 | All supported values up to 65,535 s3 | All supported values up to 65,535 s3 |
| Mitigation timeout periods | 10 s | All supported values up to 1 h3 | All supported values up to 1 day3 | All supported values up to 1 day3 4 | All supported values up to 1 day3 4 |
| Number of rules | 1 | 2 | 5 | 5 or more5 | 100 |

Footnotes

1: Only available to Enterprise customers who have purchased Bot Management.

2: Availability depends on your WAF plan.

3: List of supported counting/mitigation period values in seconds:
10, 15, 20, 30, 40, 45, 60 (1 min), 90, 120 (2 min), 180 (3 min), 240 (4 min), 300 (5 min), 480, 600 (10 min), 900, 1200 (20 min), 1800, 2400, 3600 (1 h), 65535, 86400 (1 day).
Not all values are available on all plans.

4: Enterprise customers can specify a custom mitigation timeout period via API.

5: Enterprise customers must have application security on their contract to get access to rate limiting rules. The number of rules depends on the exact contract terms.

## Footnotes

1. Only available to Enterprise customers who have purchased Bot Management. ↩ ↩2 ↩3
2. Availability depends on your WAF plan. ↩ ↩2 ↩3 ↩4
3. Supported period values in seconds: 10, 15, 20, 30, 40, 45, 60 (1 min), 90, 120 (2 min), 180 (3 min), 240 (4 min), 300 (5 min), 480, 600 (10 min), 900, 1200 (20 min), 1800, 2400, 3600 (1 h), 65535, 86400 (1 day). ↩ ↩2 ↩3 ↩4 ↩5 ↩6 ↩7 ↩8
4. Enterprise customers can specify a custom mitigation timeout period via API. ↩ ↩2
5. Enterprise customers must have application security on their contract to get access to rate limiting rules. The number of rules depends on the exact contract terms. ↩

Note

Enterprise customers can preview this product as a non-contract service, which provides full access, free of metered usage fees, limits, and certain other restrictions.

## Next steps

Refer to the following resources:

- Create a rate limiting rule in the dashboard for a zone
- Create a rate limiting rule via API for a zone

For Terraform examples, refer to Rate limiting rules configuration using Terraform.

## Related resources

- Rate limiting rulesets: Some Enterprise customers can create rate limiting rulesets at the account level that they can deploy to multiple Enterprise zones.
- Cloudflare Rate Limiting (previous version, now deprecated): Documentation for the previous version of rate limiting rules (billed based on usage).
- Learning Center: What is rate limiting? ↗

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

## Get started

**來源**: [https://developers.cloudflare.com/waf/get-started/](https://developers.cloudflare.com/waf/get-started/)

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

## Concepts

**來源**: [https://developers.cloudflare.com/waf/concepts/](https://developers.cloudflare.com/waf/concepts/)

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

## Traffic detections

**來源**: [https://developers.cloudflare.com/waf/detections/](https://developers.cloudflare.com/waf/detections/)

Page options # Traffic detections

Traffic detections check incoming requests for malicious or potentially malicious activity. Each enabled detection provides one or more scores — available in the Security Analytics dashboard — that you can use in rule expressions.

Cloudflare currently provides the following detections for finding security threats in incoming requests:

- WAF attack score
- Leaked credentials detection
- Malicious uploads detection
- Firewall for AI (beta)
- Bot score

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Malicious uploads detection | No | No | No | Paid add-on |
| Leaked credentials detection | Yes | Yes | Yes | Yes |
| Leaked credentials fields | Password Leaked | Password Leaked, User and Password Leaked | Password Leaked, User and Password Leaked | All leaked credentials fields |
| Number of custom detection locations | 0 | 0 | 0 | 10 |
| Attack score | No | No | One field only | Yes |
| Firewall for AI (beta) | No | No | No | Yes |

For more information on bot score, refer to the Bots documentation.

## Turn on a detection

To turn on a traffic detection:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, turn on the desired detections.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on the desired detections.

Enabled detections will run for all incoming traffic.

Notes

On Free plans, the leaked credentials detection is enabled by default, and no action is required.

Currently, you cannot manage the bot score and attack score detections from the Settings page. Refer to the documentation of each feature for availability details.

## More resources

For more information on detection versus mitigation, refer to Concepts.

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

## WAF attack score

**來源**: [https://developers.cloudflare.com/waf/detections/attack-score/](https://developers.cloudflare.com/waf/detections/attack-score/)

Page options # WAF attack score

The attack score traffic detection helps identify variations of known attacks and their malicious payloads. This detection complements WAF Managed Rules.

WAF's managed rulesets contain rules that are continuously updated to better detect malicious payloads. They target specific patterns of established attack vectors and have a very low rate of false positives. However, managed rulesets are not optimized for attacks based on variations of the original signature introduced, for example, by fuzzing techniques.

Attack score allows you to identify these attack variations and their malicious payloads. It classifies each request using a machine learning algorithm, assigning an attack score from 1 to 99 based on the likelihood that the request is malicious. Just like Bot Management, you can use this score to identify potentially malicious traffic that is not an exact match to any of the rules in WAF Managed Rules.

To maximize protection, Cloudflare recommends that you use both Managed Rules and attack score.

Note

This feature is available to Enterprise customers. Business plans have access to a single field (WAF Attack Score Class).

## Available scores

The Cloudflare WAF provides the following attack score fields:

| Field | Description | Required plan |
| --- | --- | --- |
| WAF Attack Score  cf.waf.score  Number | A global score from 1–99 that combines the score of each WAF attack vector into a single score. | Enterprise |
| WAF SQLi Attack Score  cf.waf.score.sqli  Number | A score from 1–99 classifying the SQL injection ↗ (SQLi) attack vector. | Enterprise |
| WAF XSS Attack Score  cf.waf.score.xss  Number | A score from 1–99 classifying the cross-site scripting ↗ (XSS) attack vector. | Enterprise |
| WAF RCE Attack Score  cf.waf.score.rce  Number | A score from 1–99 classifying the command injection or remote code execution ↗ (RCE) attack vector. | Enterprise |
| WAF Attack Score Class  cf.waf.score.class  String | The attack score class of the current request, based on the WAF attack score.  Possible values: attack, likely_attack, likely_clean, and clean. | Business or above |

You can use these fields in expressions of custom rules and rate limiting rules. Attack score fields of data type Number vary between 1 and 99 with the following meaning:

- A score of 1 indicates that the request is almost certainly malicious.
- A score of 99 indicates that the request is likely clean.

The special score 100 indicates that the Cloudflare WAF did not score the request.

The global WAF Attack Score is mathematically derived from individual attack scores (for example, from SQLi Attack Score and XSS Attack Score), reflecting their interdependence. However, the global score is not a sum of individual scores. A low global score usually indicates medium to low individual scores, while a high global score suggests higher individual scores.

The WAF Attack Score Class field can have one of the following values, depending on the calculated request attack score:

| Dashboard label | Field value | Description |
| --- | --- | --- |
| Attack | attack | Attack score between 1 and 20. |
| Likely attack | likely_attack | Attack score between 21 and 50. |
| Likely clean | likely_clean | Attack score between 51 and 80. |
| Clean | clean | Attack score between 81 and 99. |

Requests with the special attack score 100 will show a WAF Attack Score Class of Unscored in the Cloudflare dashboard, but you cannot use this class value in rule expressions.

Attack score automatically detects and decodes Base64, JavaScript (Unicode escape sequences), and URL encoded content anywhere in the request: URL, headers, and body.

## Rule recommendations

Cloudflare does not recommend that you block traffic solely based on the WAF Attack Score for all values below 50, since the Likely attack range (scores between 21 and 50) tends to have false positives. If you want to block traffic based on this score, do one of the following:

- Use a more strict WAF Attack Score value in your expression. For example, block traffic with a WAF attack score below 20 or below 15 (you may need to adjust the exact threshold).
- Combine a higher WAF Attack Score threshold with additional filters when blocking incoming traffic. For example, include a check for a specific URI path in your expression or use bot score as part of your criteria.

## Start using WAF attack score

### 1. Create a custom rule

If you are an Enterprise customer, create a custom rule that blocks requests with a WAF Attack Score less than or equal to 20 (recommended initial threshold). For example:

| Field | Operator | Value |
| --- | --- | --- |
| WAF Attack Score | less than or equal to | 20 |

- Equivalent rule expression: cf.waf.score le 20
- Action: Block

Business customers must create a custom rule with the WAF Attack Score Class field instead. For example, use this field to block incoming requests with a score class of Attack:

| Field | Operator | Value |
| --- | --- | --- |
| WAF Attack Score Class | equals | Attack |

- Equivalent rule expression: cf.waf.score.class eq "attack"
- Action: Block

### 2. Monitor domain traffic

Monitor the rule you created, especially in the first few days, to make sure you entered an appropriate threshold (or class) for your traffic. Update the rule if required.

### 3. Update the rule action

If you are an Enterprise customer and you created a rule with Log action, change the rule action to a more severe one, like Managed Challenge or Block.

## Additional remarks

The WAF attack score is different from bot score. WAF attack score identifies variations of attacks that WAF Managed Rules do not catch, while bot score identifies bots.

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

## Leaked credentials detection

**來源**: [https://developers.cloudflare.com/waf/detections/leaked-credentials/](https://developers.cloudflare.com/waf/detections/leaked-credentials/)

Page options # Leaked credentials detection

The leaked credentials traffic detection scans incoming requests for credentials (usernames and passwords) previously leaked from data breaches ↗.

Note

If you are currently using Exposed Credentials Check (a previous implementation) and want to upgrade to leaked credentials detection, refer to our upgrade guide.

## How it works

Once enabled, leaked credentials detection will scan incoming HTTP requests for known authentication patterns from common web apps and any custom detection locations you configure.

If Cloudflare detects authentication credentials in the request, those credentials are checked against a list of known leaked credentials. This list of credentials consists of Cloudflare-collected credentials, in addition to the Have I been Pwned (HIBP) ↗ matched passwords dataset.

Cloudflare will populate the existing leaked credentials fields based on the scan results. You can check these results in the Security Analytics dashboard, and use these fields in rule expressions (custom rules or rate limiting rules) to protect your application against the usage of compromised credentials by your end users, and also against leaked credential attacks. Cloudflare may detect leaked credentials either because an attacker is performing a credential stuffing ↗ attack or because a legitimate end user is reusing a previously leaked password.

In addition, leaked credentials detection provides a managed transform that adds an Exposed-Credential-Check request header with a value indicating which field was leaked. For example, if both username and password were previously leaked, the header value will be 1; if only the password was leaked, the value will be 4.

One common approach used in web applications when detecting the use of stolen credentials is to warn end users about the situation and ask them to update their password. You can do this based on the managed header received at your origin server.

Note

Cloudflare does not store, log, or retain plaintext end-user passwords when performing leaked credential checks. Passwords are hashed, converted into a cryptographic representation, and then compared against a database of leaked credentials.

## Availability

For details on available features per plan, refer to Availability in the traffic detections page.

## Default scan locations

Leaked credentials detection includes rules for identifying credentials in HTTP requests for the following well-known web applications:

- Drupal
- Joomla
- Ghost
- Magento
- Plone
- WordPress
- Microsoft Exchange OWA

Additionally, the scan includes generic rules for other common web authentication patterns.

You can also configure custom detection locations to address the specific authentication mechanism used in your web applications. A custom detection location tells the Cloudflare WAF where to find usernames and passwords in HTTP requests of your web application.

## Custom detection locations

Note

Only available for Enterprise customers.

Sometimes, you may wish to specify where to find credentials in HTTP requests for the specific case of your web applications.

For example, if the JSON body of an HTTP authenticating a user looked like the following in your web application:

```
{ "user": "<username>", "secret": "<password>" }
```

You could configure a custom detection location with the following settings:

- Custom location for username:
lookup_json_string(http.request.body.raw, "user")
- Custom location for password:
lookup_json_string(http.request.body.raw, "secret")

When specifying a custom detection location, only the location of the username field is required.

The following table includes example detection locations for different request types:

| Request type | Username location / Password location |
| --- | --- |
| JSON body | lookup_json_string(http.request.body.raw, "user")lookup_json_string(http.request.body.raw, "secret") |
| URL-encoded form | url_decode(http.request.body.form["user"][0])url_decode(http.request.body.form["secret"][0]) |
| Multipart form | url_decode(http.request.body.multipart["user"][0])url_decode(http.request.body.multipart["secret"][0]) |

Expressions used to specify custom detection locations can include the following fields and functions:

- Fields:

http.request.body.form
http.request.body.multipart
http.request.body.raw
http.request.headers
http.request.uri.query
- http.request.body.form
- http.request.body.multipart
- http.request.body.raw
- http.request.headers
- http.request.uri.query
- Functions:

lookup_json_string()
url_decode()
- lookup_json_string()
- url_decode()

For instructions on configuring a custom detection location, refer to Get started.

## Leaked credentials fields

| Field | Description |
| --- | --- |
| Password Leaked  cf.waf.credential_check.password_leaked  Boolean | Indicates whether the password detected in the request was previously leaked.  Available on all plans. |
| User and Password Leaked  cf.waf.credential_check.username_and_password_leaked  Boolean | Indicates whether the username-password pair detected in the request were previously leaked.  Requires a Pro plan or above. |
| Username Leaked  cf.waf.credential_check.username_leaked  Boolean | Indicates whether the username detected in the request was previously leaked.  Requires an Enterprise plan. |
| Similar Password Leaked  cf.waf.credential_check.username_password_similar  Boolean | Indicates whether a similar version of the username and password credentials detected in the request were previously leaked.  Requires an Enterprise plan. |
| Authentication detected  cf.waf.auth_detected  Boolean | Indicates whether Cloudflare detected authentication credentials in the request.  Requires an Enterprise plan. |

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

## Get started

**來源**: [https://developers.cloudflare.com/waf/detections/leaked-credentials/get-started/](https://developers.cloudflare.com/waf/detections/leaked-credentials/get-started/)

Page options # Get started

## 1. Turn on the detection

On Free plans, the leaked credentials detection is enabled by default, and no action is required. On paid plans, you can turn on the detection in the Cloudflare dashboard, via API, or using Terraform.

- Old dashboard
- New dashboard
- API
- Terraform

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, turn on Leaked credentials.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on Leaked credential detection.

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Set Leaked Credential Checks Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "enabled": true  }'
```

Use the cloudflare_leaked_credential_check resource to enable leaked credentials detection for a zone. For example:

```
resource "cloudflare_leaked_credential_check" "zone_lcc_example" {  zone_id = "<ZONE_ID>"  enabled = true}
```

Note

To achieve optimal latency performance, Cloudflare recommends that you turn off Exposed Credentials Checks (a previous implementation) after turning on leaked credentials detection and setting up your mitigation strategy as described in the next steps.

## 2. Validate the leaked credentials detection behavior

Use Security Analytics and HTTP logs to validate that Cloudflare is correctly detecting leaked credentials in incoming requests.

Refer to Test your configuration for more information on the test credentials you can use to validate your configuration.

Alternatively, create a custom rule like the one described in the next step using a Log action (only available to Enterprise customers). This rule will generate security events that will allow you to validate your configuration.

## 3. Mitigate requests with leaked credentials

If you are on a Free plan, deploy the suggested rate limiting rule template available in:

- Old dashboard: WAF > Rate limiting rules
- New security dashboard: Security > Security rules

When you deploy a rule using this template, you get instant protection against IPs attempting to access your application with a leaked password more than five times per 10 seconds. This rule can delay attacks by blocking them for a period of time. Alternatively, you can create a custom rule.

Paid plans have access to more granular controls when creating a rule. If you are on a paid plan, create a custom rule that challenges requests containing leaked credentials:

| Field | Operator | Value |
| --- | --- | --- |
| User and Password Leaked | equals | True |

If you use the Expression Editor, enter the following expression:

```
(cf.waf.credential_check.username_and_password_leaked)
```

Rule action: Managed Challenge

This rule will match requests where Cloudflare detects a previously leaked set of credentials (username and password). For a list of fields provided by leaked credentials detection, refer to Leaked credentials fields.

Combine with other Rules language fields

You can combine the previous expression with other fields and functions of the Rules language. This allows you to customize the rule scope or combine leaked credential checking with other security features. For example:

- The following expression will match requests containing leaked credentials addressed at an authentication endpoint:























FieldOperatorValueLogicUser and Password LeakedequalsTrueAndURI Pathcontains/admin/login.php
Expression when using the editor: 
(cf.waf.credential_check.username_and_password_leaked and http.request.uri.path contains "/admin/login.php")
- The following expression will match requests coming from bots that include authentication credentials:























FieldOperatorValueLogicAuthentication detectedequalsTrueAndBot Scoreless than10
Expression when using the editor: 
(cf.waf.auth_detected and cf.bot_management.score lt 10)

For additional examples, refer to Example mitigation rules.

### Handle detected leaked credentials at the origin server

Additionally, you may want to handle leaked credentials detected by Cloudflare at your origin server:

1. Turn on the Add Leaked Credentials Checks Header managed transform.
2. For requests received at your origin server containing the Exposed-Credential-Check header, you could redirect your end users to your reset password page when detecting previously leaked credentials.

## 4. (Optional) Configure a custom detection location

To check for leaked credentials in a way that is not covered by the default configuration, add a custom detection location.

- Old dashboard
- New dashboard
- API
- Terraform

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, select Leaked credentials and then select Add custom username and password location.
4. In Username location and Password location (optional), enter expressions for obtaining the username and the password from the HTTP request. For example, you could use the following expressions:

Username location:
lookup_json_string(http.request.body.raw, "user")
Password location:
lookup_json_string(http.request.body.raw, "secret")

This configuration will scan incoming HTTP requests containing a JSON body with a structure similar to the following:
{"user": "<USERNAME>", "secret": "<PASSWORD>"}
Refer to the lookup_json_string() documentation for more information on this function.
5. Username location:
lookup_json_string(http.request.body.raw, "user")
6. Password location:
lookup_json_string(http.request.body.raw, "secret")
7. Select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Under Leaked credential detection > Configurations, select the edit icon.
4. Select Add custom username and password location.
5. In Username location and Password location (optional), enter expressions for obtaining the username and the password from the HTTP request. For example, you could use the following expressions:

Username location:
lookup_json_string(http.request.body.raw, "user")
Password location:
lookup_json_string(http.request.body.raw, "secret")

This configuration will scan incoming HTTP requests containing a JSON body with a structure similar to the following:
{"user": "<USERNAME>", "secret": "<PASSWORD>"}
Refer to the lookup_json_string() documentation for more information on this function.
6. Username location:
lookup_json_string(http.request.body.raw, "user")
7. Password location:
lookup_json_string(http.request.body.raw, "secret")
8. Select Save.

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Create Leaked Credential Checks Custom Detection ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks/detections" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "username": "lookup_json_string(http.request.body.raw, \"user\")",    "password": "lookup_json_string(http.request.body.raw, \"secret\")"  }'
```

This pair of lookup expressions (for username and password) will scan incoming HTTP requests containing a JSON body with a structure similar to the following:

```
{"user": "<USERNAME>", "secret": "<PASSWORD>"}
```

Refer to the lookup_json_string() documentation for more information on this function.

Use the cloudflare_leaked_credential_check_rule resource to add a custom detection location. For example:

```
resource "cloudflare_leaked_credential_check_rule" "custom_location_example" {  zone_id = "<ZONE_ID>"  username = "lookup_json_string(http.request.body.raw, \"user\")"  password = "lookup_json_string(http.request.body.raw, \"secret\")"}
```

Refer to the lookup_json_string() documentation for more information on this function.

You only need to provide an expression for the username in custom detection locations.

For more examples of custom detection locations for different request types, refer to Custom detection locations.

## Test your configuration

Cloudflare provides a special set of case-sensitive credentials for testing the configuration of the leaked credentials detection.

After enabling and configuring the detection, you can use the credentials mentioned in this section in your test HTTP requests.

Test credentials for users on a Free plan (will also work in paid plans):

- Username: CF_LEAKED_USERNAME_FREE
- Password: CF_LEAKED_PASSWORD

Test credentials for users on paid plans (will not work on Free plans):

- Username: CF_EXPOSED_USERNAME or CF_EXPOSED_USERNAME@example.com
- Password: CF_EXPOSED_PASSWORD

Cloudflare considers these specific credentials as having been previously leaked. Use them in your tests to check the behavior of your current configuration.

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

## Common API calls

**來源**: [https://developers.cloudflare.com/waf/detections/leaked-credentials/api-calls/](https://developers.cloudflare.com/waf/detections/leaked-credentials/api-calls/)

Page options # Common API calls

The following examples address common scenarios of using the Cloudflare API to manage and configure leaked credentials detection.

If you are using Terraform, refer to Terraform configuration examples.

## General operations

The following API examples cover basic operations such as enabling and disabling the leaked credentials detection.

### Turn on leaked credentials detection

To turn on leaked credentials detection, use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Set Leaked Credential Checks Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "enabled": true  }'
```

### Turn off leaked credentials detection

To turn off leaked credentials detection, use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Set Leaked Credential Checks Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "enabled": false  }'
```

### Get status of leaked credentials detection

To obtain the current status of the leaked credentials detection, use a GET request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Zone WAF Read
- Account WAF Write
- Account WAF Read

Get Leaked Credential Checks Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```
{  "result": {    "enabled": true  },  "success": true,  "errors": [],  "messages": []}
```

## Custom detection location operations

The following API examples cover operations on custom detection locations for leaked credentials detection.

### Add a custom detection location

To add a custom detection location, use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Create Leaked Credential Checks Custom Detection ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks/detections" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "username": "lookup_json_string(http.request.body.raw, \"user\")",    "password": "lookup_json_string(http.request.body.raw, \"secret\")"  }'
```

### Get existing custom detection locations

To get a list of existing custom detection locations, use a GET request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Zone WAF Read
- Account WAF Write
- Account WAF Read

List Leaked Credential Checks Custom Detections ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks/detections" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```
{  "result": [    {      "id": "<DETECTION_ID>",      "username": "lookup_json_string(http.request.body.raw, \"user\")",      "password": "lookup_json_string(http.request.body.raw, \"secret\")"    }    // (...)  ],  "success": true,  "errors": [],  "messages": []}
```

### Delete a custom detection location

To delete a custom detection location, use a DELETE request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Delete Leaked Credential Checks Custom Detection ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks/detections/$DETECTION_ID" \  --request DELETE \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

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

## Terraform configuration examples

**來源**: [https://developers.cloudflare.com/waf/detections/leaked-credentials/terraform-examples/](https://developers.cloudflare.com/waf/detections/leaked-credentials/terraform-examples/)

Page options # Terraform configuration examples

The following Terraform configuration examples address common scenarios for managing, configuring, and using leaked credentials detection.

For more information, refer to the Terraform Cloudflare provider documentation ↗.

If you are using the Cloudflare API, refer to Common API calls.

## Enable leaked credentials detection

Use the cloudflare_leaked_credential_check resource to enable leaked credentials detection for a zone. For example:

```
resource "cloudflare_leaked_credential_check" "zone_lcc_example" {  zone_id = "<ZONE_ID>"  enabled = true}
```

## Configure a custom detection location

Use the cloudflare_leaked_credential_check_rule resource to add a custom detection location. For example:

```
resource "cloudflare_leaked_credential_check_rule" "custom_location_example" {  zone_id = "<ZONE_ID>"  username = "lookup_json_string(http.request.body.raw, \"user\")"  password = "lookup_json_string(http.request.body.raw, \"secret\")"}
```

You only need to provide an expression for the username in custom detection locations.

## Add a custom rule to challenge requests with leaked credentials

This example adds a custom rule that challenges requests with leaked credentials by using one of the leaked credentials fields in the rule expression.

To use the cf.waf.credential_check.username_and_password_leaked field you must enable leaked credentials detection.

Note

Terraform code snippets below refer to the v4 SDK only.

```
resource "cloudflare_ruleset" "zone_custom_firewall_leaked_creds" {  zone_id     = "<ZONE_ID>"  name        = "Phase entry point ruleset for custom rules in my zone"  description = ""  kind        = "zone"  phase       = "http_request_firewall_custom"
  rules {    ref         = "challenge_leaked_username_password"    description = "Challenge requests with a leaked username and password"    expression  = "(cf.waf.credential_check.username_and_password_leaked)"    action      = "managed_challenge"  }}
```

## More resources

For additional Terraform configuration examples, refer to WAF custom rules configuration using Terraform.

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

## Example mitigation rules

**來源**: [https://developers.cloudflare.com/waf/detections/leaked-credentials/examples/](https://developers.cloudflare.com/waf/detections/leaked-credentials/examples/)

Page options # Example mitigation rules

## Rate limit suspicious logins with leaked credentials

Note

Access to the cf.waf.credential_check.username_and_password_leaked field requires a Pro plan or above.

Create a rate limiting rule using account takeover (ATO) detection and leaked credentials fields to limit volumetric attacks from particular IP addresses, JA4 Fingerprints, or countries.

The following example rule applies rate limiting to requests with a specific ATO detection ID (corresponding to Observes all login traffic to the zone) that contain a previously leaked username and password:

When incoming requests match:
(any(cf.bot_management.detection_ids[*] eq 201326593 and cf.waf.credential_check.username_and_password_leaked))

With the same characteristics: IP

When rate exceeds:

- Requests: 5
- Period: 1 minute

## Challenge requests containing leaked credentials

Note

Access to the User and Password Leaked (cf.waf.credential_check.username_and_password_leaked) field requires a Pro plan or above.

Create a custom rule that challenges requests containing a previously leaked set of credentials (username and password).

- Expression: If you use the Expression Builder, configure the following expression:















FieldOperatorValueUser and Password LeakedequalsTrue
If you use the Expression Editor, enter the following expression:
(cf.waf.credential_check.username_and_password_leaked)
- Action: Managed Challenge

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

## Malicious uploads detection

**來源**: [https://developers.cloudflare.com/waf/detections/malicious-uploads/](https://developers.cloudflare.com/waf/detections/malicious-uploads/)

Page options # Malicious uploads detection

The malicious uploads detection, also called uploaded content scanning, is a WAF traffic detection that scans content being uploaded to your application.

When enabled, content scanning attempts to detect content objects, such as uploaded files, and scans them for malicious signatures like malware. The scan results, along with additional metadata, are exposed as fields available in WAF custom rules, allowing you to implement fine-grained mitigation rules.

Note

This feature is available to customers on an Enterprise plan with a paid add-on.

## How it works

Once enabled, content scanning will run for all incoming traffic, identifying content objects automatically.

For every request with one or more detected content objects, the content scanner connects to an antivirus (AV) scanner to perform a thorough analysis of the content objects. Using the results of the scan, the WAF will populate several fields you can use in rule expressions. For example, you can create a basic rule to block requests containing malicious files, or a more complex rule where the expression matches specific file sizes, file types, or URI paths.

Cloudflare uses the same anti-virus (AV) scanner used in Cloudflare Zero Trust for WAF content scanning.

Note

Content scanning will not apply any mitigation actions to requests with content objects considered malicious. It only provides a signal that you can use to define your attack mitigation strategy. You must create rules — custom rules or rate limiting rules — to perform actions based on detected signals.

For more information on detection versus mitigation, refer to Concepts.

## What is a content object?

A content object is any request payload detected by heuristics that does not match any of the following types: text/html, text/x-shellscript, application/json, text/csv, and text/xml. All other content types are considered a content object, such as the following:

- Executable files (for example, .exe, .bat, .dll, and .wasm)
- Documents (for example, .doc, .docx, .pdf, .ppt, and .xls)
- Compressed files (for example, .gz, .zip, and .rar)
- Image files (for example, .jpg, .png, .gif, .webp, and .tif)
- Video and audio files

Content scanning does not take the request's Content-Type header into account, since this header can be manipulated. If the system detects a malicious object but cannot determine its exact content type, it reports the malicious content object as having an application/octet-stream content type.

## Scanned content

Content scanning can check the following content objects for malicious content:

- Uploaded files in a request
- Portions of the request body for multipart requests encoded as multipart/form-data or multipart/mixed
- Specific JSON properties in the request body (containing, for example, files encoded in Base64) according to the custom scan expressions you provide

All content objects in an incoming request will be checked, namely for requests with multiple uploaded files (for example, a submitted HTML form with several file inputs).

The content scanner will fully check content objects with a size up to 30 MB. For larger content objects, the scanner will analyze the first 30 MB and provide scan results based on that portion of the object.

Note

The AV scanner will not scan some particular types of files, namely the following:

- Password-protected archives
- Archives with more than three recursion levels
- Archives with more than 300 files
- PGP-encrypted files

## Custom scan expressions

Sometimes, you may want to specify where to find the content objects, such as when the content is a Base64-encoded string within a JSON payload. For example:

```
{ "file": "<BASE64_ENCODED_STRING>" }
```

In these situations, configure a custom scan expression to tell the content scanner where to find the content objects. For more information, refer to Configure a custom scan expression.

For more information and additional examples of looking up fields in nested JSON payloads, refer to the lookup_json_string() function documentation.

Note

The content scanner will automatically decode Base64 strings.

## Content scanning fields

When content scanning is enabled, you can use the following fields in WAF rules:

| Field | Description |
| --- | --- |
| Has content object  cf.waf.content_scan.has_obj  Boolean | Indicates whether the request contains at least one content object. |
| Has malicious content object  cf.waf.content_scan.has_malicious_obj  Boolean | Indicates whether the request contains at least one malicious content object. |
| Number of malicious content objects  cf.waf.content_scan.num_malicious_obj  Integer | The number of malicious content objects detected in the request (zero or greater). |
| Content scan has failed  cf.waf.content_scan.has_failed  Boolean | Indicates whether the file scanner was unable to scan all the content objects detected in the request. |
| Number of content objects  cf.waf.content_scan.num_obj  Integer | The number of content objects detected in the request (zero or greater). |
| Content object size  cf.waf.content_scan.obj_sizes  Array<Integer> | An array of file sizes in bytes, in the order the content objects were detected in the request. |
| Content object type  cf.waf.content_scan.obj_types  Array<String> | An array of file types in the order the content objects were detected in the request. |
| Content object result  cf.waf.content_scan.obj_results  Array<String> | An array of scan results in the order the content objects were detected in the request.  Possible values: clean, suspicious, infected, and not scanned. |

For examples of rule expressions using these fields, refer to Example rules.

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

## Get started

**來源**: [https://developers.cloudflare.com/waf/detections/malicious-uploads/get-started/](https://developers.cloudflare.com/waf/detections/malicious-uploads/get-started/)

Page options # Get started

Note

WAF content scanning is available to customers on an Enterprise plan with a paid add-on.

## 1. Turn on the detection

- Old dashboard
- New dashboard
- API
- Terraform

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, turn on Malicious uploads.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on Malicious uploads detection.

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Enable Content Scanning ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/enable" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

Use the cloudflare_content_scanning resource to enable content scanning for a zone. For example:

```
resource "cloudflare_content_scanning" "zone_content_scanning_example" {  zone_id = "<ZONE_ID>"  enabled = true}
```

## 2. Validate the content scanning behavior

Use Security Analytics and HTTP logs to validate that malicious content objects are being detected correctly.

You can use the EICAR anti-malware test file ↗ to test content scanning (select the ZIP format).

Alternatively, create a custom rule like described in the next step using a Log action instead of a mitigation action like Block. This rule will generate security events that will allow you to validate your configuration.

## 3. Create a custom rule

Create a custom rule that blocks detected malicious content objects uploaded to your application.

For example, create a custom rule with the Block action and the following expression:

| Field | Operator | Value |
| --- | --- | --- |
| Has malicious content object | equals | True |

If you use the Expression Editor, enter the following expression:

```
(cf.waf.content_scan.has_malicious_obj)
```

Rule action: Block

This rule will match requests where Cloudflare detects a suspicious or malicious content object. For a list of fields provided by WAF content scanning, refer to Content scanning fields.

Optional: Combine with other Rules language fields

You can combine the previous expression with other fields and functions of the Rules language. This allows you to customize the rule scope or combine content scanning with other security features. For example:

- The following expression will match requests with malicious content objects uploaded to a specific endpoint:























FieldOperatorValueLogicHas malicious content objectequalsTrueAndURI Pathcontainsupload.php
Expression when using the editor:
(cf.waf.content_scan.has_malicious_obj and http.request.uri.path contains "upload.php")
- The following expression will match requests from bots uploading content objects:























FieldOperatorValueLogicHas content objectequalsTrueAndBot Scoreless than10
Expression when using the editor:
(cf.waf.content_scan.has_obj and cf.bot_management.score lt 10)

For additional examples, refer to Example rules.

## 4. (Optional) Configure a custom scan expression

To check uploaded content in a way that is not covered by the default configuration, add a custom scan expression.

- Old dashboard
- New dashboard
- API
- Terraform

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, select Malicious uploads.
4. Select Add content object location.
5. In Content location, enter your custom scan expression. For example:
lookup_json_string(http.request.body.raw, "file")
6. Select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Under Malicious uploads detection > Configurations, select the edit icon.
4. Select Add content location.
5. In Content location, enter your custom scan expression. For example:
lookup_json_string(http.request.body.raw, "file")
6. Select Save.

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Add Custom Scan Expressions ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/payloads" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '[    {        "payload": "lookup_json_string(http.request.body.raw, \"file\")"    }  ]'
```

The above request will add the following expression to the current list of custom scan expressions:

```
lookup_json_string(http.request.body.raw, "file")
```

Use the cloudflare_content_scanning_expression resource to add a custom scan expression. For example:

```
resource "cloudflare_content_scanning_expression" "my_custom_scan_expression" {  zone_id = <ZONE_ID>  payload = "lookup_json_string(http.request.body.raw, \"file\")"}
```

For more information, refer to Custom scan expressions.

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

## Example rules

**來源**: [https://developers.cloudflare.com/waf/detections/malicious-uploads/example-rules/](https://developers.cloudflare.com/waf/detections/malicious-uploads/example-rules/)

Page options # Example rules

## Log requests with an uploaded content object

This custom rule example logs all requests with at least one uploaded content object:

- Expression: cf.waf.content_scan.has_obj
- Action: Log

## Block requests to URI path with a malicious content object

This custom rule example blocks requests addressed at /upload.php that contain at least one uploaded content object considered malicious:

- Expression: cf.waf.content_scan.has_malicious_obj and http.request.uri.path eq "/upload.php"
- Action: Block

## Block requests with non-PDF file uploads

This custom rule example blocks requests addressed at /upload with uploaded content objects that are not PDF files:

- Expression: any(cf.waf.content_scan.obj_types[*] != "application/pdf") and http.request.uri.path eq "/upload"
- Action: Block

## Block requests with uploaded files over 500 KB

This custom rule example blocks requests addressed at /upload with uploaded content objects over 500 KB (512,000 bytes) in size:

- Expression: any(cf.waf.content_scan.obj_sizes[*] > 512000) and http.request.uri.path eq "/upload"
- Action: Block

## Block requests with uploaded files over the content scanning limit (30 MB)

This custom rule example blocks requests with uploaded content objects over 30 MB in size (the current content scanning limit):

- Expression: any(cf.waf.content_scan.obj_sizes[*] >= 31457280)
- Action: Block

In this example, you must also test for equality because currently any file over 30 MB will be handled internally as if it had a size of 30 MB (31,457,280 bytes). This means that using the > (greater than) comparison operator would not work for this particular rule — you should use >= (greater than or equal) instead.

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

## Common API calls

**來源**: [https://developers.cloudflare.com/waf/detections/malicious-uploads/api-calls/](https://developers.cloudflare.com/waf/detections/malicious-uploads/api-calls/)

Page options # Common API calls

The following examples address common scenarios of using the Cloudflare API to manage and configure WAF content scanning.

If you are using Terraform, refer to Terraform configuration examples.

## General operations

The following API examples cover basic operations such as enabling and disabling WAF content scanning.

### Enable WAF content scanning

To enable content scanning, use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Enable Content Scanning ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/enable" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Disable WAF content scanning

To disable content scanning, use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Disable Content Scanning ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/disable" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Get WAF content scanning status

To obtain the current status of the content scanning feature, use a GET request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Zone WAF Read
- Account WAF Write
- Account WAF Read

Get Content Scanning Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/settings" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

## Custom expression operations

The following API examples cover operations on custom scan expressions for content scanning.

### Get existing custom scan expressions

To get a list of existing custom scan expressions, use a GET request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Zone WAF Read
- Account WAF Write
- Account WAF Read

List Existing Custom Scan Expressions ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/payloads" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```
{  "result": [    {      "id": "<EXPRESSION_ID>",      "payload": "lookup_json_string(http.request.body.raw, \"file\")"    }  ],  "success": true,  "errors": [],  "messages": []}
```

### Add a custom scan expression

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Add Custom Scan Expressions ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/payloads" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '[    {        "payload": "lookup_json_string(http.request.body.raw, \"file\")"    }  ]'
```

### Delete a custom scan expression

Use a DELETE request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Delete a Custom Scan Expression ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/content-upload-scan/payloads/$EXPRESSION_ID" \  --request DELETE \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

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

## Terraform configuration examples

**來源**: [https://developers.cloudflare.com/waf/detections/malicious-uploads/terraform-examples/](https://developers.cloudflare.com/waf/detections/malicious-uploads/terraform-examples/)

Page options # Terraform configuration examples

The following Terraform configuration examples address common scenarios for managing, configuring, and using WAF content scanning.

For more information, refer to the Terraform Cloudflare provider documentation ↗.

If you are using the Cloudflare API, refer to Common API calls.

## Enable WAF content scanning

Use the cloudflare_content_scanning resource to enable content scanning for a zone. For example:

```
resource "cloudflare_content_scanning" "zone_content_scanning_example" {  zone_id = "<ZONE_ID>"  enabled = true}
```

## Configure a custom scan expression

Use the cloudflare_content_scanning_expression resource to add a custom scan expression. For example:

```
resource "cloudflare_content_scanning_expression" "my_custom_scan_expression" {  zone_id = <ZONE_ID>  payload = "lookup_json_string(http.request.body.raw, \"file\")"}
```

For more information, refer to Custom scan expressions.

## Add a custom rule to block malicious uploads

This example adds a custom rule that blocks requests with one or more content objects considered malicious by using one of the content scanning fields in the rule expression.

To use the cf.waf.content_scan.has_malicious_obj field you must enable content scanning.

Note

Terraform code snippets below refer to the v4 SDK only.

```
resource "cloudflare_ruleset" "zone_custom_firewall_malicious_uploads" {  zone_id     = "<ZONE_ID>"  name        = "Phase entry point ruleset for custom rules in my zone"  description = ""  kind        = "zone"  phase       = "http_request_firewall_custom"
  rules {    ref         = "block_malicious_uploads"    description = "Block requests uploading malicious content objects"    expression  = "(cf.waf.content_scan.has_malicious_obj and http.request.uri.path eq \"/upload.php\")"    action      = "block"  }}
```

## More resources

For additional Terraform configuration examples, refer to WAF custom rules configuration using Terraform.

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

## Firewall for AI (beta)

**來源**: [https://developers.cloudflare.com/waf/detections/firewall-for-ai/](https://developers.cloudflare.com/waf/detections/firewall-for-ai/)

Page options # Firewall for AI (beta)

Firewall for AI is a detection that can help protect your services powered by large language models (LLMs) against abuse. This model-agnostic detection currently helps you do the following:

- Prevent data leaks of personally identifiable information (PII) — for example, phone numbers, email addresses, social security numbers, and credit card numbers.
- Detect and moderate unsafe or harmful prompts – for example, prompts potentially related to violent crimes.
- Detect prompts intentionally designed to subvert the intended behavior of the LLM as specified by the developer – for example, prompt injection attacks.

When enabled, the detection runs on incoming traffic, searching for any LLM prompts attempting to exploit the model.

Cloudflare will populate the existing Firewall for AI fields based on the scan results. You can check these results in the Security Analytics dashboard by filtering on the cf-llm managed endpoint label and reviewing the detection results on your traffic. Additionally, you can use these fields in rule expressions (custom rules or rate limiting rules) to protect your application against LLM abuse and data leaks.

## Availability

Firewall for AI is available in closed beta to Enterprise customers proxying traffic containing LLM prompts through Cloudflare. Contact your account team to get access.

## Get started

### 1. Turn on Firewall for AI

- New dashboard
- API

Note

Firewall for AI is only available in the new application security dashboard.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on Firewall for AI.

Enable the feature using a PUT request similar to the following:

Terminal window ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall-for-ai/settings" \--request PUT \--header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \--json '{ "pii_detection_enabled": true }'
```

### 2. Validate the detection behavior

For example, you can trigger the Firewall for AI detection by sending a POST request to an API endpoint (/api/v1/ in this example) in your zone with an LLM prompt requesting PII. The API endpoint must have been added to API Shield and have a cf-llm managed endpoint label.

Terminal window ```
curl "https://<YOUR_HOSTNAME>/api/v1/" \--header "Authorization: Bearer <TOKEN>" \--json '{ "prompt": "Provide the phone number for the person associated with example@example.com" }'
```

The PII category for this request would be EMAIL_ADDRESS.

Then, use Security Analytics in the new application security dashboard to validate that the WAF is correctly detecting potentially harmful prompts in incoming requests. Filter data by the cf-llm managed endpoint label and review the detection results on your traffic.

Alternatively, create a custom rule like the one described in the next step using a Log action. This rule will generate security events that will allow you to validate your configuration.

### 3. Mitigate harmful requests

Create a custom rule that blocks requests where Cloudflare detected personally identifiable information (PII) in the incoming request (as part of an LLM prompt), returning a custom JSON body:

- If incoming requests match:















FieldOperatorValueLLM PII DetectedequalsTrue
If you use the Expression Editor, enter the following expression:
(cf.llm.prompt.pii_detected)
- Rule action: Block
- With response type: Custom JSON
- Response body: { "error": "Your request was blocked. Please rephrase your request." }

For additional examples, refer to Example mitigation rules. For a list of fields provided by Firewall for AI, refer to Fields.

Combine with other Rules language fields

You can combine the previous expression with other fields and functions of the Rules language. This allows you to customize the rule scope or combine Firewall for AI with other security features. For example:

- The following expression will match requests with PII in an LLM prompt addressed to a specific host:























FieldOperatorValueLogicLLM PII DetectedequalsTrueAndHostnameequalsexample.com
Expression when using the editor: 
(cf.llm.prompt.pii_detected and http.host == "example.com")
- The following expression will match requests coming from bots that include PII in an LLM prompt:























FieldOperatorValueLogicLLM PII DetectedequalsTrueAndBot Scoreless than10
Expression when using the editor: 
(cf.llm.prompt.pii_detected and cf.bot_management.score lt 10)

## Firewall for AI fields

When enabled, Firewall for AI populates the following fields:

| Field | Description |
| --- | --- |
| LLM PII detected  cf.llm.prompt.pii_detected  Boolean | Indicates whether any personally identifiable information (PII) has been detected in the LLM prompt included in the request. |
| LLM PII categories  cf.llm.prompt.pii_categories  Array<String> | Array of string values with the personally identifiable information (PII) categories found in the LLM prompt included in the request.Category list |
| LLM Content detected  cf.llm.prompt.detected  Boolean | Indicates whether Cloudflare detected an LLM prompt in the incoming request. |
| LLM Unsafe topic detected  cf.llm.prompt.unsafe_topic_detected  Boolean | Indicates whether the incoming request includes any unsafe topic category in the LLM prompt. |
| LLM Unsafe topic categories  cf.llm.prompt.unsafe_topic_categories  Array<String> | Array of string values with the type of unsafe topics detected in the LLM prompt.Category list |
| LLM Injection score  cf.llm.prompt.injection_score  Number | A score from 1–99 that represents the likelihood that the LLM prompt in the request is trying to perform a prompt injection attack. |

## Example mitigation rules

### Block requests with specific PII category in LLM prompt

The following example custom rule will block requests with an LLM prompt that tries to obtain PII of a specific category:

- If incoming requests match:















FieldOperatorValueLLM PII Categoriesis inCredit Card
If you use the Expression Editor, enter the following expression:
(any(cf.llm.prompt.pii_categories[*] in {"CREDIT_CARD"}))
- Action: Block

### Block requests with specific unsafe content categories in LLM prompt

The following example custom rule will block requests with an LLM prompt containing unsafe content of specific categories:

- If incoming requests match:















FieldOperatorValueLLM Unsafe topic categoriesis inS1: Violent Crimes S10: Hate
If you use the Expression Editor, enter the following expression:
(any(cf.llm.prompt.unsafe_topic_categories[*] in {"S1" "S10"}))
- Action: Block

### Block requests with prompt injection attempt in LLM prompt

The following example custom rule will block requests with an injection score below 20. Using a low injection score value in the rule helps avoid false positives.

- If incoming requests match:















FieldOperatorValueLLM Injection scoreless than20
If you use the Expression Editor, enter the following expression:
(cf.llm.prompt.injection_score < 20)
- Action: Block

## More resources

- Cloudflare AI Gateway
- Learning Center: What are the OWASP Top 10 risks for LLMs? ↗

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

## Create a custom rule in the dashboard

**來源**: [https://developers.cloudflare.com/waf/custom-rules/create-dashboard/](https://developers.cloudflare.com/waf/custom-rules/create-dashboard/)

Page options # Create a custom rule in the dashboard

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Custom rules.
3. To create a new empty rule, select Create rule. To duplicate an existing rule, select the three dots next to it > Duplicate.
4. Enter a descriptive name for the rule in Rule name.
5. Under If incoming requests match, use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator.
6. Under Then take action, select the rule action in the Choose action dropdown. For example, selecting Block tells Cloudflare to refuse requests that match the conditions you specified.
7. (Optional) If you selected the Block action, you can configure a custom response.
8. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. To create a new empty rule, select Create rule > Custom rules. To duplicate an existing rule, select the three dots next to it > Duplicate.
4. Enter a descriptive name for the rule in Rule name.
5. Under If incoming requests match, use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator.
6. Under Then take action, select the rule action in the Choose action dropdown. For example, selecting Block tells Cloudflare to refuse requests that match the conditions you specified.
7. (Optional) If you selected the Block action, you can configure a custom response.
8. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

## Configure a custom response for blocked requests

Note

This feature is only available on Pro plans and above.

When you select the Block action in a rule you can optionally define a custom response.

The custom response has three settings:

- With response type: Choose a content type or the default WAF block response from the list. The available custom response types are the following:

























Dashboard valueAPI valueCustom HTML"text/html"Custom Text"text/plain"Custom JSON"application/json"Custom XML"text/xml"
- With response code: Choose an HTTP status code for the response, in the range 400-499. The default response code is 403.
- Response body: The body of the response. Configure a valid body according to the response type you selected. The maximum field size is 2 KB.

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

## Create a custom rule via API

**來源**: [https://developers.cloudflare.com/waf/custom-rules/create-api/](https://developers.cloudflare.com/waf/custom-rules/create-api/)

Page options # Create a custom rule via API

Use the Rulesets API to create a custom rule via API.

You must deploy custom rules to the http_request_firewall_custom phase entry point ruleset.

If you are using Terraform, refer to WAF custom rules configuration using Terraform.

## Create a custom rule

To create a custom rule for a zone, add a rule  to the http_request_firewall_custom phase entry point ruleset.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_custom phase. You will need the zone ID for this task.
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add a custom rule to the existing ruleset. Refer to the examples below for details.
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include your custom rule in the rules array. Refer to Create ruleset for an example.

### Example A

This example request adds a rule to the http_request_firewall_custom phase entry point ruleset for the zone with ID $ZONE_ID. The entry point ruleset already exists, with ID $RULESET_ID.

The new rule, which will be the last rule in the ruleset, will challenge requests from the United Kingdom or France with an attack score lower than 20.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My custom rule",    "expression": "(ip.src.country eq \"GB\" or ip.src.country eq \"FR\") and cf.waf.score lt 20",    "action": "challenge"  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

### Example B

This example request adds a rule to the http_request_firewall_custom phase entry point ruleset for the zone with ID $ZONE_ID. The entry point ruleset already exists, with ID $RULESET_ID.

The new rule, which will be the last rule in the ruleset, includes the definition of a custom response for blocked requests.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My custom rule with plain text response",    "expression": "(ip.src.country eq \"GB\" or ip.src.country eq \"FR\") and cf.waf.score lt 20",    "action": "block",    "action_parameters": {        "response": {            "status_code": 403,            "content": "Your request was blocked.",            "content_type": "text/plain"        }    }  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

## Next steps

Use the different operations in the Rulesets API to work with the rule you just created. The following table has a list of common tasks:

| Task | Procedure |
| --- | --- |
| List all rules in ruleset | Use the Get a zone entry point ruleset operation with the http_request_firewall_custom phase name to obtain the list of configured custom rules and their IDs.For more information, refer to View a specific ruleset. |
| Update a rule | Use the Update a zone ruleset rule operation.You will need to provide the ruleset ID and the rule ID. To obtain these IDs, you can use the Get a zone entry point ruleset operation with the http_request_firewall_custom phase name.For more information, refer to Update a rule in a ruleset. |
| Delete a rule | Use the Delete a zone ruleset rule operation.You will need to provide the ruleset ID and the rule ID. To obtain these IDs, you can use the Get a zone entry point ruleset operation with the http_request_firewall_custom phase name.For more information, refer to Delete a rule in a ruleset. |

These operations are covered in the Ruleset Engine documentation. The Ruleset Engine powers different Cloudflare products, including custom rules.

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

## Configure a rule with the Skip action

**來源**: [https://developers.cloudflare.com/waf/custom-rules/skip/](https://developers.cloudflare.com/waf/custom-rules/skip/)

Page options # Configure a rule with the Skip action

Use the Skip action in a custom rule to skip one or more security features. A rule configured with the Skip action is also known as a skip rule.

For more information on the available options, refer to Available skip options.

- Old dashboard
- New dashboard
- API

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Custom rules.
3. Create a custom rule by selecting Create rule, or edit an existing custom rule.
4. Define the rule name and the rule expression.
5. Under Choose action, select Skip from the dropdown.
6. Configure the desired skip options.
7. Save your changes.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. Create a custom rule by selecting Create rule > Custom rules, or edit an existing custom rule.
4. Define the rule name and the rule expression.
5. Under Choose action, select Skip from the dropdown.
6. Configure the desired skip options.
7. Save your changes.

Use the Rulesets API to configure custom rules via API.

Refer to API examples for examples of creating skip rules.

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

## API examples

**來源**: [https://developers.cloudflare.com/waf/custom-rules/skip/api-examples/](https://developers.cloudflare.com/waf/custom-rules/skip/api-examples/)

Page options # API examples

Use the Rulesets API to configure custom rules via API.

The skip action supports different skip options, according to the security features or products that you wish to skip.

## Before you continue

This page contains examples of different skip rule scenarios for custom rules. Take the following into account:

- The $ZONE_ID value is the ID of the zone where you want to add the rule.
- The $RULESET_ID value is the ID of the entry point ruleset of the http_request_firewall_custom phase. For details on obtaining this ruleset ID, refer to List and view rulesets. The API examples in this page add a skip rule to an existing ruleset using the Create a zone ruleset rule operation.
However, the entry point ruleset may not exist yet. In this case, invoke the Create a zone ruleset operation to create the entry point ruleset with a skip rule. Refer to Create ruleset for an example.
- Although each example only includes one action parameter, you can use several skip options in the same rule by specifying the ruleset, phases, and products action parameters simultaneously.

## Skip the remaining rules in the current ruleset

This example invokes the Create a zone ruleset rule operation to add a skip rule to the existing http_request_firewall_custom phase entry point ruleset with ID $RULESET_ID. The rule will skip all remaining rules in the current ruleset for requests matching the rule expression.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "skip",    "action_parameters": {        "ruleset": "current"    },    "expression": "http.request.uri.path contains \"/skip-current-ruleset/\"",    "description": ""  }'
```

## Skip a phase

This example invokes the Create a zone ruleset rule operation to add a rule to the existing http_request_firewall_custom phase entry point ruleset with ID $RULESET_ID. The rule will skip the http_ratelimit phase for requests matching the rule expression.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "skip",    "action_parameters": {        "phases": [            "http_ratelimit"        ]    },    "expression": "http.request.uri.path contains \"/skip-phase/\"",    "description": ""  }'
```

Refer to Available skip options for the list of phases you can skip.

## Skip a phase and do not log matching requests

This example invokes the Create a zone ruleset rule operation to add a rule that:

- Skips the http_ratelimit phase
- Disables event logging for the current rule

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "skip",    "action_parameters": {        "phases": [            "http_ratelimit"        ]    },    "logging": {        "enabled": false    },    "expression": "http.request.uri.path contains \"/disable-logging/\"",    "description": ""  }'
```

Refer to Available skip options: Logging for more information on disabling logging for requests that match a skip rule.

## Skip security products

This example uses the Create a zone ruleset rule operation to add a rule that skips the Zone Lockdown and User Agent Blocking products for requests matching the rule expression.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "skip",    "action_parameters": {        "products": [            "zoneLockdown",            "uaBlock"        ]    },    "expression": "http.request.uri.path contains \"/skip-products/\"",    "description": ""  }'
```

Refer to Available skip options for the list of products you can skip.

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

## Available skip options

**來源**: [https://developers.cloudflare.com/waf/custom-rules/skip/options/](https://developers.cloudflare.com/waf/custom-rules/skip/options/)

Page options # Available skip options

The available skip options in custom rules are the following:

- Skip the remaining custom rules (current ruleset)

Dashboard option: All remaining custom rules.
API action parameter: ruleset.
Skips the remaining rules in the current ruleset.
- Dashboard option: All remaining custom rules.
- API action parameter: ruleset.
- Skips the remaining rules in the current ruleset.
- Skip phases


Dashboard options: All rate limiting rules, All Super Bot Fight Mode rules, and All managed rules.


API action parameter: phases.


Skips the execution of one or more phases. Based on the phases you can skip, this option effectively allows you to skip rate limiting rules, Super Bot Fight Mode rules, and/or WAF Managed Rules.


The phases you can skip are the following:

http_ratelimit
http_request_sbfm
http_request_firewall_managed



Refer to Phases for more information.
- Dashboard options: All rate limiting rules, All Super Bot Fight Mode rules, and All managed rules.
- API action parameter: phases.
- Skips the execution of one or more phases. Based on the phases you can skip, this option effectively allows you to skip rate limiting rules, Super Bot Fight Mode rules, and/or WAF Managed Rules.
- The phases you can skip are the following:

http_ratelimit
http_request_sbfm
http_request_firewall_managed
- http_ratelimit
- http_request_sbfm
- http_request_firewall_managed
- Refer to Phases for more information.
- Skip products


API action parameter: products.


Skips specific security products that are not based on the Ruleset Engine. The products you can skip are the following:







































Product name in the dashboardAPI valueZone LockdownzoneLockdownUser Agent BlockinguaBlockBrowser Integrity CheckbicHotlink ProtectionhotSecurity LevelsecurityLevelRate limiting rules (Previous version)rateLimitManaged rules (Previous version)waf


The API values are case-sensitive.


Currently, you cannot skip Bot Fight Mode, only Super Bot Fight Mode (refer to Skip phases above).
- API action parameter: products.
- Skips specific security products that are not based on the Ruleset Engine. The products you can skip are the following:
- Product name in the dashboardAPI valueZone LockdownzoneLockdownUser Agent BlockinguaBlockBrowser Integrity CheckbicHotlink ProtectionhotSecurity LevelsecurityLevelRate limiting rules (Previous version)rateLimitManaged rules (Previous version)waf
- The API values are case-sensitive.
- Currently, you cannot skip Bot Fight Mode, only Super Bot Fight Mode (refer to Skip phases above).

Note

If you configure a skip rule at the account level it will only affect other rules/phases configured at the account level, not at the zone level. To skip rules/phases at the zone level you must configure a skip rule at the zone level.

## Logging

- Log requests matching the skip rule

Dashboard option: Log matching requests.
API action parameter: logging > enabled (boolean, optional).
When disabled, Cloudflare will not log any requests matching the current skip rule, and these requests will not appear in Security Events.
If you do not specify this option in the API, the default value is true for custom rules with the skip action (logs requests matching the skip rule).
- Dashboard option: Log matching requests.
- API action parameter: logging > enabled (boolean, optional).
- When disabled, Cloudflare will not log any requests matching the current skip rule, and these requests will not appear in Security Events.
- If you do not specify this option in the API, the default value is true for custom rules with the skip action (logs requests matching the skip rule).

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

## Allow traffic from IP addresses in allowlist only

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-ips-in-allowlist/](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-ips-in-allowlist/)

Page options # Allow traffic from IP addresses in allowlist only

This example skips WAF rules for requests from IP addresses in an allowlist (defined using an IP list).

1. Create an IP list with the IP addresses for which you want to allow access.
For example, create an IP list named allowed_ips with one or more IP addresses. For more information on the accepted IP address formats, refer to IP lists.
2. Create a custom rule skipping all rules for any request from the IPs in the list you created (allowed_ips in the current example).

Expression: (ip.src in $allowed_ips)
Action: Skip:

All remaining custom rules
Skip phases:

All rate limiting rules
All Super Bot Fight Mode rules
All managed rules
3. Expression: (ip.src in $allowed_ips)
4. Action: Skip:

All remaining custom rules
Skip phases:

All rate limiting rules
All Super Bot Fight Mode rules
All managed rules
5. All remaining custom rules
6. Skip phases:

All rate limiting rules
All Super Bot Fight Mode rules
All managed rules
7. All rate limiting rules
8. All Super Bot Fight Mode rules
9. All managed rules

Make sure the new rule appears before any other custom rules in the rules list.

## Other resources

- Use case: Require known IP addresses in site admin area
- Available skip options

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

## Allow traffic from search engine bots

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/)

Page options # Allow traffic from search engine bots

This example custom rule challenges requests from a list of countries, but allows traffic from search engine bots — such as Googlebot and Bingbot — and from other verified bots.

The rule expression uses the cf.client.bot field to determine if the request originated from a known good bot or crawler.

- Expression: (ip.src.country in {"US" "MX"} and not cf.client.bot)
- Action: Managed Challenge

## Other resources

- Use case: Challenge bad bots
- Cloudflare bot solutions
- Troubleshooting: Bing's Site Scan blocked by a WAF managed rule
- Learning Center: What is a web crawler? ↗

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

## Allow traffic from specific countries only

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-specific-countries/](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-specific-countries/)

Page options # Allow traffic from specific countries only

This example custom rule blocks requests based on country code using the ip.src.country field, only allowing requests from two countries: United States and Mexico.

- Expression: (not ip.src.country in {"US" "MX"})
- Action: Block

## Other resources

- Use case: Block traffic by geographical location
- Use case: Block traffic from specific countries

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

## Block Microsoft Exchange Autodiscover requests

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/block-ms-exchange-autodiscover/](https://developers.cloudflare.com/waf/custom-rules/use-cases/block-ms-exchange-autodiscover/)

Page options # Block Microsoft Exchange Autodiscover requests

In some cases, Microsoft Exchange Autodiscover service requests can be "noisy", triggering large numbers of HTTP 404 (Not found) errors.

This example custom rule blocks requests for autodiscover.xml and autodiscover.src:

- Expression: (ends_with(http.request.uri.path, "/autodiscover.xml") or ends_with(http.request.uri.path, "/autodiscover.src"))
- Action: Block

Alternatively, customers on a Business or Enterprise plan can use the matches comparison operator for the same purpose. For this example, the expression would be the following:

```
(http.request.uri.path matches "/autodiscover.(xml|src)$")
```

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

## Block requests by attack score

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/block-attack-score/](https://developers.cloudflare.com/waf/custom-rules/use-cases/block-attack-score/)

Page options # Block requests by attack score

The attack score helps identify variations of known attacks and their malicious payloads.

This example custom rule blocks requests based on country code (ISO 3166-1 Alpha 2 ↗ format), from requests with an attack score lower than 20. For more information, refer to WAF attack score.

- Expression: (ip.src.country in {"CN" "TW" "US" "GB"} and cf.waf.score lt 20)
- Action: Block

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

## Block traffic by geographical location

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/block-by-geographical-location/](https://developers.cloudflare.com/waf/custom-rules/use-cases/block-by-geographical-location/)

Page options # Block traffic by geographical location

This example custom rule blocks requests by autonomous system number (ASN), continent, country of origin, or region.

- Expression: (ip.src.asnum eq 131279) or (ip.src.continent eq "AS") or (ip.src.country eq "KP") or (ip.src.region_code eq "CA")
- Action: Block

## Other resources

- Use case: Block traffic from specific countries
- Use case: Allow traffic from specific countries only
- Fields reference: Geolocation

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

## Block traffic from specific countries

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/block-traffic-from-specific-countries/](https://developers.cloudflare.com/waf/custom-rules/use-cases/block-traffic-from-specific-countries/)

Page options # Block traffic from specific countries

This example custom rule blocks requests based on country code using the ip.src.country field.

- Expression: (ip.src.country in {"KP" "SY"})
- Action: Block

## Other resources

- Use case: Block traffic by geographical location
- Use case: Allow traffic from specific countries only

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

## Build a sequence rule within custom rules

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/sequence-custom-rules/](https://developers.cloudflare.com/waf/custom-rules/use-cases/sequence-custom-rules/)

Page options # Build a sequence rule within custom rules

You can build an API sequence rule via the Cloudflare dashboard.

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Custom rules.
3. To create a new empty rule, select Create rule.
4. Enter a descriptive name for the rule in Rule name.
5. Under When incoming requests match, use the Field drop-down list and select:

Current Operation
Previous Operations
Elapsed time
6. Current Operation
7. Previous Operations
8. Elapsed time
9. Under Value, build a sequence by selecting a hostname for the sequence.
10. Select the checkbox for each endpoint in the order that you want them to appear in the sequence.
11. Set the time to complete.
12. Select Save.
13. Under Then take action, select the rule action in the Choose action dropdown. For example, selecting Block tells Cloudflare to refuse requests that match the conditions you specified.
14. (Optional) If you selected the Block action, you can configure a custom response.
15. Under Place at, select the order of when the rule will fire.
16. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. To create a new empty rule, select Create rule > Custom rules.
4. Enter a descriptive name for the rule in Rule name.
5. Under When incoming requests match, use the Field drop-down list to filter by Sequences and select from:

Current Operation
Previous Operations
Elapsed time
6. Current Operation
7. Previous Operations
8. Elapsed time
9. Under Value, select the edit icon to use Builder and build a sequence on the side panel.
10. Under Select a hostname for this sequence, choose all or a specific hostname from the dropdown list. Optionally, you can use the search bar to search for a specific hostname.
11. From the Methods dropdown list, choose all methods or a specific request method.
12. Select the checkbox for each endpoint in the order that you want them to appear in the sequence.
13. Set the time to complete.
14. Select Save.
15. Under Then take action, select the rule action in the Choose action dropdown. For example, selecting Block tells Cloudflare to refuse requests that match the conditions you specified.
16. (Optional) If you selected the Block action, you can configure a custom response.
17. Under Place at, select the order of when the rule will fire.
18. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

Note

The fields in the custom rule are populated as a grouped sequence based on the values that you entered on Builder.

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

## Challenge bad bots

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/challenge-bad-bots/](https://developers.cloudflare.com/waf/custom-rules/use-cases/challenge-bad-bots/)

Page options # Challenge bad bots

Cloudflare's Bot Management feature scores the likelihood that a request originates from a bot.

Note

Access to Bot Management requires a Cloudflare Enterprise plan with Bot Management enabled.

Bot score ranges from 1 through 99. A low score indicates the request comes from a script, API service, or an automated agent. A high score indicates that a human issued the request from a standard desktop or mobile web browser.

These examples use:

- cf.bot_management.score to target requests from bots
- cf.bot_management.verified_bot to identify requests from known good bots ↗
- cf.bot_management.ja3_hash to target specific JA3 Fingerprints

## Suggested rules

For best results:

- Use Bot Analytics to learn about your traffic before applying rules.
- Start small and increase your bot threshold over time.

Your rules may also vary based on the nature of your site and your tolerance for false positives.

### General protection

The following three custom rules provide baseline protection against malicious bots:

Rule 1:

- Expression: (cf.bot_management.verified_bot)
- Action: Skip:

All remaining custom rules
- All remaining custom rules

Rule 2:

- Expression: (cf.bot_management.score eq 1)
- Action: Block

Rule 3:

- Expression: (cf.bot_management.score gt 1 and cf.bot_management.score lt 30)
- Action: Managed Challenge

### Specific protection for browser, API, and mobile traffic

#### Protect browser endpoints

When a request is definitely automated (score of 1) or likely automated (scores 2 through 29) and is not on the list of known good bots, Cloudflare blocks the request.

- Expression: (cf.bot_management.score lt 30 and not cf.bot_management.verified_bot)
- Action: Block

#### Exempt API traffic

Since Bot Management detects automated users, you need to explicitly allow your good automated traffic⁠ — this includes your APIs ↗ and partner APIs.

This example offers the same protection as the browser-only rule, but allows automated traffic to your API.

- Expression: (cf.bot_management.score lt 30 and not cf.bot_management.verified_bot and not starts_with(http.request.uri.path, "/api"))
- Action: Block

#### Adjust for mobile traffic

Since Bot Management can be more sensitive to mobile traffic, you may want to add in additional logic to avoid blocking legitimate requests.

If you are handling requests from your own mobile application, you could potentially allow it based on its specific JA3 fingerprint.

- Expression: (cf.bot_management.ja3_hash eq "df669e7ea913f1ac0c0cce9a201a2ec1")
- Action: Skip:

All remaining custom rules
- All remaining custom rules

Otherwise, you could set lower thresholds for mobile traffic. The following rules would block definitely automated mobile traffic and challenge likely automated traffic.

Rule 1:

- Expression: (cf.bot_management.score lt 2 and http.user_agent contains "App_Name 2.0")
- Action: Block

Rule 2:

- Expression: (cf.bot_management.score lt 30 and http.user_agent contains "App_Name 2.0")
- Action: Managed Challenge

#### Combine the different rules

If your domain handles mobile, browser, and API traffic, you would want to arrange these example rules in the following order:

- Rule for API traffic
- Rule(s) for mobile traffic
- Rule for browser traffic

### Static resource protection

Static resources are protected by default when you create custom rules using the cf.bot_management.score field.

To exclude static resources, include not (cf.bot_management.static_resource) in your rule expression. For details, refer to Static resource protection.

### Additional considerations

From there, you could customize your custom rules based on specific request paths (/login or /signup), common traffic patterns, or many other characteristics.

Make sure you review Bot Analytics and Security Events to check if your rules need more tuning.

## Other resources

- Use case: Allow traffic from verified bots
- Tutorial: Integrate Turnstile, WAF, and Bot Management

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

## Configure token authentication

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/configure-token-authentication/](https://developers.cloudflare.com/waf/custom-rules/use-cases/configure-token-authentication/)

Page options # Configure token authentication

Token authentication allows you to restrict access to documents, files, and media to select users without requiring them to register. This helps protect paid/restricted content from leeching and unauthorized sharing.

There are two options to configure token authentication: via Cloudflare Workers or via custom rules.

## Option 1: Configure using Cloudflare Workers

Refer to the following Cloudflare Workers resources for two different implementations of token authentication:

- The Sign requests example.
- The Auth with headers template.

To get started with Workers, refer to Configure a Worker.

Note

The code provided in the Sign requests example is compatible with the is_timed_hmac_valid_v0() function used in Option 2. This means that you can verify requests signed by the example Worker script using a custom rule.

## Option 2: Configure using custom rules

Use the Rules language is_timed_hmac_valid_v0() HMAC validation function to validate hash-based message authentication code (HMAC) tokens in a custom rule expression.

Note

Access to the is_timed_hmac_valid_v0() HMAC validation function requires a Cloudflare Pro, Business, or Enterprise plan.

To validate token authentication, create a custom rule with a call to the is_timed_hmac_valid_v0() function in the rule expression. You can use an action such as Block.

### Example rule

This example illustrates a rule that blocks any visitor that does not pass HMAC key validation on a specific hostname and URL path. Details required for token authentication include:

- The secret key for generating and validating the HMAC (for example, mysecrettoken)
- The path you wish to authenticate (for example, downloads.example.com/images/cat.jpg)
- The name of the query string parameter containing the token (for example, verify)
- The token lifetime in seconds (for example, 3 hours = 10,800 seconds)

Consider the following example URL:

```
downloads.example.com/images/cat.jpg?verify=1484063787-9JQB8vP1z0yc5DEBnH6JGWM3mBmvIeMrnnxFi3WtJLE%3D
```

Where:

- /images/cat.jpg represents the path to the asset — the HMAC message to authenticate.
- ?verify= is the separator between the path to the asset and the timestamp when the HMAC token was issued.
- 1484063787 represents the timestamp when the token was issued, expressed as UNIX time in seconds.
- 9JQB8vP1z0yc5DEBnH6JGWM3mBmvIeMrnnxFi3WtJLE%3D is a Base64-encoded MAC.

Warning

When you do not use the optional flags argument for is_timed_hmac_valid_v0(), you must URL encode the Base64-encoded MAC value. For more information, refer to HMAC validation.

The expression for the custom rule would be similar to the following:

```
(http.host eq "downloads.example.com" and not is_timed_hmac_valid_v0("mysecrettoken", http.request.uri, 10800, http.request.timestamp.sec, 8))
```

The components of this example custom rule (using the previous example URL) include:

- Token secret key = mysecrettoken
- Token lifetime = 10800 (10,800 seconds = 3 hours)
- http.request.uri = /images/cat.jpg?verify=1484063787-9JQB8vP1z0yc5DEBnH6JGWM3mBmvIeMrnnxFi3WtJLE%3D
- http.request.timestamp.sec = 1484071925 (for example)
- Separator length: len("?verify=") = 8

The is_timed_hmac_valid_v0() function compares the value of a MAC generated using the mysecrettoken secret key to the value encoded in http.request.uri.

If the MAC values match and if the token has not expired yet, according to the following formula:

```
http.request.timestamp.sec < (<TIMESTAMP_ISSUED> + 10800)
```

Then the token is valid and the is_timed_hmac_valid_v0() function returns true.

## HMAC token generation

The following examples show how you could generate tokens at your origin server for the path validated using the custom rule described in the previous section:

- Python 3.8
- Python 2.7
- PHP
- Workers

```
import hmacimport base64import timeimport urllib.parsefrom hashlib import sha256
message = "/images/cat.jpg"secret = "mysecrettoken"separator = "verify"timestamp = str(int(time.time()))digest = hmac.new((secret).encode('utf8'), "{}{}".format(message, timestamp).encode('utf8'), sha256)token = urllib.parse.quote_plus(base64.b64encode(digest.digest()))print("{}={}-{}".format(separator, timestamp, token))
```

```
import hmacimport base64import timeimport urllibfrom hashlib import sha256
message = "/images/cat.jpg"secret = "mysecrettoken"separator = "verify"timestamp = str(int(time.time()))digest = hmac.new(secret, message + timestamp, sha256)param = urllib.urlencode({separator: '%s-%s' % (timestamp, base64.b64encode(digest.digest()))})print(param)
```

```
<?php$message = "/images/cat.jpg";$secret = "mysecrettoken";$separator = "verify";$timestamp = time();$token = urlencode(base64_encode(hash_hmac("sha256", $message . $timestamp, $secret, true)));echo("{$separator}={$timestamp}-{$token}");
```

For a full example in JavaScript (JS) or TypeScript (TS), refer to the Sign requests example in the Workers documentation.

Since the example JS/TS implementation is compatible with is_timed_hmac_valid_v0() function, requests authenticated using the provided source code can be verified with a WAF custom rule and the is_timed_hmac_valid_v0() function.

This will generate a URL parameter such as the following:

```
verify=1484063787-9JQB8vP1z0yc5DEBnH6JGWM3mBmvIeMrnnxFi3WtJLE%3D
```

You will need to append this parameter to the URL you are protecting:

```
/images/cat.jpg?verify=1484063787-9JQB8vP1z0yc5DEBnH6JGWM3mBmvIeMrnnxFi3WtJLE%3D
```

Warning

The authentication token parameter (verify=<VALUE> in the example) must be the last parameter in the query string.

### Test the generated token parameter

If you are on an Enterprise plan, you can test if URLs are being generated correctly on the origin server by doing the following:

1. Set the custom rule action to Log.
2. Check the sampled logs in Security Events.

## Protect several paths using the same secret

You can use the same secret key to protect several URI paths.

This is illustrated in the previous example, where http.request.uri is passed as the MessageMAC argument to the validation function.

Since http.request.uri includes the path to the asset and that value is extracted for each request, the validation function evaluates all request URIs to downloads.example.com using the same secret key.

Note that while you can use the same secret key to authenticate several paths, you must generate an HMAC token for each unique message you want to authenticate.

## Protect an entire URI path prefix with a single signature

You can protect an entire fixed-length URI path prefix with a single HMAC signature (it would also use the same secret). To achieve this, supply a URI path prefix (instead of the full URI path) and the original query string as the MessageMAC argument for the is_timed_hmac_valid_v0() function.

Use the substring() function to obtain the prefix from the full URI path.

In the following example, the URI path prefix requiring a single HMAC signature is always 51 characters long (x is a character placeholder):

```
/case-studies/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/
```

In this case, you would need to use a different HMAC signature for every different URI path prefix of length 51.

If you wanted to block requests for case study files failing the HMAC validation, you could create a custom rule similar to the following:

Rule expression:

```
(http.host eq "downloads.example.com" and starts_with(http.request.uri.path, "/case-studies") and not is_timed_hmac_valid_v0("mysecrettoken", concat(substring(http.request.uri.path, 0, 51), "?", http.request.uri.query), 10800, http.request.timestamp.sec, 1))
```

Action:

- Block

Example URI paths of valid incoming requests:

```
/case-studies/12345678-90ab-4cde-f012-3456789abcde/foobar-report.pdf?1755877101-5WOroVcDINdl2%2BQZxZFHJcJ6l%2Fep4HGIrX3DtSXzWO0%3D/case-studies/12345678-90ab-4cde-f012-3456789abcde/acme-corp.pdf?1755877101-5WOroVcDINdl2%2BQZxZFHJcJ6l%2Fep4HGIrX3DtSXzWO0%3D/case-studies/768bf477-22d5-4545-857d-b155510119ff/another-company-report.pdf?1755878057-jeMS5S1F3MIgxvL61UmiX4vODiWtuLfcPV6q%2B0Y3Rig%3D
```

The first two URI paths can use the same HMAC signature because they share the same 51-character prefix (/case-studies/12345678-90ab-4cde-f012-3456789abcde/) that is validated by the custom rule.

The third URI path needs a different HMAC signature, since the prefix is different.

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

## Exempt partners from Hotlink Protection

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/exempt-partners-hotlink-protection/](https://developers.cloudflare.com/waf/custom-rules/use-cases/exempt-partners-hotlink-protection/)

Page options # Exempt partners from Hotlink Protection

When enabled, Cloudflare Hotlink Protection blocks all HTTP referrers that are not part of your domain or zone. That presents a problem if you allow partners to use inline links to your assets.

## Allow requests from partners using custom rules

You can use custom rules to protect against hotlinking while allowing inline links from your partners. In this case, you will need to disable Hotlink Protection within the Scrape Shield app so that partner referrals are not blocked by that feature.

This example custom rule uses the http.referer field to target HTTP referrals from partner sites.

The not operator matches HTTP referrals that are not from partner sites, and the action blocks them:

- Expression: not (http.referer contains "example.com" or http.referer eq "www.example.net" or http.referer eq "www.cloudflare.com")
- Action: Block

## Allow requests from partners using Configuration Rules

Alternatively, you can create a configuration rule to exclude HTTP referrals from partner sites from Hotlink Protection. In this case, you would keep the Hotlink Protection feature enabled.

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

## Issue challenge for admin user in JWT claim based on attack score

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/check-jwt-claim-to-protect-admin-user/](https://developers.cloudflare.com/waf/custom-rules/use-cases/check-jwt-claim-to-protect-admin-user/)

Page options # Issue challenge for admin user in JWT claim based on attack score

Note

To use claims inside a JSON Web Token (JWT), you must first set up a token validation configuration in API Shield.

This example configures additional protection for requests with a JSON Web Token (JWT) with a user claim of admin, based on the request's attack score.

Create a custom rule that issues a Managed Challenge if the user claim in a JWT is admin and the attack score is below 40.

- Expression: (lookup_json_string(http.request.jwt.claims["<TOKEN_CONFIGURATION_ID>"][0], "user") eq "admin" and cf.waf.score < 40)
- Action: Managed Challenge

In this example, <TOKEN_CONFIGURATION_ID> is your token configuration ID found in JWT Validation and user is the JWT claim.

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

## Require a specific cookie

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-cookie/](https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-cookie/)

Page options # Require a specific cookie

To secure a sensitive area such as a development area, you can share a cookie with trusted individuals and then filter requests so that only users with that cookie can access your site.

Use the http.cookie field to target requests based on the presence of a specific cookie.

This example comprises two custom rules:

- The first rule targets requests to dev.www.example.com that have a specific cookie key, devaccess. As long as the value of the cookie key contains one of three authorized users — james, matt, or michael — the expression matches and the request is allowed, skipping all other custom rules.
- The second rule blocks all access to dev.www.example.com.

Since custom rules are evaluated in order, Cloudflare grants access to requests that satisfy rule 1 and blocks all other requests to dev.www.example.com:

Rule 1:

- Expression: (http.cookie contains "devaccess=james" or http.cookie contains "devaccess=matt" or http.cookie contains "devaccess=michael") and http.host eq "dev.www.example.com"
- Action: Skip:

All remaining custom rules
- All remaining custom rules

Rule 2:

- Expression: (http.host eq "dev.www.example.com")
- Action: Block

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

## Require known IP addresses in site admin area

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/site-admin-only-known-ips/](https://developers.cloudflare.com/waf/custom-rules/use-cases/site-admin-only-known-ips/)

Page options # Require known IP addresses in site admin area

If an attack compromises the administrative area of your website, the consequences can be severe. With custom rules, you can protect your site’s admin area by blocking requests for access to admin paths that do not come from a known IP address.

This example custom rule limits access to the WordPress admin area, /wp-admin/, by blocking requests that do not originate from a specified set of IP addresses:

- Expression: (not ip.src in {10.20.30.40 192.168.1.0/24} and starts_with(lower(http.request.uri.path), "/wp-admin"))
- Action: Block

To prevent attackers from successfully using a permutation of /wp-admin/ such as /wP-AdMiN/, the expression uses the lower() transformation function to convert the URI path to lowercase.

## Other resources

- Use case: Allow traffic from IP addresses in allowlist only

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

## Require specific HTTP headers

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-headers/](https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-headers/)

Page options # Require specific HTTP headers

Many organizations qualify traffic based on the presence of specific HTTP request headers. Use the Rules language HTTP request header fields to target requests with specific headers.

## Example 1: Require presence of HTTP header

This example custom rule uses the http.request.headers.names field to look for the presence of an X-CSRF-Token header. The lower() transformation function converts the header name to lowercase so that the expression is case-insensitive.

When the X-CSRF-Token header is missing, Cloudflare blocks the request.

- Expression: not any(lower(http.request.headers.names[*])[*] eq "x-csrf-token") and (http.request.full_uri eq "https://www.example.com/somepath")
- Action: Block

## Example 2: Require HTTP header with a specific value

This example custom rule uses the http.request.headers field to look for the presence of the X-Example-Header header and to get its value (if any). When the X-Example-Header header is missing or it does not have the value example-value, Cloudflare blocks the request.

- Expression: not any(http.request.headers["x-example-header"][*] eq "example-value") and (http.request.uri.path eq "/somepath")
- Action: Block

The keys in the http.request.headers field, corresponding to HTTP header names, are in lowercase.

In this example the header name is case-insensitive, but the header value is case-sensitive.

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

## Require specific HTTP ports

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-http-ports/](https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-http-ports/)

Page options # Require specific HTTP ports

By default, Cloudflare allows requests on a number of different HTTP ports.

You can target requests based on their HTTP port with the cf.edge.server_port field. Use the in comparison operator to target a set of ports.

This example custom rule blocks requests to www.example.com that are not on ports 80 or 443:

- Expression: (http.host eq "www.example.com" and not cf.edge.server_port in {80 443})
- Action: Block

Open server ports and blocked traffic

Due to the nature of Cloudflare's anycast network, ports other than 80 and 443 will be open so that Cloudflare can serve traffic for other customers on these ports. In general, Cloudflare makes available several different products on Cloudflare IPs ↗, so you can expect tools like Netcat and security scanners to report these non-standard ports as open in specific conditions. If you have questions on security compliance, review Cloudflare's certifications and compliance resources ↗ and contact your Cloudflare enterprise account manager for more information.

Custom rules and WAF Managed Rules can block traffic at the application layer (layer 7 in the OSI model ↗), preventing HTTP/HTTPS requests over non-standard ports from reaching the origin server.

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

## Stop R-U-Dead-Yet? (R.U.D.Y.) attacks

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/stop-rudy-attacks/](https://developers.cloudflare.com/waf/custom-rules/use-cases/stop-rudy-attacks/)

Page options # Stop R-U-Dead-Yet? (R.U.D.Y.) attacks

R-U-Dead-Yet (R.U.D.Y.) attacks accomplish denial of service (DoS) by submitting long form fields. Use custom rules to stop these attacks by blocking requests that do not have a legitimate session cookie.

This example combines three expressions to target HTTP POST requests that do not contain a legitimate authenticated session cookie:

- The first expression uses the http.request.uri.path field to target the paths to secure from R.U.D.Y.:
http.request.uri.path matches "(comment|conversation|event|poll)/create"
- The second uses a regular expression to match the format of a legitimate auth_session cookie. The not operator targets requests where that cookie is not formatted correctly:
not http.cookie matches "auth_session=[0-9a-zA-Z]{32}-[0-9]{10}-[0-9a-z]{6}"
- The third expression targets HTTP POST requests:
http.request.method eq "POST"

To generate the final custom rule expression for this example, the three expressions are combined into a compound expression using the and operator. When an HTTP POST request to any of the specified URIs does not contain a properly formatted auth_session cookie, Cloudflare blocks the request:

- Expression: (http.request.method eq "POST" and http.request.uri.path matches "(comment|conversation|event|poll)/create" and not http.cookie matches "auth_session=[0-9a-zA-Z]{32}-[0-9]{10}-[0-9a-z]{6}")
- Action: Block

Note

The matches operator requires a Cloudflare Business or Enterprise plan.

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

## Update custom rules for customers or partners

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/update-rules-customers-partners/](https://developers.cloudflare.com/waf/custom-rules/use-cases/update-rules-customers-partners/)

Page options # Update custom rules for customers or partners

You may want to adjust your custom rules to increase access by customers or partners.

Potential examples include:

- Removing rate limiting for an API
- Sharing brand assets and marketing materials

Warning

The example custom rules in this page can bypass Cloudflare's security features and are generally not recommended. Use with caution.

## Use ASN in custom rules

If a customer or partner is large enough, you could set up a custom rule based on an autonomous system number (ASN) ↗.

### Allow traffic by ASN

This example uses:

- The ip.src.asnum field to specify the general region.
- The cf.bot_management.score field to ensure partner traffic does not come from bots.

Example custom rule:

- Expression: (ip.src.asnum eq 64496 and cf.bot_management.score gt 30)
- Action: Skip:

All remaining custom rules
- All remaining custom rules

Note

Access to Bot Management requires a Cloudflare Enterprise plan with Bot Management.

### Adjust rules by ASN

This example custom rule uses:

- The ip.src.asnum field to specify the general region.
- The cf.bot_management.score field to check if the request comes from a human.

If a request meets these criteria, the custom rule will skip User Agent Blocking rules.

- Expression: (ip.src.asnum eq 64496 and cf.bot_management.score gt 50)
- Action: Skip:

User Agent Blocking
- User Agent Blocking

## Use IP addresses in custom rules

For smaller organizations, you could set up custom rules based on IP addresses.

### Allow traffic by IP address

This example:

- Specifies the source IP address and the host.
- Uses the cf.bot_management.score field to ensure requests are not high-risk traffic.

Example custom rule:

- Expression: (ip.src eq 203.0.113.1 and http.host eq "example.com" and cf.bot_management.score gt 30)
- Action: Skip:

All remaining custom rules
- All remaining custom rules

### Adjust rules by IP address

This example custom rule specifies the source IP address and the host.

If a request meets these criteria, the custom rule will skip rate limiting rules.

- Expression: (ip.src eq 203.0.113.1 and http.host eq "example.com")
- Action: Skip:

All remaining custom rules
- All remaining custom rules

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

## Custom rulesets

**來源**: [https://developers.cloudflare.com/waf/account/custom-rulesets/](https://developers.cloudflare.com/waf/account/custom-rulesets/)

Page options # Custom rulesets

Note

This feature requires an Enterprise plan with a paid add-on.

Custom rulesets are collections of custom rules that you can deploy at the account level.

Like custom rules at the zone level, custom rulesets allow you to control incoming traffic by filtering requests. You can apply a custom ruleset to all incoming traffic of your Enterprise domains or to a subset of incoming requests.

Refer to the following pages for more information on working with custom rulesets:

- Work with custom rulesets in the dashboard
- Work with custom rulesets using the API

For Terraform examples, refer to WAF custom rules configuration using Terraform.

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

## Request rate calculation

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/request-rate/](https://developers.cloudflare.com/waf/rate-limiting-rules/request-rate/)

Page options # Request rate calculation

Cloudflare keeps separate rate counters for rate limiting rules for each value combination of the rule characteristics.

Consider a rule configured with the following characteristics:

- IP address
- HTTP header x-api-key

In this case, two incoming requests with the same value for the HTTP header X-API-Key with different IP addresses are counted separately, since the value combination is different. Additionally, counters are not shared across data centers.

The counting model of this rate limiting rule is based on the number of incoming requests. Enterprise customers with Advanced Rate Limiting can also configure rules whose counting model is based on the complexity of serving incoming requests. Refer to Complexity-based rate limiting for more information.

Important notes

- Cloudflare currently does not support global rate limiting counters across the entire network — counters are not shared across data centers. This fact is especially relevant for customers that do not add the IP address as one of the rate limiting characteristics. The only exception is when Cloudflare has multiple data centers associated with a given geographical location. In this case, the rate limiting counters are shared between those specific data centers.
- The Cloudflare data center ID (cf.colo.id) is a mandatory characteristic of every rate limiting rule to ensure that counters are not shared across data centers. This characteristic does not appear in the rule configuration in the dashboard, but you must include it when creating rate limiting rules via API.
- The available characteristics depend on your Cloudflare plan. Refer to Availability for more information.

## Example A

Consider the following configuration for a rate limiting rule:

Rate limiting rule #1

If incoming requests match:
http.request.uri.path eq "/form" and any(http.request.headers["content-type"][*] eq "application/x-www-form-urlencoded")

Choose action: Block

Duration (mitigation timeout): 10 minutes

Requests: 1

Period: 10 seconds

With the same value of (characteristics):

- Data center ID (included by default when creating the rule in the dashboard)
- IP
- Headers > x-api-key

The following diagram shows how Cloudflare handles four incoming requests in the context of the above rate limiting rule.

Since request 1 matches the rule expression, the rate limiting rule is evaluated. Cloudflare defines a request counter for the values of the characteristics in the context of the rate limiting rule and sets the counter to 1. Since the counter value is within the established limits in Requests, the request is allowed.

Request 2 matches the rule expression and therefore Cloudflare evaluates the rate limiting rule. The values of the characteristics do not match any existing counter (the value of the X-API-Key header is different). Therefore, Cloudflare defines a separate counter in the context of this rule and sets it to 1. The counter value is within the request limit established in Requests, and so this request is allowed.

Request 3 matches the rule expression and has the same values for rule characteristics as request 1. Therefore, Cloudflare increases the value of the existing counter, setting it to 2. The counter value is now above the limit defined in Requests, and so request 3 gets blocked.

Request 4 does not match the rule expression, since the value for the Content-Type header does not match the value in the expression. Therefore, Cloudflare does not create a new rule counter for this request. Request 4 is not evaluated in the context of this rate limiting rule and is passed on to subsequent rules in the request evaluation workflow.

## Example B

Consider the following configuration for a rate limiting rule. The rule counting expression defines that the counter will increase by one when the response HTTP status code is 400:

Rate limiting rule #2

If incoming requests match:
http.request.uri.path eq "/form"

Choose action: Block

Duration (mitigation timeout): 10 minutes

Requests: 1

Period: 10 seconds

With the same value of (characteristics):

- Data center ID (included by default when creating the rule in the dashboard)
- IP
- Headers > x-api-key

Increment counter when:
http.request.uri.path eq "/form" and http.response.code eq 400

The following diagram shows how Cloudflare handles these four incoming requests received during a 10-second period in the context of the above rate limiting rule.

Since request 1 matches the rule expression, the rate limiting rule is evaluated. The request is sent to the origin, skipping any cached content, because the rate limiting rule includes a response field (http.response.code) in the counting expression. The origin responds with a 400 status code. Since there is a match for the counting expression, Cloudflare creates a request counter for the values of the characteristics in the context of the rate limiting rule, and sets this counter to 1.

Request 2 matches the rule expression and therefore Cloudflare evaluates the rate limiting rule. The request counter for the characteristics values is still within the maximum number of requests defined in Requests. The origin responds with a 200 status code. Since the response does not match the counting expression, the counter is not incremented, keeping its value (1).

Request 3 matches the rule expression and therefore Cloudflare evaluates the rate limiting rule. The request is still within the maximum number of requests defined in Requests. The origin responds with a 400 status code. There is a match for the counting expression, which sets the counter to 2.

Request 4 matches the rule expression and therefore Cloudflare evaluates the rate limiting rule. The request is no longer within the maximum number of requests defined in Requests (the counter has the value 2 and the maximum number of requests is 1). Cloudflare applies the action defined in the rate limiting rule configuration, blocking request 4 and any later requests that match the rate limiting rule for ten minutes.

## Complexity-based rate limiting

Note

Only available to Enterprise customers with Advanced Rate Limiting.

A complexity-based rate limiting rule performs rate limiting based on the complexity or cost of handling requests during a given period, instead of the number of requests in the same period.

A common use case is to score each request with an estimate of the cost (or complexity) required to serve that request. The rate limiting rule can then enforce a maximum limit on the total complexity that each client can put on the application over a given period, regardless of the total number of requests sent by that client.

When you configure a complexity-based rate limiting rule, the origin server must include an HTTP header in the response with its complexity score. This score corresponds to the complexity (or cost) of serving the current request. The score value must be between 1 and 1,000,000.

Complexity-based rate limiting rules must contain the following properties:

- Score per period: Maximum score per period. When this value is exceeded, the rule action will execute.
- Period: The period of time to consider when evaluating the request rate.
- Response header name: Name of HTTP header in the response, set by the origin server, with the score for the current request.

Cloudflare keeps counters with the total score of all requests with the same values for the rule characteristics that match the rule expression. The score increases by the value provided by the origin in the response when there is a match for the counting expression (by default, it is the same as the rule expression). When the total score is larger than the configured maximum score per period, the rule action is applied.

If the origin server does not provide the HTTP response header with a score value or if the score value is outside of the allowed range, the corresponding rate limiting counter will not be updated.

For an example of a complexity-based rate limiting rule, refer to Rule examples.

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

## Create a rate limiting rule in the dashboard

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/](https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/)

Page options # Create a rate limiting rule in the dashboard

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and zone.
2. Go to Security > WAF > Rate limiting rules.
3. To create a new empty rule, select Create rule. To duplicate an existing rule, select the three dots next to it > Duplicate.
4. Enter a descriptive name for the rule in Rule name.
5. In the Field drop-down, choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator.
6. (Optional) Under Cache status, disable Also apply rate limiting to cached assets to consider only the requests that reach the origin when determining the rate.
7. Under With the same characteristics, add one or more characteristics that will define the request counters for rate limiting purposes. Each value combination will have its own counter to determine the rate. For more information, refer to How Cloudflare determines the request rate.
8. (Optional) To define an expression that specifies the conditions for incrementing the rate counter, enable Use custom counting expression and set the expression. By default, the counting expression is the same as the rule expression. The counting expression can include response fields.
9. (Optional) In When rate exceeds, select between:

Request based: Rate limiting based on the number of incoming requests during a given period.
Complexity based: Rate limiting based on the complexity or cost of handling requests during a given period.

NoteComplexity-based rate limiting is only available to Enterprise customers with Advanced Rate Limiting. Other users will always use request-based rate limiting.
10. Request based: Rate limiting based on the number of incoming requests during a given period.
11. Complexity based: Rate limiting based on the complexity or cost of handling requests during a given period.
12. If you selected Request based in the previous step (or if you could not select the rate limiting method), enter a value for:

Requests: Maximum number of requests.
Period: Time period to consider when determining the rate.

If you selected Complexity based, enter a value for:

Score per period: Maximum score per period. When this value is exceeded, the rule action will execute.
Period: Time period to consider when determining the rate.
Response header name: Name of HTTP header in the response, set by the origin server, with the score for the current request.
13. Requests: Maximum number of requests.
14. Period: Time period to consider when determining the rate.
15. Score per period: Maximum score per period. When this value is exceeded, the rule action will execute.
16. Period: Time period to consider when determining the rate.
17. Response header name: Name of HTTP header in the response, set by the origin server, with the score for the current request.
18. Under Then take action, select the rule action from the Choose action drop-down list. For example, selecting Block tells Cloudflare to refuse requests in the conditions you specified when the request limit is reached.
19. (Optional) If you selected the Block action, you can configure a custom response for requests exceeding the configured rate limit.
20. Select the mitigation timeout in the Duration dropdown. This is the time period during which Cloudflare applies the select action once the rate is reached.
Enterprise customers with a paid add-on can throttle requests instead of applying the configured action for a selected duration. To throttle requests, under With the following behavior select Throttle requests over the maximum configured rate.
21. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

1. Log in to the Cloudflare dashboard ↗, and select your account and zone.
2. Go to Security > Security rules.
3. To create a new empty rule, select Create rule > Rate limiting rules. To duplicate an existing rule, select the three dots next to it > Duplicate.
4. Enter a descriptive name for the rule in Rule name.
5. In the Field drop-down, choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator.
6. (Optional) Under Cache status, disable Also apply rate limiting to cached assets to consider only the requests that reach the origin when determining the rate.
7. Under With the same characteristics, add one or more characteristics that will define the request counters for rate limiting purposes. Each value combination will have its own counter to determine the rate. Refer to How Cloudflare determines the request rate for more information.
8. (Optional) To define an expression that specifies the conditions for incrementing the rate counter, enable Use custom counting expression and set the expression. By default, the counting expression is the same as the rule expression. The counting expression can include response fields.
9. Under When rate exceeds, define the maximum number of requests and the time period to consider when determining the rate.
10. Under Then take action, select the rule action from the Choose action drop-down list. For example, selecting Block tells Cloudflare to refuse requests in the conditions you specified when the request limit is reached.
11. (Optional) If you selected the Block action, you can configure a custom response for requests exceeding the configured rate limit.
12. Select the mitigation timeout in the Duration dropdown. This is the time period during which Cloudflare applies the select action once the rate is reached.
Enterprise customers with a paid add-on can throttle requests instead of applying the configured action for a selected duration. To throttle requests, under With the following behavior select Throttle requests over the maximum configured rate.
13. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

## Configure a custom response for blocked requests

Note

This feature is only available on Pro plans and above.

When you select the Block action in a rule you can optionally define a custom response.

The custom response has three settings:

- With response type: Choose a content type or the default rate limiting response from the list. The available custom response types are the following:

























Dashboard valueAPI valueCustom HTML"text/html"Custom Text"text/plain"Custom JSON"application/json"Custom XML"text/xml"
- With response code: Choose an HTTP status code for the response, in the range 400-499. The default response code is 429.
- Response body: The body of the response. Configure a valid body according to the response type you selected. The maximum field size is 30 KB.

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

## Create a rate limiting rule via API

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/create-api/](https://developers.cloudflare.com/waf/rate-limiting-rules/create-api/)

Page options # Create a rate limiting rule via API

Use the Rulesets API to create a rate limiting rule via API.

A rate limiting rule is similar to a regular rule handled by the Ruleset Engine, but contains an additional ratelimit object with the rate limiting configuration. Refer to Rate limiting parameters for more information on this field and its parameters.

You must deploy rate limiting rules to the http_ratelimit phase entry point ruleset.

Rate limiting rules must appear at the end of the rules list.

If you are using Terraform, refer to Rate limiting rules configuration using Terraform.

## Create a rate limiting rule

To create a rate limiting rule for a zone, add a rule with a ratelimit object to the http_ratelimit phase entry point ruleset.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_ratelimit phase. You will need the zone ID for this task.
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add a rate limiting rule to the existing ruleset. Refer to the examples below for details.
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include your rate limiting rule in the rules array. Refer to Create ruleset for an example.

### Example A - Rate limiting based on request properties

This example adds a rate limiting rule to the http_ratelimit phase entry point ruleset for the zone with ID $ZONE_ID. The phase entry point ruleset already exists, with ID $RULESET_ID.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My rate limiting rule",    "expression": "(http.request.uri.path matches \"^/api/\")",    "action": "block",    "ratelimit": {        "characteristics": [            "cf.colo.id",            "ip.src",            "http.request.headers[\"x-api-key\"]"        ],        "period": 60,        "requests_per_period": 100,        "mitigation_timeout": 600    }  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

### Example B - Rate limiting with a custom response

This example adds a rate limiting rule to the http_ratelimit phase entry point ruleset for the zone with ID $ZONE_ID. The phase entry point ruleset already exists, with ID $RULESET_ID.

The new rule defines a custom response for requests blocked due to rate limiting.

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My rate limiting rule",    "expression": "(http.request.uri.path matches \"^/api/\")",    "action": "block",    "action_parameters": {        "response": {            "status_code": 403,            "content": "You have been rate limited.",            "content_type": "text/plain"        }    },    "ratelimit": {        "characteristics": [            "cf.colo.id",            "ip.src",            "http.request.headers[\"x-api-key\"]"        ],        "period": 60,        "requests_per_period": 100,        "mitigation_timeout": 600    }  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

### Example C - Rate limiting ignoring cached assets

This example adds a rate limiting rule to the http_ratelimit phase entry point ruleset for the zone with ID $ZONE_ID. The phase entry point ruleset already exists, with ID $RULESET_ID.

The new rule does not consider requests for cached assets when calculating the rate ("requests_to_origin": true).

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My rate limiting rule",    "expression": "(http.request.uri.path matches \"^/api/\")",    "action": "block",    "ratelimit": {        "characteristics": [            "cf.colo.id",            "ip.src",            "http.request.headers[\"x-api-key\"]"        ],        "period": 60,        "requests_per_period": 100,        "mitigation_timeout": 600,        "requests_to_origin": true    }  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

### Example D - Complexity-based rate limiting rule

Note

Complexity-based rate limiting is only available to Enterprise customers with Advanced Rate Limiting.

This example adds a rate limiting rule to the http_ratelimit phase entry point ruleset for the zone with ID $ZONE_ID. The phase entry point ruleset already exists, with ID $RULESET_ID.

The new rule is a complexity-based rate limiting rule that takes the my-score HTTP response header into account to calculate a total complexity score for the client. The counter with the total score is updated when there is a match for the rate limiting rule's counting expression (in this case, the same as the rule expression since counting_expression is an empty string). When this total score becomes larger than 400 during a period of 60 seconds (one minute), any later client requests will be blocked for a period of 600 seconds (10 minutes).

Create a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "My complexity-based rate limiting rule",    "expression": "(http.request.uri.path wildcard \"/graphql/*\")",    "action": "block",    "ratelimit": {        "characteristics": [            "cf.colo.id",            "http.request.headers[\"x-api-key\"]"        ],        "score_response_header_name": "my-score",        "score_per_period": 400,        "period": 60,        "mitigation_timeout": 600,        "counting_expression": ""    }  }'
```

To define a specific position for the new rule, include a position object in the request body according to the guidelines in Change the order of a rule in a ruleset.

For instructions on creating an entry point ruleset and defining its rules using a single API call, refer to Add rules to phase entry point rulesets.

## Next steps

Use the different operations in the Rulesets API to work with the rule you just created. The following table has a list of common tasks for working with rate limiting rules at the zone level:

| Task | Procedure |
| --- | --- |
| List all rules in ruleset | Use the Get a zone entry point ruleset operation with the http_ratelimit phase name to obtain the list of configured rate limiting rules and their IDs.For more information, refer to View a specific ruleset. |
| Update a rule | Use the Update a zone ruleset rule operation.You will need to provide the ruleset ID and the rule ID. To obtain these IDs, you can use the Get a zone entry point ruleset operation with the http_ratelimit phase name.For more information, refer to Update a rule in a ruleset. |
| Delete a rule | Use the Delete a zone ruleset rule operation.You will need to provide the ruleset ID and the rule ID. To obtain these IDs, you can use the Get a zone entry point ruleset operation with the http_ratelimit phase name.For more information, refer to Delete a rule in a ruleset. |

These operations are covered in the Ruleset Engine documentation. The Ruleset Engine powers different Cloudflare products, including rate limiting rules.

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

## Find appropriate rate limit

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/find-rate-limit/](https://developers.cloudflare.com/waf/rate-limiting-rules/find-rate-limit/)

Page options # Find appropriate rate limit

The Request rate analysis tab in Security Analytics displays data on the request rate for traffic matching the selected filters and time period. Use this tab to determine the most appropriate rate limit for incoming traffic matching the applied filters.

Note

The Request rate analysis tab is only available to Enterprise customers.

## User interface overview

The Request rate analysis tab is available at the zone level in Security > Analytics.

The main chart displays the distribution of request rates for the top 50 unique clients observed during the selected time interval (for example, 1 minute) in descending order. You can group the request rates by the following unique request properties:

- IP address
- JA3 fingerprint (only available to customers with Bot Management)
- IP & JA3 (only available to customers with Bot Management)
- JA4 fingerprint (only available to customers with Bot Management)

Note

For more information on how Cloudflare calculates the request rate of incoming traffic, refer to How Cloudflare determines the request rate.

## Determine an appropriate rate limit

### 1. Define the scope

1. Log in to the Cloudflare dashboard ↗, and select your account and zone.
2. Go to Security > Analytics.
3. In the Traffic analysis tab, select a specific time period:

To look at the regular rate distribution, specify a period with non-peak traffic.
To analyze the rate of offending visitors/bots, select a period corresponding to an attack.
4. To look at the regular rate distribution, specify a period with non-peak traffic.
5. To analyze the rate of offending visitors/bots, select a period corresponding to an attack.
6. Apply filters to analyze a particular situation in your application where you want to apply rate limiting (for example, filter by /login URL path).
7. (Optional) To focus on non-automated/human traffic, use the bot score quick filter in the sidebar.

### 2. Find the rate

1. Switch to the Request rate analysis tab.
2. Choose the request properties (JA3, IP, IP and JA3, or JA4) and the duration (1 min, 5 mins, or 1 hour) for your rate limit rule. The request properties you select will be used as rate limiting rule characteristics.
3. Use the slider in the chart to move the horizontal line defining the rate limit. While you move the slider up and down, check the impact of defining a rate limiting rule with the selected limit on the displayed traffic.

Note

Answering the following questions during your adjustments can help you with your analysis:

- "How many clients would have been caught by the rule and rate limited?"
- "Can I visually identify abusers with above-average rate vs. the long tail of average users?"

### 3. Validate your rate

1. Repeat the rate selection process described in the previous section, but selecting a portion of traffic where you know there was an attack or traffic peak. The rate you have chosen should block the outlier traffic during the attack and allow traffic during regular periods.
2. (Optional) Check the sampled logs to verify the fingerprints and filters you selected.

### 4. Create a rate limiting rule

1. In the Request rate analysis tab, select Create rate limit rule to go to the rate limiting creation page with your filters, characteristics, and selected rate limit pre-populated.
2. Select the rule action. Depending on your needs, you can set the rule to log, challenge, or block requests exceeding the selected threshold.
It is recommended that you first deploy the rule with the Log action to validate the threshold, and change the action later to block or challenge incoming requests when you are confident about the rule behavior.
3. To save and deploy your rate limiting rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

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

## Rate limiting parameters

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)

Page options # Rate limiting parameters

The available rate limiting rule parameters are described in the following sections.

## Parameter reference

### If incoming requests match

- Data type: String
- Field name in the API: expression (rule field)

Defines the criteria for the rate limiting rule to match a request.

### Also apply rate limiting to cached assets

- Data type: Boolean
- Field name in the API: requests_to_origin (optional, with the opposite meaning of the Cloudflare dashboard option)

If this parameter is disabled (or when the requests_to_origin API field is set to true), only the requests going to the origin (that is, requests that are not cached) will be considered when determining the request rate.

In some cases, you cannot disable the Also apply rate limiting to cached assets parameter due to configuration restrictions. Refer to Configuration restrictions for details.

### With the same characteristics

- Data type: Array<String>
- Field name in the API: characteristics

Set of parameters defining how Cloudflare tracks the request rate for the rule.

Use one or more of the following characteristics:

| Dashboard value | API value | Notes |
| --- | --- | --- |
| N/A(implicitly included) | cf.colo.id(mandatory) | Do not use in expressions |
| IP | ip.src | Incompatible with IP with NAT support |
| IP with NAT support | cf.unique_visitor_id | Incompatible with IP |
| Header value of (enter header name) | http.request.headers["<header_name>"] | Use lowercased header name in API and Missing field versus empty value |
| Cookie value of (enter cookie name) | http.request.cookies["<cookie_name>"] | Recommended configurations and Missing field versus empty value |
| Query value of (enter parameter name) | http.request.uri.args["<query_param_name>"] | Missing field versus empty value |
| Host | http.host |  |
| Path | http.request.uri.path |  |
| AS Num | ip.src.asnum |  |
| Country | ip.src.country |  |
| JA3 Fingerprint | cf.bot_management.ja3_hash |  |
| JA4 | cf.bot_management.ja4 |  |
| JSON string value of (enter key) | lookup_json_string(http.request.body.raw, "<key>") | Missing field versus empty value and lookup_json_string() function reference |
| JSON integer value of (enter key) | lookup_json_integer(http.request.body.raw, "<key>") | Missing field versus empty value and lookup_json_integer() function reference |
| Form input value of (enter field name) | http.request.body.form["<input_field_name>"] | Missing field versus empty value |
| JWT claim of (enter token configuration ID, claim name) | lookup_json_string( http.request.jwt.claims["<token_configuration_id>"][0], "<claim_name>") | Requirements for claims in JWT, missing field versus empty value and JWT Validation reference |
| Body | http.request.body.raw |  |
| Body size (select operator, enter size) | http.request.body.size |  |
| Custom (enter expression) | Enter a custom expression. You can use a function such as substring() or lower(), or enter a more complex expression. | Functions |

The available characteristics depend on your Cloudflare plan. Refer to Availability for more information.

Warning

For important details about these characteristics, refer to Notes about rate limiting characteristics.

### Increment counter when

- Data type: String
- Field name in the API: counting_expression (optional)

Only available in the Cloudflare dashboard when you enable Use custom counting expression.

Defines the criteria used for determining the request rate. By default, the counting expression is the same as the rule matching expression (defined in If incoming requests match). This default is also applied when you set this field to an empty string ("").

The counting expression can include HTTP response fields. When there are response fields in the counting expression, the counting will happen after the response is sent.

In some cases, you cannot include HTTP response fields in the counting expression due to configuration restrictions. Refer to Configuration restrictions for details.

The counting expression does not extend the rule expression

If you set a custom counting expression, it will not automatically extend the rule matching expression. Therefore, you may wish to include the matching expression in the counting expression.

For example, you might want to perform rate limiting for clients sending more than five requests to /api/ resulting in a 403 HTTP status code from the origin server. In this case, the matching expression would be starts_with(http.request.uri.path, "/api/") and the counting expression would be http.response.code eq 403 and starts_with(http.request.uri.path, "/api/"). If the counting expression did not include the matching expression (that is, if you had set the counting expression to http.response.code eq 403), any response with a 403 status code on any URL would increase the counter.

### When rate exceeds

- Field name in the API: N/A (different API fields required according to the selected option)

The rate limiting counting can be:

- Request based: Performs rate limiting based on the number of incoming requests during a given period. This is the only counting method when complexity-based rate limiting is not available.
- Complexity based: Performs rate limiting based on the complexity or cost of handling requests during a given period. Only available to Enterprise customers with Advanced Rate Limiting.

### When rate exceeds > Requests

- Data type: Integer
- Field name in the API: requests_per_period

The number of requests over the period of time that will trigger the rule. Applies to request-based rate limiting.

### When rate exceeds > Period

- Data type: Integer
- Field name in the API: period

The period of time to consider (in seconds) when evaluating the request rate. The available values vary according to your Cloudflare plan.

The available API values are: 10, 60 (one minute), 120 (two minutes), 300 (five minutes), 600 (10 minutes), or 3600 (one hour).

### When rate exceeds > Score per period

- Data type: Integer
- Field name in the API: score_per_period

Maximum score per period. When this value is exceeded, the rule action will execute. Applies to complexity-based rate limiting.

### When rate exceeds > Response header name

- Data type: String
- Field name in the API: score_response_header_name

Name of HTTP header in the response, set by the origin server, with the score for the current request. Applies to complexity-based rate limiting.

### Then take action

- Data type: String
- Field name in the API: action (rule field)

Action to perform when the rate specified in the rule is reached.

Use one of the following values in the API: block, challenge, js_challenge, managed_challenge, or log.

If you select the Block action, you can define a custom response using the following parameters:

- With response type
- With response code
- Response body

#### With response type (for Block action)

- Data type: String
- Field name in the API: response > content_type (optional)

Defines the content type of a custom response when blocking a request due to rate limiting. Only available when you set the rule action to Block.

Available API values: application/json, text/html, text/xml, or text/plain.

#### With response code (for Block action)

- Data type: Integer
- Field name in the API: response > status_code (optional)

Defines the HTTP status code returned to the visitor when blocking the request due to rate limiting. Only available when you set the rule action to Block.

You must enter a value between 400 and 499. The default value is 429 (Too many requests).

#### Response body (for Block action)

- Data type: String
- Field name in the API: response > content (optional)

Defines the body of the returned HTTP response when the request is blocked due to rate limiting. Only available when you set the rule action to Block.

The maximum field size is 30 KB.

### For duration

- Data type: Integer
- Field name in the API: mitigation_timeout

Once the rate is reached, the rate limiting rule applies the rule action to further requests for the period of time defined in this field (in seconds).

In the dashboard, select one of the available values, which vary according to your Cloudflare plan. The available API values are: 0, 10, 60 (one minute), 120 (two minutes), 300 (five minutes), 600 (10 minutes), 3600 (one hour), or 86400 (one day).

Customers on Free, Pro, and Business plans cannot select a duration when using a challenge action — their rate limiting rule will always perform request throttling for these actions. With request throttling, you do not define a duration. When visitors pass a challenge, their corresponding request counter is set to zero. When visitors with the same values for the rule characteristics make enough requests to trigger the rate limiting rule again, they will receive a new challenge.

Enterprise customers can always configure a duration (or mitigation timeout), even when using one of the challenge actions.

Notes for API users

- If you are on a Free, Pro, or Business plan and are using the API, you must enable request throttling by setting the mitigation_timeout value to 0 (zero) when using the actions managed_challenge, js_challenge, or challenge.
- Enterprise customers can use a mitigation_timeout value greater than or equal to 0 (zero), regardless of the rate limiting action they select.

### With the following behavior

- Data type: Integer
- Field name in the API: mitigation_timeout

Defines the exact behavior of the selected action.

Note

Only Enterprise customers can throttle requests using the Block action.

Other users can throttle requests using a challenge action, or perform the action during a period of time. Refer to For duration for details.

The action behavior can be one of the following:

- Perform action during the selected duration: Applies the configured action to all requests received during the selected duration. To configure this behavior via API, set mitigation_timeout to a value greater than zero. Refer to For duration for more information.
- Throttle requests over the maximum configured rate: Applies the selected action to incoming requests over the configured limit, allowing other requests. To configure this behavior via API, set mitigation_timeout to 0 (zero).

## Notes about rate limiting characteristics

### Use cases of IP with NAT support

Use IP with NAT support to handle situations such as requests under NAT sharing the same IP address. Cloudflare uses a variety of privacy-preserving techniques to identify unique visitors, which may include use of session cookies. Refer to Cloudflare Cookies for details.

### Incompatible characteristics

You cannot use both IP with NAT support and IP as characteristics of the same rate limiting rule.

### Do not use cf.colo.id as a field in expressions

You should not use the cf.colo.id characteristic (data center ID) as a field in rule expressions. Additionally, cf.colo.id values may change without warning. For more information about this rate limiting characteristic, refer to How Cloudflare determines the request rate.

### Use a lowercased header name (for API users)

If you use the Header value of characteristic in an API request (with http.request.headers["<header_name>"]), you must enter the header name in lower case, since Cloudflare normalizes header names on the Cloudflare global network.

### Missing field versus empty value

If you use the Header value of, Cookie value of, Query value of, JSON string value of, lookup_json_integer(...), or Form input value of characteristic and the specific header/cookie/parameter/JSON key/form field name is not present in the request, the rate limiting rule may still apply to the request, depending on your counting expression.

If you do not filter out such requests, there will be a specific request counter for requests where the field is not present, which will be different from the request counter where the field is present with an empty value.

For example, to consider only requests where a specific HTTP header is present in the context of a specific rate limiting rule, adjust the rule counting expression so it contains something similar to the following:

and len(http.request.headers["<header_name>"]) > 0

Where <header_name> is the same header name used as a rate limiting characteristic.

### Recommended configurations when using Cookie value of

If you use Cookie value of as a rate limiting rule characteristic, follow these recommendations:

- Create a custom rule that blocks requests with more than one value for the cookie.
- Validate the cookie value at the origin before performing any demanding server operations.

### Requirements for using claims inside a JSON Web Token (JWT)

To use claims inside a JSON Web Token (JWT), you must first set up a token validation configuration in API Shield.

## Configuration restrictions

- If the rule expression includes custom lists, you must enable the Also apply rate limiting to cached assets parameter.
- The rule counting expression, defined in the Increment counter when parameter, cannot include both HTTP response fields and custom lists. If you use custom lists, you must enable the Also apply rate limiting to cached assets parameter.

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

## Rule examples

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/use-cases/](https://developers.cloudflare.com/waf/rate-limiting-rules/use-cases/)

Page options # Rule examples

The examples below include sample rate limiting rule configurations.

## Example 1

The following rate limiting rule performs rate limiting on incoming requests from the US addressed at the login page, except for one allowed IP address.

Expression:
(http.request.uri.path eq "/login" and ip.src.country eq "US" and ip.src ne 192.0.0.1)

Rule characteristics:

- Data center ID (included by default when creating the rule in the dashboard)
- IP Address

## Example 2

The following rate limiting rule performs rate limiting on incoming requests with a given base URI path, incrementing on the IP address and the provided API key.

Expression:
(http.request.uri.path contains "/product" and http.request.method eq "POST")

Rule characteristics:

- Data center ID (included by default when creating the rule in the dashboard)
- IP Address
- Header value of > x-api-key

## Example 3

The following rate limiting rule performs rate limiting on requests targeting multiple URI paths in two hosts, excluding known bots. The request rate is based on IP address and User-Agent values.

Expression:
(http.request.uri.path eq "/store" or http.request.uri.path eq "/prices") and (http.host eq "mystore1.com" or http.host eq "mystore2.com") and not cf.client.bot

Rule characteristics:

- Data center ID (included by default when creating the rule in the dashboard)
- IP Address
- Header value of > user-agent

## Example 4

Note

Complexity-based rate limiting is only available to Enterprise customers with Advanced Rate Limiting.

The following rate limiting rule performs complexity-based rate limiting. The rule takes into account the my-score HTTP response header provided by the origin server to calculate a total complexity score for the client with the provided API key.

The counter with the total score is updated when there is a match for the rate limiting rule's counting expression (in this case, the same as the rule expression since a counting expression was not provided). When this total score becomes larger than 400 during a period of one minute, any later client requests will be blocked for a period of 10 minutes.

Expression:
(http.request.uri.path wildcard "/graphql/*")

Rule characteristics:

- Data center ID (included by default when creating the rule in the dashboard)
- Header value of > x-api-key

When rate exceeds: Complexity based

- Score per period: 400
- Period: 1 minute
- Response header name: my-score

Then take action:

- Choose action: Block

With the following behavior: Block for the selected duration

- Duration: 10 minutes

For an API example with this rule configuration, refer to Create a rate limiting rule via API.

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

## Rate limiting best practices

**來源**: [https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/](https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/)

Page options # Rate limiting best practices

The following sections cover typical rate limiting configurations for common use cases. You can combine the provided example rules and adjust them to your own scenario.

The main use cases for rate limiting are the following:

- Enforce granular access control to resources. Includes access control based on criteria such as user agent, IP address, referrer, host, country, and world region.
- Protect against credential stuffing and account takeover attacks.
- Limit the number of operations performed by individual clients. Includes preventing scraping by bots, accessing sensitive data, bulk creation of new accounts, and programmatic buying in ecommerce platforms.
- Protect REST APIs from resource exhaustion (targeted DDoS attacks) and resources from abuse in general.
- Protect GraphQL APIs by preventing server overload and limiting the number of operations.

## Enforcing granular access control

### Limit by user agent

A common use case is to limit the rate of requests performed by individual user agents. The following example rule allows a mobile app to perform a maximum of 100 requests in 10 minutes. You could also create a separate rule limiting the rate for desktop browsers.

| Setting | Value |
| --- | --- |
| Matching criteria | User Agent equals MobileApp |
| Expression | http.user_agent eq "MobileApp" |
| Counting characteristics | IP |
| Rate (Requests / Period) | 100 requests / 10 minutes |
| Action | Managed Challenge |

### Allow specific IP addresses or ASNs

Another use case when controlling access to resources is to exclude or include IP addresses or Autonomous System Numbers (ASNs) from a rate limiting rule.

The following example rule allows up to 10 requests per minute from the same IP address doing a GET request for /status, as long as the visitor's IP address is not included in the partner_ips IP list.

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /status and Request Method equals GET and IP Source Address is not in list partner_ips |
| Expression | http.request.uri.path eq "/status" and http.request.method eq "GET" and not ip.src in $partner_ips |
| Counting characteristics | IP |
| Rate (Requests / Period) | 10 requests / 1 minute |
| Action | Managed Challenge |

### Limit by referrer

Some applications receive requests originated by other sources (for example, used by advertisements linking to third-party pages). You may wish to limit the number of requests generated by individual referrer pages to manage quotas or avoid indirect DDoS attacks.

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /status and Request Method equals GET |
| Expression | http.request.uri.path eq "/status" and http.request.method eq "GET" |
| Counting characteristics | Header (Referer) 1 |
| Rate (Requests / Period) | 100 requests / 10 minutes |
| Action | Block |

This example rule requires Advanced Rate Limiting.

### Limit by destination host

SaaS applications or customers using Cloudflare SSL for SaaS might have thousands of hosts under the same zone, which makes creating individual rules per host impractical. To overcome this, you can create a rate limiting rule that uses the host as a counting characteristic.

The following example rule will track the rate of requests to the /login endpoint for each host:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /login and Request Method equals GET |
| Expression | http.request.uri.path eq "/login" and http.request.method eq "GET" |
| Counting characteristics | IP and Host |
| Rate (Requests / Period) | 10 requests / 10 minutes |
| Action | Block |

This example rule requires Advanced Rate Limiting.

## Protecting against credential stuffing

A typical use case of rate limiting is to protect a login endpoint against attacks such as credential stuffing ↗. The following example contains three different rate limiting rules with increasing penalties to manage clients making too many requests.

Rule #1

| Setting | Value |
| --- | --- |
| Matching criteria | Hostname equals example.com and URI Path equals /login and Request Method equals POST |
| Expression | http.host eq "example.com" and http.request.uri.path eq "/login" and http.request.method eq "POST" |
| Counting characteristics | IP |
| Increment counter when | URI Path equals /login and Method equals POST and Response code is in (401, 403) |
| Counting expression | http.request.uri.path eq "/login" and http.request.method eq "POST" and http.response.code in {401 403} |
| Rate (Requests / Period) | 4 requests / 1 minute |
| Action | Managed Challenge |

Rule #2

| Setting | Value |
| --- | --- |
| Matching criteria | Hostname equals example.com and URI Path equals /login and Request Method equals POST |
| Expression | http.host eq "example.com" and http.request.uri.path eq "/login" and http.request.method eq "POST" |
| Counting characteristics | IP |
| Increment counter when | URI Path equals /login and Request Method equals POST and Response Status Code is in (401, 403) |
| Counting expression | http.request.uri.path eq "/login" and http.request.method eq "POST" and http.response.code in {401 403} |
| Rate (Requests / Period) | 10 requests / 10 minutes |
| Action | Managed Challenge |

Rule #3

| Setting | Value |
| --- | --- |
| Matching criteria | Host equals example.com |
| Expression | http.host eq "example.com" |
| Counting characteristics | IP |
| Increment counter when | URI Path equals /login and Request Method equals POST and Response Status Code is in (401, 403) |
| Counting expression | http.request.uri.path eq "/login" and http.request.method eq "POST" and http.response.code in {401 403} |
| Rate (Requests / Period) | 20 requests / 1 hour |
| Action | Block for 1 day |

These example rules require a Business plan or above.

Rule #1 allows up to four requests per minute, after which a Managed Challenge is triggered. This configuration allows legitimate customers a few attempts to remember their password. If an automated actor makes several requests, that client will likely be blocked by an unsolved Managed Challenge. On the other hand, if a human gets and passes the challenge when reaching rule #1's rate limit, rule #2 will provide the next level of protection, allowing for up to 10 requests over the next 10 minutes. For clients exceeding this second threshold, rule #3 (the most severe) will apply, blocking the client for one day.

These three rules have a counting expression separate from the rule expression (also known as mitigation expression). When you configure a separate counting expression, the matching criteria will only be used when an action is triggered. In the counting expression you can include conditions based on the HTTP response status code and HTTP response headers, therefore integrating rate limiting with your backend logic.

You can also decide to have two different expressions — a counting expression and a rule/mitigation expression — to define:

1. The requests used to compute the rate.
2. The requests actually acted upon.

For example, rule #3 computes the rate considering POST requests to /login that returned a 401 or 403 HTTP status code. However, when the rate limit is exceeded, Cloudflare blocks every request to the example.com host generated by the same IP. For more information on counting expressions, refer to How Cloudflare determines the request rate.

Configuring additional protection

Login endpoints are also commonly protected against the use of exposed credentials and bot abuse.

## Limiting the number of operations

You can use rate limiting to limit the number of operations performed by a client. The exact rule providing this protection will depend on your application. The following examples address content scraping ↗ via query string parameters or JSON body.

### Prevent content scraping (via query string)

In this example, clients perform operations (such as looking up prices and adding to basket) on an ecommerce website using different query string parameters. For example, a typical request sent by a client could be similar to the following:

```
GET https://store.com/merchant?action=lookup_price&product_id=215Cookie: session_id=12345
```

Your security team might want to consider setting up a limit on the number of times a client can lookup prices to prevent bots — which may have eluded Cloudflare Bot Management — from scraping the store's entire catalog.

Rule #1

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant and URI Query String contains action=lookup_price |
| Expression | http.request.uri.path eq "/merchant" and http.request.uri.query contains "action=lookup_price" |
| Counting characteristics | IP |
| Rate (Requests / Period) | 10 requests / 2 minutes |
| Action | Managed Challenge |

Rule #2

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant and URI Query String contains action=lookup_price |
| Expression | http.request.uri.path eq "/merchant" and http.request.uri.query contains "action=lookup_price" |
| Counting characteristics | IP |
| Rate (Requests / Period) | 20 requests / 5 minute |
| Action | Block |

These two rate limiting rules match requests performing a selected action (look up price, in this example) and use IP as the counting characteristic. Similarly to the previous /login example, the two rules will help reduce false positives in case of persistent (but legitimate) visitors.

To limit the lookup of a specific product_id via query string parameter, you could add that specific query parameter as a counting characteristic, so that the rate is calculated based on all the requests, regardless of the client. The following example rule limits the number of lookups for each product_id to 50 requests in 10 seconds.

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant |
| Expression | http.request.uri.path eq "/merchant" |
| Counting characteristics | Query (product_id) |
| Rate (Requests / Period) | 50 requests / 10 seconds |
| Action | Block |

This example rule requires Advanced Rate Limiting.

You could follow the same pattern of rate limiting rules to protect applications handling reservations and bookings.

### Prevent content scraping (via body)

Consider an application that handles the operation and its parameters through the request body in JSON format. For example, the lookup_price operation could look like the following:

```
POST https://api.store.com/merchantCookie: session_id=12345
Body:{  "action": "lookup_price",  "product_id": 215}
```

In this scenario, you could write a rule to limit the number of actions from individual sessions:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant and JSON String action equals lookup_price |
| Expression | http.request.uri.path eq "/merchant" and lookup_json_string(http.request.body.raw, "action") eq "lookup_price" |
| Counting characteristics | Cookie (session_id) |
| Rate (Requests / Period) | 10 requests / 2 minutes |
| Action | Managed Challenge |

This example rule requires Advanced Rate Limiting and payload inspection.

You could also limit the number of lookups of each product_id regardless of the client making the requests by deploying a rule like the following:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant and JSON field action equals lookup_price |
| Expression | http.request.uri.path eq "/merchant" and lookup_json_string(http.request.body.raw, "action") eq "lookup_price" |
| Counting characteristics | JSON field (product_id) |
| Rate (Requests / Period) | 50 requests / 10 seconds |
| Action | Block |

This example rule requires Advanced Rate Limiting and payload inspection.

Note

If the request body is not JSON, you can use the http.request.body.raw field and regular expressions (along with the matches operator) to achieve the same goal.

### Limit requests from bots

A general approach to identify traffic from bots is to rate limit requests that trigger a large volume of 403 or 404 response status codes from the origin server. This usually indicates automated activity from scraping applications.

In this situation, you could configure a rule similar to the following:

| Setting | Value |
| --- | --- |
| Matching criteria | Hostname equals example.com |
| Expression | http.host eq "example.com" |
| Counting characteristics | IP |
| Increment counter when | Response Status Code is in (401, 403) |
| Counting expression | http.response.code in {401 403} |
| Rate (Requests / Period) | 5 requests / 3 minutes |
| Action | Managed Challenge |

This example rule requires a Business plan or above.

To control the rate of actions performed by automated sources, consider use rate limiting rules together with Bot Management. With Bot Management, you can use the bot score as part of the matching criteria to apply the rule only to automated or likely automated traffic. For example, you can use a maximum score (or threshold) of 30 for likely automated traffic and 10 for automated traffic.

If your application tracks sessions using a cookie, you can use the cookie to set the rate limiting context (that is, use it as a counting characteristic). By setting the rate limiting characteristic to Cookie, the rule will group together requests from different IP addresses but belonging to the same session, which is a common scenario when dealing with a bot network performing a distributed attack.

Rule #1

| Setting | Value |
| --- | --- |
| Matching criteria | Bot Score less than 30 and URI Query String contains action=delete |
| Expression | cf.bot_management.score lt 30 and http.request.uri.query contains "action=delete" |
| Counting characteristics | Cookie (session_id) |
| Rate (Requests / Period) | 10 requests / 1 minute |
| Action | Managed Challenge |

Rule #2

| Setting | Value |
| --- | --- |
| Matching criteria | Bot Score less than 10 and URI Query String contains action=delete |
| Expression | cf.bot_management.score lt 10 and http.request.uri.query contains "action=delete" |
| Counting characteristics | Cookie (session_id) |
| Rate (Requests / Period) | 20 requests / 5 minute |
| Action | Block |

These example rules require Advanced Rate Limiting and Bot Management.

If the application does not use a session cookie, you can use JA3 fingerprints to identify individual clients. A JA3 fingerprint is a unique identifier, available to customers with Bot Management, that allows Cloudflare to identify requests coming from the same client. All clients have an associated fingerprint, whether they are automated or not.

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /merchant and Bot Score less than 10 |
| Expression | http.request.uri.path eq "/merchant" and cf.bot_management.score lt 10 |
| Counting characteristics | JA3 Fingerprint |
| Rate (Requests / Period) | 10 requests / 1 minute |
| Action | Managed Challenge |

This example rule requires Advanced Rate Limiting and Bot Management.

## Protecting REST APIs

APIs can put significant strain on the application backend because API requests can be expensive to compute or serve. These requests may also require complex operations (such as data processing and large data lookups) that, if abused, can eventually bring down an origin server.

### Prevent volumetric attacks

Advanced Rate Limiting can mitigate many types of volumetric attacks, like DDoS attacks, mass assignment, and data exfiltration.

A common concern is to limit POST actions. For authenticated traffic, you can use API Discovery to identify a suitable rate of request per endpoint, and then create a rate limiting rule like the following:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /endpoint1 and Request Method equals POST |
| Expression | http.request.uri.path eq "/endpoint1" and http.request.method eq "POST" |
| Counting characteristics | Header (x-api-key) |
| Rate (Requests / Period) | As suggested by API Discovery or assessed by analyzing past traffic. |
| Action | Block |

This example rule requires Advanced Rate Limiting. API Discovery requires an additional license.

The counting characteristic can be any header, key, token, cookie, query parameter, or even JSON body field, since some APIs include a session ID or user ID as part of the JSON body. Refer to the following sections for additional information:

- If your unique identifier is in the URI path, refer to Protect resources.
- If your unique identifier is in the JSON body, refer to Prevent content scraping (via body).

### Protect resources

GET requests can also create excessive strain on an application or have an impact on costly resources, such as bandwidth. For example, consider an application with a large amount of stored files (such as images) where clients can download a file by accessing their specific URL:

```
GET https://api.store.com/files/<FILE_ID>Header: x-api-key=9375
```

You probably wish to limit the number of downloads to avoid abuse, but you do not want to write individual rules for each file, given the size of the data storage. In this case, you could write a rule such as the following:

| Setting | Value |
| --- | --- |
| Matching criteria | Hostname equals api.example.com and Request Method equals GET |
| Expression | http.host eq "api.example.com" and http.request.method eq "GET" |
| Counting characteristics | Path |
| Rate (Requests / Period) | As suggested by API Discovery or assessed by analyzing past traffic. |
| Action | Block |

This example rule requires Advanced Rate Limiting.

The rule defines a limit of 10 downloads in 10 minutes for every file under https://api.store.com/files/*. By using Path as the rule characteristic, you avoid having to write a new rule every time there is a new uploaded file with a different <FILE_ID>. With this rule, the rate is computed on every request, regardless of their source IP or session identifier.

You could also combine Path with the x-api-key header (or IP, if you do not have a key or token) to set the maximum number of downloads that a specific client, as identified by x-api-key, can make of a given file:

| Setting | Value |
| --- | --- |
| Matching criteria | Hostname equals api.store.com and Request Method equals GET |
| Expression | http.host eq "api.example.com" and http.request.method eq "GET" |
| Counting characteristics | Path and Header (x-api-key) |
| Rate (Requests / Period) | As suggested by API Discovery or assessed by analyzing past traffic. |
| Action | Block |

This example rule requires Advanced Rate Limiting.

## Protecting GraphQL APIs

Preventing server overload for GraphQL APIs can be different from preventing overload for RESTful APIs. One of the biggest challenges posed by applications built on GraphQL is that a single path manages all queries to the server, and every request is usually a POST operation. This prevents different rate limits for different API use cases based on the HTTP method and URI path.

However, instead of using the method and path like a RESTful API, the purpose of the request is usually embedded in the body, which has information on what data the client wants to fetch or mutate (according to GraphQL's terminology ↗ for server-side data modification), along with any additional data required to carry out the action.

To prevent server overload, consider the following approaches:

1. Limit the number of times a particular user can call the same GraphQL operation name.
2. Limit the total amount of query complexity any given user is allowed to request.
3. Limit any individual request's query complexity.

The following examples are based on an application that accepts reviews for movies. A GraphQL request could look like the following:

```
POST https://moviereviews.example.com/graphqlCookie: session_id=12345
Body:{  "data": {    "createReview": {      "stars": 5,      "commentary": "This is a great movie!"    }  }}
```

### Limit the number of operations

To limit the rate of actions, you could use the following rule:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path equals /graphql and Body contains createReview |
| Expression | http.request.uri.path eq "/graphql" and http.request.body.raw contains "createReview" |
| Counting characteristics | Cookie (session_id) |
| Rate (Requests / Period) | 5 requests / 1 hour |
| Action | Block |

This example rule requires Advanced Rate Limiting and payload inspection.

### Limit the total amount of query complexity

The complexity necessary to handle a GraphQL request can vary significantly. Since the API uses a single endpoint, it is difficult to figure out the complexity of each request before it has been served.

To protect the origin server from resource exhaustion, rather than limiting the number of requests you need to limit the amount of complexity necessary to handle a single client over a period of time. Cloudflare Rate Limiting allows you to create rules that track complexity over time and block subsequent requests after reaching a complexity budget or limit.

This type of rate limiting requires that the server scores every served request according to the request's complexity. Additionally, the server must add this score to the response as an HTTP header. Then, the rate limiting mechanism will use this information to update the budget for that specific client.

For example, the following rule defines a total complexity budget of 1,000 per hour:

| Setting | Value |
| --- | --- |
| Matching criteria | URI Path contains /graphql |
| Expression | http.request.uri.path eq "/graphql" |
| Counting characteristics | Cookie (session_id) |
| Score per period | 1,000 |
| Period | 1 hour |
| Response header name | score |
| Action | Block |

This example rule requires Advanced Rate Limiting and payload inspection.

When the origin server processes a request, it adds a score HTTP header to the response with a value representing how much work the origin has performed to handle it — for example, 100. In the next hour, the same client can perform requests up to an additional budget of 900. As soon as this budget is exceeded, later requests will be blocked until the timeout expires.

### Limit any individual query’s complexity

API Shield customers can use GraphQL malicious query protection to protect their GraphQL APIs. GraphQL malicious query protection scans your GraphQL traffic for queries that could overload your origin and result in a denial of service. You can build rules that limit the query depth and size of incoming GraphQL queries in order to block suspiciously large or complex queries.

Refer to API Shield documentation ↗ for more information on GraphQL malicious query protection.

## Footnotes

1. The HTTP header name uses a misspelling of "referrer". ↩

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

## Managed Rules

**來源**: [https://developers.cloudflare.com/waf/managed-rules/](https://developers.cloudflare.com/waf/managed-rules/)

Page options # Managed Rules

Cloudflare provides pre-configured managed rulesets that protect against web application exploits such as the following:

- Zero-day vulnerabilities
- Top-10 attack techniques
- Use of stolen/leaked credentials
- Extraction of sensitive data

Managed rulesets are regularly updated. Each rule has a default action that varies according to the severity of the rule. You can adjust the behavior of specific rules, choosing from several possible actions.

Rules of managed rulesets have associated tags (such as wordpress) that allow you to search for a specific group of rules and configure them in bulk.

## Available managed rulesets

- Cloudflare Managed Ruleset: Created by the Cloudflare security team, this ruleset provides fast and effective protection for all of your applications. The ruleset is updated frequently to cover new vulnerabilities and reduce false positives.Ruleset ID:    ...376e9aee
- Cloudflare OWASP Core Ruleset: Cloudflare's implementation of the Open Web Application Security Project, or OWASP ModSecurity Core Rule Set. Cloudflare routinely monitors for updates from OWASP based on the latest version available from the official code repository.Ruleset ID:    ...c25d2f1f
- Cloudflare Exposed Credentials Check: Deploy an automated credentials check on your end-user authentication endpoints. For any credential pair, the Cloudflare WAF performs a lookup against a public database of stolen credentials. Cloudflare recommends that you use leaked credentials detection instead of this ruleset.Ruleset ID:    ...14069605
- Cloudflare Free Managed Ruleset: Available on all Cloudflare plans. Designed to provide mitigation against high and wide impacting vulnerabilities. The rules are safe to deploy on most applications. If you deployed the Cloudflare Managed Ruleset for your site, you do not need to deploy this managed ruleset.Ruleset ID:    ...dfb893ba

The following managed rulesets run in a response phase:

- Cloudflare Sensitive Data Detection: Created by Cloudflare to address common data loss threats. These rules monitor the download of specific sensitive data — for example, financial and personally identifiable information.Ruleset ID:    ...499d988e

## Availability

The managed rulesets you can deploy depend on your Cloudflare plan.

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Free Managed Ruleset | Yes | Yes | Yes | Yes |
| Cloudflare Managed Ruleset | No | Yes | Yes | Yes |
| Cloudflare OWASP Core Ruleset | No | Yes | Yes | Yes |
| Cloudflare Exposed Credentials Check | No | Yes | Yes | Yes |
| Cloudflare Sensitive Data Detection | No | No | No | Paid add-on |

## Customize the behavior of managed rulesets

To customize the behavior of managed rulesets, do one of the following:

- Create exceptions to skip the execution of managed rulesets or some of their rules under certain conditions.
- Configure overrides to change the rule action
or disable one or more rules of managed rulesets. Overrides can affect an
entire managed ruleset, specific tags, or specific rules in the managed
ruleset.

Exceptions have priority over overrides.

Important

Ruleset overrides and tag overrides apply to both existing and future rules in the managed ruleset. If you want to override existing rules only, you must use rule overrides.

## Zone-level deployment

At the zone level, you can only deploy each managed ruleset once. At the account level you can deploy each managed ruleset multiple times.

## Important remarks

Cloudflare analyzes the body of incoming requests up to a certain maximum size that varies according to your Cloudflare plan. For Enterprise customers, the maximum body size is 128 KB, while for other plans the limit is lower. This means that the behavior of specific managed rules that analyze request bodies can vary according to your current Cloudflare plan.

If included in your plan, you can use request body fields such as http.request.body.truncated or http.request.headers.truncated in custom rules that apply appropriate actions to requests that have not been fully analyzed by Cloudflare due to the maximum body size.

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

## Deploy a WAF managed ruleset in the dashboard

**來源**: [https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/](https://developers.cloudflare.com/waf/managed-rules/deploy-zone-dashboard/)

Page options # Deploy a WAF managed ruleset in the dashboard

The instructions on this page will guide you through deploying and configuring a managed ruleset for a zone.

To deploy a managed ruleset for several Enterprise domains in your account, refer to Deploy a managed ruleset in the dashboard for an account.

## Deploy a managed ruleset

To deploy a managed ruleset with the default configuration:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Under Managed Rulesets, select Deploy next to a managed ruleset.

This operation deploys the managed ruleset for the current zone, creating a new rule with the Execute action.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Web application exploits.
3. Turn on the managed ruleset you want to deploy.

## Turn on or off a managed ruleset

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Next to the managed ruleset you want to turn on or off, switch the Enabled toggle.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Web application exploits.
3. Next to the managed ruleset you want to turn on or off, set the toggle to On or Off, respectively.

## Configure a managed ruleset

Configure a managed ruleset to:

- Specify a custom filter expression to apply the rules in the ruleset to a subset of incoming requests.
- Define specific field values for one or more rules (for example, configure a rule with an action different from the action configured by Cloudflare), or turn off those rules.

To skip one or more rules — or even entire managed rulesets — for specific incoming requests, add an exception.

Note

Some managed rulesets may not allow custom configuration, depending on your Cloudflare plan.

### Configure field values for all the rules

To configure rule field values for all the rules in a managed ruleset:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Next to the Execute rule deploying the managed ruleset you want to configure, select the managed ruleset name. If you have not deployed the managed ruleset yet, select the managed ruleset name under Managed Rulesets.
4. (Optional) To execute the managed ruleset for a subset of incoming requests, select Edit scope and configure the expression that will determine the scope of the current rule deploying the managed ruleset.
5. In the ruleset configuration section, define settings for all the rules in the ruleset by setting one or more fields using the drop-down lists.
For example, select the action to perform for all the rules in the ruleset from the Ruleset action drop-down list.
6. If you are editing a deployed managed ruleset, select Save. If you have not deployed the managed ruleset yet, select Deploy to deploy the ruleset immediately, or Save as Draft to save your deployment settings for later.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure. Look for a rule with an Execute action. At the top of the page, you can filter the rules to show Managed rules only.
4. Select the rule name (containing the name of the managed ruleset).
5. (Optional) To execute the managed ruleset for a subset of incoming requests, select Edit scope and configure the expression that will determine the scope of the current rule deploying the managed ruleset.
6. In the ruleset configuration section, define settings for all the rules in the ruleset by setting one or more fields using the drop-down lists.
For example, select the action to perform for all the rules in the ruleset from the Ruleset action drop-down list.
7. Select Save.

### Configure rules in bulk in a managed ruleset

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. If you have already deployed the managed ruleset you want to configure, select the managed ruleset name in the list of deployed managed rulesets. Alternatively, select the three dots > Edit next to the Execute rule deploying the managed ruleset.
If you have not deployed the managed ruleset, select the ruleset name under Managed Rulesets.
4. Select Browse rules.

1. Search for rules using the available filters. You can search for tags.
2. In the results list, select the checkboxes for all the rules you want to configure.
Alternatively, select a tag name under the search input to filter the rules with that tag, and then select the checkboxes for the rules you want to configure. To extend your selection to all rules with the tag across all pages, select Select all <NUMBER> rules.
3. Update one or more fields for the selected rules using the buttons displayed in the top right corner of the table.
4. Select Next.
5. If you selected a tag, a dialog appears asking you if any new rules with the selected tag should be configured with the field values you selected.

Select Do not apply to new rules to apply your configurations to the selected rules only.
Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
6. Select Do not apply to new rules to apply your configurations to the selected rules only.
7. Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
8. Select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure/browse. Look for a rule with an Execute action. At the top of the page, you can filter the rules to show Managed rules only.
4. Select the rule name (containing the name of the managed ruleset), and then select Browse rules.

1. Search for rules using the available filters. You can search for tags.
2. In the results list, select the checkboxes for all the rules you want to configure.
Alternatively, select a tag name under the search input to filter the rules with that tag, and then select the checkboxes for the rules you want to configure. To extend your selection to all rules with the tag across all pages, select Select all <NUMBER> rules.
3. Update one or more fields for the selected rules using the buttons displayed in the top right corner of the table.
4. Select Next.
5. If you selected a tag, a dialog appears asking you if any new rules with the selected tag should be configured with the field values you selected.

Select Do not apply to new rules to apply your configurations to the selected rules only.
Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
6. Select Do not apply to new rules to apply your configurations to the selected rules only.
7. Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
8. Select Save.

### Configure a single rule in a managed ruleset

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. If you have already deployed the managed ruleset you want to configure, select the managed ruleset name in the list of deployed managed rulesets. Alternatively, select the three dots > Edit next to the Execute rule deploying the managed ruleset.
If you have not deployed the managed ruleset, select the ruleset name under Managed Rulesets.
4. Select Browse rules.

1. Search for a rule using the available filters. You can search for tags.
2. Find the rule you want to configure in the results list.
3. In the result line for the rule you want to change, select the desired value for a field in the displayed drop-down lists. For example, select the rule action in the Action dropdown. You can also change the status of a rule using the Status toggle next to the rule.
4. Select Next, and then select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure/browse. Look for a rule with an Execute action. At the top of the page, you can filter the rules to show Managed rules only.
4. Select the rule name (containing the name of the managed ruleset), and then select Browse rules.

1. Search for a rule using the available filters. You can search for tags.
2. Find the rule you want to configure in the results list.
3. In the result line for the rule you want to change, select the desired value for a field in the displayed drop-down lists. For example, select the rule action in the Action dropdown. You can also change the status of a rule using the Status toggle next to the rule.
4. Select Next, and then select Save.

### Browse the rules of a managed ruleset

You can browse the available rules in a managed ruleset and search for individual rules or tags.

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. If you have already deployed the managed ruleset you want to configure, select the managed ruleset name in the list of deployed managed rulesets. Alternatively, select the three dots > Edit next to the Execute rule deploying the managed ruleset.
If you have not deployed the managed ruleset, select the ruleset name under Managed Rulesets.
4. Select Browse rules.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure/browse. Look for a rule with an Execute action. At the top of the page, you can filter the rules to show Managed rules only.
4. Select the rule name (containing the name of the managed ruleset), and then select Browse rules.

### Delete a managed ruleset deployment rule or an exception

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Next to the rule or exception (skip rule) you want to delete, select the three dots > Delete and confirm the operation.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure/browse. At the top of the page, you can filter the rules to show Managed rules only.
4. Next to the managed ruleset deployment rule (execute rule) or exception (skip rule) you want to delete, select the three dots > Delete and confirm the operation.

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

## Deploy a WAF managed ruleset via API

**來源**: [https://developers.cloudflare.com/waf/managed-rules/deploy-api/](https://developers.cloudflare.com/waf/managed-rules/deploy-api/)

Page options # Deploy a WAF managed ruleset via API

Use the Rulesets API to deploy a managed ruleset at the account level or at the zone level.

Deploy WAF managed rulesets to the http_request_firewall_managed phase. Other managed rulesets, like DDoS Attack Protection managed rulesets, must be deployed to a different phase. Refer to the specific managed ruleset documentation for details.

The WAF Managed Rules page includes the IDs of the different WAF managed rulesets. You will need this information when deploying the rulesets via API.

If you are using Terraform, refer to WAF Managed Rules configuration using Terraform.

## Example

The following example deploys the Cloudflare Managed Ruleset to the http_request_firewall_managed phase of a given zone ($ZONE_ID) by creating a rule that executes the managed ruleset.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_managed phase. You will need the zone ID for this task.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Zone-level phase entry point",    "id": "<RULESET_ID>",    "kind": "zone",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "zone",    "phase": "http_request_firewall_managed",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add an execute rule to the existing ruleset deploying the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee). By default, the rule will be added at the end of the list of rules already in the ruleset.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee"    },    "expression": "true",    "description": "Execute the Cloudflare Managed Ruleset"  }'
{  "result": {    "id": "<RULESET_ID>",    "name": "Zone-level phase entry point",    "description": "",    "kind": "zone",    "version": "11",    "rules": [      // ... any existing rules      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee",          "version": "latest"        },        "expression": "true",        "description": "Execute the Cloudflare Managed Ruleset",        "last_updated": "2024-03-18T18:08:14.003361Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2024-03-18T18:08:14.003361Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include a single rule in the rules array that executes the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee) for all incoming requests in the zone.
Create a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets",    "kind": "zone",    "phase": "http_request_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "efb7b8c949ac4650a09736fc376e9aee"            },            "expression": "true",            "description": "Execute the Cloudflare Managed Ruleset"        }    ]  }'

## Next steps

To customize the behavior of the rules included in a managed ruleset, create an override.

To skip the execution of WAF managed rulesets or some of their rules, create an exception (also called a skip rule).

Exceptions have priority over overrides.

## More resources

For more information on working with managed rulesets via API, refer to Work with managed rulesets in the Ruleset Engine documentation.

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

## Troubleshoot managed rules

**來源**: [https://developers.cloudflare.com/waf/managed-rules/troubleshooting/](https://developers.cloudflare.com/waf/managed-rules/troubleshooting/)

Page options # Troubleshoot managed rules

By default, WAF's managed rulesets are compatible with most websites and web applications. However, false positives and false negatives may occur:

- False positives: Legitimate requests detected and mitigated as malicious.
- False negatives: Malicious requests that were not mitigated and reached your origin server.

## Troubleshoot false positives

You can use Security Events to help you identify what caused legitimate requests to get blocked. Add filters and adjust the report duration as needed.

If you encounter a false positive caused by a managed rule, do one of the following:

- Add an exception: Exceptions allow you to skip the execution of WAF managed rulesets or some of their rules for certain requests.
- Adjust the OWASP managed ruleset: A request blocked by the rule with ID    ...843b323c      and description 949110: Inbound Anomaly Score Exceeded refers to the Cloudflare OWASP Core Ruleset. To resolve the issue, configure the OWASP managed ruleset.
- Disable the corresponding managed rule(s): Create an override to disable specific rules. This may avoid false positives, but you will also reduce the overall site security. Refer to the dashboard instructions on configuring a managed ruleset, or to the API instructions on creating an override.

Note

If you contact Cloudflare Support to verify whether a WAF managed rule triggers as expected, provide a HAR file captured while sending the specific request of concern.

### Additional recommendations

- If one specific rule causes false positives, disable that specific rule and not the entire ruleset.
- For false positives with the administrator area of your website, add an exception disabling a managed rule for the admin section of your site resources. You can use an expression similar to the following:
http.host eq "example.com" and starts_with(http.request.uri.path, "/admin")

## Troubleshoot false negatives

To identify false negatives, review the HTTP logs on your origin server.

To reduce false negatives, use the following checklist:

- Are DNS records that serve HTTP traffic proxied through Cloudflare?
Cloudflare only mitigates requests in proxied traffic.
- Have you deployed any of the WAF managed rulesets in your zone?
You must deploy a managed ruleset to apply its rules.
- Are Managed Rules being skipped via an exception?
Use Security Events to search for requests being skipped. If necessary, adjust the exception expression so that it matches the attack traffic that should have been blocked.
- Have you enabled any necessary managed rules that are not enabled by default?
Not all rules of WAF managed rulesets are enabled by default, so you should review individual managed rules.

For example, Cloudflare allows requests with empty user agents by default. To block requests with an empty user agent, enable the rule with ID    ...0a6dbbd3      in the Cloudflare Managed Ruleset.
Another example: If you want to block unmitigated SQL injection (SQLi) attacks, make sure the relevant managed rules tagged with sqli are enabled in the Cloudflare Managed Ruleset.

For instructions, refer to Configure a managed ruleset.
- For example, Cloudflare allows requests with empty user agents by default. To block requests with an empty user agent, enable the rule with ID    ...0a6dbbd3      in the Cloudflare Managed Ruleset.
- Another example: If you want to block unmitigated SQL injection (SQLi) attacks, make sure the relevant managed rules tagged with sqli are enabled in the Cloudflare Managed Ruleset.
- Is the attack traffic matching a custom rule skipping all Managed Rules?
If necessary, adjust the custom rule expression so that it does not apply to the attack traffic.
- Is the attack traffic matching an allowed ASN, IP range, or IP address in IP Access rules?
Review your IP Access rules and make sure that any allow rules do not match the attack traffic.
- Is the malicious traffic reaching your origin IP addresses directly, therefore bypassing Cloudflare protection?
Block all traffic except from Cloudflare's IP addresses at your origin server.

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

## Create exceptions

**來源**: [https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/](https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/)

Page options # Create exceptions

Create an exception to skip the execution of WAF managed rulesets or some of their rules. The exception configuration includes an expression that defines the skip conditions, and the rules or rulesets to skip under those conditions.

## Types of exceptions

An exception can have one of the following behaviors (from highest to lowest priority):

- Skip all remaining rules (belonging to WAF managed rulesets)
- Skip one or more WAF managed rulesets
- Skip one or more rules of WAF managed rulesets

For more information on exceptions, refer to Create an exception in the Ruleset Engine documentation.

## Next steps

Add exceptions in the Cloudflare dashboard or via API.

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

## Add an exception in the dashboard

**來源**: [https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/define-dashboard/](https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/define-dashboard/)

Page options # Add an exception in the dashboard

## 1. Go to the zone or account dashboard page

To add an exception at the zone level:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Select Add exception.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. Next to Managed rules, select Create rule.

To add an exception at the account level (Enterprise plans only):

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Select Deploy > Deploy managed exception.

## 2. Define basic exception parameters

1. In Exception name, enter a name for the exception.
2. In When incoming requests match, specify a filter expression that defines the conditions for applying the exception. When the expression matches, the WAF will evaluate the exception skipping one or more rules of WAF managed rulesets. The filter expression uses the Rules language.

## 3. Select the rules to skip

1. In Then, select the exception type that determines which rules to skip:

Skip all remaining rules: Skips all remaining rules of WAF managed rulesets. If you select this option, proceed to 4. Create the exception.
Skip specific rules from a Managed Ruleset: Skips one or more rules of a managed ruleset.
2. Skip all remaining rules: Skips all remaining rules of WAF managed rulesets. If you select this option, proceed to 4. Create the exception.
3. Skip specific rules from a Managed Ruleset: Skips one or more rules of a managed ruleset.
4. Select Select ruleset.
5. Next to the ruleset containing the rule(s) you wish to skip, select Select rules.
6. A) To skip one or more rules in the ruleset:

Search for a rule using the available filters. You can search by description, rule ID, or tag. For example, in the Cloudflare OWASP Core Ruleset you can search for 920460 to find the rule 920460: Abnormal character escapes in request.
Select the checkbox next to the rule(s) you want to skip.
If required, search for other rules and select them. The dashboard keeps a list of the rules you selected between searches.

B) To skip all the rules in the ruleset:


Select all the rules in the current page by selecting the checkbox in the table header, near Description/Rule ID. The table header will display 10 rules selected (of <TOTAL> rules).



Select Select all <TOTAL> rules in the table header to select all the rules across all pages.
7. Search for a rule using the available filters. You can search by description, rule ID, or tag. For example, in the Cloudflare OWASP Core Ruleset you can search for 920460 to find the rule 920460: Abnormal character escapes in request.
8. Select the checkbox next to the rule(s) you want to skip.
9. If required, search for other rules and select them. The dashboard keeps a list of the rules you selected between searches.
10. Select all the rules in the current page by selecting the checkbox in the table header, near Description/Rule ID. The table header will display 10 rules selected (of <TOTAL> rules).
11. Select Select all <TOTAL> rules in the table header to select all the rules across all pages.
12. Select Next.

## 4. Create the exception

1. (Optional) To disable logging for requests matching the exception, disable Log matching requests.
2. To save and deploy your exception, select Deploy. If you are not ready to deploy your exception, select Save as Draft.

## 5. (Optional) Edit the exception

To edit an exception at the zone level:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Find the exception you want to edit and select its name. Exceptions are rules listed with Action = Skip.
4. Once you have finished making changes, select Save.

To delete an exception listed in the Managed rules tab, select the three dots > Delete.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules and filter by Managed Rules.
3. Find the exception you want to edit and select its name. Exceptions are rules listed with Action = Skip.
4. Once you have finished making changes, select Save.
Alternatively, to delete the exception, select Delete exception.

To edit an exception at the account level (Enterprise plans only):

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Find the exception you want to edit and select its name. Exceptions are rules listed with Action = Skip.
4. Once you have finished making changes, select Save.
Alternatively, to delete the exception, select Delete exception.

Note

Exceptions only apply to rules executing a managed ruleset listed after them. For example, if you are skipping a rule belonging to the Cloudflare OWASP Core Ruleset, make sure the exception is listed in the rules list before the Execute rule deploying this managed ruleset.

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

## Add an exception via API

**來源**: [https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/define-api/](https://developers.cloudflare.com/waf/managed-rules/waf-exceptions/define-api/)

Page options # Add an exception via API

To add a managed rules exception using the API, create a rule with skip action in a phase entry point ruleset of the http_request_firewall_managed phase. You can define exceptions at the account level and at the zone level. Exceptions are also called skip rules.

To configure the exception, define the action_parameters object according to the exception type. Refer to the following examples:

- Skip all remaining rules
- Skip the Cloudflare Managed Ruleset
- Skip one or more rules of WAF managed rulesets

For more information on creating exceptions using the API, refer to Create an exception in the Ruleset Engine documentation.

Rule execution order

Rules with skip action only apply to rules with execute action listed after them. If you add a rule with skip action at the end of the rules list, nothing will be skipped.

## Examples

### Skip all remaining rules

The following example adds a rule that skips all remaining rules in the entry point ruleset for requests matching the dev.example.com hostname.

1. Invoke the Get a zone entry point ruleset operation to obtain the current configuration of the entry point ruleset of the http_request_firewall_managed phase.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "060013b1eeb14c93b0dcd896537e0d2c", // entry point ruleset ID    "name": "default",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)    ],    "last_updated": "2024-01-20T14:29:00.190643Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
Save the entry point ruleset ID (060013b1eeb14c93b0dcd896537e0d2c) for the next step.
2. Invoke the Create a zone ruleset rule operation (a POST request) to add an exception (or skip rule) at the beginning of the rules list, since a skip rule applies only to rules listed after it. The exact rule location is defined in the position object.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "expression": "(http.host eq \"dev.example.com\")",    "description": "Skip managed rules for dev.example.com",    "action": "skip",    "action_parameters": {        "ruleset": "current"    },    "position": {        "before": ""    }  }'

For more information on skipping all remaining rules via API, refer to Create an exception in the Ruleset Engine documentation.

### Skip the Cloudflare Managed Ruleset

The following example adds a rule that skips the Cloudflare Managed Ruleset for requests matching the dev.example.com hostname.

1. Invoke the Get a zone entry point ruleset operation to obtain the current configuration of the entry point ruleset of the http_request_firewall_managed phase.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "060013b1eeb14c93b0dcd896537e0d2c", // entry point ruleset ID    "name": "default",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)      {        "id": "1bdb49371c1f46958fc8b985efcb79e7", // `execute` rule ID        "version": "1",        "action": "execute",        "expression": "true",        "last_updated": "2024-01-20T14:21:28.643979Z",        "ref": "1bdb49371c1f46958fc8b985efcb79e7",        "enabled": true,        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee", // "Cloudflare Managed Ruleset" ID          "version": "latest"        }      }      // (...)    ],    "last_updated": "2024-01-20T14:29:00.190643Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
Identify the rule deploying the Cloudflare Managed Ruleset by searching for an execute rule with action_parameters > id equal to    ...376e9aee      (the managed ruleset ID).
NoteTo get the IDs of existing WAF managed rulesets, refer to WAF Managed Rules or use the List account rulesets operation.
Save the following IDs for the next step:

The ID of the entry point ruleset (060013b1eeb14c93b0dcd896537e0d2c in this example)
The ID of the execute rule deployment the managed ruleset (1bdb49371c1f46958fc8b985efcb79e7 in this example)
2. The ID of the entry point ruleset (060013b1eeb14c93b0dcd896537e0d2c in this example)
3. The ID of the execute rule deployment the managed ruleset (1bdb49371c1f46958fc8b985efcb79e7 in this example)
4. Invoke the Create a zone ruleset rule operation (a POST request) to add an exception (or skip rule) immediately before the execute rule deploying the Cloudflare Managed Ruleset, since a skip rule applies only to rules listed after it. The exact rule location is defined in the position object.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "expression": "(http.host eq \"dev.example.com\")",    "description": "Skip the Cloudflare Managed Ruleset for dev.example.com",    "action": "skip",    "action_parameters": {        "rulesets": [            "efb7b8c949ac4650a09736fc376e9aee"        ]    },    "position": {        "before": "1bdb49371c1f46958fc8b985efcb79e7"    }  }'

For more information on skipping one or more managed rulesets via API, refer to Create an exception in the Ruleset Engine documentation.

### Skip one or more rules of WAF managed rulesets

The following example adds a rule that skips a particular rule of the Cloudflare Managed Ruleset for requests matching the dev.example.com hostname.

1. Invoke the Get a zone ruleset operation to obtain a list of rules in the Cloudflare Managed Ruleset (ruleset ID    ...376e9aee     ).
You can get the managed ruleset details using the account-level endpoint (Get an account ruleset) or the zone-level endpoint (Get a zone ruleset).
NoteTo get the IDs of existing WAF managed rulesets, refer to WAF Managed Rules or use the List account rulesets operation.
Get a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/efb7b8c949ac4650a09736fc376e9aee" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "efb7b8c949ac4650a09736fc376e9aee",    "name": "Cloudflare Managed Ruleset",    "description": "Created by the Cloudflare security team, this ruleset is designed to provide fast and effective protection for all your applications. It is frequently updated to cover new vulnerabilities and reduce false positives.",    "source": "firewall_managed",    "kind": "managed",    "version": "180",    "rules": [      // (...)      {        "id": "d9e350f1b72d4730899c8a420e48a85d", // ID of rule to skip        "version": "180",        "action": "block",        "categories": ["file-inclusion", "october-cms"],        "description": "October CMS - File Inclusion",        "last_updated": "2024-02-05T07:12:54.565276Z",        "ref": "adb550873eb92d32372ed08514d33241",        "enabled": true      }      // (...)    ],    "last_updated": "2024-02-05T07:12:54.565276Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
Take note of the ID of the rule you want to skip (   ...0e48a85d      in this example).
2. Invoke the Get a zone entry point ruleset operation to obtain the current configuration of the entry point ruleset of the http_request_firewall_managed phase.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "060013b1eeb14c93b0dcd896537e0d2c", // entry point ruleset ID    "name": "default",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)      {        "id": "1bdb49371c1f46958fc8b985efcb79e7", // `execute` rule ID        "version": "1",        "action": "execute",        "expression": "true",        "last_updated": "2024-01-20T14:21:28.643979Z",        "ref": "1bdb49371c1f46958fc8b985efcb79e7",        "enabled": true,        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee", // "Cloudflare Managed Ruleset" ID          "version": "latest"        }      }      // (...)    ],    "last_updated": "2024-01-20T14:29:00.190643Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
Identify the rule deploying the Cloudflare Managed Ruleset by searching for an execute rule with action_parameters > id equal to    ...376e9aee      (the managed ruleset ID).
NoteTo get the IDs of existing WAF managed rulesets, refer to WAF Managed Rules or use the List account rulesets operation.
Save the following IDs for the next step:

The ID of the entry point ruleset (060013b1eeb14c93b0dcd896537e0d2c in this example)
The ID of the execute rule deploying the Cloudflare Managed Ruleset (1bdb49371c1f46958fc8b985efcb79e7 in this example)

You will also use the following IDs:

The ID of the Cloudflare Managed Ruleset (   ...376e9aee     )
The ID of the rule to skip (   ...0e48a85d      in this example)
3. The ID of the entry point ruleset (060013b1eeb14c93b0dcd896537e0d2c in this example)
4. The ID of the execute rule deploying the Cloudflare Managed Ruleset (1bdb49371c1f46958fc8b985efcb79e7 in this example)
5. The ID of the Cloudflare Managed Ruleset (   ...376e9aee     )
6. The ID of the rule to skip (   ...0e48a85d      in this example)
7. Invoke the Create a zone ruleset rule operation (a POST request) to add an exception (or skip rule) immediately before the execute rule deploying the Cloudflare Managed Ruleset, since a skip rule applies only to rules listed after it.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "expression": "(http.host eq \"dev.example.com\")",    "description": "Skip a single rule for dev.example.com",    "action": "skip",    "action_parameters": {        "rules": {            "efb7b8c949ac4650a09736fc376e9aee": [                "d9e350f1b72d4730899c8a420e48a85d"            ]        }    },    "position": {        "before": "1bdb49371c1f46958fc8b985efcb79e7"    }  }'

The action_parameters > rules object contains the ID of the Cloudflare Managed Ruleset with an associated list of rule IDs to skip (in this case, only one rule). The position object defines the exact rule placement in the entry point ruleset (before rule 1bdb49371c1f46958fc8b985efcb79e7).

For more information on skipping one or more rules of managed rulesets via API, refer to Create an exception in the Ruleset Engine documentation.

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

## Log the payload of matched rules

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/)

Page options # Log the payload of matched rules

The WAF allows you to log the request information that triggered a specific rule of a managed ruleset. This information is known as the payload. Payload information includes the specific string that triggered the rule, along with the text that appears immediately before and after the match.

Payload logging is especially useful when diagnosing the behavior of WAF rules. Since the values that triggered a rule may contain sensitive data, they are encrypted with a customer-provided public key so that only you can examine them later.

Note

This feature is only available for customers on an Enterprise plan.

## Turn on payload logging

Each managed ruleset has its own payload logging configuration. To turn on payload logging, configure a public key to encrypt the logged payload by doing one of the following:

- Generate a key pair directly in the Cloudflare dashboard
- Use your own public key

Once enabled, the WAF saves the payload of any rule matches for the managed ruleset configured with payload logging, encrypting the payload with your public key.

For more information, refer to Configure payload logging in the dashboard or Configure payload logging via API.

Important

When you generate a key pair in the dashboard, Cloudflare will only save the generated public key, not the private key. You must store your private key safely.

## View payload content

To view the content of the payload in clear text, do one of the following:

- In the Security Events page, enter your private key to decrypt the payload of a log entry directly in the browser. Refer to View the payload content in the dashboard for details.
- Decrypt the payload in the command line using the matched-data-cli tool. Refer to Decrypt the payload content in the command line for details.
- Decrypt the matched payload in your Logpush job using a Worker before storing the logs in your SIEM system. Refer to Store decrypted matched payloads in logs for details.

Important

All Cloudflare logs are encrypted at rest. Encrypting the payload content adds a second layer of encryption for the matched values that triggered a rule.

Make sure you store your private key safely. If you lose the private key, configure payload logging with a new public key. The payload of new requests will be encrypted with the new public key.

Cloudflare cannot decrypt encrypted payloads, since this operation requires your private key. Cloudflare staff will never ask for the private key.

## User role requirements

Only users with the Super Administrator role can enable payload logging or edit the payload logging configuration.

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

## Configure payload logging in the dashboard

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/configure/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/configure/)

Page options # Configure payload logging in the dashboard

Note

Only users with the Super Administrator role can configure payload logging and decrypt payloads in the Cloudflare dashboard. Other users can decrypt payloads if they have access to the logs and to the private key.

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. To configure payload logging for a ruleset you had already deployed in the WAF, select the managed ruleset name.
4. At the bottom of the page, select Configure payload logging.
5. After reading and understanding the implications of enabling payload logging, select one of the available options:


Generate key pair using your web browser: Generates a key pair (a private and a public key) in your browser and configures payload logging with the generated public key.


Use my own public key: Enter a public key generated by the matched-data-cli command-line tool.
6. Generate key pair using your web browser: Generates a key pair (a private and a public key) in your browser and configures payload logging with the generated public key.
7. Use my own public key: Enter a public key generated by the matched-data-cli command-line tool.
8. Select Next.
9. If you generated a key pair in the browser, copy the displayed private key and store it safely. You will use this private key later to view the decrypted payload content.
10. Select Done.
11. If you are deploying the managed ruleset where you configured payload logging, select Deploy. If you configured payload logging for a ruleset you had already deployed, select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. In the rules table, search for the managed ruleset you want to configure. Look for a rule with an Execute action. At the top of the page, you can filter the rules to show Managed rules only.
4. Select the rule name (containing the name of the managed ruleset).
5. At the bottom of the page, select Configure payload logging.
6. After reading and understanding the implications of enabling payload logging, select one of the available options:


Generate key pair using your web browser: Generates a key pair (a private and a public key) in your browser and configures payload logging with the generated public key.


Use my own public key: Enter a public key generated by the matched-data-cli command-line tool.
7. Generate key pair using your web browser: Generates a key pair (a private and a public key) in your browser and configures payload logging with the generated public key.
8. Use my own public key: Enter a public key generated by the matched-data-cli command-line tool.
9. Select Next.
10. If you generated a key pair in the browser, copy the displayed private key and store it safely. You will use this private key later to view the decrypted payload content.
11. Select Done, and then select Save.

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

## View the payload content in the dashboard

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/view/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/view/)

Page options # View the payload content in the dashboard

View the content of the matched rule payload in the dashboard by entering your private key.

1. Open Security Events:

Old dashboard: Go to Security > Events.
New security dashboard: Go to Security > Analytics > Events tab.
2. Old dashboard: Go to Security > Events.
3. New security dashboard: Go to Security > Analytics > Events tab.
4. Under Sampled logs, expand the details of an event triggered by a rule whose managed ruleset has payload logging enabled.
5. Under Matched service, select Decrypt payload match.
6. Enter your private key in the pop-up window and select Decrypt.
NoteThe private key is not sent to a Cloudflare server. The decryption occurs entirely in the browser.

If the private key you entered decrypts the encrypted payload successfully, the dashboard will show the name of the fields that matched and the matched string in clear text, along with some text appearing before and after the match.

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

## Configure payload logging via API

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/configure-api/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/configure-api/)

Page options # Configure payload logging via API

Use the Rulesets API to configure payload logging for a managed ruleset via API.

## Configure and enable payload logging

1. Use the Get a zone entry point ruleset operation to obtain the following IDs:

The ID of the entry point ruleset of the http_request_firewall_managed phase.
The ID of the execute rule deploying the WAF managed ruleset, for which you want to configure payload logging.
2. The ID of the entry point ruleset of the http_request_firewall_managed phase.
3. The ID of the execute rule deploying the WAF managed ruleset, for which you want to configure payload logging.
4. Use the Update a zone ruleset rule operation to update the rule you identified in the previous step.
Include a matched_data object in the rule's action_parameters object to configure payload logging. The matched_data object has the following structure:
"action_parameters": {  // ...  "matched_data": {    "public_key": "<PUBLIC_KEY_VALUE>"  }}
Replace <PUBLIC_KEY_VALUE> with the public key you want to use for payload logging. You can generate a public key in the command line or in the Cloudflare dashboard.

Account-level configuration

To configure payload logging for a managed ruleset deployed at the account level (only available in Enterprise plans with a paid add-on), use the following API operations instead:

- In step 1: Get an account entry point ruleset
- In step 2: Update an account ruleset rule

### Example

This example configures payload logging for the Cloudflare Managed Ruleset, which is already deployed for a zone with ID $ZONE_ID.

1. Invoke the Get a zone entry point ruleset operation to obtain the rules currently configured in the entry point ruleset of the http_request_firewall_managed phase.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "060013b1eeb14c93b0dcd896537e0d2c", // entry point ruleset ID    "name": "default",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)      {        "id": "1bdb49371c1f46958fc8b985efcb79e7", // `execute` rule ID        "version": "1",        "action": "execute",        "expression": "true",        "last_updated": "2024-01-20T14:21:28.643979Z",        "ref": "1bdb49371c1f46958fc8b985efcb79e7",        "enabled": true,        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee", // "Cloudflare Managed Ruleset" ID          "version": "latest"        }      }      // (...)    ],    "last_updated": "2024-01-20T14:29:00.190643Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
2. Save the following IDs for the next step:

The ID of the entry point ruleset: 060013b1eeb14c93b0dcd896537e0d2c
The ID of the execute rule deploying the Cloudflare Managed Ruleset: 1bdb49371c1f46958fc8b985efcb79e7

To find the correct rule in the rules array, search for an execute rule containing the ID of the Cloudflare Managed Ruleset (   ...376e9aee     ) in action_parameters > id.
NoteTo get the IDs of existing WAF managed rulesets, refer to WAF Managed Rules or use the List account rulesets operation.
3. The ID of the entry point ruleset: 060013b1eeb14c93b0dcd896537e0d2c
4. The ID of the execute rule deploying the Cloudflare Managed Ruleset: 1bdb49371c1f46958fc8b985efcb79e7
5. Invoke the Update a zone ruleset rule operation to update the configuration of the rule you identified. The rule will now include the payload logging configuration (matched_data object).
Update a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/060013b1eeb14c93b0dcd896537e0d2c/rules/1bdb49371c1f46958fc8b985efcb79e7" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee",        "matched_data": {            "public_key": "Ycig/Zr/pZmklmFUN99nr+taURlYItL91g+NcHGYpB8="        }    },    "expression": "true"  }'
The response will include the complete ruleset after updating the rule.

For more information on deploying managed rulesets via API, refer to Deploy a managed ruleset in the Ruleset Engine documentation.

## Disable payload logging

To disable payload logging for a managed ruleset:

1. Use the Update a zone ruleset rule operation to update the rule deploying the managed ruleset (a rule with "action": "execute").
2. Modify the rule definition so that there is no matched_data object in action_parameters.

For example, the following PATCH request updates the rule with ID $RULE_ID deploying the Cloudflare Managed Ruleset so that payload logging is disabled:

Update a zone ruleset rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules/$RULE_ID" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee"    },    "expression": "true"  }'
```

For details on obtaining the entry point ruleset ID and the ID of the rule to update, refer to Configure and enable payload logging.

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

## Store decrypted matched payloads in logs

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/decrypt-in-logs/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/decrypt-in-logs/)

Page options # Store decrypted matched payloads in logs

You can include the encrypted matched payload in your Logpush jobs by adding the General > Metadata field from the Firewall Events dataset to your job.

The payload, in its encrypted form, is available in the encrypted_matched_data property of the Metadata field.

However, you may want to decrypt the matched payload before storing the logs in your SIEM system of choice. Cloudflare provides a sample Worker project ↗ on GitHub that does the following:

1. Behaves as an S3-compatible storage to receive logs from Logpush. These logs will contain encrypted matched payload data.
2. Decrypts matched payload data using your private key.
3. Sends the logs to the final log storage system with decrypted payload data.

You will need to make some changes to the sample project to push the logs containing decrypted payload data to your log storage system.

Refer to the Worker project's README ↗ for more information on configuring and deploying this Worker project.

## Structure of encrypted_matched_data property in Logpush

Matched payload information includes the specific string that triggered a rule, along with some text that appears immediately before and after the matched string.

Once you decrypt its value, the encrypted_matched_data property of the Metadata field in Logpush has a structure similar to the following:

```
{  // for fields with only one match (such as URI or user agent fields):  "<match_location>": {    "before": "<text_before_match>",    "content": "<matched_text>",    "after": "<text_after_match>"  },  // for fields with possible multiple matches (such as form, header, or body fields):  "<match_location>": [    {      "before": "<text_before_match_1>",      "content": "<matched_text_1>",      "after": "<text_after_match_1>"    },    {      "before": "<text_before_match_2>",      "content": "<matched_text_2>",      "after": "<text_after_match_2>"    }  ]}
```

The before and after properties are optional (there may be no content before/after the matched text) and will contain at most 15 bytes of content appearing before and after the match.

Below are a few examples of payload matches:

URI match ```
{  "http.request.uri": {    "before": "/admin",    "content": "/.git/",    "after": "config"  }}
```

Header value match ```
{  "http.request.headers.values[3]": [    { "content": "phar://", "after": "example" }  ]}
```

Raw body content match ```
{  "http.request.body.raw": {    "before": "NY>",    "content": "<!ENTITY xxe SYSTEM \"file:///dev/random\">] > ",    "after": "<foo>&xxe;</foo>"  }}
```

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

## Command-line operations

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/)

Page options # Command-line operations

The Cloudflare matched-data-cli ↗ command-line tool supports several tasks related to payload logging.

Download ↗ the matched-data-cli tool for your platform from the Releases page on GitHub. Alternatively, build the tool from source by following the instructions in the GitHub repository.

Use the tool to:

- Generate a key pair
- Decrypt the payload content

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

## Generate a key pair

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/generate-key-pair/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/generate-key-pair/)

Page options # Generate a key pair

Generate a public/private key pair using the Cloudflare matched-data-cli ↗ command-line tool. After generating a key pair, enter the generated public key in the payload logging configuration.

Do the following:

1. Download ↗ the matched-data-cli tool for your platform from the Releases page on GitHub, under Assets.
2. Extract the content of the downloaded .tar.gz file to a local folder.
3. Open a terminal and go to the local folder containing the matched-data-cli tool.
Terminal windowcd matched-data-cli
4. Run the following command:
Terminal window./matched-data-cli generate-key-pair
{ "private_key": "uBS5eBttHrqkdY41kbZPdvYnNz8Vj0TvKIUpjB1y/GA=", "public_key": "Ycig/Zr/pZmklmFUN99nr+taURlYItL91g+NcHGYpB8="}

After generating the key pair, copy the public key value and enter it in the payload logging configuration.

## Troubleshooting macOS errors

If you are using macOS, the operating system may block the matched-data-cli tool, depending on your security settings.

For instructions on how to execute unsigned binaries like the matched-data-cli tool in macOS, refer to the Safely open apps on your Mac ↗ page in Apple Support.

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

## Decrypt the payload content

**來源**: [https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/decrypt-payload/](https://developers.cloudflare.com/waf/managed-rules/payload-logging/command-line/decrypt-payload/)

Page options # Decrypt the payload content

Use the matched-data-cli tool to decrypt a payload in the command line.

1. Download ↗ the matched-data-cli tool for your platform from the Releases page on GitHub, under Assets.
2. Extract the content of the downloaded .tar.gz file to a local folder.
3. Open a command line window and change to the local folder containing the matched-data-cli binary.
Terminal windowcd matched-data-cli
4. Create two files: one with your private key and another one with the encrypted payload:
Terminal windowprintf "<PRIVATE_KEY>" > private_key.txt && chmod 400 private_key.txt
printf "<ENCRYPTED_PAYLOAD>" > encrypted_payload.txt
Replace <PRIVATE_KEY> with your private key and <ENCRYPTED_PAYLOAD> with the encrypted payload.
Note: The first printf command will make your private key visible in your command history.
5. Run the following command to decrypt the payload:
Terminal windowdecrypt -k private_key.txt encrypted_payload.txt

Note

If you are using macOS and you get an error when running the matched-data-cli tool, refer to Troubleshooting macOS errors.

## Example

The following example creates two files — one with the private key and another one with the encrypted payload — and runs the matched-data-cli tool to decrypt the payload in the encrypted_payload.txt file:

Terminal window ```
~ cd matched-data-cli
printf "uBS5eBttHrqkdY41kbZPdvYnNz8Vj0TvKIUpjB1y/GA=" > private_key.txt && chmod 400 private_key.txt
printf "AzTY6FHajXYXuDMUte82wrd+1n5CEHPoydYiyd3FMg5IEQAAAAAAAAA0lOhGXBclw8pWU5jbbYuepSIJN5JohTtZekLliJBlVWk=" > encrypted_payload.txt
decrypt -k private_key.txt encrypted_payload.txt
```

```
test matched data
```

Encryption formats

The format of the encrypted payload can change over time. The matched-data-cli tool returns an error if it cannot decrypt a new encryption format.

To fix this error, download ↗ a newer version of the tool from GitHub and try again.

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

## Check for exposed credentials

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/)

Page options # Check for exposed credentials

Many web applications have suffered credential stuffing attacks in the recent past. In these attacks there is a massive number of login attempts using username/password pairs from databases of exposed credentials.

Cloudflare offers you automated checks for exposed credentials using Cloudflare Web Application Firewall (WAF).

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

The WAF provides two mechanisms for this check:

- The Exposed Credentials Check Managed Ruleset, which contains predefined rules for popular CMS applications. By enabling this ruleset for a given zone, you immediately enable checks for exposed credentials for these well-known applications. The managed ruleset is available to all paid plans.
- The ability to write custom rules at the account level that check for exposed credentials according to your criteria. This configuration option is available to Enterprise customers with a paid add-on.

Cloudflare updates the databases of exposed credentials supporting the exposed credentials check feature on a regular basis.

The username and password credentials in clear text never leave the Cloudflare network. The WAF only uses an anonymized version of the username and password when determining if there are previously exposed credentials. Cloudflare follows the approach based on the k-Anonymity mathematical property described in the following blog post: Validating Leaked Passwords with k-Anonymity ↗.

## Available actions

The WAF can perform one of the following actions when it detects exposed credentials:

- Exposed-Credential-Check Header: Adds a new HTTP header to HTTP requests with exposed credentials. Your application at the origin can then force a password reset, start a two-factor authentication process, or perform any other action. The name of the added HTTP header is Exposed-Credential-Check and its value is 1. The action name is Rewrite in Security Events.
NoteWhile the header name is the same as when using the Add Leaked Credentials Checks Header managed transform, the header can have different values when using the managed transform (from 1 to 4), depending on your Cloudflare plan.
- Managed Challenge: Helps reduce the lifetimes of human time spent solving CAPTCHAs across the Internet. Depending on the characteristics of a request, Cloudflare will dynamically choose the appropriate type of challenge based on specific criteria.
- Block: Blocks HTTP requests containing exposed credentials.
- JS Challenge: Presents a non-interactive challenge to the clients making HTTP requests with exposed credentials.
- Log: Only available on Enterprise plans. Logs requests with exposed credentials in the Cloudflare logs. Recommended for validating a rule before committing to a more severe action.
- Interactive Challenge: Presents an interactive challenge to the clients making HTTP requests with exposed credentials.

The default action for the rules in the Exposed Credentials Check Managed Ruleset is Exposed-Credential-Check Header (named rewrite in the API).

Cloudflare recommends that you only use the following actions: Exposed-Credential-Check Header (named rewrite in the API) and Log (log).

## Exposed credentials checks in custom rules

Note

Exposed credentials checks in custom rules are only available via API and require account-level WAF, which is available to Enterprise customers with a paid add-on.

Besides enabling the Exposed Credentials Check Managed Ruleset, you can also check for exposed credentials in custom rules. One common use case is to create custom rules on the end user authentication endpoints of your application to check for exposed credentials. Rules that check for exposed credentials run before rate limiting rules.

To check for exposed credentials in a custom rule, include the exposed credentials check in the rule definition at the account level and specify how to obtain the username and password values from the HTTP request. For more information, refer to Create a custom rule checking for exposed credentials.

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

## How it works

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/how-checks-work/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/how-checks-work/)

Page options # How it works

WAF rules can include a check for exposed credentials. When enabled in a given rule, exposed credentials checking happens when there is a match for the rule expression (that is, the rule expression evaluates to true).

At this point, the WAF looks up the username/password pair in the request against a database of publicly available stolen credentials. When both the rule expression and the exposed credentials check are true, there is a rule match, and Cloudflare performs the action configured in the rule.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

## Example

For example, the following rule matches POST requests to the /login.php URI when Cloudflare identifies the submitted credentials as previously exposed:

Rule #1

Rule expression:
http.request.method == "POST" and http.request.uri == "/login.php"

Exposed credentials check with the following configuration:

- Username expression: http.request.body.form["user_id"]
- Password expression: http.request.body.form["password"]

Action: Interactive Challenge

When there is a match for the rule above and Cloudflare detects exposed credentials, the WAF presents the user with a challenge.

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

## Configure via API

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/configure-api/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/configure-api/)

Page options # Configure via API

Configure exposed credentials checks using the Rulesets API. You can do the following:

- Deploy the Cloudflare Exposed Credentials Check Managed Ruleset.
- Create custom rules that check for exposed credentials.

If you are using Terraform, refer to Configure using Terraform.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

## Create a custom rule checking for exposed credentials

Note

This feature requires account-level WAF configuration, which is available to Enterprise customers with a paid add-on.

You can create rules that check for exposed credentials using the Rulesets API. Include these rules in a custom ruleset, which you must create at the account level, and then deploy the custom ruleset to a phase.

A rule checking for exposed credentials has a match when both the rule expression and the result from the exposed credentials check are true.

To check for exposed credentials in a custom rule, include the exposed_credential_check object in the rule definition. This object must have the following properties:

- username_expression — Expression that selects the user ID used in the credentials check. This property can have up to 1024 characters.
- password_expression — Expression that selects the password used in the credentials check. This property can have up to 1024 characters.

Note

These properties have additional requirements:

- Each expression must evaluate to a string.
- You can only use the upper(), lower(), url_decode(), and lookup_json_string() functions, and you cannot nest these functions.

You can use the exposed_credential_check object in rules with one of the following actions: rewrite, log, block, challenge, or js_challenge. Cloudflare recommends that you only use exposed credentials checks with the following actions: rewrite and log.

To create and deploy a custom ruleset, follow the workflow described in Work with custom rulesets.

### Example A

This POST request example creates a new custom ruleset with a rule that checks for exposed credentials. The rule has a match if both the rule expression and the exposed_credential_check result are true. When there is a match, the rule will log the request with exposed credentials in the Cloudflare logs.

Required API token permissions

At least one of the following token permissions is required: - Account WAF Write
- Account Rulesets Write

Create an account ruleset ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "Custom Ruleset A",    "kind": "custom",    "description": "This ruleset includes a rule checking for exposed credentials.",    "rules": [        {            "action": "log",            "description": "Exposed credentials check on login.php page",            "expression": "http.request.method == \"POST\" && http.request.uri == \"/login.php\"",            "exposed_credential_check": {                "username_expression": "url_decode(http.request.body.form[\"username\"][0])",                "password_expression": "url_decode(http.request.body.form[\"password\"][0])"            }        }    ],    "phase": "http_request_firewall_custom"  }'
```

The response returns the created ruleset. Note the presence of the exposed_credential_check object on the rule definition.

```
{  "result": {    "id": "<CUSTOM_RULESET_ID>",    "name": "Custom Ruleset A",    "description": "This ruleset includes a rule checking for exposed credentials.",    "kind": "custom",    "version": "1",    "rules": [      {        "id": "<CUSTOM_RULE_ID>",        "version": "1",        "action": "log",        "description": "Exposed credentials check on login.php page",        "expression": "http.request.method == \"POST\" && http.request.uri == \"/login.php\"",        "exposed_credential_check": {          "username_expression": "url_decode(http.request.body.form[\"username\"][0])",          "password_expression": "url_decode(http.request.body.form[\"password\"][0])"        },        "last_updated": "2021-03-19T10:48:04.057775Z",        "ref": "<CUSTOM_RULE_REF>",        "enabled": true      }    ],    "last_updated": "2021-03-19T10:48:04.057775Z",    "phase": "http_request_firewall_custom"  },  "success": true,  "errors": [],  "messages": []}
```

The example uses the url_decode() function because fields in the request body (available in http.request.body.form) are URL-encoded when the content type is application/x-www-form-urlencoded.

After creating the custom ruleset, deploy it to a phase so that it executes. You will need the ruleset ID to deploy the custom ruleset. For more information, refer to Deploy a custom ruleset.

### Example B

This POST request example creates a new custom ruleset with a rule that checks for exposed credentials in JSON responses. The rule has a match if both the rule expression and the exposed_credential_check result are true. When there is a match, the rule will add an Exposed-Credential-Check HTTP header to the request with value 1.

Required API token permissions

At least one of the following token permissions is required: - Account WAF Write
- Account Rulesets Write

Create an account ruleset ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "Custom Ruleset B",    "kind": "custom",    "description": "This ruleset includes a rule checking for exposed credentials.",    "rules": [        {            "action": "rewrite",            "action_parameters": {                "headers": {                    "Exposed-Credential-Check": {                        "operation": "set",                        "value": "1"                    }                }            },            "description": "Exposed credentials check on login endpoint with JSON body",            "expression": "http.request.method == \"POST\" && http.request.uri == \"/login.php\" && any(http.request.headers[\"content-type\"][*] == \"application/json\")",            "exposed_credential_check": {                "username_expression": "lookup_json_string(http.request.body.raw, \"username\")",                "password_expression": "lookup_json_string(http.request.body.raw, \"password\")"            }        }    ],    "phase": "http_request_firewall_custom"  }'
```

The response returns the created ruleset. Note the presence of the following elements in the rule definition:

- The rewrite action.
- The action_parameters object configuring the HTTP header added to requests with exposed credentials.
- The exposed_credential_check object.

```
{  "result": {    "id": "<CUSTOM_RULESET_ID>",    "name": "Custom Ruleset B",    "description": "This ruleset includes a rule checking for exposed credentials.",    "kind": "custom",    "version": "1",    "rules": [      {        "id": "<CUSTOM_RULE_ID>",        "version": "1",        "action": "rewrite",        "action_parameters": {          "headers": {            "Exposed-Credential-Check": {              "operation": "set",              "value": "1"            }          }        },        "description": "Exposed credentials check on login endpoint with JSON body",        "expression": "http.request.method == \"POST\" && http.request.uri == \"/login.php\" && any(http.request.headers[\"content-type\"][*] == \"application/json\")",        "exposed_credential_check": {          "username_expression": "lookup_json_string(http.request.body.raw, \"username\")",          "password_expression": "lookup_json_string(http.request.body.raw, \"password\")"        },        "last_updated": "2022-03-19T12:48:04.057775Z",        "ref": "<CUSTOM_RULE_REF>",        "enabled": true      }    ],    "last_updated": "2022-03-19T12:48:04.057775Z",    "phase": "http_request_firewall_custom"  },  "success": true,  "errors": [],  "messages": []}
```

After creating the custom ruleset, deploy it to a phase so that it executes. You will need the ruleset ID to deploy the custom ruleset. For more information, refer to Deploy a custom ruleset.

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

## Configure with Terraform

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/configure-terraform/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/configure-terraform/)

Page options # Configure with Terraform

The following Terraform configuration example addresses a common use case of exposed credentials checks.

For more information, refer to the Terraform Cloudflare provider documentation ↗.

If you are using the Cloudflare API, refer to Configure via API.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

## Add a custom rule to check for exposed credentials

The following configuration creates a custom ruleset with a single rule that checks for exposed credentials.

You can only add exposed credential checks to rules in a custom ruleset (that is, a ruleset with kind = "custom").

Note

Terraform code snippets below refer to the v4 SDK only.

```
resource "cloudflare_ruleset" "account_firewall_custom_ruleset_exposed_creds" {  account_id  = "<ACCOUNT_ID>"  name        = "Custom ruleset checking for exposed credentials"  description = ""  kind        = "custom"  phase       = "http_request_firewall_custom"
  rules {    ref         = "check_for_exposed_creds_add_header"    description = "Add header when there is a rule match and exposed credentials are detected"    expression  = "http.request.method == \"POST\" && http.request.uri == \"/login.php\""    action      = "rewrite"    action_parameters {      headers {        name      = "Exposed-Credential-Check"        operation = "set"        value     = "1"      }    }    exposed_credential_check {      username_expression = "url_decode(http.request.body.form[\"username\"][0])"      password_expression = "url_decode(http.request.body.form[\"password\"][0])"    }  }}
```

To create another rule, add a new rules object to the same cloudflare_ruleset resource.

The following configuration deploys the custom ruleset. It defines a dependency on the account_firewall_custom_ruleset_exposed_creds resource and obtains the ID of the created custom ruleset:

Note

Terraform code snippets below refer to the v4 SDK only.

```
resource "cloudflare_ruleset" "account_firewall_custom_entrypoint" {  account_id  = "<ACCOUNT_ID>"  name        = "Account-level entry point ruleset for the http_request_firewall_custom phase deploying a custom ruleset checking for exposed credentials"  description = ""  kind        = "root"  phase       = "http_request_firewall_custom"
  depends_on = [cloudflare_ruleset.account_firewall_custom_ruleset_exposed_creds]
  rules {    ref         = "deploy_custom_ruleset_example_com"    description = "Deploy custom ruleset for example.com"    expression  = "(cf.zone.name eq \"example.com\")"    action      = "execute"    action_parameters {      id = cloudflare_ruleset.account_firewall_custom_ruleset_exposed_creds.id    }  }}
```

## More resources

For additional Terraform configuration examples, refer to WAF custom rules configuration using Terraform.

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

## Test your configuration

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/test-configuration/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/test-configuration/)

Page options # Test your configuration

After enabling and configuring exposed credentials checks, you may want to test if the checks are working properly.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

Cloudflare provides a special set of case-sensitive credentials for this purpose:

- Login: CF_EXPOSED_USERNAME or CF_EXPOSED_USERNAME@example.com
- Password: CF_EXPOSED_PASSWORD

The WAF always considers these specific credentials as having been previously exposed. Use them to force an "exposed credentials" event, which allows you to check the behavior of your current configuration.

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

## Monitor exposed credentials events

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/monitor-events/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/monitor-events/)

Page options # Monitor exposed credentials events

Sampled logs in Security Events shows entries for requests with exposed credentials identified by rules with the Log action.

Check for exposed credentials events in the Security Events dashboard, filtering by a specific rule ID. For more information on filtering events, refer to Adjust displayed data.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

## Important notes

Exposed credentials events are only logged after you activate the Exposed Credentials Check Managed Ruleset or create a custom rule checking for exposed credentials.

The log entries will not contain the values of the exposed credentials (username, email, or password). However, if matched payload logging is enabled, the log entries will contain the values of the fields in the rule expression that triggered the rule. These values might be the values of credential fields, depending on your rule configuration.

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

## Upgrade to leaked credentials detection

**來源**: [https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/upgrade-to-leaked-credentials-detection/](https://developers.cloudflare.com/waf/managed-rules/check-for-exposed-credentials/upgrade-to-leaked-credentials-detection/)

Page options # Upgrade to leaked credentials detection

This guide describes the general steps to upgrade your Exposed Credentials Check configuration to the new leaked credentials detection.

Cloudflare recommends that customers update their configuration to use the new leaked credentials detection, which offers the following advantages:

- Uses a comprehensive database of leaked credentials, containing over 15 billion passwords.
- After enabling the detection, you can review the amount of incoming requests containing leaked credentials in Security Analytics, even before creating any mitigation rules.
- You can take action on the requests containing leaked credentials using WAF features like rate limiting rules or custom rules.

Note

This upgrade guide applies to customers changing from Exposed Credentials Check at the zone level.

## 1. Turn off Exposed Credentials Check

If you had deployed the Cloudflare Exposed Credentials Check managed ruleset:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Managed rules tab.
3. Under Managed rules, edit the rule that executes the Cloudflare Exposed Credentials Check Ruleset and take note of the current configuration (namely the performed action). Next, delete (or turn off) that rule.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules and filter by Managed rules.
3. Edit the rule that executes the Cloudflare Exposed Credentials Check Ruleset and take note of the current configuration (namely the performed action). Next, delete (or turn off) that rule.

Note

While Exposed Credentials Check and leaked credentials detection can work side by side, enabling both features will increase the latency on incoming requests related to authentication.

## 2. Turn on leaked credentials detection

On Free plans, the leaked credentials detection is enabled by default, and no action is required. On paid plans, you can turn on the detection in the Cloudflare dashboard, via API, or using Terraform.

- Old dashboard
- New dashboard
- API
- Terraform

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under Incoming traffic detections, turn on Leaked credentials.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on Leaked credential detection.

Use a POST request similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Zone WAF Write
- Account WAF Write

Set Leaked Credential Checks Status ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/leaked-credential-checks" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "enabled": true  }'
```

Use the cloudflare_leaked_credential_check resource to enable leaked credentials detection for a zone. For example:

```
resource "cloudflare_leaked_credential_check" "zone_lcc_example" {  zone_id = "<ZONE_ID>"  enabled = true}
```

## 3. Configure the actions to take

Based on your previous configuration, do one of the following:

- If you were using the default action in Exposed Credentials Check: Turn on the Add Leaked Credentials Checks Header managed transform that adds the Exposed-Credential-Check header to incoming requests containing leaked credentials. Even though the header name is the same as in Exposed Credentials Check, the header values in the new implementation will vary between 1 and 4.
- If you were using a different action: Create a custom rule with an action equivalent to the one you were using. The rule should match User and password leaked is true (if you are using the expression editor, enter (cf.waf.credential_check.username_and_password_leaked)).

## More resources

- Check for the results of leaked credentials detection in Security Analytics.
- Refer to Example mitigation rules for example mitigation strategies you can use when detecting leaked credentials.

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

## Cloudflare Managed Ruleset

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/cloudflare-managed-ruleset/](https://developers.cloudflare.com/waf/managed-rules/reference/cloudflare-managed-ruleset/)

Page options # Cloudflare Managed Ruleset

Created by the Cloudflare security team, this ruleset provides fast and effective protection for all of your applications. The ruleset is updated frequently to cover new vulnerabilities and reduce false positives.

Cloudflare recommends that you enable the rules whose tags correspond to your technology stack. For example, if you use WordPress, enable the rules tagged with wordpress.

Cloudflare’s WAF changelog allows you to monitor ongoing changes to the WAF's managed rulesets.

Note

Some rules in the Cloudflare Managed Ruleset are disabled by default, intending to strike a balance between providing the right protection and reducing the number of false positives.

It is not recommended that you enable all the available rules using overrides, since it may affect legitimate traffic, unless you are running a proof of concept (PoC) to understand what kind of requests the WAF can block.

## Configure in the dashboard

You can configure the following settings of the Cloudflare Managed Ruleset in the Cloudflare dashboard:

- Set the action to perform. When you define an action for the ruleset, you override the default action defined for each rule. The available actions are: Managed Challenge, Block, JS Challenge, Log, and Interactive Challenge. To remove the action override, set the ruleset action to Default.
- Override the action performed by individual rules or rules with specific tags. The available actions are: Managed Challenge, Block, JS Challenge, Log, and Interactive Challenge.
- Disable specific rules or rules with specific tags.
- Customize the filter expression. With a custom expression, the Cloudflare Managed Ruleset applies only to a subset of the incoming requests.
- Configure payload logging.

For details on configuring a managed ruleset in the dashboard, refer to Configure a managed ruleset.

## Configure via API

To enable the Cloudflare Managed Ruleset for a given zone via API, create a rule with execute action in the entry point ruleset for the http_request_firewall_managed phase.

### Example

The following example deploys the Cloudflare Managed Ruleset to the http_request_firewall_managed phase of a given zone ($ZONE_ID) by creating a rule that executes the managed ruleset.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_managed phase. You will need the zone ID for this task.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Zone-level phase entry point",    "id": "<RULESET_ID>",    "kind": "zone",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "zone",    "phase": "http_request_firewall_managed",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add an execute rule to the existing ruleset deploying the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee). By default, the rule will be added at the end of the list of rules already in the ruleset.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee"    },    "expression": "true",    "description": "Execute the Cloudflare Managed Ruleset"  }'
{  "result": {    "id": "<RULESET_ID>",    "name": "Zone-level phase entry point",    "description": "",    "kind": "zone",    "version": "11",    "rules": [      // ... any existing rules      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee",          "version": "latest"        },        "expression": "true",        "description": "Execute the Cloudflare Managed Ruleset",        "last_updated": "2024-03-18T18:08:14.003361Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2024-03-18T18:08:14.003361Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include a single rule in the rules array that executes the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee) for all incoming requests in the zone.
Create a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets",    "kind": "zone",    "phase": "http_request_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "efb7b8c949ac4650a09736fc376e9aee"            },            "expression": "true",            "description": "Execute the Cloudflare Managed Ruleset"        }    ]  }'

### Next steps

To configure the Cloudflare Managed Ruleset via API, create overrides using the Rulesets API. You can perform the following configurations:

- Specify the action to perform for all the rules in the ruleset by creating a ruleset override.
- Disable or customize the action of
individual rules by creating rule overrides.

For examples of creating overrides using the API, refer to Override a managed ruleset.

### More resources

For more information on working with managed rulesets via API, refer to Work with managed rulesets in the Ruleset Engine documentation.

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

## Cloudflare OWASP Core Ruleset

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/)

Page options # Cloudflare OWASP Core Ruleset

The Cloudflare OWASP Core Ruleset is Cloudflare's implementation of the OWASP ModSecurity Core Rule Set ↗ (CRS). Cloudflare routinely monitors for updates from OWASP based on the latest version available from the official code repository.

The Cloudflare OWASP Core Ruleset is designed to work as a single entity to calculate a threat score and execute an action based on that score. When a rule in the ruleset matches a request, the threat score increases according to the rule score. If the final threat score is greater than the configured score threshold, Cloudflare executes the action configured in the last rule of the ruleset.

Note

The Cloudflare OWASP Core Ruleset is Cloudflare's implementation of the OWASP ModSecurity Core Rule Set, which is different from the OWASP Top 10 ↗.

The OWASP Top 10 is a list of the most severe security risks that can affect applications. Some of the identified security risks can be addressed by the OWASP Core Ruleset, but other risks cannot be protected by a web application firewall, such as the following:

- Insecure Design
- Identification and Authentication Failures
- Security Logging and Monitoring Failures

These risks depend more on how the application is built or how the entire monitoring pipeline is set up.

## Resources

- Concepts
- Evaluation example
- Configure in the dashboard
- Configure via API
- Configure in Terraform

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

## Concepts

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/concepts/](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/concepts/)

Page options # Concepts

## Paranoia level

The paranoia level (PL) classifies OWASP rules according to their aggressiveness. Paranoia levels vary from PL1 to PL4, where PL4 is the most strict level:

- PL1 (default value)
- PL2
- PL3
- PL4

Each rule in the OWASP managed ruleset is associated with a paranoia level. Rules associated with higher paranoia levels are considered more aggressive and provide increased protection. However, they might cause more legitimate traffic to get blocked due to false positives.

When you configure the paranoia level of the OWASP ruleset, you are enabling all the rules belonging to all paranoia levels up to the level you select. For example, if you configure the ruleset paranoia level to PL3, you are enabling rules belonging to paranoia levels PL1, PL2, and PL3.

When you set the ruleset paranoia level, the WAF enables the corresponding rules in bulk. You then can disable specific rules individually or by tag, if needed. If you use the highest paranoia level (PL4) you will probably need to disable some of its rules for applications that need to receive complex input patterns.

## Request threat score

Each OWASP rule that matches the current request has an associated score. The request threat score is the sum of the individual scores of all OWASP rules that matched the request.

## Score threshold

The score threshold (or anomaly threshold) defines the minimum cumulative score — obtained from matching OWASP rules — for the WAF to apply the configured OWASP ruleset action.

The available score thresholds are the following:

- Low – 60 and higher
- Medium – 40 and higher (default value)
- High – 25 and higher

Each threshold (Low, Medium, and High) has an associated value (60, 40, and 25, respectively). Configuring a Low threshold means that more rules will have to match the current request for the WAF to apply the configured ruleset action. For an example, refer to OWASP evaluation example.

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

## Evaluation example

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/example/](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/example/)

Page options # Evaluation example

The following example calculates the OWASP request threat score for an incoming request. The OWASP managed ruleset configuration is the following:

- OWASP Anomaly Score Threshold: High - 25 and higher
- OWASP Paranoia Level: PL3
- OWASP Action: Managed Challenge

This table shows the progress of the OWASP ruleset evaluation:

| Rule ID | Paranoia level | Rule matched? | Rule score | Cumulativethreat score |
| --- | --- | --- | --- | --- |
| – | – | – | – | 0 |
| ...1813a269 | PL3 | Yes | +5 | 5 |
| ...ccc02be6 | PL3 | No | – | 5 |
| ...96bfe867 | PL2 | Yes | +5 | 10 |
| ...48b74690 | PL1 | Yes | +5 | 15 |
| ...3297003f | PL2 | Yes | +3 | 18 |
| ...317f28e1 | PL1 | No | – | 18 |
| ...682bb405 | PL2 | Yes | +5 | 23 |
| ...56bb8946 | PL2 | No | – | 23 |
| ...e5f94216 | PL3 | Yes | +3 | 26 |
| (...) | (...) | (...) | (...) | (...) |
| ...f3b37cb1 | PL4 | (not evaluated) | – | 26 |

Final request threat score: 26

Since 26 >= 25 — that is, the threat score is greater than the configured score threshold — Cloudflare will apply the configured action (Managed Challenge). If you had configured a score threshold of Medium - 40 and higher, Cloudflare would not apply the action, since the request threat score would be lower than the score threshold (26 < 40).

Sampled logs in Security Events would display the following details for the example incoming request handled by the OWASP Core Ruleset:

In sampled logs, the rule associated with requests mitigated by the Cloudflare OWASP Core Ruleset is the last rule in this managed ruleset: 949110: Inbound Anomaly Score Exceeded, with rule ID    ...843b323c     . To get the scores of individual rules contributing to the final request threat score, expand Additional logs in the event details.

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

## Configure in the dashboard

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/configure-dashboard/](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/configure-dashboard/)

Page options # Configure in the dashboard

You can configure the following settings of the Cloudflare OWASP Core Ruleset in the dashboard:

- Set the paranoia level. The available levels are PL1 (default), PL2, PL3, and PL4.
- Set the score threshold. The available thresholds are: Low - 60 and higher, Medium - 40 and higher (default), or High - 25 and higher.
- Set the action to perform. The action is executed when the calculated request threat score is greater than the score threshold. The available actions are: Block (default), Managed Challenge, JS Challenge, Log, and Interactive Challenge.
- Disable specific rules or rules with specific tags.
- Customize the filter expression. With a custom expression, the Cloudflare OWASP Core Ruleset applies only to a subset of the incoming requests.
- Configure payload logging.

For details on configuring a managed ruleset in the dashboard, refer to Configure a managed ruleset.

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

## Configure via API

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/configure-api/](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/configure-api/)

Page options # Configure via API

To enable the Cloudflare OWASP Core Ruleset for a given zone using the API, create a rule with execute action in the entry point ruleset for the http_request_firewall_managed phase. For more information on deploying a managed ruleset, refer to Deploy a managed ruleset.

To configure the Cloudflare OWASP Core Ruleset using the API, create overrides using the Rulesets API. You can perform the following configurations:

- Set the paranoia level.
- Configure the score threshold.
- Specify the action to perform when the threat score is greater than the threshold.

You can also disable specific rules in the managed ruleset using rule overrides.

## Set the paranoia level

To enable all the rules up to a specific paranoia level, create tag overrides that disable all the rules associated with higher paranoia levels.

The tags associated with the different paranoia levels are the following:

- paranoia-level-1
- paranoia-level-2
- paranoia-level-3
- paranoia-level-4

For example, to enable all the rules associated with Paranoia Level 2 (PL2), disable the rules associated with tags paranoia-level-3 and paranoia-level-4. All rules associated with paranoia levels up to the desired paranoia level will be enabled (in this example, all the rules associated with PL1 and PL2).

### Example

This example sets the Cloudflare OWASP Core Ruleset's paranoia level for a zone to PL2. To perform this configuration, you must disable the tags associated with levels PL3 and PL4 (paranoia-level-3 and paranoia-level-4) using tag overrides.

1. Get the ID of the Cloudflare OWASP Core Ruleset using the List account rulesets method, since WAF's managed rulesets exist at the account level. Alternatively, use the following ruleset ID directly:    ...c25d2f1f     .
List account rulesetscurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": [    {      "id": "4814384a9e5d4991b9815dcfc25d2f1f",      "name": "Cloudflare OWASP Core Ruleset",      "description": "Cloudflare's implementation of the Open Web Application Security Project (OWASP) ModSecurity Core  Rule Set. We routinely monitor for updates from OWASP based on the latest version available from the official  code repository",      "source": "firewall_managed",      "kind": "managed",      "version": "35",      "last_updated": "2022-01-24T21:08:20.293196Z",      "phase": "http_request_firewall_managed"    }    // (...)  ],  "success": true,  "errors": [],  "messages": []}
2. Get the ID of the rule that deploys the OWASP ruleset to your zone using the Get a zone entry point ruleset. Search for a rule with "action": "execute" configured with the OWASP ruleset's ID in the action_parameters object (ID    ...c25d2f1f     ). This rule will only exist if you have already deployed the OWASP ruleset.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "<ENTRY_POINT_RULESET_ID>",    "name": "zone",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)      {        "id": "<EXECUTE_RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "4814384a9e5d4991b9815dcfc25d2f1f",          "version": "latest"        },        "expression": "true",        "last_updated": "2022-02-04T16:27:58.930927Z",        "ref": "<RULE_REF>",        "enabled": true      }      // (...)    ],    "last_updated": "2022-02-07T10:41:31.702744Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. Update the rule you identified using the Update a zone ruleset rule operation, adding tag overrides that disable the rules with tags paranoia-level-3 and paranoia-level-4.
Update a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules/$EXECUTE_RULE_ID" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "4814384a9e5d4991b9815dcfc25d2f1f",        "overrides": {            "categories": [                {                    "category": "paranoia-level-3",                    "enabled": false                },                {                    "category": "paranoia-level-4",                    "enabled": false                }            ]        }    },    "expression": "true",    "enabled": true  }'

For more information on creating overrides, refer to Override a managed ruleset.

## Configure the score threshold and the action

To define the score threshold, or to specify the action to perform when the threat score is greater than the threshold, create a rule override for the last rule in the managed ruleset that:

- Specifies the action to take in the action property. The available actions are: block (default), managed_challenge, js_challenge, log, and challenge.
- Defines the desired anomaly score threshold (an integer value) in the score_threshold property.

### Example

This example configures the managed ruleset score threshold and the performed action by creating a rule override for the last rule of the managed ruleset.

1. Get the ID of the Cloudflare OWASP Core Ruleset using the List account rulesets method, since WAF's managed rulesets exist at the account level. Alternatively, use the following ruleset ID directly:    ...c25d2f1f     .
List account rulesetscurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": [    {      "id": "4814384a9e5d4991b9815dcfc25d2f1f",      "name": "Cloudflare OWASP Core Ruleset",      "description": "Cloudflare's implementation of the Open Web Application Security Project (OWASP) ModSecurity Core Rule Set. We routinely monitor for updates from OWASP based on the latest version available from the official code repository",      "source": "firewall_managed",      "kind": "managed",      "version": "35",      "last_updated": "2022-01-24T21:08:20.293196Z",      "phase": "http_request_firewall_managed"    }    // (...)  ],  "success": true,  "errors": [],  "messages": []}
2. Get the ID of the last rule in the Cloudflare OWASP Core Ruleset. Use the Get an account ruleset method to obtain the list of rules in the ruleset. Alternatively, use the following rule ID directly:    ...843b323c     .
Get an account rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$OWASP_RULESET_ID" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "4814384a9e5d4991b9815dcfc25d2f1f",    "name": "Cloudflare OWASP Core Ruleset",    "description": "Cloudflare's implementation of the Open Web Application Security Project (OWASP) ModSecurity Core Rule Set. We routinely monitor for updates from OWASP based on the latest version available from the official code repository",    "source": "firewall_managed",    "kind": "managed",    "version": "36",    "rules": [      // (...)      {        "id": "6179ae15870a4bb7b2d480d4843b323c",        "version": "35",        "action": "block",        "score_threshold": 40,        "description": "949110: Inbound Anomaly Score Exceeded",        "last_updated": "2022-02-08T16:11:18.236676Z",        "ref": "ad0beb2fce9f149e565ee78d6e659d47",        "enabled": true      }    ],    "last_updated": "2022-02-08T16:11:18.236676Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. Get the ID of the rule that deploys the OWASP ruleset to your zone using the Get a zone entry point ruleset (in this example, <EXECUTE_RULE_ID>). Search for a rule with "action": "execute" configured with the OWASP ruleset's ID in the action_parameters object (ID    ...c25d2f1f     ). This rule will only exist if you have already deployed the OWASP ruleset.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "id": "<ENTRY_POINT_RULESET_ID>",    "name": "zone",    "description": "",    "source": "firewall_managed",    "kind": "zone",    "version": "3",    "rules": [      // (...)      {        "id": "<EXECUTE_RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "4814384a9e5d4991b9815dcfc25d2f1f",          "version": "latest"        },        "expression": "true",        "last_updated": "2022-02-04T16:27:58.930927Z",        "ref": "<RULE_REF>",        "enabled": true      }      // (...)    ],    "last_updated": "2022-02-07T10:41:31.702744Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
4. Update the rule you identified in the entry point ruleset using the Update a zone ruleset rule operation, adding a rule override for the last rule in the OWASP ruleset (identified in step 2) with the following properties and values:

"score_threshold": 60
"action": "managed_challenge"

Update a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules/$EXECUTE_RULE_ID" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "4814384a9e5d4991b9815dcfc25d2f1f",        "overrides": {            "rules": [                {                    "id": "6179ae15870a4bb7b2d480d4843b323c",                    "score_threshold": 60,                    "action": "managed_challenge"                }            ]        }    },    "expression": "true",    "enabled": true  }'
5. "score_threshold": 60
6. "action": "managed_challenge"

## More resources

For more API examples, refer to Managed ruleset override examples in the Ruleset Engine documentation.

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

## Cloudflare Exposed Credentials Check Managed Ruleset

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/exposed-credentials-check/](https://developers.cloudflare.com/waf/managed-rules/reference/exposed-credentials-check/)

Page options # Cloudflare Exposed Credentials Check Managed Ruleset

The Cloudflare Exposed Credentials Check Managed Ruleset is a set of pre-configured rules for well-known CMS applications that perform a lookup against a public database of stolen credentials.

Recommendation: Use leaked credentials detection instead

Cloudflare recommends that you use leaked credentials detection instead of Cloudflare Exposed Credentials Check, which refers to a previous implementation.
For more information on upgrading your current Exposed Credentials Check configuration, refer to the upgrade guide.

The managed ruleset includes rules for the following CMS applications:

- WordPress
- Joomla
- Drupal
- Ghost
- Plone
- Magento

Additionally, this managed ruleset also includes generic rules for other common patterns:

- Check forms submitted using a POST request containing username and password arguments
- Check credentials sent as JSON with email and password keys
- Check credentials sent as JSON with username and password keys

The default action for the rules in managed ruleset is Exposed-Credential-Check Header (named rewrite in the API and in Security Events).

The managed ruleset also contains a rule that blocks HTTP requests already containing the Exposed-Credential-Check HTTP header used by the Exposed-Credential-Check Header action. These requests could be used to trick the origin into believing that a request contained (or did not contain) exposed credentials.

For more information on exposed credential checks, refer to Check for exposed credentials.

## Configure in the dashboard

Note

The Exposed Credentials Check managed ruleset is only shown in the Cloudflare dashboard if you have previously deployed it. Cloudflare recommends that you use leaked credentials detection instead.

You can configure the following settings of the Cloudflare Exposed Credentials Check Managed Ruleset in the dashboard:

- Set the action to perform. When you define an action for the ruleset, you override the default action defined for each rule. The available actions are: Managed Challenge, Block, JS Challenge, Log, and Interactive Challenge. To remove the action override, set the ruleset action to Default.
- Override the action performed by individual rules. The available actions are: Exposed-Credential-Check Header, Managed Challenge, Block, JS Challenge, Log, and Interactive Challenge. For more information, refer to Available actions.
- Disable specific rules.
- Customize the filter expression. With a custom expression, the Cloudflare Exposed Credentials Check Managed Ruleset applies only to a subset of the incoming requests.
- Configure payload logging.

For details on configuring a managed ruleset in the dashboard, refer to Configure a managed ruleset.

## Configure via API

To enable the Cloudflare Exposed Credentials Check Managed Ruleset for a given zone via API, create a rule with execute action in the entry point ruleset for the http_request_firewall_managed phase.

### Example

This example deploys the Cloudflare Exposed Credentials Check Managed Ruleset to the http_request_firewall_managed phase of a given zone ($ZONE_ID) by creating a rule that executes the managed ruleset. The rules in the managed ruleset are executed for all incoming requests.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_managed phase. You will need the zone ID for this task.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Zone-level phase entry point",    "id": "<ENTRY_POINT_RULESET_ID>",    "kind": "zone",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "zone",    "phase": "http_request_firewall_managed",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add an execute rule to the existing ruleset deploying the Cloudflare Exposed Credentials Check Managed Ruleset (with ID c2e184081120413c86c3ab7e14069605). By default, the rule will be added at the end of the list of rules already in the ruleset.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$ENTRY_POINT_RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "c2e184081120413c86c3ab7e14069605"    },    "expression": "true",    "description": "Execute the Cloudflare Exposed Credentials Check Managed Ruleset"  }'
{  "result": {    "id": "<ENTRY_POINT_RULESET_ID>",    "name": "Zone-level phase entry point",    "description": "",    "kind": "zone",    "version": "11",    "rules": [      // ... any existing rules      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "c2e184081120413c86c3ab7e14069605",          "version": "latest"        },        "expression": "true",        "description": "Execute the Cloudflare Exposed Credentials Check Managed Ruleset",        "last_updated": "2024-03-18T18:08:14.003361Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2024-03-18T18:08:14.003361Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include a single rule in the rules array that executes the Cloudflare Exposed Credentials Check Managed Ruleset (with ID c2e184081120413c86c3ab7e14069605) for all incoming requests in the zone.
Create a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets",    "kind": "zone",    "phase": "http_request_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "c2e184081120413c86c3ab7e14069605"            },            "expression": "true",            "description": "Execute the Cloudflare Exposed Credentials Check Managed Ruleset"        }    ]  }'

### Next steps

To configure the Exposed Credentials Check Managed Ruleset via API, create overrides using the Rulesets API. You can perform the following configurations:

- Specify the action to perform for all the rules in the ruleset by creating a ruleset override.
- Disable or customize the action of
individual rules by creating rule overrides.

For examples of creating overrides using the API, refer to Override a managed ruleset.

Checking for exposed credentials in custom rules

Besides activating the Exposed Credentials Check Managed Ruleset, you can also check for exposed credentials in custom rules. One common use case is to create custom rules on the end user authentication endpoints of your application to check for exposed credentials.

For more information, refer to Create a custom rule checking for exposed credentials.

### More resources

For more information on working with managed rulesets via API, refer to Work with managed rulesets in the Ruleset Engine documentation.

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

## Cloudflare Sensitive Data Detection

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/sensitive-data-detection/](https://developers.cloudflare.com/waf/managed-rules/reference/sensitive-data-detection/)

Page options # Cloudflare Sensitive Data Detection

Note

This feature requires an Enterprise plan with a paid add-on.

The Cloudflare Sensitive Data Detection managed ruleset helps identify data leaks generated by your origin servers. Its rules run on the body of the response looking for patterns of common sensitive data, including:

- Personally identifiable information ↗ (PII) — For example, passport numbers.
- Financial information — For example, credit card numbers.
- Secrets — For example, API keys.

Turning on Cloudflare Sensitive Data Detection will not introduce additional latency, since the detection occurs outside the response path. For this reason, rules are always deployed with the Log action (you cannot block a response that was already sent), providing you with visibility on the sensitive data leaving your origin servers.

Some rules in the Cloudflare Sensitive Data Detection managed ruleset are disabled by default, to prevent false positives and a large number of logged events. You should review the PII and sensitive data relevant to your application and turn on the appropriate rules in the managed ruleset, according to the instructions in the following sections.

## Additional remarks

When turned on, Cloudflare Sensitive Data Detection will check all responses sent to visitors (according to your custom filter expression, if defined), including responses from cache and responses handled by Workers.

The detection will handle text, HTML, JSON, and XML content in the response up to 1 MB.

Currently, Cloudflare Sensitive Data Detection does not support matched payload logging.

## Configure in the dashboard

- Old dashboard
- New dashboard

To configure Cloudflare Sensitive Data Detection in the Cloudflare dashboard, go to Security > Sensitive Data.

You can turn the managed ruleset on or off, and configure the following settings:

- Turn on or off specific rules or rules with specific tags.
- Customize the filter expression. With a custom expression, Cloudflare Sensitive Data Detection applies only to a subset of the incoming requests.

To enable Cloudflare Sensitive Data Detection:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Detections.
3. Turn on Sensitive data detection.

To adjust the scope of the managed ruleset or turn off specific rules:

1. In the Settings page, under Sensitive data detection, select Configured ruleset.
2. To apply the managed ruleset for a subset of incoming requests, select Custom filter expression and define the filter expression.
3. Select Next.
4. To turn specific rules on or off, select Browse rules and use the toggle next to each rule to turn it on or off.
5. Select Next, and then select Save.

For details on configuring a managed ruleset in the dashboard, refer to Configure a managed ruleset.

## Configure via API

To enable Cloudflare Sensitive Data Detection for a given zone using the API, create a rule with execute action in the entry point ruleset for the http_response_firewall_managed phase.

### Example

This example deploys the Cloudflare Sensitive Data Detection managed ruleset to the http_response_firewall_managed phase of a given zone ($ZONE_ID) by creating a rule that executes the managed ruleset. The rules in the managed ruleset are executed for all incoming requests.

1. Invoke the Get a zone entry point ruleset operation to obtain the definition of the entry point ruleset for the http_response_firewall_managed phase. You will need the zone ID for this task.
Get a zone entry point rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_response_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Zone-level phase entry point (response)",    "id": "<RULESET_ID>",    "kind": "zone",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "zone",    "phase": "http_response_firewall_managed",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create a zone ruleset rule operation to add an execute rule to the existing ruleset deploying the Cloudflare Sensitive Data Detection managed ruleset (with ID e22d83c647c64a3eae91b71b499d988e). By default, the rule will be added at the end of the list of rules already in the ruleset.
Create a zone ruleset rulecurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "e22d83c647c64a3eae91b71b499d988e"    },    "expression": "true",    "description": "Execute the Cloudflare Sensitive Data Detection managed ruleset"  }'
{  "result": {    "id": "<RULESET_ID>",    "name": "Zone-level phase entry point (response)",    "description": "",    "kind": "zone",    "version": "11",    "rules": [      // ... any existing rules      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "e22d83c647c64a3eae91b71b499d988e",          "version": "latest"        },        "expression": "true",        "description": "Execute the Cloudflare Sensitive Data Detection managed ruleset",        "last_updated": "2024-03-18T18:08:14.003361Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2024-03-18T18:08:14.003361Z",    "phase": "http_response_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
3. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create a zone ruleset operation. Include a single rule in the rules array that executes the Cloudflare Sensitive Data Detection managed ruleset (with ID e22d83c647c64a3eae91b71b499d988e) for all incoming requests in the zone.
Create a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets (response)",    "kind": "zone",    "phase": "http_response_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "e22d83c647c64a3eae91b71b499d988e"            },            "expression": "true",            "description": "Execute the Cloudflare Sensitive Data Detection managed ruleset"        }    ]  }'

### Next steps

To configure the Cloudflare Sensitive Data Detection managed ruleset via API, create overrides using the Rulesets API. You can perform the following configurations:

- Disable 
individual rules by creating rule overrides.

For examples of creating overrides using the API, refer to Override a managed ruleset.

### More resources

For more information on working with managed rulesets via API, refer to Work with managed rulesets in the Ruleset Engine documentation.

## Review detected leaks

To check for any data leaks detected by Cloudflare Sensitive Data Detection, you can do the following:

- Regularly check Security Events for any events generated by the managed ruleset.
- Configure WAF alerts to be alerted of any spike of WAF events. For the Advanced Security Events Alert, you can filter by one or more domains on Enterprise plans and by the Data Loss Protection service to receive specific alerts about Sensitive Data Detection.

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

## Lists

**來源**: [https://developers.cloudflare.com/waf/tools/lists/](https://developers.cloudflare.com/waf/tools/lists/)

Page options # Lists

Use lists to refer to a group of items (such as IP addresses) collectively, by name, in rule expressions of Cloudflare products. You can create your own custom lists or use lists managed by Cloudflare, such as Managed IP Lists.

Lists have the following advantages:

- When creating a rule, using a list is easier and less error-prone than adding a long list of items such as IP addresses to a rule expression.
- When updating a set of rules that target the same group of IP addresses (or hostnames), using an IP list (or a hostname list) is easier and less error prone than editing multiple rules.
- Lists are easier to read and more informative, particularly when you use descriptive names for your lists.

When you update the content of a list, any rules that use the list are automatically updated, so you can make a single change to your list rather than modify rules individually.

Cloudflare stores your lists at the account level. You can use the same list in rules of different zones in your Cloudflare account.

## Supported lists

Cloudflare supports the following lists:

- Custom lists: Includes custom IP lists, hostname lists, and ASN lists.
- Managed Lists: Lists managed and updated by Cloudflare, such as Managed IP Lists.

Refer to each page for details.

Note

Bulk Redirects use Bulk Redirect Lists, a different type of list covered in the Rules documentation.

## List names

The name of a list must comply with the following requirements:

- The name uses only lowercase letters, numbers, and the underscore (_) character in the name. A valid name satisfies this regular expression: ^[a-z0-9_]+$.
- The maximum length of a list name is 50 characters.

## Work with lists

### Create and edit lists

You can create lists in the Cloudflare dashboard or using the Lists API.

After creating a list, you can add and remove items from the list, but you cannot change the list name or type.

### Use lists in expressions

Both the Cloudflare dashboard and the Cloudflare API support lists:

- To use lists in an expression from the Cloudflare dashboard, refer to Use lists in expressions.
- To reference a list in an API expression, refer to Values: Lists in the Rules language reference.

Warning

Currently, not all Cloudflare products support lists in their expressions. Refer to the documentation of each individual product for details on list support.

### Search list items

You can search for list items in the dashboard or via API.

For IP Lists, Cloudflare will return IP addresses/ranges that start with your search query (search by prefix). Currently, you cannot search for an IP address contained in a CIDR range of an IP List.

For Bulk Redirect Lists, Cloudflare will return the URL redirects in the list where the source URL or target URL contain your search query (search by substring).

## Availability

List availability varies according to the list type and your Cloudflare plan and subscriptions.

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Number of custom lists (any type) | 1 | 10 | 10 | 1,000 |
| Max. number of list items (across all custom lists) | 10,000 | 10,000 | 10,000 | 500,000 |
| IP lists | Yes | Yes | Yes | Yes |
| Other custom lists (hostnames, ASNs) | No | No | No | Yes |
| Managed IP List: Cloudflare Open Proxies | No | No | No | Yes |
| All Managed IP Lists | No | No | No | With separate add-on |

Notes:

- The number of available custom lists depends on the highest plan in your account. Any account with at least one paid plan will get the highest quota.
- Customers on Enterprise plans can create a maximum of 1,000 custom lists in total across different list types. The following additional limits apply:

Up to 40 hostname lists, with a maximum of 10,000 list items across all hostname lists.
Up to 40 ASN lists, with a maximum of 30,000 list items across all ASN lists.
- Up to 40 hostname lists, with a maximum of 10,000 list items across all hostname lists.
- Up to 40 ASN lists, with a maximum of 30,000 list items across all ASN lists.
- The Cloudflare Enterprise plan provides access to the Cloudflare Open Proxies Managed IP List. Other Managed IP Lists are available as part of Enterprise Security Bundles. For more information, contact your account team.
- Customers on Enterprise plans may contact their account team if they need more custom lists or a larger maximum number of items across lists.
- For details on the availability of Bulk Redirect Lists, refer to the Rules documentation.

## User role requirements

The following user roles have access to the list management functionality:

- Super Administrator
- Administrator
- Firewall

## Final remarks

You can only delete a list when there are no rules (enabled or disabled) that reference that list.

Cloudflare will apply the following rules when you add items to an existing list (either manually or via CSV file):

- Do not remove any existing list items before updating/adding items.
- Update items that were already in the list.
- Add items that were not present in the list.

To replace the entire contents of a list, format the data as an array and use the Update all list items operation in the Lists API.

You cannot download a list in CSV format from the Cloudflare dashboard. If you need to download the contents of a list, use the Get list items operation to fetch the list items.

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

## Custom lists

**來源**: [https://developers.cloudflare.com/waf/tools/lists/custom-lists/](https://developers.cloudflare.com/waf/tools/lists/custom-lists/)

Page options # Custom lists

A custom list contains one or more items of the same type (for example, IP addresses, hostnames, or ASNs) that you can reference collectively, by name, in rule expressions.

Cloudflare supports the following custom list types:

- Lists with IP addresses (also known as IP lists)
- Lists with hostnames
- Lists with ASNs (autonomous system ↗ numbers)

Note

Lists with hostnames and ASNs are only available to Enterprise customers. Refer to Availability for details.

Each type has its own properties and CSV file format. Refer to the following sections for details.

For more information on lists managed by Cloudflare, such as Managed IP Lists, refer to Managed Lists.

## Create a custom list

Refer to Create a list in the dashboard or to the Lists API page.

## Use a custom list

Use custom lists in rule expressions with the in operator and with a field supported by the custom list:

```
<FIELD> in $<LIST_NAME>
```

The fields you can use vary according to the list item type:

| List item type | Available fields |
| --- | --- |
| IP address | Fields with type IP address listed in the Fields reference |
| Hostname | http.host |
| ASN | ip.src.asnum |

For more information and examples, refer to Use lists in expressions.

## Custom list types

### Lists with IP addresses (IP lists)

List items in custom lists with IP addresses must be in one of the following formats:

- Individual IPv4 addresses
- Individual IPv6 addresses
- IPv4 CIDR ranges with a prefix from /8 to /32
- IPv6 CIDR ranges with a prefix from /12 to /128

The same list can contain both individual addresses and CIDR ranges.

You can use uppercase or lowercase characters for IPv6 addresses in lists. However, when you save the list, uppercase characters are converted to lowercase.

CSV file format

When uploading items to a custom list with IP addresses via CSV file, use the following file format (enter one item per line):

```
<IP_ADDRESS_1>,<DESCRIPTION><IP_ADDRESS_2>
```

The <DESCRIPTION> field is optional.

### Lists with hostnames

Note

Available to Enterprise customers.

List items in custom lists with hostnames must be Fully Qualified Domain Names (FQDNs). An item may contain a * prefix/subdomain wildcard, which must be followed by a . (period). An item cannot include a scheme (for example, https://) or a URL path.

For example, the following entries would be valid for a custom list with hostnames:

- example.com
- api.example.com
- *.example.com

However, example.com/path/subfolder would not be a valid entry.

You can add any valid hostname (a valid FQDN) to a custom list with hostnames. The hostnames do not need to belong to the current Cloudflare account.

CSV file format

When uploading items to a custom list with hostnames via CSV file, use the following file format:

```
<HOSTNAME_1>,<DESCRIPTION><HOSTNAME_2>
```

The <DESCRIPTION> field is optional.

### Lists with ASNs

Note

Available to Enterprise customers.

List items in custom lists with autonomous system numbers (ASNs) must be integer values.

For example, the following entries would be valid for a list with ASNs:

- 1
- 13335
- 64512

CSV file format

When uploading items to a custom list with ASNs via CSV file, use the following file format:

```
<ASN_1>,<DESCRIPTION><ASN_2>
```

The <DESCRIPTION> field is optional.

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

## Managed Lists

**來源**: [https://developers.cloudflare.com/waf/tools/lists/managed-lists/](https://developers.cloudflare.com/waf/tools/lists/managed-lists/)

Page options # Managed Lists

Cloudflare provides Managed Lists you can use in rule expressions. These lists are regularly updated.

Note

The available Managed Lists depend on your Cloudflare plan and product subscriptions. Refer to Availability for details.

## Managed IP Lists

Use Managed IP Lists to access Cloudflare's IP threat intelligence.

Cloudflare provides the following Managed IP Lists:

| Display name | Name in expressions | Description |
| --- | --- | --- |
| Cloudflare Open Proxies | cf.open_proxies | IP addresses of known open HTTP and SOCKS proxy endpoints, which are frequently used to launch attacks and hide attackers identity. |
| Cloudflare Anonymizers | cf.anonymizer | IP addresses of known anonymizers (Open SOCKS Proxies, VPNs, and TOR nodes). |
| Cloudflare VPNs | cf.vpn | IP addresses of known VPN servers. |
| Cloudflare Malware | cf.malware | IP addresses of known sources of malware. |
| Cloudflare Botnets, Command and Control Servers | cf.botnetcc | IP addresses of known botnet command-and-control servers. |

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

## Create in the dashboard

**來源**: [https://developers.cloudflare.com/waf/tools/lists/create-dashboard/](https://developers.cloudflare.com/waf/tools/lists/create-dashboard/)

Page options # Create in the dashboard

To create a list, follow these steps:

1. In the Cloudflare dashboard, go to the Settings page.
  Go to Settings
2. Go to Lists.
3. Select Create new list.
4. Enter a name for your list, observing the list name guidelines.
5. (Optional) Enter a description for the list, with a maximum length of 500 characters.
6. For Content type, select the type of list you are creating.
7. Select Create.
8. Follow the instructions in the next section to add items to the list.

## Add items to a list

1. (Optional) If you wish to add items to an existing list:


Go to the Settings page.
  Go to Settings    


Go to Lists.


Select Edit next to the list you want to edit.
2. Go to the Settings page.
  Go to Settings
3. Go to Lists.
4. Select Edit next to the list you want to edit.
5. Select Add items.
6. To add items to the list manually, use the available text inputs on the page.
7. To add items using a CSV file, select Upload CSV.

Notes

Cloudflare will apply the following rules when you add items to an existing list (either manually or via CSV file):

- Do not remove any existing list items before updating/adding items.
- Update items that were already in the list.
- Add items that were not present in the list.

### Add items to a list manually

1. In the Add items to list page, enter values for the different fields (the exact fields depend on the list type).
As you enter information into a text input, a new row of inputs displays below the current one. To delete any of the items that you have entered, select X.
2. Select Add to list.

### Add items using a CSV file

To add items to a list by uploading a CSV file:

1. In the Add items to list page, select Upload CSV.
2. Browse to the location of the CSV file, select the file, and then select Open. The displayed items in the page will include the items loaded from the CSV file.
The exact CSV file format depends on the list type. Refer to Custom list types for details.
3. You can continue to edit the items in the list before adding them:

To delete any of the items you have entered, select X.
To add extra items manually, enter the information in the text inputs.
4. To delete any of the items you have entered, select X.
5. To add extra items manually, enter the information in the text inputs.
6. Select Add to list.

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

## Use lists in expressions

**來源**: [https://developers.cloudflare.com/waf/tools/lists/use-in-expressions/](https://developers.cloudflare.com/waf/tools/lists/use-in-expressions/)

Page options # Use lists in expressions

In the Cloudflare dashboard, there are two options for editing expressions:

- Expression Builder: Allows you to create expressions using drop-down lists, emphasizing a visual approach to defining an expression.
- Expression Editor: A text-only interface that supports advanced features, such as grouping symbols and functions for transforming and validating values.

## Expression Builder

To use a list in the Expression Builder:

1. Select is in list or is not in list from the Operator drop-down list.
2. Select a list from the Value drop-down list. Depending on your plan, you may be able to select a Managed IP List.
3. To commit your changes and enable the rule, select Deploy. If you are not ready to enable the rule, select Save as Draft.

## Expression Editor

To use a list in the Expression Editor, specify the in operator and use $<list_name> to specify the name of the list.

Examples:

- Expression matching requests from IP addresses that are in an IP list named office_network:
ip.src in $office_network
- Expression matching requests with a source IP address different from IP addresses in the office_network IP list:
not ip.src in $office_network
- Expression matching requests from IP addresses in the Cloudflare Open Proxies Managed IP List:
ip.src in $cf.open_proxies

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

## Lists API

**來源**: [https://developers.cloudflare.com/waf/tools/lists/lists-api/](https://developers.cloudflare.com/waf/tools/lists/lists-api/)

Page options # Lists API

The Lists API provides an interface for programmatically managing the following types of lists:

- Custom lists: Contain one or more strings of the same type (such as IP addresses or hostnames) that you can reference collectively, by name, in rule expressions.
- Bulk Redirect Lists: Contain URL redirects that you enable by creating a Bulk Redirect Rule.

To use a list in a rule expression, refer to Values: Lists in the Rules language documentation.

## Get started

To get started, review the Lists JSON object and Endpoints.

## Rate limiting for Lists API requests

Cloudflare may apply rate limiting to your API requests creating, modifying, or deleting list items in custom lists and Bulk Redirect Lists.

Each operation (create, edit, or delete) on a list item counts as a modification. The following limits apply:

- You can make a maximum of 1,000,000 list item modifications in API requests over 12 hours.
- You can make a maximum of 30,000 API requests over 12 hours doing list item modifications.

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

## JSON object

**來源**: [https://developers.cloudflare.com/waf/tools/lists/lists-api/json-object/](https://developers.cloudflare.com/waf/tools/lists/lists-api/json-object/)

Page options # JSON object

## List object structure and properties

A JSON response for the Lists API has this structure:

```
{  "id": "2c0fc9fa937b11eaa1b71c4d701ab86e",  "name": "my_list_name",  "description": "List description.",  "kind": "(ip|hostname|asn|redirect)",  "num_items": 10,  "num_referencing_filters": 2,  "created_on": "2021-01-01T08:00:00Z",  "modified_on": "2021-01-10T14:00:00Z"}
```

This table summarizes the object properties:

| Property | Description | Constraints |
| --- | --- | --- |
| idString | A UUIDv4 identifier generated by Cloudflare. | Unique, read only.Length: 32 characters. |
| nameString | An informative name for the list. | Maximum length: 50 characters.Only alphanumeric and underscore (_) characters are valid.A valid name satisfies this regular expression: ^[a-zA-Z0-9_]+$. |
| descriptionString | An informative summary of the list. | Maximum length: 500 characters. |
| kindString | The type of data in the list. | Valid values: ip, hostname, asn, redirect. |
| num_itemsNumber | The number of items in the list. | Read only. |
| num_referencing_filtersNumber | The number of filters that reference this list. | Read only. |
| created_onString | The RFC 3339 timestamp the list was created. | Read only. |
| modified_onString | The RFC 3339 timestamp when the list was last modified. | Read only. |

## List item object structure and properties

Each list type (IP address, hostname, ASN, redirects) can only contain items of the same type.

### IP address

A fully populated JSON object for an IP address list item has the following structure:

```
{  "id": "7c5dae5552338874e5053f2534d2767a",  "ip": "10.0.0.1/32",  "comment": "CF DNS server",  "created_on": "2021-10-01T05:20:00.12345Z",  "modified_on": "2021-10-01T05:20:00.12345Z"}
```

### Hostname

A fully populated JSON object for a hostname list item has the following structure:

```
{  "id": "7c5dae5552338874e5053f2534d2767a",  "hostname": {    "url_hostname": "*.example.com"  },  "created_on": "2021-10-11T12:39:02Z",  "modified_on": "2021-10-11T12:39:02Z"}
```

### ASN

A fully populated JSON object for an ASN list item has the following structure:

```
{  "id": "7c5dae5552338874e5053f2534d2767a",  "asn": 13335,  "comment": "My provider's ASN",  "created_on": "2021-10-11T12:39:02Z",  "modified_on": "2021-10-11T12:39:02Z"}
```

### URL redirect

A fully populated JSON object for a Bulk Redirect List item has the following structure:

```
{  "id": "7c5dae5552338874e5053f2534d2767a",  "redirect": {    "source_url": "https://example.com/blog",    "target_url": "https://example.com/blog/latest",    "status_code": 301,    "include_subdomains": false,    "subpath_matching": false,    "preserve_query_string": false,    "preserve_path_suffix": true  },  "created_on": "2021-10-11T12:39:02Z",  "modified_on": "2021-10-11T12:39:02Z"}
```

### Properties reference

The JSON object properties for a list item are defined as follows:

| Property | Description | Constraints |
| --- | --- | --- |
| idString | A UUIDv4 identifier generated by Cloudflare. | Unique, read only.Length: 32 characters. |
| ipString | An IP address or CIDR range. | Applies only to custom lists with IP addresses (IP lists).Any of these formats can exist in the same custom list with IP addresses:IPv4 addressIPv6 addressIPv4 ranges as /8 through /32 CIDRsIPv6 ranges as /12 through /128 CIDRs |
| commentString | An informative summary of the item. | Maximum length: 500 characters. |
| redirectObject | An object that contains the definition of a URL redirect. Refer to URL redirect parameters for details. | Applies only to Bulk Redirect Lists. |
| hostnameObject | An object containing a url_hostname property with a hostname value. Refer to Lists with hostnames for details on the supported hostname values. | Applies only to custom lists with hostnames. |
| asnInteger | An ASN value. | Applies only to custom lists with ASNs. |
| created_onString | The  RFC 3339 timestamp when the list was created. | Read only. |
| modified_onString | The  RFC 3339 timestamp when the item was last modified. | Read only. |

For a detailed specification, refer to the Lists API documentation.

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

## Endpoints

**來源**: [https://developers.cloudflare.com/waf/tools/lists/lists-api/endpoints/](https://developers.cloudflare.com/waf/tools/lists/lists-api/endpoints/)

Page options # Endpoints

To invoke a Lists API operation, append the endpoint to the Cloudflare API base URL:

https://api.cloudflare.com/client/v4/

For authentication instructions, refer to Cloudflare's API: Get started.

For help with making API calls and paginating results, refer to Make API calls.

Note

The Lists API endpoints require a value for {account_id}.

To retrieve a list of accounts to which you have access, use the List Accounts operation and note the IDs of the accounts you want to manage.

The Lists API supports the operations outlined below. Visit the associated links for examples.

## Manage lists

### Create a list

- Operation: Create a list
- Method and endpoint: POST accounts/{account_id}/rules/lists
- Notes: Creates an empty list.

### Get lists

- Operation: Get lists
- Method and endpoint: GET accounts/{account_id}/rules/lists
- Notes:

Fetches all lists for the account.
This request does not fetch the items in the lists.
- Fetches all lists for the account.
- This request does not fetch the items in the lists.

### Get a list

- Operation: Get a list
- Method and endpoint: GET accounts/{account_id}/rules/lists/{list_id}
- Notes:

Fetches a list by its ID.
This request does not display the items in the list.
- Fetches a list by its ID.
- This request does not display the items in the list.

### Update a list

- Operation: Update a list
- Method and endpoint: PUT accounts/{account_id}/rules/lists/{list_id}
- Notes:

Updates the description of a list.
You cannot edit the name or kind, and you cannot update items in a list. To update an item in a list, use the Update all list items operation.
- Updates the description of a list.
- You cannot edit the name or kind, and you cannot update items in a list. To update an item in a list, use the Update all list items operation.

### Delete a list

- Operation: Delete a list
- Method and endpoint: DELETE accounts/{account_id}/rules/lists/{list_id}
- Notes: Deletes the list, but only when no filters reference it.

## Manage items in a list

Nearly all the operations for managing items in a list are asynchronous. When you add or delete a large amount of items to or from a list, there may be a delay before the bulk operation is complete.

Asynchronous list operations return an operation_id, which you can use to monitor the status of an API operation. To monitor the status of an asynchronous operation, use the Get bulk operation status endpoint and specify the ID of the operation you want to monitor.

When you make requests to a list while a bulk operation on that list is in progress, the requests are queued and processed in sequence (first in, first out). Requests for successful asynchronous operations return an HTTP 201 status code.

### Get list items

- Operation: Get list items
- Method and endpoint: GET accounts/{account_id}/rules/lists/{list_id}/items[?search={query}]
- Notes:

Fetches items in a list (all items, by default).
Items are sorted in ascending order.
In the case of IP lists, CIDRs are sorted by IP address, then by the subnet mask.
To filter returned items, use the optional search query string parameter. For more information, refer to the Get list items API operation.
- Fetches items in a list (all items, by default).
- Items are sorted in ascending order.
- In the case of IP lists, CIDRs are sorted by IP address, then by the subnet mask.
- To filter returned items, use the optional search query string parameter. For more information, refer to the Get list items API operation.

### Get a list item

- Operation: Get a list item
- Method and endpoint: GET accounts/{account_id}/rules/lists/{list_id}/items/{item_id}
- Notes: Fetches an item from a list by ID

### Create list items

- Operation: Create list items
- Method and endpoint: POST accounts/{account_id}/rules/lists/{list_id}/items
- Notes:

Appends a new item or items to a list.
Replaces entries that already exist in the list, does not delete any items.
Overwrites the comment of the original item.
The response includes an operation_id.
- Appends a new item or items to a list.
- Replaces entries that already exist in the list, does not delete any items.
- Overwrites the comment of the original item.
- The response includes an operation_id.

### Update all list items

- Operation: Update all list items
- Method and endpoint: PUT accounts/{account_id}/rules/lists/{list_id}/items
- Notes:

Deletes all current items in the list and replaces them with items.
When items is empty, deletes all items in the list.
The response includes an operation_id.
- Deletes all current items in the list and replaces them with items.
- When items is empty, deletes all items in the list.
- The response includes an operation_id.

### Delete list items

- Operation: Delete list items
- Method and endpoint: DELETE accounts/{account_id}/rules/lists/{list_id}/items
- Notes:

Deletes specified list items.
The response includes an operation_id.
- Deletes specified list items.
- The response includes an operation_id.

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

## Create an IP access rule

**來源**: [https://developers.cloudflare.com/waf/tools/ip-access-rules/create/](https://developers.cloudflare.com/waf/tools/ip-access-rules/create/)

Page options # Create an IP access rule

- Old dashboard
- New dashboard
- API

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Tools.
3. Under IP Access Rules, enter the following details:

For Value, enter an IP address, IP range, country code/name, or Autonomous System Number (ASN). For details, refer to Parameters.
Select an action.
For Zone, select whether the rule applies to the current website only or to all websites in the account.
(Optional) Enter a note for the rule (for example, Payment Gateway).
4. For Value, enter an IP address, IP range, country code/name, or Autonomous System Number (ASN). For details, refer to Parameters.
5. Select an action.
6. For Zone, select whether the rule applies to the current website only or to all websites in the account.
7. (Optional) Enter a note for the rule (for example, Payment Gateway).
8. Select Add.

Note

IP Access Rules are only available in the new security dashboard if you have configured at least one IP access rule. Cloudflare recommends that you use custom rules instead of IP Access Rules.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. Select Create rule > IP access rules.
4. Enter the following rule details:

For IP, IP range, country name, or ASN, enter an IP address, IP range, country code/name, or Autonomous System Number (ASN). For details, refer to Parameters.
For Action, select an action.
For Zone, select whether the rule applies to the current website only or to all websites in the account.
(Optional) Enter a note for the rule (for example, Payment Gateway).
5. For IP, IP range, country name, or ASN, enter an IP address, IP range, country code/name, or Autonomous System Number (ASN). For details, refer to Parameters.
6. For Action, select an action.
7. For Zone, select whether the rule applies to the current website only or to all websites in the account.
8. (Optional) Enter a note for the rule (for example, Payment Gateway).
9. Select Create.

Use the Cloudflare API to programmatically create IP access rules. For more information, refer to Create an IP Access Rule.

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

## Parameters

**來源**: [https://developers.cloudflare.com/waf/tools/ip-access-rules/parameters/](https://developers.cloudflare.com/waf/tools/ip-access-rules/parameters/)

Page options # Parameters

An IP Access rule will apply a certain action to incoming traffic based on the visitor's IP address, IP range, country, or Autonomous System Number (ASN).

## IP address

| Type | Example value |
| --- | --- |
| IPv4 address | 192.0.2.3 |
| IPv6 address | 2001:db8:: |

## IP range

| Type | Example value | Start of range | End of range | Number of addresses |
| --- | --- | --- | --- | --- |
| IPv4 /24 range | 192.0.2.0/24 | 192.0.2.0 | 192.0.2.255 | 256 |
| IPv4 /16 range | 192.168.0.0/16 | 192.168.0.0 | 192.168.255.255 | 65,536 |
| IPv6 /128 range | 2001:db8::/128 | 2001:db8:: | 2001:db8:: | 1 |
| IPv6 /64 range | 2001:db8::/64 | 2001:db8:: | 2001:db8:0000:0000:ffff:ffff:ffff:ffff | 18,446,744,073,709,551,616 |
| IPv6 /48 range | 2001:db8::/48 | 2001:db8:: | 2001:db8:0000:ffff:ffff:ffff:ffff:ffff | 1,208,925,819,614,629,174,706,176 |
| IPv6 /32 range | 2001:db8::/32 | 2001:db8:: | 2001:db8:ffff:ffff:ffff:ffff:ffff:ffff | 79,228,162,514,264,337,593,543,950,336 |

## Country

Specify a country using two-letter ISO-3166-1 alpha-2 codes ↗. Additionally, the Cloudflare dashboard accepts country names. For example:

- US
- CN
- germany (dashboard only)

Cloudflare uses the following special country alpha-2 codes that are not part of the ISO:

- T1: Tor exit nodes (country name: Tor)
- XX: Unknown/reserved

Notes about country blocking

- Block by country is only available on Enterprise plans.
- IP addresses globally allowed by Cloudflare will override an IP Access rule country block, but they will not override a country block via WAF custom rules.

## Autonomous System Number (ASN)

| Type | Example value |
| --- | --- |
| ASN | AS13335 |

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

## Actions

**來源**: [https://developers.cloudflare.com/waf/tools/ip-access-rules/actions/](https://developers.cloudflare.com/waf/tools/ip-access-rules/actions/)

Page options # Actions

An IP Access rule can perform one of the following actions:

- Block: Prevents a visitor from visiting your site.
- Allow: Excludes visitors from all security checks, including Browser Integrity Check, Under Attack mode, and the WAF. Use this option when a trusted visitor is being blocked by Cloudflare's default security features. The Allow action takes precedence over the Block action. Note that allowing a given country code will not bypass WAF managed rules (previous and new versions).
- Managed Challenge: Depending on the characteristics of a request, Cloudflare will dynamically choose the appropriate type of challenge from a list of possible actions. For more information, refer to Cloudflare Challenges.
- JavaScript Challenge: Presents the Under Attack mode interstitial page to visitors. The visitor or client must support JavaScript. Useful for blocking DDoS attacks with minimal impact to legitimate visitors.
- Interactive Challenge: Requires the visitor to complete an interactive challenge before visiting your site. Prevents bots from accessing the site.

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

## Scrape Shield

**來源**: [https://developers.cloudflare.com/waf/tools/scrape-shield/](https://developers.cloudflare.com/waf/tools/scrape-shield/)

Page options # Scrape Shield

Scrape Shield is a collection of settings meant to protect your site's content.

- Email Address Obfuscation
- Hotlink Protection

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

## Email Address Obfuscation

**來源**: [https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)

Page options # Email Address Obfuscation

By enabling Cloudflare Email Address Obfuscation, email addresses on your web page will be hidden from bots, while keeping them visible to humans. In fact, there are no visible changes to your website for visitors.

## Background

Email harvesters and other bots roam the Internet looking for email addresses to add to lists that target recipients for spam. This trend results in an increasing amount of unwanted email.

Web administrators have come up with clever ways to protect against this by writing out email addresses, such as help [at] cloudflare [dot] com or by using embedded images of the email address. However, you lose the convenience of clicking on the email address to automatically send an email. By enabling Cloudflare Email Address Obfuscation, email addresses on your web page will be obfuscated (hidden) from bots, while keeping them visible to humans. In fact, there are no visible changes to your website for visitors.

## How it works

When Email Address Obfuscation is enabled, Cloudflare replaces visible email addresses in your HTML with links like [email protected]. If a visitor sees this obfuscated format, they can click the link to reveal the actual email address. This approach prevents bots from scraping email addresses while keeping them accessible to real users.

## Change Email Address Obfuscation setting

Cloudflare enables email address obfuscation automatically when you sign up.

- Dashboard
- API

To disable Email Address Obfuscation in the dashboard:

1. Log into the Cloudflare dashboard ↗.
2. Select your account and website.
3. Go to Scrape Shield.
4. For Email Address Obfuscation, switch the toggle to Off.

To disable Email Address Obfuscation with the API, send a PATCH request with email_obfuscation as the setting name in the URI path, and the value parameter set to "off".

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

## Prevent Cloudflare from obfuscating email

To prevent Cloudflare from obfuscating specific email addresses, you can:

- Add the following comment in the page HTML code:
<!--email_off-->contact@example.com<!--/email_off-->
- Return email addresses in JSON format for AJAX calls, making sure your web server returns a content type of application/json.
- Disable the Email Obfuscation feature by creating a configuration rule to be applied on a specific endpoint.

## Troubleshoot email obfuscation

To prevent unexpected website behavior, email addresses are not obfuscated when they appear in:

- Any HTML tag attribute, except for the href attribute of the a tag.
- Other HTML tags:

script tags: <script></script>
noscript tags: <noscript></noscript>
textarea tags: <textarea></textarea>
xmp tags: <xmp></xmp>
head tags: <head></head>
- script tags: <script></script>
- noscript tags: <noscript></noscript>
- textarea tags: <textarea></textarea>
- xmp tags: <xmp></xmp>
- head tags: <head></head>
- Any page that does not have a MIME type of text/html or application/xhtml+xml.

Note

Email Obfuscation will not apply in the following cases:

- You are using the Cache-Control: no-transform header.
- The HTML/JS code is specifically added by a Worker.

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

## Hotlink Protection

**來源**: [https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/](https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/)

Page options # Hotlink Protection

Hotlink Protection prevents your images from being used by other sites, which can reduce the bandwidth consumed by your origin server ↗.

Note

The supported file extensions are gif, ico, jpg, jpeg, and png.

## Background

When Cloudflare receives an image request for your site, we check to ensure the request did not originate from visitors on another site. Visitors to your domain will still be able to download and view images.

Technically, this means that Hotlink Protection denies access to requests when the HTTP referer
does not include your website domain name (and is not blank).

Hotlink protection has no impact on crawling, but it will prevent the images from being displayed on sites such as Google images, Pinterest, and Facebook.

## Enable Hotlink Protection

- Dashboard
- API

To enable Hotlink Protection in the dashboard:

1. Log into the Cloudflare dashboard ↗.
2. Select your account and website.
3. Go to Scrape Shield.
4. For Hotlink Protection, switch the toggle to On.

To enable Hotlink Protection with the API, send a PATCH request with hotlink_protection as the setting name in the URI path, and the value parameter set to "on".

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

### SaaS providers using Cloudflare

If you are a SaaS provider using Cloudflare for SaaS, note that, by default, Hotlink Protection will only allow requests with your zone as referer. To avoid blocking requests from your customers (custom hostnames), consider using Configuration Rules or custom rules.

## Allow hotlinking to specific images

You may want certain images to be hotlinked to, whether by external websites (like Google) or certain situations like when using an RSS feed.

### Configuration rules

To disable Hotlink Protection selectively, create a configuration rule covering the path of an image folder.

### hotlink-ok directory

You can allow certain images to be hotlinked by placing them in a directory named hotlink-ok. The hotlink-ok directory can be placed anywhere on your website.

To allow another website to use logo.png from example.com, put logo.png in a new folder called hotlink-ok.

Some examples of URLs that will not be checked for hotlinking:

- http://example.com/hotlink-ok/pic.jpg
- http://example.com/images/hotlink-ok/pic.jpg
- http://example.com/hotlink-ok/images/pic.jpg
- http://example.com/images/main-site/hotlink-ok/pic.jpg

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

## User Agent Blocking

**來源**: [https://developers.cloudflare.com/waf/tools/user-agent-blocking/](https://developers.cloudflare.com/waf/tools/user-agent-blocking/)

Page options # User Agent Blocking

User Agent Blocking allows you to block specific browser or web application User-Agent request headers ↗. User agent rules apply to the entire domain instead of individual subdomains.

User agent rules are applied after zone lockdown rules. If you allow an IP address via Zone Lockdown, it will skip any user agent rules.

Note

Cloudflare recommends that you use custom rules instead of user agent rules to block specific user agents.

For example, a custom rule equivalent to the user agent example rule provided in this page could have the following configuration:

- Expression: http.user_agent eq "BadBot/1.0.2 (+http://bad.bot)"
- Action: (a block or challenge action)

## Availability

Cloudflare User Agent Blocking is available on all plans. However, this feature is only available in the new security dashboard if you have configured at least one user agent rule.

The number of available user agent rules depends on your Cloudflare plan.

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Number of rules | 10 | 50 | 250 | 1,000 |

## Create a User Agent Blocking rule

- Old dashboard
- New dashboard
- API

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > WAF, and select the Tools tab.
3. Under User Agent Blocking, select Create blocking rule.
4. Enter a descriptive name for the rule in Name/Description.
5. In Action, select the action to perform: Managed Challenge, Block, JS Challenge, or Interactive Challenge.
6. Enter a user agent value in User Agent (wildcards such as * are not supported). For example, to block the Bad Bot web spider, enter BadBot/1.0.2 (+http://bad.bot).
7. Select Save and Deploy blocking rule.

Note

User Agent Blocking is only available in the new security dashboard if you have configured at least one user agent rule. Cloudflare recommends that you use custom rules instead of user agent rules.

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Security rules, and select Create rule > User agent rules.
3. Enter a descriptive name for the rule in Name/Description.
4. In Action, select the action to perform: Managed Challenge, Block, JS Challenge, or Interactive Challenge.
5. Enter a user agent value in User Agent (wildcards such as * are not supported). For example, to block the Bad Bot web spider, enter BadBot/1.0.2 (+http://bad.bot).
6. Select Save and Deploy blocking rule.

Issue a POST request for the Create a User Agent Blocking rule operation similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Firewall Services Write

Create a User Agent Blocking rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/ua_rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "Block Bad Bot web spider",    "mode": "block",    "configuration": {        "target": "ua",        "value": "BadBot/1.0.2 (+http://bad.bot)"    }  }'
```

## Related resources

- Secure your application
- Cloudflare Zone Lockdown

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

## Zone Lockdown

**來源**: [https://developers.cloudflare.com/waf/tools/zone-lockdown/](https://developers.cloudflare.com/waf/tools/zone-lockdown/)

Page options # Zone Lockdown

Zone Lockdown specifies a list of one or more IP addresses, CIDR ranges, or networks that are the only IPs allowed to access a domain, subdomain, or URL. You can configure multiple destinations, including IPv4/IPv6 addresses, in a single zone lockdown rule.

All IP addresses not specified in the zone lockdown rule will not have access to the specified resources. Requests from those IP addresses will receive an Access Denied response.

Note

Cloudflare recommends that you create custom rules instead of zone lockdown rules to block requests from IP addresses not present in an allowlist of IPs and CIDR ranges.

For example, a custom rule equivalent to the zone lockdown example rule provided in this page could have the following configuration:

- Description: Block all traffic to staging and wiki unless it comes from HQ or branch offices
- Expression: ((http.host eq "staging.example.com") or (http.host eq "example.com" and starts_with(http.request.uri.path, "/wiki/")) and not ip.src in {192.0.2.0/24 2001:DB8::/64 203.0.133.1}
- Action: Block

## Availability

Cloudflare Zone Lockdown is available on paid plans. However, this feature is only available in the new security dashboard if you have configured at least one zone lockdown rule.

The number of available zone lockdown rules depends on your Cloudflare plan.

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | Yes | Yes | Yes |
| Number of rules | 0 | 3 | 10 | 200 |

## Create a zone lockdown rule

- Old dashboard
- New dashboard
- API

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > WAF, and select the Tools tab.
3. Under Zone Lockdown, select Create lockdown rule.
4. Enter a descriptive name for the rule in Name.
5. For URLs, enter the domains, subdomains, or URLs you wish to protect from unauthorized IPs. You can use wildcards such as *. Enter one item per line.
6. For IP Range, enter one or more allowed IPv4/IPv6 addresses or CIDR ranges, one per line. Only these IP addresses and ranges will be able to access the resources you entered in URLs.
7. (Optional) If you are creating a zone lockdown rule that overlaps with an existing rule, expand Advanced Options and enter a priority for the rule in Priority. The lower the number, the higher the priority. Higher priority rules take precedence.
8. Select Save and Deploy lockdown rule.

Note

Zone Lockdown is only available in the new security dashboard if you have configured at least one zone lockdown rule. Cloudflare recommends that you use custom rules instead of zone lockdown rules.

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Security rules, and select Create rule > Zone lockdown rules.
3. Enter a descriptive name for the rule in Name.
4. For URLs, enter the domains, subdomains, or URLs you wish to protect from unauthorized IPs. You can use wildcards such as *. Enter one item per line.
5. For IP Range, enter one or more allowed IPv4/IPv6 addresses or CIDR ranges, one per line. Only these IP addresses and ranges will be able to access the resources you entered in URLs.
6. (Optional) If you are creating a zone lockdown rule that overlaps with an existing rule, expand Advanced Options and enter a priority for the rule in Priority. The lower the number, the higher the priority. Higher priority rules take precedence.
7. Select Save and Deploy lockdown rule.

Issue a POST request for the Create a Zone Lockdown rule operation similar to the following:

Required API token permissions

At least one of the following token permissions is required: - Firewall Services Write

Create a Zone Lockdown rule ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/lockdowns" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "Block all traffic to staging and wiki unless it comes from HQ or branch offices",    "urls": [        "staging.example.com/*",        "example.com/wiki/*"    ],    "configurations": [        {            "target": "ip_range",            "value": "192.0.2.0/24"        },        {            "target": "ip_range",            "value": "2001:DB8::/64"        },        {            "target": "ip",            "value": "203.0.133.1"        }    ]  }'
```

### Example rule

The following example rule will only allow visitors connecting from a company’s headquarters or branch offices to access the staging environment and the wiki:

- Name:
Block all traffic to staging and wiki unless it comes from HQ or branch offices
- URLs:
staging.example.com/*example.com/wiki/*
- IP Range:
192.0.2.0/242001:DB8::/64203.0.133.1

This example would not protect an internal wiki located on a different directory path such as example.com/internal/wiki.

## Access denied example

A visitor from an unauthorized IP will get the following error when there is a match for a zone lockdown rule:

## Related resources

- Secure your application
- User Agent Blocking
- Allow Health Checks to bypass Zone Lockdown

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

## Browser Integrity Check

**來源**: [https://developers.cloudflare.com/waf/tools/browser-integrity-check/](https://developers.cloudflare.com/waf/tools/browser-integrity-check/)

Page options # Browser Integrity Check

Cloudflare's Browser Integrity Check (BIC) looks for common HTTP headers abused most commonly by spammers and denies access to your page.

It also challenges visitors without a user agent or with a non-standard user agent such as commonly used by abusive bots, crawlers, or visitors.

Browser Integrity Check is enabled by default.

## Disable Browser Integrity Check

### Disable globally

To disable BIC globally for your zone:

- Old dashboard
- New dashboard

1. Log into the Cloudflare dashboard ↗.
2. Select your account and zone.
3. Go to Security > Settings.
4. Turn off Browser Integrity Check.

1. Log into the Cloudflare dashboard ↗.
2. Select your account and zone.
3. Go to Security > Settings and filter by DDoS attacks.
4. Turn off Browser integrity check.

### Disable selectively

To disable BIC selectively, you can skip Browser Integrity Check using a custom rule with a skip action.

Also, use a configuration rule to selectively enable or disable this feature for certain sections of your website using a filter expression (such as a matching hostname or request URL path).

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

## Privacy Pass

**來源**: [https://developers.cloudflare.com/waf/tools/privacy-pass/](https://developers.cloudflare.com/waf/tools/privacy-pass/)

Page options # Privacy Pass

Privacy Pass ↗ specifies an extensible protocol for creating and redeeming anonymous and transferable tokens. Its specification is maintained by the IETF.
Cloudflare provides "Silk - Privacy Pass Client". This is a Chrome and Firefox browser extension used for research, which provides a better visitor experience for Cloudflare-protected websites. Privacy Pass is especially helpful for visitors from shared networks, VPNs, and Tor that tend to have poorer IP reputations.

For instance, a visitor IP address with poor reputation may receive a Cloudflare challenge page before gaining access to a Cloudflare-protected website. Privacy Pass allows the visitor to solve a challenge with or without interaction, depending on the device. Solving this challenge is coordinated with a third party attester in such a way that Cloudflare does not see the attestation method or the interaction, preserving visitors' privacy while maintaining a high level of security.

## Set up Privacy Pass

### For your end users

Your end users should download the Privacy Pass extension for either Google Chrome or Firefox:

- Chrome extension ↗
- Firefox extension ↗

The Privacy Pass code is available on GitHub ↗. You can report any issues in this repository.

## Support for Privacy Pass v1 (legacy)

In 2017 Cloudflare announced support ↗ for Privacy Pass, a recent protocol to let users prove their identity across multiple sites anonymously without enabling tracking. The initial use case was to provide untraceable tokens to sites to vouch for users who might otherwise have been presented with a CAPTCHA challenge. In the time since this release, Privacy Pass has evolved both at the IETF ↗ and within Cloudflare. The version announced in 2017 is now considered legacy, and these legacy Privacy Pass tokens are no longer supported as an alternative to Cloudflare challenges. As has been discussed on our blog The end road for CAPTCHA ↗, Cloudflare uses a variety of signals to infer if incoming traffic is likely automated. The (legacy) Privacy Pass zone setting is no longer meaningful to Cloudflare customers as Cloudflare now operates CAPTCHA free ↗, and supports the latest Privacy Pass draft ↗.

In September 2023, Cloudflare removed support for Privacy Pass v1 (legacy) tokens as an alternative to Cloudflare managed challenges, and in March 2024 the current public-facing API was removed.

The full deprecation notice for the first version of Privacy Pass is available on the API deprecations page.

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

## Replace insecure JS libraries

**來源**: [https://developers.cloudflare.com/waf/tools/replace-insecure-js-libraries/](https://developers.cloudflare.com/waf/tools/replace-insecure-js-libraries/)

Page options # Replace insecure JS libraries

This feature, when turned on, automatically rewrites URLs to external JavaScript libraries to point to Cloudflare-hosted libraries instead. This change improves security and performance, and reduces the risk of malicious code being injected.

This rewrite operation currently supports the polyfill JavaScript library hosted in polyfill.io.

Warning

You may need to update your Content Security Policy (CSP) when turning on Replace insecure JavaScript libraries. The feature, when enabled, will not perform any URL rewrites if a CSP is present with a script-src or default-src directive. Cloudflare will not check report-only directives and it will not modify CSP headers.

Additionally, if you are defining a CSP via HTML meta tag, you must either turn off this feature or switch to a CSP defined in an HTTP header.

## How it works

When turned on, Cloudflare will check HTTP(S) proxied traffic for script tags with an src attribute pointing to a potentially insecure service and replace the src value with the equivalent link hosted under cdnjs ↗.

The rewritten URL will keep the original URL scheme (http:// or https://).

For polyfill.io URL rewrites, all 3.* versions of the polyfill library are supported under the /v3 path. Additionally, the /v2 path is also supported. If an unknown version is requested under the /v3 path, Cloudflare will rewrite the URL to use the latest 3.* version of the library (currently 3.111.0).

## Availability

The feature is available in all Cloudflare plans, and is turned on by default on Free plans.

## Configure

- Dashboard
- API

1. Log in to the Cloudflare dashboard ↗ and select your account and zone.
2. Go to Security > Settings.
3. Turn Replace insecure JavaScript libraries on or off.

Issue a PATCH request similar to the following:

Terminal window ```
curl --request PATCH \"https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/replace_insecure_js" \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{ "value": "on" }'
```

## Final remarks

Since pages.dev zones are on a Free plan, the Replace insecure JavaScript libraries feature is turned on by default on these zones and it is not possible to turn it off.

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

## Security Level

**來源**: [https://developers.cloudflare.com/waf/tools/security-level/](https://developers.cloudflare.com/waf/tools/security-level/)

Page options # Security Level

In the old Cloudflare dashboard, security level has the value Always protected and you cannot change this setting. To turn Under Attack mode on or off, use the separate toggle.

In the new security dashboard, the Cloudflare API, and in Terraform, use security level to turn Under Attack mode on or off.

Cloudflare's Under Attack mode performs additional security checks to help mitigate layer 7 DDoS attacks. When you enable Under Attack mode, Cloudflare will present a JS challenge page.

Warning

Only use Under Attack mode when a website is under a DDoS attack. Under Attack mode may affect some actions on your domain, such as your API traffic.

To enable or disable Under Attack mode for your API or any other part of your domain, create a configuration rule.

## Threat score

Previously, a threat score represented a Cloudflare threat score from 0–100, where 0 indicates low risk. Now, the threat score is always 0 (zero).

Recommendation

Currently we do not recommend creating rules based on the threat score, since this score is no longer being populated.

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

## Validation checks

**來源**: [https://developers.cloudflare.com/waf/tools/validation-checks/](https://developers.cloudflare.com/waf/tools/validation-checks/)

Page options # Validation checks

Cloudflare performs a validation check for every request. The Validation component executes prior to all other security features like custom rules or Managed Rules. The validation check blocks malformed requests like Shellshock attacks and requests with certain attack patterns in their HTTP headers before any allowlist logic occurs.

Note

Currently, you cannot disable validation checks. They run early in Cloudflare's infrastructure before the configuration for domains has been loaded.

## Event logs for validation checks

Actions performed by the Validation component appear in Sampled logs in Security Events, associated with the Validation service and without a rule ID. Event logs downloaded from the API show source as Validation and action as drop when this behavior occurs.

The following example shows a request blocked by the Validation component due to a malformed User-Agent HTTP request header:

In the downloaded JSON file for the event, the ruleId value indicates the detected issue — in this case, it was a Shellshock attack.

```
{  "action": "drop",  "ruleId": "sanity-shellshock",  "source": "sanitycheck",  "userAgent": "() { :;}; printf \\\\\"detection[%s]string\\\\\" \\\\\"TjcLLwVzBtLzvbN\\\\"  //...}
```

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

## Account-level WAF configuration

**來源**: [https://developers.cloudflare.com/waf/account/](https://developers.cloudflare.com/waf/account/)

Page options # Account-level WAF configuration

Note

This feature requires an Enterprise plan with a paid add-on.

The account-level Web Application Firewall (WAF) configuration allows you to define a configuration once and apply it to multiple Enterprise zones in your account.

Configure and deploy custom rulesets, rate limiting rulesets, and managed rulesets to multiple Enterprise zones, affecting all incoming traffic or only a subset (for example, all traffic to /admin/* URI paths in both example.com and example.net).

At the account level, WAF rules are grouped into rulesets. You can perform the following operations:

- Create and deploy custom rulesets
- Create and deploy rate limiting rulesets
- Deploy managed rulesets

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

## Work with custom rulesets in the dashboard

**來源**: [https://developers.cloudflare.com/waf/account/custom-rulesets/create-dashboard/](https://developers.cloudflare.com/waf/account/custom-rulesets/create-dashboard/)

Page options # Work with custom rulesets in the dashboard

Note

This feature requires an Enterprise plan with a paid add-on.

Custom rulesets are configured at the account level.

## Create and deploy a custom ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Custom rulesets tab.
3. To create a new empty ruleset, select Create ruleset. To duplicate an existing ruleset, select the three dots next to it > Duplicate.
4. In the page that displays, enter a name and (optionally) a description for the custom ruleset.
5. Under Scope, define when the custom ruleset should run.

Select All incoming requests to apply the custom ruleset to all incoming requests for all your zones on an Enterprise plan.
Select Custom filter expression to define a custom expression that defines when to execute the custom ruleset. Use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator. Alternatively, select Edit expression to define your expression using the Expression Editor.

WarningDeployed custom rulesets will only apply to incoming traffic of Enterprise domains. The Expression Builder will automatically include this filter. If you define a custom expression for the ruleset using the Expression Editor, you must use parentheses to enclose any custom conditions and end your expression with and cf.zone.plan eq "ENT" so that the rule only applies to domains on an Enterprise plan.
6. Select All incoming requests to apply the custom ruleset to all incoming requests for all your zones on an Enterprise plan.
7. Select Custom filter expression to define a custom expression that defines when to execute the custom ruleset. Use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator. Alternatively, select Edit expression to define your expression using the Expression Editor.
8. To create a new rule, select Add rule.
9. Enter a descriptive name for the rule in Rule name.
10. Under When incoming requests match, use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator. Alternatively, select Edit expression to define your expression using the Expression Editor.
11. Select the rule action from the Choose action drop-down list. For example, selecting Block tells Cloudflare to refuse requests that match the conditions you specified.
12. (Optional) If you selected the Block action, you can configure a custom response.
13. Select Deploy.
14. Add other rules to the custom ruleset, if needed. You can also duplicate an existing rule in the custom ruleset.
15. Select Create.

## Edit a custom ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Custom rulesets tab.
3. To edit a custom ruleset, select the three dots next to it > Edit.
4. Make any desired changes to the ruleset by selecting Edit next to the items you want to change.
5. When you are done, select Back to rulesets list.

Warning

Deployed custom rulesets will only apply to incoming traffic of Enterprise domains. The Expression Builder will automatically include this filter. If you define a custom expression for the ruleset using the Expression Editor, you must use parentheses to enclose any custom conditions and end your expression with and cf.zone.plan eq "ENT" so that the rule only applies to domains on an Enterprise plan.

## Delete a custom ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Custom rulesets tab.
3. To delete a custom ruleset, select the three dots next to it > Delete.
4. To confirm the delete operation, select Delete.

## Configure a custom response for blocked requests

When you select the Block action in a rule you can optionally define a custom response.

The custom response has three settings:

- With response type: Choose a content type or the default WAF block response from the list. The available custom response types are the following:

























Dashboard valueAPI valueCustom HTML"text/html"Custom Text"text/plain"Custom JSON"application/json"Custom XML"text/xml"
- With response code: Choose an HTTP status code for the response, in the range 400-499. The default response code is 403.
- Response body: The body of the response. Configure a valid body according to the response type you selected. The maximum field size is 2 KB.

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

## Create a custom ruleset using the API

**來源**: [https://developers.cloudflare.com/waf/account/custom-rulesets/create-api/](https://developers.cloudflare.com/waf/account/custom-rulesets/create-api/)

Page options # Create a custom ruleset using the API

Note

This feature requires an Enterprise plan with a paid add-on.

To deploy custom rules at the account level, you must create a custom ruleset with one or more rules. Use the Rulesets API to work with custom rulesets using the API.

If you are using Terraform, refer to WAF custom rules configuration using Terraform.

## Procedure

To deploy a custom ruleset in your account, follow these general steps:

1. Create a custom ruleset in the http_request_firewall_custom phase with one or more rules.
2. Deploy the ruleset to the entry point ruleset of the http_request_firewall_custom phase at the account level.

Currently, you can only deploy WAF custom rulesets at the account level.

### 1. Create a custom ruleset

The following example creates a custom ruleset with a single rule in the rules array.

Required API token permissions

At least one of the following token permissions is required: - Account WAF Write
- Account Rulesets Write

Create an account ruleset ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "",    "kind": "custom",    "name": "My custom ruleset",    "rules": [        {            "description": "Challenge web traffic (not /api)",            "expression": "not starts_with(http.request.uri.path, \"/api/\")",            "action": "managed_challenge"        }    ],    "phase": "http_request_firewall_custom"  }'
```

Save the ruleset ID in the response for the next step.

### 2. Deploy the custom ruleset

To deploy the custom ruleset, add a rule with "action": "execute" to the http_request_firewall_custom phase entry point ruleset at the account level.

1. Invoke the Get an account entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_custom phase. You will need the account ID for this task.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount WAF ReadAccount Rulesets ReadAccount Rulesets Write Get an account entry point rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/phases/http_request_firewall_custom/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Account-level phase entry point",    "id": "<RULESET_ID>",    "kind": "root",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "root",    "phase": "http_request_firewall_custom",    "rules": [      // ...    ],    "version": "9"  },  "success": true,  "errors": [],  "messages": []}
2. Account WAF Write
3. Account WAF Read
4. Account Rulesets Read
5. Account Rulesets Write
6. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create an account ruleset rule operation to add an execute rule to the existing ruleset deploying the custom ruleset. By default, the rule will be added at the end of the list of rules already in the ruleset.
The following request creates a rule that executes the custom ruleset with ID <CUSTOM_RULESET_ID> for all Enterprise zones in the account:
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account ruleset rulecurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "Execute custom ruleset",    "expression": "(cf.zone.plan eq \"ENT\")",    "action": "execute",    "action_parameters": {        "id": "<CUSTOM_RULESET_ID>"    },    "enabled": true  }'
WarningYou can only apply custom rulesets to incoming traffic of zones on an Enterprise plan. To enforce this requirement, you must include cf.zone.plan eq "ENT" in the expression of the execute rule deploying the custom ruleset.
7. Account WAF Write
8. Account Rulesets Write
9. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create an account ruleset operation. Include a single rule in the rules array that executes the custom ruleset for all incoming requests of Enterprise zones in your account.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "",    "kind": "root",    "name": "Account-level phase entry point",    "rules": [        {            "action": "execute",            "expression": "(cf.zone.plan eq \"ENT\")",            "action_parameters": {                "id": "<CUSTOM_RULESET_ID>"            }        }    ],    "phase": "http_request_firewall_custom"  }'
10. Account WAF Write
11. Account Rulesets Write

## Next steps

Use the different operations in the Rulesets API to work with the custom ruleset you just created and deployed. The following table has a list of common tasks for working with custom rulesets at the account level:

| Task | Procedure |
| --- | --- |
| Get list of custom rulesets | Use the List account rulesets operation and search for rulesets with "kind": "custom" and "phase": "http_request_firewall_custom". The response will include the ruleset IDs.For more information, refer to List existing rulesets. |
| List all rules in a custom ruleset | Use the Get an account ruleset operation with the custom ruleset ID to obtain the list of configured rules and their IDs.For more information, refer to View a specific ruleset. |
| Update a custom rule | Use the Update an account ruleset rule operation. You will need to provide the custom ruleset ID and the rule ID.For more information, refer to Update a rule in a ruleset. |
| Delete a custom rule | Use the Delete an account ruleset rule operation. You will need to provide the custom ruleset ID and the rule ID.For more information, refer to Delete a rule in a ruleset. |

## More resources

For more information on working with custom rulesets, refer to Work with custom rulesets in the Ruleset Engine documentation.

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

## Rate limiting rulesets

**來源**: [https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/](https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/)

Page options # Rate limiting rulesets

A rate limiting rule defines a rate limit for requests matching an expression, and the action to perform when that rate limit is reached. At the account level, rate limiting rules are always grouped into rate limiting rulesets, which you then deploy.

Note

This feature requires an Enterprise plan with a paid add-on.

To apply a rate limiting ruleset at the account level, create a custom rate limiting ruleset with one or more rate limiting rules and then deploy it to one or more zones on an Enterprise plan.

## Next steps

For instructions on creating and deploying a rate limiting ruleset, refer to the following pages:

- Create a rate limiting ruleset in the dashboard
- Create a rate limiting ruleset using the API

For Terraform examples, refer to Rate limiting rules configuration using Terraform.

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

## Create a rate limiting ruleset in the dashboard

**來源**: [https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/create-dashboard/](https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/create-dashboard/)

Page options # Create a rate limiting ruleset in the dashboard

Note

This feature requires an Enterprise plan with a paid add-on.

At the account level, rate limiting rules are grouped into rate limiting rulesets. You must first create a custom ruleset with one or more rate limiting rules, and then deploy it to one or more zones on an Enterprise plan.

## 1. Create a custom rate limiting ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Rate limiting rulesets tab.
3. To create a new empty ruleset, select Create ruleset. To duplicate an existing ruleset, select the three dots next to it > Duplicate.
4. Enter a name for the ruleset and (optionally) a description.
5. In the ruleset creation page, select Create rule.
6. In the rule creation page, enter a descriptive name for the rule in Rule name.
7. Under When incoming requests match, use the Field drop-down list to choose an HTTP property. For each request, the value of the property you choose for Field is compared to the value you specify for Value using the operator selected in Operator.
8. (Optional) Under Cache status, disable Also apply rate limiting to cached assets to consider only the requests that reach the origin when determining the rate.
9. Under With the same characteristics, configure the characteristics that will define the request counters for rate limiting purposes. Each value combination will have its own counter to determine the rate. Refer to How Cloudflare determines the request rate for more information.
The available characteristics depend on your Cloudflare plan and product subscriptions.
10. (Optional) To define an expression that specifies the conditions for incrementing the rate counter, enable Use custom counting expression and set the expression. By default, the counting expression is the same as the rule expression. The counting expression can include response fields.
11. Under When rate exceeds, define the maximum number of requests and the time period to consider when determining the rate.
12. Under Then take action, select the rule action from the Choose an action drop-down list. For example, selecting Block tells Cloudflare to refuse requests in the conditions you specified when the request limit is reached.
13. (Optional) If you selected the Block action, you can configure a custom response for requests exceeding the configured rate limit.
14. Select the mitigation timeout in the Duration dropdown. This is the time period during which Cloudflare applies the select action once the rate is reached.
Enterprise customers with a paid add-on can throttle requests instead of applying the configured action for a selected duration. To throttle requests, under With the following behavior select Throttle requests over the maximum configured rate.
15. Select Add rule.
16. Create additional rate limiting rules as needed, and then select Create to create the ruleset.

## 2. Deploy the custom rate limiting ruleset

To deploy a custom rate limiting ruleset to one or more zones on an Enterprise plan:

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Rate limiting rulesets tab.
3. Under Your custom rate limiting rulesets and next to the rate limiting ruleset you wish to deploy, select Deploy.
4. In the ruleset deployment page, enter a descriptive name for the rule deploying the ruleset in Execution name.
5. Under Execution scope, review the scope of the rate limiting ruleset to deploy. If necessary, select Edit scope and configure the expression that will determine the scope of the current rule.
WarningDeployed custom rate limiting rulesets will only apply to incoming traffic of zones on an Enterprise plan. The Expression Builder will automatically include this filter. If you define a custom expression using the Expression Editor, you must include AND zone.level eq "ENT" in your expression so that the rule only applies to zones on an Enterprise plan.
6. To deploy your rule immediately, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

The Deployed custom rate limiting rulesets list will show a rule for each deployed custom rate limiting ruleset.

## Configure a custom response for blocked requests

When you select the Block action in a rule you can optionally define a custom response.

The custom response has three settings:

- With response type: Choose a content type or the default rate limiting response from the list. The available custom response types are the following:

























Dashboard valueAPI valueCustom HTML"text/html"Custom Text"text/plain"Custom JSON"application/json"Custom XML"text/xml"
- With response code: Choose an HTTP status code for the response, in the range 400-499. The default response code is 429.
- Response body: The body of the response. Configure a valid body according to the response type you selected. The maximum field size is 30 KB.

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

## Create a rate limiting ruleset via API

**來源**: [https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/create-api/](https://developers.cloudflare.com/waf/account/rate-limiting-rulesets/create-api/)

Page options # Create a rate limiting ruleset via API

To deploy rate limiting rules at the account level, you must create a rate limiting ruleset with one or more rules. Use the Rulesets API to create and deploy rate limiting rulesets via API.

Note

At the API level, a rate limiting ruleset is a regular custom ruleset with one or more rate limiting rules that you create in the http_ratelimit phase. The concept of custom rate limiting ruleset exists in the Cloudflare dashboard to make it clear that you are configuring and deploying rate limiting rules at the account level. This page with API instructions uses the same terminology.

Each rate limiting rule contains a ratelimit object with the rate limiting configuration. Refer to Rate limiting parameters for more information on this object and its parameters.

If you are using Terraform, refer to Rate limiting rules configuration using Terraform.

## Procedure

To deploy a rate limiting ruleset in your account, follow these general steps:

1. Create a rate limiting ruleset (that is, a custom ruleset in the http_ratelimit phase) with one or more rate limiting rules.
2. Deploy the ruleset to the entry point ruleset of the http_ratelimit phase at the account level.

### 1. Create a rate limiting ruleset

The following example creates a rate limiting ruleset with a single rate limiting rule in the rules array.

Required API token permissions

At least one of the following token permissions is required: - Account WAF Write
- Account Rulesets Write

Create an account ruleset ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "",    "kind": "custom",    "name": "My rate limiting ruleset",    "rules": [        {            "description": "Rate limit API requests",            "expression": "(starts_with(http.request.uri.path, \"/my-api/\"))",            "ratelimit": {                "characteristics": [                    "ip.src",                    "cf.colo.id"                ],                "requests_to_origin": false,                "requests_per_period": 30,                "period": 60,                "mitigation_timeout": 120            },            "action": "block",            "action_parameters": {                "response": {                    "status_code": 429,                    "content_type": "application/json",                    "content": "{ \"error\": \"Your API requests have been rate limited. Wait a couple of minutes and try again.\" }"                }            },            "enabled": true        }    ],    "phase": "http_ratelimit"  }'
```

The available characteristics depend on your Cloudflare plan and product subscriptions. Refer to Availability for more information.

Save the ruleset ID in the response for the next step.

### 2. Deploy the rate limiting ruleset

To deploy the rate limiting ruleset, add a rule with "action": "execute" to the http_ratelimit phase entry point ruleset at the account level.

1. Invoke the Get an account entry point ruleset operation to obtain the definition of the entry point ruleset for the http_ratelimit phase. You will need the account ID for this task.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount WAF ReadAccount Rulesets ReadAccount Rulesets Write Get an account entry point rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/phases/http_ratelimit/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Account-level phase entry point",    "id": "<RULESET_ID>",    "kind": "root",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "root",    "phase": "http_ratelimit",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. Account WAF Write
3. Account WAF Read
4. Account Rulesets Read
5. Account Rulesets Write
6. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create an account ruleset rule operation to add an execute rule to the existing ruleset deploying the rate limiting ruleset. By default, the rule will be added at the end of the list of rules already in the ruleset.
The following request creates a rule that executes the rate limiting ruleset with ID <RATE_LIMITING_RULESET_ID> for all Enterprise zones in the account:
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account ruleset rulecurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "Execute rate limiting ruleset",    "expression": "(cf.zone.plan eq \"ENT\")",    "action": "execute",    "action_parameters": {        "id": "<RATE_LIMITING_RULESET_ID>"    },    "enabled": true  }'
WarningYou can only apply rate limiting rulesets to incoming traffic of zones on an Enterprise plan. To enforce this requirement, you must include cf.zone.plan eq "ENT" in the expression of the execute rule deploying the rate limiting ruleset.
7. Account WAF Write
8. Account Rulesets Write
9. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create an account ruleset operation. Include a single rule in the rules array that executes the rate limiting ruleset for all incoming requests of Enterprise zones in your account.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "description": "",    "kind": "root",    "name": "Account-level phase entry point",    "rules": [        {            "action": "execute",            "expression": "(cf.zone.plan eq \"ENT\")",            "action_parameters": {                "id": "<RATE_LIMITING_RULESET_ID>"            }        }    ],    "phase": "http_ratelimit"  }'
10. Account WAF Write
11. Account Rulesets Write

For examples of rate limiting rule definitions for the API, refer to the zone-level API documentation.

## Next steps

Use the different operations in the Rulesets API to work with the ruleset you just created and deployed. The following table has a list of common tasks for working with rate limiting rulesets at the account level:

| Task | Procedure |
| --- | --- |
| Get list of rate limiting rulesets | Use the List account rulesets operation and search for rulesets with "kind": "custom" and "phase": "http_ratelimit". The response will include the ruleset IDs.For more information, refer to List existing rulesets. |
| List all rules in a rate limiting ruleset | Use the Get an account ruleset operation with the rate limiting ruleset ID to obtain the list of configured rate limiting rules and their IDs.For more information, refer to View a specific ruleset. |
| Update a rate limiting rule | Use the Update an account ruleset rule operation. You will need to provide the rate limiting ruleset ID and the rule ID.For more information, refer to Update a rule in a ruleset. |
| Delete a rate limiting rule | Use the Delete an account ruleset rule operation. You will need to provide the rate limiting ruleset ID and the rule ID.For more information, refer to Delete a rule in a ruleset. |

## More resources

For more information on the different rate limiting parameters you can configure in your rate limiting rules, refer to Rate limiting parameters.

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

## Managed rulesets

**來源**: [https://developers.cloudflare.com/waf/account/managed-rulesets/](https://developers.cloudflare.com/waf/account/managed-rulesets/)

Page options # Managed rulesets

Note

This feature requires an Enterprise plan with a paid add-on.

Cloudflare provides pre-configured managed rulesets that protect against web application exploits such as the following:

- Zero-day vulnerabilities
- Top-10 attack techniques
- Use of stolen/leaked credentials
- Extraction of sensitive data

Managed rulesets are regularly updated. Each rule has a default action that varies according to the severity of the rule. You can adjust the behavior of specific rules, choosing from several possible actions.

Rules of managed rulesets have associated tags (such as wordpress) that allow you to search for a specific group of rules and configure them in bulk.

## Account-level deployment

At the account level, you can deploy each WAF managed ruleset more than once. This means that you can apply the same managed ruleset with different configurations to different subsets of incoming traffic for the Enterprise zones in your account.

For example, you could deploy the Cloudflare OWASP Core Ruleset multiple times with different paranoia levels and a different action (Managed Challenge action for PL3 and Log action for PL4).

Example: Deploy OWASP with two different configurations

The following example deploys the Cloudflare OWASP Core Ruleset multiple times at the account level through the following execute rules:

- First execute rule: Enable OWASP rules up to paranoia level 3 (PL3) and set the action to Managed Challenge.
- Second execute rule: Enable OWASP rules up to PL4 and set the action to Log.

This configuration gives you additional protection by enabling PL3 rules, but without blocking the requests, since higher paranoia levels are more prone to false positives.

The second rule logs any matches for PL4 rules, the most strict set of rules in the ruleset, so that it does not affect live traffic. You could use this configuration to understand which traffic would be affected by PL4 rules.

- Dashboard
- API

1. Deploy the Cloudflare OWASP Core Ruleset by following the dashboard instructions, customizing the ruleset behavior using these settings:

OWASP Anomaly Score Threshold: Medium - 40 and higher
OWASP Paranoia Level: PL3
OWASP Action: Managed Challenge
2. OWASP Anomaly Score Threshold: Medium - 40 and higher
3. OWASP Paranoia Level: PL3
4. OWASP Action: Managed Challenge
5. Select Deploy.
6. Repeat the deployment procedure for the OWASP ruleset, but with following ruleset configuration:

OWASP Anomaly Score Threshold: Medium - 40 and higher
OWASP Paranoia Level: PL4
OWASP Action: Log
7. OWASP Anomaly Score Threshold: Medium - 40 and higher
8. OWASP Paranoia Level: PL4
9. OWASP Action: Log

Once you finish your configuration, the Deployed managed rulesets list will show two Execute rules for the Cloudflare OWASP Core Ruleset.

The following POST request for the Create an account ruleset operation creates an entry point ruleset for the http_request_firewall_managed phase at the account level. The ruleset includes two rules deploying the Cloudflare OWASP Core Ruleset twice with different configurations.

Required API token permissions

At least one of the following token permissions is required: - Account WAF Write
- Account Rulesets Write

Create an account ruleset ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets (account)",    "kind": "root",    "phase": "http_request_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "4814384a9e5d4991b9815dcfc25d2f1f",                "overrides": {                    "categories": [                        {                            "category": "paranoia-level-4",                            "enabled": false                        }                    ],                    "rules": [                        {                            "id": "6179ae15870a4bb7b2d480d4843b323c",                            "action": "managed_challenge"                        }                    ]                }            },            "expression": "cf.zone.plan eq \"ENT\"",            "description": "Execute OWASP ruleset at PL3 with Managed Challenge action"        },        {            "action": "execute",            "action_parameters": {                "id": "4814384a9e5d4991b9815dcfc25d2f1f",                "overrides": {                    "rules": [                        {                            "id": "6179ae15870a4bb7b2d480d4843b323c",                            "action": "log"                        }                    ]                }            },            "expression": "cf.zone.plan eq \"ENT\"",            "description": "Execute OWASP ruleset at PL4 with Log action"        }    ]  }'
```

## Customize the behavior of managed rulesets

To customize the behavior of managed rulesets, do one of the following:

- Create exceptions to skip the execution of managed rulesets or some of their rules under certain conditions.
- Configure overrides to change the rule action
or disable one or more rules of managed rulesets. Overrides can affect an
entire managed ruleset, specific tags, or specific rules in the managed
ruleset.

Exceptions have priority over overrides.

Important

Ruleset overrides and tag overrides apply to both existing and future rules in the managed ruleset. If you want to override existing rules only, you must use rule overrides.

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

## Deploy a WAF managed ruleset in the dashboard (account)

**來源**: [https://developers.cloudflare.com/waf/account/managed-rulesets/deploy-dashboard/](https://developers.cloudflare.com/waf/account/managed-rulesets/deploy-dashboard/)

Page options # Deploy a WAF managed ruleset in the dashboard (account)

Note

This feature requires an Enterprise plan with a paid add-on.

To deploy a managed ruleset for a single zone, refer to Deploy a managed ruleset in the dashboard for a zone.

## Deploy a managed ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Select Deploy > Deploy managed ruleset.
4. Next to the managed ruleset you want to deploy, select Select ruleset.
5. Give a name to the rule deploying the ruleset in Execution name.
6. (Optional) To execute the managed ruleset for a subset of incoming requests, select Edit scope and configure the expression that will determine the scope of the current rule deploying the managed ruleset.
WarningDeployed rulesets will only apply to incoming traffic of Enterprise domains on your account. The Expression Builder will automatically include this filter. If you define a custom expression using the Expression Editor, use parentheses to enclose any custom conditions and end your expression with and cf.zone.plan eq "ENT" so that the rule only applies to domains on an Enterprise plan.
7. (Optional) You can customize the behavior of the managed ruleset in the following ways:

Configure the entire ruleset (affects all the rules)
Configure several rules or rules with specific tags
Configure a single rule
8. Configure the entire ruleset (affects all the rules)
9. Configure several rules or rules with specific tags
10. Configure a single rule
11. To deploy the managed ruleset immediately, select Deploy. If you are not ready to deploy, select Save as Draft.

The Deployed managed rulesets list will show an Execute rule for the managed ruleset you deployed.

## Turn on or off a managed ruleset

Select the Enabled toggle next to a deployed managed ruleset to turn it on or off.

## Configure a managed ruleset

Configure a managed ruleset to define specific field values for one or more rules (for example, configure a rule with an action different from the action configured by Cloudflare). You can also turn off specific rules.

To skip one or more rules — or even entire WAF managed rulesets — for specific incoming requests, add an exception. Exceptions, also called skip rules, are shown as Skip rules in the Deployed managed rulesets list.

Note

Some managed rulesets may not allow custom configuration, depending on your Cloudflare plan.

### Configure field values for all the rules

To configure an entire managed ruleset:

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Select the rule description of the Execute rule that deploys the managed ruleset you want to configure. Alternatively, select the three dots > Edit.
If you have not deployed the managed ruleset yet, do the following:

Select Deploy > Deploy managed ruleset.
Next to the managed ruleset you want to deploy and configure, select Select ruleset.
4. Select Deploy > Deploy managed ruleset.
5. Next to the managed ruleset you want to deploy and configure, select Select ruleset.
6. In the ruleset configuration section, set one or more rule fields from the available values in the drop-down lists. The exact options vary according to the managed ruleset you are configuring.
For example, select the action to perform for all the rules in the ruleset from the Ruleset action drop-down list.
7. If you are editing a deployed managed ruleset, select Save. If you have not deployed the managed ruleset yet, select Deploy to deploy the ruleset immediately, or Save as Draft to save your deployment settings for later.

### Configure rules in bulk in a managed ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. If you have already deployed the managed ruleset you want to configure, find the rule deploying that managed ruleset and select the rule description. Alternatively, select the three dots > Edit next to an Execute rule deploying the managed ruleset.
If you have not deployed the managed ruleset:

Select Deploy > Deploy managed ruleset.
Next to the managed ruleset, select Select ruleset.
4. Select Deploy > Deploy managed ruleset.
5. Next to the managed ruleset, select Select ruleset.
6. Select Browse rules.

1. Search for rules using the available filters. You can search for tags.
2. In the results list, select the checkboxes for all the rules you want to configure.
Alternatively, select a tag name under the search input to filter the rules with that tag, and then select the checkboxes for the rules you want to configure. To extend your selection to all rules with the tag across all pages, select Select all <NUMBER> rules.
3. Update one or more fields for the selected rules using the buttons displayed in the top right corner of the table.
4. Select Next.
5. If you selected a tag, a dialog appears asking you if any new rules with the selected tag should be configured with the field values you selected.

Select Do not apply to new rules to apply your configurations to the selected rules only.
Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
6. Select Do not apply to new rules to apply your configurations to the selected rules only.
7. Select Apply to new rules if you want to apply your configurations to any new rules with the select tag.
8. Select Save.

### Configure a single rule in a managed ruleset

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. If you have already deployed the managed ruleset you want to configure, find the rule deploying that managed ruleset and select the rule description. Alternatively, select the three dots > Edit next to an Execute rule deploying the managed ruleset.
If you have not deployed the managed ruleset:

Select Deploy > Deploy managed ruleset.
Next to the managed ruleset, select Select ruleset.
4. Select Deploy > Deploy managed ruleset.
5. Next to the managed ruleset, select Select ruleset.
6. Select Browse rules.

1. Search for a rule using the available filters. You can search for tags.
2. Find the rule you want to configure in the results list.
3. In the result line for the rule you want to change, select the desired value for a field in the displayed drop-down lists. For example, select the rule action in the Action dropdown. You can also change the status of a rule using the Status toggle next to the rule.
4. Select Next, and then select Save.

### Browse the rules of a managed ruleset

You can browse the available rules in a managed ruleset and search for individual rules or tags.

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Select the rule description of the Execute rule that deploys the managed ruleset you want to configure. Alternatively, select the three dots > Edit.
If you have not deployed the managed ruleset yet, do the following:

Select Deploy > Deploy managed ruleset.
Next to the managed ruleset you want to browse, select Select ruleset.
4. Select Deploy > Deploy managed ruleset.
5. Next to the managed ruleset you want to browse, select Select ruleset.
6. Select Browse rules.

### Delete a managed ruleset deployment rule or an exception

1. In the Cloudflare dashboard, go to the WAF page.
  Go to WAF
2. Go to the Managed rulesets tab.
3. Under Deployed managed rulesets and next to the rule you want to delete, select the three dots > Delete and confirm the operation.

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

## Deploy a WAF managed ruleset via API (account)

**來源**: [https://developers.cloudflare.com/waf/account/managed-rulesets/deploy-api/](https://developers.cloudflare.com/waf/account/managed-rulesets/deploy-api/)

Page options # Deploy a WAF managed ruleset via API (account)

Note

This feature requires an Enterprise plan with a paid add-on.

Use the Rulesets API to deploy a WAF managed ruleset to the http_request_firewall_managed phase at the account level.

The WAF Managed Rules page includes the IDs of the different WAF managed rulesets. You will need this information when deploying rulesets via API.

If you are using Terraform, refer to WAF Managed Rules configuration using Terraform.

## Example

The following example deploys the Cloudflare Managed Ruleset to the http_request_firewall_managed phase of a given account ($ACCOUNT_ID) by creating a rule that executes the managed ruleset. The rules in the managed ruleset are executed when the zone name matches one of example.com or anotherexample.com.

1. Invoke the Get an account entry point ruleset operation to obtain the definition of the entry point ruleset for the http_request_firewall_managed phase. You will need the account ID for this task.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount WAF ReadAccount Rulesets ReadAccount Rulesets Write Get an account entry point rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/phases/http_request_firewall_managed/entrypoint" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
{  "result": {    "description": "Account-level phase entry point",    "id": "<RULESET_ID>",    "kind": "root",    "last_updated": "2024-03-16T15:40:08.202335Z",    "name": "root",    "phase": "http_request_firewall_managed",    "rules": [      // ...    ],    "source": "firewall_managed",    "version": "10"  },  "success": true,  "errors": [],  "messages": []}
2. Account WAF Write
3. Account WAF Read
4. Account Rulesets Read
5. Account Rulesets Write
6. If the entry point ruleset already exists (that is, if you received a 200 OK status code and the ruleset definition), take note of the ruleset ID in the response. Then, invoke the Create an account ruleset rule operation to add an execute rule to the existing ruleset deploying the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee). By default, the rule will be added at the end of the list of rules already in the ruleset.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account ruleset rulecurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets/$RULESET_ID/rules" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "action": "execute",    "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee"    },    "expression": "(cf.zone.name in {\"example.com\" \"anotherexample.com\"}) and cf.zone.plan eq \"ENT\"",    "description": "Execute the Cloudflare Managed Ruleset"  }'
{  "result": {    "id": "<RULESET_ID>",    "name": "Account-level phase entry point",    "description": "",    "kind": "root",    "version": "11",    "rules": [      // ... any existing rules      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee",          "version": "latest"        },        "expression": "(cf.zone.name in {\"example.com\" \"anotherexample.com\"}) and cf.zone.plan eq \"ENT\"",        "description": "Execute the Cloudflare Managed Ruleset",        "last_updated": "2024-03-18T18:30:08.122758Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2024-03-18T18:30:08.122758Z",    "phase": "http_request_firewall_managed"  },  "success": true,  "errors": [],  "messages": []}
WarningManaged rulesets deployed at the account level will only apply to incoming traffic of zones on an Enterprise plan. The expression of your execute rule must end with and cf.zone.plan eq "ENT" or else the API operation will fail.
7. Account WAF Write
8. Account Rulesets Write
9. If the entry point ruleset does not exist (that is, if you received a 404 Not Found status code in step 1), create it using the Create an account ruleset operation. Include a single rule in the rules array that executes the Cloudflare Managed Ruleset (with ID efb7b8c949ac4650a09736fc376e9aee) for all incoming requests where the zone name matches one of example.com or anotherexample.com.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Account WAF WriteAccount Rulesets Write Create an account rulesetcurl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rulesets" \  --request POST \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "name": "My ruleset",    "description": "Entry point ruleset for WAF managed rulesets",    "kind": "root",    "phase": "http_request_firewall_managed",    "rules": [        {            "action": "execute",            "action_parameters": {                "id": "efb7b8c949ac4650a09736fc376e9aee"            },            "expression": "(cf.zone.name in {\"example.com\" \"anotherexample.com\"}) and cf.zone.plan eq \"ENT\"",            "description": "Execute the Cloudflare Managed Ruleset"        }    ]  }'
10. Account WAF Write
11. Account Rulesets Write

## Next steps

To customize the behavior of the rules included in a managed ruleset, create an override.

To skip the execution of WAF managed rulesets or some of their rules, create an exception (also called a skip rule).

Exceptions have priority over overrides.

## More resources

For more information on working with managed rulesets via API, refer to Work with managed rulesets in the Ruleset Engine documentation.

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

## Security Analytics

**來源**: [https://developers.cloudflare.com/waf/analytics/security-analytics/](https://developers.cloudflare.com/waf/analytics/security-analytics/)

Page options # Security Analytics

Security Analytics displays information about all incoming HTTP requests for your domain, including requests not handled by Cloudflare security products.

By default, Security Analytics queries filter on requestSource = 'eyeball', which represents requests from end users. Note that requests from Cloudflare Workers (subrequests) are not visible in Security Analytics.

Use the Security Analytics dashboard to:

- View the traffic distribution for your domain.
- Understand which traffic is being mitigated by Cloudflare security products, and where non-mitigated traffic is being served from (Cloudflare global network or origin server ↗).
- Analyze suspicious traffic and create tailored WAF custom rules based on applied filters.
- Learn more about Cloudflare's security scores (attack score, bot score, malicious uploads, and leaked credentials results) with real data.
- Find an appropriate rate limit for incoming traffic.
- Analyze suspicious traffic (new security dashboard only).

If you need to modify existing security-related rules you already configured, consider also checking Security Events. This dashboard displays information about requests affected by Cloudflare security products.

## Availability

Zone/domain-level analytics are included with all plans, though the retention period, query window, displayed statistics, and filter options vary by plan. Account-level analytics are only available to customers on Business and Enterprise domain plans.

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Retention | 7 | 31 | 31 | 90 |
| Query window | 1 | 7 | 31 | 31 |

## Access

To use Security Analytics:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Go to the account or zone/domain dashboard:


For the zone/domain dashboard, select your domain and go to Security > Analytics.


For the account dashboard, go to the Security Analytics page.
  Go to Security analytics
3. For the zone/domain dashboard, select your domain and go to Security > Analytics.
4. For the account dashboard, go to the Security Analytics page.
  Go to Security analytics

## Adjusting displayed data

### Apply filters

Adjust the scope of analytics by manually entering filter conditions. You can also select Filter or Exclude to filter by a field value. These buttons appear when you hover the analytics data legend.

To manually add a filter:

1. Select Add filter.
2. Select a field, an operator, and a value. For example, to filter events by source IP address, select the Source IP field, select the equals operator, and enter the IP address.
3. Select Apply.

Take the following into account when entering filter values:

- Do not add quotes around values.
- Do not enter the AS prefix when entering ASN numbers. For example, enter 1423 instead of AS1423.
- Wildcards are not supported.

### Select time frame

Select the time frame you wish to analyze from the Previous 24 hours drop-down list.

## Create custom rule from current filters

To create a custom rule with an expression based on the filters you applied in Security Analytics, select Create custom security rule above the main chart.

## Main dashboard areas

The new security dashboard and the old dashboard have a few differences, including the order of the various sections on the Security Analytics page.

### Suspicious activity

Note

Only available in the new security dashboard.

The suspicious activity section gives you information about suspicious requests that were identified by the Cloudflare detections you have enabled. The supported detections include:

- Account takeover
- Leaked credential check (only for user and password leaked)
- Malicious uploads
- WAF attack score
- Firewall for AI

Each suspicious activity is classified with a severity score that can vary from critical to low. You can use the filter option to investigate further.

### Request activity

The main chart displays the following data for the selected time frame, according to the selected tab:

- Traffic analysis: Traffic mitigated by the Cloudflare security platform, served by Cloudflare, and served by the origin server, according to the following classification:

Mitigated by WAF: Requests blocked or challenged by Cloudflare's application security products such as the WAF and HTTP DDoS protection. It does not include requests that had the following actions applied: Log, Skip, and Allow.
Served by Cloudflare: Requests served by the Cloudflare global network such as cached content and redirects.
Served by origin: Requests served by your origin server.
- Mitigated by WAF: Requests blocked or challenged by Cloudflare's application security products such as the WAF and HTTP DDoS protection. It does not include requests that had the following actions applied: Log, Skip, and Allow.
- Served by Cloudflare: Requests served by the Cloudflare global network such as cached content and redirects.
- Served by origin: Requests served by your origin server.
- Attack analysis: WAF attack score analysis of incoming requests, classifying them as Clean, Likely clean, Likely attack, or Attack.
- Bot analysis: Bot score analysis of incoming requests, classifying them as Automated, Likely automated, Likely human, or Verified bot.
- Request rate analysis: Displays data on the request rate for traffic matching the selected filters and time period. Use this tab to find an appropriate rate limit for incoming traffic matching the applied filters.
- Cloudy analysis (beta): Get insights about your application security by using plain language to interrogate your data. For more information, refer to our blog post ↗.

### Top statistics

This section presents top statistics about incoming requests highlighting relevant properties commonly used when performing a security analysis.

You can filter or exclude some of the top values by selecting Filter or Exclude next to each value.

To display additional top statistics, select More top statistics.

Note

Cloudflare calculates the top statistics from a sample of requests in the selected time frame. To know the applied sampling rate, hover the icon next to the name of a top statistic.

### Insights

Note

Only available in the previous dashboard navigation structure.

The provided insights show statistics for commonly used filters when doing security analyses, without immediately applying these filters to the displayed data.

If you find a high value in one or more insights, this can mean that there is a set of suspicious requests that you should investigate. Additionally, these insights are a good starting point for applying a first set of filters to the dashboard.

To apply the filters for an insight to the data displayed in the Security Analytics dashboard, select Filter next to the insight.

### Score-based analyses

Note

Only available in the previous dashboard navigation structure.

The Attack analysis, Bot analysis, Malicious uploads, and Account abuse detection sections display statistics related to WAF attack scores, bot scores, WAF content scanning scores, and leaked credentials scanning of incoming requests for the selected time frame. All plans include access to the Leaked credential check under Account abuse detection. This feature detects login attempts using credentials that have been exposed online. For more information on what to do if you have credentials that have been leaked, refer to the example mitigation rules page.

You can examine different traffic segments according to the current metric (attack score, bot score, or content scanning). To apply score filters for different segments, select the buttons below the traffic chart. For example, select Likely attack under Attack analysis to filter requests that are likely an attack (requests with WAF attack score values between 21 and 50).

Additionally, you can use the slider tool below the chart to filter incoming requests according to the current metric. This allows you to filter traffic groups outside the predefined segments.

### Logs

Security Analytics shows request logs for the selected time frame and applied filters, along with detailed information and security analyses of those requests.

By default, Security Analytics uses sampled logs for the logs table. If you are subscribed to Log Explorer, you may also have access to raw logs.

#### Sampled logs

This section contains detailed log information for individual (sampled) requests in the selected time frame.

The displayed information includes:

- Mitigation action applied to the request
- Cache status
- Status code returned by the origin server to Cloudflare (in case of a cache miss)
- Status code returned by Cloudflare to the client
- Security scores for the request (attack, bot, uploaded content scanning)
- Request properties

#### Raw logs Beta

Note

This feature is currently in its early access phase. Contact your account team to request access.

When performing a forensic analysis, you sometimes select a very short time frame and apply several filters to identify a specific set of requests. In this situation, to get a better understanding of the incoming requests at a given point in time, you would require the full list of requests and not just a sample.

By default, Security Analytics shows sampled logs based on the filters you apply. Under certain conditions, you can switch to Raw logs. This view shows all the request logs for the selected time frame and filters instead of sampled logs. At this time, this view is only available when the number of sampled logs shown in the Security Analytics page is lower than 100.

##### View raw logs

To switch from sampled logs to raw logs, select Switch to raw logs under Sampled logs. This option is only available when the number of (sampled) logs for the selected time frame is lower than 100.

To switch from raw logs back to sampled logs, select Switch back to sampled logs.

##### Query raw logs using Log Explorer

You can switch to Log Explorer to dive deeper on your analysis while applying the same filters you used in Security Analytics. Raw logs in Security Analytics are based on the same data source used in Log Explorer.

Note

Currently, changing the time frame or the applied filters while showing raw logs may cause the Cloudflare dashboard to switch automatically to sampled logs. This happens if the total number of request logs for the selected time frame is high.

## Sampling

The Security Analytics dashboard uses sampled data, except when showing raw logs. Most information in the dashboard is obtained from httpRequestsAdaptiveGroups and httpRequestsAdaptive GraphQL nodes. For more information on working directly with GraphQL datasets, refer to Datasets (tables).

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

## Alerts

**來源**: [https://developers.cloudflare.com/waf/reference/alerts/](https://developers.cloudflare.com/waf/reference/alerts/)

Page options # Alerts

Cloudflare provides two types of security alerts that inform you of any spikes in security events:

- Security Events Alert: Alerts about spikes across all services that generate log entries in Security Events.
- Advanced Security Events Alert: Similar to Security Events Alert with support for additional filtering options.

For details on alert types and their availability, refer to Alert types.

To receive security alerts, you must configure a notification. Notifications help you stay up to date with your Cloudflare account through email, PagerDuty, or webhooks, depending on your Cloudflare plan.

## Set up a notification for security alerts

For instructions on how to set up a notification for a security alert, refer to Create a Notification.

## Alert logic

Security alerts use a static threshold together with a z-score ↗ calculation over the last six hours and five-minute buckets of events. An alert is triggered whenever the z-score value is above 3.5 and the spike crosses a threshold of 200 security events. You will not receive duplicate alerts within the same two-hour time frame.

## Alert types

Advanced Security Events Alert

Who is it for? Enterprise customers who want to receive alerts about spikes in specific services that generate log entries in Security Events. For more information, refer to WAF alerts.

Other options / filters A mandatory filters selection is needed when you create a notification policy which includes the list of services and zones that you want to be alerted on.

- You can search for and add domains from your list of Enterprise zones.
- You can choose which services the alert should monitor (Managed Firewall, Rate Limiting, etc.).
- You can filter events by a targeted action.

Included with Enterprise plans.

What should you do if you receive one? Review the information in Security Events to identify any possible attack or misconfiguration.

Additional information The mean time to detection is five minutes.

When setting up this alert, you can select the services that will be monitored. Each selected service is monitored separately and can be selected as a filter.

Limitations Security Events (WAF) alerts are not sent for each individual events, but only when a spike in traffic reaches the threshold for an alert to be sent.

These thresholds cannot be configured. Z-score is used to determine the threshold.

Security Events Alert

Who is it for? Business and Enterprise customers who want to receive alerts about spikes across all services that generate log entries in Security Events. For more information, refer to WAF alerts.

Other options / filters A mandatory filters selection is needed when you create a notification policy which includes the list of zones that you want to be alerted on.

- You can also search for and add domains from your list of business or enterprise zones. The notification will be sent for the domains chosen.
- You can filter events by a targeted action.

Included with Business and Enterprise plans.

What should you do if you receive one? Review the information in Security Events to identify any possible attack or misconfiguration.

Additional information The mean time to detection is five minutes.

When setting up this alert, you can select the services that will be monitored. Each selected service is monitored separately.

Limitations Security Events (WAF) alerts are not sent for each individual events, but only when a spike in traffic reaches the threshold for an alert to be sent.

These thresholds cannot be configured. Z-score is used to determine the threshold.

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

## Phases

**來源**: [https://developers.cloudflare.com/waf/reference/phases/](https://developers.cloudflare.com/waf/reference/phases/)

Page options # Phases

The Web Application Firewall provides the following phases where you can create rulesets and rules:

- http_request_firewall_custom
- http_ratelimit
- http_request_firewall_managed

These phases exist both at the account level and at the zone level. Considering the available phases and the two different levels, rules will be evaluated in the following order:

- Old dashboard
- New dashboard

| Security feature | Scope | Phase | Ruleset kind | Location in the dashboard |
| --- | --- | --- | --- | --- |
| Custom rulesets | Account | http_request_firewall_custom | custom (create)root (deploy) | Go to WAF     > Custom rulesets tab |
| Custom rules | Zone | http_request_firewall_custom | zone | Your zone > Security > WAF > Custom rules tab |
| Rate limiting rulesets | Account | http_ratelimit | root | Go to WAF     > Rate limiting rulesets tab |
| Rate limiting rules | Zone | http_ratelimit | zone | Your zone > Security > WAF > Rate limiting rules tab |
| Managed rulesets | Account | http_request_firewall_managed | root | Go to WAF     > Managed rulesets tab |
| Managed rules | Zone | http_request_firewall_managed | zone | Your zone > Security > WAF > Managed rules tab |

| Security feature | Scope | Phase | Ruleset kind | Location in the dashboard |
| --- | --- | --- | --- | --- |
| Custom rulesets | Account | http_request_firewall_custom | custom (create)root (deploy) | Go to WAF     > Custom rulesets tab |
| Custom rules | Zone | http_request_firewall_custom | zone | Your zone > Security > Security rules |
| Rate limiting rulesets | Account | http_ratelimit | root | Go to WAF     > Rate limiting rulesets tab |
| Rate limiting rules | Zone | http_ratelimit | zone | Your zone > Security > Security rules |
| Managed rulesets | Account | http_request_firewall_managed | root | Go to WAF     > Managed rulesets tab |
| Managed rules | Zone | http_request_firewall_managed | zone | Your zone > Security > Security rules |

To learn more about phases, refer to Phases in the Ruleset Engine documentation.

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

## WAF managed rules (previous version)

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/](https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/)

Page options # WAF managed rules (previous version)

Managed rules, a feature of Cloudflare WAF (Web Application Firewall), identifies and removes suspicious activity for HTTP GET and POST requests.

Warning

- This page contains documentation about the previous implementation of WAF Managed Rules. For more information on the new version, refer to WAF Managed Rules.
- All customers with access to the previous version of WAF managed rules can upgrade to the new version.
- The new WAF Managed Rules provide the Cloudflare Free Managed Ruleset to all customers, including customers on a Free plan. Refer to the announcement blog post ↗ for details.

Examples of malicious content ↗ that managed rules identify include:

- Common keywords used in comment spam (XX, Rolex, Viagra, etc.)
- Cross-site scripting attacks (XSS)
- SQL injections (SQLi)

WAF managed rules (previous version) are available to Pro, Business, and Enterprise plans for any subdomains proxied to Cloudflare. Control managed rules settings in Security > WAF > Managed rules.

Managed rules includes three packages:

- Cloudflare Managed Ruleset
- OWASP ModSecurity Core Rule Set
- Customer requested rules

You can use the sampled logs in the Security Events dashboard to review threats blocked by WAF managed rules.

## Cloudflare Managed Ruleset

The Cloudflare Managed Ruleset contains security rules written and curated by Cloudflare. Select a ruleset name under Group to reveal the rule descriptions.

Cloudflare Specials is a group that provides core firewall security against common attacks ↗.

Note

Cloudflare recommends that you always leave Cloudflare Specials enabled. Additionally, only enable rule groups that correspond to your technology stack. For example, if you use WordPress, enable the Cloudflare WordPress group.

When viewing a ruleset, Cloudflare shows default actions for each rule listed under Default mode. The Mode available for individual rules within a specific Cloudflare Managed Ruleset are:

- Default: Takes the default action listed under Default mode when viewing a specific rule.
- Disable: Turns off the specific rule within the group.
- Block: Discards the request.
- Interactive Challenge: The visitor receives a challenge page that requires interaction.
- Simulate: The request is allowed through but is logged in sampled logs.

Cloudflare's WAF changelog allows customers to monitor ongoing changes to the Cloudflare Managed Ruleset.

## OWASP ModSecurity Core Rule Set

The OWASP ModSecurity Core Rule Set package assigns a score to each request based on how many OWASP rules trigger. Some OWASP rules have a higher sensitivity score than others.

After OWASP evaluates a request, Cloudflare compares the final score to the Sensitivity configured for the zone.  If the score exceeds the sensitivity, the request is actioned based on the Action configured within Package: OWASP ModSecurity Core Rule Set:

- Block: The request is discarded.
- Challenge: The visitor receives an interactive challenge page.
- Simulate: The request is allowed through but is logged in sampled logs.

The sensitivity score required to trigger the WAF for a specific Sensitivity is as follows:

- Low: 60 and higher
- Medium: 40 and higher
- High: 25 and higher

For AJAX requests, the following scores are applied instead:

- Low: 120 and higher
- Medium: 80 and higher
- High: 65 and higher

Review the entry in sampled logs for the final score and for the individual triggered rules.

### Control the OWASP package

The OWASP ModSecurity Core Rule Set package contains several rules from the OWASP project ↗. Cloudflare does not write or curate OWASP rules. Unlike the Cloudflare Managed Ruleset, specific OWASP rules are either turned On or Off.

To manage OWASP thresholds, set the Sensitivity to Low, Medium, or High under Package: OWASP ModSecurity Core Rule Set.

Setting the Sensitivity to Off will disable the entire OWASP package including all its rules. Determining the appropriate Sensitivity depends on your business industry and operations. For instance, a Low setting is appropriate for:

- Certain business industries more likely to trigger the WAF.
- Large file uploads.

With a high sensitivity, large file uploads will trigger the WAF.

Cloudflare recommends initially setting the sensitivity to Low and reviewing for false positives before further increasing the sensitivity.

Note

Sampled logs displays rule ID 981176 when a request is blocked by OWASP. Also, some OWASP rules listed in Sampled logs do not appear in the OWASP list of rules because disabling those rules is not recommended.

## Important remarks

- Managed rules introduce a limited amount of latency.
- Changes to WAF managed rules take about 30 seconds to update globally.
- Cloudflare uses proprietary rules to filter traffic.
- Established Websockets do not trigger managed rules for subsequent requests.
- Managed rules parse JSON responses to identify vulnerabilities targeted at APIs. JSON payload parsing is limited to 128 KB.
- Managed rules mitigate padding techniques. Cloudflare recommends the following:


Turn on rule with ID 100048. This rule protects against padding type attacks, but it is not deployed by default because there is a high probability of causing false positives in customer environments. It is, however, important that customers tune their managed rules configuration.


Create a WAF custom rule using the Expression Editor depending on the need to check headers and/or body to block larger payloads (> 128 KB). Use the following fields for this purpose:

http.request.body.truncated
http.request.headers.truncated

You should test your rule in Log mode first (if available), since the rule might generate false positives.
- Turn on rule with ID 100048. This rule protects against padding type attacks, but it is not deployed by default because there is a high probability of causing false positives in customer environments. It is, however, important that customers tune their managed rules configuration.
- Create a WAF custom rule using the Expression Editor depending on the need to check headers and/or body to block larger payloads (> 128 KB). Use the following fields for this purpose:

http.request.body.truncated
http.request.headers.truncated

You should test your rule in Log mode first (if available), since the rule might generate false positives.
- http.request.body.truncated
- http.request.headers.truncated
- There are a handful of managed rules that Cloudflare does not disable even if you turn off Managed rules in the Cloudflare dashboard, such as rules with IDs WP0025B, 100043A, and 100030.

## Related resources

- Troubleshoot WAF managed rules (previous version)
- Security Events
- Cloudflare WAF
- Cloudflare's WAF changelog
- WAF custom rules

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

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/troubleshooting/](https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/troubleshooting/)

Page options # Troubleshooting

By default, WAF managed rules are fully managed via the Cloudflare dashboard and are compatible with most websites and web applications. However, false positives and false negatives may occur:

- False positives: Legitimate requests detected and filtered as malicious.
- False negatives: Malicious requests not filtered.

## Troubleshoot false positives

The definition of suspicious content is subjective for each website. For example, PHP code posted to your website is normally suspicious. However, your website may be teaching how to code and it may require PHP code submissions from visitors. In this situation, you should disable related managed rules for this website, since they would interfere with normal website operation.

To test for false positives, set WAF managed rules to Simulate mode. This mode allows you to record the response to possible attacks without challenging or blocking incoming requests. Also, review the Security Events' sampled logs to determine which managed rules caused false positives.

If you find a false positive, there are several potential resolutions:

- Add the client’s IP addresses to the IP Access Rules allowlist: If the browser or client visits from the same IP addresses, allowing is recommended.
- Disable the corresponding managed rule(s): Stops blocking or challenging false positives, but reduces overall site security. A request blocked by Rule ID 981176 refers to OWASP rules. Decrease OWASP sensitivity to resolve the issue.
- Bypass WAF managed rules with a firewall rule (deprecated): Create a firewall rule with the Bypass action to deactivate WAF managed rules for a specific combination of parameters. For example, bypass managed rules for a specific URL and a specific IP address or user agent.
- (Not recommended) Disable WAF managed rules for traffic to a URL: Lowers security on the particular URL endpoint. Configured via Page Rules.

Additional guidelines are as follows:

- If one specific rule causes false positives, set rule’s Mode to Disable rather than turning Off the entire rule Group.
- For false positives with the administrator section of your website, create a page rule to Disable Security for the admin section of your site resources — for example, example.com/admin.

## Troubleshoot false negatives

To identify false negatives, review the HTTP logs on your origin web server. To reduce false negatives, use the following checklist:

- Are WAF managed rules enabled in Security > WAF > Managed rules?
- Are WAF managed rules being disabled via Page Rules?
- Not all managed rules are enabled by default, so review individual managed rule default actions.

For example, Cloudflare allows requests with empty user agents by default. To block requests with an empty user agent, change the rule Mode to Block.
Another example: if you are looking to block unmitigated SQL injection attacks, make sure the relevant SQLi rules are enabled and set to Block under the Cloudflare Specials group.
- For example, Cloudflare allows requests with empty user agents by default. To block requests with an empty user agent, change the rule Mode to Block.
- Another example: if you are looking to block unmitigated SQL injection attacks, make sure the relevant SQLi rules are enabled and set to Block under the Cloudflare Specials group.
- Are DNS records that serve HTTP traffic proxied through Cloudflare?
- Is a firewall rule bypassing managed rules?
- Does an allowed country, ASN, IP range, or IP address in IP Access rules or firewall rules match the attack traffic?
- Is the malicious traffic reaching your origin IP addresses directly to bypass Cloudflare protection? Block all traffic except from Cloudflare's IP addresses at your origin web server.

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

## WAF managed rules upgrade

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/upgrade/](https://developers.cloudflare.com/waf/reference/legacy/old-waf-managed-rules/upgrade/)

Page options # WAF managed rules upgrade

On 2022-05-04, Cloudflare started the upgrade from the previous version of WAF managed rules to the new WAF Managed Rules, allowing a first set of eligible zones to migrate. Currently, all zones can upgrade to WAF Managed Rules, including partner accounts.

Cloudflare is gradually upgrading all zones to the new version of WAF Managed Rules. You can also start the upgrade process manually for a zone in the Cloudflare dashboard or via API. The upgrade is irreversible — once you upgrade to the new WAF Managed Rules, you cannot go back to the previous version.

If you are using the old dashboard, once the upgrade finishes your rules will be shown using a different user interface in Security > WAF > Managed rules tab. If you are using the new security dashboard, your upgraded rules will be shown in Security > Security rules.

Additionally, the WAF managed rules APIs will stop working once you upgrade.

Deprecation notice

The APIs and Terraform resources related to the previous version of WAF managed rules are deprecated. The APIs for managing the previous version of WAF managed rules are no longer supported since 2025-06-15. The same applies to Terraform resources related to the previous version of WAF managed rules. You must migrate your configuration to avoid any issues.

Refer to Possible upgrade errors if you are having issues upgrading.

## Main benefits

The new version of WAF Managed Rules provides the following benefits over the previous version:

- New matching engine – WAF Managed Rules are powered by the Ruleset Engine, which allows faster managed rule deployments and the ability to check even more traffic without scaling issues. The rules follow the same syntax used in other Cloudflare security products like WAF custom rules.
- Updated Managed Rulesets – The Cloudflare OWASP Core Ruleset, one of WAF's Managed Rulesets, is based on the latest version of the OWASP Core Ruleset (v3.x), which adds paranoia levels and improves false positives rates compared to the version used in WAF managed rules (2.x). You also have more control over the sensitivity score, with a clear indication of how much each rule contributes to the score and what was the total score of a triggered request.
- Better rule browsing and configuration – Deploy Managed Rulesets with a single click to get immediate protection. Override the behavior of entire rulesets, or customize a single rule. Apply overrides to all rules with a specific tag to adjust rules applicable to a given software or attack vector. You can deploy configurations like the following:

Deploy the Cloudflare Managed Ruleset across all my zones.
Deploy the Cloudflare OWASP Core Ruleset on all traffic that does not contain /api/* in the path.
Disable Managed Rulesets across my account for traffic coming from my IP.
- Deploy the Cloudflare Managed Ruleset across all my zones.
- Deploy the Cloudflare OWASP Core Ruleset on all traffic that does not contain /api/* in the path.
- Disable Managed Rulesets across my account for traffic coming from my IP.

For more information on the benefits of WAF Managed Rules, refer to our blog post ↗.

## Upgrade impact

You will be able to upgrade all your zones that do not have URI-based WAF overrides. The same protection will apply to your zone once you move to the new WAF.

Most configuration settings from the previous version of WAF managed rules will be upgraded to the new version, but some specific configurations originally defined in the OWASP ModSecurity Core Rule Set will be lost — you will have to create these configurations in the new WAF Managed Rules, if needed.

For API users, the APIs for managing the previous version of WAF managed rules will stop working once you upgrade. You must use the Rulesets API to manage the new WAF Managed Rules.

### Configurations that will be upgraded

The upgrade process will create an equivalent configuration for the following settings of WAF managed rules:

- Firewall rules configured with Bypass > WAF Managed Rules.
- Page Rules configured with Disable Security.
- Page Rules configured with Web Application Firewall: Off or Web Application Firewall: On.

The OWASP ruleset configuration will be partially upgraded. Refer to the next section for details.

### Configurations that will be lost in the upgrade process

The upgrade process will partially migrate the settings of the OWASP ModSecurity Core Rule Set available in the previous version of WAF managed rules.

The following OWASP settings will be migrated:

- Sensitivity: The old sensitivity values will be migrated to the following paranoia level (PL) and score threshold combinations in the new OWASP ruleset:






























Old sensitivityPL in new OWASPScore threshold in new OWASPHighPL2Medium – 40 or higherMediumPL1High – 25 or higherLowPL1Medium – 40 or higherDefaultPL2Medium – 40 or higher
- Action: The action in the previous OWASP ruleset has an almost direct mapping in the new OWASP managed ruleset, except for the Simulate action which will be migrated to Log.

The following OWASP settings will not be migrated, since there is no direct equivalence between rules in the two versions:

- OWASP group overrides
- OWASP rule overrides

To replace these settings you will need to configure the Cloudflare OWASP Core Ruleset in WAF Managed Rules again according to your needs, namely any tag/rule overrides. For more information on configuring the new OWASP Core Ruleset, refer to Cloudflare OWASP Core Ruleset.

### Configurations that will prevent you from upgrading

If a zone has URI-based WAF overrides (only available via API), you will not have the option to upgrade to WAF Managed Rules. To upgrade to WAF Managed Rules you must:

1. Delete any existing URI-based WAF overrides using the Delete a WAF override operation.
2. Follow the upgrade process described below.

### Cloudflare dashboard changes

After the upgrade process is complete, the Cloudflare dashboard will display your rules in:

- Old dashboard: Security > WAF > Managed rules tab (using a different user interface)
- New dashboard: Security > Security rules

Unlike the old WAF managed rules, there is no longer a global on/off setting to enable the WAF. Instead, you deploy each managed ruleset individually in your zone.

For more information about deploying WAF Managed Rules in the Cloudflare dashboard, refer to Deploy a WAF managed ruleset in the dashboard.

### API changes

Once the upgrade is complete, the APIs for interacting with WAF managed rules will stop working. These APIs are the following:

- WAF packages
- WAF rule groups
- WAF rules

Warning

If you have any integrations using the WAF managed rules APIs stated above, you must update them before upgrading to the new WAF Managed Rules.

To work with WAF Managed Rules you must use the Rulesets API. For more information on deploying WAF Managed Rules via API, refer to Deploy managed rulesets via API.

### Terraform changes

Once the upgrade is complete, the following Terraform resources for configuring WAF managed rules will stop working:

- cloudflare_waf_package ↗
- cloudflare_waf_group ↗
- cloudflare_waf_rule ↗

These resources were only supported in the Terraform Cloudflare provider up to version 3.35. Version 4.x no longer supports these resources ↗.

To manage the configuration of the new WAF Managed Rules using Terraform, you must use cloudflare_ruleset ↗ resources.

## Eligible zones

### Phase 2 (since 2022-09-19)

Update notice

On 2023-08-18, Cloudflare added support for upgrading partner accounts to the new WAF Managed Rules.

In phase 2 all zones are eligible for upgrade. The exact upgrade procedure varies according to your Cloudflare plan.

- Pro and Business customers can upgrade to the new WAF Managed Rules in the Cloudflare dashboard or via API. Once the new version is enabled, the previous version of WAF managed rules will be automatically disabled.
- Enterprise customers can enable the new WAF Managed Rules configuration while keeping the previous version of WAF managed rules enabled, allowing them to check the impact of the new WAF configuration. After reviewing the behavior of the new configuration and making any required adjustments to specific managed rules, Enterprise users can then finish the upgrade, which will disable the previous version of WAF managed rules.

Note: Zones that have URI-based WAF overrides, which you could only manage via API, will not be able to upgrade immediately to the new WAF Managed Rules. You must delete these overrides before migrating.

### Phase 1 (since 2022-05-04)

In phase 1 the upgrade became available to a subset of eligible zones, which had to meet the following requirements:

- The zone has:

WAF disabled, or
WAF enabled and only the Cloudflare Managed Ruleset is enabled (the OWASP ModSecurity Core Rule Set must be disabled).
- WAF disabled, or
- WAF enabled and only the Cloudflare Managed Ruleset is enabled (the OWASP ModSecurity Core Rule Set must be disabled).
- The zone has no firewall rules or Page Rules bypassing, enabling, or disabling WAF managed rules:

Firewall rules configured with Bypass > WAF Managed Rules.
Page Rules configured with Disable Security.
Page Rules configured with Web Application Firewall: Off or Web Application Firewall: On.
- Firewall rules configured with Bypass > WAF Managed Rules.
- Page Rules configured with Disable Security.
- Page Rules configured with Web Application Firewall: Off or Web Application Firewall: On.
- The zone has no URI-based WAF overrides (only available via API).

## Start the upgrade

You can start the WAF upgrade in the Cloudflare dashboard or via API.

### Using the dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and zone.
2. If you are using the old dashboard, go to Security > WAF > Managed rules tab.
If you are using the new security dashboard, go to Security > Security rules instead and select Go to upgrade your Managed rules.
If you are an Enterprise customer, the dashboard will show the following banner:

If you are a Professional/Business customer, the dashboard will show the following banner:
3. In the upgrade banner, select Review configuration. This banner is only displayed in eligible zones.
4. Review the proposed WAF configuration. You can adjust configuration, like editing the WAF Managed Rules configuration or creating exceptions to skip the execution of rulesets or specific rules.
5. When you are done reviewing, select Deploy to deploy the new WAF Managed Rules configuration.
If you are a Professional/Business customer, Cloudflare will deploy the new WAF configuration and then disable the previous WAF version. The upgrade process may take a couple of minutes.
If you are an Enterprise customer, both WAF implementations will be enabled simultaneously when you select Deploy, so that you can validate your new configuration. Refer to the steps in the next section for additional guidance.

#### Validate your new WAF configuration and finish the upgrade (Enterprise customers only)

If you are an Enterprise customer, after deploying your new WAF configuration both WAF implementations will be enabled simultaneously. During this stage (called validation mode), you can access both implementations of WAF Managed Rules in the Cloudflare dashboard, which will keep showing the upgrade banner until you finish upgrading. The new WAF Managed Rules will run before the previous version.

1. Use the current validation mode to check the behavior of the new WAF configuration in Security Events. For more information, refer to Analyzing the new WAF behavior in Security Events.
2. When you are done reviewing your configuration with both WAFs enabled, select Ready to update in the upgrade banner, and then select Turn off previous version. This operation will complete the upgrade and disable the previous WAF version.

When the upgrade finishes, the dashboard will show all of your upgraded rules in:

- Old dashboard: Security > WAF > Managed rules tab
- New dashboard: Security > Security rules

To check if the upgrade has finished, refresh the dashboard.

Note

The upgrade process can take up to an hour. During this period you may observe security events from both versions of WAF managed rules.

### Using the API

1. Use the Check WAF update compatibility operation to determine if the zone can update to the new WAF, given its current configuration:
Terminal windowcurl "https://api.cloudflare.com/client/v4/zones/{zone_id}/waf_migration/check?phase_two=1" \--header "Authorization: Bearer <API_TOKEN>"
Example response:
{  "result": {    "compatible": true,    "migration_state": "start"  },  "success": true,  "errors": [],  "messages": []}
If the response includes "compatible": true, this means that the zone can update to the new WAF and you can proceed with the upgrade process. If the response includes "compatible": false, this means that your zone is not eligible for the upgrade, given its current configuration. Refer to Eligible zones for details.
2. To get the new WAF configuration corresponding to your current configuration, use the Get new WAF configuration operation:
Terminal windowcurl "https://api.cloudflare.com/client/v4/zones/{zone_id}/waf_migration/config?phase_two=1" \--header "Authorization: Bearer <API_TOKEN>"
Example response:
{  "result": {    "name": "default",    "rules": [      {        "id": "",        "version": "",        "action": "execute",        "expression": "true",        "description": "",        "ref": "",        "enabled": true,        "action_parameters": {          "id": "efb7b8c949ac4650a09736fc376e9aee",          "overrides": {            "rules": [              {                "id": "23ee7cebe6e8443e99ecf932ab579455",                "action": "log",                "enabled": false              }            ]          }        }      }    ]  },  "success": true,  "errors": [],  "messages": []}

The returned configuration in the example above, which would match the existing configuration for the previous WAF version, contains:

- A rule that executes the Cloudflare Managed Ruleset (ruleset ID efb7b8c949ac4650a09736fc376e9aee).
- A single override for the rule Apache Struts - Open Redirect - CVE:CVE-2013-2248 (rule ID 23ee7cebe6e8443e99ecf932ab579455) in the same ruleset, setting the action to log and disabling the rule.

1. (Optional, for Enterprise customers only) If you are upgrading an Enterprise zone to WAF Managed Rules, you can enter validation mode before finishing the upgrade. In this mode, both WAF implementations will be enabled. Use the Update a zone entry point ruleset operation, making sure you include the waf_migration=validation&phase_two=1 query string parameters:
Terminal windowcurl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/phases/http_request_firewall_managed/entrypoint?waf_migration=validation&phase_two=1" \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "name": "default",  "rules": [    {      "action": "execute",      "expression": "true",      "description": "",      "enabled": true,      "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee",        "overrides": {          "rules": [            {              "id": "23ee7cebe6e8443e99ecf932ab579455",              "action": "log",              "enabled": false            }          ]        }      }    }  ]}'
After invoking this API endpoint, both WAF managed rules and WAF Managed Rules will be enabled. Check sampled logs in Security Events for any legitimate traffic getting blocked, and perform any required adjustments to the WAF Managed Rules configuration. For example, you can add an override for a single rule that disables it or changes its action.
2. To finish the upgrade and disable WAF managed rules, set the configuration for the new WAF using the settings you obtained in step 2 and possibly adjusted in step 3. Make sure you include the waf_migration=pending&phase_two=1 query string parameters.
Terminal windowcurl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/phases/http_request_firewall_managed/entrypoint?waf_migration=pending&phase_two=1" \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "name": "default",  "rules": [    {      "id": "",      "version": "",      "action": "execute",      "expression": "true",      "description": "",      "ref": "",      "enabled": true,      "action_parameters": {        "id": "efb7b8c949ac4650a09736fc376e9aee",        "overrides": {          "rules": [            {              "id": "23ee7cebe6e8443e99ecf932ab579455",              "action": "log",              "enabled": false            }          ]        }      }    }  ]}'

Once the provided configuration is saved and the new WAF Managed Rules are enabled, the previous version of the WAF managed rules will be automatically disabled, due to the presence of the waf_migration=pending&phase_two=1 parameters. This will make sure that your zone stays protected by one of the WAF versions during the update process.

Note

Pro and Business customers, which do not have access to the validation mode described in step 3, can update the rules (and overrides) in their zone entry point ruleset without triggering the upgrade by omitting the waf_migration=pending&phase_two=1 parameters. However, all the rules in their configuration must be disabled ("enabled": false). Only Enterprise customers can configure (enabled) rules deploying Managed Rulesets without triggering the upgrade.

## Analyzing the new WAF behavior in Security Events

### For Enterprise customers

If you are an Enterprise customer, use the validation mode of the WAF upgrade process to check the behavior of the new WAF Managed Rules configuration. Cloudflare enables validation mode after you deploy the new WAF configuration. In this mode, the previous WAF version is still enabled, so that you can validate the behavior of your new configuration during the upgrade process. The new WAF Managed Rules will run before the previous version.

Go to sampled logs in Security Events during validation mode and check the following:

- Look for any requests allowed by the new WAF that are being handled by the previous WAF version (for example, by a challenge or block action). If this happens, consider writing a firewall rule or a WAF custom rule to handle the requests you previously identified.
- Look for legitimate requests being blocked by the new WAF. In this situation, edit the WAF managed rule that is blocking these requests, changing the performed action or disabling the rule. For more information, refer to Configure a managed ruleset.

### For Business/Professional customers

Business and Professional customers do not have access to validation mode, which means that they will be able to check the new WAF behavior after they upgrade to the new WAF Managed Rules.

In the days following the upgrade, check sampled logs in Security Events looking for any legitimate requests being blocked by WAF Managed Rules. If you identify any incorrectly blocked requests, adjust the corresponding WAF rule action to Log. For more information on changing the action of a managed ruleset rule, refer to Configure a single rule in a managed ruleset.

Additionally, check for requests that should have been blocked. In this situation, consider creating a firewall rule or a WAF custom rule to block these requests.

## API operations

Upgrading to the new WAF Managed Rules via API requires invoking the following API operations:

| Name | Method + Endpoint | Description |
| --- | --- | --- |
| Check WAFupdate compatibility | GET /zones/<ZONE_ID>/waf_migration/check?phase_two=1 | Checks if the current zone can be updated to the new WAF, given its current configuration. |
| Get new WAFconfiguration | GET /zones/<ZONE_ID>/waf_migration/config?phase_two=1 | Obtains the new WAF Managed Rules configuration that is equivalent to the current configuration (previous version of WAF managed rules). |
| Update zoneentry point ruleset | PUT /zones/<ZONE_ID>/rulesets/ phases/http_request_firewall_managed/entrypoint?waf_migration=<VALUE>&phase_two=1 | Updates the configuration of the zone entry point ruleset for the http_request_firewall_managed phase.Available values for the waf_migration query string parameter:– pending / 1: Defines the new WAF Managed Rules configuration and disables the previous version of WAF managed rules as soon as the provided configuration is saved and the new WAF is enabled.– validation / 2: (Enterprise zones only) Defines the new WAF Managed Rules configuration and enables the new WAF Managed Rules side by side with the previous version, entering validation mode. To exit validation mode and finish the upgrade, invoke the same API endpoint with waf_migration=pending. |
| Get WAF status | GET /zones/<ZONE_ID>/waf_migration/status | Obtains the status of old and new WAF managed rules for a zone (enabled/disabled). The response also includes the current upgrade state (or mode). |

You must prepend the Cloudflare API base URL to the endpoints listed above to obtain the full endpoint:

https://api.cloudflare.com/client/v4

## Possible upgrade errors

Contact Cloudflare Support to get help with the following errors:

- The number of firewall rules to migrate exceeds 200.
- The length of a firewall rule expression is longer than 4 KB.

## Additional resources

### Configuring the new WAF Managed Rules using the Cloudflare API

Instead of using the previous APIs for managing WAF packages, rule groups, and rules, you must now use the Rulesets API to programmatically configure WAF Managed Rules.

You can also create overrides to specify changes to be executed on top of the default WAF Managed Rules configuration. These changes will take precedence over the managed ruleset’s default behavior.

For more information, refer to the following resources:

- Deploy a managed ruleset to a phase at the zone level
- Override a managed ruleset

### Configuring the new WAF Managed Rules using Terraform

Instead of using the previous resources for managing WAF packages, rule groups, and rules, you must now use the cloudflare_ruleset ↗ Terraform resource to configure WAF Managed Rules. For configuration examples, refer to WAF Managed Rules configuration using Terraform.

#### Replace your configuration using cf-terraforming

You can use the cf-terraforming ↗ tool to generate the Terraform configuration for your new WAF Managed Rules configuration after you upgrade. Then, import the new resources to Terraform state.

The recommended steps for replacing your old WAF managed rules configuration in Terraform with a new ruleset-based configuration for the new WAF Managed Rules are the following:

1. Run the following command to generate all ruleset configurations for a zone:
Terminal windowcf-terraforming generate --zone <ZONE_ID> --resource-type "cloudflare_ruleset"
resource "cloudflare_ruleset" "terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31" {  kind    = "zone"  name    = "default"  phase   = "http_request_firewall_managed"  zone_id = "<ZONE_ID>"  rules {    [...]  }  [...]}[...]
2. The previous command may return additional ruleset configurations for other Cloudflare products also based on the Ruleset Engine. Since you are looking for the WAF Managed Rules configuration, keep only the Terraform resource for the http_request_firewall_managed phase and save it to a .tf configuration file. You will need the full resource name in the next step.
3. Import the cloudflare_ruleset resource you previously identified into Terraform state using the terraform import command. For example:
Terminal windowterraform import cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31 zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31
 cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Importing from ID "zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31"... cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Import prepared!   Prepared cloudflare_ruleset for import cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31]
 Import successful!
 The resources that were imported are shown above. These resources are now in your Terraform state and will henceforth be managed by Terraform.
4. Run terraform plan to validate that Terraform now checks the state of the new cloudflare_ruleset resource, in addition to other existing resources already managed by Terraform. For example:
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]cloudflare_waf_package.my_package: Refreshing state... [id=14a2524fd75c419f8d273116815b6349]cloudflare_waf_group.my_group: Refreshing state... [id=0580eb5d92e344ddb2374979f74c3ddf][...]
5. Remove any state related to the previous version of WAF managed rules from your Terraform state:
WarningYou must remove WAF packages, groups, and rules from Terraform state before deleting their configuration from .tf configuration files to prevent issues.


Run the following command to find all resources related to the previous version of WAF managed rules:
Terminal windowterraform state list | grep -E '^cloudflare_waf_(package|group|rule)\.'
cloudflare_waf_package.my_packagecloudflare_waf_group.my_group


Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_waf_package.my_package cloudflare_waf_group.my_group
Would remove cloudflare_waf_package.my_packageWould remove cloudflare_waf_group.my_group


If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_waf_package.my_package cloudflare_waf_group.my_group
Removed cloudflare_waf_package.my_packageRemoved cloudflare_waf_group.my_groupSuccessfully removed 2 resource instance(s).
6. Run the following command to find all resources related to the previous version of WAF managed rules:
Terminal windowterraform state list | grep -E '^cloudflare_waf_(package|group|rule)\.'
cloudflare_waf_package.my_packagecloudflare_waf_group.my_group
7. Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_waf_package.my_package cloudflare_waf_group.my_group
Would remove cloudflare_waf_package.my_packageWould remove cloudflare_waf_group.my_group
8. If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_waf_package.my_package cloudflare_waf_group.my_group
Removed cloudflare_waf_package.my_packageRemoved cloudflare_waf_group.my_groupSuccessfully removed 2 resource instance(s).
9. After removing WAF package, group, and rule resources from Terraform state, delete cloudflare_waf_package, cloudflare_waf_group, and cloudflare_waf_rule resources from .tf configuration files.
10. Run terraform plan to verify that the resources you deleted from configuration files no longer appear. You should not have any pending changes.
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]
No changes. Your infrastructure matches the configuration.
Terraform has compared your real infrastructure against your configuration and found no differences, so no changes are needed.

For details on importing Cloudflare resources to Terraform and using the cf-terraforming tool, refer to the following resources:

- Import Cloudflare resources
- cf-terraforming GitHub repository ↗

## Final remarks

The concept of paranoia level did not exist in the OWASP version (2.x) used in WAF managed rules. Based on the OWASP guide recommendations, the WAF migration process will set the paranoia level of the Cloudflare OWASP Core Ruleset to PL2.

You cannot disable the new version of WAF Managed Rules using Page Rules, since the Web Application Firewall: Off setting in Page Rules only applies to the previous version of WAF managed rules. To disable the new WAF Managed Rules you must configure exceptions (also known as skip rules).

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

## Rate Limiting (previous version)

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/](https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/)

Page options # Rate Limiting (previous version)

Cloudflare Rate Limiting automatically identifies and mitigates excessive request rates for specific URLs or for an entire domain.

Warning

The information in this page refers to the previous version of rate limiting rules, which are billed based on usage.

Cloudflare is upgrading all rate limiting rules to the new version of rate limiting rules. For more information on what changed in the new version, refer to the upgrade guide.

Request rates are calculated locally for individual Cloudflare data centers. The most common uses for Rate Limiting are:

- Protect against DDoS attacks ↗
- Protect against Brute-force attack ↗
- Limit access to forum searches, API calls, or resources that involve database-intensive operations at your origin

Once an individual IPv4 address or IPv6 /64 IP range exceeds a rule threshold, further requests to the origin server are blocked with an HTTP 429 response status code. The response includes a Retry-After header to indicate when the client can resume sending requests.

Note

Are you trying to enable Rate Limiting? Enable Rate Limiting ↗.

### Rate limiting and SEO

Cached resources and known Search Engine crawlers are exempted from your rate limiting rules (previous version only). Therefore, they do not affect your website's SEO ranking.

## Availability

Note

Cloudflare Rate Limiting (previous version) is an add-on service for all customer plans, available in Security > WAF > Rate limiting rules.

The number of allowed rate limiting rules depends on the domain's plan:

| Plan | Rules | Rules matching response headers | Actions | Action Duration | Request Period |
| --- | --- | --- | --- | --- | --- |
| Free | 1 | 1 | Block | 1 minute or 1 hour | 10 seconds or 1 minute |
| Pro | 10 | 1 | Block, Interactive Challenge, JS Challenge, Managed Challenge, or Log | 1 minute or 1 hour | 10 seconds or 1 minute |
| Business | 15 | 10 | Block, Interactive Challenge, JS Challenge, Managed Challenge, or Log | 1 minute, 1 hour, or 24 hours | 10 seconds, 1 minute, or 10 minutes |
| Enterprise | 100 | 10 | Block, Interactive Challenge, JS Challenge, Managed Challenge, or Log | Any duration entered between 10 seconds and 86,400 seconds (24 hours) | Any value entered between 10 seconds and 3,600 seconds (1 hour) |

Cloudflare Rate Limiting supports multiple levels of configuration control depending on the domain’s Cloudflare plan. The table below maps out what you can do based on your plan:

| Order | Task | Available in |
| --- | --- | --- |
| 1 | Configure a basic rate limiting rule | All plans |
| 2 | Configure Advanced Criteria | Business and Enterprise plans |
| 3 | Configure Advanced Response | Business and Enterprise plans |
| 4 | Configure the Bypass option | Enterprise plan |

## Components of a rate limiting rule

A rate limiting rule consists of three distinct components:

- Request matching criteria
- Rate matching criteria
- Rule mitigation

### Request matching criteria

Incoming requests are matched based on request path, request scheme, request method, and (optionally) origin response code.

#### Request path

For example:

- http://example.com/example
- http://example.com/example/*

The request path is case insensitive. Patterns cannot match content after query strings (?) or anchors (#). An asterisk (*) matches any sequence of characters, including an empty sequence. For example:

- *.example.com/* matches any path on any subdomain of example.com.
- *example.com/example.html matches example.html on example.com or any subdomain of example.com.
- * matches any page on your site.

A request for example.com/path is not the same as example.com/path/. The only exception to this rule is the homepage: example.com matches example.com/.

#### Request scheme

HTTP or HTTPS. If none is specified, both are matched, and the rule will list __ALL__.

#### Request method

POST or GET. If none is specified, all methods are matched, and the rule will list __ALL__.

#### (Optional) Origin response code

For example, match a rate limiting rule only when the origin server returns an HTTP 401 or 403 status code. A triggered rule matching the response code criteria blocks subsequent requests from that client regardless of origin response code.

### Rate matching criteria

A rule can match on the number and time period of all requests coming from the same client.

#### Number of requests

Specify a minimum of two requests. For single request blocking, make the path unavailable — for example, configure your origin server to return an HTTP 403 status code.

#### Request period

A rule triggers once a client’s requests exceed the threshold for the specified duration.

### Rule mitigation

Rule mitigations consist of mitigation action and ban duration.

#### Mitigation action

Rate limit actions are based on the domain plan as mentioned in Availability:

- Block: Cloudflare issues an HTTP 429 error when the threshold is exceeded.
- JS Challenge: Visitor must pass a Cloudflare JavaScript Challenge. If passed, Cloudflare allows the request.
- Managed Challenge (recommended): Visitor must pass a challenge dynamically chosen by Cloudflare based on the characteristics of the request. If passed, Cloudflare allows the request.
- Interactive Challenge: Visitor must pass an Interactive Challenge. If passed, Cloudflare allows the request.
- Log: Requests are logged in Cloudflare Logs. This helps test rules before applying to production.

For more information on challenge actions, refer to Cloudflare challenges.

#### Ban duration

Setting a timeout shorter than the threshold causes the API to automatically increase the timeout to equal the threshold.

Visitors hitting a rate limit receive a default HTML page if a custom error page is not specified. In addition, Business and Enterprise customers can specify a response in the rule itself. Refer to Configure Advanced Response for details.

## Identify rate-limit thresholds

To identify a general threshold for Cloudflare Rate Limiting, divide 24 hours of uncached website requests by the unique visitors for the same 24 hours. Then, divide by the estimated average minutes of a visit. Finally, multiply by 4 (or larger) to establish an estimated threshold per minute for your website. A value higher than 4 is fine since most attacks are an order of magnitude above typical traffic rates.

To identify URL rate limits for specific URLs, use 24 hours of uncached requests and unique visitors for the specific URL. Adjust thresholds based on user reports and your own monitoring.

## Task 1: Configure a basic rate limiting rule

The following sections cover two common types of rate limiting rules.

### Enable Protect your login

Rate Limiting features a one-click Protect your login tool that creates a rule to block the client for 15 minutes when sending more than 5 POST requests within 5 minutes. This is sufficient to block most brute-force attempts.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Rate limiting rules.
3. Under Rate Limiting, select Protect your login.
4. Enter Rule Name and Enter your login URL in the Protect your login dialog that appears.
5. Select Save.
6. The Rule Name appears in your Rate Limiting rules list.

### Create a custom rate limiting rule

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF > Rate limiting rules.
3. Select Create rate limiting rule. A dialog opens where you specify the details of your new rule.
4. Enter a descriptive name for the rule in Rule Name.
5. For If Traffic Matching the URL, select an HTTP scheme from the dropdown and enter a URL.
6. In from the same IP address exceeds, enter an integer greater than 1 to represent the number of requests in a sampling period.
7. For requests per, select the sampling period (the period during which requests are counted). Domains on Enterprise plans can enter manually any duration between 10 seconds and 3,600 seconds (one hour).
8. For Then, pick one of the available actions based on your plan. Review the Rule mitigation section for details.
9. If you selected Block or Log, for matching traffic from that visitor for, select how long to apply the option once a threshold has been triggered. Domains on Enterprise plans can enter any value between 10 seconds and 86,400 seconds (24 hours).
10. To activate your new rule, select Save and Deploy.

The new rule appears in the rate limiting rules list.

Note

Any change to a rate limiting rule clears that rule's currently triggered actions. Take care when editing rate limiting rules to mitigate an ongoing attack.

In general, when setting a lower threshold:

1. Leave existing rules in place and add a new rule with the lower threshold.
2. Once the new rule is in place, wait for the action duration of the old rule to pass before deleting the old rule.

When setting a higher threshold (due to legitimate client blocking), increase the threshold within the existing rule.

## Task 2: Configure Advanced Criteria (only Business and Enterprise plans)

The Advanced Criteria option configures which HTTP methods, header responses, and origin response codes to match for your rate limiting rule.

To configure your advanced criteria for a new or existing rule:

1. Expand Advanced Criteria.
2. Select a value from Method(s). The default value is ANY, which matches all HTTP methods.
3. Filter by HTTP Response Header(s). Select Add header response field to include headers returned by your origin web server.
The CF-Cache-Status header appears by default so that Cloudflare serves cached resources rather than rate limit those resources. To also rate limit cached resources, remove this header by selecting X or enable Also apply rate limit to cached assets.
If you have more than one header under HTTP Response Header(s), an AND boolean logic applies. To exclude a header, use the Not Equals option. Each header is case insensitive.
4. Under Origin Response code(s), enter the numerical value of each HTTP response code to match. Separate two or more HTTP codes with a comma (for example: 401, 403).
5. (Optional) Configure additional rate limiting features, based on your plan.
6. Select Save and Deploy.

## Task 3: Configure Advanced Response (only Business and Enterprise plans)

The Advanced Response option configures the information format returned by Cloudflare when a rule's threshold is exceeded. Use Advanced Response when you wish to return static plain text or JSON content.

To configure a plain text or JSON response:

1. Expand Advanced Response.
2. Select a Response type format other than the default: Custom JSON or Custom TEXT.
3. Enter the plain text or JSON response you wish to return. The maximum response size is 32 KB.
4. (Optional) Configure additional rate limiting features, based on your plan.
5. Select Save and Deploy.

### Using a custom HTML page or a redirect

If you wish to display a custom HTML page, configure an custom page for HTTP 429 errors (Too many requests) in the dashboard. Cloudflare will display this page when you select Default Cloudflare Rate Limiting Page in Response type (the default value for the field).

You can use the following method to redirect a rate-limited client to a specific URL:

1. Create an HTML page on your server that will redirect to the final URL of the page you wish to display. Include a meta refresh ↗ tag in the page content, like in the following example:
<!doctype html><html>  <head>    <meta charset="utf-8" />    <title>Custom RL page</title>    <meta      http-equiv="refresh"      content="0; url='https://yourzonename/block'"    />  </head>
  <body></body></html>
Take note of the public URL of the page you created.
2. In the Cloudflare dashboard, go to the Settings page.
  Go to Settings
3. Go to Error Pages.
4. Next to Rate limiting block, select the three dots > Edit.
5. Select Custom page.
6. In Custom page address, enter the URL of the page you created on your server — the page containing the meta refresh tag.
7. Select Save.

Follow the same approach if you wish to return plain text or JSON content but the response is larger than 32 KB. In this case, the redirect URL would be the URL of the plain text or JSON resource you would like to display.

Notes

- Your rate limiting rule must not match the redirect URL you included in the custom HTML page for 429 errors.
- To protect from denial-of-service (DoS) attacks, the page for the redirect should only include resources cached by Cloudflare.

## Task 4: Configure the Bypass option (Enterprise plans only)

Bypass creates an allowlist or exception so that no actions apply to a specific set of URLs even if the rate limit is matched.

To configure Bypass:

1. Expand Bypass.
2. In Bypass rule for these URLs, enter the URL(s) to exempt from the rate limiting rule. Enter each URL on its own line. An HTTP or HTTPS specified in the URL is automatically removed when the rule is saved and instead applies to both HTTP and HTTPS.
3. (Optional) Configure additional rate limiting features, based on your plan.
4. Select Save and Deploy.

## Analytics

View rate limiting analytics in Analytics > Security. Rate Limiting analytics uses solid lines to represent traffic that matches simulated requests and dotted lines to portray actual blocked requests. Logs generated by a rate limiting rule are only visible to Enterprise customers via Cloudflare Logs.

Cloudflare returns an HTTP 429 error for blocked requests. Details on blocked requests per location are provided to Enterprise customers under Status codes in the analytics dashboard available at Analytics > Traffic.

Note

HTTP 429 responses sent to website visitors will include any HTTP 429 responses returned from the origin if the origin server also applies its own rate limiting.

## Order of rule execution

Rate limiting rules are evaluated from the most recently created rule to the oldest rule.

For example, if a request matches the following two rules:

- Rule #1: Matching with test.example.com (created on 2024-03-01)
- Rule #2: Matching with *.example.com* (created on 2024-03-12)

Then rule #2 will trigger first because it was created last.

Additionally, when there is a match and the WAF applies a Log action, it continues evaluating other rate limiting rules, since Log is a non-terminating action. If the WAF applies any other action, no other rules will be evaluated.

## Limitations

Rate Limiting is designed to limit surges in traffic that exceed a user-defined rate. The system is not designed to allow a precise number of requests to reach the origin server. There might be cases where a delay is introduced between detecting the request and updating the internal counter. Because of this delay, which can be up to a few seconds, excess requests could still reach the origin before an action such as blocking or challenging is enforced.

## Related resources

- Troubleshooting Rate Limiting (previous version)
- Configure Rate Limiting via the Cloudflare API

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

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/troubleshooting/](https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/troubleshooting/)

Page options # Troubleshooting

A few common rate limiting configuration issues prevent proper request matches:

- Including HTTP or HTTPS protocol schemes in rule patterns (such as https://example.com/*). To restrict rules to match only HTTP or HTTPS traffic, use the schemes array in the request match. For example, "schemes": [ "HTTPS" ].
- Forgetting a trailing slash character (/). Cloudflare Rate Limiting only treats requests for the homepage (such as example.com and example.com/) as equivalent, but not any other path (such as example.com/path/ and example.com/path). To match request paths both with and without the trailing slash, use a wildcard match (for example, example.com/path*).
- Including a query string or anchor (such as example.com/path?foo=bar or example.com/path#section1). A rule like example.com/path will match requests for example.com/path?foo=bar.
- Overriding a rate limit with IP Access rules.
- Including a port number (such as example.com:8443/api/). Rate Limiting does not consider port numbers within rules. Remove the port number from the URL so that the rate limit rule triggers as expected.

## Common API errors

The following common errors may prevent configuring rate limiting rules via the Cloudflare API:

- Decoding is not yet implemented – Indicates that your request is missing the Content-Type: application/json header. Add the header to your API request to fix the issue.
- Ratelimit.api.not_entitled – Enterprise customers must contact their account team before adding rules.

Note

The origin_traffic parameter can only be set on Enterprise plans. Setting "origin_traffic" = false for a rule on a Free, Pro, or Business domain is automatically converted into "origin_traffic" = true.

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

## Rate limiting (previous version) upgrade

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/upgrade/](https://developers.cloudflare.com/waf/reference/legacy/old-rate-limiting/upgrade/)

Page options # Rate limiting (previous version) upgrade

Cloudflare is upgrading all rate limiting rules created in the previous version to the new version of rate limiting rules.

The Cloudflare dashboard will now show all your rate limiting rules in a single list.

Deprecation notice

The Rate Limiting API and the cloudflare_rate_limit ↗ Terraform resource for the previous version of rate limiting rules are now deprecated.

This API and Terraform resource are no longer supported since 2025-06-15. You must use the Rulesets API and the cloudflare_ruleset ↗ Terraform resource to configure rate limiting rules.

## Main differences

- Billing model: The previous version of Rate Limiting was billed based on usage and it was available as an add-on on all plans, while the new version is included in Cloudflare plans. For Enterprise plans, Rate Limiting is priced based on total contracted HTTP traffic. The new rate limiting rules offer all the capabilities available on the previous version of rate limiting along with several additional features.
- Advanced scope expressions: The previous version of Rate Limiting allowed you to scope the rules based on a single path and method of the request. In the new version, you can write rules similar to WAF custom rules, combining multiple parameters of the HTTP request.
- Separate counting and mitigation expressions: In the new version of Rate Limiting, counting and mitigation expressions are separate (for Business and Enterprise customers). The counting expression defines which requests are used to compute the rate. The mitigation expression defines which requests are mitigated once the threshold has been reached. Using these separate expressions, you can track the rate of requests on a specific path such as /login and, when an IP exceeds the threshold, block every request from the same IP addressed at your domain.
- Additional counting dimensions (Advanced Rate Limiting only): Like in the previous version of Rate Limiting, customers with the new Rate Limiting get IP-based rate limiting, where Cloudflare counts requests based on the source IP address of incoming requests. In addition to IP-based rate limiting, customers with the new Rate Limiting who subscribe to Advanced Rate Limiting can group requests based on other characteristics, such as the value of API keys, cookies, session headers, ASN, query parameters, or a specific JSON body field. Refer to Rate limiting best practices for examples.
- Number of rules per plan: Besides the exact features per Cloudflare plan, the number of rules per plan is different in the new version of Rate Limiting (for information on the new version limits, refer to Rate limiting rules):


























ProductFreeProBusinessEnterprise with RL add-on, or equivalent planRate Limiting (previous version)11015100Rate Limiting (new version)125100
Enterprise customers must have application security on their contract to get access to rate limiting rules.
Refer to Important remarks about the upgrade for details on how Cloudflare will adjust your rules quota, if needed, after the upgrade.

For more details on the differences between old and new rate limiting rules, refer to our blog post ↗.

## Important remarks about the upgrade

- After the upgrade, you will not be able to create or edit rate limiting rules while you are above the new rules quota for your Cloudflare plan. The number of rate limiting rules included in your Cloudflare plan can be lower than before. If you are over the new limit, you will need to either upgrade to a plan that gives you more rules, or delete existing rules until the number of rules is less or equal to the new maximum number of rules for your plan.
- Custom timeouts will be rounded to the nearest supported timeout. Both custom counting periods and custom mitigation timeouts will be rounded up or down to the nearest counting period and mitigation timeout supported in the new version (refer to Availability for details on the available values per plan).
For example, if you had a rate limiting rule with a mitigation timeout of 55 seconds, this timeout will be rounded up to one minute (nearest value).
Enterprise customers will be able to set a custom mitigation timeout for a rule after the upgrade, but this configuration is only available via API.
- Customers on a Business plan (or higher) will have access to the IP with NAT support characteristic. This characteristic is used to handle situations such as requests under NAT sharing the same IP address.

### Relevant changes in the dashboard

If you had access to the previous version of Cloudflare Rate Limiting, you will now find all rate limiting rules in the same list in Security > WAF > Rate limiting rules.
Rate limiting rules created in the previous version are tagged with Previous version in the Cloudflare dashboard.

If you are using the new application security dashboard, only the rate limiting rules that have been upgraded to the new version will be shown at Security > Security rules.

If you edit a rule with this tag in the dashboard, you will no longer be able to edit the rule using the API and Terraform resource for the previous version of rate limiting rules. In this case, you will need to start using the Rulesets API or the cloudflare_ruleset ↗ Terraform resource for this purpose. Refer to Relevant changes for API users and Relevant changes for Terraform users for more information.

### Relevant changes for API users

The previous Rate Limiting API is deprecated. The API is no longer supported since 2025-06-15. You must update any automation based on the previous Rate Limiting API to the Rulesets API to prevent any issues.

The new rate limiting rules are based on the Ruleset Engine. To configure these rate limiting rules via the API you must use the Rulesets API. Since rate limiting rules created in the previous version were upgraded to the new version, this API will also return these rules created in the new version.

The Rulesets API is the only API that allows you to create, edit, and delete any rate limiting rule, regardless of the implementation version where you created the rule. The previous Rate Limiting API will only work with rate limiting rules created in the previous version that you have not edited in the dashboard or modified through the new API/Terraform resource since they were upgraded to the new version.

Until the API sunset date, you can use the previous Rate Limiting API to create, edit, and delete rate limiting rules created in the previous version (which Cloudflare upgraded to the new version). However, if you use the Rulesets API to edit a rule created in the previous version, or if you change such a rule in the Cloudflare dashboard – including changing the rule order – you will no longer be able to manage this rule (upgraded from the previous version and then updated using the Rulesets API) using the old API operations. In this case, you will need to completely switch to the Rulesets API for managing this specific rule.

### Relevant changes for Terraform users

The cloudflare_rate_limit Terraform resource is deprecated. The resource is no longer supported since 2025-06-15. You must manually update your rate limiting configuration in Terraform from cloudflare_rate_limit ↗ resources to cloudflare_ruleset ↗ resources to prevent any issues.

The new rate limiting rules are based on the Ruleset Engine. To configure these rate limiting rules with Terraform you must use the cloudflare_ruleset Terraform resource.

The cloudflare_ruleset ↗ Terraform resource is the only resource that allows you to create, edit, and delete any rate limiting rule, regardless of the implementation version where you created the rule. The cloudflare_rate_limit Terraform resource will only work with rate limiting rules created in the previous version that you have not edited in the dashboard or modified through the new API/Terraform resource since they were upgraded to the new version.

Until the sunset date for the cloudflare_rate_limit Terraform resource, you can use this resource to create, edit, and delete rate limiting rules created in the previous version (which Cloudflare upgraded to the new version). However, if you start using the cloudflare_ruleset Terraform resource to manage a rule created in the previous version, or if you edit such a rule in the Cloudflare dashboard – including changing the rule order – you will no longer be able to manage this rule (upgraded from the previous version and then updated using the new resource) using the old Terraform resource. In this case, you will need to completely switch to the cloudflare_ruleset Terraform resource for managing this specific rule.

Refer to the Terraform documentation for examples of configuring the new rate limiting rules using Terraform.

### Replace your configuration with cf-terraforming

You can use the cf-terraforming ↗ tool to generate your new Terraform configuration for rate limiting rules created in the previous version. Then, you can import the new resources to Terraform state.

The recommended steps for replacing your old rate limiting configuration in Terraform with a new ruleset configuration are the following.

1. Run the following command to generate all ruleset configurations for a zone:
Terminal windowcf-terraforming generate --zone <ZONE_ID> --resource-type "cloudflare_ruleset"
resource "cloudflare_ruleset" "terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31" {  kind    = "zone"  name    = "default"  phase   = "http_ratelimit"  zone_id = "<ZONE_ID>"  rules {    # (...)  }  # (...)}# (...)
2. The previous command may return additional ruleset configurations for other Cloudflare products also based on the Ruleset Engine. Since you are updating your rate limiting rules configuration, keep only the Terraform resource for the http_ratelimit phase and save it to a .tf configuration file. You will need the full resource name in the next step.
3. Import the cloudflare_ruleset resource you previously identified into Terraform state using the terraform import command. For example:
Terminal windowterraform import cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31 zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Importing from ID "zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31"...cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Import prepared!  Prepared cloudflare_ruleset for importcloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31]
Import successful!
The resources that were imported are shown above. These resources are now inyour Terraform state and will henceforth be managed by Terraform.
4. Run terraform plan to validate that Terraform now checks the state of the new cloudflare_ruleset resource, in addition to other existing resources already managed by Terraform. For example:
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]cloudflare_rate_limit.my_rate_limiting_rules: Refreshing state... [id=0580eb5d92e344ddb2374979f74c3ddf][...]
5. Remove any state related to rate limiting rules configured through the old cloudflare_rate_limit resource from your Terraform state:
ImportantYou must remove rate limiting rules configured through the cloudflare_rate_limit resource from Terraform state before deleting their configuration from .tf configuration files to prevent issues.


Run the following command to find all resources related to rate limiting rules (previous version):
Terminal windowterraform state list | grep -E '^cloudflare_rate_limit\.'
cloudflare_rate_limit.my_rate_limiting_rules


Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_rate_limit.my_rate_limiting_rules
Would remove cloudflare_rate_limit.my_rate_limiting_rules


If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_rate_limit.my_rate_limiting_rules
Removed cloudflare_rate_limit.my_rate_limiting_rulesSuccessfully removed 1 resource instance(s).
6. Run the following command to find all resources related to rate limiting rules (previous version):
Terminal windowterraform state list | grep -E '^cloudflare_rate_limit\.'
cloudflare_rate_limit.my_rate_limiting_rules
7. Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_rate_limit.my_rate_limiting_rules
Would remove cloudflare_rate_limit.my_rate_limiting_rules
8. If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_rate_limit.my_rate_limiting_rules
Removed cloudflare_rate_limit.my_rate_limiting_rulesSuccessfully removed 1 resource instance(s).
9. After removing cloudflare_rate_limit resources from Terraform state, delete all these resources from .tf configuration files.
10. Run terraform plan to verify that the resources you deleted from configuration files no longer appear. You should not have any pending changes.
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]
No changes. Your infrastructure matches the configuration.
Terraform has compared your real infrastructure against your configuration and found no differences, so no changes are needed.

For details on importing Cloudflare resources to Terraform and using the cf-terraforming tool, refer to the following resources:

- Import Cloudflare resources
- cf-terraforming GitHub repository ↗

## More resources

For more information on the new rate limiting implementation, including the available features in each Cloudflare plan, refer to Rate limiting rules.

Cloudflare also offers an Advanced version of Rate Limiting, which is available to Enterprise customers. For more information, refer to the Introducing Advanced Rate Limiting ↗ blog post.

To learn more about what you can do with the new rate limiting, refer to Rate limiting best practices.

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

## Firewall rules upgrade

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/firewall-rules-upgrade/](https://developers.cloudflare.com/waf/reference/legacy/firewall-rules-upgrade/)

Page options # Firewall rules upgrade

Cloudflare upgraded existing firewall rules into custom rules. With custom rules, you get the same level of protection and a few additional features. Custom rules are available in the Cloudflare dashboard in the following location:

- Old dashboard: Security > WAF > Custom rules.
- New security dashboard: Security > Security rules.

Deprecation notice

Cloudflare Firewall Rules is now deprecated. The Firewall Rules API and Filters API, as well as the cloudflare_firewall_rule and cloudflare_filter Terraform resources, are no longer supported since 2025-06-15. If you have any automation based on these APIs and resources, you must migrate to the new APIs and resources to avoid any issues.

If you have not upgraded to WAF custom rules yet, you may have some invalid configuration that prevents the upgrade from happening. In this case, contact your account team to get help with the upgrade to WAF custom rules.

## Main differences

The main differences between firewall rules and WAF custom rules are the following:

- Improved response for Block action
- Different error page for blocked requests
- New Skip action replacing both Allow and Bypass actions
- Custom rules are evaluated in order
- Logs and events
- New API and Terraform resources

### Improved response for Block action

In WAF custom rules you can customize the response of the Block action.

The default block response is a Cloudflare standard HTML page. If you need to send a custom response for Block actions, configure the custom rule to return a fixed response with a custom response code (403, by default) and a custom body (HTML, JSON, XML, or plain text).

To define a custom response for a single rule, go to Security > WAF > Custom rules ↗, edit the custom rule, and fill in the block-related options.

Note

Custom block response configurations are not returned by the Firewall Rules API. You must use the Rulesets API to manage this new feature.

### Different error page for blocked requests

Requests blocked by a firewall rule with a Block action would get a Cloudflare 1020 error code response. Cloudflare users could customize this error page for a zone in Error Pages > 1000 class errors.

Requests blocked by a WAF custom rule will get a different response: the WAF block response. To customize the default block response, you can either:

- Define a custom WAF block response for your entire zone in Error Pages ↗ > WAF block. This error page will always have an HTML content type.
- Define a custom response for requests blocked by a specific WAF custom rule. This custom response supports other content types besides HTML.

If you have customized your 1XXX error page in Error Pages for requests blocked by firewall rules, you will need to create a new response page for blocked requests using one of the above methods.

For more information on Error Pages, refer to Custom Errors.

### New Skip action replacing both Allow and Bypass actions

Firewall Rules supported the Allow and Bypass actions, often used together. These actions were commonly used for handling known legitimate requests — for example, requests coming from trusted IP addresses.

When a request triggered Allow, all remaining firewall rules were not evaluated, effectively allowing the request to continue to the next security product. The Bypass action was designed to specify which security products (such as WAF managed rules, rate limiting rules, and User Agent Blocking) should not run on the request triggering the action.

With Firewall Rules, if you wanted to stop running all security products for a given request, you would create two rules:

- One rule with Bypass action (selecting all security products).
- One rule with Allow action (to stop executing other firewall rules).

The requirement of having two rules to address this common scenario no longer applies to WAF custom rules. You should now use the Skip action, which combines the Allow and Bypass actions. The Skip action fully replaces the Allow and Bypass actions, which are not supported in WAF custom rules.

With the Skip action you can do the following:

- Stop running all the remaining custom rules (equivalent to the Allow action)
- Avoid running other security products (equivalent to the Bypass action)
- A combination of the above.

You can also select whether you want to log events matching the custom rule with the Skip action or not. This is especially useful when creating a positive security model to avoid logging large amounts of legitimate traffic.

Note

The Firewall Rules API does not support the Skip action. When you create a custom rule with Skip action, it is translated to Allow and Bypass in the Firewall Rules API. You must use the Rulesets API to fully use the new Skip action functionality.

### Custom rules are evaluated in order

Firewall rules actions had a specific order of precedence when using priority ordering. In contrast, custom rules actions do not have such an order. Custom rules are always evaluated in order, and some actions like Block will stop the evaluation of other rules.

For example, if you were using priority ordering and had the following firewall rules with the same priority both matching an incoming request:

- Firewall rule #1 — Priority: 2 / Action: Block
- Firewall rule #2 — Priority: 2 / Action: Allow

The request would be allowed, since the Allow action in Firewall Rules would have precedence over the Block action.

In contrast, if you create two custom rules where both rules match an incoming request:

- Custom rule #1 — Action: Block
- Custom rule #2 — Action: Skip (configured to skip all remaining custom rules)

The request would be blocked, since custom rules are evaluated in order and the Block action will stop the evaluation of other rules.

Note

For the custom rules converted from your existing firewall rules, Cloudflare will preserve your current order of execution.

### Logs and events

Events logged by custom rules are shown in Security Events with Custom Rules as their source.

You may still find events generated by Firewall Rules in the Security Events page when you select a time frame including the days when the transition to custom rules occurred. Similarly, you may still find events with both Skip and Allow actions in the same view during the transition period.

### New API and Terraform resources

The preferred API for managing WAF custom rules is the Rulesets API. The Rulesets API is used on all recent Cloudflare security products to provide a uniform user experience when interacting with our API. For more information on migrating to the Rulesets API, refer to Relevant changes for API users.

The Firewall Rules API and Filters API are no longer supported since 2025-06-15. There is now a single list of rules for both firewall rules and WAF custom rules, and this list contains WAF custom rules. Thanks to an internal conversion process, the Firewall Rules API and Filters API return firewall rules/filters converted from these WAF custom rules until the APIs sunset date.

If you are using Terraform, you must update your configuration to use cloudflare_ruleset ↗ resources with the http_request_firewall_custom phase to manage custom rules. For more information on updating your Terraform configuration, refer to Relevant changes for Terraform users.

## Relevant changes for dashboard users

The Firewall Rules tab in the Cloudflare dashboard is now deprecated. Firewall rules are displayed as custom rules in the Cloudflare dashboard.

For users that have access to both products, the Firewall rules tab is only available in the old dashboard in Security > WAF.

## Relevant changes for API users

The Firewall Rules API and the associated Cloudflare Filters API are now deprecated. These APIs are no longer supported since 2025-06-15. You must manually update any automation based on the Firewall Rules API or Cloudflare Filters API to the Rulesets API to prevent any issues. Rule IDs are different between firewall rules and custom rules, which may affect automated processes dealing with specific rule IDs.

Before the APIs sunset date, Cloudflare will internally convert your Firewall Rules API and Filters API calls into the corresponding Rulesets API calls. The converted API calls between the Firewall Rules API/Filters API and the Rulesets API appear in audit logs as generated by Cloudflare and not by the actual user making the requests. There will be a single list of rules for both firewall rules and WAF custom rules.

Some new features of WAF custom rules, like custom responses for blocked requests and the Skip action, are not supported in the Firewall Rules API. To take advantage of these features, Cloudflare recommends that you use the custom rules page in the Cloudflare dashboard or the Rulesets API.

Refer to the WAF documentation for examples of managing WAF custom rules using the Rulesets API.

## Relevant changes for Terraform users

The following Terraform resources from the Cloudflare provider are now deprecated:

- cloudflare_firewall_rule ↗
- cloudflare_filter ↗

These resources are no longer supported since 2025-06-15. If you are using these resources to manage your Firewall Rules configuration, you must manually update any Terraform configuration to cloudflare_ruleset ↗ resources to prevent any issues.

There will be a single list of rules for both firewall rules and WAF custom rules.

Some new features of WAF custom rules are not supported in the deprecated Terraform resources. To take advantage of these features, Cloudflare recommends that you use the cloudflare_ruleset resource.

Refer to the documentation about Terraform for examples of configuring WAF custom rules using Terraform.

### Replace your configuration using cf-terraforming

You can use the cf-terraforming ↗ tool to generate the Terraform configuration for your current WAF custom rules (converted by Cloudflare from your firewall rules). Then, import the new resources to Terraform state.

The recommended steps for replacing your firewall rules (and filters) configuration in Terraform with a new ruleset configuration are the following.

1. Run the following command to generate all ruleset configurations for a zone:
Terminal windowcf-terraforming generate --zone <ZONE_ID> --resource-type "cloudflare_ruleset"
resource "cloudflare_ruleset" "terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31" {  kind    = "zone"  name    = "default"  phase   = "http_request_firewall_custom"  zone_id = "<ZONE_ID>"  rules {    [...]  }  [...]}[...]
2. The previous command may return additional ruleset configurations for other Cloudflare products also based on the Ruleset Engine. Since you are migrating firewall rules to custom rules, keep only the Terraform resource for the http_request_firewall_custom phase and save it to a .tf configuration file. You will need the full resource name in the next step.
3. Import the cloudflare_ruleset resource you previously identified into Terraform state using the terraform import command. For example:
Terminal windowterraform import cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31 zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Importing from ID "zone/<ZONE_ID>/3c0b456bc2aa443089c5f40f45f51b31"...cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Import prepared!  Prepared cloudflare_ruleset for importcloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31]
Import successful!
The resources that were imported are shown above. These resources are now inyour Terraform state and will henceforth be managed by Terraform.
4. Run terraform plan to validate that Terraform now checks the state of the new cloudflare_ruleset resource, in addition to other existing resources already managed by Terraform. For example:
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]cloudflare_filter.my_filter: Refreshing state... [id=14a2524fd75c419f8d273116815b6349]cloudflare_firewall_rule.my_firewall_rule: Refreshing state... [id=0580eb5d92e344ddb2374979f74c3ddf][...]
5. Remove any state related to firewall rules and filters from your Terraform state:
WarningYou must remove firewall rules and filters from Terraform state before deleting their configuration from .tf configuration files to prevent issues.


Run the following command to find all resources related to firewall rules and filters:
Terminal windowterraform state list | grep -E '^cloudflare_(filter|firewall_rule)\.'
cloudflare_filter.my_filtercloudflare_firewall_rule.my_firewall_rule


Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_filter.my_filter cloudflare_firewall_rule.my_firewall_rule
Would remove cloudflare_filter.my_filterWould remove cloudflare_firewall_rule.my_firewall_rule


If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_filter.my_filter cloudflare_firewall_rule.my_firewall_rule
Removed cloudflare_filter.my_filterRemoved cloudflare_firewall_rule.my_firewall_ruleSuccessfully removed 2 resource instance(s).
6. Run the following command to find all resources related to firewall rules and filters:
Terminal windowterraform state list | grep -E '^cloudflare_(filter|firewall_rule)\.'
cloudflare_filter.my_filtercloudflare_firewall_rule.my_firewall_rule
7. Run the terraform state rm ... command in dry-run mode to understand the impact of removing those resources without performing any changes:
Terminal windowterraform state rm -dry-run cloudflare_filter.my_filter cloudflare_firewall_rule.my_firewall_rule
Would remove cloudflare_filter.my_filterWould remove cloudflare_firewall_rule.my_firewall_rule
8. If the impact looks correct, run the same command without the -dry-run parameter to actually remove the resources from Terraform state:
Terminal windowterraform state rm cloudflare_filter.my_filter cloudflare_firewall_rule.my_firewall_rule
Removed cloudflare_filter.my_filterRemoved cloudflare_firewall_rule.my_firewall_ruleSuccessfully removed 2 resource instance(s).
9. After removing firewall rules and filters resources from Terraform state, delete cloudflare_filter and cloudflare_firewall_rule resources from .tf configuration files.
10. Run terraform plan to verify that the resources you deleted from configuration files no longer appear. You should not have any pending changes.
Terminal windowterraform plan
cloudflare_ruleset.terraform_managed_resource_3c0b456bc2aa443089c5f40f45f51b31: Refreshing state... [id=3c0b456bc2aa443089c5f40f45f51b31][...]
No changes. Your infrastructure matches the configuration.
Terraform has compared your real infrastructure against your configuration and found no differences, so no changes are needed.

For details on importing Cloudflare resources to Terraform and using the cf-terraforming tool, refer to the following resources:

- Import Cloudflare resources
- cf-terraforming GitHub repository ↗

## Final remarks

Any unpaused firewall rules with paused filters will become enabled when converted to custom rules.

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

## Glossary

**來源**: [https://developers.cloudflare.com/waf/glossary/](https://developers.cloudflare.com/waf/glossary/)

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

## Changelog

**來源**: [https://developers.cloudflare.com/waf/change-log/](https://developers.cloudflare.com/waf/change-log/)

Page options # Changelog

The WAF changelog provides information about changes to managed rulesets and general updates to WAF protection.

## Changelog for managed rulesets

Cloudflare has a regular cadence of releasing updates and new rules to WAF managed rulesets. The updates either improve a rule's accuracy, lower false positives rates, or increase the protection due to a change in the threat landscape.

The release cycle for new rules happens on a 7-day cycle, typically every Monday or Tuesday depending on public holidays. For existing rule updates, Cloudflare will initially deploy the updated rule as a BETA rule (denoted in rule description) and with a BETA tag, before updating the original rule on the next release cycle. Cloudflare will deploy the updated or new rules into logging only mode (Log action), with BETA and New tags. Essentially, any newly created rules will carry both the BETA and New tags. Logging only mode allows you to identify any increases in security event volumes which look like potential false positives. On the following Monday (or Tuesday) the rules will change from logging only mode to the intended default action (New Action column in the changelog table), with the BETA and New tags removed.

Cloudflare is very proactive in responding to new vulnerabilities, which may need to be released outside of the 7-day cycle, defined as an Emergency Release.

Warning

Ruleset overrides and tag overrides apply to existing and future rules in the managed ruleset, which includes changes in regular and emergency releases.

If you do notice a new or updated rule generating an increased volume of security events, you can disable or change the rule from its Default action. Once you change a rule to use an action other than the default one, Cloudflare will not be able to override the rule action.

View scheduled changes

Subscribe to RSS ## General updates

For more general updates to the WAF, refer to general updates.

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

## General updates

**來源**: [https://developers.cloudflare.com/waf/change-log/general-updates/](https://developers.cloudflare.com/waf/change-log/general-updates/)

Page options # General updates

Subscribe to RSS ## 2025-09-04

WAF Release - 2025-09-04 - Emergency This week's update

This week, new critical vulnerabilities were disclosed in Sitecore’s Sitecore Experience Manager (XM), Sitecore Experience Platform (XP), specifically versions 9.0 through 9.3, and 10.0 through 10.4.
These flaws are caused by unsafe data deserialization and code reflection, leaving affected systems at high risk of exploitation.

Key Findings

- CVE-2025-53690: Remote Code Execution through Insecure Deserialization
- CVE-2025-53691: Remote Code Execution through Insecure Deserialization
- CVE-2025-53693: HTML Cache Poisoning through Unsafe Reflections

Impact

Exploitation could allow attackers to execute arbitrary code remotely on the affected system and conduct cache poisoning attacks, potentially leading to further compromise. Applying the latest vendor-released solution without delay is strongly recommended.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...0ee2c15e | 100878 | Sitecore - Remote Code Execution - CVE:CVE-2025-53691 | N/A | Block | This is a new detection |
| Cloudflare Managed Ruleset | ...7c5b669c | 100631 | Sitecore - Cache Poisoning - CVE:CVE-2025-53693 | N/A | Block | This is a new detection |
| Cloudflare Managed Ruleset | ...6c410240 | 100879 | Sitecore - Remote Code Execution - CVE:CVE-2025-53690 | N/A | Block | This is a new detection |

## 2025-09-01

WAF Release - 2025-09-01 This week's update

This week, a critical vulnerability was disclosed in Fortinet FortiWeb (versions 7.6.3 and below, versions 7.4.7 and below, versions 7.2.10 and below, and versions 7.0.10 and below), linked to improper parameter handling that could allow unauthorized access.

Key Findings

- Fortinet FortiWeb (CVE-2025-52970): A vulnerability may allow an unauthenticated remote attacker with access to non-public information to log in as any existing user on the device via a specially crafted request.

Impact

Exploitation could allow an unauthenticated attacker to impersonate any existing user on the device, potentially enabling them to modify system settings or exfiltrate sensitive information, posing a serious security risk. Upgrading to the latest vendor-released version is strongly recommended.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...c49b7cf8 | 100586 | Fortinet FortiWeb - Auth Bypass - CVE:CVE-2025-52970 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...790c9dde | 100136C | XSS - JavaScript - Headers and Body | N/A | N/A | Rule metadata description refined. Detection unchanged. |

## 2025-08-29

WAF Release - 2025-08-29 - Emergency This week's update

This week, new critical vulnerabilities were disclosed in Next.js’s image optimization functionality, exposing a broad range of production environments to risks of data exposure and cache manipulation.

Key Findings

- CVE-2025-55173: Arbitrary file download from the server via image optimization.
- CVE-2025-57752: Cache poisoning leading to unauthorized data disclosure.

Impact

Exploitation could expose sensitive files, leak user or backend data, and undermine application trust. Given Next.js’s wide use, immediate patching and cache hardening are strongly advised.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...9ff4bfe3 | 100613 | Next.js - Dangerous File Download - CVE:CVE-2025-55173 | N/A | Block | This is a new detection |
| Cloudflare Managed Ruleset | ...69b9ea7d | 100616 | Next.js - Information Disclosure - CVE:CVE-2025-57752 | N/A | Block | This is a new detection |

## 2025-08-25

WAF Release - 2025-08-25 This week's update

This week, critical vulnerabilities were disclosed that impact widely used open-source infrastructure, creating high-risk scenarios for code execution and operational disruption.

Key Findings

- Apache HTTP Server – Code Execution (CVE-2024-38474): A flaw in Apache HTTP Server allows attackers to achieve remote code execution, enabling full compromise of affected servers. This vulnerability threatens the confidentiality, integrity, and availability of critical web services.
- Laravel (CVE-2024-55661): A security flaw in Laravel introduces the potential for remote code execution under specific conditions. Exploitation could provide attackers with unauthorized access to application logic and sensitive backend data.

Impact

These vulnerabilities pose severe risks to enterprise environments and open-source ecosystems. Remote code execution enables attackers to gain deep system access, steal data, disrupt services, and establish persistent footholds for broader intrusions. Given the widespread deployment of Apache HTTP Server and Laravel in production systems, timely patching and mitigation are critical.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...28050359 | 100822_BETA | WordPress:Plugin:WPBookit - Remote Code Execution - CVE:CVE-2025-6058 | N/A | Disabled | This was merged in to the original rule "WordPress:Plugin:WPBookit - Remote Code Execution - CVE:CVE-2025-6058" (ID:    ...194f7b2d     ) |
| Cloudflare Managed Ruleset | ...3bdcdbad | 100831 | Apache HTTP Server - Code Execution - CVE:CVE-2024-38474 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...02eaac5b | 100846 | Laravel - Remote Code Execution - CVE:CVE-2024-55661 | Log | Disabled | This is a New Detection |

## 2025-08-22

WAF Release - 2025-08-22 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...5fcca5c8 | 100850 | Command Injection - Generic 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...744305c4 | 100851 | Remote Code Execution - Java Deserialization | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...2b083459 | 100852 | Command Injection - Generic 3 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...efb7e5b9 | 100853 | Remote Code Execution - Common Bash Bypass Beta | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...78513ad7 | 100854 | XSS - Generic JavaScript | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...e9a5daac | 100855 | Command Injection - Generic 4 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...480f6093 | 100856 | PHP Object Injection | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...d4ae0a33 | 100857 | Generic - Parameter Fuzzing | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...1121ee45 | 100858 | Code Injection - Generic 4 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...20de01e3 | 100859 | SQLi - UNION - 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...c0177e21 | 100860 | Command Injection - Generic 5 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...85f4d7b3 | 100861 | Command Execution - Generic | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...3fa8ee7f | 100862 | GraphQL Injection - 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...c7a41d4b | 100863 | Command Injection - Generic 6 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...65e3c165 | 100864 | Code Injection - Generic 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...161aafdc | 100865 | PHP Object Injection - 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...1cc3c3f8 | 100866 | SQLi - LIKE 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...48ac2221 | 100867 | SQLi - DROP - 2 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...1f4eec13 | 100868 | Code Injection - Generic 3 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...2755f99e | 100869 | Command Injection - Generic 7 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...413592e2 | 100870 | Command Injection - Generic 8 | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...d2dd41b5 | 100871 | SQLi - LIKE 3 | N/A | Disabled | This is a New Detection |

## 2025-08-18

WAF Release - 2025-08-18 This week's update

This week, a series of critical vulnerabilities were discovered impacting core enterprise and open-source infrastructure. These flaws present a range of risks, providing attackers with distinct pathways for remote code execution, methods to breach internal network boundaries, and opportunities for critical data exposure and operational disruption.

Key Findings

- SonicWall SMA (CVE-2025-32819, CVE-2025-32820, CVE-2025-32821): A remote authenticated attacker with SSLVPN user privileges can bypass path traversal protections. These vulnerabilities enable a attacker to bypass security checks to read, modify, or delete arbitrary files. An attacker with administrative privileges can escalate this further, using a command injection flaw to upload malicious files, which could ultimately force the appliance to reboot to its factory default settings.
- Ms-Swift Project (CVE-2025-50460): An unsafe deserialization vulnerability exists in the Ms-Swift project's handling of YAML configuration files. If an attacker can control the content of a configuration file passed to the application, they can embed a malicious payload that will execute arbitrary code and it can be executed during deserialization.
- Apache Druid (CVE-2023-25194): This vulnerability in Apache Druid allows an attacker to cause the server to connect to a malicious LDAP server. By sending a specially crafted LDAP response, the attacker can trigger an unrestricted deserialization of untrusted data. If specific "gadgets" (classes that can be abused) are present in the server's classpath, this can be escalated to achieve Remote Code Execution (RCE).
- Tenda AC8v4 (CVE-2025-51087, CVE-2025-51088): Vulnerabilities allow an authenticated attacker to trigger a stack-based buffer overflow. By sending malformed arguments in a request to specific endpoints, an attacker can crash the device or potentially achieve arbitrary code execution.
- Open WebUI (CVE-2024-7959): This vulnerability allows a user to change the OpenAI URL endpoint to an arbitrary internal network address without proper validation. This flaw can be exploited to access internal services or cloud metadata endpoints, potentially leading to remote command execution if the attacker can retrieve instance secrets or access sensitive internal APIs.
- BentoML (CVE-2025-54381): The vulnerability exists in the serialization/deserialization handlers for multipart form data and JSON requests, which automatically download files from user-provided URLs without proper validation of internal network addresses. This allows attackers to fetch from unintended internal services, including cloud metadata and localhost.
- Adobe Experience Manager Forms (CVE-2025-54254): An Improper Restriction of XML External Entity Reference ('XXE') vulnerability that could lead to arbitrary file system read in Adobe AEM (≤6.5.23).

Impact

These vulnerabilities affect core infrastructure, from network security appliances like SonicWall to data platforms such as Apache Druid and ML frameworks like BentoML. The code execution and deserialization flaws are particularly severe, offering deep system access that allows attackers to steal data, disrupt services, and establish a foothold for broader intrusions. Simultaneously, SSRF and XXE vulnerabilities undermine network boundaries, exposing sensitive internal data and creating pathways for lateral movement. Beyond data-centric threats, flaws in edge devices like the Tenda router introduce the tangible risk of operational disruption, highlighting a multi-faceted threat to the security and stability of key enterprise systems.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...418d9a3b | 100574 | SonicWall SMA - Remote Code Execution - CVE:CVE-2025-32819, CVE:CVE-2025-32820, CVE:CVE-2025-32821 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...1e6fefdb | 100576 | Ms-Swift Project - Remote Code Execution - CVE:CVE-2025-50460 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...08ac45b3 | 100585 | Apache Druid - Remote Code Execution - CVE:CVE-2023-25194 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...e4855472 | 100834 | Tenda AC8v4 - Auth Bypass - CVE:CVE-2025-51087, CVE:CVE-2025-51088 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...022ab542 | 100835 | Open WebUI - SSRF - CVE:CVE-2024-7959 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...6339f132 | 100837 | SQLi - OOB | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...b83d2625 | 100841 | BentoML - SSRF - CVE:CVE-2025-54381 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...739180d2 | 100841A | BentoML - SSRF - CVE:CVE-2025-54381 - 2 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...6ab910c2 | 100841B | BentoML - SSRF - CVE:CVE-2025-54381 - 3 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...2197ec51 | 100845 | Adobe Experience Manager Forms - XSS - CVE:CVE-2025-54254 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...96f34ce3 | 100845A | Adobe Experience Manager Forms - XSS - CVE:CVE-2025-54254 - 2 | Log | Block | This is a New Detection |

## 2025-08-11

WAF Release - 2025-08-11 This week's update focuses on a wide range of enterprise software, from network infrastructure and security platforms to content management systems and development frameworks. Flaws include unsafe deserialization, OS command injection, SSRF, authentication bypass, and arbitrary file upload — many of which allow unauthenticated remote code execution. Notable risks include Cisco Identity Services Engine and Ivanti EPMM, where successful exploitation could grant attackers full administrative control of core network infrastructure and popular web services such as WordPress, SharePoint, and Ingress-Nginx, where security bypasses and arbitrary file uploads could lead to complete site or server compromise.

Key Findings

- Cisco Identity Services Engine (CVE-2025-20281): Insufficient input validation in a specific API of Cisco Identity Services Engine (ISE) and ISE-PIC allows an unauthenticated, remote attacker to execute arbitrary code with root privileges on an affected device.
- Wazuh Server (CVE-2025-24016): An unsafe deserialization vulnerability in Wazuh Server (versions 4.4.0 to 4.9.0) allows for remote code execution and privilege escalation. By injecting unsanitized data, an attacker can trigger an exception to execute arbitrary code on the server.
- CrushFTP (CVE-2025-54309): A flaw in AS2 validation within CrushFTP allows remote attackers to gain administrative access via HTTPS on systems not using the DMZ proxy feature. This flaw can lead to unauthorized file access and potential system compromise.
- Kentico Xperience CMS (CVE-2025-2747, CVE-2025-2748): Vulnerabilities in Kentico Xperience CMS could enable cross-site scripting (XSS), allowing attackers to inject malicious scripts into web pages. Additionally, a flaw could allow unauthenticated attackers to bypass the Staging Sync Server's authentication, potentially leading to administrative control over the CMS.
- Node.js (CVE-2025-27210): An incomplete fix for a previous vulnerability (CVE-2025-23084) in Node.js affects the path.join() API method on Windows systems. The vulnerability can be triggered using reserved Windows device names such as CON, PRN, or AUX.
- WordPress:Plugin:Simple File List (CVE-2025-34085, CVE-2020-36847):
This vulnerability in the Simple File List plugin for WordPress allows an unauthenticated remote attacker to upload arbitrary files to a vulnerable site. This can be exploited to achieve remote code execution on the server.
(Note: CVE-2025-34085 has been rejected as a duplicate.)
- GeoServer (CVE-2024-29198): A Server-Side Request Forgery (SSRF) vulnerability exists in GeoServer's Demo request endpoint, which can be exploited where the Proxy Base URL has not been configured.
- Ivanti EPMM (CVE-2025-6771): An OS command injection vulnerability in Ivanti Endpoint Manager Mobile (EPMM) before versions 12.5.0.2, 12.4.0.3, and 12.3.0.3 allows a remote, authenticated attacker with high privileges to execute arbitrary code.
- Microsoft SharePoint (CVE-2024-38018): This is a remote code execution vulnerability affecting Microsoft SharePoint Server.
- Manager-IO (CVE-2025-54122): A critical unauthenticated full read Server-Side Request Forgery (SSRF) vulnerability is present in the proxy handler of both Manager Desktop and Server editions up to version 25.7.18.2519. This allows an unauthenticated attacker to bypass network isolation and access internal services.
- Ingress-Nginx (CVE-2025-1974): A vulnerability in the Ingress-Nginx controller for Kubernetes allows an attacker to bypass access control rules. An unauthenticated attacker with access to the pod network can achieve arbitrary code execution in the context of the ingress-nginx controller.
- PaperCut NG/MF (CVE-2023-2533): A Cross-Site Request Forgery (CSRF) vulnerability has been identified in PaperCut NG/MF. Under specific conditions, an attacker could exploit this to alter security settings or execute arbitrary code if they can deceive an administrator with an active login session into clicking a malicious link.
- SonicWall SMA (CVE-2025-40598): This vulnerability could allow an unauthenticated attacker to bypass security controls. This allows a remote, unauthenticated attacker to potentially execute arbitrary JavaScript code.
- WordPress (CVE-2025-5394): The "Alone – Charity Multipurpose Non-profit WordPress Theme" for WordPress  is vulnerable to arbitrary file uploads. A missing capability check allows unauthenticated attackers to upload ZIP files containing webshells disguised as plugins, leading to remote code execution.

Impact

These vulnerabilities span a broad range of enterprise technologies, including network access control systems, monitoring platforms, web servers, CMS platforms, cloud services, and collaboration tools. Exploitation techniques range from remote code execution and command injection to authentication bypass, SQL injection, path traversal, and configuration weaknesses.

A critical flaw in perimeter devices like Ivanti EPMM or SonicWall SMA could allow an unauthenticated attacker to gain remote code execution, completely breaching the primary network defense. A separate vulnerability within Cisco's Identity Services Engine could then be exploited to bypass network segmentation, granting an attacker widespread internal access. Insecure deserialization issues in platforms like Wazuh Server and CrushFTP could then be used to run malicious payloads or steal sensitive files from administrative consoles. Weaknesses in web delivery controllers like Ingress-Nginx or popular content management systems such as WordPress, SharePoint, and Kentico Xperience create vectors to bypass security controls, exfiltrate confidential data, or fully compromise servers.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...51bc8df1 | 100538 | GeoServer - SSRF - CVE:CVE-2024-29198 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...c9e0b290 | 100548 | Ivanti EPMM - Remote Code Execution - CVE:CVE-2025-6771 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...ad93cda8 | 100550 | Microsoft SharePoint - Remote Code Execution - CVE:CVE-2024-38018 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...1dca5738 | 100562 | Manager-IO - SSRF - CVE:CVE-2025-54122 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...2e9137e1 | 100565 | Cisco Identity Services Engine - Remote Code Execution -
CVE:CVE-2025-20281 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5d8102e1 | 100567 | Ingress-Nginx - Remote Code Execution - CVE:CVE-2025-1974 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...99105c43 | 100569 | PaperCut NG/MF - Remote Code Execution - CVE:CVE-2023-2533 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...2c81dc88 | 100571 | SonicWall SMA - XSS - CVE:CVE-2025-40598 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...926c96d4 | 100573 | WordPress - Dangerous File Upload - CVE:CVE-2025-5394 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...40ec2fda | 100806 | Wazuh Server - Remote Code Execution - CVE:CVE-2025-24016 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...2401fa3b | 100824 | CrushFTP - Remote Code Execution - CVE:CVE-2025-54309 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...74920ace | 100824A | CrushFTP - Remote Code Execution - CVE:CVE-2025-54309 - 2 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...c7e63549 | 100825 | AMI MegaRAC - Auth Bypass - CVE:CVE-2024-54085 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...b79037e6 | 100826 | Kentico Xperience CMS - Auth Bypass - CVE:CVE-2025-2747 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...caf261aa | 100827 | Kentico Xperience CMS - XSS - CVE:CVE-2025-2748 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...6f1c2d12 | 100828 | Node.js - Directory Traversal - CVE:CVE-2025-27210 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0341fccc | 100829 | WordPress:Plugin:Simple File List - Remote Code Execution -
CVE:CVE-2025-34085 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...4cefeeda | 100829A | WordPress:Plugin:Simple File List - Remote Code Execution -
CVE:CVE-2025-34085 - 2 | Log | Disabled | This is a New Detection |

## 2025-08-07

WAF Release - 2025-08-07 - Emergency This week’s highlight focuses on two critical vulnerabilities affecting key infrastructure and enterprise content management platforms. Both flaws present significant remote code execution risks that can be exploited with minimal or no user interaction.

Key Findings

- Squid (≤6.3) — CVE-2025-54574: A heap buffer overflow occurs when processing Uniform Resource Names (URNs). This vulnerability may allow remote attackers to execute arbitrary code on the server. The issue has been resolved in version 6.4.
- Adobe AEM (≤6.5.23) — CVE-2025-54253: Due to a misconfiguration, attackers can achieve remote code execution without requiring any user interaction, posing a severe threat to affected deployments.

Impact

Both vulnerabilities expose critical attack vectors that can lead to full server compromise. The Squid heap buffer overflow allows remote code execution by crafting malicious URNs, which can lead to server takeover or denial of service. Given Squid’s widespread use as a caching proxy, this flaw could be exploited to disrupt network traffic or gain footholds inside secure environments.

Adobe AEM’s remote code execution vulnerability enables attackers to run arbitrary code on the content management server without any user involvement. This puts sensitive content, application integrity, and the underlying infrastructure at extreme risk. Exploitation could lead to data theft, defacement, or persistent backdoor installation.

These findings reinforce the urgency of updating to the patched versions — Squid 6.4 and Adobe AEM 6.5.24 or later — and reviewing configurations to prevent exploitation.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...ef7e015b | 100844 | Adobe Experience Manager Forms - Remote Code Execution - CVE:CVE-2025-54253 | N/A | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...baec057a | 100840 | Squid - Buffer Overflow - CVE:CVE-2025-54574 | N/A | Block | This is a New Detection |

## 2025-08-04

WAF Release - 2025-08-04 This week's highlight focuses on a series of significant vulnerabilities identified across widely adopted web platforms, from enterprise-grade CMS to essential backend administration tools. The findings reveal multiple vectors for attack, including critical flaws that allow for full server compromise and others that enable targeted attacks against users.

Key Findings

- Sitecore (CVE-2025-34509, CVE-2025-34510, CVE-2025-34511): A hardcoded credential allows remote attackers to access administrative APIs. Once authenticated, they can exploit an additional vulnerability to upload arbitrary files, leading to remote code execution.
- Grafana (CVE-2025-4123): A cross-site scripting (XSS) vulnerability allows an attacker to redirect users to a malicious website, which can then execute arbitrary JavaScript in the victim's browser.
- LaRecipe (CVE-2025-53833): Through Server-Side Template Injection, attackers can execute arbitrary commands on the server, potentially access sensitive environment variables, and escalate access depending on server configuration.
- CentOS WebPanel (CVE-2025-48703): A command injection vulnerability could allow a remote attacker to execute arbitrary commands on the server.
- WordPress (CVE-2023-5561): This vulnerability allows unauthenticated attackers to determine the email addresses of users who have published public posts on an affected website.
- WordPress Plugin - WPBookit (CVE-2025-6058): A missing file type validation allows unauthenticated attackers to upload arbitrary files to the server, creating the potential for remote code execution.
- WordPress Theme - Motors (CVE-2025-4322): Due to improper identity validation, an unauthenticated attacker can change the passwords of arbitrary users, including administrators, to gain access to their accounts.

Impact

These vulnerabilities pose a multi-layered threat to widely adopted web technologies, ranging from enterprise-grade platforms like Sitecore to everyday solutions such as WordPress, and backend tools like CentOS WebPanel. The most severe risks originate in remote code execution (RCE) flaws found in Sitecore, CentOS WebPanel, LaRecipe, and the WPBookit plugin. These allow attackers to bypass security controls and gain deep access to the server, enabling them to steal sensitive data, deface websites, install persistent malware, or use the compromised server as a launchpad for further attacks.

The privilege escalation vulnerability is the Motors theme, which allows for a complete administrative account takeover on WordPress sites. This effectively hands control of the application to an attacker, who can then manipulate content, exfiltrate user data, and alter site functionality without needing to breach the server itself.

The Grafana cross-site scripting (XSS) flaw can be used to hijack authenticated user sessions or steal credentials, turning a trusted user's browser into an attack vector.

Meanwhile, the information disclosure flaw in WordPress core provides attackers with valid user emails, fueling targeted phishing campaigns that aim to secure the same account access achievable through the other exploits.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...52f30a13 | 100535A | Sitecore - Dangerous File Upload - CVE:CVE-2025-34510, CVE:CVE-2025-34511 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5045a97f | 100535 | Sitecore - Information Disclosure - CVE:CVE-2025-34509 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...579cd3e0 | 100543 | Grafana - Directory Traversal - CVE:CVE-2025-4123 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0cbd9abc | 100545 | WordPress - Information Disclosure - CVE:CVE-2023-5561 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...8f634977 | 100820 | CentOS WebPanel - Remote Code Execution - CVE:CVE-2025-48703 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...82ae64c1 | 100821 | LaRecipe - SSTI - CVE:CVE-2025-53833 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...194f7b2d | 100822 | WordPress:Plugin:WPBookit - Remote Code Execution - CVE:CVE-2025-6058 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0bf1b661 | 100823 | WordPress:Theme:Motors - Privilege Escalation - CVE:CVE-2025-4322 | Log | Block | This is a New Detection |

## 2025-07-28

WAF Release - 2025-07-28 This week’s update spotlights several vulnerabilities across Apache Tomcat, MongoDB, and Fortinet FortiWeb. Several flaws related with a memory leak in Apache Tomcat can lead to a denial-of-service attack. Additionally, a code injection flaw in MongoDB's Mongoose library allows attackers to bypass security controls to access restricted data.

Key Findings

- Fortinet FortiWeb (CVE-2025-25257): An improper neutralization of special elements used in a SQL command vulnerability in Fortinet FortiWeb versions allows an unauthenticated attacker to execute unauthorized SQL code or commands.
- Apache Tomcat (CVE-2025-31650): A improper Input Validation vulnerability in Apache Tomcat that could create memory leak when incorrect error handling for some invalid HTTP priority headers resulted in incomplete clean-up of the failed request.
- MongoDB (CVE-2024-53900, CVE:CVE-2025-23061): Improper use of $where in match and a nested $where filter with a populate() match in Mongoose can lead to search injection.

Impact

These vulnerabilities target user-facing components, web application servers, and back-end databases. A SQL injection flaw in Fortinet FortiWeb can lead to data theft or system compromise. A separate issue in Apache Tomcat involves a memory leak from improper input validation, which could be exploited for a denial-of-service (DoS) attack. Finally, a vulnerability in MongoDB's Mongoose library allows attackers to bypass security filters and access unauthorized data through malicious search queries.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...3461ec9e | 100804 | BerriAI - SSRF - CVE:CVE-2024-6587 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...0cb13e1d | 100812 | Fortinet FortiWeb - Remote Code Execution - CVE:CVE-2025-25257 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...67fae7f7 | 100813 | Apache Tomcat - DoS - CVE:CVE-2025-31650 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...4b6a5bb1 | 100815 | MongoDB - Remote Code Execution - CVE:CVE-2024-53900, CVE:CVE-2025-23061 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...688f8e79 | 100816 | MongoDB - Remote Code Execution - CVE:CVE-2024-53900, CVE:CVE-2025-23061 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...194f7b2d | 100822 | WordPress:Plugin:WPBookit - Remote Code Execution - CVE:CVE-2025-6058 | Log | Block | This is a New Detection |

## 2025-07-21

WAF Release - 2025-07-21 - Emergency This week's update highlights several high-impact vulnerabilities affecting Microsoft SharePoint Server. These flaws, involving unsafe deserialization, allow unauthenticated remote code execution over the network, posing a critical threat to enterprise environments relying on SharePoint for collaboration and document management.

Key Findings

- Microsoft SharePoint Server (CVE-2025-53770): A critical vulnerability involving unsafe deserialization of untrusted data, enabling unauthenticated remote code execution over the network. This flaw allows attackers to execute arbitrary code on vulnerable SharePoint servers without user interaction.
- Microsoft SharePoint Server (CVE-2025-53771): A closely related deserialization issue that can be exploited by unauthenticated attackers, potentially leading to full system compromise. The vulnerability highlights continued risks around insecure serialization logic in enterprise collaboration platforms.

Impact

Together, these vulnerabilities significantly weaken the security posture of on-premise Microsoft SharePoint Server deployments. By enabling remote code execution without authentication, they open the door for attackers to gain persistent access, deploy malware, and move laterally across enterprise environments.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...2168f6f0 | 100817 | Microsoft SharePoint - Deserialization - CVE:CVE-2025-53770 | N/A | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...8de656c4 | 100818 | Microsoft SharePoint - Deserialization - CVE:CVE-2025-53771 | N/A | Block | This is a New Detection |

For more details, also refer to our blog ↗.

## 2025-07-21

WAF Release - 2025-07-21 This week's update spotlights several critical vulnerabilities across Citrix NetScaler Memory Disclosure, FTP servers and network application. Several flaws enable unauthenticated remote code execution or sensitive data exposure, posing a significant risk to enterprise security.

Key Findings

- Wing FTP Server (CVE-2025-47812): A critical Remote Code Execution (RCE) vulnerability that enables unauthenticated attackers to execute arbitrary code with root/SYSTEM-level privileges by exploiting a Lua injection flaw.
- Infoblox NetMRI (CVE-2025-32813): A remote unauthenticated command injection flaw that allows an attacker to execute arbitrary commands, potentially leading to unauthorized access.
- Citrix Netscaler ADC (CVE-2025-5777, CVE-2023-4966): A sensitive information disclosure vulnerability, also known as "Citrix Bleed2", that allows the disclosure of memory and subsequent remote access session hijacking.
- Akamai CloudTest (CVE-2025-49493): An XML External Entity (XXE) injection that could lead to read local files on the system by manipulating XML input.

Impact

These vulnerabilities affect critical enterprise infrastructure, from file transfer services and network management appliances to application delivery controllers. The Wing FTP RCE and Infoblox command injection flaws offer direct paths to deep system compromise, while the Citrix "Bleed2" and Akamai XXE vulnerabilities undermine system integrity by enabling session hijacking and sensitive data theft.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...3461ec9e | 100804 | BerriAI - SSRF - CVE:CVE-2024-6587 | Log | Log | This is a New Detection |
| Cloudflare Managed Ruleset | ...5199b58a | 100805 | Wing FTP Server - Remote Code Execution - CVE:CVE-2025-47812 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...919a91a4 | 100807 | Infoblox NetMRI - Command Injection - CVE:CVE-2025-32813 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...7899130f | 100808 | Citrix Netscaler ADC - Buffer Error - CVE:CVE-2025-5777 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...d1cf8e08 | 100809 | Citrix Netscaler ADC - Information Disclosure - CVE:CVE-2023-4966 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...6e70469f | 100810 | Akamai CloudTest - XXE - CVE:CVE-2025-49493 | Log | Block | This is a New Detection |

## 2025-07-14

WAF Release - 2025-07-14 This week’s vulnerability analysis highlights emerging web application threats that exploit modern JavaScript behavior and SQL parsing ambiguities. Attackers continue to refine techniques such as attribute overloading and obfuscated logic manipulation to evade detection and compromise front-end and back-end systems.

Key Findings

- XSS – Attribute Overloading: A novel cross-site scripting technique where attackers abuse custom or non-standard HTML attributes to smuggle payloads into the DOM. These payloads evade traditional sanitization logic, especially in frameworks that loosely validate attributes or trust unknown tokens.
- XSS – onToggle Event Abuse: Exploits the lesser-used onToggle event (triggered by elements like <details>) to execute arbitrary JavaScript when users interact with UI elements. This vector is often overlooked by static analyzers and can be embedded in seemingly benign components.
- SQLi – Obfuscated Boolean Logic: An advanced SQL injection variant that uses non-standard Boolean expressions, comment-based obfuscation, or alternate encodings (for example, /*!true*/, AND/**/1=1) to bypass basic input validation and WAF signatures. This technique is particularly dangerous in dynamic query construction contexts.

Impact

These vulnerabilities target both user-facing components and back-end databases, introducing potential vectors for credential theft, session hijacking, or full data exfiltration. The XSS variants bypass conventional filters through overlooked HTML behaviors, while the obfuscated SQLi enables attackers to stealthily probe back-end logic, making them especially difficult to detect and block.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...2aa3d845 | 100798 | XSS - Attribute Overloading | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...37548d06 | 100799 | XSS - OnToggle | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5563445f | 100800 | SQLi - Obfuscated Boolean | Log | Block | This is a New Detection |

## 2025-07-07

Increased IP List Limits for Enterprise Accounts We have significantly increased the limits for IP Lists on Enterprise plans to provide greater flexibility and control:

- Total number of lists: Increased from 10 to 1,000.
- Total number of list items: Increased from 10,000 to 500,000.

Limits for other list types and plans remain unchanged. For more details, refer to the lists availability.

## 2025-07-07

WAF Release - 2025-07-07 This week’s roundup uncovers critical vulnerabilities affecting enterprise VoIP systems, webmail platforms, and a popular JavaScript framework. The risks range from authentication bypass to remote code execution (RCE) and buffer handling flaws, each offering attackers a path to elevate access or fully compromise systems.

Key Findings

- Next.js - Auth Bypass: A newly detected authentication bypass flaw in the Next.js framework allows attackers to access protected routes or APIs without proper authorization, undermining application access controls.
- Fortinet FortiVoice (CVE-2025-32756): A buffer error vulnerability in FortiVoice systems that could lead to memory corruption and potential code execution or service disruption in enterprise telephony environments.
- Roundcube (CVE-2025-49113): A critical RCE flaw allowing unauthenticated attackers to execute arbitrary PHP code via crafted requests, leading to full compromise of mail servers and user inboxes.

Impact

These vulnerabilities affect core business infrastructure, from web interfaces to voice communications and email platforms. The Roundcube RCE and FortiVoice buffer flaw offer potential for deep system access, while the Next.js auth bypass undermines trust boundaries in modern web apps.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...7eb35ee6 | 100795 | Next.js - Auth Bypass | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...c329aeb0 | 100796 | Fortinet FortiVoice - Buffer Error - CVE:CVE-2025-32756 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...ab314023 | 100797 | Roundcube - Remote Code Execution - CVE:CVE-2025-49113 | Log | Disabled | This is a New Detection |

## 2025-06-16

WAF Release - 2025-06-16 This week’s roundup highlights multiple critical vulnerabilities across popular web frameworks, plugins, and enterprise platforms. The focus lies on remote code execution (RCE), server-side request forgery (SSRF), and insecure file upload vectors that enable full system compromise or data exfiltration.

Key Findings

- Cisco IOS XE (CVE-2025-20188): Critical RCE vulnerability enabling unauthenticated attackers to execute arbitrary commands on network infrastructure devices, risking total router compromise.
- Axios (CVE-2024-39338): SSRF flaw impacting server-side request control, allowing attackers to manipulate internal service requests when misconfigured with unsanitized user input.
- vBulletin (CVE-2025-48827, CVE-2025-48828): Two high-impact RCE flaws enabling attackers to remotely execute PHP code, compromising forum installations and underlying web servers.
- Invision Community (CVE-2025-47916): A critical RCE vulnerability allowing authenticated attackers to run arbitrary code in community platforms, threatening data and lateral movement risk.
- CrushFTP (CVE-2025-32102, CVE-2025-32103): SSRF vulnerabilities in upload endpoint processing permit attackers to pivot internal network scans and abuse internal services.
- Roundcube (CVE-2025-49113): RCE via email processing enables attackers to execute code upon viewing a crafted email — particularly dangerous for webmail deployments.
- WooCommerce WordPress Plugin (CVE-2025-47577): Dangerous file upload vulnerability permits unauthenticated users to upload executable payloads, leading to full WordPress site takeover.
- Cross-Site Scripting (XSS) Detection Improvements: Enhanced detection patterns.

Impact

These vulnerabilities span core systems — from routers to e-commerce to email. RCE in Cisco IOS XE, Roundcube, and vBulletin poses full system compromise. SSRF in Axios and CrushFTP supports internal pivoting, while WooCommerce’s file upload bug opens doors to mass WordPress exploitation.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...35fefd53 | 100783 | Cisco IOS XE - Remote Code Execution - CVE:CVE-2025-20188 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...8332af5d | 100784 | Axios - SSRF - CVE:CVE-2024-39338 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...2e1648d2 | 100785 | vBulletin - Remote Code Execution - CVE:CVE-2025-48827,
CVE:CVE-2025-48828 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0edcf1ef | 100786 | Invision Community - Remote Code Execution - CVE:CVE-2025-47916 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...d6f5eb48 | 100791 | CrushFTP - SSRF - CVE:CVE-2025-32102, CVE:CVE-2025-32103 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...30baa18a | 100792 | Roundcube - Remote Code Execution - CVE:CVE-2025-49113 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...229ba236 | 100793 | XSS - Ontoggle | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...fa338296 | 100794 | WordPress WooCommerce Plugin - Dangerous File Upload -
CVE:CVE-2025-47577 | Log | Block | This is a New Detection |

## 2025-06-09

WAF Release - 2025-06-09 This week’s update spotlights four critical vulnerabilities across CMS platforms, VoIP systems, and enterprise applications. Several flaws enable remote code execution or privilege escalation, posing significant enterprise risks.

Key Findings

- WordPress OttoKit Plugin (CVE-2025-27007): Privilege escalation flaw allows unauthenticated attackers to create or elevate user accounts, compromising WordPress administrative control.
- SAP NetWeaver (CVE-2025-42999): Remote Code Execution vulnerability enables attackers to execute arbitrary code on SAP NetWeaver systems, threatening core ERP and business operations.
- Fortinet FortiVoice (CVE-2025-32756): Buffer error vulnerability may lead to memory corruption and potential code execution, directly impacting enterprise VoIP infrastructure.
- Camaleon CMS (CVE-2024-46986): Remote Code Execution vulnerability allows attackers to gain full control over Camaleon CMS installations, exposing hosted content and underlying servers.

Impact

These vulnerabilities target widely deployed CMS, ERP, and VoIP systems. RCE flaws in SAP NetWeaver and Camaleon CMS allow full takeover of business-critical applications. Privilege escalation in OttoKit exposes WordPress environments to full administrative compromise. FortiVoice buffer handling issues risk destabilizing or fully compromising enterprise telephony systems.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...0debd86e | 100769 | WordPress OttoKit Plugin - Privilege Escalation - CVE:CVE-2025-27007 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5f57b448 | 100770 | SAP NetWeaver - Remote Code Execution - CVE:CVE-2025-42999 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...4df8857a | 100779 | Fortinet FortiVoice - Buffer Error - CVE:CVE-2025-32756 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...3b840107 | 100780 | Camaleon CMS - Remote Code Execution - CVE:CVE-2024-46986 | Log | Block | This is a New Detection |

## 2025-06-02

WAF Release - 2025-06-02 This week’s roundup highlights five high-risk vulnerabilities affecting SD-WAN, load balancers, and AI platforms. Several flaws enable unauthenticated remote code execution or authentication bypass.

Key Findings

- Versa Concerto SD-WAN (CVE-2025-34026, CVE-2025-34027): Authentication bypass vulnerabilities allow attackers to gain unauthorized access to SD-WAN management interfaces, compromising network segmentation and control.
- Kemp LoadMaster (CVE-2024-7591): Remote Code Execution vulnerability enables attackers to execute arbitrary commands, potentially leading to full device compromise within enterprise load balancing environments.
- AnythingLLM (CVE-2024-0759): Server-Side Request Forgery (SSRF) flaw allows external attackers to force the LLM backend to make unauthorized internal network requests, potentially exposing sensitive internal resources.
- Anyscale Ray (CVE-2023-48022): Remote Code Execution vulnerability affecting distributed AI workloads, allowing attackers to execute arbitrary code on Ray cluster nodes.
- Server-Side Request Forgery (SSRF) - Generic & Obfuscated Payloads: Ongoing advancements in SSRF payload techniques observed, including obfuscation and expanded targeting of cloud metadata services and internal IP ranges.

Impact

These vulnerabilities expose critical infrastructure across networking, AI platforms, and SaaS integrations. Unauthenticated RCE and auth bypass flaws in Versa Concerto, Kemp LoadMaster, and Anyscale Ray allow full system compromise. AnythingLLM and SSRF payload variants expand attack surfaces into internal cloud resources, sensitive APIs, and metadata services, increasing risk of privilege escalation, data theft, and persistent access.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...39b52f02 | 100764 | Versa Concerto SD-WAN - Auth Bypass - CVE:CVE-2025-34027 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...a34edb97 | 100765 | Versa Concerto SD-WAN - Auth Bypass - CVE:CVE-2025-34026 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0d99b2db | 100766 | Kemp LoadMaster - Remote Code Execution - CVE:CVE-2024-7591 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...95aa3a4f | 100767 | AnythingLLM - SSRF - CVE:CVE-2024-0759 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...840a0966 | 100768 | Anyscale Ray - Remote Code Execution - CVE:CVE-2023-48022 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...9d16ee18 | 100781 | SSRF - Generic Payloads | N/A | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...5c963d9d | 100782 | SSRF - Obfuscated Payloads | N/A | Disabled | This is a New Detection |

## 2025-05-28

Updated attack score model We have deployed an updated attack score model focused on enhancing the detection of multiple false positives (FPs).

As a result of this improvement, some changes in observed attack scores are expected.

## 2025-05-27

WAF Release - 2025-05-27 This week’s roundup covers nine vulnerabilities, including six critical RCEs and one dangerous file upload. Affected platforms span cloud services, CI/CD pipelines, CMSs, and enterprise backup systems. Several are now addressed by updated WAF managed rulesets.

Key Findings

- Ingress-Nginx (CVE-2025-1098): Unauthenticated RCE via unsafe annotation handling. Impacts Kubernetes clusters.
- GitHub Actions (CVE-2025-30066): RCE through malicious workflow inputs. Targets CI/CD pipelines.
- Craft CMS (CVE-2025-32432): Template injection enables unauthenticated RCE. High risk to content-heavy sites.
- F5 BIG-IP (CVE-2025-31644): RCE via TMUI exploit, allowing full system compromise.
- AJ-Report (CVE-2024-15077): RCE through untrusted template execution. Affects reporting dashboards.
- NAKIVO Backup (CVE-2024-48248): RCE via insecure script injection. High-value target for ransomware.
- SAP NetWeaver (CVE-2025-31324): Dangerous file upload flaw enables remote shell deployment.
- Ivanti EPMM (CVE-2025-4428, 4427): Auth bypass allows full access to mobile device management.
- Vercel (CVE-2025-32421): Information leak via misconfigured APIs. Useful for attacker recon.

Impact

These vulnerabilities expose critical components across Kubernetes, CI/CD pipelines, and enterprise systems to severe threats including unauthenticated remote code execution, authentication bypass, and information leaks. High-impact flaws in Ingress-Nginx, Craft CMS, F5 BIG-IP, and NAKIVO Backup enable full system compromise, while SAP NetWeaver and AJ-Report allow remote shell deployment and template-based attacks. Ivanti EPMM’s auth bypass further risks unauthorized control over mobile device fleets.

GitHub Actions and Vercel introduce supply chain and reconnaissance risks, allowing malicious workflow inputs and data exposure that aid in targeted exploitation. Organizations should prioritize immediate patching, enhance monitoring, and deploy updated WAF and IDS signatures to defend against likely active exploitation.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...d127592a | 100746 | Vercel - Information Disclosure | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...95442495 | 100754 | AJ-Report - Remote Code Execution - CVE:CVE-2024-15077 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...dfee7ae4 | 100756 | NAKIVO Backup - Remote Code Execution - CVE:CVE-2024-48248 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...1c52f6d0 | 100757 | Ingress-Nginx - Remote Code Execution - CVE:CVE-2025-1098 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...95442495 | 100759 | SAP NetWeaver - Dangerous File Upload - CVE:CVE-2025-31324 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5366ccc1 | 100760 | Craft CMS - Remote Code Execution - CVE:CVE-2025-32432 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...eb40686b | 100761 | GitHub Action - Remote Code Execution - CVE:CVE-2025-30066 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...60fc041c | 100762 | Ivanti EPMM - Auth Bypass - CVE:CVE-2025-4428, CVE:CVE-2025-4427 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...ebafdfe6 | 100763 | F5 Big IP - Remote Code Execution - CVE:CVE-2025-31644 | Log | Disabled | This is a New Detection |

## 2025-05-19

WAF Release - 2025-05-19 This week's analysis covers four vulnerabilities, with three rated critical due to their Remote Code Execution (RCE) potential. One targets a high-traffic frontend platform, while another targets a popular content management system. These detections are now part of the Cloudflare Managed Ruleset in Block mode.

Key Findings

- Commvault Command Center (CVE-2025-34028) exposes an unauthenticated RCE via insecure command injection paths in the web UI. This is critical due to its use in enterprise backup environments.
- BentoML (CVE-2025-27520) reveals an exploitable vector where serialized payloads in model deployment APIs can lead to arbitrary command execution. This targets modern AI/ML infrastructure.
- Craft CMS (CVE-2024-56145) allows RCE through template injection in unauthenticated endpoints. It poses a significant risk for content-heavy websites with plugin extensions.
- Apache HTTP Server (CVE-2024-38475) discloses sensitive server config data due to misconfigured
mod_proxy behavior. While not RCE, this is useful for pre-attack recon.

Impact

These newly detected vulnerabilities introduce critical risk across modern web stacks, AI infrastructure, and content platforms: unauthenticated RCEs in Commvault, BentoML, and Craft CMS enable full system compromise with minimal attacker effort.

Apache HTTPD information leak can support targeted reconnaissance, increasing the success rate of follow-up exploits. Organizations using these platforms should prioritize patching and monitor for indicators of exploitation using updated WAF detection rules.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...75129820 | 100745 | Apache HTTP Server - Information Disclosure - CVE:CVE-2024-38475 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...26a517f1 | 100747 | Commvault Command Center - Remote Code Execution - CVE:CVE-2025-34028 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...d7619ccb | 100749 | BentoML - Remote Code Execution - CVE:CVE-2025-27520 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...f15bfda4 | 100753 | Craft CMS - Remote Code Execution - CVE:CVE-2024-56145 | Log | Block | This is a New Detection |

## 2025-05-08

Improved Payload Logging for WAF Managed Rules We have upgraded WAF Payload Logging to enhance rule diagnostics and usability:

- Targeted logging: Logs now capture only the specific portions of requests that triggered WAF rules, rather than entire request segments.
- Visual highlighting: Matched content is visually highlighted in the UI for faster identification.
- Enhanced context: Logs now include surrounding context to make diagnostics more effective.

Payload Logging is available to all Enterprise customers. If you have not used Payload Logging before, check how you can get started.

Note: The structure of the encrypted_matched_data field in Logpush has changed from Map<Field, Value> to Map<Field, {Before: bytes, Content: Value, After: bytes}>. If you rely on this field in your Logpush jobs, you should review and update your processing logic accordingly.

## 2025-05-05

WAF Release - 2025-05-05 This week's analysis covers five CVEs with varying impact levels. Four are rated critical, while one is rated high severity. Remote Code Execution vulnerabilities dominate this set.

Key Findings

GFI KerioControl (CVE-2024-52875) contains an unauthenticated Remote Code Execution (RCE) vulnerability that targets firewall appliances. This vulnerability can let attackers gain root level system access, making this CVE particularly attractive for threat actors.

The SonicWall SMA vulnerabilities remain concerning due to their continued exploitation since 2021. These critical vulnerabilities in remote access solutions create dangerous entry points to networks.

Impact

Customers using the Managed Ruleset will receive rule coverage following this week's release. Below is a breakdown of the recommended prioritization based on current exploitation trends:

- GFI KerioControl (CVE-2024-52875) - Highest priority; unauthenticated RCE
- SonicWall SMA (Multiple vulnerabilities) - Critical for network appliances
- XWiki (CVE-2025-24893) - High priority for development environments
- Langflow (CVE-2025-3248) - Important for AI workflow platforms
- MinIO (CVE-2025-31489) - Important for object storage implementations

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...d0b7a392 | 100724 | GFI KerioControl - Remote Code Execution - CVE:CVE-2024-52875 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...717a9e42 | 100748 | XWiki - Remote Code Execution - CVE:CVE-2025-24893 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...e9cf745d | 100750 | SonicWall SMA - Dangerous File Upload - CVE:CVE-2021-20040,
CVE:CVE-2021-20041, CVE:CVE-2021-20042 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...d29da333 | 100751 | Langflow - Remote Code Execution - CVE:CVE-2025-3248 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...caa7b208 | 100752 | MinIO - Auth Bypass - CVE:CVE-2025-31489 | Log | Block | This is a New Detection |

## 2025-04-26

WAF Release - 2025-04-26 - Emergency | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...19fcc883 | 100755 | React.js - Router and Remix Vulnerability - CVE:CVE-2025-43864,
CVE:CVE-2025-43865 | Block | Block | This is a New Detection |

## 2025-04-22

WAF Release - 2025-04-22 Each of this week's rule releases covers a distinct CVE, with half of the rules targeting Remote Code Execution (RCE) attacks. Of the 6 CVEs covered, four were scored as critical, with the other two scored as high.

When deciding which exploits to tackle, Cloudflare tunes into the attackers' areas of focus. Cloudflare's network intelligence provides a unique lens into attacker activity – for instance, through the volume of blocked requests related with CVE exploits after updating WAF Managed Rules with new detections.

From this week's releases, one indicator that RCE is a "hot topic" attack type is the fact that the Oracle PeopleSoft RCE rule accounts for half of all of the new rule matches. This rule patches CVE-2023-22047, a high-severity vulnerability in the Oracle PeopleSoft suite that allows unauthenticated attackers to access PeopleSoft Enterprise PeopleTools data through remote code execution. This is particularly concerning because of the nature of the data managed by PeopleSoft – this can include payroll records or student profile information. This CVE, along with five others, are addressed with the latest detection update to WAF Managed Rules.

| Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...a5be3327 | 100738 | GitLab - Auth Bypass - CVE:CVE-2023-7028 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...6c9531fa | 100740 | Splunk Enterprise - Remote Code Execution - CVE:CVE-2025-20229 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...f40bbc2b | 100741 | Oracle PeopleSoft - Remote Code Execution - CVE:CVE-2023-22047 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...5462167c | 100742 | CrushFTP - Auth Bypass - CVE:CVE-2025-31161 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...caa7b208 | 100743 | Ivanti - Buffer Error - CVE:CVE-2025-22457 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...d52139a8 | 100744 | Oracle Access Manager - Remote Code Execution - CVE:CVE-2021-35587 | Log | Disabled | This is a New Detection |

## 2025-04-14

WAF Release - 2025-04-14 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...d6b2d36c | 100739A | Next.js - Auth Bypass - CVE:CVE-2025-29927 - 2 | Log | Disabled | This is a New Detection |

## 2025-04-02

WAF Release - 2025-04-02 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...622f0483 | 100732 | Sitecore - Code Injection - CVE:CVE-2025-27218 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...0f101cca | 100733 | Angular-Base64-Upload - Remote Code Execution - CVE:CVE-2024-42640 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...1bbcd247 | 100734 | Apache Camel - Remote Code Execution - CVE:CVE-2025-29891 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...90aea1ca | 100735 | Progress Software WhatsUp Gold - Remote Code Execution -
CVE:CVE-2024-4885 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...d9d8c5f2 | 100737 | Apache Tomcat - Remote Code Execution - CVE:CVE-2025-24813 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...a28a42c4 | 100659 | Common Payloads for Server-side Template Injection | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...daa4b037 | 100659 | Common Payloads for Server-side Template Injection - Base64 | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...48f6a9cf | 100642 | LDAP Injection | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...e0713e9f | 100642 | LDAP Injection Base64 | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...1bc977d1 | 100005 | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892,
CVE:CVE-2022-31474 | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...bb70a463 | 100527 | Apache Struts - CVE:CVE-2021-31805 | N/A | Block | N/A |
| Cloudflare Managed Ruleset | ...0c99546a | 100702 | Command Injection - CVE:CVE-2022-24108 | N/A | Block | N/A |
| Cloudflare Managed Ruleset | ...9a5581d0 | 100622C | Ivanti - Command Injection - CVE:CVE-2023-46805, CVE:CVE-2024-21887,
CVE:CVE-2024-22024 | N/A | Block | N/A |
| Cloudflare Managed Ruleset | ...06d0b009 | 100536C | GraphQL Command Injection | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...1651d0c8 | 100536 | GraphQL Injection | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...af00f61d | 100536A | GraphQL Introspection | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...a41e5b67 | 100536B | GraphQL SSRF | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...433e5b3d | 100559A | Prototype Pollution - Common Payloads | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...4816b26f | 100559A | Prototype Pollution - Common Payloads - Base64 | N/A | Disabled | N/A |
| Cloudflare Managed Ruleset | ...fcea5ed2 | 100734 | Apache Camel - Remote Code Execution - CVE:CVE-2025-29891 | N/A | Disabled | N/A |

## 2025-03-22

WAF Release - 2025-03-22 - Emergency | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...f472013e | 100739 | Next.js - Auth Bypass - CVE:CVE-2025-29927 | N/A | Disabled | This is a New Detection |

## 2025-03-22

New Managed WAF rule for Next.js CVE-2025-29927. Update: Mon Mar 24th, 11PM UTC: Next.js has made further changes to address a smaller vulnerability introduced in the patches made to its middleware handling. Users should upgrade to Next.js versions 15.2.4, 14.2.26, 13.5.10 or 12.3.6. If you are unable to immediately upgrade or are running an older version of Next.js, you can enable the WAF rule described in this changelog as a mitigation.

Update: Mon Mar 24th, 8PM UTC: Next.js has now backported the patch for this vulnerability ↗ to cover Next.js v12 and v13. Users on those versions will need to patch to 13.5.9 and 12.3.5 (respectively) to mitigate the vulnerability.

Update: Sat Mar 22nd, 4PM UTC: We have changed this WAF rule to opt-in only, as sites that use auth middleware with third-party auth vendors were observing failing requests.

We strongly recommend updating your version of Next.js (if eligible) to the patched versions, as your app will otherwise be vulnerable to an authentication bypass attack regardless of auth provider.

#### Enable the Managed Rule (strongly recommended)

This rule is opt-in only for sites on the Pro plan or above in the WAF managed ruleset.

To enable the rule:

1. Head to Security > WAF > Managed rules in the Cloudflare dashboard for the zone (website) you want to protect.
2. Click the three dots next to Cloudflare Managed Ruleset and choose Edit
3. Scroll down and choose Browse Rules
4. Search for CVE-2025-29927 (ruleId: 34583778093748cc83ff7b38f472013e)
5. Change the Status to Enabled and the Action to Block. You can optionally set the rule to Log, to validate potential impact before enabling it. Log will not block requests.
6. Click Next
7. Scroll down and choose Save

This will enable the WAF rule and block requests with the x-middleware-subrequest header regardless of Next.js version.

#### Create a WAF rule (manual)

For users on the Free plan, or who want to define a more specific rule, you can create a Custom WAF rule to block requests with the x-middleware-subrequest header regardless of Next.js version.

To create a custom rule:

1. Head to Security > WAF > Custom rules in the Cloudflare dashboard for the zone (website) you want to protect.
2. Give the rule a name - e.g. next-js-CVE-2025-29927
3. Set the matching parameters for the rule match any request where the x-middleware-subrequest header exists per the rule expression below.

Terminal window ```
(len(http.request.headers["x-middleware-subrequest"]) > 0)
```

1. Set the action to 'block'. If you want to observe the impact before blocking requests, set the action to 'log' (and edit the rule later).
2. Deploy the rule.

#### Next.js CVE-2025-29927

We've made a WAF (Web Application Firewall) rule available to all sites on Cloudflare to protect against the Next.js authentication bypass vulnerability ↗ (CVE-2025-29927) published on March 21st, 2025.

Note: This rule is not enabled by default as it blocked requests across sites for specific authentication middleware.

- This managed rule protects sites using Next.js on Workers and Pages, as well as sites using Cloudflare to protect Next.js applications hosted elsewhere.
- This rule has been made available (but not enabled by default) to all sites as part of our WAF Managed Ruleset and blocks requests that attempt to bypass authentication in Next.js applications.
- The vulnerability affects almost all Next.js versions, and has been fully patched in Next.js 14.2.26 and 15.2.4. Earlier, interim releases did not fully patch this vulnerability.
- Users on older versions of Next.js (11.1.4 to 13.5.6) did not originally have a patch available, but this the patch for this vulnerability and a subsequent additional patch have been backported to Next.js versions 12.3.6 and 13.5.10 as of Monday, March 24th. Users on Next.js v11 will need to deploy the stated workaround or enable the WAF rule.

The managed WAF rule mitigates this by blocking external user requests with the x-middleware-subrequest header regardless of Next.js version, but we recommend users using Next.js 14 and 15 upgrade to the patched versions of Next.js as an additional mitigation.

## 2025-03-19

WAF Release - 2025-03-19 - Emergency | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...a2cafae7 | 100736 | Generic HTTP Request Smuggling | N/A | Disabled | This is a New Detection |

## 2025-03-17

WAF Release - 2025-03-17 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...e59ec18a | 100725 | Fortinet FortiManager - Remote Code Execution - CVE:CVE-2023-42791,
CVE:CVE-2024-23666 | Log | Block |  |
| Cloudflare Managed Ruleset | ...1dbf58df | 100726 | Ivanti - Remote Code Execution - CVE:CVE-2024-8190 | Log | Block |  |
| Cloudflare Managed Ruleset | ...0ad61fa7 | 100727 | Cisco IOS XE - Remote Code Execution - CVE:CVE-2023-20198 | Log | Block |  |
| Cloudflare Managed Ruleset | ...7ee56b66 | 100728 | Sitecore - Remote Code Execution - CVE:CVE-2024-46938 | Log | Block |  |
| Cloudflare Managed Ruleset | ...a6752a38 | 100729 | Microsoft SharePoint - Remote Code Execution - CVE:CVE-2023-33160 | Log | Block |  |
| Cloudflare Managed Ruleset | ...98d47b69 | 100730 | Pentaho - Template Injection - CVE:CVE-2022-43769, CVE:CVE-2022-43939 | Log | Block |  |
| Cloudflare Managed Ruleset | ...69fe1e0d | 100700 | Apache SSRF vulnerability CVE-2021-40438 | N/A | Block |  |

## 2025-03-11

WAF Release - 2025-03-11 - Emergency | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...73febb31 | 100731 | Apache Camel - Code Injection - CVE:CVE-2025-27636 | N/A | Block | This is a New Detection |

## 2025-03-10

WAF Release - 2025-03-10 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...b2a51e3d | 100722 | Ivanti - Information Disclosure - CVE:CVE-2025-0282 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...259073d5 | 100723 | Cisco IOS XE - Information Disclosure - CVE:CVE-2023-20198 | Log | Block | This is a New Detection |

## 2025-03-07

Updated leaked credentials database Added new records to the leaked credentials database. The record sources are: Have I Been Pwned (HIBP) database, RockYou 2024 dataset, and another third-party database.

## 2025-03-03

WAF Release - 2025-03-03 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...93e63099 | 100721 | Ivanti - Remote Code Execution - CVE:CVE-2024-13159, CVE:CVE-2024-13160,
CVE:CVE-2024-13161 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...cac42ce2 | 100596 | Citrix Content Collaboration ShareFile - Remote Code Execution -
CVE:CVE-2023-24489 | N/A | Block |  |

## 2025-02-24

WAF Release - 2025-02-24 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...4916911e | 100718A | SonicWall SSLVPN 2 - Auth Bypass - CVE:CVE-2024-53704 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...c382fdec | 100720 | Palo Alto Networks - Auth Bypass - CVE:CVE-2025-0108 | Log | Block | This is a New Detection |

## 2025-02-18

WAF Release - 2025-02-18 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...a2ffa4b8 | 100715 | FortiOS - Auth Bypass - CVE:CVE-2024-55591 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...5a883e12 | 100716 | Ivanti - Auth Bypass - CVE:CVE-2021-44529 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...958094d3 | 100717 | SimpleHelp - Auth Bypass - CVE:CVE-2024-57727 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...3b66df22 | 100718 | SonicWall SSLVPN - Auth Bypass - CVE:CVE-2024-53704 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...9184699f | 100719 | Yeti Platform - Auth Bypass - CVE:CVE-2024-46507 | Log | Block | This is a New Detection |

## 2025-02-11

WAF Release - 2025-02-11 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...483b4c26 | 100708 | Aviatrix Network - Remote Code Execution - CVE:CVE-2024-50603 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...7e924ca3 | 100709 | Next.js - Remote Code Execution - CVE:CVE-2024-46982 | Log | Disabled | This is a New Detection |
| Cloudflare Managed Ruleset | ...83a7d8ff | 100710 | Progress Software WhatsUp Gold - Directory Traversal -
CVE:CVE-2024-12105 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...baa8eb34 | 100711 | WordPress - Remote Code Execution - CVE:CVE-2024-56064 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...87f5d34e | 100712 | WordPress - Remote Code Execution - CVE:CVE-2024-9047 | Log | Block | This is a New Detection |
| Cloudflare Managed Ruleset | ...bf72cf8a | 100713 | FortiOS - Auth Bypass - CVE:CVE-2022-40684 | Log | Block | This is a New Detection |

## 2025-02-04

Updated leaked credentials database Added new records to the leaked credentials database from a third-party database.

## 2025-01-21

WAF Release - 2025-01-21 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...b090ba9a | 100303 | Command Injection - Nslookup | Log | Block | This was released as    ...b8d152f4 |
| Cloudflare Managed Ruleset | ...49e6b538 | 100534 | Web Shell Activity | Log | Block | This was released as    ...82fe4e7f |

## 2025-01-13

WAF Release - 2025-01-13 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Managed Ruleset | ...f49e5840 | 100704 | Cleo Harmony - Auth Bypass - CVE:CVE-2024-55956, CVE:CVE-2024-55953 | Log | Block | New Detection |
| Cloudflare Managed Ruleset | ...a6d43bc2 | 100705 | Sentry - SSRF | Log | Block | New Detection |
| Cloudflare Managed Ruleset | ...ce6311bb | 100706 | Apache Struts - Remote Code Execution - CVE:CVE-2024-53677 | Log | Block | New Detection |
| Cloudflare Managed Ruleset | ...2233da1f | 100707 | FortiWLM - Remote Code Execution - CVE:CVE-2023-48782,
CVE:CVE-2023-34993, CVE:CVE-2023-34990 | Log | Block | New Detection |
| Cloudflare Managed Ruleset | ...e31d972a | 100007C_BETA | Command Injection - Common Attack Commands |  | Disabled |  |

## 2025-01-06

WAF Release - 2025-01-06 | Ruleset | Rule ID | Legacy Rule ID | Description | Previous Action | New Action | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | ...9da08beb | 100678 | Pandora FMS - Remote Code Execution - CVE:CVE-2024-11320 | Log | Block | New Detection |
| Cloudflare Specials | ...ecdf3d02 | 100679 | Palo Alto Networks - Remote Code Execution - CVE:CVE-2024-0012,
CVE:CVE-2024-9474 | Log | Block | New Detection |
| Cloudflare Specials | ...a40f2a35 | 100680 | Ivanti - Command Injection - CVE:CVE-2024-37397 | Log | Block | New Detection |
| Cloudflare Specials | ...58ae3c89 | 100681 | Really Simple Security - Auth Bypass - CVE:CVE-2024-10924 | Log | Block | New Detection |
| Cloudflare Specials | ...e37f2da6 | 100682 | Magento - XXE - CVE:CVE-2024-34102 | Log | Block | New Detection |
| Cloudflare Specials | ...5054c752 | 100683 | CyberPanel - Remote Code Execution - CVE:CVE-2024-51567 | Log | Block | New Detection |
| Cloudflare Specials | ...dfe93d7b | 100684 | Microsoft SharePoint - Remote Code Execution - CVE:CVE-2024-38094,
CVE:CVE-2024-38024, CVE:CVE-2024-38023 | Log | Block | New Detection |
| Cloudflare Specials | ...1454c856 | 100685 | CyberPanel - Remote Code Execution - CVE:CVE-2024-51568 | Log | Block | New Detection |
| Cloudflare Specials | ...e92362e5 | 100686 | Seeyon - Remote Code Execution | Log | Block | New Detection |
| Cloudflare Specials | ...b9f1c9f8 | 100687 | WordPress - Remote Code Execution - CVE:CVE-2024-10781,
CVE:CVE-2024-10542 | Log | Block | New Detection |
| Cloudflare Specials | ...0d7ca374 | 100688 | ProjectSend - Remote Code Execution - CVE:CVE-2024-11680 | Log | Block | New Detection |
| Cloudflare Specials | ...a5260b70 | 100689 | Palo Alto GlobalProtect - Remote Code Execution - CVE:CVE-2024-5921 | Log | Block | New Detection |
| Cloudflare Specials | ...d007118b | 100690 | Ivanti - Remote Code Execution - CVE:CVE-2024-37404 | Log | Block | New Detection |
| Cloudflare Specials | ...c3e49f64 | 100691 | Array Networks - Remote Code Execution - CVE:CVE-2023-28461 | Log | Block | New Detection |
| Cloudflare Specials | ...fcc6f5bb | 100692 | CyberPanel - Remote Code Execution - CVE:CVE-2024-51378 | Log | Block | New Detection |
| Cloudflare Specials | ...b615335e | 100693 | Symfony Profiler - Auth Bypass - CVE:CVE-2024-50340 | Log | Block | New Detection |
| Cloudflare Specials | ...09d08c8a | 100694 | Citrix Virtual Apps - Remote Code Execution - CVE:CVE-2024-8069 | Log | Block | New Detection |
| Cloudflare Specials | ...8aafb2f5 | 100695 | MSMQ Service - Remote Code Execution - CVE:CVE-2023-21554 | Log | Block | New Detection |
| Cloudflare Specials | ...11b7a8c7 | 100696 | Nginxui - Remote Code Execution - CVE:CVE-2024-49368 | Log | Block | New Detection |
| Cloudflare Specials | ...45954c7e | 100697 | Apache ShardingSphere - Remote Code Execution - CVE:CVE-2022-22733 | Log | Block | New Detection |
| Cloudflare Specials | ...f5311209 | 100698 | Mitel MiCollab - Auth Bypass - CVE:CVE-2024-41713 | Log | Block | New Detection |
| Cloudflare Specials | ...b3e5e46e | 100699 | Apache Solr - Auth Bypass - CVE:CVE-2024-45216 | Log | Block | New Detection |

## 2024-12-18

Improved VPN Managed List Customers can now effectively manage incoming traffic identified as originating from VPN IPs. Customers with compliance restrictions can now ensure compliance with local laws and regulations. Customers with CDN restrictions can use the improved VPN Managed List to prevent unauthorized access from users attempting to bypass geographical restrictions. With the new VPN Managed List enhancements, customers can improve their overall security posture to reduce exposure to unwanted or malicious traffic.

## 2024-12-10

Change the order of list items in IP Lists (for API and Terraform users) Due to changes in the API implementation, the order of list items in an IP list obtained via API or Terraform may change, which may cause Terraform to detect a change in Terraform state. To fix this issue, resync the Terraform state or upgrade the version of your Terraform Cloudflare provider to version 4.44.0 ↗ or later.

## 2024-11-14

Security Events pagination Fixed an issue with pagination in Security Events' sampled logs where some pages were missing data. Also removed the total count from the events log as these are only sampled logs.

## 2024-11-04

New table in Security Analytics and Security Events Switched to a new, more responsive table in Security Analytics and Security Events.

## 2024-08-29

Fixed occasional attack score mismatches Fixed an issue causing score mismatches between the global WAF attack score and subscores. In certain cases, subscores were higher (not an attack) than expected while the global attack score was lower than expected (attack), leading to false positives.

## 2024-05-23

Improved detection capabilities WAF attack score now automatically detects and decodes Base64 and JavaScript (Unicode escape sequences) in HTTP requests. This update is available for all customers with access to WAF attack score (Business customers with access to a single field and Enterprise customers).

## Previous updates

For preview WAF updates, refer to the historical changelog (2024).

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

## Scheduled changes

**來源**: [https://developers.cloudflare.com/waf/change-log/scheduled-changes/](https://developers.cloudflare.com/waf/change-log/scheduled-changes/)

Page options # Scheduled changes

Subscribe to RSS ## 2025-09-01

WAF Release - Scheduled changes for 2025-09-08 | Announcement Date | Release Date | Release Behavior | Legacy Rule ID | Rule ID | Description | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-09-01 | 2025-09-08 | Log | 100007D | ...963d7afc | Command Injection - Common Attack Commands Args | Beta detection. This will be merged into the original rule "Command Injection - Common Attack Commands" (ID:    ...28345b9b     ) |
| 2025-09-01 | 2025-09-08 | Log | 100617 | ...8230a75b | Next.js - SSRF - CVE:CVE-2025-57822 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100659_BETA | ...a22dabf1 | Common Payloads for Server-Side Template Injection - Beta | Beta detection. This will be merged into the original rule "Common Payloads for Server-Side Template Injection" (ID:    ...a28a42c4     ) |
| 2025-09-01 | 2025-09-08 | Log | 100824B | ...b416b7ca | CrushFTP - Remote Code Execution - CVE:CVE-2025-54309 - 3 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100848 | ...5db1fa6b | ScriptCase - Auth Bypass - CVE:CVE-2025-47227 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100849 | ...2c62d330 | ScriptCase - Command Injection - CVE:CVE-2025-47228 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100872 | ...ef971afd | WordPress:Plugin:InfiniteWP Client - Missing Authorization - CVE:CVE-2020-8772 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100873 | ...bab19b0b | Sar2HTML - Command Injection - CVE:CVE-2025-34030 | This is a New Detection |
| 2025-09-01 | 2025-09-08 | Log | 100875 | ...f24c0fbe | Zhiyuan OA - Remote Code Execution - CVE:CVE-2025-34040 | This is a New Detection |

For other WAF updates, refer to the changelog.

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

## Historical (2024)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2024/](https://developers.cloudflare.com/waf/change-log/historical-2024/)

Page options # Historical (2024)

| Ruleset | Rule ID | Legacy Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | ...6bc398e9 | 100675 | Adobe ColdFusion - Auth Bypass - CVE:CVE-2023-38205 | 2024-10-21 | Log | Block |
| Cloudflare Specials | ...710cc526 | 100676 | Palo Alto Networks - Auth Bypass - CVE:CVE-2024-5910 | 2024-10-21 | Log | Block |
| Cloudflare Specials | ...04f7d36a | 100677 | SolarWinds - Auth Bypass - CVE:CVE-2024-28987 | 2024-10-21 | Log | Block |
| Cloudflare Specials | ...2e49c1d8 | 100673 | GoAnywhere - Remote Code Execution - CVE:CVE-2023-0669 | 2024-10-14 | Log | Block |
| Cloudflare Specials | ...168ef44c | 100669 | Apache HugeGraph-Server - Remote Code Execution - CVE:CVE-2024-27348 | 2024-10-07 | Log | Block |
| Cloudflare Specials | ...91e9ba51 | 100672 | Ivanti Virtual Traffic Manager - Auth Bypass - CVE:CVE-2024-7593 | 2024-10-07 | Log | Block |
| Cloudflare Specials | ...eb60e909 | 100670 | Junos - Remote Code Execution - CVE:CVE-2023-36844 | 2024-10-07 | Log | Block |
| Cloudflare Specials | ...84938aa0 | 100671 | Microsoft SQL Server - Remote Code Execution - CVE:CVE-2020-0618 | 2024-10-07 | Log | Block |
| Cloudflare Specials | ...2f26b3a7 | 100581 | Joomla - Information Disclosure - CVE:CVE-2023-23752 | 2024-10-07 | Log | Block |
| Cloudflare Specials | ...11020996 | 100668 | Progress Software WhatsUp Gold - Information Disclosure -
CVE:CVE-2024-6670 | 2024-10-01 | Log | Block |
| Cloudflare Specials | ...8480ea8f | N/A | Anomaly:Body - Large 2 | 2024-09-16 | N/A | Disabled |
| Cloudflare Specials | ...a24f08b7 | 100526 | VMware vCenter - CVE:CVE-2022-22954, CVE:CVE-2022-22948 | 2024-09-03 | N/A | Block |
| Cloudflare Specials | ...1a48569a | 100667 | Authentik - Auth Bypass - CVE:CVE-2024-42490 | Emergency, 2024-08-20 | N/A | Block |
| Cloudflare Specials | ...f3f42616 | 100666 | Apache OFBiz - Remote Code Execution - CVE:CVE-2024-32113 | 2024-08-19 | Log | Block |
| Cloudflare Specials | ...71eefd6f | 100665 | Zoho ManageEngine - Remote Code Execution - CVE:CVE-2023-29084 | 2024-08-19 | Log | Block |
| Cloudflare Specials | ...89011f18 | 100664 | Automation Anywhere - SSRF - CVE:CVE-2024-6922 | 2024-08-05 | Log | Block |
| Cloudflare Specials | ...740bce9a | 100663 | WSO2 - Dangerous File Upload - CVE:CVE-2022-29464 | 2024-08-05 | Log | Block |
| Cloudflare Specials | ...77c07fce | 100662 | ServiceNow - Input Validation - CVE:CVE-2024-4879, CVE:CVE-2024-5178,
CVE:CVE-2024-5217 | 2024-08-05 | Log | Block |
| Cloudflare Specials | ...daa4b037 | 100659 | Common Payloads for Server-side Template Injection - Base64 | 2024-07-29 | N/A | Disabled |
| Cloudflare Specials | ...4816b26f | 100559A | Prototype Pollution - Common Payloads - Base64 | 2024-07-29 | N/A | Disabled |
| Cloudflare Specials | ...818d6040 | 100660 | Server-side Includes - Common Payloads - Base64 | 2024-07-29 | N/A | Disabled |
| Cloudflare Specials | ...3defc179 | 100661 | SQLi - Common Payloads - Base64 | 2024-07-29 | N/A | Disabled |
| Cloudflare Specials | ...f2cc4e84 | 100524 | Java - Remote Code Execution | 2024-07-29 | Block | Disabled |
| Cloudflare Specials | ...f2cc4e84 | 100524 | Java - Remote Code Execution | 2024-07-24 | Log | Block |
| Cloudflare Specials | ...a28a42c4 | 100659 | Common Payloads for Server-side Template Injection | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...fa595c5b | 100533A | Generic Payloads NoSQL Injection Base64 Beta | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...f8c3c472 | 100533A | Generic Payloads NoSQL Injection | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...1b5ca35e | 100644 | Generic Payloads XSS Base64 Beta | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...8d4b794c | 100644 | Generic Payloads XSS | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...e0713e9f | 100642 | LDAP Injection Base64 Beta | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...48f6a9cf | 100642 | LDAP Injection | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...433e5b3d | 100559A | Prototype Pollution - Common Payloads | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...1a3e21e4 | 100645 | Remote Code Execution - Generic Payloads | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...ea67490b | 100660 | Server-Side Includes - Common Payloads | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...1e676265 | 100661 | SQLi - Common Payloads | 2024-07-24 | N/A | Disabled |
| Cloudflare Specials | ...6fa67018 | 100658 | Apache OFBiz - SSRF - CVE:CVE-2023-50968 | 2024-07-17 | Log | Block |
| Cloudflare Specials | ...f2f0224b | 100657 | JEECG - Deserialization - CVE:CVE-2023-49442 | 2024-07-17 | Log | Block |
| Cloudflare Specials | ...34780914 | 100532 | Vulnerability scanner activity | 2024-07-17 | Log | Block |
| Cloudflare Specials | ...a0c03e6f | 100654 | Telerik Report Server - Auth Bypass - CVE:CVE-2024-4358,
CVE:CVE-2024-1800 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...ff9f8ca6 | 100655 | Rejetto HTTP File Server - Remote Code Execution - CVE:CVE-2024-23692 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...85c293eb | 100647 | pgAdmin - Remote Code Execution - CVE:CVE-2024-3116 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...b57f700d | 100656 | MoveIT - Auth Bypass - CVE:CVE-2024-5806 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...afae3d67 | 100079A | Java - Deserialization - 2 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...98760cfd | 100648 | Groovy - Remote Code Execution | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...69fe1e0d | 100700 | Apache SSRF vulnerability CVE-2021-40438 | 2024-07-10 | Log | Block |
| Cloudflare Specials | ...1a9fccda | 100652 | PHP CGI - Information Disclosure - CVE:CVE-2024-4577 | Emergency, 2024-06-18 | N/A | Block |
| Cloudflare Specials | ...2b931b04 | 100653 | Veeam Backup Enterprise Manager - Information Disclosure -
CVE:CVE-2024-29849 | Emergency, 2024-06-18 | N/A | Block |
| Cloudflare Specials | ...00a71dce | 100651 | Atlassian Confluence - Remote Code Execution - CVE:CVE-2024-21683 | Emergency, 2024-06-06 | N/A | Block |
| Cloudflare Specials | ...b1df0e15 | 100650 | Check Point Security - Information Disclosure - CVE:CVE-2024-24919 | Emergency, 2024-05-30 | N/A | Block |
| Cloudflare Specials | ...92b2cc05 | 100649 | FortiSIEM - Remote Code Execution - CVE:CVE-2024-23108,
CVE:CVE-2023-34992 | Emergency, 2024-05-29 | N/A | Block |
| Cloudflare Specials | ...96ca9284 | N/A | Generic Payloads XSS Base64 2 Beta | 2024-05-21 | N/A | Disabled |
| Cloudflare Specials | ...fa595c5b | N/A | Generic Payloads NoSQL Injection Base64 Beta | 2024-05-14 | N/A | Disabled |
| Cloudflare Specials | ...e0713e9f | N/A | LDAP Injection Base64 Beta | 2024-05-14 | N/A | Disabled |
| Cloudflare Specials | ...cad90fb3 | N/A | NoSQL - Injection Base64 2 Beta | 2024-05-14 | N/A | Disabled |
| Cloudflare Specials | ...1b5ca35e | N/A | Generic Payloads XSS Base64 Beta | 2024-05-08 | N/A | Disabled |
| Cloudflare Specials | ...34780914 | 100532 | Vulnerability scanner activity | 2024-05-06 | N/A | Block |
| Cloudflare Specials | ...2753531e | 100533 | NoSQL - Injection | 2024-05-06 | N/A | Block |
| Sensitive Data Disclosure (SDD) | ...17bd5326 | N/A | Malaysian Phone Number | 2024-04-24 | N/A | Disabled |
| Sensitive Data Disclosure (SDD) | ...3172838f | N/A | Malaysia Identification Card Number | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...27e67a11 | N/A | Vulnerability scanner activity 3 Base64 Beta | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...9cb76af3 | N/A | Default Windows User - Directory Traversal Base64 Beta | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...fa595c5b | N/A | Generic Payloads NoSQL Injection Base64 Beta | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...cad90fb3 | N/A | NoSQL - Injection Base64 2 Beta | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...e0713e9f | N/A | LDAP Injection Base64 Beta | 2024-04-24 | N/A | Disabled |
| Cloudflare Specials | ...1a3e21e4 | 100645 | Remote Code Execution - Generic Payloads | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...f8c3c472 | 100533A | Generic Payloads NoSQL Injection | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...8d4b794c | 100644 | Generic Payloads XSS | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...e31d972a | 100007C_BETA | Command Injection - Common Attack Commands Beta
Updated detection logic. | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...7f3009d1 | 100643 | Default Windows User - Directory Traversal
Updated detection logic. | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...48f6a9cf | 100642 | LDAP Injection
Updated detection logic. | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...dd908124 | 100532C | Vulnerability scanner activity 3
Updated detection logic. | 2024-04-22 | N/A | Disabled |
| Cloudflare Specials | ...851d2f71 | 100007C | Command Injection - Common Attack Commands | Emergency, 2024-04-16 | N/A | Block |
| Cloudflare Specials | ...be099a1f | 100045C | Anomaly:URL:Path - Multiple Slashes, Relative Paths, CR, LF or NULL 2 | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...e31d972a | 100007C_BETA | Command Injection - Common Attack Commands Beta | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...7f3009d1 | 100643 | Default Windows User - Directory Traversal | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...cf419cda | 100088E | Generic XXE Attack | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...56c53382 | 100088D | Generic XXE Attack 2 | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...af00f61d | 100536A | GraphQL Introspection | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...a41e5b67 | 100536B | GraphQL SSRF | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...48f6a9cf | 100642 | LDAP Injection | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...dd908124 | 100532C | Vulnerability scanner activity 3 | 2024-04-15 | N/A | Disabled |
| Cloudflare Specials | ...49621813 | 100632 | Nginx - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...7dc64fb6 | 100633 | PHP - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...7eac8439 | 100634 | Generic Database - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...a0ccf665 | 100635 | Generic Log - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...e485e537 | 100636 | Generic Webservers - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...1813c52d | 100637 | Generic Home Directory - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...241fb0cb | 100638 | Generic System Process - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...d03cd48f | 100639 | Command Injection | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...e367ad17 | 100640 | Generic System - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...a8f03d2d | 100641 | Apache - File Inclusion | 2024-04-08 | N/A | Disabled |
| Cloudflare Specials | ...2bed8cdd | 100629 | JetBrains TeamCity - Auth Bypass, Remote Code Execution -
CVE:CVE-2024-27198, CVE:CVE-2024-27199 | 2024-03-18 | N/A | Block |
| Cloudflare Specials | ...1ef425a5 | 100630 | Apache OFBiz - Auth Bypass, Remote Code Execution - CVE:CVE-2023-49070,
CVE:CVE-2023-51467 | 2024-03-18 | N/A | Block |
| Cloudflare Specials | ...dc6877e2 | 100627 | Wordpress:Plugin:Bricks Builder Theme - Command Injection -
CVE:CVE-2024-25600 | 2024-03-11 | N/A | Block |
| Cloudflare Specials | ...ae685218 | 100628 | ConnectWise - Auth Bypass | 2024-03-11 | N/A | Block |
| Cloudflare Specials | ...aa290ad9 | 100135D | XSS - JS On Events | 2024-03-04 | N/A | Block |
| Cloudflare Specials | ...1d870399 | 100546 | XSS - HTML Encoding | 2024-02-26 | N/A | Block |
| Cloudflare Specials | ...9a5581d0 | 100622B, 100622C | Ivanti - Command Injection - CVE:CVE-2023-46805, CVE:CVE-2024-21887,
CVE:CVE-2024-22024 | 2024-02-20 | N/A | Block |
| Cloudflare Specials | ...d0b325aa | N/A | Microsoft ASP.NET - Code Injection - Function response.write | 2024-02-20 | N/A | Block |
| Cloudflare Specials | ...1b138b3e | N/A | NoSQL, MongoDB - SQLi - Comparison | 2024-02-20 | N/A | Block |
| Cloudflare Specials | ...8f66903c | N/A | NoSQL, MongoDB - SQLi - Expression | 2024-02-20 | N/A | Block |
| Cloudflare Specials | ...2d2e031c | N/A | PHP - Code Injection | 2024-02-20 | N/A | Disabled |
| Cloudflare Specials | ...824b817c | N/A | PHP, vBulletin, jQuery File Upload - Code Injection, Dangerous File
Upload - CVE:CVE-2018-9206, CVE:CVE-2019-17132 | 2024-02-20 | N/A | Block |
| Cloudflare Specials | ...901523c0 | 100625 | Jenkins - Information Disclosure - CVE:CVE-2024-23897 | 2024-02-12 | N/A | Block |
| Cloudflare Specials | ...d5e015dd | 100514 | Log4j Headers | 2024-02-12 | N/A | Block |
| Cloudflare Specials | ...dc29b753 | 100515B | Log4j Body Obfuscation | 2024-02-12 | N/A | Block |
| Cloudflare Specials | ...52d6027b | 100624 | GoAnywhere - Auth Bypass - CVE:CVE-2024-0204 | 2024-02-05 | N/A | Block |
| Cloudflare Specials | ...f89ab164 | 100626,100626A | Anomaly:Header:Content-Type - Multiple | 2024-02-05 | N/A | Disabled |
| Cloudflare Specials | ...7736c63c | N/A | AngularJS - XSS | 2024-02-05 | N/A | Block |
| Cloudflare Specials | ...a02344cb | N/A | Apache HTTP Server - Server-Side Includes | 2024-02-05 | N/A | Disabled |
| Cloudflare Specials | ...af52d528 | N/A | Command Injection - CVE:CVE-2014-6271 | 2024-02-05 | N/A | Block |
| Cloudflare Specials | ...b090ba9a | N/A | Command Injection - Nslookup | 2024-02-05 | N/A | Block |
| Cloudflare Specials | ...d5a14a5e | N/A | Microsoft ASP.NET - Code Injection | 2024-02-05 | N/A | Disabled |
| Cloudflare Specials | ...da07a922 | 100623 | Atlassian Confluence - Template Injection - CVE:CVE-2023-22527 | Emergency, 2024-01-22 | N/A | Block |
| Cloudflare Specials | ...34ab53c5 | 100622 | Ivanti - Auth Bypass, Command Injection - CVE:CVE-2023-46805,
CVE:CVE-2024-21887 | Emergency, 2024-01-17 | N/A | Block |
| Cloudflare Specials | ...38906cff | 100620 | Microsoft ASP.NET - Remote Code Execution - CVE:CVE-2023-35813 | 2024-01-16 | N/A | Block |
| Cloudflare Specials | ...84f664a9 | 100619 | Liferay - Remote Code Execution - CVE:CVE-2020-7961 | 2024-01-16 | N/A | Block |
| Cloudflare Specials | ...7d29ec39 | 100618 | pfSense - Remote Code Execution - CVE:CVE-2023-42326 | 2024-01-16 | N/A | Block |
| Cloudflare Specials | ...9016ef33 | 100621 | Clerk - Auth Bypass | 2024-01-16 | N/A | Disabled |
| Cloudflare Specials | ...53c7ccde | 100612 | SnakeYAML - CVE:CVE-2022-1471 | 2024-01-04 | N/A | Block |

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

## Historical (2023)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2023/](https://developers.cloudflare.com/waf/change-log/historical-2023/)

Page options # Historical (2023)

| Ruleset | Rule ID | Legacy Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | ...1bc977d1 | N/A | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892,
CVE:CVE-2022-31474 | 2023-12-18 | N/A | Block |
| Cloudflare Specials | ...bb6d4e13 | 100615 | Apache Struts - Remote Code Execution - CVE:CVE-2023-50164 | Emergency, 2023-12-14 | N/A | Block |
| Cloudflare Specials | ...8ed2b1d9 | 100611 | WordPress:Plugin:WooCommerce - Unauthorized Administrator Access -
CVE:CVE-2023-28121 | 2023-11-21 | N/A | Block |
| Cloudflare Specials | ...c3b6a372 | 100593 | Adobe ColdFusion - Auth Bypass, Remote Code Execution -
CVE:CVE-2023-29298, CVE:CVE-2023-38203, CVE:CVE-2023-26360 | 2023-11-21 | N/A | Block |
| Cloudflare Specials | ...c54e7046 | 100614 | Atlassian Confluence - Code Injection - CVE:CVE-2023-22518 | Emergency, 2023-11-06 | N/A | Block |
| Cloudflare Specials | ...d59a59db | 100609 | Keycloak - SSRF - CVE:CVE-2020-10770 | 2023-10-30 | N/A | Block |
| Cloudflare Specials | ...3e3f706d | 100606 | JetBrains TeamCity - Auth Bypass, Remote Code Execution -
CVE:CVE-2023-42793 | 2023-10-23 | N/A | Block |
| Cloudflare Specials | ...469c4a38 | 100607 | Progress WS_FTP - Information Disclosure - CVE:CVE-2023-40044 | 2023-10-23 | N/A | Block |
| Cloudflare Specials | ...7ccccdce | 100608 | Progress WS_FTP - Remote Code Execution - CVE:CVE-2023-40044 | 2023-10-23 | N/A | Block |
| Cloudflare Specials | ...ec9f34e1 | 100604 | Atlassian Confluence - Privilege Escalation - CVE:CVE-2023-22515.Also released for Cloudflare Free customers, with rule ID ...91935fcb
(updated detection logic). | Emergency, 2023-10-11 | N/A | Block |
| Cloudflare Specials | ...ec9f34e1 | 100604,100605 | Atlassian Confluence - Privilege Escalation - CVE:CVE-2023-22515.Also released for Cloudflare Free customers, with rule ID ...91935fcb. | Emergency, 2023-10-04 | N/A | Block |
| Cloudflare Specials | ...34780914 | 100532 | Vulnerability scanner activity | 2023-10-02 | N/A | Block |
| Cloudflare Specials | ...066c0c9a | 100602 | Code Injection - CVE:CVE-2023-36845 | Emergency, 2023-09-22 | N/A | Block |
| Cloudflare Specials | ...0746d000 | 100603 | Information Disclosure - CVE:CVE-2023-28432 | Emergency, 2023-09-22 | N/A | Block |
| Cloudflare Specials | ...25ba9d7c | N/A | SSRF Cloud | 2023-09-18 | N/A | Disabled |
| Cloudflare Specials | ...c5f041ac | 100597 | Information Disclosure - Path Normalization | 2023-09-04 | Log | Block |
| Cloudflare Specials | ...50cec478 | 100598 | Remote Code Execution - Common Bash Bypass | 2023-09-04 | Log | Block |
| Cloudflare Specials | ...ec5b0d04 | 100599 | Ivanti - Auth Bypass - CVE:CVE-2023-38035 | 2023-09-04 | Log | Block |
| Cloudflare Specials | ...6912c055 | 100601 | Malware - Polymorphic Encoder | 2023-09-04 | Log | Block |
| Cloudflare Specials | ...8242627b | 100146B | SSRF Local BETA | 2023-09-04 | Log | Disabled |
| Cloudflare Specials | ...84dadf5a | 100595 | MobileIron - Auth Bypass - CVE:CVE-2023-35082 | 2023-08-21 | Log | Block |
| Cloudflare Specials | ...48a60154 | N/A | SQLi - Keyword + SubExpress + Comment + BETA | 2023-08-21 | N/A | Disabled |
| Cloudflare Specials | ...cac42ce2 | 100596 | Citrix Content Collaboration ShareFile - Remote Code Execution -
CVE:CVE-2023-24489 | Emergency, 2023-08-17 | N/A | Block |
| Cloudflare Specials | ...c3b6a372 | 100593 | Adobe ColdFusion - Auth Bypass, Remote Code Execution -
CVE:CVE-2023-29298, CVE:CVE-2023-38203, CVE:CVE-2023-26360 | 2023-08-07 | N/A | Block |
| Cloudflare Specials | ...63d65c25 | 100594 | Citrix Netscaler ADC - Remote Code Execution - CVE:CVE-2023-3519 | 2023-08-07 | Log | Block |
| Cloudflare Specials | ...63d65c25 | 100594 | Citrix Netscaler ADC - Remote Code Execution - CVE:CVE-2023-3519 | Emergency, 2023-08-01 | N/A | Log |
| Cloudflare Specials | ...777f5c34 | 100590 | Fortigate VPN - Remote Code Execution - CVE:CVE-2023-27997 | 2023-07-31 | N/A | Block |
| Cloudflare Specials | ...0bd669ca | 100592 | Code Injection - Generic | 2023-07-31 | N/A | Block |
| OWASP Rules | ...af347fde | N/A | 944100: Remote Command Execution: Suspicious Java class detected | 2023-07-10 | N/A | Block |
| OWASP Rules | ...9fae472b | N/A | 944110: Remote Command Execution: Java process spawn (CVE-2017-9805) | 2023-07-10 | N/A | Block |
| OWASP Rules | ...5ab75703 | N/A | 944120: Remote Command Execution: Java serialization (CVE-2015-4852) | 2023-07-10 | N/A | Block |
| OWASP Rules | ...73cd4e53 | N/A | 944210: Magic bytes Detected Base64 Encoded, probable Java serialization
in use | 2023-07-10 | N/A | Block |
| OWASP Rules | ...e068f5d3 | N/A | 944300: Base64 encoded string matched suspicious keyword | 2023-07-10 | N/A | Block |
| Cloudflare Specials | ...6f9bfc13 | 100590 | VMware - Remote Code Execution - CVE:CVE-2023-20887 | 2023-07-05 | N/A | Block |
| Cloudflare Specials | ...fb982fd6 | 100008G | SQLi - Libinject with Body Inspection | 2023-07-05 | N/A | Disabled |
| Cloudflare Specials | ...7bc0259f | 100008NS | Command Injection - Netcat - Body | 2023-07-05 | N/A | Disabled |
| Cloudflare Specials | ...8559ddfa | 100589 | File Inclusion - WEB-INF | 2023-06-19 | N/A | Block |
| Cloudflare Specials | ...269024be | 100587 | Code Injection - CVE:CVE-2019-18889 | 2023-06-19 | N/A | Block |
| Cloudflare Specials | ...6f9bfc13 | 100590 | VMware - Remote Code Execution - CVE:CVE-2023-20887 | Emergency, 2023-06-14 | N/A | Block |
| Cloudflare Specials | ...269024be | 100587 | Code Injection - CVE:CVE-2022-23529 | 2023-06-12 | N/A | Block |
| Cloudflare Specials | ...3ff033f6 | 100588 | MoveIT - SSRF | Emergency, 2023-06-09 | N/A | Block |
| Cloudflare Specials | ...dae05f0a | 100583 | Sophos - Code Injection - CVE:CVE-2023-1671 | 2023-05-22 | N/A | Block |
| Cloudflare Specials | ...dd1b7502 | 100584 | Oracle Opera - Code Injection - CVE:CVE-2023-21932 | 2023-05-22 | N/A | Disabled |
| Cloudflare Specials | ...18585d20 | 100582 | vBulletin - Code Injection - CVE:CVE-2023-25135 | 2023-05-02 | N/A | Block |
| Cloudflare Specials | ...49e6b538 | 100534 | Webshell Activity | 2023-05-02 | N/A | Block |
| Cloudflare Specials | ...8b036974 | 100558 | Malware, Web Shell | 2023-05-02 | N/A | Log |
| Cloudflare Specials | ...dfc9b843 | 100580 | XSS - Error handling | 2023-04-11 | N/A | Block |
| Cloudflare Specials | ...2f26b3a7 | 100581 | Joomla - Information Disclosure - CVE:CVE-2023-23752 | 2023-04-11 | N/A | Block |
| Cloudflare Specials | ...602dabe0 | N/A | XSS - JavaScript Events | 2023-04-11 | N/A | Block |
| Cloudflare Specials | N/A | 100546 | XSS - HTML Encoding | 2023-04-11 | N/A | Block |
| Cloudflare Specials | ...a47c4be6 | 100577 | Apache Spark - Remote Code Execution - CVE:CVE-2022-33891 | 2023-03-20 | N/A | Block |
| Cloudflare Specials | ...54d00d2f | 100578 | GLPI - Remote Code Execution - CVE:CVE-2022-35914 | 2023-03-20 | N/A | Block |
| Cloudflare Specials | ...fb4c6991 | 100579 | GitLab - Remote Code Execution - CVE:CVE-2021-22205 | 2023-03-20 | N/A | Block |
| Cloudflare Specials | ...ad679b95 | 100575 | ZK Framework - Information Disclosure - CVE:CVE-2022-36537 | 2023-03-13 | N/A | Block |
| Cloudflare Specials | ...f2cc4e84 | 100524 | Java - Remote Code Execution | 2023-03-06 | N/A | Block |
| Cloudflare Specials | ...30d612c4 | 100572 | Java - Remote Code Execution - URL | 2023-03-06 | N/A | Block |
| Cloudflare Specials | ...9497744a | 100570 | FortiNAC - Remote Code Execution - CVE:CVE-2022-39952 | 2023-03-06 | N/A | Block |
| Cloudflare Specials | ...5d38ed42 | 100564 | Oracle E-Business Suite - Remote Code Execution - CVE:CVE-2022-21587 | 2023-02-27 | N/A | Block |
| Cloudflare Specials | ...d7e78753 | 100566 | Ruby on Rails - Remote Code Execution | 2023-02-27 | N/A | Block |
| Cloudflare Specials | ...72612a5b | 100568 | Cacti - Remote Code Execution - CVE:CVE-2022-46169 | 2023-02-27 | N/A | Block |
| Cloudflare Specials | ...a6fda143 | 100563 | Template Injection | 2023-02-13 | N/A | Block |
| Cloudflare Specials | ...b090ba9a | 100303 | Command Injection - Nslookup | 2023-02-13 | N/A | Block |
| Cloudflare Specials | ...0550c529 | 100016 | Version Control - Information Disclosure | 2023-02-13 | N/A | Block |
| Cloudflare Specials | ...d3cdd6ac | 100561 | Remote Code Execution - Double Extension | 2023-02-13 | N/A | Block |
| Cloudflare Specials | ...f2cc4e84 | 100524 | Java - Remote Code Execution | 2023-02-06 | N/A | Block |
| Cloudflare Specials | ...1b4e622e | 100560 | Microsoft Exchange - Broken Authentication - CVE:CVE-2021-33766 | 2023-02-06 | N/A | Block |
| Cloudflare Specials | ...de5e2367 | N/A | XSS - JavaScript Events | 2023-01-30 | N/A | Block |
| Cloudflare Specials | ...4c2e80c3 | 100557 | Code Injection - JavaScript | 2023-01-30 | N/A | Block |
| Cloudflare Specials | ...65414846 | 100559 | Prototype pollution Attack, Headers | 2023-01-30 | N/A | Block |
| Cloudflare OWASP | ...fc25d2f1f | N/A | Rollback Cloudflare OWASP to version 3.3.3 from 3.3.4 | 2023-01-24 | N/A | N/A |
| Cloudflare Specials | ...8b036974 | 100558 | Malware, Web Shell | 2023-01-16 | N/A | Log |
| Cloudflare Specials | N/A | 100135C | XSS - JavaScript Events | 2023-01-16 | N/A | Block |
| Cloudflare OWASP | ...fc25d2f1f | N/A | Upgrading Cloudflare OWASP to version 3.3.4 | 2023-01-16 | N/A | N/A |
| Cloudflare Specials | ...b604fb62 | 100551B | Microsoft Exchange SSRF and RCE vulnerability 2 - CVE:CVE-2022-41040,
CVE:CVE-2022-41082 | 2023-01-09 | N/A | Block |

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

## Historical (2022)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2022/](https://developers.cloudflare.com/waf/change-log/historical-2022/)

Page options # Historical (2022)

| Ruleset | Rule ID | Legacy Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | ...2aede3db | 100554 | Openam - Remote Code Execution - CVE:CVE-2021-35464 | 2022-12-12 | N/A | Disabled |
| Cloudflare Specials | ...2ab75038 | 100556 | Apache JXPath Library - Code Injection - CVE:CVE-2022-41852 | 2022-12-12 | N/A | Disabled |
| Cloudflare Specials | ...b8ef67d7 | N/A | SQLi - Equation | 2022-11-29 | N/A | Block |
| Cloudflare Specials | ...128f1556 | N/A | SQLi - Generic | 2022-11-14 | N/A | Block |
| Cloudflare Specials | ...b9cfd82d | 100552 | JXPath RCE - CVE:CVE-2022-41852 | 2022-10-31 | N/A | Block |
| Cloudflare Specials | ...66edb651 | 100555 | Apache Commons Text - Code Injection - CVE:CVE-2022-42889 | Emergency, 2022-10-18 | N/A | Block |
| Cloudflare Specials | ...1bc977d1 | 100005 | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892,
CVE:CVE-2022-31474This detection was announced as ...845e3ec7 on new WAF. | 2022-10-17 | N/A | Block |
| Sensitive Data Disclosure (SDD) | ...eebf3863 | N/A | California Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...5b82d61c | N/A | Florida Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...d47285a0 | N/A | Illinois Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...9f7200b4 | N/A | New York Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...440ec8b9 | N/A | UK Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...c78cf1e1 | N/A | UK National Insurance Number
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...0f8f2657 | N/A | UK Passport
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...5fe4101e | N/A | US Passport
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Sensitive Data Disclosure (SDD) | ...0a290153 | N/A | Wisconsin Driver's License
This detection is part of Sensitive Data Disclosure (SDD). | 2022-10-17 | Log | Disable |
| Cloudflare Specials | ...e0de97a2 | 100553 | FortiOS - Authentication Bypass - CVE:CVE-2022-40684 | Emergency, 2022-10-14 | N/A | Block |
| Cloudflare Specials | ...ee9bb2f5 | 100549 | Atlassian Bitbucket - Code Injection - CVE:CVE-2022-36804 | 2022-10-10 | N/A | Block |
| Cloudflare Specials | ...1d870399 | 100546 | XSS - HTML Encoding | 2022-10-03 | N/A | Block |
| Cloudflare Specials | ...e09c1a1e | 100551 | Microsoft Exchange SSRF and RCE vulnerability - CVE:CVE-2022-41040,
CVE:CVE-2022-41082 | Emergency, 2022-10-03 | N/A | Block |
| Cloudflare Specials | ...ee9bb2f5 | 100549 | Atlassian Bitbucket - Code Injection - CVE:CVE-2022-36804 | Emergency, 2022-09-20 | N/A | Block |
| Cloudflare Specials | ...cfd0fac1 | 100135A | XSS - JavaScript Events
This detection was announced in BETA with ID ...92c2ad9f on new WAF and
ID 100135A_BETA on legacy WAF. | 2022-09-12 | Block | Block |
| Cloudflare Specials | ...e09c1a1e | 100542 | Broken Authentication - VMware - CVE:CVE-2022-31656,
CVE:CVE-2022-22972This detection was announced in BETA with ID ...df7d4d7b on new WAF and
ID 100542_BETA on legacy WAF. | 2022-09-12 | Block | Block |
| Cloudflare Specials | ...36fe4cbb | 100547 | Sophos Firewall Auth Bypass Vulnerability - CVE:CVE-2022-1040 | 2022-09-12 | N/A | Block |
| Cloudflare Specials | ...4529da66 | 100504 | Atlassian - CVE:CVE-2021-26086 | 2022-09-12 | N/A | Block |
| Cloudflare Specials | ...b090ba9a | 100303 | Command Injection - Nslookup
This detection was announced in BETA with ID ...d5488862 on new WAF and
ID 100303_BETA on legacy WAF. | 2022-09-05 | Block | Block |
| Cloudflare Specials | ...3a9dc737 | 100532B | Vulnerability scanner activity 2 | 2022-08-30 | N/A | Disable |
| Cloudflare Specials | ...9b16ea5e | N/A | CVE-2020-13443 | 2022-08-30 | N/A | Block |
| Cloudflare Specials | ...fd9eb416 | 100541 | Code Injection - WordPress Weblizar Backdoor - CVE:CVE-2022-1609 | 2022-08-22 | N/A | Block |
| Cloudflare Specials | ...e09c1a1e | 100542 | Broken Authentication - VMware - CVE:CVE-2022-31656 | 2022-08-22 | N/A | Block |
| Cloudflare Specials | ...9ff2129f | 100544 | Zimbra - Command Injection - CVE:CVE-2022-27925, CVE:CVE-2022-30333 | 2022-08-22 | N/A | Block |
| Cloudflare Specials | ...94700cae | N/A | Drupal, Magento, PHP - Deserialization - CVE:CVE-2019-6340,
CVE:CVE-2016-4010 - 2 | 2022-08-22 | N/A | Block |
| Cloudflare Specials | ...1bc977d1 | 100005 | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892 | 2022-08-22 | N/A | Block |
| Cloudflare Specials | ...8e2e15a5 | N/A | SQLi - Strict | 2022-08-15 | N/A | Disable |
| Cloudflare Specials | ...25ba9d7c | N/A | SSRF - Cloud | 2022-08-15 | N/A | Disable |
| Cloudflare Specials | ...8242627b | N/A | SSRF - Local | 2022-08-15 | N/A | Disable |
| Cloudflare Specials | ...74a51804 | N/A | SSRF - Host | 2022-08-15 | N/A | Disable |
| Cloudflare Specials | ...d77be6e7 | 100540 | XSS, Code Injection - Elementor - CVE:CVE-2022-29455 | 2022-08-01 | N/A | Block |
| Cloudflare Specials | ...b21a6d17 | 100539 | Alibaba Fastjson Remote Code Execution - CVE:CVE-2022-25845 | 2022-08-01 | N/A | Block |
| Cloudflare Specials | ...49e6b538 | 100534 | Webshell Activity | 2022-08-01 | N/A | Block |
| Cloudflare Specials | ...8d667511 | N/A | NoSQL, MongoDB - SQLi - Comparison | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...6418cd0a | N/A | NoSQL, MongoDB - SQLi - Expression | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...0d64e8c3 | N/A | PostgreSQL - SQLi - COPY | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...fe93af88 | N/A | SQLi - AND/OR Digit Operator Digit | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...5dfbd021 | N/A | SQLi - AND/OR Digit Operator Digit - 2 | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...95cb1c78 | N/A | SQLi - AND/OR MAKE_SET/ELT | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...33a94329 | N/A | SQLi - Benchmark Function | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...a0ac8609 | N/A | SQLi - Equation | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...e3f62041 | N/A | SQLi - ORD and ASCII | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...5dcf99b7 | N/A | SQLi -SELECT
Expression | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...2514d20d | N/A | SQLi - Sleep Function | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...cf1914a0 | N/A | SQLi - String Concatenation | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...484037ce | N/A | SQLi - String Function | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...42123a6c | N/A | SQLi - Sub Query | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...d7aa0008 | N/A | SQLi -UNION
in MSSQL | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...3306fcc2 | N/A | SQLi - WaitFor Function | 2022-08-01 | N/A | Disable |
| Cloudflare Specials | ...1651d0c8 | 100536 | GraphQL Injection | 2022-07-25 | N/A | Block |
| Cloudflare Specials | ...6a648210 | 100537 | Oracle ADF Remote Code Execution - CVE:CVE-2022-21445 | 2022-07-25 | N/A | Block |
| Cloudflare Specials | ...2753531e | 100533 | NoSQL - Injection | 2022-07-18 | N/A | Block |
| Cloudflare Specials | ...49e6b538 | 100534 | Web Shell Activity | 2022-07-18 | N/A | Block |
| Cloudflare Specials | ...851d2f71 | 100007C | Command Injection - Common Attack Commands | 2022-07-18 | N/A | Block |
| Cloudflare Specials | ...aa290ad9 | 100135D | XSS - JS On Events | 2022-07-18 | N/A | Block |
| Cloudflare Specials | N/A | 100045B | Anomaly:Header, Directory Traversal - Multiple Slashes, Relative Paths,
CR, LF or NULL | 2022-07-06 | Log | Block |
| Cloudflare Specials | ...34780914 | 100532 | Vulnerability scanner activity | 2022-07-05 | N/A | Block |
| Cloudflare Specials | ...d503ded0 | N/A | XSS, HTML Injection | 2022-06-20 | N/A | Disable |
| Cloudflare Specials | ...fd09a0e6 | N/A | XSS - JavaScript Events | 2022-06-20 | N/A | Disable |
| Cloudflare Specials | ...f4b0220e | 100703 | Validate Headers | Emergency, 2022-06-10 | N/A | Block |
| Cloudflare Specials | ...408cff2b | 100531 | Atlassian Confluence - Code Injection - CVE:CVE-2022-26134 (rule
improvement) | Emergency, 2022-06-07 | N/A | Block |
| Cloudflare Specials | ...0c99546a | 100702 | Command Injection - CVE:CVE-2022-24108 | 2022-06-06 | N/A | Block |
| Cloudflare Specials | ...e184d050 | 100701 | Command Injection - CVE:CVE-2022-30525 | 2022-06-06 | N/A | Block |
| Cloudflare Specials | ...56c390a1 | N/A | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892 2 | 2022-06-06 | N/A | Block |
| Cloudflare Specials | ...3456f611 | N/A | XXE - System Function | 2022-06-06 | N/A | Block |
| Cloudflare Specials | ...ae5baf61 | 100005 | DotNetNuke - File Inclusion - CVE:CVE-2018-9126, CVE:CVE-2011-1892 | 2022-06-06 | N/A | Block |
| Cloudflare Specials | ...bb44c04a | 100531B | Atlassian Confluence - Code Injection - Extended - CVE:CVE-2022-26134 | Emergency, 2022-06-04 | N/A | Disabled |
| Cloudflare Specials | ...408cff2b | 100531 | Atlassian Confluence - Code Injection - CVE:CVE-2022-26134 (rule
improvement) | Emergency, 2022-06-04 | N/A | Block |
| Cloudflare Specials | ...408cff2b | 100531 | Atlassian Confluence - Code Injection - CVE:CVE-2022-26134 | Emergency, 2022-06-03 | N/A | Block |
| Cloudflare Specials | ...408cff2b | 100531 | Atlassian Confluence - Code Injection - CVE:CVE-2022-26134 (rule
improvement) | Emergency, 2022-06-03 | N/A | Block |
| Cloudflare Specials | ...408cff2b | 100531 | Atlassian Confluence - Code Injection - CVE:CVE-2022-26134 (rule
improvement) | Emergency, 2022-06-03 | N/A | Block |
| Cloudflare Specials | ...0d20ddd9 | 100054 | Improve Apache Struts detection. Merge 100054_BETA into 100054 and
...f0c856b4 into ...0d20ddd9. Apache Struts - Command Injection -
CVE:CVE-2017-5638. | 2022-05-30 | N/A | Block |
| Cloudflare Specials | ...e1787c92 | N/A | Microsoft Exchange - Code Injection | 2022-05-16 | N/A | Block |
| Specials | ...d6e3073f | 100530 | Command Injection - RCE in BIG-IP - CVE:CVE-2022-1388 | Emergency, 2022-05-10 | N/A | Block |
| Cloudflare Specials | ...02a9ee96 | 100528 | Code Injection - CVE:CVE-2022-29078 | 2022-05-09 | N/A | Block |
| Cloudflare Specials | ...422313d0 | 100529 | VMware vCenter - CVE:CVE-2021-22054 | 2022-05-09 | N/A | Block |
| Cloudflare Specials | ...370dc796 | N/A | PostgreSQL - SQLi, Command Injection - CVE:CVE-2019-9193 | 2022-05-09 | N/A | Disable |
| Cloudflare Specials | ...61337861 | 100056_BETA | Apache Struts - Code Injection - CVE:CVE-2017-9791 - Beta | 2022-04-25 | Disable | Block |
| Cloudflare Specials | ...bb70a463 | 100527 | Apache Struts - CVE:CVE-2021-31805 | 2022-04-25 | Disable | Block |
| Cloudflare Specials | ...a24f08b7 | 100526 | VMware vCenter - CVE:CVE-2022-22954 | 2022-04-25 | Disable | Block |
| Cloudflare Specials | ...4343ef6b | N/A | Anomaly:Header:X-Forwarded-Host | 2022-04-20 | N/A | Disable |
| Cloudflare Specials | ...ad8ba4bc | N/A | Anomaly:Header:Content-Length - Missing in POST | 2022-04-20 | N/A | Disable |
| Cloudflare Specials | ...cc74ff69 | N/A | Anomaly:Header:Accept - Missing or Empty | 2022-04-20 | N/A | Disable |
| Cloudflare Specials | ...041699fb | N/A | Practico CMS - SQLi | 2022-04-20 | N/A | Disable |
| Cloudflare Specials | ...4751ef80 | N/A | Joomla - Anomaly:Header:User-Agent | 2022-04-20 | N/A | Disable |
| Cloudflare Specials | ...f2cc4e84 | 100524 | Spring - Code Injection | 2022-04-11 | N/A | Block |
| Cloudflare Specials | ...4e742bb6 | N/A | Drupal - Header Injection - CVE:CVE-2018-14774 | 2022-04-11 | N/A | Disable |
| Cloudflare Specials | ...e46c6d76 | N/A | Drupal - XSS - CVE:CVE-2018-9861 | 2022-04-11 | N/A | Disable |
| Specials | ...f2cc4e84 | 100524 | Spring - Code Injection | Emergency, 2022-04-04 | Simulate | Block |
| Specials | ...fbe6c869 | 100522 | Spring - CVE:CVE-2022-22947 | Emergency, 2022-04-04 | Simulate | Block |
| Specials | ...f2cc4e84 | 100524 | Spring - Code Injection | Emergency, 2022-03-31 | N/A | Simulate |
| Specials | ...fbe6c869 | 100522 | Spring - CVE:CVE-2022-22947 | Emergency, 2022-03-29 | N/A | Simulate |
| Cloudflare Specials | ...e7c9a2c4 | 100519B | Magento - CVE:CVE-2022-24086 | 2022-03-14 | N/A | Block |
| Cloudflare Specials | ...a37c3733 | 100520 | Apache - CVE:CVE-2022-24112 | 2022-03-14 | N/A | Block |
| Cloudflare Specials | ...664ed6fe | 100015 | Anomaly:Port - Non Standard Port (not 80 or 443) | 2022-03-14 | N/A | Disable |
| Cloudflare Specials | ...5723bcc9 | 100022 | Anomaly:Method - Not
GET
or
POST | 2022-03-14 | N/A | Disable |
| Cloudflare Specials | ...3fccf643 | 100519 | Magento - CVE:CVE-2022-24086 | 2022-03-07 | N/A | Block |
| Cloudflare Specials | ...5ea3d579 | 100518 | SAP - Code Injection - CVE:CVE-2022-22532 | 2022-02-28 | N/A | Block |
| Cloudflare Specials | ...69e0b97a | 100400 | Atlassian Confluence - Code Injection - CVE:CVE-2021-26084 - Improve
Rule Coverage | 2022-02-21 | Block | Block |
| Cloudflare Specials | N/A | PHP100001 | PHP - Command Injection - CVE:CVE-2012-2336, CVE:CVE-2012-2311,
CVE:CVE-2012-1823 | 2022-02-14 | Challenge | Block |
| Cloudflare Specials | ...dc29b753 | 100515B | Log4j Body Obfuscation | 2022-02-14 | N/A | Block |
| Cloudflare Specials | ...69fe1e0d | 100700 | Apache SSRF vulnerability CVE-2021-40438 | 2022-01-24 | N/A | Block |

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

## Historical (2021)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2021/](https://developers.cloudflare.com/waf/change-log/historical-2021/)

Page options # Historical (2021)

| Ruleset | Rule ID | Legacy Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- | --- |
| Specials | ...fe5abb10 | 100515 | Log4j RCE Body - CVE-2021-44228 | Emergency, 2021-12-16 | Block | Block |
| Specials | ...60ba67d7 | 100517 | Log4j RCE Advanced URI, Headers - CVE-2021-44228 | Emergency, 2021-12-14 | N/A | Disabled |
| Specials | ...74430f12 | 100514 | Log4j RCE Headers - CVE-2021-44228 | Emergency, 2021-12-10 | N/A | Block |
| Specials | ...fe5abb10 | 100515 | Log4j RCE Body - CVE-2021-44228 | Emergency, 2021-12-10 | N/A | Block |
| Specials | ...d5e015dd | 100516 | Log4j RCE URI - CVE-2021-44228 | Emergency, 2021-12-10 | N/A | Block |
| Specials | ...1c8e7f7f | 100009B3 | SQLi - ORDER/GROUP BY | 2021-11-01 | N/A | Disabled |
| Specials | N/A | 100201_2 | Anomaly:Header:User-Agent - Fake Google Bot | 2021-11-01 | N/A | Block |
| Specials | N/A | 100202_2 | Anomaly:Header:User-Agent - Fake Bing or MSN Bot | 2021-11-01 | N/A | Block |
| Specials | N/A | 100203_2 | Anomaly:Header:User-Agent - Fake Yandex Bot | 2021-11-01 | N/A | Block |
| Specials | N/A | 100204_2 | Anomaly:Header:User-Agent - Fake Baidu Bot | 2021-11-01 | N/A | Block |
| Specials | ...88d80772 | 100008E2 | SQLi - AND/OR Digit Operator Digit | 2021-10-25 | N/A | Block |
| Specials | ...a72a6b3a | 100009CB2 | SQLi - Equation | 2021-10-25 | N/A | Block |
| Specials | ...2ebc44ad | 100008D | SQLi - Benchmark Function | 2021-10-25 | N/A | Block |
| Specials | ...521e1eff | WP0036 | WordPress - Broken Access Control | 2021-10-19 | N/A | Block |
| Specials | ...cfd0fac1 | 100135A | XSS - JavaScript Events - Improve Rule Coverage | 2021-10-04 | Block | Block |
| Specials | ...95afef63 | 100135B | XSS - JavaScript Events - Improve Rule Coverage | 2021-10-04 | Block | Block |
| Specials | ...b3de2e0a | 100410 | SQLi - Tautology - URI | 2021-10-04 | N/A | Block |
| Specials | ...cfd0fac1 | 100135A | XSS - JavaScript Events - Improve Rule Coverage | 2021-09-06 | Block | Block |
| Specials | ...de5e2367 | 100135C | XSS - JavaScript Events - Improve Rule Coverage | 2021-09-06 | Block | Block |
| Specials | ...901dddd0 | 100139D | XSS, HTML Injection - Data URI - Improve Rule Coverage | 2021-09-06 | Block | Block |
| Specials | ...69e0b97a | 100400 | Atlassian Confluence - Code Injection - CVE:CVE-2021-26084 | Emergency, 2021-09-01 | N/A | Block |
| Specials | ...6aa0bef8 | 100201 | Anomaly:Header:User-Agent - Fake Google Bot | 2021-08-31 | Block | Block |
| Specials | ...c12cf9c8 | 100202 | Anomaly:Header:User-Agent - Fake Bing or MSN Bot | 2021-08-31 | Block | Block |
| Specials | ...f6cbb163 | 100203 | Anomaly:Header:User-Agent - Fake Yandex Bot | 2021-08-31 | Block | Block |
| Specials | ...047f06b4 | 100204 | Anomaly:Header:User-Agent - Fake Baidu Bot | 2021-08-31 | Block | Block |
| Specials | ...090d53ee | 100045 | Anomaly:URL:Path - Multiple Slashes, Relative Paths, CR, LF or NULL | 2021-08-23 | Disabled | Disabled |
| Specials | ...603649a2 | 100210 | Laravel - Code Injection - CVE-2021-3129 | 2021-08-16 | N/A | Block |
| Specials | ...fe8ceb2f | 100045A | Anomaly:URL:Query String - Multiple Slashes, Relative Paths, CR, LF or
NULL | 2021-08-16 | N/A | Disabled |
| OWASP XSS (URI) | N/A | uri-973345 | Improve rule performance | 2021-07-26 | Scoring Based | Scoring Based |
| OWASP XSS | N/A | 973345 | Improve rule performance | 2021-07-26 | Scoring Based | Scoring Based |
| Specials | N/A | 100009 | Improve rule performance | 2021-07-26 | Block | Block |
| Specials | ...54622f7d | 100200 | Anomaly Header: Content-Type - Missing | 2021-07-26 | N/A | Disabled |
| OWASP XSS (URI) | N/A | uri-973346 | Improve Rule Performance | 2021-07-19 | Scoring Based | Scoring Based |
| OWASP XSS (URI) | N/A | uri-973322 | Improve Rule performance | 2021-07-19 | Scoring Based | Scoring Based |
| OWASP XSS | N/A | 973346 | Improve Rule performance | 2021-07-19 | Scoring Based | Scoring Based |
| OWASP XSS | N/A | 973322 | Improve Rule performance | 2021-07-19 | Scoring Based | Scoring Based |
| Cloudflare Specials | N/A | 100197 | Block ReGeorg webshell | Emergency, 2021-07-01 | N/A | Block |
| Cloudflare Specials | N/A | 100197B | Block ReGeorg webshell | Emergency, 2021-07-01 | N/A | Disabled |
| Specials | N/A | 100196 | CVE-2021-21985 VSphere Virtual SAN Health Check | 2021-06-21 | N/A | Block |
| Specials | N/A | 100136A | Improve rule performance | 2021-06-21 | Block | Block |
| Specials | N/A | 100139A | Improve rule performance | 2021-06-14 | Disabled | Disabled |
| Specials | N/A | 100139B | Improve rule performance | 2021-06-14 | Block | Block |
| Specials | N/A | 100139C | Improve rule performance | 2021-06-14 | Block | Block |
| Specials | N/A | 100195 | Microsoft HTTP Protocol Stack Remote Code Execution Vulnerability
CVE-2021-31166 | 2021-06-07 | N/A | Block |
| WordPress | N/A | WP0025D | Improve Rule Performance | 2021-06-01 | Block | Block |
| WordPress | N/A | WP0026 | Improve Rule Coverage | 2021-06-01 | Block | Block |
| WordPress | N/A | WP0023 | Improve Rule Performance - Supersedes 100245 | 2021-06-01 | Block | Block |
| Specials | N/A | 100245 | Remove 100245 (WordPress - Broken Access Control - Update Script) -
Superseded by WP0023 | 2021-06-01 | Block | Disabled |
| Drupal | N/A | D0000 | Improve Rule Coverage | 2021-06-01 | Block | Block |
| PHP | N/A | PHP100012 | Improve Rule Coverage | 2021-06-01 | Block | Block |
| Specials | N/A | 100222 | Improve Rule Coverage | 2021-06-01 | Disabled | Disabled |
| Cloudflare Specials | N/A | 100188A | CVE-2021-22893 Pulse Secure Vendor Workaround | Emergency, 2021-04-21 | N/A | Block |
| Cloudflare Specials | N/A | 100038 | Improve Information Disclosure Coverage | 2021-04-19 | Block | Block |
| Cloudflare Specials | N/A | 100185A | Deprecated Short PHP Open Tag (<?) Mitigation | 2021-03-22 | N/A | Disable |
| Cloudflare Specials | N/A | 100179 | Improve Rule Performance | 2021-03-08 | Block | Block |
| Cloudflare Specials | N/A | 100181 | Microsoft Exchange - Code Injection - CVE-2021-26858 - CVE-2021-27065 | Emergency, 2021-03-06 | N/A | Block |
| Cloudflare Specials | N/A | 100179 | Microsoft Exchange - SSRF - CVE-2021-26855 | Emergency, 2021-03-05 | N/A | Block |
| Cloudflare Specials | N/A | 100005 | Improve LFI Log Injection/Disclosure coverage | 2021-03-01 | Block | Block |

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

## Historical (2020)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2020/](https://developers.cloudflare.com/waf/change-log/historical-2020/)

Page options # Historical (2020)

| Ruleset | Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- |
| Cloudflare Drupal | D0025 | CVE:CVE-2020-13671 | 2020-12-14 | N/A | Block |
| Cloudflare Specials | 100048 | Improve body anomaly detection | 2020-12-02 | Disable | Disable |
| Cloudflare Specials | 100502 | CVE:CVE-2020-13443 | 2020-11-16 | N/A | Block |
| Cloudflare WordPress | WP0017 | WordPress - SQLi - CVE:CVE-2015-2213 fix | 2020-11-16 | Block | Block |
| Cloudflare Specials | 100501 | Oracle WebLogic - Deserialization - CVE:CVE-2020-14882,
CVE:CVE-2020-14883, CVE:CVE-2020-14750 | Emergency, 2020-11-05 | N/A | Block |
| Cloudflare Specials | 100164 | SaltStack - Command Injection - CVE-2020-16846 | Emergency, 2020-11-04 | N/A | Block |
| Cloudflare Specials | 100164_JSON | SaltStack - Command Injection - CVE-2020-16846 | Emergency, 2020-11-04 | N/A | Block |
| Cloudflare Specials | 100164_YAML | SaltStack - Command Injection - CVE-2020-16846 | Emergency, 2020-11-04 | N/A | Block |
| Cloudflare Specials | 100124 | Improve Command Injection detection | 2020-10-19 | Disabled | Disabled |
| Cloudflare Specials | 100175 | Anomaly:Header:X-Up-Devcap-Post-Charset - Evasion | 2020-10-12 | N/A | Block |
| Cloudflare Specials | 100500 | October CMS - File Inclusion | 2020-10-12 | N/A | Block |
| Cloudflare Specials | 100600 | Improve XSS detection | 2020-10-05 | N/A | Block |
| Cloudflare Specials | 100016 | Improve Information Disclosure detection | 2020-09-28 | Block | Block |
| Cloudflare WordPress | 100189 | WordPress - Command Injection | 2020-09-21 | Log | Block |
| Cloudflare Specials | 100131 | Improve JSFuck XSS detection. Merges 100131_BETA into 100131. | 2020-09-21 | Disabled | Block |
| Cloudflare Specials | 100131_BETA | XSS - JSFuck | 2020-09-15 | N/A | Log |
| Cloudflare Specials | 100173 | Improve XSS detection | 2020-09-07 | Block | Block |
| Cloudflare Specials | 100304 | Improve performance | 2020-09-07 | Disabled | Disabled |
| Cloudflare Specials | 100455 | XSS - Catch Injection | 2020-09-07 | N/A | Block |
| Cloudflare Specials | 100065 | Anomaly:URL:Query String - Relative Paths | 2020-09-01 | N/A | Disabled |
| Cloudflare Specials | 100166 | vBulletin - Code Injection - CVE:CVE-2019-16759 | 2020-08-24 | Block | Block |
| Cloudflare WordPress | WP0025B | Improve performance | 2020-08-03 | Block | Block |
| Cloudflare Specials | 100045 | Anomaly:URL - Multiple Slashes, Relative Paths, CR, LF or NULL | 2020-08-03 | Disable | Disable |
| Cloudflare Specials | 100315 | RCE in BIG-IP Traffic Management User Interface - CVE:CVE-2020-5902 | 2020-08-03 | Block | Block |
| Cloudflare Miscellaneous | 100317 | vBulletin - SQLi - CVE:CVE-2020-12720 | 2020-07-27 | N/A | Block |
| Cloudflare Specials | 100139D | XSS | 2020-07-27 | Block | Block |
| Cloudflare Specials | 100318 | Anomaly:Method - Unknown HTTP Method | 2020-07-20 | N/A | Disable |
| Cloudflare Specials | 100319 | Anomaly:Method - Unusual HTTP Method | 2020-07-20 | N/A | Disable |
| Cloudflare Specials | 100031 | Improve performance | 2020-07-13 | Block | Block |
| Cloudflare Specials | 100071 | Improve performance | 2020-07-13 | Disable | Disable |
| Cloudflare Specials | 100315 | RCE in BIG-IP Traffic Management User Interface - CVE:CVE-2020-5902 | Emergency, 2020-07-07 | N/A | Block |
| Cloudflare Specials | 100310 | Improve Apache Struts code injection detection | 2020-06-22 | Block | Block |
| Cloudflare Specials | 100135A | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100135C | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100136C | Improve XSS detection | 2020-06-15 | Block | Block |
| Cloudflare Specials | 100045 | Improve URL anomaly detection | 2020-06-15 | Challenge | Disable |
| Cloudflare Misc | 100075 | Block HULK DoS | 2020-06-08 | Disable | Disable |
| Cloudflare Specials | 100307 | Improve XSS detection | 2020-06-08 | Block | Block |
| Cloudflare Specials | 100174 | XSS - JS Context Escape | 2020-05-25 | Block | Block |
| Cloudflare Specials | 100008C | Sleep Function | 2020-05-11 | Block | Block |
| Cloudflare Specials | 100307 | jQuery URI XSS | 2020-05-11 | N/A | Block |
| Cloudflare Specials | 100303 | Command Injection - Nslookup | 2020-05-11 | Disabled | Disabled |
| Cloudflare Specials | 100124 | Command Injection - Nslookup | 2020-05-11 | Disabled | Disabled |
| Cloudflare Specials | 100303 | Nslookup | 2020-05-04 | N/A | Disable |
| Cloudflare Specials | 100304 | Server-Side Includes | 2020-05-04 | N/A | Disable |
| Cloudflare Specials | 100124 | Sleep | 2020-05-04 | N/A | Disable |
| Cloudflare Specials | 100008 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100008E | Improve performance | 2020-04-27 | N/A | Block |
| Cloudflare Specials | 100008CW | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100008D | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100158 | Improve performance | 2020-04-27 | N/A | Block |
| Cloudflare Specials | 100106 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100106B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100140 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100089 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100162 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100026 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100018 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100018B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100232 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100005 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100135A | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100135C | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100136C | Improve XSS detection, false positive rate and performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100167 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100168 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100169 | Improve performance | 2020-04-27 | Disable | Disable |
| Cloudflare Specials | 100170 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100171 | Improve performance | 2020-04-27 | Disable | Disable |
| Cloudflare Specials | 100172 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100173 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100174 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100221 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100222 | Improve HTML Injection detection and performance | 2020-04-27 | Disable | Disable |
| Cloudflare Specials | 100156 | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100139A | Improve performance | 2020-04-27 | Disable | Disable |
| Cloudflare Specials | 100139B | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100139C | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Specials | 100139D | Improve performance | 2020-04-27 | Block | Block |
| Cloudflare Magento | MG0003B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Drupal | D0013 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Drupal | D0014 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Drupal | D0001 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare PHP | PHP100004 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare PHP | PHP100008 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare PHP | PHP100009 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare PHP | PHP100010 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Miscellaneous | CFMISC0001 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Miscellaneous | CFMISC0002 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Miscellaneous | CFMISC0003 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Miscellaneous | CFMISC0010 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Miscellaneous | CFMISC0011 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WHMCS | WHMCS0001 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WHMCS | WHMCS0002 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WHMCS | WHMCS0003 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900044 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900122 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900123 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900124 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900125 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900126 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 900127 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 999003 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | 100000 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0001 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0005 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0006 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0007 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0015 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare WordPress | WP0018 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100002 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100002A | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100005A | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100105HEADERS | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100105 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100116 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100109B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100006 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100007B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100009C | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100009EP | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100009EP | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100009EF | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100009L | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100010C | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100014B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100017 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100020 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100032 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100039B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100046 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100052B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100056 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100057 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100058 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100060 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100064 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100066 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100067 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100068 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100068B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100074 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100076 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100077B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100078 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100078B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100082 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100086 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100086B | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100088 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100088C | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100095 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100097 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100099 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100100 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100104 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100108ARGS | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100109 | Deprecated | 2020-04-27 | N/A | Disable |
| Cloudflare Specials | 100310 | Apache Struts code injection | 2020-04-27 | N/A | Block |
| Cloudflare Specials | 100305 | ASP.NET - Deserialization - CVE:CVE-2019-18935 | 2020-04-20 | N/A | Disable |
| Cloudflare Specials | 100306 | Improve SQLi detection | 2020-04-20 | N/A | Block |
| Cloudflare PHP | PHP100011ARGS | Deprecated | 2020-04-20 | N/A | Disable |
| Cloudflare PHP | PHP100011COOKIE | Deprecated | 2020-04-20 | N/A | Disable |
| Cloudflare Specials | 100135A | Improve XSS detection. Merge 100135A_BETA into 100135A. | 2020-04-06 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection. Merge 100136A_BETA into 100136A. | 2020-04-06 | Block | Block |
| Cloudflare Specials | 100301 | SQLi detection improvement on TRUNCATE-like statements | 2020-03-30 | Block | Block |
| Cloudflare Specials | 100300 | Improve SQL Operators support to prevent SQL Injection | 2020-03-23 | N/A | Block |
| Cloudflare Specials | 100302 | SQLi detection improvement on for UNION-like statements | 2020-03-23 | N/A | Block |
| Cloudflare Specials | 100135B | Improve XSS detection. Merge 100135B_BETA into 100135B. | 2020-03-23 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection. Merge 100136B_BETA into 100136B. | 2020-03-23 | Block | Block |
| N/A | N/A | Logging for rules in the OWASP rule group has been improved by removing
duplicate and empty log events. | 2020-03-12 | N/A | N/A |
| Cloudflare Specials | 100162 | SQLi improvement on SELECT FROM TABLE statements | 2020-03-09 | Block | Block |
| Cloudflare Specials | 100201 | Improve Fake Google Bot detection | Emergency release, 2020-03-02 | Block | Block |
| Cloudflare Specials | 100005 | Improve File Inclusion detection | Emergency release, 2020-03-02 | Block | Block |
| Cloudflare Specials | 100007NS | Improve Command Injection detection | Emergency release, 2020-03-02 | Block | Block |
| Cloudflare Specials | 100049A | Improve GraphicsMagick, ImageMagick attack detection. Merge 100049A_BETA
into 100049A. | 2020-02-17 | Block | Block |
| Cloudflare Specials | 100220 | Improve XSS detection. Merge 100220_BETA into 100220. | 2020-02-10 | Disable | Disable |
| Cloudflare Specials | 100221 | Improve XSS detection. Merge 100221_BETA into 100221. | 2020-02-10 | Disable | Disable |
| Cloudflare Specials | 100024 | Deprecated | 2020-02-10 | Block | Disable |
| Cloudflare Specials | 100042 | Deprecated | 2020-02-10 | Disable | Disable |
| Cloudflare Specials | 100112B | Deprecated | 2020-02-10 | Disable | Disable |
| Cloudflare Specials | 100029 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100043 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100047WP | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100012 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100013 | Superseded by 100220, 100221 | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100050 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100051 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100034 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100028 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100014 | Deprecated | 2020-01-27 | Disable | Disable |
| Cloudflare Specials | 100186 | Superseded by 100026 | 2020-01-27 | Block | Disable |
| Cloudflare Specials | 100038 | Reduce false positive rate. Merge 100038_BETA into 100038. | 2020-01-27 | Block | Block |
| Cloudflare Specials | 100043A | Improve performance. Merge 100043A_BETA into 100043A. | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100043B | Improve performance. Merge 100043B_BETA into 100043B. | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100243 | Improve Joomla SQLi detection | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100244 | Improve Adobe Flash attack detection | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100245 | Improve WordPress Broken Access Control Update Script detection | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100246 | Improve WordPress EWWW Image Optimizer Command Injection detection | 2020-01-27 | N/A | Block |
| Cloudflare Specials | 100247 | Improve WordPress API validation | 2020-01-27 | N/A | Block |
| Cloudflare Flash | F0001 | Superseded by 100244 | 2020-01-27 | Challenge | Disable |
| Cloudflare Flash | F0002 | Superseded by 100244 | 2020-01-27 | Challenge | Disable |
| Cloudflare Specials | 100201 | Block fake Google bots | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100202 | Block fake Bing and MSN bots | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100203 | Block fake Yandex bots | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100204 | Block fake Baidu bots | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100035D | Superseded by 100201 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100035 | Superseded by 100201 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100035C | Superseded by 100201 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100035B | Superseded by 100202 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100035Y | Superseded by 100203 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100035U | Superseded by 100204 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100037 | Superseded by 100204 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100112 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | WP0029 | Improve performance. Merge WP0029_BETA into WP0029. | 2020-01-20 | Block | Block |
| Cloudflare Specials | WP0011 | Improve performance. Superseded by 100233. | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100233 | Improve performance | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100220 | Improve XSS and HTML Injection detection | 2020-01-20 | N/A | Disable |
| Cloudflare Specials | 100221 | Improve XSS and HTML Injection detection in request bodies | 2020-01-20 | N/A | Disable |
| Cloudflare Specials | 100096BASE | Superseded by 100220 | 2020-01-20 | N/A | Disable |
| Cloudflare Specials | 100096HTML | Superseded by 100220 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100096EVIL | Superseded by 100220 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100096BBASE | Superseded by 100220 | 2020-01-20 | N/A | Disable |
| Cloudflare Specials | 100096BHTML | Superseded by 100220 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100096BEVIL | Superseded by 100220 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100016 | Improve performance. Merge 100016_BETA into 100016. | 2020-01-20 | Block | Block |
| Cloudflare Specials | 100018 | Improve performance. Merge 100018_BETA into 100018. | 2020-01-20 | Block | Block |
| Cloudflare Specials | 100018B | Improve performance. Merge 100018B_BETA into 100018B. | 2020-01-20 | Block | Block |
| Cloudflare Specials | 100025 | Deprecated | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100089 | Improve performance. Merge 100089_BETA into 100089. | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100112 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100115 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100117 | Superseded by 100026 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100120C | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100121ARGS_GET | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100121URI | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100122 | Superseded by 100232 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100122ARGS | Superseded by 100232 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100122ARGS_GET | Superseded by 100232 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100132 | Improve performance. Merge 100132_BETA into 100132 | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100155 | Improve performance. Merge 100155_BETA into 100155. | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100230 | Improve Drupal Command Injection detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100198 | Improve Apache Struts Code Injection detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100199 | Improve Drupal Command Injection detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100231 | Improve PHP Deserialization detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100232 | Improve Code Injection, Deserialization with Stream Wrapper detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100234 | Improve WordPress Broken Access Control detection | 2020-01-20 | N/A | Block |
| Cloudflare Specials | 100084 | Superseded by 100170 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100030SVG | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021C | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021CE | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021CB | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021CD | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021CD2 | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021CD3 | Superseded by 100135A, 100135B, 100135C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021D | Superseded by 100136A, 100136B, 100136C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100107 | Superseded by 100136A, 100136B, 100136C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100107ARGS | Superseded by 100136A, 100136B, 100136C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100148 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100149 | Superseded by 100136A, 100136B, 100136C | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100030 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100030ARGS_STRICT | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100030ARGS_LOOSE | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021B | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021E | Superseded by 100139D | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021E | Superseded by 100139D | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100090 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100091 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100091B | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100092 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100093 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100133 | Superseded by 100173 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100137 | Superseded by 100174 | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100021H | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100113 | Deprecated | 2020-01-20 | Block | Disable |
| Cloudflare Specials | 100120C | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100120C | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Specials | 100112 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare PHP | PHP100002 | Superseded by 100232 | 2020-01-20 | Disable | Disable |
| Cloudflare Miscellaneous | CFMISC0004 | Superseded by 100198 | 2020-01-20 | Disable | Disable |
| Cloudflare Miscellaneous | CFMISC0005 | Deprecated | 2020-01-20 | Disable | Disable |
| Cloudflare Miscellaneous | CFMISC0011 | Improve performance | 2020-01-20 | Block | Block |
| Cloudflare Miscellaneous | CFMISC0014 | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Miscellaneous | CFMISC0014B | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Miscellaneous | CFMISC0015 | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Miscellaneous | CFMISC0016 | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Miscellaneous | CFMISC0016B | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Miscellaneous | CFMISC0017 | Superseded by 100199 | 2020-01-20 | Block | Disable |
| Cloudflare Drupal | D0016 | Superseded by 100232 | 2020-01-20 | Disable | Disable |
| Cloudflare Drupal | D0004 | Superseded by 100230 | 2020-01-20 | Block | Disable |
| Cloudflare Drupal | D0004B | Superseded by 100230 | 2020-01-20 | Block | Disable |
| Cloudflare Drupal | D0004C | Superseded by 100230 | 2020-01-20 | Block | Disable |
| Cloudflare Drupal | D0020 | Superseded by 100231 | 2020-01-20 | Block | Disable |
| Cloudflare Magento | MG0003A | Superseded by 100231 | 2020-01-20 | Block | Disable |
| OWASP | 960034 | Deprecated | 2020-01-20 | N/A | N/A |

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

## Historical (2019)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2019/](https://developers.cloudflare.com/waf/change-log/historical-2019/)

Page options # Historical (2019)

| Ruleset | Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | 100242 | Block Citrix Netscaler ADC -CVE-2019-19781 | Emergency, 2019-12-16 | N/A | Block |
| Cloudflare Specials | 100009CB | Improvement in Equation-like SQLi. Merge 100009CB_BETA into 100009CB. | 2019-12-16 | Block | Block |
| Cloudflare Specials | 100191 | Improvement CVE-2019-11043 detection. Merge 100191_BETA into 100191. | 2019-12-16 | Block | Block |
| Cloudflare OWASP | 9802140 | Minor change to reduce Gutenberg false positives | Emergency, 2019-11-25 | Scoring based | Scoring based |
| Cloudflare OWASP | 9802140_JSON | Minor change to reduce Gutenberg false positives | Emergency, 2019-11-25 | Scoring based | Scoring based |
| Cloudflare OWASP | 9802141 | Minor change to reduce Gutenberg false positives | Emergency, 2019-11-25 | Scoring based | Scoring based |
| Cloudflare OWASP | 9802141_JSON | Minor change to reduce Gutenberg false positives | Emergency, 2019-11-25 | Scoring based | Scoring based |
| Cloudflare OWASP | 960034 | Reduce false positives for requests made with HTTP 2 and 3 | Emergency, 2019-11-25 | Scoring based | Scoring based |
| Cloudflare Specials | 100148 | Disable outdated XSS rule by default | 2019-11-12 | Block | Disable |
| Cloudflare Specials | 100035C | Update valid Googlebot IP ranges | Emergency, 2019-11-07 | Block | Block |
| Cloudflare Specials | 100035D | Update valid Googlebot IP ranges | Emergency, 2019-11-07 | Disabled | Disabled |
| Cloudflare Specials | 100139A | Improve XSS detection. Merge 100139A_BETA into 100139A. | 2019-11-04 | Disable | Disable |
| Cloudflare Specials | 100139B | Improve XSS detection. Merge 100139B_BETA into 100139B. | 2019-11-04 | Block | Block |
| Cloudflare Specials | 100139C | Improve XSS detection. Merge 100139C_BETA into 100139C. | 2019-11-04 | Block | Block |
| Cloudflare Specials | 100139D | Improve XSS detection | 2019-11-04 | N/A | Block |
| Cloudflare Specials | 100173 | Improve XSS detection | 2019-11-04 | N/A | Block |
| Cloudflare Specials | 100030SVG | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100021C | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100021CE | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100021CB | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100021D | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100107 | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100030 | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100030ARGS_STRICT | Disable outdated XSS rule by default | 2019-11-04 | Challenge | Disable |
| Cloudflare Specials | 100021 | Disable outdated XSS rule by default | 2019-11-04 | Challenge | Disable |
| Cloudflare Specials | 100021B | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100021E | Disable outdated XSS rule by default | 2019-11-04 | Challenge | Disable |
| Cloudflare Specials | 100090 | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100091 | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100091B | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100092 | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100170 | Improve XSS detection. Merge 100170_BETA into 100170. | 2019-11-04 | Block | Block |
| Cloudflare Specials | 100021H | Disable outdated XSS rule by default | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100044 | Disabled obsolete rule by default. Merge 100044_BETA into 100044. | 2019-11-04 | Block | Disable |
| Cloudflare Specials | 100174 | Improve XSS detection | 2019-11-04 | N/A | Block |
| Cloudflare Specials | 100135B | Reduced false positive rate. Merge 100135B_BETA into 100135B. | 2019-11-04 | Block | Block |
| Cloudflare Specials | 100191 | Block CVE-2019-11043 | Emergency, 2019-10-27 | N/A | Block |
| Cloudflare Specials | 100035C | Improve Fake Google Bot detection. Merge 100035C_BETA into 100035C. | Emergency, 2019-10-23 | Block | Block |
| Cloudflare Specials | 100009CB | Improve Comparison-like SQL Injection detection. Merge 100009CB_BETA
into 100009CB. | 2019-10-21 | Block | Block |
| Cloudflare Specials | 100026 | Improve PHP Code Injection and File Upload detection | 2019-10-21 | Block | Block |
| Cloudflare Specials | 100186 | Block vBulletin vulnerability CVE-2019-17132 | 2019-10-21 | Log | Block |
| Cloudflare Specials | 100187 | Block vBulletin vulnerability CVE-2019-17132 | 2019-10-21 | Log | Block |
| Cloudflare Specials | 100035D | Improve Fake Google Bot detection. Merge 100035D_BETA into 100035D.
Change originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Disable | Disable |
| Cloudflare Specials | 100035 | Improve Fake Google Bot detection. Merge 100035_BETA into 100035. Change
originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Block | Block |
| Cloudflare Specials | 100035C | Improve Fake Google Bot detection. Merge 100035C_BETA into 100035C.
Change originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Block | Block |
| Cloudflare Specials | 100035B | Improve Fake Bing Bot detection. Merge 100035B_BETA into 100035B. Change
originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Block | Block |
| Cloudflare Specials | 100035Y | Improve Fake Yandex Bot detection. Merge 100035Y_BETA into 100035Y.
Change originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Block | Block |
| Cloudflare Specials | 100035U | Improve Fake Baidu Bot detection. Merge 100035U_BETA into 100035U.
Change originally scheduled for 2019-10-21. | Emergency, 2019-10-17 | Block | Block |
| Cloudflare Specials | 100135A | Improve XSS detection. Merge 100135A_UBETA into 100135A. | 2019-10-14 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS detection. Merge 100135B_UBETA into 100135B. | 2019-10-14 | Disable | Block |
| Cloudflare Specials | 100135C | Improve XSS detection. Merge 100135C_UBETA into 100135C. | 2019-10-14 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection. Merge 100136A_UBETA into 100136A. | 2019-10-14 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection. Merge 100136B_UBETA into 100136B. | 2019-10-14 | Block | Block |
| Cloudflare Specials | 100136C | Improve XSS detection. Merge 100136C_UBETA into 100136C. | 2019-10-14 | Block | Block |
| Cloudflare Specials | 100167 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Block |
| Cloudflare Specials | 100168 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Block |
| Cloudflare Specials | 100169 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Disable |
| Cloudflare Specials | 100170 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Block |
| Cloudflare Specials | 100171 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Disable |
| Cloudflare Specials | 100172 | Improve XSS and HTML Injection detection | 2019-10-14 | N/A | Block |
| Cloudflare WordPress | WP0015 | Disables outdated WordPress rule by default. If this rule's action is
set to anything other than the default, this change will have no effect. | 2019-10-07 | Block | Disable |
| Cloudflare Specials | 100008E | Improve SQLi protection | 2019-09-30 | Block | Block |
| Cloudflare Specials | 100008E | SQLi improvement | 2019-09-30 | Block | Block |
| Cloudflare Specials | 100166 | Block vBulletinCVE-2019-16759 | Emergency, 2019-09-26 | None | Block |
| Cloudflare OWASP | 9002140 | OWASP WordPress improvement | 2019-09-23 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002140_JSON | OWASP WordPress improvement | 2019-09-23 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002141 | OWASP WordPress improvement | 2019-09-23 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002141_JSON | OWASP WordPress improvement | 2019-09-23 | Scoring based | Scoring based |
| Cloudflare Specials | 100162 | SQLi improvement on
SELECT FROM TABLE
statements | 2019-09-23 | N/A | Block |
| Cloudflare Specials | 100160 | JBoss protection improvement | 2019-09-16 | N/A | Block |
| Cloudflare OWASP | 9002140 | Small improvement to Gutenberg exception rules | 2019-09-09 | N/A | Scoring based |
| Cloudflare OWASP | 9002140_JSON | Small improvement to Gutenberg exception rules | 2019-09-09 | N/A | Scoring based |
| Cloudflare OWASP | 9002141 | Small improvement to Gutenberg exception rules | 2019-09-09 | N/A | Scoring based |
| Cloudflare OWASP | 9002141_JSON | Small improvement to Gutenberg exception rules | 2019-09-09 | N/A | Scoring based |
| Cloudflare Specials | 100158 | SQL Injection - Obfuscated
SELECT
expressions | 2019-09-09 | Log | Block |
| Cloudflare OWASP | URI-973326 | Small improvement in OWASP rule | 2019-09-09 | Scoring based | Scoring based |
| Cloudflare OWASP | 973326 | Small improvement in OWASP rule | 2019-09-09 | Scoring based | Scoring based |
| Cloudflare OWASP | URI-950901 | Remove OWASP rule | 2019-09-02 | Scoring based | N/A |
| Cloudflare OWASP | 959151 | Small improvement in OWASP rule | 2019-09-02 | Block | Block |
| Cloudflare OWASP | 950901 | Remove OWASP rule | 2019-09-02 | Scoring based | N/A |
| Cloudflare Drupal | D0003B | Disable rule by default | 2019-07-29 | Block | Disable |
| Cloudflare Specials | 100005A | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100007N | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100009DBETA | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100009I | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100009L | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100010B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100021CD | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100030_BETA | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100030ARGS_LOOSE | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100035B2 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100035D | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100042 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100056_BETA | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100057 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100059 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100061 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100062 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100062_BETA | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100064 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100066 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100067 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100068 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100075 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100077 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100078B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100083 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100084 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100085 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100086 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100088C | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100093 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100096BEVIL | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100096BHTML | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100096EVIL | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100096HTML | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100098 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100105 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100106B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100107ARGS | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100108 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100108ARGS | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100109 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100109B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100111 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100115 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100119 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100122 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100123B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100126 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100131 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100133 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100135B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100137 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100139A | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100140 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100146 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100146B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100149 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100158 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Miscellaneous | CFMISC0004 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Miscellaneous | CFMISC0004B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Miscellaneous | CFMISC0016B | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Drupal | D0005 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Drupal | D0016 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare PHP | PHP100008 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare PHP | PHP100009 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare PHP | PHP100010 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare PHP | PHP100011ARGS | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare PHP | PHP100011COOKIE | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare WordPress | WP0012 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare WordPress | WP0025C | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare WordPress | WP0028 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare WordPress | WP0030 | Disable rule by default | 2019-07-29 | Log | Disable |
| Cloudflare Specials | 100136A | Improve XSS JavaScript URI detection and reduce false positives | 2019-07-29 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS JavaScript URI detection and reduce false positives | 2019-07-29 | Block | Block |
| Cloudflare Specials | 100136C | Improve XSS JavaScript URI detection and reduce false positives | 2019-07-29 | Block | Block |
| Cloudflare Specials | 100135A | Improve XSS JavaScript Events detection and reduce false positives | 2019-07-29 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS JavaScript Events detection and reduce false positives | 2019-07-29 | Log | Block |
| Cloudflare Specials | 100135C | Improve XSS JavaScript Events detection and reduce false positives | 2019-07-29 | Block | Block |
| Cloudflare OWASP | 9002140 | Reduce WAF false positives for the Gutenberg WordPress editor | 2019-07-24 | N/A | Scoring based |
| Cloudflare OWASP | 9002140_JSON | Reduce WAF false positives for the Gutenberg WordPress editor | 2019-07-24 | N/A | Scoring based |
| Cloudflare OWASP | 9002141 | Reduce WAF false positives for the Gutenberg WordPress editor | 2019-07-24 | N/A | Scoring based |
| Cloudflare OWASP | 9002141_JSON | Reduce WAF false positives for the Gutenberg WordPress editor | 2019-07-24 | N/A | Scoring based |
| Cloudflare Specials | 100030 | Improve XSS HTML Script Tag detection | 2019-07-22 | Block | Block |
| Cloudflare Specials | 100153 | Block Oracle WebLogic - Command Injection -CVE-2019-2729 | 2019-06-27 | Block | Block |
| Cloudflare OWASP | 9002140A | Improve 9002140A | 2019-06-19 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002140B | Improve 9002140B | 2019-06-19 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002140A | Improve 9002140A | 2019-06-17 | Scoring based | Scoring based |
| Cloudflare OWASP | 9002140A | Improve 9002140B | 2019-06-17 | Scoring based | Scoring based |
| Cloudflare WordPress | WP0033 | Easy WP SMTP - Deserialization | 2019-06-17 | Log | Block |
| Cloudflare Specials | 100156 | XSS, HTML Injection - Malicious HTML Encoding | 2019-06-17 | Log | Block |
| Cloudflare OWASP | 9002140B_BETA | Improve 9002140B | 2019-06-10 | Scoring based | Scoring based |
| Cloudflare Specials | 100005 | Improved shell variable normalization | 2019-06-10 | Block | Block |
| Cloudflare Specials | 100007NS | Improved shell variable normalization | 2019-06-10 | Block | Block |
| Cloudflare Specials | 100155 | PHPCMS - Dangerous File Upload -CVE-2018-14399 | 2019-06-10 | Log | Block |
| Cloudflare Specials | 100096BHTML | XSS, HTML Injection - Body | 2019-06-03 | N/A | Log |
| Cloudflare Specials | 100096BEVIL | XSS, HTML Injection - Body | 2019-06-03 | N/A | Log |
| Cloudflare OWASP | 9002140A | New OWASP rules to allow requests from the WordPress's Gutenberg editor | 2019-06-03 | N/A | Scoring based |
| Cloudflare OWASP | 9002140B | New OWASP rules to allow requests from the WordPress's Gutenberg editor | 2019-06-03 | N/A | Scoring based |
| All | All | Improve Rule Descriptions | 2019-05-28 | N/A | N/A |
| Cloudflare Specials | 100157 | Microsoft SharePoint Deserialization -CVE-2019-0604(Strict) | 2019-05-28 | Block | Block |
| Cloudflare Specials | 100053 | Potential FI or Alias/Rewrite Bypass - Double Slash in URL | 2019-05-20 | Disable | Disable |
| Cloudflare Specials | 100122ARGS | Dangerous stream wrappers | 2019-05-20 | Block | Deprecated |
| Cloudflare Specials | 100122ARGS_GET | Dangerous stream wrappers | 2019-05-20 | Block | Deprecated |
| Cloudflare Specials | 100122 | Dangerous stream wrappers | 2019-05-20 | Log | Block |
| Cloudflare Specials | 100157 | Microsoft SharePoint Deserialization -CVE-2019-0604 | 2019-05-13 | N/A | Block |
| Cloudflare Specials | 100154 | WordPress Social Warfare RCE/XSS (CVE-2019-9978) | 2019-05-13 | Log | Block |
| Cloudflare OWASP | 9002140 | Reduce OWASP false positives | 2019-05-13 | Log | Allow |
| Cloudflare Specials | 100008 | Improve SQLi detection | 2019-05-13 | Block | Block |
| Cloudflare Specials | 100135A | Improve XSS detection and reduce false positives | 2019-05-07 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS detection and reduce false positives | 2019-05-07 | Log | Block |
| Cloudflare Specials | 100135C | Improve XSS detection and reduce false positives | 2019-05-07 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection and reduce false positives | 2019-05-07 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection and reduce false positives | 2019-05-07 | Block | Block |
| Cloudflare Specials | 100153 | Block Oracle WebLogicCVE-2019-2725,CVE-2017-10271,CVE-2017-3506 | 2019-05-07 | N/A | Block |
| Cloudflare Specials | 100148 | Improve inline XSS detection | 2019-05-07 | Log | Block |
| Cloudflare Specials | 100105HEADERS | PHP serialization in headers, excluding Cookies | 2019-05-07 | N/A | Block |
| Cloudflare Specials | 100146C | Potential SSRF attack | 2019-05-07 | Log | Block |
| Cloudflare Specials | 100106 | PostgreSQL COPY Injection | 2019-05-07 | Block | Block |
| Cloudflare Specials | 100139A | HTML Injection, XSS or Code Injection via data URI | 2019-05-07 | N/A | Log |
| Cloudflare Specials | 100139B | HTML Injection, XSS or Code Injection via data URI | 2019-05-07 | N/A | Block |
| Cloudflare Specials | 100139C | HTML Injection, XSS or Code Injection via data URI | 2019-05-07 | N/A | Block |
| Cloudflare Specials | 100105REFERER | PHP serialization in Referer header | 2019-04-29 | N/A | Block |
| Cloudflare Specials | 100152 | JoomlaCVE-2019-10945 | 2019-04-29 | N/A | Block |
| Cloudflare Specials | 100144 | NoSQL Injection attack (Expression vector) | 2019-04-29 | Log | Block |
| Cloudflare Specials | 100143 | NoSQL Injection attack (comparison vector) | 2019-04-29 | Log | Block |
| Cloudflare Specials | 100148 | Improve XSS inline detection | 2019-04-29 | Log | Block |
| Cloudflare Specials | 100135A | Improve XSS detection | 2019-04-22 | Block | Block |
| Cloudflare Specials | 100135B | Improve XSS detection | 2019-04-22 | Block | Block |
| Cloudflare Specials | 100136A | Improve XSS detection | 2019-04-22 | Block | Block |
| Cloudflare Specials | 100136B | Improve XSS detection | 2019-04-22 | Block | Block |
| Cloudflare Specials | 100097G | Improve SQLi blocking | 2019-04-22 | Log | Block |
| Cloudflare WordPress | WP0034 | WordPress zero day XSS | 2019-04-22 | N/A | Block |
| Cloudflare Specials | 100010A | Improve SQLi detection | 2019-04-22 | Block | Block |
| Cloudflare PHP | PHP100013 | Blocks PHP CGI attack by default | 2019-04-22 | Log | Block |
| Cloudflare Specials | 100150 | BlockCVE-2019-10842 | 2019-04-22 | N/A | Block |
| Cloudflare Specials | 100142 | NoSQL Injection attack (array vector) | 2019-04-15 | Log | Block |
| Cloudflare Specials | 100135A | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100135B | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100135C | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100030SVG | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021C | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021CE | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021CB | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021CD | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021CD2 | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Specials | 100021CD3 | Improve XSS event detection | 2019-04-08 | N/A | N/A |
| Cloudflare Drupal | D0020BETA | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Block |
| Cloudflare Drupal | D0017 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Block |
| Cloudflare Drupal | D0017 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Drupal | D0018 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Drupal | D0019 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Drupal | D0021 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Specials | 100127 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Specials | 100128 | Improve blocking of SA-CORE-2019-003 | 2019-04-08 | Log | Deleted |
| Cloudflare Specials | 100135A | Improve XSS detection using JavaScript URI | 2019-04-08 | N/A | Block |
| Cloudflare Specials | 100135B | Improve XSS detection using JavaScript URI | 2019-04-08 | N/A | Log |
| Cloudflare Specials | 100135C | Improve XSS detection using JavaScript URI | 2019-04-08 | N/A | Block |
| Cloudflare Specials | 100123A | Improve invalid UTF-8 detection | 2019-04-08 | N/A | Block |
| Cloudflare Specials | 100123B | Improve invalid UTF-8 detection | 2019-04-08 | N/A | Log |
| Cloudflare Specials | 100130 | Executable file upload attempt | 2019-04-08 | Log | Block |
| Cloudflare Specials | 100136A | Improve XSS detection using JavaScript events | 2019-04-01 | N/A | Block |
| Cloudflare Specials | 100136B | Improve XSS detection using JavaScript events | 2019-04-01 | N/A | Block |
| Cloudflare Specials | 100136C | Improve XSS detection using JavaScript events | 2019-04-01 | N/A | Block |
| Cloudflare Specials | 100120BETA2 | Reduce 100120's false positives | 2019-04-01 | Log | Block |
| Cloudflare WordPress | WP0032BETA | Reduce false positives for WP0032 | 2019-04-01 | Log | Block |
| Cloudflare Specials | 100122ARGS | Block use of stream wrappers in all arguments | 2019-04-01 | Log | Block |
| Cloudflare Specials | 100132 | Protection for Apache Tika Command InjectionCVE-2018-1335 | 2019-04-01 | Log | Block |
| Cloudflare PHP | PHP100006 | Improve PHP webshell attempt detection. | 2019-04-01 | Log | Block |
| Cloudflare Specials | 100005 | Merge LFI 100005_BETA into 100005. MitigatesCVE-2018-9126,CVE-2011-1892. | 2019-04-01 | Block | Block |
| Cloudflare Specials | 100005U | Superseded by 100005 | 2019-04-01 | Block | Block |
| Cloudflare Specials | 100005UR | Superseded by 100005 | 2019-04-01 | Block | Block |
| Cloudflare Specials | 100134 | Ruby on Rails File DisclosureCVE-2019-5418 | 2019-04-01 | Log | Block |
| Cloudflare Specials | 100120BETA | Improve 100120's coverage of SQLi | 2019-03-25 | Log | Block |
| Cloudflare Specials | 100130B | Executable file with fake extension upload attempt | 2019-03-25 | Log | Block |
| Cloudflare Specials | 100021CB | Improves XSS event detection using alternate syntax `, brackets, and
parentheses. | 2019-03-18 | Log | Block |
| Cloudflare Specials | 100021A | Improve XSS detection in Referer Header | 2019-03-18 | Challenge | Block |
| Cloudflare Specials | 100030SVG | Improve XSS event detection | 2019-03-18 | Challenge | Block |
| Cloudflare Specials | 100021C | Improve XSS event detection | 2019-03-18 | Block | Block |
| Cloudflare Specials | 100021CE | Improve XSS event detection | 2019-03-18 | Block | Block |
| Cloudflare Specials | 100021CB | Improve XSS event detection | 2019-03-18 | Block | Block |
| Cloudflare Specials | 100122ARGS_GET | Block use of stream wrappers in GET arguments (RFI/RCE) | 2019-03-18 | Log | Block |
| Cloudflare Specials | 100125 | Block AngularJS Sandbox attacks | 2019-03-18 | Log | Block |
| Cloudflare Specials | 100021D | Improve XSS detection | 2019-03-18 | Challenge | Block |
| Cloudflare WordPress | WP0031 | WordPress RCE -CVE-2019-8942,CVE-2019-8943 | 2019-03-11 | N/A | Block |
| Cloudflare Specials | 100021CB | Improve XSS event detection | 2019-03-11 | Challenge | Block |
| Cloudflare Specials | 100021C | Improve XSS event detection | 2019-03-11 | Block | Block |
| Cloudflare Specials | 100008E | Improve SQLi probing | 2019-03-04 | Block | Block |
| Cloudflare Specials | 100123 | UTF-8 Invalid Characters detection (URL) | 2019-03-04 | Log | Block |
| Cloudflare Specials | 100008E | Improve SQLi probe detection | 2019-02-18 | N/A | Block |
| Cloudflare Specials | 100063_BETA | Reduce false positives for 100063 | 2019-02-18 | Log | Block |
| Cloudflare Specials | 100021H | Improve XSS | 2019-02-18 | Log | Block |
| Cloudflare Specials | 100021G | Delete XSS rule | 2019-02-18 | Block | Deleted |
| Cloudflare Specials | 100124A | UTF-8 Invalid Characters detection | 2019-02-11 | N/A | Disable |
| Cloudflare Specials | 100124B | UTF-8 Invalid Characters detection | 2019-02-11 | N/A | Disable |
| Cloudflare Specials | 100008 | Moved rule out of BETA | 2019-02-08 | Block | Block |
| Cloudflare Specials | 100011 | Block requests with null bytes | 2019-02-04 | N/A | Disable |
| Cloudflare Specials | 100020 | Blocked SQLi with mysql comments | 2019-02-04 | Log | Block |
| Cloudflare Specials | 100120B | Blocked SQLi with mysql comments | 2019-02-04 | Log | Block |
| Cloudflare Specials | 100120C | Blocked SQLi with mysql comments | 2019-02-04 | N/A | Disable |
| Cloudflare Specials | 100054 | BlockCVE-2017-5638RCE attempts | 2019-02-04 | Log | Block |
| Cloudflare Specials | 100009C | Reduce 100009C false positives | 2019-01-28 | Block | Block |
| Cloudflare Specials | 100007 | Improved RCE detection | 2019-01-28 | Block | Block |
| Cloudflare PHP | PHP100012 | DetectCVE-2017-9841 | 2019-01-28 | N/A | Block |
| Cloudflare Specials | 100112B | Block requests with duplicated User-Agent headers | 2019-01-21 | N/A | Disable |
| Cloudflare Specials | 100009J | Reduce 100009J false positives | 2019-01-21 | Block | Block |
| Cloudflare Specials | 100114 | Improved XSS probing detection | 2019-01-21 | Log | Block |
| Cloudflare Specials | 100005 | Improved LFI detection | 2019-01-21 | Log | Block |
| Cloudflare Drupal | D0015 | Drupal SA-CORE-2019-002 vulnerability | Emergency, 2019-01-17 | N/A | Block |
| Cloudflare Drupal | D0016 | Drupal SA-CORE-2019-002 vulnerability | Emergency, 2019-01-17 | N/A | Log |
| Cloudflare PHP | PHP100011 | Improved PHP code injection detection in URI and headers | 2019-01-14 | Log | Block |
| Cloudflare Specials | 100121ARGS_GET | Use of multiple percent-encoding level in URI arguments | 2019-01-07 | N/A | Disable |
| Cloudflare Specials | 100121URI | Use of multiple percent-encoding level in URI | 2019-01-07 | N/A | Disable |
| Cloudflare Specials | 100021CD3 | XSS reflection with JavaScript events | 2019-01-02 | N/A | Disable |
| Cloudflare Specials | 100068B | Improve SQLi detection | 2019-01-02 | Log | Block |
| Cloudflare Specials | 100021_BETA | Improve XSS detection | 2019-01-02 | Log | Challenge |

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

## Historical (2018)

**來源**: [https://developers.cloudflare.com/waf/change-log/historical-2018/](https://developers.cloudflare.com/waf/change-log/historical-2018/)

Page options # Historical (2018)

| Ruleset | Rule ID | Description | Change Date | Old Action | New Action |
| --- | --- | --- | --- | --- | --- |
| Cloudflare Specials | 100016_BETA | Improved sensitive directories access | 2018-12-11 | Log | Block |
| Cloudflare Specials | 100035U_BETA | Improved Baidu bot detection | 2018-12-06 | Log | Block |
| Cloudflare Specials | 100026_BETA | Improved PHP injection detection | 2018-12-06 | Log | Block |
| Cloudflare Specials | 100118 | Improved SQLi detection | 2018-11-19 | Log | Block |
| Cloudflare Specials | 100116 | ForCVE-2018-9206, vulnerable jQuery File Uploader | 2018-11-19 | Log | Block |
| Cloudflare Specials | 100117 | ForCVE-2018-9206, vulnerable jQuery File Uploader | 2018-11-19 | Log | Block |
| Cloudflare Specials | 100008_BETA | Improved SQLi detection | 2018-11-12 | Log | Block |
| Cloudflare Specials | 100114 | XSS probing detection | 2018-11-12 | Log | Block |
| Cloudflare Specials | 100097 | libinjection based SQLi detection rule | 2018-10-29 | N/A | Disable |
| Cloudflare Specials | 100097F | libinjection based SQLi detection rule | 2018-10-29 | Log | Block |
| Cloudflare Specials | 100070 | Block requests with invalid x-forwarded-for headers | 2018-10-22 | Log | Block |
| Cloudflare Specials | 100107 | Improved XSS Probing detection | 2018-10-22 | Log | Block |
| Cloudflare Specials | 100111 | Detect large numbers of GET parameters in requests | 2018-10-22 | Log | Block |
| Cloudflare Specials | 100109 | Detect large numbers of GET parameters in requests | 2018-10-22 | Log | Block |
| Cloudflare Specials | 100109B | Detect large numbers of GET parameters in requests | 2018-10-22 | Log | Log |
| Cloudflare Specials | 100110 | Detect large numbers of GET parameters in requests | 2018-10-22 | Disable | Disable |
| Cloudflare Specials | 100112 | Block requests with duplicated headers | 2018-10-15 | N/A | Disable |
| Cloudflare WordPress | WP0020 | WP allowlist | 2018-10-08 | Allow | Allow |
| Cloudflare WordPress | WP0004 | WP allowlist | 2018-10-08 | Allow | Allow |
| Cloudflare Specials | 100088B_BETA | Improved XXE detection | 2018-10-08 | Log | Block |
| Cloudflare Specials | 100030 | Improved XSS Probing detection | 2018-10-08 | Challenge | Block |
| Cloudflare Specials | 100021B | Improved XSS Probing detection | 2018-10-08 | Block | Block |
| Cloudflare Specials | 100030_BETA | Improved XSS Probing detection | 2018-10-08 | Log | Block |
| Cloudflare Specials | 100008CW_BETA | Improved SQLi sleep probing | 2018-10-01 | Log | Block |
| Cloudflare Specials | 100106 | Improved SQLi detection | 2018-10-01 | Log | Block |
| Cloudflare Specials | 100009J_BETA | Improved SQLi detection | 2018-10-01 | Log | Block |
| Cloudflare Specials | 100009CB | Improved SQLi detection | 2018-09-24 | Log | Block |
| Cloudflare Specials | 100102 | Rules to stop file read and deletion vulnerabilities in Ghostscript | 2018-09-24 | Log | Block |
| Cloudflare Specials | 100103 | Rules to stop file read and deletion vulnerabilities in Ghostscript | 2018-09-24 | Log | Block |
| Cloudflare OWASP | 950907 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 950008 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 950010 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 950011 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 960008 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 960015 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare OWASP | 960009 | Additional OWASP rules can be disabled in UI | 2018-09-24 | N/A | N/A |
| Cloudflare Specials | 100009C_BETA | Improved SQLi detection | 2018-09-17 | Log | Deleted |
| Cloudflare Specials | 100101 | Vulnerability in Ghostscript | Emergency, 2018-09-12 | N/A | Block |
| Cloudflare Specials | 100021CE | Improved XSS Detection | 2018-09-10 | Block | Block |
| Cloudflare Specials | 100088B | Improved XXE Detection | 2018-09-10 | Log | Block |
| Cloudflare Specials | 100091B | Improved XSS Detection | 2018-09-10 | N/A | Block |
| Cloudflare Specials | 100038 | Blocks requests to
/server_status, which gives away information on how a
server works. | 2018-09-06 | Log | Block |
| Cloudflare Plone | PLONE0002 | Update rule regex | 2018-08-28 | Block | Block |
| Cloudflare Specials | 100021CE_BETA | Improved XSS Detection | 2018-08-28 | Log | Block |
| Cloudflare Specials | 100030SVG_BETA | Improved XSS Detection | 2018-08-28 | Log | Block |
| Cloudflare Specials | 100090 | Improved XSS Detection | 2018-08-28 | Log | Block |
| Cloudflare Specials | 100091 | Improved XSS Detection | 2018-08-28 | Log | Block |
| Cloudflare Specials | 100092 | Improved XSS Detection | 2018-08-28 | Log | Block |
| Cloudflare Specials | 100093 | Improved XSS Detection | 2018-08-28 | Log | Log |
| Cloudflare Specials | 100063 | Reduction in false positives | 2018-08-13 | Block | Block |
| Cloudflare Specials | 100035C | Improved detection of fake google bots | Emergency, 2018-08-13 | N/A | Block |
| Cloudflare Specials | 100095 | Rules to block cache poisoning attacks | Emergency, 2018-08-13 | N/A | Block |
| Cloudflare Specials | 100095B | Rules to block cache poisoning attacks | Emergency, 2018-08-13 | N/A | Block |
| Cloudflare WordPress | WP0003 | Disable login | 2018-08-13 | Allow | Allow |
| Cloudflare WordPress | WP0025B | Reduce the false positives WP0025B caused in the Gutenberg WordPress
editor. | 2018-08-08 | Block | Block |
| Cloudflare WordPress | WP0025D | Reduce the false positives WP0025B caused in the Gutenberg WordPress
editor. | 2018-08-08 | Block | Block |
| Cloudflare Drupal | D0006 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Block |
| Cloudflare Drupal | D0007 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Block |
| Cloudflare Drupal | D0008 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Disable |
| Cloudflare Drupal | D0009 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Disable |
| Cloudflare Drupal | D0010 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Disable |
| Cloudflare Drupal | D0011 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Disable |
| Cloudflare Drupal | D0012 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Disable |
| Cloudflare Drupal | D0013 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Block |
| Cloudflare Drupal | D0014 | Attempt to address SA-CORE-2018-005 by matching certain headers. | Emergency, 2018-08-03 | N/A | Block |
| Cloudflare Specials | 100089 | Improved SQLi detection | 2018-07-30 | Log | Block |

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

## Analytics

**來源**: [https://developers.cloudflare.com/waf/analytics/](https://developers.cloudflare.com/waf/analytics/)

Page options # Analytics

Refer to the following pages for more information on the available analytics dashboards for Cloudflare security products:

- Security Analytics
- Security Events

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

## Additional tools

**來源**: [https://developers.cloudflare.com/waf/tools/](https://developers.cloudflare.com/waf/tools/)

Page options # Additional tools

The Cloudflare WAF offers the following additional tools:

- Browser Integrity Check
- Enable security.txt
- Privacy Pass
- Replace insecure JS libraries
- Security Level
- Scrape Shield
- User Agent Blocking
- Validation checks
- Lists
- IP Access rules
- Zone Lockdown

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

## Common use cases

**來源**: [https://developers.cloudflare.com/waf/custom-rules/use-cases/](https://developers.cloudflare.com/waf/custom-rules/use-cases/)

Page options # Common use cases

The following common use cases illustrate how to secure web traffic to your sites and applications with custom rules:

- Allow traffic from IP addresses in allowlist only
- Allow traffic from search engine bots
- Allow traffic from specific countries only
- Block Microsoft Exchange Autodiscover requests
- Block requests by attack score
- Block traffic by geographical location
- Block traffic from specific countries
- Build a sequence rule within custom rules
- Challenge bad bots
- Configure token authentication
- Exempt partners from Hotlink Protection
- Issue challenge for admin user in JWT claim based on attack score
- Require a specific cookie
- Require known IP addresses in site admin area
- Require specific HTTP headers
- Require specific HTTP ports
- Stop R-U-Dead-Yet? (R.U.D.Y.) attacks
- Update custom rules for customers or partners

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

## Rulesets reference

**來源**: [https://developers.cloudflare.com/waf/managed-rules/reference/](https://developers.cloudflare.com/waf/managed-rules/reference/)

Page options # Rulesets reference

- Cloudflare Managed Ruleset
- Cloudflare OWASP Core Ruleset
- Cloudflare Exposed Credentials Check Managed Ruleset
- Cloudflare Sensitive Data Detection

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

## Reference

**來源**: [https://developers.cloudflare.com/waf/reference/](https://developers.cloudflare.com/waf/reference/)

Page options # Reference

- Alerts
- Phases
- Legacy features

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

## Legacy features

**來源**: [https://developers.cloudflare.com/waf/reference/legacy/](https://developers.cloudflare.com/waf/reference/legacy/)

Page options # Legacy features

Refer to the following pages for more information on legacy WAF features:

- WAF managed rules (previous version)
- Rate Limiting (previous version)
- Firewall rules
- Firewall rules upgrade

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

