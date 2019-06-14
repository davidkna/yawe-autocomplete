declare module 'autosuggest-highlight/parse' {
    export interface HighlightFragment {
      text: string
      highlight: boolean
    }

    export default function parse(text: string, matches: [number, number][]): HighlightFragment[]
}
