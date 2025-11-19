# SSL/TLS - 加密憑證

> 本文檔包含 140 個頁面的內容
> 生成時間: 2025-09-08T04:18:09.241Z
> 產品線: 🛡️ Security Products

## 📑 目錄

1. [Cloudflare SSL/TLS](#cloudflare-ssltls)
2. [Concepts](#concepts)
3. [Get started](#get-started)
4. [Edge certificates](#edge-certificates)
5. [Universal SSL](#universal-ssl)
6. [Enable Universal SSL certificates](#enable-universal-ssl-certificates)
7. [Disable Universal SSL certificates](#disable-universal-ssl-certificates)
8. [Alerts](#alerts)
9. [Limitations](#limitations)
10. [Troubleshooting](#troubleshooting)
11. [Advanced certificates](#advanced-certificates)
12. [Manage advanced certificates](#manage-advanced-certificates)
13. [API commands](#api-commands)
14. [Custom certificates](#custom-certificates)
15. [Manage custom certificates](#manage-custom-certificates)
16. [Renewal and expiration](#renewal-and-expiration)
17. [Bundle methodologies](#bundle-methodologies)
18. [Remove key file password](#remove-key-file-password)
19. [Troubleshooting](#troubleshooting)
20. [Enforce HTTPS connections](#enforce-https-connections)
21. [Domain control validation (DCV)](#domain-control-validation-dcv)
22. [Methods](#methods)
23. [Delegated](#delegated)
24. [TXT](#txt)
25. [HTTP](#http)
26. [Validation backoff schedule](#validation-backoff-schedule)
27. [Domain control validation flow](#domain-control-validation-flow)
28. [Troubleshooting](#troubleshooting)
29. [Geo Key Manager](#geo-key-manager)
30. [Setup](#setup)
31. [Supported options](#supported-options)
32. [Add CAA records](#add-caa-records)
33. [Staging environment (Beta)](#staging-environment-beta)
34. [Backup certificates](#backup-certificates)
35. [ECH Protocol](#ech-protocol)
36. [Cipher suites](#cipher-suites)
37. [Customize cipher suites](#customize-cipher-suites)
38. [Customize cipher suites via dashboard](#customize-cipher-suites-via-dashboard)
39. [Customize cipher suites via API](#customize-cipher-suites-via-api)
40. [Security levels](#security-levels)
41. [Compliance standards](#compliance-standards)
42. [Supported cipher suites](#supported-cipher-suites)
43. [Troubleshooting](#troubleshooting)
44. [Certificate Transparency Monitoring](#certificate-transparency-monitoring)
45. [HTTP Strict Transport Security (HSTS)](#http-strict-transport-security-hsts)
46. [Certificate Signing Requests (CSRs)](#certificate-signing-requests-csrs)
47. [TLS 1.3](#tls-13)
48. [Minimum TLS Version](#minimum-tls-version)
49. [Automatic HTTPS Rewrites](#automatic-https-rewrites)
50. [Total TLS](#total-tls)
51. [Enable](#enable)
52. [Error messages](#error-messages)
53. [Always Use HTTPS](#always-use-https)
54. [Opportunistic Encryption](#opportunistic-encryption)
55. [CAs and certificates FAQ](#cas-and-certificates-faq)
56. [Certification Authority Authorization (CAA) FAQ](#certification-authority-authorization-caa-faq)
57. [Encryption modes](#encryption-modes)
58. [Off (no encryption)](#off-no-encryption)
59. [Flexible](#flexible)
60. [Full](#full)
61. [Full (strict)](#full-strict)
62. [Strict (SSL-Only Origin Pull)](#strict-ssl-only-origin-pull)
63. [SSL/TLS Recommender](#ssltls-recommender)
64. [Cloudflare origin CA](#cloudflare-origin-ca)
65. [Troubleshooting Cloudflare origin CA](#troubleshooting-cloudflare-origin-ca)
66. [Authenticated Origin Pulls (mTLS)](#authenticated-origin-pulls-mtls)
67. [About](#about)
68. [AWS integration](#aws-integration)
69. [Zone-level](#zone-level)
70. [Per-hostname](#per-hostname)
71. [Manage certificates](#manage-certificates)
72. [Custom Origin Trust Store](#custom-origin-trust-store)
73. [Cipher suites](#cipher-suites)
74. [Client certificates (mTLS)](#client-certificates-mtls)
75. [Create a client certificate](#create-a-client-certificate)
76. [Enable mTLS](#enable-mtls)
77. [Bring your own CA for mTLS](#bring-your-own-ca-for-mtls)
78. [Forward certificate to server](#forward-certificate-to-server)
79. [Label client certificates](#label-client-certificates)
80. [Revoke a client certificate](#revoke-a-client-certificate)
81. [Configure your mobile app or IoT device](#configure-your-mobile-app-or-iot-device)
82. [Troubleshooting](#troubleshooting)
83. [Keyless SSL](#keyless-ssl)
84. [Cloudflare Tunnel](#cloudflare-tunnel)
85. [Public DNS](#public-dns)
86. [Hardware security modules](#hardware-security-modules)
87. [Configuration](#configuration)
88. [AWS cloud HSM](#aws-cloud-hsm)
89. [Azure Dedicated HSM](#azure-dedicated-hsm)
90. [Azure Managed HSM](#azure-managed-hsm)
91. [Entrust nShield Connect](#entrust-nshield-connect)
92. [Fortanix Data Security Manager](#fortanix-data-security-manager)
93. [Google Cloud HSM](#google-cloud-hsm)
94. [IBM cloud HSM](#ibm-cloud-hsm)
95. [SoftHSMv2](#softhsmv2)
96. [Upgrade your key server](#upgrade-your-key-server)
97. [High availability](#high-availability)
98. [Scaling and benchmarking](#scaling-and-benchmarking)
99. [Keyless delegation](#keyless-delegation)
100. [Glossary](#glossary)
101. [Troubleshooting](#troubleshooting)
102. [Post-quantum cryptography (PQC)](#post-quantum-cryptography-pqc)
103. [PQC support](#pqc-support)
104. [Post-quantum between Cloudflare and origin servers](#post-quantum-between-cloudflare-and-origin-servers)
105. [Post-quantum cryptography in Cloudflare's Zero Trust platform](#post-quantum-cryptography-in-cloudflares-zero-trust-platform)
106. [TLS protocols](#tls-protocols)
107. [Certificate and hostname priority](#certificate-and-hostname-priority)
108. [Certificate authorities](#certificate-authorities)
109. [Browser compatibility](#browser-compatibility)
110. [Entrust distrust by major browsers](#entrust-distrust-by-major-browsers)
111. [Certificate pinning](#certificate-pinning)
112. [Certificate statuses](#certificate-statuses)
113. [Validity periods and renewal](#validity-periods-and-renewal)
114. [Features and plans](#features-and-plans)
115. [Cloudflare and CVE-2019-1559](#cloudflare-and-cve-2019-1559)
116. [PCI compliance and vulnerabilities mitigation](#pci-compliance-and-vulnerabilities-mitigation)
117. [Troubleshooting](#troubleshooting)
118. [General SSL errors](#general-ssl-errors)
119. [ERR_SSL_VERSION_OR_CIPHER_MISMATCH](#err-ssl-version-or-cipher-mismatch)
120. [ERR_TOO_MANY_REDIRECTS](#err-too-many-redirects)
121. [Mixed content errors](#mixed-content-errors)
122. [FAQ](#faq)
123. [Origin server](#origin-server)
124. [Additional options](#additional-options)
125. [Bundle methodologies](#bundle-methodologies)
126. [Troubleshooting](#troubleshooting)
127. [未知標題](#)
128. [未知標題](#)
129. [Setup](#setup)
130. [未知標題](#)
131. [Get started](#get-started)
132. [Reference](#reference)
133. [Reference](#reference)
134. [Migration guides](#migration-guides)
135. [Universal SSL](#universal-ssl)
136. [Advanced certificates](#advanced-certificates)
137. [Custom certificates](#custom-certificates)
138. [Total TLS](#total-tls)
139. [Automatic HTTPS Rewrites](#automatic-https-rewrites)
140. [Certificate authorities](#certificate-authorities)

---

## Cloudflare SSL/TLS

**來源**: [https://developers.cloudflare.com/ssl/](https://developers.cloudflare.com/ssl/)

Page options # Cloudflare SSL/TLS

Encrypt your web traffic to prevent data theft and other tampering.

Available on all plans Through Universal SSL, Cloudflare is the first Internet performance and security company to offer free SSL/TLS protection.
Cloudflare SSL/TLS also provides a number of other features to meet your encryption requirements and certificate management needs. Refer to Get started for more.

## Features

### Total TLS

Extending the protection offered by Universal SSL, Total TLS is an easy way to automatically issue certificates for all levels of subdomains that you have.

Use Total TLS ### Delegated DCV

Even if you use a different provider for authoritative DNS, you can delegate domain control validation (DCV) to Cloudflare, reducing the need of manual intervention.

Use Delegated DCV ### Custom TLS settings

Cloudflare also allows you to specify the minimum TLS version that visitors must use to connect to your website or application, and restrict cipher suites according to your security requirements.

Use Custom TLS settings Refer to features and availability for a complete list of SSL/TLS features and their availability according to different Cloudflare plans.

## Related products

Cloudflare DNS When you use Cloudflare DNS, all DNS queries for your domain are answered by Cloudflare's global anycast network. This network delivers performance and global availability.

Cloudflare for SaaS Cloudflare for SaaS allows you to extend the security and performance benefits of Cloudflare's network to your customers via their own custom or vanity domains.

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

**來源**: [https://developers.cloudflare.com/ssl/concepts/](https://developers.cloudflare.com/ssl/concepts/)

Page options # Concepts

This page defines and articulates key concepts that are relevant to Cloudflare SSL/TLS and are used in this documentation. For more concepts and broader descriptions, check out the Cloudflare Learning Center ↗.

## SSL/TLS certificate

An SSL/TLS certificate is what enables websites and applications to establish secure connections. With SSL/TLS, a client - such as a browser - can verify the authenticity and integrity of the server it is connecting with, and use encryption to exchange information.

Since Cloudflare's global network ↗ is at the core of several products and services that Cloudflare offers, what this implies in terms of SSL/TLS is that, instead of only one certificate, there can actually be two certificates involved in a single request: an edge certificate and an origin certificate.

### Edge certificate

The edge certificates are the ones that Cloudflare presents to clients visiting your website or application. You can manage edge certificates through the Cloudflare Dashboard ↗.

```
flowchart LR
        accTitle: Edge certificate and origin certificate
        accDescr: Diagram showing how edge certificates are positioned between Cloudflare and the browser whereas origin certificates sit between Cloudflare and the origin server.
        A[Browser] <--Edge certificate--> B((Cloudflare))<--Origin certificate--> C[(Origin server)]
```

### Origin certificate

Origin certificates guarantee the security and authentication on the other side of the network, between Cloudflare and the origin server of your website or application. Origin certificates are managed on your origin server.

SSL/TLS encryption modes control whether and how Cloudflare will use both these ceritifcates, and you can choose between different modes on the SSL/TLS overview page ↗.

## Validity period

One common aspect of every SSL/TLS certificate is that they must have a fixed expiration date. If a certificate is expired, clients - such as your visitor's browser - will consider that a secure connection cannot be established, resulting in warnings or errors.

Different certificate authorities (CAs) support different validity periods. Cloudflare works with them to guarantee that both Universal and Advanced edge certificates are always renewed.

## Certificate authority (CA)

A certificate authority (CA) is a trusted third party that generates and gives out SSL/TLS certificates. The CA digitally signs the certificates with their own private key, allowing client devices - such as your visitor's browser - to verify that the certificate is trustworthy.

As explained in the article about what is an ssl certificate ↗, this means that, besides not being expired, an SSL/TLS certificate should be issued by a certificate authority (CA) in order to avoid warnings or errors.

## Validation level

SSL/TLS certificates vary in terms of the level to which a CA has validated them. As explained in the article about types of certificates ↗, SSL/TLS certificates can be DV (Domain Validated), OV (Organization Validated) or EV (Extended Validation).

Certificates issued through Cloudflare - Universal, Advanced, and Custom Hostname certificates - are Domain Validated (DV). You can upload a custom certificate if your organization needs OV or EV certificates.

## Origin pull

When visitors request content from your website or application, Cloudflare first attempts to serve content from the cache ↗. If this attempt fails, Cloudflare sends a request back to your origin web server to get the content. This request between Cloudflare and your origin web server is called origin pull.

This relates to the difference between edge certificates and origin certificates, and also explains why some specifications such as cipher suites can be set differently depending on whether they refer to the connection between Cloudflare and your visitor's browser or between Cloudflare and your origin server.

## Cipher suites

Besides the authentication and integrity aspects that valid certificates guarantee, the other important aspect of SSL/TLS certificates is encryption. Cipher suites determine the set of algorithms that can be used for encryption/decryption and that will be negotiated during an SSL/TLS handshake ↗.

For the purpose of this documentation, keep in mind that cipher suites supported at Cloudflare's network may not be the same as cipher suites presented by Cloudflare to your origin server.

## Trust store

The list of certificate authority (CA) and intermediate certificates that are trusted by operating systems, web browsers or other software that interacts with SSL/TLS certificates is called trust store. Cloudflare maintains its trust store on a public GitHub repository ↗.

While for most cases you do not have to worry about this list or how it is used when a client checks your SSL/TLS certificate, some features such as Custom Origin Trust Store, and processes such as bundle methodologies, are directly related to it.

## Chain of trust

Depending on your organization requirements, or if you have to troubleshoot an issue with your certificates, for example, you might come across the terms root certificate, intermediate certificate and leaf certificate.

These terms refer to the way in which the certificate presented to a client - the leaf certificate - has to be traceable back to a trusted certificate authority (CA) certificate - the root certificate ↗. This process is structured around a chain of trust ↗.

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

**來源**: [https://developers.cloudflare.com/ssl/get-started/](https://developers.cloudflare.com/ssl/get-started/)

Page options # Get started

Follow the steps below to enable SSL/TLS protection for your application.

## Before you begin

- Create an account and register an application

## Choose an edge certificate

As explained in the concepts page, edge certificates are the SSL/TLS certificates that Cloudflare presents to your visitors.

Cloudflare offers a variety of options for your application's edge certificates:

- Universal certificates: By default, Cloudflare issues — and renews — free, unshared, publicly trusted SSL certificates to all domains added to and activated on Cloudflare.
- Advanced certificates: Use advanced certificates when you want something more customizable than Universal SSL but still want the convenience of SSL certificate issuance and renewal.
- Custom certificates: Custom certificates are meant for Business and Enterprise customers who want to use their own SSL certificates.
- Keyless certificates (Enterprise only): Keyless SSL allows security-conscious clients to upload their own custom certificates and benefit from Cloudflare, but without exposing their TLS private keys.

Refer to Edge certificates for more information on how different certificate types can respond to common use cases.

For SaaS providers

Cloudflare for SaaS allows you to extend the security and performance benefits of Cloudflare's network to your customers via their own custom or vanity domains.

For more details, refer to Cloudflare for SaaS (managed hostnames).

## Choose your encryption mode

Once you have chosen your edge certificate, choose an encryption mode.

Encryption modes specify how Cloudflare encrypts connections between (a) visitors and Cloudflare, and (b) Cloudflare and your origin server. For more context about this two-part process refer to the concepts page.

Note that some encryption modes will require you to have a valid origin certificate, which is managed on your origin server. Each encryption mode setup page lists out this and other requirements and you can also consider other Cloudflare options to use with your origin server, such as Origin CA certificates.

## Enforce HTTPS connections

Even if your application has an active edge certificate, visitors can still access resources over unsecured HTTP connections.

Using various Cloudflare settings, however, you can force all or most visitor connections to use HTTPS.

## Optional - Enable additional features

After you have chosen your encryption mode and enforced HTTPS connections, evaluate the following settings:

- Edge certificates: Customize different aspects of your edge certificates, from enabling Opportunistic Encryption to specifying a Minimum TLS Version.
- Authenticated origin pull: Ensure all requests to your origin server originate from the Cloudflare network.
- Notifications: Set up alerts related to certificate validation status, issuance, deployment, renewal, and expiration.

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

## Edge certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/](https://developers.cloudflare.com/ssl/edge-certificates/)

Page options # Edge certificates

Consider the information below for guidance on how to choose different edge certificates for common use cases, or refer to the other pages in this section for more options.

If you are not familiar with what SSL/TLS certificates are, refer to Concepts.

## Use cases

### Simplify issuance and renewal

Issuing and renewing certificates can take up a lot of time from your technical teams. Leverage Cloudflare Universal SSL or advanced certificates to simplify this process.

Advanced certificates offer more customization than Universal SSL.

With custom certificates, you have full control in terms of certificate authority (CA) or certificate validation level, but you need to handle issuance and renewal on your own.

### Meet cipher suites requirements

The different algorithms used in SSL/TLS encryption can vary in terms of how secure they are.

Through cipher suites customization you can control which ciphers are used for your domain and/or specific hostnames, making it possible to achieve balance between highly available marketing websites (www.example.com) that even legacy devices can access and highly secure services or applications (shop.example.com) that require standards compliance.

Cipher suites customization applies to any edge certificate used in connections to a given hostname. However, to enable custom cipher suites and other features, you must purchase the Advanced Certificate Manager add-on ↗.

If you already have Advanced Certificate Manager, use the API to set up custom cipher suites. Refer to Customize cipher suites for more guidance.

### Automate domain control validation (DCV)

If you want to use Cloudflare but manage DNS externally (partial setup), you may need to perform domain control validation (DCV) to prove that you have control over your domain before your SSL/TLS certificate can be issued.

To make this process easier and automate DCV at certificate renewal, use advanced certificates and set up delegated DCV.

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

## Universal SSL

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/)

Page options # Universal SSL

By default, Cloudflare issues — and renews — free, unshared, publicly trusted SSL certificates to all domains added to and activated on Cloudflare.

Universal certificates are Domain Validated (DV). For setup details, refer to Enable Universal SSL.

Note

If your website or application requires an SSL certificate prior to migrating traffic to Cloudflare, or if you need to customize cipher suites, refer to Advanced or Custom certificates.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Related resources

- Backup certificates
- Validity period and renewal

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

## Enable Universal SSL certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/)

Page options # Enable Universal SSL certificates

By default, Cloudflare issues — and renews — free, unshared, publicly trusted SSL certificates to all domains added to and activated on Cloudflare.

The process for activating a Universal SSL certificate depends on your domain's DNS setup.

## Full DNS setup

For domains on a full setup1, your domain should automatically receive its Universal SSL certificate within 15 minutes to 24 hours of domain activation2.

This certificate will cover your zone apex (example.com) and all first-level subdomains (subdomain.example.com), and is provisioned even if your records are DNS only. However, the certificate will only be presented if your domain or subdomains are proxied.

## Footnotes

1. The most common Cloudflare setup that involves changing your authoritative nameservers. ↩
2. Provisioning time depends on certain security checks and other requirements mandated by Certificate Authorities (CA). ↩

### Minimize downtime

If your website or application is already live and cannot be uncovered while the Universal certificate is provisioned, consider the following:

- Order an advanced certificate before proxying traffic to Cloudflare.
- Upload a custom certificate prior to migrating and then delete the certificate after your Universal certificate is active.
- Keep DNS records unproxied until your certificate is active.

Note

If your domain is using a partial setup, you will need to add Domain Control Validation (DCV) records to your authoritative DNS.

## Partial DNS setup

For non-authoritative or partial domains, Universal SSL will be:

- Provisioned once the DNS record is proxied through Cloudflare.
- Validated:

Immediately if you add Domain Control Validation (DCV) records to your authoritative DNS.
After a brief period of downtime if you do not add DCV records (once your traffic is proxied).
- Immediately if you add Domain Control Validation (DCV) records to your authoritative DNS.
- After a brief period of downtime if you do not add DCV records (once your traffic is proxied).

Unless you cover and validate multiple subdomains with an advanced certificate, you will need to proxy and validate new subdomains as they are added.

## Verify your certificate is active

Once you enable Universal SSL, you can review the activation status in the dashboard at SSL/TLS > Edge Certificates or via the API with a GET request.

## Universal SSL renewal

For Universal certificates, Cloudflare controls the validity periods and certificate authorities (CAs), making sure that renewal always occur.

Partial setup and DCV

If you are on a partial setup, make sure Domain control validation (DCV) is configured correctly. Refer to Troubleshooting DCV for further help.

Universal certificates have a 90-day validity period. The auto renewal period starts 30 days before expiration.

For details, refer to Validity periods and renewal.

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

## Disable Universal SSL certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/)

Page options # Disable Universal SSL certificates

Some customers may need to manage their own SSL certificates or rely on specific Certificate Authorities.

If you disable your domain's Universal SSL certificate, Cloudflare removes that certificate from our network and will not order or renew any additional Universal SSL certificates.

## Potential errors

To avoid errors with your domain, either upload a custom certificate or purchase Advanced Certificate Manager before disabling Universal SSL.

If you disable Universal SSL, you may experience errors with the following scenarios:

- Enabled features:

HTTP Strict Transport Security (HSTS)
Always Use HTTPS
Opportunistic Encryption
- HTTP Strict Transport Security (HSTS)
- Always Use HTTPS
- Opportunistic Encryption
- Other setups:

Page Rules that redirect traffic to HTTPS
HTTP to HTTPS redirects at your origin web server
- Page Rules that redirect traffic to HTTPS
- HTTP to HTTPS redirects at your origin web server

## Disable Universal SSL certificate

Before you disable Universal SSL/TLS, make sure you have uploaded a custom certificate or purchased Advanced Certificate Manager to protect your domain.

- Dashboard
- API

To disable Universal SSL in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your domain.
3. Go to SSL/TLS > Edge Certificates.
4. For Disable Universal SSL, select Disable Universal SSL.
5. Read the warnings in the Acknowledgement.
6. Select I Understand and select Confirm.

To disable Universal SSL with the Cloudflare API, send a PATCH request and include the "enabled": false parameter.

Note

Even with Universal SSL disabled, some features such as AMP Real URL and Signed Exchanges will still provision certificates for your domain.

## Re-enable Universal SSL

- Dashboard
- API

To re-enable Universal SSL in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your domain.
3. Go to SSL/TLS > Edge Certificates.
4. For Disable Universal SSL, select Enable Universal SSL.

To re-enable Universal SSL with the Cloudflare API, send a PATCH request and include the "enabled": true parameter.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/alerts/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/alerts/)

Page options # Alerts

You can configure alerts to receive notifications for changes in your certificates.

Universal SSL Alert

Who is it for? Customers with universal certificates who want to receive a notification on validation, issuance, and renewal of certificates.

Other options / filters None.

Included with All Cloudflare plans.

What should you do if you receive one? You only need to take action if you are notified that you have a certificate that failed. You can find the reasons why a certificate is not being issued in Troubleshooting SSL errors.

Refer to Cloudflare Notifications for more information on how to set up an alert.

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

## Limitations

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/)

Page options # Limitations

Universal SSL certificates present some limitations.

## Proxy status

Cloudflare can only serve an SSL/TLS certificate for a DNS record when you set the record's proxy status to Proxied. If you do not do this, the origin server your record points to will be responsible for supporting SSL/TLS connections.

## Hostname coverage

### Full setup

Universal SSL certificates only support SSL for the root or first-level subdomains such as example.com and www.example.com. To enable SSL support on second, third, and fourth-level subdomains such as dev.www.example.com or app3.dev.www.example.com, you can:

- Purchase Advanced Certificate Manager to order advanced certificates.
- Upgrade to a Business or Enterprise plan to upload custom certificates.

### CNAME setup

On a CNAME setup zone, each subdomain (regardless of level) has its own Universal SSL certificate and does not require additional features or purchases. As long as the subdomains are proxied to Cloudflare, a universal certificate will be provisioned.

## Certificate authority

For Universal SSL certificates, Cloudflare chooses the certificate authority (CA) used for your certificate.

Cloudflare can change the certificate authority without prior notification, and will not send any notification as the change happens.

If you want to choose the issuing certificate authority, order an advanced certificate.

## Validity period

For Universal certificates, Cloudflare controls the validity period. Refer to validity periods and renewal for details.

## TLS settings

Customizing cipher suites is only available with Advanced Certificate Manager or within Cloudflare for SaaS.

You can set up minimum TLS version at the zone level, but, for per-hostname settings, you must have Advanced Certificate Manager.

## Delegated DCV

Delegated DCV allows zones with partial DNS setups to delegate the DCV process to Cloudflare. DCV delegation will not work with Universal SSL certificates and requires the use of an advanced certificate.

## Spectrum

Universal SSL is not compatible with Cloudflare Spectrum. If you are trying to use Spectrum, use either an advanced certificate or a custom certificate.

## Load balancing

Due to internal limitations, Universal SSL certificates do not cover load balancing hostnames by default. This behavior will be corrected in the future.

## Browser support

For more on browser support, see Browser compatibility.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/troubleshooting/](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/troubleshooting/)

Page options # Troubleshooting

## Resolve a timed out state

If a certificate issuance times out, Cloudflare tells you where in the chain of issuance the timeout occurred: Initializing, Validation, Issuance, Deployment, or Deletion.

To resolve timeout issues, try one or more of the following options:

- Change the Proxy status of related DNS records to DNS only (gray-clouded) and wait at least a minute. Then, change the Proxy status back to Proxied (orange-clouded).
- Disable Universal SSL and wait at least a minute. Then, re-enable Universal SSL.
- Send a PATCH request to the validation endpoint using the same DCV method (API only). Make sure that the --data field is not empty in your request.
- Review your domain control validation (DCV). Changing the DCV method will restart certificate issuance.

## Delete certificates

You can use the API to delete certificates that you no longer want listed on the Cloudflare dashboard.

## Other issues

For additional troubleshooting help, refer to Troubleshooting SSL errors.

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

## Advanced certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/)

Page options # Advanced certificates

Use advanced certificates when you want something more customizable than Universal SSL but still want the convenience of SSL certificate issuance and renewal.

To order advanced certificates you must purchase the Advanced Certificate Manager add-on, which also includes other features.

## Advanced Certificate Manager

Advanced Certificate Manager allows you to:

- Order advanced certificates that can:

Include the zone apex and up to 50 hosts as covered hostnames.
Cover more than one level of subdomain.
Be issued by the certificate authority (CA) you choose.
Use your preferred validation method.
Have the validity period you choose.
- Include the zone apex and up to 50 hosts as covered hostnames.
- Cover more than one level of subdomain.
- Be issued by the certificate authority (CA) you choose.
- Use your preferred validation method.
- Have the validity period you choose.
- Use delegated DCV to delegate the DCV process of your partial zones to Cloudflare.
- Enable Total TLS to automatically protect proxied hostnames.
- Select a custom trust store for origin authentication.
- Control cipher suites and per-hostname minimum TLS version.

Note

Enterprise customers can also purchase a subscription for Advanced Certificate Manager, which allows them to add up to 100 edge certificates per zone.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Paid add-on | Paid add-on | Paid add-on | Paid add-on |

Note

Enterprise customers can preview this product as a non-contract service, which provides full access, free of metered usage fees, limits, and certain other restrictions.

## Limitations

Advanced certificates are not used with Cloudflare Pages nor R2 due to certificate prioritization. Both Pages and R2 custom domains use Cloudflare for SaaS certificates.

Advanced certificates are Domain Validated (DV). If your organization needs Organization Validated (OV) or Extended Validation (EV) certificates, refer to Custom certificates.

## Related resources

- Manage advanced certificates
- API commands

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

## Manage advanced certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/manage-certificates/](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/manage-certificates/)

Page options # Manage advanced certificates

## Create a certificate

If you are using an existing Universal SSL certificate, Cloudflare will automatically replace this certificate once you finish ordering your advanced certificate.

Once you order a certificate, you can review the certificate's status in the dashboard at SSL/TLS > Edge Certificates or via the API with a GET request.

- Dashboard
- API

To create a new advanced certificate in the dashboard:

1. Log in to your Cloudflare account and select a domain.
2. Go to SSL/TLS > Edge Certificates.
3. Select Order Advanced Certificate.
4. If Cloudflare does not have your billing information, you will need to enter that information.
5. Enter the following information:

Certificate authority
Certificate hostnames

For hostnames longer than 64 characters, use the API.


Validation method
Certificate validity period
6. Certificate authority
7. Certificate hostnames

For hostnames longer than 64 characters, use the API.
8. For hostnames longer than 64 characters, use the API.
9. Validation method
10. Certificate validity period
11. Select Save.

To create a new certificate using the API, send a POST request to the Cloudflare API.

If you need certificates for hostnames longer than 64 characters (RFC 5280 ↗), set the cloudflare_branding option to true. This will add sni.cloudflaressl.com in the Common Name (CN) field and will include the long hostname as a part of the Subject Alternative Name (SAN).

Warning

The available options for Validation method and Certificate Validity Period may vary depending on the certificate authority you choose and the hostnames that you include in your Advanced certificate order.

## Delete a certificate

- Dashboard
- API

To delete an advanced certificate in the dashboard:

1. Log in to your Cloudflare account and select a domain.
2. Select SSL/TLS > Edge Certificates.
3. Select a certificate.
4. Select Delete Certificate.

To delete a certificate using the API, send a DELETE request to the Cloudflare API.

## Restart validation

To restart validation for a certificate in a validation_timed_out status, send a PATCH request to the API.

## Restrict cipher suites

Cipher suites are a combination of ciphers used to negotiate security settings during the SSL/TLS handshake ↗ (and therefore separate from the SSL/TLS protocol).

For more details, refer to Customize cipher suites.

## Perform domain control validation (DCV)

Before a certificate authority (CA) will issue a certificate for a domain, the requester must prove they have control over that domain. This process is known as domain control validation (DCV).

Normally, you only need to update DCV if you have your application on a partial setup (Cloudflare does not run your authoritative nameservers).

For more information about DCV, refer to DCV methods.

## Set up alerts

You can configure alerts to receive notifications for changes in your certificates.

Advanced Certificate Alert

Who is it for? Customers with advanced certificates that want to be alerted on validation, issuance, renewal, and expiration of certificates.

Other options / filters None.

Included with When an advanced certificate is validated, issued, renewed, or expired.

What should you do if you receive one? Action only needed if notification is about a certificate that failed to be issued. Refer to SSL expired or SSL mismatch errors for more information.

Refer to Cloudflare Notifications for more information on how to set up an alert.

## Advanced certificate renewal

The certificate validity period you choose determines when the auto renewal will start for your certificate. For details, refer to Validity period and renewal.

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

## API commands

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/api-commands/](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/api-commands/)

Page options # API commands

Use the following API commands to manage advanced certificates. If you are using our API for the first time, review our API documentation.

| Command | Method | Endpoint | Additional notes |
| --- | --- | --- | --- |
| Order advanced certificate | POST | zones/<<ZONE_ID>>/ssl/certificate_packs/order |  |
| Restart certificate validation | PATCH | zones/<<ZONE_ID>>/ssl/certificate_packs/<<ID>> | For a Certificate Pack in a validation_timed_out status. |
| Delete certificate pack | DELETE | zones/<<ZONE_ID>>/ssl/certificate_packs/<<ID>> |  |
| List certificate packs in a zone | GET | zones/<<ZONE_ID>>/ssl/certificate_packs?status=all | This API call returns all certificate packs for a domain (Universal, Custom, and Advanced). |
| List Cipher Suite settings: Get zone setting with ciphers as the setting name in the URI path | GET | zones/<<ZONE_ID>>/settings/ciphers |  |
| Change Cipher Suite settings: Edit zone setting with ciphers as the setting name in the URI path | PATCH | zones/<<ZONE_ID>>/settings/ciphers | To restore default settings, send a blank array in the value parameter. |

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

## Custom certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/)

Page options # Custom certificates

Custom certificates are meant for Business and Enterprise customers who want to use their own SSL certificates.

Unlike Universal SSL or advanced certificates, Cloudflare does not manage issuance and renewal for custom certificates.
When you use custom certificates, the following actions should be considered and accomplished by you:

- Upload the certificate.
- Update the certificate.
- Observe the certificate expiration date to avoid downtime.

Note

If your custom certificate does not cover all of your first-level hostnames, you can enable Universal SSL certificate to cover them.

If your custom certificate is from a certificate authority that Cloudflare partners with, consider switching to a Cloudflare-managed certificate to benefit from automatic issuance and renewal.

## Certificate packs

Before deploying custom certificates to Cloudflare's global network, Cloudflare automatically groups the certificates into certificate packs.

A certificate pack is a group of certificates that share the same set of hostnames — for example, example.com and *.example.com — but use different signature algorithms.

Each pack can include up to three certificates, one from each of the following signature algorithms:

- SHA-2/RSA
- SHA-2/ECDSA
- SHA-1/RSA

Each pack only counts as one SSL certificate against your custom certificate quota.

Note

You cannot delete the primary certificate if secondary certificates are present in the pack.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | No | Yes | Yes |
| Certificates included | 0 | 0 | 1 Modern and 1 Legacy | 1 Modern (can purchase more) and 1 Legacy (can purchase more) |

## Related features

### Certificate Signing Requests (CSRs)

As part of the custom certificate process, you can leverage Cloudflare to generate your Certificate Signing Request (CSR). This additional option means that Cloudflare will safely generate and store the private key associated with the CSR.

### Geo Key Manager (private key restriction)

By default, Cloudflare encrypts and securely distributes private keys to all Cloudflare data centers, where they can be used for local SSL/TLS termination. If you want to restrict where your private keys may be used, use Geo Key Manager.

### Keyless SSL

If you want to upload a custom certificate but retain your private key on your own infrastructure, consider using Keyless SSL.

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

## Manage custom certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/uploading/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/uploading/)

Page options # Manage custom certificates

This page lists Cloudflare requirements for custom certificates and explains how to upload and update these certificates using Cloudflare dashboard or API.

## Certificate requirements

Before accepting custom certificates, Cloudflare parses them and checks for validity according to a list of requirements.

Full list of requirements

Each custom certificate you upload must:

- Be encoded in PEM format (PEM, PKCS#7, or PKCS#12). See Converting Using OpenSSL ↗ for conversion examples.
- Not have a key file password.
- Not be expiring in less than 14 days from time of upload.
- Have a subject alternative name (SAN) matching at least one hostname in the zone where it is being uploaded.
- Use a private key greater than or equal to a minimum length. Currently, 2048 bit for RSA and 225 bit for ECDSA.
- Be publicly trusted by a major browser. This does not apply for certificates that specify User Defined as their bundling methodology.
- Be one of the following certificate types:

Unified Communications Certificates (UCC)
Extended Validation (EV)
Domain Validated (DV)
Organization Validated (OV)
- Unified Communications Certificates (UCC)
- Extended Validation (EV)
- Domain Validated (DV)
- Organization Validated (OV)

## Upload a custom certificate

Warning

When using compatible or modern bundling, make sure to upload only the leaf certificate. This will allow Cloudflare to properly handle the expiration of intermediate and root certificates.

- Dashboard
- API

To upload a custom SSL certificate in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your application.
3. Go to SSL/TLS.
4. In Edge Certificates, select Upload Custom SSL Certificate.
5. Copy and paste relevant values into SSL Certificate and Private key text areas (or select Paste from file).
NoteIf doing this manually, include the ---BEGIN CERTIFICATE--- and ---END CERTIFICATE--- like the placeholder text.
6. Choose the appropriate Bundle Method.
7. Select a value for Private Key Restriction.
8. Select a value for Legacy Client Support, which specifies Server Name Indication (SNI) support:


Modern (recommended): SNI only


Legacy: Supports non-SNI
WarningCustom certificates of the type legacy_custom are not compatible with BYOIP.
9. Modern (recommended): SNI only
10. Legacy: Supports non-SNI
WarningCustom certificates of the type legacy_custom are not compatible with BYOIP.
11. Select Upload Custom Certificate. If you see an error for The key you provided does not match the certificate, contact your Certificate Authority to ensure the private key matches the certificate.
12. (optional) Add a CAA DNS record.

The following call will upload a certificate for use with app.example.com. Cloudflare will automatically bundle the certificate with a certificate chain optimized for maximum compatibility with browsers.

Warning

Note that if you are using an ECC key generated by OpenSSL, you will need to first remove the -----BEGIN EC PARAMETERS-----...-----END EC PARAMETERS----- section of the file.

1. Update the file and build the payload

Terminal window ```
cat app_example_com.pem
```

```
-----BEGIN CERTIFICATE-----MIIFJDCCBAygAwIBAgIQD0ifmj/Yi5NP/2gdUySbfzANBgkqhkiG9w0BAQsFADBNMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMScwJQYDVQQDEx5E...SzSHfXp5lnu/3V08I72q1QNzOCgY1XeL4GKVcj4or6cT6tX6oJH7ePPmfrBfqI/OOeH8gMJ+FuwtXYEPa4hBf38M5eU5xWG7-----END CERTIFICATE-----
```

Terminal window ```
MYCERT="$(cat app_example_com.pem|perl -pe 's/\r?\n/\\n/'|sed -e 's/..$//')"MYKEY="$(cat app_example_com.key|perl -pe 's/\r?\n/\\n/'|sed -e's/..$//')"
```

With the certificate and key saved to environment variables (using escaped newlines), build the payload:

Terminal window ```
request_body=$(< <(cat <<EOF{  "certificate": "$MYCERT",  "private_key": "$MYKEY",  "bundle_method": "ubiquitous"}EOF))
```

You can optionally add geographic restrictions ↗ that specify where your private key can physically be decrypted:

Terminal window ```
request_body=$(< <(cat <<EOF{  "certificate": "$MYCERT",  "private_key": "$MYKEY",  "bundle_method": "ubiquitous",  "geo_restrictions": {"label": "us"}'}EOF))
```

You can also enable support for legacy clients which do not include SNI in the TLS handshake.

Terminal window ```
request_body=$(< <(cat <<EOF{  "certificate": "$MYCERT",  "private_key": "$MYKEY",  "bundle_method": "ubiquitous",  "geo_restrictions": {"label": "us"}',  "type":"sni_custom"}EOF))
```

sni_custom is recommended by Cloudflare. Use legacy_custom when a specific client requires non-SNI support. The Cloudflare API treats all Custom SSL certificates as Legacy by default.

Warning

Custom certificates of the type legacy_custom are not compatible with BYOIP.

1. Upload your certificate and key

Use the POST endpoint to upload your certificate and key.

Terminal window ```
curl https://api.cloudflare.com/client/v4/zones/{zone_id}/custom_certificates \--header "X-Auth-Email: <EMAIL>" \--header "X-Auth-Key: <API_KEY>" \--header "Content-Type: application/json" \--data "$request_body"
```

1. (Optional) Add a CAA record.

A Certificate Authority Authorization (CAA) DNS record specifies which certificate authorities (CAs) are allowed to issue certificates for a domain. This record reduces the chance of unauthorized certificate issuance and promotes standardization across your organization.

For more guidance, refer to Create a CAA record.

## Update an existing custom certificate

Before you update an existing custom certificate, you might want to consider having active universal or advanced certificates as fallback options. Go to SSL/TLS > Edge Certificates ↗ to check a list of hostnames and status of the edge certificates in your zone.

If you are on an Enterprise plan and want to update a custom (modern) certificate, also consider requesting access to Staging environment (Beta).

Replacing a custom certificate following these steps does not lead to any downtime. No connections will be terminated and new connections will use the new certificate. The old certificate will only actually be deleted when the new certificate is uploaded and active.

- Dashboard
- API

To update a certificate in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your application.
3. Go to SSL/TLS.
4. In Edge Certificates, locate a custom certificate.
5. Select the wrench icon and select Replace SSL certificate and key.
6. Follow the same steps as upload a new certificate.

To update a certificate using the API, send a PATCH command.

Note

To update the Private Key Restriction setting of a certificate, delete and re-add the certificate.

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

## Renewal and expiration

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/renewing/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/renewing/)

Page options # Renewal and expiration

## Renew custom certificates

Since Cloudflare cannot renew uploaded certificates, you should ensure that you replace or update an expiring custom certificate before it expires, otherwise your visitors may not be able to connect.

Cloudflare automatically sends email notifications 30 and 14 days before your custom certificate expires. The email is sent to users who have the SSL/TLS, Administrator, or Super Administrator roles.

Note

When renewing a custom certificate, you can reuse a previously generated CSR.

If you are on an Enterprise plan and want to renew a custom (modern) certificate, consider requesting access to Staging environment (Beta).

## Expired certificates

If a valid replacement - covering some or all of the SANs in the expiring custom certificate - is already available, Cloudflare will remove the expiring custom certificate in the 24 hours before expiration. There is no expected downtime due to certificate transition.

If no valid replacement is available, Cloudflare will remove the custom certificate after it expires.

Affected domains and subdomains will fall back to any other active certificate covering the hostnames on the expiring certificate.

Warning

All certificates in a certificate pack are treated as one object.
The expiration date of a certificate pack is equivalent to the soonest Not After date among the certificates in the pack.

For example if you have a custom certificate made of an ECSDA and a RSA certificate, if one of them expires the whole pack will be removed.

## Migrate to other certificate types

If you no longer want to use your custom certificate but still want your website or application to be covered with SSL/TLS, you can do the following:

1. Go to SSL/TLS > Edge Certificates ↗.
2. Make sure there is already an active universal or advanced certificate covering the same hostnames.
3. Delete your custom certificate.

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

## Bundle methodologies

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/bundling-methodologies/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/bundling-methodologies/)

Page options # Bundle methodologies

When an SSL certificate is deployed to Cloudflare's global network, it may be augmented with intermediate and root certificates to assist the user agent in finding a chain to a publicly trusted root.

You can control the mechanics of how certificates are bundled by specifying a bundling methodology.

## Intermediate and root certificates

Cloudflare maintains intermediate and root certificates used for bundling on a GitHub repository ↗. As the certificates expire or are removed by certificate authorities, Cloudflare removes and adds them accordingly.

Expiration values for these certificates may appear in the expires_on field when you use the Analyze Certificate endpoint - often when the methodology you specify is Compatible. However, these expiration values reflect intermediate and root certificates - which are handled by Cloudflare -, not the leaf certificate you would have previously uploaded to Cloudflare.

## Methodologies

### Compatible

Compatible is the default methodology and uses common and well distributed intermediate certificates to complete the chain. This ensures that the resulting bundle is compatible with as many clients as possible.
The related value for the bundle_method parameter when using the API is ubiquitous.

### Modern

Modern consists of attempts to make the chain as efficient as possible, often by using newer or fewer intermediate certificates.
The related value for the bundle_method parameter when using the API is optimal.

### User-defined

User-defined allows you to paste your own certificate chain and present that bundle to clients. You must specify any intermediates you wish to use, followed by the leaf. If you are using a self-signed certificate (not recommended), you must use this mode.
The related value for the bundle_method parameter when using the API is force.

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

## Remove key file password

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/remove-file-key-password/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/remove-file-key-password/)

Page options # Remove key file password

You cannot upload a custom certificate with a password-protected key file.

The process for removing the password depends on your operating system. The following examples remove the password from example.com.key.

Linux

1. Open a command console.
2. Go to the directory containing the example.com.key file.
3. Copy the original key.
Terminal windowcp example.com.key temp.key
4. Run the following command (if using an ECDSA certificate, replace rsa with ec).
Terminal windowopenssl rsa -in temp.key -out example.com.key
5. When prompted in the console window, enter the original key password.
6. Upload the file contents to Cloudflare.

Windows

1. Go to https://indy.fulgan.com/SSL/ ↗ and download the latest version of OpenSSL for your x86 or x86_64 operating system.
2. Open the .zip file and extract it.
3. Select openssl.exe.
4. In the command window that appears, run:
Terminal windowrsa -in C:\Path\To\example.com.key -out key.pem
5. Enter the original key password when prompted by the openssl.exe command window.
6. Upload the contents of the key.pem file to Cloudflare.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/troubleshooting/](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/troubleshooting/)

Page options # Troubleshooting

## Generic troubleshooting

### Make sure your key and certificate match

You can use an external tool such as the SSLShopper Certificate Key Matcher ↗ to check your certificate and make sure the key matches.

### Check the certificate details

You can use openssl to check all the details of your certificate:

Terminal window ```
openssl x509 -in certificate.crt -noout -text
```

Then, make sure all the information is correct before uploading.

## Moved domains

If you move a domain without deleting the custom certificate from the previous zone, the certificate may still take precedence and be presented to your visitors, until the previous zone is deleted.

Refer to Move a domain between Cloudflare accounts for details.

## Let's Encrypt chain update

As Let's Encrypt - one of the certificate authorities (CAs) used by Cloudflare - has announced changes in its chain of trust, you may face issues.

If you are using a Let's Encrypt certificate uploaded by yourself as a custom certificate, consider the following:

- If you use compatible or modern bundle method and have uploaded your certificate before September 9, 2024, update your custom certificate so that it can be bundled with the new chain.
- If you use user-defined bundle method, make sure that your certificates uploaded after September 30, 2024, do not use the Let's Encrypt cross-signed chain.

## Error codes

### Invalid certificate. (Code: 1002)

Root cause

The certificate you are trying to upload is invalid. For example, there might be extra lines, or the BEGIN/END text is not correct, or extra characters are added following a copy/paste.

Solution

Carefully check the content of the certificate. You may use openssl to check all the details of your certificate:

Terminal window ```
openssl x509 -in certificate.crt -noout -text
```

### You have reached the maximum number of custom certificates. (Code: 1212)

Root cause

You have used up your custom certificate quota.

Solution

Delete some existing certificates to add a new one. If you are an Enterprise customer, you can contact your account team to acquire more custom certificates.

### This certificate has already been submitted. (Code: 1220)

Root cause

You are trying to upload a custom certificate that you have already uploaded.

Solution

Delete the existing one and try again.

### The SSL attribute is invalid. Please refer to the API documentation, check your input and try again. (Code: 1434)

Root cause

You are trying to upload a custom certificate that does not support any cipher that is needed by Chromium-based browsers.

Solution

Modify the certificate so that it supports chromium-supported ciphers and try again.

### You have reached your quota for the requested resource. (Code: 2005)

Root cause

The quota for custom certificates depends on the type of certificate (Custom Legacy vs Custom Modern).

If you try to upload a certificate type but have already reached your quota, you will receive this error.

Solution

First, check your custom certificate entitlements at SSL/TLS > Edge Certificates.

Then, when actually uploading or editing the certificate, make sure you select the appropriate option for Legacy Client Support.

### The certificate chain you uploaded cannot be bundled using Cloudflare's trust store. Please check your input and try again. (Code: 2100)

Root cause

You are trying to upload a custom certificate that contains the root and leaf certificate at the same time.

Solution

Upload the leaf certificate only.

### The certificate chain you uploaded has no leaf certificates. Please check your input and try again. (Code: 2101)

Root cause

You are trying to upload a root + intermediate + intermediate .crt file, but the actual leaf certificate is in a separate file.

Solution

Add the leaf to the .crt file, or just use the leaf by itself since the Certificate Authority has a public chain of trust in our trust store.

### The certificate chain you uploaded does not include any hostnames from your zone. Please check your input and try again. (Code: 2103)

Root cause

Cloudflare verifies that uploaded custom certificates include a hostname for the associated zone. Moreover, this hostname must be included as a Subject Alternative Name (SAN). This is following the standard set by the CA/Browser Forum ↗.

Solution

Make sure your certificate contains a Subject Alternative Name (SAN) specifying a hostname in your zone. You can use the openssl command below and look for Subject Alternative Name in the output.

Terminal window ```
openssl x509 -in certificateFile.pem -noout -text
```

If it does not exist, you will need to request a new certificate.

### The private key you uploaded is invalid. Please check your input and try again. (Code: 2106)

Root cause

Cloudflare requires separate, pem-encoded files for the SSL private key and certificate.

Solution

Contact your Certificate Authority (CA) to confirm whether your current certificate meets this requirement or request your CA to assist with certificate format conversion.

Make sure your certificate complies with these requirements.

Check that the certificate and private keys match before uploading the certificate in the Cloudflare dashboard. This external resource ↗ might help.

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

## Enforce HTTPS connections

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/encrypt-visitor-traffic/](https://developers.cloudflare.com/ssl/edge-certificates/encrypt-visitor-traffic/)

Page options # Enforce HTTPS connections

Even with an active SSL/TLS certificate, visitors can still access resources over unsecured HTTP connections.

It is best to redirect this traffic over HTTPS, as well as ensure other resources (such as images) are also loaded over HTTPS.

## Prerequisites

Before trying to enforce HTTPS connections, make sure that your application has an active edge certificate. Otherwise, visitors will not be able to access your application at all.

Also, make sure that your SSL encryption mode is not set to Off. Otherwise, Cloudflare will redirect all visitor connections automatically to HTTP.

## 1. Evaluate existing redirects

To make sure that your visitors do not get stuck in a redirect loop, evaluate existing redirects at your origin server and within the Cloudflare dashboard.

You should generally avoid redirects at your origin server. Not only are you likely to forget about them, but they also reduce application performance. It is much faster for Cloudflare to redirect requests before they ever reach your origin.

Make sure that your redirects within Cloudflare are not forwarding traffic to URLs starting with http.

## 2. Rewrite HTTP URLs

If your application contains links or references to HTTP URLs, your visitors might see mixed content errors when accessing an HTTPS page.

To avoid these issues, enable Automatic HTTPS Rewrites and pay attention to which HTTP requests are still reaching your origin server.

## 3. Redirect traffic to HTTPS

If your entire application can support HTTPS traffic, enable Always Use HTTPS.

If only some parts of your application can support HTTPS traffic, do not enable Always Use HTTPS and use a single redirect to selectively perform the redirect to HTTPS. Refer to Redirect admin area requests to HTTPS for an example.

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

## Domain control validation (DCV)

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/)

Page options # Domain control validation (DCV)

Before a certificate authority (CA) will issue a certificate for a domain, the requester must prove they have control over that domain. This process is known as domain control validation (DCV).

Note

Refer to Domain control validation flow to learn more about the steps and parties involved in the DCV process.

For custom certificates, DCV will always be handled by you, when you request the certificate from the CA.

For certificates issued through Cloudflare, this process may be done automatically or it may require you to take action, as described in the following sections.

## Full DNS setup - no action required

If your domain is on a full setup — meaning that Cloudflare runs your authoritative nameservers — Cloudflare handles DCV automatically on your behalf using a TXT record. For more details, refer to Enable Universal SSL.

## Partial DNS setup - action sometimes required

If your application is on a partial DNS setup — meaning that Cloudflare does not run your authoritative nameservers — you may need to perform additional steps to complete DCV.

### Non-wildcard certificates

If every hostname on a non-wildcard certificate is proxying traffic through Cloudflare, Cloudflare can automatically complete DCV on your behalf.

This applies to customers using Universal or Advanced certificates.

If one of the hostnames on the certificate is not proxying traffic through Cloudflare, certificate issuance and renewal will vary based on the type of certificate you are using:

- Universal: Perform DCV using one of the available methods.
- Advanced: In most cases, you can opt for Delegated DCV, which greatly simplifies certificate management.

### Wildcard certificates

For wildcard hostname certificates, certificate issuance and renewal varies based on the type of certificate you are using:

- Universal: Perform DCV using TXT validation method.
- Advanced: In most cases, you can opt for Delegated DCV, which greatly simplifies certificate management.

If you cannot use Delegated DCV, you need to use TXT based DCV for certificate issuance and renewal. This means you will need to place one TXT DCV token for every hostname on the certificate. If one or more of the hostnames on the certificate fails to validate, the certificate will not be issued or renewed.

This means that a wildcard certificate covering example.com and *.example.com will require two DCV tokens to be placed at the authoritative DNS provider. Similarly, a certificate with five hostnames in the SAN (including a wildcard) will require five DCV tokens to be placed at the authoritative DNS provider.

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

## Methods

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/)

Page options # Methods

Before a certificate authority (CA) will issue a certificate for a domain, the requester must prove they have control over that domain. This process is known as domain control validation (DCV).

## Perform DCV

For details on each method available for DCV, refer to the following resources:

- Delegated
- TXT
- HTTP

Note

For guidance on when you need to perform DCV, refer to Domain Control Validation.

## Verify DCV status

To verify the DCV status of a certificate, either monitor the certificate's status in the dashboard at SSL/TLS > Edge Certificates or use the Verification Status endpoint.

A status of active means that the certificate has been deployed to Cloudflare’s global network and will be served as soon as HTTP traffic is proxied to Cloudflare.

## Update DCV methods

You cannot update the DCV method for an active certificate. To update the DCV method for a subdomain, wait until the DCV expires and then change the DCV method.

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

## Delegated

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/delegated-dcv/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/delegated-dcv/)

Page options # Delegated

Delegated DCV allows zones with partial DNS setups - meaning authoritative DNS is not provided by Cloudflare - to delegate the DCV process to Cloudflare.

DCV Delegation requires you to place a one-time record that allows Cloudflare to auto-renew all future certificate orders, so that there’s no manual intervention at the time of the renewal.

Note

DCV Delegation will not work with Universal Certificates and requires the use of an Advanced certificate.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager |

## When to use

You should use Delegated DCV when all of the following conditions are true:

- Your zone is using a partial DNS setup.
- Cloudflare is not already performing DCV automatically.
- Your zone is using an Advanced certificate.
- Your zone is not using multiple CDN providers.
- The Certificate Authority is either Google Trust Services, SSL.com, or Let's Encrypt

Delegated DCV and origin certificates

As explained in the announcement blog post ↗, currently, you can only delegate DCV to one provider at a time. If you also issue publicly trusted certificates for the same hostname for your origin server, this will no longer be possible. You can use Cloudflare origin CA certificates instead.

## Setup

To set up Delegated DCV:

1. Order an advanced certificate for your zone, choosing TXT as the Certificate validation method.
2. On SSL/TLS > Edge Certificates, go to DCV Delegation for Partial Zones.
3. Copy the Cloudflare validation URL.
4. At your authoritative DNS provider, create CNAME record(s) considering the following:

- If your certificate only covers the apex domain and a wildcard, you only need to create a single CNAME record for your apex domain. Any direct subdomains will be covered as well.

```
_acme-challenge.example.com CNAME example.com.<COPIED_VALIDATION_URL>.
```

- If your certificate also covers subdomains specified by their name, you will need to add multiple CNAME records to your authoritative DNS provider, one for each specific subdomain.

For example, a certificate covering example.com, *.example.com, and sub.example.com would require the following records.

```
_acme-challenge.example.com CNAME example.com.<COPIED_VALIDATION_URL>._acme-challenge.sub.example.com CNAME sub.example.com.<COPIED_VALIDATION_URL>.
```

Remove previous TXT records

Existing TXT records for _acme-challenge will conflict with the delegated DCV CNAME record. Make sure to check and remove records such as the following:

```
_acme-challenge.example.com TXT <CERTIFICATE_VALIDATION_VALUE>
```

Once the CNAME records are in place, Cloudflare will add TXT DCV tokens for every hostname on the Advanced certificate that has a DCV delegation record in place, as long as the zone is active on Cloudflare.

Because DCV happens regularly, do not remove the CNAME record(s) at your authoritative DNS provider. Otherwise, Cloudflare will not be able to perform DCV on your behalf and your certificate will not be issued.

## Further details

### Testing

If you use a dig command to test, you should only be able see the placed tokens if the certificate is up for issuance.

This is because Cloudflare places the tokens when needed and then cleans them up.

Terminal window ```
dig TXT +noadditional +noquestion +nocomments +nocmd +nostats _acme-challenge.example.com. @1.1.1.1
_acme-challenge.example.com. 3600    IN    CNAME    example.com.<COPIED_VALIDATION_URL>
```

### Renewal

Currently, at certificate renewal, Cloudflare attempts to automatically perform DCV via HTTP if your certificate matches certain criteria:

- Hostnames are proxied.
- Hostnames on the certificate resolve to the IPs assigned to the zone.
- The certificate does not contain wildcards.

Note that settings that interfere with the validation URLs can cause issues in this case. Refer to Troubleshooting for guidance.

Note

If a hostname becomes unreachable during certificate renewal time, the certificate will not be able to be renewed automatically via Delegated DCV. Should you need to renew a certificate for a hostname that is not resolving currently, you can send a PATCH request to the changing DCV method API endpoint and change the method to TXT to proceed with manual renewal per the TXT DCV method.

Once the hostname becomes resolvable again, Delegated DCV will resume working as expected.

### Moved domains

If you move your zone to another account, you will need to update the CNAME record at your authoritative DNS provider with a new validation URL.

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

## TXT

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/txt/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/txt/)

Page options # TXT

TXT record validation requires the creation of a TXT record in the hostname's authoritative DNS.

## When to use

Generally, you need to perform TXT-based DCV when your certificate requires DCV and you cannot perform Delegated DCV.

## Setup

### Specify DCV method

If you want to use a Universal SSL certificate, you will need to edit the validation_method via the API and specify your chosen validation method.

Alternatively, you could order an advanced certificate via the dashboard or the API.

### Get DCV values

Once you create a new certificate and choose the validation method of TXT, your tokens will be ready after a few seconds.

These tokens can be fetched through the API or the dashboard when the certificates are in a pending validation state during custom hostname creation or during certificate renewals.

- API
- Dashboard

You can access these tokens using the API with the GET request and including status=pending_validation as a request parameter.

For example, here are two tokens highlighted in the API response for a wildcard certificate.

Response ```
{  "result": [    {      "id": "<CERTIFICATE_ID>",      "type": "advanced",      "hosts": ["*.<DOMAIN>.com", "<DOMAIN>.com"],      "primary_certificate": "0",      "status": "pending_validation",      "certificates": [],      "created_on": "2022-10-12T21:46:21.979150Z",      "validity_days": 90,      "validation_method": "txt",      "validation_records": [        {          "status": "pending",          "txt_name": "_acme-challenge.<DOMAIN>.com",          "txt_value": "lXLOcN6cPv0nproViNcUHcahD9TrIPlNgdwesj0pYpk"        },        {          "status": "pending",          "txt_name": "_acme-challenge.<DOMAIN>.com",          "txt_value": "O0o8VgJu_OGu-T30_cvT-4xO5ZX1_2WsVNUrpUKE6ns"        }      ],      "certificate_authority": "google"    }  ]}
```

1. Log in to the Cloudflare dashboard ↗.
2. Choose your account and domain.
3. Go to SSL/TLS > Edge Certificates.
4. Select a certificate.
5. Copy the values for Certificate validation TXT name and Certificate validation TXT value.

If you had created a wildcard certificate, you would need to copy the values for two different validation TXT records.

### Update DNS records

At your authoritative DNS provider, create a TXT record named the txt_name and containing the txt_value.

Repeat this process for all the DCV records returned in the validation_records field to your Authoritative DNS provider.

If one or more of the hostnames on the certificate fail to validate, the certificate will not be issued or renewed.

This means that a wildcard certificate covering example.com and *.example.com will require two DCV tokens to be placed at the authoritative DNS provider. Similarly, a certificate with five hostnames in the SAN (including a wildcard) will require five DCV tokens to be placed at the authoritative DNS provider.

### Complete DCV

Once you update your DNS records, you can either wait for the next retry or request an immediate recheck.

To request an immediate recheck, send another PATCH request with the same validation_method as your current validation method.

TXT records used for DCV can be removed from your authoritative DNS provider as soon as the certificate is issued.

## Renewal

Even if you manually handle DCV when issuing certificates in a partial DNS setup, at certificate renewal, Cloudflare will attempt to automatically perform DCV via HTTP.

If all of the following conditions are confirmed at the first attempt, the renewal happens automatically via HTTP.

- Hostnames are proxied.
- Hostnames on the certificate resolve to the IPs assigned to the zone.
- The certificate does not contain wildcards.

Note

To automatically renew certificates that do not meet the referred criteria, consider using Delegated DCV.

If any one of the conditions is not met, the certificate renewal falls back to your chosen method and you will need to repeat the DCV process manually.

Cloudflare generates renewal tokens 30 days before certificate expiration.

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

## HTTP

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/http/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/methods/http/)

Page options # HTTP

When you choose HTTP DCV, Cloudflare automatically adds a verification HTTP token to your domain.

Only use this method if your domain can tolerate a few minutes of downtime.

Note

If you encounter issues with HTTP DCV, refer to the troubleshooting guide.

## Limitations

HTTP DCV is only available for proxied domains. It is possible to manually add the DCV token to the .well-known/pki-validation/ directory on your origin web server to pre-validate your certificates.

HTTP DCV validation does not work for wildcard certificates. If you want to use wildcard certificates, use TXT validation.

Based on your chosen certificate authority (CA), you may also not be able to use HTTP verification with advanced certificates.

## Setup

### Specify DCV method

If you want to use a Universal SSL certificate, you will need to edit the validation_method via the API and specify your chosen validation method.

Alternatively, you could order an advanced certificate via the API.

In either case, you would need to set a "validation_method":"http" parameter.

### Review other Cloudflare settings

To make sure your domain does not accidentally block HTTP DCV, review your Cloudflare settings for common setup issues.

### Complete DCV

Your HTTP token will be available for the certificate authority as soon as you finish your partial domain setup.

This means that you need to add a CNAME record to Cloudflare in your authoritative DNS and create proxied DNS records for your hostname within Cloudflare.

This process may involve a few minutes of downtime.

What happens after you create your records

Cloudflare contacts one of our certificate authority (CA) providers and asks them to issue certificates for the specified hostname. The CA will then inform Cloudflare that we need to demonstrate control of this hostname by returning a $DCV_TOKEN at a specified $DCV_FILENAME; both the token and the filename are randomly generated by the CA and not known to Cloudflare ahead of time.

For example, if you create a new custom hostname for site.example.com, the CA might ask us to return the value ca3-38734555d85e4421beb4a3e6d1645fe6 for a request to http://site.example.com/.well-known/pki-validation/ca3-39f423f095be4983922ca0365308612d.txt". As soon as we receive that value from the CA we make it accessible at our edge and ask the CA to confirm it is there so that they can complete validation and the certificate order.

To check whether your certificates have been validated and reissued:

- Dashboard: Find the certificate(s) SSL/TLS > Edge Certificates and make sure that the Status is Active.
- API: Send a GET request and confirm that your certificate(s) have "status": "active".

## Renewal

Even if you manually handle DCV when issuing certificates in a partial DNS setup, at certificate renewal, Cloudflare will attempt to automatically perform DCV via HTTP.

If all of the following conditions are confirmed at the first attempt, the renewal happens automatically via HTTP.

- Hostnames are proxied.
- Hostnames on the certificate resolve to the IPs assigned to the zone.
- The certificate does not contain wildcards.

Note

To automatically renew certificates that do not meet the referred criteria, consider using Delegated DCV.

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

## Validation backoff schedule

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/validation-backoff-schedule/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/validation-backoff-schedule/)

Page options # Validation backoff schedule

Domain control validation (DCV) has to happen before a certificate authority (CA) will issue a certificate for a domain. If DCV fails during issuance or renewal, Cloudflare automatically retries it on a schedule.

If you use Delegated DCV or if Cloudflare automatically performs DCV for you, this page is only informational. If you have to manually perform DCV, consider the following sections about the validation schedule and remember that DCV tokens have a fixed validity period.

Note

You can also request an immediate recheck by using the Edit SSL Certificate Pack Validation Method endpoint, specifying the same validation_method as the method you currently use.

## DCV tokens validity

The DCV process relies on tokens that are generated by the issuing certificate authority. These tokens have a validity period defined by each CA:

- Google Trust Services - 14 days
- Let's Encrypt - 7 days
- SSL.com - 14 days

After this period, DCV tokens expire as dictated by the CA/B Baseline Requirements ↗, and new, valid tokens must be placed.

Warning

Tokens may also become invalid upon validation failure. For more details, refer to Domain control validation flow.

## Successive checks function

Cloudflare caps the check backoff to a maximum of four hours to avoid the function growing exponentially, which would result in large gaps between checks towards the end of the month.

```
now() + min((floor(60 * pow(1.05, retry_attempt)) * INTERVAL '1 second'), INTERVAL '4 hours')
```

## Capped attempts reference table

As presented in the following table, most of the checks take place on the first day after the DCV token is generated.

In manual processes, it is possible that you fall behind schedule when you place the token, meaning that it may not be validated immediately.

In automatic processes, most validations complete within the first five minutes, unless there is a setup misconfiguration.

| Retry Attempt | In Seconds | In Minutes | In Hours |
| --- | --- | --- | --- |
| 0 | 60 | 1.000 | 0.016667 |
| 1 | 63 | 1.050 | 0.017500 |
| 2 | 66 | 1.100 | 0.018333 |
| 3 | 69 | 1.150 | 0.019167 |
| 4 | 72 | 1.200 | 0.020000 |
| 5 | 76 | 1.267 | 0.021111 |
| 6 | 80 | 1.333 | 0.022222 |
| 7 | 84 | 1.400 | 0.023333 |
| 8 | 88 | 1.467 | 0.024444 |
| 9 | 93 | 1.550 | 0.025833 |
| 10 | 242 | 4.033 | 0.067222 |
| 11 | 279 | 4.650 | 0.077500 |
| 12 | 321 | 5.350 | 0.089167 |
| 13 | 369 | 6.150 | 0.102500 |
| 14 | 424 | 7.067 | 0.117778 |
| 15 | 488 | 8.133 | 0.135556 |
| 16 | 561 | 9.350 | 0.155833 |
| 17 | 645 | 10.750 | 0.179167 |
| 18 | 742 | 12.367 | 0.206111 |
| 19 | 853 | 14.217 | 0.236944 |
| 20 | 981 | 16.350 | 0.272500 |
| 21 | 1129 | 18.817 | 0.313611 |
| 22 | 1298 | 21.633 | 0.360556 |
| 23 | 1493 | 24.883 | 0.414722 |
| 24 | 1717 | 28.617 | 0.476944 |
| 25 | 1975 | 32.917 | 0.548611 |
| 26 | 2271 | 37.850 | 0.630833 |
| 27 | 2612 | 43.533 | 0.725556 |
| 28 | 3003 | 50.050 | 0.834167 |
| 29 | 3454 | 57.567 | 0.959444 |
| 30 | 3972 | 66.200 | 1.103333 |
| 31 | 4568 | 76.133 | 1.268889 |
| 32 | 5253 | 87.550 | 1.459167 |
| 33 | 6041 | 100.683 | 1.678056 |
| 34 | 6948 | 115.800 | 1.930000 |
| 35 | 7990 | 133.167 | 2.219444 |
| 36 | 9189 | 153.150 | 2.552500 |
| 37 | 10567 | 176.117 | 2.935278 |
| 38 | 12152 | 202.533 | 3.375556 |
| 39 | 13975 | 232.917 | 3.881944 |
| 40 | 14400 | 240.000 | 4.000000 |
| 41 | 14400 | 240.000 | 4.000000 |
| 42 | 14400 | 240.000 | 4.000000 |
| 43 | 14400 | 240.000 | 4.000000 |
| 44 | 14400 | 240.000 | 4.000000 |
| 45 | 14400 | 240.000 | 4.000000 |
| 46 | 14400 | 240.000 | 4.000000 |
| 47 | 14400 | 240.000 | 4.000000 |
| 48 | 14400 | 240.000 | 4.000000 |
| 49 | 14400 | 240.000 | 4.000000 |
| 50 | 14400 | 240.000 | 4.000000 |
| 51 | 14400 | 240.000 | 4.000000 |
| 52 | 14400 | 240.000 | 4.000000 |
| 53 | 14400 | 240.000 | 4.000000 |
| 54 | 14400 | 240.000 | 4.000000 |
| 55 | 14400 | 240.000 | 4.000000 |
| 56 | 14400 | 240.000 | 4.000000 |
| 57 | 14400 | 240.000 | 4.000000 |
| 58 | 14400 | 240.000 | 4.000000 |
| 59 | 14400 | 240.000 | 4.000000 |
| 60 | 14400 | 240.000 | 4.000000 |
| 61 | 14400 | 240.000 | 4.000000 |
| 62 | 14400 | 240.000 | 4.000000 |
| 63 | 14400 | 240.000 | 4.000000 |
| 64 | 14400 | 240.000 | 4.000000 |
| 65 | 14400 | 240.000 | 4.000000 |
| 66 | 14400 | 240.000 | 4.000000 |
| 67 | 14400 | 240.000 | 4.000000 |
| 68 | 14400 | 240.000 | 4.000000 |
| 69 | 14400 | 240.000 | 4.000000 |
| 70 | 14400 | 240.000 | 4.000000 |
| 71 | 14400 | 240.000 | 4.000000 |
| 72 | 14400 | 240.000 | 4.000000 |
| 73 | 14400 | 240.000 | 4.000000 |
| 74 | 14400 | 240.000 | 4.000000 |
| 75 | 14400 | 240.000 | 4.000000 |
| 76 | 14400 | 240.000 | 4.000000 |
| 77 | 14400 | 240.000 | 4.000000 |
| 78 | 14400 | 240.000 | 4.000000 |
| 79 | 14400 | 240.000 | 4.000000 |
| 80 | 14400 | 240.000 | 4.000000 |
| 81 | 14400 | 240.000 | 4.000000 |
| 82 | 14400 | 240.000 | 4.000000 |
| 83 | 14400 | 240.000 | 4.000000 |
| 84 | 14400 | 240.000 | 4.000000 |
| 85 | 14400 | 240.000 | 4.000000 |
| 86 | 14400 | 240.000 | 4.000000 |
| 87 | 14400 | 240.000 | 4.000000 |
| 88 | 14400 | 240.000 | 4.000000 |
| 89 | 14400 | 240.000 | 4.000000 |
| 90 | 14400 | 240.000 | 4.000000 |
| 91 | 14400 | 240.000 | 4.000000 |
| 92 | 14400 | 240.000 | 4.000000 |
| 93 | 14400 | 240.000 | 4.000000 |
| 94 | 14400 | 240.000 | 4.000000 |
| 95 | 14400 | 240.000 | 4.000000 |
| 96 | 14400 | 240.000 | 4.000000 |
| 97 | 14400 | 240.000 | 4.000000 |
| 98 | 14400 | 240.000 | 4.000000 |
| 99 | 14400 | 240.000 | 4.000000 |
| 100 | 14400 | 240.000 | 4.000000 |
| 101 | 14400 | 240.000 | 4.000000 |
| 102 | 14400 | 240.000 | 4.000000 |
| 103 | 14400 | 240.000 | 4.000000 |
| 104 | 14400 | 240.000 | 4.000000 |
| 105 | 14400 | 240.000 | 4.000000 |
| 106 | 14400 | 240.000 | 4.000000 |
| 107 | 14400 | 240.000 | 4.000000 |
| 108 | 14400 | 240.000 | 4.000000 |
| 109 | 14400 | 240.000 | 4.000000 |
| 110 | 14400 | 240.000 | 4.000000 |
| 111 | 14400 | 240.000 | 4.000000 |
| 112 | 14400 | 240.000 | 4.000000 |
| 113 | 14400 | 240.000 | 4.000000 |
| 114 | 14400 | 240.000 | 4.000000 |
| 115 | 14400 | 240.000 | 4.000000 |
| 116 | 14400 | 240.000 | 4.000000 |
| 117 | 14400 | 240.000 | 4.000000 |
| 118 | 14400 | 240.000 | 4.000000 |
| 119 | 14400 | 240.000 | 4.000000 |

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

## Domain control validation flow

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/dcv-flow/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/dcv-flow/)

Page options # Domain control validation flow

To obtain Universal, Advanced, and Custom hostname certificates, Cloudflare partners with different publicly trusted certificate authorities (CAs).

However, every time a CA is requested to issue or renew a certificate, the requester must prove that they have control over the domain. That is when the DCV process takes place, with the proof usually consisting of placing an HTTP token at a standard URL path (/.well-known/pki-validation), or placing a TXT record at the authoritative DNS provider.

## Where Cloudflare sits in the DCV process

For the use cases mentioned above, there are three different parties involved in the process:

- The website or application for which the certificate is issued.
- The requester (Cloudflare).
- The CA that processes the request.

## Steps in the process

In summary, five steps have to succeed after Cloudflare requests a CA to issue or renew a certificate:

1. Cloudflare receives the DCV tokens from the CA.
2. Cloudflare either places the tokens on your behalf (Full DNS setup, Delegated DCV), or makes the tokens available for you to place them.
3. Cloudflare polls the validation URLs to check for the tokens.
4. After Cloudflare can confirm that the tokens are placed via multiple DNS resolvers, the CA is asked to check as well.
5. If the CA can confirm the tokens are placed, the certificate gets issued. If the CA cannot confirm the tokens are placed, the certificate is not issued and the tokens are no longer valid.

## Aspects to consider

- Settings that interfere with the validation URLs - firewall blocks or misconfigured DNSSEC, for example - can cause issues with your certificate issuance or renewal. Refer to the troubleshooting guide.
- When your certificate is in pending_validation and valid tokens are in place, some security features targeting your zone's path for /.well-known/* can be automatically bypassed.
- Certificate authority authorization (CAA) records may block certificate issuance. Refer to CAA records.

### DCV tokens

DCV tokens are generated and controlled by the CA and not by Cloudflare. You can find further technical specification of how they work in RFC 8555 ↗.

- As mentioned in Step 5, DCV tokens will change upon verification failures. For example, if a DCV check fails because of a DNSSEC issue, the certificate order is no longer valid and Cloudflare must start a new certificate request. Since tokens cannot be reused, a new token is required.
- DCV tokens also have validity periods. If you are handling the DCV process manually, it is recommended that you place the tokens as soon as the certificate is up for renewal. Otherwise, the tokens may expire and new tokens will be required.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/troubleshooting/](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/troubleshooting/)

Page options # Troubleshooting

Taking into account the steps involved in DCV, some situations may interfere with certificate issuance and renewal.

Blocked validation URLs or misconfigured DNS settings might interfere with the certificate authority's ability to finish the validation process. In these situations, you may need to update your configuration at Cloudflare or at your authoritative DNS provider. Additionally, there can also be errors on the CA side.

Note

If you are using the Cloudflare API, error messages are presented under the validation_errors parameter.

## Blocked validation URL

If you have issues while HTTP DCV is in place, review the following settings:

- Anything affecting /.well-known/*: Review WAF custom rules, IP Access Rules, and other configuration rules to make sure that your rules do not enable interactive challenge on the validation URL.
- Cloudflare Account Settings and Page Rules: Review your account settings, Configuration Rules, and Page Rules to ensure you have not enabled Under Attack mode on the validation URL.
WarningWhen your certificate is in pending_validation and valid tokens are in place, some security features targeting your zone's path for /.well-known/* can be automatically bypassed.

## Redirection

Enabling Always Use HTTPS does not impact the validation process.

In a Partial (CNAME) setup where you are managing the token on the origin side, please ensure that no redirection from HTTP to HTTPS occurs on the /.well-known/* path.

When using Redirect Rules the /.well-known/* path should be excluded from redirections.

## DNS settings and records

The errors below refer to situations that have to be addressed at the authoritative DNS provider:

- the Certificate Authority had trouble performing a DNS lookup: dns problem: looking up caa for nsheiapp.codeacloud.com: dnssec: bogus
- Certificate authority encountered a SERVFAIL during DNS lookup, please check your DNS reachability.

Consider the following when troubleshooting:

- DNSSEC ↗ must be configured correctly. You can use DNSViz ↗ to understand and troubleshoot the deployment of DNSSEC.
- Your CAA records should allow Cloudflare's partner certificate authorities (CAs) to issue certificates on your behalf.
- The HTTP verification process is done preferably over IPv6, so if any AAAA record exists and does not point to the same dual-stack location as the A record, the validation will fail.
- If an NS record is present for the hostname or its parent, DNS resolution will be managed externally by the DNS provider defined in the NS target. In this case, you must either add the DCV TXT record at the external DNS provider, or remove the NS record at Cloudflare.

## CA errors

### Rate limiting

As mentioned in Certificate authorities, specific CAs may have their own limitations. If you use Let’s Encrypt and receive the error below, it means you hit the duplicate certificate limit ↗ imposed by Let's Encrypt.

The authority has rate limited these domains. Please wait for the rate limit to expire or try another authority.

A certificate is considered a duplicate of an earlier certificate if it contains the exact same set of hostnames.

In this case, you can either wait for the rate limit window to end or choose a different certificate authority.

### Internal errors

When the certificate authority finds an issue during the CA check portion of the DCV flow, you may see a Internal error with Certificate Authority message. In this case, either wait or try a different certificate authority.

When the error states that the certificate authority will not issue for this domain, you can try a different certificate authority or contact the CA directly.

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

## Geo Key Manager

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/](https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/)

Page options # Geo Key Manager

Restrict where the private keys used for TLS certificates are stored and managed.

Geo Key Manager allows customers to store and manage the encryption keys for their domains in different geographic locations so they can meet compliance regulations and keep data secure.

## Resources

- Setup
- Supported options

## Limitations

Currently, Geo Key Manager is limited to custom certificates and available only through the Cloudflare API.

## Related products

Data Localization Suite The Data Localization Suite (DLS) is a set of products that helps customers
who want to maintain local control over their traffic while retaining the
security benefits of a global network.

Geo Key Manager (v1) The first version of Geo Key Manager supports 3 regions: U.S., E.U., and a set of High Security Data Centers. If you would like to restrict your private key to another country or region, apply for the closed beta ↗ of the new version.

## More resources

Plans

Compare available Cloudflare plans

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

## Setup

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/setup/](https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/setup/)

Page options # Setup

## Geo Key Manager v2 Beta

Note

Geo Key Manager v2 is only available through the Cloudflare API.

Geo Key Manager v2 gives customers flexibility when choosing the geographical boundaries of where their keys are stored.

Using the policy field, customers can define policies containing allow and block lists of countries or regions where the private key should be stored.

To use Geo Key Manager v2 with the API, generally, follow the steps to upload a custom certificate.

When sending the POST request, include the policy parameter to define policies containing allow and block lists of countries or regions where the private key should be stored.

Note

You also have access to the geo_restrictions parameter, which is mutually exclusive with the policy parameter and is part of Geo Key Manager v1.

### Examples

Store private keys in the E.U. and the U.S.

Required API token permissions

At least one of the following token permissions is required: - Access: Mutual TLS Certificates Write
- SSL and Certificates Write

Create SSL Configuration ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_certificates" \  --request POST \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "certificate": "certificate",    "private_key": "<PRIVATE_KEY>",    "policy": "(country: US) and (region: EU)",    "type": "sni_custom"  }'
```

Store private keys in the E.U., but not in France

Required API token permissions

At least one of the following token permissions is required: - Access: Mutual TLS Certificates Write
- SSL and Certificates Write

Create SSL Configuration ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_certificates" \  --request POST \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "certificate": "certificate",    "private_key": "<PRIVATE_KEY>",    "policy": "(region: EU) and (not country: FR)",    "type": "sni_custom"  }'
```

Note

For more information on the policy field, refer to Supported options.

## Geo Key Manager v1

The first version of Geo Key Manager supports 3 regions: U.S., E.U., and a set of High Security Data Centers. If you would like to restrict your private key to another country or region, apply for the closed beta ↗ of the new version.

- Dashboard
- API

To use Geo Key Manager in the dashboard:

1. Follow the steps to upload a custom certificate.
2. For Private Key Restriction, choose one of the following options:

Distribute to all Cloudflare data centers (optimal performance)
Distribute only to U.S. data centers
Distribute only to E.U. data centers
Distribute only to highest security data centers (more details)
3. Distribute to all Cloudflare data centers (optimal performance)
4. Distribute only to U.S. data centers
5. Distribute only to E.U. data centers
6. Distribute only to highest security data centers (more details)
7. Select Upload Custom Certificate.

To use Geo Key Manager with the API, generally, follow the steps to upload a custom certificate.

When sending the POST request, include the geo_restrictions parameter set to one of the following options:

- us
- eu
- highest_security(more details)

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

## Supported options

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/supported-options/](https://developers.cloudflare.com/ssl/edge-certificates/geokey-manager/supported-options/)

Page options # Supported options

## Available regions

For customers with Geo Key Manager v2, you can use the policy parameter to specify following regions using the Region code:

| Region code | Region name |
| --- | --- |
| AFR | Africa |
| APAC | Asia Pacific |
| EEUR | Eastern Europe |
| ENAM | Eastern North America |
| EU | European Union |
| ME | Middle East |
| OC | Oceania |
| SAM | South America |
| WEUR | Western Europe |
| WNAM | Western North America |

## Available countries

For customers with Geo Key Manager v2, you can use the policy parameter to specify individual countries as well. Cloudflare is constantly expanding the number of supported countries. To indicate a country, specify the two-letter (ISO 3166) country code.

Examples of supported countries are Japan, Canada, India, and Australia.

## Highest security data centers

For customers with both Geo Key Manager v1 and v2, you can use the geo_restrictions parameter to only choose Cloudflare's highest security data centers.

The following aspects are unique to our highest security data centers, but the baseline security requirements for all data centers are also detailed in our blog ↗.

### Pre-scheduled and biometric controlled facility access

Employees of Cloudflare permitted to access the facility must have previously scheduled a visit before access will be granted.

Access to the entrance of the facility is controlled through the use of a biometric hand reader combined with an assigned access code.

### Private cages with biometric readers

All equipment is in private cages with physical access controlled via biometrics and recorded in audit logs.
Entrants have to pass through five separate readers before they can access the cage.

### Exterior security controls and monitoring

All points of ingress/egress are monitored by an intrusion detection system (IDS), with authorized users and access events archived for historical review.

### Interior security controls and monitoring

Interior points of ingress/egress are controlled by the access control subsystem, with entry routed through a mantrap. All areas are monitored and recorded with closed-circuit television, with data kept for a minimum of thirty days.

Exterior walls are airtight and may incorporate additional security measures such as reinforced concrete, Kevlar bullet board, vapor barriers, or bullet-proof front doors.

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

## Add CAA records

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/caa-records/](https://developers.cloudflare.com/ssl/edge-certificates/caa-records/)

Page options # Add CAA records

A Certificate Authority Authorization (CAA) DNS record specifies which certificate authorities (CAs) are allowed to issue certificates for a domain. This record reduces the chance of unauthorized certificate issuance and promotes standardization across your organization.

For additional security, set up Certificate Transparency Monitoring as well.

Note

For more technical details about CAA records, refer to the introductory blog post ↗.

## Who should create CAA records?

You should create CAA records in Cloudflare if each of the following is true:

- You uploaded your own custom origin server certificate (not provisioned by Cloudflare).
- That certificate was issued by a CA (not self-signed).
- Your domain is on a full setup (not a CNAME setup).
- When adding new Custom Hostname and your customer has existing CAA records. In this case, ask your customer to remove the existing CAA records or add the missing CAA record.

## CAA records added by Cloudflare

Cloudflare adds CAA records automatically in two situations:

- When you have Universal SSL or advanced certificates and add any CAA records to your zone.
- When you have Universal SSL enabled and enable AMP Real URL or SXG Signed Exchanges.

These records make sure Cloudflare can still issue Universal certificates on your behalf.

If Cloudflare has automatically added CAA records on your behalf, these records will not appear in the Cloudflare dashboard. However, if you run a command line query using dig, you can see any existing CAA records, including those added by Cloudflare (replacing example.com with your own domain on Cloudflare):

Terminal window ```
➜  ~ dig example.com caa +short
# CAA records added by Google Trust Services0 issue "pki.goog; cansignhttpexchanges=yes"0 issuewild "pki.goog; cansignhttpexchanges=yes"
# CAA records added by Let's Encrypt0 issue "letsencrypt.org"0 issuewild "letsencrypt.org"
# CAA records added by SSL.com0 issue "ssl.com"0 issuewild "ssl.com"
# CAA records added by Sectigo0 issue "sectigo.com"0 issuewild "sectigo.com"
```

## Create CAA records

Create a CAA record for each Certificate Authority (CA) that you plan to use for your domain.

- Dashboard
- API

To add a CAA record in the dashboard,

1. Log in to the Cloudflare dashboard ↗ and select your account and application.
2. Go to DNS > Records.
3. Select Add record.
4. For Type, select CAA.
5. For Name, type your domain.
6. Choose a Tag, which specifies the behavior associated with the record.
7. For CA domain name, enter the CA name.
8. Select Save.
9. Repeat for each CA associated with your domain.

To create a CAA record via the API, use this POST endpoint.

Once you have finished creating all the records, you can review them in the list of records appearing under the DNS Records panel.

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

## Staging environment (Beta)

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/staging-environment/](https://developers.cloudflare.com/ssl/edge-certificates/staging-environment/)

Page options # Staging environment (Beta)

Use your certificate staging environment to test new custom (modern) certificates before pushing them to your production environment. This process helps you solve potential certificate problems before there's an incident, such as when:

- You make a mistake when uploading a new custom certificate.
- You misunderstand the order of your certificates.
- Clients have previously pinned your custom certificate, causing a TLS termination error.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | No | No | Yes
(open beta) |

## Use your staging environment

### 1. Upload certificate

To upload custom (modern) certificates to your staging environment:

1. Go to SSL/TLS > Staging Certificates.
2. Select Upload Custom Staging Certificate.
3. Upload your custom (modern) certificate (detailed instructions).
4. Your certificate will appear in the dashboard with a status of Staging Deployment. If you refresh the page, its status should go to Staging Active.

### 2. Test certificate

Test your custom (modern) certificate by sending curl requests to the IP addresses listed in the dashboard card at SSL/TLS > Staging Certificates:

```
curl --resolve <HOSTNAME>:<PORT>:<STAGING_IP> https://<HOSTNAME> -iv
```

You should confirm whether:

- TLS termination is successful.
- The right certificate is being served at the edge.
- Any clients are pinning the old certificate.

### 3. Push certificate to production

Assuming there are no issues, push your custom (modern) certificate to your production environment:

1. Go to SSL/TLS > Staging Certificates.
2. Select a custom certificate.
3. Select Push to Production.

If there were issues with your certificate, you can keep it in your staging environment or select Deactivate on the certificate itself.

### 4. (Optional) Push certificate back to staging

If you roll out a custom (modern) certificate to production and encounter issues, you can deactivate that certificate to delete the certificate from the edge and then push the certificate back to your staging environment for additional testing:

1. Go to SSL/TLS > Edge Certificates.
2. Select a custom certificate.
3. Select Deactivate.
4. Select Push to Staging.

## Limitations

### Access

Currently, staging environments are only available to Enterprise customers participating in an open beta. To get access to the beta, contact your Account team.

### Functionality

At the moment, staging environments have limited functionality:

- Only custom (modern) certificates
- Only accessed via the dashboard

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

## Backup certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/backup-certificates/](https://developers.cloudflare.com/ssl/edge-certificates/backup-certificates/)

Page options # Backup certificates

If Cloudflare is providing authoritative DNS for your domain, Cloudflare will issue a backup Universal SSL certificate for every standard Universal certificate issued.

Backup certificates are wrapped with a different private key and issued from a different Certificate Authority — either Google Trust Services, Let's Encrypt, Sectigo, or SSL.com — than your domain's primary Universal SSL certificate.

These backup certificates are not normally deployed, but they will be deployed automatically by Cloudflare in the event of a certificate revocation or key compromise.

For additional details, refer to the introductory blog post ↗.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Can opt out? | No | No | No | Yes |

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

## ECH Protocol

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/ech/](https://developers.cloudflare.com/ssl/edge-certificates/ech/)

Page options # ECH Protocol

ECH stands for Encrypted Client Hello ↗. It is a protocol extension in the context of Transport Layer Security (TLS). ECH encrypts part of the handshake and masks the Server Name Indication (SNI) that is used to negotiate a TLS session. This means that whenever a user visits a website on Cloudflare that has ECH enabled, intermediaries will be able to see that you are visiting a website on Cloudflare, but they will not be able to determine which one.

## What ECH does

ECH limits access to information that a particular user is visiting your website, ensuring that it is not unnecessarily shared with intermediaries, like Internet Service Provides (ISP). With ECH, specific details regarding their visit no longer leak to network intermediaries when the user accesses your website.

## How ECH works

In a typical TLS handshake ↗, the client sends a ClientHello message to the server to initiate the TLS session. This message contains important information, including the list of supported cryptographic algorithms, TLS version, and the requested server name (the domain name of the website the client wants to connect to). The server name is indicated through Server Name Indication (SNI).

With ECH, the ClientHello message part is split into two separate messages: an inner part and an outer part. The outer part contains the non-sensitive information such as which ciphers to use and the TLS version and an "outer ClientHello". The inner part is encrypted and contains an "inner ClientHello".

The outer ClientHello contains a common name (SNI) that represents that a user is trying to visit an encrypted website on Cloudflare. We chose cloudflare-ech.com as the SNI that all websites will share on Cloudflare. Because Cloudflare controls that domain, we have the appropriate certificates to be able to negotiate a TLS handshake for that server name.

The inner ClientHello contains the actual server name that the user is trying to visit. This is encrypted using a public key and can only be read by Cloudflare. Once the handshake completes, the web page is loaded as normal, just like any other website loaded over TLS.

In practice, this means that any intermediary that is looking at your traffic will simply see normal TLS handshakes with one caveat: any traffic to an ECH-enabled server name on Cloudflare will look the same. Every TLS handshake will appear identical in that it looks like it is trying to load a website for cloudflare-ech.com, as opposed to the actual website.

In the example below, a user is visiting example.com. Without ECH, any intermediate networks will be able to detect the website being accessed by the user. With ECH, the visible information will be limited to cloudflare-ech.com instead.

```
flowchart LR
accTitle: What intermediaries see with and without ECH
accDescr: This diagram describes what intermediaries see with and without ECH.
A(User visits <code>example.com</code>)
    A -- With ECH --> C(intermediaries see <code>cloudflare-ech.com</code>)-->B(Cloudflare)
    A -- Without ECH  --> D(intermediaries see <code>example.com</code>)-->B(Cloudflare)
```

For more details about ECH protocol technology, refer to our introductory blog ↗.

## Enable ECH

ECH is enabled by default on Free zones. Other plans can turn it on or off following the steps below.

1. Log into the Cloudflare dashboard ↗.
2. Select your account and zone.
3. Go to SSL > Edge Certificates.
4. For Encrypted ClientHello (ECH), change the setting to Enabled.

## Enterprise network applicability

Some enterprise or regional networks may need to audit or apply filtering policies to traffic that traverses their network. These policies are expressed in terms of domain names, not IP addresses. Consequently, they are best applied at the local DNS resolver in response to the A and AAAA queries for the individual domain names.

However, for settings wherein DNS-based filtering is not applicable, there are two ways in which networks can disable ECH to allow existing filtering mechanisms to continue working as expected.

The most reliable way is via the local or recursive DNS resolver itself, by dropping ECH configurations from HTTPS resource records returned to clients, or, preferably, by returning a “no error no answer” or NXDOMAIN response to HTTPS queries. This prevents clients from obtaining the necessary information to use ECH. Note that modifying HTTPS resource records may cause failures for clients that perform DNSSEC validation, so dropping HTTPS responses may be the preferred approach. This will prevent browsers, such as Chrome from using ECH.

The second way to disable ECH is via a network canary domain. In particular, your network’s DNS resolver can return a “no error no answer” or an NXDOMAIN response to queries made to the use-application-dns.net canary domain ↗. This will prevent browsers, such as Firefox from using ECH. For more information, see Firefox's frequently asked questions page ↗ for Encrypted Client Hello.

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

## Cipher suites

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/)

Page options # Cipher suites

Cipher suites are a combination of ciphers used to negotiate security settings during the SSL/TLS handshake ↗ (and therefore separate from the SSL/TLS protocol).

This section covers cipher suites used in connections between clients — such as your visitor's browser — and the Cloudflare network. For information about cipher suites used between Cloudflare and your origin server, refer to Origin server > Cipher suites.

Note

Cloudflare maintains a public repository of our SSL/TLS configurations ↗ on GitHub, where you can find changes in the commit history.

RC4 cipher suites ↗ or SSLv3 ↗ are no longer supported.

## Cipher suites and edge certificates

While the cipher suites used by default for all Cloudflare domains/zones are meant to balance security and compatibility, some of them might be considered weak by third-party testing tools, such as the Qualys SSL Labs test.

If the default option (Legacy) does not meet your business requirements, you can purchase the Advanced Certificate Manager add-on ↗ to be able to specify more secure cipher suites.

Custom cipher suites is a hostname-level setting. Once specified, the configuration is applicable to all edge certificates used to connect to the hostname(s), regardless of certificate type (universal, advanced, or custom).

## Related SSL/TLS settings

Although configured independently, cipher suites interact with other SSL/TLS settings.

### Minimum TLS Version

You can specify a minimum TLS version that is required for a client to connect to your website or application.

For example, if TLS 1.1 is selected as the minimum, visitors attempting to connect using TLS 1.0 will be rejected while visitors attempting to connect using TLS 1.1, 1.2, or 1.3 (if enabled) will be allowed.

Each cipher suite relates to a specific minimum protocol that it supports. This means that if you use a higher security level for your cipher suites and stop supporting TLS 1.0, you should also adjust your minimum TLS version accordingly.

Compliance standards can also require you to up the minimum TLS version accepted in connections to your website or application.

### TLS 1.3

You cannot set specific TLS 1.3 ciphers. Instead, you can enable TLS 1.3 for your entire zone and Cloudflare will use all applicable TLS 1.3 cipher suites. In combination with this, you can still disable weak cipher suites for TLS 1.0-1.2.

Cloudflare may return the following names for TLS 1.3 cipher suites. This is how they map to RFC 8446 ↗ names:

| Cloudflare | RFC 8446 |
| --- | --- |
| AEAD-AES128-GCM-SHA256 | TLS_AES_128_GCM_SHA256 |
| AEAD-AES256-GCM-SHA384 | TLS_AES_256_GCM_SHA384 |
| AEAD-CHACHA20-POLY1305-SHA256 | TLS_CHACHA20_POLY1305_SHA256 |

## Resources

- Customize cipher suites
- Security levels
- Compliance standards
- Supported cipher suites
- Troubleshooting

## Limitations

It is not possible to configure cipher suites for Cloudflare Pages hostnames.

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

## Customize cipher suites

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/)

Page options # Customize cipher suites

With an Advanced Certificate Manager subscription, you can restrict connections between Cloudflare and clients — such as your visitor's browser — to specific cipher suites.

You may want to do this to follow specific recommendations, to disable weak cipher suites, or to comply with industry standards.

Customizing cipher suites will not lead to any downtime in your SSL/TLS protection.

Cloudflare for SaaS

If you are a SaaS provider looking to restrict cipher suites for connections to custom hostnames, this can be configured with a Cloudflare for SaaS subscription. Refer to TLS management instead.

## How it works

Custom cipher suites is a hostname-level setting, which implies that:

- When you customize cipher suites for a zone, this will affect all hostnames within that zone. If you are not familiar with what a Cloudflare zone is, refer to Fundamentals.
- The configuration is applicable to all edge certificates used to connect to the hostname(s), regardless of the certificate type (universal, advanced, or custom).
- If you need to use a per-hostname cipher suite customization, you must ensure that the hostname is specified on the certificate.

## Scope

Currently, you have the following options:

- Set custom cipher suites for a zone: either via API or on the dashboard.
- Set custom cipher suites per-hostname: only available via API. Refer to the how-to for details.

Note

This documentation only refers to connections between clients and the Cloudflare network. For connections between Cloudflare and your origin server, refer to Origin server > Cipher suites.

## Settings priority and ciphers order

Cloudflare uses the hostname priority logic to determine which setting to apply.

ECDSA cipher suites are prioritized over RSA, and Cloudflare preserves the specified cipher suites in the order they are set. This means that, if both ECDSA and RSA are used, Cloudflare presents the ECDSA ciphers first - in the order they were set - and then the RSA ciphers, also in the order they were set.

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

## Customize cipher suites via dashboard

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/dashboard/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/dashboard/)

Page options # Customize cipher suites via dashboard

Cipher suites are a combination of ciphers used to negotiate security settings during the SSL/TLS handshake ↗ (and therefore separate from the SSL/TLS protocol).

When configuring cipher suites via dashboard, you can use three different selection modes:

- By security level: allows you to select between the predefined Cloudflare recommendations (Modern1, Compatible, or Legacy).
- By compliance standard: allows you to select cipher suites grouped according to industry standards (PCI DSS or FIPS-140-2).
- Custom: allows you to individually select the cipher suites you would like to support.

For any of the modes, you should keep in mind the following configuration conditions. If using the security level or the compliance standard mode, some actions may be blocked and explained referencing these conditions.

Configuration conditions

- Cipher suites are used in combination with other SSL/TLS
settings.
- You cannot set specific TLS 1.3 ciphers. Instead, you can enable TLS
1.3 for your
entire zone and Cloudflare will use all applicable TLS 1.3 cipher
suites.
- Each cipher suite also supports a specific algorithm (RSA or ECDSA), so you
should consider the algorithms in use by your edge certificates when making
your ciphers selection. You can find this information under each certificate
listed in SSL/TLS > Edge
Certificates ↗.
- It is not possible to configure minimum TLS version nor cipher suites for
Cloudflare Pages hostnames.

## Steps

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS > Edge Certificates.
3. For the Cipher suites setting select Configure.
4. Choose a mode to select your cipher suites and select Next.
5. Select a predefined set of cipher suites or, if you opted for Custom, specify which cipher suites you want to allow. Make sure you are aware of how your selection will interact with Minimum TLS version, TLS 1.3, and the certificate algorithm (ECDSA or RSA).
6. Select Save to confirm.

Modern or PCI DSS

When used with TLS 1.3, Modern is the same as PCI DSS.

## Footnotes

1. When used with TLS 1.3, Modern is the same as PCI DSS. ↩

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

## Customize cipher suites via API

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/api/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/customize-cipher-suites/api/)

Page options # Customize cipher suites via API

Cipher suites are a combination of ciphers used to negotiate security settings during the SSL/TLS handshake ↗ (and therefore separate from the SSL/TLS protocol).

Note

For guidance around custom hostnames, refer to TLS settings - Cloudflare for SaaS.

## Before you begin

Note that:

- Cipher suites are used in combination with other SSL/TLS settings.
- You cannot set specific TLS 1.3 ciphers. Instead, you can enable TLS 1.3 for your entire zone and Cloudflare will use all applicable TLS 1.3 cipher suites.
- Each cipher suite also supports a specific algorithm (RSA or ECDSA) so you should consider the algorithms in use by your edge certificates when making your ciphers selection. You can find this information under each certificate listed in SSL/TLS > Edge Certificates ↗.
- It is not possible to configure minimum TLS version nor cipher suites for Cloudflare Pages hostnames.
- If setting up a per-hostname cipher suite customization, make sure that the hostname is specified on the certificate (instead of being covered by a wildcard).
- If you use Windows you might need to adjust the curl syntax, refer to Making API calls on Windows for further guidance.

Note

Updating the cipher suites will result in certificates being redeployed.

## Steps and API examples

1. Decide which cipher suites you want to specify and which ones you want to disable (meaning they will not be included in your selection).
Below you will find samples covering the recommended ciphers by security level and compliance standards, but you can also refer to the full list of supported ciphers and customize your choice.
2. Log in to the Cloudflare dashboard and get your Global API Key in My Profile > API Tokens ↗.
3. Get the Zone ID from the Overview page ↗ of the domain you want to specify cipher suites for.
4. Make an API call to either the Edit zone setting endpoint or the Edit TLS setting for hostname endpoint, specifying ciphers in the URL. List your array of chosen cipher suites in the value field.

- modern
- compatible
- pci dss
- fips-140-2

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ciphers" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": [        "ECDHE-ECDSA-AES128-GCM-SHA256",        "ECDHE-ECDSA-CHACHA20-POLY1305",        "ECDHE-RSA-AES128-GCM-SHA256",        "ECDHE-RSA-CHACHA20-POLY1305",        "ECDHE-ECDSA-AES256-GCM-SHA384",        "ECDHE-RSA-AES256-GCM-SHA384"    ]  }'
```

To configure cipher suites per hostname, replace the first two lines by the following:

Terminal window ```
curl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/hostnames/settings/ciphers/{hostname}" \
```

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ciphers" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": [        "ECDHE-ECDSA-AES128-GCM-SHA256",        "ECDHE-ECDSA-CHACHA20-POLY1305",        "ECDHE-RSA-AES128-GCM-SHA256",        "ECDHE-RSA-CHACHA20-POLY1305",        "ECDHE-ECDSA-AES256-GCM-SHA384",        "ECDHE-RSA-AES256-GCM-SHA384",        "ECDHE-ECDSA-AES128-SHA256",        "ECDHE-RSA-AES128-SHA256",        "ECDHE-ECDSA-AES256-SHA384",        "ECDHE-RSA-AES256-SHA384"    ]  }'
```

To configure cipher suites per hostname, replace the first two lines by the following:

Terminal window ```
curl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/hostnames/settings/ciphers/{hostname}" \
```

Note

For compliance with PCI DSS, also enable TLS 1.3 on your zone and make sure to up your Minimum TLS version to 1.2.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ciphers" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": [        "ECDHE-ECDSA-AES128-GCM-SHA256",        "ECDHE-RSA-AES128-GCM-SHA256",        "ECDHE-ECDSA-AES256-GCM-SHA384",        "ECDHE-RSA-AES256-GCM-SHA384",        "ECDHE-ECDSA-CHACHA20-POLY1305",        "ECDHE-RSA-CHACHA20-POLY1305"    ]  }'
```

To configure cipher suites per hostname, replace the first two lines by the following:

Terminal window ```
curl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/hostnames/settings/ciphers/{hostname}" \
```

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ciphers" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": [        "AES128-GCM-SHA256",        "AES128-SHA",        "AES128-SHA256",        "AES256-SHA",        "AES256-SHA256",        "DES-CBC3-SHA",        "ECDHE-ECDSA-AES128-GCM-SHA256",        "ECDHE-ECDSA-AES128-SHA",        "ECDHE-ECDSA-AES128-SHA256",        "ECDHE-ECDSA-AES256-GCM-SHA384",        "ECDHE-ECDSA-AES256-SHA384",        "ECDHE-RSA-AES128-GCM-SHA256",        "ECDHE-RSA-AES128-SHA",        "ECDHE-RSA-AES128-SHA256",        "ECDHE-RSA-AES256-GCM-SHA384",        "ECDHE-RSA-AES256-SHA",        "ECDHE-RSA-AES256-SHA384"    ]  }'
```

To configure cipher suites per hostname, replace the first two lines by the following:

Terminal window ```
curl --request PUT \"https://api.cloudflare.com/client/v4/zones/{zone_id}/hostnames/settings/ciphers/{hostname}" \
```

### Reset to default values

- zone
- per-hostname

To reset to the default cipher suites at zone level, use the Edit zone setting endpoint, specifying ciphers as the setting name in the URL, and send an empty array in the value field.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ciphers" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": []  }'
```

For specific hostname settings, use the Delete TLS setting for hostname endpoint.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Delete TLS setting for hostname ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/hostnames/settings/ciphers/$HOSTNAME" \  --request DELETE \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

For guidance around custom hostnames, refer to TLS settings - Cloudflare for SaaS.

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

## Security levels

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/recommendations/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/recommendations/)

Page options # Security levels

Refer to the sections below for three different security levels and how Cloudflare recommends that you set them up if you need to restrict the cipher suites used between Cloudflare and clients that access your website or application.

Refer to Customize cipher suites to learn how to specify cipher suites at zone level or per hostname.

Warning

Before opting for compatible or modern, review the related SSL/TLS settings1.

## Modern

Offers the best security and performance, limiting your range of clients to modern devices and browsers. Supports TLS 1.2-1.3 cipher suites. All suites are forward-secret and support authenticated encryption (AEAD).

Cipher suites list

AEAD-AES128-GCM-SHA2562, AEAD-AES256-GCM-SHA3843, AEAD-CHACHA20-POLY1305-SHA2564,ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384

If you are customizing cipher suites via API, refer to Steps and API examples for a snippet you can copy with the formatted array.

## Compatible

Provides broader compatibility with somewhat weaker security. Supports TLS 1.2-1.3 cipher suites. All suites are forward-secret.

Cipher suites list

AEAD-AES128-GCM-SHA2562, AEAD-AES256-GCM-SHA3843, AEAD-CHACHA20-POLY1305-SHA2564, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384, ECDHE-ECDSA-AES128-SHA256, ECDHE-RSA-AES128-SHA256, ECDHE-ECDSA-AES256-SHA384, ECDHE-RSA-AES256-SHA384

If you are customizing cipher suites via API, refer to Steps and API examples for a snippet you can copy with the formatted array.

## Legacy (default)

Includes all cipher suites that Cloudflare supports today. Broadest compatibility with the weakest security. Supports TLS 1.0-1.3 cipher suites.

Cipher suites list

AEAD-AES128-GCM-SHA2562, AEAD-AES256-GCM-SHA3843, AEAD-CHACHA20-POLY1305-SHA2564, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384, ECDHE-ECDSA-AES128-SHA256, ECDHE-RSA-AES128-SHA256, ECDHE-ECDSA-AES256-SHA384, ECDHE-RSA-AES256-SHA384, ECDHE-ECDSA-AES128-SHA, ECDHE-RSA-AES128-SHA, AES128-GCM-SHA256, AES128-SHA256, AES128-SHA, ECDHE-RSA-AES256-SHA, AES256-GCM-SHA384, AES256-SHA256, AES256-SHA, DES-CBC3-SHA

To reset your option to the default, use an empty array.

## Footnotes

1. Although configured independently, cipher suites interact with Minimum TLS version and TLS 1.3. ↩
2. Same as TLS_AES_128_GCM_SHA256. Refer to TLS 1.3 cipher suites for details. ↩ ↩2 ↩3
3. Same as TLS_AES_256_GCM_SHA384. Refer to TLS 1.3 cipher suites for details. ↩ ↩2 ↩3
4. Same as TLS_CHACHA20_POLY1305_SHA256. Refer to TLS 1.3 cipher suites for details. ↩ ↩2 ↩3

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

## Compliance standards

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/compliance-status/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/compliance-status/)

Page options # Compliance standards

Consider the following recommendations on custom cipher suites for when your organization needs to comply with regulatory standards.

Refer to Customize cipher suites to learn how to specify cipher suites at zone level or per hostname.

Warning

Also enable TLS 1.3 on your zone and, when opting for PCI DSS, make sure to up your Minimum TLS version to 1.2. Refer to Cipher suites and TLS protocols to learn more.

## PCI DSS

Recommended cipher suites for compliance with the Payment Card Industry Data Security Standard (PCI DSS) ↗. Enhances payment card data security.

Cipher suites list

AEAD-AES128-GCM-SHA2561, AEAD-AES256-GCM-SHA3842, AEAD-CHACHA20-POLY1305-SHA2563, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-RSA-AES128-GCM-SHA256, ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384, ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-CHACHA20-POLY1305

If you are customizing cipher suites via API, refer to Steps and API examples for a snippet you can copy with the formatted array.

## FIPS-140-2

Recommended cipher suites for compliance with the Federal Information Processing Standard (140-2) ↗. Used to approve cryptographic modules.

Cipher suites list

AES128-GCM-SHA256, AES128-SHA, AES128-SHA256, AES256-SHA, AES256-SHA256, DES-CBC3-SHA, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-AES128-SHA, ECDHE-ECDSA-AES128-SHA256, ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-ECDSA-AES256-SHA384, ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-AES128-SHA, ECDHE-RSA-AES128-SHA256, ECDHE-RSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-SHA, ECDHE-RSA-AES256-SHA384

If you are customizing cipher suites via API, refer to Steps and API examples for a snippet you can copy with the formatted array.

## Footnotes

1. Same as TLS_AES_128_GCM_SHA256. Refer to TLS 1.3 cipher suites for details. ↩
2. Same as TLS_AES_256_GCM_SHA384. Refer to TLS 1.3 cipher suites for details. ↩
3. Same as TLS_CHACHA20_POLY1305_SHA256. Refer to TLS 1.3 cipher suites for details. ↩

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

## Supported cipher suites

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/supported-cipher-suites/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/supported-cipher-suites/)

Page options # Supported cipher suites

Cloudflare supports the following cipher suites by default. If needed, you can restrict your website or application to only use specific cipher suites.

| Cipher name | Minimum protocol | Security recommendation | Cipher suite | IANA name |
| --- | --- | --- | --- | --- |
| ECDHE-ECDSA-AES128-GCM-SHA256 | TLS 1.2 | Modern | [0xc02b] | TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 |
| ECDHE-ECDSA-CHACHA20-POLY1305 | TLS 1.2 | Modern | [0xcca9] | TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 |
| ECDHE-RSA-AES128-GCM-SHA256 | TLS 1.2 | Modern | [0xc02f] | TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 |
| ECDHE-RSA-CHACHA20-POLY1305 | TLS 1.2 | Modern | [0xcca8] | TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 |
| ECDHE-ECDSA-AES128-SHA256 | TLS 1.2 | Compatible | [0xc023] | TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 |
| ECDHE-ECDSA-AES128-SHA | TLS 1.0 | Legacy | [0xc009] | TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA |
| ECDHE-RSA-AES128-SHA256 | TLS 1.2 | Compatible | [0xc027] | TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 |
| ECDHE-RSA-AES128-SHA | TLS 1.0 | Legacy | [0xc013] | TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA |
| AES128-GCM-SHA256 | TLS 1.2 | Legacy | [0x9c] | TLS_RSA_WITH_AES_128_GCM_SHA256 |
| AES128-SHA256 | TLS 1.2 | Legacy | [0x3c] | TLS_RSA_WITH_AES_128_CBC_SHA256 |
| AES128-SHA | TLS 1.0 | Legacy | [0x2f] | TLS_RSA_WITH_AES_128_CBC_SHA |
| ECDHE-ECDSA-AES256-GCM-SHA384 | TLS 1.2 | Modern | [0xc02c] | TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 |
| ECDHE-ECDSA-AES256-SHA384 | TLS 1.2 | Compatible | [0xc024] | TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 |
| ECDHE-RSA-AES256-GCM-SHA384 | TLS 1.2 | Modern | [0xc030] | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 |
| ECDHE-RSA-AES256-SHA384 | TLS 1.2 | Compatible | [0xc028] | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 |
| ECDHE-RSA-AES256-SHA | TLS 1.0 | Legacy | [0xc014] | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA |
| AES256-GCM-SHA384 | TLS 1.2 | Legacy | [0x9d] | TLS_RSA_WITH_AES_256_GCM_SHA384 |
| AES256-SHA256 | TLS 1.2 | Legacy | [0x3d] | TLS_RSA_WITH_AES_256_CBC_SHA256 |
| AES256-SHA | TLS 1.0 | Legacy | [0x35] | TLS_RSA_WITH_AES_256_CBC_SHA |
| DES-CBC3-SHA | TLS 1.0 | Legacy | [0x0a] | TLS_RSA_WITH_3DES_EDE_CBC_SHA |
| AEAD-AES128-GCM-SHA256 * | TLS 1.3 | Modern | {0x13,0x01} | TLS_AES_128_GCM_SHA256 |
| AEAD-AES256-GCM-SHA384 * | TLS 1.3 | Modern | {0x13,0x02} | TLS_AES_256_GCM_SHA384 |
| AEAD-CHACHA20-POLY1305-SHA256 * | TLS 1.3 | Modern | {0x13,0x03} | TLS_CHACHA20_POLY1305_SHA256 |

* TLS 1.3 minimum protocol

Ciphers AEAD-AES128-GCM-SHA256, AEAD-AES256-GCM-SHA384, and AEAD-CHACHA20-POLY1305-SHA256 are automatically supported by your zone if you enable TLS 1.3.

TLS 1.3 uses the same cipher suite space as previous versions of TLS, but defines these cipher suites differently. TLS 1.3 only specifies the symmetric ciphers and cannot be used for TLS 1.2. Similarly, TLS 1.2 and lower cipher suites cannot be used with TLS 1.3 (RFC 8446 ↗). BoringSSL also hard-codes cipher preferences in this order for TLS 1.3.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/troubleshooting/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/troubleshooting/)

Page options # Troubleshooting

If you encounter issues with edge certificate cipher suites, refer to the following scenarios.

## Compatibility with Minimum TLS Version

When you adjust the setting used for your domain's Minimum TLS Version, your domain only allows HTTPS connections using that TLS protocol version.

This setting can cause issues if you are not supporting TLS 1.2 ciphers on your domain. If you experience issues, review your domain's Minimum TLS Version setting and Cloudflare's supported ciphers list.

## Compatibility with certificate encryption

If you upload a custom certificate, make sure the certificate is compatible with the chosen cipher suites for your zone or hostname.

For example, if you upload an RSA certificate, your cipher suite selection cannot only support ECDSA certificates.

## Compatibility with Cloudflare Pages

It is not possible to configure minimum TLS version nor cipher suites for Cloudflare Pages hostnames.

## API requirements for custom hostname certificate

When using the Edit Custom Hostname endpoint, make sure to include type and method within the ssl object, as well as the settings specifications.

Including the settings only will result in the error message The SSL attribute is invalid. Please refer to the API documentation, check your input and try again.

## TLS 1.3 settings

You cannot set specific TLS 1.3 ciphers. Instead, you can enable TLS 1.3 for your entire zone and Cloudflare will use all applicable TLS 1.3 cipher suites. In combination with this, you can still disable weak cipher suites for TLS 1.0-1.2.

## SSL Labs weak ciphers report

If you try to disable all of the WEAK cipher suites according to what is listed on a Qualys SSL Labs ↗ report, you might notice that the naming conventions are not the same.

This is because SSL Labs follows RFC cipher naming convention while Cloudflare follows OpenSSL cipher naming convention. The cipher suite names list in the OpenSSL documentation ↗ may help you map the names.

## Warnings related to CVE-2019-1559

Even though applications on Cloudflare are not vulnerable to CVE-2019-1559, some security scanners may flag your application erroneously.

To remove these warnings, refer to Customize cipher suites and exclude the following ciphers:

- ECDHE-ECDSA-AES256-SHA384
- ECDHE-ECDSA-AES128-SHA256
- ECDHE-RSA-AES256-SHA384

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

## Certificate Transparency Monitoring

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/certificate-transparency-monitoring/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/certificate-transparency-monitoring/)

Page options # Certificate Transparency Monitoring

Certificate Transparency (CT) Monitoring is an opt-in feature in public beta that aims at improving security by allowing you to double-check any SSL/TLS certificates issued for your domain.

CT Monitoring alerts are triggered not only by Cloudflare processes - including backup certificates -, but whenever a certificate that covers your monitored domain is issued by a Certificate Authority (CA) and added to a public CT log. You can learn more about how this works in the introductory blog post ↗.

Aspects to consider

- If you use Cloudflare or other services that automatically issue certificates for your domain or subdomains, this may trigger CT Monitoring emails as well.
- If your domain is included in a shared certificate, you may receive notifications for domains or subdomains that do not belong to you but are included as subject alternative names (SANs) together with your domain. You can use a tool like Certificate Search ↗ to gather more information in such cases.
- CT Monitoring does not detect phishing attempts. For example, for cloudflare.com, an alert would not trigger if a certificate was issued for cloudf1are.com or cloud-flare.com.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Email Recipients | All account members | All account members | Specified email addresses | Specified email addresses |

## Opt in and out

Alerts are turned off by default. If you want to receive alerts, go to SSL/TLS > Edge Certificates ↗ and enable Certificate Transparency Monitoring. If you are in a Business or Enterprise zone, select Add Email.

To stop receiving alerts, disable Certificate Transparency Monitoring or remove your email from the feature card.

## Emails to be concerned about

Most certificate alerts are routine. Cloudflare sends alerts whenever a certificate for your domain appears in a log. Certificates expire (and must be reissued), so it is completely normal to receive issuance emails. If your domain is listed in the email, along with reasonable ownership and certificate information, then no action is required.

Additionally, you should check whether the certificate was issued through Cloudflare. Cloudflare partners with multiple CAs to provide certificates.
To view all Cloudflare-issued certificates and backup certificates - which require no additional actions - visit the Edge Certificates page ↗ in the dashboard.

You should take action when something is clearly wrong, such as if you:

- Do not recognize the certificate issuer.
NoteCloudflare provisions backup certificates, so you may see a certificate listed that is not in active use for your site. The Edge Certificates page ↗ will show all certificates requested for your site.
- Have recently noticed problems with your website.

## How to take action

### Option 1: Contact certificate authorities

Only Certificate Authorities can revoke malicious certificates. If you believe an illegitimate certificate was issued for your domain, contact the Certificate Authority listed as the Issuer in the email.

- GlobalSign support ↗
- GoDaddy support ↗
- Google Trust Services support ↗
- IdenTrust support ↗
- Let's Encrypt support ↗
- Sectigo support ↗
- SSL.com support ↗

### Option 2: Contact domain registrars

Domain registrars may be able to suspend potentially malicious domains. If, for example, you notice that a malicious domain was registered through GoDaddy, contact GoDaddy’s support team to see if they can help you. Do the same for other registrars.

### Option 3: Improvise

There are other ways to combat malicious certificates. You can warn your visitors with an on-site notification or ask browser makers (Google for Chrome, etc.) to block these domains.

If someone is attempting to impersonate you online, you should absolutely take action. This is usually difficult to recognize, so exercise caution. Remember: the vast majority of certificates are not malicious. Only take action if you believe something is wrong.

## HTTP Public Key Pinning

Certificate Transparency Monitoring addresses the same problems as HTTP Public Key Pinning (HPKP), but with fewer technical issues ↗.

Cloudflare does not offer or support HPKP and advises against using it with Universal SSL.

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

## HTTP Strict Transport Security (HSTS)

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/)

Page options # HTTP Strict Transport Security (HSTS)

HSTS protects HTTPS web servers from downgrade attacks. These attacks redirect web browsers from an HTTPS web server to an attacker-controlled server, allowing bad actors to compromise user data and cookies.

HSTS adds an HTTP header that directs compliant web browsers to:

- Transform HTTP links to HTTPS links
- Prevent users from bypassing SSL browser warnings

Before enabling HSTS, review the requirements.

Note

For more background information on HSTS, see the introductory blog post ↗.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Requirements

In order for HSTS to work as expected, you need to:

- Have enabled HTTPS before HSTS so browsers can accept your HSTS settings
- Keep HTTPS enabled so visitors can access your site

Once you enabled HSTS, avoid the following actions to ensure visitors can still access your site:

- Changing your DNS records from Proxied to DNS only
- Pausing Cloudflare on your site
- Pointing your nameservers away from Cloudflare
- Redirecting HTTPS to HTTP
- Disabling SSL (invalid or expired certificates or certificates with mismatched hostnames)

Warning

If you remove HTTPS before disabling HSTS or before waiting for the duration of the original Max Age Header specified in your Cloudflare HSTS configuration, your website becomes inaccessible to visitors for the duration of the Max Age Header or until you enable HTTPS.

## Enable HSTS

- Dashboard
- API

To enable HSTS using the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your website.
3. Go to SSL/TLS > Edge Certificates.
4. For HTTP Strict Transport Security (HSTS), select Enable HSTS.
5. Read the dialog and select I understand.
6. Select Next.
7. Configure the HSTS settings.
8. Select Save.

To enable HSTS with the API, send a PATCH request with security_header as the setting name in the URI path, and specify the value object that includes your HSTS settings.

Note

To enable HSTS on a specific subdomain only, configure a subdomain setup. Alternatively, you can add the appropriate HSTS header at the origin, or use a response header transform rule.

## Disable HSTS

To disable HSTS on your website:

1. Log in to the Cloudflare dashboard and select your account.
2. Select your website.
3. Go to SSL/TLS > Edge Certificates.
4. For HTTP Strict Transport Security (HSTS), select Enable HSTS.
5. Set the Max Age Header to 0 (Disable).
6. If you previously enabled the No-Sniff header and want to remove it, set it to Off.
7. Select Save.

## Configuration settings

| Name | Required | Description | Options |
| --- | --- | --- | --- |
| Enable HSTS (Strict-Transport-Security) | Yes | Serves HSTS headers to browsers for all HTTPS requests. HTTP
(non-secure) requests will not contain the header. | Off / On |
| Max Age Header (max-age) | Yes | Specifies duration for a browser HSTS policy and requires HTTPS on your
website. | Disable, or a range from 1 to 12 months |
| Apply HSTS policy to subdomains (includeSubDomains) | No | Applies the HSTS policy from a parent domain to subdomains. Subdomains
are inaccessible if they do not support HTTPS. | Off / On |
| Preload | No | Permits browsers to automatically preload HSTS configuration. Prevents
an attacker from downgrading a first request from HTTPS to HTTP. Preload
can make a website without HTTPS completely inaccessible. | Off / On |
| No-Sniff Header | No | Sends the X-Content-Type-Options: nosniff header to prevent
Internet Explorer and Chrome from automatically detecting a content type
other than those explicitly specified by the Content-Type header. | Off / On |

Note

Once HSTS Preload is configured, submit requests for addition to each browser’s preload list. Chrome, Firefox/Mozilla, and Safari use the Chrome preload list. A minimum Max Age Header of 12 months is required for inclusion in HSTS preload lists.

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

## Certificate Signing Requests (CSRs)

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/certificate-signing-requests/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/certificate-signing-requests/)

Page options # Certificate Signing Requests (CSRs)

Generate a Certificate Signing Request (CSR) to get a custom certificate from the Certificate Authority (CA) of your choice while maintaining control of the private key on Cloudflare. The private key associated with the CSR will be generated by Cloudflare and will never leave our network.

A CSR contains information about your domain: your organization name and address, the common name (domain name), and Subject Alternative Names (SANs).

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | No | No | Included with Advanced Certificate Manager |

## Types of CSRs

You can create two types of CSRs:

- Zone-level: Meant only for sign certificates associated with the current zone.
- Account-level: Meant for organizations that issue certificates across multiple domains.

## Create and use a CSR

To create a CSR:

1. Log in to the Cloudflare dashboard ↗ and select your account and an application.
2. Go to SSL/TLS > Edge Certificates.
3. On Certificate Signing Request (CSR), select Generate.
4. Choose a Scope (only certain customers can choose Account).
5. Enter relevant information on the form and select Create.

To use a CSR:

1. Go to SSL/TLS > Edge Certificates.
2. On Certificate Signing Request (CSR), select the record you just created.
3. Copy (or select Click to copy) the value for Certificate Signing Request.
4. Obtain a certificate from the Certificate Authority (CA) of your choice using your CSR.
5. When you upload the custom certificate to Cloudflare, select an Encoding mode of Certificate Signing Request (CSR) and enter the associated value.
NoteYou will not see the option to adjust your Encoding Mode until after you have created a CSR associated with the specific zone or your account.

## Renew a certificate

When you renew a custom certificate, you need to reuse a previously generated CSR.

Note that it is not possible to use a different CSR with the same certificate. In this case, you must upload the certificate as a new certificate, selecting the new CSR.

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

## TLS 1.3

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/tls-13/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/tls-13/)

Page options # TLS 1.3

TLS 1.3 enables the latest version of the TLS protocol (when supported) for improved security and performance.

## What is TLS 1.3?

TLS 1.3 is the newest, fastest, and most secure version of the TLS protocol.

By turning on the TLS 1.3 feature, traffic to and from your website will be served over the TLS 1.3 protocol when supported by clients. TLS 1.3 protocol has improved latency over older versions, has several new features, and is currently supported in all updated major browsers.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Enable TLS 1.3

TLS 1.3 can be activated in the Cloudflare dashboard or through the API:

- Dashboard
- API

To enable TLS 1.3 in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Edge Certificates.
3. For TLS 1.3, switch the toggle to On.

To adjust your TLS 1.3 settings with the API, send a PATCH request with tls_1_3 as the setting name in the URI path, and set the value parameter to your desired setting ("on", "zrt" or "off"). zrt refers to Zero Round Trip Time Resumption (0-RTT) ↗.

### Troubleshooting

Since TLS 1.3 implementations are relatively new, some failures may occur. If you experience errors, submit a Cloudflare Support ticket with the following information:

- Steps to replicate the issue (if possible)
- Client build version
- Client diagnostic information
- Packet captures

Chrome users should submit a net-internals trace ↗ to Google. Firefox users should report bugs to Mozilla ↗.

## Limitations

You cannot set specific TLS 1.3 ciphers. Instead, you can enable TLS 1.3 for your entire zone and Cloudflare will use all applicable TLS 1.3 cipher suites. In combination with this, you can still disable weak cipher suites for TLS 1.0-1.2.

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

## Minimum TLS Version

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/)

Page options # Minimum TLS Version

Minimum TLS Version only allows HTTPS connections from visitors that support the selected TLS protocol version or newer.

For example, if TLS 1.1 is selected, visitors attempting to connect using TLS 1.0 will be rejected. Visitors attempting to connect using TLS 1.1, 1.2, or 1.3 (if enabled) will be allowed to connect.

Note

If you are looking to restrict cipher suites, refer to Customize cipher suites. For guidance on which TLS version to use, refer to TLS protocols.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |
| Per-hostname | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager | Included with Advanced Certificate Manager |

It is not possible to configure minimum TLS version for Cloudflare Pages hostnames.

## How to disable TLS 1.0

You can disable TLS 1.0 by choosing a higher minimum TLS version.

All users can apply this configuration to all hostnames in their zones following the steps under zone-level.

If you have an Advanced Certificate Manager subscription, you also have the option to disable TLS 1.0 (or other versions) with a per-hostname setup.

## Setup

Warning

The Minimum TLS version that you set up following these steps does not apply to R2 custom domains. To control the TLS version for R2 custom domains, refer to the custom domains documentation.

### Zone-level

To manage the TLS version applied to your whole zone when proxied through Cloudflare:

- Dashboard
- API

1. Log in to the Cloudflare dashboard ↗ and select your account.
2. Select your website.
3. Go to SSL/TLS > Edge Certificates.
4. For Minimum TLS Version, select an option.

Use the Edit zone setting endpoint with min_tls_version as the setting name in the URI path, and specify your preferred minimum version in the value field.

In the following example, the minimum TLS version for the zone will be set to 1.2. Replace the zone ID and API token placeholders with your information, and adjust the value field with your chosen TLS version.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/min_tls_version" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "id": "min_tls_version",    "value": "1.2"  }'
```

### Per-hostname

Advanced Certificate Manager users also have the option to specify minimum TLS versions per specific hostnames in their Cloudflare zone.

This is currently only available via the API:

- Use the Edit TLS setting for hostname endpoint to specify different values for min_tls_version.
- Use the Delete TLS setting for hostname endpoint to clear previously defined min_tls_version setting.

Cloudflare uses the hostname priority logic to determine which setting to apply.

In the following example, the minimum TLS version for a specific hostname will be set to 1.2. Replace the zone ID, hostname, and authentication placeholders with your information, and adjust the value field with your chosen TLS version.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Edit TLS setting for hostname ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/hostnames/settings/min_tls_version/$HOSTNAME" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "value": "1.2"  }'
```

## Test supported TLS versions

To test supported TLS versions, attempt a request to your website or application while specifying a TLS version.

For example, use a curl command to test TLS 1.1 (replace www.example.com with your Cloudflare domain and hostname):

Terminal window ```
curl https://www.example.com -svo /dev/null --tls-max 1.1
```

If the TLS version you are testing is blocked by Cloudflare, the TLS handshake is not completed and returns an error:

* error:1400442E:SSL routines:CONNECT_CR_SRVR_HELLO:tlsv1 alert

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

## Automatic HTTPS Rewrites

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites/)

Page options # Automatic HTTPS Rewrites

Automatic HTTPS Rewrites prevents end users from seeing "mixed content" errors by rewriting URLs from http to https for resources or links on your web site that can be served with HTTPS.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Additional details

If your site contains links or references to HTTP URLs that are also available securely via HTTPS, Automatic HTTPS Rewrites can help. If you connect to your site over HTTPS and the lock icon is not present, or has a yellow warning triangle on it, your site may contain references to HTTP assets (“mixed content”).

Mixed content is often due to factors not under the website owner’s control such as embedded third-party content or complex content management systems. By rewriting URLs from “http” to “https”, Automatic HTTPS Rewrites simplifies the task of making your entire website available over HTTPS, helping to eliminate mixed content errors and ensuring that all data loaded by your website is protected from eavesdropping and tampering.

Note

For security reasons, this feature will run on URLs pointing to localhost if the URL is fetching an active resource (script, iframe, link, object, etc.).

## Enable Automatic HTTPS Rewrites

- Dashboard
- API

To enable Automatic HTTPS Rewrites in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Edge Certificates.
3. For Automatic HTTPS Rewrites, switch the toggle to On.

To enable or disable Automatic HTTPS Rewrites with the API, send a PATCH request with automatic_https_rewrites as the setting name in the URI path, and the value parameter set to your desired setting ("on" or "off").

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

## Limitations

Before a rewrite is applied, Cloudflare checks the HTTP resources to ensure they are accessible via HTTPS. If they are not available over HTTPS, Cloudflare cannot rewrite the URL.

Some resources are loaded by JavaScript or CSS via HTTP when the site is loaded in a browser. You will see mixed content warnings in those situations. To determine which URLs do not have HTTPS support, Cloudflare uses data from EFF’s HTTPS Everywhere ↗ and Chrome’s HSTS preload list ↗. If your zone is not on one of these lists, only active content will be rewritten. Passive content (such as images) will not be rewritten and will still cause mixed content errors.

If a third-party domain supports HTTPS and is not rewritten automatically, you can manually change those links to relative links or HTTPS links. Alternatively, you can ask the third-party domain owner to submit their site for inclusion in the HTTPS Everywhere rulesets, which accept pull requests on GitHub ↗. For more information on how to fix mixed content errors, refer to Troubleshooting mixed content errors.

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

## Total TLS

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/)

Page options # Total TLS

Total TLS allows Cloudflare to issue individual certificates for your proxied hostnames. These certificates will protect proxied hostnames not covered by Universal certificates.

Warning

Total TLS certificates follow the Common Name (CN) restriction of 64 characters (RFC 5280 ↗). If you have a hostname that exceeds this length, you can create an Advanced Certificate via API to cover it.

When issued, these certificates will have a type of Advanced - Total TLS, and their default validity period is 90 days.

## Reference

- Enable
- Error messages

## Availability

Total TLS is available for domains that have purchased Advanced Certificate Manager and are currently using a full DNS setup.

## Limitations

### Hostnames used with other Cloudflare products

Total TLS does not issue certificates for any hostnames used with:

- Cloudflare Load Balancing
- Cloudflare Tunnel
- Cloudflare Spectrum

You can use other types of certificates or manually order advanced certificates for these hostnames.

### Deleting certificates

Once you enable Total TLS, be careful deleting any Total TLS certificates associated with proxied hostnames.

If you do, our system assumes you want to opt that hostname out of Total TLS certificate and will not order new certificates for the hostname in the future. This behavior applies even if you delete and re-create the hostname's DNS record.

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

## Enable

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/enable/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/enable/)

Page options # Enable

To enable Total TLS - which issues individual certificates for your proxied hostnames - follow these instructions:

- Dashboard
- API

To enable Total TLS in the dashboard:

1. Log into the Cloudflare dashboard ↗.
2. Choose your account and domain.
3. Go to SSL/TLS > Edge Certificates.
4. For Total TLS, switch the toggle to On and - if desired - choose an issuing Certificate Authority.

To enable Total TLS with the API, send a PATCH request with the enabled parameter set to your desired setting (true or false).

You can also specify a desired certificate authority by adding a value to the certificate_authority parameter.

## Aspects to consider

- Total TLS certificates follow the Common Name (CN) restriction of 64 characters (RFC 5280 ↗). If you have a hostname that exceeds this length, you can create an Advanced Certificate via API to cover it.

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

## Error messages

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/error-messages/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls/error-messages/)

Page options # Error messages

To help avoid ERR_SSL_VERSION_OR_CIPHER_MISMATCH errors, Cloudflare automatically shows an error message - This hostname is not covered by a certificate - on proxied DNS records not covered by a TLS certificate.

## Pending domains

If you recently added your domain to Cloudflare - meaning that your zone is in a pending state - you can often ignore this warning.

Once most domains becomes Active, Cloudflare will automatically issue a Universal SSL certificate, which will provide SSL/TLS coverage and remove the warning message.

Note

Since there are a few nuances to certificate coverage and issuance timing, review Enable Universal SSL certificates to make sure your domain will receive SSL/TLS coverage automatically.

## Active domains

If your zone is already active on Cloudflare, this warning identifies subdomains that are not covered by your current SSL/TLS certificate.

By default, Cloudflare Universal SSL certificates only cover your apex domain and one level of subdomain.

| Hostname | Covered by Universal certificate? |
| --- | --- |
| example.com | Yes |
| www.example.com | Yes |
| docs.example.com | Yes |
| dev.docs.example.com | No |
| test.dev.api.example.com | No |

To prevent insecure connections on a multi-level subdomain, do one of the following:

- Enable Total TLS, which automatically issues individual certificates to your proxied hostnames not covered by a Universal certificate.
- Order an Advanced Certificate covering the subdomain.
- Upload a Custom Certificate covering the subdomain.

If none of these solutions work, you could also remove the multi-level subdomain.

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

## Always Use HTTPS

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

Page options # Always Use HTTPS

Always Use HTTPS redirects all your visitor requests from http to https, for all subdomains and hosts in your application.

Note

This process does not impact certificate validation. If you use HTTP DCV, you can still enable Always Use HTTPS.

Cloudflare recommends not performing redirects at your origin web server, as this can cause redirect loop errors.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Encrypt all visitor traffic

To redirect traffic for all subdomains and hosts in your application, you can enable Always Use HTTPS.

Note

If only some parts of your application can support HTTPS traffic, do not enable Always Use HTTPS and use a single redirect to selectively perform the redirect to HTTPS. Refer to Redirect admin area requests to HTTPS for an example.

- Dashboard
- API

To enable Always Use HTTPS in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. In SSL/TLS > Overview, make sure that your SSL/TLS encryption mode is not set to Off. When you set your encryption mode to Off, the Always Use HTTPS option will not be visible in your Cloudflare dashboard.
3. Go to SSL/TLS > Edge Certificates.
4. For Always Use HTTPS, switch the toggle to On.

To enable or disable Always Use HTTPS with the API:

1. Make sure that your SSL/TLS encryption mode is not set to Off.
2. Send a PATCH request with always_use_https as the setting name in the URI path, and the value parameter set to your desired setting ("on" or "off").

## Limitations

Forcing HTTPS does not resolve issues with mixed content, as browsers check the protocol of included resources before making a request. You will need to use only relative links or HTTPS links on pages that you force to HTTPS. Cloudflare can automatically resolve some mixed-content links using our Automatic HTTPS Rewrites functionality.

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

## Opportunistic Encryption

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/opportunistic-encryption/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/opportunistic-encryption/)

Page options # Opportunistic Encryption

Opportunistic Encryption allows browsers to access HTTP URIs over an encrypted TLS channel. It's not a substitute for HTTPS, but provides additional security for otherwise vulnerable requests.

Use HTTPS when both strong encryption and authentication are required. HTTP Opportunistic Encryption provides a means of enabling TLS when needed for other protocols such as HTTP/2. It does not provide the same indications of security as HTTPS (the green lock icon in most browser address bars).

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Enable Opportunistic Encryption

You do not need to configure your origin web server to support Opportunistic Encryption. All it requires is updating your settings in the Cloudflare dashboard.

- Dashboard
- API

To enable Opportunistic Encryption in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Edge Certificates.
3. For Opportunistic Encryption, switch the toggle to On.

To adjust your Opportunistic Encryption settings with the API, send a PATCH request with opportunistic_encryption as the setting name in the URI path, and specify the value parameter with your desired setting ("on" or "off").

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

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

## CAs and certificates FAQ

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/ca-faq/](https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/ca-faq/)

Page options # CAs and certificates FAQ

Refer to this page for frequently asked questions about Cloudflare SSL/TLS certificate offerings and the CAs that Cloudflare partners with.

## General

### Does Cloudflare issue both RSA and ECDSA certificates?

Yes. Cloudflare can issue both RSA and ECDSA certificates.

## Certificate authorities (CAs)

### Which certificate authorities does Cloudflare use?

Cloudflare uses Let's Encrypt, Google Trust Services, SSL.com, and Sectigo. You can see a complete list of products and available CAs and algorithms in the certificate authorities reference page.

Sectigo is only used for backup certificates.

### Are there any CA limitations I should know about?

You can find a list of limitations for every CA in our pipeline in the certificate authorities reference page.

### What clients are supported by the CAs that Cloudflare offers?

In the certificate authorities reference page, you can find information about device and browser compatibility.

### I do not want to use one of the CAs that Cloudflare partners with. What can I do?

If you are on a Business or Enterprise plan, you can upload a certificate from the CA of your choice.

### What CAA records do I need in order to allow issuance from Cloudflare CAs?

You can find CAA records associated with every Cloudflare CA in the certificate authorities reference page. If you are using Cloudflare as your DNS provider, then the CAA records will be added on your behalf.

### I am missing the CAs that Cloudflare uses in my trust store. What should I do?

You can use Cloudflare CFSSL trust store ↗, which includes all of the CAs that are used by Cloudflare managed certificates.

## Universal SSL

### I am using Universal SSL and I would like to use a different CA. How can I do that?

To be able to specify a CA, you must purchase Advanced Certificate Manager. Through Advanced Certificate Manager, you can choose the certificate authority when ordering an advanced certificate or you can choose a default CA when using Total TLS.

If you are on a Business or Enterprise plan, you can upload a certificate from the CA of your choice. In this case, certificate issuance and renewal will have to be managed by you.

### Does Cloudflare issue both RSA and ECDSA certificates for Universal certificates?

Universal certificates on free zones only receive an ECDSA certificate. Paid zones receive an RSA and ECDSA certificate.

## Advanced Certificate Manager

### How can I choose which CA will be used for my certificates?

When ordering an advanced certificate, you can choose the CA through the UI or API.

Total TLS allows you to get full certificate coverage. When enabling Total TLS, you can choose the CA that will be used for all Total TLS certificates.

## Renewal

### Error when clicking Approve Certificate on a Certificate Approval renewal email

The full error message is: An error occurred while attempting to validate your domain. Please try again later or contact support for assistance.

Check the status of the certificate on the Cloudflare dashboard ↗. If the status is Active, you can disregard this email and the error message.

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

## Certification Authority Authorization (CAA) FAQ

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/caa-records/](https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/caa-records/)

Page options # Certification Authority Authorization (CAA) FAQ

The following page answers common questions about Certification Authority Authorization (CAA) records.

## What is CAA and how can I create one?

A Certificate Authority Authorization (CAA) DNS record specifies which certificate authorities (CAs) are allowed to issue certificates for a domain. This record reduces the chance of unauthorized certificate issuance and promotes standardization across your organization.

For more details, refer to Create CAA records.

## How does Cloudflare evaluate CAA records?

CAA records are evaluated by a CA, not by Cloudflare.

Note

Setting a CAA record to specify one or more particular CAs does not affect which CA(s) Cloudflare uses to issue a Universal or Advanced SSL certificate for your domain.

You can specify CAs associated with Cloudflare certificates when ordering an advanced certificate.

## What are the dangers of setting CAA records?

If you are part of a large organization or one where multiple parties are tasked with obtaining SSL certificates, include CAA records that allow issuance for all CAs applicable for your organization. Failure to do so can inadvertently block SSL issuance for other parts of your organization.

## What CAA records are added by Cloudflare?

Cloudflare adds CAA records automatically in two situations:

- When you have Universal SSL or advanced certificates and add any CAA records to your zone.
- When you have Universal SSL enabled and enable AMP Real URL or SXG Signed Exchanges.

These records make sure Cloudflare can still issue Universal certificates on your behalf.

If Cloudflare has automatically added CAA records on your behalf, these records will not appear in the Cloudflare dashboard. However, if you run a command line query using dig, you can see any existing CAA records, including those added by Cloudflare (replacing example.com with your own domain on Cloudflare):

Terminal window ```
➜  ~ dig example.com caa +short
# CAA records added by Google Trust Services0 issue "pki.goog; cansignhttpexchanges=yes"0 issuewild "pki.goog; cansignhttpexchanges=yes"
# CAA records added by Let's Encrypt0 issue "letsencrypt.org"0 issuewild "letsencrypt.org"
# CAA records added by SSL.com0 issue "ssl.com"0 issuewild "ssl.com"
# CAA records added by Sectigo0 issue "sectigo.com"0 issuewild "sectigo.com"
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

## Encryption modes

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)

Page options # Encryption modes

Your zone's SSL/TLS Encryption Mode controls how Cloudflare manages two connections: one between your visitors and Cloudflare, and the other between Cloudflare and your origin server.

```
flowchart LR
    accTitle: SSL/TLS Encryption mode
    A[Browser] <--Connection 1--> B((Cloudflare))<--Connection 2--> C[(Origin server)]
```

If possible, Cloudflare strongly recommends using Full or Full (strict) modes to prevent malicious connections to your origin.

For more details on how encryption modes fit into the bigger picture of Cloudflare SSL/TLS protection, refer to Concepts.

## Available encryption modes

Automatic SSL/TLS relies on the probes developed for the SSL/TLS Recommender to determine what encryption mode is the most secure and safest for a website to be set to. If there is a more secure option for your website (based on your origin certification or capabilities), Automatic SSL/TLS will find it and apply it for your domain. The other option, Custom SSL/TLS, will work exactly like the setting the encryption mode does today.

Note

We are gradually rolling out the new Automated SSL/TLS feature.

If your zone has not been migrated yet, you will only have Custom SSL/TLS options in your dashboard.

To understand how the various encryption modes affect your cache, refer to the section on Impact of SSL setting on cache behavior.

### Automatic SSL/TLS (default)

Automatic SSL/TLS leverages advanced methods developed by the SSL/TLS Recommender to select the most secure encryption mode for your website. The Recommender crawls your site using the Cloudflare-SSLDetector user agent, recognized as a trusted bot by Cloudflare, and bypasses robots.txt rules (except those that specifically target it) to ensure accuracy. It downloads content from your origin server over both HTTP and HTTPS, then applies a content similarity algorithm to assess consistency. By understanding your current SSL/TLS encryption mode and evaluating your origin's certification and capabilities, the Recommender can automatically adjust settings to maintain the highest security for your domain.

Note

Automatic SSL/TLS will not change your setting to a less secure encryption mode. For example, if your origin certificate expires, the encryption mode will not change from Full (strict) to Full. You must ensure the validity of your origin SSL/TLS configuration at all times.

#### Additional details

- Scan frequency: Automatic scans currently occur approximately once per month, though they may happen more frequently in some cases (for example, configuration changes or upgrades). Scans stop when:

The site is already using the most secure mode (for example, Full (strict)), or
You switch from auto mode to Custom SSL/TLS.
- The site is already using the most secure mode (for example, Full (strict)), or
- You switch from auto mode to Custom SSL/TLS.
- Error checking before upgrades: To prevent disruptions, Cloudflare checks for 5XX errors (like 502 or 503) and evaluates whether the HTTP and HTTPS content is consistent before upgrading a zone's encryption mode.
- Upgrade notifications: Cloudflare sends weekly digest emails listing which zones have been upgraded. These emails are currently sent to Super Admins only.

#### Opt out single zone

If you want to opt a zone out via the API, you can make this API call on or before the grace period expiration date.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl_automatic_mode" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": "custom"  }'
```

#### Opt out multiple zones

If you wanted to opt out multiple zones:

1. Create an API token with the following permissions:

Zone - Zone - Read
Zone - Zone Settings - Read
Zone - Zone Settings - Edit
2. Zone - Zone - Read
3. Zone - Zone Settings - Read
4. Zone - Zone Settings - Edit
5. Make a GET request to get a list of zones (you can filter this list by account.id).
Terminal windowcurl 'https://api.cloudflare.com/client/v4/zones?account.id=<ACCOUNT_ID>' \--header 'Authorization: Bearer <CF_API_TOKEN>' \--header 'Content-Type: application/json'
6. Create a list of zone IDs you want to opt-out with each zone ID on a separate line (newline separate), stored in a file such as zones.txt.
7. Create a bash script for opt-out-multiple-zones.sh and add the following. Add zones.txt to the same directory or update the path accordingly.
opt-out-multiple-zones.shfor zoneID in $(cat zone.txt); do  printf "Opting out ${zoneID}:\n"
  curl --request PATCH \    --url https://api.cloudflare.com/client/v4/zones/$zoneID/settings/ssl_automatic_mode \    --header 'Authorization: Bearer <CF_API_TOKEN>' \    --header 'Content-Type: application/json' \    --data '{"value":"custom"}'
  printf "\n\n"done
8. Open your command line and run:
Terminal windowbash opt-out-multiple-zones.sh

### Custom SSL/TLS

To use Custom SSL/TLS, select the custom option (if you prefer to manually set the encryption mode instead of using Automatic SSL/TLS):

- Off (no encryption)   :  No encryption is used for traffic between browsers and Cloudflare or between Cloudflare and origins. Everything is cleartext HTTP.
- Flexible   :  Traffic from browsers to Cloudflare can be encrypted via HTTPS, but traffic from Cloudflare to the origin server is not. This mode is common for origins that do not support TLS, though upgrading the origin configuration is recommended whenever possible.
- Full   :  Cloudflare matches the browser request protocol when connecting to the origin. If the browser uses HTTP, Cloudflare connects to the origin via HTTP; if HTTPS, Cloudflare uses HTTPS without validating the origin’s certificate. This mode is common for origins that use self-signed or otherwise invalid certificates.
- Full (strict)   :  Similar to Full Mode, but with added validation of the origin server’s certificate, which can be issued by a public CA like Let’s Encrypt or by Cloudflare Origin CA.
- Strict (SSL-Only Origin Pull)   :  Regardless of whether the browser-to-Cloudflare connection uses HTTP or HTTPS, Cloudflare always connects to the origin over HTTPS with certificate validation.

## Update your encryption mode

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

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

## Off (no encryption)

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/off/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/off/)

Page options # Off (no encryption)

Setting your encryption mode to Off (not recommended) redirects any HTTPS request to plaintext HTTP.

```
flowchart LR
        accTitle: No SSL/TLS Encryption
        accDescr: With an encryption mode of Off, your application does not encrypt traffic between the visitor and Cloudflare or between Cloudflare and your server.
        A[Browser] <--Unencrypted--> B((Cloudflare))<--Unencrypted--> C[(Origin server)]
```

## Use when

Cloudflare does not recommend setting your encryption mode to Off.

## Required setup

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

## Limitations

When you set your encryption mode to Off, your application:

- Leaves your visitors and your application vulnerable to attacks ↗.
- Will be marked as "not secure" by Chrome and other browsers, reducing visitor trust.
- Will be penalized in SEO rankings ↗.

### Incompatible settings

When you set your SSL/TLS encryption mode to Off, you will not see the options for Always Use HTTPS or Onion Routing.

Authenticated Origin Pull does not work when your SSL/TLS encryption mode is set to Off or Flexible.

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

## Flexible

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/)

Page options # Flexible

Setting your encryption mode to Flexible makes your site partially secure. Cloudflare allows HTTPS connections between your visitor and Cloudflare, but all connections between Cloudflare and your origin are made through HTTP. As a result, an SSL certificate is not required on your origin.

```
flowchart LR
    accTitle: Flexible SSL/TLS Encryption
    accDescr: With an encryption mode of Flexible, your application encrypts traffic between the visitor and Cloudflare, but not between Cloudflare and your server.
    A[Browser] <--Encrypted--> B((Cloudflare))<--Unencrypted--> C[(Origin server)]
```

## Use when

Choose this option when you cannot set up an SSL certificate on your origin or your origin does not support SSL/TLS.

## Required setup

### Prerequisites

Depending on your origin configuration, you may have to adjust settings to avoid Mixed Content errors or redirect loops.

### Process

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

## Limitations

Flexible mode is only supported for HTTPS connections on port 443 (default port). Other ports using HTTPS will fall back to Full mode.

If your application contains sensitive information (personalized data, user login), use Full or Full (Strict) modes instead.

Authenticated Origin Pull does not work when your SSL/TLS encryption mode is set to Off or Flexible.

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

## Full

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/)

Page options # Full

When you set your encryption mode to Full, Cloudflare allows HTTPS connections between your visitor and Cloudflare and makes connections to the origin using the scheme requested by the visitor. If your visitor uses http, then Cloudflare connects to the origin using plaintext HTTP and vice versa.

```
flowchart LR
        accTitle: Full SSL/TLS Encryption
        accDescr: With an encryption mode of Full, your application encrypts traffic going to and coming from Cloudflare but does not validate your origin certificate.
        A[Browser] <--Encrypted--> B((Cloudflare))<--Encrypted--> C[(Origin server)]
```

## Use when

Choose Full mode when your origin can support an SSL certification, but — for various reasons — it cannot support a valid, publicly trusted certificate.

Note

In addition to Full encryption, you can also set up Authenticated Origin Pulls to ensure all requests to your origin are evaluated before receiving a response.

## Required setup

### Prerequisites

Before enabling Full mode, make sure your origin allows HTTPS connections on port 443 and presents a certificate (self-signed, Cloudflare Origin CA, or purchased from a Certificate Authority). Otherwise, your visitors may experience a 525 error.

Depending on your origin configuration, you may have to adjust settings to avoid Mixed Content errors or redirect loops.

### Process

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

## Limitations

The certificate presented by the origin will not be validated in any way. It can be expired, self-signed, or not even have a matching CN/SAN entry for the hostname requested.

Without using Full (strict), a malicious party could technically hijack the connection and present their own certificate.

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

## Full (strict)

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)

Page options # Full (strict)

When you set your encryption mode to Full (strict), Cloudflare does everything in Full mode but also enforces more stringent requirements for origin certificates.

```
flowchart LR
    accTitle: Full - Strict SSL/TLS Encryption
    accDescr: With an encryption mode of Full (strict), your application encrypts traffic going to and coming from Cloudflare.
    A[Browser] <--Encrypted--> B((Cloudflare))<--Encrypted--> C[("Origin server (verified) #9989;")]
```

## Use when

For the best security, choose Full (strict) mode whenever possible (unless you are an Enterprise customer).

Your origin needs to be able to support an SSL certificate that is:

- Unexpired, meaning the certificate presents notBeforeDate < now() < notAfterDate.
- Issued by a publicly trusted certificate authority ↗ or Cloudflare’s Origin CA.
- Contains a Common Name (CN) or Subject Alternative Name (SAN) that matches the requested or target hostname.

Note

In addition to Full (strict) encryption, you can also set up Authenticated Origin Pulls to ensure all requests to your origin are evaluated before receiving a response.

## Required setup

### Prerequisites

Before enabling Full (strict) mode, make sure your origin:

- Allows HTTPS connections on port 443.
- Presents a certificate matching the requirements above.

Otherwise, your visitors may experience a 526 error.

### Process

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

## Limitations

Depending on your origin configuration, you may have to adjust settings to avoid Mixed Content errors or redirect loops.

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

## Strict (SSL-Only Origin Pull)

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/ssl-only-origin-pull/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/ssl-only-origin-pull/)

Page options # Strict (SSL-Only Origin Pull)

Note

This method is only available for Enterprise zones.

When you set your encryption mode to Strict (SSL-Only Origin Pull), connections to the origin will always be made using SSL/TLS, regardless of the scheme requested by the visitor.

The certificate presented by the origin will be validated the same as with Full (strict) mode.

```
flowchart LR
    accTitle: Strict (SSL-Only Origin Pull) SSL/TLS Encryption
    accDescr: With an encryption mode of Strict (SSL-Only Origin Pull), all connections to the origin will always be made using SSL/TLS.
    A[Browser] <--Encrypted--> B((Cloudflare))<--Encrypted--> C[("Origin server (verified) #9989;")]
```

## Use when

You want the most secure configuration available for your origin, you are an Enterprise customer, and you meet the requirements for Full (strict) mode.

## Required setup

The setup is generally the same as Full (strict) mode, but you select Strict (SSL-Only Origin Pull) for your encryption mode.

Note

In addition to Strict (SSL-Only Origin Pull) encryption, you can also set up Authenticated Origin Pulls to ensure all requests to your origin are evaluated before receiving a response.

### Process

- Dashboard
- API

To change your encryption mode in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS.
3. Choose an encryption mode.

To adjust your encryption mode with the API, send a PATCH request with ssl as the setting name in the URI path, and the value parameter set to your desired setting (off, flexible, full, strict, or origin_pull).

## Limitations

Depending on your origin configuration, you may have to adjust settings to avoid Mixed Content errors or redirect loops.

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

## SSL/TLS Recommender

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/ssl-tls-recommender/](https://developers.cloudflare.com/ssl/origin-configuration/ssl-tls-recommender/)

Page options # SSL/TLS Recommender

The SSL/TLS Recommender helps you choose which Encryption mode is best for your application.

Warning

Cloudflare is deprecating our SSL/TLS Recommender in favor of Automatic SSL/TLS.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Common tasks

### Enable SSL/TLS recommendations

To make sure you do not inadvertently block the SSL/TLS Recommender, review your settings to make sure your domain:

- Is accessible.
- Is not blocking requests from our bot (which uses a user agent of Cloudflare-SSLDetector).
- Does not have any active, SSL-specific Page Rules or Configuration rules.

Then, you can enable the SSL/TLS recommender.

- Dashboard
- API

To enable SSL/TLS recommendations in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and application.
2. Go to SSL/TLS.
3. For SSL/TLS Recommender, switch the toggle to On.

To adjust your SSL/TLS Recommender enrollment with the API, send a PATCH request with the enabled parameter set to your desired setting (true or false).

### Manually trigger a new scan

Once you enable it, the recommender runs future scans periodically — typically every two days — and sends notifications if new recommendations become available.

To manually re-trigger a new scan, disable and then re-enable SSL/TLS recommendations.

## How it works

Once enabled, the SSL/TLS Recommender runs an origin scan using the user agent Cloudflare-SSLDetector and ignores your robots.txt file (except for rules explicitly targeting the user agent).

Based on this initial scan, the Recommender may decide that you could use a stronger SSL encryption mode. It will never recommend a weaker option than what is currently configured.

If so, it will send the application owner an email with the recommended option and add a Recommended by Cloudflare tag to that option on the SSL/TLS page. You are not required to use this recommendation.

If you do not receive an email, keep your current SSL encryption mode.

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

## Cloudflare origin CA

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)

Page options # Cloudflare origin CA

If your origin only receives traffic from proxied records, use Cloudflare origin CA certificates to encrypt traffic between Cloudflare and your origin web server and reduce bandwidth consumption. Once deployed, these certificates are compatible with Strict SSL mode.

For more background information on origin CA certificates, refer to the introductory blog post ↗.

Note

Using Cloudflare origin CA certificates does not prevent you from using delegated DCV.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Deploy an Origin CA certificate

### 1. Create an Origin CA certificate

To create an Origin CA certificate in the dashboard:

1. Log in to the Cloudflare dashboard and select an account.
2. Choose a domain.
3. Go to SSL/TLS > Origin Server.
4. Select Create Certificate.
API Access requiredUsers who do not have API Access ↗ will receive an error while trying to perform this action. Refer to Troubleshooting for guidance.
5. Choose either:

Generate private key and CSR with Cloudflare: Private key type can be RSA or ECC.
Use my private key and CSR: Paste the Certificate Signing Request into the text field.
6. Generate private key and CSR with Cloudflare: Private key type can be RSA or ECC.
7. Use my private key and CSR: Paste the Certificate Signing Request into the text field.
8. List the hostnames (including wildcards) the certificate should protect with SSL encryption. The zone apex and first level wildcard hostname are included by default.
9. Choose a Certificate Validity period.
10. Select Create.
11. Choose the Key Format:

Servers using OpenSSL — like Apache and NGINX — generally expect PEM files (Base64-encoded ASCII), but also work with binary DER files.
Servers using Windows and Apache Tomcat require PKCS#7 (a .p7b file).
12. Servers using OpenSSL — like Apache and NGINX — generally expect PEM files (Base64-encoded ASCII), but also work with binary DER files.
13. Servers using Windows and Apache Tomcat require PKCS#7 (a .p7b file).
14. Copy the signed Origin Certificate and Private Key into separate files. For security reasons, you cannot see the Private Key after you exit this screen.
15. Select OK.

Note

For details about working with certificates programmatically, refer to API calls.

### 2. Install Origin CA certificate on origin server

To add an Origin CA certificate to your origin web server

1. Upload the Origin CA certificate (created in Step 1) to your origin web server.
2. Update your web server configuration:

- Apache httpd ↗
- GoDaddy Hosting ↗
- Microsoft IIS 7 ↗
- Microsoft IIS 8 and 8.5 ↗
- Microsoft IIS 10 ↗
- NGINX ↗
- Apache Tomcat ↗
- Amazon Web Services ↗
- Apache cPanel ↗
- Ubuntu Server with Apache2 ↗

Note

If you do not see your server in the list above, search the DigiCert documentation ↗ or contact your hosting provider, web admin, or server vendor.

1. (Required for some) Upload the Cloudflare CA root certificate to your origin server. This can also be referred to as the certificate chain.
2. Enable SSL and port 443 at your origin web server.

### 3. Change SSL/TLS mode

After you have installed the Origin CA certificate on your origin web server, update the SSL/TLS encryption mode for your application.

If all your origin hosts are protected by Origin CA certificates or publicly trusted certificates:

1. Go to SSL/TLS.
2. For SSL/TLS encryption mode, select Full (strict).

If you have origin hosts that are not protected by certificates, set the SSL/TLS encryption mode for a specific application to Full (strict) by using a Page Rule.

Warning

Site visitors may see untrusted certificate errors if you pause Cloudflare or disable proxying on subdomains that use Cloudflare origin CA certificates. These certificates only encrypt traffic between Cloudflare and your origin server, not traffic from client browsers to your origin.

## Revoke an Origin CA certificate

If you misplace your key material or do not want a certificate to be trusted, you may want to revoke your certificate. You cannot undo this process.

To prevent visitors from seeing warnings about an insecure certificate, you may want to set your SSL/TLS encryption to Full or Flexible before revoking your certificate. Do this globally via the Cloudflare dashboard ↗ or for a specific hostname via a Page Rule.

To revoke a certificate:

1. Log in to the Cloudflare dashboard and select an account.
2. Choose a domain.
3. Go to SSL/TLS > Origin Server.
4. In Origin Certificates, choose a certificate.
5. Select Revoke.

## Additional details

### Cloudflare Origin CA root certificate

Some origin web servers require upload of the Cloudflare Origin CA root certificate or certificate chain. Use the following links to download either an ECC or an RSA version and upload to your origin web server:

- Cloudflare Origin ECC PEM (do not use with Apache cPanel)
- Cloudflare Origin RSA PEM

### Hostname and wildcard coverage

Certificates may be generated with up to 200 individual Subject Alternative Names (SANs). A SAN can take the form of a fully-qualified domain name (www.example.com) or a wildcard (*.example.com). You cannot use IP addresses as SANs on Cloudflare origin CA certificates.

Wildcards may only cover one level, but can be used multiple times on the same certificate for broader coverage (for example, *.example.com and *.secure.example.com may co-exist).

## API calls

To automate processes involving Origin CA certificates, use the following API calls. To authenticate, use either Origin CA Keys or an API token with Permissions that include Zone-SSL and Certificates-Edit.

| Operation | Method | Endpoint |
| --- | --- | --- |
| List certificates | GET | certificates?zone_id=<<ZONE_ID>> |
| Create certificate | POST | certificates |
| Get certificate | GET | certificates/<<ID>> |
| Revoke certificate | DELETE | certificates/<<ID>> |

## Troubleshooting

If you find NET::ERR_CERT_AUTHORITY_INVALID or other issues after setting up Cloudflare origin CA, refer to troubleshooting.

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

## Troubleshooting Cloudflare origin CA

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/troubleshooting/](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/troubleshooting/)

Page options # Troubleshooting Cloudflare origin CA

Consider the following common issues and troubleshooting steps when using Cloudflare origin CA.

## NET::ERR_CERT_AUTHORITY_INVALID

### Cause

Site visitors may see untrusted certificate errors if you pause Cloudflare or disable proxying on subdomains that use Cloudflare origin CA certificates. These certificates only encrypt traffic between Cloudflare and your origin server, not traffic from client browsers to your origin.

This also means that SSL Labs or similar SSL validators are expected to flag the certificate as invalid.

### Solutions

- Make sure the proxy status of your DNS records and any page rules (if existing) are set up correctly. If so, you can try to turn proxying off and then on again and wait a few minutes.
- If you must have direct connections between clients and your origin server, consider installing a publicly trusted certificate at your origin instead. This process is done outside of Cloudflare, where you should issue the certificate directly from a certificate authority (CA) of your choice. You can still use Full (strict) encryption mode, as long as the CA is listed on the Cloudflare trust store ↗.

## The issuer of this certificate could not be found

### Cause

Some origin web servers require that you upload the Cloudflare origin CA root certificate or certificate chain.

### Solution

Use the following links to download either an ECC or an RSA version and upload to your origin web server:

- Cloudflare Origin ECC PEM (do not use with Apache cPanel)
- Cloudflare Origin RSA PEM

## The certificate is not trusted in all web browsers

### Cause

Apache cPanel requires that you upload the Cloudflare origin CA root certificate or certificate chain.

### Solution

Use the following link to download an RSA version of the root certificate and upload it to your origin web server:

- Cloudflare Origin RSA PEM

## This zone is either not part of your account, or you do not have access to it

When trying to generate an Origin CA on the dashboard, you find the error Failed to validate requested hostname <hostname>: This zone is either not part of your account, or you do not have access to it.

### Cause

This is a known issue where, whilst being created on the Cloudflare dashboard, Origin CA requires API access for the user creating the origin certificate.
If the user does not have API Access, this error is returned.

### Solution

Make sure that the user creating the certificate has access to the API. You can check in the account Members page.

Go to Manage Account - The default setting for the account is specified in the card Enable API Access.
- Specific user API Access (which can override the default setting) is presented after selecting the user in the list of members.

## Origin Server page displays origin certificates for another zone in the account

### Cause

This is a known issue where, when the Origin Server page is opened for different zones in sequence, it displays the certificates from the first zone.

### Solution

Refresh the page in your browser to get the correct origin certificates list for current zone.

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

## Authenticated Origin Pulls (mTLS)

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/)

Page options # Authenticated Origin Pulls (mTLS)

Authenticated Origin Pulls (AOP) helps ensure requests to your origin server come from the Cloudflare network, which provides an additional layer of security on top of Full or Full (strict) encryption modes.

This authentication becomes particularly important with the Cloudflare Web Application Firewall (WAF). Together with the WAF, you can make sure that all traffic is evaluated before receiving a response from your origin server.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Aspects to consider

Although Cloudflare provides you a certificate to easily configure zone-level authenticated origin pulls, this certificate is not exclusive to your account and only guarantees that a request is coming from the Cloudflare network. If you want more strict security, you should consider additional security measures for your origin and upload your own certificate when setting up Authenticated Origin Pulls.

Using a custom certificate is possible with both zone-level and per-hostname authenticated origin pulls and is required if you need your domain to be FIPS ↗ compliant.

## Limitations

Authenticated Origin Pulls does not apply when your SSL/TLS encryption mode is set to Off or Flexible.

## Related topics

- SSL/TLS Encryption Modes
- Cloudflare Tunnel

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

## About

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/explanation/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/explanation/)

Page options # About

## Simple explanation

When visitors request content from your domain, Cloudflare first attempts to serve content from the cache. If this attempt fails, Cloudflare sends a request — or an origin pull — back to your origin web server to get the content.

Authenticated Origin Pulls makes sure that all of these origin pulls come from Cloudflare. Put another way, Authenticated Origin Pulls ensures that any HTTPS requests outside of Cloudflare will not receive a response from your origin.

This block also applies for requests to unproxied DNS records in Cloudflare.

Warning

Note that the certificate Cloudflare provides for you to set up Authenticated Origin Pulls is not exclusive to your account, only guaranteeing that a request is coming from the Cloudflare network.

For more strict security, you should set up Authenticated Origin Pulls with your own certificate and consider other security measures for your origin.

## Detailed explanation

Cloudflare enforces authenticated origin pulls by adding an extra layer of TLS client certificate authentication when establishing a connection between Cloudflare and the origin web server.

For more details, refer to the introductory blog post ↗.

### Types of handshakes

For more details, refer to What is a TLS handshake? ↗.

Standard TLS handshake

Client authenticated TLS handshake

### Comparison diagrams

Without Authenticated Origin Pulls, Cloudflare performs standard TLS handshakes between a client device and Cloudflare and Cloudflare and your origin.
This is true even if you have Full or Full (strict) encryption modes enabled.

```
flowchart TD
      accTitle: Connection diagram without Authenticated Origin Pulls
      A[End user query for <code>example.com</code>] --Standard TLS Handshake--> B[Cloudflare network]
      B --Standard TLS Handshake--> C[Origin server]
      D[External device] --Standard TLS Handshake ----> C
```

This lack of authentication means that - even if your origin is protected behind Cloudflare - attackers with your origin's IP address will still receive a response from your origin for HTTPS requests.

With Authenticated Origin Pulls, Cloudflare performs standard TLS handshakes between a client device and Cloudflare, but a client-authenticated TLS handshake between Cloudflare and your origin.

```
flowchart TD
      accTitle: Connection diagram with Authenticated Origin Pulls
      A[End user query for <code>example.com</code>] --Standard TLS Handshake--> B[Cloudflare network]
      B --Client authenticated TLS Handshake--> C[Origin server]
      D[External device] --Standard TLS Handshake -----x C
```

This additional layer of authentication ensures that any HTTPS requests outside of Cloudflare will not receive a response from your origin.

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

## AWS integration

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/aws-alb-integration/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/aws-alb-integration/)

Page options # AWS integration

This guide will walk you through how to set up per-hostname authenticated origin pulls to securely connect to an AWS Application Load Balancer using mutual TLS verify ↗.

You can also find instructions on how to rollback this setup in Cloudflare.

## Before you begin

- You should already have your AWS account and EC2 ↗ configured.
- Note that this tutorial uses command-line interface (CLI) to generate a custom certificate, and API calls to configure Cloudflare Authenticated Origin Pulls.
- For the most up-to-date documentation on how to set up AWS, refer to the AWS documentation ↗.

## 1. Generate a custom certificate

1. Run the following command to generate a 4096-bit RSA private key, using AES-256 encryption. Enter a passphrase when prompted.

Terminal window ```
openssl genrsa -aes256 -out rootca.key 4096
```

1. Create the CA root certificate. When prompted, fill in the information to be included in the certificate. For the Common Name field, use the domain name as value, not the hostname.

Terminal window ```
openssl req -x509 -new -nodes -key rootca.key -sha256 -days 1826 -out rootca.crt
```

1. Create a Certificate Signing Request (CSR). When prompted, fill in the information to be included in the request. For the Common Name field, use the hostname as value.

Terminal window ```
openssl req -new -nodes -out cert.csr -newkey rsa:4096 -keyout cert.key
```

1. Sign the certificate using the rootca.key and rootca.crt created in previous steps.

Terminal window ```
openssl x509 -req -in cert.csr -CA rootca.crt -CAkey rootca.key -CAcreateserial -out cert.crt -days 730 -sha256 -extfile ./cert.v3.ext
```

1. Make sure the certificate extensions file cert.v3.ext specifies the following:

```
basicConstraints=CA:FALSE
```

## 2. Configure AWS Application Load Balancer

1. Upload the rootca.cert to an S3 bucket ↗.
2. Create a trust store ↗ at your EC2 console, indicating the S3 URI where you uploaded the certificate.
3. Create an EC2 instance and install an HTTPD daemon. Choose an instance type ↗ according to your needs - it can be a minimal instance eligible to AWS Free Tier ↗. This tutorial was based on an example using t2.micro and Amazon Linux 2023 ↗.

Terminal window ```
sudo yum install -y httpdsudo systemctl start httpd
```

1. Create a target group ↗ for your Application Load Balancer.

Choose Instances as target type.
Specify port HTTP/80.
2. Choose Instances as target type.
3. Specify port HTTP/80.
4. After you finish configuring the target group, confirm that the target group is healthy ↗.
5. Configure a load balancer and a listener ↗.

Choose the Internet-facing scheme.
Switch the listener to port 443 so that the mTLS option is available, and select the target group created in previous steps.
For Default SSL/TLS server certificate, choose Import certificate > Import to ACM, and add the certificate private key and body.
Under Client certificate handling, select Verify with trust store.
6. Choose the Internet-facing scheme.
7. Switch the listener to port 443 so that the mTLS option is available, and select the target group created in previous steps.
8. For Default SSL/TLS server certificate, choose Import certificate > Import to ACM, and add the certificate private key and body.
9. Under Client certificate handling, select Verify with trust store.
10. Save your settings.
11. (Optional) Run the following commands to confirm that the Application Load Balancing is asking for the client certificate.

Terminal window ```
openssl s_client -verify 5 -connect <your-application-load-balancer>:443 -quiet -state
```

Since you have not yet uploaded the certificate to Cloudflare, the connection should fail (read:errno=54, for example).

You can also run curl --verbose and confirm Request CERT (13) is present within the SSL/TLS handshake:

Terminal window ```
curl --verbose https://<your-application-load-balancer>...* TLSv1.2 (IN), TLS handshake, Request CERT (13):...
```

## 3. Configure Cloudflare

1. Upload the certificate you created in Step 1 to Cloudflare. You should use the leaf certificate, not the root CA.

Terminal window ```
MYCERT="$(cat cert.crt|perl -pe 's/\r?\n/\\n/'|sed -e 's/..$//')"MYKEY="$(cat cert.key|perl -pe 's/\r?\n/\\n/'|sed -e's/..$//')"
request_body=$(< <(cat <<EOF{"certificate": "$MYCERT","private_key": "$MYKEY","bundle_method":"ubiquitous"}EOF))
# Push the certificate
curl --silent \"https://api.cloudflare.com/client/v4/zones/$ZONEID/origin_tls_client_auth/hostnames/certificates" \--header "Content-Type: application/json" \--header "X-Auth-Email: $MYAUTHEMAIL" \--header "X-Auth-Key: $MYAUTHKEY" \--data "$request_body"
```

2.Associate the certificate with the hostname that should use it.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Enable or Disable a Hostname for Client Authentication ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/origin_tls_client_auth/hostnames" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "config": [        {            "enabled": true,            "cert_id": "<CERT_ID>",            "hostname": "<YOUR_HOSTNAME>"        }    ]  }'
```

1. Enable the Authenticated Origin Pulls feature on your zone.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write

Edit zone setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/tls_client_auth" \  --request PATCH \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": "on"  }'
```

Note

Make sure your encryption mode is set to Full or higher. If you only want to adjust this setting for a specific hostname, use Configuration Rules.

## Rollback the Cloudflare configuration

1. Use a PUT request to disable Authenticated Origin Pulls on the hostname.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Enable or Disable a Hostname for Client Authentication ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/origin_tls_client_auth/hostnames" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "config": [        {            "enabled": false,            "cert_id": "<CERT_ID>",            "hostname": "<YOUR_HOSTNAME>"        }    ]  }'
```

1. (Optional) Use a GET request to obtain a list of the client certificate IDs. You will need the ID of the certificate you want to remove for the following step.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write
- SSL and Certificates Read

List Certificates ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/origin_tls_client_auth/hostnames/certificates" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

1. Use the Delete hostname client certificate endpoint to remove the certificate you had uploaded.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Delete Hostname Client Certificate ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/origin_tls_client_auth/hostnames/certificates/$CERTIFICATE_ID" \  --request DELETE \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
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

## Zone-level

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/)

Page options # Zone-level

When you enable Authenticated Origin Pulls (AOP) for a zone, all proxied traffic to your zone is authenticated at the origin web server.

## Before you begin

Make sure your zone is using an SSL/TLS encryption mode of Full or higher.

Warning

Zone-level AOP certificates are also applied to custom hostnames configured on a Cloudflare for SaaS zone.
If you need a different AOP certificate to apply to different custom hostnames, use Per-hostname AOP.

## 1. Upload certificate to origin

First, upload a certificate to your origin.

To use a Cloudflare certificate (which uses a specific CA), download the .PEM file and upload it to your origin. This certificate is not the same as the Cloudflare origin CA certificate and will not appear on your Dashboard.

To use a custom certificate, follow the API instructions to upload a custom certificate to Cloudflare, but use the origin_tls_client_auth endpoint. Then, upload the certificate to your origin.

Warning

Although Cloudflare provides you a certificate to easily configure zone-level authenticated origin pulls, this certificate is not exclusive to your account and only guarantees that a request is coming from the Cloudflare network. If you want more strict security, you should upload your own certificate.

Using a custom certificate is required if you need your domain to be FIPS ↗ compliant.

## 2. Configure origin to accept client certificates

With the certificate installed, set up your origin web server to accept client certificates.

Check the examples below for Apache and NGINX or refer to your origin web server documentation - e.g. HAProxy ↗, Traefik ↗, Caddy ↗.

Apache example

```
SSLVerifyDepth 1SSLCACertificateFile /path/to/origin-pull-ca.pem
```

For this example, you would have saved your certificate to /path/to/origin-pull-ca.pem.

To use the Cloudflare certificate, download it from step 1 above, rename the .PEM file, and then upload it to `/path/to/origin-pull-ca.pem` before applying the settings. NGINX example

```
ssl_verify_client optional;ssl_client_certificate /etc/nginx/certs/cloudflare.crt;
```

For this example, you would have saved your certificate to /etc/nginx/certs/cloudflare.crt.

To use the Cloudflare certificate, download it from step 1 above, rename the .PEM file, and then upload it to `/etc/nginx/certs/cloudflare.crt` before applying the settings. At this point, you may also want to enable logging on your origin so that you can verify the configuration is working.

## 3. Configure Cloudflare to use client certificate

Then, enable the Authenticated Origin Pulls feature as an option for your Cloudflare zone.

This step sets the TLS Client Auth to require Cloudflare to use a client certificate when connecting to your origin server.

- Dashboard
- API

To enable Authenticated Origin Pulls in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Origin Server.
3. For Authenticated Origin Pulls, switch the toggle to On.

Warning

Note that this step means Authenticated Origin Pulls will be available, but you still have to go through the following steps to complete the configuration.

To enable or disable Authenticated Origin Pulls with the API, send a PATCH request with tls_client_auth as the setting name in the URI path, and the value parameter set to your desired setting ("on" or "off").

Warning

Note that this step means Authenticated Origin Pulls will be available, but you still have to go through the following steps to complete the configuration.

## 4. Enable Authenticated Origin Pulls for all hostnames in a zone

Use the Cloudflare API to send a PUT request to enable zone-level authenticated origin pulls.

If you had set up logging on your origin during step 2, test and confirm that Authenticated Origin Pulls is working.

## 5. Enforce validation check on your origin

Once you can confirm everything is working as expected for your specific origin setup, configure your origin to enforce the authentication.

Apache example

```
SSLVerifyClient require
```

NGINX example

```
ssl_verify_client on;
```

After completing the process, you can use curl to send requests directly to your origin IPs, verifying that the requests fail due to certificate validation being enforced.

## 6. (Optional) Set up alerts for zone-level Authenticated Origin Pulls certificates

You can configure alerts to receive notifications before your AOP certificates expire.

Zone-level Authenticated Origin Pulls Certificate Expiration Alert

Who is it for? Customers that upload their own certificate to use with zone-level Authenticated Origin Pull (AOP) to secure connections from Cloudflare to their origin server.
AOP certificate expiration notifications are sent 30 days and 14 days before the certificate expiry.

Other options / filters None.

Included with Authenticated Origin Pull.

What should you do if you receive one? Upload a renewed certificate to use for zone-level AOP.

Refer to Cloudflare Notifications for more information on how to set up an alert.

## Further options

Refer to Manage certificates for further options.

Note

If you have more than one custom certificate, Cloudflare serves the certificate you uploaded first. Follow these steps if you need to replace the certificate.

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

## Per-hostname

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/per-hostname/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/per-hostname/)

Page options # Per-hostname

When you enable Authenticated Origin Pulls per hostname, all proxied traffic to the specified hostname is authenticated at the origin web server. You can use client certificates from your Private PKI to authenticate connections from Cloudflare.

## Before you begin

Warning

It is not possible to set up per-hostname authenticated origin pulls with the Cloudflare certificate.

Refer to the steps below for an example of how to generate a custom certificate using OpenSSL. The CA root certificate that you use to issue the custom certificate should be the same CA that you will upload to your origin.

OpenSSL example

1. Run the following command to generate a 4096-bit RSA private key, using AES-256 encryption. Enter a passphrase when prompted.

Terminal window ```
openssl genrsa -aes256 -out rootca.key 4096
```

1. Create the CA root certificate. When prompted, fill in the information to be included in the certificate. For the Common Name field, use the domain name as value, not the hostname.

Terminal window ```
openssl req -x509 -new -nodes -key rootca.key -sha256 -days 1826 -out rootca.crt
```

1. Create a Certificate Signing Request (CSR). When prompted, fill in the information to be included in the request. For the Common Name field, use the hostname as value.

Terminal window ```
openssl req -new -nodes -out cert.csr -newkey rsa:4096 -keyout cert.key
```

1. Sign the certificate using the rootca.key and rootca.crt created in previous steps.

Terminal window ```
openssl x509 -req -in cert.csr -CA rootca.crt -CAkey rootca.key -CAcreateserial -out cert.crt -days 730 -sha256 -extfile ./cert.v3.ext
```

1. Make sure the certificate extensions file cert.v3.ext specifies the following:

```
basicConstraints=CA:FALSE
```

## 1. Upload custom certificate

Use the /origin_tls_client_auth/hostnames/certificates endpoint to upload your custom certificate.

Note

You must upload a leaf certificate. If you upload a root CA instead, the API will return a missing leaf certificate error.

Terminal window ```
MYCERT="$(cat cert.crt|perl -pe 's/\r?\n/\\n/'|sed -e 's/..$//')"MYKEY="$(cat cert.key|perl -pe 's/\r?\n/\\n/'|sed -e's/..$//')"
request_body=$(< <(cat <<EOF{"certificate": "$MYCERT","private_key": "$MYKEY","bundle_method":"ubiquitous"}EOF))
# Push the certificate
curl --silent \"https://api.cloudflare.com/client/v4/zones/$ZONEID/origin_tls_client_auth/hostnames/certificates" \--header "Content-Type: application/json" \--header "X-Auth-Email: $MYAUTHEMAIL" \--header "X-Auth-Key: $MYAUTHKEY" \--data "$request_body"
```

In the API response, save the certificate id since it will be required in step 4.

## 2. Configure origin to accept client certificates

With the certificate installed, set up your origin web server to accept client certificates.

Check the examples below for Apache and NGINX or refer to your origin web server documentation - e.g. HAProxy ↗, Traefik ↗, Caddy ↗.

Apache example

```
SSLVerifyDepth 1SSLCACertificateFile /path/to/origin-pull-ca.pem
```

For this example, you would have saved your certificate to /path/to/origin-pull-ca.pem.

NGINX example

```
ssl_verify_client optional;ssl_client_certificate /etc/nginx/certs/cloudflare.crt;
```

For this example, you would have saved your certificate to /etc/nginx/certs/cloudflare.crt.

At this point, you may also want to enable logging on your origin so that you can verify the configuration is working.

## 3. Enable Authenticated Origin Pulls (globally)

Then, enable the Authenticated Origin Pulls feature as an option for your Cloudflare zone.

This step sets the TLS Client Auth to require Cloudflare to use a client certificate when connecting to your origin server.

- Dashboard
- API

To enable Authenticated Origin Pulls in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Origin Server.
3. For Authenticated Origin Pulls, switch the toggle to On.

Warning

Note that this step means Authenticated Origin Pulls will be available, but you still have to go through the following steps to complete the configuration.

To enable or disable Authenticated Origin Pulls with the API, send a PATCH request with tls_client_auth as the setting name in the URI path, and the value parameter set to your desired setting ("on" or "off").

Warning

Note that this step means Authenticated Origin Pulls will be available, but you still have to go through the following steps to complete the configuration.

## 4. Enable Authenticated Origin Pulls for the hostname

Use the Cloudflare API to send a PUT request to enable Authenticated Origin Pulls for specific hostnames.

If you had set up logging on your origin during step 2, test and confirm that Authenticated Origin Pulls is working.

## 5. Enforce validation check on your origin

Once you can confirm everything is working as expected for your specific origin setup, configure your origin to enforce the authentication.

Apache example

```
SSLVerifyClient require
```

NGINX example

```
ssl_verify_client on;
```

After completing the process, you can use curl to send requests directly to your origin IPs, verifying that the requests fail due to certificate validation being enforced.

## 6. (Optional) Set up alerts for hostname-level Authenticated Origin Pulls certificates

You can configure alerts to receive notifications before your AOP certificates expire.

Hostname-level Authenticated Origin Pulls Certificate Expiration Alert

Who is it for? Customers that upload their own certificate to use with hostname-level Authenticated Origin Pull (AOP) to secure connections from Cloudflare to their origin server.
AOP certificate expiration notifications are sent 30 days and 14 days before the certificate expiry.

Other options / filters None.

Included with Authenticated Origin Pull.

What should you do if you receive one? Upload a renewed certificate to use for hostname-level AOP.

Refer to Cloudflare Notifications for more information on how to set up an alert.

## Further options

Refer to Manage certificates for further options.

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

## Manage certificates

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/manage-certificates/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/manage-certificates/)

Page options # Manage certificates

Refer to the following sections to learn how to manage certificates used with the different Authenticated Origin Pulls setups.

## Use specialized certificates

To apply different client certificates simultaneously at both the zone and hostname level, you can combine zone-level and per-hostname custom certificates.

First set up zone-level pulls using a certificate. Then, upload multiple, specialized certificates for individual hostnames.

Note

Since per-hostname certificates are more specific, they take precedence over zone certificates.

## Delete a certificate

Client certificates are not deleted from Cloudflare upon expiration unless a delete or replace request is sent to the Cloudflare API.

However, requests are dropped at your origin if your origin only accepts a valid client certificate.

## Replace a client cert (without downtime)

### Per-hostname

1. Upload the new certificate.
2. List your certificates and note the ID for the certificate you uploaded.
3. Enable Authenticated Origin Pulls for the specific hostname, using the ID obtained in step 2 to specify the certificate you want to use:

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Enable or Disable a Hostname for Client Authentication ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/origin_tls_client_auth/hostnames" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "config": [        {            "enabled": true,            "hostname": "<HOSTNAME>",            "cert_id": "<CERT_ID>"        }    ]  }'
```

### Zone-level

1. Upload the new certificate.
2. Check whether new certificate is Active.
3. Once certificate is active, delete the previous certificate.

Note

If you keep both certificates, the API will state active for both but the most recently deployed certificate will be the one enabled and used.

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

## Custom Origin Trust Store

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/custom-origin-trust-store/](https://developers.cloudflare.com/ssl/origin-configuration/custom-origin-trust-store/)

Page options # Custom Origin Trust Store

By default, Cloudflare's global network maintains a list of publicly trusted certificate authorities. This means that when using Full (strict) encryption mode, Cloudflare will only trust origin server certificates issued by a CA in this trust store.

Custom Origin Trust Store allows you to upload certificate authorities (CAs) that Cloudflare will use to authenticate connections to your origin server. Use this feature to override the default trust store with your preferred CA or CAs.

When a CA has been uploaded to Custom Origin Server Trust Store, Cloudflare will ignore all default publicly trusted CAs and exclusively use the CA or CAs that have been uploaded to authenticate the origin server.

## Availability

To get access to Custom Origin Trust Store, you need to have Advanced Certificate Manager enabled on your zone.

## How to

To manage origin trust stores in the dashboard, go to SSL/TLS > Origin Server and use the Custom Origin Trust Store card.

To manage origin trust stores using the API, refer to the API commands.

## Limitations

With Full (strict) encryption mode enabled, if your uploaded CA expires and no alternative CAs are valid within the trust store, Cloudflare will not be able to properly authenticate connections to the origin server.

## API commands

| Command | Method | Endpoint |
| --- | --- | --- |
| Create custom origin trust store | POST | /zones/<ZONE_ID>/acm/custom_trust_store |
| List custom origin trust stores | GET | /zones/<ZONE_ID>/acm/custom_trust_store |
| Get custom origin trust store | GET | /zones/<ZONE_ID>/acm/custom_trust_store/<ID> |
| Delete custom origin trust store | DELETE | /zones/<ZONE_ID>/acm/custom_trust_store/<ID> |

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

## Cipher suites

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/cipher-suites/](https://developers.cloudflare.com/ssl/origin-configuration/cipher-suites/)

Page options # Cipher suites

Refer to the following list to know what cipher suites Cloudflare presents to origin servers during an SSL/TLS handshake.

Note

Refer to cipher suites supported at Cloudflare's global network to know what cipher suites Cloudflare presents to browsers and other user agents.

The list order is based on how the cipher suites appear in the ClientHello ↗, communicating Cloudflare's preference.

## Supported cipher suites by protocol

| Cipher name | TLS 1.0 | TLS 1.1 | TLS 1.2 | TLS 1.3 |
| --- | --- | --- | --- | --- |
| AEAD-AES128-GCM-SHA256 1 | ❌ | ❌ | ❌ | ✅ |
| AEAD-AES256-GCM-SHA384 1 | ❌ | ❌ | ❌ | ✅ |
| AEAD-CHACHA20-POLY1305-SHA256 1 | ❌ | ❌ | ❌ | ✅ |
| ECDHE-ECDSA-AES128-GCM-SHA256 | ❌ | ❌ | ✅ | ❌ |
| ECDHE-RSA-AES128-GCM-SHA256 | ❌ | ❌ | ✅ | ❌ |
| ECDHE-RSA-AES128-SHA | ✅ | ✅ | ✅ | ❌ |
| AES128-GCM-SHA256 | ❌ | ❌ | ✅ | ❌ |
| AES128-SHA | ✅ | ✅ | ✅ | ❌ |
| ECDHE-ECDSA-AES256-GCM-SHA384 | ❌ | ❌ | ✅ | ❌ |
| ECDHE-RSA-AES256-GCM-SHA384 | ❌ | ❌ | ✅ | ❌ |
| ECDHE-RSA-AES256-SHA384 | ❌ | ❌ | ✅ | ❌ |
| AES256-SHA | ✅ | ✅ | ✅ | ❌ |
| DES-CBC3-SHA | ✅ | ❌ | ❌ | ❌ |

### TLS 1.3 cipher suites

Although TLS 1.3 uses the same cipher suite space as previous versions of TLS, TLS 1.3 cipher suites are defined differently, only specifying the symmetric ciphers, and cannot be used for TLS 1.2 (RFC 8446 ↗).

Similarly, TLS 1.2 and lower cipher suites cannot be used with TLS 1.3. BoringSSL also hard-codes cipher preferences in the order above for TLS 1.3.

Based on BoringSSL, Cloudflare system will return the names listed above. However, the corresponding names defined in RFC 8446 ↗ are the following:

- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256

## Match on origin

Cloudflare will present the cipher suites to your origin and your server will select whichever cipher suite it prefers.

However, if you want to ensure that your origin server supports the same cipher suites that Cloudflare supports at our global network and you use NGINX ↗ for TLS termination on your origin, you can apply the following configuration:

```
ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;ssl_ecdh_curve X25519:P-256:P-384;ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-CHACHA20-POLY1305:ECDHE+AES128:RSA+AES128:ECDHE+AES256:RSA+AES256:ECDHE+3DES:RSA+3DES;ssl_prefer_server_ciphers on;
```

## Footnotes

1. Refer to TLS 1.3 cipher suites for details. ↩ ↩2 ↩3

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

## Client certificates (mTLS)

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/](https://developers.cloudflare.com/ssl/client-certificates/)

Page options # Client certificates (mTLS)

Use Cloudflare's public key infrastructure (PKI) to create client certificates, or bring your own CA for mTLS.

Mutual TLS (mTLS) authentication is a common security practice that uses client certificates to ensure traffic between client and server is bidirectionally secure and trusted. mTLS also allows requests that do not authenticate via an identity provider — such as Internet-of-things (IoT) devices — to demonstrate they can reach a given resource.

mTLS at Cloudflare

For a broader overview, refer to the mTLS at Cloudflare learning path.

## How it works

Client certificates issued from a given CA are installed on client devices that should be granted access. Then, for any host that has mTLS enabled, Cloudflare - acting as the server in this case - requires a certificate from the client trying to access the hostname.

Cloudflare then validates the client certificate against CAs set at account level. This means that these certificates can be used for validation across multiple zones/domains (example.com), as long as the zones are under the same Cloudflare account and mTLS has been enabled for the requested hosts (host.example.com).

The account-level CAs can be:

- The Cloudflare-managed CA: This is the default option. Certificates and hostname associations are listed on your dashboard ↗.
- BYOCA certificates: This is an API-only option, available on Enterprise accounts. Certificates and hostname associations are not listed on your dashboard ↗.

## Use cases

As explained in the mTLS learning path, there are different use cases and implementation options for mTLS. Consider the following links for specific guidance.

- Application security
- mTLS for Zero Trust (Cloudflare Access integration)
- mTLS with API Shield
- mTLS Workers binding

Apart from the mTLS Workers binding, any of the above implementations can use your own CA instead of the Cloudflare-managed one. Refer to Bring your own CA.

### mTLS and Workers

Use the mTLS Workers binding when you need your worker to present a client certificate to an external service. To authenticate requests from a client to your worker instead, refer to SSL/TLS > Client certificates ↗ and the regular mTLS for application security implementation.

```
flowchart LR
        accTitle: mTLS from client to worker versus mTLS from worker to external service
        accDescr: Diagram showing two different implementations that can be considered for mTLS with Cloudflare Workers.
        A[Client] <--App security mTLS--> B((Cloudflare))<--mTLS worker binding--> C[(External service)]
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

## Create a client certificate

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/create-a-client-certificate/](https://developers.cloudflare.com/ssl/client-certificates/create-a-client-certificate/)

Page options # Create a client certificate

To create a client certificate on the Cloudflare dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and zone/domain.
2. Go to SSL/TLS > Client Certificates.
3. Select Create Certificate and fill in the required fields. You can choose one of the following options:

- Generate a private key and Certificate Signing Request (CSR) with Cloudflare.
- Use your own private key and CSR. This option allows you to also label client certificates.
 Example OpenSSL command
 To generate and use your own CSR, you can run a command like the following:Terminal windowopenssl req -new -newkey rsa:2048 -nodes -keyout client1.key -out client1.csr -subj '/C=GB/ST=London/L=London/O=Organization/CN=CommonName'

Note

Client certificates created on the dashboard are issued by a Cloudflare-managed CA. If you need to use certificates issued by another CA, use the API to bring your own CA instead.

1. Select a value for Certificate Validity, and choose Create.
2. Make sure to copy the certificate and private key as they will no longer be displayed after creation.
3. Select OK to confirm.

## Next steps

After creating the client certificate, make sure it is installed on the client devices and enable mTLS for each hostname that should require a certificate from clients.

Refer to our mTLS at Cloudflare learning path for further context.

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

## Enable mTLS

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/enable-mtls/](https://developers.cloudflare.com/ssl/client-certificates/enable-mtls/)

Page options # Enable mTLS

You can enable mutual Transport Layer Security (mTLS) for any hostname.

To enable mTLS for a host from the Cloudflare dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS > Client Certificates.
3. On the Hosts section of the Client Certificates card, select Edit.
4. Enter the name of a host in your current domain.

Note

The domain (example.com) is automatically appended for you. This means that, if you want to enable mTLS for abc.example.com, you only need to type abc.

1. Select Save to confirm.

## CAs in use

As explained in the Client certificates overview, Cloudflare validates client certificates against CAs set at account level. This means that these certificates can be used for validation across multiple zones/domains (example.com), as long as the zones are under the same Cloudflare account and you have enabled mTLS for the host.

Bring your own CA

If you need to use your own CA (instead of the Cloudflare Managed CA), refer to BYOCA. This is an API-only option, available on Enterprise accounts. In this case, certificates and hostname associations are not listed on your dashboard.

## Next steps

After enabling mTLS for your host, you can:

- Enforce mTLS with a WAF custom rule. Select Create mTLS Rule on the dashboard to use a template, or refer to our mTLS at Cloudflare learning path for further guidance.
- Enforce mTLS with API Shield. While API Shield is not required to use mTLS, many teams may use mTLS to protect their APIs.

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

## Bring your own CA for mTLS

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/byo-ca/](https://developers.cloudflare.com/ssl/client-certificates/byo-ca/)

Page options # Bring your own CA for mTLS

This page explains how you can manage client certificates that have not been issued by Cloudflare CA. For a broader overview, refer to the mTLS at Cloudflare learning path.

Bring your own CA (BYOCA) is especially useful if you already have mTLS implemented and client certificates are already installed on devices.

## Availability

- Currently, you can only manage your uploaded CA via API, and the hostname associations are not reflected on the dashboard ↗.
- This process is only available on Enterprise accounts.
- Each Enterprise account can upload up to five CAs. This quota does not apply to CAs uploaded through Cloudflare Access.

## CA certificate requirements

- The CA certificate can be from a publicly trusted CA or self-signed.
- In the certificate Basic Constraints, the attribute CA must be set to TRUE.
- The certificate must use one of the signature algorithms listed below:
 Allowed signature algorithms
 x509.SHA1WithRSAx509.SHA256WithRSAx509.SHA384WithRSAx509.SHA512WithRSAx509.ECDSAWithSHA1x509.ECDSAWithSHA256x509.ECDSAWithSHA384x509.ECDSAWithSHA512

Note

Uploading the CA private key is only required if you wish to use Zero Trust's block page. For more context on how mTLS works, refer to our Learning Center ↗.

## Set up mTLS with your CA

1. Use the Upload mTLS certificate endpoint to upload the CA root certificate.

- ca boolean required

Set to true to indicate that the certificate is a CA certificate.
- Set to true to indicate that the certificate is a CA certificate.
- certificates string required

Insert content from the .pem file associated with the CA certificate, formatted as a single string with \n replacing the line breaks.
- Insert content from the .pem file associated with the CA certificate, formatted as a single string with \n replacing the line breaks.
- name string optional

Indicate a unique name for your CA certificate.
- Indicate a unique name for your CA certificate.

1. Take note of the certificate ID (id) that is returned in the API response.
2. Use the Replace Hostname Associations endpoint to enable mTLS in each hostname that should use the CA for mTLS validation. Use the following parameters:

- hostnames array required


List the hostnames that will be using the CA for client certificate validation.
WarningSubmitting an empty array will remove all hostnames associations.
- List the hostnames that will be using the CA for client certificate validation.
WarningSubmitting an empty array will remove all hostnames associations.
- mtls_certificate_id string required


Indicate the certificate ID obtained from the previous step.
WarningIf no mtls_certificate_id is provided, the action will be performed against a Cloudflare Managed CA.
- Indicate the certificate ID obtained from the previous step.
WarningIf no mtls_certificate_id is provided, the action will be performed against a Cloudflare Managed CA.

1. (Optional) Since this process is API-only, and hostnames that use your uploaded CA certificate are not listed on the dashboard, you can make a GET request to confirm the CA hostname associations.
2. Create a custom rule to enforce client certificate validation.
You can do this via the dashboard or via API.

```
"expression": "(http.host in {\"<HOSTNAME_1>\" \"<HOSTNAME_2>\"} and not cf.tls_client_auth.cert_verified)",  "action": "block"
```

### Multiple CAs for one hostname

There can be multiple CAs (Cloudflare-managed or BYOCA) associated with the same hostname. For BYOCA certificates, the most recently deployed certificate will be prioritized.

If you wish to remove the association from the Cloudflare-managed certificate and only use your BYOCA certificate(s):

- Dashboard
- API

1. Log in to the Cloudflare dashboard ↗ and select your account and domain.
2. Go to SSL/TLS > Client Certificates.
3. On the Hosts section of the Client Certificates card, select Edit.
4. Select the cross next to the hostname you want to remove. The list of hostname associations will be updated.
5. Select Save to confirm.

1. List the hostname associations without the mtls_certificate_id parameter.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write
- SSL and Certificates Read

List Hostname Associations ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/certificate_authorities/hostname_associations" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

1. Copy the hostnames array returned by the API and update it, removing the hostname that should no longer use the Cloudflare-managed CA.
2. Use the Replace Hostname Associations endpoint without the mtls_certificate_id parameter to perform the action against the Cloudflare-managed CA. For hostnames use the list from the previous step.

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write

Replace Hostname Associations ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/certificate_authorities/hostname_associations" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "hostnames": [        "<UPDATED_HOSTNAME_ASSOCIATIONS>"    ]  }'
```

## Delete an uploaded CA

If you want to remove a CA that you have previously uploaded, you must first remove any hostname associations that it has.

1. Make a request to the Replace Hostname Associations endpoint, with an empty array for hostnames and specifying your CA certificate ID in mtls_certificate_id:

```
"hostnames": [],  "mtls_certificate_id": "<CERTIFICATE_ID>"
```

1. Use the Delete mTLS certificate endpoint to delete the certificate.

## List CA hostname associations

You can also use the API to list the hostname associations. Make sure you include the query parameter mtls_certificate_id, where mtls_certificate_id is the certificate ID of the uploaded CA (step 2 above).

Required API token permissions

At least one of the following token permissions is required: - SSL and Certificates Write
- SSL and Certificates Read

List Hostname Associations ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/certificate_authorities/hostname_associations?mtls_certificate_id=ID_FROM_STEP_2" \  --request GET \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
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

## Forward certificate to server

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/forward-a-client-certificate/](https://developers.cloudflare.com/ssl/client-certificates/forward-a-client-certificate/)

Page options # Forward certificate to server

Customers using Cloudflare Access also have the option to forward client certificates to their origin server.

## Forward a client certificate

In addition to enforcing mTLS authentication for your host, you can also forward a client certificate to your origin server as an HTTP header. This setup is often helpful for server logging.

To avoid adding the certificate to every single request, the certificate is only forwarded on the first request of an mTLS connection.

Warning

This process is only available on accounts with Cloudflare Access.

### Cloudflare API

The most common approach to forwarding a certificate is to use the Cloudflare API to update an mTLS certificate's hostname settings.

Required API token permissions

At least one of the following token permissions is required: - Access: Mutual TLS Certificates Write

Update an mTLS certificate's hostname settings ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/access/certificates/settings" \  --request PUT \  --header "X-Auth-Email: $CLOUDFLARE_EMAIL" \  --header "X-Auth-Key: $CLOUDFLARE_API_KEY" \  --json '{    "settings": [        {            "hostname": "<HOSTNAME>",            "china_network": false,            "client_certificate_forwarding": true        }    ]  }'
```

Once client_certificate_forwarding is set to true, every request within an mTLS connection will now include the following headers:

- Cf-Client-Cert-Der-Base64
- Cf-Client-Cert-Sha256

### Managed Transforms

You can also modify HTTP response headers using Managed Transforms to pass along TLS client auth headers.

### Cloudflare Workers

Additionally, Workers can provide details around the client certificate.

```
const tlsHeaders = {    'X-CERT-ISSUER-DN': request.cf.tlsClientAuth.certIssuerDN,    'X-CERT-SUBJECT-DN': request.cf.tlsClientAuth.certSubjectDN,    'X-CERT-ISSUER-DN-L': request.cf.tlsClientAuth.certIssuerDNLegacy,    'X-CERT-SUBJECT-DN-L': request.cf.tlsClientAuth.certSubjectDNLegacy,    'X-CERT-SERIAL': request.cf.tlsClientAuth.certSerial,    'X-CERT-FINGER': request.cf.tlsClientAuth.certFingerprintSHA1,    'X-CERT-VERIFY': request.cf.tlsClientAuth.certVerify,    'X-CERT-NOTBE': request.cf.tlsClientAuth.certNotBefore,    'X-CERT-NOTAF': request.cf.tlsClientAuth.certNotAfter};
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

## Label client certificates

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/label-client-certificate/](https://developers.cloudflare.com/ssl/client-certificates/label-client-certificate/)

Page options # Label client certificates

After creating client certificates at Cloudflare, it may be hard to differentiate the generated certificates.

## Root Cause

The option to generate private key and CSR with Cloudflare is meant for simpler cases and the certificates will be generated with just "CN=Cloudflare, C=US".

## Solution

If you need to differentiate client certificates for your clients on a per-organization basis, you can generate your own private key and CSR. When you generate the private key and CSR, you can then enter information that will be incorporated into your certificate request.

For example, if you run the following command (with OpenSSL installed):

Terminal window ```
openssl req -new -newkey rsa:2048 -nodes -keyout client1.key -out client1.csr
```

You can then specify:

```
Country Name (2 letter code) []:State or Province Name (full name) []:Locality Name (eg, city) []:Organization Name (eg, company) []:Organizational Unit Name (eg, section) []:Common Name (eg, fully qualified host name) []:Email Address []:
```

Usually, adding Country Name and Organization Name is enough, but you can provide as much information as you need or want.

The additional information will be included in the Certificate Subject, allowing you to easily identify which certificate belongs to which client. This can also make it easier to revoke a specific certificate when needed.

The following image displays an example of how a certificate with with Country Name, Organization Name, and Organizational Unit Name will look like on the Cloudflare dashboard:

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

## Revoke a client certificate

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/revoke-client-certificate/](https://developers.cloudflare.com/ssl/client-certificates/revoke-client-certificate/)

Page options # Revoke a client certificate

You can revoke a client certificate you previously generated with the default Cloudflare Managed CA.

It is not possible to permanently delete client certificates generated with the default Cloudflare Managed CA. Once revoked, these client certificates will still be listed in SSL/TLS > Client Certificates, and can be restored at any time.

## Steps

1. Log in to the Cloudflare dashboard ↗ and select your account and application.
2. Go to SSL > Client Certificates.
3. Select the certificate you want to revoke.
4. Select Revoke and confirm the operation.

Important

After revoking a certificate, you must update any mTLS rules that check for the presence of a client certificate so that they block all requests that include a revoked certificate.

For more information, refer to Check for revoked certificates.

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

## Configure your mobile app or IoT device

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/configure-your-mobile-app-or-iot-device/](https://developers.cloudflare.com/ssl/client-certificates/configure-your-mobile-app-or-iot-device/)

Page options # Configure your mobile app or IoT device

This tutorial demonstrates how to configure your Internet-of-things (IoT) device and mobile application to use client certificates with API Shield.

## Scenario details

This walkthrough uses the example of a device that captures temperature readings and transmits them by sending a POST request to a Cloudflare-protected API. A mobile application built in Swift for iOS retrieves those readings and displays them.

To keep this example simple, the API is implemented as a Cloudflare Worker (borrowing code from the To-Do List tutorial on building a jamstack app).

Temperatures are stored in Workers KV using the source IP address as a key, but you can easily use a value from the client certificate, such as the fingerprint.

The example API code below saves a temperature and timestamp into KV when a POST is made and returns the most recent five temperatures when a GET request is made.

```
const defaultData = { temperatures: [] };
const getCache = (key) => TEMPERATURES.get(key);const setCache = (key, data) => TEMPERATURES.put(key, data);
async function addTemperature(request) {  // Pull previously recorded temperatures for this client.  const ip = request.headers.get("CF-Connecting-IP");  const cacheKey = `data-${ip}`;  let data;  const cache = await getCache(cacheKey);  if (!cache) {    await setCache(cacheKey, JSON.stringify(defaultData));    data = defaultData;  } else {    data = JSON.parse(cache);  }
  // Append the recorded temperatures with the submitted reading (assuming it has both temperature and a timestamp).  try {    const body = await request.text();    const val = JSON.parse(body);
    if (val.temperature && val.time) {      data.temperatures.push(val);      await setCache(cacheKey, JSON.stringify(data));      return new Response("", { status: 201 });    } else {      return new Response(        "Unable to parse temperature and/or timestamp from JSON POST body",        { status: 400 },      );    }  } catch (err) {    return new Response(err, { status: 500 });  }}
function compareTimestamps(a, b) {  return -1 * (Date.parse(a.time) - Date.parse(b.time));}
// Return the 5 most recent temperature measurements.async function getTemperatures(request) {  const ip = request.headers.get("CF-Connecting-IP");  const cacheKey = `data-${ip}`;
  const cache = await getCache(cacheKey);  if (!cache) {    return new Response(JSON.stringify(defaultData), {      status: 200,      headers: { "content-type": "application/json" },    });  } else {    data = JSON.parse(cache);    const retval = JSON.stringify(      data.temperatures.sort(compareTimestamps).splice(0, 5),    );    return new Response(retval, {      status: 200,      headers: { "content-type": "application/json" },    });  }}
export default {  async fetch(request, env, ctx) {    return request.method === "POST"      ? addTemperature(request)      : getTemperatures(request);  },};
```

## 1. Validate API

### POST sample data to API

To validate the API before adding mTLS authentication, POST a random temperature reading:

Terminal window ```
$ TEMPERATURE=$(echo $((361 + RANDOM %11)) | awk '{printf("%.2f",$1/10.0)}')$ TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
$ echo -e "$TEMPERATURE\n$TIMESTAMP"36.702020-09-28T02:54:56Z
$ curl --verbose --header "Content-Type: application/json" --data '{"temperature":'''$TEMPERATURE''', "time": "'''$TIMESTAMP'''"}' https://shield.upinatoms.com/temps 2>&1 | grep "< HTTP/2"< HTTP/2 201
```

### GET sample data from API

A GET request to the temps endpoint returns the most recent readings, including the one submitted in the example above:

Terminal window ```
$ curl --silent https://shield.upinatoms.com/temps | jq .[  {    "temperature": 36.3,    "time": "2020-09-28T02:57:49Z"  },  {    "temperature": 36.7,    "time": "2020-09-28T02:54:56Z"  },  {    "temperature": 36.2,    "time": "2020-09-28T02:33:08Z"  }]
```

## 2. Create Cloudflare-issued certificates

Before you can use API Shield to protect your API or web application, create Cloudflare-issued client certificates.

You can create a client certificate in the Cloudflare dashboard.

However, since most developers working at scale generate their own private keys and certificate signing requests via API, this example uses the Cloudflare API to create client certificates.

To create a bootstrap certificate for the iOS application and the IoT device, this example uses Cloudflare’s public key infrastructure toolkit, CFSSL ↗:

Terminal window ```
# Generate a private key and CSR for the iOS device.
$ cat <<'EOF' | tee -a csr.json{    "hosts": [        "ios-bootstrap.devices.upinatoms.com"    ],    "CN": "ios-bootstrap.devices.upinatoms.com",    "key": {        "algo": "rsa",        "size": 2048    },    "names": [{        "C": "US",        "L": "Austin",        "O": "Temperature Testers, Inc.",        "OU": "Tech Operations",        "ST": "Texas"    }]}EOF
$ cfssl genkey csr.json | cfssljson -bare certificate
2020/09/27 21:28:46 [INFO] generate received request2020/09/27 21:28:46 [INFO] received CSR2020/09/27 21:28:46 [INFO] generating key: rsa-20482020/09/27 21:28:47 [INFO] encoded CSR
$ mv certificate-key.pem ios-key.pem$ mv certificate.csr ios.csr
# Do the same for the IoT sensor.
$ sed -i.bak 's/ios-bootstrap/sensor-001/g' csr.json$ cfssl genkey csr.json | cfssljson -bare certificate...$ mv certificate-key.pem sensor-key.pem$ mv certificate.csr sensor.csr
# now ask that these CSRs be signed by the private CA issued for your zone# we need to replace actual newlines in the CSR with ‘\n’ before POST’ing$ CSR=$(cat ios.csr | perl -pe 's/\n/\\n/g')$ request_body=$(< <(cat <<EOF{  "validity_days": 3650,  "csr":"$CSR"}EOF))
# save the response so we can view it and then extra the certificate$ curl https://api.cloudflare.com/client/v4/zones/{zone_id}/client_certificates \--header "X-Auth-Email: <EMAIL>" \--header "X-Auth-Key: <API_KEY>" \--header "Content-Type: application/json" \--data "$request_body" > response.json
$ cat response.json | jq .
{  "success": true,  "errors": [],  "messages": [],  "result": {    "id": "7bf7f70c-7600-42e1-81c4-e4c0da9aa515",    "certificate_authority": {      "id": "8f5606d9-5133-4e53-b062-a2e5da51be5e",      "name": "Cloudflare Managed CA for account 11cbe197c050c9e422aaa103cfe30ed8"    },    "certificate": "-----BEGIN CERTIFICATE-----\nMIIEkzCCA...\n-----END CERTIFICATE-----\n",    "csr": "-----BEGIN CERTIFICATE REQUEST-----\nMIIDITCCA...\n-----END CERTIFICATE REQUEST-----\n",    "ski": "eb2a48a19802a705c0e8a39489a71bd586638fdf",    "serial_number": "133270673305904147240315902291726509220894288063",    "signature": "SHA256WithRSA",    "common_name": "ios-bootstrap.devices.upinatoms.com",    "organization": "Temperature Testers, Inc.",    "organizational_unit": "Tech Operations",    "country": "US",    "state": "Texas",    "location": "Austin",    "expires_on": "2030-09-26T02:41:00Z",    "issued_on": "2020-09-28T02:41:00Z",    "fingerprint_sha256": "84b045d498f53a59bef53358441a3957de81261211fc9b6d46b0bf5880bdaf25",    "validity_days": 3650  }}
$ cat response.json | jq .result.certificate | perl -npe 's/\\n/\n/g; s/"//g' > ios.pem
# Now ask that the second client certificate signing request be signed.
$ CSR=$(cat sensor.csr | perl -pe 's/\n/\\n/g')$ request_body=$(< <(cat <<EOF{  "validity_days": 3650,  "csr":"$CSR"}EOF))
$ curl https://api.cloudflare.com/client/v4/zones/{zone_id}/client_certificates \--header "X-Auth-Email: <EMAIL>" \--header "X-Auth-Key: <API_KEY>" \--header "Content-Type: application/json" \--data "$request_body" | perl -npe 's/\\n/\n/g; s/"//g' > sensor.pem
```

## 3. Embed the client certificate in your mobile app

To configure the mobile app to securely request temperature data submitted by the IoT device, embed the client certificate in the mobile app.

For simplicity, this example embeds a “bootstrap” certificate and key in the application bundle as a PKCS#12-formatted file:

Terminal window ```
$ openssl pkcs12 -export -out bootstrap-cert.pfx -inkey ios-key.pem -in ios.pemEnter Export Password:Verifying - Enter Export Password:
```

In a real-world deployment, a bootstrap certificate should only be used in conjunction with users' credentials to authenticate with an API endpoint that can return a unique user certificate. Corporate users will want to use mobile device management (MDM) to distribute certificates.

### Embed the client certificate in an Android app

The following is an example of how you may use a client certificate in an Android app to make HTTP calls. You need to add the following permission in AndroidManifest.xml to allow an Internet connection.

```
<uses-permission android:name="android.permission.INTERNET" />
```

For demonstration purposes, the certificate in this example is stored in app/src/main/res/raw/cert.pem and the private key is stored in app/src/main/res/raw/key.pem. You may also store these files in other secure manners.

The following example uses an OkHttpClient, but you may also use other clients such as HttpURLConnection in similar ways. The key is to use the SSLSocketFactory.

```
private OkHttpClient setUpClient() {    try {        final String SECRET = "secret"; // You may also store this String somewhere more secure.        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        // Get private key        InputStream privateKeyInputStream = getResources().openRawResource(R.raw.key);        byte[] privateKeyByteArray = new byte[privateKeyInputStream.available()];        privateKeyInputStream.read(privateKeyByteArray);
        String privateKeyContent = new String(privateKeyByteArray, Charset.defaultCharset())                .replace("-----BEGIN PRIVATE KEY-----", "")                .replaceAll(System.lineSeparator(), "")                .replace("-----END PRIVATE KEY-----", "");
        byte[] rawPrivateKeyByteArray = Base64.getDecoder().decode(privateKeyContent);        KeyFactory keyFactory = KeyFactory.getInstance("RSA");        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(rawPrivateKeyByteArray);
        // Get certificate        InputStream certificateInputStream = getResources().openRawResource(R.raw.cert);        Certificate certificate = certificateFactory.generateCertificate(certificateInputStream);
        // Set up KeyStore        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());        keyStore.load(null, SECRET.toCharArray());        keyStore.setKeyEntry("client", keyFactory.generatePrivate(keySpec), SECRET.toCharArray(), new Certificate[]{certificate});        certificateInputStream.close();
        // Set up Trust Managers        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());        trustManagerFactory.init((KeyStore) null);        TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
        // Set up Key Managers        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());        keyManagerFactory.init(keyStore, SECRET.toCharArray());        KeyManager[] keyManagers = keyManagerFactory.getKeyManagers();
        // Obtain SSL Socket Factory        SSLContext sslContext = SSLContext.getInstance("TLS");        sslContext.init(keyManagers, trustManagers, new SecureRandom());        SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
        // Finally, return the client, which will then be used to make HTTP calls.        OkHttpClient client = new OkHttpClient.Builder()                .sslSocketFactory(sslSocketFactory, (X509TrustManager) trustManagers[0])                .build();
        return client;
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException | UnrecoverableKeyException | KeyManagementException | InvalidKeySpecException e) {        e.printStackTrace();        return null;    }}
```

The above function returns an OkHttpClient embedded with the client certificate. You can now use this client to make HTTP requests to your API endpoint protected with mTLS.

## 4. Embed the client certificate on your IoT device

To prepare the IoT device for secure communication with the API endpoint, embed the certificate on the device and configure the device to use the certificate when making POST requests.

This example assumes the certificate and the private key are securely copied to /etc/ssl/private/sensor-key.pem and /etc/ssl/certs/sensor.pem.

The sample script is modified to point to these files:

```
import requestsimport jsonfrom datetime import datetime
def readSensor():
    # Takes a reading from a temperature sensor and store it to temp_measurement
    dateTimeObj = datetime.now()    timestampStr = dateTimeObj.strftime('%Y-%m-%dT%H:%M:%SZ')
    measurement = {'temperature':str(temp_measurement),'time':timestampStr}    return measurement
def main():
    print("Cloudflare API Shield [IoT device demonstration]")
    temperature = readSensor()    payload = json.dumps(temperature)
    url = 'https://shield.upinatoms.com/temps'    json_headers = {'Content-Type': 'application/json'}    cert_file = ('/etc/ssl/certs/sensor.pem', '/etc/ssl/private/sensor-key.pem')
    r = requests.post(url, headers = json_headers, data = payload, cert = cert_file)
    print("Request body: ", r.request.body)    print("Response status code: %d" % r.status_code)
```

When the script attempts to connect to https://shield.upinatoms.com/temps, Cloudflare requests that a client certificate is sent and the script sends the contents of /etc/ssl/certs/sensor.pem. Then, as required to complete the SSL/TLS handshake, the script demonstrates it has possession of /etc/ssl/private/sensor-key.pem.

Without the client certificate, the Cloudflare rejects the request:

```
Cloudflare API Shield [IoT device demonstration]Request body:  {"temperature": "36.5", "time": "2020-09-28T15:52:19Z"}Response status code: 403
```

When the IoT device presents a valid client certificate, the POST request succeeds and the temperature reading is recorded:

```
Cloudflare API Shield [IoT device demonstration]Request body:  {"temperature": "36.5", "time": "2020-09-28T15:56:45Z"}Response status code: 201
```

## 5. Enable mTLS

After creating Cloudflare-issued certificates, the next step is to enable mTLS for the hosts you want to protect with API Shield.

## 6. Configure API Shield to require client certificates

To configure API Shield to require client certificates, create a mTLS rule.

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

**來源**: [https://developers.cloudflare.com/ssl/client-certificates/troubleshooting/](https://developers.cloudflare.com/ssl/client-certificates/troubleshooting/)

Page options # Troubleshooting

If your query returns an error even after configuring and embedding a client SSL certificate, check the following settings.

## Check SSL/TLS handshake

On your terminal, use the following command to check whether an SSL/TLS connection can be established successfully between the client and the API endpoint.

Terminal window ```
curl --verbose --cert /path/to/certificate.pem --key /path/to/key.pem  https://your-api-endpoint.com
```

If the SSL/TLS handshake cannot be completed, check whether the certificate and the private key are correct.

## Check mTLS hosts

Check whether mTLS has been enabled for the correct host. The host should match the API endpoint that you want to protect.

## Review mTLS rules

To review mTLS rules:

1. Select Security > WAF > Custom rules.
2. On a specific rule, select Edit.
3. On that rule, check whether:


The Expression Preview is correct.


The hostname, if defined, matches your API endpoint. For example, for the API endpoint api.trackers.ninja/time, the rule should look like:
(http.host in {"api.trackers.ninja"} and not cf.tls_client_auth.cert_verified)
4. The Expression Preview is correct.
5. The hostname, if defined, matches your API endpoint. For example, for the API endpoint api.trackers.ninja/time, the rule should look like:
(http.host in {"api.trackers.ninja"} and not cf.tls_client_auth.cert_verified)
6. To edit the rule, either use the user interface or select Edit expression.

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

## Keyless SSL

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/](https://developers.cloudflare.com/ssl/keyless-ssl/)

Page options # Keyless SSL

Keyless SSL allows security-conscious clients to upload their own custom certificates and benefit from Cloudflare, but without exposing their TLS private keys.

Before configuring Keyless SSL, you should read our technical background ↗ on how the technology works and where your infrastructure sits within the scope of the TLS handshake.

The source code for our key server (what you will run) and keyless client (what our servers will contact your key server with) can be found on GitHub ↗.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | No | No | Paid add-on |

Keyless SSL is only available to Enterprise customers that maintain their own SSL certificate purchased from a valid Certificate Authority. Cloudflare does not supply any certificates for use with Keyless SSL.

## Limitations

TLS 1.3 is not supported for Keyless SSL.

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

## Cloudflare Tunnel

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/configuration/cloudflare-tunnel/](https://developers.cloudflare.com/ssl/keyless-ssl/configuration/cloudflare-tunnel/)

Page options # Cloudflare Tunnel

Through an integration with Cloudflare Tunnel, you can send traffic to a key server through a secure channel and avoid exposing your key server to the public Internet.

## Before you begin

### Supported platforms

Keyless has been tested on amd64 and arm architectures. The key server binary will likely run on all architectures that Go supports. Code support may exist for other CPUs too, but these other architectures have not been tested.

In addition to running on bare metal, the key server should run without issue in a virtualized or containerized environment. Care will need to be taken to configure ingress access to the appropriate TCP port and file system access to private keys (if using filesystem storage).

### Supported operating systems

You will need to have a supported operating system (OS) to run Keyless. Supported operating systems include:

- Ubuntu 14.04 LTS, 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS, 22.10
- Debian 8, 9, 10, 11, 12
- RHEL and CentOS 6, 7, 8, 9
- Amazon Linux 1, 2

We strongly recommend that you use an operating system still supported by the vendor (still receiving security updates) as your key server will have access to your private keys.

## 1. Install cloudflared on key server

First, install cloudflared on your key server.

This process differs depending on whether you are using the command line or the Cloudflare dashboard.

## 2. Create a Tunnel

Then, create a Cloudflare Tunnel.

This process differs depending on whether you are using the command line or the Cloudflare dashboard.

In these steps, you should choose the option to Connect a network and use the private IP address of your key server.

After you create the Tunnel, use the Cloudflare API to List tunnel routes, saving the following values for a future step:

- "virtual_network_id"
- "network"

## 3. Upload Keyless SSL Certificates

Before your key servers can be configured, you must next upload the corresponding SSL certificates to Cloudflare’s edge. During TLS termination, Cloudflare will present these certificates to connecting browsers and then (for non-resumed sessions) communicate with the specified key server to complete the handshake.

Upload certificates to Cloudflare with only SANs that you wish to use with Cloudflare Keyless SSL. All Keyless SSL hostnames must be proxied.

You will have to upload each certificate used with Keyless SSL.

To upload a Keyless certificate with the API, send a POST request that includes a "tunnel" object.

```
"tunnel": {  "vnet_id": "<VIRTUAL_NETWORK_ID>",  "private_ip": "<NETWORK>"}
```

Note

When you receive the network value from the Tunnel route API, it will include a subnet mask, such as 10.0.0.1/32. Remove the subnet mask and use the IP address (10.0.0.1).

## 4. Set up and activate key server

Finally, you need to install the key server on your infrastructure, populate it with the SSL keys of the certificates you wish to use to terminate TLS at Cloudflare’s edge, and activate the key server so it can be mutually authenticated.

Note

If you plan to run Keyless SSL in a high availability setup, you may need to set up additional infrastructure (load balancing and health checks).

### Install

These steps are also at the Cloudflare package repository ↗.

#### Debian/Ubuntu packages

Debian or Ubuntu ```
sudo mkdir -p --mode=0755 /usr/share/keyringscurl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
# Add this repo to your apt repositoriesecho 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/gokeyless buster main' | sudo tee /etc/apt/sources.list.d/cloudflare.list
# install gokeylesssudo apt-get update && sudo apt-get install gokeyless
```

#### RHEL/CentOS packages

Use either of the following examples to install the gokeyless package for RHEL or CentOS.

Option 1

RHEL or CentOS (version lower than 8) ```
sudo yum makecachesudo yum-config-manager --add-repo https://pkg.cloudflare.com/gokeyless.repo && sudo yum-config-manager --setopt=gokeyless-stable.gpgkey=https://pkg.cloudflare.com/cloudflare-ascii-pubkey.gpg --savesudo yum install gokeyless
```

Option 2

RHEL or CentOS (version 8 or higher) ```
sudo dnf install dnf-plugins-core && dnf clean allsudo dnf config-manager --add-repo https://pkg.cloudflare.com/gokeyless.reposudo dnf install gokeyless
```

Note

Amazon Linux customers may need to update their final installation command to be something similar to sudo yum install rsyslog shadow-utils && sudo yum install gokeyless.

### Configure

Add your Cloudflare account details to the configuration file located at /etc/keyless/gokeyless.yaml:

1. Set the hostname of the key server, for example, keyserver.keyless.example.com. This is also the value you entered when you uploaded your keyless certificate and is the hostname of your key server that holds the key for this certificate.
2. Set the Zone ID (found on Overview tab of the Cloudflare dashboard).
3. Set the Origin CA API key.

### Populate keys

Install your private keys in /etc/keyless/keys/ and set the user and group to keyless with 400 permissions. Keys must be in PEM or DER format and have an extension of .key:

Terminal window ```
ls -l /etc/keyless/keys
```

```
-r-------- 1 keyless keyless 1675 Nov 18 16:44 example.com.key
```

When running multiple key servers, make sure all required keys are distributed to each key server. Customers typically will either use a configuration management tool such as Salt or Puppet to distribute keys or mount /etc/keyless/keys to a network location accessible only by your key servers. Keys are read on boot into memory, so a network path must be accessible during the gokeyless process start/restart.

### Activate

To activate, restart your keyless instance:

- systemd: sudo service gokeyless restart
- upstart/sysvinit: sudo /etc/init.d/gokeyless restart

If this command fails, try troubleshooting by checking the logs.

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

## Public DNS

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/configuration/public-dns/](https://developers.cloudflare.com/ssl/keyless-ssl/configuration/public-dns/)

Page options # Public DNS

If you cannot use a Cloudflare Tunnel setup, you can also create a public DNS record for your key server.

This setup option is not ideal as the DNS record cannot be proxied and - as a result - will expose the origin IP address of your key server.

## Before you begin

### Supported platforms

Keyless has been tested on amd64 and arm architectures. The key server binary will likely run on all architectures that Go supports. Code support may exist for other CPUs too, but these other architectures have not been tested.

In addition to running on bare metal, the key server should run without issue in a virtualized or containerized environment. Care will need to be taken to configure ingress access to the appropriate TCP port and file system access to private keys (if using filesystem storage).

### Supported operating systems

You will need to have a supported operating system (OS) to run Keyless. Supported operating systems include:

- Ubuntu 14.04 LTS, 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS, 22.10
- Debian 8, 9, 10, 11, 12
- RHEL and CentOS 6, 7, 8, 9
- Amazon Linux 1, 2

We strongly recommend that you use an operating system still supported by the vendor (still receiving security updates) as your key server will have access to your private keys.

## 1. Create public DNS record

1. Open a Terminal and run openssl rand -hex 24 to generate a long, random hostname such as 11aa40b4a5db06d4889e48e2f738950ddfa50b7349d09b5f.example.com.
2. Add this record via your DNS provider’s interface as an A or AAAA record pointing to the IP address of your Keyless SSL server.
3. Use this hostname as the server hostname during initialization of your Keyless SSL server.

Warning

As a security measure, you should hide the hostname of your key server.

## 2. Upload Keyless SSL Certificates

Before your key servers can be configured, you must next upload the corresponding SSL certificates to Cloudflare’s edge. During TLS termination, Cloudflare will present these certificates to connecting browsers and then (for non-resumed sessions) communicate with the specified key server to complete the handshake.

Upload certificates to Cloudflare with only SANs that you wish to use with Cloudflare Keyless SSL. All Keyless SSL hostnames must be proxied.

You will have to upload each certificate used with Keyless SSL.

- Dashboard
- API

To create a Keyless certificate in the dashboard:

1. Log in to the Cloudflare dashboard ↗ and select your account and zone.
2. Go to SSL/TLS > Edge Certificates.
3. Select Upload Keyless SSL Certificate.
4. Fill in the upload modal with the certificate and other details and select Add.

| Label | Description | Example Values |
| --- | --- | --- |
| Key server label | Any unique identifier for your key server. | “test-keyless”, “production-keyless-1” |
| Key server hostname | The hostname of your key server that holds the key for this certificate (such as the random hostname generated earlier). | 11aa40b4a5db06d4889e48e2f738950ddfa50b7349d09b5f.example.com |
| Key server port | Set to 2407 unless you have changed this on the key server. | 2407 |
| SSL Certificate | The valid X509v3 SSL certificate (in PEM form) for which you hold the private key. | (PEM bytes) |
| Bundle method | This should almost always be Compatible. Refer to Uploading Custom Certificates for more details. | Compatible |

To create a Keyless certificate with the API, send a POST request.

## 3. Set up and activate key server

Finally, you need to install the key server on your infrastructure, populate it with the SSL keys of the certificates you wish to use to terminate TLS at Cloudflare’s edge, and activate the key server so it can be mutually authenticated.

Note

If you plan to run Keyless SSL in a high availability setup, you may need to set up additional infrastructure (load balancing and health checks).

### Install

These steps are also at the Cloudflare package repository ↗.

#### Debian/Ubuntu packages

Debian or Ubuntu ```
sudo mkdir -p --mode=0755 /usr/share/keyringscurl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
# Add this repo to your apt repositoriesecho 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/gokeyless buster main' | sudo tee /etc/apt/sources.list.d/cloudflare.list
# install gokeylesssudo apt-get update && sudo apt-get install gokeyless
```

#### RHEL/CentOS packages

Use either of the following examples to install the gokeyless package for RHEL or CentOS.

Option 1

RHEL or CentOS (version lower than 8) ```
sudo yum makecachesudo yum-config-manager --add-repo https://pkg.cloudflare.com/gokeyless.repo && sudo yum-config-manager --setopt=gokeyless-stable.gpgkey=https://pkg.cloudflare.com/cloudflare-ascii-pubkey.gpg --savesudo yum install gokeyless
```

Option 2

RHEL or CentOS (version 8 or higher) ```
sudo dnf install dnf-plugins-core && dnf clean allsudo dnf config-manager --add-repo https://pkg.cloudflare.com/gokeyless.reposudo dnf install gokeyless
```

Note

Amazon Linux customers may need to update their final installation command to be something similar to sudo yum install rsyslog shadow-utils && sudo yum install gokeyless.

### Configure

Add your Cloudflare account details to the configuration file located at /etc/keyless/gokeyless.yaml:

1. Set the hostname of the key server, for example, 11aa40b4a5db06d4889e48e2f.example.com. This is also the value you entered when you uploaded your keyless certificate and is the hostname of your key server that holds the key for this certificate.
2. Set the Zone ID (found on Overview tab of the Cloudflare dashboard).
3. Set the Origin CA API key.

### Populate keys

Install your private keys in /etc/keyless/keys/ and set the user and group to keyless with 400 permissions. Keys must be in PEM or DER format and have an extension of .key:

Terminal window ```
ls -l /etc/keyless/keys
```

```
-r-------- 1 keyless keyless 1675 Nov 18 16:44 example.com.key
```

When running multiple key servers, make sure all required keys are distributed to each key server. Customers typically will either use a configuration management tool such as Salt or Puppet to distribute keys or mount /etc/keyless/keys to a network location accessible only by your key servers. Keys are read on boot into memory, so a network path must be accessible during the gokeyless process start/restart.

### Activate

To activate, restart your keyless instance:

- systemd: sudo service gokeyless restart
- upstart/sysvinit: sudo /etc/init.d/gokeyless restart

If this command fails, try troubleshooting by checking the logs.

### Allow incoming connections from Cloudflare

During TLS handshakes, Cloudflare's keyless client will initiate connections to the key server hostname or IP address you specify during certificate upload. By default, the keyless client will use a destination TCP port of 2407, but this can be changed during certificate upload or by editing the certificate details after upload.

Create WAF custom rules that allow your key server to accept connections from only Cloudflare. You can get Cloudflare's IPv4 and IPv6 addresses via the IP details API endpoint.

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

## Hardware security modules

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/)

Page options # Hardware security modules

In addition to private keys stored on disk, Keyless SSL supports keys stored in a Hardware Security Module (HSM) via the PKCS#11 standard. Keyless uses PKCS#11 for signing and decrypting payloads without having direct access to the private keys.

## Why use Keyless SSL with an HSM?

Hardware Security Modules (HSMs) facilitate a higher level of protection for your private keys over storing them directly on your key server. The primary responsibility of an HSM is safeguarding private keys and performing operations such as signing or encryption internally. In addition to access control, that means the physical device must offer some degree of tamper-resistance in order to be compliant with government or industry regulations such as FIPS 140 ↗.

Moreover, many HSMs are also capable of generating keys and producing cryptographically secure randomness. Some are purpose-built to perform cryptographic computations more efficiently.

## Communicating using PKCS#11

The key server communicates with HSMs via PKCS#11, so any HSM supporting the standard can be used with Keyless SSL.

### Initial configuration

For more details on initializing your PKCS#11 token, refer to Configuration.

### Compatibility

Keyless SSL has interoperability with the following modules:

- Entrust nShield Connect ↗
- Gemalto SafeNet Luna ↗
- SoftHSMv2 ↗
- YubiKey Neo ↗

Also, the following cloud HSM offerings have been tested with Keyless SSL:

- AWS CloudHSM
- Azure Dedicated HSM
- Azure Managed HSM
- Fortanix DSM
- IBM Cloud HSM
- Google Cloud HSM

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

## Configuration

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/configuration/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/configuration/)

Page options # Configuration

Important

Carefully review the manufacturer documentation for your HSM and properly restrict access to the key server.

To get started with your PKCS#11 token you will need to initialize it with a private key, PIN, and token label. The instructions to do this will be specific to each hardware device, and you should follow the instructions provided by your vendor. You will also need to find the path to your module, a shared object file (.so). Having initialized your device, you can query it to check your token label with:

Terminal window ```
pkcs11-tool --module <module path> --list-token-slots
```

You will also want to check the label of the private key you imported (or generated). Run the following command and look for a Private Key Object:

Terminal window ```
pkcs11-tool --module <module path> --pin <pin> \    --list-token-slots --login --list-objects
```

You now have all the information you need to use your PKCS#11 token with the Keyless server, by adding to the private_key_stores section in the configuration file. You can specify the key pairs that you want Keyless to have access to in the configuration file using the PKCS#11 URI ↗ format.

## PKCS#11 URI

A PKCS#11 URI is a sequence of attribute value pairs separated by a semicolon that form a one-level path component, optionally followed by a query. The general form represented is:

```
pkcs11:path-component[?query-component]
```

The URI path component contains attributes that identify a resource. The query component can contain a few attributes that may be needed to retrieve the resource identified by the URI path component. Attributes in the path component are delimited by the ; character, and attributes in the query component use & as a delimiter. All attributes are URL-encoded.

Keyless requires the following three attributes be specified:

- Module: use module-path to locate the PKCS#11 module library.
- Token: use serial, slot-id, or token to specify the PKCS#11 token.
- Slot: use id or object to specify the PKCS#11 key pair.

For certain modules, a query attribute max-sessions is required in order to prevent opening too many sessions to the module. Certain additional attributes, such as pin-value, may be necessary depending on the situation. Refer to the documentation for your PKCS#11 module for more details.

## Examples

Here are some examples of PKCS#11 URIs for keys stored on various modules:

```
private_key_stores:- uri: pkcs11:token=SoftHSM2%20RSA%20Token;id=%03?module-path=/usr/lib64/libsofthsm2.so&pin-value=1234- uri: pkcs11:token=accelerator;object=thaleskey?module-path=/opt/nfast/toolkits/pkcs11/libcknfast.so- uri: pkcs11:token=YubiKey%20PIV;id=%00?module-path=/usr/lib64/libykcs11.so&pin-value=123456&max-sessions=1- uri: pkcs11:token=elab2parN;id=%04?module-path=/usr/lib/libCryptoki2_64.so&pin-value=crypto1
```

## Limitations

For now, only one PKCS#11 module can be used at a time, so if you have keys on multiple HSMs, we recommend using p11-glue to consolidate access through one module ↗.

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

## AWS cloud HSM

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/aws-cloud-hsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/aws-cloud-hsm/)

Page options # AWS cloud HSM

Note

This example imports an existing key pair, but you may prefer to generate your key on the HSM ↗.

## Before you start

Make sure you have:

- Provisioned an AWS CloudHSM cluster ↗ .
- Installed the appropriate software library for PKCS#11 ↗.

## 1. Import the public and private key to the HSM

Before importing the public key, extract it from the certificate provided by your CA. Place the contents of your private key in privkey.pem and then run the following (replacing certificate.pem with your actual certificate) to populate pubkey.pm.

```
keyserver$ openssl x509 -pubkey -noout -in certificate.pem > pubkey.pem
```

Log in to the CloudHSM using a previously created crypto user ↗ (CU) account and generate a key encryption key that will be used to import your private key.

```
keyserver$ /opt/cloudhsm/bin/key_mgmt_utilCommand: loginHSM -u CU -s patrick -p donahueCommand: genSymKey -t 31 -s 16 -sess -l import-wrapping-key...Symmetric Key Created.  Key Handle: 658...
```

Referencing the key handle returned above, import the private and public key and then log out of the HSM:

```
Command: importPrivateKey -f privkey.pem -l mykey -id 1 -w 658...Cfm3WrapHostKey returned: 0x00 : HSM Return: SUCCESSCfm3CreateUnwrapTemplate returned: 0x00 : HSM Return: SUCCESSCfm3UnWrapKey returned: 0x00 : HSM Return: SUCCESS...Private Key Unwrapped.  Key Handle: 658

Command: importPubKey -f pubkey.pem -l mykey -id 1Cfm3CreatePublicKey returned: 0x00 : HSM Return: SUCCESS...Public Key Handle: 941

Command: logoutHSMCommand: exit
```

## 2. Modify the gokeyless config file and restart the service

Now that the keys are in place, we need to modify the configuration file that the key server will read on startup. Change the object=mykey and pin-value=username:password values to match the key label you provided and CU user you created.

Open /etc/keyless/gokeyless.yaml and immediately after:

```
private_key_stores:  - dir: /etc/keyless/keys
```

add:

```
- uri: pkcs11:token=cavium;object=mykey?module-path=/opt/cloudhsm/lib/libcloudhsm_pkcs11_standard.so&pin-value=patrick:donahue&max-sessions=1
```

With the config file saved, restart gokeyless and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## Azure Dedicated HSM

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-dedicated-hsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-dedicated-hsm/)

Page options # Azure Dedicated HSM

This tutorial uses Azure Dedicated HSM ↗ — a FIPS 140-2 Level 3 certified implementation based on the Gemalto SafeNet Luna a790.

## Before you start

Make sure you have:

- Followed Microsoft's tutorial ↗ for deploying HSMs into an existing virtual network using PowerShell
- Installed the SafeNet client software ↗

## 1. Create, assign, and initialize a new partition

The first step is creating an HSM partition, which can be thought of as an independent logical HSM within your Azure Dedicated HSM device.

```
vm$ ssh tenantadmin@hsm
[local_host] lunash:>hsm login  Please enter the HSM Administrators' password:  > ********

'hsm login' successful.

Command Result : 0 (Success)
[local_host] lunash:>partition create -partition KeylessSSL

          Type 'proceed' to create the partition, or          'quit' to quit now.          > proceed'partition create' successful.

Command Result : 0 (Success)
```

Next, the partition needs to be assigned to the client, in this case your key server.

Terminal window ```
[local_host] lunash:>client assignpartition -client azure-keyless -partition KeylessSSL

'client assignPartition' successful.

Command Result : 0 (Success)
```

After the partition has been assigned, run lunacm from your virtual server and initialize the partition.

```
vm$ lunacmlunacm (64-bit) v7.2.0-220. Copyright (c) 2018 SafeNet. All rights reserved.

  Available HSMs:
  Slot Id ->              0  Label ->  Serial Number ->        XXXXXXXXXXXXX  Model ->                LunaSA 7.2.0  Firmware Version ->     7.0.3  Configuration ->        Luna User Partition With SO (PW) Signing With Cloning Mode  Slot Description ->     Net Token Slot

  Current Slot Id: 0
lunacm:>partition init -label KeylessSSL -domain cloudflare
  Enter password for Partition SO: ********
  Re-enter password for Partition SO: ********
  You are about to initialize the partition.  All contents of the partition will be destroyed.
  Are you sure you wish to continue?
  Type 'proceed' to continue, or 'quit' to quit now ->proceed
Command Result : No Error
```

## 2. Generate a RSA key pair and certificate signing request (CSR)

Before running the commands below, check with your information security and/or cryptography team to confirm the approved key creation procedures for your organization.

```
# cmu generatekeypair -keyType=RSA -modulusBits=2048 -publicExponent=65537 -sign=1 -verify=1 -labelpublic=myrsakey -labelprivate=myrsakey -keygenmech=1
Please enter password for token in slot 0 : ********
# cmu list
Please enter password for token in slot 0 : ********handle=51 label=myrsakeyhandle=48 label=myrsakey
```

Using the key created in the previous step, generate a CSR that can be sent to a publicly trusted Certificate Authority (CA) for signing.

```
# cmu requestCertificate -c="US" -o="Example, Inc." -cn="azure-dedicatedhsm.example.com" -s="California" -l="San Francisco" -publichandle=48 -privatehandle=51 -outputfile="rsa.csr" -sha256withrsa
Please enter password for token in slot 0 : ********Using "CKM_SHA256_RSA_PKCS" Mechanism
```

## 3. Obtain and upload a signed certificate from your Certificate Authority (CA)

Provide the CSR created in the previous step to your organization's preferred CA, demonstrate control of your domain as requested, and then download the signed SSL certificates. Follow the instructions provided in Upload Keyless SSL Certificates.

## 4. Modify your gokeyless config file and restart the service

Lastly, we need to modify the configuration file that the key server will read on startup. Be sure to change the object=mykey and pin-value=username:password values to match the key label you provided and CU user you created.

Open /etc/keyless/gokeyless.yaml and immediately after:

```
private_key_stores:  - dir: /etc/keyless/keys
```

add:

```
- uri: pkcs11:token=KeylessSSL;object=myrsakey?module-path=/usr/safenet/lunaclient/lib/libCryptoki2_64.so&pin-value=password&max-sessions=1
```

With the config file saved, restart gokeyless and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## Azure Managed HSM

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-managed-hsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-managed-hsm/)

Page options # Azure Managed HSM

This tutorial uses Microsoft Azure’s Managed HSM ↗ — a FIPS 140-2 Level 3 certified implementation — to deploy a VM with the Keyless SSL daemon.

## Before you start

Make sure you have:

- Followed Microsoft's tutorial ↗ for provisioning and activating the managed HSM
- Set up a VM for your key server

## 1. Create a VM

Create a VM where you will deploy the keyless daemon.

## 2. Deploy the keyless server

Follow these instructions to deploy your keyless server.

## 3. Set up the Azure CLI

Set up the Azure CLI (used to access the private key).

For example, if you were using macOS:

```
brew install azure-cli
```

## 4. Set up the Managed HSM

1. Log in through the Azure CLI and create a resource group for the Managed HSM in one of the supported regions:
Terminal windowaz loginaz group create --name HSMgroup --location southcentralus
NoteFor a list of supported regions, see the Microsoft documentation ↗.
2. Create, provision, and activate ↗ the HSM.
3. Add your private key to the keyvault, which returns the URI you need for Step 4:
az keyvault key import --hsm-name "KeylessHSM" --name "hsm-pub-keyless" --pem-file server.key
4. If the key server is running in an Azure VM in the same account, use Managed services for authorization:


Enable managed services on the VM in the UI.


Give your service user (associated with your VM) HSM sign permissions
az keyvault role assignment create  --hsm-name KeylessHSM --assignee $(az vm identity show --name "hsmtestvm" --resource-group "HSMgroup" --query principalId -o tsv) --scope / --role "Managed HSM Crypto User"
5. Enable managed services on the VM in the UI.
6. Give your service user (associated with your VM) HSM sign permissions
az keyvault role assignment create  --hsm-name KeylessHSM --assignee $(az vm identity show --name "hsmtestvm" --resource-group "HSMgroup" --query principalId -o tsv) --scope / --role "Managed HSM Crypto User"
7. In the gokeyless YAML file, add the URI from Step 2 under private_key_stores. See our README ↗ for an example.

## 5. Restart gokeyless

Once you save the config file, restart gokeyless and verify that it started successfully:

```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## Entrust nShield Connect

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/entrust-nshield-connect/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/entrust-nshield-connect/)

Page options # Entrust nShield Connect

Note

This example assumes you have already configured the nShield Connect device and generated or imported your private keys.

Since the keys are already in place, we merely need to build the configuration file that the key server will read on startup. In this example the device contains a single RSA key pair.

We ask pkcs11-tool (provided by the opensc package) to display the objects stored in the token:

```
pkcs11-tool --module /opt/nfast/toolkits/pkcs11/libcknfast.so -O
```

```
Using slot 0 with a present token (0x1d622495)Private Key Object; RSA  label:      rsa-privkey  ID:         105013281578de42ea45f5bfac46d302fb006687  Usage:      decrypt, sign, unwrapwarning: PKCS11 function C_GetAttributeValue(ALWAYS_AUTHENTICATE) failed: rv = CKR_ATTRIBUTE_TYPE_INVALID (0x12)
Public Key Object; RSA 2048 bits  label:      rsa-privkey  ID:         105013281578de42ea45f5bfac46d302fb006687  Usage:      encrypt, verify, wrap
```

The key piece of information is the label of the object, rsa-privkey. Open up /etc/keyless/gokeyless.yaml and immediately after

```
private_key_stores:  - dir: /etc/keyless/keys
```

add

```
- uri: pkcs11:token=accelerator;object=rsa-privkey?module-path=/opt/nfast/toolkits/pkcs11/libcknfast.so&max-sessions=4
```

Save the config file, restart gokeyless, and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## Fortanix Data Security Manager

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/fortanix-dsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/fortanix-dsm/)

Page options # Fortanix Data Security Manager

You can use Cloudflare Keyless SSL with Fortanix Data Security Manager (DSM) ↗, a FIPS 140-2 Level 3 certified implementation.

You must have a Data Security Manager Enterprise Tier ↗ and set up a group and an application assigned to the group.

For detailed guidance, follow the tutorial in the Fortanix documentation ↗. This guide is based on the Keyless SSL public DNS option and has been tested using a virtual machine (VM) deployed to Azure running Ubuntu 22.04.3 LTS.

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

## Google Cloud HSM

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/google-cloud-hsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/google-cloud-hsm/)

Page options # Google Cloud HSM

This tutorial uses Google Cloud HSM ↗ — a FIPS 140-2 Level 3 certified implementation.

## Before you start

Make sure that you have:

- Set up your Google Cloud project ↗

## 1. Create a key ring

To set up the Google Cloud HSM, create a key ring ↗ and indicate its location.

Note:

Only certain locations ↗ support Google Cloud HSM.

## 2. Create a key

Create a key, including the following information:

| Field | Value |
| --- | --- |
| Key ring | The key ring you created in Step 2 |
| Protection level | HSM |
| Purpose | Asymmetric Encrypt |

## 3. Import the private key

After creating a key ring and key, import the private key ↗.

Note:

You need to convert your key ↗ from a PEM to DER format.

## 4. Modify your gokeyless config file and restart the service

Once you’ve imported the key, copy the Resource name from the UI. Then, add this value to the gokeyless YAML file under private_key_stores.

With the config file saved, restart gokeyless and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## IBM cloud HSM

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/ibm-cloud-hsm/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/ibm-cloud-hsm/)

Page options # IBM cloud HSM

The example below was tested using IBM Cloud HSM 7.0 ↗, a FIPS 140-2 Level 3 certified implementation based on the Gemalto SafeNet Luna a750.

## Before you start

Make sure that you have:

- Initialized your device ↗
- Installed the SafeNet client software ↗

## 1. Create, assign, and initialize a new partition

The first step is creating an HSM partition, which can be thought of as an independent logical HSM within your IBM Cloud HSM device.

```
vm$ ssh admin@hsm
[cloudflare-hsm.softlayer.com] lunash:>partition create -partition KeylessSSL

          Type 'proceed' to create the partition, or          'quit' to quit now.          > proceed'partition create' successful.

Command Result : 0 (Success)
```

Next, the partition needs to be assigned to the client, in this case your key server.

Terminal window ```
[cloudflare-hsm.softlayer.com] lunash:>client assignpartition -client cloudflare-vm.softlayer.com -partition KeylessSSL

'client assignPartition' successful.

Command Result : 0 (Success)
```

After the partition has been assigned, run lunacm from your virtual server and initialize the partition.

```
vm$ lunacmLunaCM v7.1.0-379. Copyright (c) 2006-2017 SafeNet.
    Available HSMs:
    Slot Id ->              0    Label ->    Serial Number ->        XXXXXXXXXXXXX    Model ->                LunaSA 7.0.0    Firmware Version ->     7.0.1    Configuration ->        Luna User Partition With SO (PW) Signing With Cloning Mode    Slot Description ->     Net Token Slot

    Current Slot Id: 0
lunacm:>partition init -label KeylessSSL -domain cloudflare
  Enter password for Partition SO: ********
  Re-enter password for Partition SO: ********
  You are about to initialize the partition.  All contents of the partition will be destroyed.
  Are you sure you wish to continue?
  Type 'proceed' to continue, or 'quit' to quit now ->proceed
Command Result : No Error
```

## 2. Generate RSA and ECDSA key pairs and certificate signing requests (CSRs)

Before running the commands below, check with your information security and/or cryptography team to confirm the approved key creation procedures for your organization.

When you perform this operation, you need define the ID field for the newly generated keys. It must be set to a big-endian hexadecimal integer value.

```
vm$ cmu generatekeypair -keyType=RSA -modulusBits=2048 -publicExponent=65537 -sign=1 -verify=1 -labelpublic=myrsakey -labelprivate=myrsakey -keygenmech=1  -id=a000Please enter password for token in slot 0 : ********
# cmu generatekeypair -keyType=ECDSA -curvetype=3 -sign=1 -verify=1 -labelpublic=myecdsakey -labelprivate=myecdsakey -id=a001Please enter password for token in slot 0 : ********
# cmu listPlease enter password for token in slot 0 : ********handle=61   label=myecdsakeyhandle=60   label=myecdsakeyhandle=48   label=myrsakeyhandle=45   label=myrsakey
```

Using the keys created in the previous step, generate CSRs that can be sent to a publicly trusted Certificate Authority (CA) for signing.

```
# cmu requestCertificate -c="US" -o="Example, Inc." -cn="ibm-cloudhsm.example.com" -s="California" -l="San Francisco" -publichandle=45 -privatehandle=48 -outputfile="rsa.csr" -sha256withrsaPlease enter password for token in slot 0 : ********Using "CKM_SHA256_RSA_PKCS" Mechanism
# cmu requestCertificate -c="US" -o="Example, Inc." -cn="ibm-cloudhsm.example.com" -s="California" -l="San Francisco" -publichandle=60 -privatehandle=61 -outputfile="ecdsa.csr" -sha256withecdsaPlease enter password for token in slot 0 : ********Using "CKM_ECDSA_SHA256" Mechanism
```

## 3. Obtain and upload signed certificates from your Certificate Authority (CA)

Provide the CSRs created in the previous step to your organization's preferred CA, demonstrate control of your domain as requested, and then download the signed SSL certificates. Follow the instructions provided in Upload Keyless SSL Certificates.

## 4. Modify your gokeyless config file and restart the service

Lastly, we need to modify the configuration file that the key server will read on startup. Change the object=mykey and pin-value=username:password values to match the key label you provided and CU user you created.

Open /etc/keyless/gokeyless.yaml and immediately after:

```
private_key_stores:  - dir: /etc/keyless/keys
```

add:

```
- uri: pkcs11:token=KeylessSSL;object=myrsakeyid=a000??module-path=/usr/safenet/lunaclient/lib/libCryptoki2_64.so&pin-value=password&max-sessions=1- uri: pkcs11:token=KeylessSSL;object=myecdsakeyid=a001??module-path=/usr/safenet/lunaclient/lib/libCryptoki2_64.so&pin-value=password&max-sessions=1
```

With the config file saved, restart gokeyless and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## SoftHSMv2

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/softhsmv2/](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/softhsmv2/)

Page options # SoftHSMv2

Important

SoftHSMv2 should not be considered any more secure than storing private keys directly on disk. No attempt is made below to secure this installation; it is provided simply for demonstration purposes.

## 1. Install and configure SoftHSMv2

First, we install SoftHSMv2 and configure it to store tokens in the default location /var/lib/softhsm/tokens. We also need to give the softhsm group permission to this directory as this is how the keyless user will access this directory.

Terminal window ```
sudo apt-get install -y softhsm2 opensc
#...
cat <<EOF | sudo tee /etc/softhsm/softhsm2.confdirectories.tokendir = /var/lib/softhsm/tokensobjectstore.backend = filelog.level = DEBUGslots.removable = falseEOF
sudo mkdir /var/lib/softhsm/tokenssudo chown root:softhsm $_sudo chmod 0770 /var/lib/softhsm/tokenssudo usermod -G softhsm keylesssudo usermod -G softhsm $(whoami)
echo 'export SOFTHSM2_CONF=/etc/softhsm/softhsm2.conf' | tee -a ~/.profilesource ~/.profile
```

## 2. Create a token and private keys, and generate CSRs

Next, we create a token in slot 0 called test-token and secure it with a PIN of 1234. In this slot we’ll store the RSA keys for our SSL certificates for keyless-softhsm.example.com.

Terminal window ```
sudo -u keyless softhsm2-util --init-token --slot 0 --label test-token --pin 1234 --so-pin 4321
```

```
The token has been initialized.
```

Using cfssl, we generate the private keys and Certificate Signing Requests (CSRs) ↗, the latter of which will be sent to a Certificate Authority (CA) for signing.

Terminal window ```
cat <<EOF | tee csr.json{    "hosts": [        "keyless-softhsm.example.com"    ],    "CN": "keyless-softhsm.example.com",    "key": {        "algo": "rsa",        "size": 2048    },    "names": [{        "C": "US",        "L": "San Francisco",        "O": "TLS Fun",        "OU": "Technical Operations",        "ST": "California"    }]}EOF
cfssl genkey csr.json | cfssljson -bare certificate
```

```
2018/08/12 00:52:22 [INFO] generate received request2018/08/12 00:52:22 [INFO] received CSR2018/08/12 00:52:22 [INFO] generating key: rsa-20482018/08/12 00:52:22 [INFO] encoded CSR
```

## 3. Convert and import the key

Now that the key has been generated, it’s time to load it into the slot we created. Before doing so, we need to convert from PKCS#1 to PKCS#8 format. During import, we specify the token and PIN from token initialization and provide a unique hexadecimal ID and label to the key.

Terminal window ```
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in certificate-key.pem -out certificate-key.p8sudo chown keyless certificate-key.p8
sudo -u keyless softhsm2-util --pin 1234 --import ./certificate-key.p8 --token test-token --id a000 --label rsa-privkey
```

```
Found slot 915669571 with matching token label.The key pair has been imported.
```

After importing we ask pkcs11-tool to confirm the objects have been successfully stored in the token.

Terminal window ```
sudo -u keyless pkcs11-tool --module /usr/lib/softhsm/libsofthsm2.so -l -p 1234 --token test-token --list-objects
```

```
Public Key Object; RSA 2048 bits  label:      rsa-privkey  ID:         a000  Usage:      verifyPrivate Key Object; RSA  label:      rsa-privkey  ID:         a000  Usage:      sign
```

## 4. Modify your gokeyless config file and restart the service

With the keys in place, it’s time to build the configuration file that the key server will read on startup. The id refers to the hexadecimal ID you provided to the softhsm2-util import statement; we used a000 so it is encoded as %a0%00. The module-path will vary slightly based on the Linux distribution you are using. On Debian it should be /usr/lib/softhsm/libsofthsm2.so.

Open up /etc/keyless/gokeyless.yaml and immediately after

```
private_key_stores:  - dir: /etc/keyless/keys
```

add

```
- uri: pkcs11:token=test-token;id=%a0%00?module-path=/usr/lib/softhsm/libsofthsm2.so&pin-value=1234&max-sessions=1
```

Save the config file, restart gokeyless, and verify it started successfully.

Terminal window ```
sudo systemctl restart gokeyless.servicesudo systemctl status gokeyless.service -l
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

## Upgrade your key server

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/upgrading-your-key-server/](https://developers.cloudflare.com/ssl/keyless-ssl/upgrading-your-key-server/)

Page options # Upgrade your key server

Periodically, you may need to update your key server when using Cloudflare's Keyless SSL.

To upgrade your key server:

1. Back up the contents of /etc/keyless.
2. Update your OS’ package listings, for example, apt-get update or yum update.
3. Upgrade the gokeyless server:
4. Debian/Ubuntu: apt-get upgrade gokeyless
5. RHEL/CentOS: yum install gokeyless
6. Restart the keyless instance:
7. systemd: service gokeyless restart
8. upstart/sysvinit: /etc/init.d/gokeyless restart
9. Confirm that HTTPS connections are working as expected.

Warning

If you are running a high availability configuration, upgrade one server at a time as new TLS connections will fail to terminate at Cloudflare's global network without a functioning key server.

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

## High availability

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/reference/high-availability/](https://developers.cloudflare.com/ssl/keyless-ssl/reference/high-availability/)

Page options # High availability

The Cloudflare Keyless SSL server runs as a single binary with minimal dependencies and is designed to be robust and reliable. However, the network between your key server and Cloudflare may not be, which could prevent new TLS connections.

For this reason, we strongly recommend that you run at least two key servers in a high availability configuration behind a load balancer. Set up health checks for each key server on the configured TCP port—2407 by default and failover as necessary or round-robin between active (healthy) key servers.

From a network availability and performance perspective, advertise the IP address of your key server from multiple data centers (an anycast setup) so the Cloudflare global network can route to the closest key server via BGP. When you use anycast routing, you can also safely take a data center offline to perform maintenance.

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

## Scaling and benchmarking

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/reference/scaling-and-benchmarking/](https://developers.cloudflare.com/ssl/keyless-ssl/reference/scaling-and-benchmarking/)

Page options # Scaling and benchmarking

Cloudflare's Keyless SSL technology was designed to scale to accommodate any sized workload using vertical and horizontal scaling, and pre-computation techniques wherever possible, such as ECDSA. The goals of the architectural design of the key server are to minimize latency while maximizing signing operations per second.

Each key server uses a worker pool model, with incoming client connections handled by its own pair of reader/writer goroutines and cryptographic work done in separate worker goroutines pulled from a global pool.

Where needed, multiple key servers can be deployed and balanced between using your preferred ingress load balancing configuration. For full high availability, make sure to deploy sufficient key servers to handle twice the expected workload.

## Key type

Key servers support both ECDSA and RSA keys, though signatures for RSA are an order of magnitude more expensive ↗ to compute and thus consider type of keys used when planning the number of key servers in your deployment.

ECDSA signing can be broken down into two steps. Since the first step — generating random values (to be used later with the private key and message to be signed) — represents the majority of the computational cost, we pre-generate these random values to significantly reduce latency. ECDSA signing requests are computationally isolated from RSA signing requests using separate worker pools to keep them as fast as possible.

Additional details can be found in the gokeyless server readme file ↗ file.

## Benchmarks

We conducted benchmarks using Cloudflare's gokeyless bench tool ↗ on a then current-generation, compute-optimized EC2 instance (c5.xlarge ↗). This particular instance has 4 vCPUs powered by 3.0 GHz Intel Xeon processors:

```
c5$ cat /proc/cpuinfo|grep "model name"model name  : Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHzmodel name  : Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHzmodel name  : Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHzmodel name  : Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHz
```

By default, bench runs with one worker goroutine per core (4) and a maximum number of operating system threads equal to the total number of cores (in this case, GOMAXPROCS=4). As expected and explained above, ECDSA signature performance far exceeds that of RSA. The results show that each core of this c5.xl machine can perform over 10,000 ECDSA signing operations/second and approximately 200 RSA signing operations/second.

When planning your deployment, determine the maximum number of new TLS connections per second you expect to terminate using a given key server and scale accordingly. For full high availability, each data center running keyless should be able to terminate the full workload that you anticipate.

### Results

#### ECDSA

```
c5$ bench -ski $ECDSA_SKI -op ECDSA-SHA256 -bandwidth -duration 60sTotal operations completed: 2661570Average operation duration: 22.543µs
```

#### RSA

```
c5$ bench -ski $RSA_SKI -op RSA-SHA256 -bandwidth -duration 60sTotal operations completed: 46560Average operation duration: 1.288659ms.
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

## Keyless delegation

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/reference/keyless-delegation/](https://developers.cloudflare.com/ssl/keyless-ssl/reference/keyless-delegation/)

Page options # Keyless delegation

Keyless Delegation is Cloudflare's implementation of the emerging delegated credentials standard (RFC 9345 ↗). When you upload a certificate for use with Keyless that has the special extension permitting the use of delegated credentials, Cloudflare will automatically produce a delegated credential and use it at the edge with clients that support this feature. The handshakes will complete without the extra latency induced by reaching back to the Keyless Server, and there are additional advantages to flexibility in algorithm choice ↗.

Behind the scenes we periodically create delegated credentials and sign them via Keyless, through the same mechanism used to sign the Certificate Verify messages our servers send when using Keyless. These credentials have a short lifetime, ensuring that if you disable Keyless the credentials created will become invalid within 24 hours. Supporting clients validate the credential, and the server can use the key it generated to sign the response to the TLS handshake without the round trip.

For security reasons certificates must contain a special identifier for use with delegated credentials. This takes the form of an optional X509 extension with NULL contents and the OID 1.3.6.1.4.1.44363.44. Your CA may need to make code changes to support delegated credentials.

Currently very few clients support delegated credentials, and only a handful of certificate authorities will issue certificates with the extension. We have had success with DigiCert. Firefox 77 and later support delegated credentials.

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

## Glossary

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/glossary/](https://developers.cloudflare.com/ssl/keyless-ssl/glossary/)

Page options # Glossary

## Cloudflare Keyless SSL key server (“key server”)

The key server is a daemon that you run on your own infrastructure. The key server receives inbound requests from Cloudflare's keyless client on TCP port 2407 (by default) so you must make sure that your firewall and other access control lists permit these requests from Cloudflare's IP ranges ↗.

Your key servers are contacted by Cloudflare during the TLS handshake process and must be online to terminate new TLS connections. Existing sessions can be resumed using unexpired TLS session tickets without needing to contact the key server.

## Cloudflare Keyless SSL client (“keyless client”)

The keyless client is a process that runs on Cloudflare's infrastructure. The keyless client makes outbound requests to your key server on TCP port 2407 for assistance in establishing new TLS sessions.

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

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/troubleshooting/](https://developers.cloudflare.com/ssl/keyless-ssl/troubleshooting/)

Page options # Troubleshooting

## Check the logs

To check logs, use a command similar to the following.

- systemd: sudo journalctl -f -u gokeyless
- upstart/sysvinit: sudo tail -f /var/log/gokeyless.log

## Enable debug logging

To enable debug logging, use a command similar to the following.

Terminal window ```
cd /etc/keylesssudo -u keyless gokeyless --loglevel 0
```

## Browsers are seeing a TLS connection failure after trying to connect

1. Make sure your key server is accessible from outside your network (tcp/2407).
2. Provide a packet capture:
sudo tcpdump -nni <interface> -s 0 -w keyless-$(date +%s).pcap port 2407

## Clients are connecting, but immediately aborting

If you run gokeyless with debug logging enabled, and you see logs like this:

```
[DEBUG] connection 162.158.57.220:37490: reading half closed by client[DEBUG] connection 162.158.57.220:37490: server closing connection[DEBUG] connection 162.158.57.220:37490 removed[DEBUG] spawning new connection: 162.158.57.220:37862[DEBUG] connection 162.158.57.220:37862: reading half closed by client[DEBUG] connection 162.158.57.220:37862: server closing connection[DEBUG] connection 162.158.57.220:37862 removed
```

These logs likely indicate that the key server is not using an appropriate server or .PEM file and the client is aborting the connection after the certificate exchange. The certificate must be signed by the keyless CA and the SANs must include the hostname of the keyless server. Here is a valid example for a keyless server located at 11aa40b4a5db06d4889e48e2f.example.com (note the Subject Alternative Name and Authority Key Identifier):

Terminal window ```
openssl x509 -in server.pem -noout -text -certopt no_subject,no_header,no_version,no_serial,no_signame,no_validity,no_subject,no_issuer,no_pubkey,no_sigdump,no_aux | sed -e 's/^        //'
```

```
X509v3 extensions:    X509v3 Key Usage: critical        Digital Signature, Key Encipherment    X509v3 Extended Key Usage:        TLS Web Server Authentication    X509v3 Basic Constraints: critical        CA:FALSE    X509v3 Subject Key Identifier:        DD:24:97:F1:A9:F1:4C:73:D9:1B:44:EC:A1:C3:10:E9:F0:41:98:BB    X509v3 Authority Key Identifier:        keyid:29:CE:8F:F1:9D:4C:BA:DE:55:78:D7:A6:29:E9:C5:FD:1D:9D:21:48
    X509v3 Subject Alternative Name:        DNS:11aa40b4a5db06d4889e48e2f.example.com    X509v3 CRL Distribution Points:
        Full Name:          URI:http://ca.cfdata.org/api/v1/crl/key_server
```

## The gokeyless binary cannot load the CA file

Ensure permissions are correct on all keys and certificates installed on the server.

## Keyless is affecting to unanticipated hosts

You will need to either provide a certificate for only those hosts or change the priority of the certificate in the SSL/TLS app of your Cloudflare dashboard.

## Key servers on Windows

Cloudflare currently only provide packages for the supported GNU/Linux distributions as per the Cloudflare package repository ↗.

However, the key server is open source so you may attempt to build and deploy a binary, but running on Windows is not a supported configuration so you may experience problems that Cloudflare will not be able to help with.

## Key server multi-domain support

You can use the same key server for multiple domains.

However, if you do, you will need to add the hostname and the Zone ID of the new domain to the gokeyless.yaml file.

## Additional questions

Contact your account team or Cloudflare Support.

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

## Post-quantum cryptography (PQC)

**來源**: [https://developers.cloudflare.com/ssl/post-quantum-cryptography/](https://developers.cloudflare.com/ssl/post-quantum-cryptography/)

Page options # Post-quantum cryptography (PQC)

Post-quantum cryptography (PQC) refers to cryptographic algorithms that have been designed to resist attacks from quantum computers ↗. Cloudflare has been researching and writing about post-quantum ↗ since 2017.

To protect you against the risk of harvest now, decrypt later attacks ↗, and considering all the connections that take place when your website or application is on Cloudflare, we have deployed and are actively expanding the use of post-quantum hybrid key agreement.

Refer to Cloudflare Radar ↗ for current statistics on the adoption of PQ encryption in requests to Cloudflare, and visit pq.cloudflareresearch.com ↗ to check if your connection is secured using PQ key agreement.

TLS 1.3

Cloudflare post-quantum key agreements are only supported in protocols based on TLS 1.3 (including HTTP/3) and are disabled for websites in FIPS mode.

## Three building blocks of TLS

Before TLS can protect your communications, three cryptographic algorithms have to be agreed on during the TLS handshake ↗:

- Symmetric ciphers: Algorithms used to encrypt and decrypt data, ensuring confidentiality and integrity (such as CHACHA20-POLY1305).
- Key agreement: A cryptographic protocol that allows client and server to safely agree on a shared key (such as ECDH).
- Signature algorithms: Cryptographic algorithms used to generate the digital signatures in TLS certificates (such as RSA and ECDSA).

As explained in our blog post ↗, symmetric ciphers are already post-quantum secure, which means there are two migrations left to occur.

### Hybrid key agreement

With TLS 1.3, X25519 ↗ - an Elliptic Curve Diffie-Hellman (ECDH) protocol - is the most commonly used algorithm in key agreement. However, its security can be broken by quantum computers using Shor's algorithm ↗.

It is urgent to migrate key agreement to post-quantum algorithms as soon as possible. The objective is to protect against an adversary capable of harvesting today's encrypted communications and storing it until some time in the future when they can gain access to a sufficiently powerful quantum computer to decrypt it.

In response to this, Cloudflare is an early adopter of ML-KEM, the post-quantum key agreement selected by the US National Institute of Standards and Technology (NIST). For a detailed timeline and more background information refer to The state of the post-quantum Internet ↗.

Cloudflare has deployed the following hybrid key agreements:

- X25519MLKEM768 ↗ (Recommended)

TLS identifier: 0x11ec
- TLS identifier: 0x11ec
- X25519Kyber768Draft00 ↗ (Obsolete)

TLS identifier: 0x6399
- TLS identifier: 0x6399

A hybrid key agreement lays the groundwork as more and more clients adopt post-quantum cryptography, while also maintaining the current security provided by X25519. It is a safer path in case of an unexpected breakthrough that renders all variants of ML-KEM insecure.

### Post-quantum signatures

The migration to post-quantum signatures is less urgent and more involved. Cloudflare is closely following the developments of new standards, testing their performance, and working together with browsers to understand user impact.

For details refer to A look at the latest post-quantum signature standardization candidates ↗.

## Three connections in the life of a request

```
flowchart LR
        accTitle: Three connections - from visitor to Cloudflare to origin server
        accDescr: Diagram showing connections for an uncached request.
        A[Visitor]
        subgraph Cloudflare
        X[(Cloudflare <br />service A)]
				B[(Cloudflare <br />service B)]
        end
        C[(Origin server)]

        A --1--> X
				X --2--> B
        B --3--> C
```

### 1. Visitor to Cloudflare

As of October 2022 ↗, all websites and APIs served through Cloudflare over TLS 1.3 support post-quantum hybrid key agreement. However, the connection is only post-quantum secured if the client also supports PQC.

Refer to Post-quantum cryptography support for a list of browsers and other clients that are compatible with hybrid key agreements.

### 2. Internal connections

As announced in September 2023 ↗, most internal connections for Cloudflare's products and systems have been upgraded to use PQC.

### 3. Cloudflare to your origin

Finally, Cloudflare also supports hybrid key agreements when connecting to origins. In this case, post-quantum secured connections will depend on the origin servers also supporting PQC. Customers can also configure connections to origin servers via PQ Cloudflare Tunnel.

Refer to Post-quantum cryptography between Cloudflare and origin servers for details.

## Protect corporate network traffic

With Zero Trust, Cloudflare allows organizations to upgrade their sensitive network traffic to PQC without the hassle of individually upgrading each and every corporate application, system, or network connection. Refer to Post-quantum cryptography in Cloudflare's Zero Trust platform for details.

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

## PQC support

**來源**: [https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/)

Page options # PQC support

Cloudflare's deployment of post-quantum hybrid key agreements is supported by different software as listed below. Contributions ↗ to keep the listing up-to-date are welcome!

Warning

The list below is for reference only. Responsibility for third-party software lies with their respective maintainers. Use them at your own discretion.

## X25519MLKEM768

- Default for Firefox 132+ ↗ on Desktop

For QUIC/HTTP3, use Firefox 135+
- For QUIC/HTTP3, use Firefox 135+
- Default for Chrome 131+ ↗
- Default for Edge 131+ ↗
- Default for recent Opera ↗ and Brave ↗
- Default for Tor Browser 15.0 ↗ on Desktop (Alpha)
- Cloudflare's fork of Go ↗
- Default for Go 1.24+ ↗
- Default for OpenSSL 3.5.0+ ↗
- Default for Node 24.5.0+ ↗
- BoringSSL ↗
- GnuTLS ↗

3.8.9+ compiled with leancrypto 1.2.0+
3.8.8-3.8.9 compiled with liboqs 0.11.0+
- 3.8.9+ compiled with leancrypto 1.2.0+
- 3.8.8-3.8.9 compiled with liboqs 0.11.0+
- rustls 0.23.22+ ↗
- Default for rpxy 0.9.4+ ↗
- Default for NGINX ↗ compiled with OpenSSL 3.5+ (instructions ↗)
- Open Quantum Safe ↗

C library: liboqs 0.10.0+
OpenSSL provider: oqs-provider 0.7.0+
- C library: liboqs 0.10.0+
- OpenSSL provider: oqs-provider 0.7.0+
- Zig 0.14.0+ ↗ (client)
- Default for Caddy HTTP server 2.10.0+ ↗
- Traefik ↗

Default for 3.4.2+, 2.11.26+ (commit ↗)
Configurable with curvePreferences in 3.5.0-rc.1+ ↗
- Default for 3.4.2+, 2.11.26+ (commit ↗)
- Configurable with curvePreferences in 3.5.0-rc.1+ ↗
- Botan C++ library 3.7.0+ ↗

## X25519Kyber768Draft00

- Default for Chrome 124-130 ↗ on Desktop

For older Chrome or on mobile, toggle TLS 1.3 hybridized Kyber support (enable-tls13-kyber) in chrome://flags.
- For older Chrome or on mobile, toggle TLS 1.3 hybridized Kyber support (enable-tls13-kyber) in chrome://flags.
- Default for Edge 124-130 ↗
- Firefox 124-131 ↗ if you turn on security.tls.enable_kyber in about:config

For QUIC/HTTP3, use Firefox 128+ with network.http.http3.enable_kyber.
- For QUIC/HTTP3, use Firefox 128+ with network.http.http3.enable_kyber.
- Cloudflare's fork of Go ↗
- Default for Go 1.23 ↗
- BoringSSL ↗
- GnuTLS ↗

3.8.8-3.8.9 compiled with liboqs 0.11.0+
3.8.7 compiled with liboqs 0.10.1+
- 3.8.8-3.8.9 compiled with liboqs 0.11.0+
- 3.8.7 compiled with liboqs 0.10.1+
- Cloudflare's fork of QUIC-go ↗
- Goutam Tamvada's fork of Firefox ↗
- Open Quantum Safe ↗

C library: liboqs 0.5.0+
OpenSSL provider: oqs-provider 0.5.0-0.8.0
- C library: liboqs 0.5.0+
- OpenSSL provider: oqs-provider 0.5.0-0.8.0
- Zig 0.11.0-0.13.0 ↗ (client)
- nginx ↗ when compiled with BoringSSL ↗ (guide ↗)
- Botan C++ library 3.2.0+ ↗ (instructions ↗)

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

## Post-quantum between Cloudflare and origin servers

**來源**: [https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-to-origin/](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-to-origin/)

Page options # Post-quantum between Cloudflare and origin servers

As explained in About PQC, Cloudflare has deployed support for hybrid key agreements, which includes both the most common key agreement for TLS 1.3, X25519, and the post-quantum secure ML-KEM.

With X25519, the ClientHello ↗ almost always fits within one network packet. However, with the addition of ML-KEM, the ClientHello is typically split across two packets.

This poses a question of how the origin servers - as well as other middleboxes (routers, load balancers, etc) - will handle this change in behavior. Although allowed by the TLS 1.3 standard (RFC 8446 ↗), a split ClientHello risks not being handled well due to protocol ossification ↗ and implementation bugs. Refer to our blog post ↗ for details.

Customers can also configure connections to origin servers via PQ Cloudflare Tunnel.

## ClientHello from Cloudflare

To reduce the risk of any issues when connecting to servers that are not ready for hybrid key agreements, Cloudflare leverages HelloRetryRequest. This means that, instead of sending X25519MLKEM768 immediately as a keyshare 1, Cloudflare will by default only advertise support for it.

If the origin supports post-quantum hybrid key agreement, it can use HelloRetryRequest to request it from Cloudflare.

## Set up

### Cloudflare zone settings

The method described above is the one Cloudflare uses to support post-quantum to all outbound connections. However, if your origin server supports PQC and prefers it, you can use the API to adjust your Cloudflare zone settings and avoid the extra round trip.

It is also possible to opt out of PQC using the same API endpoint.

Note

This setting affects all outbound connections from the zone you specify in the API call, including fetch() requests made by Workers on your zone.

Required API token permissions

At least one of the following token permissions is required: - Zone Settings Write
- Zone Write

Change Origin Post-Quantum Encryption setting ```
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/cache/origin_post_quantum_encryption" \  --request PUT \  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \  --json '{    "value": "<YOUR_CHOSEN_SETTING>"  }'
```

The possible values are:

- supported (most compatible): Advertise support for post-quantum key agreement, but send a classical keyshare in the first ClientHello.
- preferred (most performant): Send a post-quantum keyshare in the first ClientHello. Cloudflare continues to advertise support for classical keyshares as well.
- off: Do not send nor advertise support for post-quantum key agreement to the origin.

### Origin server

To make sure that your origin server prefers the post-quantum key agreement, use the bssl tool of BoringSSL ↗:

Terminal window ```
$ bssl client -connect (your server):443 -curves X25519MLKEM768
```

Verify that the ECDHE curve in the handshake output indicates X25519MLKEM768.

## Footnotes

1. When, to remove a round trip, a client makes a guess of what the server supports. ↩

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

## Post-quantum cryptography in Cloudflare's Zero Trust platform

**來源**: [https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-and-zero-trust/](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-and-zero-trust/)

Page options # Post-quantum cryptography in Cloudflare's Zero Trust platform

The Cloudflare Zero Trust platform replaces legacy corporate security perimeters with Cloudflare's global network, making access to the Internet and to corporate resources faster and safer for teams around the world.

Refer to the sections below to learn about the use cases supported by the Zero Trust platform in this first phase of quantum readiness.

## Agentless Cloudflare Access

You can use Cloudflare Access self-hosted applications in an agentless configuration to protect your organization's Internet traffic to internal web applications. Refer to the learning path for detailed guidance.

Even if the applications themselves have not yet migrated to post-quantum (PQ) cryptography, they will be protected against quantum threats.

Here is how it works today:

1. PQ connection via browser

As long as the end-user uses a modern web browser that supports post-quantum key agreement (for example, Chrome, Edge, or Firefox), the connection from the device to Cloudflare's network is secured via TLS 1.3 with post-quantum key agreement.

2. PQ within Cloudflare's global network

If the user and origin server are geographically distant, then the user's traffic will enter Cloudflare's global network in one geographic location (such as Frankfurt), and exit at another (such as San Francisco). As this traffic moves from one data center to another inside Cloudflare's global network, these hops through the network are secured via TLS 1.3 with post-quantum key agreement.

3. PQ Cloudflare Tunnel

Customers establish a Cloudflare Tunnel from their data center or public cloud — where their corporate web application is hosted — to Cloudflare's network. This tunnel is secured using TLS 1.3 with post-quantum key agreement, safeguarding it from harvest now, decrypt later attacks ↗.

Putting it together, Cloudflare Access can provide end-to-end quantum safety for accessing corporate HTTPS applications, without requiring customers to upgrade the security of corporate web applications.

## Secure Web Gateway

A secure web gateway (SWG) ↗ is used to secure access to third-party websites on the public Internet by intercepting and inspecting TLS traffic.

Cloudflare Gateway is now a quantum-safe SWG for HTTPS traffic. As long as the third-party website that is being inspected supports post-quantum key agreement, then Cloudflare's SWG also supports post-quantum key agreement. This is true regardless of the on-ramp that you use to get to Cloudflare's network, and only requires the use of a browser that supports post-quantum key agreement.

Cloudflare Gateway's HTTPS filtering feature involves two post-quantum TLS connections, as follows:

1. PQ connection via browsers

A TLS connection is initiated from the user's browser to a data center in Cloudflare's network that performs the TLS inspection. As long as the end-user uses a modern web browser that supports post-quantum key agreement (for example, Chrome, Edge, or Firefox), this connection is secured by TLS 1.3 with post-quantum key agreement.

2. PQ connection to the origin server

A TLS connection is initiated from a data center in Cloudflare's network to the origin server, which is typically controlled by a third party. The connection from Cloudflare's SWG currently supports post-quantum key agreement, as long as the third-party's origin server also already supports post-quantum key agreement. You can test this out by using https://pq.cloudflareresearch.com/ ↗ as your third-party origin server.

Putting it together, Cloudflare Gateway is quantum-ready to support secure access to any third-party website that is quantum ready today or in the future.

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

## TLS protocols

**來源**: [https://developers.cloudflare.com/ssl/reference/protocols/](https://developers.cloudflare.com/ssl/reference/protocols/)

Page options # TLS protocols

Cloudflare supports the following TLS protocols:

- TLS 1.0
- TLS 1.1
- TLS 1.2
- TLS 1.3

TLS 1.0 is the version that Cloudflare sets by default for all customers using certificate-based encryption.

For information about which cipher suites are supported between clients and the Cloudflare network, refer to Cipher suites.

## Understand TLS versions

A higher TLS version implies a stronger cryptographic standard. TLS 1.2 includes fixes for known vulnerabilities found in previous versions.

As of June 2018, TLS 1.2 is the version required by the Payment Card Industry (PCI) Security Standards Council. Cloudflare recommends migrating to TLS 1.2 to comply with the PCI requirement.

TLS 1.3, which offers additional security and performance improvements, was approved by the Internet Engineering Task Force (IETF) in May 2018.

## Decide which version to use

TLS 1.3 has become widely adopted. As a general rule, Cloudflare recommends setting TLS to 1.3, as it will provide the best security.

However, not all browser versions support TLS 1.2 and above. Depending on your particular business situation, this may present some limitations in using stronger encryption standards:

- Consider using TLS 1.0 or 1.1 for sites with a broad user base, particularly non-transactional sites. In this way, you minimize the possibility that some clients cannot connect to your site securely.
- For a narrow user base and sites that run internal applications or business and productivity applications, Cloudflare recommends TLS 1.2. These sites might already have more stringent security requirements or might be subject to PCI compliance. You also need to ensure that your users upgrade to a TLS 1.2 compliant browser.

## Related resources

- PCI compliance and vulnerabilities mitigation
- Transport Layer Security ↗
- PCI Security Standards Council ↗

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

## Certificate and hostname priority

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/](https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/)

Page options # Certificate and hostname priority

When a new certificate is created, Cloudflare first deploys the certificate and then serves it.

## Certificate deployment

For any given hostname, Cloudflare uses the following order to determine which certificate (and associated TLS settings) to apply to that hostname:

1. Hostname specificity: A specific subdomain certificate (www.example.com) would take precedence over a wildcard certificate (*.example.com) for requests to www.example.com.
2. Zone specificity: A specific subdomain certificate (www.example.com) would take precedence over a custom hostname certificate if the domain is active as a zone on Cloudflare.
3. Certificate priority: If the hostname is the same, certain types of certificates take precedence over others.





































PriorityCertificate Type1Keyless SSL2Custom Legacy3Custom Modern4Custom Hostname (Cloudflare for SaaS)5Advanced6Advanced - Total TLS7Universal
4. Certificate expiration: The most recently ordered certificate takes precedence unless a certificate deletion has occurred. If and when a certificate is deleted, the certificate with the latest expiration date is deployed.

Note

In this case, when the certificate with the closest expiration date is renewed, it will then become the one with the latest expiration date and get presented.

## Certificate presentation

Cloudflare uses the following order to determine the certificate and settings used during a TLS handshake:

1. SNI match: Certificates and settings that match the SNI hostname exactly take precedence.
2. SNI wildcard match: If there is not an exact match between the hostname and SNI hostname, Cloudflare uses certificates and settings that match an SNI wildcard.
3. IP address: If no SNI is presented, Cloudflare uses certificate based on the IP address (the hostname can support TLS handshakes made without SNI).

## Hostname priority

When multiple proxied DNS records exist for a hostname, in multiple zones — usually due to Cloudflare for SaaS — only one record will control the zone settings and associated origin server.

Cloudflare determines this priority in the following order, assuming each record exists and is proxied (orange-clouded):

1. Exact hostname match:

New custom hostname (belonging to a SaaS provider)
Legacy custom hostname (belonging to a SaaS provider)
DNS (belonging to the logical DNS zone)
2. New custom hostname (belonging to a SaaS provider)
3. Legacy custom hostname (belonging to a SaaS provider)
4. DNS (belonging to the logical DNS zone)
5. Wildcard hostname match:

DNS (belonging to the logical DNS zone)
New custom hostname (belonging to a SaaS provider)
6. DNS (belonging to the logical DNS zone)
7. New custom hostname (belonging to a SaaS provider)

If a hostname resource record is not proxied (gray-clouded) for a zone on Cloudflare, that zone's settings are not applied and any settings configured at the associated origin are applied instead. This origin could be another zone on Cloudflare or any other server.

### Example scenarios

#### Scenario 1

Customer1 uses Cloudflare as authoritative DNS for the zone shop.example.com. Customer2 is a SaaS provider that creates and successfully verifies the new custom hostname shop.example.com. Afterward, traffic starts routing over Customer2's zone:

- If Customer1 wants to regain control of their zone, Customer1 contacts Customer2 and requests them to delete the custom hostname record. Customer1 should make sure to have their record target updated to something other than the SaaS provider target, otherwise Customer1 would get a 1014 error.
- If Customer1 already has a proxied record for www.example.com when Customer2 creates and verifies a new custom hostname www.example.com, Orange-to-Orange applies.
- If Customer1 already has a proxied record for www.example.com in a legacy custom hostname setup (with another SaaS provider, Customer3) and Customer2 creates and verifies a new wildcard custom hostname for *.example.com, legacy custom hostname on Customer3 platform takes precedence due to exact hostname match.

#### Scenario 2

A customer has a proxied DNS record for their domain. The customer's zone on Cloudflare is using a Free plan.

This customer is also using a SaaS provider that uses Cloudflare for SaaS. The SaaS provider is using a Cloudflare Enterprise plan.

If the provider is using a wildcard custom hostname, then the original customer's plan limits will take precedence over the provider's plan limits (Cloudflare will treat the zone as a Free zone). To apply the Enterprise limits through Cloudflare for SaaS, the original customer's zone would need to either use a DNS-only record or the SaaS provider would need to use an exact hostname match.

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

## Certificate authorities

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-authorities/](https://developers.cloudflare.com/ssl/reference/certificate-authorities/)

Page options # Certificate authorities

For publicly trusted certificates, Cloudflare partners with different certificate authorities (CAs). Refer to this page to check what CAs are used for each Cloudflare offering and for more details about the CAs features, limitations, and browser compatibility.

## Availability per certificate type and encryption algorithm

| Certificate | Algorithm | Let's Encrypt | Google Trust Services | SSL.com | Sectigo |
| --- | --- | --- | --- | --- | --- |
| Universal | ECDSARSA(Paid plans only) | ✅✅ | ✅✅ | ✅✅ | N/AN/A |
| Advanced | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| Total TLS | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| SSL for SaaS | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| Backup | ECDSARSA | ✅✅ | ✅✅ | ✅✅ | ✅✅ |

## Features, limitations, and browser compatibility

Universal SSL

For Universal certificates, Cloudflare controls the validity periods and certificate authorities (CAs), making sure that renewal always occur. For details, refer to Universal SSL.

### Let's Encrypt

- Supports validity periods of 90 days.
- DCV tokens are valid for 7 days.

#### Limitations

- Hostname on certificate can contain up to 10 levels of subdomains.
- Duplicate certificate limit of 5 certificates ↗ per week.

#### Browser compatibility

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to Let's Encrypt documentation ↗.

The main determining factor for whether a platform can validate Let's Encrypt certificates is whether that platform trusts the self-signed ISRG Root X1 certificate. As Let's Encrypt announced a change in its chain of trust in 2024 ↗, older devices (for example Android 7.0 and earlier) that only trust the cross-signed version of the ISRG Root X1 are no longer compatible.

You can find the full list of supported clients in the Let's Encrypt documentation ↗. Older versions of Android and Java clients might not be compatible with Let's Encrypt certificates.

#### Other resources

Let's Encrypt Root CAs ↗: For checking compatibility between chain and client. As explained in Certificate pinning, you should not use this list for pinning against.

### Google Trust Services

- Supports validity periods of 14, 30, and 90 days.
- DCV tokens are valid for 14 days.

#### Limitations

- Punycode domains are not yet supported.

#### Browser compatibility (most compatible)

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to Google Trust Services documentation ↗.

By cross-signing with a GlobalSign root CA ↗ that has been installed in client devices for more than 20 years, Google Trust Services can ensure optimal support across a wide range of devices.

Currently trusted by Microsoft, Mozilla, Safari, Cisco, Oracle Java, and Qihoo’s 360 browser, all browsers or operating systems that depend on these root programs are covered.

You can use the root CAs list ↗ for checking compatibility between chain and client but, as explained in Certificate pinning, you should not use this list for pinning against.

### SSL.com

- Supports validity periods of 14, 30, and 90 days. Enterprise customers using advanced certificates can also choose a validity period of one year.
- DCV tokens are valid for 14 days.

#### Limitations

SSL.com DCV tokens are specific for RSA certificates and ECDSA certificates. This means that, for cases where you have to manually perform DCV, you will have to place two validation tokens per certificate order. To avoid management overhead, consider using a full setup, or setting up Delegated DCV.

#### Browser compatibility

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to SSL.com documentation ↗.

SSL.com is highly compatible, being accepted by over 99.9% of browsers, tablets, and mobile devices.

SSL.com certificates are cross-signed with Certum ↗ and the CA that cross-signs intermediates ↗ is from 2004.

#### Other resources

Acceptable top level domains (TLDs) and current restrictions ↗

### Sectigo

- Only used for Backup certificates.
- Backup certificates are valid for 90 days.

#### Browser compatibility

Refer to Sectigo documentation ↗.

## CAA records

A Certificate Authority Authorization (CAA) DNS record specifies which certificate authorities (CAs) are allowed to issue certificates for a domain. This record reduces the chance of unauthorized certificate issuance and promotes standardization across your organization.

If you are using Cloudflare as your DNS provider, then the CAA records will be added on your behalf. If you need to add CAA records, refer to Add CAA records.

The following table lists the CAA record content for each CA:

| Certificate authority | CAA record content |
| --- | --- |
| Let's Encrypt | letsencrypt.org |
| Google Trust Services | pki.goog; cansignhttpexchanges=yes |
| SSL.com | ssl.com |
| Sectigo | sectigo.com |

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

## Browser compatibility

**來源**: [https://developers.cloudflare.com/ssl/reference/browser-compatibility/](https://developers.cloudflare.com/ssl/reference/browser-compatibility/)

Page options # Browser compatibility

Cloudflare attempts to provide compatibility for as wide a range of user agents (browsers, API clients, etc.) as possible. However, the specific set of supported clients can vary depending on the different SSL/TLS certificate types, your visitor's browser version, and the certificate authority (CA) that issues the certificate.

## Universal SSL

Cloudflare Universal SSL only supports browsers and API clients that use the Server Name Indication (SNI) ↗ extension to the TLS protocol.

Also, for zones on Free plan, Universal SSL is only compatible with browsers that support Elliptic Curve Digital Signature Algorithm (ECDSA).

Paid plans have additional compatibility, also supporting RSA algorithm.

## Other certificate types

Refer to Certificate authorities for a detailed list of Cloudflare SSL/TLS offerings, the different algorithms available, and browser compatibility for each CA.

## Non-SNI support

Although SNI extensions ↗ to the TLS protocol were standardized in 2003, some browsers and operating systems only implemented this extension when TLS 1.1 was released in 2006 (or 2011 for mobile browsers). If your visitors use devices that have not been updated since 2011, they may not have SNI support.

To support non-SNI requests, you can:

- Upload a custom certificate and specify a value of Legacy for its client support.
Note that Legacy custom certificates are not compatible with BYOIP and that, unlike Universal SSL or advanced certificates, Cloudflare does not manage issuance and renewal for custom certificates.
- (BYOIP customers only) Enterprise customers can choose to bring their own IP prefix to the Cloudflare network and specify the default SNI used for any non-SNI handshake in the address map.
- (Paid plans only) Contact Cloudflare Support and request a set of non-SNI IPs for your zone.

## HTTPS records

HTTPS Service (HTTPS) records allow you to provide a client with information about how it should connect to a server upfront, without the need of an initial plaintext HTTP connection.

If your domain has HTTP/2 or HTTP/3 enabled and proxied DNS records, Cloudflare automatically generates HTTPS records on the fly, to advertise to clients how they should connect to your server.

Warning

Both HTTP/2 and HTTP/3 configurations also require that you have an SSL/TLS certificate served by Cloudflare. This means that disabling Universal SSL, for example, could impact this behavior.

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

## Entrust distrust by major browsers

**來源**: [https://developers.cloudflare.com/ssl/reference/migration-guides/entrust-distrust/](https://developers.cloudflare.com/ssl/reference/migration-guides/entrust-distrust/)

Page options # Entrust distrust by major browsers

Google Chrome and Mozilla have announced they will no longer trust certificates issued from Entrust's root CAs.

Since Entrust is not within the certificate authorities used by Cloudflare, this change may only affect customers who upload custom certificates issued by Entrust.

## The decision

New Entrust certificates issued on November 12, 2024 or after will not be trusted on Chrome by default. And new Entrust certificates issued on December 1, 2024 or after will not be trusted on Mozilla by default.

Refer to the announcements (Chrome ↗, Mozilla ↗) for a full list of roots that will be distrusted.

## Entrust's response

To prevent their customers from facing issues, Entrust has partnered with SSL.com, a different certificate authority, trusted by both Chrome and Mozilla.

This means that Entrust certificates will be issued using SSL.com roots.

## Cloudflare managed certificates

Since Cloudflare also partners with SSL.com, you can switch from uploading custom certificates to using Cloudflare's managed certificates. This change brings the following advantages:

- Use Advanced certificates to have more control and flexibility while also benefitting from automatic renewals.
- Enable Total TLS to automatically issue certificates for your proxied hostnames.
- Use Delegated DCV to reduce manual intervention when renewing certificates for partial (CNAME) setup zones.
- If you are a SaaS provider, extend the benefits of automatic renewals to your customers by specifying SSL.com as the certificate authority when creating or editing your custom hostnames (API only).

## More resources

- Use Cloudflare with SSL.com certificates
- Google Security Blog ↗
- Entrust TLS Certificate Information Center ↗

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

## Certificate pinning

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-pinning/](https://developers.cloudflare.com/ssl/reference/certificate-pinning/)

Page options # Certificate pinning

Cloudflare does not support HTTP public key pinning (HPKP)1 for Universal, Advanced, or Custom Hostname certificates.

This is because Cloudflare regularly changes the edge certificates provisioned for your domain and - if you had HPKP enabled - your domain would go offline. Additionally, industry experts ↗ discourage using HPKP.

For a better solution to the problem that HPKP is trying to solve - preventing certificate misissuance - use Certificate Transparency Monitoring. Also consider Cloudflare's blog post on modern alternatives to certificate pinning practices ↗.

To avoid downtime when pinning your certificates, use custom certificates and select user-defined bundle method. This way you can control which CA, intermediate, and certificate will be used after renewal.

## Footnotes

1. Key pinning allows a host to instruct a browser to only accept certain public keys when communicating with it for a given period of time. ↩

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

## Certificate statuses

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-statuses/](https://developers.cloudflare.com/ssl/reference/certificate-statuses/)

Page options # Certificate statuses

Certificates statuses show which stage of the issuance process each certificate is in.

## New certificates

When you order a new certificate, either an edge certificate or a certificate used for a custom hostname, its status will move through various stages as it progresses to Cloudflare's global network:

1. Initializing
2. Pending Validation
3. Pending Issuance
4. Pending Deployment
5. Active

Once you issue a certificate, it should be in Pending Validation, but change to Active after the validation is completed. If you see any errors, you or your customer may need to take additional actions to validate the certificate.

If you deactivate a certificate, it will become a Deactivating and then an Inactive status.

### Certificate replacement

When replacing a certificate, you may note a Pending Cleanup status. Old certificates are not deleted until the replacement has been successfully issued. This ensures TLS will not break for the hostname while the certificate is being replaced.

When the new certificate is successfully issued and activated, the status for the old certificate will transition from Pending Cleanup, and the certificate will be deleted.

## Custom certificates

If you are using a custom certificate and your zone status is Pending or Moved, your certificate may have a status of Holding Deployment.

When your zone becomes active, your custom certificate will deploy automatically (also moving to an Active status).

If your zone is already active when you upload a custom certificate, you will not see this status.

## Staging certificates

When you create certificates in your staging environment, those staging certificates have their own set of statuses:

- Staging deployment: Similar to Pending Deployment, but for staging certificates.
- Staging active: Similar to Active, but for staging certificates.
- Deactivating: Your staging certificate is in the process of becoming Inactive.
- Inactive: Your staging certificate is not at the edge, but you can deploy it if needed.

## Client certificates

When you use client certificates, those client certificates have their own set of statuses:

- Active: The client certificate is active.
- Revoked: The client certificate is revoked.
- Pending Reactivation: The client certificate was revoked, but it is being restored.
- Pending Revocation: The client certificate was active, but it is being revoked.

## Monitor certificate statuses

### SSL/TLS

Monitor a certificate's status in the dashboard at SSL/TLS > Edge Certificates or by using the Get Certificate Pack endpoint.

For more details on certificate validation, refer to Domain Control Validation.

### SSL for SaaS

Monitor a certificate's status in the dashboard at SSL/TLS > Custom Hostnames or by using the Custom Hostname Details endpoint.

For more details on certificate validation, refer to Issue and validate certificates.

### Via the command line

To view certificates, use openssl or your browser. The command below can be used in advance of your customer pointing the app.example.com hostname to the edge (provided validation was completed).

Terminal window ```
openssl s_client -servername app.example.com -connect $CNAME_TARGET:443 </dev/null 2>/dev/null | openssl x509 -noout -text | grep app.example.com
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

## Validity periods and renewal

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-validity-periods/](https://developers.cloudflare.com/ssl/reference/certificate-validity-periods/)

Page options # Validity periods and renewal

For certificates managed by Cloudflare, attempts to renew start at the auto renewal period and continue up until 24 hours before expiration. The auto renewal period varies according to the certificate validity period, as explained in the sections below.

If a certificate fails to renew and another valid certificate exists for the hostname, Cloudflare will deploy the valid certificate within the last 24 hours before expiration.

Note

For information regarding custom certificates (managed by you), consider this other page on renewal and expiration.

## Universal SSL

For Universal certificates, Cloudflare controls the validity periods and certificate authorities (CAs), making sure that renewal always occur.

Partial setup and DCV

If you are on a partial setup, make sure Domain control validation (DCV) is configured correctly. Refer to Troubleshooting DCV for further help.

Universal certificates have a 90-day validity period. The auto renewal period starts 30 days before expiration.

## Advanced certificates

When you order an advanced certificate, you can select different certificate validity periods. Each certificate validity period has a corresponding auto renewal period, when attempts to renew will start.

| Certificate validity period | Auto renewal period | Notes |
| --- | --- | --- |
| 1 year | 30 days | Limited to Enterprise customers using advanced certificates with SSL.com |
| 3 months | 30 days |  |
| 1 month | 7 days | Not supported by Let's Encrypt |
| 2 weeks | 3 days | Not supported by Let's Encrypt |

Note

For more details on the validity_days parameter used in API calls, refer to Order Advanced Certificate Pack.

## Benefits of shorter validity periods

Cloudflare only issues certificates with validity periods of three months or less for two reasons.

First, shorter-lived certificates limit the damage from key compromise and mistaken issuance. Any compromised key material will be valid for a shorter period of time.

Second, shorter certificates encourage automation. The more frequently you have to do a task, the more likely you will want to automate it. Automation also means that you are less likely to let a certificate expire in production or give a person access to key material.

For more details on the benefits of shorter validity periods, refer to our blog post introducing Advanced Certificate Manager ↗.

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

## Features and plans

**來源**: [https://developers.cloudflare.com/ssl/reference/all-features/](https://developers.cloudflare.com/ssl/reference/all-features/)

Page options # Features and plans

Cloudflare provides the following features for different plans ↗.

## Features

### Advanced Certificates

Link: Advanced Certificates

Feature availability - Free: Paid add-on
- Pro: Paid add-on
- Business: Paid add-on
- Enterprise: Paid add-on

### Authenticated origin pull

Link: Authenticated origin pull

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Backup Certificates

Link: Backup Certificates

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Can opt out? Enterprise-only

- Free: No
- Pro: No
- Business: No
- Enterprise: Yes

### Custom Certificates

Link: Custom Certificates

Feature availability - Free: No
- Pro: No
- Business: Yes
- Enterprise: Yes

Certificates included - Free: 0
- Pro: 0
- Business: 1 Modern and 1 Legacy
- Enterprise: 1 Modern (can purchase more) and 1 Legacy (can purchase more)

### Always Use HTTPS

Link: Always Use HTTPS

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Automatic HTTPS Rewrites

Link: Automatic HTTPS Rewrites

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Certificate Transparency Monitoring

Link: Certificate Transparency Monitoring

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Email Recipients - Free: All account members
- Pro: All account members
- Business: Specified email addresses
- Enterprise: Specified email addresses

### Opportunistic Encryption

Link: Opportunistic Encryption

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### HTTP Strict Transport Security

Link: HTTP Strict Transport Security

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### TLS 1.3

Link: TLS 1.3

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Minimum TLS Version

Link: Minimum TLS Version

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Per-hostname - Free: Included with Advanced Certificate Manager
- Pro: Included with Advanced Certificate Manager
- Business: Included with Advanced Certificate Manager
- Enterprise: Included with Advanced Certificate Manager

### Certificate Signing Requests

Link: Certificate Signing Requests

Feature availability - Free: No
- Pro: No
- Business: No
- Enterprise: Included with Advanced Certificate Manager

### Custom Hostnames

Link: Custom Hostnames

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Contact your account team

Hostnames included Varies

- Free: 100
- Pro: 100
- Business: 100
- Enterprise: Custom

Max hostnames - Free: 50,000
- Pro: 50,000
- Business: 50,000
- Enterprise: Unlimited, but contact sales if using over 50,000.

Price per additional hostname - Free: $0.10
- Pro: $0.10
- Business: $0.10
- Enterprise: Custom pricing

Custom analytics - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Custom origin - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

SNI Rewrite for Custom Origin - Free: No
- Pro: No
- Business: No
- Enterprise: Contact your account team

Custom certificates - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

CSR support - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

Selectable CA - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

Wildcard custom hostnames - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

Non-SNI support for SaaS zone - Free: No
- Pro: Yes
- Business: Yes
- Enterprise: Yes

mTLS support - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

WAF for SaaS - Free: WAF rules with current zone plan
- Pro: WAF rules with current zone plan
- Business: WAF rules with current zone plan
- Enterprise: Create and apply custom firewall rulesets.

Apex proxying/BYOIP - Free: No
- Pro: No
- Business: No
- Enterprise: Paid add-on

Custom metadata - Free: No
- Pro: No
- Business: No
- Enterprise: Paid add-on

### Custom origin trust store

Link: Custom origin trust store

Feature availability - Free: Included with Advanced Certificate Manager
- Pro: Included with Advanced Certificate Manager
- Business: Included with Advanced Certificate Manager
- Enterprise: Included with Advanced Certificate Manager

### SSL/TLS encryption mode

Link: SSL/TLS encryption mode

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Strict (SSL-Only Origin Pull) Enterprise-only

- Free: No
- Pro: No
- Business: No
- Enterprise: Yes

### Keyless SSL

Link: Keyless SSL

Feature availability - Free: No
- Pro: No
- Business: No
- Enterprise: Paid add-on

### Origin certificates

Link: Origin certificates

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Staging environment

Link: Staging environment

Feature availability - Free: No
- Pro: No
- Business: No
- Enterprise: Yes
(open beta)

### SSL/TLS Recommender

Link: SSL/TLS Recommender

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Custom cipher suites

Link: Custom cipher suites

Feature availability - Free: Included with Advanced Certificate Manager
- Pro: Included with Advanced Certificate Manager
- Business: Included with Advanced Certificate Manager
- Enterprise: Included with Advanced Certificate Manager

### Total TLS

Link: Total TLS

Feature availability - Free: Included with Advanced Certificate Manager
- Pro: Included with Advanced Certificate Manager
- Business: Included with Advanced Certificate Manager
- Enterprise: Included with Advanced Certificate Manager

### Delegated DCV

Link: Delegated DCV

Feature availability - Free: Included with Advanced Certificate Manager
- Pro: Included with Advanced Certificate Manager
- Business: Included with Advanced Certificate Manager
- Enterprise: Included with Advanced Certificate Manager

### Universal Certificates

Link: Universal Certificates

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

### Client Certificates

Link: Client Certificates

Feature availability - Free: Yes
- Pro: Yes
- Business: Yes
- Enterprise: Yes

Client Certificates included, issued by a Cloudflare Managed CA - Free: 100
- Pro: 100
- Business: 100
- Enterprise: 100 (default), but can allocate more quota.

Bring your own CA - Free: No
- Pro: No
- Business: No
- Enterprise: Yes

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

## Cloudflare and CVE-2019-1559

**來源**: [https://developers.cloudflare.com/ssl/reference/cloudflare-and-cve-2019-1559/](https://developers.cloudflare.com/ssl/reference/cloudflare-and-cve-2019-1559/)

Page options # Cloudflare and CVE-2019-1559

The GOLDENDOODLE and Zombie POODLE attacks ↗ affect applications that use certain cipher suites associated with TLS 1.2.

Any application on Cloudflare, however, is not vulnerable to these attacks because Cloudflare does not use the affected version of openssl at its edge.

Cloudflare could not remove these cipher suites from our edge by default because we did not want to break customer applications using legacy cipher suites.

## Remove warnings from external security scanners

Even though your application is not vulnerable to CVE-2019-1559, some security scanners may flag your application erroneously.

To remove these warnings, refer to Customize cipher suites and exclude the following ciphers:

- ECDHE-ECDSA-AES256-SHA384
- ECDHE-ECDSA-AES128-SHA256
- ECDHE-RSA-AES256-SHA384

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

## PCI compliance and vulnerabilities mitigation

**來源**: [https://developers.cloudflare.com/ssl/reference/compliance-and-vulnerabilities/](https://developers.cloudflare.com/ssl/reference/compliance-and-vulnerabilities/)

Page options # PCI compliance and vulnerabilities mitigation

Both TLS 1.0 and TLS 1.1 are insufficient for protecting information due to known vulnerabilities. Specifically for Cloudflare customers, the primary impact of PCI is that TLS 1.0 and TLS 1.1 are insufficient to secure payment card related traffic.

PCI standards recommend using TLS 1.2 or higher. Refer to Compliance standards for a list of recommended cipher suites.

Cloudflare also implements mitigations against known vulnerabilities for TLS 1.0 and 1.1.

## Set Minimum TLS Version to 1.2

To configure your Cloudflare domain to only allow connections using TLS 1.2 or newer protocols:

1. Log in to the Cloudflare dashboard.
2. Select your Cloudflare account and website or application.
3. Go to SSL/TLS > Edge Certificates.
4. For Minimum TLS Version, select TLS 1.2 or higher.

Refer to Minimum TLS version for more information about this setting and other setup options.

## Known vulnerabilities mitigations

There are several mitigations Cloudflare performs against known vulnerabilities for TLS versions prior to 1.2. For example, Cloudflare does not support:

- Header compression in TLS
- Header compression in SPDY 3.1
- RC4
- SSL 3.0
- Renegotiation with clients
- DHE ciphersuites
- Export-grade ciphers

Cloudflare mitigations protect against several attacks:

- CRIME
- BREACH
- POODLE
- RC4 Cryptographic Weaknesses
- SSL Renegotiation Attack
- Protocol Downgrade Attacks
- FREAK
- LogJam
- 3DES is disabled entirely for TLS 1.1 and 1.2 and Cloudflare implements mitigations for TLS 1.0

Cloudflare provides additional mitigations for:

- Heartbleed
- Lucky Thirteen
- CCS injection vulnerability

Cloudflare has patched all servers against these vulnerabilities. Also, the Cloudflare Web Application Firewall has managed rules that mitigate several of these vulnerabilities including Heartbleed and ShellShock.

### Return of Bleichenbacher's Oracle Threat (ROBOT)

Security scans that note the presence of ROBOT while on Cloudflare are a false positive. Cloudflare checks padding in real time and swaps to a random session key if the padding is incorrect.

### Sweet32 (CVE-2016-2183)

A vulnerability in the use of the Triple DES (3DES) encryption algorithm in the Transport Layer Security (TLS) protocol. Sweet32 is currently a proof of concept attack, there are no known examples of this in the wild. Cloudflare has manually mitigated the vulnerability for TLS 1.0 in the following manner:

- The attacker must collect 32GB of data from a single TLS session.
- Cloudflare forces new TLS 1.0 session keys on the affected 3DES cipher well before 32GB of data is collected.

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

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/](https://developers.cloudflare.com/ssl/troubleshooting/)

Page options # Troubleshooting

For FAQs and other troubleshooting information, refer to the following resources:

Filter resources... Troubleshooting client certificates

Troubleshooting Keyless SSL

Cloudflare and CVE-2019-1559

General FAQ

General SSL errors

Mixed content errors

ERR_TOO_MANY_REDIRECTS

Fix VERSION_OR_CIPHER_MISMATCH

Troubleshooting Domain Control Validation

Troubleshooting | Custom certificates

CAs and edge certificates FAQ

Certification Authority Authorization (CAA) FAQ

Troubleshooting Universal SSL

Troubleshooting Cloudflare origin CA

Troubleshooting - Cipher suites — Edge certificates

Total TLS error messages

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

## General SSL errors

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/general-ssl-errors/](https://developers.cloudflare.com/ssl/troubleshooting/general-ssl-errors/)

Page options # General SSL errors

## Let's Encrypt chain update

### Symptom

Starting September 9, 2024, visitors that try to connect to your website using older devices - for example, Android 7.0 and earlier - have access problems or reach security warnings.

### Resolution

The fastest way to resolve this issue is to change your certificate to use Google Trust Services as the certificate authority.

## Outdated browsers

### Symptom

Until Cloudflare provides an SSL certificate for your domain, the following errors may appear in various browsers for HTTPS traffic:

- Firefox: _ssl_error_bad_cert_domain / This connection is untrusted
- Chrome: Your connection is not private
- Safari: Safari can't verify the identity of the website
- Edge / Internet Explorer: There is a problem with this website's security certificate

### Resolution

Even with a Cloudflare SSL certificate provisioned for your domain, older browsers display errors about untrusted SSL certificates because they do not support the Server Name Indication (SNI) protocol ↗ used by Cloudflare Universal SSL certificates.

To solve, determine if the browser supports SNI ↗. If not, upgrade your browser.

Note

It is possible for Cloudflare Support to enable non-SNI support for paid plans using any certificate.

## Only some of your subdomains return SSL errors

### Symptom

Cloudflare Universal SSL certificates only cover the apex domain (example.com) and one level of subdomains (blog.example.com). If visitors to your domain observe errors accessing a second level of subdomains in their browser (such as dev.www.example.com) but not the first level of subdomains, resolve the issue using one of the following methods below.

### Resolution

- Purchase an advanced certificate that covers dev.www.example.com.
- Upload a Custom SSL certificate that covers dev.www.example.com.
- Enable Total TLS.
- If you have a valid certificate for the second level subdomains at your origin web server, change the DNS record for dev.www to DNS Only (grey cloud).

## Your Cloudflare Universal SSL certificate is not active

### Symptom

All active Cloudflare domains are provided a Universal SSL certificate. If you observe SSL errors and do not have a certificate of Type Universal within the Edge Certificates tab of the Cloudflare SSL/TLS app for your domain, the Universal SSL certificate has not yet provisioned.

Our SSL vendors verify each SSL certificate request before Cloudflare can issue a certificate for a domain name. This process may take anywhere from 15 minutes to 24 hours. Our SSL certificate vendors sometimes flag a domain name for additional review.

### Resolution

#### No Universal certificate

If your Cloudflare SSL certificate is not issued within 24 hours of Cloudflare domain activation:

- If your origin web server has a valid SSL certificate, temporarily pause Cloudflare, and
- Contact Support and provide a screenshot of the errors.

Temporarily pausing Cloudflare will allow the HTTPS traffic to be served properly from your origin web server while the support team investigates the issue.

#### Full DNS setup

If your domain is on a full setup, review your DNS records.

Cloudflare SSL/TLS certificates only apply for traffic proxied through Cloudflare. If SSL errors only occur for hostnames not proxied to Cloudflare, proxy those hostnames through Cloudflare.

#### Partial DNS setup

If your domain is on a partial setup, confirm whether you have CAA DNS records enabled at your current hosting provider. If so, ensure you specify the Certificate Authorities that Cloudflare uses to provision certificates for your domain.

## OCSP response error

### Symptom

Visitors to your site observe an OCSP response error.

### Resolution

This error is either caused by the browser version or an issue requiring attention by one of Cloudflare’s SSL vendors. In order to properly diagnose, contact Support with the following information provided by the visitor that observes the browser error:

1. The output from https://aboutmybrowser.com/ ↗  .
2. The output of https://<YOUR_DOMAIN>/cdn-cgi/trace from the visitor’s browser.

## Incorrect HSTS headers

### Symptom

The HSTS headers (Strict-Transport-Security and X-Content-Type-Options) in the response do not match the configuration settings defined in your HSTS settings.

### Resolution

You may have configured Response Header Transform Rules that are overriding the HSTS header values defined in the SSL/TLS app.

1. Go to Rules > Overview.
2. Under Response Header Transform Rules, search for a rule setting the value of one of the HSTS headers (Strict-Transport-Security or X-Content-Type-Options).
3. Delete (or edit) the rule so that the HSTS configuration settings defined in the SSL/TLS app are applied.
4. Repeat this procedure for the other HSTS header.

## Other errors

### Symptom

You are getting the error NET::ERR_CERT_COMMON_NAME_INVALID in your browser.

### Resolution

- Make sure that you are using a browser that supports SNI (Server Name Indication) ↗. Refer to Browser compatibility for more details.
- Ensure that the hostname you are accessing is set to proxied (orange cloud) in the DNS tab of your Cloudflare Dashboard.
- If the hostname you are accessing is a second level subdomain (such as dev.www.example.com), you'll need to either:

Purchase an advanced certificate that covers dev.www.example.com.
Upload a Custom SSL certificate that covers dev.www.example.com.
Enable Total TLS
- Purchase an advanced certificate that covers dev.www.example.com.
- Upload a Custom SSL certificate that covers dev.www.example.com.
- Enable Total TLS

Note

The following openssl ↗ command might help troubleshooting TLS handshake between the client and the Cloudflare network edge:

Terminal window ```
openssl s_client -connect example.com:443 -servername example.com version
```

## Kaspersky Antivirus

To avoid SSL errors with the Cloudflare dashboard when using Kaspersky Antivirus, allow dash.cloudflare.com in Kaspersky.

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

## ERR_SSL_VERSION_OR_CIPHER_MISMATCH

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/version-cipher-mismatch/](https://developers.cloudflare.com/ssl/troubleshooting/version-cipher-mismatch/)

Page options # ERR_SSL_VERSION_OR_CIPHER_MISMATCH

After you add a new domain to Cloudflare, your visitors' browsers might display one of the following errors:

- ERR_SSL_VERSION_OR_CIPHER_MISMATCH (Chrome)
- Unsupported protocol The client and server don’t support a common SSL protocol version or cipher suite (Chrome)
- SSL_ERROR_NO_CYPHER_OVERLAP (Firefox)

This error occurs when your domain or subdomain is not covered by an SSL/TLS certificate, which is usually caused by:

- A delay in certificate activation.
- An unproxied domain or subdomain DNS record.
- An expired Custom certificate.
- A multi-level subdomain (test.dev.example.com).

## Decision tree

```
flowchart TD
accTitle: Troubleshooting ERR_SSL_VERSION_OR_CIPHER_MISMATCH decision tree
A>Is your certificate active?] -- Yes --> B>Is the DNS record proxied?]
A -- No --> C[Wait for certificate to activate or pause Cloudflare]
B -- No --> D[Proxy the DNS record]
B -- Yes --> E>Are you using a custom certificate?]
E -- Yes --> F[Custom certificate may be expired]
E -- No --> G>Are you accessing a multi-level subdomain?]
G -- Yes --> H[Get an advanced or custom certificate]
```

## Certificate activation

For domains on a full setup1, your domain should automatically receive its Universal SSL certificate within 15 minutes to 24 hours of domain activation2.

This certificate will cover your zone apex (example.com) and all first-level subdomains (subdomain.example.com), and is provisioned even if your records are DNS only. However, the certificate will only be presented if your domain or subdomains are proxied.

## Footnotes

1. The most common Cloudflare setup that involves changing your authoritative nameservers. ↩
2. Provisioning time depends on certain security checks and other requirements mandated by Certificate Authorities (CA). ↩

### Potential issues

If your visitors experience ERR_SSL_VERSION_OR_CIPHER_MISMATCH (Chrome) or SSL_ERROR_NO_CYPHER_OVERLAP (Firefox), check the status of your Universal certificate:

1. Log into the Cloudflare dashboard ↗.
2. Choose your account and domain.
3. Go to SSL > Edge Certificates.
4. Find the certificate with the Type of Universal.
5. Make sure the Status is Active.

If the Status is anything other than Active, you can either wait a bit longer for certificate activation or take immediate action.

### Solutions

If you need to immediately resolve this error, temporarily pause Cloudflare.

Since Universal certificates can take up to 24 hours to be issued, wait and monitor the certificate's status. Once your certificate becomes Active, unpause Cloudflare using whichever method you used previously.

If your certificate is still not Active after 24 hours, try the various troubleshooting steps used to resolve timeout issues. If these methods are successful (and your certificate becomes Active), unpause Cloudflare using whichever method you used previously.

## Proxied DNS records

Cloudflare Universal and Advanced certificates only cover the domains and subdomains you have proxied through Cloudflare.

If the Proxy status of A, AAAA, or CNAME records for a hostname are DNS-only, you will need to change it to Proxied.

## Certificate expiration

If you have a Custom certificate and visitors experience ERR_SSL_VERSION_OR_CIPHER_MISMATCH (Chrome) or SSL_ERROR_NO_CYPHER_OVERLAP (Firefox), check its status to make sure it is not expired.

If it is expired, upload a replacement certificate.

## Multi-level subdomains

By default, Cloudflare Universal SSL certificates only cover your apex domain and one level of subdomain.

| Hostname | Covered by Universal certificate? |
| --- | --- |
| example.com | Yes |
| www.example.com | Yes |
| docs.example.com | Yes |
| dev.docs.example.com | No |
| test.dev.api.example.com | No |

This means that you might experience ERR_SSL_VERSION_OR_CIPHER_MISMATCH (Chrome) or SSL_ERROR_NO_CYPHER_OVERLAP (Firefox) on multi-level subdomains.

To prevent insecure connections on a multi-level subdomain, do one of the following:

- Enable Total TLS, which automatically issues individual certificates to your proxied hostnames not covered by a Universal certificate.
- Order an Advanced Certificate covering the subdomain.
- Upload a Custom Certificate covering the subdomain.

If none of these solutions work, you could also remove the multi-level subdomain.

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

## ERR_TOO_MANY_REDIRECTS

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/)

Page options # ERR_TOO_MANY_REDIRECTS

After you add a new domain to Cloudflare, your visitors' browsers might display ERR_TOO_MANY_REDIRECTS or The page isn’t redirecting properly errors.

This error occurs when visitors get stuck in a redirect loop.

```
flowchart LR
accTitle: Redirect loops illustration
A[Request for <code>http://</code><code>example.com</code>] --> B[Redirect to <code>https://</code><code>example.com</code>]
B --> C[Redirect to <code>http://</code><code>example.com</code>]
C --> B
subgraph Redirect Loop
B
C
end
```

This error is commonly caused by:

- A misconfiguration of your SSL/TLS Encryption mode.
- Various settings in SSL/TLS > Edge Certificates.
- A misconfigured redirect rule.

Note

For assistance determining if your origin web server is responding with redirects, contact your hosting provider or site administrator.

## Encryption mode misconfigurations

Your domain's SSL/TLS Encryption mode controls how Cloudflare connects to your origin server and how SSL certificates presented by your origin will be validated.

This setting can cause redirect loops when the value you set in Cloudflare conflicts with the settings at your origin web server.

### Flexible encryption mode

If your domain's encryption mode is set to Flexible, Cloudflare sends unencrypted requests to your origin server over HTTP.

Redirect loops will occur if your origin server automatically redirects all HTTP requests to HTTPS.

```
flowchart TD
accTitle: Redirect loops illustration for Flexible mode
A[Request for <code>https://</code><code>example.com</code>] --> B[Encryption mode redirects to <code>http://</code><code>example.com</code>]
B --> C[Origin server redirects to <code>https://</code><code>example.com</code>]
C --> B
subgraph Cloudflare
B
end
subgraph Origin server
C
end
```

To solve this issue, either remove HTTPS redirects from your origin server or update your SSL/TLS Encryption Mode to be Full or higher (requires an SSL certificate configured at your origin server).

### Full or Full (strict) encryption mode

If your domain's encryption mode is set to Full or Full (strict), Cloudflare sends encrypted requests to your origin server over HTTPS.

Redirect loops will occur if your origin server automatically redirects all HTTPS requests to HTTP.

```
flowchart TD
accTitle: Redirect loops illustration for Full or Full (strict) mode
A[Request for <code>http://</code><code>example.com</code>] --> B[Encryption mode redirects to <code>https://</code><code>example.com</code>]
B --> C[Origin server redirects to <code>http://</code><code>example.com</code>]
C --> B
subgraph Cloudflare
B
end
subgraph Origin server
C
end
```

To solve this issue, remove HTTP redirects from your origin server.

## Edge certificate settings

### Always use HTTPS

If you have Always Use HTTPS enabled for your domain, Cloudflare redirects all http requests to https for all subdomains and hosts in your application.

Redirect loops will occur if your origin server automatically redirects all HTTPS requests to HTTP.

```
flowchart TD
accTitle: Redirect loops illustration for Always Use HTTPS
A[Request for <code>http://</code><code>example.com</code>] --> B[Always Use HTTPS redirects to <code>https://</code><code>example.com</code>]
B --> C[Origin server redirects to <code>http://</code><code>example.com</code>]
C --> B
subgraph Cloudflare
B
end
subgraph Origin server
C
end
```

To solve this issue, remove HTTPS redirects from your origin server or disable Always Use HTTPS.

### HSTS

If you have HTTP Strict Transport Security (HSTS) enabled for your domain, Cloudflare directs compliant web browsers to transform http links to https links.

Redirect loops will occur if your origin server automatically redirects all HTTPS requests to HTTP or if you have your domain's encryption mode set to Off.

```
flowchart TD
accTitle: Redirect loops illustration for HTTP Strict Transport Security
A[Request for <code>https://</code><code>example.com</code>] --> B[Encryption mode redirects to <code>http://</code><code>example.com</code>]
B --> C[HSTS redirects to <code>https://</code><code>example.com</code>]
C --> B
C --> D[Origin server redirects to <code>http://</code><code>example.com</code>]
D --> C
subgraph Cloudflare
B
C
end
subgraph Origin server
D
end
```

To solve this issue, remove HTTPS redirects from your origin server and make sure your domain's encryption mode is Flexible or higher.

Alternatively, disable HTTP Strict Transport Security (HSTS).

## Redirect rules

Redirect loops can also occur if you have conflicting URL redirects.

```
flowchart TD
accTitle: Redirect loops illustration for redirect rules
A[Request for <code>https://</code><code>a.example.com</code>] --> B[Redirect to <code>http://</code><code>b.example.com</code>]
B --> C[Redirect to <code>https://</code><code>a.example.com</code>]
C --> B
subgraph Cloudflare
B
C
end
```

To solve this issue, review your various redirect rules and Page Rules to make sure no rules are not in conflict with each other.

Note

To reduce the potential for redirect loops and mixed content errors, Cloudflare recommends WordPress users to install the Cloudflare WordPress plugin ↗ at their origin web server and enable the Automatic HTTPS rewrites option within the plugin.

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

## Mixed content errors

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/](https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/)

Page options # Mixed content errors

Domains added to Cloudflare receive SSL certificates and can serve traffic over HTTPS. However, after starting to use Cloudflare, some customers notice missing content or page rendering issues when they first serve HTTPS traffic.

Typically, the problem is due to a request for HTTP resources from a web page served over HTTPS. For example, you type https://example.com in a browser and the page contains an image reference via HTTP in the HTML to <img src="http://example.com/resource.jpg">.

Normally, if your website loads all resources securely over HTTPS, visitors observe a lock icon in the address bar of their browser.

This indicates your site has a working SSL certificate and all resources loaded by the site are loaded over HTTPS. The green lock assures visitors that their connection is safe. One of the symptoms of mixed content is that different icons appear instead of the green lock icon.

## Symptoms of mixed content occurrence

Most modern browsers block HTTP requests on secure HTTPS pages. Blocked content can include images, JavaScript, CSS, or other content that affects how the page looks or behaves.

### Browser indications

Each web browser uses different methods to warn visitors about mixed content on a website, potentially including:

- A yellow triangle or information symbol beside the URL bar
- Messages mentioning "secure content"

### Console logs

For mixed content warnings, the web browser loads the resources but users do not see the lock icon in the URL. Warning messages appear within the browser’s debug tools:

For mixed content errors, the browser refuses to load the resources over an insecure connection:

Information on using the browser’s debug tools to locate these issues are found in the documentation for Chrome ↗ and Firefox ↗. Alternatively, you can view your page source and find specific references of http:// for paths to other resources.

## Resolution

### General advice

There are two methods to resolve mixed content errors.

1. Load all resources via your HTML source without specifying the HTTP or HTTPS protocols.
For example, using /domain.com/path/to.file instead of http://domain.com/path/to.file.
2. Depending on your Content Management System, check for plugins that automatically rewrite HTTP resources to HTTPS. Cloudflare provides such a service via Automatic HTTPS Rewrites.

### WordPress users

Cloudflare recommends WordPress users to install the Cloudflare WordPress plugin ↗ and enable the Automatic HTTPS rewrites option within the plugin.

## Related resources

- Debugging mixed content in Chrome ↗
- Debugging mixed content in Firefox ↗
- Community Tip - Fixing mixed content errors ↗

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

## FAQ

**來源**: [https://developers.cloudflare.com/ssl/troubleshooting/faq/](https://developers.cloudflare.com/ssl/troubleshooting/faq/)

Page options # FAQ

The following provide answers to the most common questions associated with Cloudflare SSL/TLS certificates and settings.

## If I have multiple Cloudflare certificates, which one is used?

Cloudflare certificates are prioritized by a combination of hostname specificity, zone specificity, and certificate type.

For more details, refer to Certificate and hostname priority.

Warning

Occasionally, the Cloudflare dashboard displays a wildcard certificate with only the apex hostname listed (and does not include the wildcard symbol *).

This behavior occurs when all of the following conditions are true:

- The zone is on a subdomain setup.
- The certificate has a subject or SAN that is a wildcard for the zone's parent domain.

## Will having Cloudflare's SSL help with SEO?

Yes, Google announced that they use HTTPS as a ranking signal for SEO ↗.

For further SEO tweaks, refer to our article on improving SEO Rankings with Cloudflare.

## How long does it take for Cloudflare's SSL to activate?

If Cloudflare is your authoritative DNS provider, Universal SSL certificates typically issue within 15 minutes of domain activation at Cloudflare and do not require further customer action after domain activation.

Alternatively, if you use Cloudflare services via CNAME records set at your authoritative DNS provider, provisioning your Universal SSL certificate requires manual addition of DNS verification records at your authoritative DNS provider. Advanced SSL certificates also typically issue within 15 minutes.

If the Certificate Authority requires a manual review of brand, phishing, or TLD requirements, a Universal SSL certificate can take longer than 24 hours to issue.

## What does SSL invalid brand check mean?

Some domains are not eligible for the Universal SSL if they contain words that conflict with trademarked domains.

To resolve this issue, you can:

- Purchase an advanced certificate.
- Upload your own custom certificate.

## Does Cloudflare SSL support Internationalized Domain Names (IDN)?

The double byte / IDN / punycode domains support for Cloudflare edge certificates depends on the certificate authority (CA).
Google Trust Services does not support punycode domains as mentioned in the certificate authorities limitations.

## How do I redirect all visitors to HTTPS/SSL?

Refer to Encrypt all visitor traffic.

## Does SSL work for hosting partners?

A free Universal SSL certificate is available for all new Cloudflare domains added via a hosting partner using both full and partial setups.

For more details, refer to Enable Universal SSL certificates.

Note

For domains added to Cloudflare prior to December 9, 2016, the hosting
partner must delete and re-add the domain to Cloudflare to provision the
SSL certificate.

## Are Cloudflare SSL certificates shared?

No. Cloudflare SSL/TLS certificates are not shared across domains nor across customers.

## Why do I see a Cloudflare certificate when an SSL certificate is installed at my website?

Cloudflare must decrypt traffic in order to cache and filter malicious traffic. Cloudflare either re-encrypts traffic or sends plain text traffic to the origin web server depending on your domain's encryption mode.

## I want Cloudflare to use an SSL certificate that I purchased elsewhere.

Domains on Business and Enterprise plans can upload a Custom SSL certificate.

## Does enabling Cloudflare affect PayPal's TLS 1.2 requirement?

No. Since Cloudflare does not proxy connections made directly to paypal.com, enabling Cloudflare for your domain does not affect how TLS connections are made.

However, note that PayPal IPN (Instant Payment Notification) might not support TLS version 1.3 if you have it enabled on your zone.
If you are encountering issues with PayPal IPN when the traffic is proxied by Cloudflare, try setting the Minimum TLS version to 1.2.

## Does Cloudflare support TLS client authentication?

Yes. For more details, refer to our documentation on Mutual TLS authentication.

## How do I obtain an SSL certificate for customers on partial (CNAME) setup?

A partial DNS setup requires additional steps to provision and validate an SSL certificate.

For more details, refer to Enable Universal SSL.

## Can I use Certificate Pinning?

No. Multiple industry leaders — including Digicert ↗ and Mozilla ↗ — have discouraged certificate pinning because of security concerns.

For a safer alternative, use Certificate Transparency Monitoring.

Refer to Certificate pinning for more details.

## Where can I learn more about SSL?

To learn more about SSL, go to the Cloudflare Learning Center ↗.

## Redsys is not working with my Let's Encrypt Certificate.

The Let's Encrypt Certificate Authority and SNI are not currently supported by Redsys.

We recommend one of the following options:

- Change the Universal Certificate Authority to a different CA.
- Add an advanced certificate or custom certificate using a different CA.

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

## Origin server

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/](https://developers.cloudflare.com/ssl/origin-configuration/)

Page options # Origin server

Learn more about SSL/TLS protection options for your origin servers:

- Encryption modes
- SSL/TLS Recommender
- Cloudflare origin CA
- Authenticated Origin Pulls (mTLS)
- Custom Origin Trust Store
- Cipher suites

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

## Additional options

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/)

Page options # Additional options

Once you set up SSL/TLS on your application, you can adjust the following settings in SSL/TLS > Edge Certificates:

- Cipher suites
- Certificate Transparency Monitoring
- HTTP Strict Transport Security (HSTS)
- Certificate Signing Requests (CSRs)
- TLS 1.3
- Minimum TLS Version
- Automatic HTTPS Rewrites
- Total TLS
- Always Use HTTPS
- Opportunistic Encryption

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

## Bundle methodologies

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/bundling-methodologies](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/bundling-methodologies)

Page options # Bundle methodologies

When an SSL certificate is deployed to Cloudflare's global network, it may be augmented with intermediate and root certificates to assist the user agent in finding a chain to a publicly trusted root.

You can control the mechanics of how certificates are bundled by specifying a bundling methodology.

## Intermediate and root certificates

Cloudflare maintains intermediate and root certificates used for bundling on a GitHub repository ↗. As the certificates expire or are removed by certificate authorities, Cloudflare removes and adds them accordingly.

Expiration values for these certificates may appear in the expires_on field when you use the Analyze Certificate endpoint - often when the methodology you specify is Compatible. However, these expiration values reflect intermediate and root certificates - which are handled by Cloudflare -, not the leaf certificate you would have previously uploaded to Cloudflare.

## Methodologies

### Compatible

Compatible is the default methodology and uses common and well distributed intermediate certificates to complete the chain. This ensures that the resulting bundle is compatible with as many clients as possible.
The related value for the bundle_method parameter when using the API is ubiquitous.

### Modern

Modern consists of attempts to make the chain as efficient as possible, often by using newer or fewer intermediate certificates.
The related value for the bundle_method parameter when using the API is optimal.

### User-defined

User-defined allows you to paste your own certificate chain and present that bundle to clients. You must specify any intermediates you wish to use, followed by the leaf. If you are using a self-signed certificate (not recommended), you must use this mode.
The related value for the bundle_method parameter when using the API is force.

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

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/](https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/)

Page options # Troubleshooting

Learn more about troubleshooting issues with your edge certificates:

- CAs and certificates FAQ
- Certification Authority Authorization (CAA) FAQ

- Troubleshooting domain control validation (DCV)

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

## 未知標題

**來源**: [https://developers.cloudflare.com/ssl/static/origin_ca_ecc_root.pem](https://developers.cloudflare.com/ssl/static/origin_ca_ecc_root.pem)



---

## 未知標題

**來源**: [https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem](https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem)



---

## Setup

**來源**: [https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/)

Page options # Setup

- Zone-level
- Per-hostname
- Manage certificates

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

## 未知標題

**來源**: [https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem](https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem)



---

## Get started

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/configuration/](https://developers.cloudflare.com/ssl/keyless-ssl/configuration/)

Page options # Get started

The way you set up Keyless SSL depends on how you route traffic to your keyless server.

- Cloudflare Tunnel
- Public DNS

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

**來源**: [https://developers.cloudflare.com/ssl/keyless-ssl/reference/](https://developers.cloudflare.com/ssl/keyless-ssl/reference/)

Page options # Reference

For more information on Keyless SSL, refer to the following resources:

- High availability
- Scaling and benchmarking
- Keyless delegation

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

**來源**: [https://developers.cloudflare.com/ssl/reference/](https://developers.cloudflare.com/ssl/reference/)

Page options # Reference

For more on Cloudflare SSL/TLS, refer to these articles:

- TLS protocols
- Certificate and hostname priority
- Certificate authorities
- Browser compatibility
- Migration guides
- Certificate pinning
- Certificate statuses
- Validity periods and renewal
- Features and plans
- Cloudflare and CVE-2019-1559
- PCI compliance and vulnerabilities mitigation

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

## Migration guides

**來源**: [https://developers.cloudflare.com/ssl/reference/migration-guides/](https://developers.cloudflare.com/ssl/reference/migration-guides/)

Page options # Migration guides

These guides walk you through the migration processes associated with various changes in Cloudflare's SSL/TLS infrastructure.

- Entrust distrust by major browsers

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

## Universal SSL

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl)

Page options # Universal SSL

By default, Cloudflare issues — and renews — free, unshared, publicly trusted SSL certificates to all domains added to and activated on Cloudflare.

Universal certificates are Domain Validated (DV). For setup details, refer to Enable Universal SSL.

Note

If your website or application requires an SSL certificate prior to migrating traffic to Cloudflare, or if you need to customize cipher suites, refer to Advanced or Custom certificates.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Related resources

- Backup certificates
- Validity period and renewal

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

## Advanced certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager)

Page options # Advanced certificates

Use advanced certificates when you want something more customizable than Universal SSL but still want the convenience of SSL certificate issuance and renewal.

To order advanced certificates you must purchase the Advanced Certificate Manager add-on, which also includes other features.

## Advanced Certificate Manager

Advanced Certificate Manager allows you to:

- Order advanced certificates that can:

Include the zone apex and up to 50 hosts as covered hostnames.
Cover more than one level of subdomain.
Be issued by the certificate authority (CA) you choose.
Use your preferred validation method.
Have the validity period you choose.
- Include the zone apex and up to 50 hosts as covered hostnames.
- Cover more than one level of subdomain.
- Be issued by the certificate authority (CA) you choose.
- Use your preferred validation method.
- Have the validity period you choose.
- Use delegated DCV to delegate the DCV process of your partial zones to Cloudflare.
- Enable Total TLS to automatically protect proxied hostnames.
- Select a custom trust store for origin authentication.
- Control cipher suites and per-hostname minimum TLS version.

Note

Enterprise customers can also purchase a subscription for Advanced Certificate Manager, which allows them to add up to 100 edge certificates per zone.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Paid add-on | Paid add-on | Paid add-on | Paid add-on |

Note

Enterprise customers can preview this product as a non-contract service, which provides full access, free of metered usage fees, limits, and certain other restrictions.

## Limitations

Advanced certificates are not used with Cloudflare Pages nor R2 due to certificate prioritization. Both Pages and R2 custom domains use Cloudflare for SaaS certificates.

Advanced certificates are Domain Validated (DV). If your organization needs Organization Validated (OV) or Extended Validation (EV) certificates, refer to Custom certificates.

## Related resources

- Manage advanced certificates
- API commands

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

## Custom certificates

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates)

Page options # Custom certificates

Custom certificates are meant for Business and Enterprise customers who want to use their own SSL certificates.

Unlike Universal SSL or advanced certificates, Cloudflare does not manage issuance and renewal for custom certificates.
When you use custom certificates, the following actions should be considered and accomplished by you:

- Upload the certificate.
- Update the certificate.
- Observe the certificate expiration date to avoid downtime.

Note

If your custom certificate does not cover all of your first-level hostnames, you can enable Universal SSL certificate to cover them.

If your custom certificate is from a certificate authority that Cloudflare partners with, consider switching to a Cloudflare-managed certificate to benefit from automatic issuance and renewal.

## Certificate packs

Before deploying custom certificates to Cloudflare's global network, Cloudflare automatically groups the certificates into certificate packs.

A certificate pack is a group of certificates that share the same set of hostnames — for example, example.com and *.example.com — but use different signature algorithms.

Each pack can include up to three certificates, one from each of the following signature algorithms:

- SHA-2/RSA
- SHA-2/ECDSA
- SHA-1/RSA

Each pack only counts as one SSL certificate against your custom certificate quota.

Note

You cannot delete the primary certificate if secondary certificates are present in the pack.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | No | No | Yes | Yes |
| Certificates included | 0 | 0 | 1 Modern and 1 Legacy | 1 Modern (can purchase more) and 1 Legacy (can purchase more) |

## Related features

### Certificate Signing Requests (CSRs)

As part of the custom certificate process, you can leverage Cloudflare to generate your Certificate Signing Request (CSR). This additional option means that Cloudflare will safely generate and store the private key associated with the CSR.

### Geo Key Manager (private key restriction)

By default, Cloudflare encrypts and securely distributes private keys to all Cloudflare data centers, where they can be used for local SSL/TLS termination. If you want to restrict where your private keys may be used, use Geo Key Manager.

### Keyless SSL

If you want to upload a custom certificate but retain your private key on your own infrastructure, consider using Keyless SSL.

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

## Total TLS

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/total-tls)

Page options # Total TLS

Total TLS allows Cloudflare to issue individual certificates for your proxied hostnames. These certificates will protect proxied hostnames not covered by Universal certificates.

Warning

Total TLS certificates follow the Common Name (CN) restriction of 64 characters (RFC 5280 ↗). If you have a hostname that exceeds this length, you can create an Advanced Certificate via API to cover it.

When issued, these certificates will have a type of Advanced - Total TLS, and their default validity period is 90 days.

## Reference

- Enable
- Error messages

## Availability

Total TLS is available for domains that have purchased Advanced Certificate Manager and are currently using a full DNS setup.

## Limitations

### Hostnames used with other Cloudflare products

Total TLS does not issue certificates for any hostnames used with:

- Cloudflare Load Balancing
- Cloudflare Tunnel
- Cloudflare Spectrum

You can use other types of certificates or manually order advanced certificates for these hostnames.

### Deleting certificates

Once you enable Total TLS, be careful deleting any Total TLS certificates associated with proxied hostnames.

If you do, our system assumes you want to opt that hostname out of Total TLS certificate and will not order new certificates for the hostname in the future. This behavior applies even if you delete and re-create the hostname's DNS record.

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

## Automatic HTTPS Rewrites

**來源**: [https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites)

Page options # Automatic HTTPS Rewrites

Automatic HTTPS Rewrites prevents end users from seeing "mixed content" errors by rewriting URLs from http to https for resources or links on your web site that can be served with HTTPS.

## Availability

|  | Free | Pro | Business | Enterprise |
| --- | --- | --- | --- | --- |
| Availability | Yes | Yes | Yes | Yes |

## Additional details

If your site contains links or references to HTTP URLs that are also available securely via HTTPS, Automatic HTTPS Rewrites can help. If you connect to your site over HTTPS and the lock icon is not present, or has a yellow warning triangle on it, your site may contain references to HTTP assets (“mixed content”).

Mixed content is often due to factors not under the website owner’s control such as embedded third-party content or complex content management systems. By rewriting URLs from “http” to “https”, Automatic HTTPS Rewrites simplifies the task of making your entire website available over HTTPS, helping to eliminate mixed content errors and ensuring that all data loaded by your website is protected from eavesdropping and tampering.

Note

For security reasons, this feature will run on URLs pointing to localhost if the URL is fetching an active resource (script, iframe, link, object, etc.).

## Enable Automatic HTTPS Rewrites

- Dashboard
- API

To enable Automatic HTTPS Rewrites in the dashboard:

1. Log in to your Cloudflare account ↗ and go to a specific domain.
2. Go to SSL/TLS > Edge Certificates.
3. For Automatic HTTPS Rewrites, switch the toggle to On.

To enable or disable Automatic HTTPS Rewrites with the API, send a PATCH request with automatic_https_rewrites as the setting name in the URI path, and the value parameter set to your desired setting ("on" or "off").

Note

To use this feature on specific hostnames - instead of across your entire zone - use a configuration rule.

## Limitations

Before a rewrite is applied, Cloudflare checks the HTTP resources to ensure they are accessible via HTTPS. If they are not available over HTTPS, Cloudflare cannot rewrite the URL.

Some resources are loaded by JavaScript or CSS via HTTP when the site is loaded in a browser. You will see mixed content warnings in those situations. To determine which URLs do not have HTTPS support, Cloudflare uses data from EFF’s HTTPS Everywhere ↗ and Chrome’s HSTS preload list ↗. If your zone is not on one of these lists, only active content will be rewritten. Passive content (such as images) will not be rewritten and will still cause mixed content errors.

If a third-party domain supports HTTPS and is not rewritten automatically, you can manually change those links to relative links or HTTPS links. Alternatively, you can ask the third-party domain owner to submit their site for inclusion in the HTTPS Everywhere rulesets, which accept pull requests on GitHub ↗. For more information on how to fix mixed content errors, refer to Troubleshooting mixed content errors.

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

## Certificate authorities

**來源**: [https://developers.cloudflare.com/ssl/reference/certificate-authorities](https://developers.cloudflare.com/ssl/reference/certificate-authorities)

Page options # Certificate authorities

For publicly trusted certificates, Cloudflare partners with different certificate authorities (CAs). Refer to this page to check what CAs are used for each Cloudflare offering and for more details about the CAs features, limitations, and browser compatibility.

## Availability per certificate type and encryption algorithm

| Certificate | Algorithm | Let's Encrypt | Google Trust Services | SSL.com | Sectigo |
| --- | --- | --- | --- | --- | --- |
| Universal | ECDSARSA(Paid plans only) | ✅✅ | ✅✅ | ✅✅ | N/AN/A |
| Advanced | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| Total TLS | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| SSL for SaaS | ECDSARSA | ✅✅ | ✅✅ | ✅  ✅ | N/AN/A |
| Backup | ECDSARSA | ✅✅ | ✅✅ | ✅✅ | ✅✅ |

## Features, limitations, and browser compatibility

Universal SSL

For Universal certificates, Cloudflare controls the validity periods and certificate authorities (CAs), making sure that renewal always occur. For details, refer to Universal SSL.

### Let's Encrypt

- Supports validity periods of 90 days.
- DCV tokens are valid for 7 days.

#### Limitations

- Hostname on certificate can contain up to 10 levels of subdomains.
- Duplicate certificate limit of 5 certificates ↗ per week.

#### Browser compatibility

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to Let's Encrypt documentation ↗.

The main determining factor for whether a platform can validate Let's Encrypt certificates is whether that platform trusts the self-signed ISRG Root X1 certificate. As Let's Encrypt announced a change in its chain of trust in 2024 ↗, older devices (for example Android 7.0 and earlier) that only trust the cross-signed version of the ISRG Root X1 are no longer compatible.

You can find the full list of supported clients in the Let's Encrypt documentation ↗. Older versions of Android and Java clients might not be compatible with Let's Encrypt certificates.

#### Other resources

Let's Encrypt Root CAs ↗: For checking compatibility between chain and client. As explained in Certificate pinning, you should not use this list for pinning against.

### Google Trust Services

- Supports validity periods of 14, 30, and 90 days.
- DCV tokens are valid for 14 days.

#### Limitations

- Punycode domains are not yet supported.

#### Browser compatibility (most compatible)

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to Google Trust Services documentation ↗.

By cross-signing with a GlobalSign root CA ↗ that has been installed in client devices for more than 20 years, Google Trust Services can ensure optimal support across a wide range of devices.

Currently trusted by Microsoft, Mozilla, Safari, Cisco, Oracle Java, and Qihoo’s 360 browser, all browsers or operating systems that depend on these root programs are covered.

You can use the root CAs list ↗ for checking compatibility between chain and client but, as explained in Certificate pinning, you should not use this list for pinning against.

### SSL.com

- Supports validity periods of 14, 30, and 90 days. Enterprise customers using advanced certificates can also choose a validity period of one year.
- DCV tokens are valid for 14 days.

#### Limitations

SSL.com DCV tokens are specific for RSA certificates and ECDSA certificates. This means that, for cases where you have to manually perform DCV, you will have to place two validation tokens per certificate order. To avoid management overhead, consider using a full setup, or setting up Delegated DCV.

#### Browser compatibility

Warning

This section summarizes commonly requested client support information. For the complete and most up-to-date certificate compatibility, refer to SSL.com documentation ↗.

SSL.com is highly compatible, being accepted by over 99.9% of browsers, tablets, and mobile devices.

SSL.com certificates are cross-signed with Certum ↗ and the CA that cross-signs intermediates ↗ is from 2004.

#### Other resources

Acceptable top level domains (TLDs) and current restrictions ↗

### Sectigo

- Only used for Backup certificates.
- Backup certificates are valid for 90 days.

#### Browser compatibility

Refer to Sectigo documentation ↗.

## CAA records

A Certificate Authority Authorization (CAA) DNS record specifies which certificate authorities (CAs) are allowed to issue certificates for a domain. This record reduces the chance of unauthorized certificate issuance and promotes standardization across your organization.

If you are using Cloudflare as your DNS provider, then the CAA records will be added on your behalf. If you need to add CAA records, refer to Add CAA records.

The following table lists the CAA record content for each CA:

| Certificate authority | CAA record content |
| --- | --- |
| Let's Encrypt | letsencrypt.org |
| Google Trust Services | pki.goog; cansignhttpexchanges=yes |
| SSL.com | ssl.com |
| Sectigo | sectigo.com |

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

