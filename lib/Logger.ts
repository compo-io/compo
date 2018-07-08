import chalk from 'chalk';

/**
 * @class Logger
 * @classdesc Logger class
 * @export
 */
export class Logger {

    /**
     * @desc prints out an info message
     * @param args
     */
    static info(...args: any[]): void {
        console.log(chalk.cyan('*'), ...args);
    }

    /**
     * @desc prints out an error message
     * @param args
     */
    static error(...args: any[]): void {
        console.error(chalk.red('*'), ...args)
    }

}
