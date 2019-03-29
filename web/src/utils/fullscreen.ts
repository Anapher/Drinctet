// Source: https://github.com/vasilevich/react-fullscreen-crossbrowser (MIT)

const key: any = {
    fullscreenEnabled: 0,
    fullscreenElement: 1,
    requestFullscreen: 2,
    exitFullscreen: 3,
    fullscreenchange: 4,
    fullscreenerror: 5,
};

const webkit = [
    "webkitFullscreenEnabled",
    "webkitFullscreenElement",
    "webkitRequestFullscreen",
    "webkitExitFullscreen",
    "webkitfullscreenchange",
    "webkitfullscreenerror",
];

const moz = [
    "mozFullScreenEnabled",
    "mozFullScreenElement",
    "mozRequestFullScreen",
    "mozCancelFullScreen",
    "mozfullscreenchange",
    "mozfullscreenerror",
];

const ms = [
    "msFullscreenEnabled",
    "msFullscreenElement",
    "msRequestFullscreen",
    "msExitFullscreen",
    "MSFullscreenChange",
    "MSFullscreenError",
];

// so it doesn't throw if no window or document
const document: any =
    typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};

const vendor =
    ("fullscreenEnabled" in document && Object.keys(key)) ||
    (webkit[0] in document && webkit) ||
    (moz[0] in document && moz) ||
    (ms[0] in document && ms) ||
    [];

export default class Fullscreen {
    static requestFullscreen(element: any) {
        return element[vendor[key.requestFullscreen]]();
    }
    static requestFullscreenFunction(element: any) {
        return element[vendor[key.requestFullscreen]];
    }
    static get exitFullscreen() {
        return document[vendor[key.exitFullscreen]].bind(document);
    };
    static addEventListener(type: any, handler: any, options: any) {
        return document.addEventListener(vendor[key[type]], handler, options);
    }
    static removeEventListener(type: any, handler: any, options: any) {
        return document.removeEventListener(vendor[key[type]], handler, options);
    }
    static get fullscreenEnabled() {
        return Boolean(document[vendor[key.fullscreenEnabled]]);
    }
    static get fullscreenElement() {
        return document[vendor[key.fullscreenElement]];
    }
    static get onfullscreenchange() {
        return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()];
    }
    static set onfullscreenchange(handler) {
        document[`on${vendor[key.fullscreenchange]}`.toLowerCase()] = handler;
    }
    static get onfullscreenerror() {
        return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()];
    }
    static set onfullscreenerror(handler) {
        document[`on${vendor[key.fullscreenerror]}`.toLowerCase()] = handler;
    }
}
