/**
 * Note: this file is not in use in favor of @godaddy/terminus
 *
 * @see https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
 * @see https://medium.com/@becintec/building-graceful-node-applications-in-docker-4d2cd4d5d392
 *
 * All logic necessary to gracefully exit when the container is stopped.
 *
 * @todo - console.log calls do not print
 */

/* eslint no-console: 0 */

import { Server } from 'http';

// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
enum ShutdownSignals {
  SIGHUP = 'SIGHUP',
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

/**
 * Shutdown the server
 *
 * @export
 * @param {Server} server
 * @param {ShutdownSignals} signal
 */
export default function shutdown (server: Server, signal: ShutdownSignals): void {
  console.log('Shutting down server...');

  server.close(() => {
    console.log(`Shutdown initiated by ${signal}...`);
    // @todo - should the exit code be different?
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

/**
 * Create listeners for signals that will shutdown the server.
 *
 * @export
 * @param {Server} server
 */
export function registerShutdownListeners (server: Server): void {
  // Create a listener for each of the signals that we want to handle
  for (const signal in ShutdownSignals) {
    console.log(signal);
    process.on(signal, () => {
      console.log('about to shutdown...');
      // @todo - there is probably a more typescript-y way to handle the type
      // of signal here
      shutdown(server, signal as ShutdownSignals);
    });
  }
}
