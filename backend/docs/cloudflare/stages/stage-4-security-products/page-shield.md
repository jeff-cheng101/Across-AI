# Page Shield - 頁面安全防護

> 本文檔包含 25 個頁面的內容
> 生成時間: 2025-09-08T04:18:09.243Z
> 產品線: 🛡️ Security Products

## 📑 目錄

1. [Cloudflare Page Shield](#cloudflare-page-shield)
2. [Get started](#get-started)
3. [How Page Shield works](#how-page-shield-works)
4. [Malicious script and connection detection](#malicious-script-and-connection-detection)
5. [Monitor resources and cookies](#monitor-resources-and-cookies)
6. [Review resources considered malicious](#review-resources-considered-malicious)
7. [Review changed scripts](#review-changed-scripts)
8. [Alerts](#alerts)
9. [Configure an alert](#configure-an-alert)
10. [Alert types](#alert-types)
11. [Policies](#policies)
12. [Create a policy in the dashboard](#create-a-policy-in-the-dashboard)
13. [Policy violations](#policy-violations)
14. [Supported CSP directives](#supported-csp-directives)
15. [Handle a client-side resource alert](#handle-a-client-side-resource-alert)
16. [Configuration settings](#configuration-settings)
17. [Script and connection statuses](#script-and-connection-statuses)
18. [Page Shield and PCI DSS compliance](#page-shield-and-pci-dss-compliance)
19. [CSP HTTP header format](#csp-http-header-format)
20. [Roles and permissions](#roles-and-permissions)
21. [Page Shield API](#page-shield-api)
22. [Troubleshooting](#troubleshooting)
23. [Detection](#detection)
24. [Best practices](#best-practices)
25. [Reference](#reference)

---

## Cloudflare Page Shield

**來源**: [https://developers.cloudflare.com/page-shield/](https://developers.cloudflare.com/page-shield/)

Page options # Cloudflare Page Shield

Ensures the safety and privacy of your website visitors' browsing environment.

Available on all plans Page Shield helps manage resources loaded by your website visitors — including scripts, their connections, and cookies — and triggers alert notifications when resources change or are considered malicious.

Learn how to get started.

## Features

### Resource monitoring

Displays information about client-side resources loaded in your domain's
pages.

Monitor client-side resources ### Page attribution

Find in which page a resource first appeared, and view a list of the latest
occurrences of the resource in your pages.

Find resource occurrences ### Malicious script detection

Detects malicious scripts in your pages using threat intelligence and machine
learning.

Review malicious scripts ### Code change detection

Detects any changes in the scripts loaded in your pages.

Review changed scripts ### Alerts

Receive notifications about newly detected scripts, scripts loaded from
unknown domains, new scripts considered malicious, or code changes in your
existing scripts.

Use Alerts ### Policies

Policies define allowed resources on your websites. Use policies to enforce an
allowlist of resources, effectively blocking resources not included in your
policies.

Use Policies ## Availability

|  | Free | Pro | Business | Enterprise | Enterprise with add-on |
| --- | --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes | Yes |
| Script monitoring | Yes | Yes | Yes | Yes | Yes |
| Connection monitoring | No | No | Yes | Yes | Yes |
| Cookie monitoring | No | No | Yes | Yes | Yes |
| Page attribution | No | No | Yes | Yes | Yes |
| New Resources Alerts
and New Domain Alerts | No | No | Yes | Yes | Yes |
| Malicious script detection
 and alerting | No | No | No | No | Yes |
| Code change detection
 and alerting | No | No | No | No | Yes |
| Malicious connection detection
 and alerting | No | No | No | No | Yes |
| Cookie monitoring
 advanced fields | No | No | No | No | Yes |
| Number of policies
(positive blocking) | 0 | 0 | 0 | 0 | 5 |
| Number of Logpush jobs | 0 | 0 | 0 | 0 | 4 |

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/page-shield/get-started/](https://developers.cloudflare.com/page-shield/get-started/)

Page options # Get started

## Activate client-side resource monitoring

To enable client-side resource monitoring:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Page Shield.
3. Select Enable Page Shield.

If you do not have access to Page Shield in the Cloudflare dashboard, check if your user has one of the necessary roles.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Client-side abuse.
3. Turn on Continuous script monitoring.

If you do not have access to resource monitoring in the Cloudflare dashboard, check if your user has one of the necessary roles.

## Review detected resources

When you enable client-side resource monitoring, it may take a while to get the list of detected scripts in your domain.

To review the scripts detected by Cloudflare:

1. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
2. Old dashboard: Go to Security > Page Shield.
3. New security dashboard: Go to Security > Web assets > Client-side resources tab.
4. Review the list of detected scripts, checking for any unknown or unexpected scripts.
Depending on your plan, Cloudflare will also:

Inform you if a script is considered malicious.
Show the details about each detected script.
5. Inform you if a script is considered malicious.
6. Show the details about each detected script.

Depending on your plan, you may be able to also review the connections made by scripts in your domain's pages and check them for malicious activity.

## Configure alerts

Once you have activated Page Shield's client-side resource monitoring, you can set up one or more alerts informing you of relevant client-side changes on your zones. The available alert types depend on your Cloudflare plan.

To configure an alert:

1. In the Cloudflare dashboard, go to the Notifications page.
  Go to Notifications
2. Choose Add and then select Page Shield in the Product dropdown.
3. Select an alert type.
4. Enter the notification name and description.
5. (Optional) If you are an Enterprise customer with a paid add-on, you can define the zones for which you want to filter alerts in Policies of these zones. This option requires that you define allow policies in the selected zones.
6. Select one or more notification destinations (notification email, webhooks, and connected notification services).
7. Select Create.

## Define policies

Note

Only available to Enterprise customers with a paid add-on.

Policies — called content security rules in the new security dashboard — define allowed resources on your websites. Create policies to implement a positive security model1.

### 1. Create a policy with the Log action

When you create a policy with the Log action, Cloudflare logs any resources not covered by the policy, without blocking any resources. Use this action to validate a new policy before deploying it.

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Page Shield > Policies.
3. Select Create policy.
4. Enter a descriptive name for the rule in Description.
5. Under If incoming requests match, define the policy scope. You can use the Expression Builder (specifying one or more values for Field, Operator, and Value) or manually enter an expression using the Expression Editor. For more information, refer to Edit expressions in the dashboard.
6. Under Allow these directives, select the desired CSP directives for the policy by enabling one or more checkboxes.


To manually enter an allowed source, select Add source.


To refresh the displayed sources based on Page Shield's detected resources, select Refresh suggestions.
NotePage Shield provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
7. To manually enter an allowed source, select Add source.
8. To refresh the displayed sources based on Page Shield's detected resources, select Refresh suggestions.
NotePage Shield provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
9. Under Then take action, select Log.
10. To save and deploy your rule, select Deploy.

Note

In the new security dashboard, policies are called content security rules.

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Security rules.
3. Select Create > Content security rules.
4. Enter a descriptive name for the rule in Description.
5. Under If incoming requests match, define the scope of the content security rule (or policy). You can use the Expression Builder (specifying one or more values for Field, Operator, and Value) or manually enter an expression using the Expression Editor. For more information, refer to Edit expressions in the dashboard.
6. Under Allow these directives, select the desired CSP directives for the content security rule by enabling one or more checkboxes.


To manually enter an allowed source, select Add source.


To refresh the displayed sources based on detected resources, select Refresh suggestions.
NoteCloudflare provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
7. To manually enter an allowed source, select Add source.
8. To refresh the displayed sources based on detected resources, select Refresh suggestions.
NoteCloudflare provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
9. Under Then take action, select Log.
10. To save and deploy your rule, select Deploy.

### 2. Review policy violations

Resources not covered by the policy you created will be reported as policy violations. After some time, review the list of policy violations to make sure the policy is correct.

To view policy violation information:

- Old dashboard: Go to Security > Page Shield > Policies.
- New security dashboard: Go to Security > Security rules, and filter by Content security rules.

The displayed information includes the following:

- A sparkline next to the policy/rule name, showing violations in the past seven days.
- For policies with associated violations, an expandable details section for each policy, with the top resources present in violation events and a sparkline per top resource.

Update the policy if needed.

### 3. Change policy action to Allow

Once you have verified that your policy is correct, change the policy action from Log to Allow.

When you use the Allow action, Cloudflare starts blocking any resources not explicitly allowed by the policy.

## Footnotes

1. A positive security model is one that defines what is allowed and rejects everything else. In contrast, a negative security model defines what will be rejected and accepts the rest. ↩

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## How Page Shield works

**來源**: [https://developers.cloudflare.com/page-shield/how-it-works/](https://developers.cloudflare.com/page-shield/how-it-works/)

Page options # How Page Shield works

Page Shield helps manage client-side resources loaded by your website visitors, including scripts, their connections, and cookies ↗. It can trigger alert notifications when resources change or are considered malicious.

Enabling resource monitoring adds a Content Security Policy (CSP) deployed with a report-only directive to collect information from the browser. This allows Cloudflare to provide you with a list of all scripts running on your application and the connections they make to third-party endpoints. Cloudflare also monitors ingress and egress traffic for cookies, either set by origin servers or by the visitor's browser.

The client-side resource monitoring dashboard shows the list of active scripts, connections, and cookies. The All Reported Scripts and All Reported Connections dashboards show the full list of detected scripts and connections in your domain, respectively, including infrequent and inactive ones.

Cloudflare adds a CSP report-only HTTP header used to monitor webpage resources to a sample of sent responses. This means that there may be a small delay between deploying a script or cookie and having its data displayed in the resource monitoring dashboards.

Enterprise customers with a paid add-on have access to additional classification mechanisms based on threat feeds to determine if a script, or a connection made by a script, is malicious. For more information, refer to Malicious script and connection detection.

## Positive security model using policies

Enterprise customers with a paid add-on can create policies to define a positive security model (also known as positive blocking) for resources such as scripts.

When you create policies, Cloudflare will generate CSP directives from those policies based on their configuration:

- Log policies will create CSP directives for the Content-Security-Policy-Report-Only HTTP header.
- Allow policies will create CSP directives for the Content-Security-Policy HTTP header.

For more information, refer to Policies.

## Learn more

For more background on Page Shield and client-side resource monitoring, refer to our blog post ↗.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Malicious script and connection detection

**來源**: [https://developers.cloudflare.com/page-shield/how-it-works/malicious-script-detection/](https://developers.cloudflare.com/page-shield/how-it-works/malicious-script-detection/)

Page options # Malicious script and connection detection

Note

This feature is available as a paid add-on for customers on an Enterprise plan.

Cloudflare uses different mechanisms to determine if a script, or a connection made by a script, is malicious. These mechanisms are:

- Malicious script detection
- Malicious URL checks
- Malicious domain checks

Any updates to the threat feeds will trigger new checks for previously detected scripts or connections so that the client-side resource monitoring dashboards always reflect the latest categorization.

## Malicious script detection

In this type of detection, Cloudflare will download the script file and run it through a classifier. The classifier is a machine learning (ML) model that has learned to detect patterns of malicious operations such as Magecart-type attacks ↗.

The script classifier will output a probability score for the script (also called the JS integrity score) between 1 and 99, where 1 means definitely malicious and 99 means definitely not malicious. This score, together with a threshold value, will determine if the malicious script detection system will classify the script as malicious or not.

The score threshold for considering a script as malicious is currently set to 10. If the script classification score is below this value, the monitoring dashboards will display the script as being malicious.

In addition to the integrity score, Cloudflare will also provide individual scores for different malicious code detections (scores from 1 to 99):

- Magecart
- Crypto mining
- Malware

You can configure Malicious Script Alerts to receive an alert notification as soon as Cloudflare detects JavaScript code classified as malicious in your domain.

## Malicious URL checks

Cloudflare will search for the URLs of your JavaScript dependencies in threat intelligence feeds to determine if any of those scripts should be categorized as malicious.

The client-side resource monitoring dashboards display the scripts that were considered malicious at the top of the scripts list.

You can configure Malicious URL Alerts to receive an alert notification as soon as Cloudflare detects a script from a malicious URL in your domain.

Depending on your current configuration, Cloudflare can also search for malicious URLs in the URLs of outgoing connections made by scripts in your domain. To enable this check, you must allow resource monitoring to use the full URLs of outgoing connections instead of only the hostname in the settings page.

## Malicious domain checks

Cloudflare will search for the domains of your client-side JavaScript dependencies in threat feeds to determine if any of those scripts is being served from a known malicious domain.

A domain previously reported as malicious can later be reported as non-malicious if, after further analysis, the domain is deemed safe.

Cloudflare will also check the target domains of connections made by scripts in your domain's pages, following the same approach described for scripts.

You can configure Malicious Domain Alerts to receive an alert notification as soon as Cloudflare detects a malicious script loaded from a known malicious domain in your domain.

## Malicious script and connection categories

Scripts and connections considered malicious are categorized based on data from threat intelligence feeds. The current categories are the following:

- Security threats
- Command-and-Control (C2) & Botnet
- Crypto mining
- Spyware
- Phishing
- Malware
- Domain Generation Algorithm (DGA) domain
- Typosquatting & Impersonation

Each script or connection considered malicious can belong to several categories.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Monitor resources and cookies

**來源**: [https://developers.cloudflare.com/page-shield/detection/monitor-connections-scripts/](https://developers.cloudflare.com/page-shield/detection/monitor-connections-scripts/)

Page options # Monitor resources and cookies

Once you activate Page Shield's client-side resource monitoring, the main client-side resources dashboard will show which resources (scripts and connections) are running on your domain, as well as the cookies recently detected in HTTP traffic.

If you notice unexpected scripts or connections on the dashboard, check them for signs of malicious activity. Enterprise customers with a paid add-on will have their connections and scripts classified as potentially malicious based on threat feeds. You should also check for any new or unexpected cookies.

Notes

- Users in Free and Pro plans only have access to script monitoring.
- If you recently activated client-side resource monitoring, you may see a delay in reporting.

## Use the client-side resources dashboards

To review the resources detected by Cloudflare:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Review the list of scripts, connections, and cookies for your domain, depending on your plan. To apply a filter, select Add filter and use one or more of the available options.
Available filters
Status: Filter scripts or connections by status.
Script URL: Filter scripts by their URL.
Connection URL: Filter connections by their target URL. Depending on your configuration, it may search only by target hostname.
Seen on host: Look for scripts appearing on specific hostnames, or connections made in a specific hostname.
Seen on page (requires a Business or Enterprise plan): Look for scripts appearing in a specific page, or for connections made in a specific page. Searches the first page where the script was loaded (or where the connection was made) and the latest occurrences list.
Type: Filter cookies according to their type: first-party cookies or unknown.
Cookie property: Filter by a cookie property such as Name, Domain, Path, Same site, HTTP only, and Secure.
6. Status: Filter scripts or connections by status.
7. Script URL: Filter scripts by their URL.
8. Connection URL: Filter connections by their target URL. Depending on your configuration, it may search only by target hostname.
9. Seen on host: Look for scripts appearing on specific hostnames, or connections made in a specific hostname.
10. Seen on page (requires a Business or Enterprise plan): Look for scripts appearing in a specific page, or for connections made in a specific page. Searches the first page where the script was loaded (or where the connection was made) and the latest occurrences list.
11. Type: Filter cookies according to their type: first-party cookies or unknown.
12. Cookie property: Filter by a cookie property such as Name, Domain, Path, Same site, HTTP only, and Secure.
13. Depending on your plan, you may be able to view the details of each item.

## View all reported scripts or connections

The All Reported Connections and All Reported Scripts dashboards show all the detected resources including infrequent or inactive ones, reported in the last 30 days. After 30 days without any report, Cloudflare will delete information about a previously reported resource, and it will no longer appear in any of the dashboards.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select Scripts or Connections.
6. Select View all scripts or View all connections.
7. Review the information displayed in the dashboard.

You can filter the data in these dashboards using different criteria, and print a report with the displayed records.

## View details

Note

Only available to customers on Business and Enterprise plans.

To view the details of an item:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select Scripts, Connections, or Cookies (the available options depend on your plan).
6. Next to a script, connection, or cookie in the list, select Details.

### Script and connection details

The details of each connection or script include:

- Last seen: How long ago the resource was last detected (in the last 30 days).
- First seen at: The date and time when the resource was first detected.
- Seen on host: The host where the script is being loaded or the connection is being made.
- Seen on pages: The most recent pages where the resource was detected (up to ten pages).
- First seen on: The page where the resource was first detected.

The script details also include the last 10 script versions detected by Page Shield.

Note

The Hash value shown in the script details for each script version is an internal identifier. This differs from the file content hash defined by Subresource Integrity (SRI) ↗ that is required to be used in Page Shield policies.

### Cookie details

The details of each cookie include:

- Type: A cookie can have the following types:

First-party: Cookies set by the origin server through a set-cookie HTTP response header.
Unknown: All other detected cookies.
- First-party: Cookies set by the origin server through a set-cookie HTTP response header.
- Unknown: All other detected cookies.
- Domain: The value of the Domain cookie attribute. When not set or unknown, this value is derived from the host.
- Path: The value of the Path cookie attribute. When not set or unknown, this value is derived from the most recent page where the cookie was detected.
- Last seen: How long ago the resource was last detected (in the last 30 days).
- First seen at: The date and time when the cookie was first detected.
- Seen on host: The host where the cookie was first detected.
- Seen on pages: The most recent pages where the cookie was detected (up to ten pages).
- Additional cookie attributes (only available to Enterprise customers with a paid add-on):

Max age: The value of the Max-Age cookie attribute.
Expires: The value of the Expires cookie attribute.
Lifetime: The approximate cookie lifetime, based on the Max-Age and Expires cookie attributes.
HTTP only: The value of the HttpOnly cookie attribute.
Secure: The value of the Secure cookie attribute.
Same site: The value of the SameSite cookie attribute.
- Max age: The value of the Max-Age cookie attribute.
- Expires: The value of the Expires cookie attribute.
- Lifetime: The approximate cookie lifetime, based on the Max-Age and Expires cookie attributes.
- HTTP only: The value of the HttpOnly cookie attribute.
- Secure: The value of the Secure cookie attribute.
- Same site: The value of the SameSite cookie attribute.

Except for Domain and Path, standard cookie attributes ↗ are only available for first-party cookies, where Cloudflare detected the set-cookie HTTP response header in HTTP traffic.

## Export data

Note

Only available to Enterprise customers with a paid add-on.

Use this feature to extract data from Page Shield that you can review and annotate. The data in the exported file will honor any filters you configure in the dashboard.

To export script, connection, or cookie information in CSV format:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select Scripts, Connections, or Cookies.
6. (Optional) Apply any filters to the displayed data.
7. Select Download CSV.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Review resources considered malicious

**來源**: [https://developers.cloudflare.com/page-shield/detection/review-malicious-scripts/](https://developers.cloudflare.com/page-shield/detection/review-malicious-scripts/)

Page options # Review resources considered malicious

Note

Only available to Enterprise customers with a paid add-on.

Cloudflare displays scripts and connections considered malicious at the top of the dashboard lists, so that you can quickly identify those resources, review them, and take action.

## Review malicious scripts

To review the scripts considered malicious:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select the Scripts tab.
6. Select Details for each script considered malicious. The script details will contain:

Malicious code analysis: Scores between 1-99 classifying how malicious the current script version is, where 1 means definitely malicious and 99 means definitely not malicious.
Code behavior analysis: Scores classifying the behavior of the current script version in terms of code obfuscation and data exfiltration. The scores vary between 1-99, where 1 means definitely malicious and 99 means definitely not malicious.
Threat intelligence: Whether the script URL and/or domain is known to be malicious according to threat intelligence feeds. If the script is considered malicious according to the feeds, the dashboard will show a list of associated threat categories. If threat intelligence feeds do not have any information about the script URL or domain, the dashboard will show Not present.

The script details also include the last 10 script versions detected by Cloudflare.
NoteThe Hash value shown in the script details for each script version is an internal identifier. This differs from the file content hash defined by Subresource Integrity (SRI) ↗ that is required to be used in Page Shield policies.
For more information, refer to Malicious script and connection detection.
7. Malicious code analysis: Scores between 1-99 classifying how malicious the current script version is, where 1 means definitely malicious and 99 means definitely not malicious.
8. Code behavior analysis: Scores classifying the behavior of the current script version in terms of code obfuscation and data exfiltration. The scores vary between 1-99, where 1 means definitely malicious and 99 means definitely not malicious.
9. Threat intelligence: Whether the script URL and/or domain is known to be malicious according to threat intelligence feeds. If the script is considered malicious according to the feeds, the dashboard will show a list of associated threat categories. If threat intelligence feeds do not have any information about the script URL or domain, the dashboard will show Not present.
10. Based on the displayed information, and with the help of the last seen/first seen fields in the script details, review and update the pages where the malicious script was detected.

You can configure alerts for detected malicious scripts. Refer to Alerts for more information.

## Review malicious connections

To review the connections considered malicious:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select Connections.
6. Select Details for each connection considered malicious. The connection details will contain:

URL match: Whether the connection's target URL is known to be malicious according to threat intelligence feeds. This field requires that you configure Page Shield to analyze the full URI of outgoing connections.
Domain match: Whether the connection's target domain is known to be malicious according to threat intelligence feeds.
Category: The categorization of the connection considered malicious according to threat intelligence feeds.

For more information, refer to Malicious script and connection detection.
7. URL match: Whether the connection's target URL is known to be malicious according to threat intelligence feeds. This field requires that you configure Page Shield to analyze the full URI of outgoing connections.
8. Domain match: Whether the connection's target domain is known to be malicious according to threat intelligence feeds.
9. Category: The categorization of the connection considered malicious according to threat intelligence feeds.
10. Based on the displayed information, and with the help of the last seen/first seen fields in the connection details, review and update the pages where the malicious connection was detected.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Review changed scripts

**來源**: [https://developers.cloudflare.com/page-shield/detection/review-changed-scripts/](https://developers.cloudflare.com/page-shield/detection/review-changed-scripts/)

Page options # Review changed scripts

Note

Available as a paid add-on for customers on an Enterprise plan.

Cloudflare analyzes the JavaScript dependencies in the pages of your domain over time.

You can configure a notification for code change alerts to receive a daily notification about changed scripts in your domain.

When you receive such a notification:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to the client-side resources page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Check the details of each changed script and validate if it is an expected change.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/page-shield/alerts/](https://developers.cloudflare.com/page-shield/alerts/)

Page options # Alerts

Note

New resource alerts require a Business plan or higher. Code change and malicious resource alerts require an Enterprise plan with a paid add-on. For details, refer to Alert types.

Once you have activated Page Shield's client-side resource monitoring, you can set up one or more alerts informing you of relevant client-side changes on your zones.

You can configure unscoped or scoped alerts:

- Unscoped alert: An alert configured for all zones in your Cloudflare account. Unscoped alerts are trigged either daily, hourly, or immediately, depending on the alert type.
- Scoped alert: An alert scoped to one or more zones. You must configure policies for the zones you select to receive any notifications. Scoped alerts are triggered immediately. Policy violations will not trigger an alert. For more information, refer to Scoped alerts.
NoteCloudflare only takes into account policies in allow mode for scoped alerts.

For alerts sent at regular intervals, you might experience a delay between adding a new script and receiving an alert.

For instructions on configuring alerts, refer to Configure an alert.

## Scoped alerts

Note

Applies to Enterprise customers with a paid add-on.

If you have configured allow policies in a zone — policies which allow specific scripts and connections and block everything else — you can filter alert notifications according to those policies. These alerts are called scoped alerts.

When you create a scoped alert using the Policies of these zones alert filter, you will only receive the most relevant notifications based on the values of the allow policies you configured.

For each scoped alert, Cloudflare does the following:

1. Check which allow policies in a zone are enabled.
2. For every enabled policy, compare the URL of the new or changed resource against the allowed sources in the policy.
3. If the resource is allowed by the policy, check if the new or modified resource should trigger the current alert.
4. If the alert should trigger, send an alert notification to the configured destinations.

When you create a scoped alert you will not receive notifications for resources blocked by an allow policy. These are policy violations that you can review in the dashboard, through GraphQL, or via Logpush.

Note

You will not receive notifications for a scoped alert in the following cases:

- No configured policies in the zone
- Policy configured in log mode
- Policy is not enabled

For unscoped alerts, you will receive alerts for resources detected in all your zones, and you may receive alerts about resources that are blocked by one of your configured allow policies.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Configure an alert

**來源**: [https://developers.cloudflare.com/page-shield/alerts/configure/](https://developers.cloudflare.com/page-shield/alerts/configure/)

Page options # Configure an alert

To configure an alert:

1. In the Cloudflare dashboard, go to the Notifications page.
  Go to Notifications
2. Choose Add and then select Page Shield in the Product dropdown.
3. Select an alert type.
4. Enter the notification name and description.
5. (Optional) If you are an Enterprise customer with a paid add-on, you can define the zones for which you want to filter alerts in Policies of these zones. This option requires that you define allow policies in the selected zones.
6. Select one or more notification destinations (notification email, webhooks, and connected notification services).
7. Select Create.

## Manage alerts

To edit, delete, or disable an alert, go to the Notifications page.

Go to Notifications ## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Alert types

**來源**: [https://developers.cloudflare.com/page-shield/alerts/alert-types/](https://developers.cloudflare.com/page-shield/alerts/alert-types/)

Page options # Alert types

You can configure alerts for resources detected in your domain. Refer to Alerts for more information.

## New resource alerts

Note

Requires a Business plan or higher.

Page Shield New Resources Alert

Who is it for? Page Shield customers who want to receive a notification when new resources appear in their domain.

Other options / filters None.

Included with Business plans or higher.

What should you do if you receive one? Investigate to confirm that it is an expected change.

Additional information Triggered daily. If configured with a zone filter, the alert is triggered immediately.

Page Shield New Domain Alert

Who is it for? Page Shield customers who want to receive a notification when resources from new host domains appear in their domain.

Other options / filters None.

Included with Business plans or higher.

What should you do if you receive one? Investigate to confirm that it is an expected change.

Additional information Triggered hourly. If configured with a zone filter, the alert is triggered immediately.

Page Shield New Resource Exceeds Max URL Length Alert

Who is it for? Page Shield customers who want to receive a notification when a resource's URL exceeds the maximum allowed length.

Other options / filters None.

Included with Business plans or higher.

What should you do if you receive one? Manually check the resource.

## Code change alert

Note

Requires an Enterprise plan with a paid add-on.

Page Shield New Code Change Detection Alert

Who is it for? Page Shield customers who want to receive a notification when JavaScript dependencies change in the pages of their domain.

Other options / filters None.

Included with Enterprise plans with paid add-on.

What should you do if you receive one? Investigate to confirm that it is an expected change.

Additional information Triggered daily. If configured with a zone filter, the alert is triggered immediately.

## Malicious resource alerts

Note

Requires an Enterprise plan with a paid add-on.

Page Shield New Malicious Domain Alert

Who is it for? Page Shield customers who want to receive a notification when resources from a known malicious domain appear in their domain. For more information, refer to Malicious script and connection detection.

Other options / filters None.

Included with Enterprise plans with paid add-on.

What should you do if you receive one? Review the information in the Page Shield dashboard about the detected malicious resources, then update the pages where those resources were detected.

For more information, refer to Review scripts and connections considered malicious.

Page Shield New Malicious URL Alert

Who is it for? Page Shield customers who want to receive a notification when resources from a known malicious URL appear in their domain. For more information, refer to Malicious script and connection detection.

Other options / filters None.

Included with Enterprise plans with paid add-on.

What should you do if you receive one? Review the information in the Page Shield dashboard about the detected malicious resources, then update the pages where those resources were detected.

For more information, refer to Review scripts and connections considered malicious.

Page Shield New Malicious Script Alert

Who is it for? Page Shield customers who want to receive a notification when Cloudflare classifies JavaScript dependencies in their domain as malicious. For more information, refer to Malicious script and connection detection.

Other options / filters None.

Included with Enterprise plans with paid add-on.

What should you do if you receive one? Review the information in the Page Shield dashboard about the detected malicious resources, then update the pages where those resources were detected.

For more information, refer to Review scripts and connections considered malicious.

Malicious resource alerts will only include resources with an Active status. Refer to Script and connection statuses for more information.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Policies

**來源**: [https://developers.cloudflare.com/page-shield/policies/](https://developers.cloudflare.com/page-shield/policies/)

Page options # Policies

Note

Only available to Enterprise customers with a paid add-on.

Policies define the resources allowed on your applications through Content Security Policy (CSP) directives. Policies can log violations and also enforce an allowlist of resources, effectively blocking resources not included in the policies.

In the new security dashboard, policies are called content security rules, and they are one of the available types of security rules. Security rules perform security-related actions on incoming requests that match specified filters.

Create allow policies to define a positive security model, also known as positive blocking. According to this model, you define what is allowed and reject everything else. Such an approach helps you reduce the attack surface for unwanted third-party scripts in your application.

A policy can control both client-side resources monitored by Cloudflare, such as scripts and their connections, and other types of resources. Refer to Supported CSP directives for details.

### Important remarks

Third-party service providers may require specific CSP directives. Refer to your provider's documentation for more information on the CSP directives you need to include in your policy.

## Policy actions

A policy — or content security rule — can perform one of the following actions:

- Log: Cloudflare will log any resources not covered by the policy, without blocking any resources. Use this action to validate a new policy before deploying it. Resources not covered by the policy will be reported as policy violations.
- Allow: Cloudflare will block any resources not explicitly allowed by the policy. Switch to the Allow action after validating a new policy with the Log action, so that your policy does not block essential application resources, which would affect your application's end users. Policies with the Allow action will log policy violations for any blocked resources.

For details on the CSP directives Cloudflare creates for each type of policy action, refer to How Page Shield works. For more information on the CSP directives supported by policies, refer to Supported CSP directives.

## Next steps

Refer to the following pages for instructions on creating a policy or content security rule:

- Create a policy in the dashboard
- Page Shield API: Create a policy

Once you have configured one or more allow policies in a zone, you can filter alert notifications according to those policies. These alerts are called scoped alerts.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Create a policy in the dashboard

**來源**: [https://developers.cloudflare.com/page-shield/policies/create-dashboard/](https://developers.cloudflare.com/page-shield/policies/create-dashboard/)

Page options # Create a policy in the dashboard

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Page Shield > Policies.
3. Select Create policy.
4. Enter a descriptive name for the rule in Description.
5. Under If incoming requests match, define the policy scope. You can use the Expression Builder (specifying one or more values for Field, Operator, and Value) or manually enter an expression using the Expression Editor. For more information, refer to Edit expressions in the dashboard.
6. Under Allow these directives, select the desired CSP directives for the policy by enabling one or more checkboxes.


To manually enter an allowed source, select Add source.


To refresh the displayed sources based on Page Shield's detected resources, select Refresh suggestions.
NotePage Shield provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
7. To manually enter an allowed source, select Add source.
8. To refresh the displayed sources based on Page Shield's detected resources, select Refresh suggestions.
NotePage Shield provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
9. Under Then take action, select the desired action:Allow: Enforces the CSP directives configured in the policy, blocking any other resources from being loaded on your website, and logging any policy violations.Log: Logs any policy violations without blocking any resources not covered by the policy.
10. Allow: Enforces the CSP directives configured in the policy, blocking any other resources from being loaded on your website, and logging any policy violations.
11. Log: Logs any policy violations without blocking any resources not covered by the policy.
12. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

Note

In the new security dashboard, policies are called content security rules.

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to Security > Security rules.
3. Select Create > Content security rules.
4. Enter a descriptive name for the rule in Description.
5. Under If incoming requests match, define the scope of the content security rule (or policy). You can use the Expression Builder (specifying one or more values for Field, Operator, and Value) or manually enter an expression using the Expression Editor. For more information, refer to Edit expressions in the dashboard.
6. Under Allow these directives, select the desired CSP directives for the content security rule by enabling one or more checkboxes.


To manually enter an allowed source, select Add source.


To refresh the displayed sources based on detected resources, select Refresh suggestions.
NoteCloudflare provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
7. To manually enter an allowed source, select Add source.
8. To refresh the displayed sources based on detected resources, select Refresh suggestions.
NoteCloudflare provides suggestions for Default, Scripts, and Connections directives. For the Default directive, suggestions are based on monitored scripts and connections resources.
9. Under Then take action, select the desired action:Allow: Enforces the CSP directives configured in the policy, blocking any other resources from being loaded on your website, and logging any policy violations.Log: Logs any policy violations without blocking any resources not covered by the policy.
10. Allow: Enforces the CSP directives configured in the policy, blocking any other resources from being loaded on your website, and logging any policy violations.
11. Log: Logs any policy violations without blocking any resources not covered by the policy.
12. To save and deploy your rule, select Deploy. If you are not ready to deploy your rule, select Save as Draft.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Policy violations

**來源**: [https://developers.cloudflare.com/page-shield/policies/violations/](https://developers.cloudflare.com/page-shield/policies/violations/)

Page options # Policy violations

Note

Only available to Enterprise customers with a paid add-on.

Shortly after you configure policies (or content security rules), the Cloudflare dashboard will start displaying any violations of those policies. This information will be available for policies with any action (Allow and Log).

Information about policy violations is also available via GraphQL API and Logpush.

## Review policy violations in the dashboard

To view policy violation information:

- Old dashboard: Go to Security > Page Shield > Policies.
- New security dashboard: Go to Security > Security rules, and filter by Content security rules.

The displayed information includes the following:

- A sparkline next to the policy/rule name, showing violations in the past seven days.
- For policies with associated violations, an expandable details section for each policy, with the top resources present in violation events and a sparkline per top resource.

## Get policy violations via GraphQL API

Use the Cloudflare GraphQL API to obtain policy violation information through the following dataset:

- pageShieldReportsAdaptiveGroups

You can query the dataset for policy violations occurred in the past 30 days.

Use introspection to explore the available fields the GraphQL schema. For more information, refer to Explore the GraphQL schema.

For an introduction to GraphQL querying, refer to Querying basics.

### Example

Example GraphQL query ```
query PageShieldReports(  $zoneTag: string  $datetimeStart: Time  $datetimeEnd: Time) {  viewer {    zones(filter: { zoneTag: $zoneTag }) {      pageShieldReportsAdaptiveGroups(        limit: 100        orderBy: [datetime_ASC]        filter: { datetime_geq: $datetimeStart, datetime_leq: $datetimeEnd }      ) {        avg {          sampleInterval        }        count        dimensions {          policyID          datetime          datetimeMinute          datetimeFiveMinutes          datetimeFifteenMinutes          datetimeHalfOfHour          datetimeHour          url          urlHost          host          resourceType          pageURL          action        }      }    }  }}
```

Run in GraphQL API Explorer Example curl request

Terminal window ```
echo '{ "query":  "query PageShieldReports($zoneTag: string, $datetimeStart: string, $datetimeEnd: string) {    viewer {      zones(filter: {zoneTag: $zoneTag}) {        pageShieldReportsAdaptiveGroups(limit: 100,  orderBy: [datetime_ASC], filter: {datetime_geq:$datetimeStart, datetime_leq:$datetimeEnd}) {          avg {            sampleInterval          }          count          dimensions {            policyID            datetime            datetimeMinute            datetimeFiveMinutes            datetimeFifteenMinutes            datetimeHalfOfHour            datetimeHour            url            urlHost            host            resourceType            pageURL            action          }        }      }    }  }",  "variables": {    "zoneTag": "<CLOUDFLARE_ZONE_ID>",    "datetimeStart": "2023-04-17T11:00:00Z",    "datetimeEnd": "2023-04-24T12:00:00Z"  }}' | tr -d '\n' | curl --silent \https://api.cloudflare.com/client/v4/graphql \--header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \--header "Content-Type: application/json" \--data @-
```

## Get policy violations via Logpush

Cloudflare Logpush supports pushing logs to storage services, SIEM systems, and log management providers.

Information about policy violations is available in the page_shield_events dataset.

For more information on configuring Logpush jobs, refer to Logpush documentation.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Supported CSP directives

**來源**: [https://developers.cloudflare.com/page-shield/policies/csp-directives/](https://developers.cloudflare.com/page-shield/policies/csp-directives/)

Page options # Supported CSP directives

Page Shield policies support most Content Security Policy (CSP) directives, covering both monitored and unmonitored resources. You can use a policy to control other types of resources besides scripts and their connections, even though Cloudflare is not monitoring these resources.

Each CSP directive can contain multiple values, including:

- Schemes
- Hostnames
- URIs
- Special keywords between single quotes (for example, 'none')
- Hashes between single quotes (for example, 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC')

Hostname and URI values support a * wildcard for the leftmost subdomain.

The following table lists the supported CSP directives and special values you can use in policies:

| Directive | Name in the dashboard | Supported special values | Monitored |
| --- | --- | --- | --- |
| script-src | Scripts | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | Yes |
| connect-src | Connections | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | Yes |
| default-src | Default | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| img-src | Images | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| style-src | Styles | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| font-src | Fonts | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| object-src | Objects | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| media-src | Media | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| child-src | Child | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| form-action | Form actions | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| worker-src | Workers | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| base-uri | Base URI | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| manifest-src | Manifests | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| frame-src | Frames | 'none''self''unsafe-inline''unsafe-eval''<HASH>' | No |
| frame-ancestors | Frame ancestors | 'none''self' | No |
| upgrade-insecure-requests | Upgrade insecure requests | N/A | No |

## More resources

For more information on CSP directives and their values, refer to the following resources in the MDN documentation:

- Content-Security-Policy response header ↗
- CSP guide ↗

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Handle a client-side resource alert

**來源**: [https://developers.cloudflare.com/page-shield/best-practices/handle-an-alert/](https://developers.cloudflare.com/page-shield/best-practices/handle-an-alert/)

Page options # Handle a client-side resource alert

Last reviewed: 3 months ago If you receive a client-side resource alert, sometimes you need to perform some manual investigation to confirm the nature of the script. Use the guidance provided in this page as a starting point for your investigation.

## 1. Understand what triggered the alert

Start by identifying the detection system that triggered the alert. A link is provided in the alert that will send you directly to the Cloudflare dashboard to the relevant resource that needs reviewing. Alternatively, do the following:

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Navigate to the client-side resource monitoring page:

Old dashboard: Go to Security > Page Shield.
New security dashboard: Go to Security > Web assets > Client-side resources tab.
3. Old dashboard: Go to Security > Page Shield.
4. New security dashboard: Go to Security > Web assets > Client-side resources tab.
5. Select Scripts or Connections and search for the resource mentioned on the alert you received.
6. Select Details next to the resource you identified. The example screenshot below shows a malicious script resource.

The details page will specify which detection system triggered the alert. Check the values of the following fields:

- Malicious code
- Malicious URL
- Malicious domain

Different detection mechanisms may consider the script malicious at the same time. This increases the likelihood of the detection not being a false positive.

## 2. Find the page where the resource was detected

If you received an alert for a potentially malicious script:

1. Navigate to the page on your website that is loading the script or performing the connection. Open a browser and navigate to one of the URLs in the Page URLs field (shown in the script details dialog box).
2. Open the browser's developer tools to confirm that the script is being loaded. You can check this in the developer tools' Network tab, searching for the script name, URL, or hostname.

If you received an alert for a potentially malicious connection:

1. Go to the page on your website where the connection that triggered the alert is being made. Open a browser and go to one of the URLs specified in the Page URLs field (shown in the connection details dialog box).
2. Open the browser's developer tools to confirm that the connection is being made. You can check this in the developer tools' Network tab, searching for the target hostname of the connection.

If you find the script or connection, this means the script is being loaded (or the connection is being established) for all website visitors — proceed to step 3.

If you do not find the script being loaded or the connection being made, this could mean one of the following:

- The script is being loaded (or the connection is being made) by visitors' browser extensions.
- Your current state will not load the script or make the connection. Complex applications might load scripts and establish connections based on state.
- You are not in the correct geographic location (or similar condition).
- The attacker is only loading the script or making the connection for a percentage of visitors or visitors with specific browsers/signatures.

In this case, in addition to the steps indicated below, the best approach is:

- From a safe virtual environment, use online search tools and search for the given resource. Review results and resource metadata, for example domain registration details;
- If in doubt, scan the application codebase for the resource and if found, clarify the purpose.

## 3. Check the script reputation

If Cloudflare considers the resource’s domain a "malicious domain", it is likely that the domain does not have a good reputation. The domain may be known for hosting malware or for being used for phishing attacks. Usually, reviewing the domain/hostname is sufficient to understand why you received the alert. You can use tools like Cloudflare's Security Center Investigate ↗ platform to help with this validation.

If Cloudflare's internal systems classified the script as containing "malicious code", external tools may not confirm the detection you got from Page Shield, since the machine learning (ML) model being used is Cloudflare-specific technology.

If you believe that Cloudflare's classification is a false positive, contact your account team so that we can further improve Page Shield's underlying technology.

## 4. (Optional) Analyze the script content

You could use a virtual machine to perform some of the following analysis:

1. Open the script URL and get the script source code. If the script is obfuscated or encoded, this could be a sign that the script is malicious.
2. Scan the script source code for any hostnames or IP addresses.
3. For each hostname or IP address you identified, use Cloudflare's Security Center Investigate platform to look up threat information and/or search online for potential Indicators of Compromise.

## Conclusion

If a resource which triggered a malicious resource alert:

- Is actively present in your application
- Is being loaded from a malicious host or IP address, or has malicious code
- Has malicious hostnames or IP addresses in its source code, which may be obfuscated/encoded

You should investigate further, since these indicators can be a sign of an ongoing active compromise.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Configuration settings

**來源**: [https://developers.cloudflare.com/page-shield/reference/settings/](https://developers.cloudflare.com/page-shield/reference/settings/)

Page options # Configuration settings

## Reporting endpoint

When enabled, Page Shield's client-side resource monitoring uses a Content Security Policy (CSP) report-only HTTP header to gather information about all the scripts running on your application.

By default, reports are sent to a Cloudflare-owned endpoint:

```
https://csp-reporting.cloudflare.com/cdn-cgi/script_monitor/report?<QUERY_STRING>
```

Enterprise customers with a paid add-on can change the reporting endpoint so that the CSP reports are sent to the same hostname:

```
<YOUR-HOSTNAME>/cdn-cgi/script-monitor/report?<QUERY_STRING>
```

### Prerequisites for using the same hostname for CSP reports

Using the same hostname for CSP reporting may interfere with other Cloudflare products. Before selecting this option, ensure that your Cloudflare configuration complies with the following:

- No rate limiting rules match the cdn-cgi/* URL path
- No custom rules match the cdn-cgi/* URL path

### Configure the reporting endpoint

Note

Only available to Enterprise customers with a paid add-on.

To configure the CSP reporting endpoint:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Page Shield > Settings.
3. Under Reporting endpoint, select Cloudflare-owned endpoint or Same hostname.
4. Select Apply settings.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Client-side abuse.
3. Under Continuous script monitoring > Configurations, select the edit icon next to Reporting endpoint.
4. Select Cloudflare-owned endpoint or Same hostname.
5. Select Save.

## Connection target details

When connection targets are reported to Cloudflare, their URIs can sometimes include sensitive data such as session ID.

By default, Page Shield will only check the domain against malicious threat intelligence feeds. You can choose to let Page Shield use the full URI when analyzing the connections made from your domain's pages. Any sensitive data present in the URI will be logged in clear text, and any user with access to the connection monitor dashboard will be able to view it.

### Configure the connection target details to use

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Page Shield > Settings.
3. Under Connection target details, select Log host only to analyze only the hostname or Log full URI to use the full URI in Page Shield.
4. Select Apply settings.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Client-side abuse.
3. Under Continuous script monitoring > Configurations, select the edit icon next to Data processing.
4. Select Log host only to analyze only the hostname or Log full URI to use the full URI.
5. Select Save.

## Turn off client-side resource monitoring

When you turn off Page Shield's client-side resource monitoring, you lose visibility on the scripts running on your zone, the outbound connections made from pages in your domain, and cookies detected in HTTP traffic.

To turn off client-side resource monitoring:

- Old dashboard
- New dashboard

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Page Shield > Settings.
3. In Disable Page Shield, select Disable.

1. Log in to the Cloudflare dashboard ↗, and select your account and domain.
2. Go to Security > Settings and filter by Client-side abuse.
3. Next to Continuous script monitoring, set the toggle to Off.

Note

Turning off Page Shield's client-side resource monitoring will not turn off policies (also known as content security rules). To turn off policies:

- Old dashboard: Go to Security > Page Shield > Policies.
- New security dashboard: Go to Security > Security rules and filter by Content security rules.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Script and connection statuses

**來源**: [https://developers.cloudflare.com/page-shield/reference/script-statuses/](https://developers.cloudflare.com/page-shield/reference/script-statuses/)

Page options # Script and connection statuses

Cloudflare classifies scripts and connections (also known as resources) according to the following:

- The number of times a script/connection was reported.
- Whether the script/connection is considered malicious or not.

Use Page Shield's dashboards to review the scripts loaded in your domain and the connections they make. For more information, refer to Monitor resources and cookies.

## Available statuses

- Infrequent: There are less than three reports for the script/connection. If there are no reports for a script/connection with Infrequent status for five days, then Page Shield will delete all the information about the script/connection. Scripts with Infrequent status appear only in the All Reported Scripts dashboard, and connections with Infrequent status appear only in the All Reported Connections dashboard.
- Active: There are more than three reports for the script/connection.
- Inactive: A previously active script/connection was not reported in the last seven days. If the script/connection is reported again later, its status will change back to Active. If the script/connection is not reported for 30 days, Page Shield will delete all the information about it. Scripts with Inactive status appear only in the All Reported Scripts dashboard, and connections with Inactive status appear only in the All Reported Connections dashboard.

Note

All scripts and connections considered malicious will appear in the Monitors dashboard, regardless of their status.

Malicious script/connection detection is only available to Enterprise customers with a paid add-on.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Page Shield and PCI DSS compliance

**來源**: [https://developers.cloudflare.com/page-shield/reference/pci-dss/](https://developers.cloudflare.com/page-shield/reference/pci-dss/)

Page options # Page Shield and PCI DSS compliance

You can use Page Shield for PCI DSS v4's client-side security requirements (items 6.4.3 and 11.6.1).

Refer to the PCI DSS v.4.0 Evaluation ↗ whitepaper for details on how you can use Cloudflare Page Shield to meet the new v4 requirements.

Note

To help with PCI DSS requirements, Page Shield requires you to have an Enterprise plan with a paid add-on. Refer to Availability for details on what is included in each plan.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## CSP HTTP header format

**來源**: [https://developers.cloudflare.com/page-shield/reference/csp-header/](https://developers.cloudflare.com/page-shield/reference/csp-header/)

Page options # CSP HTTP header format

The format of the Content Security Policy (CSP) report-only HTTP header added by Page Shield is the following:

```
content-security-policy-report-only: script-src 'none'; connect-src 'none'; report-uri https://csp-reporting.cloudflare.com/cdn-cgi/script_monitor/report?<QUERY_STRING>
```

If you configured the reporting endpoint to use the same hostname, the HTTP header will have the following format:

```
content-security-policy-report-only: script-src 'none'; connect-src 'none'; report-uri <YOUR_HOSTNAME>/cdn-cgi/script_monitor/report?<QUERY_STRING>
```

Notes

Cloudflare adds the CSP report-only HTTP header used to monitor webpage resources to a sample of sent responses.

Configuring log policies will add other CSP report-only headers to responses. Cloudflare will not perform any sampling for these report-only headers related to customer-defined policies.

## Related resources

- Mozilla Developer Network's (MDN) documentation on Content-Security-Policy-Report-Only ↗

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Roles and permissions

**來源**: [https://developers.cloudflare.com/page-shield/reference/roles-and-permissions/](https://developers.cloudflare.com/page-shield/reference/roles-and-permissions/)

Page options # Roles and permissions

Cloudflare users with the following roles have access to Page Shield in the Cloudflare dashboard:

- Administrator
- Super Administrator - All Privileges
- Page Shield
- Page Shield Read (read-only access)
- Domain Page Shield
- Domain Page Shield Read (read-only access)

## API token permissions

To interact with the Page Shield API you need an API token with one of the following permissions:

- Dashboard
- API

- Page Shield > Edit
- Page Shield > Read (read-only access)

- Page Shield Write
- Page Shield Read (read-only access)

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Page Shield API

**來源**: [https://developers.cloudflare.com/page-shield/reference/page-shield-api/](https://developers.cloudflare.com/page-shield/reference/page-shield-api/)

Page options # Page Shield API

You can enable and disable Page Shield's client-side resource monitoring, configure settings, and fetch information about detected scripts and connections using the Page Shield API.

To authenticate API requests you need an API token. For more information on the required API token permissions, refer to Roles and permissions.

Note

Refer to API deprecations for details on Page Shield API changes.

## Endpoints

You can obtain the complete endpoint by appending the Page Shield API endpoints to the Cloudflare API base URL:

```
https://api.cloudflare.com/client/v4
```

The {zone_id} argument is the zone ID (a hexadecimal string). You can find this value in the Cloudflare dashboard or using the Cloudflare API's /zones endpoint.

The {script_id} argument is the script ID (a hexadecimal string). This value is included in the response of the List Page Shield scripts operation for every detected script.

The {connection_id} argument is the connection ID (a hexadecimal string). This value is included in the response of the List Page Shield connections API operation for every detected connection.

The following table summarizes the available operations:

| Operation | Method + URL stub | Notes |
| --- | --- | --- |
| Get Page Shield settings | GET zones/{zone_id}/page_shield | Fetch Page Shield settings (including the status). |
| Update Page Shield settings | PUT zones/{zone_id}/page_shield | Update Page Shield settings. |
| List Page Shield scripts | GET zones/{zone_id}/page_shield/scripts | Fetch a list of detected scripts. |
| Get a Page Shield script | GET zones/{zone_id}/page_shield/scripts/{script_id} | Fetch the details of a script. |
| List Page Shield connections | GET zones/{zone_id}/page_shield/connections | Fetch a list of detected connections. |
| Get a Page Shield connection | GET zones/{zone_id}/page_shield/connections/{connection_id} | Fetch the details of a connection. |
| List Page Shield cookies | GET zones/{zone_id}/page_shield/cookies | Fetch a list of detected cookies. |
| Get a Page Shield cookie | GET zones/{zone_id}/page_shield/cookies/{cookie_id} | Fetch the details of a cookie. |
| List Page Shield policies | GET zones/{zone_id}/page_shield/policies | Fetch a list of all configured CSP policies. |
| Get a Page Shield policy | GET zones/{zone_id}/page_shield/policies/{policy_id} | Fetch the details of a CSP policy. |
| Create a Page Shield policy | POST zones/{zone_id}/page_shield/policies | Creates a CSP policy with the provided configuration. |
| Update a Page Shield policy | PUT zones/{zone_id}/page_shield/policies/{policy_id} | Updates an existing CSP policy. |
| Delete a Page Shield policy | DELETE zones/{zone_id}/page_shield/policies/{policy_id} | Deletes an existing CSP policy. |

## API notes

The malicious script classification (Malicious or Not malicious) is not directly available in the API. To determine this classification, compare the script's js_integrity_score value with the classification threshold, which is currently set to 10. Scripts with a score value lower than the threshold are considered malicious.

## Common API calls

### Get Page Shield settings

This example obtains the current settings of Page Shield, including the status (enabled/disabled).

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

Get Page Shield settings ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": {    "enabled": true,    "updated_at": "2023-05-14T11:47:55.677555Z",    "use_cloudflare_reporting_endpoint": true,    "use_connection_url_path": false  },  "success": true,  "errors": [],  "messages": []}
```

### Enable Page Shield

This example enables Page Shield in the specified zone.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield
- Zone Settings Write

Update Page Shield settings ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "enabled": true  }'
```

```
{  "result": {    "enabled": true,    "updated_at": "2023-05-14T11:50:41.756996Z"  },  "success": true,  "errors": [],  "messages": []}
```

### Fetch list of detected scripts

This GET request fetches a list of scripts detected by Page Shield on hostname example.net, requesting the first page with 15 items per page. The URL query string includes filtering and paging parameters.

By default, the response will only include scripts with active status when you do not specify a status filter parameter in the URL query string.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

List Page Shield scripts ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/scripts?hosts=example.net&page=1&per_page=15" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": [    {      "id": "8337233faec2357ff84465a919534e4d",      "url": "https://malicious.example.com/badscript.js",      "added_at": "2023-05-18T10:51:10.09615Z",      "first_seen_at": "2023-05-18T10:51:08Z",      "last_seen_at": "2023-05-22T09:57:54Z",      "host": "example.net",      "domain_reported_malicious": false,      "url_reported_malicious": true,      "malicious_url_categories": ["Malware"],      "first_page_url": "http://malicious.example.com/page_one.html",      "status": "active",      "url_contains_cdn_cgi_path": false,      "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",      "js_integrity_score": 10,      "obfuscation_score": 10,      "dataflow_score": 8,      "malware_score": 8,      "cryptomining_score": 9,      "magecart_score": 8,      "fetched_at": "2023-05-21T16:58:07Z"    }    // (...)  ],  "success": true,  "errors": [],  "messages": [],  "result_info": {    "page": 1,    "per_page": 15,    "count": 15,    "total_count": 24,    "total_pages": 2  }}
```

Some fields displayed in the example response may not be available, depending on your Cloudflare plan.

For details on the available filtering, paging, and sorting parameters, refer to the API reference.

### Fetch list of infrequently reported scripts

This GET request fetches a list of infrequently reported scripts on hostname example.net, requesting the first page with 15 items per page. The URL query string includes filtering and paging parameters.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

List Page Shield scripts ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/scripts?hosts=example.net&page=1&per_page=15&status=infrequent" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": [    {      "id": "83c8da2267394ce8465b74c299658fea",      "url": "https://scripts.example.com/anotherbadscript.js",      "added_at": "2023-05-17T13:16:03.419619Z",      "first_seen_at": "2023-05-17T13:15:23Z",      "last_seen_at": "2023-05-18T09:05:20Z",      "host": "example.net",      "domain_reported_malicious": false,      "url_reported_malicious": false,      "first_page_url": "http://malicious.example.com/page_one.html",      "status": "infrequent",      "url_contains_cdn_cgi_path": false,      "hash": "9245aad577e846dd9b990b1b32425a3fae4aad8b8a28441a8b80084b6bb75a45",      "js_integrity_score": 48,      "obfuscation_score": 49,      "dataflow_score": 45,      "malware_score": 45,      "cryptomining_score": 37,      "magecart_score": 49,      "fetched_at": "2023-05-18T03:58:07Z"    }    // (...)  ],  "success": true,  "errors": [],  "messages": [],  "result_info": {    "page": 1,    "per_page": 15,    "count": 15,    "total_count": 17,    "total_pages": 2  }}
```

Some fields displayed in the example response may not be available, depending on your Cloudflare plan.

For details on the available filtering, paging, and sorting parameters, refer to the API reference.

### Get details of a detected script

This GET request obtains the details of a script detected by Page Shield with script ID 8337233faec2357ff84465a919534e4d.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

Get a Page Shield script ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/scripts/8337233faec2357ff84465a919534e4d" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": {    "id": "8337233faec2357ff84465a919534e4d",    "url": "https://malicious.example.com/badscript.js",    "added_at": "2023-05-18T10:51:10.09615Z",    "first_seen_at": "2023-05-18T10:51:08Z",    "last_seen_at": "2023-05-22T09:57:54Z",    "host": "example.net",    "domain_reported_malicious": false,    "url_reported_malicious": true,    "malicious_url_categories": ["Malware"],    "first_page_url": "http://malicious.example.com/page_one.html",    "status": "active",    "url_contains_cdn_cgi_path": false,    "hash": "9245aad577e846dd9b990b1b32425a3fae4aad8b8a28441a8b80084b6bb75a45",    "js_integrity_score": 48,    "obfuscation_score": 49,    "dataflow_score": 45,    "malware_score": 42,    "cryptomining_score": 32,    "magecart_score": 44,    "fetched_at": "2023-05-21T16:58:07Z",    "page_urls": [      "http://malicious.example.com/page_two.html",      "http://malicious.example.com/page_three.html",      "http://malicious.example.com/page_four.html"    ],    "versions": [      {        "hash": "9245aad577e846dd9b990b1b32425a3fae4aad8b8a28441a8b80084b6bb75a45",        "js_integrity_score": 48,        "obfuscation_score": 49,        "dataflow_score": 45,        "malware_score": 42,        "cryptomining_score": 32,        "magecart_score": 44,        "fetched_at": "2023-05-21T16:58:07Z"      }    ]  },  "success": true,  "errors": [],  "messages": []}
```

Some fields displayed in the example response may not be available, depending on your Cloudflare plan.

### Fetch list of detected connections

This GET request fetches a list of connections detected by Page Shield, requesting the first page with 15 items per page.

By default, the response will only include connections with active status when you do not specify a status filter parameter in the URL query string.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

List Page Shield connections ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/connections?page=1&per_page=15" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": [    {      "id": "0a7bb628776f4e50a50d8594c4a01740",      "url": "https://malicious.example.com",      "added_at": "2022-09-18T10:51:10.09615Z",      "first_seen_at": "2022-09-18T10:51:08Z",      "last_seen_at": "2022-09-02T09:57:54Z",      "host": "example.net",      "domain_reported_malicious": true,      "malicious_domain_categories": ["Malware", "Spyware"],      "url_reported_malicious": false,      "malicious_url_categories": [],      "first_page_url": "https://example.net/one.html",      "status": "active",      "url_contains_cdn_cgi_path": false    }    // (...)  ],  "success": true,  "errors": [],  "messages": [],  "result_info": {    "page": 1,    "per_page": 15,    "count": 15,    "total_count": 16,    "total_pages": 2  }}
```

For details on the available filtering, paging, and sorting parameters, refer to the API reference.

### Get details of a detected connection

This GET request obtains the details of a connection detected by Page Shield with connection ID 0a7bb628776f4e50a50d8594c4a01740.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

Get a Page Shield connection ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/connections/0a7bb628776f4e50a50d8594c4a01740" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": {    "id": "0a7bb628776f4e50a50d8594c4a01740",    "url": "https://malicious.example.com",    "added_at": "2022-09-18T10:51:10.09615Z",    "first_seen_at": "2022-09-18T10:51:08Z",    "last_seen_at": "2022-09-02T09:57:54Z",    "host": "example.net",    "domain_reported_malicious": true,    "malicious_domain_categories": ["Malware", "Spyware"],    "url_reported_malicious": false,    "malicious_url_categories": [],    "first_page_url": "https://example.net/one.html",    "status": "active",    "url_contains_cdn_cgi_path": false  },  "success": true,  "errors": [],  "messages": []}
```

### Fetch list of detected cookies

This GET request fetches a list of cookies detected by Page Shield, requesting the first page with 15 items per page.

By default, the response will only include cookies with active status when you do not specify a status filter parameter in the URL query string.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

List Page Shield Cookies ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/cookies?page=1&per_page=15" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": [    {      "id": "beee03ada7e047e79f076785d8cd8b8e",      "type": "first_party",      "name": "PHPSESSID",      "host": "example.net",      "domain_attribute": "example.net",      "expires_attribute": "2024-10-21T12:28:20Z",      "http_only_attribute": true,      "max_age_attribute": null,      "path_attribute": "/store",      "same_site_attribute": "strict",      "secure_attribute": true,      "first_seen_at": "2024-05-06T10:51:08Z",      "last_seen_at": "2024-05-07T11:56:01Z",      "first_page_url": "example.net/store/products",      "page_urls": ["example.net/store/products/1"]    }    // (...)  ],  "success": true,  "errors": [],  "messages": [],  "result_info": {    "page": 1,    "per_page": 15,    "count": 15,    "total_count": 16,    "total_pages": 2  }}
```

For details on the available filtering, paging, and sorting parameters, refer to Make API calls.

### Get details of a detected cookie

This GET request obtains the details of a cookie detected by Page Shield with ID beee03ada7e047e79f076785d8cd8b8e.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield Read
- Domain Page Shield
- Page Shield Read
- Zone Settings Write
- Zone Settings Read

Get a Page Shield cookie ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/cookies/beee03ada7e047e79f076785d8cd8b8e" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

```
{  "result": {    "id": "beee03ada7e047e79f076785d8cd8b8e",    "type": "first_party",    "name": "PHPSESSID",    "host": "example.net",    "domain_attribute": "example.net",    "expires_attribute": "2024-10-21T12:28:20Z",    "http_only_attribute": true,    "max_age_attribute": null,    "path_attribute": "/store",    "same_site_attribute": "strict",    "secure_attribute": true,    "first_seen_at": "2024-05-06T10:51:08Z",    "last_seen_at": "2024-05-07T11:56:01Z",    "first_page_url": "example.net/store/products",    "page_urls": ["example.net/store/products/1"]  },  "success": true,  "errors": [],  "messages": []}
```

### Create a policy

This POST request creates a Page Shield policy (or content security rule) with Log action, defining the following scripts as allowed based on where they are hosted:

- Scripts hosted in myapp.example.com (which does not include scripts in example.com).
- Scripts hosted in cdnjs.cloudflare.com.
- The Google Analytics script using its full URL.
- All scripts in the same origin (same HTTP or HTTPS scheme and hostname).

All other scripts would trigger a policy violation, but those scripts would not be blocked.

For more information on Content Security Policy (CSP) directives and values, refer to the MDN documentation ↗.

Note

For a list of CSP directives and keywords supported by policies, refer to CSP directives supported by policies.

Required API token permissions

At least one of the following token permissions is required: - Page Shield
- Domain Page Shield
- Zone Settings Write

Create a Page Shield policy ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/page_shield/policies" \  --request POST \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "description": "My first policy in log mode",    "action": "log",    "expression": "http.host eq \"myapp.example.com\"",    "enabled": "true",    "value": "script-src myapp.example.com cdnjs.cloudflare.com https://www.google-analytics.com/analytics.js '\''self'\''"  }'
```

```
{  "success": true,  "errors": [],  "messages": [],  "result": {    "id": "<POLICY_ID>",    "description": "My first policy in log mode",    "action": "log",    "expression": "http.host eq \"myapp.example.com\"",    "enabled": "true",    "value": "script-src myapp.example.com cdnjs.cloudflare.com https://www.google-analytics.com/analytics.js 'self'"  }}
```

To create a policy with an Allow action instead of Log, use "action": "allow" in the request body. In the case of such policy, all scripts not allowed by the policy would be blocked.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/page-shield/troubleshooting/](https://developers.cloudflare.com/page-shield/troubleshooting/)

Page options # Troubleshooting

## Cloudflare does not show any client-side resources after activation

Cloudflare does not collect data on every single page view. Instead, it uses a sampling approach to gather information efficiently. This means that domains with lower traffic might take longer to generate initial reports, as these domains need more page views to accumulate enough samples. To speed up the reporting process, it is recommended that you actively generate traffic to your application after activating client-side resource monitoring. This will provide Cloudflare with more data to work with, leading to faster report generation.

## The dashboard shows scripts and connections that I do not recognize

Scripts often reference other scripts outside your application.

But, if you see unexpected scripts on your resource monitoring dashboard, check them for signs of malicious activity.

## I get warnings in my browser's developer tools related to Content Security Policy (CSP)

Cloudflare uses a Content Security Policy (CSP) report-only directive to gather a list of all scripts running on your application.

Some browsers display scripts being reported as warnings in the console pane of their developer tools. For example:

```
[Report Only] Refused to execute inline script because it violatesthe following Content Security Policy directive: "script-src 'none'".
Either the 'unsafe-inline' keyword, a hash ('sha256-RFWPLDbv2BY+rCkDzsE+0fr8ylGr2R2faWMhq4lfEQc='), or a nonce ('nonce-...')is required to enable inline execution.
```

You can safely ignore these warnings, since they are related to the reports that Cloudflare requires to detect loaded scripts. For more information, refer to How Page Shield works.

## I get policy violation reports for a domain I allowlisted

Policy violations reported via CSP's report-only directive do not take into consideration any redirects or redirect HTTP status codes. This is by design ↗ for security reasons.

Some third-party services you may want to cover in your allow policies perform redirects. An example of such a service is Google Ads, which does not work well with CSP policies ↗.

For example, if you add the adservice.google.com domain to an allow policy, you could get policy violation reports for this domain due to redirects to a different domain (not present in your allow policy). In this case, the violation report would still mention the original domain, and not the domain of the redirected destination, which can cause some confusion.

To try to solve this issue, add the domain of the redirected destination to your allow policy. You may need to add several domains to your policy due to redirects.

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

## Detection

**來源**: [https://developers.cloudflare.com/page-shield/detection/](https://developers.cloudflare.com/page-shield/detection/)

Page options # Detection

- Monitor resources and cookies
- Review resources considered malicious
- Review changed scripts

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/page-shield/best-practices/](https://developers.cloudflare.com/page-shield/best-practices/)

Page options # Best practices

Review the topics below for best practices related to Page Shield's client-side resource monitoring:

- Handle a client-side resource alert

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
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

**來源**: [https://developers.cloudflare.com/page-shield/reference/](https://developers.cloudflare.com/page-shield/reference/)

Page options # Reference

The following pages include additional information about Page Shield:

- Configuration settings
- Script and connection statuses
- Page Shield and PCI DSS compliance
- CSP HTTP header format
- Roles and permissions
- Page Shield API

## Was this helpful?

- Resources
- API
- New to Cloudflare?
- Directory
- Sponsorships
- Open Source

- Support
- Help Center
- System Status
- Compliance
- GDPR

- Company
- cloudflare.com
- Our team
- Careers

- Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

- Community
- X
- Discord
- YouTube
- GitHub

- © 2025 Cloudflare, Inc.
- Privacy Policy
- Terms of Use
- Report Security Issues
- Trademark
- Cookie Settings

---

