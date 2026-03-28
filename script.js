
// ═══════════════════════════════════════════════════════════════════════
//  PRESET DATA
// ═══════════════════════════════════════════════════════════════════════
const PRESETS = {
    promise: {
        name: 'promise.js', code: [
            { t: `console.<span class="fn">log</span>(<span class="str">"start"</span>);` },
            { t: `` }, { t: `Promise.<span class="fn">resolve</span>(<span class="num">42</span>)` },
            { t: `  .<span class="fn">then</span>(<span class="pm">val</span> <span class="op">=></span> {` },
            { t: `    console.<span class="fn">log</span>(<span class="str">"then:"</span>, <span class="pm">val</span>);` },
            { t: `  });` }, { t: `` },
            { t: `console.<span class="fn">log</span>(<span class="str">"end"</span>);` },
        ], steps: [
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'Call Stack begins executing synchronous code' },
            { k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 0 },
            { k: 'hl', line: 0 }, { k: 'con', text: '<span style="color:#34d399">start</span>' },
            { k: 'hl', line: 2 },
            { k: 'push', frame: { name: 'Promise.resolve(42)', icon: '🔵', tag: 'sync' }, line: 2 },
            { k: 'micro-add', item: { name: '.then(val => ...)', icon: '💜' }, log: 'Promise resolved → .then() → Microtask Queue' },
            { k: 'pop', line: 2, log: 'Promise.resolve() returns' },
            { k: 'hl', line: 7 }, { k: 'con', text: '<span style="color:#34d399">end</span>' },
            { k: 'pop', line: 7, log: 'main script sync done' },
            { k: 'loop', nodes: ['eln-s', 'eln-m'], arrs: ['ea1'], desc: 'Stack empty → Event Loop checks Microtask Queue FIRST' },
            { k: 'micro-run', log: 'Dequeue microtask → push to Call Stack' },
            { k: 'push', frame: { name: '.then callback(42)', icon: '💜', tag: 'microtask' }, line: 4 },
            { k: 'hl', line: 4 }, { k: 'con', text: '<span style="color:#a78bfa">then: 42</span>' },
            { k: 'pop', line: 4, log: '.then() callback done' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'All queues empty — idle' },
            { k: 'done' },
        ]
    },
    settimeout: {
        name: 'setTimeout.js', code: [
            { t: `console.<span class="fn">log</span>(<span class="str">"A"</span>);` }, { t: `` },
            { t: `<span class="fn">setTimeout</span>(() <span class="op">=></span> {` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"C — macrotask"</span>);` },
            { t: `}, <span class="num">0</span>);` }, { t: `` },
            { t: `console.<span class="fn">log</span>(<span class="str">"B"</span>);` },
        ], steps: [
            { k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 0 },
            { k: 'hl', line: 0 }, { k: 'con', text: '<span style="color:#34d399">A</span>' },
            { k: 'hl', line: 2 },
            { k: 'push', frame: { name: 'setTimeout(..., 0)', icon: '🟠', tag: 'sync' }, line: 2 },
            { k: 'wa-add', item: { name: 'Timer (0ms)', icon: '⏱' }, log: 'setTimeout → handed off to Web API' },
            { k: 'loop', nodes: ['eln-w'], arrs: ['ea3'], desc: 'Web API handles the timer — even 0ms timers are async!' },
            { k: 'pop', line: 4, log: 'setTimeout() returns immediately' },
            { k: 'wa-done', log: '0ms elapsed → callback → Macrotask Queue' },
            { k: 'macro-add', item: { name: '() => log("C")', icon: '🟠' }, log: 'Timer done → Macrotask Queue' },
            { k: 'hl', line: 6 }, { k: 'con', text: '<span style="color:#34d399">B</span>' },
            { k: 'pop', line: 6, log: 'Sync code complete' },
            { k: 'loop', nodes: ['eln-s', 'eln-M'], arrs: ['ea2'], desc: 'Stack empty → Event Loop picks next Macrotask' },
            { k: 'macro-run', log: 'Dequeue macrotask → Call Stack' },
            { k: 'push', frame: { name: 'setTimeout cb()', icon: '🟠', tag: 'macrotask' }, line: 3 },
            { k: 'hl', line: 3 }, { k: 'con', text: '<span style="color:#fb923c">C — macrotask</span>' },
            { k: 'pop', line: 3, log: 'Macrotask done' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'All queues empty — event loop idle' },
            { k: 'done' },
        ]
    },
    micromacro: {
        name: 'micro-vs-macro.js', code: [
            { t: `console.<span class="fn">log</span>(<span class="str">"1: sync"</span>);` }, { t: `` },
            { t: `<span class="fn">setTimeout</span>(() <span class="op">=></span>` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"4: macro"</span>), <span class="num">0</span>` },
            { t: `);` }, { t: `` },
            { t: `Promise.<span class="fn">resolve</span>().<span class="fn">then</span>(() <span class="op">=></span>` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"3: micro"</span>)` },
            { t: `);` }, { t: `` },
            { t: `console.<span class="fn">log</span>(<span class="str">"2: sync"</span>);` },
        ], steps: [
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'Synchronous execution begins — top to bottom' },
            { k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 0 },
            { k: 'hl', line: 0 }, { k: 'con', text: '<span style="color:#34d399">1: sync</span>' },
            { k: 'hl', line: 2 },
            { k: 'wa-add', item: { name: 'Timer 0ms', icon: '⏱' }, log: 'setTimeout(0) → Web API' },
            { k: 'wa-done', log: 'Timer expired → Macrotask Queue' },
            { k: 'macro-add', item: { name: '() => log("4: macro")', icon: '🟠' }, log: 'Callback → Macrotask Queue' },
            { k: 'hl', line: 6 },
            { k: 'micro-add', item: { name: '() => log("3: micro")', icon: '💜' }, log: 'Promise.resolve().then → Microtask Queue' },
            { k: 'hl', line: 10 }, { k: 'con', text: '<span style="color:#34d399">2: sync</span>' },
            { k: 'pop', line: 10, log: 'All sync code finished' },
            { k: 'loop', nodes: ['eln-s', 'eln-m'], arrs: ['ea1'], desc: '⚡ Stack empty → Microtasks drain BEFORE any Macrotask!' },
            { k: 'micro-run', log: 'Microtask dequeued — runs next' },
            { k: 'push', frame: { name: 'Promise.then cb()', icon: '💜', tag: 'microtask' }, line: 7 },
            { k: 'hl', line: 7 }, { k: 'con', text: '<span style="color:#a78bfa">3: micro</span>' },
            { k: 'pop', line: 7, log: 'Microtask done' },
            { k: 'loop', nodes: ['eln-s', 'eln-M'], arrs: ['ea2'], desc: 'Microtask queue empty → now pick Macrotask' },
            { k: 'macro-run', log: 'Macrotask dequeued' },
            { k: 'push', frame: { name: 'setTimeout cb()', icon: '🟠', tag: 'macrotask' }, line: 3 },
            { k: 'hl', line: 3 }, { k: 'con', text: '<span style="color:#fb923c">4: macro</span>' },
            { k: 'pop', line: 3, log: 'Macrotask done' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: '✅ Order confirmed: sync → microtask → macrotask' },
            { k: 'done' },
        ]
    },
    asyncawait: {
        name: 'async-await.js', code: [
            { t: `<span class="kw">async function</span> <span class="fn">fetchUser</span>() {` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"fetching..."</span>);` },
            { t: `  <span class="kw">const</span> <span class="vc">data</span> <span class="op">=</span> <span class="kw">await</span> <span class="fn">getUser</span>();` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"got:"</span>, <span class="vc">data</span>);` },
            { t: `}` }, { t: `` },
            { t: `<span class="kw">function</span> <span class="fn">getUser</span>() {` },
            { t: `  <span class="kw">return</span> <span class="kw">new</span> <span class="fn">Promise</span>(<span class="pm">res</span> <span class="op">=></span>` },
            { t: `    <span class="fn">setTimeout</span>(() <span class="op">=></span> <span class="pm">res</span>(<span class="str">"Alice"</span>), <span class="num">500</span>)` },
            { t: `  );` }, { t: `}` }, { t: `` },
            { t: `<span class="fn">fetchUser</span>();` },
            { t: `console.<span class="fn">log</span>(<span class="str">"after call"</span>);` },
        ], steps: [
            { k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 12 },
            { k: 'hl', line: 12 },
            { k: 'push', frame: { name: 'fetchUser()', icon: '🔵', tag: 'async fn' }, line: 0 },
            { k: 'hl', line: 1 }, { k: 'con', text: '<span style="color:#34d399">fetching...</span>' },
            { k: 'hl', line: 2 },
            { k: 'push', frame: { name: 'getUser()', icon: '🟢', tag: 'sync' }, line: 6 },
            { k: 'hl', line: 7 },
            { k: 'wa-add', item: { name: 'Timer 500ms → res("Alice")', icon: '⏱' }, log: 'new Promise + setTimeout(500) → Web API' },
            { k: 'pop', line: 7, log: 'getUser() returns pending Promise' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'await suspends fetchUser() — yields control back to caller' },
            { k: 'pop', line: 2, log: 'fetchUser() suspended at await keyword' },
            { k: 'hl', line: 13 }, { k: 'con', text: '<span style="color:#34d399">after call</span>' },
            { k: 'pop', line: 13, log: 'Sync code done — stack empty' },
            { k: 'loop', nodes: ['eln-w'], arrs: ['ea3'], desc: 'Web API timer running (500ms)…' },
            { k: 'wa-done', log: '500ms done → resolve("Alice") → microtask' },
            { k: 'micro-add', item: { name: 'resume fetchUser (data="Alice")', icon: '💜' }, log: 'Promise resolved → resume after await → Microtask Queue' },
            { k: 'loop', nodes: ['eln-s', 'eln-m'], arrs: ['ea1'], desc: 'Stack empty → Event Loop drains Microtasks' },
            { k: 'micro-run', log: 'Microtask: resume fetchUser() after await' },
            { k: 'push', frame: { name: 'fetchUser() resumed', icon: '🔵', tag: 'microtask' }, line: 3 },
            { k: 'hl', line: 3 }, { k: 'con', text: '<span style="color:#a78bfa">got: Alice</span>' },
            { k: 'pop', line: 3, log: 'fetchUser() resumed and completed' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'All done ✅ async/await = syntactic sugar over Promises' },
            { k: 'done' },
        ]
    },
    mixed: {
        name: 'mixed-full.js', code: [
            { t: `console.<span class="fn">log</span>(<span class="str">"script start"</span>);   <span class="cmt">// 1</span>` }, { t: `` },
            { t: `<span class="fn">setTimeout</span>(() <span class="op">=></span> {` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"setTimeout"</span>);  <span class="cmt">// 5</span>` },
            { t: `}, <span class="num">0</span>);` }, { t: `` },
            { t: `<span class="kw">new</span> <span class="fn">Promise</span>((<span class="pm">res</span>) <span class="op">=></span> {` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"promise body"</span>); <span class="cmt">// 2</span>` },
            { t: `  <span class="pm">res</span>(<span class="str">"ok"</span>);` },
            { t: `}).<span class="fn">then</span>(<span class="pm">v</span> <span class="op">=></span> {` },
            { t: `  console.<span class="fn">log</span>(<span class="str">"then:"</span>, <span class="pm">v</span>);   <span class="cmt">// 4</span>` },
            { t: `});` }, { t: `` },
            { t: `console.<span class="fn">log</span>(<span class="str">"script end"</span>);    <span class="cmt">// 3</span>` },
        ], steps: [
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'Script starts — synchronous code runs top to bottom' },
            { k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 0 },
            { k: 'hl', line: 0 }, { k: 'con', text: '<span style="color:#34d399">1: script start</span>' },
            { k: 'hl', line: 2 },
            { k: 'push', frame: { name: 'setTimeout(..., 0)', icon: '🟠', tag: 'sync' }, line: 2 },
            { k: 'wa-add', item: { name: 'Timer 0ms', icon: '⏱' }, log: 'setTimeout(0) → Web API' },
            { k: 'wa-done', log: '0ms → callback moves to Macrotask Queue' },
            { k: 'macro-add', item: { name: '() => log("5: setTimeout")', icon: '🟠' }, log: 'Macrotask queued' },
            { k: 'pop', line: 4, log: 'setTimeout() returns' },
            { k: 'hl', line: 6 },
            { k: 'push', frame: { name: 'new Promise(executor)', icon: '🔵', tag: 'sync' }, line: 6 },
            { k: 'hl', line: 7 }, { k: 'con', text: '<span style="color:#34d399">2: promise body</span>' },
            { k: 'hl', line: 8 },
            { k: 'pop', line: 8, log: 'Executor ran synchronously — res("ok") called' },
            { k: 'micro-add', item: { name: '.then(v => log(v))', icon: '💜' }, log: 'Promise resolved → .then → Microtask Queue' },
            { k: 'hl', line: 13 }, { k: 'con', text: '<span style="color:#34d399">3: script end</span>' },
            { k: 'pop', line: 13, log: 'Synchronous script finished' },
            { k: 'loop', nodes: ['eln-s', 'eln-m'], arrs: ['ea1'], desc: 'Stack empty! Event Loop drains ALL microtasks before any macrotask' },
            { k: 'micro-run', log: 'Microtask dequeued → Call Stack' },
            { k: 'push', frame: { name: '.then callback("ok")', icon: '💜', tag: 'microtask' }, line: 9 },
            { k: 'hl', line: 10 }, { k: 'con', text: '<span style="color:#a78bfa">4: then: ok</span>' },
            { k: 'pop', line: 10, log: '.then() complete — microtask queue now empty' },
            { k: 'loop', nodes: ['eln-s', 'eln-M'], arrs: ['ea2'], desc: 'Microtasks drained → Event Loop picks Macrotask' },
            { k: 'macro-run', log: 'Macrotask dequeued → Call Stack' },
            { k: 'push', frame: { name: 'setTimeout cb()', icon: '🟠', tag: 'macrotask' }, line: 3 },
            { k: 'hl', line: 3 }, { k: 'con', text: '<span style="color:#fb923c">5: setTimeout</span>' },
            { k: 'pop', line: 3, log: 'Macrotask done' },
            { k: 'loop', nodes: ['eln-s'], arrs: [], desc: '✅ Final order: 1 → 2 → 3 → 4 → 5' },
            { k: 'done' },
        ]
    },
};

