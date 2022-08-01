let ReSourceCache = [
    {
        name: "Jazz-UI-TO",
        options: [
            {
                origin: "https://se-t-static.energymost.com/pft/jazz-ui/webui/.+?/",
                target: "http://localhost:3000/",
                checked: true
            }
        ]
    }
];
let typeMap = {
    "txt": "text/plain",
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "json": "text/json",
    "xml": "text/xml",
    "jpg": "image/jpeg",
    "gif": "image/gif",
    "png": "image/png",
    "webp": "image/webp"
}

function updateLocalStorage() {
    if (window.localStorage.ReSourceCache) {
        ReSourceCache = JSON.parse(window.localStorage.ReSourceCache);
        return;
    }
    window.localStorage.ReSourceCache = JSON.stringify(ReSourceCache);
}

function getLocalFileUrl(url) {
    var arr = url.split('.');
    var type = arr[arr.length - 1];
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, false);
    xhr.send(null);
    var content = xhr.responseText || xhr.responseXML;
    if (!content) {
        return false;
    }
    content = encodeURIComponent(
        type === 'js' ?
            content.replace(/[\u0080-\uffff]/g, function ($0) {
                var str = $0.charCodeAt(0).toString(16);
                return "\\u" + '00000'.substr(0, 4 - str.length) + str;
            }) : content
    );
    return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content);
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    let url = details.url;
    for (let i = 0, len = ReSourceCache.length; i < len; i++) {
        const sources = ReSourceCache[i].options;
        for (let i = 0, len = sources.length; i < len; i++) {
            const reg = new RegExp(sources[i].origin, 'gi');
            if (sources[i].checked && typeof sources[i].target === 'string' && reg.test(url)) {
                if (!/^file:\/\//.test(sources[i].target)) {
                    do {
                        url = url.replace(reg, sources[i].target);
                    } while (reg.test(url))
                } else {
                    do {
                        url = getLocalFileUrl(url.replace(reg, sources[i].target));
                    } while (reg.test(url))
                }
            }
        }
    }
    return url === details.url ? {} : { redirectUrl: url };
},
    { urls: ["<all_urls>"] },
    ["blocking"]
);

updateLocalStorage();
window.addEventListener('storage', updateLocalStorage, false);

