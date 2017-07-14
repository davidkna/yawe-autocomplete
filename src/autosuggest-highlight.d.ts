declare module 'autosuggest-highlight/parse' {
    export interface highlightFragment {
      text: string
      highlight: boolean
    }

    export default function parse(text: string, matches: [number, number][]): highlightFragment[]
}