// ═══════════════════════════════════════════════════════════════════════
//  CUSTOM CODE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════
const EXAMPLES = {
    simple: `console.log("first");
console.log("second");
console.log("third");`,

    promise_chain: `console.log("start");
Promise.resolve("A")
  .then(v => {
    console.log("then1:", v);
    return "B";
  })
  .then(v => {
    console.log("then2:", v);
  });
console.log("end");`,

    timeout_order: `console.log("start");
setTimeout(() => console.log("timeout 1"), 0);
setTimeout(() => console.log("timeout 2"), 100);
setTimeout(() => console.log("timeout 3"), 0);
console.log("end");`,

    async_fn: `async function greet(name) {
  console.log("Hello,", name);
  const result = await Promise.resolve("done");
  console.log("Async result:", result);
}
console.log("before");
greet("World");
console.log("after");`,

    nested_promise: `console.log("start");
Promise.resolve()
  .then(() => {
    console.log("micro 1");
    return Promise.resolve();
  })
  .then(() => console.log("micro 2"))
  .then(() => console.log("micro 3"));
setTimeout(() => console.log("macro"), 0);
console.log("end");`,

    multi_timeout: `console.log("sync 1");
setTimeout(() => {
  console.log("macro A");
  Promise.resolve().then(() => console.log("micro inside macro"));
}, 0);
Promise.resolve().then(() => console.log("micro 1"));
console.log("sync 2");`,
};

