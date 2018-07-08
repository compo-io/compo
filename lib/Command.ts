export interface Command {
    command(): Promise<any>;
}
