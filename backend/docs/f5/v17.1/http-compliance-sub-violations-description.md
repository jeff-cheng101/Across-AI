# HTTP Compliance Sub-Violations Description

## 目錄

- [HTTP Compliance Sub-Violations DescriptionÂ¶](#http-compliance-sub-violations-descriptionâ)


Version notice:

# HTTP Compliance Sub-Violations DescriptionÂ¶


## 表格

### 表格 1

| Sub Violation Name | Description |
| --- | --- |
| Check maximum number of cookies | The system compares the request cookies to the maximal configured number of cookies. |
| Unescaped space in URL | An attacker may try to segment the URL in two or more parts by inserting an unescaped space in the middle of the URL, which is illegal by the RFC. The WAF, the server and other proxies on the way may each interpret the URL differently. |
| Multiple host headers | Examines requests to ensure that they contain only a single âHostâ header. |
| Check maximum number of parameters | The system compares the number of parameters in the request to the maximum configured number of parameters. |
| Bad host header value | Detected non RFC compliant header value. |
| Check maximum number of headers | The system compares the request headers to the maximal configured number of headers. |
| Unparsable request content | This violation is triggered when the systemâs parser cannot parse the message. |
| High ASCII characters in headers | Checks for high ASCII characters in headers (greater than 127). |
| Null in request | The system issues a violation for requests with a NULL character anywhere in the request (except for a NULL in the binary part of a multipart request). |
| Bad HTTP version | Enforces legal HTTP version number (only 0.9 or higher allowed). |
| Content length should be a positive number | The Content-Length header value should be greater than zero; only a numeric positive number value is accepted. |
| Host header contains IP address | The system verifies that the requestâs host header value is not an IP address to prevent non-standard requests. |
| CRLF characters before request start | Examines whether there is a CRLF character before the request method. If there is, the system issues a violation. |
| No Host header in HTTP/1.1 request | Examines requests using HTTP/1.1 to see whether they contain a âHostâ header. |
| Bad multipart parameters parsing | The system checks the following: 1. A boundary follows immediately after request headers. 2. The parameter value matches the format: âname=âparam_keyâ;rn. 3. A chunked body contains at least one CRLF. 4. A chunked body ends with CRLF. 5. Final boundary was found on multipart request. 6. There is no payload after final boundary. If one of these is false, the system issues a violation. 7. Internal batch request line has valid structure and valid method name. |
| Bad multipart/form-data request parsing | When the content type of a request header contains the substring âMultipart/form-dataâ, the system checks whether each multipart request chunk contains the strings âContent-Dispositionâ and âNameâ. If they do not, the system issues a violation. |
| Body in GET or HEAD requests | Examines GET and HEAD requests which have a body. |
| Chunked request with Content-Length header | The system checks for a Content-Length header within chunked requests. |
| Several Content-Length headers | More than one content-length header is a non RFC violation. Indicates an HTTP response splitting attack. |
| Header name with no header value | The system checks for a header name without a header value. |
| POST request with Content-Length: 0 | Examines the content-length header of POST requests, checks if the method used is POST, and the request is not chunked. If the content-length header value is equal to 0, the system issues a violation because POST requests should usually contain a non-zero length body. |