function loadExample(key) {
    document.getElementById('custom-editor').value = EXAMPLES[key];
}

// ═══════════════════════════════════════════════════════════════════════
//  RUNTIME TRACER — dynamically generates visualization steps
// ═══════════════════════════════════════════════════════════════════════

function analyzeCustomCode() {
    const code = document.getElementById('custom-editor').value.trim();
    if (!code) return;

    const errBanner = document.getElementById('error-banner');
    errBanner.style.display = 'none';

    // We run the code in a controlled sandbox that intercepts all async operations
    // and records every event as a visualization step
    try {
        const generatedSteps = traceCode(code);
        // Switch to running this as a custom "preset"
        PRESETS['_custom'] = {
            name: 'custom.js',
            code: code.split('\n').map(t => ({ t: escapeHtml(t) })),
            steps: generatedSteps,
        };
        resetAll();
        showCustomCodePanel(code);
        steps = generatedSteps;
        updateSC();
        setStatus('', 'Custom code analyzed — press Run or Step');
    } catch (e) {
        errBanner.style.display = 'block';
        errBanner.textContent = '⚠ ' + e.message;
    }
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Show the custom code as a read-only highlighted view after analysis
function showCustomCodePanel(code) {
    const lines = code.split('\n');
    document.getElementById('codedisplay').innerHTML = lines.map((l, i) =>
        `<div class="cl" id="cl${i}"><span class="ln">${i + 1}</span><span class="lc">${escapeHtml(l) || ' '}</span></div>`
    ).join('');
    // Keep custom panel open, but scroll codedisplay into left col area is already handled
}

// ─── Core tracer ──────────────────────────────────────────────────────────
function traceCode(code) {
    const recorded = []; // list of trace events from sandbox execution
    let idCtr = 0;
    const uid = () => ++idCtr;

    // Sandbox state
    const macroQueue = [];
    const microQueue = [];
    let timerIdCtr = 0;

    // ---- Intercept APIs ----
    const sandboxConsole = {
        log: (...args) => {
            recorded.push({ type: 'console', value: args.map(a => String(a)).join(' ') });
        }
    };

    const sandboxSetTimeout = (fn, delay = 0, ...rest) => {
        const id = ++timerIdCtr;
        recorded.push({ type: 'setTimeout', id, delay: delay || 0, fn });
        macroQueue.push({ id, fn, delay: delay || 0 });
        return id;
    };

    const sandboxSetInterval = (fn, delay = 0) => {
        // treat as single-shot macrotask for visualization
        return sandboxSetTimeout(fn, delay);
    };

    const sandboxClearTimeout = () => { };

    // We need a synchronous Promise shim that records .then chains
    class TracedPromise {
        constructor(executor) {
            this._id = uid();
            this._resolved = false;
            this._value = undefined;
            this._rejected = false;
            this._reason = undefined;
            this._thenCallbacks = [];
            this._catchCallbacks = [];

            const resolve = (val) => {
                if (this._resolved || this._rejected) return;
                this._resolved = true;
                this._value = val instanceof TracedPromise ? val._value : val;
                recorded.push({ type: 'promise_resolve', id: this._id, value: this._value });
                this._flushThen();
            };
            const reject = (reason) => {
                this._rejected = true;
                this._reason = reason;
                recorded.push({ type: 'promise_reject', id: this._id });
            };
            try { executor(resolve, reject); } catch (e) { reject(e); }
        }

        _flushThen() {
            for (const { fn, childId } of this._thenCallbacks) {
                recorded.push({ type: 'micro_enqueue', parentId: this._id, childId, fnRef: fn, value: this._value });
                microQueue.push({ fn, value: this._value, childId });
            }
            this._thenCallbacks = [];
        }

        then(onFulfilled, onRejected) {
            const child = new TracedPromise((res, rej) => { });
            child._parentId = this._id;
            if (this._resolved) {
                recorded.push({ type: 'micro_enqueue', parentId: this._id, childId: child._id, fnRef: onFulfilled, value: this._value });
                microQueue.push({ fn: onFulfilled, value: this._value, childId: child._id, resolveChild: (v) => { child._resolved = true; child._value = v; child._flushThen(); } });
            } else {
                this._thenCallbacks.push({ fn: onFulfilled, childId: child._id, resolveChild: (v) => { child._resolved = true; child._value = v; child._flushThen(); } });
            }
            return child;
        }

        catch(onRejected) { return this.then(undefined, onRejected); }
        finally(fn) { return this.then(v => { fn(); return v; }, r => { fn(); throw r; }); }

        static resolve(val) {
            const p = new TracedPromise((res) => res(val));
            return p;
        }
        static reject(reason) {
            return new TracedPromise((_, rej) => rej(reason));
        }
        static all(promises) {
            return TracedPromise.resolve(promises.map(p => p._value));
        }
    }

    // ---- Build sandbox environment and run the code ----
    const sandboxGlobals = {
        console: sandboxConsole,
        setTimeout: sandboxSetTimeout,
        setInterval: sandboxSetInterval,
        clearTimeout: sandboxClearTimeout,
        clearInterval: sandboxClearTimeout,
        Promise: TracedPromise,
    };

    // Execute synchronous portion of user code
    const fn = new Function(
        ...Object.keys(sandboxGlobals),
        `"use strict";\n${code}`
    );

    recorded.push({ type: 'script_start' });
    try {
        fn(...Object.values(sandboxGlobals));
    } catch (e) {
        throw new Error('Syntax/runtime error in your code: ' + e.message);
    }
    recorded.push({ type: 'script_end' });

    // Now drain microtasks first, then macrotasks, alternating
    let safety = 0;
    while ((microQueue.length || macroQueue.length) && safety++ < 200) {
        // Drain all microtasks
        while (microQueue.length) {
            const item = microQueue.shift();
            recorded.push({ type: 'micro_run', childId: item.childId, value: item.value });
            if (item.fn) {
                try {
                    const result = item.fn(item.value);
                    if (item.resolveChild && result !== undefined) {
                        // resolve child with result — might enqueue more microtasks
                        item.resolveChild(result instanceof TracedPromise ? result._value : result);
                    } else if (item.resolveChild) {
                        item.resolveChild(item.value);
                    }
                } catch (e) { }
            }
            recorded.push({ type: 'micro_done', childId: item.childId });
        }
        // Pick one macrotask
        if (macroQueue.length) {
            const task = macroQueue.shift();
            recorded.push({ type: 'macro_run', id: task.id, delay: task.delay });
            try { task.fn(); } catch (e) { }
            recorded.push({ type: 'macro_done', id: task.id });
            // After each macrotask, drain microtasks again (inner loop will handle)
        }
    }
    recorded.push({ type: 'all_done' });

    // ---- Convert recorded events to visualization steps ----
    return buildSteps(recorded, code);
}

// ─── Convert trace events → visualization steps ──────────────────────────
function buildSteps(events, code) {
    const steps = [];
    const lines = code.split('\n');
    let microIdMap = {}; // childId -> display name
    let macroIdMap = {}; // timer id -> display name
    let timerCounter = 0;
    let microCounter = 0;

    // Helper to find approximate line index for a string
    function findLine(pattern) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(pattern)) return i;
        }
        return -1;
    }

    // Collect info about timeouts and promises ahead of time for naming
    for (const e of events) {
        if (e.type === 'setTimeout') {
            timerCounter++;
            const delay = e.delay > 0 ? `${e.delay}ms` : '0ms';
            macroIdMap[e.id] = `setTimeout cb #${timerCounter} (${delay})`;
        }
        if (e.type === 'micro_enqueue') {
            microCounter++;
            microIdMap[e.childId] = `.then cb #${microCounter}`;
        }
    }

    steps.push({ k: 'loop', nodes: ['eln-s'], arrs: [], desc: 'Synchronous code begins executing' });
    steps.push({ k: 'push', frame: { name: 'main script', icon: '📄', tag: 'global' }, line: 0 });

    let lastLine = 0;

    for (const e of events) {
        switch (e.type) {

            case 'script_start':
                break;

            case 'console': {
                const li = findLine('console.log');
                if (li >= 0) steps.push({ k: 'hl', line: li });
                steps.push({ k: 'con', text: `<span style="color:#34d399">${escapeHtml(e.value)}</span>` });
                break;
            }

            case 'setTimeout': {
                const li = findLine('setTimeout');
                if (li >= 0) steps.push({ k: 'hl', line: li });
                steps.push({ k: 'push', frame: { name: `setTimeout(${e.delay}ms)`, icon: '🟠', tag: 'sync' }, line: li });
                steps.push({ k: 'wa-add', item: { name: `Timer ${e.delay}ms`, icon: '⏱' }, log: `setTimeout(${e.delay}) → Web API` });
                steps.push({ k: 'loop', nodes: ['eln-w'], arrs: ['ea3'], desc: `Web API handles timer (${e.delay}ms) — async!` });
                steps.push({ k: 'wa-done', log: `${e.delay}ms timer done → Macrotask Queue` });
                steps.push({ k: 'macro-add', item: { name: macroIdMap[e.id] || `setTimeout cb`, icon: '🟠' }, log: `Callback → Macrotask Queue` });
                steps.push({ k: 'pop', line: li, log: `setTimeout() returns — timer running in Web API` });
                break;
            }

            case 'promise_resolve': {
                const li = findLine('Promise.resolve') >= 0 ? findLine('Promise.resolve') :
                    findLine('new Promise') >= 0 ? findLine('new Promise') : -1;
                if (li >= 0) steps.push({ k: 'hl', line: li });
                break;
            }

            case 'micro_enqueue': {
                const name = microIdMap[e.childId] || '.then callback';
                steps.push({ k: 'micro-add', item: { name, icon: '💜' }, log: `Promise resolved → ${name} → Microtask Queue` });
                break;
            }

            case 'script_end':
                steps.push({ k: 'pop', line: lines.length - 1, log: 'Synchronous script finished' });
                steps.push({ k: 'loop', nodes: ['eln-s', 'eln-m'], arrs: ['ea1'], desc: 'Stack empty → Event Loop: drain ALL microtasks first' });
                break;

            case 'micro_run': {
                const name = microIdMap[e.childId] || '.then callback';
                steps.push({ k: 'micro-run', log: `Dequeue microtask: ${name} → Call Stack` });
                steps.push({ k: 'push', frame: { name, icon: '💜', tag: 'microtask' }, line: findLine('.then') >= 0 ? findLine('.then') : -1 });
                break;
            }

            case 'micro_done': {
                steps.push({ k: 'pop', line: -1, log: `Microtask done` });
                break;
            }

            case 'macro_run': {
                const name = macroIdMap[e.id] || 'setTimeout cb';
                steps.push({ k: 'loop', nodes: ['eln-s', 'eln-M'], arrs: ['ea2'], desc: 'Microtasks empty → Event Loop picks Macrotask' });
                steps.push({ k: 'macro-run', log: `Dequeue macrotask: ${name} → Call Stack` });
                steps.push({ k: 'push', frame: { name, icon: '🟠', tag: 'macrotask' }, line: findLine('setTimeout') >= 0 ? findLine('setTimeout') : -1 });
                break;
            }

            case 'macro_done':
                steps.push({ k: 'pop', line: -1, log: 'Macrotask complete' });
                break;

            case 'all_done':
                steps.push({ k: 'loop', nodes: ['eln-s'], arrs: [], desc: '✅ All queues empty — execution complete' });
                steps.push({ k: 'done' });
                break;
        }
    }

    return steps;
}

