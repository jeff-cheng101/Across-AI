# Managed Rules (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.083Z
> 原始來源: waf-docs/managed-rules.md

> 本文檔包含 31 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.319Z

## 目錄

1. [Managed Rules](#managed-rules)
2. [Deploy a WAF managed ruleset in the dashboard](#deploy-a-waf-managed-ruleset-in-the-dashboard)
3. [Deploy a WAF managed ruleset via API](#deploy-a-waf-managed-ruleset-via-api)
4. [Troubleshoot managed rules](#troubleshoot-managed-rules)
5. [Create exceptions](#create-exceptions)
6. [Add an exception in the dashboard](#add-an-exception-in-the-dashboard)
7. [Add an exception via API](#add-an-exception-via-api)
8. [Log the payload of matched rules](#log-the-payload-of-matched-rules)
9. [Configure payload logging in the dashboard](#configure-payload-logging-in-the-dashboard)
10. [View the payload content in the dashboard](#view-the-payload-content-in-the-dashboard)
11. [Configure payload logging via API](#configure-payload-logging-via-api)
12. [Store decrypted matched payloads in logs](#store-decrypted-matched-payloads-in-logs)
13. [Command-line operations](#command-line-operations)
14. [Generate a key pair](#generate-a-key-pair)
15. [Decrypt the payload content](#decrypt-the-payload-content)
16. [Check for exposed credentials](#check-for-exposed-credentials)
17. [How it works](#how-it-works)
18. [Configure via API](#configure-via-api)
19. [Configure with Terraform](#configure-with-terraform)
20. [Test your configuration](#test-your-configuration)
21. [Monitor exposed credentials events](#monitor-exposed-credentials-events)
22. [Upgrade to leaked credentials detection](#upgrade-to-leaked-credentials-detection)
23. [Cloudflare Managed Ruleset](#cloudflare-managed-ruleset)
24. [Cloudflare OWASP Core Ruleset](#cloudflare-owasp-core-ruleset)
25. [Concepts](#concepts)
26. [Evaluation example](#evaluation-example)
27. [Configure in the dashboard](#configure-in-the-dashboard)
28. [Configure via API](#configure-via-api)
29. [Cloudflare Exposed Credentials Check Managed Ruleset](#cloudflare-exposed-credentials-check-managed-ruleset)
30. [Cloudflare Sensitive Data Detection](#cloudflare-sensitive-data-detection)
31. [Rulesets reference](#rulesets-reference)

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

