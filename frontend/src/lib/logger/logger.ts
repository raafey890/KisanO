import { LogLevel, LoggerAdapter, LogEntry } from './types';
import { ConsoleAdapter } from './consoleAdapter';
import { ProductionAdapter } from './productionAdapter';

class Logger {
  private adapters: LoggerAdapter[] = [];
  private currentLogLevel: LogLevel = LogLevel.INFO;

  constructor() {
    this.initializeAdapters();
  }

  private initializeAdapters() {
    // In a real app, this would check import.meta.env.MODE === 'production'
    // but for safety in all modes right now, we attach console adapter.
    this.adapters.push(new ConsoleAdapter());
    
    // We can conditionally attach the production adapter here later based on ENV
    if (import.meta.env?.PROD) {
       this.adapters.push(new ProductionAdapter());
    }
  }

  public setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  private dispatchLog(entry: LogEntry) {
    if (entry.level >= this.currentLogLevel) {
      this.adapters.forEach(adapter => adapter.log(entry));
    }
  }

  public debug(message: string, context?: Record<string, any>) {
    this.dispatchLog(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  public info(message: string, context?: Record<string, any>) {
    this.dispatchLog(this.createLogEntry(LogLevel.INFO, message, context));
  }

  public warn(message: string, context?: Record<string, any>) {
    this.dispatchLog(this.createLogEntry(LogLevel.WARN, message, context));
  }

  public error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorContext = error instanceof Error 
      ? { errorMessage: error.message, stack: error.stack, ...context }
      : { error, ...context };
      
    this.dispatchLog(this.createLogEntry(LogLevel.ERROR, message, errorContext));
  }

  public fatal(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorContext = error instanceof Error 
      ? { errorMessage: error.message, stack: error.stack, ...context }
      : { error, ...context };
      
    this.dispatchLog(this.createLogEntry(LogLevel.FATAL, message, errorContext));
  }
}

export const logger = new Logger();
