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

export const register = (accelerator, cb) => {
    if(isValidAccelerator(accelerator) && typeof cb === 'function') {
        acceleratorKeyEventMap.set(accelerator, toKeyEvent(accelerator));
        acceleratorCallbackMap.set(accelerator, cb);
    }
};

export const unregister = (accelerator) => {
    if(isValidAccelerator(accelerator)) {
        acceleratorKeyEventMap.delete(accelerator);
        acceleratorCallbackMap.delete(accelerator);
    }
};

export const attachToWindow = (win) => {
    if (win.webContents) {
        win.webContents.on('before-input-event', inputEventHandler);
    }
};

module.exports = {
    register,
    unregister,
    attachToWindow
};