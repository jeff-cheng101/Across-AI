# Violations Description

## 目錄

- [Violations DescriptionÂ¶](#violations-descriptionâ)


Version notice:

# Violations DescriptionÂ¶

- Quotation marks in the cookie name.
- A space in the cookie name.
- An equal sign (=) in the cookie name.

- An equal sign (=) before the cookie name.
- A carriage return (hexadecimal value of 0xd) in the cookie name.

- The request does not include a main ASM cookie.
- The request is for a URL defined in the security policy, and the security policy is configured to check flows to this URL.
- The URL is not defined as an entry point.

The ASM can block specific flows between pages.
The ASM issues this violation when it receives a request under the following conditions:

> If the file type and URL are defined: The URL has to be defined as an explicit URL and the security policy should be configured to check flows to this URL.
If the flow is defined: The request is sent with an illegal method.
The source URL is defined as being a referrer URL.

- If the file type and URL are defined: The URL has to be defined as an explicit URL and the security policy should be configured to check flows to this URL.
- If the flow is defined: The request is sent with an illegal method.
- The source URL is defined as being a referrer URL.

The system checks that the multi-part request has a parameter value that does not contain the NULL character (0x00). If a multipart parameter with binary content type contains NULL in its value, the enforcer issues this violation.
The exceptions to this are:

> If that parameter is configured in the policy as âIgnore valueâ.
If that parameter is configured in the security policy as âuser-input file uploadâ.
If the parameter has a content-type that contains the string âXMLâ and the parameter value contains a valid UTF16 encoded XML document (the encoding is valid). In this case NULL is allowed as it is part of the UTF16 encoding.

- If that parameter is configured in the policy as âIgnore valueâ.
- If that parameter is configured in the security policy as âuser-input file uploadâ.
- If the parameter has a content-type that contains the string âXMLâ and the parameter value contains a valid UTF16 encoded XML document (the encoding is valid). In this case NULL is allowed as it is part of the UTF16 encoding.


## 表格

### 表格 1

| Violation Name | Title | Description |
| --- | --- | --- |
| VIOL_GRAPHQL_ERROR_RESPONSE | GraphQL disallowed pattern in response | The system checks the responses to the GraphQL queries in order to find schema validation failures reported by the backend (as well as other possible error response). |
| VIOL_GRAPHQL_INTROSPECTION_QUERY | GraphQL introspection query | The system checks that the GraphQL introspection query is not invoked. |
| VIOL_GRAPHQL_FORMAT | GraphQL data does not comply with format settings | The system checks that the request contains GraphQL query that complies with the various document limits within the GraphQL profile configuration in the security policy. This violation is generated when a problem in the GraphQL query is detected, generally checking the message according to boundaries such as the messageâs size, maximum depth, and maximum number of batched queries. |
| VIOL_GRAPHQL_MALFORMED | Malformed GraphQL data | The system checks that the request contains GraphQL data that is well-formed, according to GraphQL spec. Enforces proper GraphQL requests. |
| VIOL_SERVER_SIDE_HOST | Server-side access to disallowed host | Attempt to access a disallowed host from the server side by exploiting an address parameter. |
| VIOL_FILE_UPLOAD_IN_BODY | Disallowed file upload content detected in body | The system checks that the file upload content is not a binary executable file format. |
| VIOL_DATA_INTEGRITY | DataSafe Data Integrity | The system checks that transaction data was not modified when travelling between the client and the BIG-IP. |
| VIOL_RATING_NEED_EXAMINATION | Violation Rating Need Examination detected | The combination of violations could not determine whether the request is a threat or violations are false positives thus requiring more examination. |
| VIOL_RATING_THREAT | Violation Rating Threat detected | The combination of violations in this request determined that the request is likely to be a threat. |
| VIOL_HEADER_REPEATED | Illegal repeated header | Detected multiple occurrences of the same header field name in a single HTTP request. |
| VIOL_MANDATORY_REQUEST_BODY | Mandatory request body is missing | The system checks that the body exists in the request |
| VIOL_CONVICTION | Bad Actor Convicted | The system employs behavioral analysis to detect malicious source IP address and Device IDs. |
| VIOL_HOSTNAME_MISMATCH | Host name mismatch | The request included a host name in the request line, which was different than the one in the Host header field. |
| VIOL_HOSTNAME | Illegal host name | The system checks that the hostname in the request is one of the hostnames configured in the policy. |
| VIOL_LEAKED_CREDENTIALS | Leaked Credentials Detection | The system detected a login attempt with leaked credentials |
| VIOL_THREAT_ANALYSIS | Mitigation action determined by Threat Analysis Platform | Mitigation action determined by Threat Analysis Platform |
| VIOL_BLOCKING_CONDITION | Blocking Condition Detected | Detected one of the configured blocking conditions. |
| VIOL_MALICIOUS_DEVICE | Bad Actor Detected | The system employs behavioral analysis to detect malicious source IP address and Device IDs. |
| VIOL_PARAMETER_LOCATION | Illegal parameter location |  |
| VIOL_MANDATORY_PARAMETER | Mandatory parameter is missing |  |
| VIOL_JSON_SCHEMA | JSON data does not comply with JSON schema | The system checks that the incoming request contains JSON data that matches the schema file that is part of a JSON profile configured in the security policy. Enforces proper JSON requests defined by the schema. |
| VIOL_PARAMETER_ARRAY_VALUE | Illegal parameter array value |  |
| VIOL_THREAT_CAMPAIGN | Threat Campaign detected | The system examines the HTTP message for known threat campaigns by matching it against known attack patterns. |
| VIOL_BLACKLISTED_IP | IP is blacklisted | The violation is issued when a request comes from an IP address that falls in the range of an IP address exception marked for âalways blockingâ, that is, the deny list of IPs. |
| VIOL_PLAINTEXT_FORMAT | Plain text data does not comply with format settings | The system checks that the request contains plain text content which complies with the various request limits within the defense configuration in the security policyâs plain text profile. This violation is generated when a problem is detected in a request or WebSocket message containing plain text, generally checking the message according to boundaries such as the messageâs size and meta characters in parameter value. |
| VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH | Illegal WebSocket binary message length | The system checks that the length of binary WebSocket messages does not exceed the acceptable length specified in the security policy for the requested URL. |
| VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT | Illegal number of frames per message | The system checks that the number of frames in a fragmented WebSocket message does not exceed the acceptable length specified in the security policy for the requested URL. |
| VIOL_WEBSOCKET_EXTENSION | Illegal WebSocket extension | The system checks that no WebSocket extensions are negotiated. This is enforced if the respective WebSocket URL in the policy was configured to block extensions. |
| VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED | Binary content found in text only WebSocket | The violation is issued if a binary WebSocket message arrived and binary content is not allowed in the policy for the requested URL. |
| VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED | Text content found in binary only WebSocket | The violation is issued if a textual WebSocket message arrived and textual content (plain text or JSON) is not allowed in the policy for the requested URL. |
| VIOL_CROSS_ORIGIN_REQUEST | Illegal cross-origin request | The system checks that HTTP requests from within a Web page (AJAX requests and WebSocket upgrade requests) point towards the same origin as the current page or from a list of allowed origins defined for the current URL in the policy. |
| VIOL_WEBSOCKET_TEXT_NULL_VALUE | Null character found in WebSocket text message | The violation is issued if a null character is found in a textual message payload. |
| VIOL_WEBSOCKET_FRAME_LENGTH | Illegal WebSocket frame length | The system checks that the total WebSocket frame length does not exceed the acceptable length specified in the security policy for the requested URL. |
| VIOL_WEBSOCKET_FRAME_MASKING | Mask not found in client frame | The system checks that the client message payload is XOR-masked with a given random pattern, the mask itself, as indicated by the RFC. This makes the payload look random preventing cache poisoning. |
| VIOL_WEBSOCKET_FRAMING_PROTOCOL | Failure in WebSocket framing protocol | The system checks that the WebSocket frames are well-formed and that the frames pertaining to the same message arrive contiguously, complying with the WebSocket RFC. |
| VIOL_WEBSOCKET_BAD_REQUEST | Bad WebSocket handshake request | The system checks that the WebSocket opening handshake complies with the WebSocket RFC. |
| VIOL_REDIRECT | Illegal redirection attempt | The server tries to redirect the user to a target domain that is not defined in the policy. Web applications use âLocationâ response header to redirect their users to another resource (page) in the application or in another website. |
| VIOL_MANDATORY_HEADER | Mandatory HTTP header is missing | The system detects requests that do not include a header configured in the security policy as being mandatory. |
| VIOL_GWT_FORMAT | GWT data does not comply with format settings | The system checks that the request data matches the various payload limits of that GWT profile. |
| VIOL_PARAMETER_VALUE_BASE64 | Illegal Base64 value | The system checks that the value is a valid Base64 string. If the value is indeed Base64, the system decodes this value and continues with its security checks. |
| VIOL_MALICIOUS_IP | Access from malicious IP address | The IP Intelligence database checks every source IP address against a dynamic denylist, that is continuously being updated. It can identify IP addresses associated with high risk, such as anonymous proxies, Tor exits, phishing proxies, botnets, and scanners. |
| VIOL_FILE_UPLOAD | Disallowed file upload content detected | The system checks that the file upload content is not a binary executable file format. |
| VIOL_GWT_MALFORMED | Malformed GWT data | The system checks that the request data matches a GWT request. |
| VIOL_HEADER_METACHAR | Illegal meta character in header | The system checks that the values of all headers within the request only contain meta characters defined as allowed in the security policy. |
| VIOL_URL_CONTENT_TYPE | Illegal request content type | The URL in the security policy has a âHeader-Based Content Profilesâ setting that disallows the request because the specified HTTP header or the default is set to âDisallowâ. |
| VIOL_HTTP_RESPONSE_STATUS | Illegal HTTP status in response | The server response contains an HTTP status code that is not defined as valid in the security policy. |
| VIOL_ASM_COOKIE_MODIFIED | Modified ASM cookie | The system checks that the request contains an ASM cookie that has not been modified or tampered with. Blocks modified requests. |
| VIOL_COOKIE_MODIFIED | Modified domain cookie(s) | The system checks that the web application cookies within the request have not been tampered, and the system checks that the request includes a web application cookie defined in the security policy. |
| VIOL_COOKIE_MALFORMED | Cookie not RFC-compliant | This violation occurs when HTTP cookies contain at least one of the following components: Quotation marks in the cookie name. A space in the cookie name. An equal sign (=) in the cookie name. Note: A space between the cookie name and the equal sign (=), and between the equal sign (=) and cookie value is allowed. An equal sign (=) before the cookie name. A carriage return (hexadecimal value of 0xd) in the cookie name. |
| VIOL_JSON_MALFORMED | Malformed JSON data | The system checks that the request contains JSON content that is well-formed. Enforces parsable JSON requests. |
| VIOL_FLOW_ENTRY_POINT | Illegal entry point | The system checks the following: The request does not include a main ASM cookie. The request is for a URL defined in the security policy, and the security policy is configured to check flows to this URL. The URL is not defined as an entry point. |
| VIOL_SESSION_AWARENESS | Access from disallowed User/Session/IP/Device ID | The system detected that the number of violations from the same User/Session/IP/Device ID within the specified time frame is above the configurable limit within session awareness. |
| VIOL_ASM_COOKIE_HIJACKING | ASM Cookie Hijacking | The system checks that the request does not contain an ASM cookie that was created in another session. Blocks modified requests. This is done in 2 ways: 1. Verifying that ASMâs session cookies are consistent 2. Verifying that ASMâs session cookies matches the clients Device-ID. |
| VIOL_COOKIE_EXPIRED | Expired timestamp | The system checks that the timestamp in the HTTP cookie is not old. An old timestamp indicates that a client session has expired. Blocks expired requests. The timestamp is extracted and validated against the current time. If the timestamp is expired and it is not an entry point, the system issues the Expired Timestamp violation. |
| VIOL_PARAMETER_STATIC_VALUE | Illegal static parameter value | The system checks that the request contains a static parameter whose value is defined in the security policy. Prevents static parameter change. The ASM can be configured to block parameter values that are not in a predefined list. Parameters can be defined on each of the following levels: file type, URL, and flow. Each parameter can be one of the following types: explicit or wildcard. |
| VIOL_PARAMETER_DYNAMIC_VALUE | Illegal dynamic parameter value | The ASM ensures that the parameter value which was received is equal to the value which was set by the server. |
| VIOL_PARAMETER_VALUE_LENGTH | Illegal parameter value length | The system checks that the request contains a parameter whose value length (in bytes) matches the value length defined in the security policy. |
| VIOL_PARAMETER_DATA_TYPE | Illegal parameter data type | The system checks that the request contains a parameter whose data type matches the data type defined in the security policy. The data types that this violation applies to are integer, email, and phone. |
| VIOL_PARAMETER_NUMERIC_VALUE | Illegal parameter numeric value | The system checks that the incoming request contains a parameter whose value is in the range of decimal or integer values defined in the security policy. |
| VIOL_ATTACK_SIGNATURE | Attack signature detected | The system examines the HTTP message for known attacks by matching it against known attack patterns. |
| VIOL_FLOW_MANDATORY_PARAMS | Illegal number of mandatory parameters | The system checks that the request contains the right number of mandatory parameters on a flow. Note that only flows can contain mandatory parameters. |
| VIOL_PARAMETER_VALUE_REGEXP | Parameter value does not comply with regular expression | The system checks that the request contains an alphanumeric parameter value that matches the expected pattern specified by the regular-expression field for that parameter. Prevents HTTP requests which do not comply with a defined pattern. The ASM lets you set up a regular expression to block requests where a parameter value does not match the regular expression. |
| VIOL_FILETYPE | Illegal file type | The system checks that the requested file type is configured as a valid file type, or not configured as an invalid file type, within the security policy. |
| VIOL_URL | Illegal URL | The system checks that the requested URL is configured as a valid URL, or not configured as an invalid URL, within the security policy. |
| VIOL_FLOW | Illegal flow to URL | The ASM can block specific flows between pages. The ASM issues this violation when it receives a request under the following conditions: If the file type and URL are defined: The URL has to be defined as an explicit URL and the security policy should be configured to check flows to this URL. If the flow is defined: The request is sent with an illegal method. The source URL is defined as being a referrer URL. |
| VIOL_METHOD | Illegal method | The system checks that the request references an HTTP request method that is found in the security policy. Enforces desired HTTP methods; GET and POST are always allowed. |
| VIOL_DYNAMIC_SESSION | Illegal session ID in URL | The system checks that the request contains a session ID value that matches the session ID value which was set by the server to this session. |
| VIOL_FLOW_DISALLOWED_INPUT | Illegal query string or POST data | The system checks that the request contains a query string or POST data defined in the security policy. Enforces proper HTTP requests. The violation Illegal Query String or POST Data may take place only for a flow. |
| VIOL_PARAMETER | Illegal parameter | The system checks that every parameter in the request is defined in the security policy. |
| VIOL_PARAMETER_EMPTY_VALUE | Illegal empty parameter value | The system checks that the request contains a parameter whose value is not empty when it must contain a value. |
| VIOL_POST_DATA_LENGTH | Illegal POST data length | The system checks that the request contains POST data whose length does not exceed the acceptable length specified in the security policy. |
| VIOL_PARAMETER_MULTIPART_NULL_VALUE | Null in multi-part parameter value | The system checks that the multi-part request has a parameter value that does not contain the NULL character (0x00). If a multipart parameter with binary content type contains NULL in its value, the enforcer issues this violation. The exceptions to this are: If that parameter is configured in the policy as âIgnore valueâ. If that parameter is configured in the security policy as âuser-input file uploadâ. If the parameter has a content-type that contains the string âXMLâ and the parameter value contains a valid UTF16 encoded XML document (the encoding is valid). In this case NULL is allowed as it is part of the UTF16 encoding. |
| VIOL_HEADER_LENGTH | Illegal header length | The system checks that the request includes a total HTTP header length that does not exceed the length specified in the security policy. |
| VIOL_JSON_FORMAT | JSON data does not comply with format settings | The system checks that the request contains JSON content and complies with the various request limits within the defense configuration in the security policyâs JSON profile. Enforces valid JSON requests and protects the server from JSON parser attacks. This violation is generated when a problem is detected in a JSON request, generally checking the message according to boundaries such as the messageâs size and meta characters in parameter value. |
| VIOL_PARAMETER_REPEATED | Illegal repeated parameter name | Detected multiple parameters of the same name in a single HTTP request. |
| VIOL_URL_METACHAR | Illegal meta character in URL | The system checks that the incoming request includes a URL that contains only meta characters defined as allowed in the security policy. Enforces a desired set of acceptable characters. |
| VIOL_PARAMETER_NAME_METACHAR | Illegal meta character in parameter name | The system checks that all parameter names within the incoming request only contain meta characters defined as allowed in the security policy. |
| VIOL_PARAMETER_VALUE_METACHAR | Illegal meta character in value | The system checks that all parameter values, XML element/attribute values, JSON values, or GraphQL values within the request only contain meta characters defined as allowed in the security policy. Enforces proper input values. |
| VIOL_XML_SOAP_METHOD | SOAP method not allowed | The system checks that the request contains a SOAP method that is permitted by the security policy. Enforces desired SOAP methods. A disallowed SOAP method was detected by the enforcer. |
| VIOL_BRUTE_FORCE | Brute Force: Maximum login attempts are exceeded | The number of times a user tried to log on to a URL is more than what is allowed by the security policy. This indicates an attempt to access secured parts of the website by guessing user names and passwords |
| VIOL_CSRF_EXPIRED | CSRF authentication expired | The ASM enforces an expiration time for the CSRF token, and when this time expires, the ASM issues this violation. |
| VIOL_URL_LENGTH | Illegal URL length | The system checks that the request is for a URL whose length does not exceed the acceptable length specified in the security policy. |
| VIOL_COOKIE_LENGTH | Illegal cookie length | The system checks that the request does not include a cookie header that exceeds the acceptable length specified in the security policy. |
| VIOL_REQUEST_LENGTH | Illegal request length | The system checks that the request length does not exceed the acceptable length specified in the security policy per the requested file type. |
| VIOL_QUERY_STRING_LENGTH | Illegal query string length | The system checks that the request contains a query string whose length does not exceed the acceptable length specified in the security policy. |
| VIOL_GEOLOCATION | Access from disallowed Geolocation | The system checks whether users are accessing the web application from allowed geographical locations, or from disallowed geographical locations, according to the security policy. |
| VIOL_HTTP_PROTOCOL | HTTP protocol compliance failed | This category contains a list of validation checks that the system performs on HTTP requests to ensure that the requests are formatted properly. |
| VIOL_ENCODING | Failed to convert character | The system detects that one of the characters does not comply with the configured language encoding of the web applicationâs security policy. |
| VIOL_CSRF | CSRF attack detected | Avoid Cross-Site Request Forgery (CSRF) by ensuring that the request is legitimate and comes from the web application itself and not from a clicked link or embedded malicious HTML or JavaScript that resides on other web applications. CSRF is sometimes also referred to as XSRF, Session Riding or One-Click attack. |
| VIOL_XML_MALFORMED | Malformed XML data | The system checks that the request contains XML data that is well-formed, according to W3C standards. Enforces proper XML requests. |
| VIOL_XML_SCHEMA | XML data does not comply with schema or WSDL document | The system checks that the incoming request contains XML data that matches the schema file or WSDL document that is part of an XML profile configured in the security policy. Enforces proper XML requests defined by the schema. The data failed validation specified in the validation files (which includes checks for the SOAPAction header). The document does not obey the schema that the user compiled for an XML profile configured in the security policy. The schema is enforced according to the W3C schema standards. |
| VIOL_XML_FORMAT | XML data does not comply with format settings | The system checks that the request contains XML data that complies with the various document limits within the defense configuration in the security policyâs XML profile. Enforces proper XML requests and the data failed format/defense settings such as the maximum document length. This violation is generated when a problem in an XML document is detected (for example, an XML bomb), generally checking the message according to boundaries such as the messageâs size, maximum depth, and maximum number of children. |
| VIOL_XML_WEB_SERVICES_SECURITY | Web Services Security failure | A WS-Enc sub-violation, that was configured as active, has occurred. |
| VIOL_EVASION | Evasion technique detected | This category contains a list of evasion techniques that attackers use to bypass detection. |
| VIOL_VIRUS | Virus detected | Detected an attempt to upload a malicious file. |
| VIOL_REQUEST_MAX_LENGTH | Request length exceeds defined buffer size | The system checks that the request length is not larger than the maximum memory buffer size of the ASM. Note that this is a BIG-IP unit parameter that protects the ASM from consuming too much memory across all security policies which are active on the device. |
| VIOL_LOGIN_URL_BYPASSED | Login URL bypassed | The system checks that users who requested this resource successfully passed the login page. |
| VIOL_LOGIN_URL_EXPIRED | Login URL expired | The ASM enforces an idle expiry time for a logged in session, and when this time expires, the ASM issues this violation. |
| VIOL_DATA_GUARD | Data Guard: Information leakage detected | The system examines responses and searches for sensitive information. |
| VIOL_XML_SOAP_ATTACHMENT | Illegal attachment in SOAP message | The system checks that the request does not contain a SOAP message with an attachment that is not permitted by the security policy. Multipart SOAP HTTP message was sent and configured as not allowed by the security policy. |

