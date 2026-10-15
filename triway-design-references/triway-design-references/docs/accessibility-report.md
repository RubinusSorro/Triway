# Accessibility report
## Computed contrast (WCAG)
| Pair | Ratio | Use |
|---|---|---|
| #111111 on #FFFFFF | 18.88:1 | Body text |
| #111111 on #F0F7F3 | 17.36:1 | Text on app bg |
| #6B7280 on #FFFFFF | 4.83:1 | Muted text |
| #6B7280 on #F0F7F3 | 4.44:1 | Muted on bg |
| #FFFFFF on #064E3B | 9.72:1 | Primary button |
| #FFFFFF on #147D64 | 5.06:1 | Secondary button |
| #147D64 on #FFFFFF | 5.06:1 | Green text/links |
| #064E3B on #CFE5CF | 7.29:1 | Badge on mint |
| #C0392B on #FFFFFF | 5.44:1 | Error text |
| #FFFFFF on #C0392B | 5.44:1 | Destructive button |
| #147D64 vs #F0F7F3 (non-text) | 4.65:1 | Icons/borders |
| #CFE5CF vs #FFFFFF (non-text) | 1.33:1 | Mint as sole border |
| #FFFFFF on #1F6B4F (gradient start) | 6.41:1 | Text on gradient |
| #FFFFFF on #3F9680 (gradient end) | 3.57:1 | Text on gradient |

## Findings
- #6B7280 on #F0F7F3 is 4.44:1, below 4.5:1. Use muted text on white, or approve a darker muted token (proposal pending).
- #CFE5CF on white is 1.33:1: never the only border; use #D5E3DA (proposed) plus fill.
- White on gradient end #3F9680 is 3.57:1: large text only.
- Disabled buttons (#6B7280 on #E5E7EB) are exempt but kept readable.
## Implementation checklist
Touch targets 48dp (previews use 48-52px). Support Android font scaling (sp, test 200%). Screen-reader labels on icon buttons and back arrows. Form errors use role=alert / live region. Status uses icon + text. prefers-reduced-motion disables animation in CSS. Safe areas via react-native-safe-area-context. Keyboard avoidance via KeyboardAvoidingView.
## Not verified
No screen-reader, device or Android font-scale testing was done. Previews are not tested in a browser.
