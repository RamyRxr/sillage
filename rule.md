I want you to generate designs for my project in my Figma file.

My Figma file URL: https://www.figma.com/design/kH3DBg6JJhrlzsVpKelrvX/Sillage?node-id=0-1
Figma file key: kH3DBg6JJhrlzsVpKelrvX
Target: add the captures at the page root (node id 0:1).

## Before you start
1. Read `idea.md` in this project folder. It describes the project: what it is, the platform, the pages or screens, and the style. Follow it for the design and for the frame size. If something is missing from it, ask me before you build.
2. Read `~/.claude/tools-explanation.md` (my global tool inventory: agents, skills, hooks, rules, MCP servers). Check it before you choose how to work, and use the matching skills and agents, for example the design and UI skills.

## How to work with my Figma file
Do NOT use the Figma `use_figma`, `get_screenshot` or `get_metadata` tools to create anything. My plan (Starter) limits them. Use ONLY the capture route below. It works on my plan.

1. Build each page or screen as HTML, one top-level frame per screen. Use the frame size that fits the project (for example a desktop width for a website, or a phone width and height for an app). Keep every frame the same size, and place them side by side in a row with a gap. Use a small generator script (Python is fine) so I can ask for changes later.
2. Serve the folder locally on a port (e.g. python http.server) and open the page in the built-in browser pane (the `mcp__Claude_Browser__*` tools), not my Chrome.
3. Call the Figma tool `generate_figma_design` with fileKey "kH3DBg6JJhrlzsVpKelrvX" and nodeId "0:1". It returns a captureId. Use a fresh captureId for every page (each is single use). Generate a new UUID as `promptId` for each request of mine.
4. Navigate the browser pane to:
   http://localhost:<port>/<page>-capture.html#figmacapture=<captureId>&figmaendpoint=<url-encoded https://mcp.figma.com/mcp/capture/<captureId>/submit?bindVariables=true&promptId=<promptId>>&figmadelay=3000
5. Wait 20 to 30 seconds, then call `generate_figma_design` again with the same fileKey and captureId. Repeat every 5 to 10 seconds until the status is "completed". It then returns the Figma link. If it stays "pending", reload the page once with the same URL.

## Page rules so the capture looks right
- The "-capture.html" copy of the page must include this script at the end of <head>: <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
- If the browser pane is hidden, animation frames pause and the capture stalls. Put this shim BEFORE the capture script: <script>window.requestAnimationFrame=function(cb){return setTimeout(function(){cb(performance.now())},16)};window.cancelAnimationFrame=clearTimeout;</script>
- Layer names in Figma come from the `aria-label` attribute. Give every frame and every meaningful block a clear aria-label (e.g. "Header", "Primary button").
- A wrapper with no visual style gets flattened. To keep it as its own layer, give it `overflow:hidden` and a nearly invisible background such as `background:rgba(255,255,255,.001)`.
- The LAST element in the HTML ends up on top in Figma, so put the background first and anything that sits on top last.
- Use fonts from Google Fonts via a <link>, absolute positioning, and avoid CSS features that don't map to Figma (complex filters, blend modes).
- The capture only creates frames, not groups. Tell me if I should group them myself (select, Ctrl+Shift+G).

## Checking your work
- Before capturing, render the page locally and look at every frame. Fix clipped text, overlaps and uneven spacing first.
- After a capture completes, open the returned Figma link in the browser pane and check the frames. Take a screenshot and read the layers panel.
- If a Figma tool says "tool call limit on the Starter plan", don't retry it. Carry on with the capture route and read the file through the browser pane.

## Output
Name each frame clearly. After each capture, give me the Figma link, list the placeholders (names, numbers, photos, copy) so I can replace them, and ask what to build next.

Start now.