
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Input.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/components/Input.svelte";

    function create_fragment$6(ctx) {
    	let fieldset;
    	let label_1;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			input = element("input");
    			attr_dev(label_1, "class", "w-12");
    			attr_dev(label_1, "for", /*label*/ ctx[0]);
    			add_location(label_1, file$6, 10, 2, 249);
    			attr_dev(input, "name", /*label*/ ctx[0]);
    			attr_dev(input, "class", "flex-1 p-1");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "inputmode", "numeric");
    			add_location(input, file$6, 11, 2, 299);
    			attr_dev(fieldset, "class", "w-full flex flex-row justify-between items-center mb-2");
    			add_location(fieldset, file$6, 9, 0, 173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, label_1);
    			append_dev(label_1, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "blur", /*handleSetValue*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);

    			if (dirty & /*label*/ 1) {
    				attr_dev(label_1, "for", /*label*/ ctx[0]);
    			}

    			if (dirty & /*label*/ 1) {
    				attr_dev(input, "name", /*label*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { label } = $$props;
    	let { setValue } = $$props;

    	function handleSetValue(e) {
    		if (e.target.value) {
    			setValue(Number(e.target.value));
    		}
    	}

    	const writable_props = ['label', 'setValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('setValue' in $$props) $$invalidate(2, setValue = $$props.setValue);
    	};

    	$$self.$capture_state = () => ({ label, setValue, handleSetValue });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('setValue' in $$props) $$invalidate(2, setValue = $$props.setValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, handleSetValue, setValue];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { label: 0, setValue: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Input> was created without expected prop 'label'");
    		}

    		if (/*setValue*/ ctx[2] === undefined && !('setValue' in props)) {
    			console.warn("<Input> was created without expected prop 'setValue'");
    		}
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setValue() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setValue(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Controls.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/components/Controls.svelte";

    function create_fragment$5(ctx) {
    	let form;
    	let div1;
    	let h3;
    	let t1;
    	let div0;
    	let span;
    	let t2;
    	let t3;
    	let input0;
    	let t4;
    	let input1;
    	let current;

    	input0 = new Input({
    			props: {
    				label: "width",
    				setValue: /*handleSetValue*/ ctx[0]
    			},
    			$$inline: true
    		});

    	input1 = new Input({
    			props: {
    				label: "step",
    				setValue: /*handleSetValue*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Change the settings";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(/*error*/ ctx[1]);
    			t3 = space();
    			create_component(input0.$$.fragment);
    			t4 = space();
    			create_component(input1.$$.fragment);
    			attr_dev(h3, "class", "text-xl");
    			add_location(h3, file$5, 13, 4, 365);
    			add_location(span, file$5, 15, 6, 438);
    			attr_dev(div0, "class", "h-8");
    			add_location(div0, file$5, 14, 4, 414);
    			attr_dev(div1, "class", "flex flex-col items-center bg-green-100 max-w-screen-md w-full");
    			add_location(div1, file$5, 12, 2, 284);
    			attr_dev(form, "class", "flex justify-center p-2");
    			add_location(form, file$5, 11, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div1, t3);
    			mount_component(input0, div1, null);
    			append_dev(div1, t4);
    			mount_component(input1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*error*/ 2) set_data_dev(t2, /*error*/ ctx[1]);
    			const input0_changes = {};
    			if (dirty & /*handleSetValue*/ 1) input0_changes.setValue = /*handleSetValue*/ ctx[0];
    			input0.$set(input0_changes);
    			const input1_changes = {};
    			if (dirty & /*handleSetValue*/ 1) input1_changes.setValue = /*handleSetValue*/ ctx[0];
    			input1.$set(input1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(input0);
    			destroy_component(input1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Controls', slots, []);
    	let { handleSetValue } = $$props;
    	let { maxWidth } = $$props;
    	let { error = '' } = $$props;
    	const writable_props = ['handleSetValue', 'maxWidth', 'error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('handleSetValue' in $$props) $$invalidate(0, handleSetValue = $$props.handleSetValue);
    		if ('maxWidth' in $$props) $$invalidate(2, maxWidth = $$props.maxWidth);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({ Input, handleSetValue, maxWidth, error });

    	$$self.$inject_state = $$props => {
    		if ('handleSetValue' in $$props) $$invalidate(0, handleSetValue = $$props.handleSetValue);
    		if ('maxWidth' in $$props) $$invalidate(2, maxWidth = $$props.maxWidth);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleSetValue, error, maxWidth];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { handleSetValue: 0, maxWidth: 2, error: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleSetValue*/ ctx[0] === undefined && !('handleSetValue' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleSetValue'");
    		}

    		if (/*maxWidth*/ ctx[2] === undefined && !('maxWidth' in props)) {
    			console.warn("<Controls> was created without expected prop 'maxWidth'");
    		}
    	}

    	get handleSetValue() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSetValue(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxWidth() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxWidth(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // export function randomInt(max = 1) {
    //   return Math.floor(Math.random() * max)
    // }
    function getRandomDecimal() {
        const MIN = 0.2;
        return Math.random() * (1 - MIN) + MIN;
    }
    function getRandomInt({ min = 0, max = 255 }) {
        return Math.random() * (max - min) + min;
    }

    function getSquareDimensions(outer, step) {
        let squares = [];
        let current = step;
        while (current < outer) {
            current += step;
            const offset = (outer - current) / 2;
            squares = [
                {
                    x: offset,
                    y: offset,
                    width: current,
                    height: current
                },
                ...squares
            ];
        }
        return squares;
    }

    function getColorString({ hue, saturation, lightness, alpha = 1 }) {
        return `hsla(${display(hue)}, ${display(saturation)}%, ${display(lightness)}%, ${display(alpha, false)})`;
    }
    function display(decimal, round = true) {
        const digits = round ? 0 : 2;
        return parseFloat(decimal.toFixed(digits));
    }

    function getRandomColor(options) {
        if (!options || options === {}) {
            return {
                hue: getRandomInt({ max: 255 }),
                lightness: getRandomInt({ max: 100 }),
                saturation: getRandomInt({ max: 100 }),
                alpha: getRandomDecimal()
            };
        }
        else {
            // handle option generation
            // 1. Get color from hue range (or other prop, etc)
            return {
                hue: 200,
                saturation: 100,
                lightness: 50,
                alpha: 1
            };
        }
    }

    function getPropertyIncrement(color, property = 'hue', increment = 10) {
        // Only incrementing hue right now for testing purposes
        color[property] = color[property] + increment;
        return color;
    }

    /* src/components/Square.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/components/Square.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].x;
    	child_ctx[2] = list[i].y;
    	child_ctx[3] = list[i].height;
    	child_ctx[4] = list[i].width;
    	child_ctx[5] = list[i].color;
    	return child_ctx;
    }

    // (12:4) {#each squares as { x, y, height, width, color }}
    function create_each_block(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;
    	let rect_width_value;
    	let rect_fill_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = /*x*/ ctx[1]);
    			attr_dev(rect, "y", rect_y_value = /*y*/ ctx[2]);
    			attr_dev(rect, "height", rect_height_value = /*height*/ ctx[3]);
    			attr_dev(rect, "width", rect_width_value = /*width*/ ctx[4]);
    			attr_dev(rect, "fill", rect_fill_value = getColorString(/*color*/ ctx[5]));
    			add_location(rect, file$4, 12, 6, 340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*squares*/ 1 && rect_x_value !== (rect_x_value = /*x*/ ctx[1])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_y_value !== (rect_y_value = /*y*/ ctx[2])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_height_value !== (rect_height_value = /*height*/ ctx[3])) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_width_value !== (rect_width_value = /*width*/ ctx[4])) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_fill_value !== (rect_fill_value = getColorString(/*color*/ ctx[5]))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(12:4) {#each squares as { x, y, height, width, color }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let svg;
    	let svg_width_value;
    	let svg_height_value;
    	let each_value = /*squares*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(svg, "class", "block");
    			attr_dev(svg, "width", svg_width_value = /*squares*/ ctx[0][0]?.width ?? '100%');
    			attr_dev(svg, "height", svg_height_value = /*squares*/ ctx[0][0]?.width ?? '100%');
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$4, 5, 2, 133);
    			attr_dev(div, "class", "flex justify-center my-2");
    			add_location(div, file$4, 4, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*squares, getColorString*/ 1) {
    				each_value = /*squares*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*squares*/ 1 && svg_width_value !== (svg_width_value = /*squares*/ ctx[0][0]?.width ?? '100%')) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*squares*/ 1 && svg_height_value !== (svg_height_value = /*squares*/ ctx[0][0]?.width ?? '100%')) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Square', slots, []);
    	let { squares } = $$props;
    	const writable_props = ['squares'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Square> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('squares' in $$props) $$invalidate(0, squares = $$props.squares);
    	};

    	$$self.$capture_state = () => ({ getColorString, squares });

    	$$self.$inject_state = $$props => {
    		if ('squares' in $$props) $$invalidate(0, squares = $$props.squares);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [squares];
    }

    class Square extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { squares: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Square",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*squares*/ ctx[0] === undefined && !('squares' in props)) {
    			console.warn("<Square> was created without expected prop 'squares'");
    		}
    	}

    	get squares() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set squares(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ColorTitle.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/components/ColorTitle.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h3;
    	let t2;
    	let svg;
    	let rect;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = `Current color is ${/*colorString*/ ctx[0]}`;
    			t2 = space();
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			attr_dev(h3, "class", "text-gray-400 text-center");
    			add_location(h3, file$3, 6, 2, 174);
    			attr_dev(rect, "height", 50);
    			attr_dev(rect, "width", 50);
    			attr_dev(rect, "fill", /*colorString*/ ctx[0]);
    			add_location(rect, file$3, 10, 4, 339);
    			attr_dev(svg, "class", "mx-2");
    			attr_dev(svg, "width", 50);
    			attr_dev(svg, "height", 50);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 9, 2, 258);
    			attr_dev(div, "class", "flex flex-row items-center");
    			add_location(div, file$3, 5, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t2);
    			append_dev(div, svg);
    			append_dev(svg, rect);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorTitle', slots, []);
    	let { color } = $$props;
    	let colorString = getColorString(color);
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ getColorString, color, colorString });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('colorString' in $$props) $$invalidate(0, colorString = $$props.colorString);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colorString, color];
    }

    class ColorTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorTitle",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[1] === undefined && !('color' in props)) {
    			console.warn("<ColorTitle> was created without expected prop 'color'");
    		}
    	}

    	get color() {
    		throw new Error("<ColorTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ColorTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ColorGenerator.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;

    const file$2 = "src/components/ColorGenerator.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let colortitle;
    	let t0;
    	let square;
    	let t1;
    	let controls;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[7]);

    	colortitle = new ColorTitle({
    			props: { color: /*current*/ ctx[0] },
    			$$inline: true
    		});

    	square = new Square({
    			props: { squares: /*filledSquares*/ ctx[2] },
    			$$inline: true
    		});

    	controls = new Controls({
    			props: {
    				handleSetValue: /*handleSetValue*/ ctx[4],
    				maxWidth: /*outerWidth*/ ctx[1] - /*step*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(colortitle.$$.fragment);
    			t0 = space();
    			create_component(square.$$.fragment);
    			t1 = space();
    			create_component(controls.$$.fragment);
    			attr_dev(div, "class", "w-full h-full p-2 items-center justify-center md:p-4 lg:p-6");
    			add_location(div, file$2, 20, 0, 650);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(colortitle, div, null);
    			append_dev(div, t0);
    			mount_component(square, div, null);
    			append_dev(div, t1);
    			mount_component(controls, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const colortitle_changes = {};
    			if (dirty & /*current*/ 1) colortitle_changes.color = /*current*/ ctx[0];
    			colortitle.$set(colortitle_changes);
    			const square_changes = {};
    			if (dirty & /*filledSquares*/ 4) square_changes.squares = /*filledSquares*/ ctx[2];
    			square.$set(square_changes);
    			const controls_changes = {};
    			if (dirty & /*outerWidth*/ 2) controls_changes.maxWidth = /*outerWidth*/ ctx[1] - /*step*/ ctx[3];
    			controls.$set(controls_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colortitle.$$.fragment, local);
    			transition_in(square.$$.fragment, local);
    			transition_in(controls.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colortitle.$$.fragment, local);
    			transition_out(square.$$.fragment, local);
    			transition_out(controls.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(colortitle);
    			destroy_component(square);
    			destroy_component(controls);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let squares;
    	let filledSquares;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorGenerator', slots, []);
    	let color = getRandomColor();
    	let current = color;
    	let outerWidth;
    	let width = 300;
    	let step = 50;

    	function handleSelectColor(color) {
    		$$invalidate(0, current = color);
    	}

    	function handleSetValue(val) {
    		$$invalidate(5, width = val);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorGenerator> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, outerWidth = window.outerWidth);
    	}

    	$$self.$capture_state = () => ({
    		Controls,
    		Square,
    		ColorTitle,
    		getSquareDimensions,
    		getRandomColor,
    		getPropertyIncrement,
    		color,
    		current,
    		outerWidth,
    		width,
    		step,
    		handleSelectColor,
    		handleSetValue,
    		squares,
    		filledSquares
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(8, color = $$props.color);
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    		if ('outerWidth' in $$props) $$invalidate(1, outerWidth = $$props.outerWidth);
    		if ('width' in $$props) $$invalidate(5, width = $$props.width);
    		if ('step' in $$props) $$invalidate(3, step = $$props.step);
    		if ('squares' in $$props) $$invalidate(6, squares = $$props.squares);
    		if ('filledSquares' in $$props) $$invalidate(2, filledSquares = $$props.filledSquares);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 32) {
    			$$invalidate(6, squares = getSquareDimensions(width, step));
    		}

    		if ($$self.$$.dirty & /*squares*/ 64) {
    			$$invalidate(2, filledSquares = squares.map(sq => Object.assign(Object.assign({}, sq), { color: getPropertyIncrement(color) })));
    		}
    	};

    	return [
    		current,
    		outerWidth,
    		filledSquares,
    		step,
    		handleSetValue,
    		width,
    		squares,
    		onwindowresize
    	];
    }

    class ColorGenerator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorGenerator",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Title.svelte generated by Svelte v3.46.4 */

    const file$1 = "src/components/Title.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Color Sequence Generator";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Click on the shape to change it's color";
    			attr_dev(h1, "class", "text-2xl");
    			add_location(h1, file$1, 3, 2, 88);
    			attr_dev(h2, "class", "text-gray-400");
    			add_location(h2, file$1, 4, 2, 141);
    			attr_dev(div, "class", "w-full flex flex-col p-2 items-center justify-center md:mb-2 lg:mb-6");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let title;
    	let t;
    	let colorgenerator;
    	let current;
    	title = new Title({ $$inline: true });
    	colorgenerator = new ColorGenerator({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title.$$.fragment);
    			t = space();
    			create_component(colorgenerator.$$.fragment);
    			attr_dev(main, "class", "flex flex-col items-center h-screen");
    			add_location(main, file, 4, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title, main, null);
    			append_dev(main, t);
    			mount_component(colorgenerator, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(colorgenerator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(colorgenerator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title);
    			destroy_component(colorgenerator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ColorGenerator, Title });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
