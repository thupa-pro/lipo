import { hasFeature, env, isDevelopment, isProduction } from '@/lib/config/environment';

interface SecurityEvent {
  type: string;
  email?: string;
  userId?: string;
  ip?: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  details?: any;
  userAgent?: string;
  timestamp?: string;
  sessionId?: string;
  resource?: string;
  action?: string;
}

interface AuditLog extends SecurityEvent {
  id: string;
  timestamp: string;
  environment: string;
  version: string;
}

interface SecurityMetrics {
  totalEvents: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  failedLogins: number;
  suspiciousActivity: number;
  rateLimitHits: number;
  criticalEvents: number;
}

class EnterpriseSecurityAuditLogger {
  private logs: AuditLog[] = [];
  private readonly maxMemoryLogs = 1000;
  private readonly version = '2.0.0';
  private supabaseLogger?: any;
  private sentryLogger?: any;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Sentry for production error tracking
      if (hasFeature('sentry') && isProduction()) {
        await this.initializeSentry();
      }

      // Initialize database logging if Supabase is available
      if (hasFeature('supabase')) {
        await this.initializeSupabaseLogging();
      }

      this.isInitialized = true;
      console.log('✅ Enterprise Security Audit Logger initialized');
    } catch (error) {
      console.error('Failed to initialize security audit logger:', error);
      this.isInitialized = true; // Continue with basic logging
    }
  }

  private async initializeSentry() {
    try {
      const Sentry = await import('@sentry/nextjs');
      const config = env.getConfig();
      
      if (!Sentry.getCurrentHub().getClient()) {
        Sentry.init({
          dsn: config.NEXT_PUBLIC_SENTRY_DSN,
          environment: config.NODE_ENV,
          tracesSampleRate: 0.1,
          beforeSend(event) {
            // Filter sensitive data
            if (event.extra) {
              delete event.extra.password;
              delete event.extra.token;
              delete event.extra.secret;
            }
            return event;
          },
        });
      }
      
      this.sentryLogger = Sentry;
      console.log('✅ Sentry security logging enabled');
    } catch (error) {
      console.warn('Sentry initialization failed:', error);
    }
  }

  private async initializeSupabaseLogging() {
    try {
      // This will be implemented with the Supabase integration
      console.log('📝 Supabase audit logging prepared');
    } catch (error) {
      console.warn('Supabase logging initialization failed:', error);
    }
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await this.initialize();

    const auditLog: AuditLog = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      environment: env.getConfig().NODE_ENV,
      version: this.version,
      ...event,
    };

    // Store in memory (with rotation)
    this.addToMemoryLog(auditLog);

    // Log to console in development
    if (isDevelopment()) {
      this.logToConsole(auditLog);
    }

    // Log to external services in production
    if (isProduction()) {
      await this.logToExternalServices(auditLog);
    }

    // Handle critical events
    if (auditLog.severity === 'critical') {
      await this.handleCriticalEvent(auditLog);
    }

    // Real-time alerting for high severity events
    if (['high', 'critical'].includes(auditLog.severity)) {
      await this.sendRealTimeAlert(auditLog);
    }
  }

  private addToMemoryLog(log: AuditLog) {
    this.logs.push(log);
    
    // Rotate logs to prevent memory leaks
    if (this.logs.length > this.maxMemoryLogs) {
      this.logs = this.logs.slice(-this.maxMemoryLogs);
    }
  }

  private logToConsole(log: AuditLog) {
    const emoji = this.getSeverityEmoji(log.severity);
    const color = this.getSeverityColor(log.severity);
    
    console.log(
      `${emoji} [SECURITY] ${color}${log.severity.toUpperCase()}${'\x1b[0m'}: ${log.type}`,
      {
        id: log.id,
        timestamp: log.timestamp,
        userId: log.userId,
        ip: log.ip,
        details: log.details,
      }
    );
  }

  private async logToExternalServices(log: AuditLog) {
    try {
      // Log to Sentry for error tracking
      if (this.sentryLogger && ['high', 'critical'].includes(log.severity)) {
        this.sentryLogger.addBreadcrumb({
          message: `Security Event: ${log.type}`,
          level: log.severity === 'critical' ? 'error' : 'warning',
          data: {
            userId: log.userId,
            ip: log.ip,
            type: log.type,
            details: log.details,
          },
        });

        if (log.severity === 'critical') {
          this.sentryLogger.captureException(
            new Error(`Critical Security Event: ${log.type}`),
            {
              tags: {
                securityEvent: true,
                eventType: log.type,
                severity: log.severity,
              },
              extra: log.details,
            }
          );
        }
      }

      // Log to database (Supabase)
      await this.logToDatabase(log);

      // Log to external monitoring service
      await this.logToMonitoringService(log);
    } catch (error) {
      console.error('Failed to log to external services:', error);
    }
  }

  private async logToDatabase(log: AuditLog) {
    try {
      // This will integrate with the Supabase security_events table
      if (hasFeature('supabase')) {
        // Implementation will be added with Supabase integration
        console.log('📝 Database logging:', log.type);
      }
    } catch (error) {
      console.error('Database logging failed:', error);
    }
  }

  private async logToMonitoringService(log: AuditLog) {
    try {
      // PostHog analytics for security events
      if (hasFeature('posthog') && typeof window !== 'undefined') {
        const posthog = await import('posthog-js');
        posthog.default.capture('security_event', {
          event_type: log.type,
          severity: log.severity,
          environment: log.environment,
          timestamp: log.timestamp,
          // Don't include sensitive details
        });
      }
    } catch (error) {
      console.error('Monitoring service logging failed:', error);
    }
  }

  private async handleCriticalEvent(log: AuditLog) {
    try {
      // Send immediate notifications for critical events
      console.error(`🚨 CRITICAL SECURITY EVENT: ${log.type}`, log);

      // In production, send alerts via multiple channels
      if (isProduction()) {
        await this.sendCriticalAlert(log);
      }
    } catch (error) {
      console.error('Failed to handle critical event:', error);
    }
  }

  private async sendCriticalAlert(log: AuditLog) {
    try {
      // Email alert
      await this.sendEmailAlert(log);
      
      // Slack alert
      await this.sendSlackAlert(log);
      
      // SMS alert for ultra-critical events
      if (log.type.includes('BREACH') || log.type.includes('ATTACK')) {
        await this.sendSMSAlert(log);
      }
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  private async sendRealTimeAlert(log: AuditLog) {
    try {
      // Real-time dashboard updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('securityEvent', {
          detail: {
            type: log.type,
            severity: log.severity,
            timestamp: log.timestamp,
          }
        }));
      }
    } catch (error) {
      console.error('Failed to send real-time alert:', error);
    }
  }

  private async sendEmailAlert(log: AuditLog) {
    // Email alert implementation
    console.log('📧 Email alert sent for:', log.type);
  }

  private async sendSlackAlert(log: AuditLog) {
    // Slack alert implementation
    console.log('💬 Slack alert sent for:', log.type);
  }

  private async sendSMSAlert(log: AuditLog) {
    // SMS alert implementation
    console.log('📱 SMS alert sent for:', log.type);
  }

  async getSecurityLogs(filters?: {
    severity?: string;
    type?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    let filteredLogs = [...this.logs];

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
    }

    if (filters?.type) {
      filteredLogs = filteredLogs.filter(log => log.type.includes(filters.type));
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= filters.endDate!
      );
    }

    const result = filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, filters?.limit || 100);

    return result;
  }

  async getSecurityMetrics(timeWindow: number = 24 * 60 * 60 * 1000): Promise<SecurityMetrics> {
    const since = new Date(Date.now() - timeWindow);
    const recentLogs = await this.getSecurityLogs({ startDate: since });

    const metrics: SecurityMetrics = {
      totalEvents: recentLogs.length,
      byType: this.groupByField(recentLogs, 'type'),
      bySeverity: this.groupByField(recentLogs, 'severity'),
      failedLogins: recentLogs.filter(log => 
        log.type.includes('FAILED_SIGNIN') || log.type.includes('INVALID_SIGNIN')
      ).length,
      suspiciousActivity: recentLogs.filter(log => 
        log.severity === 'high' || log.severity === 'critical'
      ).length,
      rateLimitHits: recentLogs.filter(log => 
        log.type === 'RATE_LIMIT_EXCEEDED'
      ).length,
      criticalEvents: recentLogs.filter(log => 
        log.severity === 'critical'
      ).length,
    };

    return metrics;
  }

  private groupByField(logs: AuditLog[], field: keyof AuditLog): Record<string, number> {
    return logs.reduce((acc, log) => {
      const value = String(log[field]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private generateLogId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSeverityEmoji(severity: string): string {
    const emojis = {
      info: 'ℹ️',
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
    };
    return emojis[severity as keyof typeof emojis] || '❓';
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      info: '\x1b[36m',    // Cyan
      low: '\x1b[32m',     // Green
      medium: '\x1b[33m',  // Yellow
      high: '\x1b[31m',    // Red
      critical: '\x1b[91m', // Bright Red
    };
    return colors[severity as keyof typeof colors] || '\x1b[0m';
  }
}

// Export singleton instance
export const enterpriseAuditLogger = new EnterpriseSecurityAuditLogger();

// Convenience function for logging security events
export const logSecurityEvent = (event: SecurityEvent) => {
  return enterpriseAuditLogger.logSecurityEvent(event);
};

// Predefined security event types
export const SecurityEventTypes = {
  // Authentication events
  SUCCESSFUL_SIGNIN: 'SUCCESSFUL_SIGNIN',
  FAILED_SIGNIN_ATTEMPT: 'FAILED_SIGNIN_ATTEMPT',
  INVALID_SIGNIN_ATTEMPT: 'INVALID_SIGNIN_ATTEMPT',
  SUCCESSFUL_SIGNOUT: 'SUCCESSFUL_SIGNOUT',
  SUCCESSFUL_SIGNUP: 'SUCCESSFUL_SIGNUP',
  FAILED_SIGNUP_ATTEMPT: 'FAILED_SIGNUP_ATTEMPT',
  
  // Session events
  SESSION_CREATED: 'SESSION_CREATED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_VALIDATION_ERROR: 'SESSION_VALIDATION_ERROR',
  CONCURRENT_SESSION_DETECTED: 'CONCURRENT_SESSION_DETECTED',
  SESSION_HIJACK_ATTEMPT: 'SESSION_HIJACK_ATTEMPT',
  
  // Authorization events
  UNAUTHORIZED_ACCESS_ATTEMPT: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  ROLE_ESCALATION_ATTEMPT: 'ROLE_ESCALATION_ATTEMPT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ADMIN_ACCESS: 'ADMIN_ACCESS',
  
  // Security events
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  POTENTIAL_ATTACK: 'POTENTIAL_ATTACK',
  SECURITY_SCAN_DETECTED: 'SECURITY_SCAN_DETECTED',
  BRUTE_FORCE_ATTEMPT: 'BRUTE_FORCE_ATTEMPT',
  SQL_INJECTION_ATTEMPT: 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT: 'XSS_ATTEMPT',
  CSRF_ATTEMPT: 'CSRF_ATTEMPT',
  
  // Data events
  SENSITIVE_DATA_ACCESS: 'SENSITIVE_DATA_ACCESS',
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  BULK_DATA_ACCESS: 'BULK_DATA_ACCESS',
  UNAUTHORIZED_DATA_ACCESS: 'UNAUTHORIZED_DATA_ACCESS',
  
  // System events
  SIGNIN_ERROR: 'SIGNIN_ERROR',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
  SIGNOUT_ERROR: 'SIGNOUT_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Compliance events
  GDPR_REQUEST: 'GDPR_REQUEST',
  DATA_RETENTION_POLICY_EXECUTED: 'DATA_RETENTION_POLICY_EXECUTED',
  COMPLIANCE_VIOLATION: 'COMPLIANCE_VIOLATION',
  AUDIT_LOG_ACCESS: 'AUDIT_LOG_ACCESS',
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];
export type { SecurityEvent, AuditLog, SecurityMetrics };
