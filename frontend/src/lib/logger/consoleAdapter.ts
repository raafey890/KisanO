import { LoggerAdapter, LogEntry, LogLevel } from './types';

export class ConsoleAdapter implements LoggerAdapter {
  public log(entry: LogEntry): void {
    const { level, message, context, timestamp } = entry;
    
    // Format: [TIMESTAMP] [LEVEL] Message - Context
    const formattedContext = context && Object.keys(context).length > 0 
      ? `\nContext: ${JSON.stringify(context, null, 2)}` 
      : '';

    const formattedMessage = `[${timestamp}] ${message}${formattedContext}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`%c[DEBUG] ${formattedMessage}`, 'color: gray');
        break;
      case LogLevel.INFO:
        console.info(`%c[INFO] ${formattedMessage}`, 'color: blue');
        break;
      case LogLevel.WARN:
        console.warn(`%c[WARN] ${formattedMessage}`, 'color: orange');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`%c[${LogLevel[level]}] ${formattedMessage}`, 'color: red; font-weight: bold');
        break;
      default:
        console.log(formattedMessage);
    }
  }
}
