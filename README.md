# pi-prompt-stash-ext

Press **F2** to move the prompt you are composing out of the editor so you can
run a slash command. Press **F2** again afterwards to put the draft back and
submit it.

F2 is not a built-in Pi binding and is not bound in tmux's root key table. It
also avoids modifier-encoding differences between terminals.

- Registers F2, unbound by default.
- Toggles per session: stash the draft, then restore it.
- When restoring, anything typed in the meantime is appended after the draft
  instead of being overwritten.
- Warns when there is nothing to stash.
- Stashes are kept per session in process memory, on `globalThis`, so they
  survive `/reload` but not a restart of Pi.

## Install

Symlink this directory into Pi's extension directory, naming the symlink after
the extension as you want it to appear in Pi:

```sh
ln -s /Users/baptiste/Documents/Dev/pi-prompt-stash-ext ~/.pi/agent/extensions/prompt-stash
```

Then run `/reload` in Pi (or restart it).
