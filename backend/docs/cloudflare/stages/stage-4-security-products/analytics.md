# Analytics (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.076Z
> 原始來源: waf-docs/analytics.md

> 本文檔包含 3 個頁面的內容
> 生成時間: 2025-09-08T02:00:59.319Z

## 目錄

1. [Security Analytics](#security-analytics)
2. [Security Events](#security-events)
3. [Analytics](#analytics)

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

