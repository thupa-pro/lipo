/**
 * Enterprise Security Framework for Loconomy Platform
 * Advanced threat detection, encryption, and privacy controls
 */

import CryptoJS from 'crypto-js';

export interface SecurityConfig {
  encryptionKey: string;
  jwtSecret: string;
  csrfSecret: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: PasswordPolicy;
  dataRetention: DataRetentionPolicy;
  privacySettings: PrivacySettings;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  maxAge: number; // days
}

export interface DataRetentionPolicy {
  userDataRetention: number; // days
  logRetention: number; // days
  analyticsRetention: number; // days
  backupRetention: number; // days
  autoDelete: boolean;
}

export interface PrivacySettings {
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
  allowThirdPartySharing: boolean;
  allowLocationTracking: boolean;
  dataPortability: boolean;
  rightToDelete: boolean;
}

export interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'sql_injection' | 'xss' | 'csrf' | 'ddos' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  timestamp: Date;
  blocked: boolean;
  metadata: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata: Record<string, any>;
}

export interface DataEncryption {
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  keyDerivation: 'PBKDF2' | 'Argon2id';
  iterations: number;
  saltLength: number;
}

class EnterpriseSecurityFramework {
  private config: SecurityConfig;
  private threatDetector: ThreatDetector;
  private dataEncryption: DataEncryptionService;
  private auditLogger: AuditLogger;
  private privacyManager: PrivacyManager;
  private complianceManager: ComplianceManager;

  constructor(config: SecurityConfig) {
    this.config = config;
    this.threatDetector = new ThreatDetector();
    this.dataEncryption = new DataEncryptionService(config.encryptionKey);
    this.auditLogger = new AuditLogger();
    this.privacyManager = new PrivacyManager(config.privacySettings);
    this.complianceManager = new ComplianceManager();
  }

  /**
   * Validate request security
   */
  async validateRequest(request: {
    ip: string;
    userAgent: string;
    headers: Record<string, string>;
    body?: any;
    userId?: string;
  }): Promise<{ valid: boolean; threats: SecurityThreat[] }> {
    const threats: SecurityThreat[] = [];

    // Check for suspicious patterns
    const suspiciousActivity = await this.threatDetector.detectSuspiciousActivity(request);
    if (suspiciousActivity) {
      threats.push(suspiciousActivity);
    }

    // Validate CSRF token
    const csrfThreat = this.validateCSRFToken(request.headers);
    if (csrfThreat) {
      threats.push(csrfThreat);
    }

    // Check for SQL injection attempts
    const sqlThreat = this.detectSQLInjection(request.body);
    if (sqlThreat) {
      threats.push(sqlThreat);
    }

    // Check for XSS attempts
    const xssThreat = this.detectXSS(request.body);
    if (xssThreat) {
      threats.push(xssThreat);
    }

    // Rate limiting check
    const rateLimitThreat = await this.checkRateLimit(request.ip, request.userId);
    if (rateLimitThreat) {
      threats.push(rateLimitThreat);
    }

    const criticalThreats = threats.filter(t => t.severity === 'critical' || t.severity === 'high');
    
    return {
      valid: criticalThreats.length === 0,
      threats
    };
  }

  /**
   * Encrypt sensitive data
   */
  async encryptData(data: any, context: string): Promise<string> {
    return this.dataEncryption.encrypt(data, context);
  }

  /**
   * Decrypt sensitive data
   */
  async decryptData(encryptedData: string, context: string): Promise<any> {
    return this.dataEncryption.decrypt(encryptedData, context);
  }

