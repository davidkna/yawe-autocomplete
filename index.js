import regExpEscape from 'lodash-es/escapeRegExp'

/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * @author David Knaack (fork)
 * MIT license
 */

function item(text, input) {
  const trimmedInput = input.trim()
  const html = trimmedInput === '' ?
    text :
    text.replace(RegExp(regExpEscape(trimmedInput), 'gi'), '<mark>$&</mark>')
  return html
}

class YAWEComplete {
  constructor(input, getCompletion) {
    // Setup
    this.input = input
    this.getCompletion = getCompletion
    this.input.setAttribute('aria-autocomplete', 'list')

    this.index = -1
    this.typedValue = this.input.value

    // Create necessary elements
    this.container = this.input.parentElement
    this.ul = this.input.nextElementSibling

    // Bind events
    this.input.addEventListener('input', this.refresh.bind(this))
    this.input.addEventListener('blur', this.close.bind(this))
    this.input.addEventListener('keydown', evt => {
      const c = evt.key
      // If the dropdown `ul` is in view, then act on keydown for the following keys:
      // Enter / Tab / Esc / Up / Down
      if (!this.ul.hasAttribute('hidden')) {
        if ((c === 'Enter' || c === 'Tab') && this.index !== -1) {
          // Only prevent default on tab
          if (c === 'Tab') {
            evt.preventDefault()
          }
          this.input.value = this.list[this.index]
          this.close()
        } else if (c === 'Escape') {
          this.close()
        } else if (c === 'ArrowUp' || c === 'ArrowDown') {
          evt.preventDefault()
          this[c === 'ArrowUp' ? 'previous' : 'next']()
        }
      }
    })

    this.input.form.addEventListener('submit', this.close.bind(this))

    this.ul.addEventListener('click', evt => {
      let li = evt.target

      if (li !== this) {
        while (li && !/li/i.test(li.nodeName)) {
          li = li.parentNode
        }
        if (!li) {
          return
        }

        evt.preventDefault()
        this.li.input = li.innerText
        this.close()
      }
    })
  }

  close() {
    this.ul.setAttribute('hidden', '')
    this.index = -1
  }

  open() {
    this.ul.removeAttribute('hidden')
  }

  next() {
    const count = this.list.length
    this.goto(this.index < count - 1 ? this.index + 1 : -1)
  }

  previous() {
    const count = this.list.length
    this.goto(this.index !== -1 ? this.index - 1 : count - 1)
  }

  goto(i) {
    const lis = this.ul.children
    if (this.index !== -1) {
      lis[this.index].setAttribute('aria-selected', 'false')
    }
    this.index = i
    if (lis.length > 0) {
      if (i > -1) {
        lis[i].setAttribute('aria-selected', 'true')
        this.input.value = lis[i].textContent
      } else {
        this.input.value = this.typedValue
      }
    }
  }

  refresh() {
    this.index = -1
    const typedValue = this.typedValue = this.input.value
    if (this.input.value.length !== 0) {
      this.getCompletion(this.input.value)
        .then(newList => {
          if (typedValue === this.typedValue) {
            this.list = newList
            this.showCompletions()
          }
        })
    } else {
      this.close()
    }
  }
  showCompletions() {
    if (this.list.length === 0) {
      this.close()
      return
    }

    const children = this.ul.children

    // Populate list
    if (this.list.length < children.length) {
      for (let i = this.list.length; i < children.length; i += 1) {
        this.ul.removeChild(children[i])
      }
    }
    this.list.forEach((text, i) => {
      const itemHTML = item(text, this.input.value)
      if (children[i]) {
        children[i].innerHTML = itemHTML
        children[i].setAttribute('aria-selected', 'false')
        return
      }
      const li = document.createElement('li')
      li.innerHTML = itemHTML
      li.setAttribute('aria-selected', 'false')
      this.ul.appendChild(li)
    })
    this.open()
  }
}

export default YAWEComplete
