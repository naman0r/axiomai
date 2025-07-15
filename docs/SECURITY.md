# Security Documentation

## 🚨 Critical Security Issues

### 1. Canvas Access Token Storage - **HIGH PRIORITY**

**Issue:** Canvas access tokens are currently stored in **plaintext** in the database.

**Location:** `backend/prisma/schema.prisma` - `User.accessTokenHash` field  
**Current State:** Comment says "for now I am not hashing it"

**Risk Level:** **CRITICAL**

- Access tokens provide full API access to user's Canvas account
- Database breach would expose all user credentials
- Tokens could be used to access sensitive academic data

**Required Fix:**

```typescript
// Before storing in database:
const crypto = require("crypto");
const algorithm = "aes-256-gcm";
const secretKey = process.env.ENCRYPTION_KEY; // 32-byte key

function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}
```

**Implementation Priority:** Implement before production deployment

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Database credentials are properly stored in environment variables
- ✅ Clerk secrets are not committed to repository
- ⚠️ Ensure `ENCRYPTION_KEY` is set for token encryption

### API Security

- ✅ Authentication implemented with Clerk
- ✅ CORS properly configured for production domain
- ✅ Input validation implemented for Canvas domains and tokens

### Frontend Security

- ✅ Access tokens are input as password fields (masked)
- ✅ Client-side validation prevents malformed requests
- ✅ Sensitive data is not logged to console in production

---

## 📋 Security Checklist

### Before Production Deployment

- [ ] **Encrypt Canvas access tokens before database storage**
- [ ] **Implement token decryption for Canvas API calls**
- [ ] **Add rate limiting to Canvas API endpoints**
- [ ] **Implement session timeout for sensitive operations**
- [ ] **Add audit logging for Canvas connection/disconnection**
- [ ] **Review and test error messages (no sensitive data exposure)**
- [ ] **Implement HTTPS-only cookies for sessions**
- [ ] **Add CSP headers to prevent XSS**
- [ ] **Regular security audits of dependencies**

### Recommended Additional Security Measures

1. **Token Rotation:** Implement automatic Canvas token refresh
2. **Access Monitoring:** Log all Canvas API calls for audit trail
3. **Scope Limitation:** Request minimal Canvas API permissions
4. **Data Retention:** Implement automatic cleanup of old Canvas data
5. **Backup Security:** Ensure database backups are encrypted

---

## 🚀 Implementation Timeline

### Phase 1 (Immediate - Before Production)

- Implement Canvas token encryption/decryption
- Add environment variable for encryption key
- Test encrypted token storage and retrieval

### Phase 2 (Short-term)

- Add rate limiting to Canvas endpoints
- Implement comprehensive audit logging
- Add security headers and CSP

### Phase 3 (Medium-term)

- Implement token rotation mechanism
- Add advanced monitoring and alerting
- Regular security assessment automation

---

## 📞 Security Contact

For security issues or questions:

- Create a private issue in the repository
- Tag security-related issues as `security`
- For critical vulnerabilities, contact the development team directly

---

**Last Updated:** December 2024  
**Next Review:** Before production deployment
