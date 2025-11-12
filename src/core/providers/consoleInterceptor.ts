/* eslint-disable no-console */

/**
 * Represents a single console log entry.
 */
interface ConsoleLog {
  type: 'log' | 'error' | 'warn';
  timestamp: string;
  message: string;
}

/**
 * Type for a console method signature.
 */
type ConsoleMethod = (...args: unknown[]) => void;

/**
 * ConsoleInterceptor class for capturing and managing console logs.
 *
 * Intercepts `console.log`, `console.error`, and `console.warn` calls,
 * stores logs in memory, and provides methods to retrieve and clear logs.
 * Implements the singleton pattern.
 *
 * @example
 * const interceptor = ConsoleInterceptor.getInstance();
 * interceptor.getLogs(); // Get all logs
 * interceptor.getErrorLogs(); // Get only error logs
 * interceptor.clearLogs(); // Clear all logs
 */
class ConsoleInterceptor {
  private static instance: ConsoleInterceptor;
  private logs: ConsoleLog[] = [];
  private readonly maxLogs = 100;
  private originalConsole: Record<string, ConsoleMethod>;

  private constructor() {
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
    };

    this.initializeInterceptor();
  }

  /**
   * Returns the singleton instance of ConsoleInterceptor.
   *
   * @returns {ConsoleInterceptor} The singleton instance.
   */
  public static getInstance(): ConsoleInterceptor {
    if (!ConsoleInterceptor.instance) {
      ConsoleInterceptor.instance = new ConsoleInterceptor();
    }

    return ConsoleInterceptor.instance;
  }

  /**
   * Initializes the interception of console methods.
   * @internal
   */
  private initializeInterceptor(): void {
    const methods = ['log', 'error', 'warn'] as const;
    methods.forEach((type) => {
      const original = this.originalConsole[type];
      (console[type] as ConsoleMethod) = (...args: unknown[]) => {
        this.addLog(type, args);
        original(...args);
      };
    });
  }

  /**
   * Adds a log entry to the logs array.
   *
   * @param type - The type of log ('log', 'error', or 'warn').
   * @param args - The arguments passed to the console method.
   * @internal
   */
  private addLog(type: 'log' | 'error' | 'warn', args: unknown[]): void {
    const message = args
      .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
      .join(' ');

    this.logs.push({
      type,
      timestamp: new Date().toISOString(),
      message,
    });

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Retrieves all captured logs.
   *
   * @returns {ConsoleLog[]} Array of all console logs.
   */
  public getLogs(): ConsoleLog[] {
    return this.logs;
  }

  /**
   * Retrieves only error logs.
   *
   * @returns {ConsoleLog[]} Array of error logs.
   */
  public getErrorLogs(): ConsoleLog[] {
    return this.logs.filter((log) => log.type === 'error');
  }

  /**
   * Clears all captured logs.
   */
  public clearLogs(): void {
    this.logs = [];
  }
}

export default ConsoleInterceptor;
/* eslint-enable no-console */
