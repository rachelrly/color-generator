
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
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    /* src/components/Title.svelte generated by Svelte v3.46.4 */

    const file$7 = "src/components/Title.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(h1, file$7, 1, 2, 69);
    			attr_dev(h2, "class", "text-gray-400");
    			add_location(h2, file$7, 2, 2, 122);
    			attr_dev(div, "class", "w-full flex flex-col p-2 items-center justify-center");
    			add_location(div, file$7, 0, 0, 0);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$7.name
    		});
    	}
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

    /* src/components/Button.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/components/Button.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", button_class_value = "p-1 m-1 w-24 " + (/*selected*/ ctx[1] && 'bg-gray-800 text-white border-gray-800'));
    			add_location(button, file$5, 5, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*selected*/ 2 && button_class_value !== (button_class_value = "p-1 m-1 w-24 " + (/*selected*/ ctx[1] && 'bg-gray-800 text-white border-gray-800'))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
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
    	validate_slots('Button', slots, []);
    	let { text } = $$props;
    	let { selected = false } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['text', 'selected', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({ text, selected, onClick });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, selected, onClick];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { text: 0, selected: 1, onClick: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Button> was created without expected prop 'text'");
    		}

    		if (/*onClick*/ ctx[2] === undefined && !('onClick' in props)) {
    			console.warn("<Button> was created without expected prop 'onClick'");
    		}
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ButtonChain.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/components/ButtonChain.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (8:2) {#each options as opt}
    function create_each_block$1(ctx) {
    	let button;
    	let current;

    	function func() {
    		return /*func*/ ctx[3](/*opt*/ ctx[4]);
    	}

    	button = new Button({
    			props: {
    				text: /*opt*/ ctx[4],
    				selected: /*selectedOption*/ ctx[0] === /*opt*/ ctx[4],
    				onClick: func
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};
    			if (dirty & /*selectedOption*/ 1) button_changes.selected = /*selectedOption*/ ctx[0] === /*opt*/ ctx[4];
    			if (dirty & /*handleSelectOption*/ 2) button_changes.onClick = func;
    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:2) {#each options as opt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$4, 6, 0, 177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, selectedOption, handleSelectOption*/ 7) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
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
    	validate_slots('ButtonChain', slots, []);
    	let { selectedOption } = $$props;
    	let { handleSelectOption } = $$props;
    	const options = ['hue', 'saturation', 'lightness'];
    	const writable_props = ['selectedOption', 'handleSelectOption'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonChain> was created with unknown prop '${key}'`);
    	});

    	const func = opt => handleSelectOption(opt);

    	$$self.$$set = $$props => {
    		if ('selectedOption' in $$props) $$invalidate(0, selectedOption = $$props.selectedOption);
    		if ('handleSelectOption' in $$props) $$invalidate(1, handleSelectOption = $$props.handleSelectOption);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		selectedOption,
    		handleSelectOption,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedOption' in $$props) $$invalidate(0, selectedOption = $$props.selectedOption);
    		if ('handleSelectOption' in $$props) $$invalidate(1, handleSelectOption = $$props.handleSelectOption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedOption, handleSelectOption, options, func];
    }

    class ButtonChain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { selectedOption: 0, handleSelectOption: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonChain",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedOption*/ ctx[0] === undefined && !('selectedOption' in props)) {
    			console.warn("<ButtonChain> was created without expected prop 'selectedOption'");
    		}

    		if (/*handleSelectOption*/ ctx[1] === undefined && !('handleSelectOption' in props)) {
    			console.warn("<ButtonChain> was created without expected prop 'handleSelectOption'");
    		}
    	}

    	get selectedOption() {
    		throw new Error("<ButtonChain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedOption(value) {
    		throw new Error("<ButtonChain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleSelectOption() {
    		throw new Error("<ButtonChain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSelectOption(value) {
    		throw new Error("<ButtonChain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Controls.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/components/Controls.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let h3;
    	let t1;
    	let div0;
    	let span;
    	let t2;
    	let t3;
    	let button;
    	let t4;
    	let buttonchain;
    	let t5;
    	let input0;
    	let t6;
    	let input1;
    	let current;

    	button = new Button({
    			props: {
    				text: "new color",
    				onClick: /*handleRandomColor*/ ctx[2]
    			},
    			$$inline: true
    		});

    	buttonchain = new ButtonChain({
    			props: {
    				handleSelectOption: /*handleSelectOption*/ ctx[1],
    				selectedOption: /*selected*/ ctx[4]
    			},
    			$$inline: true
    		});

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
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Change the settings";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(/*error*/ ctx[3]);
    			t3 = space();
    			create_component(button.$$.fragment);
    			t4 = space();
    			create_component(buttonchain.$$.fragment);
    			t5 = space();
    			create_component(input0.$$.fragment);
    			t6 = space();
    			create_component(input1.$$.fragment);
    			attr_dev(h3, "class", "text-xl");
    			add_location(h3, file$3, 11, 2, 353);
    			add_location(span, file$3, 13, 4, 422);
    			attr_dev(div0, "class", "h-8");
    			add_location(div0, file$3, 12, 2, 400);
    			attr_dev(div1, "class", "flex flex-col items-center justify-center p-2 w-full");
    			add_location(div1, file$3, 10, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div1, t3);
    			mount_component(button, div1, null);
    			append_dev(div1, t4);
    			mount_component(buttonchain, div1, null);
    			append_dev(div1, t5);
    			mount_component(input0, div1, null);
    			append_dev(div1, t6);
    			mount_component(input1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*error*/ 8) set_data_dev(t2, /*error*/ ctx[3]);
    			const button_changes = {};
    			if (dirty & /*handleRandomColor*/ 4) button_changes.onClick = /*handleRandomColor*/ ctx[2];
    			button.$set(button_changes);
    			const buttonchain_changes = {};
    			if (dirty & /*handleSelectOption*/ 2) buttonchain_changes.handleSelectOption = /*handleSelectOption*/ ctx[1];
    			if (dirty & /*selected*/ 16) buttonchain_changes.selectedOption = /*selected*/ ctx[4];
    			buttonchain.$set(buttonchain_changes);
    			const input0_changes = {};
    			if (dirty & /*handleSetValue*/ 1) input0_changes.setValue = /*handleSetValue*/ ctx[0];
    			input0.$set(input0_changes);
    			const input1_changes = {};
    			if (dirty & /*handleSetValue*/ 1) input1_changes.setValue = /*handleSetValue*/ ctx[0];
    			input1.$set(input1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(buttonchain.$$.fragment, local);
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(buttonchain.$$.fragment, local);
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    			destroy_component(buttonchain);
    			destroy_component(input0);
    			destroy_component(input1);
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
    	validate_slots('Controls', slots, []);
    	let { handleSetValue } = $$props;
    	let { handleSelectOption } = $$props;
    	let { handleRandomColor } = $$props;
    	let { error = '' } = $$props;
    	let { selected } = $$props;

    	const writable_props = [
    		'handleSetValue',
    		'handleSelectOption',
    		'handleRandomColor',
    		'error',
    		'selected'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('handleSetValue' in $$props) $$invalidate(0, handleSetValue = $$props.handleSetValue);
    		if ('handleSelectOption' in $$props) $$invalidate(1, handleSelectOption = $$props.handleSelectOption);
    		if ('handleRandomColor' in $$props) $$invalidate(2, handleRandomColor = $$props.handleRandomColor);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		Input,
    		Button,
    		ButtonChain,
    		handleSetValue,
    		handleSelectOption,
    		handleRandomColor,
    		error,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('handleSetValue' in $$props) $$invalidate(0, handleSetValue = $$props.handleSetValue);
    		if ('handleSelectOption' in $$props) $$invalidate(1, handleSelectOption = $$props.handleSelectOption);
    		if ('handleRandomColor' in $$props) $$invalidate(2, handleRandomColor = $$props.handleRandomColor);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleSetValue, handleSelectOption, handleRandomColor, error, selected];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			handleSetValue: 0,
    			handleSelectOption: 1,
    			handleRandomColor: 2,
    			error: 3,
    			selected: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleSetValue*/ ctx[0] === undefined && !('handleSetValue' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleSetValue'");
    		}

    		if (/*handleSelectOption*/ ctx[1] === undefined && !('handleSelectOption' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleSelectOption'");
    		}

    		if (/*handleRandomColor*/ ctx[2] === undefined && !('handleRandomColor' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleRandomColor'");
    		}

    		if (/*selected*/ ctx[4] === undefined && !('selected' in props)) {
    			console.warn("<Controls> was created without expected prop 'selected'");
    		}
    	}

    	get handleSetValue() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSetValue(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleSelectOption() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSelectOption(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleRandomColor() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleRandomColor(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Controls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Controls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
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
                lightness: getRandomInt({ min: 20, max: 80 }),
                saturation: getRandomInt({ min: 20, max: 100 }),
                alpha: 1
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

    function getPropertyIncrement(color, property, increment = 10) {
        // Only incrementing hue right now for testing purposes
        const newColor = Object.assign(Object.assign({}, color), { [property]: color[property] + increment });
        color[property] = color[property] + increment;
        return newColor;
    }

    /* src/components/Square.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/components/Square.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].x;
    	child_ctx[4] = list[i].y;
    	child_ctx[5] = list[i].height;
    	child_ctx[6] = list[i].width;
    	child_ctx[7] = list[i].color;
    	return child_ctx;
    }

    // (25:2) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "h-full");
    			add_location(div, file$2, 25, 4, 645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#if squares.length > 0}
    function create_if_block$1(ctx) {
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
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(svg, "class", "block");
    			attr_dev(svg, "width", svg_width_value = /*squares*/ ctx[0][0]?.width ?? '100%');
    			attr_dev(svg, "height", svg_height_value = /*squares*/ ctx[0][0]?.width ?? '100%');
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 7, 4, 192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*squares, getColorString, handleSelectColor*/ 3) {
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(7:2) {#if squares.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (14:6) {#each squares as { x, y, height, width, color }}
    function create_each_block(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;
    	let rect_width_value;
    	let rect_fill_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*color*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = /*x*/ ctx[3]);
    			attr_dev(rect, "y", rect_y_value = /*y*/ ctx[4]);
    			attr_dev(rect, "height", rect_height_value = /*height*/ ctx[5]);
    			attr_dev(rect, "width", rect_width_value = /*width*/ ctx[6]);

    			attr_dev(rect, "fill", rect_fill_value = /*color*/ ctx[7]
    			? getColorString(/*color*/ ctx[7])
    			: null);

    			add_location(rect, file$2, 14, 8, 413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);

    			if (!mounted) {
    				dispose = listen_dev(rect, "click", self(click_handler), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*squares*/ 1 && rect_x_value !== (rect_x_value = /*x*/ ctx[3])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_y_value !== (rect_y_value = /*y*/ ctx[4])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_height_value !== (rect_height_value = /*height*/ ctx[5])) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_width_value !== (rect_width_value = /*width*/ ctx[6])) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*squares*/ 1 && rect_fill_value !== (rect_fill_value = /*color*/ ctx[7]
    			? getColorString(/*color*/ ctx[7])
    			: null)) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:6) {#each squares as { x, y, height, width, color }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*squares*/ ctx[0].length > 0) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "flex justify-center my-2");
    			add_location(div, file$2, 5, 0, 122);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Square', slots, []);
    	let { squares } = $$props;
    	let { handleSelectColor } = $$props;
    	const writable_props = ['squares', 'handleSelectColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Square> was created with unknown prop '${key}'`);
    	});

    	const click_handler = color => handleSelectColor(color);

    	$$self.$$set = $$props => {
    		if ('squares' in $$props) $$invalidate(0, squares = $$props.squares);
    		if ('handleSelectColor' in $$props) $$invalidate(1, handleSelectColor = $$props.handleSelectColor);
    	};

    	$$self.$capture_state = () => ({
    		getColorString,
    		squares,
    		handleSelectColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('squares' in $$props) $$invalidate(0, squares = $$props.squares);
    		if ('handleSelectColor' in $$props) $$invalidate(1, handleSelectColor = $$props.handleSelectColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [squares, handleSelectColor, click_handler];
    }

    class Square extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { squares: 0, handleSelectColor: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Square",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*squares*/ ctx[0] === undefined && !('squares' in props)) {
    			console.warn("<Square> was created without expected prop 'squares'");
    		}

    		if (/*handleSelectColor*/ ctx[1] === undefined && !('handleSelectColor' in props)) {
    			console.warn("<Square> was created without expected prop 'handleSelectColor'");
    		}
    	}

    	get squares() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set squares(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleSelectColor() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSelectColor(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ColorTitle.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/components/ColorTitle.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let h3;

    	let t0_value = (/*color*/ ctx[0]
    	? `Current color is ${getColorString(/*color*/ ctx[0])}`
    	: 'Loading...') + "";

    	let t0;
    	let t1;
    	let div0;
    	let svg;
    	let rect;
    	let rect_fill_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			attr_dev(h3, "class", "text-gray-400 text-center");
    			add_location(h3, file$1, 5, 2, 172);
    			attr_dev(rect, "height", 50);
    			attr_dev(rect, "width", 50);

    			attr_dev(rect, "fill", rect_fill_value = /*color*/ ctx[0]
    			? getColorString(/*color*/ ctx[0])
    			: 'none');

    			add_location(rect, file$1, 15, 6, 429);
    			attr_dev(svg, "class", "mx-2 flex-1 block");
    			attr_dev(svg, "width", 50);
    			attr_dev(svg, "height", 50);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 9, 4, 304);
    			add_location(div0, file$1, 8, 2, 294);
    			attr_dev(div1, "class", "flex flex-row items-center justify-between w-full max-w-screen-sm");
    			add_location(div1, file$1, 4, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1 && t0_value !== (t0_value = (/*color*/ ctx[0]
    			? `Current color is ${getColorString(/*color*/ ctx[0])}`
    			: 'Loading...') + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*color*/ 1 && rect_fill_value !== (rect_fill_value = /*color*/ ctx[0]
    			? getColorString(/*color*/ ctx[0])
    			: 'none')) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorTitle', slots, []);
    	let { color } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ getColorString, color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class ColorTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorTitle",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
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

    /* src/App.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;

    const file = "src/App.svelte";

    // (32:4) {#if current}
    function create_if_block(ctx) {
    	let colortitle;
    	let current;

    	colortitle = new ColorTitle({
    			props: { color: /*current*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(colortitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colortitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colortitle_changes = {};
    			if (dirty & /*current*/ 2) colortitle_changes.color = /*current*/ ctx[1];
    			colortitle.$set(colortitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colortitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colortitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colortitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(32:4) {#if current}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let title;
    	let t0;
    	let div;
    	let t1;
    	let square;
    	let t2;
    	let controls;
    	let current;
    	title = new Title({ $$inline: true });
    	let if_block = /*current*/ ctx[1] && create_if_block(ctx);

    	square = new Square({
    			props: {
    				squares: /*filledSquares*/ ctx[2],
    				handleSelectColor: /*handleSelectColor*/ ctx[3]
    			},
    			$$inline: true
    		});

    	controls = new Controls({
    			props: {
    				handleRandomColor: /*handleRandomColor*/ ctx[6],
    				handleSetValue: /*handleSetValue*/ ctx[4],
    				handleSelectOption: /*handleSelectOption*/ ctx[5],
    				selected: /*option*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(square.$$.fragment);
    			t2 = space();
    			create_component(controls.$$.fragment);
    			attr_dev(div, "class", "w-full h-full p-2 flex flex-col items-center justify-evenly md:p-4 lg:p-6");
    			add_location(div, file, 28, 2, 929);
    			attr_dev(main, "class", "flex flex-col items-center h-screen");
    			add_location(main, file, 26, 0, 864);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);
    			mount_component(square, div, null);
    			append_dev(div, t2);
    			mount_component(controls, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*current*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*current*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const square_changes = {};
    			if (dirty & /*filledSquares*/ 4) square_changes.squares = /*filledSquares*/ ctx[2];
    			square.$set(square_changes);
    			const controls_changes = {};
    			if (dirty & /*option*/ 1) controls_changes.selected = /*option*/ ctx[0];
    			controls.$set(controls_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(square.$$.fragment, local);
    			transition_in(controls.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(square.$$.fragment, local);
    			transition_out(controls.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title);
    			if (if_block) if_block.d();
    			destroy_component(square);
    			destroy_component(controls);
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
    	let current;
    	let squares;
    	let filledSquares;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { base } = $$props;
    	let { option = 'hue' } = $$props;
    	let { width = 300 } = $$props;
    	let { step = 50 } = $$props;

    	function handleSelectColor(color) {
    		$$invalidate(1, current = color);
    	}

    	function handleSetValue(val) {
    		$$invalidate(8, width = val);
    	}

    	function handleSelectOption(opt) {
    		$$invalidate(0, option = opt);
    	}

    	function handleRandomColor() {
    		$$invalidate(7, base = getRandomColor());
    	}

    	const writable_props = ['base', 'option', 'width', 'step'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('base' in $$props) $$invalidate(7, base = $$props.base);
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    		if ('width' in $$props) $$invalidate(8, width = $$props.width);
    		if ('step' in $$props) $$invalidate(9, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({
    		Title,
    		Controls,
    		Square,
    		ColorTitle,
    		getSquareDimensions,
    		getRandomColor,
    		getPropertyIncrement,
    		base,
    		option,
    		width,
    		step,
    		handleSelectColor,
    		handleSetValue,
    		handleSelectOption,
    		handleRandomColor,
    		current,
    		squares,
    		filledSquares
    	});

    	$$self.$inject_state = $$props => {
    		if ('base' in $$props) $$invalidate(7, base = $$props.base);
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    		if ('width' in $$props) $$invalidate(8, width = $$props.width);
    		if ('step' in $$props) $$invalidate(9, step = $$props.step);
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    		if ('squares' in $$props) $$invalidate(10, squares = $$props.squares);
    		if ('filledSquares' in $$props) $$invalidate(2, filledSquares = $$props.filledSquares);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*base*/ 128) {
    			$$invalidate(1, current = base); // Selected color at top of screen
    		}

    		if ($$self.$$.dirty & /*width, step*/ 768) {
    			$$invalidate(10, squares = getSquareDimensions(width, step));
    		}

    		if ($$self.$$.dirty & /*squares, base, option*/ 1153) {
    			$$invalidate(2, filledSquares = squares.map(sq => Object.assign(Object.assign({}, sq), {
    				color: getPropertyIncrement(base, option)
    			})));
    		}
    	};

    	return [
    		option,
    		current,
    		filledSquares,
    		handleSelectColor,
    		handleSetValue,
    		handleSelectOption,
    		handleRandomColor,
    		base,
    		width,
    		step,
    		squares
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { base: 7, option: 0, width: 8, step: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*base*/ ctx[7] === undefined && !('base' in props)) {
    			console.warn("<App> was created without expected prop 'base'");
    		}
    	}

    	get base() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set base(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get option() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set option(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            base: getRandomColor()
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
