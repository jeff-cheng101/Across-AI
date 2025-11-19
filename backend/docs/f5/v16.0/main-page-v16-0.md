# BIG-IP Declarative WAF v16.0

## 目錄

- [BIG-IP Declarative WAF v16.0Â¶](#big-ip-declarative-waf-v160â)
- [policyÂ¶](#policyâ)
  - [open-api-filesÂ¶](#open-api-filesâ)
  - [signature-requirementsÂ¶](#signature-requirementsâ)
  - [templateÂ¶](#templateâ)
  - [antivirusÂ¶](#antivirusâ)
  - [behavioral-enforcementÂ¶](#behavioral-enforcementâ)
  - [blocking-settingsÂ¶](#blocking-settingsâ)
  - [brute-force-attack-preventionsÂ¶](#brute-force-attack-preventionsâ)
  - [character-setsÂ¶](#character-setsâ)
  - [cookie-settingsÂ¶](#cookie-settingsâ)
  - [cookiesÂ¶](#cookiesâ)
  - [csrf-protectionÂ¶](#csrf-protectionâ)
  - [csrf-urlsÂ¶](#csrf-urlsâ)
  - [data-guardÂ¶](#data-guardâ)
  - [database-protectionÂ¶](#database-protectionâ)
  - [deception-response-pagesÂ¶](#deception-response-pagesâ)
  - [deception-settingsÂ¶](#deception-settingsâ)
  - [disabled-action-itemsÂ¶](#disabled-action-itemsâ)
  - [disallowed-geolocationsÂ¶](#disallowed-geolocationsâ)
  - [filetypesÂ¶](#filetypesâ)
  - [generalÂ¶](#generalâ)
  - [gwt-profilesÂ¶](#gwt-profilesâ)
  - [header-settingsÂ¶](#header-settingsâ)
  - [headersÂ¶](#headersâ)
  - [host-namesÂ¶](#host-namesâ)
  - [ip-intelligenceÂ¶](#ip-intelligenceâ)
  - [json-profilesÂ¶](#json-profilesâ)
  - [json-validation-filesÂ¶](#json-validation-filesâ)
  - [login-enforcementÂ¶](#login-enforcementâ)
  - [login-pagesÂ¶](#login-pagesâ)
  - [methodsÂ¶](#methodsâ)
  - [microservicesÂ¶](#microservicesâ)
  - [navigation-parametersÂ¶](#navigation-parametersâ)
  - [parametersÂ¶](#parametersâ)
  - [plain-text-profilesÂ¶](#plain-text-profilesâ)
  - [policy-builderÂ¶](#policy-builderâ)
  - [policy-builder-central-configurationÂ¶](#policy-builder-central-configurationâ)
  - [policy-builder-cookieÂ¶](#policy-builder-cookieâ)
  - [policy-builder-filetypeÂ¶](#policy-builder-filetypeâ)
  - [policy-builder-headerÂ¶](#policy-builder-headerâ)
  - [policy-builder-parameterÂ¶](#policy-builder-parameterâ)
  - [policy-builder-redirection-protectionÂ¶](#policy-builder-redirection-protectionâ)
  - [policy-builder-server-technologiesÂ¶](#policy-builder-server-technologiesâ)
  - [policy-builder-sessions-and-loginsÂ¶](#policy-builder-sessions-and-loginsâ)
  - [policy-builder-urlÂ¶](#policy-builder-urlâ)
  - [redirection-protectionÂ¶](#redirection-protectionâ)
  - [redirection-protection-domainsÂ¶](#redirection-protection-domainsâ)
  - [response-pagesÂ¶](#response-pagesâ)
  - [sensitive-parametersÂ¶](#sensitive-parametersâ)
  - [server-technologiesÂ¶](#server-technologiesâ)
  - [session-trackingÂ¶](#session-trackingâ)
  - [session-tracking-statusesÂ¶](#session-tracking-statusesâ)
  - [signature-setsÂ¶](#signature-setsâ)
  - [signature-settingsÂ¶](#signature-settingsâ)
  - [signaturesÂ¶](#signaturesâ)
  - [threat-campaign-settingsÂ¶](#threat-campaign-settingsâ)
  - [threat-campaignsÂ¶](#threat-campaignsâ)
  - [urlsÂ¶](#urlsâ)
  - [vulnerability-assessmentÂ¶](#vulnerability-assessmentâ)
  - [webhooksÂ¶](#webhooksâ)
  - [websocket-urlsÂ¶](#websocket-urlsâ)
  - [whitelist-ipsÂ¶](#whitelist-ipsâ)
  - [xml-profilesÂ¶](#xml-profilesâ)
  - [xml-validation-filesÂ¶](#xml-validation-filesâ)


Version notice:

# BIG-IP Declarative WAF v16.0Â¶

## policyÂ¶

- auto-detect
- big5
- euc-jp
- euc-kr
- gb18030
- gb2312
- gbk
- iso-8859-1
- iso-8859-10
- iso-8859-13
- iso-8859-15
- iso-8859-16
- iso-8859-2
- iso-8859-3
- iso-8859-4
- iso-8859-5
- iso-8859-6
- iso-8859-7
- iso-8859-8
- iso-8859-9
- koi8-r
- shift_jis
- utf-8
- windows-1250
- windows-1251
- windows-1252
- windows-1253
- windows-1255
- windows-1256
- windows-1257
- windows-874

- Blocking: When the enforcement mode is set to blocking, traffic is blocked if it causes a violation (configured for blocking), and the enforcement readiness period is over.
- Transparent: When the enforcement mode is set to transparent, traffic is not blocked even if a violation is triggered.

- blocking
- transparent

- Parent: A parent policy can be used as a basis for similar child policies. Parent policy settings can be inherited to its child policies. A parent policy cannot be applied to Virtual Servers. No traffic can flow through them. They are just models.
- Security: A security policy can be created from a parent policy or as a stand-alone policy. Changes to a security policy do not affect other security policies. A security policy can be applied to a virtual server.

- parent
- security

### open-api-filesÂ¶

### signature-requirementsÂ¶

### templateÂ¶

- POLICY_TEMPLATE_ACTIVESYNC_V1_0_V2_0_HTTP
- POLICY_TEMPLATE_ACTIVESYNC_V1_0_V2_0_HTTPS
- POLICY_TEMPLATE_API_SECURITY
- POLICY_TEMPLATE_BEHAVIORAL_WAF
- POLICY_TEMPLATE_COMPREHENSIVE
- POLICY_TEMPLATE_DRUPAL
- POLICY_TEMPLATE_DRUPAL_8
- POLICY_TEMPLATE_FUNDAMENTAL
- POLICY_TEMPLATE_JOOMLA
- POLICY_TEMPLATE_LOTUSDOMINO_6_5_HTTP
- POLICY_TEMPLATE_LOTUSDOMINO_6_5_HTTPS
- POLICY_TEMPLATE_NGINX_BASE
- POLICY_TEMPLATE_ORACLE_10G_PORTAL_HTTP
- POLICY_TEMPLATE_ORACLE_10G_PORTAL_HTTPS
- POLICY_TEMPLATE_ORACLE_APPLICATIONS_11I_HTTP
- POLICY_TEMPLATE_ORACLE_APPLICATIONS_11I_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE
- POLICY_TEMPLATE_OWA_EXCHANGE_2003_HTTP
- POLICY_TEMPLATE_OWA_EXCHANGE_2003_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE_2003_WITH_ACTIVESYNC_HTTP
- POLICY_TEMPLATE_OWA_EXCHANGE_2003_WITH_ACTIVESYNC_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE_2007_HTTP
- POLICY_TEMPLATE_OWA_EXCHANGE_2007_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE_2007_WITH_ACTIVESYNC_HTTP
- POLICY_TEMPLATE_OWA_EXCHANGE_2007_WITH_ACTIVESYNC_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE_2010_HTTP
- POLICY_TEMPLATE_OWA_EXCHANGE_2010_HTTPS
- POLICY_TEMPLATE_OWA_EXCHANGE_2016
- POLICY_TEMPLATE_PASSIVE
- POLICY_TEMPLATE_PEOPLESOFT_PORTAL_9_HTTP
- POLICY_TEMPLATE_PEOPLESOFT_PORTAL_9_HTTPS
- POLICY_TEMPLATE_RAPID_DEPLOYMENT
- POLICY_TEMPLATE_RAPID_DEPLOYMENT_HTTP
- POLICY_TEMPLATE_RAPID_DEPLOYMENT_HTTPS
- POLICY_TEMPLATE_RAPID_DEPLOYMENT_PB
- POLICY_TEMPLATE_SAP_NETWEAVER
- POLICY_TEMPLATE_SAP_NETWEAVER_7_HTTP
- POLICY_TEMPLATE_SAP_NETWEAVER_7_HTTPS
- POLICY_TEMPLATE_SHAREPOINT
- POLICY_TEMPLATE_SHAREPOINT_2003_HTTP
- POLICY_TEMPLATE_SHAREPOINT_2003_HTTPS
- POLICY_TEMPLATE_SHAREPOINT_2007_HTTP
- POLICY_TEMPLATE_SHAREPOINT_2007_HTTPS
- POLICY_TEMPLATE_SHAREPOINT_2010_HTTP
- POLICY_TEMPLATE_SHAREPOINT_2010_HTTPS
- POLICY_TEMPLATE_SHAREPOINT_2016
- POLICY_TEMPLATE_VULNERABILITY_ASSESSMENT
- POLICY_TEMPLATE_WORDPRESS
- POLICY_TEMPLATE_WORDPRESS_4_9

### antivirusÂ¶

### behavioral-enforcementÂ¶

#### behavioralEnforcementViolationsÂ¶

- VIOL_ASM_COOKIE_HIJACKING
- VIOL_ASM_COOKIE_MODIFIED
- VIOL_ATTACK_SIGNATURE
- VIOL_BLACKLISTED_IP
- VIOL_BLOCKING_CONDITION
- VIOL_BOT_CLIENT
- VIOL_BRUTE_FORCE
- VIOL_CONVICTION
- VIOL_COOKIE_EXPIRED
- VIOL_COOKIE_LENGTH
- VIOL_COOKIE_MALFORMED
- VIOL_COOKIE_MODIFIED
- VIOL_CROSS_ORIGIN_REQUEST
- VIOL_CSRF
- VIOL_CSRF_EXPIRED
- VIOL_DATA_GUARD
- VIOL_DATA_INTEGRITY
- VIOL_DYNAMIC_SESSION
- VIOL_ENCODING
- VIOL_EVASION
- VIOL_FILETYPE
- VIOL_FILE_UPLOAD
- VIOL_FILE_UPLOAD_IN_BODY
- VIOL_FLOW
- VIOL_FLOW_DISALLOWED_INPUT
- VIOL_FLOW_ENTRY_POINT
- VIOL_FLOW_MANDATORY_PARAMS
- VIOL_GEOLOCATION
- VIOL_GWT_FORMAT
- VIOL_GWT_MALFORMED
- VIOL_HEADER_LENGTH
- VIOL_HEADER_METACHAR
- VIOL_HEADER_REPEATED
- VIOL_HOSTNAME
- VIOL_HOSTNAME_MISMATCH
- VIOL_HTTP_PROTOCOL
- VIOL_HTTP_RESPONSE_STATUS
- VIOL_JSON_FORMAT
- VIOL_JSON_MALFORMED
- VIOL_JSON_SCHEMA
- VIOL_LEAKED_CREDENTIALS
- VIOL_LOGIN_URL_BYPASSED
- VIOL_LOGIN_URL_EXPIRED
- VIOL_MALICIOUS_DEVICE
- VIOL_MALICIOUS_IP
- VIOL_MANDATORY_HEADER
- VIOL_MANDATORY_PARAMETER
- VIOL_MANDATORY_REQUEST_BODY
- VIOL_METHOD
- VIOL_PARAMETER
- VIOL_PARAMETER_ARRAY_VALUE
- VIOL_PARAMETER_DATA_TYPE
- VIOL_PARAMETER_DYNAMIC_VALUE
- VIOL_PARAMETER_EMPTY_VALUE
- VIOL_PARAMETER_LOCATION
- VIOL_PARAMETER_MULTIPART_NULL_VALUE
- VIOL_PARAMETER_NAME_METACHAR
- VIOL_PARAMETER_NUMERIC_VALUE
- VIOL_PARAMETER_REPEATED
- VIOL_PARAMETER_STATIC_VALUE
- VIOL_PARAMETER_VALUE_BASE64
- VIOL_PARAMETER_VALUE_LENGTH
- VIOL_PARAMETER_VALUE_METACHAR
- VIOL_PARAMETER_VALUE_REGEXP
- VIOL_PLAINTEXT_FORMAT
- VIOL_POST_DATA_LENGTH
- VIOL_QUERY_STRING_LENGTH
- VIOL_RATING_NEED_EXAMINATION
- VIOL_RATING_THREAT
- VIOL_REDIRECT
- VIOL_REQUEST_LENGTH
- VIOL_REQUEST_MAX_LENGTH
- VIOL_SESSION_AWARENESS
- VIOL_THREAT_ANALYSIS
- VIOL_THREAT_CAMPAIGN
- VIOL_URL
- VIOL_URL_CONTENT_TYPE
- VIOL_URL_LENGTH
- VIOL_URL_METACHAR
- VIOL_VIRUS
- VIOL_WEBSOCKET_BAD_REQUEST
- VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH
- VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_EXTENSION
- VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT
- VIOL_WEBSOCKET_FRAME_LENGTH
- VIOL_WEBSOCKET_FRAME_MASKING
- VIOL_WEBSOCKET_FRAMING_PROTOCOL
- VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_TEXT_NULL_VALUE
- VIOL_XML_FORMAT
- VIOL_XML_MALFORMED
- VIOL_XML_SCHEMA
- VIOL_XML_SOAP_ATTACHMENT
- VIOL_XML_SOAP_METHOD
- VIOL_XML_WEB_SERVICES_SECURITY

### blocking-settingsÂ¶

### brute-force-attack-preventionsÂ¶

- integer
- string

- Integer values
- â90000â

#### captchaBypassCriteriaÂ¶

Specifies action that is applied when defined threshold is reached.

> alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
alarm-and-drop: The system will log the login attempt and reset the TCP connection.
alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
- alarm-and-drop: The system will log the login attempt and reset the TCP connection.
- alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm-and-blocking-page
- alarm-and-drop
- alarm-and-honeypot-page

#### clientSideIntegrityBypassCriteriaÂ¶

Specifies action that is applied when defined threshold is reached.

> alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.

- alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.

- alarm-and-captcha

#### detectionCriteriaÂ¶

Specifies action that is applied when one of the defined thresholds (credentialsStuffingMatchesReached, failedLoginAttemptsRateReached) is reached.

> alarm: The system will log the login attempt.
alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
alarm-and-client-side-integrity-captcha: The system sends a Client Side Integrity challenge upon the first failed login attempt from a source and a CAPTCHA challenge upon second and all subsequent failed login attempts. A login attempt is logged if client successfully passes the challenge. This enforcement action should be chosen if CAPTCHA is considered intrusive. Benign users who mistype their password will likely get only the Client Side Integrity challenge, while an attacker will eventually get the CAPTCHA challenge.

- alarm: The system will log the login attempt.
- alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
- alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
- alarm-and-client-side-integrity-captcha: The system sends a Client Side Integrity challenge upon the first failed login attempt from a source and a CAPTCHA challenge upon second and all subsequent failed login attempts. A login attempt is logged if client successfully passes the challenge. This enforcement action should be chosen if CAPTCHA is considered intrusive. Benign users who mistype their password will likely get only the Client Side Integrity challenge, while an attacker will eventually get the CAPTCHA challenge.

- alarm
- alarm-and-captcha
- alarm-and-client-side-integrity
- alarm-and-client-side-integrity-captcha

#### leakedCredentialsCriteriaÂ¶

Specifies action when leaked credentials detected.

> alarm: The system will log the login attempt.
alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.
alarm-and-leaked-credentials-response-page: The default response page warns the user that the username and password have been leaked and the password should be changed.

- alarm: The system will log the login attempt.
- alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
- alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.
- alarm-and-leaked-credentials-response-page: The default response page warns the user that the username and password have been leaked and the password should be changed.

- alarm
- alarm-and-blocking-page
- alarm-and-honeypot-page
- alarm-and-leaked-credentials-response-page

#### loginAttemptsFromTheSameDeviceIdÂ¶

Specifies action that is applied when defined threshold is reached.

> alarm: The system will log the login attempt.
alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
alarm-and-drop: The system will log the login attempt and reset the TCP connection.
alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm: The system will log the login attempt.
- alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
- alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
- alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
- alarm-and-drop: The system will log the login attempt and reset the TCP connection.
- alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm
- alarm-and-blocking-page
- alarm-and-captcha
- alarm-and-client-side-integrity
- alarm-and-drop
- alarm-and-honeypot-page

#### loginAttemptsFromTheSameIpÂ¶

Specifies action that is applied when defined threshold is reached.

> alarm: The system will log the login attempt.
alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
alarm-and-drop: The system will log the login attempt and reset the TCP connection.
alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm: The system will log the login attempt.
- alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page.
- alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
- alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.
- alarm-and-drop: The system will log the login attempt and reset the TCP connection.
- alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking.

- alarm
- alarm-and-blocking-page
- alarm-and-captcha
- alarm-and-client-side-integrity
- alarm-and-drop
- alarm-and-honeypot-page

#### loginAttemptsFromTheSameUserÂ¶

Specifies action that is applied when defined threshold is reached.

> alarm: The system will log the login attempt.
alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.

- alarm: The system will log the login attempt.
- alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge.
- alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge.

- alarm
- alarm-and-captcha
- alarm-and-client-side-integrity

### character-setsÂ¶

- gwt-content
- header
- json-content
- parameter-name
- parameter-value
- plain-text-content
- url
- xml-content

#### characterSetÂ¶

### cookie-settingsÂ¶

- integer
- string

- Integer values
- âanyâ

### cookiesÂ¶

Specifies, when true, that the system adds the HttpOnly attribute to the domain cookieâs response header.
This is done to expose the cookie to only HTTP and HTTPS entities.
This prevents the cookie from being modified, or intercepted even if it is not modified,
by unwanted third parties that run scripts on the web page.

- The system does not validate that the cookie has not been modified or intercepted.
- The feature covers all security policy cookies, both enforced and allowed, explicit and wildcard.

Specifies how the system treats this cookie.

> enforced: Specifies that according to the security policy, this cookie may not be changed by the client.
allowed: Specifies that according to the security policy, this cookie may be changed by the client. The system ignores this cookie.

- enforced: Specifies that according to the security policy, this cookie may not be changed by the client.
- allowed: Specifies that according to the security policy, this cookie may be changed by the client. The system ignores this cookie.

- allow
- enforce

The introduction of the SameSite http attribute (defined in [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00))
allows you to declare if your cookie should be restricted to a first-party or same-site context.
Introducing the SameSite attribute on a cookie provides three different ways of controlling same-site vs. cross-site cookie sending:

> strict: Cookie will only be sent in a first-party context. In user terms, the cookie will only be sent if the site for the cookie matches the site currently shown in the browserâs URL bar.
lax: Cookies will be sent with top level navigation
none-value: Cookies will be sent in a third-party context.

- strict: Cookie will only be sent in a first-party context. In user terms, the cookie will only be sent if the site for the cookie matches the site currently shown in the browserâs URL bar.
- lax: Cookies will be sent with top level navigation
- none-value: Cookies will be sent in a third-party context.

- lax
- none
- none-value
- strict

You can enable the security policy to check whether cookie values contain a Base64 encoded string.
If the value is indeed Base64 encoded, the system decodes this value and continues with its security checks.
Specifies, when true, that the security policy checks the cookieâs value for Base64 encoding, and decodes the value.

Note: This setting is only available if Cookie Type is set to Allowed.

Specifies the cookie name as appearing in the http cookie header.
The cookie name length is limited to 500 characters.

Names can be one of the following according to the type attribute:

> explicit: Specifies that the cookie has a specific name and is not a wildcard entity. Type the name of a cookie exactly as you expect it to appear in the request.
wildcard: Specifies that any cookie that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected cookie. For example, the wildcard expression cookie_12* of type Enforced specifies that the security policy should not allow modified domain cookies for all cookies which match cookie_12*.

- explicit: Specifies that the cookie has a specific name and is not a wildcard entity. Type the name of a cookie exactly as you expect it to appear in the request.
- wildcard: Specifies that any cookie that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected cookie. For example, the wildcard expression cookie_12* of type Enforced specifies that the security policy should not allow modified domain cookies for all cookies which match cookie_12*.

The syntax for wildcard entities is based on shell-style wildcard characters.
The list below describes the wildcard characters that you can use so that the entity name can match multiple objects.

> *: Matches all characters
?: Matches any single character
[abcde]: Matches exactly one of the characters listed
[!abcde]: Matches any character not listed
[a-e]: Matches exactly one character in the range
[!a-e]: Matches any character not in the range

- *: Matches all characters
- ?: Matches any single character
- [abcde]: Matches exactly one of the characters listed
- [!abcde]: Matches any character not listed
- [a-e]: Matches exactly one character in the range
- [!a-e]: Matches any character not in the range

Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard.

Specifies, when true, that the system adds the Secure attribute to the domain cookieâs response header.
This is done to ensure that the cookies are returned to the server only over SSL (by using the HTTPS protocol).
This prevents the cookie from being intercepted, but does not guarantee its integrity.

- The system does not validate that the cookie was received over SSL.
- The feature covers all security policy cookies, both enforced and allowed, explicit and wildcard.

- explicit
- wildcard

#### signatureOverridesÂ¶

### csrf-protectionÂ¶

- integer
- string

- Integer values
- âdisabledâ

### csrf-urlsÂ¶

- none
- verify-csrf-token
- verify-origin

- GET
- POST
- any

- at-least-one
- from-parameters-list
- ignore

### data-guardÂ¶

Specifies the URLs for which the system enforces data guard protection.

> ignore-urls-in-list: Specifies that the system enforces data guard protection for all URLs except for those URLs in the Enforcement Mode list.
enforce-urls-in-list: Specifies that the system enforces data guard protection only for those URLs in the Enforcement Mode list

- ignore-urls-in-list: Specifies that the system enforces data guard protection for all URLs except for those URLs in the Enforcement Mode list.
- enforce-urls-in-list: Specifies that the system enforces data guard protection only for those URLs in the Enforcement Mode list

- enforce-urls-in-list
- ignore-urls-in-list

- MS Office 2007 or later
- MS Office 97-2003 document
- PDF - Adobe Portable Document Format
- Mach-O - Mach object file format - used in Mac OS X
- PE - Portable Executable for Windows
- ELF - binary file format for Unix

#### fileContentDetectionFormatsÂ¶

- ELF - binary file format for Unix
- MS Office 2007 or later
- MS Office 97-2003 document
- Mach-O - Mach object file format - used in Mac OS X
- PDF - Adobe Portable Document Format
- PE - Portable Executable for Windows

### database-protectionÂ¶

- apm
- login-pages

### deception-response-pagesÂ¶

### deception-settingsÂ¶

- ASP
- ASP.NET
- AngularJS
- Apache Struts
- Apache Tomcat
- Apache/NCSA HTTP Server
- BEA Systems WebLogic Server
- Backbone.js
- CGI
- Cisco
- Citrix
- CodeIgniter
- CouchDB
- Django
- Elasticsearch
- Ember.js
- Express.js
- Front Page Server Extensions (FPSE)
- Google Web Toolkit
- GraphQL
- Handlebars
- IBM DB2
- IIS
- JBoss
- Java Servlets/JSP
- JavaScript
- JavaServer Faces (JSF)
- Jenkins
- Jetty
- Joomla
- Laravel
- Lotus Domino
- Macromedia ColdFusion
- Macromedia JRun
- Microsoft SQL Server
- Microsoft Windows
- MongoDB
- MooTools
- Mustache
- MySQL
- Nginx
- Node.js
- Novell
- Oracle
- Oracle Application Server
- Oracle Identity Manager
- Outlook Web Access
- PHP
- PostgreSQL
- Prototype
- Proxy Servers
- Python
- React
- Redis
- RequireJS
- Ruby
- SQLite
- SSI (Server Side Includes)
- SharePoint
- Spring Boot
- Sybase/ASE
- TYPO3 CMS
- UIKit
- Underscore.js
- Unix/Linux
- Vue.js
- WebDAV
- WordPress
- XML
- ZURB Foundation
- Zend
- ef.js
- jQuery

### disabled-action-itemsÂ¶

- cookie-staging
- default-parameter
- filetype-staging
- modified-policy
- parameter-staging
- policy-validation
- scanner-vulnerabilities
- signature-staging
- threat-campaign-staging
- transparent-policy
- url-staging
- websocket-url-staging

### disallowed-geolocationsÂ¶

- Afghanistan
- Aland Islands
- Albania
- Algeria
- American Samoa
- Andorra
- Angola
- Anguilla
- Anonymous Proxy
- Antarctica
- Antigua and Barbuda
- Argentina
- Armenia
- Aruba
- Australia
- Austria
- Azerbaijan
- Bahamas
- Bahrain
- Bangladesh
- Barbados
- Belarus
- Belgium
- Belize
- Benin
- Bermuda
- Bhutan
- Bolivia
- Bosnia and Herzegovina
- Botswana
- Bouvet Island
- Brazil
- British Indian Ocean Territory
- Brunei Darussalam
- Bulgaria
- Burkina Faso
- Burundi
- Cambodia
- Cameroon
- Canada
- Cape Verde
- Cayman Islands
- Central African Republic
- Chad
- Chile
- China
- Christmas Island
- Cocos (Keeling) Islands
- Colombia
- Comoros
- Congo
- Congo, The Democratic Republic of the
- Cook Islands
- Costa Rica
- Cote DâIvoire
- Croatia
- Cuba
- Cyprus
- Czech Republic
- Denmark
- Djibouti
- Dominica
- Dominican Republic
- Ecuador
- Egypt
- El Salvador
- Equatorial Guinea
- Eritrea
- Estonia
- Ethiopia
- Falkland Islands (Malvinas)
- Faroe Islands
- Fiji
- Finland
- France
- France, Metropolitan
- French Guiana
- French Polynesia
- French Southern Territories
- Gabon
- Gambia
- Georgia
- Germany
- Ghana
- Gibraltar
- Greece
- Greenland
- Grenada
- Guadeloupe
- Guam
- Guatemala
- Guernsey
- Guinea
- Guinea-Bissau
- Guyana
- Haiti
- Heard Island and McDonald Islands
- Holy See (Vatican City State)
- Honduras
- Hong Kong
- Hungary
- Iceland
- India
- Indonesia
- Iran, Islamic Republic of
- Iraq
- Ireland
- Isle of Man
- Israel
- Italy
- Jamaica
- Japan
- Jersey
- Jordan
- Kazakhstan
- Kenya
- Kiribati
- Korea, Democratic Peopleâs Republic of
- Korea, Republic of
- Kuwait
- Kyrgyzstan
- Lao Peopleâs Democratic Republic
- Latvia
- Lebanon
- Lesotho
- Liberia
- Libyan Arab Jamahiriya
- Liechtenstein
- Lithuania
- Luxembourg
- Macau
- Macedonia
- Madagascar
- Malawi
- Malaysia
- Maldives
- Mali
- Malta
- Marshall Islands
- Martinique
- Mauritania
- Mauritius
- Mayotte
- Mexico
- Micronesia, Federated States of
- Moldova, Republic of
- Monaco
- Mongolia
- Montenegro
- Montserrat
- Morocco
- Mozambique
- Myanmar
- N/A
- Namibia
- Nauru
- Nepal
- Netherlands
- Netherlands Antilles
- New Caledonia
- New Zealand
- Nicaragua
- Niger
- Nigeria
- Niue
- Norfolk Island
- Northern Mariana Islands
- Norway
- Oman
- Other
- Pakistan
- Palau
- Palestinian Territory
- Panama
- Papua New Guinea
- Paraguay
- Peru
- Philippines
- Pitcairn Islands
- Poland
- Portugal
- Puerto Rico
- Qatar
- Reunion
- Romania
- Russian Federation
- Rwanda
- Saint Barthelemy
- Saint Helena
- Saint Kitts and Nevis
- Saint Lucia
- Saint Martin
- Saint Pierre and Miquelon
- Saint Vincent and the Grenadines
- Samoa
- San Marino
- Sao Tome and Principe
- Satellite Provider
- Saudi Arabia
- Senegal
- Serbia
- Seychelles
- Sierra Leone
- Singapore
- Slovakia
- Slovenia
- Solomon Islands
- Somalia
- South Africa
- South Georgia and the South Sandwich Islands
- Spain
- Sri Lanka
- Sudan
- Suriname
- Svalbard and Jan Mayen
- Swaziland
- Sweden
- Switzerland
- Syrian Arab Republic
- Taiwan
- Tajikistan
- Tanzania, United Republic of
- Thailand
- Timor-Leste
- Togo
- Tokelau
- Tonga
- Trinidad and Tobago
- Tunisia
- Turkey
- Turkmenistan
- Turks and Caicos Islands
- Tuvalu
- Uganda
- Ukraine
- United Arab Emirates
- United Kingdom
- United States
- United States Minor Outlying Islands
- Uruguay
- Uzbekistan
- Vanuatu
- Venezuela
- Vietnam
- Virgin Islands, British
- Virgin Islands, U.S.
- Wallis and Futuna
- Western Sahara
- Yemen
- Zambia
- Zimbabwe

### filetypesÂ¶

Specifies the file type name as appearing in the URL extension. Names can be one of the following according to the type attribute:

> Explicit - Specifies that the name is the liternal file extension to which the file type refers. The type attribute has to be âexplicitâ.
No Extension - Specifies the empty file type, lacking file extension. For this the reserved string no_ext should be used. The type attribute has to be âexplicitâ.
Wildcard - Specifies that any file extension that matches the wildcard expression is matched to this file type in the policy. The type attribute has to be âwildcardâ.

- Explicit - Specifies that the name is the liternal file extension to which the file type refers. The type attribute has to be âexplicitâ.
- No Extension - Specifies the empty file type, lacking file extension. For this the reserved string no_ext should be used. The type attribute has to be âexplicitâ.
- Wildcard - Specifies that any file extension that matches the wildcard expression is matched to this file type in the policy. The type attribute has to be âwildcardâ.

The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects.

> *: Matches all characters
?: Matches any single character
[abcde]: Matches exactly one of the characters listed
[!abcde]: Matches any character not listed
[a-e]: Matches exactly one character in the range
[!a-e]: Matches any character not in the range

- *: Matches all characters
- ?: Matches any single character
- [abcde]: Matches exactly one of the characters listed
- [!abcde]: Matches any character not listed
- [a-e]: Matches exactly one character in the range
- [!a-e]: Matches any character not in the range

Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard.

- explicit
- wildcard

### generalÂ¶

A URI path parameter is the part of a path segment that occurs after its name. You can configure how a security policy handles path parameters that are attached to path segments in URIs.
You can enforce different levels of security based on your needs:

> as-parameter: The system normalizes and enforces path parameters. For each path parameter, the system removes it from URLs as part of the normalization process, finds a corresponding parameter in the security policy (first at the matching URL level, and if not found, then at the Global level), and enforces it according to its attributes like any other parameters.
as-url: The system does not normalize nor enforce path parameters. Path parameters are considered an integral part of the URL.
ignore: The system removes path parameters from URLs as part of the normalization process, but does not enforce them.

- as-parameter: The system normalizes and enforces path parameters. For each path parameter, the system removes it from URLs as part of the normalization process, finds a corresponding parameter in the security policy (first at the matching URL level, and if not found, then at the Global level), and enforces it according to its attributes like any other parameters.
- as-url: The system does not normalize nor enforce path parameters. Path parameters are considered an integral part of the URL.
- ignore: The system removes path parameters from URLs as part of the normalization process, but does not enforce them.

- as-parameters
- as-url
- ignore

When enabled, the system activates ASM iRule events. When disabled, the system does not activate ASM iRule events. Enable this option if you have written iRules that process ASM iRule events, and assigned them to a specific virtual server. The default setting is disabled.

> disabled: Leave this option disabled if you either have not written any ASM iRules.
enabled-normal: The system invokes the event ASM_REQUEST_DONE after the system completes processing each request, regardless of whether the request triggered violations. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests whether they trigger, or do not trigger, violations.
enabled-compatibility: The system invokes the event ASM_REQUEST_VIOLATION after the system completes processing each request that triggered a violation. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests only that trigger violations.

- disabled: Leave this option disabled if you either have not written any ASM iRules.
- enabled-normal: The system invokes the event ASM_REQUEST_DONE after the system completes processing each request, regardless of whether the request triggered violations. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests whether they trigger, or do not trigger, violations.
- enabled-compatibility: The system invokes the event ASM_REQUEST_VIOLATION after the system completes processing each request that triggered a violation. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests only that trigger violations.

- disabled
- enabled-compatibility
- enabled-normal

When enabled, the system has confidence in an XFF (X-Forwarded-For) header in the request. When disabled, that the system does not have confidence in an XFF header in the request. The default setting is disabled.

Select this option if the system is deployed behind an internal or other trusted proxy. Then, the system uses the IP address that initiated the connection to the proxy instead of the internal proxyâs IP address.

Leave this option disabled if you think the HTTP header may be spoofed, or crafted, by a malicious client. With this setting disabled, if the system is deployed behind an internal proxy, the system uses the internal proxyâs IP address instead of the clientâs IP address.

### gwt-profilesÂ¶

#### defenseAttributesÂ¶

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

#### metacharOverridesÂ¶

#### signatureOverridesÂ¶

### header-settingsÂ¶

- integer
- string

- Integer values
- âanyâ

### headersÂ¶

- explicit
- wildcard

#### signatureOverridesÂ¶

### host-namesÂ¶

### ip-intelligenceÂ¶

#### ipIntelligenceCategoriesÂ¶

- Anonymous Proxy
- BotNets
- Cloud-based Services
- Denial of Service
- Infected Sources
- Mobile Threats
- Phishing Proxies
- Scanners
- Spam Sources
- Tor Proxies
- Web Attacks
- Windows Exploits

### json-profilesÂ¶

#### defenseAttributesÂ¶

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

#### metacharOverridesÂ¶

#### sensitiveDataÂ¶

#### signatureOverridesÂ¶

#### validationFilesÂ¶

### json-validation-filesÂ¶

### login-enforcementÂ¶

- integer
- string

- Integer values
- âdisabledâ

#### logoutUrlsÂ¶

### login-pagesÂ¶

- ajax-or-json-request
- form
- http-basic
- http-digest
- none
- ntlm

#### accessValidationÂ¶

### methodsÂ¶

- GET
- POST

### microservicesÂ¶

- blocking
- policy-default
- transparent

- explicit
- wildcard

- explicit
- wildcard

### navigation-parametersÂ¶

### parametersÂ¶

Specifies type of serialization for array of primitives parameter.
Serialization defines how multiple values are delimited - format that can be transmitted and reconstructed later:

> pipe: pipeline-separated values. Array color=[âblueâ,âblackâ] -> color=blue|black.
form: ampersand-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black.
matrix: semicolon-prefixed values. Array color=[âblueâ,âblackâ] -> ;color=blue,black.
tsv: tab-separated values. Aarray color=[âblueâ,âblackâ] -> color=bluetblack.
csv: comma-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black.
label: dot-prefixed values. Array color=[âblueâ,âblackâ] -> .blue.black.
multi: multiple parameter instances rather than multiple values. Array color=[âblueâ,âblackâ] -> color=blue&color=black.
ssv: space-separated values. Array color=[âblueâ,âblackâ] -> color=blue black.
multipart: defines array of files.

- pipe: pipeline-separated values. Array color=[âblueâ,âblackâ] -> color=blue|black.
- form: ampersand-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black.
- matrix: semicolon-prefixed values. Array color=[âblueâ,âblackâ] -> ;color=blue,black.
- tsv: tab-separated values. Aarray color=[âblueâ,âblackâ] -> color=bluetblack.
- csv: comma-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black.
- label: dot-prefixed values. Array color=[âblueâ,âblackâ] -> .blue.black.
- multi: multiple parameter instances rather than multiple values. Array color=[âblueâ,âblackâ] -> color=blue&color=black.
- ssv: space-separated values. Array color=[âblueâ,âblackâ] -> color=blue black.
- multipart: defines array of files.

- This attribute is relevant only for parameters with array valueType.
- multi and form serializations can be defined for parameter with query, form-data or cookie locations only.
- multipart serialization can be defined for parameter with form-data location only.
- matrix and label serializations can be defined for parameter with path location only.

- csv
- form
- label
- matrix
- multi
- multipart
- pipe
- ssv
- tsv

Specifies data type of parameterâs value:

> none: system data type which is used by policy builder and cannot be set manually.
alpha-numeric: specifies that the value of parameter can be any text consisting of letters, digits, and the underscore character.
binary: specifies there is no text limit for the value of a parameter (length checks only).
phone: specifies that the value of a parameter can be text in telephone number format only.
email: specifies that the value of a parameter must be text in email format only.
boolean: specifies that the value of a parameter must be boolean (only true and  false values are allowed).
integer: specifies that the value of a parameter must be whole numbers only (no decimals).
decimal: specifies that the value of a parameter is numbers only and can include decimals.

- none: system data type which is used by policy builder and cannot be set manually.
- alpha-numeric: specifies that the value of parameter can be any text consisting of letters, digits, and the underscore character.
- binary: specifies there is no text limit for the value of a parameter (length checks only).
- phone: specifies that the value of a parameter can be text in telephone number format only.
- email: specifies that the value of a parameter must be text in email format only.
- boolean: specifies that the value of a parameter must be boolean (only true and  false values are allowed).
- integer: specifies that the value of a parameter must be whole numbers only (no decimals).
- decimal: specifies that the value of a parameter is numbers only and can include decimals.

- This attribute is relevant for parameters with array or user-input valueType only.

- alpha-numeric
- binary
- boolean
- decimal
- email
- integer
- none
- phone

Specifies whether an array or object parameters should have separate values for each array item or object property.
This attribute is relevant only if objectSerializationStyle is defined.

- This attribute is not relevant for parameters with deep-object, space-delimited or pipe-delimited objectSerializationStyle.

- flow
- global
- url

Specifies the name of a parameter which must be permitted in requests.
Format of parameter name attribute differs depending on type attribute:

> explicit type: name of permitted parameter in request should literally match.
wildcard type: name of permitted parameter in request should match wildcard expression.

- explicit type: name of permitted parameter in request should literally match.
- wildcard type: name of permitted parameter in request should match wildcard expression.

The syntax for wildcard entities is based on shell-style wildcard characters.
The list below describes the wildcard characters that you can use so that the entity name can match multiple objects.

> *: Matches all characters
?: Matches any single character
[abcde]: Matches exactly one of the characters listed
[!abcde]: Matches any character not listed
[a-e]: Matches exactly one character in the range
[!a-e]: Matches any character not in the range

- *: Matches all characters
- ?: Matches any single character
- [abcde]: Matches exactly one of the characters listed
- [!abcde]: Matches any character not listed
- [a-e]: Matches exactly one character in the range
- [!a-e]: Matches any character not in the range

- Wildcards do not match regular expressions. Do not use a regular expression as a wildcard.
- Empty parameter name is allowed for explicit type

Specifies the type of serialization for an object or complex array parameter.
Serialization defines how multiple values are delimited - format that can be transmitted and reconstructed later:

> pipe-delimited: pipeline-separated values. Object color={âRâ:100,âGâ:200} -> color=R|100|G|200.
form: ampersand-separated values. Object color={âRâ:100,âGâ:200} -> color=R,100,G,200 if explodeObjectSerialization set to false or -> R=100&G=200 if explodeObjectSerialization set to true.
space-delimited: space-separated values. Object color={âRâ:100,âGâ:200} -> color=R 100 G 200.
deep-object: rendering nested objects. Object color={âRâ:100,âGâ:200} -> color[R]=100&color[G]=200.
matrix: semicolon-prefixed values. Object color={âRâ:100,âGâ:200} -> ;color=R,100,G,200 if explodeObjectSerialization set to false or -> ;R=100;G=200 if explodeObjectSerialization set to true.
simple: comma-separated values. Object color={âRâ:100,âGâ:200} -> R,100,G,200 if explodeObjectSerialization set to false or -> R=100,G=200 if explodeObjectSerialization set to true.
label: dot-prefixed values. Object color={âRâ:100,âGâ:200} -> .R.100.G.200 if explodeObjectSerialization set to false or -> .R=100.G=200 if explodeObjectSerialization set to true.

- pipe-delimited: pipeline-separated values. Object color={âRâ:100,âGâ:200} -> color=R|100|G|200.
- form: ampersand-separated values. Object color={âRâ:100,âGâ:200} -> color=R,100,G,200 if explodeObjectSerialization set to false or -> R=100&G=200 if explodeObjectSerialization set to true.
- space-delimited: space-separated values. Object color={âRâ:100,âGâ:200} -> color=R 100 G 200.
- deep-object: rendering nested objects. Object color={âRâ:100,âGâ:200} -> color[R]=100&color[G]=200.
- matrix: semicolon-prefixed values. Object color={âRâ:100,âGâ:200} -> ;color=R,100,G,200 if explodeObjectSerialization set to false or -> ;R=100;G=200 if explodeObjectSerialization set to true.
- simple: comma-separated values. Object color={âRâ:100,âGâ:200} -> R,100,G,200 if explodeObjectSerialization set to false or -> R=100,G=200 if explodeObjectSerialization set to true.
- label: dot-prefixed values. Object color={âRâ:100,âGâ:200} -> .R.100.G.200 if explodeObjectSerialization set to false or -> .R=100.G=200 if explodeObjectSerialization set to true.

- This attribute is relevant only for parameters with object or openapi-array valueType.
- form serialization can be defined for a parameter with query, form-data or cookie locations only.
- matrix and label serializations can be defined for an array parameter with path location only.
- simple serializations can be defined for a parameter with path and header locations only.
- deep-object serialization can be defined for a parameter with query or form-data locations only.

- deep-object
- form
- label
- matrix
- pipe-delimited
- simple
- space-delimited

Specifies location of parameter in request:

> any: in query string, in POST data (body) or in URL path.
query: in query string.
form-data: in POST data (body).
cookie: in value of Cookie header.
path: in URL path.
header: in request headers.

- any: in query string, in POST data (body) or in URL path.
- query: in query string.
- form-data: in POST data (body).
- cookie: in value of Cookie header.
- path: in URL path.
- header: in request headers.

- path location can be defined for parameter with global level only.
- path, header and cookie location can be defined for parameter with explicit type only.
- header and cookie location cannot be defined for parameter with empty name.

- any
- cookie
- form-data
- header
- path
- query

Determines the staging state of a parameter.
If you place an entity in staging, the system does not block requests for this entity.

Tip: Use staging on wildcard entities to build the security policy without explicit entities of this type, rather than configuring the wildcard entity itself to be enforced with the settings found on it.

Determines a positive regular expression for a parameterâs value.
This attribute is relevant only if enableRegularExpression is set to true.

- The length of a regular expression is limited to 254 characters.

- explicit
- wildcard

Specifies type of parameterâs value:

> object: the parameterâs value is complex object defined by JSON schema.
dynamic-content: the parameterâs content changes dynamically.
openapi-array: the parameterâs value is complex array defined by JSON schema.
ignore: the system does not perform validity checks on the value of the parameter.
static-content: the parameter has a static, or pre-defined, value(s).
json: the parameterâs value is JSON data.
array: the parameterâs value is array of primitives.
user-input: the parameterâs value is provided by user-input.
xml: the parameterâs value is XML data.
auto-detect: the parameterâs value can be user-inpur, XML data or JSON data. The system automatically classifies the type of value.
dynamic-parameter-name: the parameterâs name changes dynamically.

- object: the parameterâs value is complex object defined by JSON schema.
- dynamic-content: the parameterâs content changes dynamically.
- openapi-array: the parameterâs value is complex array defined by JSON schema.
- ignore: the system does not perform validity checks on the value of the parameter.
- static-content: the parameter has a static, or pre-defined, value(s).
- json: the parameterâs value is JSON data.
- array: the parameterâs value is array of primitives.
- user-input: the parameterâs value is provided by user-input.
- xml: the parameterâs value is XML data.
- auto-detect: the parameterâs value can be user-inpur, XML data or JSON data. The system automatically classifies the type of value.
- dynamic-parameter-name: the parameterâs name changes dynamically.

- dynamic-parameter-name value type can be defined for a parameter with flow level and explicit type only.
- dynamic-content value type can be defined for a parameter with explicit type only.

- array
- auto-detect
- dynamic-content
- dynamic-parameter-name
- ignore
- json
- object
- openapi-array
- static-content
- user-input
- xml

#### contentProfileÂ¶

##### contentProfileÂ¶

#### nameMetacharOverridesÂ¶

#### signatureOverridesÂ¶

#### valueMetacharOverridesÂ¶

### plain-text-profilesÂ¶

#### defenseAttributesÂ¶

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

#### metacharOverridesÂ¶

#### signatureOverridesÂ¶

### policy-builderÂ¶

- automatic
- disabled
- manual

#### autoApplyÂ¶

- never
- real-time
- scheduled

#### trafficTightenÂ¶

#### trustedTrafficLoosenÂ¶

#### trustedTrafficSiteChangeTrackingÂ¶

#### untrustedTrafficLoosenÂ¶

#### untrustedTrafficSiteChangeTrackingÂ¶

### policy-builder-central-configurationÂ¶

Specifies learning location.

> central: Security policy learning is done centrally and managed via a BIG-IQ system. Centralized learning can be enabled from BIG-IQ only and, when enabled, all interim local policy learning will be lost. When learning is centralized, you cannot make local changes on your BIG-IP that will affect the security policy learning.
local: Security policy learning is done locally and managed on BIG-IP

- central: Security policy learning is done centrally and managed via a BIG-IQ system. Centralized learning can be enabled from BIG-IQ only and, when enabled, all interim local policy learning will be lost. When learning is centralized, you cannot make local changes on your BIG-IP that will affect the security policy learning.
- local: Security policy learning is done locally and managed on BIG-IP

- central
- local

Specifies event correlation location.

> central: Event correlation is done centrally and stored in a BIG-IQ system.
local: Event correlation is done locally and stored on BIG-IP.

- central: Event correlation is done centrally and stored in a BIG-IQ system.
- local: Event correlation is done locally and stored on BIG-IP.

- central
- local

#### centralPbAddressesÂ¶

### policy-builder-cookieÂ¶

- never
- selective

### policy-builder-filetypeÂ¶

Specifies under which circumstances the Policy Builder adds, or suggests you add, explicit file types to the security policy:

> compact: Specifies that the system will create a list of the most commonly used file types (while enforcing all other file types with a wildcard rule), together with a pre-populated list of known disallowed file types. This option serves as a good balance between selective and always
selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit file type with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance
always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website file types. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy
never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard file type

- compact: Specifies that the system will create a list of the most commonly used file types (while enforcing all other file types with a wildcard rule), together with a pre-populated list of known disallowed file types. This option serves as a good balance between selective and always
- selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit file type with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance
- always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website file types. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy
- never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard file type

- always
- compact
- never
- selective

### policy-builder-headerÂ¶

### policy-builder-parameterÂ¶

Defines the conditions under which the Policy Builder adds dynamic parameters to the security policy
To enabled this functionality there are several prerequisites:

> learnExplicitParameters is always or selective
learnExplicitUrls in policy-builder-url and/or learnExplicitFiletypes in policy-builder-filetype is always or selective
learnFromResponses is enabled in policy-builder
at least one of the allHiddenFields/formParameters/linkParameters is enabled

- learnExplicitParameters is always or selective
- learnExplicitUrls in policy-builder-url and/or learnExplicitFiletypes in policy-builder-filetype is always or selective
- learnFromResponses is enabled in policy-builder
- at least one of the allHiddenFields/formParameters/linkParameters is enabled

Specifies under which circumstances the Policy Builder adds, or suggests you add, explicit parameters to the security policy:

> compact: Specifies that the system will create a list of the most commonly used parameters, while enforcing all other parameters with a wildcard rule. This option serves as a good balance between selective and always
selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit parameter with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance
always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website parameters. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy
never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard parameter

- compact: Specifies that the system will create a list of the most commonly used parameters, while enforcing all other parameters with a wildcard rule. This option serves as a good balance between selective and always
- selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit parameter with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance
- always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website parameters. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy
- never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard parameter

- always
- compact
- never
- selective

Defines how the Policy Builder determines on which level to add, or suggest you add, parameters to the security policy

> global: The system creates learning suggestions based on the properties of entities that already exist in the security policy.
When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the parameter name and level of the parameter in the security policy that caused this violation.
When automatically building the security policy, the Policy Builder adds parameters on the Global level.



url: The system creates learning suggestions based on real traffic, and is not limited to the current properties of entities that exist in the security policy.
When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the actual parameter name and the URL or flow on which the violation was detected.
When automatically building the security policy, the Policy Builder adds parameters on the URL level.
In addition, if the actual URL does not exist in the security policy, the system adds the URL and file type (if it also does not exist) on which the violation was detected.

- global: The system creates learning suggestions based on the properties of entities that already exist in the security policy.
When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the parameter name and level of the parameter in the security policy that caused this violation.
When automatically building the security policy, the Policy Builder adds parameters on the Global level.
- url: The system creates learning suggestions based on real traffic, and is not limited to the current properties of entities that exist in the security policy.
When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the actual parameter name and the URL or flow on which the violation was detected.
When automatically building the security policy, the Policy Builder adds parameters on the URL level.
In addition, if the actual URL does not exist in the security policy, the system adds the URL and file type (if it also does not exist) on which the violation was detected.

- global
- url

#### dynamicParametersÂ¶

### policy-builder-redirection-protectionÂ¶

- always
- never

### policy-builder-server-technologiesÂ¶

### policy-builder-sessions-and-loginsÂ¶

### policy-builder-urlÂ¶

- always
- compact
- never
- selective

- always
- never
- selective

### redirection-protectionÂ¶

#### redirectionDomainsÂ¶

- explicit
- wildcard

### redirection-protection-domainsÂ¶

- explicit
- wildcard

### response-pagesÂ¶

- alert-popup: The system opens a message as a popup screen. Type the message the system displays in the popup screen, or leave the default text.
- custom: A response text that will replace the frame or page which generated the AJAX request. The system provides additional options where you can type the response body you prefer.
- redirect: The system redirects the user to a specific web page instead of viewing a response page. Type the web pageâs full URL path, for example, http://www.redirectpage.com.

- alert-popup
- custom
- redirect

- custom: The system returns a response page with HTML code that the user defines.
- default: The system returns the system-supplied response page in HTML. No further configuration is needed.
- erase-cookies:  The system deletes all client side domain cookies. This is done in order to block web application users once, and not from the entire web application. The system displays this text in the response page. You cannot edit this text.
- redirect: The system redirects the user to a specific web page instead of viewing a response page. The system provides an additional setting where you can indicate the redirect web page.
- soap-fault:  Displays the system-supplied response written in SOAP fault message structure. Use this type when a SOAP request is blocked due to an XML related violation. You cannot edit this text.

- custom
- default
- erase-cookies
- redirect
- soap-fault

- ajax: The system sends the AJAX Blocking Response Page when the security policy blocks an AJAX request that does not comply with the security policy.
- ajax-login: The system sends the AJAX Login Page Response after the user sends an AJAX request that attempts to directly access a URL that is allowed to be accessed only after visiting a login page.
- cpatcha: The system sends the CAPTCHA response page when the system suspects that a session is being run by a bot rather than a human, especially in the case of a brute force attack.
- captcha-fail: The system sends the CAPTCHA fail response page to a failed CAPTCHA challenge.
- default: The system sends the default response when the security policy blocks a client request.
- failed-login-honeypot: The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation.
- failed-login-honeypot-ajax: The Honeypot page is used for attacker deception sending AJAX request. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation.
- hijack: The system sends the cookie hijacking response page when the system detects that an attacker tried to hijack the session.
- leaked-credentials: The system sends the leaked credentials response when the system detects the use of stolen credentials.
- leaked-credentials-ajax: The system sends the leaked credentials response following an AJAX request which includes usage of stolen credentials.
- mobile: The system sends the mobile application response page when the system detects that a session is being run by a bot rather than a human.
- persistent-flow: The system sends the login page response after the user violates one of the preconditions when requesting the target URL of a configured login page.
- xml: The system sends the XML response page when the security policy blocks a client request that contains XML content that does not comply with the settings of an XML profile configured in the security policy.

- ajax
- ajax-login
- captcha
- captcha-fail
- default
- failed-login-honeypot
- failed-login-honeypot-ajax
- hijack
- leaked-credentials
- leaked-credentials-ajax
- mobile
- persistent-flow
- xml

### sensitive-parametersÂ¶

### server-technologiesÂ¶

- ASP
- ASP.NET
- AngularJS
- Apache Struts
- Apache Tomcat
- Apache/NCSA HTTP Server
- BEA Systems WebLogic Server
- Backbone.js
- CGI
- Cisco
- Citrix
- CodeIgniter
- CouchDB
- Django
- Elasticsearch
- Ember.js
- Express.js
- Front Page Server Extensions (FPSE)
- Google Web Toolkit
- GraphQL
- Handlebars
- IBM DB2
- IIS
- JBoss
- Java Servlets/JSP
- JavaScript
- JavaServer Faces (JSF)
- Jenkins
- Jetty
- Joomla
- Laravel
- Lotus Domino
- Macromedia ColdFusion
- Macromedia JRun
- Microsoft SQL Server
- Microsoft Windows
- MongoDB
- MooTools
- Mustache
- MySQL
- Nginx
- Node.js
- Novell
- Oracle
- Oracle Application Server
- Oracle Identity Manager
- Outlook Web Access
- PHP
- PostgreSQL
- Prototype
- Proxy Servers
- Python
- React
- Redis
- RequireJS
- Ruby
- SQLite
- SSI (Server Side Includes)
- SharePoint
- Spring Boot
- Sybase/ASE
- TYPO3 CMS
- UIKit
- Underscore.js
- Unix/Linux
- Vue.js
- WebDAV
- WordPress
- XML
- ZURB Foundation
- Zend
- ef.js
- jQuery

### session-trackingÂ¶

#### blockAllÂ¶

- block-all-urls
- block-authenticated-urls

#### delayBlockingÂ¶

##### violationsÂ¶

- VIOL_ASM_COOKIE_HIJACKING
- VIOL_ASM_COOKIE_MODIFIED
- VIOL_ATTACK_SIGNATURE
- VIOL_BLACKLISTED_IP
- VIOL_BLOCKING_CONDITION
- VIOL_BOT_CLIENT
- VIOL_BRUTE_FORCE
- VIOL_CONVICTION
- VIOL_COOKIE_EXPIRED
- VIOL_COOKIE_LENGTH
- VIOL_COOKIE_MALFORMED
- VIOL_COOKIE_MODIFIED
- VIOL_CROSS_ORIGIN_REQUEST
- VIOL_CSRF
- VIOL_CSRF_EXPIRED
- VIOL_DATA_GUARD
- VIOL_DATA_INTEGRITY
- VIOL_DYNAMIC_SESSION
- VIOL_ENCODING
- VIOL_EVASION
- VIOL_FILETYPE
- VIOL_FILE_UPLOAD
- VIOL_FILE_UPLOAD_IN_BODY
- VIOL_FLOW
- VIOL_FLOW_DISALLOWED_INPUT
- VIOL_FLOW_ENTRY_POINT
- VIOL_FLOW_MANDATORY_PARAMS
- VIOL_GEOLOCATION
- VIOL_GWT_FORMAT
- VIOL_GWT_MALFORMED
- VIOL_HEADER_LENGTH
- VIOL_HEADER_METACHAR
- VIOL_HEADER_REPEATED
- VIOL_HOSTNAME
- VIOL_HOSTNAME_MISMATCH
- VIOL_HTTP_PROTOCOL
- VIOL_HTTP_RESPONSE_STATUS
- VIOL_JSON_FORMAT
- VIOL_JSON_MALFORMED
- VIOL_JSON_SCHEMA
- VIOL_LEAKED_CREDENTIALS
- VIOL_LOGIN_URL_BYPASSED
- VIOL_LOGIN_URL_EXPIRED
- VIOL_MALICIOUS_DEVICE
- VIOL_MALICIOUS_IP
- VIOL_MANDATORY_HEADER
- VIOL_MANDATORY_PARAMETER
- VIOL_MANDATORY_REQUEST_BODY
- VIOL_METHOD
- VIOL_PARAMETER
- VIOL_PARAMETER_ARRAY_VALUE
- VIOL_PARAMETER_DATA_TYPE
- VIOL_PARAMETER_DYNAMIC_VALUE
- VIOL_PARAMETER_EMPTY_VALUE
- VIOL_PARAMETER_LOCATION
- VIOL_PARAMETER_MULTIPART_NULL_VALUE
- VIOL_PARAMETER_NAME_METACHAR
- VIOL_PARAMETER_NUMERIC_VALUE
- VIOL_PARAMETER_REPEATED
- VIOL_PARAMETER_STATIC_VALUE
- VIOL_PARAMETER_VALUE_BASE64
- VIOL_PARAMETER_VALUE_LENGTH
- VIOL_PARAMETER_VALUE_METACHAR
- VIOL_PARAMETER_VALUE_REGEXP
- VIOL_PLAINTEXT_FORMAT
- VIOL_POST_DATA_LENGTH
- VIOL_QUERY_STRING_LENGTH
- VIOL_RATING_NEED_EXAMINATION
- VIOL_RATING_THREAT
- VIOL_REDIRECT
- VIOL_REQUEST_LENGTH
- VIOL_REQUEST_MAX_LENGTH
- VIOL_SESSION_AWARENESS
- VIOL_THREAT_ANALYSIS
- VIOL_THREAT_CAMPAIGN
- VIOL_URL
- VIOL_URL_CONTENT_TYPE
- VIOL_URL_LENGTH
- VIOL_URL_METACHAR
- VIOL_VIRUS
- VIOL_WEBSOCKET_BAD_REQUEST
- VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH
- VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_EXTENSION
- VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT
- VIOL_WEBSOCKET_FRAME_LENGTH
- VIOL_WEBSOCKET_FRAME_MASKING
- VIOL_WEBSOCKET_FRAMING_PROTOCOL
- VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_TEXT_NULL_VALUE
- VIOL_XML_FORMAT
- VIOL_XML_MALFORMED
- VIOL_XML_SCHEMA
- VIOL_XML_SOAP_ATTACHMENT
- VIOL_XML_SOAP_METHOD
- VIOL_XML_WEB_SERVICES_SECURITY

#### logAllRequestsÂ¶

#### sessionTrackingConfigurationÂ¶

- all-login-pages
- apm
- login-pages
- none

##### detectUsernameFromLoginPagesÂ¶

#### violationDetectionActionsÂ¶

### session-tracking-statusesÂ¶

- block-all
- delay-blocking
- log-all

- N/A

- device
- ip
- session
- user

### signature-setsÂ¶

- All Response Signatures
- All Signatures
- Command Execution Signatures
- Cross Site Scripting Signatures
- Directory Indexing Signatures
- Generic Detection Signatures
- Generic Detection Signatures (High Accuracy)
- Generic Detection Signatures (High/Medium Accuracy)
- HTTP Response Splitting Signatures
- High Accuracy Detection Evasion Signatures
- High Accuracy Signatures
- Information Leakage Signatures
- Low Accuracy Signatures
- Medium Accuracy Signatures
- OS Command Injection Signatures
- OWA Signatures
- Other Application Attacks Signatures
- Path Traversal Signatures
- Predictable Resource Location Signatures
- Remote File Include Signatures
- SQL Injection Signatures
- Server Side Code Injection Signatures
- WebSphere signatures
- XPath Injection Signatures

### signature-settingsÂ¶

- detect
- detect-and-allow
- disabled

- high
- low
- medium

### signaturesÂ¶

- false
- true

### threat-campaign-settingsÂ¶

### threat-campaignsÂ¶

### urlsÂ¶

- never
- only-from
- only-same

- ACL
- BCOPY
- BDELETE
- BMOVE
- BPROPFIND
- BPROPPATCH
- CHECKIN
- CHECKOUT
- CONNECT
- COPY
- DELETE
- GET
- HEAD
- LINK
- LOCK
- MERGE
- MKCOL
- MKWORKSPACE
- MOVE
- NOTIFY
- OPTIONS
- PATCH
- POLL
- POST
- PROPFIND
- PROPPATCH
- PUT
- REPORT
- RPC_IN_DATA
- RPC_OUT_DATA
- SEARCH
- SUBSCRIBE
- TRACE
- TRACK
- UNLINK
- UNLOCK
- UNSUBSCRIBE
- VERSION_CONTROL
- X-MS-ENUMATTS
- *

Specifies an HTTP URL that the security policy allows. The available types are:

> Explicit: Specifies that the URL has a specific name and is not a wildcard entity. Type the name of a URL exactly as you expect it to appear in the request.
Wildcard: Specifies that any URL that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected URL. For example, entering the wildcard expression * specifies that any URL is allowed by the security policy.

- Explicit: Specifies that the URL has a specific name and is not a wildcard entity. Type the name of a URL exactly as you expect it to appear in the request.
- Wildcard: Specifies that any URL that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected URL. For example, entering the wildcard expression * specifies that any URL is allowed by the security policy.

The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects.

> *: Matches all characters
?: Matches any single character
[abcde]: Matches exactly one of the characters listed
[!abcde]: Matches any character not listed
[a-e]: Matches exactly one character in the range
[!a-e]: Matches any character not in the range

- *: Matches all characters
- ?: Matches any single character
- [abcde]: Matches exactly one of the characters listed
- [!abcde]: Matches any character not listed
- [a-e]: Matches exactly one character in the range
- [!a-e]: Matches any character not in the range

Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard.

- http
- https

- explicit
- wildcard

Specifies the order index for wildcard URLs matching. Wildcard URLs with lower wildcard order will get checked for a match prior to URLs with higher wildcard order.
The following are special values to be set as wildcardOrder:

> 1: First - will set 1 and increment all other wildcard entities wildcardOrder.
-1: Last - will set wildcardOrder to the last value available.
-2: Penultimate - will set wildcardOrder to the last value before the pure wildcard (pushes pure wildcard further).

- 1: First - will set 1 and increment all other wildcard entities wildcardOrder.
- -1: Last - will set wildcardOrder to the last value available.
- -2: Penultimate - will set wildcardOrder to the last value before the pure wildcard (pushes pure wildcard further).

#### dynamicFlowsÂ¶

#### html5CrossOriginRequestsEnforcementÂ¶

- replace-with
- unmodified

- disabled
- enforce
- remove-all-headers
- replace-headers

##### crossDomainAllowedHeaderÂ¶

##### crossDomainAllowedMethodÂ¶

##### crossDomainAllowedOriginÂ¶

- integer
- string

- Integer values
- âallâ

- http
- http/https
- https

##### crossDomainExposedHeaderÂ¶

#### metacharOverridesÂ¶

#### methodOverridesÂ¶

- ACL
- BCOPY
- BDELETE
- BMOVE
- BPROPFIND
- BPROPPATCH
- CHECKIN
- CHECKOUT
- CONNECT
- COPY
- DELETE
- GET
- HEAD
- LINK
- LOCK
- MERGE
- MKCOL
- MKWORKSPACE
- MOVE
- NOTIFY
- OPTIONS
- PATCH
- POLL
- POST
- PROPFIND
- PROPPATCH
- PUT
- REPORT
- RPC_IN_DATA
- RPC_OUT_DATA
- SEARCH
- SUBSCRIBE
- TRACE
- TRACK
- UNLINK
- UNLOCK
- UNSUBSCRIBE
- VERSION_CONTROL
- X-MS-ENUMATTS

#### positionalParametersÂ¶

#### signatureOverridesÂ¶

#### urlContentProfilesÂ¶

- integer
- string

- Integer values
- âdefaultâ

- apply-content-signatures
- apply-value-and-content-signatures
- disallow
- do-nothing
- form-data
- gwt
- json
- xml

##### contentProfileÂ¶

### vulnerability-assessmentÂ¶

- registration-completed
- registration-requested
- scan-completed

- generic
- hp-webinspect
- ibm-appscan
- immuniweb
- none
- qualys
- quotium-seeker
- trustwave
- whitehat-sentinel
- whitehat-sentinel-european

- daily
- monthly
- never
- weekly

#### trustedTrafficLoosenÂ¶

#### untrustedTrafficLoosenÂ¶

### webhooksÂ¶

- apply-policy
- apply-policy-failed
- http-request-illegal
- http-request-likely-malicious
- http-request-needing-examination
- incident-end
- incident-start

### websocket-urlsÂ¶

- block
- ignore
- remove

- ws
- wss

- explicit
- wildcard

- block
- ignore
- remove

#### html5CrossOriginRequestsEnforcementÂ¶

- disabled
- enforce
- remove-all-headers

##### crossDomainAllowedOriginÂ¶

- integer
- string

- Integer values
- âallâ

- http
- http/https
- https

#### metacharOverridesÂ¶

### whitelist-ipsÂ¶

- Policy Default: Specifies that the Policy Blocking Settings will be used for requests from this IP address.
- Never Block: Specifies that the system does not block requests sent from this IP address, even if your security policy is configured to block all traffic.
- Always Block: Specifies that the system blocks requests sent from this IP address on condition that IP is blacklisted is set to Block under Policy Building Settings.

- always
- never
- policy-default

### xml-profilesÂ¶

#### defenseAttributesÂ¶

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

- integer
- string

- Integer values
- âanyâ

#### metacharOverridesÂ¶

#### sensitiveDataÂ¶

#### signatureOverridesÂ¶

#### soapMethodsÂ¶

#### validationFilesÂ¶

#### wssConfigurationÂ¶

- aes128
- aes256
- tripledes

- rsa-1_5
- rsa-oaep

- encrypt
- encrypt-then-sign
- sign
- sign-then-encrypt

- hmac-sha1
- rsa-sha1

##### clientCertificatesÂ¶

##### elementsÂ¶

- request
- response

- content
- element

##### namespaceMappingÂ¶

##### rolesÂ¶

- request
- response

- next
- none
- ultimateReceiver

### xml-validation-filesÂ¶

#### evasionsÂ¶

- %u decoding
- Apache whitespace
- Bad unescape
- Bare byte decoding
- Directory traversals
- IIS Unicode codepoints
- IIS backslashes
- Multiple decoding

#### generalÂ¶

- blocking
- transparent

#### http-protocolsÂ¶

- Bad HTTP version
- Bad host header value
- Bad multipart parameters parsing
- Bad multipart/form-data request parsing
- Body in GET or HEAD requests
- CRLF characters before request start
- Check maximum number of headers
- Check maximum number of parameters
- Chunked request with Content-Length header
- Content length should be a positive number
- Header name with no header value
- High ASCII characters in headers
- Host header contains IP address
- Multiple host headers
- No Host header in HTTP/1.1 request
- Null in request
- POST request with Content-Length: 0
- Several Content-Length headers
- Unparsable request content

#### violationsÂ¶

- VIOL_ASM_COOKIE_HIJACKING
- VIOL_ASM_COOKIE_MODIFIED
- VIOL_ATTACK_SIGNATURE
- VIOL_BLACKLISTED_IP
- VIOL_BLOCKING_CONDITION
- VIOL_BOT_CLIENT
- VIOL_BRUTE_FORCE
- VIOL_CONVICTION
- VIOL_COOKIE_EXPIRED
- VIOL_COOKIE_LENGTH
- VIOL_COOKIE_MALFORMED
- VIOL_COOKIE_MODIFIED
- VIOL_CROSS_ORIGIN_REQUEST
- VIOL_CSRF
- VIOL_CSRF_EXPIRED
- VIOL_DATA_GUARD
- VIOL_DATA_INTEGRITY
- VIOL_DYNAMIC_SESSION
- VIOL_ENCODING
- VIOL_EVASION
- VIOL_FILETYPE
- VIOL_FILE_UPLOAD
- VIOL_FILE_UPLOAD_IN_BODY
- VIOL_FLOW
- VIOL_FLOW_DISALLOWED_INPUT
- VIOL_FLOW_ENTRY_POINT
- VIOL_FLOW_MANDATORY_PARAMS
- VIOL_GEOLOCATION
- VIOL_GWT_FORMAT
- VIOL_GWT_MALFORMED
- VIOL_HEADER_LENGTH
- VIOL_HEADER_METACHAR
- VIOL_HEADER_REPEATED
- VIOL_HOSTNAME
- VIOL_HOSTNAME_MISMATCH
- VIOL_HTTP_PROTOCOL
- VIOL_HTTP_RESPONSE_STATUS
- VIOL_JSON_FORMAT
- VIOL_JSON_MALFORMED
- VIOL_JSON_SCHEMA
- VIOL_LEAKED_CREDENTIALS
- VIOL_LOGIN_URL_BYPASSED
- VIOL_LOGIN_URL_EXPIRED
- VIOL_MALICIOUS_DEVICE
- VIOL_MALICIOUS_IP
- VIOL_MANDATORY_HEADER
- VIOL_MANDATORY_PARAMETER
- VIOL_MANDATORY_REQUEST_BODY
- VIOL_METHOD
- VIOL_PARAMETER
- VIOL_PARAMETER_ARRAY_VALUE
- VIOL_PARAMETER_DATA_TYPE
- VIOL_PARAMETER_DYNAMIC_VALUE
- VIOL_PARAMETER_EMPTY_VALUE
- VIOL_PARAMETER_LOCATION
- VIOL_PARAMETER_MULTIPART_NULL_VALUE
- VIOL_PARAMETER_NAME_METACHAR
- VIOL_PARAMETER_NUMERIC_VALUE
- VIOL_PARAMETER_REPEATED
- VIOL_PARAMETER_STATIC_VALUE
- VIOL_PARAMETER_VALUE_BASE64
- VIOL_PARAMETER_VALUE_LENGTH
- VIOL_PARAMETER_VALUE_METACHAR
- VIOL_PARAMETER_VALUE_REGEXP
- VIOL_PLAINTEXT_FORMAT
- VIOL_POST_DATA_LENGTH
- VIOL_QUERY_STRING_LENGTH
- VIOL_RATING_NEED_EXAMINATION
- VIOL_RATING_THREAT
- VIOL_REDIRECT
- VIOL_REQUEST_LENGTH
- VIOL_REQUEST_MAX_LENGTH
- VIOL_SESSION_AWARENESS
- VIOL_THREAT_ANALYSIS
- VIOL_THREAT_CAMPAIGN
- VIOL_URL
- VIOL_URL_CONTENT_TYPE
- VIOL_URL_LENGTH
- VIOL_URL_METACHAR
- VIOL_VIRUS
- VIOL_WEBSOCKET_BAD_REQUEST
- VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH
- VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_EXTENSION
- VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT
- VIOL_WEBSOCKET_FRAME_LENGTH
- VIOL_WEBSOCKET_FRAME_MASKING
- VIOL_WEBSOCKET_FRAMING_PROTOCOL
- VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED
- VIOL_WEBSOCKET_TEXT_NULL_VALUE
- VIOL_XML_FORMAT
- VIOL_XML_MALFORMED
- VIOL_XML_SCHEMA
- VIOL_XML_SOAP_ATTACHMENT
- VIOL_XML_SOAP_METHOD
- VIOL_XML_WEB_SERVICES_SECURITY

#### web-services-securitiesÂ¶

- Certificate Error
- Certificate Expired
- Decryption Error
- Encryption Error
- Expired Timestamp
- Internal Error
- Invalid Timestamp
- Malformed Error
- Missing Timestamp
- Signing Error
- Timestamp expiration is too far in the future
- UnSigned Timestamp
- Verification Error


## 表格

### 表格 1

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| antivirus | object |  |  |
| applicationLanguage | string | The language encoding for the web application. The language encoding determines how the policy processes the character sets. The default is Auto detect. | auto-detect big5 euc-jp euc-kr gb18030 gb2312 gbk iso-8859-1 iso-8859-10 iso-8859-13 iso-8859-15 iso-8859-16 iso-8859-2 iso-8859-3 iso-8859-4 iso-8859-5 iso-8859-6 iso-8859-7 iso-8859-8 iso-8859-9 koi8-r shift_jis utf-8 windows-1250 windows-1251 windows-1252 windows-1253 windows-1255 windows-1256 windows-1257 windows-874 |
| behavioral-enforcement | object |  |  |
| blocking-settings | object |  |  |
| brute-force-attack-preventions | array of objects |  |  |
| caseInsensitive | boolean | Specifies whether the security policy treats microservice URLs, file types, URLs, and parameters as case sensitive or not. When this setting is enabled, the system stores these security policy elements in lowercase in the security policy configuration. |  |
| character-sets | array of objects |  |  |
| cookie-settings | object | The maximum length of a cookie header name and value that the system processes. The system calculates and enforces a cookie header length based on the sum of the length of the cookie header name and value. |  |
| cookies | array of objects |  |  |
| csrf-protection | object |  |  |
| csrf-urls | array of objects |  |  |
| data-guard | object | Data Guard feature can prevent responses from exposing sensitive information by masking the data. |  |
| database-protection | object |  |  |
| deception-response-pages | array of objects |  |  |
| deception-settings | object |  |  |
| description | string | Specifies the description of the policy. |  |
| disabled-action-items | array of objects |  |  |
| disallowed-geolocations | array of objects |  |  |
| enablePassiveMode | boolean | Passive Mode allows the policy to be associated with a Performance L4 Virtual Server (using a FastL4 profile). With FastL4, traffic is analyzed but is not modified in any way. Enable Passive Mode to allow associating the policy with a Performance L4 Virtual Server. |  |
| enforcementMode | string | How the system processes a URL request that triggers a security policy violation. Blocking: When the enforcement mode is set to blocking, traffic is blocked if it causes a violation (configured for blocking), and the enforcement readiness period is over. Transparent: When the enforcement mode is set to transparent, traffic is not blocked even if a violation is triggered. | blocking transparent |
| filetypes | array of objects |  |  |
| fullPath | string | The full name of the policy including partition. |  |
| general | object | This section includes several advanced policy configuration settings. |  |
| gwt-profiles | array of objects |  |  |
| header-settings | object | The maximum length of an HTTP header name and value that the system processes. The system calculates and enforces the HTTP header length based on the sum of the length of the HTTP header name and value. |  |
| headers | array of objects |  |  |
| host-names | array of objects |  |  |
| ip-intelligence | object |  |  |
| json-profiles | array of objects |  |  |
| json-validation-files | array of objects |  |  |
| login-enforcement | object |  |  |
| login-pages | array of objects |  |  |
| methods | array of objects |  |  |
| microservices | array of objects |  |  |
| `mitigations <policy/mitigations_>`_ | object |  |  |
| name | string | The unique user-given name of the policy. Policy names cannot contain spaces or special characters. Allowed characters are a-z, A-Z, 0-9, dot, dash (-), colon (:) and underscore (_). |  |
| navigation-parameters | array of objects |  |  |
| open-api-files | array of objects |  |  |
| parameters | array of objects |  |  |
| plain-text-profiles | array of objects |  |  |
| policy-builder | object |  |  |
| policy-builder-central-configuration | object | Defines Policy Builder learning location and related configuration. |  |
| policy-builder-cookie | object |  |  |
| policy-builder-filetype | object | Defines Policy Builder behavior for filetypes |  |
| policy-builder-header | object |  |  |
| policy-builder-parameter | object | Defines Policy Builder behavior for parameters |  |
| policy-builder-redirection-protection | object |  |  |
| policy-builder-server-technologies | object | Defines Policy Builder behavior for Server Technologies |  |
| policy-builder-sessions-and-logins | object |  |  |
| policy-builder-url | object |  |  |
| protocolIndependent | boolean | When creating a security policy, you can determine whether a security policy differentiates between HTTP and HTTPS URLs. If enabled, the security policy differentiates between HTTP and HTTPS URLs. If disabled, the security policy configures URLs without specifying a specific protocol. This is useful for applications that behave the same for HTTP and HTTPS, and it keeps the security policy from including the same URL twice. |  |
| redirection-protection | object |  |  |
| redirection-protection-domains | array of objects |  |  |
| response-pages | array of objects |  |  |
| sensitive-parameters | array of objects |  |  |
| server-technologies | array of objects |  |  |
| session-tracking | object |  |  |
| session-tracking-statuses | array of objects |  |  |
| signature-requirements | object |  |  |
| signature-sets | array of objects |  |  |
| signature-settings | object |  |  |
| signatures | array of objects |  |  |
| softwareVersion | string |  |  |
| template | object | Specifies the template to populate the attributes of a new policy. The template is only used when creating the policy - a security policy is always created based on a user-defined or system-supplied template. Unlike parent policies, the templates do not affect the policy after it is created. If you modify a template, policies created from it in the past are not affected. |  |
| threat-campaign-settings | object |  |  |
| threat-campaigns | array of objects |  |  |
| type | string | The type of policy you want to create. The default policy type is Security. Parent: A parent policy can be used as a basis for similar child policies. Parent policy settings can be inherited to its child policies. A parent policy cannot be applied to Virtual Servers. No traffic can flow through them. They are just models. Security: A security policy can be created from a parent policy or as a stand-alone policy. Changes to a security policy do not affect other security policies. A security policy can be applied to a virtual server. | parent security |
| urls | array of objects |  |  |
| vulnerability-assessment | object |  |  |
| webhooks | array of objects |  |  |
| websocket-urls | array of objects |  |  |
| whitelist-ips | array of objects |  |  |
| xml-profiles | array of objects |  |  |
| xml-validation-files | array of objects |  |  |


### 表格 2

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| link | string |  |  |


### 表格 3

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maxRevisionDatetime | string |  |  |
| minRevisionDatetime | string |  |  |
| tag | string |  |  |


### 表格 4

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string | Specifies the name of the template used for the policy creation. | POLICY_TEMPLATE_ACTIVESYNC_V1_0_V2_0_HTTP POLICY_TEMPLATE_ACTIVESYNC_V1_0_V2_0_HTTPS POLICY_TEMPLATE_API_SECURITY POLICY_TEMPLATE_BEHAVIORAL_WAF POLICY_TEMPLATE_COMPREHENSIVE POLICY_TEMPLATE_DRUPAL POLICY_TEMPLATE_DRUPAL_8 POLICY_TEMPLATE_FUNDAMENTAL POLICY_TEMPLATE_JOOMLA POLICY_TEMPLATE_LOTUSDOMINO_6_5_HTTP POLICY_TEMPLATE_LOTUSDOMINO_6_5_HTTPS POLICY_TEMPLATE_NGINX_BASE POLICY_TEMPLATE_ORACLE_10G_PORTAL_HTTP POLICY_TEMPLATE_ORACLE_10G_PORTAL_HTTPS POLICY_TEMPLATE_ORACLE_APPLICATIONS_11I_HTTP POLICY_TEMPLATE_ORACLE_APPLICATIONS_11I_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE POLICY_TEMPLATE_OWA_EXCHANGE_2003_HTTP POLICY_TEMPLATE_OWA_EXCHANGE_2003_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE_2003_WITH_ACTIVESYNC_HTTP POLICY_TEMPLATE_OWA_EXCHANGE_2003_WITH_ACTIVESYNC_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE_2007_HTTP POLICY_TEMPLATE_OWA_EXCHANGE_2007_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE_2007_WITH_ACTIVESYNC_HTTP POLICY_TEMPLATE_OWA_EXCHANGE_2007_WITH_ACTIVESYNC_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE_2010_HTTP POLICY_TEMPLATE_OWA_EXCHANGE_2010_HTTPS POLICY_TEMPLATE_OWA_EXCHANGE_2016 POLICY_TEMPLATE_PASSIVE POLICY_TEMPLATE_PEOPLESOFT_PORTAL_9_HTTP POLICY_TEMPLATE_PEOPLESOFT_PORTAL_9_HTTPS POLICY_TEMPLATE_RAPID_DEPLOYMENT POLICY_TEMPLATE_RAPID_DEPLOYMENT_HTTP POLICY_TEMPLATE_RAPID_DEPLOYMENT_HTTPS POLICY_TEMPLATE_RAPID_DEPLOYMENT_PB POLICY_TEMPLATE_SAP_NETWEAVER POLICY_TEMPLATE_SAP_NETWEAVER_7_HTTP POLICY_TEMPLATE_SAP_NETWEAVER_7_HTTPS POLICY_TEMPLATE_SHAREPOINT POLICY_TEMPLATE_SHAREPOINT_2003_HTTP POLICY_TEMPLATE_SHAREPOINT_2003_HTTPS POLICY_TEMPLATE_SHAREPOINT_2007_HTTP POLICY_TEMPLATE_SHAREPOINT_2007_HTTPS POLICY_TEMPLATE_SHAREPOINT_2010_HTTP POLICY_TEMPLATE_SHAREPOINT_2010_HTTPS POLICY_TEMPLATE_SHAREPOINT_2016 POLICY_TEMPLATE_VULNERABILITY_ASSESSMENT POLICY_TEMPLATE_WORDPRESS POLICY_TEMPLATE_WORDPRESS_4_9 |


### 表格 5

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| inspectHttpUploads | boolean |  |  |


### 表格 6

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| behavioralEnforcementViolations | array of objects |  |  |
| enableBehavioralEnforcement | boolean |  |  |
| enableBlockingCveSignatures | boolean |  |  |
| enableBlockingHighAccuracySignatures | boolean |  |  |
| enableBlockingLikelyMaliciousTransactions | boolean |  |  |
| enableBlockingSuspiciousTransactions | boolean |  |  |
| enableBlockingViolations | boolean |  |  |


### 表格 7

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  | VIOL_ASM_COOKIE_HIJACKING VIOL_ASM_COOKIE_MODIFIED VIOL_ATTACK_SIGNATURE VIOL_BLACKLISTED_IP VIOL_BLOCKING_CONDITION VIOL_BOT_CLIENT VIOL_BRUTE_FORCE VIOL_CONVICTION VIOL_COOKIE_EXPIRED VIOL_COOKIE_LENGTH VIOL_COOKIE_MALFORMED VIOL_COOKIE_MODIFIED VIOL_CROSS_ORIGIN_REQUEST VIOL_CSRF VIOL_CSRF_EXPIRED VIOL_DATA_GUARD VIOL_DATA_INTEGRITY VIOL_DYNAMIC_SESSION VIOL_ENCODING VIOL_EVASION VIOL_FILETYPE VIOL_FILE_UPLOAD VIOL_FILE_UPLOAD_IN_BODY VIOL_FLOW VIOL_FLOW_DISALLOWED_INPUT VIOL_FLOW_ENTRY_POINT VIOL_FLOW_MANDATORY_PARAMS VIOL_GEOLOCATION VIOL_GWT_FORMAT VIOL_GWT_MALFORMED VIOL_HEADER_LENGTH VIOL_HEADER_METACHAR VIOL_HEADER_REPEATED VIOL_HOSTNAME VIOL_HOSTNAME_MISMATCH VIOL_HTTP_PROTOCOL VIOL_HTTP_RESPONSE_STATUS VIOL_JSON_FORMAT VIOL_JSON_MALFORMED VIOL_JSON_SCHEMA VIOL_LEAKED_CREDENTIALS VIOL_LOGIN_URL_BYPASSED VIOL_LOGIN_URL_EXPIRED VIOL_MALICIOUS_DEVICE VIOL_MALICIOUS_IP VIOL_MANDATORY_HEADER VIOL_MANDATORY_PARAMETER VIOL_MANDATORY_REQUEST_BODY VIOL_METHOD VIOL_PARAMETER VIOL_PARAMETER_ARRAY_VALUE VIOL_PARAMETER_DATA_TYPE VIOL_PARAMETER_DYNAMIC_VALUE VIOL_PARAMETER_EMPTY_VALUE VIOL_PARAMETER_LOCATION VIOL_PARAMETER_MULTIPART_NULL_VALUE VIOL_PARAMETER_NAME_METACHAR VIOL_PARAMETER_NUMERIC_VALUE VIOL_PARAMETER_REPEATED VIOL_PARAMETER_STATIC_VALUE VIOL_PARAMETER_VALUE_BASE64 VIOL_PARAMETER_VALUE_LENGTH VIOL_PARAMETER_VALUE_METACHAR VIOL_PARAMETER_VALUE_REGEXP VIOL_PLAINTEXT_FORMAT VIOL_POST_DATA_LENGTH VIOL_QUERY_STRING_LENGTH VIOL_RATING_NEED_EXAMINATION VIOL_RATING_THREAT VIOL_REDIRECT VIOL_REQUEST_LENGTH VIOL_REQUEST_MAX_LENGTH VIOL_SESSION_AWARENESS VIOL_THREAT_ANALYSIS VIOL_THREAT_CAMPAIGN VIOL_URL VIOL_URL_CONTENT_TYPE VIOL_URL_LENGTH VIOL_URL_METACHAR VIOL_VIRUS VIOL_WEBSOCKET_BAD_REQUEST VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_EXTENSION VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT VIOL_WEBSOCKET_FRAME_LENGTH VIOL_WEBSOCKET_FRAME_MASKING VIOL_WEBSOCKET_FRAMING_PROTOCOL VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_TEXT_NULL_VALUE VIOL_XML_FORMAT VIOL_XML_MALFORMED VIOL_XML_SCHEMA VIOL_XML_SOAP_ATTACHMENT VIOL_XML_SOAP_METHOD VIOL_XML_WEB_SERVICES_SECURITY |


### 表格 8

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| evasions | array of objects |  |  |
| general | object |  |  |
| http-protocols | array of objects |  |  |
| violations | array of objects |  |  |
| web-services-securities | array of objects |  |  |


### 表格 9

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| bruteForceProtectionForAllLoginPages | boolean | When enabled, enables Brute Force Protection for all configured login URLs. When disabled, only brute force configurations for specific login pages are applied in case they exist. |  |
| captchaBypassCriteria | object | Specifies configuration for CAPTCHA Bypass Mitigation. |  |
| clientSideIntegrityBypassCriteria | object | Specifies configuration for Client Side Integrity Bypass Mitigation. |  |
| detectionCriteria | object | Specifies configuration for detecting distributed brute force attacks. |  |
| leakedCredentialsCriteria | object | Specifies configuration for Leaked Credentials Detection. |  |
| loginAttemptsFromTheSameDeviceId | object | Specifies configuration for detecting brute force attacks for Device ID. |  |
| loginAttemptsFromTheSameIp | object | Specifies configuration for detecting brute force attacks from IP Address. |  |
| loginAttemptsFromTheSameUser | object | Specifies configuration for detecting brute force attacks for Username. |  |
| measurementPeriod | integer | Defines detection period (measured in minutes) for distributed brute force attacks. |  |
| preventionDuration | integer string | Defines prevention period (measured in minutes) for distributed brute force attacks. | Integer values â90000â |
| reEnableLoginAfter | integer | Defines prevention period (measured in minutes) for source-based brute force attacks. |  |
| sourceBasedProtectionDetectionPeriod | integer | Defines detection period (measured in minutes) for source-based brute force attacks. |  |
| url | object | Reference to the URL used in login URL configuration (policy/login-pages). This login URL is protected by Brute Force Protection feature. |  |


### 表格 10

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when defined threshold is reached. alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page. alarm-and-drop: The system will log the login attempt and reset the TCP connection. alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking. | alarm-and-blocking-page alarm-and-drop alarm-and-honeypot-page |
| enabled | boolean | When enabled, the system counts successful CAPTCHA challenges with failed logins from IP Address / Device ID. |  |
| threshold | integer | After configured threshold (number of successful CAPTCHA challenges with failed logins from IP Address / Device ID) defined action will be applied for the next login attempt |  |


### 表格 11

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when defined threshold is reached. alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge. | alarm-and-captcha |
| enabled | boolean | When enabled, the system counts successful challenges with failed logins from IP Address / Device ID / Username. Legitimate users who have disabled JavaScripting on their browsers for security reasons will fail a client side integrity challenge. |  |
| threshold | integer | After configured threshold (number of successful challenges with failed logins from IP Address / Device ID / Username) defined action will be applied for the next login attempt |  |


### 表格 12

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when one of the defined thresholds (credentialsStuffingMatchesReached, failedLoginAttemptsRateReached) is reached. alarm: The system will log the login attempt. alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge. alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge. alarm-and-client-side-integrity-captcha: The system sends a Client Side Integrity challenge upon the first failed login attempt from a source and a CAPTCHA challenge upon second and all subsequent failed login attempts. A login attempt is logged if client successfully passes the challenge. This enforcement action should be chosen if CAPTCHA is considered intrusive. Benign users who mistype their password will likely get only the Client Side Integrity challenge, while an attacker will eventually get the CAPTCHA challenge. | alarm alarm-and-captcha alarm-and-client-side-integrity alarm-and-client-side-integrity-captcha |
| credentialsStuffingMatchesReached | integer | After configured threshold (number of detected login attempts that match known leaked credentials library) defined action will be applied for the next login attempt. |  |
| detectCredentialsStuffingAttack | boolean | When enabled, the system detects login attempts that match known leaked credentials library. |  |
| detectDistributedBruteForceAttack | boolean | When enabled, the system detects distributed brute force attacks. |  |
| failedLoginAttemptsRateReached | integer | After configured threshold (number of failed login attempts within measurementPeriod) defined action will be applied for the next login attempt. |  |


### 表格 13

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action when leaked credentials detected. alarm: The system will log the login attempt. alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page. alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking. alarm-and-leaked-credentials-response-page: The default response page warns the user that the username and password have been leaked and the password should be changed. | alarm alarm-and-blocking-page alarm-and-honeypot-page alarm-and-leaked-credentials-response-page |
| enabled | boolean | When enabled, the system can match presented credentials to those in the credentials dictionary to detect leaked credentials. |  |


### 表格 14

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when defined threshold is reached. alarm: The system will log the login attempt. alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page. alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge. alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge. alarm-and-drop: The system will log the login attempt and reset the TCP connection. alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking. | alarm alarm-and-blocking-page alarm-and-captcha alarm-and-client-side-integrity alarm-and-drop alarm-and-honeypot-page |
| enabled | boolean | When enabled, the system counts failed login attempts for Device ID. |  |
| threshold | integer | After configured threshold (number of failed login attempts for Device ID) defined action will be applied for the next login attempt. |  |


### 表格 15

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when defined threshold is reached. alarm: The system will log the login attempt. alarm-and-blocking-page: The system will log the login attempt, block the request and send the Blocking page. alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge. alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge. alarm-and-drop: The system will log the login attempt and reset the TCP connection. alarm-and-honeypot-page: The system will log the login attempt, block the request and send the Honeypot page. The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. As a result, the attacker will not change identity (Source IP or Device ID) and the brute force attack will be rendered ineffective. The Honeypot page is recommended when mitigation is request blocking. | alarm alarm-and-blocking-page alarm-and-captcha alarm-and-client-side-integrity alarm-and-drop alarm-and-honeypot-page |
| enabled | boolean | When enabled, the system counts failed login attempts from IP Address. |  |
| threshold | integer | After configured threshold (number of failed login attempts from IP Address) defined action will be applied for the next login attempt. |  |


### 表格 16

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string | Specifies action that is applied when defined threshold is reached. alarm: The system will log the login attempt. alarm-and-captcha: The system determines whether the client is a legal browser operated by a human user by sending a CAPTCHA challenge. A login attempt is logged if the client successfully passes the CAPTCHA challenge. alarm-and-client-side-integrity: The system determines whether the client is a legal browser or a bot by sending a page containing JavaScript code and waiting for a response. Legal browsers are able to execute JavaScript and produce a valid response, whereas bots cannot. A login attempt is logged if the client successfully passes the Client Side Integrity challenge. | alarm alarm-and-captcha alarm-and-client-side-integrity |
| enabled | boolean | When enabled, the system counts failed login attempts for each Username. |  |
| threshold | integer | After configured threshold (number of failed login attempts for each Username) defined action will be applied for the next login attempt. |  |


### 表格 17

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| characterSet | array of objects |  |  |
| characterSetType | string |  | gwt-content header json-content parameter-name parameter-value plain-text-content url xml-content |


### 表格 18

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 19

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumCookieHeaderLength | integer string | Maximum Cookie Header Length must be greater than 0 and less than 65536 bytes (64K). Note: if 0 or any are set, then no restriction on the cookie header length is applied. | Integer values âanyâ |


### 表格 20

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| accessibleOnlyThroughTheHttpProtocol | boolean | Specifies, when true, that the system adds the HttpOnly attribute to the domain cookieâs response header. This is done to expose the cookie to only HTTP and HTTPS entities. This prevents the cookie from being modified, or intercepted even if it is not modified, by unwanted third parties that run scripts on the web page. Notes: The system does not validate that the cookie has not been modified or intercepted. The feature covers all security policy cookies, both enforced and allowed, explicit and wildcard. |  |
| attackSignaturesCheck | boolean | Specifies, when true, that you want attack signatures and threat campaigns to be detected on this cookie and possibly override the security policy settings of an attack signature or threat campaign specifically for this cookie. After you enable this setting, the system displays a list of attack signatures and threat campaigns. |  |
| enforcementType | string | Specifies how the system treats this cookie. enforced: Specifies that according to the security policy, this cookie may not be changed by the client. allowed: Specifies that according to the security policy, this cookie may be changed by the client. The system ignores this cookie. | allow enforce |
| insertSameSiteAttribute | string | The introduction of the SameSite http attribute (defined in [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00)) allows you to declare if your cookie should be restricted to a first-party or same-site context. Introducing the SameSite attribute on a cookie provides three different ways of controlling same-site vs. cross-site cookie sending: strict: Cookie will only be sent in a first-party context. In user terms, the cookie will only be sent if the site for the cookie matches the site currently shown in the browserâs URL bar. lax: Cookies will be sent with top level navigation none-value: Cookies will be sent in a third-party context. | lax none none-value strict |
| isBase64 | boolean | You can enable the security policy to check whether cookie values contain a Base64 encoded string. If the value is indeed Base64 encoded, the system decodes this value and continues with its security checks. Specifies, when true, that the security policy checks the cookieâs value for Base64 encoding, and decodes the value. Note: This setting is only available if Cookie Type is set to Allowed. |  |
| maskValueInLogs | boolean | Specifies, when true, that the cookieâs value will be masked in the request log |  |
| name | string | Specifies the cookie name as appearing in the http cookie header. The cookie name length is limited to 500 characters. Names can be one of the following according to the type attribute: explicit: Specifies that the cookie has a specific name and is not a wildcard entity. Type the name of a cookie exactly as you expect it to appear in the request. wildcard: Specifies that any cookie that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected cookie. For example, the wildcard expression cookie_12* of type Enforced specifies that the security policy should not allow modified domain cookies for all cookies which match cookie_12*. The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects. *: Matches all characters ?: Matches any single character [abcde]: Matches exactly one of the characters listed [!abcde]: Matches any character not listed [a-e]: Matches exactly one character in the range [!a-e]: Matches any character not in the range Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard. |  |
| performStaging | boolean | If true then any violation associated to the respective cookie will not be enforced, and the request will not be considered illegal. |  |
| securedOverHttpsConnection | boolean | Specifies, when true, that the system adds the Secure attribute to the domain cookieâs response header. This is done to ensure that the cookies are returned to the server only over SSL (by using the HTTPS protocol). This prevents the cookie from being intercepted, but does not guarantee its integrity. Notes: The system does not validate that the cookie was received over SSL. The feature covers all security policy cookies, both enforced and allowed, explicit and wildcard. |  |
| signatureOverrides | array of objects | Array of signature overrides. Specifies attack signatures whose security policy settings are overridden for this cookie, and which action the security policy takes when it discovers a request for this cookie that matches these attack signatures. |  |
| type | string | Determines the type of the name attribute. Only when setting the type to wildcard will the special wildcard characters in the name interpreted as such. | explicit wildcard |
| wildcardOrder | integer | Specifies the order index for wildcard cookies matching. Wildcard cookies with lower wildcard order will get checked for a match prior to cookies with higher wildcard order. |  |


### 表格 21

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean | Specifies, when true, that the overridden signature is enforced |  |
| signatureId | integer | The signature ID which identifies the signature. |  |


### 表格 22

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| expirationTimeInSeconds | integer string |  | Integer values âdisabledâ |
| sslOnly | boolean |  |  |


### 表格 23

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enforcementAction | string |  | none verify-csrf-token verify-origin |
| method | string |  | GET POST any |
| parametersList | array of strings |  |  |
| requiredParameters | string |  | at-least-one from-parameters-list ignore |
| url | string |  |  |
| wildcardOrder | integer |  |  |


### 表格 24

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| creditCardNumbers | boolean | If true the system considers credit card numbers as sensitive data. |  |
| customPatterns | boolean | If true the system recognizes customized patterns as sensitive data. |  |
| customPatternsList | array of strings | List of PCRE regular expressions that specify the sensitive data patterns. |  |
| enabled | boolean | If true the system protects sensitive data. |  |
| enforcementMode | string | Specifies the URLs for which the system enforces data guard protection. ignore-urls-in-list: Specifies that the system enforces data guard protection for all URLs except for those URLs in the Enforcement Mode list. enforce-urls-in-list: Specifies that the system enforces data guard protection only for those URLs in the Enforcement Mode list | enforce-urls-in-list ignore-urls-in-list |
| enforcementUrls | array of strings | List of URLS to be enforced based on enforcement mode of data guard protection. |  |
| exceptionPatterns | boolean | If true the system recognizes exception patterns as not being sensitive data. |  |
| exceptionPatternsList | array of strings | List of PCRE regular expressions that specify the data patterns that are not recognized as sensitive data. |  |
| fileContentDetection | boolean | If true the system checks responses for file content. |  |
| fileContentDetectionFormats | array of objects | File content types that the system considers to be sensitive data. Available file content types: MS Office 2007 or later MS Office 97-2003 document PDF - Adobe Portable Document Format Mach-O - Mach object file format - used in Mac OS X PE - Portable Executable for Windows ELF - binary file format for Unix |  |
| lastCcnDigitsToExpose | integer | Specifies the number of last digits in credit card numbers that are exposed. |  |
| lastSsnDigitsToExpose | integer | Specifies the number of last digits in U.S Social Security numbers that are exposed. |  |
| maskData | boolean | If true the system intercepts the returned responses to mask sensitive data. |  |
| usSocialSecurityNumbers | boolean | If true the system considers U.S Social Security numbers as sensitive data. |  |


### 表格 25

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  | ELF - binary file format for Unix MS Office 2007 or later MS Office 97-2003 document Mach-O - Mach object file format - used in Mac OS X PDF - Adobe Portable Document Format PE - Portable Executable for Windows |


### 表格 26

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| databaseProtectionEnabled | boolean |  |  |
| userSource | string |  | apm login-pages |


### 表格 27

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| responseBody | string |  |  |
| responseHeaders | string |  |  |
| responseStatusCode | string |  |  |


### 表格 28

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enableCustomResponses | boolean |  |  |
| enableResponsePageByAttackType | boolean |  |  |
| responseStatusCodes | array of strings |  |  |
| serverTechnologyName | string |  | ASP ASP.NET AngularJS Apache Struts Apache Tomcat Apache/NCSA HTTP Server BEA Systems WebLogic Server Backbone.js CGI Cisco Citrix CodeIgniter CouchDB Django Elasticsearch Ember.js Express.js Front Page Server Extensions (FPSE) Google Web Toolkit GraphQL Handlebars IBM DB2 IIS JBoss Java Servlets/JSP JavaScript JavaServer Faces (JSF) Jenkins Jetty Joomla Laravel Lotus Domino Macromedia ColdFusion Macromedia JRun Microsoft SQL Server Microsoft Windows MongoDB MooTools Mustache MySQL Nginx Node.js Novell Oracle Oracle Application Server Oracle Identity Manager Outlook Web Access PHP PostgreSQL Prototype Proxy Servers Python React Redis RequireJS Ruby SQLite SSI (Server Side Includes) SharePoint Spring Boot Sybase/ASE TYPO3 CMS UIKit Underscore.js Unix/Linux Vue.js WebDAV WordPress XML ZURB Foundation Zend ef.js jQuery |


### 表格 29

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| type | string |  | cookie-staging default-parameter filetype-staging modified-policy parameter-staging policy-validation scanner-vulnerabilities signature-staging threat-campaign-staging transparent-policy url-staging websocket-url-staging |


### 表格 30

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| countryCode | string | Specifies the ISO country code of the selected country. |  |
| countryName | string | Specifies the name of the country. | Afghanistan Aland Islands Albania Algeria American Samoa Andorra Angola Anguilla Anonymous Proxy Antarctica Antigua and Barbuda Argentina Armenia Aruba Australia Austria Azerbaijan Bahamas Bahrain Bangladesh Barbados Belarus Belgium Belize Benin Bermuda Bhutan Bolivia Bosnia and Herzegovina Botswana Bouvet Island Brazil British Indian Ocean Territory Brunei Darussalam Bulgaria Burkina Faso Burundi Cambodia Cameroon Canada Cape Verde Cayman Islands Central African Republic Chad Chile China Christmas Island Cocos (Keeling) Islands Colombia Comoros Congo Congo, The Democratic Republic of the Cook Islands Costa Rica Cote DâIvoire Croatia Cuba Cyprus Czech Republic Denmark Djibouti Dominica Dominican Republic Ecuador Egypt El Salvador Equatorial Guinea Eritrea Estonia Ethiopia Falkland Islands (Malvinas) Faroe Islands Fiji Finland France France, Metropolitan French Guiana French Polynesia French Southern Territories Gabon Gambia Georgia Germany Ghana Gibraltar Greece Greenland Grenada Guadeloupe Guam Guatemala Guernsey Guinea Guinea-Bissau Guyana Haiti Heard Island and McDonald Islands Holy See (Vatican City State) Honduras Hong Kong Hungary Iceland India Indonesia Iran, Islamic Republic of Iraq Ireland Isle of Man Israel Italy Jamaica Japan Jersey Jordan Kazakhstan Kenya Kiribati Korea, Democratic Peopleâs Republic of Korea, Republic of Kuwait Kyrgyzstan Lao Peopleâs Democratic Republic Latvia Lebanon Lesotho Liberia Libyan Arab Jamahiriya Liechtenstein Lithuania Luxembourg Macau Macedonia Madagascar Malawi Malaysia Maldives Mali Malta Marshall Islands Martinique Mauritania Mauritius Mayotte Mexico Micronesia, Federated States of Moldova, Republic of Monaco Mongolia Montenegro Montserrat Morocco Mozambique Myanmar N/A Namibia Nauru Nepal Netherlands Netherlands Antilles New Caledonia New Zealand Nicaragua Niger Nigeria Niue Norfolk Island Northern Mariana Islands Norway Oman Other Pakistan Palau Palestinian Territory Panama Papua New Guinea Paraguay Peru Philippines Pitcairn Islands Poland Portugal Puerto Rico Qatar Reunion Romania Russian Federation Rwanda Saint Barthelemy Saint Helena Saint Kitts and Nevis Saint Lucia Saint Martin Saint Pierre and Miquelon Saint Vincent and the Grenadines Samoa San Marino Sao Tome and Principe Satellite Provider Saudi Arabia Senegal Serbia Seychelles Sierra Leone Singapore Slovakia Slovenia Solomon Islands Somalia South Africa South Georgia and the South Sandwich Islands Spain Sri Lanka Sudan Suriname Svalbard and Jan Mayen Swaziland Sweden Switzerland Syrian Arab Republic Taiwan Tajikistan Tanzania, United Republic of Thailand Timor-Leste Togo Tokelau Tonga Trinidad and Tobago Tunisia Turkey Turkmenistan Turks and Caicos Islands Tuvalu Uganda Ukraine United Arab Emirates United Kingdom United States United States Minor Outlying Islands Uruguay Uzbekistan Vanuatu Venezuela Vietnam Virgin Islands, British Virgin Islands, U.S. Wallis and Futuna Western Sahara Yemen Zambia Zimbabwe |


### 表格 31

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowed | boolean | Determines whether the file type is allowed or disallowed. In either of these cases the VIOL_FILETYPE violation is issued (if enabled) for an incoming request- 1. No allowed file type matched the file type of the request. 2. The file type of the request matched a disallowed file type. |  |
| checkPostDataLength | boolean | Determines whether to enforce maximum length restriction for the body, a.k.a. âPOST dataâ part of the requests that match the respective file type. The maximum length is determined by postDataLength attribute. Although named âPOST dataâ, this applies to any content type and not restricted to POST requests, e.g. PUT requests are also checked. This attribute is relevant only to allowed file types. |  |
| checkQueryStringLength | boolean | Determines whether to enforce maximum length restriction for the query string of the requests that match the respective file type. The maximum length is determined by queryStringLength attribute. This attribute is relevant only to allowed file types. |  |
| checkRequestLength | boolean | Determines whether to enforce maximum length restriction for the total length of requests that match the respective file type. The maximum length is determined by requestLength attribute. This attribute is relevant only to allowed file types. |  |
| checkUrlLength | boolean | Determines whether to enforce maximum length restriction for the URL of the requests that match the respective file type. The URL does not include the query string, past the &. The maximum length is determined by urlLength attribute. This attribute is relevant only to allowed file types. |  |
| name | string | Specifies the file type name as appearing in the URL extension. Names can be one of the following according to the type attribute: Explicit - Specifies that the name is the liternal file extension to which the file type refers. The type attribute has to be âexplicitâ. No Extension - Specifies the empty file type, lacking file extension. For this the reserved string no_ext should be used. The type attribute has to be âexplicitâ. Wildcard - Specifies that any file extension that matches the wildcard expression is matched to this file type in the policy. The type attribute has to be âwildcardâ. The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects. *: Matches all characters ?: Matches any single character [abcde]: Matches exactly one of the characters listed [!abcde]: Matches any character not listed [a-e]: Matches exactly one character in the range [!a-e]: Matches any character not in the range Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard. |  |
| performStaging | boolean | If true then any violation associated to the respective file type will not be enforced, and the request will not be considered illegal. |  |
| postDataLength | integer | The maximum length in bytes of the body (POST data) of the request matching the file type. Enforced only if checkPostDataLength is set to true. If the value is exceeded then VIOL_POST_DATA_LENGTH violation is issued. This attribute is relevant only to allowed file types. |  |
| queryStringLength | integer | The maximum length in bytes of the query string of the request matching the file type. Enforced only if checkQueryStringLength is set to true. If the value is exceeded then VIOL_QUERY_STRING_LENGTH violation is issued. This attribute is relevant only to allowed file types. |  |
| requestLength | integer | The maximum total length in bytes of the request matching the file type. Enforced only if checkRequestLength is set to true. If the value is exceeded then VIOL_REQUEST_LENGTH violation is issued. This attribute is relevant only to allowed file types. |  |
| responseCheck | boolean | Determines whether the responses to requests that match the respective file types are inspected for attack signature detection. This attribute is relevant only to allowed file types. |  |
| type | string | Determines the type of the name attribute. Only when setting the type to wildcard will the special wildcard characters in the name interpreted as such. | explicit wildcard |
| urlLength | integer | The maximum length in bytes of the URL of the request matching the file type, excluding the query string. Enforced only if checkUrlLength is set to true. If the value is exceeded then VIOL_URL_LENGTH violation is issued. This attribute is relevant only to allowed file types. |  |
| wildcardOrder | integer |  |  |


### 表格 32

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowedResponseCodes | array of integers | You can specify which responses a security policy permits. By default, the system accepts all response codes from 100 to 399 as valid responses. Response codes from 400 to 599 are considered invalid unless added to the Allowed Response Status Codes list. By default, 400, 401, 404, 407, 417, and 503 are on the list as allowed HTTP response status codes. |  |
| customXffHeaders | array of strings | If you require the system to trust a server further than one hop toward the client (the last proxy traversed), you can use the Custom XFF Headers setting to define a specific header that is inserted closer to, or at the client, that the system will trust. Additionally, if you require the system to trust a proxy server that uses a different header name than the X-Forwarded-For header name, you can add the desired header name to the Custom XFF Headers setting. When adding a custom header, the X-Forwarded-For header is not trusted anymore. In case the X-Forwarded-For header is to be trusted along with other headers, you must add it to the custom headers list. |  |
| dynamicSessionIdDescription | string | A description of user-defined regular expression that the security policy uses to recognize dynamic sessions in URLs. |  |
| dynamicSessionIdInUrl | string | A user-defined regular expression that the security policy uses to recognize dynamic sessions in URLs. |  |
| enableEventCorrelation | boolean | This feature designed to provide an aggregated view of security events in the Configuration utility. When two or more illegal requests are sent to the web application within a short period of time, the system correlates them as a security event. For example, the system aggregates requests into a single event if a single user causes multiple violations over time. When enabled, Event Correlation Reporting logs are collected. |  |
| enforcementReadinessPeriod | integer | For each security policy, you can configure the number of days used as the enforcement readiness period, also called staging. Security policy entities and attack signatures remain in staging for this period of time before the system suggests that you enforce them. Staging allows you to test security policy entities and attack signatures for false positives without enforcing them. The default value of 7 days works for most situations so you typically do not need to change it. |  |
| maskCreditCardNumbersInRequest | boolean | When enabled, the security policy masks credit card numbers that appear in any part of requests. The system does not mask the information in the actual requests, but rather in various logs: * Credit card numbers appearing in entity names are masked in the requests of the Requests log. * Credit card numbers appearing in entity values are masked wherever requests can be viewed: the Requests log, violation details within that log, manual learning, and reports. This setting is enabled by default, and exists in addition to masking parameters defined as containing sensitive information. |  |
| pathParameterHandling | string | A URI path parameter is the part of a path segment that occurs after its name. You can configure how a security policy handles path parameters that are attached to path segments in URIs. You can enforce different levels of security based on your needs: as-parameter: The system normalizes and enforces path parameters. For each path parameter, the system removes it from URLs as part of the normalization process, finds a corresponding parameter in the security policy (first at the matching URL level, and if not found, then at the Global level), and enforces it according to its attributes like any other parameters. as-url: The system does not normalize nor enforce path parameters. Path parameters are considered an integral part of the URL. ignore: The system removes path parameters from URLs as part of the normalization process, but does not enforce them. | as-parameters as-url ignore |
| triggerAsmIruleEvent | string | When enabled, the system activates ASM iRule events. When disabled, the system does not activate ASM iRule events. Enable this option if you have written iRules that process ASM iRule events, and assigned them to a specific virtual server. The default setting is disabled. disabled: Leave this option disabled if you either have not written any ASM iRules. enabled-normal: The system invokes the event ASM_REQUEST_DONE after the system completes processing each request, regardless of whether the request triggered violations. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests whether they trigger, or do not trigger, violations. enabled-compatibility: The system invokes the event ASM_REQUEST_VIOLATION after the system completes processing each request that triggered a violation. This gives you the opportunity, using iRules, to configure the system to perform actions after ASM handles requests only that trigger violations. | disabled enabled-compatibility enabled-normal |
| trustXff | boolean | When enabled, the system has confidence in an XFF (X-Forwarded-For) header in the request. When disabled, that the system does not have confidence in an XFF header in the request. The default setting is disabled. Select this option if the system is deployed behind an internal or other trusted proxy. Then, the system uses the IP address that initiated the connection to the proxy instead of the internal proxyâs IP address. Leave this option disabled if you think the HTTP header may be spoofed, or crafted, by a malicious client. With this setting disabled, if the system is deployed behind an internal proxy, the system uses the internal proxyâs IP address instead of the clientâs IP address. |  |
| useDynamicSessionIdInUrl | boolean | How the security policy processes URLs that use dynamic sessions. When disabled the security policy does not enforce dynamic sessions in URLs. When enabled the system will use a default or user-defined pattern for recognizing dynamic sessions in URLs. |  |


### 表格 33

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| attackSignaturesCheck | boolean |  |  |
| defenseAttributes | object |  |  |
| description | string |  |  |
| metacharElementCheck | boolean |  |  |
| metacharOverrides | array of objects |  |  |
| name | string |  |  |
| signatureOverrides | array of objects |  |  |


### 表格 34

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumTotalLengthOfGWTData | integer string |  | Integer values âanyâ |
| maximumValueLength | integer string |  | Integer values âanyâ |
| tolerateGWTParsingWarnings | boolean |  |  |


### 表格 35

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 36

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| signatureId | integer |  |  |


### 表格 37

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumHttpHeaderLength | integer string | Maximum HTTP Header Length must be greater than 0 and less than 65536 bytes (64K). Note: if 0 or any are set, then no restriction on the HTTP header length is applied. | Integer values âanyâ |


### 表格 38

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowRepeatedOccurrences | boolean |  |  |
| base64Decoding | boolean |  |  |
| checkSignatures | boolean |  |  |
| htmlNormalization | boolean |  |  |
| mandatory | boolean |  |  |
| maskValueInLogs | boolean |  |  |
| name | string |  |  |
| normalizationViolations | boolean |  |  |
| percentDecoding | boolean |  |  |
| signatureOverrides | array of objects |  |  |
| type | string |  | explicit wildcard |
| urlNormalization | boolean |  |  |
| wildcardOrder | integer |  |  |


### 表格 39

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| signatureId | integer |  |  |


### 表格 40

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| includeSubdomains | boolean |  |  |
| name | string |  |  |


### 表格 41

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| ipIntelligenceCategories | array of objects |  |  |


### 表格 42

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| alarm | boolean |  |  |
| block | boolean |  |  |
| category | string |  | Anonymous Proxy BotNets Cloud-based Services Denial of Service Infected Sources Mobile Threats Phishing Proxies Scanners Spam Sources Tor Proxies Web Attacks Windows Exploits |


### 表格 43

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| attackSignaturesCheck | boolean |  |  |
| defenseAttributes | object |  |  |
| description | string |  |  |
| handleJsonValuesAsParameters | boolean |  |  |
| hasValidationFiles | boolean |  |  |
| metacharElementCheck | boolean |  |  |
| metacharOverrides | array of objects |  |  |
| name | string |  |  |
| sensitiveData | array of objects |  |  |
| signatureOverrides | array of objects |  |  |
| validationFiles | array of objects |  |  |


### 表格 44

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumArrayLength | integer string |  | Integer values âanyâ |
| maximumStructureDepth | integer string |  | Integer values âanyâ |
| maximumTotalLengthOfJSONData | integer string |  | Integer values âanyâ |
| maximumValueLength | integer string |  | Integer values âanyâ |
| tolerateJSONParsingWarnings | boolean |  |  |


### 表格 45

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 46

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| parameterName | string |  |  |


### 表格 47

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| signatureId | integer |  |  |


### 表格 48

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| importUrl | string |  |  |
| isPrimary | boolean |  |  |
| jsonValidationFile | object |  |  |


### 表格 49

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| contents | string |  |  |
| fileName | string |  |  |
| isBase64 | boolean |  |  |


### 表格 50

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| authenticatedUrls | array of strings |  |  |
| expirationTimePeriod | integer string |  | Integer values âdisabledâ |
| logoutUrls | array of objects |  |  |


### 表格 51

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| requestContains | string |  |  |
| requestOmits | string |  |  |
| url | object |  |  |


### 表格 52

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| accessValidation | object |  |  |
| authenticationType | string |  | ajax-or-json-request form http-basic http-digest none ntlm |
| passwordParameterName | string |  |  |
| url | object |  |  |
| usernameParameterName | string |  |  |


### 表格 53

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| cookieContains | string |  |  |
| headerContains | string |  |  |
| headerOmits | string |  |  |
| parameterContains | string |  |  |
| responseContains | string |  |  |
| responseHttpStatus | string |  |  |
| responseHttpStatusOmits | array of strings |  |  |
| responseOmits | string |  |  |


### 表格 54

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| actAsMethod | string |  | GET POST |
| name | string |  |  |


### 表格 55

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| description | string |  |  |
| enforcementMode | string |  | blocking policy-default transparent |
| hostName | string |  |  |
| hostNameType | string |  | explicit wildcard |
| urlName | string |  |  |
| urlType | string |  | explicit wildcard |
| wildcardOrder | integer |  |  |
| wildcardUrlIncludesSlash | boolean |  |  |


### 表格 56

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  |  |
| urlName | string |  |  |


### 表格 57

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowEmptyValue | boolean | Determines whether an empty value is allowed for a parameter. |  |
| allowRepeatedParameterName | boolean | Determines whether multiple parameter instances with the same name are allowed in one request. |  |
| arraySerializationFormat | string | Specifies type of serialization for array of primitives parameter. Serialization defines how multiple values are delimited - format that can be transmitted and reconstructed later: pipe: pipeline-separated values. Array color=[âblueâ,âblackâ] -> color=blue|black. form: ampersand-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black. matrix: semicolon-prefixed values. Array color=[âblueâ,âblackâ] -> ;color=blue,black. tsv: tab-separated values. Aarray color=[âblueâ,âblackâ] -> color=bluetblack. csv: comma-separated values. Array color=[âblueâ,âblackâ] -> color=blue,black. label: dot-prefixed values. Array color=[âblueâ,âblackâ] -> .blue.black. multi: multiple parameter instances rather than multiple values. Array color=[âblueâ,âblackâ] -> color=blue&color=black. ssv: space-separated values. Array color=[âblueâ,âblackâ] -> color=blue black. multipart: defines array of files. Notes: This attribute is relevant only for parameters with array valueType. multi and form serializations can be defined for parameter with query, form-data or cookie locations only. multipart serialization can be defined for parameter with form-data location only. matrix and label serializations can be defined for parameter with path location only. | csv form label matrix multi multipart pipe ssv tsv |
| arrayUniqueItemsCheck | boolean | Determines whether items in an array parameter must be unique. This attribute is relevant only for parameters with array valueType. |  |
| attackSignaturesCheck | boolean | Determines whether attack signatures and threat campaigns must be detected in a parameterâs value. This attribute is relevant only for parameters with alpha-numeric or binary dataType. |  |
| checkMaxItemsInArray | boolean | Determines whether an array parameter has a restricted maximum number of items. This attribute is relevant only for parameters with array valueType. |  |
| checkMaxValue | boolean | Determines whether the parameter has a restricted maximum value. This attribute is relevant only for parameters with integer or decimal dataType. |  |
| checkMaxValueLength | boolean | Determines whether a parameter has a restricted maximum lenght for value. |  |
| checkMetachars | boolean | Determines whether disallowed metacharacters must be detected in a parameterâs name. This attribute is relevant only for wildcard parameters with alpha-numeric dataType. |  |
| checkMinItemsInArray | boolean | Determines whether an array parameter has a restricted minimum number of items. This attribute is relevant only for parameters with array valueType. |  |
| checkMinValue | boolean | Determines whether a parameter has a restricted minimum value. This attribute is relevant only for parameters with integer or decimal dataType. |  |
| checkMinValueLength | boolean | Determines whether a parameter has a restricted minimum lenght for value. |  |
| checkMultipleOfValue | boolean | Determines whether a parameterâs value is a multiple of a number defined in multipleOf. This attribute is relevant only for parameters with integer or decimal dataType. |  |
| contentProfile | object |  |  |
| dataType | string | Specifies data type of parameterâs value: none: system data type which is used by policy builder and cannot be set manually. alpha-numeric: specifies that the value of parameter can be any text consisting of letters, digits, and the underscore character. binary: specifies there is no text limit for the value of a parameter (length checks only). phone: specifies that the value of a parameter can be text in telephone number format only. email: specifies that the value of a parameter must be text in email format only. boolean: specifies that the value of a parameter must be boolean (only true and false values are allowed). integer: specifies that the value of a parameter must be whole numbers only (no decimals). decimal: specifies that the value of a parameter is numbers only and can include decimals. Notes: This attribute is relevant for parameters with array or user-input valueType only. | alpha-numeric binary boolean decimal email integer none phone |
| disallowFileUploadOfExecutables | boolean | Determines whether a parameterâs value cannot have binary executable content. This attribute is relevant only for parameters with binary dataType. |  |
| enableRegularExpression | boolean | Determines whether the parameter value includes the pattern defined in regularExpression. This attribute is relevant only for parameters with alpha-numeric dataType. |  |
| exclusiveMax | boolean | Determines whether the maximum value defined in maximumValue attribute is exclusive. This attribute is relevant only if checkMaxValue is set to true. |  |
| exclusiveMin | boolean | Determines whether a minimum value defined in minimumValue attribute is exclusive. This attribute is relevant only if checkMinValue is set to true. |  |
| explodeObjectSerialization | boolean | Specifies whether an array or object parameters should have separate values for each array item or object property. This attribute is relevant only if objectSerializationStyle is defined. Notes: This attribute is not relevant for parameters with deep-object, space-delimited or pipe-delimited objectSerializationStyle. |  |
| isBase64 | boolean | Determines whether a parameterâs value contains a Base64 encoded string. If the value is indeed Base64 encoded, the system decodes this value and continues with its security checks. This attribute is relevant only for parameters with alpha-numeric or binary dataType. |  |
| isCookie | boolean | Determines whether a parameter is located in the value of Cookie header. parameterLocation attribute is ignored if isCookie is set to true. |  |
| isHeader | boolean | Determines whether a parameter is located in headers as one of the headers. parameterLocation attribute is ignored if isHeader is set to true. |  |
| level | string | Specifies whether the parameter is associated with a URL, a flow, or neither. | flow global url |
| mandatory | boolean | Determines whether a parameter must exist in the request. |  |
| maxItemsInArray | integer | Determines the restriction forthe maximum number of items in an array parameter. This attribute is relevant only if checkMaxItemsInArray is set to true. |  |
| maximumLength | integer | Determines the restriction for the maximum lenght of parameterâs value. This attribute is relevant only if checkMaxValueLength is set to true. |  |
| maximumValue | number | Determines the restriction for the maximum value of parameter. This attribute is relevant only if checkMaxValue is set to true. |  |
| metacharsOnParameterValueCheck | boolean | Determines whether disallowed metacharacters must be detected in a parameterâs value. This attribute is relevant only for parameters with alpha-numeric dataType. |  |
| minItemsInArray | integer | Determines the restriction for the minimum number of items in an array parameter. This attribute is relevant only if checkMinItemsInArray is set to true. |  |
| minimumLength | integer | Determines the restriction for the minimum lenght if parameterâs is value. This attribute is relevant only if checkMinValueLength is set to true. |  |
| minimumValue | number | Determines the restriction for the minimum value of a parameter. This attribute is relevant only if checkMinValue is set to true. |  |
| multipleOf | number | Determines the number by which a parameterâs value is divisible without remainder. This number must be positive and it may be a floating-point number. This attribute is relevant only if checkMultipleOfValue is set to true. |  |
| name | string | Specifies the name of a parameter which must be permitted in requests. Format of parameter name attribute differs depending on type attribute: explicit type: name of permitted parameter in request should literally match. wildcard type: name of permitted parameter in request should match wildcard expression. The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects. *: Matches all characters ?: Matches any single character [abcde]: Matches exactly one of the characters listed [!abcde]: Matches any character not listed [a-e]: Matches exactly one character in the range [!a-e]: Matches any character not in the range Notes: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard. Empty parameter name is allowed for explicit type |  |
| nameMetacharOverrides | array of objects | Determines metacharacters whose security policy settings are overridden for this parameter, and which action the security policy takes when it discovers a request for this parameter that has these metacharacters in the name. This attribute is relevant only if checkMetachars is set to true. |  |
| objectSerializationStyle | string | Specifies the type of serialization for an object or complex array parameter. Serialization defines how multiple values are delimited - format that can be transmitted and reconstructed later: pipe-delimited: pipeline-separated values. Object color={âRâ:100,âGâ:200} -> color=R|100|G|200. form: ampersand-separated values. Object color={âRâ:100,âGâ:200} -> color=R,100,G,200 if explodeObjectSerialization set to false or -> R=100&G=200 if explodeObjectSerialization set to true. space-delimited: space-separated values. Object color={âRâ:100,âGâ:200} -> color=R 100 G 200. deep-object: rendering nested objects. Object color={âRâ:100,âGâ:200} -> color[R]=100&color[G]=200. matrix: semicolon-prefixed values. Object color={âRâ:100,âGâ:200} -> ;color=R,100,G,200 if explodeObjectSerialization set to false or -> ;R=100;G=200 if explodeObjectSerialization set to true. simple: comma-separated values. Object color={âRâ:100,âGâ:200} -> R,100,G,200 if explodeObjectSerialization set to false or -> R=100,G=200 if explodeObjectSerialization set to true. label: dot-prefixed values. Object color={âRâ:100,âGâ:200} -> .R.100.G.200 if explodeObjectSerialization set to false or -> .R=100.G=200 if explodeObjectSerialization set to true. Notes: This attribute is relevant only for parameters with object or openapi-array valueType. form serialization can be defined for a parameter with query, form-data or cookie locations only. matrix and label serializations can be defined for an array parameter with path location only. simple serializations can be defined for a parameter with path and header locations only. deep-object serialization can be defined for a parameter with query or form-data locations only. | deep-object form label matrix pipe-delimited simple space-delimited |
| parameterEnumValues | array of strings | Determines the set of possible parameterâs values. This attribute is not relevant for parameters with phone, email or binary dataType. |  |
| parameterLocation | string | Specifies location of parameter in request: any: in query string, in POST data (body) or in URL path. query: in query string. form-data: in POST data (body). cookie: in value of Cookie header. path: in URL path. header: in request headers. Notes: path location can be defined for parameter with global level only. path, header and cookie location can be defined for parameter with explicit type only. header and cookie location cannot be defined for parameter with empty name. | any cookie form-data header path query |
| performStaging | boolean | Determines the staging state of a parameter. If you place an entity in staging, the system does not block requests for this entity. Tip: Use staging on wildcard entities to build the security policy without explicit entities of this type, rather than configuring the wildcard entity itself to be enforced with the settings found on it. |  |
| regularExpression | string | Determines a positive regular expression for a parameterâs value. This attribute is relevant only if enableRegularExpression is set to true. Notes: The length of a regular expression is limited to 254 characters. |  |
| sensitiveParameter | boolean | Determines whether a parameter is sensitive and must be not visible in logs nor in the user interface. Instead of actual valu,e a string of asterisks is shown for this parameter. Use it to protect sensitive user input, such as a password or a credit card number, in a validated request. |  |
| signatureOverrides | array of objects | Determines attack signatures whose security policy settings are overridden for this parameter, and which action the security policy takes when it discovers a request for this parameter that matches these attack signatures. This attribute is relevant only if signatureOverrides is set to true. |  |
| staticValues | array of strings | Determines the set of possible parameterâs values. This attribute is relevant for parameters with static-content valueType only. |  |
| type | string | Specifies the type of the name attribute. | explicit wildcard |
| url | object |  |  |
| valueMetacharOverrides | array of objects | Determines metacharacters whose security policy settings are overridden for this parameter, and which action the security policy takes when it discovers a request for this parameter that has these metacharacters in value. This attribute is relevant only if metacharsOnParameterValueCheck is set to true. |  |
| valueType | string | Specifies type of parameterâs value: object: the parameterâs value is complex object defined by JSON schema. dynamic-content: the parameterâs content changes dynamically. openapi-array: the parameterâs value is complex array defined by JSON schema. ignore: the system does not perform validity checks on the value of the parameter. static-content: the parameter has a static, or pre-defined, value(s). json: the parameterâs value is JSON data. array: the parameterâs value is array of primitives. user-input: the parameterâs value is provided by user-input. xml: the parameterâs value is XML data. auto-detect: the parameterâs value can be user-inpur, XML data or JSON data. The system automatically classifies the type of value. dynamic-parameter-name: the parameterâs name changes dynamically. Notes: dynamic-parameter-name value type can be defined for a parameter with flow level and explicit type only. dynamic-content value type can be defined for a parameter with explicit type only. | array auto-detect dynamic-content dynamic-parameter-name ignore json object openapi-array static-content user-input xml |
| wildcardOrder | integer | Specifies the order in which wildcard entities are organized. Matching of an enforced parameter with a defined wildcard parameter happens based on order from smaller to larger. |  |


### 表格 58

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| contentProfile | object |  |  |


### 表格 59

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  |  |


### 表格 60

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean | Specifies permission of metachar - when false, then character is prohibited. |  |
| metachar | string | Specifies character in hexadecimal format with special allowance. |  |


### 表格 61

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean | Specifies, when true, that the overridden signature is enforced |  |
| signatureId | integer | The signature ID which identifies the signature. |  |


### 表格 62

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean | Specifies permission of metachar - when false, then character is prohibited. |  |
| metachar | string | Specifies character in hexadecimal format with special allowance. |  |


### 表格 63

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| attackSignaturesCheck | boolean |  |  |
| defenseAttributes | object |  |  |
| description | string |  |  |
| metacharElementCheck | boolean |  |  |
| metacharOverrides | array of objects |  |  |
| name | string |  |  |
| signatureOverrides | array of objects |  |  |


### 表格 64

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumLineLength | integer string |  | Integer values âanyâ |
| maximumTotalLength | integer string |  | Integer values âanyâ |
| performPercentDecoding | boolean |  |  |


### 表格 65

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 66

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| signatureId | integer |  |  |


### 表格 67

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| autoApply | object |  |  |
| enableFullPolicyInspection | boolean |  |  |
| enableTrustedTrafficSiteChangeTracking | boolean |  |  |
| enableUntrustedTrafficSiteChangeTracking | boolean |  |  |
| fullyAutomatic | boolean |  |  |
| inactiveEntityInactivityDurationInDays | number |  |  |
| learnFromResponses | boolean |  |  |
| learnInactiveEntities | boolean |  |  |
| learnOnlyFromNonBotTraffic | boolean |  |  |
| learningMode | string |  | automatic disabled manual |
| responseStatusCodes | array of strings |  |  |
| trafficTighten | object |  |  |
| trustAllIps | boolean |  |  |
| trustedTrafficLoosen | object |  |  |
| trustedTrafficSiteChangeTracking | object |  |  |
| untrustedTrafficLoosen | object |  |  |
| untrustedTrafficSiteChangeTracking | object |  |  |


### 表格 68

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| applyAtAllTimes | boolean |  |  |
| applyOnAllDays | boolean |  |  |
| applyOnFridays | boolean |  |  |
| applyOnMondays | boolean |  |  |
| applyOnSaturdays | boolean |  |  |
| applyOnSundays | boolean |  |  |
| applyOnThursdays | boolean |  |  |
| applyOnTuesdays | boolean |  |  |
| applyOnWednesdays | boolean |  |  |
| endTime | string |  |  |
| frequency | string |  | never real-time scheduled |
| startTime | string |  |  |


### 表格 69

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maxModificationSuggestionScore | integer |  |  |
| minDaysBetweenSamples | number |  |  |
| totalRequests | integer |  |  |


### 表格 70

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minHoursBetweenSamples | number |  |  |


### 表格 71

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minMinutesBetweenSamples | number |  |  |


### 表格 72

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minHoursBetweenSamples | number |  |  |


### 表格 73

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minMinutesBetweenSamples | number |  |  |


### 表格 74

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| buildingMode | string | Specifies learning location. central: Security policy learning is done centrally and managed via a BIG-IQ system. Centralized learning can be enabled from BIG-IQ only and, when enabled, all interim local policy learning will be lost. When learning is centralized, you cannot make local changes on your BIG-IP that will affect the security policy learning. local: Security policy learning is done locally and managed on BIG-IP | central local |
| centralPbAddresses | array of objects | Specifies list of BIG-IQ machines that local Policy Builder is sending data to. |  |
| eventCorrelationMode | string | Specifies event correlation location. central: Event correlation is done centrally and stored in a BIG-IQ system. local: Event correlation is done locally and stored on BIG-IP. | central local |


### 表格 75

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| hostName | string | Host name of BIG-IQ machine. |  |
| ipAddress | string | IP address of BIG-IQ machine. |  |
| order | integer | Order or BIG-IQ machine in the list. |  |
| port | integer | Port that BIG-IQ machine is listening to. |  |
| verifyCertificate | boolean | If enabled - certificate should be verified when connecting to BIG-IQ machine |  |


### 表格 76

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| collapseCookieOccurrences | integer |  |  |
| collapseCookiesIntoOneEntity | boolean |  |  |
| enforceUnmodifiedCookies | boolean |  |  |
| learnExplicitCookies | string |  | never selective |
| maximumCookies | integer |  |  |


### 表格 77

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| learnExplicitFiletypes | string | Specifies under which circumstances the Policy Builder adds, or suggests you add, explicit file types to the security policy: compact: Specifies that the system will create a list of the most commonly used file types (while enforcing all other file types with a wildcard rule), together with a pre-populated list of known disallowed file types. This option serves as a good balance between selective and always selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit file type with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website file types. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard file type | always compact never selective |
| maximumFileTypes | integer | Specifies approximately the largest number of file types that Policy Builder will learn |  |


### 表格 78

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| maximumHosts | integer |  |  |
| validHostNames | boolean |  |  |


### 表格 79

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| classifyParameters | boolean | When enabled, if the Policy Builder detects legitimate XML or JSON data to parameters configured in the security policy, the Policy Builder adds XML or JSON profiles to the security policy and configures their attributes according to the data it detects |  |
| collapseParameterOccurrences | integer | Defines how many common explicit parameters the Policy Builder must detect (the number of occurrences) before collapsing them to one wildcard parameter. The minimum number of occurrences allowed is 2. |  |
| collapseParametersIntoOneEntity | boolean | When enabled, the system collapses many common parameters into one wildcard parameter. |  |
| dynamicParameters | object | Defines the conditions under which the Policy Builder adds dynamic parameters to the security policy To enabled this functionality there are several prerequisites: learnExplicitParameters is always or selective learnExplicitUrls in policy-builder-url and/or learnExplicitFiletypes in policy-builder-filetype is always or selective learnFromResponses is enabled in policy-builder at least one of the allHiddenFields/formParameters/linkParameters is enabled |  |
| learnExplicitParameters | string | Specifies under which circumstances the Policy Builder adds, or suggests you add, explicit parameters to the security policy: compact: Specifies that the system will create a list of the most commonly used parameters, while enforcing all other parameters with a wildcard rule. This option serves as a good balance between selective and always selective: Specifies that when false positives occur (applicable only for the * wildcard), the system will add/suggest to add an explicit parameter with relaxed settings that avoid the false positive. This option serves as a good balance between security, policy size, and ease of maintenance always: Specifies you would like to create a comprehensive whitelist policy that includes ALL of the website parameters. This option will form a large set of security policy entities, which will produce a granular object-level configuration and high security level, it may take more time to maintain such a policy never: Specifies that when false positives occur the system will suggest to relax the settings of the wildcard parameter | always compact never selective |
| maximumParameters | integer | Specifies approximately the largest number of parameters that Policy Builder will learn |  |
| parameterLearningLevel | string | Defines how the Policy Builder determines on which level to add, or suggest you add, parameters to the security policy global: The system creates learning suggestions based on the properties of entities that already exist in the security policy. When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the parameter name and level of the parameter in the security policy that caused this violation. When automatically building the security policy, the Policy Builder adds parameters on the Global level. url: The system creates learning suggestions based on real traffic, and is not limited to the current properties of entities that exist in the security policy. When manually learning a suggestion for a parameter violation, the resolve action suggested by the system is based on the actual parameter name and the URL or flow on which the violation was detected. When automatically building the security policy, the Policy Builder adds parameters on the URL level. In addition, if the actual URL does not exist in the security policy, the system adds the URL and file type (if it also does not exist) on which the violation was detected. | global url |
| parametersIntegerValue | boolean | When enabled, the Policy Builder learns integer parameters (parameters with a Data Type of Integer). |  |


### 表格 80

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allHiddenFields | boolean | When enabled, the Policy Builder adds to the security policy all HIDDEN form input parameters, seen in responses, as dynamic content value parameters |  |
| formParameters | boolean | When enabled, the Policy Builder adds parameters, found in forms, to the security policy as dynamic content value if a number of unique value sets are seen in responses for that parameter. Use uniqueValueSets to specify how many different value sets must be seen for that parameter in order for the Policy Builder to consider it dynamic content value. A value set is an aggregation of server-supplied value(s) of the parameter as seen in the web form, for example, all the values of a radio button or select boxes taken together are a value set. |  |
| linkParameters | boolean | When enabled, the Policy Builder adds parameters, found in links, to the security policy as dynamic content value if a number of unique values are seen in responses for that parameter. Use the uniqueValueSets to specify how many different values must be seen for that parameter in order for the Policy Builder to consider it dynamic content value. |  |
| uniqueValueSets | integer | Specifies how many different values must be seen for that parameter in order for the Policy Builder to consider it dynamic content value |  |


### 表格 81

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| learnExplicitRedirectionDomains | string |  | always never |
| maximumRedirectionDomains | integer |  |  |


### 表格 82

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enableServerTechnologiesDetection | boolean | When enabled, the Policy Builder suggests to add Server Technologies that have not yet been added to the policy. The system learns server technologies from responses regardless of the learnFromResponses flag setting in the policy-builder endpoint. |  |


### 表格 83

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| learnLoginPage | boolean |  |  |


### 表格 84

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| classifyUrls | boolean |  |  |
| classifyWebsocketUrls | boolean |  |  |
| collapseUrlDepth | integer |  |  |
| collapseUrlOccurrences | integer |  |  |
| collapseUrlsIntoOneEntity | boolean |  |  |
| learnExplicitUrls | string |  | always compact never selective |
| learnExplicitWebsocketUrls | string |  | always never selective |
| learnMethodsOnUrls | boolean |  |  |
| maximumUrls | integer |  |  |
| maximumWebsocketUrls | integer |  |  |
| wildcardUrlFiletypes | array of strings |  |  |


### 表格 85

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| redirectionDomains | array of objects |  |  |
| redirectionProtectionEnabled | boolean |  |  |


### 表格 86

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| domainName | string |  |  |
| includeSubdomains | boolean |  |  |
| type | string |  | explicit wildcard |
| wildcardOrder | integer |  |  |


### 表格 87

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| domainName | string |  |  |
| includeSubdomains | boolean |  |  |
| type | string |  | explicit wildcard |
| wildcardOrder | integer |  |  |


### 表格 88

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| ajaxActionType | string | Which content, or URL, the system sends to the client as a response to an AJAX request that does not comply with the security policy. alert-popup: The system opens a message as a popup screen. Type the message the system displays in the popup screen, or leave the default text. custom: A response text that will replace the frame or page which generated the AJAX request. The system provides additional options where you can type the response body you prefer. redirect: The system redirects the user to a specific web page instead of viewing a response page. Type the web pageâs full URL path, for example, http://www.redirectpage.com. | alert-popup custom redirect |
| ajaxCustomContent | string | Custom message typed by user as a response for blocked AJAX request. |  |
| ajaxEnabled | boolean | When enabled, the system injects JavaScript code into responses. You must enable this toggle in order to configure an Application Security Manager AJAX response page which is returned when the system detects an AJAX request that does not comply with the security policy. |  |
| ajaxPopupMessage | string | Default message provided by the system as a response for blocked AJAX request. Can be manipulated by user, but <%TS.request.ID()%> must be included in this message. |  |
| ajaxRedirectUrl | string | The system redirects the user to a specific web page instead of viewing a response page. Type the web pageâs full URL path, for example, http://www.redirectpage.com. To redirect the blocking page to a URL with a support ID in the query string, type the URL and the support ID in the following format: http://www.example.com/blocking_page.php?support_id=<%TS.request.ID()%>. The system replaces <%TS.request.ID%> with the relevant support ID so that the blocked request is redirected to the URL with the relevant support ID. |  |
| responseActionType | string | Which action the system takes, and which content the system sends to the client, as a response when the security policy blocks the client request. custom: The system returns a response page with HTML code that the user defines. default: The system returns the system-supplied response page in HTML. No further configuration is needed. erase-cookies: The system deletes all client side domain cookies. This is done in order to block web application users once, and not from the entire web application. The system displays this text in the response page. You cannot edit this text. redirect: The system redirects the user to a specific web page instead of viewing a response page. The system provides an additional setting where you can indicate the redirect web page. soap-fault: Displays the system-supplied response written in SOAP fault message structure. Use this type when a SOAP request is blocked due to an XML related violation. You cannot edit this text. | custom default erase-cookies redirect soap-fault |
| responseContent | string | The content the system sends to the client in response to an illegal blocked request. |  |
| responseHeader | string | The response headers that the system sends to the client as a response to an illegal blocked request. |  |
| responsePageType | string | The different types of blocking response pages which are available from the system: ajax: The system sends the AJAX Blocking Response Page when the security policy blocks an AJAX request that does not comply with the security policy. ajax-login: The system sends the AJAX Login Page Response after the user sends an AJAX request that attempts to directly access a URL that is allowed to be accessed only after visiting a login page. cpatcha: The system sends the CAPTCHA response page when the system suspects that a session is being run by a bot rather than a human, especially in the case of a brute force attack. captcha-fail: The system sends the CAPTCHA fail response page to a failed CAPTCHA challenge. default: The system sends the default response when the security policy blocks a client request. failed-login-honeypot: The Honeypot page is used for attacker deception. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. failed-login-honeypot-ajax: The Honeypot page is used for attacker deception sending AJAX request. The page should look like an application failed login page. Unlike with the Blocking page, when the Honeypot page is sent an attacker is not able to distinguish a failed login response from a mitigation. hijack: The system sends the cookie hijacking response page when the system detects that an attacker tried to hijack the session. leaked-credentials: The system sends the leaked credentials response when the system detects the use of stolen credentials. leaked-credentials-ajax: The system sends the leaked credentials response following an AJAX request which includes usage of stolen credentials. mobile: The system sends the mobile application response page when the system detects that a session is being run by a bot rather than a human. persistent-flow: The system sends the login page response after the user violates one of the preconditions when requesting the target URL of a configured login page. xml: The system sends the XML response page when the security policy blocks a client request that contains XML content that does not comply with the settings of an XML profile configured in the security policy. | ajax ajax-login captcha captcha-fail default failed-login-honeypot failed-login-honeypot-ajax hijack leaked-credentials leaked-credentials-ajax mobile persistent-flow xml |
| responseRedirectUrl | string | The particular URL to which the system redirects the user. To redirect the blocking page to a URL with a support ID in the query string, type the URL and the support ID in the following format: http://www.example.com/blocking_page.php?support_id=<%TS.request.ID()%>. The system replaces <%TS.request.ID%> with the relevant support ID so that the blocked request is redirected to the URL with the relevant support ID. |  |


### 表格 89

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string | Name of a parameter whose values the system should consider sensitive. |  |


### 表格 90

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| serverTechnologyName | string | Specifies the name of the selected policy. For example, PHP will add attack signatures that cover known PHP vulnerabilities. | ASP ASP.NET AngularJS Apache Struts Apache Tomcat Apache/NCSA HTTP Server BEA Systems WebLogic Server Backbone.js CGI Cisco Citrix CodeIgniter CouchDB Django Elasticsearch Ember.js Express.js Front Page Server Extensions (FPSE) Google Web Toolkit GraphQL Handlebars IBM DB2 IIS JBoss Java Servlets/JSP JavaScript JavaServer Faces (JSF) Jenkins Jetty Joomla Laravel Lotus Domino Macromedia ColdFusion Macromedia JRun Microsoft SQL Server Microsoft Windows MongoDB MooTools Mustache MySQL Nginx Node.js Novell Oracle Oracle Application Server Oracle Identity Manager Outlook Web Access PHP PostgreSQL Prototype Proxy Servers Python React Redis RequireJS Ruby SQLite SSI (Server Side Includes) SharePoint Spring Boot Sybase/ASE TYPO3 CMS UIKit Underscore.js Unix/Linux Vue.js WebDAV WordPress XML ZURB Foundation Zend ef.js jQuery |


### 表格 91

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| blockAll | object |  |  |
| delayBlocking | object |  |  |
| logAllRequests | object |  |  |
| sessionTrackingConfiguration | object |  |  |
| violationDetectionActions | object |  |  |


### 表格 92

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| checkDeviceIdThreshold | boolean |  |  |
| checkIpThreshold | boolean |  |  |
| checkPeriod | boolean |  |  |
| checkSessionThreshold | boolean |  |  |
| checkUsernameThreshold | boolean |  |  |
| deviceIdThreshold | integer |  |  |
| ipThreshold | integer |  |  |
| period | integer |  |  |
| sessionThreshold | integer |  |  |
| urlBlockingMode | string |  | block-all-urls block-authenticated-urls |
| usernameThreshold | integer |  |  |


### 表格 93

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| checkDeviceIdThreshold | boolean |  |  |
| checkIpThreshold | boolean |  |  |
| checkSessionThreshold | boolean |  |  |
| checkUsernameThreshold | boolean |  |  |
| deviceIdThreshold | integer |  |  |
| ipThreshold | integer |  |  |
| period | integer |  |  |
| sessionThreshold | integer |  |  |
| usernameThreshold | integer |  |  |
| violations | array of objects |  |  |


### 表格 94

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  | VIOL_ASM_COOKIE_HIJACKING VIOL_ASM_COOKIE_MODIFIED VIOL_ATTACK_SIGNATURE VIOL_BLACKLISTED_IP VIOL_BLOCKING_CONDITION VIOL_BOT_CLIENT VIOL_BRUTE_FORCE VIOL_CONVICTION VIOL_COOKIE_EXPIRED VIOL_COOKIE_LENGTH VIOL_COOKIE_MALFORMED VIOL_COOKIE_MODIFIED VIOL_CROSS_ORIGIN_REQUEST VIOL_CSRF VIOL_CSRF_EXPIRED VIOL_DATA_GUARD VIOL_DATA_INTEGRITY VIOL_DYNAMIC_SESSION VIOL_ENCODING VIOL_EVASION VIOL_FILETYPE VIOL_FILE_UPLOAD VIOL_FILE_UPLOAD_IN_BODY VIOL_FLOW VIOL_FLOW_DISALLOWED_INPUT VIOL_FLOW_ENTRY_POINT VIOL_FLOW_MANDATORY_PARAMS VIOL_GEOLOCATION VIOL_GWT_FORMAT VIOL_GWT_MALFORMED VIOL_HEADER_LENGTH VIOL_HEADER_METACHAR VIOL_HEADER_REPEATED VIOL_HOSTNAME VIOL_HOSTNAME_MISMATCH VIOL_HTTP_PROTOCOL VIOL_HTTP_RESPONSE_STATUS VIOL_JSON_FORMAT VIOL_JSON_MALFORMED VIOL_JSON_SCHEMA VIOL_LEAKED_CREDENTIALS VIOL_LOGIN_URL_BYPASSED VIOL_LOGIN_URL_EXPIRED VIOL_MALICIOUS_DEVICE VIOL_MALICIOUS_IP VIOL_MANDATORY_HEADER VIOL_MANDATORY_PARAMETER VIOL_MANDATORY_REQUEST_BODY VIOL_METHOD VIOL_PARAMETER VIOL_PARAMETER_ARRAY_VALUE VIOL_PARAMETER_DATA_TYPE VIOL_PARAMETER_DYNAMIC_VALUE VIOL_PARAMETER_EMPTY_VALUE VIOL_PARAMETER_LOCATION VIOL_PARAMETER_MULTIPART_NULL_VALUE VIOL_PARAMETER_NAME_METACHAR VIOL_PARAMETER_NUMERIC_VALUE VIOL_PARAMETER_REPEATED VIOL_PARAMETER_STATIC_VALUE VIOL_PARAMETER_VALUE_BASE64 VIOL_PARAMETER_VALUE_LENGTH VIOL_PARAMETER_VALUE_METACHAR VIOL_PARAMETER_VALUE_REGEXP VIOL_PLAINTEXT_FORMAT VIOL_POST_DATA_LENGTH VIOL_QUERY_STRING_LENGTH VIOL_RATING_NEED_EXAMINATION VIOL_RATING_THREAT VIOL_REDIRECT VIOL_REQUEST_LENGTH VIOL_REQUEST_MAX_LENGTH VIOL_SESSION_AWARENESS VIOL_THREAT_ANALYSIS VIOL_THREAT_CAMPAIGN VIOL_URL VIOL_URL_CONTENT_TYPE VIOL_URL_LENGTH VIOL_URL_METACHAR VIOL_VIRUS VIOL_WEBSOCKET_BAD_REQUEST VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_EXTENSION VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT VIOL_WEBSOCKET_FRAME_LENGTH VIOL_WEBSOCKET_FRAME_MASKING VIOL_WEBSOCKET_FRAMING_PROTOCOL VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_TEXT_NULL_VALUE VIOL_XML_FORMAT VIOL_XML_MALFORMED VIOL_XML_SCHEMA VIOL_XML_SOAP_ATTACHMENT VIOL_XML_SOAP_METHOD VIOL_XML_WEB_SERVICES_SECURITY |


### 表格 95

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| checkDeviceIdThreshold | boolean |  |  |
| checkIpThreshold | boolean |  |  |
| checkSessionThreshold | boolean |  |  |
| checkUsernameThreshold | boolean |  |  |
| deviceIdThreshold | integer |  |  |
| ipThreshold | integer |  |  |
| period | integer |  |  |
| sessionThreshold | integer |  |  |
| usernameThreshold | integer |  |  |


### 表格 96

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| detectUsernameFromLoginPages | array of objects |  |  |
| enableSessionAwareness | boolean |  |  |
| enableTrackingSessionHijackingByDeviceId | boolean |  |  |
| userNameSource | string |  | all-login-pages apm login-pages none |


### 表格 97

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| loginPage | object |  |  |


### 表格 98

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| trackViolationsAndPerformActions | boolean |  |  |
| violationDetectionPeriod | integer |  |  |


### 表格 99

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string |  | block-all delay-blocking log-all |
| createdDatetime | string |  |  |
| expirationDatetime | string |  | N/A |
| scope | string |  | device ip session user |
| value | string |  |  |


### 表格 100

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| alarm | boolean | If enabled - when a signature from this signature set is detected in a request - the request is logged. |  |
| block | boolean | If enabled - when a signature from this signature set is detected in a request (and the signature is not in staging and the policy is in blockig mode) - the request is blocked. |  |
| learn | boolean | If enabled - when a signature from this signature set is detected in a request -the policy builder creates a learning suggestion to disable it. |  |
| name | string | Signature set name. | All Response Signatures All Signatures Command Execution Signatures Cross Site Scripting Signatures Directory Indexing Signatures Generic Detection Signatures Generic Detection Signatures (High Accuracy) Generic Detection Signatures (High/Medium Accuracy) HTTP Response Splitting Signatures High Accuracy Detection Evasion Signatures High Accuracy Signatures Information Leakage Signatures Low Accuracy Signatures Medium Accuracy Signatures OS Command Injection Signatures OWA Signatures Other Application Attacks Signatures Path Traversal Signatures Predictable Resource Location Signatures Remote File Include Signatures SQL Injection Signatures Server Side Code Injection Signatures WebSphere signatures XPath Injection Signatures |


### 表格 101

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| attackSignatureFalsePositiveMode | string |  | detect detect-and-allow disabled |
| minimumAccuracyForAutoAddedSignatures | string |  | high low medium |
| placeSignaturesInStaging | boolean |  |  |
| signatureStaging | boolean |  |  |


### 表格 102

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| alarm | boolean |  |  |
| block | boolean |  |  |
| enabled | boolean | Specifies, if true, that the signature is enabled on the security policy. When false, the signature is disable on the security policy. |  |
| inPolicy | string |  | false true |
| isPriorRuleEnforced | boolean |  |  |
| learn | boolean |  |  |
| performStaging | boolean | Specifies, if true, that the signature is in staging. The system does not enforce signatures in staging. Instead, the system records the request information and keeps it for a period of time (the Enforcement Readiness Period whose default time period is 7 days). Specifies, when false, that the staging feature is not in use, and that the system enforces the signaturesâ Learn/Alarm/Block settings immediately. (Blocking is performed only if the security policyâs enforcement mode is Blocking.) |  |
| signatureId | integer | The signature ID which identifies the signature. |  |


### 表格 103

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| threatCampaignEnforcementReadinessPeriod | integer |  |  |
| threatCampaignStaging | boolean |  |  |


### 表格 104

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isEnabled | boolean | If enabled - threat campaign is enforced in the security policy. |  |
| name | string | Name of the threat campaign. |  |
| performStaging | boolean | If enabled - there will be only reporting (no blocking) for requests with a detected treat campaign. For this feature to work, threatCampaignStaging should be enabled in threat-campaign-settings. After staging period (threatCampaignEnforcementReadinessPeriod in threat-campaign-settings), the system will suggest to enforce (disable staging) for the threat campaign. |  |


### 表格 105

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowRenderingInFrames | string | Specifies the conditions for when the browser should allow this URL to be rendered in a frame or iframe. Never: Specifies that this URL must never be rendered in a frame or iframe. The web application instructs browsers to hide, or disable, frame and iframe parts of this URL. Same Origin Only: Specifies that the browser may load the frame or iframe if the referring page is from the same protocol, port, and domain as this URL. This limits the user to navigate only within the same web application. Only From URL: Specifies that the browser may load the frame or iframe from a specified domain. Type the protocol and domain in URL format for example, http://www.mywebsite.com. Do not enter a sub-URL, such as http://www.mywebsite.com/index. | never only-from only-same |
| allowRenderingInFramesOnlyFrom | string | Specifies that the browser may load the frame or iframe from a specified domain. Type the protocol and domain in URL format for example, http://www.mywebsite.com. Do not enter a sub-URL, such as http://www.mywebsite.com/index. |  |
| attackSignaturesCheck | boolean | Specifies, when true, that you want attack signatures and threat campaigns to be detected on this URL and possibly override the security policy settings of an attack signature or threat campaign specifically for this URL. After you enable this setting, the system displays a list of attack signatures and threat campaigns. |  |
| canChangeDomainCookie | boolean |  |  |
| clickjackingProtection | boolean | Specifies that the system adds the X-Frame-Options header to the domain URLâs response header. This is done to protect the web application against clickjacking. Clickjacking occurs when an attacker lures a user to click illegitimate frames and iframes because the attacker hid them on legitimate visible website buttons. Therefore, enabling this option protects the web application from other web sites hiding malicious code behind them. The default is disabled. After you enable this option, you can select whether, and under what conditions, the browser should allow this URL to be rendered in a frame or iframe. |  |
| description | string | Describes the URL (optional). |  |
| disallowFileUploadOfExecutables | boolean |  |  |
| dynamicFlows | array of objects |  |  |
| flowsToThisUrlCheck | boolean |  |  |
| html5CrossOriginRequestsEnforcement | object | The system extracts the Origin (domain) of the request from the Origin header. |  |
| isAllowed | boolean | If true, the URLs allowed by the security policy. |  |
| isEntryPoint | boolean |  |  |
| mandatoryBody | boolean | A request body is mandatory. This is relevant for any method acting as POST. |  |
| metacharOverrides | array of objects | To allow or disallow specific meta characters in the name of this specific URL (and thus override the global meta character settings). |  |
| metacharsOnUrlCheck | boolean | Specifies, when true, that you want meta characters to be detected on this URL and possibly override the security policy settings of a meta character specifically for this URL. After you enable this setting, the system displays a list of meta characters. |  |
| method | string | Unique ID of a URL with a protocol type and name. Select a Method for the URL to create an API endpoint: URL + Method. | ACL BCOPY BDELETE BMOVE BPROPFIND BPROPPATCH CHECKIN CHECKOUT CONNECT COPY DELETE GET HEAD LINK LOCK MERGE MKCOL MKWORKSPACE MOVE NOTIFY OPTIONS PATCH POLL POST PROPFIND PROPPATCH PUT REPORT RPC_IN_DATA RPC_OUT_DATA SEARCH SUBSCRIBE TRACE TRACK UNLINK UNLOCK UNSUBSCRIBE VERSION_CONTROL X-MS-ENUMATTS * |
| methodOverrides | array of objects | Specifies a list of methods that are allowed or disallowed for a specific URL. The list overrides the list of methods allowed or disallowed globally at the policy level. |  |
| methodsOverrideOnUrlCheck | boolean | Specifies, when true, that you want methods to be detected on this URL and possibly override the security policy settings of a method specifically for this URL. After you enable this setting, the system displays a list of methods. |  |
| name | string | Specifies an HTTP URL that the security policy allows. The available types are: Explicit: Specifies that the URL has a specific name and is not a wildcard entity. Type the name of a URL exactly as you expect it to appear in the request. Wildcard: Specifies that any URL that matches the listed wildcard expression should be treated according to the wildcard attributes. Type a wildcard expression that matches the expected URL. For example, entering the wildcard expression * specifies that any URL is allowed by the security policy. The syntax for wildcard entities is based on shell-style wildcard characters. The list below describes the wildcard characters that you can use so that the entity name can match multiple objects. *: Matches all characters ?: Matches any single character [abcde]: Matches exactly one of the characters listed [!abcde]: Matches any character not listed [a-e]: Matches exactly one character in the range [!a-e]: Matches any character not in the range Note: Wildcards do not match regular expressions. Do not use a regular expression as a wildcard. |  |
| operationId | string | The attribute operationId is used as an OpenAPI endpint identifier. |  |
| performStaging | boolean | If true then any violation associated to the respective URL will not be enforced, and the request will not be considered illegal. |  |
| positionalParameters | array of objects | When checked (enabled), positional parameters are enabled in the URL. |  |
| protocol | string | Specifies whether the protocol for the URL is HTTP or HTTPS. | http https |
| signatureOverrides | array of objects | Array of signature overrides. Specifies attack signatures whose security policy settings are overridden for this URL, and which action the security policy takes when it discovers a request for this URL that matches these attack signatures. |  |
| type | string | Determines the type of the name attribute. Only when setting the type to wildcard will the special wildcard characters in the name be interpreted as such. | explicit wildcard |
| urlContentProfiles | array of objects | Specifies how the system recognizes and enforces requests for this URL according to the requestsâ header content. The system automatically creates a default header-based content profile for HTTP, and you cannot delete it. However, requests for a URL may contain other types of content, such as JSON, XML, or other proprietary formats. |  |
| urlIsReferrer | boolean |  |  |
| wildcardIncludesSlash | boolean | Specifies that an asterisk in a wildcard URL matches any number of path segments (separated by slashes); when cleared, specifies that an asterisk matches at most one segment. For example: the wildcard /art/* matches /art/abc/index.html if the wildcard match includes slashes (default value), but does not match it if the check box is cleared. In that case, it matches /art/go.html (only one segment below /art). |  |
| wildcardOrder | integer | Specifies the order index for wildcard URLs matching. Wildcard URLs with lower wildcard order will get checked for a match prior to URLs with higher wildcard order. The following are special values to be set as wildcardOrder: 1: First - will set 1 and increment all other wildcard entities wildcardOrder. -1: Last - will set wildcardOrder to the last value available. -2: Penultimate - will set wildcardOrder to the last value before the pure wildcard (pushes pure wildcard further). |  |


### 表格 106

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| prefix | string |  |  |
| regexp | string |  |  |
| suffix | string |  |  |


### 表格 107

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowCredentials | boolean | Specifies whether requests from other web applications hosted in different domains may include user credentials. |  |
| allowOriginsEnforcementMode | string | Allows you to specify a list of origins allowed to share data returned by this URL. | replace-with unmodified |
| checkAllowedHeaders | boolean | Allows you to specify a list of request headers that other web applications hosted in different domains can use when requesting this URL. Or you can delete non-simple headers returned in response to requests. |  |
| checkAllowedMethods | boolean | Allows you to specify a list of methods that other web applications hosted in different domains can use when requesting this URL. |  |
| checkCredentials | boolean | If false, requests from other web applications hosted in different domains are not allowed to include user credentials. |  |
| checkExposedHeaders | boolean | Optionally, for Exposed Headers, select Replace with, then specify the headers that JavaScript can expose and share with other applications when requesting this URL from another domain. Exposed headers are the headers the server returns in the response. For example, to discover server side web application technology, type X-Powered-By. |  |
| checkMaximumAge | boolean | Optionally, for Maximum Age, select Replace with, then specify the number of seconds that the results of a preflight request can be cached or use the default. |  |
| crossDomainAllowedHeader | array of objects |  |  |
| crossDomainAllowedMethod | array of objects | Allows you to specify a list of methods that other web applications hosted in different domains can use when requesting this URL. |  |
| crossDomainAllowedOrigin | array of objects | Allows you to specify a list of origins allowed to share data returned by this URL. |  |
| crossDomainExposedHeader | array of objects | Exposed headers are the headers the server returns in the response. For example, to discover server side web application technology, type X-Powered-By. |  |
| enforcementMode | string | Specify the option to determine how to handle CORS requests. Disabled: Do nothing related to cross-domain requests. Pass CORS requests exactly as set by the server. Remove all CORS headers: Remove all CORS headers from the response. The response is sent to the browser, and the browser does not allow cross-origin requests. Replace CORS headers: Replace the CORS header in the response with another header specified on the tab, including allowed origins, allowed methods, allowed headers, and so on. The browser enforces the policy. Then after Replace with specify the protocol, origin, and port for replacing CORS headers. Enforce on the system: Allow cross-origin resource sharing as configured in the Allowed Origins setting. CORS requests are allowed from the domains specified as allowed origins. The system enforces the policy. Specify the protocol, origin, and port of allowed origins | disabled enforce remove-all-headers replace-headers |
| maximumAge | integer | Specifies how long (in seconds) to cache in the browser the results of a preflight request (a special request that the browser sends to your web application to determine if JavaScript from another domain may access your resource). |  |


### 表格 108

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowedHeaderName | string | Optionally, for Allowed Headers, select Replace with, then type the headers that other applications can use when requesting this URL from another domain. |  |


### 表格 109

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| methodName | string | Optionally, for Allowed Methods, specify which methods other applications may use when requesting this URL from another domain. |  |


### 表格 110

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| includeSubDomains | boolean | If true, sub-domains of the allowed origin are also allowed to receive data from your web application. |  |
| originName | string | Type the domain name or IP address with which the URL can share data. Wildcards are allowed in the names. For example: *.f5.com will match b.f5.com; however it will not match a.b.f5.com. |  |
| originPort | integer string | Select the port that other web applications can use to request data from your web application, or use the * wildcard for all ports. | Integer values âallâ |
| originProtocol | string | Select the appropriate protocol for the allowed origin. | http http/https https |


### 表格 111

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| exposedHeaderName | string | Optionally, for Exposed Headers, select Replace with, then specify the headers that JavaScript can expose and share with other applications when requesting this URL from another domain. |  |


### 表格 112

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean | If true, metacharacters and other characters are allowed in a URL. |  |
| metachar | string | ASCII representation of the character in Hex format |  |


### 表格 113

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowed | boolean | Specifies that the system allows you to override allowed methods for this URL. When selected, the global policy settings for methods are listed, and you can change what is allowed or disallowed for this URL. |  |
| method | string | Specifies a list of existing HTTP methods. All security policies accept standard HTTP methods by default. | ACL BCOPY BDELETE BMOVE BPROPFIND BPROPPATCH CHECKIN CHECKOUT CONNECT COPY DELETE GET HEAD LINK LOCK MERGE MKCOL MKWORKSPACE MOVE NOTIFY OPTIONS PATCH POLL POST PROPFIND PROPPATCH PUT REPORT RPC_IN_DATA RPC_OUT_DATA SEARCH SUBSCRIBE TRACE TRACK UNLINK UNLOCK UNSUBSCRIBE VERSION_CONTROL X-MS-ENUMATTS |


### 表格 114

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| parameter | object |  |  |
| urlSegmentIndex | integer | Select which to add: Text or Parameter and enter your desired segments. You can add multiple text and parameter segments. |  |


### 表格 115

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean | Specifies, when true, that the overridden signature is enforced |  |
| signatureId | integer | The signature ID which identifies the signature. |  |


### 表格 116

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| contentProfile | object |  |  |
| headerName | string | Specifies an explicit header name that must appear in requests for this URL. This field is not case-sensitive. |  |
| headerOrder | integer string | Displays the order in which the system checks header content of requests for this URL. | Integer values âdefaultâ |
| headerValue | string | Specifies a simple pattern string (glob pattern matching) for the header value that must appear in legal requests for this URL; for example, json, xml_method?, or method[0-9]. If the header includes this pattern, the system assumes the request contains the type of data you select in the Request Body Handling setting. This field is case-sensitive. |  |
| type | string | Apply Content Signatures: Do not parse the content; scan the entire payload with full-content attack signatures. Apply Value and Content Signatures: Do not parse the content or extract parameters; process the entire payload with value and full-content attack signatures. Disallow: Block requests for an URL containing this header content. Log the Illegal Request Content Type violation. Do Nothing: Do not inspect or parse the content. Handle the header of the request as specified by the security policy. Form Data: Parse content as posted form data in either URL-encoded or multi-part formats. Enforce the form parameters according to the policy. GWT: Perform checks for data in requests, based on the configuration of the GWT (Google Web Toolkit) profile associated with this URL. JSON: Review JSON data using an associated JSON profile, and use value attack signatures to scan the element values. XML: Review XML data using an associated XML profile. | apply-content-signatures apply-value-and-content-signatures disallow do-nothing form-data gwt json xml |


### 表格 117

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  |  |


### 表格 118

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| apiAuthenticationKey | string |  |  |
| learnFromResponses | boolean |  |  |
| responseStatusCodes | array of strings |  |  |
| scanStatus | string |  | registration-completed registration-requested scan-completed |
| scannerSiteName | string |  |  |
| scannerType | string |  | generic hp-webinspect ibm-appscan immuniweb none qualys quotium-seeker trustwave whitehat-sentinel whitehat-sentinel-european |
| shareSiteMap | boolean |  |  |
| syncDayOfMonth | integer |  |  |
| syncDayOfWeek | integer |  |  |
| syncFrequency | string |  | daily monthly never weekly |
| syncHour | integer |  |  |
| trustAllIps | boolean |  |  |
| trustedTrafficLoosen | object |  |  |
| untrustedTrafficLoosen | object |  |  |


### 表格 119

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minHoursBetweenSamples | number |  |  |


### 表格 120

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| differentSources | integer |  |  |
| maxDaysBetweenSamples | number |  |  |
| minHoursBetweenSamples | number |  |  |


### 表格 121

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| body | string |  |  |
| contentType | string |  |  |
| name | string |  |  |
| triggerEvent | string |  | apply-policy apply-policy-failed http-request-illegal http-request-likely-malicious http-request-needing-examination incident-end incident-start |
| url | string |  |  |


### 表格 122

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowBinaryMessage | boolean |  |  |
| allowJsonMessage | boolean |  |  |
| allowTextMessage | boolean |  |  |
| binaryMessageMaxSize | integer |  |  |
| checkBinaryMessageMaxSize | boolean |  |  |
| checkMessageFrameMaxCount | boolean |  |  |
| checkMessageFrameMaxSize | boolean |  |  |
| checkPayload | boolean |  |  |
| description | string |  |  |
| extension | string |  | block ignore remove |
| html5CrossOriginRequestsEnforcement | object |  |  |
| isAllowed | boolean |  |  |
| jsonProfile | object |  |  |
| messageFrameMaxCount | integer |  |  |
| messageFrameMaxSize | integer |  |  |
| metacharOverrides | array of objects |  |  |
| metacharsOnWebsocketUrlCheck | boolean |  |  |
| name | string |  |  |
| performStaging | boolean |  |  |
| plainTextProfile | object |  |  |
| protocol | string |  | ws wss |
| type | string |  | explicit wildcard |
| unsupportedExtensions | string |  | block ignore remove |
| wildcardIncludesSlash | boolean |  |  |
| wildcardOrder | integer |  |  |


### 表格 123

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| crossDomainAllowedOrigin | array of objects |  |  |
| enforcementMode | string |  | disabled enforce remove-all-headers |


### 表格 124

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| includeSubDomains | boolean |  |  |
| originName | string |  |  |
| originPort | integer string |  | Integer values âallâ |
| originProtocol | string |  | http http/https https |


### 表格 125

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 126

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| blockRequests | string | Specifies how the system responds to blocking requests sent from this IP address. Policy Default: Specifies that the Policy Blocking Settings will be used for requests from this IP address. Never Block: Specifies that the system does not block requests sent from this IP address, even if your security policy is configured to block all traffic. Always Block: Specifies that the system blocks requests sent from this IP address on condition that IP is blacklisted is set to Block under Policy Building Settings. | always never policy-default |
| description | string | Specifies a brief description of the IP address. |  |
| ignoreAnomalies | boolean | Specifies when enabled that the system considers this IP address legitimate and does not take it into account when performing brute force prevention. Specifies when disabled that the system does not consider traffic from this IP address as being any safer than traffic from any other IP address. The system performs brute force prevention to traffic from this IP address according to the configuration of the security policy. |  |
| ignoreIpReputation | boolean | Specifies when enabled that the system considers this IP address legitimate even if it is found in the IP Intelligence database (a database of questionable IP addresses). Specifies when disabled that the system does not consider traffic from this IP address as being any safer than traffic from any other IP address. Therefore, if the IP Intelligence feature is enabled, the system checks whether this IP address matches any IP addresses in the IP Intelligence database. |  |
| ipAddress | string | Specifies the IP address that you want the system to trust. |  |
| ipMask | string | Specifies the netmask of the exceptional IP address. This is an optional field. |  |
| neverLearnRequests | boolean | Specifies when enabled that the system should not generate learning suggestions from traffic sent from this IP address. Specifies when disabled that the system should generate learning suggestions from traffic sent from this IP address for violations with the Learn flag enabled on the Policy Building Settings. |  |
| neverLogRequests | boolean | Specifies when enabled that the system does not log requests or responses sent from this IP address, even if the traffic is illegal, and even if your security policy is configured to log all traffic. Specifies when disabled that the system logs traffic sent this IP address according to the settings of the security policyâs Logging Profile, and the violation settings on the Policy Building Settings. |  |
| trustedByPolicyBuilder | boolean | Specifies when enabled the Policy Builder considers traffic from this IP address as being safe. The Policy Builder automatically adds to the security policy the data logged from traffic sent from this IP address. Specifies when disabled that the Policy Builder does not consider traffic from this IP address as being any different than traffic from any other IP address. |  |


### 表格 127

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| attachmentsInSoapMessages | boolean |  |  |
| attackSignaturesCheck | boolean |  |  |
| defenseAttributes | object |  |  |
| description | string |  |  |
| enableWss | boolean |  |  |
| followSchemaLinks | boolean |  |  |
| inspectSoapAttachments | boolean |  |  |
| metacharAttributeCheck | boolean |  |  |
| metacharElementCheck | boolean |  |  |
| metacharOverrides | array of objects |  |  |
| name | string |  |  |
| sensitiveData | array of objects |  |  |
| signatureOverrides | array of objects |  |  |
| soapMethods | array of objects |  |  |
| useXmlResponsePage | boolean |  |  |
| validationFiles | array of objects |  |  |
| validationSoapActionHeader | boolean |  |  |
| wssConfiguration | object |  |  |


### 表格 128

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| allowCDATA | boolean |  |  |
| allowDTDs | boolean |  |  |
| allowExternalReferences | boolean |  |  |
| allowProcessingInstructions | boolean |  |  |
| maximumAttributeValueLength | integer string |  | Integer values âanyâ |
| maximumAttributesPerElement | integer string |  | Integer values âanyâ |
| maximumChildrenPerElement | integer string |  | Integer values âanyâ |
| maximumDocumentDepth | integer string |  | Integer values âanyâ |
| maximumDocumentSize | integer string |  | Integer values âanyâ |
| maximumElements | integer string |  | Integer values âanyâ |
| maximumNSDeclarations | integer string |  | Integer values âanyâ |
| maximumNameLength | integer string |  | Integer values âanyâ |
| maximumNamespaceLength | integer string |  | Integer values âanyâ |
| tolerateCloseTagShorthand | boolean |  |  |
| tolerateLeadingWhiteSpace | boolean |  |  |
| tolerateNumericNames | boolean |  |  |


### 表格 129

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| isAllowed | boolean |  |  |
| metachar | string |  |  |


### 表格 130

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| namespace | string |  |  |
| paramName | string |  |  |
| paramType | string |  |  |


### 表格 131

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enabled | boolean |  |  |
| signatureId | integer |  |  |


### 表格 132

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| action | string |  |  |
| isAllowed | boolean |  |  |
| name | string |  |  |
| namespace | string |  |  |


### 表格 133

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| importUrl | string |  |  |
| isPrimary | boolean |  |  |
| xmlValidationFile | object |  |  |


### 表格 134

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| addTimestamp | boolean |  |  |
| applyActionToDefinedRequestElements | boolean |  |  |
| applyActionToDefinedResponseElements | boolean |  |  |
| applyActionToEntireResponseBodyValue | boolean |  |  |
| clientCertificates | array of objects |  |  |
| decryptAll | boolean |  |  |
| elements | array of objects |  |  |
| enableRequestRole | boolean |  |  |
| enableResponseRole | boolean |  |  |
| encryptionAlgorithm | string |  | aes128 aes256 tripledes |
| enforceTimestampInRequest | boolean |  |  |
| keyTransportAlgorithm | string |  | rsa-1_5 rsa-oaep |
| maxTimestampInterval | integer |  |  |
| name | string |  |  |
| namespaceMapping | array of objects |  |  |
| responseAction | string |  | encrypt encrypt-then-sign sign sign-then-encrypt |
| roles | array of objects |  |  |
| signatureAlgorithm | string |  | hmac-sha1 rsa-sha1 |
| soapBodyInRequestMustBeSignedAndVerified | boolean |  |  |
| verifyAll | boolean |  |  |


### 表格 135

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| name | string |  |  |


### 表格 136

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| applyTo | string |  | request response |
| encryptedPart | string |  | content element |
| xPathName | string |  |  |


### 表格 137

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| namespace | string |  |  |
| prefix | string |  |  |


### 表格 138

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| applyTo | string |  | request response |
| role | string |  | next none ultimateReceiver |


### 表格 139

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| contents | string |  |  |
| fileName | string |  |  |
| isBase64 | boolean |  |  |


### 表格 140

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| description | string | Human-readable name of sub-violation. | %u decoding Apache whitespace Bad unescape Bare byte decoding Directory traversals IIS Unicode codepoints IIS backslashes Multiple decoding |
| enabled | boolean | Defines if sub-violation is enforced - alarmed or blocked, according to the âEvasion technique detectedâ (VIOL_EVASION) violation blocking settings. |  |
| learn | boolean | Defines if sub-violation is learned. Sub-violations are learned only when learn is enabled for the âEvasion technique detectedâ (VIOL_EVASION) violation. |  |
| maxDecodingPasses | integer | Defines how many times the system decodes URI and parameter values before the request is considered an evasion. Relevant only for the âMultiple decodingâ sub-violation. |  |


### 表格 141

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| enablePassiveMode | boolean |  |  |
| enforcementMode | string |  | blocking transparent |


### 表格 142

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| description | string | Human-readable name of sub-violation | Bad HTTP version Bad host header value Bad multipart parameters parsing Bad multipart/form-data request parsing Body in GET or HEAD requests CRLF characters before request start Check maximum number of headers Check maximum number of parameters Chunked request with Content-Length header Content length should be a positive number Header name with no header value High ASCII characters in headers Host header contains IP address Multiple host headers No Host header in HTTP/1.1 request Null in request POST request with Content-Length: 0 Several Content-Length headers Unparsable request content |
| enabled | boolean | Defines if sub-violation is enforced - alarmed or blocked, according to the âHTTP protocol compliance failedâ (VIOL_HTTP_PROTOCOL) violation blocking settings |  |
| learn | boolean | Defines if sub-violation is learned. Sub-violations is learned only when learn is enabled for the âHTTP protocol compliance failedâ (VIOL_HTTP_PROTOCOL) violation |  |
| maxHeaders | integer | Defines maximum allowed number of headers in request. Relevant only for the âCheck maximum number of headersâ sub-violation |  |
| maxParams | integer | Defines maximum allowed number of paramters in request. Relevant only for the âCheck maximum number of parametersâ sub-violation |  |


### 表格 143

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| alarm | boolean |  |  |
| block | boolean |  |  |
| description | string |  |  |
| learn | boolean |  |  |
| name | string |  | VIOL_ASM_COOKIE_HIJACKING VIOL_ASM_COOKIE_MODIFIED VIOL_ATTACK_SIGNATURE VIOL_BLACKLISTED_IP VIOL_BLOCKING_CONDITION VIOL_BOT_CLIENT VIOL_BRUTE_FORCE VIOL_CONVICTION VIOL_COOKIE_EXPIRED VIOL_COOKIE_LENGTH VIOL_COOKIE_MALFORMED VIOL_COOKIE_MODIFIED VIOL_CROSS_ORIGIN_REQUEST VIOL_CSRF VIOL_CSRF_EXPIRED VIOL_DATA_GUARD VIOL_DATA_INTEGRITY VIOL_DYNAMIC_SESSION VIOL_ENCODING VIOL_EVASION VIOL_FILETYPE VIOL_FILE_UPLOAD VIOL_FILE_UPLOAD_IN_BODY VIOL_FLOW VIOL_FLOW_DISALLOWED_INPUT VIOL_FLOW_ENTRY_POINT VIOL_FLOW_MANDATORY_PARAMS VIOL_GEOLOCATION VIOL_GWT_FORMAT VIOL_GWT_MALFORMED VIOL_HEADER_LENGTH VIOL_HEADER_METACHAR VIOL_HEADER_REPEATED VIOL_HOSTNAME VIOL_HOSTNAME_MISMATCH VIOL_HTTP_PROTOCOL VIOL_HTTP_RESPONSE_STATUS VIOL_JSON_FORMAT VIOL_JSON_MALFORMED VIOL_JSON_SCHEMA VIOL_LEAKED_CREDENTIALS VIOL_LOGIN_URL_BYPASSED VIOL_LOGIN_URL_EXPIRED VIOL_MALICIOUS_DEVICE VIOL_MALICIOUS_IP VIOL_MANDATORY_HEADER VIOL_MANDATORY_PARAMETER VIOL_MANDATORY_REQUEST_BODY VIOL_METHOD VIOL_PARAMETER VIOL_PARAMETER_ARRAY_VALUE VIOL_PARAMETER_DATA_TYPE VIOL_PARAMETER_DYNAMIC_VALUE VIOL_PARAMETER_EMPTY_VALUE VIOL_PARAMETER_LOCATION VIOL_PARAMETER_MULTIPART_NULL_VALUE VIOL_PARAMETER_NAME_METACHAR VIOL_PARAMETER_NUMERIC_VALUE VIOL_PARAMETER_REPEATED VIOL_PARAMETER_STATIC_VALUE VIOL_PARAMETER_VALUE_BASE64 VIOL_PARAMETER_VALUE_LENGTH VIOL_PARAMETER_VALUE_METACHAR VIOL_PARAMETER_VALUE_REGEXP VIOL_PLAINTEXT_FORMAT VIOL_POST_DATA_LENGTH VIOL_QUERY_STRING_LENGTH VIOL_RATING_NEED_EXAMINATION VIOL_RATING_THREAT VIOL_REDIRECT VIOL_REQUEST_LENGTH VIOL_REQUEST_MAX_LENGTH VIOL_SESSION_AWARENESS VIOL_THREAT_ANALYSIS VIOL_THREAT_CAMPAIGN VIOL_URL VIOL_URL_CONTENT_TYPE VIOL_URL_LENGTH VIOL_URL_METACHAR VIOL_VIRUS VIOL_WEBSOCKET_BAD_REQUEST VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_EXTENSION VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT VIOL_WEBSOCKET_FRAME_LENGTH VIOL_WEBSOCKET_FRAME_MASKING VIOL_WEBSOCKET_FRAMING_PROTOCOL VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED VIOL_WEBSOCKET_TEXT_NULL_VALUE VIOL_XML_FORMAT VIOL_XML_MALFORMED VIOL_XML_SCHEMA VIOL_XML_SOAP_ATTACHMENT VIOL_XML_SOAP_METHOD VIOL_XML_WEB_SERVICES_SECURITY |


### 表格 144

| Field Name | Type | Description | Allowed Values |
| --- | --- | --- | --- |
| description | string |  | Certificate Error Certificate Expired Decryption Error Encryption Error Expired Timestamp Internal Error Invalid Timestamp Malformed Error Missing Timestamp Signing Error Timestamp expiration is too far in the future UnSigned Timestamp Verification Error |
| enabled | boolean |  |  |
| learn | boolean |  |  |



## 程式碼範例

### 程式碼範例 1

```text

applicationLanguage

```

### 程式碼範例 2

```text

caseInsensitive

```

### 程式碼範例 3

```text

description

```

### 程式碼範例 4

```text

enablePassiveMode

```

### 程式碼範例 5

```text

enforcementMode

```

### 程式碼範例 6

```text

fullPath

```

### 程式碼範例 7

```text

name

```

### 程式碼範例 8

```text

protocolIndependent

```

### 程式碼範例 9

```text

softwareVersion

```

### 程式碼範例 10

```text

type

```

### 程式碼範例 11

```text

link

```

### 程式碼範例 12

```text

maxRevisionDatetime

```

### 程式碼範例 13

```text

minRevisionDatetime

```

### 程式碼範例 14

```text

tag

```

### 程式碼範例 15

```text

name

```

### 程式碼範例 16

```text

inspectHttpUploads

```

### 程式碼範例 17

```text

enableBehavioralEnforcement

```

### 程式碼範例 18

```text

enableBlockingCveSignatures

```

### 程式碼範例 19

```text

enableBlockingHighAccuracySignatures

```

### 程式碼範例 20

```text

enableBlockingLikelyMaliciousTransactions

```

### 程式碼範例 21

```text

enableBlockingSuspiciousTransactions

```

### 程式碼範例 22

```text

enableBlockingViolations

```

### 程式碼範例 23

```text

name

```

### 程式碼範例 24

```text

bruteForceProtectionForAllLoginPages

```

### 程式碼範例 25

```text

measurementPeriod

```

### 程式碼範例 26

```text

preventionDuration

```

### 程式碼範例 27

```text

reEnableLoginAfter

```

### 程式碼範例 28

```text

sourceBasedProtectionDetectionPeriod

```

### 程式碼範例 29

```text

action

```

### 程式碼範例 30

```text

enabled

```

### 程式碼範例 31

```text

threshold

```

### 程式碼範例 32

```text

action

```

### 程式碼範例 33

```text

enabled

```

### 程式碼範例 34

```text

threshold

```

### 程式碼範例 35

```text

action

```

### 程式碼範例 36

```text

credentialsStuffingMatchesReached

```

### 程式碼範例 37

```text

detectCredentialsStuffingAttack

```

### 程式碼範例 38

```text

detectDistributedBruteForceAttack

```

### 程式碼範例 39

```text

failedLoginAttemptsRateReached

```

### 程式碼範例 40

```text

action

```

### 程式碼範例 41

```text

enabled

```

### 程式碼範例 42

```text

action

```

### 程式碼範例 43

```text

enabled

```

### 程式碼範例 44

```text

threshold

```

### 程式碼範例 45

```text

action

```

### 程式碼範例 46

```text

enabled

```

### 程式碼範例 47

```text

threshold

```

### 程式碼範例 48

```text

action

```

### 程式碼範例 49

```text

enabled

```

### 程式碼範例 50

```text

threshold

```

### 程式碼範例 51

```text

characterSetType

```

### 程式碼範例 52

```text

isAllowed

```

### 程式碼範例 53

```text

metachar

```

### 程式碼範例 54

```text

maximumCookieHeaderLength

```

### 程式碼範例 55

```text

accessibleOnlyThroughTheHttpProtocol

```

### 程式碼範例 56

```text

attackSignaturesCheck

```

### 程式碼範例 57

```text

enforcementType

```

### 程式碼範例 58

```text

insertSameSiteAttribute

```

### 程式碼範例 59

```text

isBase64

```

### 程式碼範例 60

```text

maskValueInLogs

```

### 程式碼範例 61

```text

name

```

### 程式碼範例 62

```text

performStaging

```

### 程式碼範例 63

```text

securedOverHttpsConnection

```

### 程式碼範例 64

```text

type

```

### 程式碼範例 65

```text

wildcardOrder

```

### 程式碼範例 66

```text

enabled

```

### 程式碼範例 67

```text

signatureId

```

### 程式碼範例 68

```text

enabled

```

### 程式碼範例 69

```text

expirationTimeInSeconds

```

### 程式碼範例 70

```text

sslOnly

```

### 程式碼範例 71

```text

enforcementAction

```

### 程式碼範例 72

```text

method

```

### 程式碼範例 73

```text

parametersList

```

### 程式碼範例 74

```text

requiredParameters

```

### 程式碼範例 75

```text

url

```

### 程式碼範例 76

```text

wildcardOrder

```

### 程式碼範例 77

```text

creditCardNumbers

```

### 程式碼範例 78

```text

customPatterns

```

### 程式碼範例 79

```text

customPatternsList

```

### 程式碼範例 80

```text

enabled

```

### 程式碼範例 81

```text

enforcementMode

```

### 程式碼範例 82

```text

enforcementUrls

```

### 程式碼範例 83

```text

exceptionPatterns

```

### 程式碼範例 84

```text

exceptionPatternsList

```

### 程式碼範例 85

```text

fileContentDetection

```

### 程式碼範例 86

```text

lastCcnDigitsToExpose

```

### 程式碼範例 87

```text

lastSsnDigitsToExpose

```

### 程式碼範例 88

```text

maskData

```

### 程式碼範例 89

```text

usSocialSecurityNumbers

```

### 程式碼範例 90

```text

name

```

### 程式碼範例 91

```text

databaseProtectionEnabled

```

### 程式碼範例 92

```text

userSource

```

### 程式碼範例 93

```text

responseBody

```

### 程式碼範例 94

```text

responseHeaders

```

### 程式碼範例 95

```text

responseStatusCode

```

### 程式碼範例 96

```text

enableCustomResponses

```

### 程式碼範例 97

```text

enableResponsePageByAttackType

```

### 程式碼範例 98

```text

responseStatusCodes

```

### 程式碼範例 99

```text

serverTechnologyName

```

### 程式碼範例 100

```text

type

```

### 程式碼範例 101

```text

countryCode

```

### 程式碼範例 102

```text

countryName

```

### 程式碼範例 103

```text

allowed

```

### 程式碼範例 104

```text

checkPostDataLength

```

### 程式碼範例 105

```text

checkQueryStringLength

```

### 程式碼範例 106

```text

checkRequestLength

```

### 程式碼範例 107

```text

checkUrlLength

```

### 程式碼範例 108

```text

name

```

### 程式碼範例 109

```text

performStaging

```

### 程式碼範例 110

```text

postDataLength

```

### 程式碼範例 111

```text

queryStringLength

```

### 程式碼範例 112

```text

requestLength

```

### 程式碼範例 113

```text

responseCheck

```

### 程式碼範例 114

```text

type

```

### 程式碼範例 115

```text

urlLength

```

### 程式碼範例 116

```text

wildcardOrder

```

### 程式碼範例 117

```text

allowedResponseCodes

```

### 程式碼範例 118

```text

customXffHeaders

```

### 程式碼範例 119

```text

dynamicSessionIdDescription

```

### 程式碼範例 120

```text

dynamicSessionIdInUrl

```

### 程式碼範例 121

```text

enableEventCorrelation

```

### 程式碼範例 122

```text

enforcementReadinessPeriod

```

### 程式碼範例 123

```text

maskCreditCardNumbersInRequest

```

### 程式碼範例 124

```text

pathParameterHandling

```

### 程式碼範例 125

```text

triggerAsmIruleEvent

```

### 程式碼範例 126

```text

trustXff

```

### 程式碼範例 127

```text

useDynamicSessionIdInUrl

```

### 程式碼範例 128

```text

attackSignaturesCheck

```

### 程式碼範例 129

```text

description

```

### 程式碼範例 130

```text

metacharElementCheck

```

### 程式碼範例 131

```text

name

```

### 程式碼範例 132

```text

maximumTotalLengthOfGWTData

```

### 程式碼範例 133

```text

maximumValueLength

```

### 程式碼範例 134

```text

tolerateGWTParsingWarnings

```

### 程式碼範例 135

```text

isAllowed

```

### 程式碼範例 136

```text

metachar

```

### 程式碼範例 137

```text

enabled

```

### 程式碼範例 138

```text

signatureId

```

### 程式碼範例 139

```text

maximumHttpHeaderLength

```

### 程式碼範例 140

```text

allowRepeatedOccurrences

```

### 程式碼範例 141

```text

base64Decoding

```

### 程式碼範例 142

```text

checkSignatures

```

### 程式碼範例 143

```text

htmlNormalization

```

### 程式碼範例 144

```text

mandatory

```

### 程式碼範例 145

```text

maskValueInLogs

```

### 程式碼範例 146

```text

name

```

### 程式碼範例 147

```text

normalizationViolations

```

### 程式碼範例 148

```text

percentDecoding

```

### 程式碼範例 149

```text

type

```

### 程式碼範例 150

```text

urlNormalization

```

### 程式碼範例 151

```text

wildcardOrder

```

### 程式碼範例 152

```text

enabled

```

### 程式碼範例 153

```text

signatureId

```

### 程式碼範例 154

```text

includeSubdomains

```

### 程式碼範例 155

```text

name

```

### 程式碼範例 156

```text

enabled

```

### 程式碼範例 157

```text

alarm

```

### 程式碼範例 158

```text

block

```

### 程式碼範例 159

```text

category

```

### 程式碼範例 160

```text

attackSignaturesCheck

```

### 程式碼範例 161

```text

description

```

### 程式碼範例 162

```text

handleJsonValuesAsParameters

```

### 程式碼範例 163

```text

hasValidationFiles

```

### 程式碼範例 164

```text

metacharElementCheck

```

### 程式碼範例 165

```text

name

```

### 程式碼範例 166

```text

maximumArrayLength

```

### 程式碼範例 167

```text

maximumStructureDepth

```

### 程式碼範例 168

```text

maximumTotalLengthOfJSONData

```

### 程式碼範例 169

```text

maximumValueLength

```

### 程式碼範例 170

```text

tolerateJSONParsingWarnings

```

### 程式碼範例 171

```text

isAllowed

```

### 程式碼範例 172

```text

metachar

```

### 程式碼範例 173

```text

parameterName

```

### 程式碼範例 174

```text

enabled

```

### 程式碼範例 175

```text

signatureId

```

### 程式碼範例 176

```text

importUrl

```

### 程式碼範例 177

```text

isPrimary

```

### 程式碼範例 178

```text

contents

```

### 程式碼範例 179

```text

fileName

```

### 程式碼範例 180

```text

isBase64

```

### 程式碼範例 181

```text

authenticatedUrls

```

### 程式碼範例 182

```text

expirationTimePeriod

```

### 程式碼範例 183

```text

requestContains

```

### 程式碼範例 184

```text

requestOmits

```

### 程式碼範例 185

```text

authenticationType

```

### 程式碼範例 186

```text

passwordParameterName

```

### 程式碼範例 187

```text

usernameParameterName

```

### 程式碼範例 188

```text

cookieContains

```

### 程式碼範例 189

```text

headerContains

```

### 程式碼範例 190

```text

headerOmits

```

### 程式碼範例 191

```text

parameterContains

```

### 程式碼範例 192

```text

responseContains

```

### 程式碼範例 193

```text

responseHttpStatus

```

### 程式碼範例 194

```text

responseHttpStatusOmits

```

### 程式碼範例 195

```text

responseOmits

```

### 程式碼範例 196

```text

actAsMethod

```

### 程式碼範例 197

```text

name

```

### 程式碼範例 198

```text

description

```

### 程式碼範例 199

```text

enforcementMode

```

### 程式碼範例 200

```text

hostName

```

### 程式碼範例 201

```text

hostNameType

```

### 程式碼範例 202

```text

urlName

```

### 程式碼範例 203

```text

urlType

```

### 程式碼範例 204

```text

wildcardOrder

```

### 程式碼範例 205

```text

wildcardUrlIncludesSlash

```

### 程式碼範例 206

```text

name

```

### 程式碼範例 207

```text

urlName

```

### 程式碼範例 208

```text

allowEmptyValue

```

### 程式碼範例 209

```text

allowRepeatedParameterName

```

### 程式碼範例 210

```text

arraySerializationFormat

```

### 程式碼範例 211

```text

arrayUniqueItemsCheck

```

### 程式碼範例 212

```text

attackSignaturesCheck

```

### 程式碼範例 213

```text

checkMaxItemsInArray

```

### 程式碼範例 214

```text

checkMaxValue

```

### 程式碼範例 215

```text

checkMaxValueLength

```

### 程式碼範例 216

```text

checkMetachars

```

### 程式碼範例 217

```text

checkMinItemsInArray

```

### 程式碼範例 218

```text

checkMinValue

```

### 程式碼範例 219

```text

checkMinValueLength

```

### 程式碼範例 220

```text

checkMultipleOfValue

```

### 程式碼範例 221

```text

dataType

```

### 程式碼範例 222

```text

disallowFileUploadOfExecutables

```

### 程式碼範例 223

```text

enableRegularExpression

```

### 程式碼範例 224

```text

exclusiveMax

```

### 程式碼範例 225

```text

exclusiveMin

```

### 程式碼範例 226

```text

explodeObjectSerialization

```

### 程式碼範例 227

```text

isBase64

```

### 程式碼範例 228

```text

isCookie

```

### 程式碼範例 229

```text

isHeader

```

### 程式碼範例 230

```text

level

```

### 程式碼範例 231

```text

mandatory

```

### 程式碼範例 232

```text

maxItemsInArray

```

### 程式碼範例 233

```text

maximumLength

```

### 程式碼範例 234

```text

maximumValue

```

### 程式碼範例 235

```text

metacharsOnParameterValueCheck

```

### 程式碼範例 236

```text

minItemsInArray

```

### 程式碼範例 237

```text

minimumLength

```

### 程式碼範例 238

```text

minimumValue

```

### 程式碼範例 239

```text

multipleOf

```

### 程式碼範例 240

```text

name

```

### 程式碼範例 241

```text

objectSerializationStyle

```

### 程式碼範例 242

```text

parameterEnumValues

```

### 程式碼範例 243

```text

parameterLocation

```

### 程式碼範例 244

```text

performStaging

```

### 程式碼範例 245

```text

regularExpression

```

### 程式碼範例 246

```text

sensitiveParameter

```

### 程式碼範例 247

```text

staticValues

```

### 程式碼範例 248

```text

type

```

### 程式碼範例 249

```text

valueType

```

### 程式碼範例 250

```text

wildcardOrder

```

### 程式碼範例 251

```text

name

```

### 程式碼範例 252

```text

isAllowed

```

### 程式碼範例 253

```text

metachar

```

### 程式碼範例 254

```text

enabled

```

### 程式碼範例 255

```text

signatureId

```

### 程式碼範例 256

```text

isAllowed

```

### 程式碼範例 257

```text

metachar

```

### 程式碼範例 258

```text

attackSignaturesCheck

```

### 程式碼範例 259

```text

description

```

### 程式碼範例 260

```text

metacharElementCheck

```

### 程式碼範例 261

```text

name

```

### 程式碼範例 262

```text

maximumLineLength

```

### 程式碼範例 263

```text

maximumTotalLength

```

### 程式碼範例 264

```text

performPercentDecoding

```

### 程式碼範例 265

```text

isAllowed

```

### 程式碼範例 266

```text

metachar

```

### 程式碼範例 267

```text

enabled

```

### 程式碼範例 268

```text

signatureId

```

### 程式碼範例 269

```text

enableFullPolicyInspection

```

### 程式碼範例 270

```text

enableTrustedTrafficSiteChangeTracking

```

### 程式碼範例 271

```text

enableUntrustedTrafficSiteChangeTracking

```

### 程式碼範例 272

```text

fullyAutomatic

```

### 程式碼範例 273

```text

inactiveEntityInactivityDurationInDays

```

### 程式碼範例 274

```text

learnFromResponses

```

### 程式碼範例 275

```text

learnInactiveEntities

```

### 程式碼範例 276

```text

learnOnlyFromNonBotTraffic

```

### 程式碼範例 277

```text

learningMode

```

### 程式碼範例 278

```text

responseStatusCodes

```

### 程式碼範例 279

```text

trustAllIps

```

### 程式碼範例 280

```text

applyAtAllTimes

```

### 程式碼範例 281

```text

applyOnAllDays

```

### 程式碼範例 282

```text

applyOnFridays

```

### 程式碼範例 283

```text

applyOnMondays

```

### 程式碼範例 284

```text

applyOnSaturdays

```

### 程式碼範例 285

```text

applyOnSundays

```

### 程式碼範例 286

```text

applyOnThursdays

```

### 程式碼範例 287

```text

applyOnTuesdays

```

### 程式碼範例 288

```text

applyOnWednesdays

```

### 程式碼範例 289

```text

endTime

```

### 程式碼範例 290

```text

frequency

```

### 程式碼範例 291

```text

startTime

```

### 程式碼範例 292

```text

maxModificationSuggestionScore

```

### 程式碼範例 293

```text

minDaysBetweenSamples

```

### 程式碼範例 294

```text

totalRequests

```

### 程式碼範例 295

```text

differentSources

```

### 程式碼範例 296

```text

maxDaysBetweenSamples

```

### 程式碼範例 297

```text

minHoursBetweenSamples

```

### 程式碼範例 298

```text

differentSources

```

### 程式碼範例 299

```text

maxDaysBetweenSamples

```

### 程式碼範例 300

```text

minMinutesBetweenSamples

```

### 程式碼範例 301

```text

differentSources

```

### 程式碼範例 302

```text

maxDaysBetweenSamples

```

### 程式碼範例 303

```text

minHoursBetweenSamples

```

### 程式碼範例 304

```text

differentSources

```

### 程式碼範例 305

```text

maxDaysBetweenSamples

```

### 程式碼範例 306

```text

minMinutesBetweenSamples

```

### 程式碼範例 307

```text

buildingMode

```

### 程式碼範例 308

```text

eventCorrelationMode

```

### 程式碼範例 309

```text

hostName

```

### 程式碼範例 310

```text

ipAddress

```

### 程式碼範例 311

```text

order

```

### 程式碼範例 312

```text

port

```

### 程式碼範例 313

```text

verifyCertificate

```

### 程式碼範例 314

```text

collapseCookieOccurrences

```

### 程式碼範例 315

```text

collapseCookiesIntoOneEntity

```

### 程式碼範例 316

```text

enforceUnmodifiedCookies

```

### 程式碼範例 317

```text

learnExplicitCookies

```

### 程式碼範例 318

```text

maximumCookies

```

### 程式碼範例 319

```text

learnExplicitFiletypes

```

### 程式碼範例 320

```text

maximumFileTypes

```

### 程式碼範例 321

```text

maximumHosts

```

### 程式碼範例 322

```text

validHostNames

```

### 程式碼範例 323

```text

classifyParameters

```

### 程式碼範例 324

```text

collapseParameterOccurrences

```

### 程式碼範例 325

```text

collapseParametersIntoOneEntity

```

### 程式碼範例 326

```text

learnExplicitParameters

```

### 程式碼範例 327

```text

maximumParameters

```

### 程式碼範例 328

```text

parameterLearningLevel

```

### 程式碼範例 329

```text

parametersIntegerValue

```

### 程式碼範例 330

```text

allHiddenFields

```

### 程式碼範例 331

```text

formParameters

```

### 程式碼範例 332

```text

linkParameters

```

### 程式碼範例 333

```text

uniqueValueSets

```

### 程式碼範例 334

```text

learnExplicitRedirectionDomains

```

### 程式碼範例 335

```text

maximumRedirectionDomains

```

### 程式碼範例 336

```text

enableServerTechnologiesDetection

```

### 程式碼範例 337

```text

learnLoginPage

```

### 程式碼範例 338

```text

classifyUrls

```

### 程式碼範例 339

```text

classifyWebsocketUrls

```

### 程式碼範例 340

```text

collapseUrlDepth

```

### 程式碼範例 341

```text

collapseUrlOccurrences

```

### 程式碼範例 342

```text

collapseUrlsIntoOneEntity

```

### 程式碼範例 343

```text

learnExplicitUrls

```

### 程式碼範例 344

```text

learnExplicitWebsocketUrls

```

### 程式碼範例 345

```text

learnMethodsOnUrls

```

### 程式碼範例 346

```text

maximumUrls

```

### 程式碼範例 347

```text

maximumWebsocketUrls

```

### 程式碼範例 348

```text

wildcardUrlFiletypes

```

### 程式碼範例 349

```text

redirectionProtectionEnabled

```

### 程式碼範例 350

```text

domainName

```

### 程式碼範例 351

```text

includeSubdomains

```

### 程式碼範例 352

```text

type

```

### 程式碼範例 353

```text

wildcardOrder

```

### 程式碼範例 354

```text

domainName

```

### 程式碼範例 355

```text

includeSubdomains

```

### 程式碼範例 356

```text

type

```

### 程式碼範例 357

```text

wildcardOrder

```

### 程式碼範例 358

```text

ajaxActionType

```

### 程式碼範例 359

```text

ajaxCustomContent

```

### 程式碼範例 360

```text

ajaxEnabled

```

### 程式碼範例 361

```text

ajaxPopupMessage

```

### 程式碼範例 362

```text

ajaxRedirectUrl

```

### 程式碼範例 363

```text

responseActionType

```

### 程式碼範例 364

```text

responseContent

```

### 程式碼範例 365

```text

responseHeader

```

### 程式碼範例 366

```text

responsePageType

```

### 程式碼範例 367

```text

responseRedirectUrl

```

### 程式碼範例 368

```text

name

```

### 程式碼範例 369

```text

serverTechnologyName

```

### 程式碼範例 370

```text

checkDeviceIdThreshold

```

### 程式碼範例 371

```text

checkIpThreshold

```

### 程式碼範例 372

```text

checkPeriod

```

### 程式碼範例 373

```text

checkSessionThreshold

```

### 程式碼範例 374

```text

checkUsernameThreshold

```

### 程式碼範例 375

```text

deviceIdThreshold

```

### 程式碼範例 376

```text

ipThreshold

```

### 程式碼範例 377

```text

period

```

### 程式碼範例 378

```text

sessionThreshold

```

### 程式碼範例 379

```text

urlBlockingMode

```

### 程式碼範例 380

```text

usernameThreshold

```

### 程式碼範例 381

```text

checkDeviceIdThreshold

```

### 程式碼範例 382

```text

checkIpThreshold

```

### 程式碼範例 383

```text

checkSessionThreshold

```

### 程式碼範例 384

```text

checkUsernameThreshold

```

### 程式碼範例 385

```text

deviceIdThreshold

```

### 程式碼範例 386

```text

ipThreshold

```

### 程式碼範例 387

```text

period

```

### 程式碼範例 388

```text

sessionThreshold

```

### 程式碼範例 389

```text

usernameThreshold

```

### 程式碼範例 390

```text

name

```

### 程式碼範例 391

```text

checkDeviceIdThreshold

```

### 程式碼範例 392

```text

checkIpThreshold

```

### 程式碼範例 393

```text

checkSessionThreshold

```

### 程式碼範例 394

```text

checkUsernameThreshold

```

### 程式碼範例 395

```text

deviceIdThreshold

```

### 程式碼範例 396

```text

ipThreshold

```

### 程式碼範例 397

```text

period

```

### 程式碼範例 398

```text

sessionThreshold

```

### 程式碼範例 399

```text

usernameThreshold

```

### 程式碼範例 400

```text

enableSessionAwareness

```

### 程式碼範例 401

```text

enableTrackingSessionHijackingByDeviceId

```

### 程式碼範例 402

```text

userNameSource

```

### 程式碼範例 403

```text

trackViolationsAndPerformActions

```

### 程式碼範例 404

```text

violationDetectionPeriod

```

### 程式碼範例 405

```text

action

```

### 程式碼範例 406

```text

createdDatetime

```

### 程式碼範例 407

```text

expirationDatetime

```

### 程式碼範例 408

```text

scope

```

### 程式碼範例 409

```text

value

```

### 程式碼範例 410

```text

alarm

```

### 程式碼範例 411

```text

block

```

### 程式碼範例 412

```text

learn

```

### 程式碼範例 413

```text

name

```

### 程式碼範例 414

```text

attackSignatureFalsePositiveMode

```

### 程式碼範例 415

```text

minimumAccuracyForAutoAddedSignatures

```

### 程式碼範例 416

```text

placeSignaturesInStaging

```

### 程式碼範例 417

```text

signatureStaging

```

### 程式碼範例 418

```text

alarm

```

### 程式碼範例 419

```text

block

```

### 程式碼範例 420

```text

enabled

```

### 程式碼範例 421

```text

inPolicy

```

### 程式碼範例 422

```text

isPriorRuleEnforced

```

### 程式碼範例 423

```text

learn

```

### 程式碼範例 424

```text

performStaging

```

### 程式碼範例 425

```text

signatureId

```

### 程式碼範例 426

```text

threatCampaignEnforcementReadinessPeriod

```

### 程式碼範例 427

```text

threatCampaignStaging

```

### 程式碼範例 428

```text

isEnabled

```

### 程式碼範例 429

```text

name

```

### 程式碼範例 430

```text

performStaging

```

### 程式碼範例 431

```text

allowRenderingInFrames

```

### 程式碼範例 432

```text

allowRenderingInFramesOnlyFrom

```

### 程式碼範例 433

```text

attackSignaturesCheck

```

### 程式碼範例 434

```text

canChangeDomainCookie

```

### 程式碼範例 435

```text

clickjackingProtection

```

### 程式碼範例 436

```text

description

```

### 程式碼範例 437

```text

disallowFileUploadOfExecutables

```

### 程式碼範例 438

```text

flowsToThisUrlCheck

```

### 程式碼範例 439

```text

isAllowed

```

### 程式碼範例 440

```text

isEntryPoint

```

### 程式碼範例 441

```text

mandatoryBody

```

### 程式碼範例 442

```text

metacharsOnUrlCheck

```

### 程式碼範例 443

```text

method

```

### 程式碼範例 444

```text

methodsOverrideOnUrlCheck

```

### 程式碼範例 445

```text

name

```

### 程式碼範例 446

```text

operationId

```

### 程式碼範例 447

```text

performStaging

```

### 程式碼範例 448

```text

protocol

```

### 程式碼範例 449

```text

type

```

### 程式碼範例 450

```text

urlIsReferrer

```

### 程式碼範例 451

```text

wildcardIncludesSlash

```

### 程式碼範例 452

```text

wildcardOrder

```

### 程式碼範例 453

```text

prefix

```

### 程式碼範例 454

```text

regexp

```

### 程式碼範例 455

```text

suffix

```

### 程式碼範例 456

```text

allowCredentials

```

### 程式碼範例 457

```text

allowOriginsEnforcementMode

```

### 程式碼範例 458

```text

checkAllowedHeaders

```

### 程式碼範例 459

```text

checkAllowedMethods

```

### 程式碼範例 460

```text

checkCredentials

```

### 程式碼範例 461

```text

checkExposedHeaders

```

### 程式碼範例 462

```text

checkMaximumAge

```

### 程式碼範例 463

```text

enforcementMode

```

### 程式碼範例 464

```text

maximumAge

```

### 程式碼範例 465

```text

allowedHeaderName

```

### 程式碼範例 466

```text

methodName

```

### 程式碼範例 467

```text

includeSubDomains

```

### 程式碼範例 468

```text

originName

```

### 程式碼範例 469

```text

originPort

```

### 程式碼範例 470

```text

originProtocol

```

### 程式碼範例 471

```text

exposedHeaderName

```

### 程式碼範例 472

```text

isAllowed

```

### 程式碼範例 473

```text

metachar

```

### 程式碼範例 474

```text

allowed

```

### 程式碼範例 475

```text

method

```

### 程式碼範例 476

```text

urlSegmentIndex

```

### 程式碼範例 477

```text

enabled

```

### 程式碼範例 478

```text

signatureId

```

### 程式碼範例 479

```text

headerName

```

### 程式碼範例 480

```text

headerOrder

```

### 程式碼範例 481

```text

headerValue

```

### 程式碼範例 482

```text

type

```

### 程式碼範例 483

```text

name

```

### 程式碼範例 484

```text

apiAuthenticationKey

```

### 程式碼範例 485

```text

learnFromResponses

```

### 程式碼範例 486

```text

responseStatusCodes

```

### 程式碼範例 487

```text

scanStatus

```

### 程式碼範例 488

```text

scannerSiteName

```

### 程式碼範例 489

```text

scannerType

```

### 程式碼範例 490

```text

shareSiteMap

```

### 程式碼範例 491

```text

syncDayOfMonth

```

### 程式碼範例 492

```text

syncDayOfWeek

```

### 程式碼範例 493

```text

syncFrequency

```

### 程式碼範例 494

```text

syncHour

```

### 程式碼範例 495

```text

trustAllIps

```

### 程式碼範例 496

```text

differentSources

```

### 程式碼範例 497

```text

maxDaysBetweenSamples

```

### 程式碼範例 498

```text

minHoursBetweenSamples

```

### 程式碼範例 499

```text

differentSources

```

### 程式碼範例 500

```text

maxDaysBetweenSamples

```

### 程式碼範例 501

```text

minHoursBetweenSamples

```

### 程式碼範例 502

```text

body

```

### 程式碼範例 503

```text

contentType

```

### 程式碼範例 504

```text

name

```

### 程式碼範例 505

```text

triggerEvent

```

### 程式碼範例 506

```text

url

```

### 程式碼範例 507

```text

allowBinaryMessage

```

### 程式碼範例 508

```text

allowJsonMessage

```

### 程式碼範例 509

```text

allowTextMessage

```

### 程式碼範例 510

```text

binaryMessageMaxSize

```

### 程式碼範例 511

```text

checkBinaryMessageMaxSize

```

### 程式碼範例 512

```text

checkMessageFrameMaxCount

```

### 程式碼範例 513

```text

checkMessageFrameMaxSize

```

### 程式碼範例 514

```text

checkPayload

```

### 程式碼範例 515

```text

description

```

### 程式碼範例 516

```text

extension

```

### 程式碼範例 517

```text

isAllowed

```

### 程式碼範例 518

```text

messageFrameMaxCount

```

### 程式碼範例 519

```text

messageFrameMaxSize

```

### 程式碼範例 520

```text

metacharsOnWebsocketUrlCheck

```

### 程式碼範例 521

```text

name

```

### 程式碼範例 522

```text

performStaging

```

### 程式碼範例 523

```text

protocol

```

### 程式碼範例 524

```text

type

```

### 程式碼範例 525

```text

unsupportedExtensions

```

### 程式碼範例 526

```text

wildcardIncludesSlash

```

### 程式碼範例 527

```text

wildcardOrder

```

### 程式碼範例 528

```text

enforcementMode

```

### 程式碼範例 529

```text

includeSubDomains

```

### 程式碼範例 530

```text

originName

```

### 程式碼範例 531

```text

originPort

```

### 程式碼範例 532

```text

originProtocol

```

### 程式碼範例 533

```text

isAllowed

```

### 程式碼範例 534

```text

metachar

```

### 程式碼範例 535

```text

blockRequests

```

### 程式碼範例 536

```text

description

```

### 程式碼範例 537

```text

ignoreAnomalies

```

### 程式碼範例 538

```text

ignoreIpReputation

```

### 程式碼範例 539

```text

ipAddress

```

### 程式碼範例 540

```text

ipMask

```

### 程式碼範例 541

```text

neverLearnRequests

```

### 程式碼範例 542

```text

neverLogRequests

```

### 程式碼範例 543

```text

trustedByPolicyBuilder

```

### 程式碼範例 544

```text

attachmentsInSoapMessages

```

### 程式碼範例 545

```text

attackSignaturesCheck

```

### 程式碼範例 546

```text

description

```

### 程式碼範例 547

```text

enableWss

```

### 程式碼範例 548

```text

followSchemaLinks

```

### 程式碼範例 549

```text

inspectSoapAttachments

```

### 程式碼範例 550

```text

metacharAttributeCheck

```

### 程式碼範例 551

```text

metacharElementCheck

```

### 程式碼範例 552

```text

name

```

### 程式碼範例 553

```text

useXmlResponsePage

```

### 程式碼範例 554

```text

validationSoapActionHeader

```

### 程式碼範例 555

```text

allowCDATA

```

### 程式碼範例 556

```text

allowDTDs

```

### 程式碼範例 557

```text

allowExternalReferences

```

### 程式碼範例 558

```text

allowProcessingInstructions

```

### 程式碼範例 559

```text

maximumAttributeValueLength

```

### 程式碼範例 560

```text

maximumAttributesPerElement

```

### 程式碼範例 561

```text

maximumChildrenPerElement

```

### 程式碼範例 562

```text

maximumDocumentDepth

```

### 程式碼範例 563

```text

maximumDocumentSize

```

### 程式碼範例 564

```text

maximumElements

```

### 程式碼範例 565

```text

maximumNSDeclarations

```

### 程式碼範例 566

```text

maximumNameLength

```

### 程式碼範例 567

```text

maximumNamespaceLength

```

### 程式碼範例 568

```text

tolerateCloseTagShorthand

```

### 程式碼範例 569

```text

tolerateLeadingWhiteSpace

```

### 程式碼範例 570

```text

tolerateNumericNames

```

### 程式碼範例 571

```text

isAllowed

```

### 程式碼範例 572

```text

metachar

```

### 程式碼範例 573

```text

namespace

```

### 程式碼範例 574

```text

paramName

```

### 程式碼範例 575

```text

paramType

```

### 程式碼範例 576

```text

enabled

```

### 程式碼範例 577

```text

signatureId

```

### 程式碼範例 578

```text

action

```

### 程式碼範例 579

```text

isAllowed

```

### 程式碼範例 580

```text

name

```

### 程式碼範例 581

```text

namespace

```

### 程式碼範例 582

```text

importUrl

```

### 程式碼範例 583

```text

isPrimary

```

### 程式碼範例 584

```text

addTimestamp

```

### 程式碼範例 585

```text

applyActionToDefinedRequestElements

```

### 程式碼範例 586

```text

applyActionToDefinedResponseElements

```

### 程式碼範例 587

```text

applyActionToEntireResponseBodyValue

```

### 程式碼範例 588

```text

decryptAll

```

### 程式碼範例 589

```text

enableRequestRole

```

### 程式碼範例 590

```text

enableResponseRole

```

### 程式碼範例 591

```text

encryptionAlgorithm

```

### 程式碼範例 592

```text

enforceTimestampInRequest

```

### 程式碼範例 593

```text

keyTransportAlgorithm

```

### 程式碼範例 594

```text

maxTimestampInterval

```

### 程式碼範例 595

```text

name

```

### 程式碼範例 596

```text

responseAction

```

### 程式碼範例 597

```text

signatureAlgorithm

```

### 程式碼範例 598

```text

soapBodyInRequestMustBeSignedAndVerified

```

### 程式碼範例 599

```text

verifyAll

```

### 程式碼範例 600

```text

name

```

### 程式碼範例 601

```text

applyTo

```

### 程式碼範例 602

```text

encryptedPart

```

### 程式碼範例 603

```text

xPathName

```

### 程式碼範例 604

```text

namespace

```

### 程式碼範例 605

```text

prefix

```

### 程式碼範例 606

```text

applyTo

```

### 程式碼範例 607

```text

role

```

### 程式碼範例 608

```text

contents

```

### 程式碼範例 609

```text

fileName

```

### 程式碼範例 610

```text

isBase64

```

### 程式碼範例 611

```text

description

```

### 程式碼範例 612

```text

enabled

```

### 程式碼範例 613

```text

learn

```

### 程式碼範例 614

```text

maxDecodingPasses

```

### 程式碼範例 615

```text

enablePassiveMode

```

### 程式碼範例 616

```text

enforcementMode

```

### 程式碼範例 617

```text

description

```

### 程式碼範例 618

```text

enabled

```

### 程式碼範例 619

```text

learn

```

### 程式碼範例 620

```text

maxHeaders

```

### 程式碼範例 621

```text

maxParams

```

### 程式碼範例 622

```text

alarm

```

### 程式碼範例 623

```text

block

```

### 程式碼範例 624

```text

description

```

### 程式碼範例 625

```text

learn

```

### 程式碼範例 626

```text

name

```

### 程式碼範例 627

```text

description

```

### 程式碼範例 628

```text

enabled

```

### 程式碼範例 629

```text

learn

```
