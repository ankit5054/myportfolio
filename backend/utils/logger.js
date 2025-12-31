/**
 * Production Grade Logger with TraceId and Configurable Log Levels
 */

const crypto = require('crypto');

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  generateTraceId() {
    return crypto.randomBytes(8).toString('hex');
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  formatLog(level, message, traceId, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      traceId,
      message,
      ...meta
    });
  }

  error(message, traceId = this.generateTraceId(), meta = {}) {
    if (this.shouldLog('error')) {
      console.error(this.formatLog('error', message, traceId, meta));
    }
  }

  warn(message, traceId = this.generateTraceId(), meta = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatLog('warn', message, traceId, meta));
    }
  }

  info(message, traceId = this.generateTraceId(), meta = {}) {
    if (this.shouldLog('info')) {
      console.log(this.formatLog('info', message, traceId, meta));
    }
  }

  debug(message, traceId = this.generateTraceId(), meta = {}) {
    if (this.shouldLog('debug')) {
      console.log(this.formatLog('debug', message, traceId, meta));
    }
  }
}

module.exports = new Logger();