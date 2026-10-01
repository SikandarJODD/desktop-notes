type FlushPendingSave = () => Promise<void>;

let flushPendingSave: FlushPendingSave | undefined;

export function registerPendingNoteSave(flush: FlushPendingSave) {
	flushPendingSave = flush;

	return () => {
		if (flushPendingSave === flush) flushPendingSave = undefined;
	};
}

export async function flushPendingNoteSave() {
	await flushPendingSave?.();
}
