<template>
    <div
        ref='host'
        class='editor'
    />
</template>

<script setup lang='ts'>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Compartment, EditorState, StateEffect, StateField } from '@codemirror/state';
import type { Extension, Range } from '@codemirror/state';
import { Decoration, EditorView, WidgetType, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, placeholder } from '@codemirror/view';
import type { DecorationSet } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { classHighlighter } from '@lezer/highlight';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import type { Format, Issue } from './validate.js';

const props = defineProps<{
    modelValue: string;
    format: Format | null;
    issues: Issue[];
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const STAGES: Record<Issue['stage'], string> = {
    parse: 'Parse',
    schema: 'Schema',
    convert: 'Convert'
};

class IssueWidget extends WidgetType {
    constructor(readonly issues: Issue[]) {
        super();
    }

    eq(other: IssueWidget): boolean {
        return JSON.stringify(other.issues) === JSON.stringify(this.issues);
    }

    toDOM(): HTMLElement {
        const rows = document.createElement('div');
        rows.className = 'issue-rows';
        rows.setAttribute('role', 'alert');

        for (const issue of this.issues) {
            const row = rows.appendChild(document.createElement('div'));
            row.className = 'issue-row';

            const stage = row.appendChild(document.createElement('span'));
            stage.className = 'issue-stage';
            stage.textContent = STAGES[issue.stage];

            const text = row.appendChild(document.createElement('span'));
            text.className = 'issue-message';
            text.textContent = issue.message;

            if (issue.path !== '/') {
                const path = row.appendChild(document.createElement('code'));
                path.className = 'issue-path';
                path.textContent = issue.path;
            }
        }

        return rows;
    }

    ignoreEvent(): boolean {
        return false;
    }
}

const setIssues = StateEffect.define<Issue[]>();

function issueDecorations(state: EditorState, issues: Issue[]): DecorationSet {
    const byLine = new Map<number, Issue[]>();

    for (const issue of issues) {
        const line = Math.min(Math.max(issue.line, 1), state.doc.lines);
        byLine.set(line, [...(byLine.get(line) ?? []), issue]);
    }

    const ranges: Array<Range<Decoration>> = [];

    for (const [number, group] of [...byLine].toSorted((a, b) => a[0] - b[0])) {
        const line = state.doc.line(number);

        ranges.push(Decoration.line({ class: 'issue-line' }).range(line.from));
        ranges.push(Decoration.widget({ widget: new IssueWidget(group), block: true, side: 1 }).range(line.to));
    }

    return Decoration.set(ranges);
}

const issueField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update(decorations, transaction) {
        for (const effect of transaction.effects) {
            if (effect.is(setIssues)) return issueDecorations(transaction.state, effect.value);
        }

        return decorations.map(transaction.changes);
    },
    provide: (field) => EditorView.decorations.from(field)
});

const language = new Compartment();

function languageFor(format: Format | null): Extension {
    if (format === 'xml') return xml();
    if (format === 'geojson') return json();
    return [];
}

const host = ref<HTMLElement>();

let view: EditorView | undefined;

onMounted(() => {
    view = new EditorView({
        parent: host.value,
        state: EditorState.create({
            doc: props.modelValue,
            extensions: [
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightActiveLine(),
                history(),
                drawSelection(),
                bracketMatching(),
                indentUnit.of('    '),
                EditorState.tabSize.of(4),
                EditorView.lineWrapping,
                syntaxHighlighting(classHighlighter),
                placeholder('Paste or drop CoT XML or a GeoJSON Feature here'),
                keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
                language.of(languageFor(props.format)),
                issueField,
                EditorView.contentAttributes.of({
                    'aria-label': 'CoT XML or GeoJSON input',
                    spellcheck: 'false',
                    autocapitalize: 'off'
                }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) emit('update:modelValue', update.state.doc.toString());
                }),
                EditorView.domEventHandlers({
                    drop(event, target) {
                        const file = event.dataTransfer?.files[0];
                        if (!file) return false;

                        event.preventDefault();

                        void file.text().then((text) => {
                            target.dispatch({ changes: { from: 0, to: target.state.doc.length, insert: text } });
                        });

                        return true;
                    }
                })
            ]
        })
    });

    view.dispatch({ effects: setIssues.of(props.issues) });
});

onBeforeUnmount(() => {
    view?.destroy();
});

watch(() => props.modelValue, (value) => {
    if (!view || value === view.state.doc.toString()) return;

    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
});

watch(() => props.format, (format) => {
    view?.dispatch({ effects: language.reconfigure(languageFor(format)) });
});

watch(() => props.issues, (issues) => {
    view?.dispatch({ effects: setIssues.of(issues) });
});
</script>