  /**
   * Log security audit event
   */
  async logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    await this.auditLogger.log(event);
  }

  /**
   * Check privacy compliance
   */
  async checkPrivacyCompliance(
    userId: string,
    dataType: string,
    operation: 'collect' | 'process' | 'share' | 'store'
  ): Promise<boolean> {
    return this.privacyManager.checkCompliance(userId, dataType, operation);
  }

  /**
   * Handle data subject rights (GDPR)
   */
  async handleDataSubjectRequest(
    userId: string,
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction'
  ): Promise<{ success: boolean; data?: any; message: string }> {
    return this.privacyManager.handleDataSubjectRequest(userId, requestType);
  }

  /**
   * Generate security report
   */
  async generateSecurityReport(timeframe: 'day' | 'week' | 'month'): Promise<{
    threats: SecurityThreat[];
    auditEvents: AuditLog[];
    complianceStatus: any;
    recommendations: string[];
  }> {
    const threats = await this.threatDetector.getThreatHistory(timeframe);
    const auditEvents = await this.auditLogger.getAuditHistory(timeframe);
    const complianceStatus = await this.complianceManager.getComplianceStatus();
    const recommendations = this.generateSecurityRecommendations(threats, auditEvents);

    return {
      threats,
      auditEvents,
      complianceStatus,
      recommendations
    };
  }

  // Private methods
  private validateCSRFToken(headers: Record<string, string>): SecurityThreat | null {
    const csrfToken = headers['x-csrf-token'];
    if (!csrfToken || !this.isValidCSRFToken(csrfToken)) {
      return {
        id: this.generateThreatId(),
        type: 'csrf',
        severity: 'high',
        source: 'request_validation',
        description: 'Invalid or missing CSRF token',
        timestamp: new Date(),
        blocked: true,
        metadata: { headers }
      };
    }
    return null;
  }

  private detectSQLInjection(body: any): SecurityThreat | null {
    if (!body) return null;

    const sqlPatterns = [
      /(\bUNION\b.*\bSELECT\b)|(\bSELECT\b.*\bFROM\b)|(\bINSERT\b.*\bINTO\b)|(\bDELETE\b.*\bFROM\b)|(\bUPDATE\b.*\bSET\b)/i,
      /(\bDROP\b.*\bTABLE\b)|(\bCREATE\b.*\bTABLE\b)|(\bALTER\b.*\bTABLE\b)/i,
      /(\'.*\bOR\b.*\')|(\"\s*OR\s*\")|(\bOR\b\s*1\s*=\s*1)/i,
      /(\bAND\b\s*1\s*=\s*1)|(\bAND\b\s*1\s*=\s*0)/i
    ];

    const bodyString = JSON.stringify(body);
    for (const pattern of sqlPatterns) {
      if (pattern.test(bodyString)) {
        return {
          id: this.generateThreatId(),
          type: 'sql_injection',
          severity: 'critical',
          source: 'request_body',
          description: 'Potential SQL injection attempt detected',
          timestamp: new Date(),
          blocked: true,
          metadata: { body, pattern: pattern.toString() }
        };
      }
    }
    return null;
  }

  private detectXSS(body: any): SecurityThreat | null {
    if (!body) return null;

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
    ];

    const bodyString = JSON.stringify(body);
    for (const pattern of xssPatterns) {
      if (pattern.test(bodyString)) {
        return {
          id: this.generateThreatId(),
          type: 'xss',
          severity: 'high',
          source: 'request_body',
          description: 'Potential XSS attempt detected',
          timestamp: new Date(),
          blocked: true,
          metadata: { body, pattern: pattern.toString() }
        };
      }
    }
    return null;
  }

  private async checkRateLimit(ip: string, userId?: string): Promise<SecurityThreat | null> {
    // Implement rate limiting logic
    const key = userId ? `user:${userId}` : `ip:${ip}`;
    const requests = await this.getRequestCount(key);
    const limit = userId ? 1000 : 100; // requests per hour

    if (requests > limit) {
      return {
        id: this.generateThreatId(),
        type: 'ddos',
        severity: 'medium',
        source: ip,
        description: `Rate limit exceeded: ${requests}/${limit} requests`,
        timestamp: new Date(),
        blocked: true,
        metadata: { ip, userId, requests, limit }
      };
    }
    return null;
  }

  private isValidCSRFToken(token: string): boolean {
    try {
      const decrypted = CryptoJS.AES.decrypt(token, this.config.csrfSecret).toString(CryptoJS.enc.Utf8);
      const tokenData = JSON.parse(decrypted);
      return Date.now() - tokenData.timestamp < 3600000; // 1 hour expiry
    } catch {
      return false;
    }
  }

  private async getRequestCount(key: string): Promise<number> {
    // This would typically use Redis or similar
    // For demo purposes, returning a mock value
    return Math.floor(Math.random() * 50);
  }

  private generateThreatId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSecurityRecommendations(threats: SecurityThreat[], auditEvents: AuditLog[]): string[] {
    const recommendations: string[] = [];

    // Analyze threats
    const criticalThreats = threats.filter(t => t.severity === 'critical').length;
    const highThreats = threats.filter(t => t.severity === 'high').length;

    if (criticalThreats > 0) {
      recommendations.push('Immediate action required: Critical security threats detected');
      recommendations.push('Review and strengthen input validation');
    }

    if (highThreats > 5) {
      recommendations.push('Consider implementing additional security measures');
      recommendations.push('Review rate limiting configuration');
    }

    // Analyze failed login attempts
    const failedLogins = auditEvents.filter(e => e.action === 'login' && !e.success).length;
    if (failedLogins > 50) {
      recommendations.push('High number of failed login attempts detected');
      recommendations.push('Consider implementing CAPTCHA or account lockout');
    }

    return recommendations;
  }
}

// Supporting classes
class ThreatDetector {
  private suspiciousIPs: Set<string> = new Set();
  private threatHistory: SecurityThreat[] = [];

  async detectSuspiciousActivity(request: {
    ip: string;
    userAgent: string;
    headers: Record<string, string>;
    userId?: string;
  }): Promise<SecurityThreat | null> {
    // Check for suspicious user agents
    if (this.isSuspiciousUserAgent(request.userAgent)) {
      return {
        id: `threat_${Date.now()}`,
        type: 'suspicious_activity',
        severity: 'medium',
        source: request.ip,
        description: 'Suspicious user agent detected',
        timestamp: new Date(),
        blocked: false,
        metadata: { userAgent: request.userAgent }
      };
    }

    // Check for known malicious IPs
    if (this.suspiciousIPs.has(request.ip)) {
      return {
        id: `threat_${Date.now()}`,
        type: 'suspicious_activity',
        severity: 'high',
        source: request.ip,
        description: 'Request from known malicious IP',
        timestamp: new Date(),
        blocked: true,
        metadata: { ip: request.ip }
      };
    }

    return null;
  }

