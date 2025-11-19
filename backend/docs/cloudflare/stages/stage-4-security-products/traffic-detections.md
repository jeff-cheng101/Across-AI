# Traffic Detections (WAF Security)

> 🔥 此文檔來自 WAF 產品線，現已合併到 Security Products 階段
> 合併時間: 2025-09-08T04:18:10.091Z
> 原始來源: waf-docs/traffic-detections.md

> 本文檔包含 12 個頁面的內容
> 生成時間: 2025-09-08T03:29:30.004Z
> 補充遺漏頁面: https://developers.cloudflare.com/waf/detections/attack-score/

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