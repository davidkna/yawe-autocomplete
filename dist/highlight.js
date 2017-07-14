/**
 * Hightlight stuff
 * @author David Knaack
 * MIT license
 */
const deburr = require('lodash-es/deburr');
const escapeRegExp = require('lodash-es/escapeRegExp');
const flatten = require('lodash-es/flatten');
const parse = require('autosuggest-highlight/parse');
const words = require('lodash-es/words');
function merge(matches, text) {
    const results = [matches[0]];
    for (let i = 1; i < matches.length; i += 1) {
        const current = matches[i];
        const last = results[results.length - 1];
        if (current[0] <= last[1] || /^\s*$/.test(text.slice(last[1], current[0]))) {
            last[1] = Math.max(current[1], last[1]);
        }
        else {
            results.push(current);
        }
    }
    return results;
}
function match(t, iwords) {
    const text = deburr(t);
    const highlightInfo = iwords.map((word) => {
        const regex = new RegExp(escapeRegExp(deburr(word)), 'gi');
        const results = [];
        let rmatch;
        while (rmatch = regex.exec(text)) {
            results.push([
                rmatch.index,
                regex.lastIndex,
            ]);
        }
        return results;
    });
    // No need to merge
    if (iwords.length === 1) {
        return highlightInfo[0];
    }
    return merge(flatten(highlightInfo).sort(([a], [b]) => a - b), text);
}
function highlight(text, input) {
    const matches = match(text, words(input, undefined, undefined));
    const parts = parse(text, matches);
    const li = document.createDocumentFragment();
    parts.forEach((i) => {
        if (i.highlight) {
            const mark = document.createElement('mark');
            mark.textContent = i.text;
            li.appendChild(mark);
        }
        else {
            const t = document.createTextNode(i.text);
            li.appendChild(t);
        }
    });
    return li;
}
export default highlight;