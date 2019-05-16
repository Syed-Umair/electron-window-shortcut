/**
 * Register Shortcut Accelerators
 * Unregister Shortcut Accelerators
 * Attach key event listener to electron Browser Window
 */

const isValidAccelerator = require("electron-is-accelerator");
const {toKeyEvent} = require('keyboardevent-from-electron-accelerator');
const keyEventsAreEqual = require('keyboardevents-areequal');

const acceleratorKeyEventMap = new Map();
const acceleratorCallbackMap = new Map();
const webContentsMap = new Map();

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

const toStandardKeyEvent = (input) => {
	const standardKeyEvent = {
		code: input.code,
		key: input.key
	};

	['alt', 'shift', 'meta'].forEach(prop => {
		if (typeof input[prop] !== 'undefined') {
			standardKeyEvent[`${prop}Key`] = input[prop];
		}
	});

	if (typeof input.control !== 'undefined') {
		standardKeyEvent.ctrlKey = input.control;
	}

	return standardKeyEvent;
};

const handleCallback = (accelerator, event) => {
    if(acceleratorCallbackMap.has(accelerator)) {
        let cb = acceleratorCallbackMap.get(accelerator);
        cb(event);
    }
};

const inputEventHandler = (event, input) => {
    if (input.type === 'keyUp') {
        return;
    }
    let keyEvent = toStandardKeyEvent(input);
    acceleratorKeyEventMap.forEach((acceleratorKeyEvent, accelerator) => {
        if(keyEventsAreEqual(keyEvent, acceleratorKeyEvent)) {
            handleCallback(accelerator, event);
            return;
        }
    });
};

const register = (accelerator, cb) => {
    if (Array.isArray(accelerator)){
        accelerator.forEach(accelerator => register(accelerator, cb));
        return;
    }
    if(isValidAccelerator(accelerator) && typeof cb === 'function') {
        cb = debounce(cb, 300);
        acceleratorKeyEventMap.set(accelerator, toKeyEvent(accelerator));
        acceleratorCallbackMap.set(accelerator, cb);
    }
};

const unregister = (accelerator) => {
    if(isValidAccelerator(accelerator)) {
        acceleratorKeyEventMap.delete(accelerator);
        acceleratorCallbackMap.delete(accelerator);
    }
};

const attachToWebContent = (webContents) => {
    let pid = webContents.getOSProcessId();
    if (webContents && !webContentsMap.has(pid)) {
        webContentsMap.set(pid, Date.now());
        webContents.on('before-input-event', inputEventHandler);
    }
};

module.exports = {
    register,
    unregister,
    attachToWebContent
};
