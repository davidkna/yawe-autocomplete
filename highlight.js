/**
 * Hightlight stuff
 * @author David Knaack
 * MIT license
 */

 import highlight from 'autosuggest-highlight'
 import { deburr, escapeRegExp, words, flatten } from 'lodash-es'

 const { parse } = highlight

 function merge(m, text) {
   if (m.length === 1) {
     return m[0]
   }
   const matches = flatten(m).sort(([a], [b]) => a - b)
   const results = [matches[0]]
   for (let i = 1; i < matches.length; i += 1) {
     const current = matches[i]
     const last = results[results.length - 1]
     if (current[0] <= last[1] || /^\s*$/.test(text.slice(last[1], current[0]))) {
       last[1] = Math.max(current[1], last[1])
     } else {
       results.push(current)
     }
   }
   return results
 }

 function match(t, iwords) {
   const text = deburr(t)
   return merge(iwords.map(word => {
     const regex = new RegExp(escapeRegExp(deburr(word)), 'gi')
     const results = []
     let rmatch
     while (rmatch = regex.exec(text)) { // eslint-disable-line no-cond-assign
       results.push([
         rmatch.index,
         regex.lastIndex,
       ])
     }
     return results
   }), text)
 }

 function item(li, text, input) {
   const matches = match(text, words(input))
   const parts = parse(text, matches)
   parts.forEach((i) => {
     if (i.highlight) {
       const mark = document.createElement('mark')
       mark.textContent = i.text
       li.appendChild(mark)
     } else {
       const t = document.createTextNode(i.text)
       li.appendChild(t)
     }
   })
 }

 export default item
