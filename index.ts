/**
 * Prompt Stash
 *
 * While composing a prompt, press F2 to move the draft out of the editor so
 * you can run a slash command. Press F2 again afterwards to put the draft
 * back and submit it.
 *
 * F2 is not a built-in Pi binding and is not bound in tmux's root key table.
 * It also avoids modifier-encoding differences between terminals.
 *
 * Stashes are kept per session in process memory. They survive `/reload`, but
 * they are not written to disk and do not survive restarting pi.
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Key } from "@earendil-works/pi-tui";

const STASHES_KEY = Symbol.for("pi.prompt-stash.stashes");

function stashes(): Map<string, string> {
	// Kept on globalThis so the draft survives an extension reload.
	const root = globalThis as typeof globalThis & {
		[STASHES_KEY]?: Map<string, string>;
	};
	return (root[STASHES_KEY] ??= new Map());
}

export default function (pi: ExtensionAPI) {
	const toggle = (ctx: ExtensionContext) => {
		const sessionId = ctx.sessionManager.getSessionId();
		const saved = stashes().get(sessionId);
		const current = ctx.ui.getEditorText();

		if (saved !== undefined) {
			// Restore. Keep anything the user typed while the draft was
			// stashed, after the original draft, rather than overwriting it.
			stashes().delete(sessionId);
			ctx.ui.setEditorText(
				current.trim() ? `${saved}\n\n${current}` : saved,
			);
			ctx.ui.notify("Draft restored", "info");
			return;
		}

		if (!current.trim()) {
			ctx.ui.notify("Nothing to stash: the editor is empty", "warning");
			return;
		}

		stashes().set(sessionId, current);
		ctx.ui.setEditorText("");
		ctx.ui.notify(
			"Draft stashed. Run your command, then press F2 to restore it.",
			"info",
		);
	};

	pi.registerShortcut(Key.f2, {
		description: "Stash or restore the current editor draft",
		handler: toggle,
	});
}