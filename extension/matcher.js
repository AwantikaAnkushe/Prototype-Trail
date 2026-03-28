const PATTERNS = {
    AADHAR: /\b[2-9]{1}\d{3}\s?\d{4}\s?\d{4}\b/g,
    PAN_CARD: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    CREDIT_CARD: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g,
    OPENAI_API_KEY: /\bsk-[a-zA-Z0-9]{32,48}\b/g,
    GITHUB_TOKEN: /\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}\b/g,
    AWS_ACCESS_KEY: /\b(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g,
    AWS_SECRET_KEY: /(?:aws_?secret_?access_?key|aws_?secret_?key)\s*[:=]\s*['"]?([a-zA-Z0-9/+=]{40})['"]?/gi,
    GENERIC_API_KEY: /(?:api_?key|apikey|secret|token)\s*[:=]\s*['"]?([a-zA-Z0-9\-_]{20,})['"]?/gi,
    GOOGLE_API_KEY: /\bAIza[0-9A-Za-z\-_]{35}\b/g,
    JWT_TOKEN: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    STRIPE_KEY: /\b(?:sk|rk)_(?:test|live)_[0-9a-zA-Z]{24,34}\b/g,
    DATABASE_URL: /(?:postgres|mysql|mongodb|redis|amqp|mssql):\/\/[^:\/\s]+:[^@\/\s]+@[^:\/\s]+/g,
    PRIVATE_KEY: /-----BEGIN (?:RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----[\s\S]*?-----END (?:RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/g,
    OAUTH_TOKEN: /(?:oauth|access)_?token\s*[:=]\s*['"]?([a-zA-Z0-9\-_]{20,})['"]?/gi,
    IFSC_CODE: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g,
    UPI_ID: /\b[a-zA-Z0-9.\-_]+@[a-zA-Z]+\b/g,
    PHONE_NUMBER: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    ACCOUNT_ID: /(?:account|user)_?id\s*[:=]\s*['"]?([a-zA-Z0-9\-_]+)['"]?/gi,
    PASSWORD: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    BANK_ACCOUNT: /(?:bank_?account|account_?number|acct_?num)\s*[:=]\s*['"]?(\d{9,18})['"]?/gi,
    CVV: /(?:cvv|cvc)\s*[:=]\s*['"]?(\d{3,4})['"]?/gi,
    CARD_EXPIRY: /(?:exp(?:iry)?_?(?:date)?)\s*[:=]\s*['"]?((?:0[1-9]|1[0-2])\/?(?:[0-9]{4}|[0-9]{2}))['"]?/gi,
    PASSPORT_INDIA: /\b[A-PR-WY][1-9]\d\s?\d{4}[1-9]\b/g,
    DRIVING_LICENSE_INDIA: /\b[A-Z]{2}[0-9]{2}[0-9\s-]{11,12}\b/g,
    OTP: /(?:otp|code|pin)\s*[:=]\s*['"]?(\d{4,8})['"]?/gi,
    ENCRYPTION_KEY: /(?:encryption|enc|secret)_?key\s*[:=]\s*['"]?([a-zA-Z0-9/+=_]{16,})['"]?/gi,
    SESSION_ID: /(?:session|sess)_?(?:id|key)\s*[:=]\s*['"]?([a-zA-Z0-9\-_]{16,})['"]?/gi,
    COOKIE: /(?:cookie|set-cookie)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    FIREBASE_CONFIG: /(?:firebase_?api_?key|firebase_?url)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    TWILIO_TOKEN: /(?:twilio|twil)_?(?:auth)?_?(?:token|sid)\s*[:=]\s*['"]?([a-zA-Z0-9]{32})['"]?/gi,
    DB_CREDENTIALS: /(?:db|database)_?(?:user|username|pass|password|pwd)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    INTERNAL_IP: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g,
    SERVER_CREDENTIALS: /(?:ssh|ftp|admin)_?(?:user|username|pass|password)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    EMAIL_PASSWORD: /(?:email|mail|smtp)_?(?:pass|password)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    WIFI_PASSWORD: /(?:wifi|wlan)_?(?:pass|password|key)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    BIOMETRIC_DATA: /(?:fingerprint|face_?data|biometric)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    LOCATION_DATA: /(?:latitude|longitude|lat|lon|gps_coords)\s*[:=]\s*['"]?([-+]?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|\d{1,2}(?:\.\d+)?))['"]?/gi,
    MEDICAL_RECORD: /(?:medical_record|health_id|patient_id|mrn)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
    SALARY_DETAILS: /(?:salary|wage|compensation)\s*[:=]\s*['"]?(\d+(?:\.\d{1,2})?)['"]?/gi,
    TAX_INFO: /(?:tax_id|ssn|tin|ein)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi
};

function detectSecrets(text) {
    const findings = [];
    if (!text || typeof text !== 'string') return findings;
    
    for (const [type, pattern] of Object.entries(PATTERNS)) {
        // Reset lastIndex for global regex
        pattern.lastIndex = 0;
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            findings.push({ type, count: matches.length, matches: [...new Set(matches)] });
        }
    }
    return findings;
}

function redactSecrets(text) {
    if (!text || typeof text !== 'string') return text;
    let redacted = text;
    for (const [type, pattern] of Object.entries(PATTERNS)) {
        pattern.lastIndex = 0;
        redacted = redacted.replace(pattern, `[REDACTED ${type}]`);
    }
    return redacted;
}

// Export for ES modules (Node/Web App) or attach to global (Extension)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PATTERNS, detectSecrets, redactSecrets };
} else {
    window.SecretMatcher = { PATTERNS, detectSecrets, redactSecrets };
}