// ═══════════════════════════════════════════════════════════════════════
//  VISUALIZATION STATE
// ═══════════════════════════════════════════════════════════════════════
let steps = [], stepIdx = 0, callStack = [], microQ = [], macroQ = [], webApi = [];
let isRunning = false, runTimer = null, colorIdx = 0, idCtr = 0;
const newId = () => ++idCtr;
let currentKey = 'promise';

// ═══════════════════════════════════════════════════════════════════════
//  RENDERING
// ═══════════════════════════════════════════════════════════════════════
function renderStack() {
    const framesEl = document.getElementById('stackframes');
    const emp = document.getElementById('sempty');
    document.getElementById('sdepth').textContent = callStack.length;
    emp.style.display = callStack.length ? 'none' : 'flex';
    framesEl.innerHTML = [...callStack].reverse().map(f =>
        `<div class="sfr c${f.ci % 5}"><span>${f.icon}</span><span style="flex:1">${f.name}</span><span class="ftag">${f.tag || ''}</span></div>`
    ).join('');
}

function renderQueue(bodyId, emptyId, cntId, arr, cls) {
    document.getElementById(cntId).textContent = arr.length;
    document.getElementById(emptyId).style.display = arr.length ? 'none' : 'flex';
    const body = document.getElementById(bodyId);
    body.querySelectorAll('.qi').forEach(e => e.remove());
    arr.forEach((item, i) => {
        const d = document.createElement('div');
        d.className = `qi ${cls}`; d.id = `qi${item.id}`;
        d.innerHTML = `<span>${item.icon}</span><span style="flex:1">${item.name}</span><span class="qnext">${i === 0 ? '← next' : ''}</span>`;
        body.appendChild(d);
    });
}

