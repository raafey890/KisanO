import { LoggerAdapter, LogEntry, LogLevel } from './types';

/**
 * Production Adapter Interface implementation.
 * Ready for future integration with services like Sentry, Datadog, or LogRocket.
 */
export class ProductionAdapter implements LoggerAdapter {
  private serviceName: string;

  constructor(serviceName = 'kisano-frontend') {
    this.serviceName = serviceName;
  }

  public log(entry: LogEntry): void {
    // In the future: Only forward WARN, ERROR, and FATAL logs to monitoring services to save cost.
    if (entry.level >= LogLevel.WARN) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry): void {
    // TODO: Implement actual Sentry/Datadog SDK call here.
    // e.g. Sentry.captureException(entry.context.error);
    // e.g. Sentry.captureMessage(entry.message, { level: ... });
    
    // For now, this is just a no-op placeholder as instructed.
  }
}
