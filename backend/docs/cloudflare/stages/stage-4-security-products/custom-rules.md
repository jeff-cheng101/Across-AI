# Custom Rules (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.080Z
> 原始來源: waf-docs/custom-rules.md

> 本文檔包含 25 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.317Z

## 目錄

1. [Custom rules](#custom-rules)
2. [Create a custom rule in the dashboard](#create-a-custom-rule-in-the-dashboard)
3. [Create a custom rule via API](#create-a-custom-rule-via-api)
4. [Configure a rule with the Skip action](#configure-a-rule-with-the-skip-action)
5. [API examples](#api-examples)
6. [Available skip options](#available-skip-options)
7. [Allow traffic from IP addresses in allowlist only](#allow-traffic-from-ip-addresses-in-allowlist-only)
8. [Allow traffic from search engine bots](#allow-traffic-from-search-engine-bots)
9. [Allow traffic from specific countries only](#allow-traffic-from-specific-countries-only)
10. [Block Microsoft Exchange Autodiscover requests](#block-microsoft-exchange-autodiscover-requests)
11. [Block requests by attack score](#block-requests-by-attack-score)
12. [Block traffic by geographical location](#block-traffic-by-geographical-location)
13. [Block traffic from specific countries](#block-traffic-from-specific-countries)
14. [Build a sequence rule within custom rules](#build-a-sequence-rule-within-custom-rules)
15. [Challenge bad bots](#challenge-bad-bots)
16. [Configure token authentication](#configure-token-authentication)
17. [Exempt partners from Hotlink Protection](#exempt-partners-from-hotlink-protection)
18. [Issue challenge for admin user in JWT claim based on attack score](#issue-challenge-for-admin-user-in-jwt-claim-based-on-attack-score)
19. [Require a specific cookie](#require-a-specific-cookie)
20. [Require known IP addresses in site admin area](#require-known-ip-addresses-in-site-admin-area)
21. [Require specific HTTP headers](#require-specific-http-headers)
22. [Require specific HTTP ports](#require-specific-http-ports)
23. [Stop R-U-Dead-Yet? (R.U.D.Y.) attacks](#stop-r-u-dead-yet-rudy-attacks)
24. [Update custom rules for customers or partners](#update-custom-rules-for-customers-or-partners)
25. [Common use cases](#common-use-cases)

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

