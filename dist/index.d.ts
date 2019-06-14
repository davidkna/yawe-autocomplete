/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * @author David Knaack (fork)
 * MIT license
 */
declare class YAWEComplete {
    readonly input: HTMLInputElement;
    readonly getCompletion: (inputValue: string) => Promise<string[]>;
    protected typedValue: string;
    protected container: HTMLElement;
    protected ul: HTMLUListElement;
    protected index: number;
    protected list: string[];
    constructor(input: HTMLInputElement, getCompletion: (inputValue: string) => Promise<string[]>);
    close(): void;
    open(): void;
    next(): void;
    previous(): void;
    protected goto(i: number): void;
    refresh(): void;
    showCompletions(): void;
}
export default YAWEComplete;