function renderWebApi() {
    document.getElementById('wacnt').textContent = webApi.length;
    document.getElementById('waempty').style.display = webApi.length ? 'none' : 'flex';
    const body = document.getElementById('wabody');
    body.querySelectorAll('.qi').forEach(e => e.remove());
    webApi.forEach(item => {
        const d = document.createElement('div');
        d.className = 'qi qw'; d.id = `wa${item.id}`;
        d.innerHTML = `<span>${item.icon}</span><span style="flex:1">${item.name}</span>`;
        body.appendChild(d);
    });
}

function hl(line) {
    document.querySelectorAll('.cl').forEach(e => e.classList.remove('on', 'ex'));
    if (line >= 0) {
        const el = document.getElementById(`cl${line}`);
        if (el) { el.classList.add('on', 'ex'); el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    }
}

function setLoop(nodes, arrs, desc) {
    ['eln-s', 'eln-m', 'eln-M', 'eln-w'].forEach(id => document.getElementById(id).classList.toggle('anode', nodes.includes(id)));
    ['ea1', 'ea2', 'ea3'].forEach(id => document.getElementById(id).classList.toggle('aarr', arrs.includes(id)));
    const d = document.getElementById('eldesc');
    d.textContent = desc || ''; d.className = 'eldesc' + (desc ? ' a' : '');
}

function log(type, msg) {
    const body = document.getElementById('logb');
    const cls = { push: 'lpush', pop: 'lpop', micro: 'lmic', macro: 'lmac', loop: 'lloop', info: 'linf' }[type] || 'linf';
    const d = document.createElement('div');
    d.className = 'loge';
    d.innerHTML = `<span class="lts">${stepIdx}</span><span class="${cls}">${msg}</span>`;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
}

function conOut(text) {
    const el = document.getElementById('cout');
    if (el.querySelector('span[style]')) el.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'cline';
    d.innerHTML = `<span class="carr">›</span><span>${text}</span>`;
    el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function clearConsole() {
    document.getElementById('cout').innerHTML = '<span style="color:var(--muted);font-size:11px;">// output will appear here</span>';
}

function setStatus(state, txt) {
    document.getElementById('sdot').className = 'sdot' + (state ? ' ' + state : '');
    document.getElementById('stxt').textContent = txt;
}

function updateSC() {
    document.getElementById('sc').textContent = `Step ${stepIdx} / ${steps.length}`;
}

// ═══════════════════════════════════════════════════════════════════════
//  STEP EXECUTION
// ═══════════════════════════════════════════════════════════════════════
function execStep(s) {
    switch (s.k) {
        case 'push':
            if (s.line >= 0) hl(s.line);
            callStack.push({ ...s.frame, ci: colorIdx++, id: newId() });
            renderStack();
            log('push', `↑ PUSH  ${s.frame.name}`);
            break;
        case 'pop':
            if (s.line >= 0) hl(s.line);
            if (s.log) log('pop', `↓ POP   ${s.log}`);
            callStack.pop(); renderStack();
            break;
        case 'micro-add':
            microQ.push({ ...s.item, id: newId() });
            renderQueue('microbody', 'microempty', 'microcnt', microQ, 'qm');
            log('micro', `💜 ENQUEUE  ${s.item.name}`);
            if (s.log) log('info', 'ℹ ' + s.log);
            break;
        case 'micro-run':
            if (microQ.length) { const it = microQ.shift(); renderQueue('microbody', 'microempty', 'microcnt', microQ, 'qm'); log('micro', `💜 DEQUEUE → Stack  ${it.name}`); }
            if (s.log) log('loop', '🔄 ' + s.log);
            break;
        case 'macro-add':
            macroQ.push({ ...s.item, id: newId() });
            renderQueue('macrobody', 'macroempty', 'macrocnt', macroQ, 'qM');
            log('macro', `🟠 ENQUEUE  ${s.item.name}`);
            if (s.log) log('info', 'ℹ ' + s.log);
            break;
        case 'macro-run':
            if (macroQ.length) { const it = macroQ.shift(); renderQueue('macrobody', 'macroempty', 'macrocnt', macroQ, 'qM'); log('macro', `🟠 DEQUEUE → Stack  ${it.name}`); }
            if (s.log) log('loop', '🔄 ' + s.log);
            break;
        case 'wa-add':
            webApi.push({ ...s.item, id: newId() });
            renderWebApi();
            log('info', `🌐 WebAPI  ${s.item.name}`);
            if (s.log) log('info', 'ℹ ' + s.log);
            break;
        case 'wa-done':
            webApi.shift(); renderWebApi();
            if (s.log) log('info', '🌐 ' + s.log);
            break;
        case 'hl':
            hl(s.line);
            if (s.log) log('info', 'ℹ ' + s.log);
            break;
        case 'loop':
            setLoop(s.nodes || [], s.arrs || [], s.desc || '');
            if (s.desc) log('loop', '🔄 ' + s.desc);
            break;
        case 'con':
            conOut(s.text);
            break;
        case 'done':
            setStatus('done', 'Execution complete ✅');
            log('info', '🏁 Program finished');
            document.querySelectorAll('.cl').forEach(e => e.classList.remove('on', 'ex'));
            setLoop([], [], 'Execution complete — all queues empty');
            document.getElementById('btnstep').disabled = true;
            document.getElementById('btnrun').disabled = true;
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  CONTROLS
// ═══════════════════════════════════════════════════════════════════════
function stepFwd() {
    if (stepIdx >= steps.length) return;
    setStatus('run', 'Stepping…');
    execStep(steps[stepIdx]); stepIdx++; updateSC();
    if (steps[stepIdx - 1]?.k === 'done') {
        document.getElementById('btnstep').disabled = true;
        document.getElementById('btnrun').disabled = true;
    }
}

function runAll() {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('btnrun').disabled = true;
    document.getElementById('btnstep').disabled = true;
    setStatus('run', 'Running…');
    const spd = parseInt(document.getElementById('speed').value);
    function tick() {
        if (stepIdx >= steps.length) { isRunning = false; return; }
        execStep(steps[stepIdx]); stepIdx++; updateSC();
        if (stepIdx < steps.length && steps[stepIdx - 1]?.k !== 'done') runTimer = setTimeout(tick, spd);
        else isRunning = false;
    }
    tick();
}

function resetAll() {
    clearTimeout(runTimer);
    isRunning = false; stepIdx = 0; colorIdx = 0;
    callStack = []; microQ = []; macroQ = []; webApi = [];
    renderStack();
    renderQueue('microbody', 'microempty', 'microcnt', [], 'qm');
    renderQueue('macrobody', 'macroempty', 'macrocnt', [], 'qM');
    renderWebApi();
    setLoop([], [], 'Waiting for execution…');
    document.querySelectorAll('.cl').forEach(e => e.classList.remove('on', 'ex'));
    document.getElementById('logb').innerHTML = '';
    clearConsole();
    document.getElementById('btnstep').disabled = false;
    document.getElementById('btnrun').disabled = false;
    setStatus('', 'Ready to execute');
    updateSC();
}

function loadPreset(key) {
    resetAll();
    currentKey = key;

    const codePanel = document.getElementById('code-panel');
    const customPanel = document.getElementById('custom-panel');

    if (key === 'custom') {
        codePanel.style.display = 'none';
        customPanel.style.display = 'flex';
        customPanel.style.flexDirection = 'column';
        // Clear code display until user analyzes
        document.getElementById('codedisplay').innerHTML = '';
        steps = [];
        updateSC();
        setStatus('', 'Write your JS and click Analyze');
        return;
    }

    codePanel.style.display = 'block';
    customPanel.style.display = 'none';

    const p = PRESETS[key];
    if (!p) return;
    document.getElementById('fname').textContent = p.name;
    steps = p.steps;
    document.getElementById('codedisplay').innerHTML = p.code.map((l, i) =>
        `<div class="cl" id="cl${i}"><span class="ln">${i + 1}</span><span class="lc">${l.t || ' '}</span></div>`
    ).join('');
    updateSC();
}

// Speed slider
document.getElementById('speed').addEventListener('input', function () {
    document.getElementById('spv').textContent = this.value + 'ms';
});

// Preset buttons
const keys = ['promise', 'settimeout', 'micromacro', 'asyncawait', 'mixed', 'custom'];
document.querySelectorAll('.pb').forEach((btn, i) => {
    btn.onclick = () => {
        document.querySelectorAll('.pb').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        loadPreset(keys[i]);
    };
});

// Allow Tab key in textarea
document.getElementById('custom-editor').addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const s = this.selectionStart, end = this.selectionEnd;
        this.value = this.value.substring(0, s) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = s + 2;
    }
    // Ctrl+Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        analyzeCustomCode();
    }
});

// Init
loadPreset('promise');