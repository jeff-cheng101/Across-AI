# DDoS Protection - DDoS 防護

> 本文檔包含 150 個頁面的內容
> 生成時間: 2025-09-08T04:18:09.234Z
> 產品線: 🛡️ Security Products

## 📑 目錄

1. [Cloudflare DDoS Protection](#cloudflare-ddos-protection)
2. [Get started](#get-started)
3. [About](#about)
4. [How DDoS protection works](#how-ddos-protection-works)
5. [Main components](#main-components)
6. [Attack coverage](#attack-coverage)
7. [Managed rulesets](#managed-rulesets)
8. [HTTP DDoS Attack Protection](#http-ddos-attack-protection)
9. [Parameters](#parameters)
10. [Rule categories](#rule-categories)
11. [Overrides](#overrides)
12. [Configure in the dashboard](#configure-in-the-dashboard)
13. [Configure via API](#configure-via-api)
14. [Override expressions](#override-expressions)
15. [Override examples](#override-examples)
16. [Network-layer DDoS Attack Protection](#network-layer-ddos-attack-protection)
17. [Parameters](#parameters)
18. [Rule categories](#rule-categories)
19. [Overrides](#overrides)
20. [Configure in the dashboard](#configure-in-the-dashboard)
21. [Configure via API](#configure-via-api)
22. [Override expressions](#override-expressions)
23. [Override examples](#override-examples)
24. [Adaptive DDoS Protection](#adaptive-ddos-protection)
25. [General settings](#general-settings)
26. [Advanced TCP Protection](#advanced-tcp-protection)
27. [Advanced DNS Protection](#advanced-dns-protection)
28. [Concepts](#concepts)
29. [Add a prefix](#add-a-prefix)
30. [Add an IP or prefix to the allowlist](#add-an-ip-or-prefix-to-the-allowlist)
31. [Create a rule](#create-a-rule)
32. [Create a filter](#create-a-filter)
33. [Exclude a prefix](#exclude-a-prefix)
34. [Advanced DNS Protection](#advanced-dns-protection)
35. [Common API calls](#common-api-calls)
36. [JSON objects](#json-objects)
37. [Advanced TCP Protection](#advanced-tcp-protection)
38. [Common API calls](#common-api-calls)
39. [JSON objects](#json-objects)
40. [Third-party services and DDoS protection](#third-party-services-and-ddos-protection)
41. [Respond to DDoS attacks](#respond-to-ddos-attacks)
42. [Botnet Threat Feed](#botnet-threat-feed)
43. [Analytics](#analytics)
44. [Reports](#reports)
45. [Alerts](#alerts)
46. [Logs](#logs)
47. [Simulating test DDoS attacks](#simulating-test-ddos-attacks)
48. [FAQ](#faq)
49. [Changelog](#changelog)
50. [Network-layer DDoS managed ruleset](#network-layer-ddos-managed-ruleset)
51. [Scheduled changes](#scheduled-changes)
52. [2024-03-12](#2024-03-12)
53. [2023-07-31](#2023-07-31)
54. [2023-04-17](#2023-04-17)
55. [2022-12-02](#2022-12-02)
56. [2022-10-24](#2022-10-24)
57. [2022-10-06](#2022-10-06)
58. [2022-09-21](#2022-09-21)
59. [2022-09-16](#2022-09-16)
60. [2022-04-12](#2022-04-12)
61. [HTTP DDoS managed ruleset](#http-ddos-managed-ruleset)
62. [Scheduled changes](#scheduled-changes)
63. [2024-04-19](#2024-04-19)
64. [2024-04-16 - Emergency](#2024-04-16-emergency)
65. [2024-04-04 - Emergency](#2024-04-04-emergency)
66. [2024-04-02](#2024-04-02)
67. [2024-02-27](#2024-02-27)
68. [2024-02-26 - Emergency](#2024-02-26-emergency)
69. [2024-02-19](#2024-02-19)
70. [2024-02-12](#2024-02-12)
71. [2024-02-08 - Emergency](#2024-02-08-emergency)
72. [2024-02-06 - Emergency](#2024-02-06-emergency)
73. [2024-02-05 - Emergency](#2024-02-05-emergency)
74. [2024-01-26 - Emergency](#2024-01-26-emergency)
75. [2024-01-25](#2024-01-25)
76. [2024-01-23](#2024-01-23)
77. [2024-01-05](#2024-01-05)
78. [2023-12-19 - Emergency](#2023-12-19-emergency)
79. [2023-12-14 - Emergency](#2023-12-14-emergency)
80. [2023-12-08 - Emergency](#2023-12-08-emergency)
81. [2023-11-29](#2023-11-29)
82. [2023-11-22](#2023-11-22)
83. [2023-11-13 - Emergency](#2023-11-13-emergency)
84. [2023-11-10 - Emergency](#2023-11-10-emergency)
85. [2023-10-19](#2023-10-19)
86. [2023-10-11](#2023-10-11)
87. [2023-10-09 - Emergency](#2023-10-09-emergency)
88. [2023-09-24 - Emergency](#2023-09-24-emergency)
89. [2023-09-21 - Emergency](#2023-09-21-emergency)
90. [2023-09-05 - Emergency](#2023-09-05-emergency)
91. [2023-08-30 - Emergency](#2023-08-30-emergency)
92. [2023-08-29 - Emergency](#2023-08-29-emergency)
93. [2023-08-25 - Emergency](#2023-08-25-emergency)
94. [2023-08-16 - Emergency](#2023-08-16-emergency)
95. [2023-08-14](#2023-08-14)
96. [2023-08-11 - Emergency](#2023-08-11-emergency)
97. [2023-07-31](#2023-07-31)
98. [2023-07-17](#2023-07-17)
99. [2023-07-12 - Emergency](#2023-07-12-emergency)
100. [2023-07-07](#2023-07-07)
101. [2023-07-06](#2023-07-06)
102. [2023-06-28](#2023-06-28)
103. [2023-06-19](#2023-06-19)
104. [2023-06-16](#2023-06-16)
105. [2023-06-14 - Emergency](#2023-06-14-emergency)
106. [2023-06-06](#2023-06-06)
107. [2023-06-05 - Emergency](#2023-06-05-emergency)
108. [2023-05-26](#2023-05-26)
109. [2023-05-22](#2023-05-22)
110. [2023-05-16 - Emergency](#2023-05-16-emergency)
111. [2023-05-15 - Emergency](#2023-05-15-emergency)
112. [2023-05-02 - Emergency](#2023-05-02-emergency)
113. [2023-04-27 - Emergency](#2023-04-27-emergency)
114. [2023-04-21 - Emergency](#2023-04-21-emergency)
115. [2023-04-17](#2023-04-17)
116. [2023-04-03](#2023-04-03)
117. [2023-03-22](#2023-03-22)
118. [2023-03-10](#2023-03-10)
119. [2023-02-28 - Emergency](#2023-02-28-emergency)
120. [2023-02-20](#2023-02-20)
121. [2023-01-30](#2023-01-30)
122. [2022-12-07 - Emergency](#2022-12-07-emergency)
123. [2022-11-02 - Emergency](#2022-11-02-emergency)
124. [2022-10-14](#2022-10-14)
125. [2022-10-06 - Emergency](#2022-10-06-emergency)
126. [2022-09-19 - Emergency](#2022-09-19-emergency)
127. [2022-09-14](#2022-09-14)
128. [2022-09-13](#2022-09-13)
129. [2022-08-16](#2022-08-16)
130. [2022-08-10](#2022-08-10)
131. [2022-08-02](#2022-08-02)
132. [2022-07-18](#2022-07-18)
133. [2022-07-08](#2022-07-08)
134. [2022-07-06](#2022-07-06)
135. [2022-06-08](#2022-06-08)
136. [2022-06-01](#2022-06-01)
137. [2022-05-12](#2022-05-12)
138. [2022-05-03](#2022-05-03)
139. [2022-04-21](#2022-04-21)
140. [2022-04-12](#2022-04-12)
141. [2022-04-07](#2022-04-07)
142. [General updates](#general-updates)
143. [Advanced DDoS systems](#advanced-ddos-systems)
144. [How to](#how-to)
145. [API configuration](#api-configuration)
146. [Best practices](#best-practices)
147. [Reference](#reference)
148. [Changelog | DDoS protectionDDoS protection - DDoS alerts now available for EU CMB customersDDoS protection - Network Analytics now supported for EU CMB customers](#changelog-ddos-protectionddos-protection-ddos-alerts-now-available-for-eu-cmb-customersddos-protection-network-analytics-now-supported-for-eu-cmb-customers)
149. [Changelog | DDoS protectionDDoS protection - 2024-03-12DDoS protection - 2023-07-31DDoS protection - 2023-04-17DDoS protection - 2022-12-02](#changelog-ddos-protectionddos-protection-2024-03-12ddos-protection-2023-07-31ddos-protection-2023-04-17ddos-protection-2022-12-02)
150. [Changelog | DDoS protectionDDoS protection - Scheduled for 2024-04-29DDoS protection - 2024-04-19DDoS protection - 2024-04-16DDoS protection - 2024-04-04DDoS protection - 2024-04-02DDoS protection - 2024-02-26DDoS protection - 2024-02-19DDoS protection - 2024-02-12DDoS protection - 2024-02-08DDoS protection - 2024-02-06DDoS protection - 2024-02-05DDoS protection - 2024-01-26DDoS protection - 2024-01-25DDoS protection - 2024-01-23DDoS protection - 2024-01-05DDoS protection - 2023-12-19DDoS protection - 2023-12-14DDoS protection - 2023-12-08DDoS protection - 2023-11-29DDoS protection - 2023-11-22DDoS protection - 2023-11-13DDoS protection - 2023-11-10DDoS protection - 2023-10-19DDoS protection - 2023-10-11DDoS protection - 2023-10-09DDoS protection - 2023-09-24DDoS protection - 2023-09-21DDoS protection - 2023-09-05DDoS protection - 2023-08-30DDoS protection - 2023-08-29DDoS protection - 2023-08-25DDoS protection - 2023-08-16DDoS protection - 2023-08-14DDoS protection - 2023-08-11DDoS protection - 2023-07-31](#changelog-ddos-protectionddos-protection-scheduled-for-2024-04-29ddos-protection-2024-04-19ddos-protection-2024-04-16ddos-protection-2024-04-04ddos-protection-2024-04-02ddos-protection-2024-02-26ddos-protection-2024-02-19ddos-protection-2024-02-12ddos-protection-2024-02-08ddos-protection-2024-02-06ddos-protection-2024-02-05ddos-protection-2024-01-26ddos-protection-2024-01-25ddos-protection-2024-01-23ddos-protection-2024-01-05ddos-protection-2023-12-19ddos-protection-2023-12-14ddos-protection-2023-12-08ddos-protection-2023-11-29ddos-protection-2023-11-22ddos-protection-2023-11-13ddos-protection-2023-11-10ddos-protection-2023-10-19ddos-protection-2023-10-11ddos-protection-2023-10-09ddos-protection-2023-09-24ddos-protection-2023-09-21ddos-protection-2023-09-05ddos-protection-2023-08-30ddos-protection-2023-08-29ddos-protection-2023-08-25ddos-protection-2023-08-16ddos-protection-2023-08-14ddos-protection-2023-08-11ddos-protection-2023-07-31)

---

## Cloudflare DDoS Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/](https://developers.cloudflare.com/ddos-protection/)

Page options # Cloudflare DDoS Protection

Detect and mitigate distributed denial-of-service (DDoS) attacks automatically.

Available on all plans Cloudflare automatically detects and mitigates distributed denial-of-service (DDoS) attacks via our autonomous DDoS systems.

These systems include multiple dynamic mitigation rules exposed as DDoS attack protection managed rulesets. You can customize the mitigation rules included in these rulesets to optimize and tailor the protection to your needs.

## Features

### Managed rulesets

Protect against a variety of DDoS attacks across layers 3/4 (network layer) and layer 7 (application layer) of the OSI model.

Use Managed rulesets ### Adaptive DDoS protection

Get increased protection against sophisticated DDoS attacks on layer 7 and layers 3/4.

Use Adaptive DDoS protection ### Advanced TCP protection

Detect and mitigate sophisticated out-of-state TCP attacks such as randomized and spoofed ACK floods, or SYN and SYN-ACK floods.

Use Advanced TCP protection ### Advanced DNS protection

Protect against DNS-based DDoS attacks, specifically sophisticated and fully randomized DNS attacks such as random prefix attacks.

Use Advanced DNS protection ## Availability

|  | Free | Pro | Business | Enterprise | Enterprise with Advanced DDoS Protection add-on |
| --- | --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes | Yes |
| Standard, unmetered DDoS
protection (layers 3-7) | Yes | Yes | Yes | Yes | Yes |
| HTTP DDoS attack protection | Yes | Yes | Yes | Yes | Yes |
| Network-layer (L3/4)
DDoS attack protection | Yes | Yes | Yes | Yes | Yes |
| Managed rules customization | Yes | Yes | Yes | Yes, with Log action | Expression fields & multi-rule support |
| Proactive false positive
detection for new rules | No | No | No | Yes | Yes |
| Adaptive DDoS protection | Only error adaptive rules | Only error adaptive rules | Only error adaptive rules | Only error adaptive rules | All adaptive rules |
| Traffic profiling signals for
adaptive DDoS protection | Error rates only | Error rates only | Error rates & historical trends | Error rates & historical trends | Error rates & historical trends, client country, user agent, query string, ML-scores |
| Advanced TCP Protection | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers |
| Advanced DNS Protection | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers | Available to Magic Transit customers |
| Number of ruleset overrides allowed | 1 | 1 | 1 | 1 | 10 |
| Alerts | Yes | Yes | Yes | Yes | Advanced alerts with filtering |

## Related products

Spectrum Provides security and acceleration for any TCP or UDP based application.

Magic Transit A network security and performance solution that offers DDoS protection, traffic acceleration, and more for on-premise, cloud-hosted, and hybrid networks.

Web Application Firewall (WAF) Get automatic protection from vulnerabilities and the flexibility to create custom rules.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/get-started/](https://developers.cloudflare.com/ddos-protection/get-started/)

Page options # Get started

## Free, Pro, and Business plans

The DDoS Attack Protection managed rulesets provided by Cloudflare are enabled by default on zones onboarded to Cloudflare, IP applications onboarded to Spectrum, and IP Prefixes onboarded to Magic Transit.

In some situations, the default protection offered by DDoS rules may need to be fine-tuned to your specific situation. You may also want to configure additional protection using other Cloudflare products.

### Adjust the provided DDoS rules

If one or more DDoS rules provided by Cloudflare affects legitimate traffic, you can adjust them so that they do not perform any mitigation action against this kind of traffic. Follow the steps in handling a false positive to reduce the sensitivity level of one or more DDoS rules and allow incoming legitimate traffic.

### Configure additional protection

To configure additional protection against DDoS attacks, refer to the related Cloudflare products listed in Network-layer DDoS Attack Protection and HTTP DDoS Attack Protection.

## Enterprise plan

Cloudflare's DDoS protection systems automatically detect and mitigate DDoS attacks. Additionally, the systems may flag suspiciously-looking incoming traffic from legacy applications, Internet services, or faulty client applications as malicious and apply mitigation actions. If the traffic is in fact legitimate, the mitigation actions can cause service disruptions and outages in your Internet properties.

To prevent this situation, Cloudflare recommends that you perform these steps to get started:

1. Set the ruleset actions for all the DDoS Attack Protection managed rulesets to Log.
2. Analyze the flagged traffic.
3. Adjust the sensitivity or action of individual managed ruleset rules, if required.
4. Switch ruleset actions from Log back to the default.

### Prerequisites

You must have one of the following:

- A zone onboarded to Cloudflare but without updated DNS records.
- An IP application onboarded to Spectrum.
- An IP Prefix onboarded to Magic Transit.

### 1. Configure ruleset actions to Log

Note

The Log action is only available to Enterprise customers.

1. Configure all the rules in the HTTP DDoS Attack Protection managed ruleset, setting their action to Log.
2. Configure all the rules in the Network-layer DDoS Attack Protection managed ruleset, setting the action to Log.

Alternatively, if you are using the API, define an override at the ruleset level to set the action of all managed ruleset rules to log by following these instructions:

- Configure an override for the HTTP DDoS Attack Protection managed ruleset
- Configure an override for the Network-layer DDoS Attack Protection managed ruleset

### 2. Review flagged traffic

1. Go to your analytics dashboard (the exact dashboard depends on your Cloudflare services).
2. Apply one or more filters, if required, and identify any rules that would have blocked legitimate traffic if Log mode were disabled. Take note of the rule IDs.

### 3. Customize managed ruleset rules

Customize the specific managed ruleset rules you identified, changing their sensitivity or their action, using the Cloudflare dashboard or using the API.

If you are using the Cloudflare dashboard, refer to:

- Configure HTTP DDoS Attack Protection in the dashboard
- Configure Network-layer DDoS Attack Protection in the dashboard

If you are using the API, refer to:

- Configure HTTP DDoS Attack Protection via API
- Configure Network-layer DDoS Attack Protection via API

When using the API, ensure that you add any required rule overrides without removing the ruleset override you configured in Step 1.

### 4. Switch ruleset actions back to the default

Revert the change you did in Step 1, changing the action of each managed ruleset rule back to Default in Ruleset action.

Alternatively, if you are using the API, remove the override you previously configured at the ruleset level for each managed ruleset. Ensure that you only remove the ruleset override and not any of the rule overrides you may have configured in Step 3.

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

## About

**來源**: [https://developers.cloudflare.com/ddos-protection/about/](https://developers.cloudflare.com/ddos-protection/about/)

Page options # About

Cloudflare provides unmetered and unlimited distributed denial-of-service (DDoS) protection at layers 3, 4, and 7 to all customers on all plans and services.

The protection is enabled by Cloudflare's Autonomous DDoS Protection Edge, which automatically detects and mitigates DDoS attacks.

The Autonomous Edge includes multiple dynamic mitigation rules exposed as managed rulesets, which provide comprehensive protection against a variety of DDoS attacks across layers 3/4 and layer 7 of the OSI model.

Adaptive DDoS Protection also learns your unique traffic patterns and adapts to them to provide better protection against sophisticated DDoS attacks on layer 7 and layers 3/4. Your Internet properties can be secured from sophisticated TCP and DNS DDoS attacks using Advanced DDoS Protection that leverages stateful inspection and traffic profiling.

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

## How DDoS protection works

**來源**: [https://developers.cloudflare.com/ddos-protection/about/how-ddos-protection-works/](https://developers.cloudflare.com/ddos-protection/about/how-ddos-protection-works/)

Page options # How DDoS protection works

To detect and mitigate DDoS attacks, Cloudflare's autonomous edge and centralized DDoS systems analyze traffic samples out of path, which allows Cloudflare to asynchronously detect DDoS attacks without causing latency or impacting performance.

The analyzed samples include:

- Packet fields such as the source IP, source port, destination IP, destination port, protocol, TCP flags, sequence number, options, and packet rate.
- HTTP request metadata such as HTTP headers, user agent, query-string, path, host, HTTP method, HTTP version, TLS cipher version, and request rate.
- HTTP response metrics such as error codes returned by customers' origin servers and their rates.

Cloudflare uses a set of dynamic rules that scan for attack patterns, known attack tools, suspicious patterns, protocol violations, requests causing large amounts of origin errors, excessive traffic hitting the origin or cache, and additional attack vectors. Each rule has a predefined sensitivity level and default action that varies based on the rule's confidence that the traffic is indeed part of an attack.

Note

You can set an override expression for the HTTP DDoS Attack Protection or Network-layer DDoS Attack Protection managed ruleset to define a specific scope for sensitivity level or action adjustments.

Once attack traffic matches a rule, Cloudflare's systems will track that traffic and generate a real-time signature to surgically match against the attack pattern and mitigate the attack without impacting legitimate traffic. The rules are able to generate different signatures based on various properties of the attacks and the signal strength of each attribute. For example, if the attack is distributed — that is, originating from many source IPs — then the source IP field will not serve as a strong indicator, and the rule will not choose the source IP field as part of the attack signature. Once generated, the fingerprint is propagated as a mitigation rule to the most optimal location on the Cloudflare global network for cost-efficient mitigation. These mitigation rules are ephemeral and will expire shortly after the attack has ended, which happens when no additional traffic has been matched to the rule.

| Actions | Description |
| --- | --- |
| Block | Matching requests are denied access to the site. |
| Interactive Challenge | The client that made the request must pass an interactive Challenge. |
| Managed Challenge | Depending on the characteristics of a request, Cloudflare will choose an appropriate type of challenge. |
| Log | Records matching requests in the Cloudflare Logs. |
| Use rule defaults | Uses the default action that is pre-defined for each rule. |

## Thresholds

Thresholds vary for each rule and there are different thresholds globally and per colocation. Within a rule, the traffic is fingerprinted and the thresholds are per fingerprint, and it is difficult to know ahead of time which rules, colocations, or fingerprints your traffic generates, so the threshold numbers are not necessarily valuable.

Instead, Cloudflare's DDoS Protection system provides the sensitivity adjustment. If you experience a false positive, you can decrease the sensitivity. You can also use the Log action to help find an appropriate sensitivity level. You can decrease the sensitivity while in Log mode until the rule no longer matches.

## Time to mitigate

- Immediate mitigation for Advanced TCP and DNS Protection systems.
- Up to three seconds on average for the detection and mitigation of L3/4 DDoS attacks at the edge using the Network-layer DDoS Protection Managed rules.
- Up to three seconds on average for the detection and mitigation of HTTP DDoS attacks at the edge using the HTTP DDoS Protection Managed rules.

## Data localization

To learn more about how DDoS protection works with data localization, refer to the Data Localization Suite product compatibility.

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

## Main components

**來源**: [https://developers.cloudflare.com/ddos-protection/about/components/](https://developers.cloudflare.com/ddos-protection/about/components/)

Page options # Main components

## Autonomous Edge

The Cloudflare Autonomous Edge is powered by the denial-of-service daemon (dosd), which is a home-grown software-defined system. The flow tracking daemon, flowtrackd, is our stateful mitigation platform alongside dosd. A dosd instance runs in every single server in every one of Cloudflare global network's data centers ↗ around the world. These dosd instances can detect and mitigate DDoS attacks autonomously without requiring centralized consensus. Cloudflare users can configure this system through DDoS Attack Protection managed rulesets.

Another component of Cloudflare's Autonomous Edge includes the Advanced TCP Protection system. This is Cloudflare's TCP state tracking machine for detecting and mitigating the most randomized and sophisticated TCP-based DDoS attacks in unidirectional routing topologies — such as the case of Magic Transit. Advanced TCP Protection is able to identify the state of a TCP connection and then drops, challenges, or rate-limits packets that do not belong to a legitimate connection.

For more information, refer to our blog post A deep-dive into Cloudflare's autonomous edge DDoS protection ↗.

## Centralized DDoS protection system

Complementary to the Autonomous Edge, Cloudflare's entire global network is overwatched by a global version of dosd. This component protects Cloudflare's entire global network by detecting and mitigating globally distributed volumetric DDoS attacks.

The centralized systems run in Cloudflare's core data centers. They receive samples from every global network data center, analyze them, and automatically send mitigation instructions when detecting an attack. The system is also synchronized to each of our customers' web servers to identify their health and trigger any required mitigation actions.

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

## Attack coverage

**來源**: [https://developers.cloudflare.com/ddos-protection/about/attack-coverage/](https://developers.cloudflare.com/ddos-protection/about/attack-coverage/)

Page options # Attack coverage

The DDoS Attack Protection managed rulesets provide protection against a variety of DDoS attacks across L3/4 (layers 3/4) and L7 of the OSI model. Cloudflare constantly updates these managed rulesets to improve the attack coverage, increase the mitigation consistency, cover new and emerging threats, and ensure cost-efficient mitigations.

Advanced TCP Protection and Advanced DNS Protection, available to Magic Transit customers, provide additional protection against sophisticated TCP-based DDoS attacks and sophisticated and fully randomized DNS attacks, respectively.

As a general guideline, various Cloudflare products operate on different open systems interconnection (OSI) layers and you are protected up to the layer on which your service operates. You can customize the DDoS settings on the layer in which you onboarded. For example, since the CDN/WAF service is a Layer 7 (HTTP/HTTPS) service, Cloudflare provides protection from DDoS attacks on L7 downwards, including L3/4 attacks.

Note

For Magic Transit customers, Cloudflare provides some L7 protection with a L3 service (like the Advanced DNS Protection system that is available for Magic Transit customers. DNS is considered a L7 protocol).

The following table includes a sample of covered attack vectors:

| OSI Layer | Ruleset / Feature | Example of covered DDoS attack vectors |
| --- | --- | --- |
| L3/4 | Network-layer DDoS Attack Protection | UDP flood attackSYN floodsSYN-ACK reflection attackACK floodsMirai and Mirai-variant L3/4 attacksICMP flood attackSNMP flood attackQUIC flood attackOut of state TCP attacksProtocol violation attacksSIP attacksESP floodDNS amplification attackDNS Garbage FloodDNS NXDOMAIN floodDNS Query floodRST floodNetBios DDoS attacksmDNS DDoS attacksVxWorks DDoS attacksBitTorrent reflection attackMemcached amplification attacksCHARGEN reflection attacksUbiquity reflection attacksLantronix reflection attacksSSDP reflection attacksMSSQL reflection attacksDTLS amplification attacksQuote of the Day (QOTD) reflection attacksTeamSpeak 3 floodsJenkins amplification attacksGRE floodsSPSS reflection attacksCarpet Bombing attacksFor more DNS protection options, refer to Getting additional DNS protection. |
| L3/4 | Advanced TCP Protection 1 | Fully randomized and spoofed ACK floods, SYN floods, SYN-ACK reflection attacks, and other sophisticated TCP-based DDoS attacks |
| L7 (DNS) | Advanced DNS Protection 1 | Sophisticated and fully randomized DNS attacks, including Water Torture attacks, Random-prefix attacks, and DNS laundering attacks. |
| L7 (HTTP/S) | HTTP DDoS Attack Protection | HTTP flood attackWordPress pingback attackHULK attackLOIC attackSlowloris attackMirai and Mirai-variant HTTP attacksHTTP/2 Rapid ResetHTTP Continuation floodCache busting attacksKnown DDoS botnetsTLS/SSL negotiation attacksTLS/SSL exhaustion attacksCarpet Bombing attacks |

## Footnotes

1. Available to Magic Transit customers. ↩ ↩2

## Getting additional DNS protection

The Network-layer DDoS Attack Protection managed ruleset provides protection against some types of DNS attacks.

Magic Transit customers have access to Advanced DNS Protection Beta. Other customers might consider the following options:

- Use Cloudflare as your authoritative DNS provider (primary DNS or secondary DNS).
- If you are running your own nameservers, use DNS Firewall to get additional protection against DNS attacks like random prefix attacks.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/)

Page options # Managed rulesets

The DDoS Attack Protection managed rulesets provide comprehensive protection against a variety of DDoS attacks across L3/4 (network layer) and L7 (application layer) of the OSI model ↗.

The available managed rulesets are:

- HTTP DDoS Attack Protection

This ruleset includes rules to detect and mitigate DDoS attacks over HTTP and HTTPS.
- This ruleset includes rules to detect and mitigate DDoS attacks over HTTP and HTTPS.
- Network-layer DDoS Attack Protection

This ruleset includes rules to detect and mitigate DDoS attacks on L3/4 of the OSI model such as UDP floods, SYN-ACK reflection attacks, SYN Floods, and DNS floods.
- This ruleset includes rules to detect and mitigate DDoS attacks on L3/4 of the OSI model such as UDP floods, SYN-ACK reflection attacks, SYN Floods, and DNS floods.

## Proactive false positive detection for new rules

Note

Only available on Business and Enterprise plans.

When Cloudflare creates a new managed rule, we check the rule impact against the traffic of Business and Enterprise zones while the rule is not blocking traffic yet.

If a false positive is detected, we proactively reach out to the affected customers and help them make configuration changes (for example, to lower the sensitivity level of the new rule) before the rule starts mitigating traffic. This prevents the new rule from causing service disruptions and outages to your Internet properties.

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

## HTTP DDoS Attack Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/)

Page options # HTTP DDoS Attack Protection

The Cloudflare HTTP DDoS Attack Protection managed ruleset is a set of pre-configured rules used to match known DDoS attack vectors at layer 7 (application layer) on the Cloudflare global network. The rules match known attack patterns and tools, suspicious patterns, protocol violations, requests causing large amounts of origin errors, excessive traffic hitting the origin/cache, and additional attack vectors at the application layer.

Cloudflare updates the list of rules in the managed ruleset on a regular basis. Refer to the changelog for more information on recent and upcoming changes.

The HTTP DDoS Attack Protection managed ruleset is always enabled — you can only customize its behavior.

The HTTP DDoS Attack Protection managed ruleset provides users with increased observability into L7 DDoS attacks mitigated by Cloudflare, informing users of ongoing or past attacks. The Security Events dashboard, available at Security > Events, will display information about the top HTTP DDoS managed rules.

## Ruleset configuration

If you are expecting large spikes of legitimate traffic, consider customizing your DDoS protection settings to avoid false positives, where legitimate traffic is falsely identified as attack traffic and blocked/challenged.

You can adjust the behavior of the rules in the managed ruleset by modifying the following parameters:

- The performed action when an attack is detected.
- The sensitivity level of attack detection mechanisms.

Notes

- Certain actions or sensitivity levels may not be available to all Cloudflare plans.
- Currently, you can only define account-level configurations (or overrides) for the HTTP DDoS Attack Protection managed ruleset via API.

To adjust rule behavior, do one of the following:

- Configure the managed ruleset in the Cloudflare dashboard.
- Configure the managed ruleset via API.
- Configure the managed ruleset using Terraform.

For more information on the available configuration parameters, refer to Managed ruleset parameters.

## Origin Protect rules

Cloudflare HTTP DDoS Protection can also initiate mitigation based on the origin health. Adaptive DDoS Protection for Origins detects and mitigates traffic that deviates from your site's origin errors profile. Floods of requests that cause a high number of zone errors (default sensitivity level is 1,000 errors per second) can initiate mitigation to alleviate the strain on the zone.

| Rule ID | Description |
| --- | --- |
| dd42da7baabe4e518eaf11c393596a9d | HTTP requests causing a high number of origin errors. |

Note

This rule is available for zones on any plan.

While Cloudflare's network is built to automatically monitor and mitigate large DDoS attacks, Cloudflare also helps mitigate smaller DDoS attacks, based on the following general rules:

- For zones on any plan, Cloudflare will apply mitigations when the HTTP error rate is above the High (default) sensitivity level of 1,000 errors-per-second rate threshold. You can decrease the sensitivity level by configuring the HTTP DDoS Attack Protection managed ruleset.
- For zones on Pro, Business, and Enterprise plans, Cloudflare performs an additional check for better detection accuracy: the errors-per-second rate must also be at least five times the normal origin traffic levels before applying DDoS mitigations.

All HTTP errors in the 52x range (Internal Server Error) and all errors in the 53x range excluding 530 are considered when factoring in the error rate. For DDoS mitigations based on HTTP error rate, you cannot exclude specific HTTP error codes.

For more information on the types of DDoS attacks covered by Cloudflare's DDoS protection, refer to DDoS attack coverage.

## Availability

The HTTP DDoS Attack Protection managed ruleset protects Cloudflare customers on all plans for zones onboarded to Cloudflare. All customers can customize the ruleset both at the zone level and at the account level.

Customers on Enterprise plans with the Advanced DDoS Protection subscription can create up to 10 overrides (or up to 10 rules, for API users) with custom expressions, to customize the DDoS protection for different incoming requests.

Other customers can only create one override (or rule) and they cannot customize the rule expression. In this case, the single override, containing one or more configurations, will always apply to all incoming traffic.

## Related Cloudflare products

To block additional L7 attacks you can use other Cloudflare products like the Cloudflare WAF.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/override-parameters/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/override-parameters/)

Page options # Parameters

Configure the HTTP DDoS Attack Protection managed ruleset to change the action applied to a given attack or modify the sensitivity level of the detection mechanism. You can configure the managed ruleset in the Cloudflare dashboard or define overrides via Rulesets API.

The available parameters are the following:

- Action
- Sensitivity Level

## Action

API property name: "action".

The action that will be performed for requests that match specific rules of Cloudflare's DDoS mitigation services. The available actions are:

- Block

API value: "block".
Blocks HTTP requests that match the rule expression.
- API value: "block".
- Blocks HTTP requests that match the rule expression.
- Managed Challenge

API value: "managed_challenge".
Managed Challenges help reduce the lifetimes of human time spent solving Captchas across the Internet. Depending on the characteristics of a request, Cloudflare will dynamically choose the appropriate type of challenge based on specific criteria.
- API value: "managed_challenge".
- Managed Challenges help reduce the lifetimes of human time spent solving Captchas across the Internet. Depending on the characteristics of a request, Cloudflare will dynamically choose the appropriate type of challenge based on specific criteria.
- Interactive Challenge

API value: "challenge".
Presents an interactive challenge to the clients making HTTP requests that match a rule expression.
- API value: "challenge".
- Presents an interactive challenge to the clients making HTTP requests that match a rule expression.
- Log

API value: "log".
Only available on Enterprise plans with the Advanced DDoS Protection subscription. Logs requests that match the expression of a rule detecting HTTP DDoS attacks. Recommended for validating a rule before committing to a more severe action.
- API value: "log".
- Only available on Enterprise plans with the Advanced DDoS Protection subscription. Logs requests that match the expression of a rule detecting HTTP DDoS attacks. Recommended for validating a rule before committing to a more severe action.
- Connection Close

API value: N/A (internal rule action that you cannot use in overrides).
The client is instructed to establish a new connection (by disabling keep-alive) instead of reusing the existing connection. Existing requests are not affected.
- API value: N/A (internal rule action that you cannot use in overrides).
- The client is instructed to establish a new connection (by disabling keep-alive) instead of reusing the existing connection. Existing requests are not affected.
- Force Connection Close

API value: N/A (internal rule action that you cannot use in overrides).
Closes ongoing HTTP connections. This action does not block a request, but it forces the client to reconnect. For HTTP/2 and HTTP/3 connections, the connection will be closed even if it breaks other requests running on the same connection.
The performed action depends on the HTTP version:

HTTP/1: set the Connection header ↗ to close.
HTTP/2: send a GOAWAY frame ↗ to the client.
- API value: N/A (internal rule action that you cannot use in overrides).
- Closes ongoing HTTP connections. This action does not block a request, but it forces the client to reconnect. For HTTP/2 and HTTP/3 connections, the connection will be closed even if it breaks other requests running on the same connection.
- The performed action depends on the HTTP version:

HTTP/1: set the Connection header ↗ to close.
HTTP/2: send a GOAWAY frame ↗ to the client.
- HTTP/1: set the Connection header ↗ to close.
- HTTP/2: send a GOAWAY frame ↗ to the client.
- DDoS Dynamic

API value: N/A (internal rule action that you cannot use in overrides).
Performs a specific action according to a set of internal guidelines defined by Cloudflare. The executed action can be one of the above or an undisclosed mitigation action.
- API value: N/A (internal rule action that you cannot use in overrides).
- Performs a specific action according to a set of internal guidelines defined by Cloudflare. The executed action can be one of the above or an undisclosed mitigation action.

## Sensitivity Level

API property name: "sensitivity_level".

Defines how sensitive a rule is. Affects the thresholds used to determine if an attack should be mitigated. A higher sensitivity level means having a lower threshold, while a lower sensitivity level means having a higher threshold.

The available sensitivity levels are:

| UI value | API value |
| --- | --- |
| High | "default" |
| Medium | "medium" |
| Low | "low" |
| Essentially Off | "eoff" |

The default sensitivity level is High.

In most cases, when you select the Essentially Off sensitivity level the rule will not trigger for any of the selected actions, including Log. However, if the attack is extremely large, Cloudflare's protection systems will still trigger the rule's mitigation action to protect Cloudflare's network.

Essentially Off means that we have set an exceptionally low sensitivity level so in most cases traffic will not be mitigated for you. However, attack traffic will be mitigated at exceptional levels to ensure the safety and stability of the Cloudflare network.

Log means that requests will not be mitigated but only logged and shown on the dashboard. However, attack traffic will be mitigated at exceptional levels to ensure the safety and stability of the Cloudflare network.

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

## Rule categories

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/rule-categories/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/rule-categories/)

Page options # Rule categories

The main categories (or tags) of HTTP DDoS Attack Protection managed rules are the following:

| Name | Description |
| --- | --- |
| botnets | Rules for requests from known botnets, with very high accuracy and low risk of false positives. It is recommended that you keep these rules enabled. |
| unusual-requests | Rules for requests with suspicious characteristics that are not usually seen in legitimate traffic. |
| advanced | Rules related to features available to Advanced DDoS Protection customers, such as Adaptive DDoS Protection. |
| generic | Rules for detecting and mitigating floods of requests. These rules are useful for mitigating attacks that have no known signatures, but they may also trigger on unusually high volumes of legitimate traffic. To reduce the risk of false positives, their request per second (rps) activation threshold is higher. These rules either rate-limit or challenge traffic by default, but you can override them to block traffic if necessary. |
| read-only | Highly targeted rules for mitigating DDoS attacks with a high confidence rate. These rules are read-only — you cannot override their sensitivity level or action. |
| test | Rules used for testing the detection, mitigation, and alerting capabilities of Cloudflare's DDoS protection products. |

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

## Overrides

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/)

Page options # Overrides

When Cloudflare's DDoS Protection systems detect an attack, an ephemeral mitigation rule is created and installed in-line to mitigate the attack. A mitigation rule is generated based on the logic of the DDoS Protection managed ruleset. Each mitigation rule is generated from a single managed rule.

All mitigations and its associated managed rules are evaluated in order by the DDoS systems one by one. Cloudflare will go through all of the rule overrides defined in the ruleset overrides until one matches the managed rule, and apply the action and stop at that point. Otherwise, the evaluation will continue in order until a rule matches.

You can create only one ruleset override that can contain one or multiple rule overrides.

Note

Enterprise customers with the Advanced DDoS Protection add-on can create up to 10 ruleset overrides.

A rule override instructs the DDoS system on the action it should take against the attack according to its matching managed rule.

However, within a rule override, specificity matters and the DDoS system will choose the more specific configuration. A rule override takes precedence over the ruleset override.

## Example

A DDoS managed ruleset contains the following managed rules:

- Managed rule 1
- Managed rule 2
- Managed rule 3

The following ruleset overrides have been configured:

- Ruleset override A

Managed rule 1 is set to block
- Managed rule 1 is set to block
- Ruleset override B

The action of the entire ruleset (or all managed rules) is set to Managed Challenge
Managed rule 1 is set to log
Managed rule 2 is set to log
- The action of the entire ruleset (or all managed rules) is set to Managed Challenge
- Managed rule 1 is set to log
- Managed rule 2 is set to log
- Ruleset override C

Managed rule 3 is set to log
- Managed rule 3 is set to log

### Use case

A DDoS attack was detected on managed rules 1, 2, and 3, and has generated a mitigation rule.

- Since managed rule 1 matches ruleset override A, Cloudflare will block the attacks and not proceed with the rest of the rules.
- Managed rule 2 does not match ruleset override A, so Cloudflare proceeds to ruleset override B.  Ruleset override B matches both all managed rules and managed rule 2, but specificity takes precedence. It does not challenge and instead proceeds with log since it matches the most specific managed rule.
- Managed rule 3 does not match ruleset override A, so Cloudflare proceeds to rule override B. Since ruleset override B sets all managed rules to challenge, then Cloudflare does not proceed to ruleset override C.

An additional dimension to take into account is Cloudflare’s DDoS systems will apply a given rule override only if its conditions are met — which includes the Sensitivity level. So, while it needs to match and modify the correct managed rule (or everything in the case of all managed rules above), it also has to meet the specified Sensitivity level of the rule.

- Rule override A

All managed rules are set to challenge at low sensitivity
- All managed rules are set to challenge at low sensitivity
- Rule override B

Managed rule 1 is set to log at default sensitivity
- Managed rule 1 is set to log at default sensitivity

You receive a small attack below the threshold for low sensitivity, but above the threshold for high sensitivity on managed rule 1.

- Rule override A does not meet the low sensitivity threshold. Therefore, we do not match the override and do not mitigate the attack, but proceed to evaluate the next managed rule in case the rule override instructs DoS to mitigate.
- Rule override B sets log at default visibility, which matches the condition. So, the defined action is applied and attack traffic is logged.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/configure-dashboard/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/configure-dashboard/)

Page options # Configure in the dashboard

Configure the HTTP DDoS Attack Protection managed ruleset by defining overrides in the Cloudflare dashboard. DDoS overrides allow you to customize the action and sensitivity of one or more rules in the managed ruleset.

For more information on the available parameters and allowed values, refer to Ruleset parameters.

Number of available overrides

If you are an Enterprise customer with the Advanced DDoS Protection subscription, you can define up to 10 overrides. These overrides can have a custom expression so that the override only applies to a subset of incoming requests. If you do not have the Advanced DDoS Protection subscription, you can only deploy one override which will always apply to all incoming requests.

If you cannot deploy any additional overrides, consider editing an existing override to adjust rule configuration.

Create multiple rules in the ddos_l7 phase entry point ruleset to define different overrides for different sets of incoming requests. Set each rule expression according to the traffic whose HTTP DDoS protection you wish to customize.

Rules in the phase entry point ruleset, where you create overrides, are evaluated in order until there is a match for a rule expression and sensitivity level, and Cloudflare will apply the first rule that matches the request. Therefore, the rule order in the entry point ruleset is very important.

## Access

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and website.
2. Go to Security > DDoS.
3. Next to HTTP DDoS attack protection, select Deploy a DDoS override.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules > DDoS protection tab.
3. On HTTP DDoS attack protection, select Create override.

### Create a DDoS override

1. Enter a descriptive name for the override in Override name.
2. If you are an Enterprise customer with the Advanced DDoS Protection subscription:

Under Override scope, review the scope of the override — by default, all incoming requests for the current zone.
If necessary, select Edit scope and configure the custom filter expression that will determine the override scope.
3. Under Override scope, review the scope of the override — by default, all incoming requests for the current zone.
4. If necessary, select Edit scope and configure the custom filter expression that will determine the override scope.
5. Depending on what you wish to override, refer to the following sections (you can perform both configurations on the same override):
 Configure all the rules in the ruleset (ruleset override)
 
To always apply a given action for all the rules in the ruleset, select an action in Ruleset action.
To set the sensitivity level for all the rules in the ruleset, select a value in Ruleset sensitivity.
 
 Configure one or more rules
 
Under Rule configuration, select Browse rules.
Search for the rules you wish to configure using the available filters. You can search by tag (also known as category).
To configure a single rule, select the desired value for a field in the displayed dropdowns next to the rule.
To configure more than one rule, select the rules using the row checkboxes and update the fields for the selected rules using the dropdowns displayed before the table. You can also configure all the rules with a given tag. For more information, refer to Configure rules in bulk in a managed ruleset.
Select Next.
 
Notes
Tag and rule overrides have priority over ruleset overrides.

The managed ruleset includes some read-only rules that you cannot override.
6. To always apply a given action for all the rules in the ruleset, select an action in Ruleset action.
7. To set the sensitivity level for all the rules in the ruleset, select a value in Ruleset sensitivity.
8. Under Rule configuration, select Browse rules.
9. Search for the rules you wish to configure using the available filters. You can search by tag (also known as category).
10. To configure a single rule, select the desired value for a field in the displayed dropdowns next to the rule.
To configure more than one rule, select the rules using the row checkboxes and update the fields for the selected rules using the dropdowns displayed before the table. You can also configure all the rules with a given tag. For more information, refer to Configure rules in bulk in a managed ruleset.
11. Select Next.
12. Tag and rule overrides have priority over ruleset overrides.
13. The managed ruleset includes some read-only rules that you cannot override.
14. Select Save.

### Delete a DDoS override

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > DDoS.
3. Next to the DDoS override you wish to delete, select Delete.
4. Select Delete to confirm the operation.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules > DDoS protection tab.
3. Select the override.
4. Select Delete deployment.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/configure-api/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/configure-api/)

Page options # Configure via API

Configure the HTTP DDoS Attack Protection managed ruleset by defining overrides using the Rulesets API.

Each zone has the HTTP DDoS Attack Protection managed ruleset enabled by default. This means that you do not need to deploy the managed ruleset to the ddos_l7 phase ruleset explicitly. You only have to create a rule in the phase ruleset to deploy the managed ruleset if you need to configure overrides.

If you are using Terraform, refer to DDoS managed rulesets configuration using Terraform.

## Configure an override for the HTTP DDoS Attack Protection managed ruleset

Use overrides to configure the HTTP DDoS Attack Protection managed ruleset. Overrides allow you to define a different action or sensitivity level from the default values. For more information on the available action and sensitivity level values, refer to Ruleset parameters.

Overrides can have a ruleset, tag, or rule scope. Tag and rule configurations have greater priority than ruleset configurations.

You can create overrides at the zone level and at the account level. Account-level overrides allow you to apply the same override to several zones in your account with a single rule. For example, you can use an account-level override to lower the sensitivity of a specific managed ruleset rule or exclude an IP list for multiple zones. However, if a given zone has overrides for the HTTP DDoS Attack Protection managed ruleset, the account-level overrides will not be evaluated for that zone.

Important

- The HTTP DDoS Attack Protection managed ruleset is always enabled — you cannot disable its rules using an override with "enabled": false.
- The managed ruleset includes some read-only rules that you cannot override.
- If you configure both account-level and zone-level overrides, only the zone-level overrides (the most specific ones) will be evaluated.
- Currently, account-level overrides for the HTTP DDoS Attack Protection managed ruleset are only available via API.

### Creating multiple rules

Note

Only available to Enterprise customers with the Advanced DDoS Protection subscription, which can create up to 10 rules.

Create multiple rules in the ddos_l7 phase entry point ruleset to define different overrides for different sets of incoming requests. Set each rule expression according to the traffic whose HTTP DDoS protection you wish to customize.

Rules in the phase entry point ruleset, where you create overrides, are evaluated in order until there is a match for a rule expression and sensitivity level, and Cloudflare will apply the first rule that matches the request. Therefore, the rule order in the entry point ruleset is very important.

## Example API calls

### Zone-level configuration example

The following PUT example creates a new phase ruleset (or updates the existing one) for the ddos_l7 phase at the zone level. The request includes several overrides to adjust the default behavior of the HTTP DDoS Attack Protection managed ruleset. These overrides are the following:

- All rules of the managed ruleset will use the managed_challenge action and have a sensitivity level of medium.
- All rules tagged with <TAG_NAME> will have a sensitivity level of low.
- The rule with ID <MANAGED_RULESET_RULE_ID> will use the block action.

Request ```
curl --request PUT \https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/phases/ddos_l7/entrypoint \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "description": "Execute HTTP DDoS Attack Protection managed ruleset in the zone-level phase entry point ruleset",  "rules": [    {      "action": "execute",      "action_parameters": {        "id": "<MANAGED_RULESET_ID>",        "overrides": {          "sensitivity_level": "medium",          "action": "managed_challenge",          "categories": [            {              "category": "<TAG_NAME>",              "sensitivity_level": "low"            }          ],          "rules": [            {              "id": "<MANAGED_RULESET_RULE_ID>",              "action": "block"            }          ]        }      },      "expression": "true"    }  ]}'
```

The response returns the created (or updated) phase entry point ruleset.

Response

```
{  "result": {    "id": "<PHASE_ENTRY_POINT_RULESET_ID>",    "name": "default",    "description": "Execute HTTP DDoS Attack Protection managed ruleset in the zone-level phase entry point ruleset",    "kind": "zone",    "version": "1",    "rules": [      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "<MANAGED_RULESET_ID>",          "version": "latest",          "overrides": {            "action": "managed_challenge",            "categories": [              {                "category": "<TAG_NAME>",                "sensitivity_level": "low"              }            ],            "rules": [              {                "id": "<MANAGED_RULESET_RULE_ID>",                "action": "block"              }            ],            "sensitivity_level": "medium"          }        },        "expression": "true",        "last_updated": "2021-06-16T04:14:47.977741Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2021-06-16T04:14:47.977741Z",    "phase": "ddos_l7"  }}
```

For more information on defining overrides for managed rulesets using the Rulesets API, refer to Override a managed ruleset in the Ruleset Engine documentation.

### Account-level configuration example

The following PUT example creates a new phase ruleset (or updates the existing one) for the ddos_l7 phase at the account level. The example defines a single rule override for requests coming from IP addresses in the allowlisted_ips IP list, with the following configuration:

- The rule with ID <MANAGED_RULESET_RULE_ID>, belonging to the HTTP DDoS Attack Protection managed ruleset (with ID <MANAGED_RULESET_ID>), will have an eoff (Essentially Off) sensitivity level and it will perform a log action.

Note

Custom rule expressions (different from "true") and the log action require an Enterprise plan with the Advanced DDoS Protection subscription.

Request ```
curl --request PUT \https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets/phases/ddos_l7/entrypoint \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "description": "Disable a managed ruleset rule for allowlisted IP addresses",  "rules": [    {      "expression": "ip.src in $allowlisted_ips",      "action": "execute",      "action_parameters": {        "id": "<MANAGED_RULESET_ID>",        "overrides": {          "rules": [            {              "id": "<MANAGED_RULESET_RULE_ID>",              "action": "log",              "sensitivity_level": "eoff"            }          ]        }      }    }  ]}'
```

The response returns the created (or updated) phase entry point ruleset.

Response

```
{  "result": {    "id": "<PHASE_ENTRY_POINT_RULESET_ID>",    "name": "default",    "description": "Disable a managed ruleset rule for allowlisted IP addresses",    "kind": "root",    "version": "1",    "rules": [      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "<MANAGED_RULESET_ID>",          "version": "latest",          "overrides": {            "rules": [              {                "id": "<MANAGED_RULESET_RULE_ID>",                "action": "log",                "sensitivity_level": "eoff"              }            ]          }        },        "expression": "ip.src in $allowlisted_ips",        "last_updated": "2022-10-16T04:14:47.977741Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2022-10-16T04:14:47.977741Z",    "phase": "ddos_l7"  }}
```

For more information on defining overrides for managed rulesets using the Rulesets API, refer to Override a managed ruleset in the Ruleset Engine documentation.

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

## Override expressions

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/override-expressions/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/override-expressions/)

Page options # Override expressions

Note

Only available to Enterprise customers with the Advanced DDoS Protection subscription.

Set an override expression for the HTTP DDoS Attack Protection managed ruleset to define a specific scope for sensitivity level or action adjustments.

For example, you can set different sensitivity levels for different request URI paths: a medium sensitivity level for URI path A and a low sensitivity level for URI path B.

## Available expression fields

You can use the following fields in override expressions:

- cf.bot_management.ja3_hash
- cf.bot_management.ja4
- cf.client.bot
- cf.threat_score
- cf.tls_cipher
- cf.tls_client_auth.cert_verified
- cf.tls_version
- cf.verified_bot_category
- http.cookie
- http.host
- http.referer
- http.request.headers
- http.request.headers.names
- http.request.headers.truncated
- http.request.headers.values
- http.request.uri
- http.request.uri.path
- http.request.uri.path.extension
- http.request.uri.query
- http.request.full_uri
- http.request.method
- http.request.version
- http.request.cookies
- http.user_agent
- http.x_forwarded_for
- ip.geoip.asnum
- ip.geoip.continent
- ip.geoip.country
- ip.geoip.is_in_european_union
- ip.src
- ip.src.asnum
- ip.src.continent
- ip.src.country
- ip.src.is_in_european_union
- ssl

Refer to the Fields reference in the Rules language documentation for more information.

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

## Override examples

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/override-examples/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/http/http-overrides/override-examples/)

Page options # Override examples

## Use cases

The following scenarios detail how you can make use of override rules as a solution to common HTTP DDoS Protection issues.

### Traffic from your mobile application is blocked by a DDoS Managed Rule

The traffic from your mobile application may have appeared suspicious, causing a DDoS Managed Rule to block it.

You should identify the Managed Rule blocking the traffic and change the sensitivity level to Medium. If traffic continues to be blocked by the managed rule, set the sensitivity level to Low or Essentially off.

If you have access to filter expressions, you can create an override to target the specific affected traffic.

### Traffic is flagged by an adaptive rule based on the location and may be an attack

If you recognize that the traffic flagged by an adaptive rule may be considered an attack, you can create an override rule to enable the adaptive rule in mitigation mode to challenge (if it is browser traffic) or block (for other suspicious traffic).

### Legitimate traffic is incorrectly identified as an attack and causes a false positive

A false positive is an incorrect identification. In the case of DDoS protection, there is a false positive when legitimate traffic is mistakenly classified as attack traffic. This can occur when legacy applications, Internet services, or faulty client applications generate legitimate traffic that appears suspicious, has odd traffic patterns, deviates from best practices, or violates protocols.

In these cases, Cloudflare's DDoS Protection systems may flag that traffic as malicious and apply mitigation actions. If the traffic is in fact legitimate and not part of an attack, the mitigation actions can cause service disruptions and outages to your Internet properties.

To remedy a false positive:

- Old dashboard
- New dashboard

1. In the Cloudflare dashboard, go to the Network analytics page.
  Go to Network analytics
2. Apply filters to the displayed data.

For WAF/CDN customers

1. Select the zone that is experiencing DDoS attack false positives.
2. Go to Security > Events.
3. Select Add filter and filter by Service equals HTTP DDoS.

For Magic Transit and Spectrum customers

1. Go to Account Home > Analytics & Logs > Network Analytics.
2. Identify the legitimate traffic that is causing the false positives. Use the Attack ID number included in the DDoS alert (if you received one), or apply dashboard filters such as destination IP address and port.

1. Scroll down to Top events by source > HTTP DDoS rules.
2. Copy the rule name.
3. Go to your zone > Security > DDoS and select Deploy a DDoS override. If you cannot deploy any additional overrides, edit an existing override to adjust rule configuration.
4. Select Browse rules and paste the rule name in the search field.
5. Decrease the rule's Sensitivity Level to Essentially Off or change the rule action to Log (if supported by your current plan and subscriptions).
6. Select Next and then select Save.

1. In the Cloudflare dashboard, go to the Network analytics page.
  Go to Network analytics
2. Apply filters to the displayed data.

For WAF/CDN customers

1. Select the zone that is experiencing DDoS attack false positives.
2. Go to Security > Analytics > Events tab.
3. Select Add filter and filter by Service equals HTTP DDoS.

For Magic Transit and Spectrum customers

1. Go to Account Home > Analytics & Logs > Network Analytics.
2. Identify the legitimate traffic that is causing the false positives. Use the Attack ID number included in the DDoS alert (if you received one), or apply dashboard filters such as destination IP address and port.

1. Scroll down to Top events by source > HTTP DDoS rules.
2. Copy the rule name.
3. Go to your zone > Security > Security rules > DDoS protection tab and select Create override. If you cannot deploy any additional overrides, edit an existing override to adjust rule configuration.
4. Select Browse rules and paste the rule name in the search field.
5. Decrease the rule's Sensitivity Level to Essentially Off or change the rule action to Log (if supported by your current plan and subscriptions).
6. Select Next and then select Save.

Once saved, the rule takes effect within one or two minutes. The rule adjustment should provide immediate remedy, which you can view in the analytics dashboard.

#### Update the adjusted rules later

Later, you can change the sensitivity level of the rule causing the false positives to avoid future issues, and change the rule action back to its default value.

Recommendation: Enable DDoS alerts

Cloudflare recommends that you create notifications for DDoS alerts to get real-time notifications on detected and mitigated attacks automatically performed by Cloudflare's systems. When you receive these notifications, you can review if it is in fact a real DDoS attack, or if it is a false positive, and then take action to remedy it.

#### Avoid false positives while retaining protection and visibility

To see what DDoS Managed Rules do in a high sensitivity level while remaining protected by blocking attacks at a low sensitivity level, Advanced DDoS protection customers can create a first override that blocks attacks at a low sensitivity and a second override to log at a high sensitivity.

The overrides must be set in that order. Otherwise, it will not work. This is because overrides are evaluated in order and will stop at the first override that matches both expression and sensitivity. Setting the overrides in the wrong order would cause the Log override at a high sensitivity to match all instances. As a result, Cloudflare will never evaluate the Block override that would be placed behind it, causing all rules to be set in Log mode.

If an override without an expression matches, Cloudflare will not evaluate the expressions that follow it.

### An attack is incorrectly identified as legitimate traffic and causes a false negative

A false negative is a lack of identification. In the case of DDoS protection, there is a false negative when attack traffic is mistakenly classified as legitimate traffic and is not mitigated. This can occur when the attack traffic is not sufficiently high to trigger mitigation actions or if there are no rules matching the attack.

To address a false negative:

- If you are a WAF/CDN customer, follow the steps in the Respond to DDoS attacks page, which guides you on enabling the Under Attack mode and creating rate limiting rules and WAF custom rules as needed.
- If you are a Magic Transit customer, use Magic Firewall rules to help mitigate the attack.

### Incomplete mitigations

An incomplete mitigation is a case when the DDoS protection systems have applied mitigation, but not all the attack was mitigated. This can happen when Cloudflare's systems apply a mitigation action that is less strict than what the attack requires.

The system chooses the mitigation action based on the logic and the DDoS protection system's confidence that the traffic is indeed part of an attack:

- For high-confidence rules, the system will apply a strict mitigation action such as the Block action.
- For low-confidence rules, the system will apply a less strict mitigation rule such as Challenge or Force Connection Close.

If you are experiencing a DDoS attack detected by Cloudflare and the applied mitigation action is not sufficiently strict, change the rule action to Block:

- Old dashboard
- New dashboard

1. In the Cloudflare dashboard, go to the Network analytics page.
  Go to Network analytics
2. Apply filters to the displayed data.

For WAF/CDN customers

1. Select the zone that is experiencing an incomplete mitigation of a DDoS attack.
2. Go to Security > Events.
3. Select Add filter and filter by Service equals HTTP DDoS.

For Magic Transit and Spectrum customers

1. Go to Account Home > Analytics & Logs > Network Analytics.
2. Identify the DDoS attack that is having incomplete mitigations. Use the Attack ID number included in the DDoS alert (if you received one), or apply dashboard filters such as destination IP address and port.

1. Scroll down to Top events by source > HTTP DDoS rules.
2. Copy the rule name.
3. Go to your zone > Security > DDoS and select Deploy a DDoS override. If you cannot deploy any additional overrides, edit an existing override to adjust rule configuration.
4. Select Browse rules and paste the rule name in the search field.
5. Change the rule's Action to Block.
6. Select Next and then select Save.

1. In the Cloudflare dashboard, go to the Network analytics page.
  Go to Network analytics
2. Apply filters to the displayed data.

For WAF/CDN customers

1. Select the zone that is experiencing an incomplete mitigation of a DDoS attack.
2. Go to Security > Analytics > Events tab.
3. Select Add filter and filter by Service equals HTTP DDoS.

For Magic Transit and Spectrum customers

1. Go to Account Home > Analytics & Logs > Network Analytics.
2. Identify the DDoS attack that is having incomplete mitigations. Use the Attack ID number included in the DDoS alert (if you received one), or apply dashboard filters such as destination IP address and port.

1. Scroll down to Top events by source > HTTP DDoS rules.
2. Copy the rule name.
3. Go to your zone > Security > Security rules > DDoS protection tab and select Create override. If you cannot deploy any additional overrides, edit an existing override to adjust rule configuration.
4. Select Browse rules and paste the rule name in the search field.
5. Change the rule's Action to Block.
6. Select Next and then select Save.

Once saved, the rule takes effect within one or two minutes. The rule adjustment should provide immediate remedy, which you can view in the analytics dashboard.

#### Alternate procedure

If you cannot stop an attack from overloading your origin web server using the above steps, contact Cloudflare Support for assistance, providing the following details:

- Time period of the attack (UTC timestamp)
- Domain/path being targeted (zone name/ID)
- Attack frequency
- Steps to reproduce the issue, with actual results versus expected results
- Any relevant additional information such as site URLs, error messages, screenshots, or relevant logs from your origin web server

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

## Network-layer DDoS Attack Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/)

Page options # Network-layer DDoS Attack Protection

The Cloudflare Network-layer DDoS Attack Protection managed ruleset is a set of pre-configured rules used to match known DDoS attack vectors at levels 3 and 4 of the OSI model.

Cloudflare updates the list of rules in the managed ruleset on a regular basis. Refer to the changelog for more information on recent and upcoming changes.

The Network-layer DDoS Attack Protection managed ruleset is always enabled — you can only customize its behavior.

## Ruleset configuration

You may need to adjust the behavior of specific rules in case of false positives or due to specific traffic patterns.

Adjust the behavior of the rules in the managed ruleset by modifying the following parameters:

- The performed action when an attack is detected
- The sensitivity level of attack detection mechanisms

To adjust rule behavior, use one of the following methods:

- Configure the managed ruleset in the Cloudflare dashboard.
- Configure the managed ruleset via Cloudflare API.
- Configure the managed ruleset using Terraform.

You can only configure the behavior of the managed ruleset to set a stronger mitigation action or a lower sensitivity. Refer to Managed ruleset parameters for more information.

Overrides can apply to all packets or to a subset of incoming packets, depending on the override expression. Refer to Override expressions for more information.

## Availability

The Network-layer DDoS Attack Protection managed ruleset is available in all Cloudflare plans for:

- Zones onboarded to Cloudflare (zones with their traffic routed through the Cloudflare network)
- IP applications onboarded to Spectrum
- IP prefixes onboarded to Magic Transit

However, only Magic Transit and Spectrum customers on an Enterprise plan can customize the managed ruleset.

## Related Cloudflare products

Magic Transit customers can configure the following additional products:

- Enable Advanced TCP Protection to detect and mitigate sophisticated out-of-state TCP attacks such as randomized and spoofed ACK floods or SYN and SYN-ACK floods.
- Create custom Magic Firewall rules to block additional network-layer attacks.

Spectrum customers can use IP Access rules to block additional network-layer attacks.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/override-parameters/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/override-parameters/)

Page options # Parameters

Define overrides for the Network-layer DDoS Attack Protection managed ruleset to change the action applied to a given attack or modify the sensitivity level of the detection mechanism. You can define overrides in the Cloudflare dashboard or define overrides via Rulesets API.

The available parameters are the following:

- Action
- Sensitivity Level

## Action

API property name: "action".

The action performed for packets that match specific rules of Cloudflare's DDoS mitigation services. The available actions are:

- Log

API value: "log".
Only available on Enterprise plans. Logs requests that match the expression of a rule detecting network layer DDoS attacks. Recommended for validating a rule before committing to a more severe action. Refer to the Analytics documentation for more information on how to view logged or monitored traffic.
- API value: "log".
- Only available on Enterprise plans. Logs requests that match the expression of a rule detecting network layer DDoS attacks. Recommended for validating a rule before committing to a more severe action. Refer to the Analytics documentation for more information on how to view logged or monitored traffic.
- Block

API value: "block".
Blocks IP packets that match the rule expression given the sensitivity levels.
- API value: "block".
- Blocks IP packets that match the rule expression given the sensitivity levels.
- DDoS Dynamic

API value: N/A (internal rule action that you cannot use in overrides).
Performs a specific action according to a set of internal guidelines defined by Cloudflare. The executed action can be Block or an undisclosed mitigation action.
- API value: N/A (internal rule action that you cannot use in overrides).
- Performs a specific action according to a set of internal guidelines defined by Cloudflare. The executed action can be Block or an undisclosed mitigation action.

## Sensitivity Level

API property name: "sensitivity_level".

Defines how sensitive a rule is. Affects the thresholds used to determine if an attack should be mitigated. A higher sensitivity level means having a lower threshold, while a lower sensitivity level means having a higher threshold.

The available sensitivity levels are:

| UI value | API value |
| --- | --- |
| High | "default" |
| Medium | "medium" |
| Low | "low" |
| Essentially Off | "eoff" |

The default sensitivity level is High.

In most cases, when you select the Essentially Off sensitivity level the rule will not trigger for any of the selected actions, including Log. However, if the attack is extremely large, Cloudflare's protection systems will still trigger the rule's mitigation action to protect Cloudflare's network.

Essentially Off means that we have set an exceptionally low sensitivity level so in most cases traffic will not be mitigated for you. However, attack traffic will be mitigated at exceptional levels to ensure the safety and stability of the Cloudflare network.

Log means that requests will not be mitigated but only logged and shown on the dashboard. However, attack traffic will be mitigated at exceptional levels to ensure the safety and stability of the Cloudflare network.

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

## Rule categories

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/rule-categories/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/rule-categories/)

Page options # Rule categories

The main categories (or tags) of Network-layer DDoS Attack Protection managed rules are the following:

| Name | Description |
| --- | --- |
| gre | Rules for DDoS attacks over Generic Routing Encapsulation (GRE) that usually target GRE endpoints. |
| esp | Rules for DDoS attacks related to the Encapsulating Security Payload (ESP) protocol, which is part of the IPsec secure network protocol suite. |
| advanced | Rules related to features available to Enterprise customers, such as Adaptive DDoS Protection. |
| generic | Rules for detecting and mitigating floods of packets. These rules are useful for mitigating attacks that have no known signatures, but they may also trigger on unusually high volumes of legitimate traffic. To reduce the risk of false positives, their packet per second (pps) activation threshold is higher. These rules rate-limit traffic by default, but you can override them to block traffic if necessary. |
| read-only | Highly targeted rules for mitigating DDoS attacks with a high confidence rate. These rules are read-only — you cannot override their sensitivity level or action. |
| test | Rules used for testing the detection, mitigation, and alerting capabilities of Cloudflare's DDoS protection products. |

There are other rule categories based on the attack vector/protocol, such as dns, quic, and sip. The categories list is dynamic and may change over time.

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

## Overrides

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/)

Page options # Overrides

When Cloudflare's DDoS Protection systems detect an attack, an ephemeral mitigation rule is created and installed in-line to mitigate the attack. A mitigation rule is generated based on the logic of the DDoS Protection managed ruleset. Each mitigation rule is generated from a single managed rule.

All mitigations and its associated managed rules are evaluated in order by the DDoS systems one by one. Cloudflare will go through all of the rule overrides defined in the ruleset overrides until one matches the managed rule, and apply the action and stop at that point. Otherwise, the evaluation will continue in order until a rule matches.

You can create only one ruleset override that can contain one or multiple rule overrides.

Note

Enterprise customers with the Advanced DDoS Protection add-on can create up to 10 ruleset overrides.

A rule override instructs the DDoS system on the action it should take against the attack according to its matching managed rule.

However, within a rule override, specificity matters and the DDoS system will choose the more specific configuration. A rule override takes precedence over the ruleset override.

## Example

A DDoS managed ruleset contains the following managed rules:

- Managed rule 1
- Managed rule 2
- Managed rule 3

The following ruleset overrides have been configured:

- Ruleset override A

Managed rule 1 is set to block
- Managed rule 1 is set to block
- Ruleset override B

The action of the entire ruleset (or all managed rules) is set to Managed Challenge
Managed rule 1 is set to log
Managed rule 2 is set to log
- The action of the entire ruleset (or all managed rules) is set to Managed Challenge
- Managed rule 1 is set to log
- Managed rule 2 is set to log
- Ruleset override C

Managed rule 3 is set to log
- Managed rule 3 is set to log

### Use case

A DDoS attack was detected on managed rules 1, 2, and 3, and has generated a mitigation rule.

- Since managed rule 1 matches ruleset override A, Cloudflare will block the attacks and not proceed with the rest of the rules.
- Managed rule 2 does not match ruleset override A, so Cloudflare proceeds to ruleset override B.  Ruleset override B matches both all managed rules and managed rule 2, but specificity takes precedence. It does not challenge and instead proceeds with log since it matches the most specific managed rule.
- Managed rule 3 does not match ruleset override A, so Cloudflare proceeds to rule override B. Since ruleset override B sets all managed rules to challenge, then Cloudflare does not proceed to ruleset override C.

An additional dimension to take into account is Cloudflare’s DDoS systems will apply a given rule override only if its conditions are met — which includes the Sensitivity level. So, while it needs to match and modify the correct managed rule (or everything in the case of all managed rules above), it also has to meet the specified Sensitivity level of the rule.

- Rule override A

All managed rules are set to challenge at low sensitivity
- All managed rules are set to challenge at low sensitivity
- Rule override B

Managed rule 1 is set to log at default sensitivity
- Managed rule 1 is set to log at default sensitivity

You receive a small attack below the threshold for low sensitivity, but above the threshold for high sensitivity on managed rule 1.

- Rule override A does not meet the low sensitivity threshold. Therefore, we do not match the override and do not mitigate the attack, but proceed to evaluate the next managed rule in case the rule override instructs DoS to mitigate.
- Rule override B sets log at default visibility, which matches the condition. So, the defined action is applied and attack traffic is logged.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/configure-dashboard/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/configure-dashboard/)

Page options # Configure in the dashboard

Configure the Network-layer DDoS Attack Protection managed ruleset by defining overrides in the Cloudflare dashboard. DDoS overrides allow you to customize the action and sensitivity of one or more rules in the managed ruleset.

You define overrides for the Network-layer DDoS Attack Protection managed ruleset at the account level.

For more information on the available parameters and allowed values, refer to Ruleset parameters.

## Create a DDoS override

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Network-layer DDoS Protection.
3. Select Deploy a DDoS override.
4. In Set scope, specify if you wish to apply the override to all incoming packets or to a subset of the packets.
5. If you are creating an override for a subset of the incoming packets, define the custom expression that matches the incoming packets you wish to target in the override, using either the Rule Builder or the Expression Editor.
6. Select Next.
7. Depending on what you wish to override, refer to the following sections (you can perform both configurations on the same override):
 Configure all the rules in the ruleset (ruleset override)
 
Select Next.
Enter a name for your override in Execution name.
To always apply a given action for all the rules in the ruleset, select an action in Ruleset action.
To set the sensitivity level for all the rules in the ruleset, select a value in Ruleset sensitivity.
 
 Configure one or more rules
 
Search for the rules you wish to override using the available filters. You can search for tags.
To override a single rule, select the desired value for a field in the displayed dropdowns next to the rule.
To configure more than one rule, select the rules using the row checkboxes and update the fields for the selected rules using the dropdowns displayed before the table. You can also configure all the rules with a given tag. For more information, refer to Configure rules in bulk in a managed ruleset.
14. Select Next.
15. Enter a name for your override in Execution name. 
Notes
Tag and rule overrides have priority over ruleset overrides.

The managed ruleset includes some read-only rules that you cannot override.
8. Select Next.
9. Enter a name for your override in Execution name.
10. To always apply a given action for all the rules in the ruleset, select an action in Ruleset action.
11. To set the sensitivity level for all the rules in the ruleset, select a value in Ruleset sensitivity.
12. Search for the rules you wish to override using the available filters. You can search for tags.
13. To override a single rule, select the desired value for a field in the displayed dropdowns next to the rule.
14. Tag and rule overrides have priority over ruleset overrides.
15. The managed ruleset includes some read-only rules that you cannot override.
16. To save and deploy the override, select Deploy. If you are not ready to deploy your override, select Save as Draft.

### Delete a DDoS override

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account.
2. Go to Security > DDoS.
3. Next to the DDoS override you wish to delete, select Delete.
4. Select Delete to confirm the operation.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules > DDoS protection tab.
3. Select the override.
4. Select Delete deployment.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/configure-api/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/configure-api/)

Page options # Configure via API

Configure the Cloudflare Network-layer DDoS Attack Protection managed ruleset by defining overrides at the account level using the Rulesets API.

Each account has the Network-layer DDoS Attack Protection managed ruleset enabled by default. This means that you do not need to deploy the managed ruleset to the ddos_l4 phase entry point ruleset explicitly. You only have to create a rule in the phase entry point to deploy the managed ruleset if you need to configure overrides.

If you are using Terraform, refer to DDoS managed rulesets configuration using Terraform.

## Configure an override for the Network-layer DDoS Attack Protection managed ruleset

You can define overrides at the ruleset, tag, and rule level for all managed rulesets.

When configuring the Network-layer DDoS Attack Protection managed ruleset, use overrides to define a different action or sensitivity from the default values. For more information on these rule parameters and the allowed values, refer to Managed ruleset parameters.

Important

- The Network-layer DDoS Attack Protection managed ruleset is always enabled. You cannot disable its rules using an override with "enabled": false.
- The managed ruleset includes some read-only rules that you cannot override.
- You can only define overrides for the Network-layer DDoS Attack Protection managed ruleset at the account level.

## Example

The following PUT example creates a new phase ruleset (or updates the existing one) for the ddos_l4 phase at the account level. The request includes several overrides to adjust the default behavior of the Network-layer DDoS Attack Protection managed ruleset. These overrides are the following:

- All rules of the Network-layer DDoS Attack Protection managed ruleset will have their sensitivity set to medium.
- All rules tagged with <TAG_NAME> will have their sensitivity set to low.
- The rule with ID <MANAGED_RULESET_RULE_ID> will use the block action.

The overrides apply to all packets matching the rule expression: ip.dst in { 1.1.1.0/24 }.

Request ```
curl --request PUT \https://api.cloudflare.com/client/v4/accounts/{account_id}/rulesets/phases/ddos_l4/entrypoint \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "description": "Define overrides for the Network-layer DDoS Attack Protection managed ruleset",  "rules": [    {      "action": "execute",      "expression": "ip.dst in { 1.1.1.0/24 }",      "action_parameters": {        "id": "<MANAGED_RULESET_ID>",        "overrides": {          "sensitivity_level": "medium",          "categories": [            {              "category": "<TAG_NAME>",              "sensitivity_level": "low"            }          ],          "rules": [            {              "id": "<MANAGED_RULESET_RULE_ID>",              "action": "block"            }          ]        }      }    }  ]}'
```

The response returns the created (or updated) phase entry point ruleset.

Response

```
{  "result": {    "id": "<PHASE_ENTRY_POINT_RULESET_ID>",    "name": "default",    "description": "Define overrides for the Network-layer DDoS Attack Protection managed ruleset",    "kind": "root",    "version": "1",    "rules": [      {        "id": "<RULE_ID>",        "version": "1",        "action": "execute",        "action_parameters": {          "id": "<MANAGED_RULESET_ID>",          "version": "latest",          "overrides": {            "categories": [              {                "category": "<TAG_NAME>",                "sensitivity_level": "low"              }            ],            "rules": [              {                "id": "<MANAGED_RULESET_RULE_ID>",                "action": "block"              }            ],            "sensitivity_level": "medium"          }        },        "expression": "ip.dst in { 1.1.1.0/24 }",        "last_updated": "2021-08-16T04:14:47.977741Z",        "ref": "<RULE_REF>",        "enabled": true      }    ],    "last_updated": "2021-08-16T04:14:47.977741Z",    "phase": "ddos_l4"  }}
```

For more information on defining overrides for managed rulesets using the Rulesets API, refer to Override a managed ruleset.

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

## Override expressions

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/override-expressions/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/override-expressions/)

Page options # Override expressions

Set an override expression for the Network-layer DDoS Attack Protection managed ruleset to define a specific scope for sensitivity level or action adjustments. For example, you can set different sensitivity levels for different destination IP addresses or ports: a medium sensitivity level for destination IP address A and a low sensitivity level for destination IP address B.

## Available expression fields

You can use the following fields in override expressions:

- ip.src
- ip.dst
- ip.proto.num
- ip.len
- ip.ttl
- tcp.srcport
- tcp.dstport
- tcp.flags
- tcp.flags.ack
- tcp.flags.fin
- tcp.flags.push
- tcp.flags.reset
- tcp.flags.syn
- tcp.flags.urg
- udp.srcport
- udp.dstport

Refer to the Fields reference in the Rules language documentation for more information.

## Important remarks

- Each expression is limited to 4,000 characters, which means you can enter approximately a maximum of 200 IP addresses in a single expression. However, you can enter IP addresses in CIDR format, which allows you to include a larger number of IP addresses. For example, you can use 192.0.0.0/24 to match IP addresses from 192.0.0.0 to 192.0.0.255.
- Override expressions are not allowlists. They apply to the mitigation, not during detection. This means an override only takes effect if the attack fingerprint — as generated by the DDoS managed rules — includes the same fields specified in your expression.

For example, if you create an override with sensitivity set to Essentially Off for ip.src eq 192.0.2.1, it only applies if the fingerprint includes ip.src. However, because DDoS attacks are often distributed across many source IPs, the fingerprint may not include ip.src at all. In such cases, your override is not applied.

In a common scenario, an attack originating from thousands of IPs can target a single destination IP and port. The fingerprint would focus on the shared attributes, such as the destination IP, port, and additional packet fields that represent strong signals of the attack pattern. Even if your override matches a specific source IP, it will not apply if that field is not present in the fingerprint. As a result, the system will mitigate the attack using the default high sensitivity, and traffic from your specified IP could still be blocked. It is recommended to use more stable expressions such as protocol, destination IP, and destination port.

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

## Override examples

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/override-examples/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/network/network-overrides/override-examples/)

Page options # Override examples

## Use cases

The following scenarios detail how you can make use of override rules as a solution to common Network DDoS Protection issues.

### VPN traffic is blocked by a UDP rule

If you have VPN traffic concentrated to a single or a few single destination IP addresses and the traffic is being blocked by a UDP rule, you can create an override rule for the UDP rule to the destination IPs or ranges.

Note

The override only applies to the fingerprint and not the detection. Refer to Important remarks for more information.

### Attack traffic is flagged by the adaptive rule based on UDP and destination port

If you recognize that the traffic flagged by the adaptive rule based on UDP and destination port is an attack, you create an override rule to enable the adaptive rule in mitigation mode, setting the action to block the traffic.

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

## Adaptive DDoS Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/managed-rulesets/adaptive-protection/](https://developers.cloudflare.com/ddos-protection/managed-rulesets/adaptive-protection/)

Page options # Adaptive DDoS Protection

Adaptive DDoS Protection learns your unique traffic patterns and adapts to them to provide better protection against sophisticated DDoS attacks on layer 7 and layers 3/4, depending on your subscribed Cloudflare services.

Adaptive DDoS Protection provides the following types of protection:

- Adaptive DDoS Protection for Origins: Detects and mitigates traffic that deviates from your site's origin errors profile.
- Adaptive DDoS Protection for User-Agents: Detects and mitigates traffic that deviates from the top User Agents seen by Cloudflare on the network. The User Agent profile is built from the entire Cloudflare network and not only from the customer's zone.
- Adaptive DDoS Protection for Locations: Detects and mitigates traffic that deviates from your site's geo-distribution profile. The profile is calculated from the rate for every client country and region, using the rates from the past seven days.
- Adaptive DDoS Protection for Protocols: Detects and mitigates traffic that deviates from your traffic's IP protocol profile. The profile is calculated as a global rate for each of your prefixes.

## Availability

Cloudflare Adaptive DDoS Protection is available to Enterprise customers according to the following table:

| Feature | Profiling dimension | WAF/CDN1 | Magic Transit /Spectrum BYOIP2 |
| --- | --- | --- | --- |
| HTTP Adaptive DDoS Protection |  |  |  |
| For Origins | Origin errors | Yes | — |
| For User-Agents | User Agent(entire Cloudflare network) | Yes | — |
| For Locations | Client IP country and region | Yes | — |
| L3/4 Adaptive DDoS Protection |  |  |  |
| For Protocols | IP protocol | — | Yes |
| For Protocols | Client IP country and Region for UDP | — | Yes |

1 WAF/CDN customers on the Enterprise plan with the Advanced DDoS Protection subscription.
2 Magic Transit and Spectrum BYOIP customers on an Enterprise plan.

## How it works

Adaptive DDoS Protection creates a traffic profile by looking at the maximum rates of traffic every day, for the past seven days. These profiles are recalculated every day, keeping the seven-day time window. Adaptive DDoS Protection stores the maximal traffic rates seen for every predefined dimension value (the profiling dimension varies for each rule). Every profile uses one dimension, such as the source country of the request, the user agent, and the IP protocol. Incoming traffic that deviates from your profile may be malicious.

To eliminate outliers, rate calculations only consider the 95th percentile rates (discarding the top 5% of the highest rates). Cloudflare requires a minimum amount of requests per second (rps) to build traffic profiles. HTTP Adaptive DDoS Protection rules also take into account Cloudflare's Machine Learning (ML) models to identify traffic that is likely automated.

Cloudflare may change the logic of these protection rules from time to time to improve them. Any rule changes will appear in the Managed rulesets changelog page.

## View flagged traffic

To view traffic flagged by HTTP Adaptive DDoS Protection rules:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Events.
3. Filter by Service equals HTTP DDoS and by rule ID.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Analytics > Events.
3. Filter by Service equals HTTP DDoS and by rule ID.

To view traffic flagged by L3/4 Adaptive DDoS Protection rules:

- Old dashboard
- New dashboard

1. In the Cloudflare dashboard, go to the Network analytics page.
  Go to Network analytics
2. Filter by rule ID.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Analytics > Events.
3. Filter by rule ID.

You may also obtain information about flagged traffic through Logpush or the GraphQL API.

To determine if an adaptive rule fits your traffic in a way that will only mitigate attack traffic and will not cause false positives, review the traffic that is Logged by the adaptive rules.

Note

You may not see any traffic matching the adaptive rules. This can be because there was no deviation from your traffic profile, so you may want to increase the time range and look for any Logged traffic. Another reason why you may not see Logged traffic by the adaptive rules is that there was not sufficient traffic volume to generate a traffic profile for your zone.

If you do see traffic that was Logged by the adaptive rules, use the dashboard to determine if the traffic matches the characteristics of legitimate users or that of attack traffic. As each Internet property is unique, understanding if the traffic is legitimate requires your understanding of how your legitimate traffic looks. For example, the user agent, source country, headers, query string for HTTP requests, and protocols and ports for L3/4 traffic.

- In cases where you are certain that the rule is only flagging attack traffic, you should consider creating an override and enabling that rule with a Managed Challenge or Block action.
- In cases where you see legitimate traffic being flagged, you should lower the sensitivity level of the rule and observe the flagged traffic. You can continue reducing the sensitivity level until you reach a point where legitimate traffic is not flagged. Then, you should create an override to enable the rule with a mitigation action.
- If the rule is still flagging legitimate traffic you can consider using the expression filters to condition the rules to exclude certain types of traffic.

The default rule action for log with a sensitivity set to high will only show packets or requests with suspected attack traffic over internal high thresholds in your logs. For instance, if you set the threshold to medium or low, then only packets over those thresholds will be logged.

## Configure the rules

You can adjust the action and sensitivity of the Adaptive DDoS Protection rules. The default action is Log. Use this action to first observe what traffic is flagged before deciding on a mitigation action.

To configure a rule, refer to the instructions in the following pages:

- Configure HTTP DDoS Attack Protection in the dashboard (for L7 rules)
- Configure Network-layer DDoS Attack Protection in the dashboard (for L3/4 rules)

For more information on the available configuration parameters, refer to the following pages:

- For the (L7) DDoS protection rules for Origins, User-Agents, and Locations:
HTTP DDoS Attack Protection parameters
- For the (L3/4) DDoS protection rules for Protocols:
Network-layer DDoS Attack Protection parameters

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

## General settings

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/)

Page options # General settings

The Advanced DDoS Protection system includes Advanced TCP Protection and Advanced DNS Protection. Both systems are configured using the general settings, but also comprise of their own dedicated settings.

Advanced DDoS Protection systems is available to Magic Transit customers.

Protection for simpler TCP or DNS-based DDoS attacks is included as part of the Network-layer DDoS Attack Protection managed ruleset.

General settings enable and control the use of the Advanced TCP Protection and the Advanced DNS Protection systems, and are composed of thresholds, prefixes, rules, and enablement.

## Thresholds

Thresholds are based on your network's unique traffic and are configured by Cloudflare. The sensitivity levels manipulate the thresholds.

When you get access to Advanced DDoS Protection systems, you are automatically provisioned with default settings in monitoring mode.

Thresholds are based on your network's individual behavior, derived from your traffic profile as monitored by Cloudflare. Defining the thresholds will effectively determine what the High, Medium, and Low sensitivities will be for your specific case.

If needed, you can change the sensitivity levels that will manipulate the thresholds for Advanced TCP Protection and Advanced DNS Protection from the default settings.

Once thresholds are configured, the Advanced DDoS Protection systems have been initialized and enabled in monitoring mode.

### Automatic thresholds

Automatic thresholds for Cloudflare's Advanced DDoS Protection system optimizes the detection and mitigation of DDoS attacks by automatically calculating appropriate traffic thresholds for each system for each customer account. This system applies to Advanced TCP Protection (specifically SYN Flood Protection and Out-of-State TCP Flood Protection) and Advanced DNS Protection.

Make sure that you have properly onboarded to the Advanced DDoS Protection system to benefit from automatic thresholds.

#### Process

The automatic threshold system calculates thresholds every 10 minutes for both new and existing Magic Transit accounts, provided they meet the requirements outlined in the process below.

- The flowtrackd account was created within the past 7 to 10 days.
- The account has at least one configured global threshold (rate and burst). This can be a threshold that was automatically provisioned by the system or manually provisioned by Cloudflare.

These checks are performed independently for SYN Flood Protection, Out-of-State TCP Flood Protection, and Advanced DNS Protection. The criteria does not require the presence of any rules to be configured. Accounts initially provisioned by the automatic system will have default thresholds. Otherwise, thresholds may be unconfigured if they are not set by Cloudflare.

After seven days, the system calculates a rate and burst threshold for each of the protection components. However, they are not applied. Cloudflare must review the draft thresholds produced by the automatic calculation system before creating real thresholds for your traffic.

Thresholds are applied globally per account. There is no minimum packets-per-second (pps) requirement for threshold calculation, but for those under 100 pps, the system will default to a reasonable non-zero rate and burst.

Thresholds are derived using the 95th percentile (P95) of observed traffic over the preceding seven days:

- SYN Flood Protection: Based on SYN and SYN-ACK traffic.
- Out-of-State TCP Flood Protection: Based on all other TCP flag traffic.
- Advanced DNS Protection: Based on DNS over UDP traffic.

While the calculation typically occurs automatically after seven days, Cloudflare can force an earlier calculation if you want to enable the system in protective mode in advance.

The automatic threshold calculation system does not differentiate between legitimate and attack traffic. If you are onboarded or experience attacks during the seven day observation period, the calculated thresholds may be inaccurate, depending on the attack's size, duration, and frequency relative to legitimate traffic. In such cases, Cloudflare will likely need to trigger a recalculation. Future improvements will allow you to run a recalculation without the assistance of your Cloudflare account team.

#### Implementation

You should enable the automatically provisioned rules. Initially, these rules will have default values and operate in Monitor mode. After seven days, once thresholds are calculated, you can use the Network Analytics dashboard to observe what packets would have been dropped or allowed, then safely enable the rules in mitigation mode. Depending on what is observed in the Network Analytics dashboard (for example, legitimate traffic is being flagged in Monitor mode), you may want to change the sensitivity level and continue observation before enabling in mitigation mode. Rules and Filters, where supported, can also be scoped to allow for additional granularity.

#### Recalculation

Automatic thresholds are calculated only once. Cloudflare can manually trigger a recalculation. Adding, approving, removing, delegating, advertising, or withdrawing prefixes after initial onboarding does not automatically re-trigger the calculation. It is recommended to move the relevant systems to Monitor mode before making changes that impact traffic levels and requesting a recalculation from Cloudflare. Future improvements will take these events into consideration.

#### Overrides

Automatically calculated thresholds can be overridden. Cloudflare can help manually define thresholds.

#### Considerations

If you are actively under attack and diverting traffic to Cloudflare, the automatic threshold calculation is unlikely to be effective as it will incorporate attack traffic. In these scenarios, Cloudflare will still need to manually configure thresholds. If you are not under attack while diverting traffic, Cloudflare can force a threshold calculation with available data. However, less data, such as fewer days or hours of observation, will result in less accurate thresholds.

#### Limitations

Customers currently do not have visibility into the calculated thresholds or an indication of whether thresholds have been configured. Future improvements aim to indicate when thresholds have been configured and when they were last updated.

The auto-threshold calculation component currently runs only in PDX. Therefore, this feature is not compatible if you have enabled Data Localization Services (DLS) and are located outside of the US, such as EU CMB. Future improvements will address this limitation.

## Prefixes

The prefixes that you have onboarded to and approved by Cloudflare instruct the system on which traffic to route through the system.

Add the prefixes you would like to use with Advanced TCP and DNS Protection. You will be able to register prefixes that you previously onboarded to Magic Transit or a subset of these prefixes.

You cannot add unapproved prefixes to Advanced DDoS Protection systems. Contact your account team to get help with prefix approvals.

Optionally, you can add prefixes to the allowlist if your traffic should bypass Advanced DDoS Protection rules.

The allowlist only applies to source IPs — it does not apply to your own IPs or prefixes. You can also exclude a subset of an onboarded prefix from Advanced TCP Protection.

Refer to Concepts for more information.

## Rules

Create a rule for Advanced TCP and Advanced DNS Protection (as needed) to enable mitigation.

You can create a rule for SYN Flood Protection and another rule for Out-of-state TCP Protection, both with global scope and in monitoring mode. These rules will apply to all received packets.

Optionally, you can create filters for each protection system component (SYN flood protection and out-of-state TCP protection).

A filter modifies Advanced TCP Protection's execution mode — monitoring, mitigation (enabled), or disabled — for all incoming packets matching an expression.

## Enablement

Enable the Advanced DDoS system and begin routing traffic through it.

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection > General settings.
3. Under General settings, toggle the feature status On.

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

## Advanced TCP Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/advanced-tcp-protection/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/advanced-tcp-protection/)

Page options # Advanced TCP Protection

Cloudflare's Advanced TCP Protection, powered by flowtrackd ↗, is a stateful TCP inspection engine used to detect and mitigate sophisticated out-of-state TCP attacks such as randomized and spoofed ACK floods or SYN and SYN-ACK floods.

Note

Advanced TCP and DNS Protection systems are automatically enabled in Monitor mode with the default thresholds for new Magic Transit customers and their authorized prefixes.

Magic Transit customers can also enable the Advanced DDoS systems when the prefixes are ready, change the sensitivity level, or adjust the thresholds by contacting their account team.

## How it works

Advanced TCP Protection can simultaneously protect against different kinds of attacks:

- Pinpointed attacks targeting a specific destination IP/port combination.
- Broad attacks targeting multiple IP addresses of an IP prefix at the same time.

Advanced TCP Protection can track TCP connections even when they move between Cloudflare data centers.

The feature offers two types of protection:

- SYN Flood Protection: Protects against attacks such as fully randomized SYN and SYN-ACK floods.
- Out-of-state TCP Protection: Protects against out-of-state TCP DDoS attacks such as fully randomized ACK floods and RST floods.

Each protection type is configured independently using rules and (optionally) filters. You should configure at least one rule for each type of protection before enabling Advanced TCP Protection.

### SYN Flood Protection

This system protects against attacks such as fully randomized SYN and SYN-ACK floods. You should configure at least one SYN flood rule before enabling Advanced TCP Protection.

In mitigation mode, SYN flood rules will challenge new connection initiation requests (SYN, SYN-ACK) if they exceed the configured packet-per-second thresholds. The threshold should be higher than the normal rate of legitimate SYN and SYN-ACK packets that your network receives. Packets below the threshold will not be challenged. Using the rate sensitivity and burst sensitivity settings you can increase or decrease the tolerance of SYN and SYN-ACK packets.

For more information on the configuration settings of SYN flood rules, refer to Rule settings.

### Out-of-state TCP Protection

This system protects against out-of-state TCP DDoS attacks such as fully randomized ACK floods and RST floods. You should configure one out-of-state TCP rule before enabling Advanced TCP Protection.

In mitigation mode, out-of-state TCP rules will drop out-of-state packets that do not belong to existing (and tracked) TCP connections if their rates exceed the configured thresholds. The threshold should be higher than the normal rate of non SYN or SYN-ACK TCP packets that your network receives. Packets below the threshold will not be evaluated. Using the rate sensitivity and burst sensitivity settings you can increase or decrease the tolerance of out-of-state TCP packets.

For more information on the configuration settings of out-of-state TCP rules, refer to Rule settings.

## Setup

Create a global configuration to set up SYN Flood and Out-of-state TCP rules and filters for Advanced TCP Protection.

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

## Advanced DNS Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/advanced-dns-protection/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/overview/advanced-dns-protection/)

Page options # Advanced DNS Protection

Cloudflare's Advanced DNS Protection, powered by flowtrackd ↗, provides stateful protection against DNS-based DDoS attacks, specifically sophisticated and fully randomized DNS attacks such as random prefix attacks.

Note

Advanced TCP and DNS Protection systems are automatically enabled in Monitor mode with the default thresholds for new Magic Transit customers and their authorized prefixes.

Magic Transit customers can also enable the Advanced DDoS systems when the prefixes are ready, change the sensitivity level, or adjust the thresholds by contacting their account team.

## How it works

Cloudflare's Advanced DNS Protection works by first learning your traffic patterns and forming a baseline of the type of DNS queries you normally receive. Later, the system will be able to distinguish between legitimate and malicious queries, protecting your DNS infrastructure without impacting legitimate traffic.

Currently, the protection system only analyzes DNS over UDP (it does not include DNS over TCP).

The Network Analytics dashboard will display system-specific analytics for Advanced DNS Protection in the DNS protection tab, including the queried domains and record types.

## Setup

Create a rule to enable Advanced DNS Protection.

## Data collection

Cloudflare collects DNS-related data such as query type (for example, A record) and the queried domains. For details, refer to Data collection.

Warning

Currently, to disable this data collection you must remove your prefixes either in the Cloudflare dashboard or through the Delete a prefix API operation. However, this procedure will remove the prefixes from both Advanced DNS Protection and Advanced TCP Protection.

## Troubleshooting

### No data about Advanced DNS Protection in Network Analytics

If you cannot find any data related to Advanced DNS Protection in the DNS Protection tab of Network Analytics, it could be because one of these reasons:

- You did not add your prefixes to Advanced L3/4 DDoS Protection.
- Accounts that existed before January 2025 were not automatically provisioned. If you onboarded before January 2025, Advanced DNS Protection may not have been enabled for your account.
- You do not have any DNS over UDP traffic.

## Related products

Advanced DNS Protection can protect you against volumetric DNS DDoS attacks. To perform DNS caching, proxying, and configuration, use the Cloudflare DNS Firewall.

Currently, Advanced DNS Protection is not available for DNS Firewall.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/concepts/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/concepts/)

Page options # Concepts

## Prefixes

Advanced DDoS Protection protects the IP prefixes you select from sophisticated DDoS attacks. A prefix can be an IP address or an IP range in CIDR format. You must add prefixes to Advanced DDoS Protection so that Cloudflare can analyze incoming packets and offer protection against sophisticated TCP DDoS attacks.

Prefixes added to Advanced DDoS Protection must be one of the following:

- A prefix onboarded to Magic Transit.
- A subset of a prefix onboarded to Magic Transit.

You cannot add a prefix (or a subset of a prefix) that you have not onboarded to Magic Transit or whose status is still Unapproved. Contact your account team to get help with prefix approvals.

## Allowlist

The Advanced DDoS Protection allowlist is a list of prefixes that will bypass all configured Advanced DDoS Protection rules.

For example, you could add prefixes used only by partners of your company to the allowlist so that they are exempt from packet inspection and mitigation actions performed by Advanced DDoS Protection.

Important

Prefixes in the allowlist will be vulnerable to IP spoofing attacks. If an attacker can guess the source IP addresses you have allowlisted, their packets will be allowlisted.

## Rule

A rule configures Advanced DDoS Protection for a given scope, according to several settings: execution mode, burst sensitivity, and rate sensitivity.

Each system component (SYN flood protection and out-of-state TCP protection) has its own list of rules, and it should have at least one rule.

### Rule settings

Each rule type has the following settings: scope, mode, burst sensitivity, and rate sensitivity.

You may need to adjust the burst or rate sensitivity of a rule in case of false positives or due to specific traffic patterns.

#### Scope

Advanced TCP Protection rules can have one of the following scopes:

- Global: The rule will apply to all incoming packets.
- Region: The rule will apply to incoming packets in a selected region.
- Data center: The rule will apply to incoming packets in the selected Cloudflare data center.

The rule scope allows you to adjust the system's tolerance for out-of-state packets in locations where you may have more or less traffic than usual, or due to any other networking reasons.

Besides defining rules with one of the above scopes, you must also select the prefixes that you wish to protect with Advanced TCP Protection.

#### Mode

The Advanced TCP Protection system constantly learns your TCP connections to mitigate DDoS attacks. Advanced TCP Protection rules can have one of the following execution modes: monitoring, mitigation (enabled), or disabled.

- Monitoring

In this mode, Advanced TCP Protection will not impact any packets. Instead, the protection system will learn your legitimate TCP connections and show you what it would have mitigated. Check Network Analytics to visualize what actions Advanced TCP Protection would have taken on incoming packets, according to the current configuration. Refer to the Analytics documentation for more information on how to view logged or monitored traffic.
- In this mode, Advanced TCP Protection will not impact any packets. Instead, the protection system will learn your legitimate TCP connections and show you what it would have mitigated. Check Network Analytics to visualize what actions Advanced TCP Protection would have taken on incoming packets, according to the current configuration. Refer to the Analytics documentation for more information on how to view logged or monitored traffic.
- ​​Mitigation (Enabled)

In this mode, Advanced TCP Protection will learn your legitimate TCP connections and perform mitigation actions on incoming TCP DDoS attacks based on the rule configuration (burst and rate sensitivity) and your allowlist.
- In this mode, Advanced TCP Protection will learn your legitimate TCP connections and perform mitigation actions on incoming TCP DDoS attacks based on the rule configuration (burst and rate sensitivity) and your allowlist.
- Disabled

In this mode, a rule will not evaluate any incoming packets.
- In this mode, a rule will not evaluate any incoming packets.

#### Burst sensitivity

The burst sensitivity is the rule's sensitivity to short-term bursts in the packet rate:

- A low sensitivity means that bigger spikes in the packet rate may trigger a mitigation action.
- A high sensitivity means that smaller spikes in the packet rate may trigger a mitigation action.

The default burst sensitivity is Medium.

#### Rate sensitivity

The rate sensitivity is the rule's sensitivity to the sustained packet rate:

- A low sensitivity means that higher sustained packet rates can trigger a mitigation action.
- A high sensitivity means that lower sustained packet rates may trigger a mitigation action. A high sensitivity offers increased protection, but you may get more false positives (that is, mitigated packets that belong to legitimate traffic).

The default rate sensitivity is Medium.

#### Profile sensitivity

Note

Profile sensitivity is available for Advanced DNS Protection only.

The sensitivity to DNS queries that have not been recently seen.

- A higher sensitivity level means that the mitigation system will begin mitigating faster.
- A lower sensitivity provides more tolerance for potentially suspicious DNS queries.

The default rate sensitivity and recommended setting is Low. You should only increase sensitivity if it is needed based on observed attacks.

## Filter

A filter modifies Advanced TCP Protection's execution mode — monitoring, mitigation (enabled), or disabled — for all incoming packets matching an expression.

The filter expression can reference source and destination IP addresses and ports. Each system component (SYN flood protection and out-of-state TCP protection) should have one or more rules, but filters are optional.

Each system component has its own filters. You can configure a filter for each execution mode:

- Mitigation Filter: The system will drop packets matching the filter expression.
- Monitoring Filter: The system will log packets matching the filter expression.
- Off Filter: The system will ignore packets matching the filter expression.

When there is a match, a filter will alter the execution mode for all configured rules in a given system component (SYN flood protection or out-of-state TCP protection), including disabled rules.

For instructions on creating filters in the Cloudflare dashboard, refer to Create a filter. For API examples, refer to Common API calls.

### Example use case

You can create a monitor filter for a new prefix that you are onboarding by using the expression to match against the prefix.

Your already onboarded prefixes can remain protected with one or more configured rules in mitigation mode.

When onboarding a new prefix, you would configure a monitoring filter for this prefix and then add it to Advanced TCP Protection.

## Determining the execution mode

When you have both rules and filters configured, the execution mode is determined according to the following:

1. If there is a match for one of the configured filters, use the filter's execution mode. The filter evaluation order is based on their mode, in the following order:

Mitigation filter (filter with enabled mode)
Monitoring filter (filter with monitoring mode)
Off filter (filter with disabled mode)
2. Mitigation filter (filter with enabled mode)
3. Monitoring filter (filter with monitoring mode)
4. Off filter (filter with disabled mode)
5. If no filter matched, use the execution mode determined by existing rules.
6. If no rules match, disable Advanced TCP Protection.

## Mitigation reasons

The Advanced TCP Protection system applies mitigation actions for different reasons based on the connection states. The Mitigation reason field shown in the Advanced TCP Protection tab of the Network Analytics dashboard will contain more information on why a given packet was dropped by the system.

The connection states are the following:

- New: A SYN or SYN-ACK packet has been sent to attempt to open a new connection.
- Open: The three-way TCP handshake has been completed and the TCP connection is open.
- Closing: A FIN or FIN-ACK packet has been seen attempting to close a connection.
- Closed: The closing three-way handshake has been completed, or an RST packet has closed the connection.

The mitigation reasons are the following:

| Reason | Description |
| --- | --- |
| Unexpected | Packet dropped because it was not expected given the current state of the TCP connection it was associated with. |
| Challenge needed | Packet challenged because the system determined that the packet is most likely part of a packet flood. |
| Challenge passed | Packet dropped because it belongs to a solved challenge. |
| Not found | Packet dropped because it is not part of an existing TCP connection and it is not establishing a new connection. |
| Out of sequence | Packet dropped because its properties (for example, TCP flags or sequence numbers) do not match the expected values for the existing connection. |
| Already closed | Packet dropped because it belongs to a connection that is already closed. |

Mitigation will only occur based on your Advanced TCP Protection configuration (rule sensitivities, configured allowlists and prefixes). The protection system will provide some tolerance to out-of-state packets to accommodate for the natural randomness of Internet routing.

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

## Add a prefix

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/add-prefix/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/add-prefix/)

Page options # Add a prefix

To add a prefix to Advanced DDoS Protection:

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection.
3. Under General settings > Prefixes, select Edit.
4. Expand the Add existing prefix section and select Add next to the prefix you wish to add.
Alternatively, enter a prefix and (optionally) a description in Prefix and Description, respectively, and select Add.

Note

The Add existing prefix list will not display leased prefixes, but you can add them manually in the Cloudflare dashboard or using the API. You cannot add delegated prefixes to Advanced TCP Protection.

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

## Add an IP or prefix to the allowlist

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/add-prefix-allowlist/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/add-prefix-allowlist/)

Page options # Add an IP or prefix to the allowlist

To add an IP address or prefix to the Advanced DDoS Protection allowlist:

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection.
3. Under General settings > Allowlist, select Edit.
4. Enter a prefix and (optionally) a description in Prefix and Description, respectively.
5. To exclude the current prefix from the allowlist instead of including it, uncheck the Enabled checkbox. 6. Select Add.

Important

Prefixes in the allowlist will be vulnerable to IP spoofing attacks. If an attacker can guess the source IP addresses you have allowlisted, their packets will be allowlisted.

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

## Create a rule

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/create-rule/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/create-rule/)

Page options # Create a rule

## Create an Advanced TCP Protection rule

To create a SYN flood rule or an out-of-state TCP rule:

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection > Advanced TCP Protection.
3. Depending on the rule you are creating, do one of the following:

Under SYN Flood Protection, select Create SYN flood rule.
Under Out-of-state TCP Protection, select Create out-of-state TCP rule.
4. Under SYN Flood Protection, select Create SYN flood rule.
5. Under Out-of-state TCP Protection, select Create out-of-state TCP rule.
6. In Mode, select a 	mode for the rule.
7. Under Set scope, select a scope for the rule. If you choose to apply the rule to a subset of incoming packets, select a region or a data center.
8. Under Sensitivity, define the burst sensitivity and rate sensitivity of the rule (by default, Medium). The sensitivity levels are based on the initially configured thresholds for your specific case.
9. Select Deploy.

Note

Filters take precedence over rules. For details on how the execution mode is determined, refer to Determining the execution mode.

## Create an Advanced DNS Protection rule

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection > General settings.
3. Add the prefixes you wish to onboard. Advanced DNS Protection will only be applied to the prefixes you onboard. If you already onboarded the desired prefixes when you configured Advanced TCP Protection, you do not need to take any other action.
NoteCurrently, the list of onboarded prefixes is shared with Advanced TCP Protection. Any onboarded prefixes will be subject to both Advanced TCP Protection and Advanced DNS Protection, assuming that your account team has done the initial configuration of both systems. However, you can leave Advanced TCP Protection in monitoring mode.
4. Go to Advanced DNS Protection.
5. Select Create Advanced DNS Protection rule.
6. In Mode, select a mode for the rule.
7. Under Set scope, select a scope to determine the range of packets that will be affected by the rule.
8. Under Sensitivity, define the burst sensitivity, rate sensitivity, and profile sensitivity to determine when to initiate mitigation. 9. Select Deploy.

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

## Create a filter

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/create-filter/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/create-filter/)

Page options # Create a filter

A filter modifies Advanced TCP Protection's execution mode — monitoring, mitigation (enabled), or disabled — for all incoming packets matching an expression.

Each protection system component (SYN flood protection or out-of-state TCP protection) should have at least one rule, but filters are optional.

Note

Filters only apply to Advanced TCP Protection.

## Procedure

To create a filter for one of the system components:

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection > Advanced TCP Protection.
3. Under the system component for which you are creating the filter (SYN Flood Protection or Out-of-state TCP Protection), select Create next to the type of filter you want to create:

Mitigation Filter: The protection system will drop packets matching the filter expression. - Monitoring Filter: The protection system will log
packets matching the filter expression.
Off Filter: The protection system will ignore packets matching the filter expression.
4. Mitigation Filter: The protection system will drop packets matching the filter expression. - Monitoring Filter: The protection system will log
packets matching the filter expression.
5. Off Filter: The protection system will ignore packets matching the filter expression.
6. Under When incoming packets match, define a filter expression using the Expression Builder (specifying one or more values for Field, Operator, and Value), or manually enter an expression using the Expression Editor. For more information, refer to Edit rule expressions.
7. Select Save.

Note

Filters take precedence over rules. For details on how the execution mode is determined, refer to Determining the execution mode.

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

## Exclude a prefix

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/exclude-prefix/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/exclude-prefix/)

Page options # Exclude a prefix

To exclude a prefix or a prefix subset from Advanced DDoS Protection:

1. In the Cloudflare dashboard, go to the L3/4 DDoS protection page.
  Go to L3/4 DDoS protection
2. Go to Advanced Protection.
3. Add the prefix you previously onboarded to Magic Transit to Advanced TCP Protection.
4. Add the prefix (or subset) you wish to exclude as a new, separate prefix in Advanced TCP Protection.
5. For the prefix you added in the previous step, select Exclude Subset in the Enrolled Prefixes list.

Note

Prefixes or subsets added as Excluded will not be protected by Advanced TCP Protection.

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

## Advanced DNS Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/)

Page options # Advanced DNS Protection

Use the Cloudflare API to configure Advanced DNS Protection via API.

For examples of API calls, refer to Common API calls.

## Endpoints

To obtain the complete endpoint, append the Advanced DNS Protection API endpoints listed below to the Cloudflare API base URL:

```
https://api.cloudflare.com/client/v4
```

The {account_id} argument is the account ID (a hexadecimal string). You can find this value in the Cloudflare dashboard.

The following table summarizes the available operations.

| Operation | Verb + Endpoint |
| --- | --- |
| List DNS protection rules | GET accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rulesFetches all DNS protection rules in the account. |
| Add a DNS protection rule | POST accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rulesAdds a DNS protection rule to the account. |
| Get a DNS protection rule | GET accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules/{rule_id}Fetches the details of an existing DNS protection rule in the account. |
| Update a DNS protection rule | PATCH accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules/{rule_id}Updates an existing DNS protection rule in the account. |
| Delete a DNS protection rule | DELETE accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules/{rule_id}Deletes an existing DNS protection rule from the account. |
| Delete all DNS protection rules | DELETE accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rulesDeletes all existing DNS protection rules from the account. |

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

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/examples/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/examples/)

Page options # Common API calls

The following sections contain example requests for common API calls. For a list of available API endpoints, refer to Endpoints.

## Get all DNS protection rules

The following example retrieves the currently configured rules for Advanced DNS Protection.

Terminal window ```
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules" \--header "Authorization: Bearer <API_TOKEN>"
```

Example response ```
---{  "result": [    {      "id": "<RULE_ID>",      "scope": "<SCOPE>",      "name": "<NAME>",      "mode": "<MODE>",      "profile_sensitivity": "<SENSITIVITY>",      "rate_sensitivity": "<RATE>",      "burst_sensitivity": "<BURST>",      "created_on": "2023-10-01T13:10:38.762503+01:00",      "modified_on": "2023-10-01T13:10:38.762503+01:00",      }    ],  "success": true,  "errors": [],  "messages": []}
```

### Create DNS protection rule

The following example creates an Advanced DNS Protection rule with a global scope.

Terminal window ```
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules" \--header "Authorization: Bearer <API_TOKEN>" \--data '{  "scope": "global",  "name": "global",  "mode": "<MODE>",  "rate_sensitivity": "<RATE>",  "burst_sensitivity": "<BURST>",  "profile_sensitivity": "<SENSITIVITY>"}'
```

Example response ```
{  "result": {    "id": "<RULE_ID>",    "scope": "global",    "name": "global",    "mode": "<MODE>",    "rate_sensitivity": "<RATE>",    "burst_sensitivity": "<BURST>",    "profile_sensitivity": "<SENSITIVITY>",    "created_on": "2023-10-01T13:10:38.762503+01:00",    "modified_on": "2023-10-01T13:10:38.762503+01:00",  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

### Update DNS protection rule

The following example updates an existing DNS protection rule with ID {rule_id}.

The request body can contain only the fields you want to update (from mode, profile_sensitivity, rate_sensitivity, and burst_sensitivity).

Terminal window ```
curl --request PATCH \"https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_dns_protection/configs/dns_protection/rules/{rule_id}" \--header "Authorization: Bearer <API_TOKEN>" \--data '{  "mode": "<NEW_MODE>",  "profile_sensitivity": "<NEW_SENSITIVITY>",  "rate_sensitivity": "<NEW_RATE>",  "burst_sensitivity": "<NEW_BURST>"}'
```

Example response ```
{  "result": {    "id": "<RULE_ID>",    "scope": "<SCOPE>",    "name": "<NAME>",    "mode": "<NEW_MODE>",    "profile_sensitivity": "<NEW_SENSITIVITY>",    "rate_sensitivity": "<NEW_RATE>",    "burst_sensitivity": "<NEW_BURST>",    "created_on": "2023-10-01T13:10:38.762503+01:00",    "modified_on": "2023-10-01T13:10:38.762503+01:00",  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

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

## JSON objects

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/json-objects/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/dns-protection/json-objects/)

Page options # JSON objects

# JSON object

This page contains an example of the DNS protection rule JSON object used in the API.

```
{  "id": "31c70c65-9f81-4669-94ed-1e1e041e7b06",  "scope": "region",  "name": "WEUR",  "mode": "monitoring",  "profile_sensitivity": "medium",  "rate_sensitivity": "medium",  "burst_sensitivity": "medium",  "created_on": "2023-10-01T13:10:38.762503+01:00",  "modified_on": "2023-10-01T13:10:38.762503+01:00"}
```

The scope field value must be one of global, region, or datacenter. You must provide a region code (or data center code) in the name field when specifying a region (or datacenter) scope.

The mode value must be one of enabled, disabled, or monitoring.

The profile_sensitivity field value must be one of low (default), medium, high, or very_high.

The rate_sensitivity and burst_sensitivity field values must be one of low, medium, or high.

For more information on the rule settings, refer to Rule settings.

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

## Advanced TCP Protection

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/)

Page options # Advanced TCP Protection

You can configure Advanced TCP Protection using the Advanced TCP Protection API.

The Advanced TCP Protection API only supports API token authentication.

For examples of API calls, refer to Common API calls.

## Endpoints

To obtain the complete endpoint, append the Advanced TCP Protection API endpoints listed below to the Cloudflare API base URL.

The Cloudflare API base URL is:

```
https://api.cloudflare.com/client/v4
```

The {account_id} argument is the account ID (a hexadecimal string). You can find this value in the Cloudflare dashboard.

The tables in the following sections summarize the available operations.

### General operations

| Operation | Method and endpoint / Description |
| --- | --- |
| Get Advanced TCP Protection status | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_protection_statusGets the global Advanced TCP Protection status (enabled or disabled). |
| Update Advanced TCP Protection status | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_protection_statusEnables or disables Advanced TCP Protection. |

### Prefix operations

| Operation | Method and endpoint / Description |
| --- | --- |
| List prefixes | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixesFetches all Advanced TCP Protection prefixes in the account. |
| Add prefixes in bulk | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes/bulkAdds prefixes in bulk to the account (up to 300 prefixes per request). |
| Get a prefix | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes/{prefix_id}Fetches the details of an existing prefix. |
| Update a prefix | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes/{prefix_id}Updates an existing prefix. |
| Delete a prefix | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes/{prefix_id}Deletes an existing prefix. |
| Delete all prefixes | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixesDeletes all existing prefixes from the account. |

### Allowlist operations

| Operation | Method and endpoint / Description |
| --- | --- |
| List allowlisted prefixes | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlistFetches all prefixes in the account allowlist. |
| Add an allowlisted prefix | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlistAdds a prefix to the allowlist. |
| Get an allowlisted prefix | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlist/{allowlist_id}Fetches the details of an existing prefix in the allowlist. |
| Update an allowlisted prefix | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlist/{allowlist_id}Updates an existing prefix in the allowlist. |
| Delete an allowlisted prefix | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlist/{allowlist_id}Deletes an existing prefix from the allowlist. |
| Delete all allowlisted prefixes | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlistDeletes all existing prefixes from the allowlist. |

### SYN Flood Protection operations

#### Rules

| Operation | Method and endpoint / Description |
| --- | --- |
| List SYN flood rules | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rulesFetches all SYN flood rules in the account. |
| Add a SYN flood rule | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rulesAdds a SYN flood rule to the account. |
| Get a SYN flood rule | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rules/{rule_id}Fetches the details of an existing SYN flood rule in the account. |
| Update a SYN flood rule | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rules/{rule_id}Updates an existing SYN flood rule in the account. |
| Delete a SYN flood rule | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rules/{rule_id}Deletes an existing SYN flood rule from the account. |
| Delete all SYN flood rules | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rulesDeletes all existing SYN flood rules from the account. |

#### Filters

| Operation | Method and endpoint / Description |
| --- | --- |
| List SYN flood filters | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filtersFetches all SYN flood filters in the account. |
| Add a SYN flood filter | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filtersAdds a SYN flood filter to the account. |
| Get a SYN flood filter | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filters/{filter_id}Fetches the details of an existing SYN flood filter in the account. |
| Update a SYN flood filter | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filters/{filter_id}Updates an existing SYN flood filter in the account. |
| Delete a SYN flood filter | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filters/{filter_id}Deletes an existing SYN flood filter from the account. |
| Delete all SYN flood filters | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filtersDeletes all existing SYN flood filters from the account. |

### Out-of-state TCP Protection operations

#### Rules

| Operation | Method and endpoint / Description |
| --- | --- |
| List out-of-state TCP rules | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rulesFetches all out-of-state TCP rules in the account. |
| Add an out-of-state TCP rule | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rulesAdds an out-of-state TCP rule to the account. |
| Get an out-of-state TCP rule | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rules/{rule_id}Fetches the details of an existing out-of-state TCP rule in the account. |
| Update an out-of-state TCP rule | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rules/{rule_id}Updates an existing out-of-state TCP rule in the account. |
| Delete an out-of-state TCP rule | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rules/{rule_id}Deletes an existing out-of-state TCP rule from the account. |
| Delete all out-of-state TCP rules | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rulesDeletes all existing out-of-state TCP rules from the account. |

#### Filters

| Operation | Method and endpoint / Description |
| --- | --- |
| List out-of-state TCP filters | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filtersFetches all out-of-state TCP filters in the account. |
| Add an out-of-state TCP filter | POST accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filtersAdds an out-of-state TCP filter to the account. |
| Get an out-of-state TCP filter | GET accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filters/{filter_id}Fetches the details of an existing out-of-state TCP filter in the account. |
| Update an out-of-state TCP filter | PATCH accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filters/{filter_id}Updates an existing out-of-state TCP filter in the account. |
| Delete an out-of-state TCP filter | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filters/{filter_id}Deletes an existing out-of-state TCP filter from the account. |
| Delete all out-of-state TCP filters | DELETE accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filtersDeletes all existing out-of-state TCP filters from the account. |

## Pagination

The API operations that return a list of items use pagination. For more information on the available pagination query parameters, refer to Pagination.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/examples/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/examples/)

Page options # Common API calls

The following sections contain example requests for common API calls. For a list of available API endpoints, refer to Endpoints.

## Get Advanced TCP Protection status

This example obtains the current status of Advanced TCP Protection (enabled or disabled).

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_protection_status \--header "Authorization: Bearer <API_TOKEN>"
```

Example response ```
{  "result": {    "enabled": false  },  "success": true,  "errors": [],  "messages": []}
```

## Enable Advanced TCP Protection

This example enables Advanced TCP Protection.

Request ```
curl --request PATCH \https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_protection_status \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "enabled": true}'
```

## Get existing prefixes

This example fetches all existing prefixes in Advanced TCP Protection.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes \--header "Authorization: Bearer <API_TOKEN>"
```

Example response ```
{  "result": [    {      "prefix": "203.0.113/24",      "comment": "My prefix",      "excluded": false    }  ],  "success": true,  "errors": [],  "messages": []}
```

## Add prefixes

This example POST request adds two prefixes. The second prefix excludes a subset of the first prefix from Advanced TCP Protection.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/prefixes/bulk \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '[  {    "prefix": "192.0.2.0/24",    "comment": "Game ranges",    "excluded": false  },  {    "prefix": "192.0.2.2/26",    "comment": "Range for a specific game",    "excluded": true  }]'
```

Example response ```
{  "result": [    {      "id": "<PREFIX_1_ID>",      "prefix": "192.0.2.0/24",      "excluded": false,      "comment": "Game ranges",      "created_on": "<TIMESTAMP>",      "modified_on": "<TIMESTAMP>"    },    {      "id": "<PREFIX_2_ID>",      "prefix": "192.0.2.2/26",      "excluded": true,      "comment": "Range for a specific game",      "created_on": "<TIMESTAMP>",      "modified_on": "<TIMESTAMP>"    }  ],  "success": true,  "errors": [],  "messages": []}
```

## Get all prefixes in allowlist

This example fetches all the prefixes in the allowlist.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlist \--header "Authorization: Bearer <API_TOKEN>"
```

Example response ```
{  "result": [    {      "id": "<ALLOWLIST_PREFIX_ID>",      "prefix": "192.0.2.127",      "comment": "Single IP address in allowlist",      "enabled": true,      "created_on": "<TIMESTAMP>",      "modified_on": "<TIMESTAMP>"    }  ],  "success": true,  "errors": [],  "messages": []}
```

## Add a prefix to the allowlist

This example POST request adds a prefix to the allowlist of the account.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/allowlist \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "prefix": "203.0.113.0/26",  "comment": "Partner range",  "enabled": true}'
```

Example response ```
{  "result": {    "id": "<ALLOWLIST_PREFIX_1_ID>",    "prefix": "203.0.113.0/26",    "comment": "Partner range",    "enabled": true,    "created_on": "<TIMESTAMP>",    "modified_on": "<TIMESTAMP>"  },  "success": true,  "errors": [],  "messages": []}
```

## Create a SYN flood rule

This example POST request creates a SYN flood rule with a regional scope (Western Europe) in monitoring mode.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/rules \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "scope": "region",  "name": "WEUR",  "mode": "monitoring",  "rate_sensitivity": "medium",  "burst_sensitivity": "medium"}'
```

Example response ```
{  "result": {    "id": "<SYN_FLOOD_RULE_ID>",    "scope": "region",    "name": "WEUR",    "mode": "monitoring",    "rate_sensitivity": "medium",    "burst_sensitivity": "medium",    "created_on": "<TIMESTAMP>",    "modified_on": "<TIMESTAMP>"  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

## Create an out-of-state TCP rule

This example POST request creates an out-of-state TCP rule in monitoring mode, with a regional scope, and with low rate and burst sensitivities.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/rules \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "scope": "region",  "name": "WEUR",  "mode": "monitoring",  "rate_sensitivity": "low",  "burst_sensitivity": "low"}'
```

Example response ```
{  "result": {    "id": "<OOS_TCP_RULE_ID>",    "scope": "region",    "name": "WEUR",    "mode": "monitoring",    "rate_sensitivity": "low",    "burst_sensitivity": "low",    "created_on": "<TIMESTAMP>",    "modified_on": "<TIMESTAMP>"  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

## Create a SYN flood filter

This example POST request creates a SYN flood filter, setting SYN flood protection to monitoring mode for a specific range of destination IP addresses.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/syn_protection/filters \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "expression": "ip.dst in { 192.0.2.0/24 }",  "mode": "monitoring"}'
```

Example response ```
{  "result": {    "id": "<SYN_FLOOD_FILTER_ID>",    "expression": "ip.dst in { 192.0.2.0/24 }",    "mode": "monitoring",    "created_on": "<TIMESTAMP>",    "modified_on": "<TIMESTAMP>"  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

## Create an out-of-state TCP filter

This example POST request creates an out-of-state TCP filter, disabling out-of-state TCP protection for a specific range of destination IP addresses and ports.

Request ```
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/magic/advanced_tcp_protection/configs/tcp_flow_protection/filters \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{  "expression": "ip.dst in { 203.0.113.0/24 } and tcp.dstport in { 8000..8081 }",  "mode": "disabled"}'
```

Example response ```
{  "result": {    "id": "<OOS_TCP_FILTER_ID>",    "expression": "ip.dst in { 203.0.113.0/24 } and tcp.dstport in { 8000..8081 }",    "mode": "disabled",    "created_on": "<TIMESTAMP>",    "modified_on": "<TIMESTAMP>"  },  "success": true,  "errors": [],  "messages": []}
```

Refer to JSON objects for more information on the fields in the JSON body.

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

## JSON objects

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/json-objects/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/tcp-protection/json-objects/)

Page options # JSON objects

This page contains an example of the TCP protection rule JSON object used in the API.

## Prefix

```
{  "id": "31c70c65-9f81-4669-94ed-1e1e041e7b06",  "prefix": "192.0.2.0/24",  "comment": "Game ranges",  "excluded": false,  "created_on": "2022-01-01T13:06:04.721954+01:00",  "modified_on": "2022-01-01T13:06:04.721954+01:00"}
```

## Prefix in allowlist

```
{  "id": "31c70c65-9f81-4669-94ed-1e1e041e7b06",  "prefix": "192.0.2.0/24",  "comment": "Game ranges",  "enabled": true,  "created_on": "2021-10-01T13:06:04.721954+01:00",  "modified_on": "2021-10-01T13:06:04.721954+01:00"}
```

The prefix field can contain an IP address or a CIDR range.

## SYN flood rule or out-of-state TCP rule

```
{  "id": "31c70c65-9f81-4669-94ed-1e1e041e7b06",  "scope": "region",  "name": "WEUR",  "rate_sensitivity": "medium",  "burst_sensitivity": "medium",  "created_on": "2021-10-01T13:10:38.762503+01:00",  "modified_on": "2021-10-01T13:10:38.762503+01:00"}
```

The scope field value must be one of global, region, or datacenter. You must provide a region code (or data center code) in the name field when specifying a region (or datacenter) scope.

The rate_sensitivity and burst_sensitivity field values must be one of low, medium, or high.

## Filter

```
{  "id": "20b99eb6-8b48-48dd-a5b9-a995a0843b57",  "expression": "ip.dst in { 192.0.2.0/24 203.0.113.0/24 } and tcp.dstport in { 80 443 10000..65535 }",  "mode": "enabled",  "created_on": "2022-11-01T13:10:38.762503+01:00",  "modified_on": "2022-11-01T13:10:38.762503+01:00"}
```

The expression field is a Rules language expression up to 8,192 characters that can include the following fields:

- ip.src
- ip.dst
- tcp.srcport
- tcp.dstport

Note

Expressions of SYN flood protection and out-of-state TCP protection filters do not currently support functions.

The mode value must be one of enabled, disabled, or monitoring.

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

## Third-party services and DDoS protection

**來源**: [https://developers.cloudflare.com/ddos-protection/best-practices/third-party/](https://developers.cloudflare.com/ddos-protection/best-practices/third-party/)

Page options # Third-party services and DDoS protection

## Using a third-party CDN in front of Cloudflare

Some Cloudflare customers choose to use a Content Delivery Network (CDN) in front of Cloudflare to cache and serve their resources.

Cloudflare recommends that you do not use a third-party CDN in front of Cloudflare. Some CDN providers may introduce subtleties into HTTP requests that deviate from protocol standards and/or protocol best practices. Additionally, because traffic to Cloudflare will originate from a limited set of IP addresses of the third-party CDN, in rare occasions — such as when using the Akamai CDN in front of Cloudflare — it may appear as if the CDN is launching a DDoS attack against Cloudflare due to the amount of traffic from these limited IP addresses.

Therefore, it is recommended that you use the Cloudflare CDN, which provides the following benefits:

- You remove an additional hop between vendor data centers, thus reducing latency for your users.
- You perform DDoS filtering in the first point of contact from the Internet, which is a recommended best practice.

Note that, if you are using a third-party CDN in front of Cloudflare and Cloudflare mitigates a DDoS attack, you will still pay your first-hop CDN provider for the attack traffic that they processed before it was mitigated by Cloudflare.

### Recommended DDoS configuration adjustments

If you are using a CDN or proxy in front of Cloudflare, it is recommended that you change the action and/or sensitivity level of the following DDoS rules named:

- HTTP requests with unusual HTTP headers or URI path (signature #1) with the rule ID    ...3486aee1
- HTTP requests with unusual HTTP headers or URI path (signature #56) with the rule ID    ...e269dfd6
- HTTP requests with unusual HTTP headers or URI path (signature #57) with the rule ID    ...f35a42a0
- Requests coming from known bad sources with the rule ID    ...3a679c52

You should change the rule's action to Log (only available on Enterprise plans) to view the flagged traffic in the analytics dashboard. Alternatively, change the rule's Sensitivity Level to Essentially Off to prevent the rule from being triggered.

For more information, refer to HTTP DDoS Attack Protection managed ruleset: Ruleset configuration.

## Using VPNs, NATs, and other third-party services

Some Cloudflare Magic Transit customers operate Virtual Private Networks (VPN) so that their remote employees can connect securely to the organization's services. Additionally, larger organizations have Network Addressing Translation (NAT) systems that manage connections in and out of their network.

Cloudflare Magic Transit customers may also use third-party services such as Zoom, Webex, Microsoft Teams, and others for their internal organization communication. Because traffic to Cloudflare will be originating from a limited set of IP addresses belonging to these third-party services, it may appear as if the services are launching a DDoS attack against Cloudflare due to the amount of traffic from limited IP addresses.

Additionally, since this traffic may also be targeting a limited set of destinations (for example, the same designated service ports, VPN endpoints, or NAT IP addresses), it may appear as if the CDN is launching a DDoS attack against Cloudflare due to the amount of traffic from a limited set of IPs to a limited set of IPs.

### Recommended DDoS configuration adjustments

If your organization uses VPNs, NATs, or third-party services at high rates of over 100 Mbps, it is recommended that you one of the following:

- Change the Sensitivity Level of the relevant rules to a lower level. Changing the level to Essentially Off will prevent the rules from being triggered. Refer to HTTP DDoS Attack Protection managed ruleset and Network-layer DDoS Attack Protection managed ruleset for more information on the available adjustments per ruleset and how to perform them.
- Exclude the desired traffic from the Managed DDoS rule using expression filters. You can exclude a combination of source ports, source IP addresses, destination ports, destination IP addresses, and protocol. For more information, refer to Configure Network-layer DDoS Attack Protection via API.

If you are on an Enterprise plan, you can change a rule's action to Log to view the flagged traffic in the analytics dashboard. After gathering this information, you can later define rule adjustments as previously described.

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

## Respond to DDoS attacks

**來源**: [https://developers.cloudflare.com/ddos-protection/best-practices/respond-to-ddos-attacks/](https://developers.cloudflare.com/ddos-protection/best-practices/respond-to-ddos-attacks/)

Page options # Respond to DDoS attacks

Cloudflare's network automatically mitigates large DDoS attacks, but these attacks can still affect your application.

## All customers

All customers should perform the following steps to better secure their application:

1. Make sure all DDoS managed rulesets are set to default settings (High sensitivity level and mitigation actions) for optimal DDoS activation.
2. Deploy WAF custom rules and rate limiting rules to enforce a combined positive and negative security model. Reduce the traffic allowed to your website based on your known usage.
3. Make sure your origin is not exposed to the public Internet, meaning that access is only possible from Cloudflare IP addresses. As an extra security precaution, we recommend contacting your hosting provider and requesting new origin server IPs if they have been targeted directly in the past.
4. If you have Managed IP Lists or Bot Management, consider using these in WAF custom rules.
5. Enable caching as much as possible to reduce the strain on your origin servers, and when using Workers, avoid overwhelming your origin server with more subrequests than necessary.
To help counter attack randomization, Cloudflare recommends to update your cache settings to exclude the query string as a cache key. When the query string is excluded as a cache key, Cloudflare's cache will take in unmitigated attack requests instead of forwarding them to the origin. The cache can be a useful mechanism as part of a multilayered security posture.

## Enterprise customers

In addition to the steps for all customers, Cloudflare Enterprise customers subscribed to the Advanced DDoS Protection service should consider enabling Adaptive DDoS Protection, which mitigates attacks more intelligently based on your unique traffic patterns.

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

## Botnet Threat Feed

**來源**: [https://developers.cloudflare.com/ddos-protection/botnet-threat-feed/](https://developers.cloudflare.com/ddos-protection/botnet-threat-feed/)

Page options # Botnet Threat Feed

The Cloudflare DDoS Botnet Threat Feed is a threat intelligence feed for service providers (SPs) such as hosting providers and Internet service providers (ISPs) that provides information about their own IP addresses that have participated in HTTP DDoS attacks as observed from Cloudflare's global network. The feed aims to help service providers stop the abuse and reduce DDoS attacks originating from within their networks.

Each offense is a mitigated HTTP request from the specific IP address. For example, if an IP has 3,000 offenses, it means that Cloudflare has mitigated 3,000 HTTP requests from that IP.

A service provider can only get information about IP addresses associated with their autonomous system numbers (ASNs). The affiliation of a service provider with their ASNs will be checked against PeeringDB ↗, a reliable and globally recognized interconnection database.

To ensure the feed's accuracy, Cloudflare will only include IP addresses that have participated in multiple HTTP DDoS attacks and have triggered high-confidence rules.

## Context

A single DDoS attack consisting of thousands of bots can involve as little as one single IP per service provider. Service providers usually only see a small fraction of the attack traffic leaving their network, and it can be hard to correlate it to malicious activity, while trying to identify abusers.

In the case of HTTPS DDoS attacks, service providers only see encrypted payloads leaving their network without any possibility to decrypt or understand if it is malicious or legitimate traffic. However, Cloudflare can see an entire attack and all of its sources if the attack targets an Internet property that uses Cloudflare's services. This global view can help service providers stop the abusers.

For more details, refer to How DDoS protection works.

## Availability

The Cloudflare DDoS Botnet Threat Feed is available for free to service providers. For more information, refer to the Terms of Use ↗.

## Before you begin

Make sure that:

- You have created a Cloudflare account.

## Get started

### 1. Authenticate your ASN via PeeringDB

1. In the Cloudflare dashboard, go to your account settings page.
  Go to Settings
2. Select DDoS Threat Feed ASNs.
3. On the list of ASNs configured for your threat feed, select Add ASN.
4. You will be redirected to the PeeringDB authentication page, where you can log in and consent to share the affiliation data with us. You will be redirected back to the configuration page once it is successful.

Note

You can add multiple ASNs to your threat feed.

### 2. Obtain Cloudflare API token

You must obtain a Cloudflare API token with at least the following account-level permission:

- DDoS Botnet Feed > Read

### 3. Call Botnet Threat Feed API

Invoke one of the Botnet Threat Feed API endpoints:

- Get full report
- Get day report

## Available API endpoints

Important notes

- The API URI path is planned to change from .../botnet_feed/... to .../ddos_botnet_feed/... in the future.
- Responses with no IP addresses in the results (empty state) will return an HTTP 200 status code (success), with an empty list in the result property.
- When the response is a success but the result is 0 or null, this means that there are no detected offenses.

To invoke an API endpoint, append the operation endpoint to the Cloudflare API base URL:

```
https://api.cloudflare.com/client/v4
```

### Get full report

Retrieves all the data in the botnet tracking database for a given ASN (currently two weeks worth of data).

- HTTP verb: GET
- Operation endpoint: /accounts/{account_id}/botnet_feed/asn/{asn}/full_report

The provided {asn} must be affiliated with your account.

Required API token permissions

At least one of the following token permissions is required: - DDoS Botnet Feed Write
- DDoS Botnet Feed Read

Get full report ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/botnet_feed/asn/$ASN_ID/full_report" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```
{  "result": [    {      "cidr": "127.0.0.1/32",      "date": "1970-01-01T00:00:00Z",      "offense_count": 10000    },    // ... other entries ...  ],  "success": true,  "errors": [],  "messages": []}
```

### Get day report

Retrieves all the data the botnet tracking database has for a given ASN on a given date. This operation currently allows dates greater than two weeks prior, but in this case it will return an empty dataset (the database currently stores two-weeks worth of data).

- HTTP verb: GET
- Operation endpoint: /accounts/{account_id}/botnet_feed/asn/{asn}/day_report?date={date}

The provided {asn} must be affiliated with your account.

{date} must be an ISO 8601-formatted date: YYYY-MM-DD. If no date is specified, the API responds with the data from the day before.

Required API token permissions

At least one of the following token permissions is required: - DDoS Botnet Feed Write
- DDoS Botnet Feed Read

Get daily report ```
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/botnet_feed/asn/$ASN_ID/day_report" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```
{  "result": [    {      "cidr": "127.0.0.1/32",      "date": "2024-05-05T00:00:00Z",      "offense_count": 10000    },    // ... other entries ...  ],  "success": true,  "errors": [],  "messages": []}
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

## Analytics

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/analytics/](https://developers.cloudflare.com/ddos-protection/reference/analytics/)

Page options # Analytics

You can view DDoS analytics in different dashboards, depending on your service and plan:

- The Security Events dashboard provides you with visibility into L7 security events that target your zone, including HTTP DDoS attacks and TCP attacks. The dashboard displays mitigations of HTTP DDoS attacks as HTTP DDoS events. These events are also available via Cloudflare Logs.
- The Network Analytics dashboard provides you with visibility into L3/4 traffic and DDoS attacks that target your IP ranges or Spectrum applications.

## Availability

| Service | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| WAF/CDN | Sampled logs only | Security Events | Security Events | Security Events |
| Spectrum/BYOIP | – | – | – | Network Analytics |
| Magic Transit | – | – | – | Network Analytics |

## Remarks

In some situations, the analytics dashboards will not show you the ID of the DDoS managed rule that handled a packet/request. This means that an internal DDoS rule, which Cloudflare does not currently expose publicly, applied an action to the packet/request. These internal DDoS rules have a very low false positive rate and should always be enabled to protect your properties against DDoS attacks. For the same reason, DDoS rule IDs may also be unavailable in Cloudflare logs and API responses.

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

## Reports

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/reports/](https://developers.cloudflare.com/ddos-protection/reference/reports/)

Page options # Reports

To download an ad-hoc DDoS report, generate a PDF report file by selecting Print report in your analytics dashboard.

WAF/CDN customers can download a monthly report in Account Home > Security Center, by selecting Security Reports and downloading the desired monthly report.

Additionally, if you are a Magic Transit or Spectrum BYOIP customer, you will receive weekly DDoS reports by email with a snapshot of the DDoS attacks that Cloudflare detected and mitigated in the previous week.

Note

To receive DDoS reports by email you must have opted in to the Analytics category in the communication preferences for your profile.

## Weekly DDoS reports

Cloudflare sends DDoS reports via email from no-reply@notify.cloudflare.com to users with the Super Administrator role on accounts with prefixes advertised by Cloudflare.

Reports contain the following information:

- Total number of DDoS attacks
- Largest DDoS attack in packets per second (pps) and bits per second (bps)
- Changes in DDoS attacks compared to the previous report
- Top attack protocols
- Top targeted IP addresses
- Top targeted destination ports
- Total potential downtime prevented (a sum of the duration of all attacks in that week)
- Total bytes mitigated (a sum of all the mitigated attack traffic)

Cloudflare issues DDoS reports via email each Tuesday. Reports summarize the attacks that occurred from Monday of the previous week to Sunday of the current week. For example, a report issued on 2020-11-10 (Tuesday) summarizes activity from 2020-11-02 (Monday) to 2020-11-08 (Sunday).

To receive real-time attack alerts, configure DDoS alerts.

Notes

- Information about top attack protocols, IP addresses, and destination ports is temporarily unavailable in weekly DDoS reports. Use the Network Analytics dashboard to get this information.
- DDoS reports and DDoS alerts are independent: DDoS reports will include information about any attacks for which you received DDoS alerts.

### Example report

The following image shows an example DDoS report:

When Cloudflare does not detect any L3/4 DDoS attacks in the prior week, Cloudflare sends a confirmation report:

### Manage reporting subscriptions

Magic Transit and Spectrum BYOIP customers will receive the weekly DDoS report automatically.

To stop receiving DDoS reports, select the unsubscribe link at the bottom of the report email. To resubscribe after opting out, contact Cloudflare support.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/alerts/](https://developers.cloudflare.com/ddos-protection/reference/alerts/)

Page options # Alerts

Configure notifications to receive real-time alerts (within ~1 minute) about L3/4 and L7 DDoS attacks on your Internet properties, depending on your plan and services. You can choose from different delivery methods.

Each notification email includes the following information:

- Description
- Detection and mitigation time of attack
- Attack type
- Maximum rate of attack
- Attack target (zone, host, or IP address)
- Rule that matched the attack (ID and description)
- Rule override, if any

Cloudflare automatically sends weekly summaries of detected and mitigated DDoS attacks to Magic Transit and Spectrum BYOIP customers. Monthly application security reports are available for WAF/CDN customers. For more information, refer to DDoS reports.

Note

DDoS reports and DDoS alerts are independent: DDoS reports will include information about any attacks for which you received DDoS alerts.

## Set up a notification for DDoS alerts

To set up a notification:

1. In the Cloudflare dashboard, go to the NotificationS page.
  Go to Notifications
2. Under Notifications, select Add.
3. Select one of the available DDoS alerts depending on your plan and services:

HTTP DDoS Attack Alert
Layer 3/4 DDoS Attack Alert
Advanced HTTP DDoS Attack Alert
Advanced Layer 3/4 DDoS Attack Alert
4. HTTP DDoS Attack Alert
5. Layer 3/4 DDoS Attack Alert
6. Advanced HTTP DDoS Attack Alert
7. Advanced Layer 3/4 DDoS Attack Alert
8. Enter a notification name and (optionally) a description.
9. Configure a delivery method for the notification. The available delivery methods depend on your Cloudflare plan. For more information, refer to Cloudflare Notifications.
10. If you are creating a notification for one of the advanced DDoS attack alerts, select Next and define the parameters that will filter the notifications you will receive.
11. Select Save.

## Edit an existing notification

To edit, delete, or disable a notification, go to your account notifications ↗.

## Alert types

Cloudflare can issue notifications for different types of DDoS attack alerts.

### Standard alerts

HTTP DDoS Attack Alert

Who is it for? WAF or CDN customers who want to receive a notification when Cloudflare has mitigated HTTP attacks that generate more than 100 requests per second.

Other options / filters None.

Included with All Cloudflare plans.

What should you do if you receive one? No action needed. Refer to DDoS alerts for more information.

Layer 3/4 DDoS Attack Alert

Who is it for? BYOIP and Spectrum customers with Network Analytics who want to receive a notification when Cloudflare has mitigated attacks that generate an average of at least 12,000 packets per second over a five-second period, with a duration of one minute or more.

Other options / filters None.

Included with Purchase of Magic Transit and/or BYOIP.

What should you do if you receive one? No action needed. Refer to DDoS alerts for more information.

### Advanced alerts

Note

The availability of advanced DDoS attack alerts depends on your Cloudflare plan and subscribed services. Refer to Availability for details.

Advanced DDoS attack alerts support additional configuration, allowing you to filter the notifications you wish to receive.

Advanced HTTP DDoS Attack Alert

Who is it for? WAF or CDN customers with the Advanced DDoS Protection subscription who want to receive a notification when Cloudflare has mitigated attacks that generate more than the configured number of requests per second (100 rps by default).

Other options / filters You can choose when to trigger a notification.

Available filters include:

- The zones in the account for which you wish to receive notifications.
- The specific hostnames for which you wish to receive notifications.
- The minimum requests-per-second rate that will trigger the alert (100 rps by default).

Included with Enterprise plans with the Advanced DDoS Protection add-on.

What should you do if you receive one? No action needed. Refer to DDoS alerts for more information.

Advanced Layer 3/4 DDoS Attack Alert

Who is it for? BYOIP and Magic Transit customers with Network Analytics who want to receive a notification when Cloudflare has mitigated attacks that generate more than the configured number of packets per second (12,000 pps by default).

Other options / filters You can choose when to trigger a notification.

Available filters include:

- The IP prefixes for which you wish to receive notifications.
- The specific IP addresses for which you wish to receive notifications.
- The minimum packets-per-second rate that will trigger the alert (12,000 pps by default).
- The minimum megabits-per-second rate that will trigger the alert.
- The protocols for which you wish to receive notifications (all protocols by default).

If you specify multiple filters, Cloudflare applies an AND logic. This means the alert will only trigger if all filters you set are true. Keep this in mind when setting up this alert with more than one filter.

Included with Purchase of Magic Transit and/or BYOIP (Enterprise plans).

What should you do if you receive one? No action needed. Refer to DDoS alerts for more information.

You will also receive alerts for rules with a Log action, containing information on what triggered the alert.

## Availability

The available alerts depend on your Cloudflare plan and subscribed services:

| Alert type | WAF/CDN | Spectrum | Spectrum BYOIP | Magic Transit |
| --- | --- | --- | --- | --- |
| HTTP DDoS Attack Alert | Yes | – | – | – |
| Advanced HTTP DDoS Attack Alert | Yes1 | – | – | – |
| Layer 3/4 DDoS Attack Alert | – | Yes2, 3 | Yes | Yes3 |
| Advanced Layer 3/4 DDoS Attack Alert | – | – | Yes2 | Yes2 |

1 Only available to Enterprise customers with the Advanced DDoS
Protection subscription. 
2 Only available on an Enterprise plan. 
3 Refer to Final remarks for additional notes.

## Example notification

The following image shows an example notification delivered via email:

To investigate a possibly ongoing attack, select View Dashboard. To go to the rule details in the Cloudflare dashboard, select View Rule.

## Final remarks

- Spectrum and Magic Transit customers using assigned Cloudflare IP addresses will receive layer 3/4 DDoS attack alerts where the attacked target is the Cloudflare IP or prefix. If you have brought your own IP (BYOIP) to Cloudflare Spectrum or Magic Transit, you will see your own IP addresses or prefixes as the attacked target.
- In some cases, HTTP DDoS attack alerts will reference the attacked zone name instead of the attacked hostname. This occurs when the attack signature does not include information on the attacked hostname because it is not a strong indicator for identifying attack requests. For more information on attack signatures, refer to How DDoS protection works.
- DDoS alerts are currently only available for DDoS attacks detected and mitigated by the DDoS managed rulesets. Alerts are not yet available for DDoS attacks detected and mitigated by the Advanced TCP Protection and the Advanced DNS Protection system.
- You will not receive duplicate DDoS alerts within the same one-hour time frame.
- If you configure more than one alert type for the same kind of attack (for example, both an HTTP DDoS Attack Alert and an Advanced HTTP DDoS Attack Alert) you may get more than one notification when an attack occurs. To avoid receiving duplicate notifications, delete one of the configured alerts.

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

## Logs

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/logs/](https://developers.cloudflare.com/ddos-protection/reference/logs/)

Page options # Logs

Retrieve HTTP events using Cloudflare Logs to integrate them into your SIEM systems.

Additionally, if you are a Magic Transit or a Spectrum customer on an Enterprise plan, you can export L3/4 traffic and DDoS attack logs using the Network Analytics logs.

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

## Simulating test DDoS attacks

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/simulate-ddos-attack/](https://developers.cloudflare.com/ddos-protection/reference/simulate-ddos-attack/)

Page options # Simulating test DDoS attacks

After onboarding to Cloudflare, you may want to simulate DDoS attacks against your Internet properties to test the protection, reporting, and alerting mechanisms. Follow the guidelines in this section to simulate a DDoS attack.

You can only launch DDoS attacks against your own Internet properties — your zone, Spectrum application, or IP range (depending on your Cloudflare services) — and provided that:

- The Internet properties are not shared with other organizations or individuals.
- The Internet properties have been onboarded to Cloudflare in an account under your name or ownership.

## Before you start

You do not have to obtain permission from Cloudflare to launch a DDoS attack simulation against your own Internet properties. However, before launching the simulated attack, you must open a Support ticket and provide the information below. All fields are mandatory.

It is recommended that you choose the right service and enable the correct features to test against the corresponding DDoS attacks. For example, if you want to test Cloudflare against an HTTP DDoS attack and you are only using Magic Transit, the test is going to fail because you need to onboard your HTTP application to Cloudflare's reverse proxy service to test our HTTP DDoS Protection.

### For WAF/CDN customers:

- Attack origin region
- Attack duration
- Attack window (UTC)
- Attack method
- Traffic estimate in both requests per second (rps) and bandwidth (Gbps/Mbps/MBps)
- Target IPs, ports, ranges, zones, hostnames, full URLs
- Contact in case of emergency

### For Magic Transit and Spectrum customers:

- Attack origin region
- Attack duration
- Attack date & timeframe
- Attack method
- Target IPs, ports, ranges, zones, hostnames, full URLs
- Protocol
- Traffic estimate in both requests per second (rps) and bandwidth (Gbps/Mbps/MBps)
- Max packet/bit rate
- Contact in case of emergency

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

**來源**: [https://developers.cloudflare.com/ddos-protection/frequently-asked-questions/](https://developers.cloudflare.com/ddos-protection/frequently-asked-questions/)

Page options # FAQ

## What is a DDoS attack event?

When Cloudflare's DDoS systems detect and mitigate attacks, they drop, rate-limit, or challenge (as applicable) packets, DNS queries, or HTTP requests, based on the type of attack.

There are three main DDoS mitigation systems:

1. DDoS managed rulesets
a. Network-layer DDoS managed ruleset
b. HTTP DDoS managed ruleset
2. Advanced TCP Protection
3. Advanced DNS Protection

The DDoS managed ruleset includes many individual rules. Each rule provides the heuristics that instructs the system how to identify DDoS attack traffic. When the DDoS managed ruleset identifies an attack, it will generate a real-time fingerprint to match against the attack traffic, and install an ephemeral mitigation rule to mitigate the attack using that fingerprint.

The start time of the attack is when the mitigation rule is installed. The attack ends when there is no more traffic matching the rule. This is a single DDoS attack event.

A DDoS attack has a start time, end time, and additional attack metadata such as:

- Attack ID
- Attack vector
- Mitigating rule
- Total bytes and packets
- Attack target
- Mitigation action

This information is used to populate the Executive Summary section in the Network Analytics dashboard.

It can also be retrieved via GraphQL API using the dosdAttackAnalyticsGroups node.

Currently, the concept of a DDoS attack event only exists for the Network-layer DDoS managed ruleset. There is no such grouping of individual packets, queries, or HTTP requests for the other systems yet.

## How does Cloudflare protect against "low and slow" DDoS attacks?

A low and slow DDoS attack ↗ is most commonly a non-volumetric attack. The attacker will send a low volume of HTTP requests, and do so slowly. This type of attack aims to be less detectable and slowly exhausts resources.

Slowloris ↗ is a type of low and slow attack where the attacker establishes TCP connections to the target server, often using HTTP or HTTPS protocols.

In the case of a Slowloris attack, the attacker sends incomplete HTTP header lines, thus never completing the HTTP request. The server waits for the complete request, holding the connection open. The attacker periodically sends additional HTTP header fields or partial lines to keep the connection alive. This can be achieved by sending partial HTTP headers, or using the content-length header to declare a message body size larger than what is actually sent.

The best practice to defend against low and slow attacks is by using an HTTP reverse proxy, such as Cloudflare's CDN or WAF service. The reverse proxy acts as a shield. It waits for a full HTTP request before forwarding it to the origin, serving from cache, or applying other actions based on user configuration. If you are using our CDN/WAF services, our L7 reverse proxy will absorb low and slow attacks. It will buffer uploads at the edge by default. The proxy will wait for the full HTTP request before passing it on. The client requests must be completed.

The request will be served from Cloudflare's Cache or Workers, if applicable. If not, it will only be sent to the origin — assuming it was fully completed and has passed WAF checks. So the attack does not exist, similar to TCP Slowloris attacks protection.

Additionally, the reverse proxy will timeout incomplete HTTP requests after a series of keepalive probes.

There is not a minimum threshold for activation. However, to provide additional security, custom firewall rules check for payload sizes and conducts basic sanity checks to ensure the content looks like what is expected.

The RUDY (R-U-Dead-Yet?) DDoS attack is another type of denial-of-service (DoS) tool that performs slow-rate attacks on targeted servers.

Unlike conventional DDoS attacks that overwhelm servers with a high volume of requests in a short period, RUDY focuses on creating a few prolonged requests. It does this by submitting form data at an extremely slow pace to keep the web server tied up and unavailable to legitimate traffic. This approach makes RUDY attacks difficult to detect, because the traffic can appear legitimate and does not flood the server with requests that would typically trigger conventional DDoS protection mechanisms​​​​​​.

RUDY specifically targets the application layer (Layer 7) of web servers by exploiting the way web forms handle data submission. The attack works by injecting one byte of information into an application POST field at a time, then waiting. This process causes application threads to await the completion of the form submission indefinitely, effectively exhausting the server's resources and preventing it from processing legitimate requests​​​​.

Refer to the learning center ↗ for more information on RUDY attacks.

## How does Cloudflare deal with SSL/TLS negotiation attacks or floods?

SSL/TLS based attacks such as BEAST, Poodle, and CRIME are mitigated by Cloudflare's TLS settings, configuration, and cipher limitations. Because Cloudflare serves as the HTTP reverse proxy, TLS exhaustion style attacks are mitigated by terminating TLS sessions before passing HTTP requests to origin servers. TLS traffic is not proxied to origin servers without completing a proper TLS handshake. Additionally, our automated DDoS detection and mitigation systems leverage cipher suites, packet fields, HTTP request attributes and metadata, origin health, traffic profiling, Machine Learning models, and threat intelligence to detect and mitigate additional SSL-based attacks.

## Does Cloudflare use BGP Flowspec for upstream mitigation?

Yes. Using our anycast network, along with Traffic Manager, Unimog, and Plurimog, we conduct automated traffic engineering to spread the load of traffic (legitimate and attack) to ensure our network is performant, especially during mitigation of large attacks.

## Where can I see latest DDoS trends?

Cloudflare publishes quarterly DDoS reports and coverage of significant DDoS attacks. The publications are available on our blog website ↗ and as interactive reports on the Cloudflare Radar Reports website ↗.

Learn more about the methodologies behind these reports.

You can also view Cloudflare Radar ↗ for near real-time insights and trends.

## What is the Ping of Death DDoS attacks?

The Ping of Death (PoD) attack involves sending malformed or oversized packets to another computer or server, which can cause the system to freeze, crash, or reboot. Packets are pieces of data sent over the Internet, and the Ping of Death takes advantage of the fact that the IP protocol requires packets to be a maximum of 65,535 bytes in size. By sending a packet larger than this size, the attacker can exploit vulnerabilities in the target's TCP/IP stack, causing a buffer overflow and leading to unpredictable behavior, including system crashes. This type of attack is less common nowadays, as most modern systems and networking equipment have been patched to handle such anomalies.

## What are LOIC and HOIC?

LOIC is a popular network stress testing and DoS attack application that is used to flood a server with TCP, UDP, or HTTP requests with the intention of disrupting the service. It is known for its simplicity and ability to be used by individuals with minimal hacking experience. LOIC can be directed by the user to attack a small server, which can cause the server to slow down or crash from the overload of requests. It became famous around 2010 for its use by the hacker group Anonymous in attacks against major companies and organizations.

HOIC is an upgrade from LOIC, designed to overcome some of its limitations, especially in terms of detection and mitigation. It allows users to launch a more powerful DoS attack by enabling attacks on multiple websites at the same time with a higher volume of requests. HOIC also incorporates a feature that makes it more difficult for defense mechanisms to identify and mitigate the attack traffic, partly because it uses a technique that allows the traffic to mimic legitimate HTTP traffic, which is more challenging for traditional network security tools to detect. HOIC supports the use of "booster" scripts that enable it to target various websites simultaneously, significantly increasing its potency as a tool for conducting broad-scale DoS attacks.

These tools and attacks exploit different aspects of network protocols and behaviors to overwhelm targets with unwanted traffic, leading to denial of service. Due to their potential for abuse, their use is illegal and unethical outside of controlled environments for testing purposes.

## Can I exclude specific user agents from HTTP DDoS protection?

Yes, you can create an override and use the expression fields to match against HTTP requests with the user agent. There are a variety of fields that you can use.

You can then adjust the sensitivity level or mitigation action.

Refer to the guide on how to create an override.

The use of expression fields is subject to availability.

## Does Cloudflare charge for DDoS attack traffic?

No. Since 2017, Cloudflare offers free, unmetered, and unlimited DDoS protection ↗. There is no limit to the number of DDoS attacks, their duration, or their size. Cloudflare's billing systems automatically exclude DDoS attack traffic from your usage.

## How does DDoS Protection determine whether a SYN flood attack is mitigated by dosd or Advanced TCP Protection?

DDoS managed rules detect and mitigate attacks by finding commonality between attack packets and generating a real-time fingerprint to mitigate the attack.

When the attacks are highly randomized and DDoS managed rules are unable to detect a common pattern among the attack packets, Advanced TCP Protection uses its stateful TCP flowtracking capabilities to determine whether or not packets are legitimate. Advanced TCP Protection also mitigates simpler TCP-based attacks.

Advanced TCP Protection is only necessary and available to Magic Transit customers. For Spectrum and our HTTP services, we leverage the reverse proxy to mitigate sophisticated randomized TCP-based DDoS attacks.

## How does Cloudflare handle hyper-localized DDoS attacks that may aim to overwhelm a specific Point of Presence (PoP)?

Hyper-localized DDoS attacks are attacks that target specific PoPs or data centers from botnet nodes that are close to those locations in an attempt to overwhelm them and cause an outage or service disruptions.

However, Cloudflare's defense approach is resilient to these attacks and uses a combination of intelligent traffic engineering, global Anycast, and real-time, autonomous DDoS mitigation to handle hyper-localized DDoS attacks — even those that may temporarily exceed the capacity of a specific Point of Presence (PoP).

### Global Anycast Network

Anycast allows multiple servers (PoPs) to share the same IP address, and the Border Gateway Protocol (BGP) routing system ensures user traffic is routed to the nearest or lowest-cost node.

#### Process

When one PoP is overwhelmed due to a local DDoS flood or as a result of limited capacity, BGP route propagation can be adjusted to shift traffic away from that PoP. Cloudflare can also withdraw BGP announcements from specific peers or upstreams to force traffic to reroute through better-equipped PoPs. Because DDoS traffic originates from multiple geographic regions, Anycast and traffic engineering distributes the attack across Cloudflare's full capacity Anycast network ↗ to reduce the burden on a single PoP.

### Intelligent Traffic Engineering

Cloudflare uses real-time data and intelligence systems to make decisions about traffic routing, load balancing, and congestion management.

#### Process

If a specific PoP becomes saturated or experiences attack traffic, Cloudflare's internal traffic engineering systems dynamically steer traffic across alternative paths using traffic shaping, path-aware routing, and dynamic DNS responses.

The system monitors CPU load, network congestion, and traffic type to make smart decisions about whether to reroute or throttle connections.

For Layer 7 (application-level) attacks, Cloudflare can challenge or rate-limit traffic before it reaches application servers. This scenario is similar to some extent to when we take down certain PoPs for maintenance. This can be done automatically via Traffic Manager, and if needed, by our Site Reliability Engineers (SRE).

### Real-Time DDoS Mitigation

DDoS managed rules and Advanced DDoS Protection are autonomous and run on every single server independently, while also coordinating locally and globally, contributing to the resilience of each server and PoP. These systems run close to the network edge in every PoP, meaning detection and mitigation happen rapidly, often before any noticeable impact. If traffic exceeds the capacity of one PoP, mitigation rules are replicated to other PoPs to help absorb overflow.

- DDoS managed rules: Detects and mitigates DDoS attacks in real-time. When it detects an attack, it deploys rules within seconds to mitigate the malicious traffic.
- Advanced TCP Protection: Identifies and drops abnormal TCP/IP behavior before it hits application servers.
- Advanced DNS Protection: Identifies and drops abnormal DNS queries behavior before it hits DNS servers.

## What is Advanced TCP Protection's Protected Learning functionality?

The Protected Learning functionality enables the Advanced TCP Protection system to overcome Internet routing chaos while allowing your legitimate traffic through and blocking DDoS attacks at the edge.

Anycast and BGP are protocols that help route Internet traffic by sending it to the nearest or most optimal data center. Occasional network events—such as a data center being taken offline for maintenance or changes in Internet routing—can cause an established connection to be rerouted to a different data center.

Cloudflare's flow inference functionality, also known as Protected Learning, is specifically designed to handle this. When a TCP connection, such as a flow, shifts to a new data center, our system observes that it is an existing connection that does not appear in the local flow table. Instead of immediately blocking the flow as an unknown connection that may be part of a DDoS attack, our system uses a proprietary process to verify if the connection is legitimate. It might challenge the acknowledgment (ACK) packets of the flow to ensure it is not part of a DDoS attack. Once the flow passes our checks, we allow it to continue without interruption. This ensures that even rare, legitimate shifts in traffic do not break your long-running connections while keeping your network protected against DDoS attacks.

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

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/](https://developers.cloudflare.com/ddos-protection/change-log/)

Page options # Changelog

Cloudflare has a regular cadence of releasing updates and new rules to the DDoS managed rulesets. The updates either improve a rule's accuracy, lower false positives rates, or increase the protection due to a change in the threat landscape.

The release cycle for a new rule within the regular cadence follows this process:

- Cloudflare adds a new rule configured with the Log action, and announces the rule in the "Scheduled changes" section of each managed ruleset.
- From that point on, if this rule matches any traffic, the matched traffic will be visible in one of the analytics dashboards. If you suspect this might be a false positive, you can lower the sensitivity for that rule. Refer to override examples for details.
- Cloudflare updates the rule action to mitigate traffic (for example, using the Block action) after a period of at least seven days, usually on a Monday. The exact date is shown in the scheduled changes list.

Changes to existing rules follow the same process, except that Cloudflare will create a temporary updated rule (denoted as BETA in rule description) before updating the original rule on the next release cycle.

Cloudflare is very proactive in responding to new attack vectors, which may need to be released outside of the 7-day cycle, defined as an Emergency Release. This emergency release is only used to respond to new high priority threats with a low false positive probability.

## RSS feeds

- General updates -  Subscribe to RSS
- Network-layer DDoS managed ruleset -  Subscribe to RSS
- HTTP DDoS managed ruleset -  Subscribe to RSS

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

## Network-layer DDoS managed ruleset

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/](https://developers.cloudflare.com/ddos-protection/change-log/network/)

Page options # Network-layer DDoS managed ruleset

This section contains past and upcoming changes to the Network-layer DDoS Attack Protection managed ruleset.

Note

The Network-layer DDoS Attack Protection managed ruleset protects Cloudflare customers on all plans. However, only Magic transit and Spectrum customers on an Enterprise plan can customize the managed ruleset.

View scheduled changes

Subscribe to RSS ## Was this helpful?

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

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/scheduled-changes/](https://developers.cloudflare.com/ddos-protection/change-log/network/scheduled-changes/)

Page options # Scheduled changes

| Announcement Date | Change Date | Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A | N/A | N/A |

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

## 2024-03-12

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2024-03-12/](https://developers.cloudflare.com/ddos-protection/change-log/network/2024-03-12/)

Page options # 2024-03-12

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...85fa2e98 | Adaptive DDoS Protection for UDP Destination Ports (Available only to
Enterprise accounts). | N/A | log | Enable rule that uses a customer's UDP destination port profile to
mitigate traffic (log mode by default). |

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

## 2023-07-31

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2023-07-31/](https://developers.cloudflare.com/ddos-protection/change-log/network/2023-07-31/)

Page options # 2023-07-31

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...aa772b5c | Adaptive DDoS Protection for Location-Based UDP (Available only to
Enterprise accounts). | N/A | log | Enable UDP geolocation Adaptive DDoS rule |

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

## 2023-04-17

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2023-04-17/](https://developers.cloudflare.com/ddos-protection/change-log/network/2023-04-17/)

Page options # 2023-04-17

Previously, only a subset of rules were exposed publicly. In rare situations, these rules can cause false positives. When this happens, you can customize their behavior using overrides.

Besides these rules, the DDoS managed rules contain other rules that do not cause issues. Until now, these rules were not shown in the dashboard or referenced in the documentation.

Cloudflare now shows all rules in the dashboard, including these high-confidence rules. This means that packets matching these rules will now have the correct rule identifier. The newly published rules are read-only and you cannot disable them.

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

## 2022-12-02

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-12-02/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-12-02/)

Page options # 2022-12-02

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...58e4914a | Adaptive DDoS Protection for UDP (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...76d5e15c | Adaptive DDoS Protection for Other IPv6 Protocols (Available only to
Enterprise accounts). | log | log | Lower sensitivity to avoid false positives |
| ...8de83ef6 | Adaptive DDoS Protection for IPv6 GRE (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...938e978c | Adaptive DDoS Protection for IPv6 ESP (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...9c173480 | Adaptive DDoS Protection for ICMP (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...ad8078b8 | Adaptive DDoS Protection for IPv4 GRE (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...ae3f5e4e | Adaptive DDoS Protection for ICMPv6 (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |
| ...c7dc52df | Adaptive DDoS Protection for Other IPv4 Protocols (Available only to
Enterprise accounts). | log | log | Lower sensitivity to avoid false positives |
| ...e4e7541c | Adaptive DDoS Protection for IPv4 ESP (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |

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

## 2022-10-24

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-10-24/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-10-24/)

Page options # 2022-10-24

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...e4e7541c | Adaptive DDoS Protection for IPv4 ESP (Available only to Enterprise
accounts). | log | log | Lower sensitivity to avoid false positives |

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

## 2022-10-06

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-10-06/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-10-06/)

Page options # 2022-10-06

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...34228119 | IPv4 UDP SIP traffic | log | N/A |  |
| ...58e4914a | Adaptive DDoS Protection for UDP (Available only to Enterprise
accounts). | log | N/A |  |
| ...76d5e15c | Adaptive DDoS Protection for Other IPv6 Protocols (Available only to
Enterprise accounts). | log | N/A |  |
| ...8de83ef6 | Adaptive DDoS Protection for IPv6 GRE (Available only to Enterprise
accounts). | log | N/A |  |
| ...938e978c | Adaptive DDoS Protection for IPv6 ESP (Available only to Enterprise
accounts). | log | N/A |  |
| ...9c173480 | Adaptive DDoS Protection for ICMP (Available only to Enterprise
accounts). | log | N/A |  |
| ...ad8078b8 | Adaptive DDoS Protection for IPv4 GRE (Available only to Enterprise
accounts). | log | N/A |  |
| ...ae3f5e4e | Adaptive DDoS Protection for ICMPv6 (Available only to Enterprise
accounts). | log | N/A |  |
| ...c7dc52df | Adaptive DDoS Protection for Other IPv4 Protocols (Available only to
Enterprise accounts). | log | N/A |  |
| ...e4e7541c | Adaptive DDoS Protection for IPv4 ESP (Available only to Enterprise
accounts). | log | N/A |  |
| ...ea9e05c3 | IPv6 UDP SIP traffic | log | N/A |  |

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

## 2022-09-21

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-09-21/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-09-21/)

Page options # 2022-09-21

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...58e4914a | Adaptive DDoS Protection for UDP (Available only to Enterprise
accounts). | log | log | Update UDP profiling rule tag and threshold |
| ...76d5e15c | Adaptive DDoS Protection for Other IPv6 Protocols (Available only to
Enterprise accounts). | log | log | Update other IPv6 protos profiling rule tag and threshold |
| ...8de83ef6 | Adaptive DDoS Protection for IPv6 GRE (Available only to Enterprise
accounts). | log | log | Update IPv6 GRE profiling rule tag and threshold |
| ...938e978c | Adaptive DDoS Protection for IPv6 ESP (Available only to Enterprise
accounts). | log | log | Update IPv6 ESP profiling rule tag and threshold |
| ...9c173480 | Adaptive DDoS Protection for ICMP (Available only to Enterprise
accounts). | log | log | Update ICMP profiling rule tag and threshold |
| ...ad8078b8 | Adaptive DDoS Protection for IPv4 GRE (Available only to Enterprise
accounts). | log | log | Update IPv4 GRE profiling rule tag and threshold |
| ...ae3f5e4e | Adaptive DDoS Protection for ICMPv6 (Available only to Enterprise
accounts). | log | log | Update ICMPv6 profiling rule tag and threshold |
| ...c7dc52df | Adaptive DDoS Protection for Other IPv4 Protocols (Available only to
Enterprise accounts). | log | log | Update other IPv4 protos profiling rule tag and threshold |
| ...e4e7541c | Adaptive DDoS Protection for IPv4 ESP (Available only to Enterprise
accounts). | log | log | Update IPv4 ESP profiling rule tag and threshold |

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

## 2022-09-16

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-09-16/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-09-16/)

Page options # 2022-09-16

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...11456494 | IPv6 GRE miscellaneous inner protocols (Inner protocols other than
0x0800 or 0x880B) | block | N/A |  |
| ...800534de | IPv6 GRE encapsulated IP or PPP (Inner protocol 0x0800 or 0x880B) | ddos_dynamic | N/A |  |

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

## 2022-04-12

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/2022-04-12/](https://developers.cloudflare.com/ddos-protection/change-log/network/2022-04-12/)

Page options # 2022-04-12

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...89e250ce | IPv4 GRE encapsulated IP or PPP (Inner protocol 0x0800 or 0x880B) | ddos_dynamic | ddos_dynamic |  |

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

## HTTP DDoS managed ruleset

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/](https://developers.cloudflare.com/ddos-protection/change-log/http/)

Page options # HTTP DDoS managed ruleset

This section contains past and upcoming changes to the HTTP DDoS Attack Protection managed ruleset.

View scheduled changes

Subscribe to RSS ## Was this helpful?

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

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/scheduled-changes/](https://developers.cloudflare.com/ddos-protection/change-log/http/scheduled-changes/)

Page options # Scheduled changes

| Announcement Date | Change Date | Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A | N/A | N/A |

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

## 2024-04-19

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-19/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-19/)

Page options # 2024-04-19

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...154b29a0 | HTTP requests with unusual HTTP headers or URI path (signature #66). | N/A | block |  |

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

## 2024-04-16 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-16-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-16-emergency/)

Page options # 2024-04-16 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...05ad9070 | HTTP requests with unusual HTTP headers or URI path (signature #64). | N/A | block |  |
| ...890b8f4e | HTTP requests with unusual HTTP headers or URI path (signature #65). | N/A | block |  |

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

## 2024-04-04 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-04-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-04-emergency/)

Page options # 2024-04-04 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...177059f1 | HTTP requests from known botnet (signature #31). | log | N/A |  |
| ...7b231fb2 | HTTP requests from known botnet (signature #81). | N/A | block |  |

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

## 2024-04-02

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-02/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-02/)

Page options # 2024-04-02

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Update the rule to match to block attacks more consistently. |

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

## 2024-02-27

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-27/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-27/)

Page options # 2024-02-27

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...0c9175b8 | HTTP requests from known botnet (signature #47). | block | N/A | Rule removed due to inactivity. |
| ...0fb54442 | HTTP requests with unusual HTTP headers or URI path (signature #49). | block | N/A | Rule removed due to inactivity. |
| ...1b60260f | HTTP requests from known botnet (signature #45). | block | N/A | Rule removed due to inactivity. |
| ...21e99dcf | HTTP requests from known botnet (signature #58). | block | N/A | Rule removed due to inactivity. |
| ...3f7952da | HTTP requests from known botnet (signature #21). | block | N/A | Rule removed due to inactivity. |
| ...5a158253 | HTTP requests from known botnet (signature #27). | block | N/A | Rule removed due to inactivity. |
| ...5f1469cb | HTTP requests with unusual HTTP headers or URI path (signature #28). | block | N/A | Rule removed due to inactivity. |
| ...71cb9bea | HTTP requests from known botnet (signature #39). | block | N/A | Rule removed due to inactivity. |
| ...72d115bd | HTTP requests from known botnet (signature #23). | block | N/A | Rule removed due to inactivity. |
| ...8586375f | HTTP requests with unusual HTTP headers or URI path (signature #22). | block | N/A | Rule removed due to inactivity. |
| ...8857b788 | HTTP requests from known botnet (signature #30). | block | N/A | Rule removed due to inactivity. |
| ...8bf63869 | HTTP requests from known botnet (signature #50). | block | N/A | Rule removed due to inactivity. |
| ...9630955e | HTTP requests from known botnet (signature #64). | block | N/A | Rule removed due to inactivity. |
| ...9641efe0 | HTTP requests with unusual HTTP headers or URI path (signature #29). | block | N/A | Rule removed due to inactivity. |
| ...aa03a345 | HTTP requests from known botnet (signature #68). | block | N/A | Rule removed due to inactivity. |
| ...b60b2bc0 | HTTP requests from known botnet (signature #28). | block | N/A | Rule removed due to inactivity. |
| ...bbf0073e | HTTP requests from known botnet (signature #25). | block | N/A | Rule removed due to inactivity. |
| ...c5f479f0 | HTTP requests from known botnet (signature #62). | block | N/A | Rule removed due to inactivity. |
| ...c92eba7c | HTTP requests from known botnet (signature #65). | block | N/A | Rule removed due to inactivity. |
| ...dea7a346 | HTTP requests from known botnet (signature #35). | block | N/A | Rule removed due to inactivity. |
| ...e4fe8e55 | Adaptive DDoS Protection based on User-Agents (Available only to
Enterprise zones with Advanced DDoS service). | ddos_dynamic | ddos_dynamic | Mitigate attacks by default instead of only logging. |
| ...ea99fbb6 | HTTP requests from known botnet (signature #46). | block | N/A | Rule removed due to inactivity. |
| ...f6120981 | HTTP requests from known botnet (signature #20). | block | N/A | Rule removed due to inactivity. |
| ...f9da654a | HTTP requests from known botnet (signature #26). | block | N/A | Rule removed due to inactivity. |
| ...fd5045ff | HTTP requests from known botnet (signature #55). | block | N/A | Rule removed due to inactivity. |
| ...fd551e2b | HTTP requests from known botnet (signature #41). | block | N/A | Rule removed due to inactivity. |

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

## 2024-02-26 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-26-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-26-emergency/)

Page options # 2024-02-26 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6831bff1 | HTTP requests with unusual HTTP headers or URI path (signature #35). | block | block | Extend the rule to catch attacks more comprehensively. |
| ...e269dfd6 | HTTP requests with unusual HTTP headers or URI path (signature #56). | block | block | Extend the rule to catch attacks more comprehensively. |

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

## 2024-02-19

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-19/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-19/)

Page options # 2024-02-19

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...0fbfd5ae | HTTP requests from known botnet (signature #32). | block | ddos_dynamic |  |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | ddos_dynamic | Expand rule logic to catch more attacks. |
| ...3ad719cd | HTTP requests from known botnet (signature #79). | ddos_dynamic | ddos_dynamic | Expand the rule scope to catch more attacks. |

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

## 2024-02-12

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-12/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-12/)

Page options # 2024-02-12

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...c47bdca6 | HTTP requests with unusual HTTP headers or URI path (signature #62). | N/A | block |  |

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

## 2024-02-08 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-08-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-08-emergency/)

Page options # 2024-02-08 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...3a679c52 | Requests coming from known bad sources. | ddos_dynamic | managed_challenge | Expand the rule to mitigate on all zones. |

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

## 2024-02-06 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-06-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-06-emergency/)

Page options # 2024-02-06 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1fc1e601 | HTTP requests with unusual HTTP headers or URI path (signature #31). | block | block | Modify characteristics of the unusual HTTP headers or URI path. |
| ...3a679c52 | Requests coming from known bad sources. | N/A | ddos_dynamic |  |
| ...3ad719cd | HTTP requests from known botnet (signature #79). | ddos_dynamic | ddos_dynamic | Expand the scope of the rule to match more attacks. |

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

## 2024-02-05 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-05-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-05-emergency/)

Page options # 2024-02-05 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | ddos_dynamic | Extend the rule to catch more attacks. |

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

## 2024-01-26 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-26-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-26-emergency/)

Page options # 2024-01-26 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...3ad719cd | HTTP requests from known botnet (signature #79). | N/A | ddos_dynamic |  |
| ...61bc58d5 | HTTP requests with unusual HTTP headers or URI path (signature #55). | managed_challenge | managed_challenge | Expanded the scope of the rule to catch attacks more consistently. |

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

## 2024-01-25

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-25/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-25/)

Page options # 2024-01-25

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1fc1e601 | HTTP requests with unusual HTTP headers or URI path (signature #31). | block | block | Add more characteristics to the unusual HTTP headers or URI path. |

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

## 2024-01-23

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-23/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-23/)

Page options # 2024-01-23

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1fc1e601 | HTTP requests with unusual HTTP headers or URI path (signature #31). | block | block | Add more characteristics to the unusual HTTP headers or URI path. |
| ...2de94fb2 | HTTP requests with unusual HTTP headers or URI path (signature #3). | ddos_dynamic | block | Expand rule scope to catch more attacks. |
| ...2f8d9a4f | HTTP requests from known botnet (signature #78). | N/A | block |  |

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

## 2024-01-05

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-05/](https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-05/)

Page options # 2024-01-05

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...2de94fb2 | HTTP requests with unusual HTTP headers or URI path (signature #3). | block | block | Fine-tune the characteristics of the unusual requests. |
| ...177059f1 | HTTP requests from known botnet (signature #31). | block | N/A | Removed due to false positives. |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | block | N/A | Removed due to false positives. |
| ...82c0ed5f | HTTP requests from known botnet (signature #77). | N/A | block |  |
| ...e4f3ea4d | HTTP requests from known botnet (signature #76). | N/A | block |  |

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

## 2023-12-19 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-19-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-19-emergency/)

Page options # 2023-12-19 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1fc1e601 | HTTP requests with unusual HTTP headers or URI path (signature #31). | block | block | Add more characteristics to the unusual HTTP headers or URI path. |
| ...22807318 | HTTP requests from known botnets. | log | ddos_dynamic | Extend the rule to catch more attacks. |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Change the rule to catch more attacks. |

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

## 2023-12-14 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-14-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-14-emergency/)

Page options # 2023-12-14 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | block | block | Tweak the rule to avoid false positives in some rare cases. |

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

## 2023-12-08 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-08-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-08-emergency/)

Page options # 2023-12-08 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | block | block | Updated the rule to avoid false positives in some rare circumstances. |
| ...e7a37252 | HTTP requests from known botnet (signature #75). | N/A | block |  |

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

## 2023-11-29

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-29/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-29/)

Page options # 2023-11-29

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...8ed59b32 | HTTP requests with unusual HTTP headers or URI path (signature #61). | ddos_dynamic | ddos_dynamic | Rename rule to avoid confusion. |
| ...61e8d513 | Global L7 WordPress attack mitigations (Deprecated) | ddos_dynamic | ddos_dynamic | Mark rule as deprecated. |

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

## 2023-11-22

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-22/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-22/)

Page options # 2023-11-22

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...254da96a | HTTP requests with unusual HTTP headers or URI path (signature #58). | log | block |  |

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

## 2023-11-13 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-13-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-13-emergency/)

Page options # 2023-11-13 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | ddos_dynamic | Improve this filter to catch more attacks. |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | block | block |  |
| ...7c7a2f25 | HTTP requests from known botnet (signature #74). | N/A | block |  |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic |  |

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

## 2023-11-10 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-10-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-10-emergency/)

Page options # 2023-11-10 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...7d0f1e5f | HTTP requests from known botnet (signature #72). | N/A | block |  |
| ...94547a95 | HTTP requests with unusual HTTP headers or URI path (signature #59). | N/A | ddos_dynamic |  |
| ...e269dfd6 | HTTP requests with unusual HTTP headers or URI path (signature #56). | log | block | Enable filter early to mitigate widespread impact. |
| ...f35a42a0 | HTTP requests with unusual HTTP headers or URI path (signature #57). | log | block | Enable filter early to mitigate widespread impact. |

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

## 2023-10-19

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-19/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-19/)

Page options # 2023-10-19

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...61bc58d5 | HTTP requests with unusual HTTP headers or URI path (signature #55). | ddos_dynamic | ddos_dynamic | Requests will be challenged by default, larger attacks are blocked. |

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

## 2023-10-11

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-11/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-11/)

Page options # 2023-10-11

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...35675e08 | HTTP requests with unusual HTTP headers or URI path (signature #24). | block | block | This rule can cause rare false positives with custom apps sending
invalid headers. |

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

## 2023-10-09 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-09-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-09-emergency/)

Page options # 2023-10-09 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...02bbdce1 | HTTP requests with unusual HTTP headers or URI path (signature #47). | N/A | block |  |
| ...493cb8a8 | HTTP requests with unusual HTTP headers or URI path (signature #52). | N/A | block |  |
| ...5c344623 | HTTP requests from uncommon clients | N/A | block |  |
| ...6363bb1b | HTTP requests with unusual HTTP headers or URI path (signature #48). | N/A | block |  |
| ...c1fbd175 | HTTP requests trying to impersonate browsers (pattern #4). | N/A | block |  |

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

## 2023-09-24 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-24-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-24-emergency/)

Page options # 2023-09-24 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...0fb54442 | HTTP requests with unusual HTTP headers or URI path (signature #49). | N/A | block |  |
| ...3dd5f188 | HTTP requests from known botnet (signature #71). | N/A | block |  |
| ...97003a74 | HTTP requests with unusual HTTP headers or URI path (signature #17). | block | block | Expand rule to catch more attacks. |

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

## 2023-09-21 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-21-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-21-emergency/)

Page options # 2023-09-21 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1d73128d | HTTP requests from known botnet (signature #56). | block | block | Make the rule customizable as it might cause false positive in rare
cases. |
| ...4a95ba67 | HTTP requests with unusual HTTP headers or URI path (signature #32). | ddos_dynamic | ddos_dynamic | Expand the scope of the rule to catch more attacks. |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | block | block | Update the rule to remove some rare false positives. |

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

## 2023-09-05 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-05-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-05-emergency/)

Page options # 2023-09-05 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | ddos_dynamic | Expand filter to catch attacks more comprehensively. |
| ...4346874d | HTTP requests with unusual HTTP headers or URI path (signature #46). | N/A | block |  |
| ...6fe7a312 | HTTP requests from known botnet (signature #70). | N/A | block | Expand filter to catch more attacks. It is now configurable. |

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

## 2023-08-30 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-30-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-30-emergency/)

Page options # 2023-08-30 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | ddos_dynamic |  |
| ...46082508 | HTTP requests with unusual HTTP headers or URI path (signature #45). | N/A | block |  |

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

## 2023-08-29 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-29-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-29-emergency/)

Page options # 2023-08-29 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | managed_challenge | ddos_dynamic |  |
| ...3fe55678 | HTTP requests with unusual HTTP headers or URI path (signature #44). | N/A | block |  |

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

## 2023-08-25 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-25-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-25-emergency/)

Page options # 2023-08-25 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...20c5afb5 | HTTP requests with unusual HTTP headers or URI path (signature #36). | block | block | This rule was previously readonly, but can cause false positives in rare
cases. It is now possible to override it. |
| ...cb26e2e2 | HTTP requests from known botnet (signature #69). | N/A | block |  |
| ...ebff5ef1 | HTTP requests with unusual HTTP headers or URI path (signature #43). | N/A | block |  |

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

## 2023-08-16 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-16-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-16-emergency/)

Page options # 2023-08-16 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...9721fd20 | HTTP requests trying to impersonate browsers (pattern #3). | N/A | ddos_dynamic |  |

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

## 2023-08-14

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-14/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-14/)

Page options # 2023-08-14

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | ddos_dynamic | managed_challenge | Expand the filter to catch more attacks. |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Expand the filter to catch more attacks. |

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

## 2023-08-11 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-11-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-11-emergency/)

Page options # 2023-08-11 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1de9523e | HTTP requests with unusual HTTP headers or URI path (signature #41). | N/A | block |  |
| ...22807318 | HTTP requests from known botnets. | managed_challenge | ddos_dynamic |  |
| ...aa03a345 | HTTP requests from known botnet (signature #68). | N/A | block |  |
| ...efca86eb | HTTP requests from known botnet (signature #66). | N/A | block |  |
| ...f93fb5d6 | HTTP requests from known botnet (signature #67). | N/A | block |  |

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

## 2023-07-31

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-31/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-31/)

Page options # 2023-07-31

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...9aec0913 | HTTP requests from known botnet (signature #52). | block | block | Expose existing read-only filter publicly as it might cause false
positives in rare cases. |
| ...c5f479f0 | HTTP requests from known botnet (signature #62). | N/A | block |  |
| ...d0e36f9c | HTTP requests from known botnet (signature #63). | N/A | block |  |

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

## 2023-07-17

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-17/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-17/)

Page options # 2023-07-17

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6831bff1 | HTTP requests with unusual HTTP headers or URI path (signature #35). | ddos_dynamic | block | Improve the filter to catch more attacks. |

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

## 2023-07-12 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-12-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-12-emergency/)

Page options # 2023-07-12 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...0d5872e3 | HTTP requests with unusual HTTP headers or URI path (signature #40). | N/A | ddos_dynamic |  |

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

## 2023-07-07

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-07/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-07/)

Page options # 2023-07-07

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | log | managed_challenge |  |
| ...83dc0d58 | HTTP requests from known botnet (signature #60). | N/A | block |  |

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

## 2023-07-06

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-06/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-06/)

Page options # 2023-07-06

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...22807318 | HTTP requests from known botnets. | log | managed_challenge |  |

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

## 2023-06-28

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-28/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-28/)

Page options # 2023-06-28

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...95f78bf0 | HTTP requests trying to impersonate browsers (pattern #2). | log | ddos_dynamic |  |
| ...c86adf25 | HTTP requests with unusual HTTP headers or URI path (signature #38).
Only for zones on PRO plan and above. | log | ddos_dynamic |  |

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

## 2023-06-19

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-19/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-19/)

Page options # 2023-06-19

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...de244156 | HTTP requests from known botnet (signature #59). | N/A | block |  |

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

## 2023-06-16

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-16/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-16/)

Page options # 2023-06-16

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...21e99dcf | HTTP requests from known botnet (signature #58). | N/A | block |  |

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

## 2023-06-14 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-14-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-14-emergency/)

Page options # 2023-06-14 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6fa59d23 | HTTP requests that are very likely coming from bots. | ddos_dynamic | ddos_dynamic | Expand the filter to match more attacks. |

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

## 2023-06-06

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-06/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-06/)

Page options # 2023-06-06

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6831bff1 | HTTP requests with unusual HTTP headers or URI path (signature #35). | N/A | block |  |
| ...72bb7bfd | HTTP requests with unusual HTTP headers or URI path (signature #34). | N/A | block |  |

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

## 2023-06-05 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-05-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-06-05-emergency/)

Page options # 2023-06-05 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6831bff1 | HTTP requests with unusual HTTP headers or URI path (signature #35). | N/A | block | Stop attacks from an active botnet. |

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

## 2023-05-26

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-26/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-26/)

Page options # 2023-05-26

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...4a95ba67 | HTTP requests with unusual HTTP headers or URI path (signature #32). | log | ddos_dynamic |  |

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

## 2023-05-22

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-22/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-22/)

Page options # 2023-05-22

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...4a95ba67 | HTTP requests with unusual HTTP headers or URI path (signature #32). | log | log | Improve the rule accuracy. |
| ...fd5045ff | HTTP requests from known botnet (signature #55). | N/A | block |  |

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

## 2023-05-16 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-16-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-16-emergency/)

Page options # 2023-05-16 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...311e414e | HTTP requests with unusual HTTP headers or URI path (signature #33). | N/A | ddos_dynamic | Stop attacks from an active botnet. |
| ...ad16b3fb | HTTP requests from known botnet (signature #54). | N/A | block |  |

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

## 2023-05-15 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-15-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-15-emergency/)

Page options # 2023-05-15 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1fc1e601 | HTTP requests with unusual HTTP headers or URI path (signature #31). | N/A | block |  |
| ...863134d5 | HTTP requests from known bad user agents. | block | block | Widen detection scope. |
| ...bb3cefd0 | HTTP requests with unusual HTTP headers or URI path (signature #53). | N/A | block |  |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Extend the rule to catch attacks across multiple subdomains. |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Expand the filter to catch more attacks. |
| ...f2494447 | HTTP requests attempting to bypass the cache. | ddos_dynamic | ddos_dynamic | Make rule more accurate when blocking attacks. |

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

## 2023-05-02 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-02-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-05-02-emergency/)

Page options # 2023-05-02 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Improve our capability to efficiently identify some attacks. |

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

## 2023-04-27 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-27-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-27-emergency/)

Page options # 2023-04-27 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...f2494447 | HTTP requests attempting to bypass the cache. | N/A | ddos_dynamic |  |

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

## 2023-04-21 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-21-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-21-emergency/)

Page options # 2023-04-21 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Remove some rare false positives. |
| ...d3fb9259 | HTTP requests from known botnet (signature #51). | N/A | block |  |

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

## 2023-04-17

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-17/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-17/)

Page options # 2023-04-17

Previously, only a subset of rules were exposed publicly. In rare situations, these rules can cause false positives. When this happens, you can customize their behavior using overrides.

Besides these rules, the DDoS managed rules contain other rules that do not cause issues. Until now, these rules were not shown in the dashboard or referenced in the documentation.

Cloudflare now shows all rules in the dashboard, including these high-confidence rules. This means that requests matching these rules will now have the correct rule identifier. The newly published rules are read-only and you cannot disable them.

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

## 2023-04-03

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-03/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-04-03/)

Page options # 2023-04-03

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...cedf44f8 | HTTP requests with non-standard HTTP methods. | log | block |  |

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

## 2023-03-22

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-03-22/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-03-22/)

Page options # 2023-03-22

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Mitigate more attacks (action is managed-challenge for smaller attacks,
block for large ones). |

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

## 2023-03-10

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-03-10/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-03-10/)

Page options # 2023-03-10

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...97003a74 | HTTP requests with unusual HTTP headers or URI path (signature #17). | ddos_dynamic | block | Detect new attacks with unusual HTTP attributes. |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Expand the filter to catch more attacks. |

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

## 2023-02-28 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-02-28-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-02-28-emergency/)

Page options # 2023-02-28 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...97003a74 | HTTP requests with unusual HTTP headers or URI path (signature #17). | log | ddos_dynamic | Enable mitigation on a subset of this rule that is known to only match
attacks. |

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

## 2023-02-20

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-02-20/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-02-20/)

Page options # 2023-02-20

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...863134d5 | HTTP requests from known bad user agents. | block | block | Detect more load testing tools as bad |

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

## 2023-01-30

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2023-01-30/](https://developers.cloudflare.com/ddos-protection/change-log/http/2023-01-30/)

Page options # 2023-01-30

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...291a3fc7 | HTTP requests with unusual HTTP headers or URI path (signature #19). | log | block | New rule blocking requests with unusual attributes. |

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

## 2022-12-07 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-12-07-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-12-07-emergency/)

Page options # 2022-12-07 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Remove a small probability of false positive with worker subrequests. |

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

## 2022-11-02 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-11-02-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-11-02-emergency/)

Page options # 2022-11-02 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...06a46ce3 | HTTP requests with unusual HTTP headers or URI path (signature #18). | N/A | block | N/A |
| ...81b5405c | HTTP requests from known botnet (signature #3). | block | block | Extend the rule to catch more attacks. |

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

## 2022-10-14

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-10-14/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-10-14/)

Page options # 2022-10-14

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6fa59d23 | HTTP requests that are very likely coming from bots. | ddos_dynamic | ddos_dynamic | Block more large attacks instead of challenging. |

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

## 2022-10-06 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-10-06-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-10-06-emergency/)

Page options # 2022-10-06 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...6fa59d23 | HTTP requests that are very likely coming from bots. | managed_challenge | ddos_dynamic | Block very large attacks instead of challenging them. |
| ...91b2849e | HTTP requests with unusual HTTP headers (signature #13). | block | block | Some attacks were only partially mitigated. Now the rule should stop
attacks completely. |

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

## 2022-09-19 - Emergency

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-19-emergency/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-19-emergency/)

Page options # 2022-09-19 - Emergency

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...c4bef55c | HTTP requests from known botnet (signature #5). | ddos_dynamic | ddos_dynamic | Update the rule to target previously missed attacks. |

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

## 2022-09-14

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-14/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-14/)

Page options # 2022-09-14

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...e4fe8e55 | User-Agent-aware DDoS Protection (Available only to Enterprise zones
with Advanced DDoS service). | managed_challenge | log | This rule is causing false positive in some rare occurrences, we are
reverting it back to log by default (opt-in). |

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

## 2022-09-13

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-13/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-09-13/)

Page options # 2022-09-13

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...e4fe8e55 | User-Agent-aware DDoS Protection (Available only to Enterprise zones
with Advanced DDoS service). | log | managed_challenge |  |

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

## 2022-08-16

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-16/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-16/)

Page options # 2022-08-16

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1712a123 | HTTP requests with unusual HTTP headers or URI path (signature #16). | block | block | Modify the rule to catch more attacks. |
| ...b757316c | BETA - HTTP requests with unusual HTTP headers or URI path (signature
#16). | log | N/A | Observation filter removed, rule is now merged with ...1712a123 |

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

## 2022-08-10

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-10/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-10/)

Page options # 2022-08-10

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Remove false positives. |

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

## 2022-08-02

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-02/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-08-02/)

Page options # 2022-08-02

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1712a123 | HTTP requests with unusual HTTP headers or URI path (signature #16). | log | block | Allow requests matching this rule to match other rules too in order to
catch more attacks. |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Extend the scope of this filter to match a wider set of requests. |

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

## 2022-07-18

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-18/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-18/)

Page options # 2022-07-18

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...1712a123 | HTTP requests with unusual HTTP headers or URI path (signature #16). | log | block | Enable the rule as scheduled. |

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

## 2022-07-08

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-08/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-08/)

Page options # 2022-07-08

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...7d4f6798 | HTTP requests causing a high request rate to authentication endpoints. | block | block | Update thresholds for lower sensitivity levels to align with other
rules. |
| ...ecd68c61 | HTTP requests causing a high request rate to search endpoints. | ddos_dynamic | ddos_dynamic | Update thresholds for lower sensitivity levels to align with other
rules. |

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

## 2022-07-06

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-06/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-07-06/)

Page options # 2022-07-06

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...444be2c3 | Location-Aware DDoS Protection (Available only to Enterprise zones with
Advanced DDoS service). | N/A | log | Added new Location-Aware DDoS Protection for Enterprise accounts that
are subscribed to the Advanced DDoS service. Location Aware DDoS
Protection constantly learns a zone's traffic levels per country and
region over time, creates a traffic profile and then flags or mitigates
traffic that deviates from the profile. |
| ...863134d5 | HTTP requests from known bad user agents. | block | block | Requests matching this rule will not match any other. |

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

## 2022-06-08

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-06-08/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-06-08/)

Page options # 2022-06-08

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | ddos_dynamic | ddos_dynamic | Expanded the filter to catch more attacks. |

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

## 2022-06-01

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-06-01/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-06-01/)

Page options # 2022-06-01

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...d2f294d7 | HTTP requests trying to impersonate browsers. | managed_challenge | ddos_dynamic | Pick different actions depending on attack characteristics. |

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

## 2022-05-12

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-05-12/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-05-12/)

Page options # 2022-05-12

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...ad07ec62 | HTTP requests with unusual HTTP headers or URI path (signature #6). | log | block |  |

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

## 2022-05-03

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-05-03/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-05-03/)

Page options # 2022-05-03

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...4cc1fcb6 | BETA - HTTP requests with unusual HTTP headers or URI path (signature
#2). | log | N/A |  |
| ...81b13394 | HTTP requests with unusual HTTP headers or URI path (signature #2). | block | block | Update the rule to catch more attacks than before. |
| ...863134d5 | HTTP requests from known bad user agents. | log | block |  |

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

## 2022-04-21

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-21/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-21/)

Page options # 2022-04-21

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...e7dccda4 | HTTP requests from known botnet (signature #7). | block | block | Remove false positives. |

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

## 2022-04-12

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-12/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-12/)

Page options # 2022-04-12

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...61b90333 | HTTP requests with unusual HTTP headers or URI path (signature #15). | N/A | managed_challenge | This rule is detecting floods of requests impersonating a browser. |
| ...81b13394 | HTTP requests with unusual HTTP headers or URI path (signature #2). | block | block | Updated the filter to detect attacks more easily |

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

## 2022-04-07

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-07/](https://developers.cloudflare.com/ddos-protection/change-log/http/2022-04-07/)

Page options # 2022-04-07

| Rule ID | Description | Previous Action | New Action | Notes |
| --- | --- | --- | --- | --- |
| ...8ed59b32 | Global L7 attack mitigations | ddos_dynamic | ddos_dynamic | Some attack patterns will be detected more consistently. |

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

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/general-updates/](https://developers.cloudflare.com/ddos-protection/change-log/general-updates/)

Page options # General updates

Subscribe to RSS

## 2024-06-03

DDoS alerts now available for EU CMB customers DDoS alerts are now available for EU Customer Metadata Boundary (CMB) customers. This includes all DDoS alert type (Standard and Advanced) for both HTTP DDoS attacks and L3/4 DDoS attacks.

## 2024-04-17

Network Analytics now supported for EU CMB customers The Network Analytics dashboard is available to customers that have opted in to the EU Customer Metadata Boundary (CMB) solution. This also includes Network Analytics Logs (Logpush) and GraphQL API.

API users can ensure they are routed properly by directing their API requests at eu.api.cloudflare.com.

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

## Advanced DDoS systems

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/)

Page options # Advanced DDoS systems

Refer to the following pages for more information on Cloudflare's Advanced DDoS systems:

- General settings
- Concepts
- How to
- API configuration

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

## How to

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/how-to/)

Page options # How to

- Add a prefix
- Add an IP or prefix to the allowlist
- Create a rule
- Create a filter
- Exclude a prefix

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

## API configuration

**來源**: [https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/](https://developers.cloudflare.com/ddos-protection/advanced-ddos-systems/api/)

Page options # API configuration

Refer to the following pages to configure Advanced TCP Protection and Advanced DNS Protection via the API.

- Advanced DNS Protection
- Advanced TCP Protection

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

## Best practices

**來源**: [https://developers.cloudflare.com/ddos-protection/best-practices/](https://developers.cloudflare.com/ddos-protection/best-practices/)

Page options # Best practices

Refer to the following pages for more information on DDoS protection best practices:

- Prevent DDoS attacks
- Respond to DDoS attacks
- Third-party services and DDoS protection

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

**來源**: [https://developers.cloudflare.com/ddos-protection/reference/](https://developers.cloudflare.com/ddos-protection/reference/)

Page options # Reference

Refer to the following pages for more information about Cloudflare DDoS protection:

- Analytics
- Reports
- Alerts
- Logs
- Simulating test DDoS attacks

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

## Changelog | DDoS protectionDDoS protection - DDoS alerts now available for EU CMB customersDDoS protection - Network Analytics now supported for EU CMB customers

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/general-updates/index.xml](https://developers.cloudflare.com/ddos-protection/change-log/general-updates/index.xml)

Changelog | DDoS protection Updates to DDoS protection https://developers.cloudflare.com/ddos-protection/change-log/general-updates DDoS protection - DDoS alerts now available for EU CMB customers https://developers.cloudflare.com/ddos-protection/change-log/general-updates/#ddos-alerts-now-available-for-eu-cmb-customers https://developers.cloudflare.com/ddos-protection/change-log/general-updates/#ddos-alerts-now-available-for-eu-cmb-customers <p><a href="https://developers.cloudflare.com/ddos-protection/reference/alerts/">DDoS alerts</a> are now available for EU Customer Metadata Boundary (CMB) customers. This includes all DDoS alert type (Standard and Advanced) for both HTTP DDoS attacks and L3/4 DDoS attacks.</p> Mon, 03 Jun 2024 00:00:00 GMT DDoS protection - Network Analytics now supported for EU CMB customers https://developers.cloudflare.com/ddos-protection/change-log/general-updates/#network-analytics-now-supported-for-eu-cmb-customers https://developers.cloudflare.com/ddos-protection/change-log/general-updates/#network-analytics-now-supported-for-eu-cmb-customers <p>The Network Analytics dashboard is available to customers that have opted in to the EU <a href="https://developers.cloudflare.com/data-localization/metadata-boundary/">Customer Metadata Boundary</a> (CMB) solution. This also includes Network Analytics Logs (Logpush) and GraphQL API.</p>
<p>API users can ensure they are routed properly by directing their API requests at <code>eu.api.cloudflare.com</code>.</p> Wed, 17 Apr 2024 00:00:00 GMT

---

## Changelog | DDoS protectionDDoS protection - 2024-03-12DDoS protection - 2023-07-31DDoS protection - 2023-04-17DDoS protection - 2022-12-02

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/network/index.xml](https://developers.cloudflare.com/ddos-protection/change-log/network/index.xml)

Changelog | DDoS protection Updates to DDoS protection https://developers.cloudflare.com/ddos-protection/change-log/network DDoS protection - 2024-03-12 https://developers.cloudflare.com/ddos-protection/change-log/network/2024-03-12 https://developers.cloudflare.com/ddos-protection/change-log/network/2024-03-12 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...85fa2e98</td><td><p>Adaptive DDoS Protection for UDP Destination Ports (Available only to
Enterprise accounts).</p></td><td>N/A</td><td>log</td><td><p>Enable rule that uses a customer's UDP destination port profile to
mitigate traffic (log mode by default).</p></td></tr></tbody></table> Tue, 12 Mar 2024 00:00:00 GMT DDoS protection - 2023-07-31 https://developers.cloudflare.com/ddos-protection/change-log/network/2023-07-31 https://developers.cloudflare.com/ddos-protection/change-log/network/2023-07-31 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...aa772b5c</td><td><p>Adaptive DDoS Protection for Location-Based UDP (Available only to
Enterprise accounts).</p></td><td>N/A</td><td>log</td><td>Enable UDP geolocation Adaptive DDoS rule</td></tr></tbody></table> Mon, 31 Jul 2023 00:00:00 GMT DDoS protection - 2023-04-17 https://developers.cloudflare.com/ddos-protection/change-log/network/2023-04-17 https://developers.cloudflare.com/ddos-protection/change-log/network/2023-04-17 <p>Previously, only a subset of rules were exposed publicly. In rare situations, these rules can cause false positives. When this happens, you can customize their behavior using overrides.</p>
<p>Besides these rules, the DDoS managed rules contain other rules that do not cause issues. Until now, these rules were not shown in the dashboard or referenced in the documentation.</p>
<p>Cloudflare now shows all rules in the dashboard, including these high-confidence rules. This means that packets matching these rules will now have the correct rule identifier. The newly published rules are read-only and you cannot disable them.</p> Mon, 17 Apr 2023 00:00:00 GMT DDoS protection - 2022-12-02 https://developers.cloudflare.com/ddos-protection/change-log/network/2022-12-02 https://developers.cloudflare.com/ddos-protection/change-log/network/2022-12-02 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...58e4914a</td><td><p>Adaptive DDoS Protection for UDP (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...76d5e15c</td><td><p>Adaptive DDoS Protection for Other IPv6 Protocols (Available only to
Enterprise accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...8de83ef6</td><td><p>Adaptive DDoS Protection for IPv6 GRE (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...938e978c</td><td><p>Adaptive DDoS Protection for IPv6 ESP (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...9c173480</td><td><p>Adaptive DDoS Protection for ICMP (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...ad8078b8</td><td><p>Adaptive DDoS Protection for IPv4 GRE (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...ae3f5e4e</td><td><p>Adaptive DDoS Protection for ICMPv6 (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...c7dc52df</td><td><p>Adaptive DDoS Protection for Other IPv4 Protocols (Available only to
Enterprise accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr><tr><td>...e4e7541c</td><td><p>Adaptive DDoS Protection for IPv4 ESP (Available only to Enterprise
accounts).</p></td><td>log</td><td>log</td><td>Lower sensitivity to avoid false positives</td></tr></tbody></table> Fri, 02 Dec 2022 00:00:00 GMT

---

## Changelog | DDoS protectionDDoS protection - Scheduled for 2024-04-29DDoS protection - 2024-04-19DDoS protection - 2024-04-16DDoS protection - 2024-04-04DDoS protection - 2024-04-02DDoS protection - 2024-02-26DDoS protection - 2024-02-19DDoS protection - 2024-02-12DDoS protection - 2024-02-08DDoS protection - 2024-02-06DDoS protection - 2024-02-05DDoS protection - 2024-01-26DDoS protection - 2024-01-25DDoS protection - 2024-01-23DDoS protection - 2024-01-05DDoS protection - 2023-12-19DDoS protection - 2023-12-14DDoS protection - 2023-12-08DDoS protection - 2023-11-29DDoS protection - 2023-11-22DDoS protection - 2023-11-13DDoS protection - 2023-11-10DDoS protection - 2023-10-19DDoS protection - 2023-10-11DDoS protection - 2023-10-09DDoS protection - 2023-09-24DDoS protection - 2023-09-21DDoS protection - 2023-09-05DDoS protection - 2023-08-30DDoS protection - 2023-08-29DDoS protection - 2023-08-25DDoS protection - 2023-08-16DDoS protection - 2023-08-14DDoS protection - 2023-08-11DDoS protection - 2023-07-31

**來源**: [https://developers.cloudflare.com/ddos-protection/change-log/http/index.xml](https://developers.cloudflare.com/ddos-protection/change-log/http/index.xml)

Changelog | DDoS protection Updates to DDoS protection https://developers.cloudflare.com/ddos-protection/change-log/http DDoS protection - Scheduled for 2024-04-29 https://developers.cloudflare.com/ddos-protection/change-log/http/scheduled-changes https://developers.cloudflare.com/ddos-protection/change-log/http/scheduled-changes <table style="width: 100%"><thead><tr><th>Announcement Date</th><th>Change Date</th><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr></tbody></table> Fri, 19 Apr 2024 00:00:00 GMT DDoS protection - 2024-04-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-19 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td><rule-id id="4dc034ab293145e4b0b27e20154b29a0" class="astro-alpa55q7"> <button title="Click to copy the full ID" class="px-0 astro-alpa55q7"> <code class="flex astro-alpa55q7"> ...154b29a0 </code> </button> </rule-id>  <script type="module" src="/home/runner/work/cloudflare-docs/cloudflare-docs/src/components/RuleID.astro?astro&type=script&index=0&lang.ts"></script></td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #66).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Fri, 19 Apr 2024 00:00:00 GMT DDoS protection - 2024-04-16 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-16-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-16-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td><rule-id id="767bd3e188fc46f79827e95e05ad9070" class="astro-alpa55q7"> <button title="Click to copy the full ID" class="px-0 astro-alpa55q7"> <code class="flex astro-alpa55q7"> ...05ad9070 </code> </button> </rule-id>  <script type="module" src="/home/runner/work/cloudflare-docs/cloudflare-docs/src/components/RuleID.astro?astro&type=script&index=0&lang.ts"></script></td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #64).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td><rule-id id="8655dc40759f43b9878b775d890b8f4e" class="astro-alpa55q7"> <button title="Click to copy the full ID" class="px-0 astro-alpa55q7"> <code class="flex astro-alpa55q7"> ...890b8f4e </code> </button> </rule-id>  </td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #65).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Tue, 16 Apr 2024 00:00:00 GMT DDoS protection - 2024-04-04 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-04-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-04-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...177059f1</td><td>HTTP requests from known botnet (signature #31).</td><td>log</td><td>N/A</td><td></td></tr><tr><td>...7b231fb2</td><td>HTTP requests from known botnet (signature #81).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Thu, 04 Apr 2024 00:00:00 GMT DDoS protection - 2024-04-02 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-02 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-04-02 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...d2f294d7</td><td>HTTP requests trying to impersonate browsers.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Update the rule to match to block attacks more consistently.</td></tr></tbody></table> Tue, 02 Apr 2024 00:00:00 GMT DDoS protection - 2024-02-26 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-26-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-26-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...6831bff1</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #35).</p></td><td>block</td><td>block</td><td>Extend the rule to catch attacks more comprehensively.</td></tr><tr><td>...e269dfd6</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #56).</p></td><td>block</td><td>block</td><td>Extend the rule to catch attacks more comprehensively.</td></tr></tbody></table> Mon, 26 Feb 2024 00:00:00 GMT DDoS protection - 2024-02-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-19 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...0fbfd5ae</td><td>HTTP requests from known botnet (signature #32).</td><td>block</td><td>ddos_dynamic</td><td></td></tr><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand rule logic to catch more attacks.</td></tr><tr><td>...3ad719cd</td><td>HTTP requests from known botnet (signature #79).</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand the rule scope to catch more attacks.</td></tr></tbody></table> Mon, 19 Feb 2024 00:00:00 GMT DDoS protection - 2024-02-12 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-12 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-12 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...c47bdca6</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #62).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Mon, 12 Feb 2024 00:00:00 GMT DDoS protection - 2024-02-08 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-08-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-08-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...3a679c52</td><td>Requests coming from known bad sources.</td><td>ddos_dynamic</td><td>managed_challenge</td><td>Expand the rule to mitigate on all zones.</td></tr></tbody></table> Thu, 08 Feb 2024 00:00:00 GMT DDoS protection - 2024-02-06 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-06-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-06-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1fc1e601</td><td>HTTP requests with unusual HTTP headers or URI path (signature #31).</td><td>block</td><td>block</td><td>Modify characteristics of the unusual HTTP headers or URI path.</td></tr><tr><td>...3a679c52</td><td>Requests coming from known bad sources.</td><td>N/A</td><td>ddos_dynamic</td><td></td></tr><tr><td>...3ad719cd</td><td>HTTP requests from known botnet (signature #79).</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand the scope of the rule to match more attacks.</td></tr></tbody></table> Tue, 06 Feb 2024 00:00:00 GMT DDoS protection - 2024-02-05 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-05-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-02-05-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Extend the rule to catch more attacks.</td></tr></tbody></table> Mon, 05 Feb 2024 00:00:00 GMT DDoS protection - 2024-01-26 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-26-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-26-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...3ad719cd</td><td>HTTP requests from known botnet (signature #79).</td><td>N/A</td><td>ddos_dynamic</td><td></td></tr><tr><td>...61bc58d5</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #55).</p></td><td>managed_challenge</td><td>managed_challenge</td><td><p>Expanded the scope of the rule to catch attacks more consistently.</p></td></tr></tbody></table> Fri, 26 Jan 2024 00:00:00 GMT DDoS protection - 2024-01-25 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-25 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-25 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1fc1e601</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #31).</p></td><td>block</td><td>block</td><td>Add more characteristics to the unusual HTTP headers or URI path.</td></tr></tbody></table> Thu, 25 Jan 2024 00:00:00 GMT DDoS protection - 2024-01-23 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-23 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-23 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1fc1e601</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #31).</p></td><td>block</td><td>block</td><td>Add more characteristics to the unusual HTTP headers or URI path.</td></tr><tr><td>...2de94fb2</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #3).</p></td><td>ddos_dynamic</td><td>block</td><td>Expand rule scope to catch more attacks.</td></tr><tr><td>...2f8d9a4f</td><td>HTTP requests from known botnet (signature #78).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Tue, 23 Jan 2024 00:00:00 GMT DDoS protection - 2024-01-05 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-05 https://developers.cloudflare.com/ddos-protection/change-log/http/2024-01-05 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...2de94fb2</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #3).</p></td><td>block</td><td>block</td><td>Fine-tune the characteristics of the unusual requests.</td></tr><tr><td>...177059f1</td><td>HTTP requests from known botnet (signature #31).</td><td>block</td><td>N/A</td><td>Removed due to false positives.</td></tr><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>block</td><td>N/A</td><td>Removed due to false positives.</td></tr><tr><td>...82c0ed5f</td><td>HTTP requests from known botnet (signature #77).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...e4f3ea4d</td><td>HTTP requests from known botnet (signature #76).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Fri, 05 Jan 2024 00:00:00 GMT DDoS protection - 2023-12-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-19-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-19-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1fc1e601</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #31).</p></td><td>block</td><td>block</td><td>Add more characteristics to the unusual HTTP headers or URI path.</td></tr><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>log</td><td>ddos_dynamic</td><td>Extend the rule to catch more attacks.</td></tr><tr><td>...d2f294d7</td><td>HTTP requests trying to impersonate browsers.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Change the rule to catch more attacks.</td></tr></tbody></table> Tue, 19 Dec 2023 00:00:00 GMT DDoS protection - 2023-12-14 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-14-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-14-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>block</td><td>block</td><td>Tweak the rule to avoid false positives in some rare cases.</td></tr></tbody></table> Thu, 14 Dec 2023 00:00:00 GMT DDoS protection - 2023-12-08 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-08-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-12-08-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>block</td><td>block</td><td><p>Updated the rule to avoid false positives in some rare circumstances.</p></td></tr><tr><td>...e7a37252</td><td>HTTP requests from known botnet (signature #75).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Fri, 08 Dec 2023 00:00:00 GMT DDoS protection - 2023-11-29 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-29 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-29 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...8ed59b32</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #61).</p></td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Rename rule to avoid confusion.</td></tr><tr><td>...61e8d513</td><td>Global L7 WordPress attack mitigations (Deprecated)</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Mark rule as deprecated.</td></tr></tbody></table> Wed, 29 Nov 2023 00:00:00 GMT DDoS protection - 2023-11-22 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-22 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-22 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...254da96a</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #58).</p></td><td>log</td><td>block</td><td></td></tr></tbody></table> Wed, 22 Nov 2023 00:00:00 GMT DDoS protection - 2023-11-13 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-13-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-13-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Improve this filter to catch more attacks.</td></tr><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>block</td><td>block</td><td></td></tr><tr><td>...7c7a2f25</td><td>HTTP requests from known botnet (signature #74).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...d2f294d7</td><td>HTTP requests trying to impersonate browsers.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td></td></tr></tbody></table> Mon, 13 Nov 2023 00:00:00 GMT DDoS protection - 2023-11-10 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-10-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-11-10-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...7d0f1e5f</td><td>HTTP requests from known botnet (signature #72).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...94547a95</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #59).</p></td><td>N/A</td><td>ddos_dynamic</td><td></td></tr><tr><td>...e269dfd6</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #56).</p></td><td>log</td><td>block</td><td>Enable filter early to mitigate widespread impact.</td></tr><tr><td>...f35a42a0</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #57).</p></td><td>log</td><td>block</td><td>Enable filter early to mitigate widespread impact.</td></tr></tbody></table> Fri, 10 Nov 2023 00:00:00 GMT DDoS protection - 2023-10-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-19 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-19 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...61bc58d5</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #55).</p></td><td>ddos_dynamic</td><td>ddos_dynamic</td><td><p>Requests will be challenged by default, larger attacks are blocked.</p></td></tr></tbody></table> Thu, 19 Oct 2023 00:00:00 GMT DDoS protection - 2023-10-11 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-11 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-11 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...35675e08</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #24).</p></td><td>block</td><td>block</td><td><p>This rule can cause rare false positives with custom apps sending
invalid headers.</p></td></tr></tbody></table> Wed, 11 Oct 2023 00:00:00 GMT DDoS protection - 2023-10-09 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-09-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-10-09-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...02bbdce1</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #47).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...493cb8a8</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #52).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...5c344623</td><td>HTTP requests from uncommon clients</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...6363bb1b</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #48).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...c1fbd175</td><td>HTTP requests trying to impersonate browsers (pattern #4).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Mon, 09 Oct 2023 00:00:00 GMT DDoS protection - 2023-09-24 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-24-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-24-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...0fb54442</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #49).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...3dd5f188</td><td>HTTP requests from known botnet (signature #71).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...97003a74</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #17).</p></td><td>block</td><td>block</td><td>Expand rule to catch more attacks.</td></tr></tbody></table> Sun, 24 Sep 2023 00:00:00 GMT DDoS protection - 2023-09-21 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-21-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-21-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1d73128d</td><td>HTTP requests from known botnet (signature #56).</td><td>block</td><td>block</td><td><p>Make the rule customizable as it might cause false positive in rare
cases.</p></td></tr><tr><td>...4a95ba67</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #32).</p></td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand the scope of the rule to catch more attacks.</td></tr><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>block</td><td>block</td><td>Update the rule to remove some rare false positives.</td></tr></tbody></table> Thu, 21 Sep 2023 00:00:00 GMT DDoS protection - 2023-09-05 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-05-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-09-05-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand filter to catch attacks more comprehensively.</td></tr><tr><td>...4346874d</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #46).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...6fe7a312</td><td>HTTP requests from known botnet (signature #70).</td><td>N/A</td><td>block</td><td>Expand filter to catch more attacks. It is now configurable.</td></tr></tbody></table> Tue, 05 Sep 2023 00:00:00 GMT DDoS protection - 2023-08-30 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-30-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-30-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td></td></tr><tr><td>...46082508</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #45).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Wed, 30 Aug 2023 00:00:00 GMT DDoS protection - 2023-08-29 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-29-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-29-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>managed_challenge</td><td>ddos_dynamic</td><td></td></tr><tr><td>...3fe55678</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #44).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Tue, 29 Aug 2023 00:00:00 GMT DDoS protection - 2023-08-25 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-25-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-25-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...20c5afb5</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #36).</p></td><td>block</td><td>block</td><td><p>This rule was previously readonly, but can cause false positives in rare
cases. It is now possible to override it.</p></td></tr><tr><td>...cb26e2e2</td><td>HTTP requests from known botnet (signature #69).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...ebff5ef1</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #43).</p></td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Fri, 25 Aug 2023 00:00:00 GMT DDoS protection - 2023-08-16 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-16-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-16-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...9721fd20</td><td>HTTP requests trying to impersonate browsers (pattern #3).</td><td>N/A</td><td>ddos_dynamic</td><td></td></tr></tbody></table> Wed, 16 Aug 2023 00:00:00 GMT DDoS protection - 2023-08-14 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-14 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-14 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>ddos_dynamic</td><td>managed_challenge</td><td>Expand the filter to catch more attacks.</td></tr><tr><td>...d2f294d7</td><td>HTTP requests trying to impersonate browsers.</td><td>ddos_dynamic</td><td>ddos_dynamic</td><td>Expand the filter to catch more attacks.</td></tr></tbody></table> Mon, 14 Aug 2023 00:00:00 GMT DDoS protection - 2023-08-11 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-11-emergency https://developers.cloudflare.com/ddos-protection/change-log/http/2023-08-11-emergency <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...1de9523e</td><td><p>HTTP requests with unusual HTTP headers or URI path (signature #41).</p></td><td>N/A</td><td>block</td><td></td></tr><tr><td>...22807318</td><td>HTTP requests from known botnets.</td><td>managed_challenge</td><td>ddos_dynamic</td><td></td></tr><tr><td>...aa03a345</td><td>HTTP requests from known botnet (signature #68).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...efca86eb</td><td>HTTP requests from known botnet (signature #66).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...f93fb5d6</td><td>HTTP requests from known botnet (signature #67).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Fri, 11 Aug 2023 00:00:00 GMT DDoS protection - 2023-07-31 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-31 https://developers.cloudflare.com/ddos-protection/change-log/http/2023-07-31 <table style="width: 100%"><thead><tr><th>Rule ID</th><th>Description</th><th>Previous Action</th><th>New Action</th><th>Notes</th></tr></thead><tbody><tr><td>...9aec0913</td><td>HTTP requests from known botnet (signature #52).</td><td>block</td><td>block</td><td><p>Expose existing read-only filter publicly as it might cause false
positives in rare cases.</p></td></tr><tr><td>...c5f479f0</td><td>HTTP requests from known botnet (signature #62).</td><td>N/A</td><td>block</td><td></td></tr><tr><td>...d0e36f9c</td><td>HTTP requests from known botnet (signature #63).</td><td>N/A</td><td>block</td><td></td></tr></tbody></table> Mon, 31 Jul 2023 00:00:00 GMT

---

