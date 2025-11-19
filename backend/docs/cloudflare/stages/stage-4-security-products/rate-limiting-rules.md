# Rate Limiting Rules (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.086Z
> 原始來源: waf-docs/rate-limiting-rules.md

> 本文檔包含 8 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.318Z

## 目錄

1. [Rate limiting rules](#rate-limiting-rules)
2. [Request rate calculation](#request-rate-calculation)
3. [Create a rate limiting rule in the dashboard](#create-a-rate-limiting-rule-in-the-dashboard)
4. [Create a rate limiting rule via API](#create-a-rate-limiting-rule-via-api)
5. [Find appropriate rate limit](#find-appropriate-rate-limit)
6. [Rate limiting parameters](#rate-limiting-parameters)
7. [Rule examples](#rule-examples)
8. [Rate limiting best practices](#rate-limiting-best-practices)

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

