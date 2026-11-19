<template>
    <main class='page'>
        <header class='header'>
            <h1>node-cot Validator</h1>
            <p>Paste or drop a Cursor-on-Target XML event or a GeoJSON Feature to check it against the node-cot schema.</p>
        </header>

        <div class='toolbar'>
            <span
                class='status'
                :class='status.kind'
                aria-live='polite'
            >{{ status.text }}</span>

            <span class='spacer' />

            <button
                type='button'
                @click='input = SAMPLE_XML'
            >
                XML sample
            </button>
            <button
                type='button'
                @click='input = SAMPLE_INVALID_XML'
            >
                Invalid sample
            </button>
            <button
                type='button'
                @click='input = SAMPLE_GEOJSON'
            >
                GeoJSON sample
            </button>
            <button
                type='button'
                :disabled='!input'
                @click='input = ""'
            >
                Clear
            </button>
            <button
                type='button'
                class='icon-button'
                :disabled='!result?.output'
                :title='copyLabel'
                :aria-label='copyLabel'
                @click='copy'
            >
                <svg
                    v-if='copied'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    aria-hidden='true'
                >
                    <path d='M5 12l5 5l10 -10' />
                </svg>
                <svg
                    v-else
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    aria-hidden='true'
                >
                    <rect
                        x='8'
                        y='8'
                        width='12'
                        height='12'
                        rx='2'
                    />
                    <path d='M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2' />
                </svg>
            </button>
        </div>

        <Editor
            v-model='input'
            :format='format'
            :issues='result?.issues ?? []'
        />

        <details
            v-if='result?.output'
            class='converted'
        >
            <summary>
                Converted {{ result.output.label }}
            </summary>
            <pre class='output'>{{ result.output.text }}</pre>
        </details>
    </main>
</template>

<script setup lang='ts'>
import { computed, ref, shallowRef, watch } from 'vue';
import Editor from './Editor.vue';
import { detectFormat, validate } from './validate.js';
import type { ValidationResult } from './validate.js';
import { SAMPLE_GEOJSON, SAMPLE_INVALID_XML, SAMPLE_XML } from './samples.js';

const input = ref('');
const copied = ref(false);
const result = shallowRef<ValidationResult | null>(null);

const format = computed(() => detectFormat(input.value));

const status = computed<{ kind: 'idle' | 'valid' | 'invalid', text: string }>(() => {
    if (!input.value.trim()) {
        return { kind: 'idle', text: 'Waiting for input' };
    }

    if (!result.value) {
        return { kind: 'invalid', text: 'Unrecognised input - expected XML or a JSON object' };
    }

    const name = result.value.format === 'xml' ? 'CoT XML' : 'GeoJSON Feature';

    if (result.value.valid) {
        return { kind: 'valid', text: `Valid ${name}` };
    }

    const count = result.value.issues.length;

    return { kind: 'invalid', text: `Invalid ${name} - ${count} ${count === 1 ? 'issue' : 'issues'}` };
});

let run = 0;

watch(input, async (value) => {
    const current = ++run;
    copied.value = false;

    const next = value.trim() ? await validate(value) : null;

    if (current === run) result.value = next;
});

const copyLabel = computed(() => {
    if (copied.value) return 'Copied';
    if (!result.value?.output) return 'Copy converted output';

    return `Copy converted ${result.value.output.label}`;
});

async function copy(): Promise<void> {
    if (!result.value?.output) return;

    await navigator.clipboard.writeText(result.value.output.text);
    copied.value = true;
}
</script>
