import sanitizeHtml from 'sanitize-html'

/**
 * Strips every HTML tag from a string and returns plain text.
 *
 * sanitize-html's default `nonTextTags` list already includes 'script',
 * 'style', 'textarea', 'option' — so the content inside those tags is
 * fully discarded, not just the surrounding angle brackets.
 *
 * Example:
 *   '<script>alert(1)</script>hello'  →  'hello'
 *   '<b>bold</b> text'               →  'bold text'
 *   'normal text'                    →  'normal text'
 */
export function sanitizePlainText(str) {
  if (typeof str !== 'string') return ''
  return sanitizeHtml(str, {
    allowedTags:       [],   // no HTML allowed — strip everything
    allowedAttributes: {},
  }).trim()
}
