# WebCraft

**Learn HTML, CSS and JavaScript one small step at a time.**

🔗 **Live site:** https://irbala.github.io/WebCraft/

WebCraft is a beginner-friendly coding playground. Each lesson explains one idea, shows an example, and gives you a checklist. Write your code in the editor, see it in the live preview, and submit it to earn coins. Spend coins in the shop to unlock new worlds.

## Worlds

| World | Lessons | What you learn | Unlock cost |
|---|---|---|---|
| 🟠 HTML | 5 | Headings, paragraphs, lists, links, images | Free |
| 🔵 CSS | 4 | Colours, fonts, spacing and boxes, flexbox | 100 coins |
| 🟡 JavaScript | 4 | Alerts, changing text, changing styles, if / else | 150 coins |

## Features

- **Live preview** that runs your HTML, CSS and JavaScript, including `alert()` pop-ups
- **Checklist for every lesson**: each item turns green as you get it right. Commented-out code doesn't count.
- **Hint** button that tells you which step to work on next
- **Reset** button that brings back the lesson's starter code
- **Next** button to move on once a lesson is done
- **Code chips** that insert common tags and snippets with one click
- **Progress saves automatically** in your browser: coins, finished lessons, unlocked worlds and unsent code
- **A finish screen** when you complete every lesson, with an option to start over
- **Works on phones, tablets and desktops**
- **Keyboard friendly**: every control can be reached with Tab. In the editor, Tab indents; press Esc then Tab to move on.

## Keyboard shortcuts

| Keys | Action |
|---|---|
| `Tab` | Indent inside the editor |
| `Esc`, then `Tab` | Leave the editor |
| `Ctrl` + `Enter` (`Cmd` + `Enter` on Mac) | Run the preview |
| `Esc` | Close the shop or finish screen |

## Run it locally

WebCraft is a single `index.html` file with no build step or dependencies. Download or clone the repo and open `index.html` in your browser:

```bash
git clone https://github.com/irbala/WebCraft.git
cd WebCraft
open index.html   # or double-click the file
```

## Adding a lesson

Lessons live in the `WORLDS` object near the top of the script in `index.html`. Each lesson looks like this:

```js
{
  title: 'Your First Heading',
  short: 'Headings',
  desc: 'What the student is learning…',
  example: '<h1>Hello World</h1>',
  starter: '',                      // code already in the editor
  chips: ['<h1>', '</h1>'],         // one-click snippets
  checks: [
    { label: 'You have an opening h1 tag', test: function(c){ return /<h1[\s>]/i.test(c); } }
  ],
  coins: 30
}
```

Each check's `test` receives the student's code with comments removed and returns `true` when the step is done.

## Notes

- Progress is stored in the browser's `localStorage`, so it stays on that device and browser only. Clearing site data or using a private window starts fresh.
- Student code runs inside a sandboxed preview frame, so it can't affect the main page.

---

Made by [Fay Alabri](https://irbala.github.io/FayAlabri/)
