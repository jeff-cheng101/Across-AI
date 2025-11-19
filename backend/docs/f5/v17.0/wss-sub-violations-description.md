# WSS Sub-Violations Description

## 目錄

- [WSS Sub-Violations DescriptionÂ¶](#wss-sub-violations-descriptionâ)


Version notice:

# WSS Sub-Violations DescriptionÂ¶


## 表格

### 表格 1

| Sub Violation Name | Description |
| --- | --- |
| UnSigned Timestamp | The timestamp digital signature is missing. |
| Timestamp expiration is too far in the future | The timestamp lifetime is greater than configured. |
| Expired Timestamp | The timestamp has expired. |
| Invalid Timestamp | The timestamp is not formatted according to the specifications. |
| Missing Timestamp | The timestamp is missing from the document. |
| Verification Error | The underlying crypto library failed to perform signature verification. |
| Signing Error | The underlying crypto library failed to sign the document. |
| Encryption Error | The system cannot encrypt a section requested by the user. |
| Decryption Error | An encrypted section in the request could not be decrypted. |
| Certificate Error | The client certificate, extracted from the document, is invalid. |
| Certificate Expired | The client certificate, extracted from the document, has expired. |
| Malformed Error | The systemâs web services security offload engine was confronted with a malformed document, and has stopped parsing the document. |
| Internal Error | The systemâs web services security offload engine was confronted with an unexpected scenario, and cannot continue parsing. |

