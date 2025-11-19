# Bot Management - 機器人管理

> 本文檔包含 48 個頁面的內容
> 生成時間: 2025-09-08T04:18:09.241Z
> 產品線: 🛡️ Security Products

## 📑 目錄

1. [Cloudflare bot solutions](#cloudflare-bot-solutions)
2. [Plans](#plans)
3. [Bot Fight Mode](#bot-fight-mode)
4. [Super Bot Fight Mode](#super-bot-fight-mode)
5. [Bot Management](#bot-management)
6. [Bots](#bots)
7. [Verified bots](#verified-bots)
8. [Verified bots policy](#verified-bots-policy)
9. [Signed agents](#signed-agents)
10. [Signed agents policy](#signed-agents-policy)
11. [Bot scores](#bot-scores)
12. [Bot tags](#bot-tags)
13. [Bot Feedback Loop](#bot-feedback-loop)
14. [Bot detection engines](#bot-detection-engines)
15. [JA3/JA4 fingerprint](#ja3ja4-fingerprint)
16. [Signals Intelligence](#signals-intelligence)
17. [Detection IDs](#detection-ids)
18. [Sequence rules](#sequence-rules)
19. [AI Labyrinth](#ai-labyrinth)
20. [Block AI Bots](#block-ai-bots)
21. [Direct AI crawlers with managed robots.txt](#direct-ai-crawlers-with-managed-robotstxt)
22. [Static resource protection](#static-resource-protection)
23. [Bot Analytics](#bot-analytics)
24. [Delay action](#delay-action)
25. [Bot Management skips](#bot-management-skips)
26. [Super Bot Fight Mode for WordPress](#super-bot-fight-mode-for-wordpress)
27. [Web Bot Auth](#web-bot-auth)
28. [IP validation](#ip-validation)
29. [Bot Management variables](#bot-management-variables)
30. [Machine Learning models](#machine-learning-models)
31. [Bot Detection Alerts](#bot-detection-alerts)
32. [Sample terms](#sample-terms)
33. [FAQ](#faq)
34. [Glossary](#glossary)
35. [Enterprise Bot Management](#enterprise-bot-management)
36. [Free](#free)
37. [Pro](#pro)
38. [Business](#business)
39. [Get started with Cloudflare bot solutions](#get-started-with-cloudflare-bot-solutions)
40. [JavaScript Detections](#javascript-detections)
41. [Concepts](#concepts)
42. [Additional configurations](#additional-configurations)
43. [AI Labyrinth](#ai-labyrinth)
44. [Workers templates](#workers-templates)
45. [Troubleshooting](#troubleshooting)
46. [Reference](#reference)
47. [Bot verification methods](#bot-verification-methods)
48. [Plans](#plans)

---

## Cloudflare bot solutions

**來源**: [https://developers.cloudflare.com/bots/](https://developers.cloudflare.com/bots/)

Page options # Cloudflare bot solutions

Identify and mitigate automated traffic to protect your domain from bad bots.

Available on all plans While Cloudflare offers several products that relate to bot traffic, this section reviews our bot-specific products, Bot Fight Mode, Super Bot Fight Mode, and Bot Management for Enterprise.

Note

Enterprise customers can preview this product as a non-contract service, which provides full access, free of metered usage fees, limits, and certain other restrictions.

## Which bot solution do I need?

If you have a smaller domain and have identified a bot problem, we recommend Bot Fight Mode or Super Bot Fight Mode, which are included with your plan subscription. You can enable either from your dashboard, but these solutions offer limited configuration options.

If you have a large domain with a lot of traffic, we recommend Bot Management for Enterprise, especially for customers in ecommerce, banking, and security. To enable Bot Management for Enterprise and write rules to customize your bot protection, contact your account team.

To see the differences in features and functionality, visit Plans.

## Features

### Bot Fight Mode

Detect and mitigate bot traffic on your domain.

Use Bot Fight Mode ### Super Bot Fight Mode

Identify traffic matching patterns of known bots, challenge or block bots, protect static resources, and view analytics to help you understand bot traffic using Super Bot Fight Mode.

Use Super Bot Fight Mode ### Bot Analytics

Use Bot Analytics to dynamically examine bot traffic.

Use Bot Analytics ### Firewall variables

Access several new variables within the Firewall expression builder.

Use Firewall variables ## Related products

API Shield Identify and address API vulnerabilities using API Shield.

DDoS Protection Detect and mitigate Distributed Denial of Service (DDoS) attacks using Cloudflare's Autonomous Edge.

Turnstile Use Cloudflare's smart CAPTCHA alternative to run less intrusive challenges.

WAF Get automatic protection from vulnerabilities and the flexibility to create custom rules.

## More resources

Plans

Compare available Cloudflare plans

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Plans

**來源**: [https://developers.cloudflare.com/bots/plans/](https://developers.cloudflare.com/bots/plans/)

Page options # Plans

To learn more about features and functionality, select a plan.

Free

Pro

Business

Bot Management for Enterprise

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Fight Mode

**來源**: [https://developers.cloudflare.com/bots/get-started/bot-fight-mode/](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)

Page options # Bot Fight Mode

Bot Fight Mode is a simple, free product that helps detect and mitigate bot traffic on your domain. When enabled, the product:

- Identifies traffic matching patterns of known bots
- Issues computationally expensive challenges in response to these bots
- Notifies Bandwidth Alliance ↗ partners (if applicable) to disable bots

## Considerations

Bot Fight Mode and Super Bot Fight Mode use the same underlying technology that powers our Bot Management ↗ product. Specifically, these products:

- Protect entire domains without endpoint restrictions
- Cannot be customized, adjusted, or reconfigured via WAF custom rules

Although these products are designed to fight malicious actors on the Internet, they may challenge API or mobile app traffic. For more granular control, upgrade to Bot Management for Enterprise.

## Enable Bot Fight Mode

To start using Bot Fight Mode:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. For Bot Fight Mode, select On.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Bot Fight Mode.
5. Turn Bot Fight Mode on.

Note

If you are upgrading from Bot Fight Mode to Super Bot Fight Mode, you must disable Bot Fight Mode in your Bot settings.

Old dashboard: Security > Bots, and select Configure Bot Fight Mode.

New dashboard: Security > Settings. Filter by Bot traffic and turn Bot Fight Mode off.

## Disable Bot Fight Mode

If you find that Bot Fight Mode is causing problems with your application traffic, you may want to disable it.

To disable Bot Fight Mode:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. For Bot Fight Mode, select Off.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Bot Fight Mode.
5. Turn Bot Fight Mode on.

## Block AI bots

Refer to Block AI bots.

Note

You can view blocked AI bot traffic via Security Analytics.

## Visibility

You can see bot-related actions by going to Security > Events. Any requests challenged by this product will be labeled Bot Fight Mode in the Service field. This allows you to observe, analyze, and follow trends in your bot traffic over time.

## Limitations

You cannot bypass or skip Bot Fight Mode using the Skip action in WAF custom rules or using Page Rules. Skip, Bypass, and Allow actions apply to rules or rulesets running on the Ruleset Engine. While Super Bot Fight Mode rules are implemented in the Ruleset Engine, Bot Fight Mode checks are not. This is why you can skip Super Bot Fight Mode, but not Bot Fight Mode. If you need to skip Bot Fight Mode, consider using Super Bot Fight Mode.

Bot Fight Mode can still trigger if you have IP Access rules, but it cannot trigger if an IP Access rule matches the request. For example, the IP Access rule matches the connecting IP.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Super Bot Fight Mode

**來源**: [https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/)

Page options # Super Bot Fight Mode

Super Bot Fight Mode is included in your Pro, Business, or Enterprise subscription. When enabled, the product:

- Identifies traffic matching patterns of known bots
- Can challenge or block bots
- Offers protection for static resources
- Provides limited analytics to help you understand bot traffic

Accounts with an Enterprise subscription but not the Bot Management add-on will have Super Bot Fight Mode for Business.

## Considerations

Bot Fight Mode and Super Bot Fight Mode use the same underlying technology that powers our Bot Management ↗ product. Specifically, these products:

- Protect entire domains without endpoint restrictions
- Cannot be customized, adjusted, or reconfigured via WAF custom rules

Although these products are designed to fight malicious actors on the Internet, they may challenge API or mobile app traffic. For more granular control, upgrade to Bot Management for Enterprise.

## Enable Super Bot Fight Mode

Note

If you are upgrading from Bot Fight Mode to Super Bot Fight Mode, you must disable Bot Fight Mode in your Bot settings.

Old dashboard: Security > Bots, and select Configure Bot Fight Mode.

New dashboard: Security > Settings. Filter by Bot traffic and turn Bot Fight Mode off.

To start using Super Bot Fight Mode:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Super Bot Fight Mode.
4. Choose how your domain should respond to various types of traffic:

For more details on verified bots, refer to Verified Bots.
For more details on supported file types, refer to Static resource protection.
For more details on invisible code injection, refer to JavaScript detections.
5. For more details on verified bots, refer to Verified Bots.
6. For more details on supported file types, refer to Static resource protection.
7. For more details on invisible code injection, refer to JavaScript detections.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Super Bot Fight Mode.
5. Turn Super Bot Fight Mode on.
6. Choose how your domain should respond to various types of traffic by selecting the associated edit icon:

For more details on verified bots, refer to Verified Bots.
For more details on supported file types, refer to Static resource protection.
For more details on invisible code injection, refer to JavaScript detections.
For more details on WordPress optimization, refer to Super Bot Fight Mode for WordPress.
7. For more details on verified bots, refer to Verified Bots.
8. For more details on supported file types, refer to Static resource protection.
9. For more details on invisible code injection, refer to JavaScript detections.
10. For more details on WordPress optimization, refer to Super Bot Fight Mode for WordPress.

Warning

If your organization also uses Cloudflare Tunnel, keep Definitely Automated set to Allow. Otherwise, tunnels might fail with a websocket: bad handshake error.

In parts of your site where you want bot traffic, you can use the Skip action in WAF custom rules to specify where Super Bot Fight Mode should not run.

You can use the Rules language and its operators and fields in custom rules to configure a scoped rule for approved automated traffic in Super Bot Fight Mode.

## Disable Super Bot Fight Mode

If you find that Super Bot Fight Mode is causing problems with your application traffic, you may want to disable it.

To disable Super Bot Fight Mode:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Super Bot Fight Mode.
4. For all bot groupings (Definitely automated, Verified bots, etc.), set the value to Allow.
5. For all other options (Static resource protection, JavaScript Detections), ensure they are off.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Super Bot Fight Mode.
5. Turn Super Bot Fight Mode off.
6. For all bot groupings (Definitely automated traffic, Verified bots), select the edit icon and set the value to Allow.
7. For all other options (Static resource protection, JavaScript detections, Optimize for WordPress), select the edit icon and ensure they are off.

In parts of your site where you want bot traffic, you can use the Skip action in WAF custom rules to specify where Super Bot Fight Mode should not run.

You can use the Rules language and its operators and fields in custom rules to configure a scoped rule for approved automated traffic in Super Bot Fight Mode.

## Block AI bots

Refer to Block AI bots.

Note

You can view blocked AI bot traffic via Security Analytics.

## Analytics

### Bot Report

Use the Bot Report to monitor bot traffic for the past 24 hours.

To access the Bot Report, go to Security > Bots. If you see a double-digit percentage of automated traffic, you may want to upgrade to Bot Management to save money on origin costs and protect your domain from large-scale attacks.

### Security events

You can see bot-related actions by going to Security > Events. Any requests challenged by this product will be labeled Super Bot Fight Mode in the Service field. This allows you to observe, analyze, and follow trends in your bot traffic over time.

## Ruleset Engine

Super Bot Fight Mode runs during the http_request_sbfm phase of the Ruleset Engine.

Change notice for Super Bot Fight Mode rulesets

Updating Super Bot Fight Mode rules via the Rulesets API is no longer supported and may cause unexpected behavior if you do so.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Management

**來源**: [https://developers.cloudflare.com/bots/get-started/bot-management/](https://developers.cloudflare.com/bots/get-started/bot-management/)

Page options # Bot Management

Bot Management for Enterprise is a paid add-on that provides sophisticated bot protection for your domain. Customers can identify automated traffic, take appropriate action, and view detailed analytics within the dashboard.

This Enterprise product provides the most flexibility to customers by:

- Generating a bot score of 1-99 for every request. Scores below 30 are commonly associated with bot traffic.
- Allowing customers to take action on this score with WAF custom rules or Workers.
- Allowing customers to view this score in Bot Analytics or Logs.

## Enable Bot Management for Enterprise

Bot Management is automatically enabled for Enterprise zones entitled with the add-on.

- Old dashboard
- New dashboard

To enable a Bot Management ↗ trial on Enterprise zones without the Bot Management add-on entitled:

1. Log in to your Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Add Bot Management.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Bot management.
5. Turn Bot management on.
6. Choose how your domain should respond to various types of traffic by selecting the associated edit icon.

For more details on verified bots, refer to Verified Bots.
For more details on supported file types, refer to Static resource protection.
For more details on invisible code injection, refer to JavaScript detections.
For more details on WordPress optimization, refer to Super Bot Fight Mode for WordPress.
7. For more details on verified bots, refer to Verified Bots.
8. For more details on supported file types, refer to Static resource protection.
9. For more details on invisible code injection, refer to JavaScript detections.
10. For more details on WordPress optimization, refer to Super Bot Fight Mode for WordPress.

Note

If you are not seeing Bot Management enabled on your zone or if you still see Add Bot Management on the Cloudflare dashboard, contact your account team for the proper entitlements.

## Setup

Cloudflare recommends that you deploy the following basic settings and customize them according to the traffic in your zone.

### Enable the latest Machine Learning version

Cloudflare encourages Enterprise customers to enable auto-updates to its Machine Learning models to get the newest bot detection models as they are released.

To enable auto-updates:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Management.
4. Enable Auto-updates to the Machine Learning Model.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Bot Management.
5. Under Configurations, select the edit icon for Auto-updates to the Machine Learning Model and turn it on.

### Block AI Bots

Refer to Block AI bots.

Note

You can view blocked AI bot traffic via Security Analytics.

### Deploy default templates

Cloudflare has default templates ↗ for definite bots, which have a bot score of 1, and likely bots which have a bot score of 2 to 29. In our templates, Cloudflare recommends to allow verified bots such as Google SEO Crawler and access to cached static resources.

- Definite Bots template ↗: Targets malicious bot traffic while ignoring verified bots and routes delivering static content.
(cf.bot_management.score eq 1 and not cf.bot_management.verified_bot and not cf.bot_management.static_resource)
- Likely Bots template ↗: Targets traffic likely to be malicious bots while ignoring verified bots and routes with static content. It may contain a small amount of non-bot traffic.
(cf.bot_management.score ge 2 and cf.bot_management.score le 29 and not cf.bot_management.verified_bot and not cf.bot_management.static_resource)
- (Optional) JavaScript detections template ↗: If you enabled JavaScript detections, then set up a managed challenge, make sure to add a method and URI path. JavaScript detections improves security for URLs that should only expect JavaScript-enabled clients.
(not cf.bot_management.js_detection.passed and http.request.method eq "" and http.request.uri.path in {""})

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bots

**來源**: [https://developers.cloudflare.com/bots/concepts/bot/](https://developers.cloudflare.com/bots/concepts/bot/)

Page options # Bots

A bot is a software application programmed to do certain tasks.

Bots can be used for good (chatbots, search engine crawlers) or for evil (inventory hoarding, credential stuffing).

More information

For more background, refer to What is a bot? ↗.

## Verified bots and signed agents

Cloudflare maintains an internal directory of verified bot and signed agents that are associated with search engine optimization (SEO), website monitoring, and more.

You can use this directory to prevent any bot protection measures from impacting otherwise helpful bots and agents, such as search crawlers.

For a partial list of verified bots and signed agents, refer to Cloudflare Radar ↗.

Note

The method for allowing or blocking verified bots depends on your plan.

## AI bots

You can opt into a managed rule that will block bots that we categorize as artificial intelligence (AI) crawlers (“AI Bots”) from visiting your website. Customers may choose to do this to prevent AI-related usage of their content, such as training large language models (LLM).

### Which bots are blocked

When you enable this feature, Cloudflare will block the following bots:

- Amazonbot (Amazon)
- Applebot (Apple)
- Bytespider (ByteDance)
- ClaudeBot (Anthropic)
- DuckAssistBot (DuckDuckGo)
- Google-CloudVertexBot (Google)
- GoogleOther (Google)
- GPTBot (OpenAI)
- Meta-ExternalAgent (Meta)
- PetalBot (Huawei)
- TikTokSpider (ByteDance)
- CCBot (Common Crawl)

In addition to this list, verified bots ↗ that are classified as AI crawlers, as well as a number of unverified bots that behave similarly, are included in the rule. This rule does not include verified bots that fall into the Search Engine categories.

These categories, and the bots classified in these categories, may change from time to time.

If you are a bot operator and feel your bot may have been incorrectly categorized, add your bot to the list of verified bots ↗.

### How it works

When you enable this feature via a pre-configured managed rule, Cloudflare can detect and block verified AI bots that comply with robots.txt and respect crawl rates, and do not hide their behavior from your website. The rule has also been expanded to include more signatures of AI bots that do not follow the rules.

The rule to block AI bots takes precedence over all other Super Bot Fight Mode rules. For example, if you have enabled Block AI bots and Allow verified bots, verified AI bots will also be blocked even if you allow other verified bots on your website or application.

For Bot Management customers, if you have set a rule to serve managed challenges to definitely automated bots, AI bots will also be challenged because custom rules run in a phase before Super Bot Fight Mode, which is the phase when the rule to block AI bots runs.

This behavior remains the same if the setting for verified, definitely automated, and likely bots is set to block or allow. If you have an action to allow for these rules, the request is not matched to any rule and proceeds to the next ruleset phase. Similarly, if the action is set to block, they will be blocked in the earlier phase and do not move on to match the AI rule at all. However, when the action is challenge, the request matches a rule and therefore will not be matched to any rules after.

For self-serve non-Bot Management customers, all rules for verified, definitely automated, and likely bots run in the phase following the AI bots rule.

```
---
title: Rule phases
---
flowchart LR
accTitle: AI bots rule phases diagram
accDescr: This diagram details the phases in which AI bots rules run.
A[Custom rules] --> B[Block AI bots<br>managed rule] --> C[Allow verified bots rule]
```

This feature is available on all Cloudflare plans.

Note

The method for blocking AI bots depends on your plan.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Verified bots

**來源**: [https://developers.cloudflare.com/bots/concepts/bot/verified-bots/](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)

Page options # Verified bots

A verified bot is a bot which has been added to Cloudflare's list of verified bots.

You can request for your bot to be added to Cloudflare's bots and agents directory by filling out an online application ↗ in the Cloudflare dashboard.

Note

A bot cannot be registered as both a verified bot and a signed agent. Review Cloudflare's signed agents to determine how to identify your bot.

## Verified bot requirement

For a bot to be verified, it must meet the following requirements:

1. The bot must follow verified bots policy.
2. The bot must be verified using one of the following verification methods:

Web Bot Auth
IP validation
3. Web Bot Auth
4. IP validation

Once Cloudflare approves a verified bot, it should appear on Cloudflare Radar's bots and agents directory ↗.

## Transient false negatives

Once Cloudflare lists a bot as a verified bot, this entry is cached and may get delisted if no traffic is seen in the Cloudflare network coming from the bot for a defined period of time.

It takes 24 hours for an inactive IP to be removed as a verified bot.

A bot can remain unlisted until Cloudflare sees traffic being sourced from the bot. When the bot is revalidated, it is listed as a verified bot again.

## Verification methods

The bot must be verified using one of the following validation methods:

- Web Bot Auth
- IP validation

## Categories

You can segment your verified bot traffic by its type and purpose by adding the Verified Bot Categories field cf.verified_bot_category as a filter criteria in WAF Custom rules, Advanced Rate Limiting, and Late Transform rules.

Warning

The Verified Bot Categories field is not compatible with legacy Firewall rules.

Note

Verified Bot Categories is available on all plans.

| Name | String value | Example |
| --- | --- | --- |
| Academic research | Academic Research | Library of Congress, TurnItInBot, Bibliothèque nationale de France |
| Accessibility | Accessibility | Accessible Web Bot |
| Advertising or marketing | Advertising & Marketing | Google Adsbot |
| Aggregators | Aggregator | Pinterest, Indeed Jobsbot |
| AI Assistant | AI Assistant | Perplexity-User, DuckAssistBot |
| AI Crawler | AI Crawler | Google Bard, ChatGPT bot |
| AI Search | AI Search | OAI-SearchBot |
| Archiver | Archiver | Internet Archive, CommonCrawl |
| Feed fetcher | Feed Fetcher | RSS or Podcast feed updaters |
| Monitoring or analytics | Monitoring & Analytics | Uptime Monitors |
| Page preview | Page Preview | Facebook, Slack, Twitter, or Discord Link Preview tools |
| Search engine crawler | Search Engine Crawler | Googlebot, Bingbot, Yandexbot, Baidubot |
| Search engine optimization | Search Engine Optimization | Google Lighthouse, GT Metrix, Pingdom, AddThis |
| Security | Security | Vulnerability Scanners, SSL Domain Control Validation (DCV) Check Tools |
| Social media marketing | Social Media Marketing | Brandwatch |
| Webhooks | Webhooks | Payment processors, WordPress Integration tools |
| Other | Other |  |

## Availability

Verified bots are excluded by default when Bot Fight Mode is enabled to block definite bots.

Super Bot Fight Mode and Enterprise Bot Management customers have the option to block or allow verified bots.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Verified bots policy

**來源**: [https://developers.cloudflare.com/bots/concepts/bot/verified-bots/policy/](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/policy/)

Page options # Verified bots policy

In order to be listed by Cloudflare as a verified bot, your bot must conform to the below requirements. To provide the best possible protection to our customers, this policy may change in the future as we adapt to new bot behaviors.

## Bot policy

### Minimum traffic

A bot or proxy must have a minimum amount of traffic for Cloudflare to be able to find it in the sampled data. The minimum traffic should have more than 1,000 requests per day across multiple domains.

### Minimum zones

Service must be made for a widespread use of zones.

#### Example

A bot crawling one site is not valid.

### Bot identification

The user-agent or message signature with the following requirements:

- Have at least five characters.
- Must not contain special characters.
- Must not include the same user-agent of another verified service.

#### Example

GoogleBot/1.0 is a valid user-agent.

### Domain owner consent

Domains should only be crawled with the explicit or implicit consent of the zone's owner or terms of use. Search engines crawlers must read the robots.txt to exclude paths to crawl from the owner.

#### Example

A tool trying to scalp inventories from different websites might be breaking terms of use while a search engine bot indexing websites but complying with robots.txt is a valid service.

### Service purpose

The purpose of the service should be benign or helpful to both the owner of a zone and the users of the service. The service cannot perform any of the following:

- Bot tooling
- Scalpers
- Credential-stuffing
- Directory-traversal scanning
- Excessive data scraping
- DDoS botnets

#### Example

Price scraping direct e-commerce competitors is not a valid use case.

### Crawling etiquette

The crawling etiquette should check robots.txt if crawling the whole website, and it should not attempt to crawl sensitive paths.

#### Example

If a search engine crawler skips robots.txt, it will be rejected.

### Public documentation

The bot must have publicly documented expected behavior or user-agent format.

## Breach of Policy

If any of the requirements to validate are breached, a service will be removed from the global allowlist.

The following are examples of breaches of policy:

- Adding a set of IPs that are not solely used by verified service.
- The service IPs are breached by an attacker.
- The service has vulnerabilities that have not been patched.
- A block of IPs not briefed on onboarding is added to the list.
- The disclosed purpose of the service does not reflect on the traffic.
- An AI Crawler that does not respect the crawl-delay directive in robots.txt.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Signed agents

**來源**: [https://developers.cloudflare.com/bots/concepts/bot/signed-agents/](https://developers.cloudflare.com/bots/concepts/bot/signed-agents/)

Page options # Signed agents

A signed agent is controlled by an end user and a verified signature-agent from their Web Bot Auth implementation.

You can request for your agent to be added to Cloudflare's bots and agents directory by filling out an online application ↗ in the Cloudflare dashboard.

Note

A bot cannot be registered as both a verified bot and a signed agent. Review Cloudflare's verified bots to determine how to identify your bot.

## Signed agent requirement

For an agent to be recognized, it must meet the following requirements:

1. The agent must follow the signed agents policy.
2. The bot must be using Web Bot Auth.

Once Cloudflare approves a signed agent, it should appear on Cloudflare Radar's bots and agents directory ↗.

## Transient false negatives

Once Cloudflare lists an agent as a signed agent, this entry is cached and may get delisted if no traffic is seen in the Cloudflare network coming from the agent for a defined period of time.

An agent can remain unlisted until Cloudflare sees traffic being sourced from the agent. When the agent is revalidated, it is listed as a signed agent again.

## Verification method

The bot must be verified using Web Bot Auth.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Signed agents policy

**來源**: [https://developers.cloudflare.com/bots/concepts/bot/signed-agents/policy/](https://developers.cloudflare.com/bots/concepts/bot/signed-agents/policy/)

Page options # Signed agents policy

In order to be listed by Cloudflare as a signed agent, your agent must conform to the below requirements. To provide the best possible protection to our customers, this policy may change in the future as we adapt to new bot behaviors.

## Agent policy

### Minimum traffic

An agent must have a minimum amount of traffic for Cloudflare to be able to find it in the sampled data. The minimum traffic should have more than 1,000 requests per day across multiple domains.

### Minimum zones

Service must be made for a widespread use of zones.

#### Example

A bot crawling one site is not valid.

### Agent identification

The user-agent field is optional as it is not required for Web Bot Authentication.

However, if you choose to provide a user-agent, it and the message signature must meet the following requirements:

- Have at least five characters.
- Must not contain special characters.
- Must not include the same user-agent of another verified service.

#### Example

cloudflare-browser-rendering is a valid message signature.

### Service purpose

The purpose of the service should be benign or helpful to both the owner of a zone and the users of the service. The service cannot perform any of the following:

- Bot tooling
- Scalpers
- Credential-stuffing
- Directory-traversal scanning
- Excessive data scraping
- DDoS botnets

#### Example

Price scraping direct e-commerce competitors is not a valid use case.

### Public documentation

The agent must have a publicly documented purpose and expected behavior.

## Breach of policy

If any of the requirements to validate are breached, a service will be removed from the signed agent list.

The following are examples of breaches of policy:

- The service has vulnerabilities that have not been patched.
- The disclosed purpose of the service does not reflect on the traffic.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot scores

**來源**: [https://developers.cloudflare.com/bots/concepts/bot-score/](https://developers.cloudflare.com/bots/concepts/bot-score/)

Page options # Bot scores

A bot score is a score from 1 to 99 that indicates how likely that request came from a bot.

For example, a score of 1 means Cloudflare is quite certain the request was automated, while a score of 99 means Cloudflare is quite certain the request came from a human.

Bot scores are available to be used in rule expressions and with Workers to customize application behavior. For more details, refer to Bot Management variables.

Note

Granular bot scores are only available to Enterprise customers who have purchased Bot Management. All other customers can only access this information through bot groupings in Bot Analytics.

## Bot groupings

Customers with a Pro plan or higher can automatically see bot traffic divided into groups by going to Security > Bots.

| Category | Range |
| --- | --- |
| Not computed | Bot scores of 0. |
| Automated | Bot scores of 1. |
| Likely automated | Bot scores of 2 through 29. |
| Likely human | Bot scores of 30 through 99. |
| Verified bot | Non-malicious automated traffic (used to power search engines and other applications). |

Note

Bot scores are not computed for requests to paths that are handled by Cloudflare and will never be blocked or forwarded to the origin. Note that some features that are enabled before Bot Management, such as Redirect Rules, may result in requests not being scored.

## How Cloudflare generates bot scores

Note

The following detection engines only apply to Enterprise Bot Management. For specific details about the engines included in your plan, refer to Plans.

### Heuristics

The Heuristics engine processes all requests. Cloudflare conducts a number of heuristic checks to identify automated traffic, and requests are matched against a growing database of malicious fingerprints.

The Heuristics engine immediately gives automated requests a score of 1.

### Machine learning

The Machine Learning (ML) engine accounts for the majority of all detections, human and bot.

This approach leverages our global network, which proxies billions of requests daily, to identify both automated and human traffic. We constantly train the ML engine to become more accurate and adapt to new threats. Most importantly, this engine learns from traffic across all Cloudflare domains and uses these insights to score traffic while honoring our strict privacy standards ↗.

The ML engine produces scores 2 through 99.

### Anomaly detection

The Anomaly Detection (AD) engine is an optional detection engine that uses a form of unsupervised learning. Cloudflare records a baseline of your domain's traffic and uses the baseline to intelligently detect outlier requests. This approach is user agent-agnostic and can be turned on or off by your account team.

Cloudflare does not recommend AD for domains that use Cloudflare for SaaS or expect large amounts of API traffic. The AD engine immediately gives automated requests a score of one.

### JavaScript detections

The JavaScript Detections (JSD) engine identifies headless browsers and other malicious fingerprints. This engine performs a lightweight, invisible JavaScript injection on the client side of any request while honoring our strict privacy standards ↗. We do not collect any personally identifiable information during the process. The JSD engine either blocks, challenges, or passes requests to other engines.

JSD is enabled by default but completely optional. To adjust your settings, open the Bot Management Configuration page from Security > Bots.

### Cloudflare service

Cloudflare Service is a special bot score source for Enterprise Zero Trust to avoid false positives.

### Not computed

A bot score of 0 means Bot Management did not run on the request. Cloudflare does not run Bot Management on internal service requests that Bot Management has no interest in blocking.

### Notes on detection

Cloudflare uses the __cf_bm cookie to smooth out the bot score and reduce false positives for actual user sessions.

The Bot Management cookie measures a single user's request pattern and applies it to the machine learning data to generate a reliable bot score for all of that user's requests.

For more details, refer to Cloudflare Cookies.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot tags

**來源**: [https://developers.cloudflare.com/bots/concepts/bot-tags/](https://developers.cloudflare.com/bots/concepts/bot-tags/)

Page options # Bot tags

Bot tags provide more detail about why Cloudflare assigned a bot score to a request.

Use these tags to learn more about your bot traffic and better inform security settings.

Note

Bot tags are only available to Enterprise customers who have purchased Bot Management.

## Potential values

Once you enable bot tags, you can see more information about bot requests, such as whether a request came from a verified bot (like Bing) or a category of verified bot (like SearchEngine).

The following values are examples of what may be present in the BotTags log field, but not an exhaustive list:

- api
- google
- bing
- googleAds
- googleMedia
- googleImageProxy
- pinterest
- newRelic
- baidu
- apple
- yandex

## Enable bot tags

To enable bot tags, include the BotTags log field when using our Logpush service.

## Limitations

Currently, bot tags are only available in log fields.

Future work will add more values and extend bot tags to other Cloudflare products.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Feedback Loop

**來源**: [https://developers.cloudflare.com/bots/concepts/feedback-loop/](https://developers.cloudflare.com/bots/concepts/feedback-loop/)

Page options # Bot Feedback Loop

The Bot Feedback Loop is a way for customers to send Cloudflare direct feedback in the case of Bot Management potentially scoring a request incorrectly. When a customer submits a False Negative or a False Positive report, Cloudflare manually analyzes this data and uses it as a training dataset for our next Machine Learning model.

## Availability

Bot Feedback Loop is available for Enterprise Bot Management customers. Visit Plans for more information.

## False Positive

A false positive can happen if Cloudflare scores a request from a person using a browser, mobile application or desktop application in the automated or likely automated range.

## False Negative

If Cloudflare is unable to detect a portion of automated traffic on your site, submitting a False Negative report will help us catch it in the future.

### Subtypes

| Subtype | Definition |
| --- | --- |
| Account Creation Abuse | The automated creation of many new accounts in order to gain access to site resources. |
| Ad Fraud | Fraudulent increase in the number of times an advertisement is clicked on or displayed. |
| Credit Card Abuse | Attempts to repeatedly validate many credit card numbers or the same credit card number with different validation details. |
| Cashing Out | Abusing the target Internet application to obtain valuable goods. |
| Login Abuse | Attempts to gain access to a password protected portion of an Internet application using many different combinations of usernames and passwords. |
| Inventory Abuse | Automated abuse related to purchasing limited stock inventory or holding inventory to prevent others from making transactions. |
| Denial of Service | Automated requests with the intent of exhausting server resources to prevent the Internet application from functioning. |
| Expediting | Automating the use of an Internet application to make transactions faster than a human visitor to gain unfair advantage. |
| Fuzzing | Finding implementation bugs through the use of malformed data injection in an automated fashion. |
| Scraping | Automated retrieval of valuable or proprietary information from an Internet application. |
| Spamming | The abuse of content forms to send spam. |
| Token Cracking | Identification of valid token codes providing some form of user benefit within the application. |
| Vulnerability Scanning | Systematic enumeration and examination of identifiable, guessable and unknown content locations, paths, file names, parameters, to find weaknesses and points where a security vulnerability might exist. |

## Submit a report

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Apply one or more bot score filters.
4. Select Report incorrect data and fill out the form.
5. Select Submit.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Analytics.
3. Apply one or more filters.
4. Under Request activity, filter by Bot analysis.
5. Select Report incorrect data and fill out the form.
6. Select Submit.

## Via the API

### Create a feedback report

Terminal window ```
curl 'https://api.cloudflare.com/client/v4/zones/{zone_id}/bot_management/feedback' \--header "X-Auth-Email: <EMAIL>" \--header "X-Auth-Key: <API_KEY>" \--header "Content-Type: application/json" \--data '{  "type": "false_positive",  "description": "Legitimate customers having low score",  "expression": "(cf.bot_management.score le 46 and ip.geoip.asnum eq 132892 and http.host eq \"api-discovery.theburritobot.com\" and cf.bot_management.ja3_hash eq \"3fed133de60c35724739b913924b6c24\")",  "first_request_seen_at": "2022-08-01T00:00:00Z",  "last_request_seen_at": "2022-08-10T00:00:00Z",  "requests": 100,  "requests_by_score": {    "1": 50,    "10": 50  },  "requests_by_score_src": {    "heuristics": 25,    "machine_learning": 75  },  "requests_by_attribute": {    "topIPs": [      {        "metric": "10.75.34.1",        "requests": 100      }    ],    "topUserAgents": [      {        "metric": "curl/7.68.0",        "requests": 100      }    ]  }}'
```

### List feedback reports

Terminal window ```
curl 'https://api.cloudflare.com/client/v4/zones/{zone_id}/bot_management/feedback' \--header "X-Auth-Email: <EMAIL>" \--header "X-Auth-Key: <API_KEY>"
```

```
[  {    "created_at": "2022-08-19T00:05:24.749712Z",    "type": "false_positive",    "description": "Legitimate customers having low score",    "expression": "(cf.bot_management.score le 46 and ip.geoip.asnum eq 132892 and http.host eq \"api-discovery.theburritobot.com\" and cf.bot_management.ja3_hash eq \"3fed133de60c35724739b913924b6c24\")",    "first_request_seen_at": "2022-08-01T00:00:00Z",    "last_request_seen_at": "2022-08-10T00:00:00Z",    "requests": 100,    "requests_by_score": {      "1": 50,      "10": 50    },    "requests_by_score_src": {      "heuristics": 25,      "machine_learning": 75    },    "requests_by_attribute": {      "topIPs": [        {          "metric": "10.75.34.1",          "requests": 100        }      ],      "topUserAgents": [        {          "metric": "curl/7.68.0",          "requests": 100        }      ]    }  }]
```

## API Fields

| Field | Type | Description | Value Example |
| --- | --- | --- | --- |
| type | string | The feedback report type. | false_positive |
| description | string | The feedback report description with  more details on the issue. | Legitimate customers having low scores. |
| expression | string | The wirefilter expression matching reported requests. | (cf.bot_management.score le 46 and ip.geoip.asnum eq 132892 and http.host eq "app.example.com" and cf.bot_management.ja3_hash eq "3fed133de60c35724739b913924b6c24") |
| first_request_seen_at | string | The time range start when the first request has been seen, RFC 3339 format. | 2022-08-01T00:00:00Z |
| last_request_seen_at | string | The time range end when the last request has been seen, RFC 3339 format. | 2022-08-10T00:00:00Z |
| requests | integer | The total number of reported requests. | 100 |
| requests_by_score | object | The requests breakdown by score. | See example below. |
| requests_by_score_src | object | Requests breakdown by score source. | See example below. |
| requests_by_attribute | object | Requests breakdown by attribute (optional). | See example below. |

requests_by_score

```
{  "1": 50,  "10": 50}
```

requests_by_score_src

```
{  "machine_learning": 75,  "heuristics": 25}
```

requests_by_attribute

```
{    "topIPs": [      {        "metric": "10.75.34.1"        "requests": 100      }    ],    "topUserAgents": [      {        "metric": "curl/7.68.0",        "requests": 100      }    ]  }
```

### Expression fields

| Field | Type | Description |
| --- | --- | --- |
| cf.bot_management.ja3_hash | string | This provides an SSL/TLS fingerprint to help you identify potential bot requests. |
| cf.bot_management.score | integer | This represents the likelihood that a request originates from a bot using a score from 1-99. |
| http.host | string | This represents the hostname used in the full request URI. |
| http.request.uri.path | string | This represents the URI path of the request. |
| http.user_agent | string | This represents the HTTP user agent which is a request header that contains a characteristic string to allow identification of the client operating system and web browser. |
| ip.geoip.asnum | integer | This represents the 16- or 32-bit integer representing the Autonomous System (AS) number associated with client IP address. |
| ip.geoip.country | string | This represents the 2-letter country code in ISO 3166-1 Alpha 2 format. |
| ip.src | string | The source address of the IP. |

## Recommendations when submitting a report

When you submit a report, use the filters available in the Bot Analytics dashboard to ensure that your report includes only the traffic that received an incorrect score. In addition to filtering by a score (required), you may want to filter by user-agent, IP, ASN or JA3 to more precisely highlight the section of traffic that was scored incorrectly.

If you are not certain if some traffic received an incorrect score, keep this traffic in the report.

We appreciate any comments you wish to leave in the description field that might help our team better understand these requests in the context of typical traffic to your domain.

## Recommendations after submitting a false positive

Note

The instructions below apply to Enterprise subscription with Bot Management only.

After submitting a false positive, you can explicitly allow the traffic if you are confident that this traffic source cannot be used for abuse in the future. To allow traffic, you can create a WAF custom rule with a Skip the remaining custom rules action that matches the characteristics of your false positive report. We recommend any skip rule that you create uses the most narrow possible scope, including restricting the request methods and URIs that the expected traffic has access to, to limit potential abuse.

- Allowing a JA3/JA4 fingerprint:  If you want to allow access to a stable software client that does not come from a dedicated IP, you can do so by looking up the JA3 fingerprint(s) used by that client in the Bot Analytics dashboard, and creating a WAF custom rule to allow traffic based on that JA3 fingerprint. JA3 fingerprints will only match a client’s TLS library, so be cautious in looking for both overlap with other clients and with variation based on the operating system. Cloudflare does not recommend relying on JA3 rules for mobile applications that may be abused. If you have questions about how to securely allow traffic from your mobile application, please contact your account team.

Note

The instructions below apply to Enterprise subscription with Bot Management, Bot Fight Mode and Super Bot Fight Mode.

- Allowing an IP address: Only use an IP address to allow traffic if the IP is a dedicated resource that belongs only to the traffic source you wish to allow. If the traffic you want to allow shares an IP with other traffic sources, or if the IP changes frequently, consider an alternative to allowing by IP address.

## Recommendations after submitting a false negative

After submitting a false negative report, you can explicitly block or rate-limit the incorrectly scored traffic using a combination of characteristics such as IP address, JA3 fingerprint, ASN, and user-agent. Before blocking or rate-limiting based on JA3 fingerprint, please use Bot Analytics to confirm that fingerprint is not being used by legitimate traffic sources.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot detection engines

**來源**: [https://developers.cloudflare.com/bots/concepts/bot-detection-engines/](https://developers.cloudflare.com/bots/concepts/bot-detection-engines/)

Page options # Bot detection engines

## Heuristics

The Heuristics engine processes all requests. Cloudflare conducts a number of heuristic checks to identify automated traffic, and requests are matched against a growing database of malicious fingerprints.

## JavaScript detections

The JavaScript Detections (JSD) engine identifies headless browsers and other malicious fingerprints. This engine performs a lightweight, invisible JavaScript injection on the client side of any request while honoring our strict privacy standards ↗. We do not collect any personally identifiable information during the process. The JSD engine either blocks, challenges, or passes requests to other engines.

JSD is completely optional. To adjust your settings, configure Super Bot Fight Mode from Security > Bots.

## Machine Learning (Business and Enterprise)

The Machine Learning (ML) engine accounts for the majority of all detections, human and bot.

This approach leverages our global network, which proxies billions of requests daily, to identify both automated and human traffic. We constantly train the ML engine to become more accurate and adapt to new threats. Most importantly, this engine learns from traffic across all Cloudflare domains and uses these insights to score traffic while honoring our strict privacy standards ↗.

The ML engine identifies likely automated traffic.

## Anomaly detection (Enterprise)

The Anomaly Detection (AD) engine is an optional detection engine that uses a form of unsupervised learning. Cloudflare records a baseline of your domain's traffic and uses the baseline to intelligently detect outlier requests. This approach is user agent-agnostic and can be turned on or off by your account team.

Cloudflare does not recommend AD for domains that use Cloudflare for SaaS or expect large amounts of API traffic. The AD engine immediately gives automated requests a score of one.

## Notes on detection

Cloudflare uses the __cf_bm cookie to smooth out the bot score and reduce false positives for actual user sessions.

The Bot Management cookie measures a single user's request pattern and applies it to the machine learning data to generate a reliable bot score for all of that user's requests.

For more details, refer to Cloudflare Cookies.

You can disable the __cf_bm cookie using the bm_cookie_enabled field via the API.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## JA3/JA4 fingerprint

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/ja3-ja4-fingerprint/](https://developers.cloudflare.com/bots/additional-configurations/ja3-ja4-fingerprint/)

Page options # JA3/JA4 fingerprint

JA3 ↗ and JA4 ↗ fingerprints help you profile specific SSL/TLS clients across different destination IPs, Ports, and X509 certificates.

JA4 fingerprint adds new functionality by sorting ClientHello extensions and reducing the total number of unique fingerprints for modern browsers.

Note

JA3 and JA4 fingerprints are only available to Enterprise customers who have purchased Bot Management.

If you want to use JA4 fingerprints and Signals Intelligence, your Workers script must be able to handle the absence of any field in the array, including:

- The possibility that the JA4 fingerprint could be missing.
- The possibility that the ja4Signals array could be missing.
- Results with NaN or Infinity values will be excluded from the array.

```
{  "ja4Signals": {    "h2h3_ratio_1h": 0.98826485872269,    "heuristic_ratio_1h": 7.288895722013e-05,    "reqs_quantile_1h": 0.99905741214752,    "uas_rank_1h": 901,    "browser_ratio_1h": 0.93640440702438,    "paths_rank_1h": 655,    "reqs_rank_1h": 850,    "cache_ratio_1h": 0.18918327987194,    "ips_rank_1h": 662,    "ips_quantile_1h": 0.99926590919495  },  "jaSignalsParsed": {    "ratios": {      "h2h3_ratio_1h": 0.98826485872269,      "heuristic_ratio_1h": 7.288895722013e-05,      "browser_ratio_1h": 0.93640440702438,      "cache_ratio_1h": 0.18918327987194    },    "ranks": {      "uas_rank_1h": 901,      "paths_rank_1h": 655,      "reqs_rank_1h": 850,      "ips_rank_1h": 662    },    "quantiles": {      "reqs_quantile_1h": 0.99905741214752,      "ips_quantile_1h": 0.99926590919495    }  }}
```

When JA4 Signals are missing, the output appears as follows:

```
{  "ja4Signals": {},  "jaSignalsParsed": {    "ratios": {},    "ranks": {},    "quantiles": {}  }}
```

Note

This sample was generated using Workers' Cloudflare Object script.

The JA3/JA4 fingerprint can be null or empty in some cases. The most common case is for HTTP requests because JA3 and JA4 are calculated in TLS. It can also be empty due to the Worker sending requests within the same zone or to a zone that is not proxied (or a third party).

Orange to Orange (O2O) should not cause null or empty JA3 or JA4 fingerprints, unless the eyeball zone is routing traffic to the target zone using a Worker.

## Analytics

To get more information about potential bot requests, use these JA3 and JA4 fingerprints in:

- Bot Analytics
- Security Events and Security Analytics
- Analytics GraphQL API, specifically the HTTP Requests dataset
- Logs

## Actions

To adjust how your application responds to specific fingerprints, use them with:

- WAF custom rules
- Transform Rules
- Cloudflare Workers

## Use cases

### Block or allow certain traffic

A group of similar requests may share the same JA3 fingerprint. For this reason, JA3 may be useful in blocking an incoming threat. For example, if you notice that a bot attack is not caught by existing defenses, create a custom rule that blocks or challenges the JA3 used for the attack.

Alternatively, if existing defenses are blocking traffic that is actually legitimate, create a custom rule with the Skip action allowing the JA3 seen across good requests.

JA3 may also be useful if you want to immediately remedy false positives or false negatives with Bot Management.

### Allow mobile traffic

Often, mobile application traffic will produce the same JA3 fingerprint across devices and users. This means you can identify your mobile application traffic by its JA3 fingerprint.

Use the JA3 fingerprint to allow traffic from your mobile application, but block or challenge remaining traffic.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Signals Intelligence

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/ja3-ja4-fingerprint/signals-intelligence/](https://developers.cloudflare.com/bots/additional-configurations/ja3-ja4-fingerprint/signals-intelligence/)

Page options # Signals Intelligence

For every available JA4 fingerprint, Bot Management customers can view how Cloudflare sees it on the Internet and what behavior we view with the fingerprint. This data can help you understand why a request is scored in a particular fashion or allow you to use the aggregate data in your own ML models, run in either Cloudflare Workers or at the origin location.

Specifically, for each JA4 fingerprint, you will be able to access the following information:

- The percentage of traffic associated with browsers that Cloudflare sees.
- The percentage of traffic associated with known bots that Cloudflare sees.
- The number of networks Cloudflare sees actively using this fingerprint.
- The number of Cloudflare sites that see traffic from this fingerprint.
- The frequency that fingerprint requests caches content and generates errors.

This data gives you access to insights only available via the Cloudflare network and generated by our unique edge network that sits behind 20% of all internet traffic. Additionally, you can feed this data into your own Workers AI-powered custom machine learning models via the Signals Intelligence fields below.

## Signals Intelligence fields

Signals Intelligence fields show observations about a particular JA4 that Cloudflare has seen globally over the last hour.

| Field name | Description |
| --- | --- |
| h2h3_ratio_1h | The ratio of HTTP/2 and HTTP/3 requests combined with the total number of requests for the JA4 fingerprint in the last hour. Higher values indicate a higher proportion of HTTP/2 and HTTP/3 requests compared to other protocol versions. |
| heuristic_ratio_1h | The ratio of requests with a scoreSrc value of "heuristics" for the JA4 fingerprint in the last hour. Higher values suggest a larger proportion of requests being flagged by heuristic-based scoring. |
| reqs_quantile_1h | The quantile position of the JA4 fingerprint based on the number of requests across all fingerprints in the last hour. Higher values indicate a relatively higher number of requests compared to other fingerprints. |
| uas_rank_1h | The rank of the JA4 fingerprint based on the number of distinct user agents across all fingerprints in the last hour. Lower values indicate a higher diversity of user agents associated with the fingerprint. |
| browser_ratio_1h | The ratio of requests originating from browser-based user agents for the JA4 fingerprint in the last hour. Higher values suggest a higher proportion of browser-based requests. |
| paths_rank_1h | The rank of the JA4 fingerprint based on the number of unique request paths across all fingerprints in the last hour. Lower values indicate a higher diversity of request paths associated with the fingerprint. |
| reqs_rank_1h | The rank of the JA4 fingerprint based on the number of requests across all fingerprints in the last hour. Lower values indicate a higher number of requests associated with the fingerprint. |
| cache_ratio_1h | The ratio of cacheable responses for the JA4 fingerprint in the last hour. Higher values suggest a higher proportion of responses that can be cached. |
| ips_rank_1h | The rank of the JA4 fingerprint based on the number of unique client IP addresses across all fingerprints in the last hour. Lower values indicate a higher number of distinct client IPs associated with the fingerprint. |
| ips_quantile_1h | The quantile position of the JA4 fingerprint based on the number of unique client IP addresses across all fingerprints in the last hour. Higher values indicate a relatively higher number of distinct client IPs compared to other fingerprints. |

If you want to use JA4 fingerprints and Signals Intelligence, your Workers script must be able to handle the absence of any field in the array, including:

- The possibility that the JA4 fingerprint could be missing.
- The possibility that the ja4Signals array could be missing.
- Results with NaN or Infinity values will be excluded from the array.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Detection IDs

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/detection-ids/](https://developers.cloudflare.com/bots/additional-configurations/detection-ids/)

Page options # Detection IDs

Detection IDs are static rules used to detect predictable bot behavior with no overlap with human traffic. Detection IDs refer to the precise detection used to identify a bot, which could be from heuristics, verified bot detections, or anomaly detections. For example, a detection ID can identify if you sent your headers in a different order than what was expected of your browser.

If you are having an issue with one of our heuristics, detection IDs allow you to decide which heuristics to enforce on your zones using customer configurable heuristics. You can choose unique actions for different bots, detected through Cloudflare’s heuristics engine. You can block, allow, or serve alternate content to specific bots to meet the unique needs of your site’s traffic.

Note

A request can trigger multiple detection IDs.

You can use cf.bot_management.detection_ids fields in tools such as:

- Custom rules
- Advanced Rate Limiting
- Transform Rules
- Workers (as request.cf.botManagement.detectionIds)

Bot Detection IDs and tags are also available in Bot Analytics and Security Analytics.

## Detection tags

Detection tags refer to the category associated with the detection ID at the time that Cloudflare has fingerprinted a bot. For example, if a detection tag is go, this means that Cloudflare has observed traffic from that detection ID from a Go programming language bot.

Note

Detection tags are available in Security Analytics, but not in the Security Events.

## Bot Detection IDs via Logpush

You can create or edit existing Logpush jobs to include the new Bot Detection IDs field which will provide an array of IDs for each request that has heuristics match on it. The BotDetectionIDs field is available as part of the HTTP Requests dataset and you can add it to new or existing jobs via the Logpush API or on the Cloudflare dashboard. This is the primary method to discover Detection IDs.

### Via the Cloudflare dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Analytics & Logs > Logs.
3. Select Add Logpush Job.
4. Select HTTP Requests as the dataset.
5. Select BotDetectionIDs under the General data field category.
6. Select and enter the destination information.
7. Prove the ownership.
8. Select Save.

### Via the API

Update your logpush job by adding BotDetectionIDs to the  output_options:  parameters.

## Create or edit an expression

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots, apply filters and select Create custom rule to create a custom rule based on those filters. Alternatively, if you already created a custom rule, go to Security > WAF > Custom rules and edit the expression of an existing custom rule.
3. Use the cf.bot_management.detection_ids field in the rule expression.
4. Select Save.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Analytics.
3. Apply filters and select Create custom security rule to create a custom rule based on your filters. Alternatively, if you have already created a custom rule, you can go to the existing rule in Security > Security rules and edit the expression based on your filters.
4. Use the cf.bot_management.detection_ids field in the rule expression.
5. Select Deploy.

## Use cases

### Block requests that match a specific detection ID

```
any(cf.bot_management.detection_ids[*] eq 3355446)and not cf.bot_management.verified_botand http.request.uri.path eq "/login"and http.request.method eq "POST"
```

### Run Bot Management without specific detection IDs

```
cf.bot_management.score lt 30and not cf.bot_management.verified_botand http.request.uri.path eq "/login"and http.request.method eq "POST"and not any(cf.bot_management.detection_ids[*] in {3355446 12577893})
```

## Account takeover detections

Using the detection IDs below, you can detect and mitigate account takeover attacks. You can monitor the number of login requests for a given software and network combination, as well as the percentage of login errors. When it reaches a suspicious level, you can prevent these attacks by using custom rules, rate limiting rules, and Workers.

| Detection ID | Description |
| --- | --- |
| 201326592 | Observes all login failures to the zone. |
| 201326593 | Observes all login traffic to the zone. |
| 201326598 | Sets a dynamic threshold based on the normal traffic that is unique to the zone. When the ID matches a login failure, Bot Management sets the bot score to 29 and uses anomaly detection as its score source. |

### Challenges for account takeover detections

Cloudflare's Managed Challenge can limit brute-force attacks on your login endpoints.

To access account takeover detections:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF.
3. Under Custom Rules, select Create rule.
4. Fill out the form using Bot Detection IDs along with other necessary information.
5. Select Save as draft to return to it later, or Deploy to deploy the rule.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. Select Create rule and choose Custom rule.
4. Fill out the form using Bot Detection IDs along with other necessary information.
5. Select Save as draft to return to it later, or Deploy to deploy the rule.

Rule example ```
(any(cf.bot_management.detection_ids[*] eq 201326593))
```

### Limit logins with account takeover detections

Rate limiting rules can limit the number of logins from a particular IP, JA4 Fingerprint, or country.

To use rate limiting rules with account takeover detections:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > WAF.
3. Under Rate limiting rules, select Create rule.
4. Fill out the form using the Custom expression builder and cf.bot_management_detection_ids along with other necessary information.
5. Select Save as draft to return to it later, or Deploy to deploy the rule.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Security rules.
3. Select Create rule and choose Rate limiting rule.
4. Fill out the form using the Custom expression builder and cf.bot_management_detection_ids along with other necessary information.
5. Select Save as draft to return to it later, or Deploy to deploy the rule.

Note

The rule can be enhanced with Leaked Credential Checks. Refer to the WAF documentation for more information on how to include leaked credentials and account takeover detections in a rate limiting rule.

## Additional detections

| Detection ID | Description |
| --- | --- |
| 50331651 | Observes traffic from residential proxy networks and similar commercial proxies. When the ID matches a request, Bot Management sets the bot score to 29 and uses anomaly detection as its score source. |

## Availability

Detection IDs are available for Enterprise Bot Management customers.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Sequence rules

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/sequence-rules/](https://developers.cloudflare.com/bots/additional-configurations/sequence-rules/)

Page options # Sequence rules

Sequence rules uses cookies to track the order of requests a user has made and the time between requests and makes them available via Cloudflare Rules. This allows you to write rules that match valid or invalid sequences. The specific cookies used to validate sequences are called sequence cookies.

Sequence rules is currently in private beta. If you would like to be included in the beta, contact your account team.

## Prerequisites

- Your account must have the Fraud Detection subscription.
- Each zone must configure the endpoints to track via Endpoint Management.

You can create a sequence custom rule via the Cloudflare dashboard or using the API.

## Availability

These sequence fields are available in:

- Custom rules (http_request_firewall_custom phase)
- Rate limiting rules (http_request_ratelimit)
- Bulk Redirects (http_request_redirect)
- Request Header Transform Rules (http_request_late_transform)

| Field name | Description | Example value |
| --- | --- | --- |
| cf.sequence.current_opString | This field contains the ID of the operation that matches the current request. If the current request does not match any operations defined in Endpoint Management, it will be an empty string. | c821cc00 |
| cf.sequence.previous_opsArray<String> | This field contains an array of the prior operation IDs in the sequence, ordered from most to least recent. It does not include the current request.  If an operation is repeated, it will appear multiple times in the sequence. | ["f54dac32", "c821cc00", "a37dc89b"] |
| cf.sequence.msec_since_opMap<Number> | This field contains a map where the keys are operation IDs and the values are the number of milliseconds since that operation has most recently occurred.  This does not include the current request or operation as it only factors in previous operations in the sequence. | {"f54dac32": 1000, "c821cc00": 2000} |

## Build a sequence custom rule via the Cloudflare dashboard

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

## Manage sequence rules via the API

### Enable sequence rules

1. Create an API token if you do not already have one. The API token must include the Zone > Fraud Detection > Edit permission.
2. Get the zone ID for the zone(s) where you want to enable sequence rules.
3. Add the endpoints that you want to track in your sequence rules using API Shield's Endpoint Management and make note of the short ID.
4. Enable the sequence cookie by adding your API token and zone ID to the following API call.

Note

The short ID will not be visible until your account team has enabled this feature for you.

API call ```
curl --request PUT \https://api.cloudflare.com/client/v4/zones/{zone_id}/fraud_detection/sequence_cookies \--header "Authorization: Bearer <API_TOKEN>" \--header "Content-Type: application/json" \--data '{"enabled": true}'
```

1. Use the expression editor to write sequence or timing based rules via custom rules, rate limiting rules, or transform rules. You can put these rules in log only mode to monitor.

Note

When you enable sequence rules, Cloudflare will start setting cookies for all requests that match your endpoints.

Once you have enabled sequence rules, the rules fields will be populated and you can now use the new fields in your rules.

### Disable sequence rules

Disabling sequence rules will stop the rules fields from being populated. If you still have rules deployed which depend on these fields, those rules may not behave as intended. Remove or disable any rules that rely on sequence fields before disabling sequence rules.

To disable sequence rules:

1. Create an API token if you do not already have one. The API token must include the Zone > Fraud Detection > Edit permission.
2. Get the zone ID for the zone(s) where you want to enable sequence rules.
3. Add the endpoints that you want to track in your sequence rules using API Shield's Endpoint Management and make note of the short ID.
4. Disable the sequence cookie using your API token, zone ID, and by setting enabled to false on the following API call.

Note

The short ID will not be visible until your account team has enabled this feature for you.

API call ```
curl --request PUT https://api.cloudflare.com/client/v4/zones/{zone_id}/fraud_detection/sequence_cookies \--header "Authorization: Bearer <API_TOKEN>" \--data '{"enabled": false}'
```

## Rules fields

Sequence rules introduces three new fields to Cloudflare Rules. All of these fields reference operations by their short ID. Accounts that have the Fraud Detection subscription can refer to the short ID by viewing the endpoint details via API Shield > Endpoint Management in the Cloudflare dashboard. Accounts without Fraud Detection do not have access to this field.

Cloudflare only stores up to the 10 most recent operations in a sequence for up to one hour. If there are more than 10 operations in the sequence, older operations will be dropped and will not be included in the following fields. Similarly, if an operation happened more than one hour ago, it will also not be included in the following fields.

### Example rules

The customer must request endpoint A before endpoint B.

Valid sequence ```
cf.sequence.current_op eq "bbbbbbbb" andany(cf.sequence.previous_ops[*] == "aaaaaaaa")
```

Invalid sequence ```
cf.sequence.current_op eq "bbbbbbbb" andnot any(cf.sequence.previous_ops[*] == "aaaaaaaa")
```

Customer must request endpoint A at least one second before endpoint B.

Valid sequence ```
cf.sequence.current_op eq "bbbbbbbb" andcf.sequence.msec_since_op["aaaaaaaa"] ge 1000
```

Invalid sequence ```
cf.sequence.current_op eq "bbbbbbbb" andnot cf.sequence.msec_since_op["aaaaaaaa"] ge 1000
```

## Limitations

Cloudflare only supports HTTPS requests since our cookies set the Secure attribute.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## AI Labyrinth

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth/](https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth/)

Page options # AI Labyrinth

The AI Labyrinth adds invisible links on your webpage with specific Nofollow tags to block AI crawlers that do not adhere to the recommended guidelines and crawl without permission. AI crawlers that scrape your website content without permission will be stuck in a maze of never-ending links, and their details are recorded and used by all Cloudflare customers who choose to block AI bots.

These links do not impact your search engine optimization (SEO) or your website's appearance, and are only seen by bots. AI bots that respect no-crawl instructions will safely ignore this honeypot.

To enable AI Labyrinth:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Fight Mode.
4. Enable AI Labyrinth.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to AI Labyrinth.
5. Turn AI Labyrinth on.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Block AI Bots

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)

Page options # Block AI Bots

Block AI bots availability

The Block AI bots feature is only available in the new application security dashboard.

You can choose to block AI bots by activating Block AI bots. Activating this setting will block verified bots that are classified as AI crawlers, as well as a number of unverified bots that behave similarly.

To block AI bots:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Block AI bots.
5. Under Configurations, select the edit icon. Choose from:

Only block on hostnames with ads: Use this option if you wish to block AI bots only on portions of your site that show ads. Cloudflare automatically detects whether ads are present on a subdomain, and only block on hostnames that contain those ad units.
Block on all pages: Use this option if you wish to block AI bots on all your pages.
Do not block (off): Use this option if you wish to allow AI bots on all your pages.
6. Only block on hostnames with ads: Use this option if you wish to block AI bots only on portions of your site that show ads. Cloudflare automatically detects whether ads are present on a subdomain, and only block on hostnames that contain those ad units.
7. Block on all pages: Use this option if you wish to block AI bots on all your pages.
8. Do not block (off): Use this option if you wish to allow AI bots on all your pages.
9. Select Save to save your configuration.

To block individual AI crawlers (rather than blocking all crawlers), use AI Crawl Control.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Direct AI crawlers with managed robots.txt

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)

Page options # Direct AI crawlers with managed robots.txt

Protect your website or application from AI crawlers by implementing a robots.txt file on your domain to direct AI bot operators on what content they can and cannot scrape for AI model training.

AI bots are expected to follow the robots.txt directives.

Note

Respecting robots.txt is voluntary. If you want to prevent crawling, use AI Crawl Control's manage AI crawlers feature.

## Compatibility with existing robots.txt files

Cloudflare will independently check whether your website has an existing robots.txt file and update the behavior of this feature based on your website.

### Existing robots.txt file

If your website already has a robots.txt file — verified by a HTTP 200 response — Cloudflare will prepend our managed robots.txt before your existing robots.txt, combining both into a single response.

For example, without this feature enabled, the robots.txt content of crawlstop.com would be:

```
User-agent: *Disallow: /lpDisallow: /feedbackDisallow: /langtest
Sitemap: https://www.crawlstop.com/sitemap.xml
```

With the managed robots.txt enabled, Cloudflare will prepend our managed content before your original content, resulting in what you can view at https://www.crawlstop.com/robots.txt ↗.

Robots.txt example

### No robots.txt file

If your website does not have a robots.txt file, Cloudflare creates a new file with our managed block directives and serves it for you.

## Implementation

To implement a robots.txt file on your domain:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Fight Mode.
4. Turn Manage bot traffic with robots.txt on.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Manage AI bot traffic with robots.txt.
5. Turn Manage AI bot traffic with robots.txt on.

## Availability

Managed robots.txt for AI crawlers is available on all plans.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Static resource protection

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/static-resources/](https://developers.cloudflare.com/bots/additional-configurations/static-resources/)

Page options # Static resource protection

Pro, Business, and Enterprise customers can use Cloudflare's bot solutions to protect their static resources from bots.

Warning

If you enable static resource protection, you may block good bots — like mail clients — that routinely fetch static resources. Make sure you understand your existing infrastructure before enabling this feature.

## Super Bot Fight Mode

To enable this feature as a Pro or Business customer or an Enterprise customer without Bot Management:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Super Bot Fight Mode.
4. For Static resource protection, select On.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Super Bot Fight Mode.
5. Under Configurations, select the edit icon for Static resource protection and turn it on.

Warning

The Static Resource Protection setting will only activate if at least one of the bot categories (definite, likely, or verified) is not set to Allow. If all categories are set to Allow, this setting will not have any impact since it works alongside these bot settings as part of the managed rules.

## Bot Management for Enterprise

Static resources are protected by default when you create custom rules using cf.bot_management.score.

To exclude static resources, you would need to include not (cf.bot_management.static_resource) as part of your custom rule.

## Which files are protected?

Static resources are files with the following extensions:

ico|jpg|png|jpeg|gif|css|js|tif|tiff|bmp|pict|webp|svg|svgz|class|jar|txt|csv|doc|docx|xls|xlsx|pdf|ps|pls|ppt|pptx|ttf|otf|woff|woff2|eot|eps|ejs|swf|torrent|midi|mid|m3u8|m4a|mp3|ogg|ts

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Analytics

**來源**: [https://developers.cloudflare.com/bots/bot-analytics/](https://developers.cloudflare.com/bots/bot-analytics/)

Page options # Bot Analytics

## Business and Enterprise

Business and Enterprise customers without Bot Management can use Bot Analytics to dynamically examine bot traffic. These dashboards offer less functionality than Bot Management for Enterprise but still help you understand bot traffic on your domain.

### Access

You can access Bot Analytics by going to the Cloudflare dashboard ↗, and selecting your account and domain.

Old dashboard: Security > Bots.

New dashboard: Security > Analytics > Bot analysis.

### Features

For a full tour of Bot Analytics, see our blog post ↗. At a high level, the tool includes:

- Requests by traffic type: View your total domain traffic segmented vertically by traffic type. Keep an eye on automated and likely automated traffic.
- Requests by detection source: Identify the most common detection engines used to score your traffic. Hover over a tooltip to learn more about each engine.
- Top requests by attribute: View more detailed information on specific IP addresses and other characteristics.

Bot Analytics shows up to 72 hours of data at a time and can display data up to 30 days old. Bot Analytics displays data in real time in most cases.

Cloudflare uses adaptive bitrate technology to show sampled data — most customers will see a 1-10% sample depending on how much information they are trying to view. Tooltips on the page will display the current sample rate.

### Common uses

Business and Enterprise customers without Bot Management can use Bot Analytics to:

- Understand bot traffic
- Study recent attacks to find trends and detailed information
- Learn more about Cloudflare’s detection engines with real data

For more details and granular control over bot traffic, consider upgrading to Bot Management for Enterprise.

## Enterprise Bot Management

Enterprise customers with Bot Management can use Bot Analytics to dynamically examine bot traffic.

### Access

You can access Bot Analytics by going to the Cloudflare dashboard ↗, and selecting your account and domain.

Old dashboard: Security > Bots.

New dashboard: Security > Analytics > Bot analysis.

### Features

For a full tour of Bot Analytics, see our blog post ↗. At a high level, the tool includes:

- Requests by bot score: View your total domain traffic and segment it vertically by traffic type. Keep an eye on automated and likely automated traffic.
- Bot score distribution: View the number of requests assigned a bot score 1 through 99.
- Bot score source: Identify the most common detection engines used to score your traffic. Hover over a tooltip to learn more about each engine.
- Top requests by attribute: View more detailed information on specific IP addresses and other characteristics.

Bot Analytics shows up to one week of data at a time and can display data up to 30 days old. Bot Analytics displays data in real time in most cases.

Cloudflare uses adaptive bitrate technology to show sampled data — most customers will see a 1-10% sample depending on how much information they are trying to view. Tooltips on the page will display the current sample rate.

### Common uses

Bot Management customers can use Bot Analytics to:

- Understand traffic during your onboarding phase.
- Tune WAF custom rules to be effective but not overly aggressive.
- Study recent attacks to find trends and detailed information.
- Learn more about Cloudflare’s detection engines with real data.

### API

Data from Bot Analytics is also available via the GraphQL API. You can access bot scores, bot sources, bot tags, and bot decisions (automated, likely automated, etc.), and more.

Read the GraphQL Analytics API documentation for more information about GraphQL and basic querying.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Delay action

**來源**: [https://developers.cloudflare.com/bots/workers-templates/delay-action/](https://developers.cloudflare.com/bots/workers-templates/delay-action/)

Page options # Delay action

Customers with a Bot Management and a Workers subscription can use the template below to introduce a delay to requests that are likely from bots.

The template sets a minimum and maximum delay, and delays requests where the bot score is less than 30 and the URI path starts with /exampleURI.

- JavaScript
- TypeScript

```
// Configurable Variablesconst PATH_START = "/exampleURI";const DELAY_FROM = 5; // in secondsconst DELAY_TO = 10; // in seconds
export default {  async fetch(request, env, ctx) {    const url = new URL(request.url);    const botScore = request.cf.botManagement.score;
    if (url.pathname.startsWith(PATH_START) && botScore < 30) {      // Random delay between DELAY_FROM and DELAY_TO seconds      const delay =        Math.floor(Math.random() * (DELAY_TO - DELAY_FROM + 1)) + DELAY_FROM;      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      // Fetch the original request      return fetch(request);    }
    // Fetch the original request without delay    return fetch(request);  },};
```

```
// Configurable Variablesconst PATH_START = '/exampleURI';const DELAY_FROM = 5; // in secondsconst DELAY_TO = 10; // in seconds
export default {  async fetch(request, env, ctx): Promise<Response> {    const url = new URL(request.url);    const botScore = request.cf.botManagement.score
    if (url.pathname.startsWith(PATH_START) && botScore < 30) {      // Random delay between DELAY_FROM and DELAY_TO seconds      const delay = Math.floor(Math.random() * (DELAY_TO - DELAY_FROM + 1)) + DELAY_FROM;      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      // Fetch the original request      return fetch(request);    }
    // Fetch the original request without delay    return fetch(request);  },} satisfies ExportedHandler<Env>;
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

## Bot Management skips

**來源**: [https://developers.cloudflare.com/bots/troubleshooting/bot-management-skips/](https://developers.cloudflare.com/bots/troubleshooting/bot-management-skips/)

Page options # Bot Management skips

There are instances in which Bot Management does not run and certain fields, such as the JA3/JA4 field, are not populated because it has been determined that running Bot Management would not be necessary.

Refer to bot scores for more information about why a request is not scored.

## Common reasons for Bot Management to not score a request

### Requests to internal endpoints

Requests such as /cdn-cgi/ are handled individually and will never receive a Bot Management score. Email Obfuscation, Web Analytics, Trace Requests, Challenge Pages, and JavaScript Detections do not receive bot scores. Refer to the table below for some examples of internal endpoints.

| Route |
| --- |
| /cdn-cgi/rum |
| /cdn-cgi/script_monitor/report |
| /cdn-cgi/trace |
| /cdn-cgi/challenge-platform/… |
| /cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js |

### Purge requests

All HTTP purge requests will not receive a bot score.

### Early hints cache requests

Early hints cache requests will not receive a bot score.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Super Bot Fight Mode for WordPress

**來源**: [https://developers.cloudflare.com/bots/troubleshooting/wordpress-loopback-issue/](https://developers.cloudflare.com/bots/troubleshooting/wordpress-loopback-issue/)

Page options # Super Bot Fight Mode for WordPress

When users attempt to run diagnostics in the Site Status page for WordPress installations, loopback issues arise when our bot detection services block them.

WordPress relies on making loopback requests to monitor and occasionally administer its websites. Customers can opt-in to optimize Super Bot Fight Mode for WordPress. If this feature is enabled, automated loopback requests made by your WordPress site will be authorized even when Super Bot Fight Mode blocks other bots.

Note

Loopback requests may also be blocked by I’m Under Attack mode or certain WAF custom rules.

## Enable Optimize for WordPress

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Management.
4. Enable Optimize for WordPress.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Super Bot Fight Mode.
5. Under Configurations, select the edit icon for Optimize for WordPress and turn it on.

## Availability

This feature is available for all Super Bot Fight Mode customers.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Web Bot Auth

**來源**: [https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/)

Page options # Web Bot Auth

Web Bot Auth is an authentication method that leverages cryptographic signatures in HTTP messages to verify that a request comes from an automated bot. Web Bot Auth is used as a verification method for verified bots and signed agents.

It relies on two active IETF drafts: a directory draft ↗ allowing the crawler to share their public keys, and a protocol draft ↗ defining how these keys should be used to attach crawler's identity to HTTP requests.

This documentation goes over specific integration within Cloudflare.

## 1. Generate a valid signing key

You need to generate a signing key which will be used to authenticate your bot's requests.

1. Generate a unique Ed25519 ↗ private key to sign your requests. This example uses the OpenSSL ↗ genpkey command:
Terminal windowopenssl genpkey -algorithm ed25519 -out private-key.pem
2. Extract your public key.
Terminal windowopenssl pkey -in private-key.pem -pubout -out public-key.pem
3. Convert the public key to JSON Web Key (JWK) using a tool of your choice. This example uses jwker ↗ command line application.
Terminal windowgo install github.com/jphastings/jwker/cmd/jwker@latestjwker public-key.pem public-key.jwk

By following these steps, you have generated a private key and a public key, then converted the public key to a JWK.

Note

You can also generate a JavaScript key using WebCrypto API ↗, which will produce a key in the correct JWK format.

Many existing JWK libraries ↗ support WebCrypto API for generating JavaScript key.

## 2. Host a key directory

You need to host a key directory which creates a way for your bot to authenticate its requests to Cloudflare.
This directory should follow the definition from the active IETF draft draft-meunier-http-message-signatures-directory-01 ↗.

1. Host a key directory at /.well-known/http-message-signatures-directory (note that this is a requirement). This key directory should serve a JSON Web Key Set (JWKS) including the public key derived from your signing key.
2. Serve the web page over HTTPS (not HTTP).
3. Calculate the base64 URL-encoded JWK thumbprint ↗ associated with your Ed25519 public key.
4. Sign your HTTP response using the HTTP message signature specification by attaching one signature per key in your key directory. This ensures no one else can mirror your directory and attempt to register on your behalf. Your response must include the following headers:

Content-Type: This header must have the value application/http-message-signatures-directory+json.
Signature: Construct a Signature header ↗ over your chosen components.
Signature-Input: Construct a Signature-Input header ↗ over your chosen components. The header must meet the following requirements.

























Required component parameterRequirementtagThis should be equal to http-message-signatures-directory.keyidJWK thumbprint of the corresponding key in your directory.createdThis should be equal to a Unix timestamp associated with when the message was sent by your application.expiresThis should be equal to a Unix timestamp associated with when Cloudflare should no longer attempt to verify the message.


The following example shows the annotated request and response with required headers against https://example.com.
GET /.well-known/http-message-signatures-directory HTTP/1.1Host: example.comAccept: application/http-message-signatures-directory+json
HTTP/1.1 200 OKContent-Type: application/http-message-signatures-directory+jsonSignature: sig1=:TD5arhV1ved6xtx63cUIFCMONT248cpDeVUAljLgkdozbjMNpJGr/WAx4PzHj+WeG0xMHQF1BOdFLDsfjdjvBA==:Signature-Input: sig1=("@authority");alg="ed25519";keyid="poqkLGiymh_W0uP6PZFw-dvez3QJT5SolqXBCW38r0U";nonce="ZO3/XMEZjrvSnLtAP9M7jK0WGQf3J+pbmQRUpKDhF9/jsNCWqUh2sq+TH4WTX3/GpNoSZUa8eNWMKqxWp2/c2g==";tag="http-message-signatures-directory";created=1750105829;expires=1750105839Cache-Control: max-age=86400{  "keys": [{    "kty": "OKP",    "crv": "Ed25519",    "x": "JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs", // Base64 URL-encoded public key, with no padding  }]}
5. Content-Type: This header must have the value application/http-message-signatures-directory+json.
6. Signature: Construct a Signature header ↗ over your chosen components.
7. Signature-Input: Construct a Signature-Input header ↗ over your chosen components. The header must meet the following requirements.

























Required component parameterRequirementtagThis should be equal to http-message-signatures-directory.keyidJWK thumbprint of the corresponding key in your directory.createdThis should be equal to a Unix timestamp associated with when the message was sent by your application.expiresThis should be equal to a Unix timestamp associated with when Cloudflare should no longer attempt to verify the message.

Note

This URL serves a standard JSON Web Key Set. Besides x, crv, and kty, you can include other standard JSON Web Key parameters, and you may publish non-Ed25519 keys as well. Multiple Ed25519 keys are supported. Only those for which you provide a signature in the above format are going to be used.

Cloudflare will ignore all other key types and key parameters except those containing kty, crv, and x formatted above. Do not include information that would leak your private key, such as the d parameter.

You can use the Cloudflare-developed http-signature-directory CLI tool ↗ to assist you in validating your directory.

## 3. Register your bot and key directory

You need to register your bot and its key directory to add your bot to the list of verified bots.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Manage Account > Configurations.
3. Go to the Verified Bots tab.
4. For Verification Method: select Request Signature.
5. For Validation Instructions: enter the URL of your key directory. You can additionally supply User Agents values (and their match patterns) that will be sent by your bot.
6. Select Submit.

Cloudflare accepts all valid Ed25519 keys found in your key directory. In the event a key already exists in Cloudflare's registered database, Cloudflare will work with you to supply a new key, or rotate your existing key.

Estimated review time

The estimated review time is approximately one week.

After successful verification, you will be able to send verified requests.

## 4. (After verification) Sign your requests

After your bot has been successfully verified, your bot is ready to sign its requests. The signature protocol is defined in draft-meunier-web-bot-auth-architecture-02 ↗

### 4.1. Choose a set of components to sign

Choose a set of components to sign.

A component is either an HTTP header, or any derived components ↗ in the HTTP Message Signatures specification. Cloudflare recommends the following:

- Choose at least the @authority derived component, which represents the domain you are sending requests to. For example, a request to https://example.com will be interpreted to have an @authority of example.com.
- Use components that only contain ASCII values. HTTP Message Signature specification disallows non-ASCII characters, which will result in failure to validate your bot's requests.

Use components with only ASCII values

Cloudflare currently does not support bs or sf parameter designed to serialize non-ASCII values into ASCII equivalents.

Content-Digest header

If you wish to sign your message content ↗ using a Content-Digest header, note that you should only do so if there is zero risk of a message being altered on the way to Cloudflare.

For example, if the message is unencrypted and proxied to Cloudflare, you should not use Content-Digest.

### 4.2. Calculate the JWK thumbprint

Calculate the base64 URL-encoded JWK thumbprint ↗ from the public key you registered with Cloudflare.

### 4.3. Construct the required headers

Construct the three required headers for Web Bot Auth.

#### Signature-Input header

Construct a Signature-Input header ↗ over your chosen components. The header must meet the following requirements.

| Required component parameter | Requirement |
| --- | --- |
| tag | This should be equal to web-bot-auth. |
| keyid | This should be equal to the thumbprint computed in step 2. |
| created | This should be equal to a Unix timestamp associated with when the message was sent by your application. |
| expires | This should be equal to a Unix timestamp associated with when Cloudflare should no longer attempt to verify the message. A short expires reduces the likelihood of replay attacks, and Cloudflare recommends choosing suitable short-lived intervals. |

#### Signature header

Construct a Signature header ↗ over your chosen components.

#### Signature-Agent header

Construct a Signature-Agent header ↗ that points to your key directory. Note that Cloudflare will fail to verify a message if:

- The message includes a Signature-Agent header that is not an https://.
- The message includes a valid URI but does not enclose it in double quotes. This is due to Signature-Agent being a structured field.
- The message has a valid Signature-Agent header, but does not include it in the component list in Signature-Input.

### 4.4. Add the headers to your bot's requests

Attach these three headers to your bot's requests.

An example request may look like this:

```
Signature-Agent: "https://signature-agent.test"Signature-Input: sig2=("@authority" "signature-agent") ;created=1735689600 ;keyid="poqkLGiymh_W0uP6PZFw-dvez3QJT5SolqXBCW38r0U" ;alg="ed25519" ;expires=1735693200 ;nonce="e8N7S2MFd/qrd6T2R3tdfAuuANngKI7LFtKYI/vowzk4lAZYadIX6wW25MwG7DCT9RUKAJ0qVkU0mEeLElW1qg==" ;tag="web-bot-auth"Signature: sig2=:jdq0SqOwHdyHr9+r5jw3iYZH6aNGKijYp/EstF4RQTQdi5N5YYKrD+mCT1HA1nZDsi6nJKuHxUi/5Syp3rLWBA==:
```

Note

You can test how Cloudflare interprets your signed requests against https://crawltest.com/cdn-cgi/web-bot-auth ↗. This endpoint returns an HTTP 401 if your message is formatted correctly but your key is unknown, an HTTP 200 if the key is known and your message is verified, and an HTTP 400 otherwise. You may also see an HTTP 401 if your key is known but the message failed to verify.

## Additional resources

You may wish to refer to the following resources.

- Bots FAQs.
- Cloudflare blog: Message Signatures are now part of our Verified Bots Program ↗.
- Cloudflare blog: Forget IPs: using cryptography to verify bot and agent traffic ↗.
- Cloudflare's web-bot-auth library in Rust ↗.
- Cloudflare's web-bot-auth npm package in Typescript ↗.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## IP validation

**來源**: [https://developers.cloudflare.com/bots/reference/bot-verification/ip-validation/](https://developers.cloudflare.com/bots/reference/bot-verification/ip-validation/)

Page options # IP validation

The IP validation method aims to identify all of the IP addresses that a bot may use to send requests. IP validation is only used as a verification method for verified bots.

Cloudflare can achieve this in two ways:

- Using IP list provided by the bot owner: The bot owner can host a public list of IP ranges (for example, Googlebot's list ↗). Cloudflare fetches and uses this list directly for validation.
- Using Domain-based reverse DNS: The bot owner can provide a domain (or set of domains) that their bot requests originate from. Cloudflare collects the IP addresses observed in the requests with the bot's user agent, and performs reverse DNS lookups. If the reverse DNS of an IP resolves to one of the provided domains, Cloudflare considers it valid and stores it.

## Public IP List

To verify a bot using a public IP list, you need to provide:

- A fixed and limited set of IP addresses, which can be verified via publicly accessible plain-text, JSON, or CSV.
- IP addresses used solely by the bot owner.
- A user-agent match pattern.

## Reverse DNS

To verify a bot using reverse DNS, you need to provide:

- A list of domain suffixes to validate DNS records.
- IP addresses should have PTR records set correctly.
- A user-agent match pattern.

## Generic user-agents

User-agent patterns that match generic user-agents will be rejected by the Verified Bots API. When you add a user-agent pattern that is considered very common to the Verified Bot form, you may encounter an error message that will prompt you to correct the user-agent before you can submit again.

Generic user-agents include:

- Dart
- Go-http-client
- GuzzleHttp
- Google Chrome
- Mozilla Firefox
- Safari
- Nessus
- Websocket++
- cloudflare-go
- fasthttp
- got
- nginx-ssl early hints
- node
- node-fetch
- okhttp
- python-requests
- uTorrent

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Management variables

**來源**: [https://developers.cloudflare.com/bots/reference/bot-management-variables/](https://developers.cloudflare.com/bots/reference/bot-management-variables/)

Page options # Bot Management variables

## Ruleset Engine fields

Bot Management provides access to several new variables within the expression builder of Ruleset Engine-based products such as WAF custom rules.

- Bot Score (cf.bot_management.score): An integer between 1-99 that indicates Cloudflare's level of certainty that a request comes from a bot.
- Verified Bot (cf.bot_management.verified_bot): A boolean value that is true if the request comes from a good bot, like Google or Bing. Most customers choose to allow this traffic. For more details, see Traffic from known bots.
- Serves Static Resource (cf.bot_management.static_resource): An identifier that matches file extensions for many types of static resources. Use this variable if you send emails that retrieve static images.
- ja3Hash (cf.bot_management.ja3_hash) and ja4 (cf.bot_management.ja4): A JA3/JA4 fingerprint helps you profile specific SSL/TLS clients across different destination IPs, Ports, and X509 certificates.
- Bot Detection IDs (cf.bot_management.detection_ids): List of IDs that correlate to the Bot Management heuristic detections made on a request (you can have multiple heuristic detections on the same request).
- Verified Bot Categories (cf.verified_bot_category): A string that allows you to segment your verified bot traffic by its type and purpose.

## Workers variables

These variables are also available as part of the request.cf object via Cloudflare Workers:

- request.cf.botManagement.score
- request.cf.botManagement.verifiedBot
- request.cf.botManagement.staticResource
- request.cf.botManagement.ja3Hash
- request.cf.botManagement.ja4
- request.cf.botManagement.jsDetection.passed
- request.cf.botManagement.detectionIds
- request.cf.verifiedBotCategory

## Corporate Proxy

The Bot Management Corporate Proxy field contains identified cloud-based corporate proxies and secure web gateways that are Enterprise-only, and provide outbound security services to their clients.

You can access the Corporate Proxy field in custom rules, rate limiting rules, or Workers to provide different security rules for traffic from these sources. You can also exempt them from rules using Bot Management scores.

Example ```
not cf.bot_management.verified_botand not cf.bot_management.static_resourceand not  cf.bot_management.corporate_proxyand cf.bot_management.score lt 30
```

## Log fields

Once you enable Bot Management, Cloudflare also surfaces bot information in its HTTP requests log fields:

- BotDetectionIDs
- BotScore
- BotScoreSrc
- BotTags

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Machine Learning models

**來源**: [https://developers.cloudflare.com/bots/reference/machine-learning-models/](https://developers.cloudflare.com/bots/reference/machine-learning-models/)

Page options # Machine Learning models

## Enable auto-updates to the Machine Learning models

Cloudflare encourages Enterprise customers to enable auto-updates to its Machine Learning models to get the newest bot detection models as they are released.

To enable auto-updates:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Management.
4. Enable Auto-updates to the Machine Learning Model.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to Bot Management.
5. Under Configurations, select the edit icon for Auto-updates to the Machine Learning Model and turn it on.

### What will change

If you are on an older Machine Learning model, you will see a score change to requests scored by the Machine Learning source instantly. If you are already on the latest model, you will see changes only after a new Machine Learning model becomes the global default.

Customers will be notified via email and dashboard prior to a new Machine Learning model becoming the global default.

### Risks of not updating

By not updating to the latest version, you will be using a Machine Learning model no longer maintained or monitored by our engineering team. As Internet traffic changes and new trends evolve, scoring accuracy by older versions may degrade.

### Model versions and release notes

| Version | Release Notes | Launch Date |
| --- | --- | --- |
| v1 | First Machine Learning Model released. | Q1 2019 |
| v2 | Introduced dynamic inter-request features to leverage the Cloudflare network to detect new bots more accurately. Feedback other Bot Management detection mechanisms to the machine learning model to more accurately detect bots. | Q1 2020 |
| v3 | Fixed accuracy issues under some conditions in the previous version. | Q2 2020 |
| v4 | Improved scoring for iOS devices. Fixed scoring inaccuracy in Firefox builds. | Q1 2021 |
| v5 | Recalibrated model for the removal of _cfduid cookie ↗.  Introduced new signals to reduce false negatives. | Q2 2021 |
| v6 | Significantly improved scoring for native Android application traffic. Improved scoring on the newest versions of Chromium browsers. | Q1 2022 |
| v7 | Increased recognition of distributed botnets. Improved HTTP/3 scoring. | Q1 2024 |
| v8 | Improved detection of residential proxies. Increased weight on network level traffic characteristics. | Q2 2024 |
| v9 | Improved model consistency and model efficacy against randomization attack techniques | Q2 2025 |

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot Detection Alerts

**來源**: [https://developers.cloudflare.com/bots/reference/alerts/](https://developers.cloudflare.com/bots/reference/alerts/)

Page options # Bot Detection Alerts

Bot alerts inform you when Cloudflare detects spikes in your traffic with any of the following characteristics:

- A global spike in traffic that have a bot score of less than 30.
- An increase in traffic on available dimensions in Custom Bot Detection Alerts.
- Filters of your choosing in Custom Bot Detection Alerts.

## Alert types

Bot Detection Alert

Who is it for? Enterprise customers who want to be notified when Cloudflare detects a spike in bot traffic on their zones.

Other options / filters None.

Included with Accounts with at least one Enterprise zone.

What should you do if you receive one? Select the Security Analytics link enclosed in the alert message. Contact support if additional advice is needed on how to investigate the attack further.

Additional information After an alert is created on the dashboard, it may take up to 30 minutes before sufficient data is available to begin detecting traffic anomalies. Verified bot traffic is excluded from bot alerts.

Custom Bot Detection Alert

Who is it for? Enterprise customers who want to be notified when Cloudflare detects a spike in bot traffic on their zones.

Other options / filters Refer to the alert logic for more information on additional filters or groupings.

Included with Accounts with at least one Enterprise zone.

What should you do if you receive one? Select the Security Analytics link enclosed in the alert message. Contact support if additional advice is needed on how to investigate the attack further.

Additional information After an alert is created on the dashboard, it may take up to 30 minutes before sufficient data is available to begin detecting traffic anomalies. Verified bot traffic is excluded from both basic and advanced bot alerts.

Alerts with grouping could cause potential noise if you set them up for a high-traffic zone. Grouping alerts function as if you set up separate policies with a filter for each value. Alerts may trigger multiple values in the same group as long as the traffic for each value reaches the threshold of 200.

### Set up a bot detection alert

To receive Bot alerts, you must configure a notification. Notifications help you stay up to date with your Cloudflare account through email, PagerDuty, or webhooks, depending on your Cloudflare plan.

1. In the Cloudflare dashboard, go to the Notifications page.
  Go to Notifications
2. Select Add.
3. Select Bot Management from the Product list.
4. Choose one of the available bot detection alerts (depending on whether you want to set up custom filters and/or grouping):

Bot Detection Alert
Custom Bot Detection Alert
5. Bot Detection Alert
6. Custom Bot Detection Alert
7. Enter a notification name and (optionally) a description.
8. Select the domain(s) to monitor for this alert.
9. Configure a delivery method for the notification. The available delivery methods depend on your Cloudflare plan. For more information, refer to Cloudflare Notifications.
10. If you are creating a notification for Custom Bot Detection Alert, define the parameters that will filter the notifications you will receive.
11. Select Save.

## Alert logic

The Bot Detection Alert notifies users when Cloudflare detects an abnormal spike to their zone where the Z-score > 3.5 ↗ and bot requests > 200/5 minutes in bot traffic (bot score < 30).

Z-score is calculated with a long window duration of six hours and short window duration of five minutes.

Bot Detection Alerts are delivered with Cloudflare’s Notifications system via email, webhook, or Pager Duty.

You will not receive duplicate alerts within the same one-hour time frame, except in rare cases where different alert values simultaneously trigger alerts.

In addition to the information above, Custom Bot Detection Alerts allow you to include or exclude certain conditions:

- User-agent
- Hostname
- URI Path
- IP Source Address
- AS Num
- JA3 Fingerprint
- JA4 Fingerprint
- Bot Detection IDs

You can also choose to group by the following dimensions so that they can be alerted of volumetric anomalies based on:

- JA4 Fingerprint (removes the filter of bot score < 30)
- AS Num
- Bot Detection IDs

Note

Bot Detection Alerts exclude verified bots.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Sample terms

**來源**: [https://developers.cloudflare.com/bots/reference/sample-terms/](https://developers.cloudflare.com/bots/reference/sample-terms/)

Page options # Sample terms

Cloudflare recommends that customers consider updating their Terms of Service to address bots specifically related to Artificial Intelligence (AI) training and data scraping. The text below provides an informational example of the kind of language that could be added to a website's terms of use.

> Artificial Intelligence Restriction
> You may not use automated bots to access, scan, scrape, data mine, copy, or use the materials or content on this website for developing, training, fine-tuning, or otherwise contributing to or improving a machine learning model or artificial intelligence (AI) system or the operation thereof, unless your bot's user agent is (I) explicitly permitted ("allowed") to do so in this website's robots.txt file and (II) solely used to identify bots used for AI purposes (i.e., this provision does not apply to user agents that are used for multiple purposes, such as search engine indexing and AI purposes).

Disclaimer

This language is provided for informational purposes only. It does not constitute legal advice, nor does it guarantee any specific outcome.

This is an illustrative example of language that can be included in a website's terms to put AI providers on notice that they are not authorized to use automated means to scrape content from your website for purposes of training or otherwise contributing to their AI models or systems, unless you have expressly permitted them to do so in your robots.txt file.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/bots/frequently-asked-questions/](https://developers.cloudflare.com/bots/frequently-asked-questions/)

Page options # FAQ

## Bots

### How does Cloudflare detect bots?

Cloudflare uses multiple methods to detect bots, but these vary by plan. For more details, refer to Plans.

### How do I know what is included in my plan?

To know what's included in your plan, refer to our Plans.

### How do I set up my bot product?

To learn how to set up your bot product, refer to Get started.

### Yandex bot unexpectedly blocked by the WAF managed rule with ID ...f6cbb163

Yandex updates their bots very frequently, you may see more false positives while these changes are propagated. New and recently updated bots will occasionally be blocked by a Cloudflare WAF managed rule, as the IP list of Yandex bots has not yet synced with Yandex's most recent changes.

Workarounds:

- Create an exception to temporarily skip the managed rule with ID    ...f6cbb163      when a request is coming from the Yandex IP and the user-agent contains Yandex.
- Create a WAF custom rule with the Skip action to temporarily bypass WAF Managed Rules when a request is coming from the Yandex IP and the user-agent contains Yandex.

If you are using the legacy WAF managed rules, disable the WAF managed rule with ID 100203 temporarily.

Solution:

Once the new Yandex IP is propagated to our system, the requests will not be blocked anymore and you can remove any workaround you configured. This can take up to 48 hours. If you see any Yandex bots still being blocked after 48 hours with no change to the bot, contact Cloudflare Support.

### How does machine learning work?

Supervised machine learning takes certain variables (X) like gender and age and predicts another variable (Y) like income.

In Bot Management and Super Bot Fight Mode, the X variables are request features, while the Y variable represents the probability of solving a challenge based on X values.

Cloudflare uses data from millions of requests and re-train the system on a periodic basis. You can learn about this data from your own request logs such as Cloudflare Logpull and Logpush as well as the Firewall API.

### Why am I seeing a Managed Challenge action for WAF rules?

When you choose to challenge different bot categories with Bot Fight Mode or Super Bot Fight Mode, you will see Security Events with an Action Taken of Managed Challenge.

You may also see Managed Challenge due to a triggered WAF custom rule.

This does not mean that your traffic was blocked. It is the challenge sent to your user to determine whether they are likely human or likely bot.

To understand if the result of the challenge was a success or a failure, you can verify using Logpush.

### Does the WAF run before Super Bot Fight Mode?

Yes. WAF rules are executed before Super Bot Fight Mode. If a WAF custom rule performs a terminating action such as Block, your Super Bot Fight Mode configuration will not be evaluated.

### What is cf.bot_management.verified_bot?

A request's cf.bot_management.verified_bot value is a boolean indicating whether such request comes from a Cloudflare allowed bot.

Cloudflare has built an allowlist of good, automated bots, for example Google Search Engine, Pingdom, and more.

This allowlist is large based on reverse DNS verification, meaning that the IPs we allow really match the requesting service. In addition to this, Cloudflare uses multiple validation methods including ASN blocks and public lists. If none of these validation types are available for a customer, we use internal Cloudflare data and machine learning to identify legitimate IP addresses from good bots.

To allow traffic from good bots, use the Verified Bot field in your WAF custom rule.

### Why might the ja3hash or JA4 be empty in HTTP logs?

The JA3/JA4 fingerprint can be null or empty in some cases. The most common case is for HTTP requests because JA3 and JA4 are calculated in TLS. It can also be empty due to the Worker sending requests within the same zone or to a zone that is not proxied (or a third party).

Orange to Orange (O2O) should not cause null or empty JA3 or JA4 fingerprints, unless the eyeball zone is routing traffic to the target zone using a Worker.

### I run a good bot and want for it to be added to the allowlist (cf.bot_management.verified_bot). What should I do?

Cloudflare maintains a sample list of verified bots in Cloudflare Radar ↗.

As a bot operator, in order to be listed by Cloudflare as a Verified Bot, your bot must conform with our verified bot public policy. If your bot meets this criteria, submit this online application ↗.

### What information do I need to troubleshoot my bot issues?

If you are experiencing errors with your bot solution and need to submit a Support request, include the following information:

Warning

The following information gathering are required when you are experiencing issues (for example, false positives) with Enterprise Bot Management only (Enterprise plan).

Because Bot Fight Mode (BFM) and Super Bot Fight Mode (SBFM) are set at a domain level, we often find that disabling these features is the best solution to false positives.

Please follow instructions in the following questions on how to disable BFM and SBFM features. We conduct more thorough investigations for Enterprise Bot Management.

- Ray IDs
- IP addresses
- WAF custom rule IDs, rule expression, Challenge solve rates
- Common user-agents among false positives
- Common ASNs among false positives
- Screenshots of strange activity from the WAF, such as a huge spike in challenged traffic on the graph
- Problematic URIs or paths
- Rough description of how your domain is configured.

Is one zone Cloudflare for SaaS while the others are not?
Is most API traffic sent to a particular URI?
How much mobile traffic do you expect?
- Is one zone Cloudflare for SaaS while the others are not?
- Is most API traffic sent to a particular URI?
- How much mobile traffic do you expect?

### What should I do if I am getting False positives caused by Bot Fight Mode (BFM) or Super Bot Fight Mode (SBFM)?

Important considerations you need to be aware of before turning on BFM or SBFM

- BFM and SBFM are high security features intended to quickly help customers under active attack stop as many bots as possible. Due to the high security threshold, false positives do sometimes happen.
- BFM has limited control. You cannot bypass or skip BFM using the Skip action in WAF custom rules or using Page Rules. BFM will be disabled if there are any IP Access rules present. If you turned on BFM during an attack, and the attack has subsided, we recommend either disabling the feature using IP Access rules to bypass BFM, or looking at Bot Management for Enterprise, which gives you the ability to precisely customize your security threshold and create exception rules as needed.
- SBFM can be bypassed with IP Access Allow action rules. You can use the Skip action in WAF custom rules to specify where Super Bot Fight Mode should not run.

How to disable BFM/SBFM feature?

If you encounter any issues with BFM/SBFM feature (for example, false positive), you can disable it under Security > Settings.

For Free plans

1. Filter by Bot traffic.
2. Turn Bot Fight Mode off.

For Pro plans

1. Filter by Bot traffic.
2. Go to Super Bot Fight Mode.
3. Set Definitely automated traffic and Verified bots to Allow
4. Turn Static resource protection and JavaScript detections off.

For Business and Enterprise (with no Bot Management add-on) plans

1. Filter by Bot traffic.
2. Go to Super Bot Fight Mode.
3. Set each of Definitely automated traffic, Likely automated and Verified bots to Allow.
4. Turn Static resource protection and JavaScript detections off.

In parts of your site where you want bot traffic, you can use the Skip action in WAF custom rules to specify where Super Bot Fight Mode should not run.

You can use the Rules language and its operators and fields in custom rules to configure a scoped rule for approved automated traffic in Super Bot Fight Mode.

You cannot bypass or skip Bot Fight Mode using the Skip action in WAF custom rules or using Page Rules. Skip, Bypass, and Allow actions apply to rules or rulesets running on the Ruleset Engine. While Super Bot Fight Mode rules are implemented in the Ruleset Engine, Bot Fight Mode checks are not. This is why you can skip Super Bot Fight Mode, but not Bot Fight Mode. If you need to skip Bot Fight Mode, consider using Super Bot Fight Mode.

Bot Fight Mode can still trigger if you have IP Access rules, but it cannot trigger if an IP Access rule matches the request. For example, the IP Access rule matches the connecting IP.

### Super Bot Fight Mode feature (SBFM) is still blocking requests even though the feature is turned off, why?

This is a known issue the Bots team is working to resolve in the near future. In the meantime, there is a workaround to resolve such issue. You will need to run the following API command to check and remove the SBFM ruleset:

1. List the existing Rulesets at the zone level.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Response Compression WriteResponse Compression ReadConfig Settings WriteConfig Settings ReadDynamic URL Redirects WriteDynamic URL Redirects ReadCache Settings WriteCache Settings ReadCustom Errors WriteCustom Errors ReadOrigin WriteOrigin ReadManaged headers WriteManaged headers ReadZone Transform Rules WriteZone Transform Rules ReadMass URL Redirects WriteMass URL Redirects ReadMagic Firewall WriteMagic Firewall ReadL4 DDoS Managed Ruleset WriteL4 DDoS Managed Ruleset ReadHTTP DDoS Managed Ruleset WriteHTTP DDoS Managed Ruleset ReadSanitize WriteSanitize ReadTransform Rules WriteTransform Rules ReadSelect Configuration WriteSelect Configuration ReadBot Management WriteBot Management ReadZone WAF WriteZone WAF ReadAccount WAF WriteAccount WAF ReadAccount Rulesets ReadAccount Rulesets WriteLogs WriteLogs ReadLogs WriteLogs Read List zone rulesetscurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \  --request GET \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
2. Response Compression Write
3. Response Compression Read
4. Config Settings Write
5. Config Settings Read
6. Dynamic URL Redirects Write
7. Dynamic URL Redirects Read
8. Cache Settings Write
9. Cache Settings Read
10. Custom Errors Write
11. Custom Errors Read
12. Origin Write
13. Origin Read
14. Managed headers Write
15. Managed headers Read
16. Zone Transform Rules Write
17. Zone Transform Rules Read
18. Mass URL Redirects Write
19. Mass URL Redirects Read
20. Magic Firewall Write
21. Magic Firewall Read
22. L4 DDoS Managed Ruleset Write
23. L4 DDoS Managed Ruleset Read
24. HTTP DDoS Managed Ruleset Write
25. HTTP DDoS Managed Ruleset Read
26. Sanitize Write
27. Sanitize Read
28. Transform Rules Write
29. Transform Rules Read
30. Select Configuration Write
31. Select Configuration Read
32. Bot Management Write
33. Bot Management Read
34. Zone WAF Write
35. Zone WAF Read
36. Account WAF Write
37. Account WAF Read
38. Account Rulesets Read
39. Account Rulesets Write
40. Logs Write
41. Logs Read
42. Logs Write
43. Logs Read
44. From the output in step 1, find the ruleset ID that is associated with the zone's SBFM configuration. You should be able to see "kind": "zone" and "phase": "http_request_sbfm" for that ruleset.
45. Use the ruleset ID you found to delete the SBFM ruleset.
 Required API token permissions
 
At least one of the following token permissions 
is required:
Response Compression WriteConfig Settings WriteDynamic URL Redirects WriteCache Settings WriteCustom Errors WriteOrigin WriteManaged headers WriteZone Transform Rules WriteMass URL Redirects WriteMagic Firewall WriteL4 DDoS Managed Ruleset WriteHTTP DDoS Managed Ruleset WriteSanitize WriteTransform Rules WriteSelect Configuration WriteBot Management WriteZone WAF WriteAccount WAF WriteAccount Rulesets WriteLogs WriteLogs Write Delete a zone rulesetcurl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID" \  --request DELETE \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
46. Response Compression Write
47. Config Settings Write
48. Dynamic URL Redirects Write
49. Cache Settings Write
50. Custom Errors Write
51. Origin Write
52. Managed headers Write
53. Zone Transform Rules Write
54. Mass URL Redirects Write
55. Magic Firewall Write
56. L4 DDoS Managed Ruleset Write
57. HTTP DDoS Managed Ruleset Write
58. Sanitize Write
59. Transform Rules Write
60. Select Configuration Write
61. Bot Management Write
62. Zone WAF Write
63. Account WAF Write
64. Account Rulesets Write
65. Logs Write
66. Logs Write

Note that you need to replace <API_TOKEN> with your own API token.

## Web Bot Auth

### What key algorithms does Cloudflare support?

Cloudflare supports Ed25519 key algorithm.

### What web-bot-auth features from the IETF draft are not supported?

The following derived components are not supported, and we will fail to verify a message if they are included:

- @query-params: Cloudflare recommends signing the whole query using the @query component instead of signing an individual parameter.
- @status: This is not possible to include in the request path.

The following component parameters defined in IETF RFC 9421 are not supported, and Cloudflare will fail to verify a message if they are included:

- sf (for HTTP header fields)
- bs (for HTTP header fields)
- key (for HTTP header fields)
- req (for HTTP header fields or derived components)
- name (for @query-param support - this requires @query-param support)

### Should I supply a nonce parameter in Signature-Input?

The nonce parameter allows you to supply a nonce to prevent attackers from replaying past messages against a server.

While Cloudflare recommends including it, there is currently no nonce validation, nor does Cloudflare guard against replay attacks using a database of seen nonces.

Instead, Cloudflare recommends short expires as a protection against replay attacks. A minute is often sufficient.

### How do I know my JSON Web Key set directory will be accepted?

Cloudflare uses http-signature-directory tool ↗ to validate your directory. Please ensure this works against your directory before registering with us.

### My message is failing validation. What could be the cause?

- Ensure you have a Signature-Agent header, and that its value is in double-quotes.
- Ensure you include signature-agent in the component list in your Signature-Input header.
- Ensure your expires timestamp is not too short, such that, by the time it arrives at Cloudflare servers, it has already expired. A minute is often sufficient.
- Ensure you are not signing components containing non-ASCII values, or on the unsupported list.

### I want to use HTTP message signatures / Web Bot Auth on my zone, and do not want Cloudflare's verification to intervene. What do I do?

You can request the Web Bot Auth feature be disabled for your zone by contacting Cloudflare support. This will disable usage of Web Bot Auth specifically with Cloudflare, and verified bots will fallback to other modes to validate traffic.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/bots/glossary/](https://developers.cloudflare.com/bots/glossary/)

Page options # Glossary

Review the definitions for terms used across Cloudflare's Bots documentation.

| Term | Definition |
| --- | --- |
| bot | A software application programmed to do tasks that can be used for good (chatbots, search engine crawlers) or for evil (inventory hoarding, credential stuffing). |
| bot score | A score from 1 to 99 that indicates how likely that request came from a bot, in which 1 to 29 is likely automated and 30 to 99 is likely human. |
| bot tags | Additional information about a bot request, such as why Cloudflare has given it a bot score and whether the request came from a verified bot or a category of verified bots. |
| Challenge solve rate (CSR) | The percentage of issued challenges that were solved. |
| detection ID | Static rules that are used to detect predictable bot behavior with no overlap with human traffic. |
| JA3 fingerprint | JA3 and JA4 fingerprints profile specific SSL/TLS clients across different destination IPs, Ports, and X509 certificates. |
| verified bot | Bots that are transparent about who they are and what they do. |

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Enterprise Bot Management

**來源**: [https://developers.cloudflare.com/bots/plans/bm-subscription/](https://developers.cloudflare.com/bots/plans/bm-subscription/)

Page options # Enterprise Bot Management

To learn more about features and functionality, select a plan.

Free Pro Business Bot Management for Enterprise ## Bot Management for Enterprise Features

|  |  |
| --- | --- |
| Plan name | Bot Management for Enterprise |
| Availability | Added to Enterprise plans by your account team |
| Configuration | Go to Security > Bots > Configure Bot Management |
| Enablement | Quick onboarding with help from our Solutions Engineering team |
| Type of bots detected | Simple and sophisticated bots, headless browsers, and domain-specific
anomalies |
| Actions | Customer chooses from several options, including block and various
challenges |
| Analytics | Dedicated Bot Analytics tool, available in Security |
| Additional control | Ability to restrict by path, IP address, and more. Access to 
bot score, JA3/JA4 fingerprint, bot tags fields, and detection IDs. |

Note

Zones that have Enterprise Bot Management enabled will not see Bot Fight Mode or Super Bot Fight Mode under Security > Bots.

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Free

**來源**: [https://developers.cloudflare.com/bots/plans/free/](https://developers.cloudflare.com/bots/plans/free/)

Page options # Free

To learn more about features and functionality, select a plan.

Free Pro Business Bot Management for Enterprise ## Free features

|  |  |
| --- | --- |
| Plan name | Bot Fight Mode |
| Availability | All Free customers |
| Configuration | Go to Security > Bots |
| Enablement | Toggle in Security > Bots |
| Type of bots detected | Simple bots (from cloud ASNs) and headless browsers |
| Actions | Cloudflare issues a computationally expensive challenge |
| Additional control | Applied to all traffic across a domain |

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Pro

**來源**: [https://developers.cloudflare.com/bots/plans/pro/](https://developers.cloudflare.com/bots/plans/pro/)

Page options # Pro

To learn more about features and functionality, select a plan.

Free Pro Business Bot Management for Enterprise ## Pro features

|  |  |
| --- | --- |
| Plan name | Super Bot Fight Mode |
| Availability | All Pro customers |
| Configuration | Go to Security > Bots > 
Configure Super Bot Fight Mode |
| Enablement | Toggle in Security > Bots |
| Type of bots detected | Simple bots and headless browsers |
| Actions | Customer chooses whether to allow, block, or challenge |
| Analytics | Limited analytics available in a Bot Report |
| Additional control | Applied to all traffic across a domain |

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Business

**來源**: [https://developers.cloudflare.com/bots/plans/biz-and-ent/](https://developers.cloudflare.com/bots/plans/biz-and-ent/)

Page options # Business

To learn more about features and functionality, select a plan.

Free Pro Business Bot Management for Enterprise ## Business features

|  |  |
| --- | --- |
| Plan name | Super Bot Fight Mode |
| Availability | All Business customers and Enterprise customers without Bot Management* |
| Configuration | Go to Security > Bots > 
Configure Super Bot Fight Mode |
| Enablement | Toggle in Security > Bots |
| Type of bots detected | Simple bots, headless browsers, and many sophisticated bots |
| Actions | Customer chooses whether to allow, block, or challenge |
| Analytics | Dedicated Bot Analytics tool, available in Security |
| Additional control | Applied to all traffic across a domain |

*When users purchase Bot Management for Enterprise, Cloudflare automatically replaces and disables other bot products to prevent overlap.

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Get started with Cloudflare bot solutions

**來源**: [https://developers.cloudflare.com/bots/get-started/](https://developers.cloudflare.com/bots/get-started/)

Page options # Get started with Cloudflare bot solutions

Refer to the following pages to get started with Cloudflare's bot solutions based on your plan type:

- Bot Fight Mode
- Super Bot Fight Mode
- Bot Management

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## JavaScript Detections

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/javascript-detections/](https://developers.cloudflare.com/bots/additional-configurations/javascript-detections/)

Page options # JavaScript Detections

JavaScript Detections is a type of Challenge separate from Cloudflare’s Challenge Pages or Turnstile. Javascript Detections helps Cloudflare's bot solutions identify automated requests.

While Challenge Pages and Turnstile rely on client-side signals to determine the authenticity of a request, Bot Management’s JavaScript Detections relies on network-side signals and run on every single request made to your website.

## Process

JavaScript Detections is implemented on your website via a lightweight, invisible JavaScript code snippet that follows Cloudflare's privacy standards ↗.

JavaScript is injected only in response to requests for HTML pages or page views, excluding AJAX calls. API and mobile application traffic is unaffected.

JavaScript Detections has a lifespan of 15 minutes. However, the code is injected again before the session expires. After page load, the script is deferred and utilizes a separate thread (where available) to ensure that performance impact is minimal. The snippets of JavaScript will contain a source pointing to the Challenge Platform, with paths that start with /cdn-cgi/challenge-platform/…

Once JavaScript Detections is injected on the HTML page, the visitor's browser will run the JavaScript code snippet and a cf_clearance cookie is issued to the visitor. The information in JavaScript Detections is stored in the cf_clearance cookie and is used to populate js_detection.passed.

- If the visitor is verified and a cf_clearance cookie is issued, it will contain the outcome: cf.bot_management.js.detection.passed = true
- If the verification fails, the cookie will contain the outcome: cf.bot_management.js.detection.passed = false

Note

The cf_clearance cookie cannot exceed the maximum size of 4096 bytes.

Warning

Enforcement against bots does not occur even if the cookie is flagged false.

You must enable JavaScript Detections and then create a custom WAF rule using the cf.bot_management.js.detection.passed field to block or challenge a failed request.

When the visitor encounters a WAF custom rule on your website, the rule will check the outcome of the cf_clearance cookie. The outcome of the cf_clearance cookie determines whether the request passes, or is blocked or challenged.

Refer to the steps below to enable and enforce JavaScript Detections.

## 1. Enable JavaScript Detections

For Bot Fight Mode customers, JavaScript Detections is automatically enabled and cannot be disabled.

For Super Bot Fight Mode and Bot Management for Enterprise customers, JavaScript Detections is optional.

- Old dashboard
- New dashboard

To enable JavaScript detections:

1. Log in to your Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Management.
4. For JavaScript Detections, switch the toggle to On.

To enable JavaScript detections using the Bot traffic settings module:

1. Log in to your Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Under your bot traffic plan configurations, select the edit icon for JS detections and turn JavaScript Detections on.

For more details on how to set up bot protection, refer to the Bots documentation.

## 2. Enforce execution of JavaScript Detections

Once you enable JavaScript detections, you must use the cf.bot_management.js_detection.passed field to create WAF custom rules (or the request.cf.botManagement.jsDetection.passed variable in Workers).

When adding this field to WAF custom rules, it is used on endpoints expecting browser traffic (avoiding native mobile applications or websocket endpoints), after a user's first request to your application (Cloudflare needs at least one HTML request before injecting JavaScript detection), and with the Managed Challenge action, because there are legitimate reasons a user might not have passed a JavaScript Detection challenge (network issues, ad blockers, disabled JavaScript in browser, native mobile applications).

### Prerequisites

- You must have JavaScript Detections enabled on your zone.
- You must have updated your Content Security Policy headers for JavaScript detections.
- You must not run this field on websocket endpoints.
- You must use the field in a custom rules expression that expects only browser traffic.
- The action should always be a managed challenge in case a legitimate user has not received the challenge for network or browser reasons.
- The path specified in the rule builder should never be the first HTML page a user visits when browsing your site.

The cf.bot_management.js_detection.passed field should never be used in a WAF custom rule that matches a visitor's first request to a site. It is necessary to have at least one HTML request before Cloudflare can inject JavaScript detection.

- WAF rule example
- Workers example

```
(http.request.uri.path eq "/api/v4/user/create" and http.request.method eq "POST" and not cf.bot_management.verified_bot)and (cf.bot_management.score lt 30 or !cf.bot_management.js_detection.passed)
```

```
"botManagement": {"jsDetection": {    "passed": false}}
```

Refer to the WAF documentation for more information on creating a custom rule.

## API

If you enable JavaScript Detections via the dashboard, Cloudflare will insert a script tag in all HTML pages served on your website. If you would prefer to limit where JavaScript Detections is served, you can do so with the JavaScript Detections API script.

The JavaScript Detections API allows you more granular control over when and where JavaScript Detections is injected on your website, as well as an option for callback handling (for logging or other additional actions).

You can explicitly add a script reference to /cdn-cgi/challenge-platform/scripts/jsd/api.js and your own code calling window.cloudflare.jsd.executeOnce on specific HTML pages of your website.

Warning

It is not recommended to combine both approaches (zone-wide toggle and the manual injection). If you want to selectively deploy JavaScript Detections only on certain pages, disable JavaScript Detections via the Cloudflare dashboard and use the JavaScript Detections API exclusively.

The following script must be added to every page that you wish to have JavaScript Detections enabled:

```
<script>
function jsdOnload(){  window.cloudflare.jsd.executeOnce(    {      callback: function(result){        console.log('jsd outcome', result);    }  );}</script><script src="/cdn-cgi/challenge-platform/scripts/jsd/api.js?onload=jsdOnload" async>
```

Note

result = success or error only refers to the execution of JavaScript Detections. It does not indicate whether a visitor is a human or a bot.

## Considerations

JavaScript Detections does not guarantee a specific bot score.

- If the JavaScript Detections injection or execution fails and cf.bot_management.js_detection.passed = false, a separate Bot Management heuristic can still yield a 1 or higher bot score, independent of JavaScript Detections.
- If the JavaScript Detections passes, the final bot score may still be 1 due to other detection heuristics (for example, known malicious IP, signature detection, and more), resulting in js_detection.passed = true, but score = 1.

## Limitations

### If you enabled Bot Management before June 2020

Customers who enabled Enterprise Bot Management before June 2020 do not have JavaScript Detections enabled by default (unless specifically requested). These customers can still enable the feature in the Cloudflare dashboard.

### If it is the first request to your website

The first request from a new client to your website or application will generally not have JavaScript Detections data (cf.bot_management.js_detection.passed = false). This is because Cloudflare needs at least one HTML request before injecting JavaScript Detection and issuing the cf_clearance cookie.

Subsequent requests can include a cf_clearance cookie if JavaScript ran successfully.

### If you have a Content Security Policy (CSP)

If you have a Content Security Policy (CSP), you need to take additional steps to implement JavaScript Detections:

- Ensure that anything under /cdn-cgi/challenge-platform/ is allowed. Your CSP should allow scripts served from your origin domain (script-src self).
- For nonce script tags:


If your CSP uses a nonce for script tags, Cloudflare will add these nonces to the scripts it injects by parsing your CSP response header.


If your CSP does not use nonce for script tags and JavaScript Detections is enabled, you may see a console error such as Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-b123b8a70+4jEj+d6gWI9U6IilUJIrlnRJbRR/uQl2Jc='), or a nonce ('nonce-...') is required to enable inline execution. We highly discourage the use of unsafe-inline and instead recommend the use CSP nonces in script tags which we parse and support in our CDN.
- If your CSP uses a nonce for script tags, Cloudflare will add these nonces to the scripts it injects by parsing your CSP response header.
- If your CSP does not use nonce for script tags and JavaScript Detections is enabled, you may see a console error such as Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-b123b8a70+4jEj+d6gWI9U6IilUJIrlnRJbRR/uQl2Jc='), or a nonce ('nonce-...') is required to enable inline execution. We highly discourage the use of unsafe-inline and instead recommend the use CSP nonces in script tags which we parse and support in our CDN.

Warning

JavaScript Detections is not supported with nonce set via <meta> tags.

### If you have ETags

Enabling JavaScript Detections (JSD) will strip ETags from HTML responses where JSD is injected.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/bots/concepts/](https://developers.cloudflare.com/bots/concepts/)

Page options # Concepts

Refer to the following pages for more information on bot concepts:

- Bots
- Bot scores
- Bot tags
- Bot Feedback Loop
- Bot detection engines

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Additional configurations

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/](https://developers.cloudflare.com/bots/additional-configurations/)

Page options # Additional configurations

Refer to the following pages for more information on additional bot management configurations:

- JA3/JA4 fingerprint
- Detection IDs
- JavaScript detections
- Sequence rules
- AI Labyrinth
- Block AI Bots
- Direct AI crawlers with managed robots.txt
- Static resource protection

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## AI Labyrinth

**來源**: [https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth](https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth)

Page options # AI Labyrinth

The AI Labyrinth adds invisible links on your webpage with specific Nofollow tags to block AI crawlers that do not adhere to the recommended guidelines and crawl without permission. AI crawlers that scrape your website content without permission will be stuck in a maze of never-ending links, and their details are recorded and used by all Cloudflare customers who choose to block AI bots.

These links do not impact your search engine optimization (SEO) or your website's appearance, and are only seen by bots. AI bots that respect no-crawl instructions will safely ignore this honeypot.

To enable AI Labyrinth:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Bots.
3. Select Configure Bot Fight Mode.
4. Enable AI Labyrinth.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings.
3. Filter by Bot traffic.
4. Go to AI Labyrinth.
5. Turn AI Labyrinth on.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Workers templates

**來源**: [https://developers.cloudflare.com/bots/workers-templates/](https://developers.cloudflare.com/bots/workers-templates/)

Page options # Workers templates

Refer to the templates below to integrate Bot Management with Cloudflare Workers:

- Delay action

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/bots/troubleshooting/](https://developers.cloudflare.com/bots/troubleshooting/)

Page options # Troubleshooting

Refer to the following pages to troubleshoot issues with Cloudflare's bot solutions:

- Bot Management skips
- Super Bot Fight Mode for WordPress

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/bots/reference/](https://developers.cloudflare.com/bots/reference/)

Page options # Reference

Refer to the following pages for more information on Cloudflare's bot solutions:

- Bot verification methods
- Bot Management variables
- Machine Learning models
- Bot Detection Alerts
- Sample terms

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Bot verification methods

**來源**: [https://developers.cloudflare.com/bots/reference/bot-verification/](https://developers.cloudflare.com/bots/reference/bot-verification/)

Page options # Bot verification methods

Refer to the following pages for more information on Cloudflare's validation methods for Verified and Signed bots.

- Web Bot Auth
- IP validation

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Plans

**來源**: [https://developers.cloudflare.com/bots/plans](https://developers.cloudflare.com/bots/plans)

Page options # Plans

To learn more about features and functionality, select a plan.

Free

Pro

Business

Bot Management for Enterprise

## How do I get started?

To get started, review our setup guides. If you have any questions, visit the community ↗ to engage with other Cloudflare users.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

