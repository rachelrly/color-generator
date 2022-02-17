
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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

    const file$6 = "src/components/Title.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Color Sequence Generator";
    			attr_dev(h1, "class", "text-2xl");
    			add_location(h1, file$6, 1, 2, 69);
    			attr_dev(div, "class", "w-full flex flex-col p-2 items-center justify-center");
    			add_location(div, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$6.name
    		});
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
    	let current;

    	button = new Button({
    			props: {
    				text: "new color",
    				onClick: /*handleRandomColor*/ ctx[1]
    			},
    			$$inline: true
    		});

    	buttonchain = new ButtonChain({
    			props: {
    				handleSelectOption: /*handleSelectOption*/ ctx[0],
    				selectedOption: /*selected*/ ctx[3]
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
    			t2 = text(/*error*/ ctx[2]);
    			t3 = space();
    			create_component(button.$$.fragment);
    			t4 = space();
    			create_component(buttonchain.$$.fragment);
    			attr_dev(h3, "class", "text-xl");
    			add_location(h3, file$3, 11, 2, 380);
    			add_location(span, file$3, 13, 4, 449);
    			attr_dev(div0, "class", "h-8");
    			add_location(div0, file$3, 12, 2, 427);
    			attr_dev(div1, "class", "flex-1 flex flex-col items-center justify-center p-2 ");
    			add_location(div1, file$3, 10, 0, 310);
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
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*error*/ 4) set_data_dev(t2, /*error*/ ctx[2]);
    			const button_changes = {};
    			if (dirty & /*handleRandomColor*/ 2) button_changes.onClick = /*handleRandomColor*/ ctx[1];
    			button.$set(button_changes);
    			const buttonchain_changes = {};
    			if (dirty & /*handleSelectOption*/ 1) buttonchain_changes.handleSelectOption = /*handleSelectOption*/ ctx[0];
    			if (dirty & /*selected*/ 8) buttonchain_changes.selectedOption = /*selected*/ ctx[3];
    			buttonchain.$set(buttonchain_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(buttonchain.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(buttonchain.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    			destroy_component(buttonchain);
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
    	let { handleSelectOption } = $$props;
    	let { handleRandomColor } = $$props;
    	let { error = '' } = $$props;
    	let { selected } = $$props;
    	const writable_props = ['handleSelectOption', 'handleRandomColor', 'error', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('handleSelectOption' in $$props) $$invalidate(0, handleSelectOption = $$props.handleSelectOption);
    		if ('handleRandomColor' in $$props) $$invalidate(1, handleRandomColor = $$props.handleRandomColor);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		ButtonChain,
    		handleSelectOption,
    		handleRandomColor,
    		error,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('handleSelectOption' in $$props) $$invalidate(0, handleSelectOption = $$props.handleSelectOption);
    		if ('handleRandomColor' in $$props) $$invalidate(1, handleRandomColor = $$props.handleRandomColor);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleSelectOption, handleRandomColor, error, selected];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			handleSelectOption: 0,
    			handleRandomColor: 1,
    			error: 2,
    			selected: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleSelectOption*/ ctx[0] === undefined && !('handleSelectOption' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleSelectOption'");
    		}

    		if (/*handleRandomColor*/ ctx[1] === undefined && !('handleRandomColor' in props)) {
    			console.warn("<Controls> was created without expected prop 'handleRandomColor'");
    		}

    		if (/*selected*/ ctx[3] === undefined && !('selected' in props)) {
    			console.warn("<Controls> was created without expected prop 'selected'");
    		}
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
        return Object.assign(Object.assign({}, color), { [property]: color[property] + increment });
    }

    function getFilledSquares(squares, color, options) {
        const filled = [];
        function fillSquare(square, color) {
            return Object.assign(Object.assign({}, square), { color: getPropertyIncrement(color, options.property) });
        }
        squares.forEach((sq, i) => {
            if (filled.length) {
                filled.push(fillSquare(sq, filled[filled.length - 1].color));
            }
            else {
                filled.push(fillSquare(sq, color));
            }
        });
        return filled;
    }

    const KEY = 'Base Color and User Option Data';
    function getData() {
        const { base, options } = JSON.parse(localStorage.getItem(KEY));
        return { base, options };
    }
    function updateData({ base, options }) {
        localStorage.setItem(KEY, JSON.stringify({ base, options }));
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

    // (13:4) {#each squares as { x, y, height, width, color }}
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

    			add_location(rect, file$2, 13, 6, 370);
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
    		source: "(13:4) {#each squares as { x, y, height, width, color }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
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
    			add_location(svg, file$2, 6, 2, 163);
    			attr_dev(div, "class", "flex justify-center my-2");
    			add_location(div, file$2, 5, 0, 122);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let t0;
    	let t1_value = getColorString(/*color*/ ctx[0]) + "";
    	let t1;
    	let t2;
    	let div0;
    	let svg;
    	let rect;
    	let rect_fill_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			t0 = text("Current color is ");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			attr_dev(h3, "class", "text-gray-400 text-center");
    			add_location(h3, file$1, 5, 2, 172);
    			attr_dev(rect, "height", 30);
    			attr_dev(rect, "width", 30);
    			attr_dev(rect, "fill", rect_fill_value = getColorString(/*color*/ ctx[0]));
    			add_location(rect, file$1, 15, 6, 401);
    			attr_dev(svg, "class", "mx-2 flex-1 block");
    			attr_dev(svg, "width", 30);
    			attr_dev(svg, "height", 30);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 9, 4, 276);
    			add_location(div0, file$1, 8, 2, 266);
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
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1 && t1_value !== (t1_value = getColorString(/*color*/ ctx[0]) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*color*/ 1 && rect_fill_value !== (rect_fill_value = getColorString(/*color*/ ctx[0]))) {
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

    function create_fragment(ctx) {
    	let main;
    	let title;
    	let t0;
    	let div1;
    	let div0;
    	let colortitle;
    	let t1;
    	let square;
    	let t2;
    	let controls;
    	let current;
    	title = new Title({ $$inline: true });

    	colortitle = new ColorTitle({
    			props: { color: /*current*/ ctx[2] },
    			$$inline: true
    		});

    	square = new Square({
    			props: {
    				squares: /*filledSquares*/ ctx[1],
    				handleSelectColor: /*handleSelectColor*/ ctx[3]
    			},
    			$$inline: true
    		});

    	controls = new Controls({
    			props: {
    				handleRandomColor: /*handleRandomColor*/ ctx[5],
    				handleSelectOption: /*handleSelectOption*/ ctx[4],
    				selected: /*options*/ ctx[0].property
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(colortitle.$$.fragment);
    			t1 = space();
    			create_component(square.$$.fragment);
    			t2 = space();
    			create_component(controls.$$.fragment);
    			attr_dev(div0, "class", "flex flex-col w-full items-center justify-center flex-1");
    			add_location(div0, file, 41, 4, 1404);
    			attr_dev(div1, "class", "w-full h-full p-2 flex flex-col items-center justify-evenly md:p-4 lg:p-6 lg:flex-row");
    			add_location(div1, file, 38, 2, 1293);
    			attr_dev(main, "class", "flex flex-col items-center h-screen");
    			add_location(main, file, 36, 0, 1228);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title, main, null);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			mount_component(colortitle, div0, null);
    			append_dev(div0, t1);
    			mount_component(square, div0, null);
    			append_dev(div1, t2);
    			mount_component(controls, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const colortitle_changes = {};
    			if (dirty & /*current*/ 4) colortitle_changes.color = /*current*/ ctx[2];
    			colortitle.$set(colortitle_changes);
    			const square_changes = {};
    			if (dirty & /*filledSquares*/ 2) square_changes.squares = /*filledSquares*/ ctx[1];
    			square.$set(square_changes);
    			const controls_changes = {};
    			if (dirty & /*options*/ 1) controls_changes.selected = /*options*/ ctx[0].property;
    			controls.$set(controls_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(colortitle.$$.fragment, local);
    			transition_in(square.$$.fragment, local);
    			transition_in(controls.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(colortitle.$$.fragment, local);
    			transition_out(square.$$.fragment, local);
    			transition_out(controls.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title);
    			destroy_component(colortitle);
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
    	let squares;
    	let filledSquares;
    	let current;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { base = getRandomColor() } = $$props;
    	let { options = { width: 300, step: 50, property: 'hue' } } = $$props;

    	onMount(() => {
    		const data = getData();

    		if ((data === null || data === void 0 ? void 0 : data.base) && (data === null || data === void 0 ? void 0 : data.options)) {
    			$$invalidate(6, base = data.base);
    			$$invalidate(0, options = data.options);
    		}
    	});

    	afterUpdate(() => {
    		updateData({ base, options });
    	});

    	function handleSelectColor(color) {
    		$$invalidate(2, current = color);
    	}

    	function handleSelectOption(prop) {
    		$$invalidate(0, options = Object.assign(Object.assign({}, options), { property: prop }));
    	}

    	function handleRandomColor() {
    		$$invalidate(6, base = getRandomColor());
    	}

    	const writable_props = ['base', 'options'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('base' in $$props) $$invalidate(6, base = $$props.base);
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		Title,
    		Controls,
    		Square,
    		ColorTitle,
    		getSquareDimensions,
    		getRandomColor,
    		getFilledSquares,
    		getData,
    		updateData,
    		afterUpdate,
    		onMount,
    		base,
    		options,
    		handleSelectColor,
    		handleSelectOption,
    		handleRandomColor,
    		current,
    		filledSquares,
    		squares
    	});

    	$$self.$inject_state = $$props => {
    		if ('base' in $$props) $$invalidate(6, base = $$props.base);
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('current' in $$props) $$invalidate(2, current = $$props.current);
    		if ('filledSquares' in $$props) $$invalidate(1, filledSquares = $$props.filledSquares);
    		if ('squares' in $$props) $$invalidate(7, squares = $$props.squares);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options*/ 1) {
    			$$invalidate(7, squares = getSquareDimensions(options.width, options.step));
    		}

    		if ($$self.$$.dirty & /*squares, base, options*/ 193) {
    			$$invalidate(1, filledSquares = getFilledSquares(squares, base, options));
    		}

    		if ($$self.$$.dirty & /*filledSquares*/ 2) {
    			$$invalidate(2, current = filledSquares[0].color); // Selected color at top of screen
    		}
    	};

    	return [
    		options,
    		filledSquares,
    		current,
    		handleSelectColor,
    		handleSelectOption,
    		handleRandomColor,
    		base,
    		squares
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { base: 6, options: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get base() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set base(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
