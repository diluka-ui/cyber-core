// =====================================================
// CYBER CORE SERVICE WORKER
// PWA OFFLINE APP SHELL
// =====================================================

const CACHE_NAME = "cyber-core-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./favicon.png"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", function (event) {

    event.waitUntil(

        caches.open(CACHE_NAME).then(function (cache) {

            return cache.addAll(APP_FILES);

        })

    );

    self.skipWaiting();

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys().then(function (cacheNames) {

            return Promise.all(

                cacheNames.map(function (cacheName) {

                    if (
                        cacheName !== CACHE_NAME &&
                        cacheName.startsWith("cyber-core-")
                    ) {

                        return caches.delete(cacheName);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", function (event) {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request).then(function (cachedResponse) {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch(function () {

                return caches.match("./index.html");

            });

        })

    );

});