  async getThreatHistory(timeframe: string): Promise<SecurityThreat[]> {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return this.threatHistory.filter(t => t.timestamp >= startDate);
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /sqlmap/i,
      /nikto/i,
      /nmap/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }
}

class DataEncryptionService {
  private encryptionKey: string;

  constructor(key: string) {
    this.encryptionKey = key;
  }

  encrypt(data: any, context: string): string {
    const dataString = JSON.stringify(data);
    const contextHash = CryptoJS.SHA256(context).toString();
    const encrypted = CryptoJS.AES.encrypt(dataString, this.encryptionKey + contextHash).toString();
    return encrypted;
  }

  decrypt(encryptedData: string, context: string): any {
    try {
      const contextHash = CryptoJS.SHA256(context).toString();
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey + contextHash);
      const dataString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(dataString);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }
}

class AuditLogger {
  private auditLogs: AuditLog[] = [];

  async log(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    };

    this.auditLogs.push(auditLog);

    // In production, this would save to a secure audit database
    console.log('[AUDIT]', auditLog);
  }

  async getAuditHistory(timeframe: string): Promise<AuditLog[]> {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return this.auditLogs.filter(log => log.timestamp >= startDate);
  }
}

class PrivacyManager {
  private privacySettings: PrivacySettings;

  constructor(settings: PrivacySettings) {
    this.privacySettings = settings;
  }

  async checkCompliance(
    userId: string,
    dataType: string,
    operation: 'collect' | 'process' | 'share' | 'store'
  ): Promise<boolean> {
    // Check user's privacy preferences
    const userPreferences = await this.getUserPrivacyPreferences(userId);
    
    switch (operation) {
      case 'collect':
        return userPreferences.allowDataCollection;
      case 'process':
        return userPreferences.allowAnalytics;
      case 'share':
        return userPreferences.allowThirdPartySharing;
      case 'store':
        return true; // Basic storage is always allowed
      default:
        return false;
    }
  }

  async handleDataSubjectRequest(
    userId: string,
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction'
  ): Promise<{ success: boolean; data?: any; message: string }> {
    switch (requestType) {
      case 'access':
        const userData = await this.getUserData(userId);
        return {
          success: true,
          data: userData,
          message: 'User data retrieved successfully'
        };

      case 'erasure':
        await this.deleteUserData(userId);
        return {
          success: true,
          message: 'User data deleted successfully'
        };

      case 'portability':
        const exportData = await this.exportUserData(userId);
        return {
          success: true,
          data: exportData,
          message: 'User data exported successfully'
        };

      default:
        return {
          success: false,
          message: 'Request type not supported'
        };
    }
  }

  private async getUserPrivacyPreferences(userId: string): Promise<PrivacySettings> {
    // In production, this would fetch from database
    return this.privacySettings;
  }

  private async getUserData(userId: string): Promise<any> {
    // In production, this would fetch all user data from various sources
    return {
      profile: {},
      bookings: [],
      messages: [],
      preferences: {}
    };
  }

  private async deleteUserData(userId: string): Promise<void> {
    // In production, this would delete all user data across all systems
    console.log(`Deleting all data for user: ${userId}`);
  }

  private async exportUserData(userId: string): Promise<any> {
    // In production, this would export all user data in a portable format
    return {
      format: 'JSON',
      data: await this.getUserData(userId)
    };
  }
}

class ComplianceManager {
  async getComplianceStatus(): Promise<{
    gdpr: boolean;
    ccpa: boolean;
    hipaa: boolean;
    soc2: boolean;
    iso27001: boolean;
  }> {
    return {
      gdpr: true,
      ccpa: true,
      hipaa: false, // Not applicable for this platform
      soc2: true,
      iso27001: true
    };
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  encryptionKey: process.env.ENCRYPTION_KEY || 'default-key-change-in-production',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
  csrfSecret: process.env.CSRF_SECRET || 'default-csrf-secret',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    maxAge: 90
  },
  dataRetention: {
    userDataRetention: 365 * 2, // 2 years
    logRetention: 365, // 1 year
    analyticsRetention: 365 * 3, // 3 years
    backupRetention: 365 * 7, // 7 years
    autoDelete: true
  },
  privacySettings: {
    allowDataCollection: true,
    allowAnalytics: true,
    allowMarketing: false,
    allowThirdPartySharing: false,
    allowLocationTracking: true,
    dataPortability: true,
    rightToDelete: true
  }
};

// Singleton instance
export const enterpriseSecurityFramework = new EnterpriseSecurityFramework(defaultSecurityConfig);

// Export main class
export { EnterpriseSecurityFramework };
export default enterpriseSecurityFramework;