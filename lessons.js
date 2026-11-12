// WebCraft lessons.
// Each world has a list of levels. To add a lesson, copy one of the level blocks
// below and change its text, starter code and checks (see the README).

var WORLDS = {
  html: {
    name: 'HTML', icon: 'HTML', wtag: 'ht', filename: 'index.html',
    levels: [
      {
        title: 'Your First Heading',
        short: 'Headings',
        desc: 'A heading is like a big title. In HTML we use the h1 tag for the biggest heading. Every tag has an opening tag and a closing tag with a slash. Your text goes in between them.',
        example: '<h1>Hello World</h1>',
        starter: '',
        chips: ['<h1>', '</h1>', '<h2>', '</h2>'],
        checks: [
          { label: 'You have an opening h1 tag', test: function(c){ return /<h1[\s>]/i.test(c); } },
          { label: 'You have a closing /h1 tag', test: function(c){ return /<\/h1>/i.test(c); } },
          { label: 'Your h1 has some text inside it', test: function(c){ return /<h1[^>]*>\s*[^<\s][\s\S]*?<\/h1>/i.test(c); } }
        ],
        coins: 30
      },
      {
        title: 'Adding Paragraphs',
        short: 'Paragraphs',
        desc: 'A p tag creates a paragraph of text. You can have many paragraphs on a page. Try combining a heading AND a paragraph together on your page.',
        example: '<h1>Welcome to my page</h1>\n<p>This is my first paragraph.</p>',
        starter: '<h1>My Page</h1>\n',
        chips: ['<p>', '</p>', '<h1>', '</h1>'],
        checks: [
          { label: 'You have an h1 heading', test: function(c){ return /<h1[^>]*>\s*[^<\s][\s\S]*?<\/h1>/i.test(c); } },
          { label: 'You have a p paragraph tag', test: function(c){ return /<p[\s>]/i.test(c); } },
          { label: 'Your paragraph has text inside it', test: function(c){ return /<p[^>]*>\s*[^<\s][\s\S]*?<\/p>/i.test(c); } }
        ],
        coins: 30
      },
      {
        title: 'Making Lists',
        short: 'Lists',
        desc: 'Lists are great for showing several items. Use the ul tag to start a bullet list. Then each item gets its own li tag inside the ul. Think of it like a shopping list.',
        example: '<h2>My Hobbies</h2>\n<ul>\n  <li>Reading</li>\n  <li>Gaming</li>\n  <li>Coding</li>\n</ul>',
        starter: '<h2>My Favourite Things</h2>\n',
        chips: ['<ul>', '</ul>', '<li>', '</li>'],
        checks: [
          { label: 'You have a ul list tag', test: function(c){ return /<ul[\s>]/i.test(c); } },
          { label: 'You closed the list with /ul', test: function(c){ return /<\/ul>/i.test(c); } },
          { label: 'You have at least 2 list items using li', test: function(c){ return (c.match(/<li[\s>]/gi)||[]).length >= 2; } }
        ],
        coins: 40
      },
      {
        title: 'Adding Links',
        short: 'Links',
        desc: 'Links let visitors jump to other pages. Use the a tag with href equals the web address. The text between the tags is what people click on. The href part is called an attribute - extra information added inside the tag.',
        example: '<p>Visit this site:</p>\n<a href="https://example.com">Click here!</a>',
        starter: '<h1>Useful Links</h1>\n<p>Here are some links I like:</p>\n',
        chips: ['<a href="">', '</a>'],
        checks: [
          { label: 'You have an a tag', test: function(c){ return /<a\s[^>]*>/i.test(c); } },
          { label: 'Your link has an href attribute', test: function(c){ return /href=["'][^"']+["']/i.test(c); } },
          { label: 'Your link has clickable text inside it', test: function(c){ return /<a[^>]+>\s*[^<\s][\s\S]*?<\/a>/i.test(c); } }
        ],
        coins: 40
      },
      {
        title: 'Adding Images',
        short: 'Images',
        desc: 'The img tag shows a picture. It has no closing tag! The src attribute says where the image is. The alt attribute describes the image for people who cannot see it - always include this.',
        example: '<img src="https://picsum.photos/300/200" alt="A random photo">',
        starter: '<h1>My Gallery</h1>\n<p>Here is a photo:</p>\n',
        chips: ['<img src="" alt="">'],
        checks: [
          { label: 'You have an img tag', test: function(c){ return /<img/i.test(c); } },
          { label: 'Your image has a src attribute', test: function(c){ return /<img[^>]+src=["'][^"']+["']/i.test(c); } },
          { label: 'Your image has an alt attribute', test: function(c){ return /<img[^>]+alt=["'][^"']*["']/i.test(c); } }
        ],
        coins: 50
      }
    ]
  },
  css: {
    name: 'CSS', icon: 'CSS', wtag: 'ct', filename: 'index.html', cost: 100,
    levels: [
      {
        title: 'Your First Style',
        short: 'Colors',
        desc: 'CSS lives inside a style tag. You write the HTML tag name, then curly braces, then your rules inside. Try changing the color of h1 and the background-color of the body.',
        example: '<style>\n  body {\n    background-color: lightyellow;\n  }\n  h1 {\n    color: blue;\n  }\n</style>\n\n<h1>Hello!</h1>',
        starter: '<style>\n  /* Write your CSS rules here */\n\n</style>\n\n<h1>My Styled Page</h1>\n<p>I am learning CSS!</p>',
        chips: ['<style>', '</style>', 'color:', 'background-color:', 'h1 { }', 'body { }', 'p { }'],
        checks: [
          { label: 'You have a style block', test: function(c){ return /<style[\s>]/i.test(c); } },
          { label: 'You set background-color on the body', test: function(c){ return /body\s*\{[^}]*background-color\s*:/i.test(c); } },
          { label: 'You set color on h1', test: function(c){ return /h1\s*\{[^}]*color\s*:/i.test(c); } }
        ],
        coins: 40
      },
      {
        title: 'Fonts and Sizes',
        short: 'Fonts',
        desc: 'You can change text size with font-size and make text bold with font-weight bold. Sizes use px units which means pixels. For example 24px means 24 pixels tall.',
        example: '<style>\n  h1 {\n    font-size: 40px;\n    font-weight: bold;\n    color: darkblue;\n  }\n  p {\n    font-size: 18px;\n  }\n</style>',
        starter: '<style>\n\n</style>\n\n<h1>Big Title Here</h1>\n<p>Smaller paragraph text.</p>',
        chips: ['font-size:', 'font-weight:', 'font-family:', 'bold', 'px'],
        checks: [
          { label: 'You set font-size somewhere', test: function(c){ return /font-size\s*:/i.test(c); } },
          { label: 'Your font-size uses px units', test: function(c){ return /font-size\s*:\s*\d+px/i.test(c); } },
          { label: 'You set font-weight or a color', test: function(c){ return /font-weight\s*:|color\s*:/i.test(c); } }
        ],
        coins: 40
      },
      {
        title: 'Spacing and Boxes',
        short: 'Spacing',
        desc: 'Every element is a box. Padding adds space inside the box between the text and the edge. Margin adds space outside the box. Border adds a visible line around the box.',
        example: '<style>\n  .card {\n    padding: 20px;\n    margin: 10px;\n    border: 2px solid blue;\n    background-color: lightblue;\n  }\n</style>\n\n<div class="card">I am a card!</div>',
        starter: '<style>\n  .card {\n    /* Add padding, margin, border here */\n  }\n</style>\n\n<div class="card">\n  <h2>My Card</h2>\n  <p>This is inside a card.</p>\n</div>',
        chips: ['padding:', 'margin:', 'border:', 'solid', '.card { }', '<div class="">'],
        checks: [
          { label: 'You have a CSS class like .card', test: function(c){ return /\.[a-z][^{]*\{/i.test(c); } },
          { label: 'You have padding', test: function(c){ return /padding\s*:/i.test(c); } },
          { label: 'You have a border', test: function(c){ return /border\s*:/i.test(c); } }
        ],
        coins: 50
      },
      {
        title: 'Flexbox Layout',
        short: 'Flexbox',
        desc: 'display flex is powerful. Put it on a container div and its children line up in a row. Add gap for spacing between them and justify-content center to center them.',
        example: '<style>\n  .row {\n    display: flex;\n    gap: 16px;\n    justify-content: center;\n  }\n  .box {\n    padding: 20px;\n    background-color: coral;\n    border-radius: 8px;\n  }\n</style>',
        starter: '<style>\n  .row {\n    /* Make this a flexbox */\n  }\n  .box {\n    padding: 16px;\n    background-color: lightcoral;\n  }\n</style>\n\n<div class="row">\n  <div class="box">Box 1</div>\n  <div class="box">Box 2</div>\n  <div class="box">Box 3</div>\n</div>',
        chips: ['display: flex;', 'gap:', 'justify-content:', 'center', 'flex-direction:'],
        checks: [
          { label: 'You use display flex', test: function(c){ return /display\s*:\s*flex/i.test(c); } },
          { label: 'You set a gap between items', test: function(c){ return /gap\s*:/i.test(c); } },
          { label: 'You have at least 2 child divs', test: function(c){ return (c.match(/<div/gi)||[]).length >= 4; } }
        ],
        coins: 60
      }
    ]
  },
  js: {
    name: 'JavaScript', icon: 'JS', wtag: 'jt', filename: 'index.html', cost: 150,
    levels: [
      {
        title: 'Showing Messages',
        short: 'Alerts',
        desc: 'JavaScript makes pages do things. The simplest action is alert with a message in quotes and brackets. It pops up a message box. JS code lives inside a script tag. After writing your code click Preview and then click the button to test it.',
        example: '<button onclick="sayHello()">Click Me</button>\n\n<script>\nfunction sayHello() {\n  alert("Hello! You clicked me!");\n}\n<' + '/script>',
        starter: '<h1>My Interactive Page</h1>\n<button onclick="sayHello()">Say Hello!</button>\n\n<script>\n  function sayHello() {\n    // Write your alert here\n  }\n<' + '/script>',
        chips: ['alert("")', '<script>', '<' + '/script>'],
        checks: [
          { label: 'You have a script tag', test: function(c){ return /<script[\s>]/i.test(c); } },
          { label: 'You have an alert()', test: function(c){ return /alert\s*\(/i.test(c); } },
          { label: 'You have a function', test: function(c){ return /function\s+\w+/i.test(c); } }
        ],
        coins: 50
      },
      {
        title: 'Changing Text',
        short: 'DOM Text',
        desc: 'You can change any text on the page with JS. Give your element an id attribute. Then use document.getElementById to find it, and .textContent to change what it says.',
        example: '<h1 id="title">Original Text</h1>\n<button onclick="changeIt()">Change!</button>\n\n<script>\nfunction changeIt() {\n  document.getElementById("title").textContent = "New Text!";\n}\n<' + '/script>',
        starter: '<h1 id="title">Click the button to change me!</h1>\n<button onclick="changeIt()">Change!</button>\n\n<script>\n  function changeIt() {\n    // Change the h1 text here\n  }\n<' + '/script>',
        chips: ['id=""', 'document.getElementById("")', '.textContent = ""', 'onclick=""'],
        checks: [
          { label: 'An element has an id attribute', test: function(c){ return /id=["'][^"']+["']/i.test(c); } },
          { label: 'You use getElementById', test: function(c){ return /getElementById/i.test(c); } },
          { label: 'You change .textContent', test: function(c){ return /\.textContent\s*=/i.test(c); } }
        ],
        coins: 60
      },
      {
        title: 'Changing Styles',
        short: 'DOM Style',
        desc: 'JS can also change CSS. Use .style.color or .style.backgroundColor on an element to change how it looks when something happens.',
        example: '<h1 id="box">Watch me change!</h1>\n<button onclick="makeRed()">Go Red</button>\n\n<script>\nfunction makeRed() {\n  document.getElementById("box").style.color = "red";\n}\n<' + '/script>',
        starter: '<h1 id="heading">Watch my color change!</h1>\n<button onclick="colorChange()">Change Color!</button>\n\n<script>\n  function colorChange() {\n    // Change the heading color here\n  }\n<' + '/script>',
        chips: ['.style.color =', '.style.backgroundColor =', '.style.fontSize ='],
        checks: [
          { label: 'You use getElementById', test: function(c){ return /getElementById/i.test(c); } },
          { label: 'You change a .style property', test: function(c){ return /\.style\.[a-zA-Z]+\s*=/i.test(c); } },
          { label: 'You have a button with onclick', test: function(c){ return /onclick=/i.test(c); } }
        ],
        coins: 60
      },
      {
        title: 'If and Else Decisions',
        short: 'If / Else',
        desc: 'Programs make decisions using if and else. If checks whether something is true. If it is, do one thing. Otherwise the else block runs. This is the foundation of all logic in coding.',
        example: '<button onclick="check()">Am I an adult?</button>\n\n<script>\nvar age = 20;\nfunction check() {\n  if (age >= 18) {\n    alert("Yes, adult!");\n  } else {\n    alert("Not yet!");\n  }\n}\n<' + '/script>',
        starter: '<button onclick="check()">Check!</button>\n\n<script>\n  var score = 75;\n\n  function check() {\n    if (score >= 50) {\n      // What happens when score is 50 or more?\n    } else {\n      // What happens otherwise?\n    }\n  }\n<' + '/script>',
        chips: ['if () { }', 'else { }', 'var ', '>=', '===', 'alert("")'],
        checks: [
          { label: 'You use an if statement', test: function(c){ return /\bif\s*\(/i.test(c); } },
          { label: 'You have an else block', test: function(c){ return /\belse\s*\{/i.test(c); } },
          { label: 'You have an alert or textContent change', test: function(c){ return /alert\s*\(|\.textContent\s*=/i.test(c); } }
        ],
        coins: 80
      }
    ]
  }
};
