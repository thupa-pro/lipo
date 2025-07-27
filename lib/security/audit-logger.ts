interface SecurityEvent {
  type: string;
  email?: string;
  userId?: string;
  ip?: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  details?: any;
  userAgent?: string;
  timestamp?: string;
}

interface AuditLog extends SecurityEvent {
  id: string;
  timestamp: string;
  sessionId?: string;
}

class SecurityAuditLogger {
  private logs: AuditLog[] = [];

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    // Store in memory (in production, send to proper logging service)
    this.logs.push(auditLog);

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${auditLog.severity.toUpperCase()}: ${auditLog.type}`, auditLog);
    }

    // In production, send to monitoring service (Sentry, DataDog, etc.)
    if (process.env.NODE_ENV === 'production') {
      await this.sendToMonitoringService(auditLog);
    }

    // Alert on critical events
    if (auditLog.severity === 'critical') {
      await this.sendCriticalAlert(auditLog);
    }
  }

  async getSecurityLogs(filters?: {
    severity?: string;
    type?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> {
    let filteredLogs = [...this.logs];

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
    }

    if (filters?.type) {
      filteredLogs = filteredLogs.filter(log => log.type === filters.type);
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

    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToMonitoringService(log: AuditLog): Promise<void> {
    try {
      // Example: Send to Sentry, DataDog, or other monitoring service
      // await fetch('/api/monitoring/security-event', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log),
      // });
    } catch (error) {
      console.error('Failed to send security log to monitoring service:', error);
    }
  }

  private async sendCriticalAlert(log: AuditLog): Promise<void> {
    try {
      // Send immediate alert for critical security events
      // Example: Slack, email, SMS, PagerDuty, etc.
      console.error('CRITICAL SECURITY EVENT:', log);
      
      // In production, implement actual alerting
      // await this.sendSlackAlert(log);
      // await this.sendEmailAlert(log);
    } catch (error) {
      console.error('Failed to send critical security alert:', error);
    }
  }

  // Security metrics for monitoring
  async getSecurityMetrics(timeWindow: number = 24 * 60 * 60 * 1000) {
    const since = new Date(Date.now() - timeWindow);
    const recentLogs = await this.getSecurityLogs({ startDate: since });

    const metrics = {
      totalEvents: recentLogs.length,
      byType: this.groupByField(recentLogs, 'type'),
      bySeverity: this.groupByField(recentLogs, 'severity'),
      failedLogins: recentLogs.filter(log => 
        log.type === 'FAILED_SIGNIN_ATTEMPT' || log.type === 'INVALID_SIGNIN_ATTEMPT'
      ).length,
      suspiciousActivity: recentLogs.filter(log => 
        log.severity === 'high' || log.severity === 'critical'
      ).length,
      rateLimitHits: recentLogs.filter(log => 
        log.type === 'RATE_LIMIT_EXCEEDED'
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
}

// Export singleton instance
export const auditLogger = new SecurityAuditLogger();

// Convenience function for logging security events
export const logSecurityEvent = (event: SecurityEvent) => {
  return auditLogger.logSecurityEvent(event);
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
  
  // Authorization events
  UNAUTHORIZED_ACCESS_ATTEMPT: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  ROLE_ESCALATION_ATTEMPT: 'ROLE_ESCALATION_ATTEMPT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // Security events
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  POTENTIAL_ATTACK: 'POTENTIAL_ATTACK',
  SECURITY_SCAN_DETECTED: 'SECURITY_SCAN_DETECTED',
  
  // Data events
  SENSITIVE_DATA_ACCESS: 'SENSITIVE_DATA_ACCESS',
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  ACCOUNT_DELETION_REQUESTED: 'ACCOUNT_DELETION_REQUESTED',
  
  // System events
  SIGNIN_ERROR: 'SIGNIN_ERROR',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
  SIGNOUT_ERROR: 'SIGNOUT_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
} as const;
