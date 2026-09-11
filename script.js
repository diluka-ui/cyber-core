// @ts-nocheck
"use strict";

/* =====================================================
   CYBER CORE - SUPABASE VERSION
   Rewired to match the actual HTML structure.
===================================================== */

/* =====================================================
   SUPABASE CONFIG
===================================================== */

var SUPABASE_URL = "https://zlysjkpstaushfjgnvxi.supabase.co";
var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_45K-dyeWhUXpjOioTgPw_A_7R-t1gKu";
var supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === "function") {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
}

/* =====================================================
   CONFIG
===================================================== */

var STORAGE_BUCKET = "cyber-files";
var MAX_ACCOUNTS = 5;

var USER_STORAGE_LIMIT_GB = 1.4;
var USER_STORAGE_LIMIT_BYTES = USER_STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

var CLOUDINARY_CLOUD_NAME = "am04nwhi";
var CLOUDINARY_UPLOAD_PRESET = "cyber_core_upload";
var CLOUDINARY_FOLDER = "cyber-core";

var B2_FUNCTION_UPLOAD = "b2-video-upload";
var B2_FUNCTION_DELETE = "b2-video-delete";
var B2_ENDPOINT = "s3.us-east-005.backblazeb2.com";
var B2_BUCKET_NAME = "cyber-core-videos";

var OAUTH_REDIRECT_URL = "https://diluka-ui.github.io/cyber-core/";

var HCAPTCHA_SITEKEY = "9a4e0fdc-a874-44fa-bc64-3880526246ea";
var HCAPTCHA_VERIFY_FUNCTION = "verify-hcaptcha";

var hcaptchaRegisterWidgetId = null;
var hcaptchaLoginWidgetId = null;
var hcaptchaWidgetsRendered = false;

/* LOCATION TRACKING CONFIG */
var IPAPI_URL = "https://ipapi.co/json/";

/* =====================================================
   HCAPTCHA HELPERS
===================================================== */

function isHCaptchaReady() {
    return typeof window.hcaptcha !== "undefined" && window.hcaptcha !== null;
}

function renderHCaptchaWidgets() {
    if (hcaptchaWidgetsRendered || !isHCaptchaReady()) return;

    var registerContainer = document.getElementById("hcaptchaRegisterContainer");
    var loginContainer = document.getElementById("hcaptchaLoginContainer");

    try {
        if (registerContainer) {
            hcaptchaRegisterWidgetId = window.hcaptcha.render(registerContainer, { sitekey: HCAPTCHA_SITEKEY, size: "invisible" });
        }
        if (loginContainer) {
            hcaptchaLoginWidgetId = window.hcaptcha.render(loginContainer, { sitekey: HCAPTCHA_SITEKEY, size: "invisible" });
        }
        hcaptchaWidgetsRendered = true;
    } catch (error) {
        console.log("hCaptcha render error:", error);
    }
}

function waitForHCaptchaAndRender(retries) {
    if (isHCaptchaReady()) { renderHCaptchaWidgets(); return; }
    if (retries <= 0) { console.log("hCaptcha library did not load in time."); return; }
    setTimeout(function () { waitForHCaptchaAndRender(retries - 1); }, 300);
}

async function runHCaptcha(widgetId) {
    if (!isHCaptchaReady() || widgetId === null || widgetId === undefined) return "";
    var token = "";
    try {
        var result = await window.hcaptcha.execute(widgetId, { async: true });
        token = result && result.response ? result.response : "";
    } catch (error) {
        console.log("hCaptcha execute error:", error);
        token = "";
    } finally {
        try { window.hcaptcha.reset(widgetId); } catch (resetError) { console.log("hCaptcha reset error:", resetError); }
    }
    return token;
}

async function verifyHCaptchaToken(token) {
    if (!token || !supabaseClient) return false;
    try {
        var result = await supabaseClient.functions.invoke(HCAPTCHA_VERIFY_FUNCTION, { body: { token: token } });
        if (result.error) { console.log("hCaptcha verify function error:", result.error.message); return false; }
        var data = result.data || {};
        return data.success === true;
    } catch (error) {
        console.log("hCaptcha verify error:", error);
        return false;
    }
}

/* =====================================================
   STATE
===================================================== */

var generatedOTP = "";
var countdown = null;
var timeLeft = 60;
var verifiedEmail = "";
var verifiedPhone = "";
var currentUser = null;
var currentProfile = null;
var currentAccountEmail = "";
var currentAccountPhone = "";
var googleOAuthLogin = false;
var githubOAuthLogin = false;
var oauthHandling = false;
var securityCenterInitialized = false;
var locationConsentPendingUserId = null;

/* =====================================================
   ELEMENTS — matched to the actual HTML
===================================================== */

var container = document.querySelector(".container");

var registerBox = document.getElementById("registerBox");
var email = document.getElementById("email");
var phone = document.getElementById("phone");
var locationConsentCheckbox = document.getElementById("locationConsent");
var sendBtn = document.getElementById("sendBtn");

var otpBox = document.getElementById("otpBox");
var timer = document.getElementById("timer");
var otpInputs = document.querySelectorAll(".otp-digit");
var verifyBtn = document.getElementById("verifyBtn");

var passwordBox = document.getElementById("passwordBox");
var newPassword = document.getElementById("newPassword");
var confirmPassword = document.getElementById("confirmPassword");
var savePasswordBtn = document.getElementById("savePasswordBtn");

var loginBox = document.getElementById("loginBox");
var loginEmail = document.getElementById("loginEmail");
var loginPhone = document.getElementById("loginPhone");
var loginPassword = document.getElementById("loginPassword");
var loginBtn = document.getElementById("loginBtn");

var googleLoginBtn = document.getElementById("googleLoginBtn");
var githubLoginBtn = document.getElementById("githubLoginBtn");
var createAccountBtn = document.getElementById("createAccountBtn");

var message = document.getElementById("message");

var dashboard = document.getElementById("dashboard");
var securityMenuButton = document.getElementById("securityMenuButton");

/* LOCATION CONSENT MODAL */
var locationConsentOverlay = document.getElementById("locationConsentOverlay");
var consentAcceptBtn = document.getElementById("consentAcceptBtn");
var consentDeclineBtn = document.getElementById("consentDeclineBtn");

/* HOME PAGE */
var homeLoginHistory = document.getElementById("homeLoginHistory");
var loginHistoryEmpty = document.getElementById("loginHistoryEmpty");
var loginHistoryToggleBtn = document.getElementById("loginHistoryToggleBtn");
var loginHistoryPanel = document.getElementById("loginHistoryPanel");
var loginHistoryArrow = document.getElementById("loginHistoryArrow");
var clearHistoryBtn = document.getElementById("clearHistoryBtn");

var changePasswordToggleBtn = document.getElementById("changePasswordToggleBtn");
var changePasswordPanel = document.getElementById("changePasswordPanel");
var changePasswordArrow = document.getElementById("changePasswordArrow");
var currentPasswordField = document.getElementById("currentPasswordField");
var newPasswordField = document.getElementById("newPasswordField");
var confirmNewPasswordField = document.getElementById("confirmNewPasswordField");
var savePasswordChangeBtn = document.getElementById("savePasswordChangeBtn");
var changePasswordHomeMessage = document.getElementById("changePasswordHomeMessage");

var storageUsed = document.getElementById("storageUsed");
var storageProgress = document.getElementById("storageProgress");
var storageDetails = document.getElementById("storageDetails");

/* ADD PAGE */
var securityFileInput = document.getElementById("securityFileInput");
var selectedFileName = document.getElementById("selectedFileName");
var securityFileTitle = document.getElementById("securityFileTitle");
var securityFileCategory = document.getElementById("securityFileCategory");
var securityAddFileBtn = document.getElementById("securityAddFileBtn");
var securityAddMessage = document.getElementById("securityAddMessage");
var securityItemsList = document.getElementById("securityItemsList");

/* SEARCH PAGE */
var searchQueryInput = document.getElementById("searchQueryInput");
var searchResultsList = document.getElementById("searchResultsList");
var searchEmptyMessage = document.getElementById("searchEmptyMessage");
var allSecurityItemsCache = [];

/* PROFILE PAGE */
var profileDisplayName = document.getElementById("profileDisplayName");
var profileDisplayEmail = document.getElementById("profileDisplayEmail");
var profileDisplayPhone = document.getElementById("profileDisplayPhone");
var profilePicture = document.getElementById("profilePicture");
var profilePicturePlaceholder = document.getElementById("profilePicturePlaceholder");
var profilePictureInput = document.getElementById("profilePictureInput");
var profileNameInput = document.getElementById("profileNameInput");
var profileBirthdayInput = document.getElementById("profileBirthdayInput");
var profileBioInput = document.getElementById("profileBioInput");
var saveProfileBtn = document.getElementById("saveProfileBtn");
var profileMessage = document.getElementById("profileMessage");
var accountList = document.getElementById("accountList");
var addAccountProfileBtn = document.getElementById("addAccountProfileBtn");

/* SETTINGS PAGE */
var settingsChangePasswordBtn = document.getElementById("settingsChangePasswordBtn");
var logoutBtn = document.getElementById("logoutBtn");
var removeAccountBtn = document.getElementById("removeAccountBtn");
var removeAccountMessage = document.getElementById("removeAccountMessage");

/* SECURITY PAGE (in-dashboard tab) */
var securityAccountStatus = document.getElementById("securityAccountStatus");
var securityActivityList = document.getElementById("securityActivityList");

/* SECURITY CENTER (slide-out panel) */
var securityCenterOverlay = document.getElementById("securityCenterOverlay");
var securityCenterPanel = document.getElementById("securityCenterPanel");
var securityCenterClose = document.getElementById("securityCenterClose");
var securityStatusAccount = document.getElementById("securityStatusAccount");
var securityStatusSession = document.getElementById("securityStatusSession");
var securityStatusStorage = document.getElementById("securityStatusStorage");
var securityCenterActivity = document.getElementById("securityCenterActivity");
var securityCenterActivityEmpty = document.getElementById("securityCenterActivityEmpty");
var securityRefreshBtn = document.getElementById("securityRefreshBtn");
var securityLogoutBtn = document.getElementById("securityLogoutBtn");
var securityCenterMessage = document.getElementById("securityCenterMessage");

/* =====================================================
   REMEMBERED ACCOUNTS (localStorage)
===================================================== */

function getRememberedAccounts() {
    var saved = localStorage.getItem("cyberCoreAccounts");
    if (!saved) return [];
    try {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
    } catch (error) {
        localStorage.removeItem("cyberCoreAccounts");
    }
    return [];
}

function saveRememberedAccounts(accounts) {
    localStorage.setItem("cyberCoreAccounts", JSON.stringify(accounts));
}

function rememberAccount(userEmail, userPhone) {
    if (!userEmail) return;
    var accounts = getRememberedAccounts();
    var found = false;

    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i] && accounts[i].email && accounts[i].email.toLowerCase() === userEmail.toLowerCase()) {
            accounts[i].phone = userPhone || accounts[i].phone || "";
            found = true;
            break;
        }
    }

    if (!found) accounts.push({ email: userEmail, phone: userPhone || "" });
    if (accounts.length > MAX_ACCOUNTS) accounts = accounts.slice(accounts.length - MAX_ACCOUNTS);

    saveRememberedAccounts(accounts);
}

function removeRememberedAccount(userEmail) {
    if (!userEmail) return;
    var accounts = getRememberedAccounts();
    var filtered = accounts.filter(function (a) {
        return !(a && a.email && a.email.toLowerCase() === userEmail.toLowerCase());
    });
    saveRememberedAccounts(filtered);
}

/* =====================================================
   LOGIN HISTORY (localStorage, per user)
===================================================== */

function historyKey() {
    if (!currentUser) return "";
    return "cyberCoreLoginHistory_" + currentUser.id;
}

function getLoginHistory() {
    var key = historyKey();
    if (key === "") return [];
    var saved = localStorage.getItem(key);
    if (!saved) return [];
    try {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
    } catch (error) {
        localStorage.removeItem(key);
    }
    return [];
}

function saveLoginHistory(history) {
    var key = historyKey();
    if (key === "") return;
    localStorage.setItem(key, JSON.stringify(history));
}

function addLoginHistory(accountEmail) {
    var history = getLoginHistory();
    var now = new Date();
    history.unshift({ email: accountEmail || "OAuth Account", date: now.toLocaleDateString(), time: now.toLocaleTimeString() });
    if (history.length > 20) history.length = 20;
    saveLoginHistory(history);
}

function displayLoginHistory() {
    if (!homeLoginHistory) return;
    var history = getLoginHistory();

    if (history.length === 0) {
        homeLoginHistory.innerHTML = "";
        if (loginHistoryEmpty) loginHistoryEmpty.style.display = "block";
        if (clearHistoryBtn) clearHistoryBtn.style.display = "none";
        return;
    }

    if (loginHistoryEmpty) loginHistoryEmpty.style.display = "none";
    if (clearHistoryBtn) clearHistoryBtn.style.display = "block";
    homeLoginHistory.innerHTML = "";

    for (var i = 0; i < history.length; i++) {
        var item = history[i];
        var row = document.createElement("div");
        row.className = "history-item";
        row.innerHTML =
            '<span class="history-number">#' + (i + 1) + "</span><br>" +
            "LOGIN SUCCESSFUL<br>" +
            "Email: " + escapeHTML(item.email) + "<br>" +
            escapeHTML(item.date) + " • " + escapeHTML(item.time);
        homeLoginHistory.appendChild(row);
    }
}

/* =====================================================
   LOCATION TRACKING (IP + GPS) WITH CONSENT
===================================================== */

function getPreciseLocation() {
    return new Promise(function (resolve) {
        if (!navigator.geolocation) { resolve(null); return; }
        navigator.geolocation.getCurrentPosition(
            function (position) {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            function () { resolve(null); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

async function getIPLocation() {
    try {
        var response = await fetch(IPAPI_URL);
        var data = await response.json();
        return {
            city: data.city || "",
            region: data.region || "",
            country: data.country_name || "",
            latitude: typeof data.latitude === "number" ? data.latitude : null,
            longitude: typeof data.longitude === "number" ? data.longitude : null
        };
    } catch (error) {
        console.log("IP location error:", error);
        return { city: "", region: "", country: "", latitude: null, longitude: null };
    }
}

async function saveLocationConsent(userId, consentGiven) {
    if (!supabaseClient || !userId) return;
    try {
        var existing = await supabaseClient.from("location_consents").select("id").eq("user_id", userId).maybeSingle();

        if (existing.data) {
            await supabaseClient.from("location_consents").update({
                consent_given: consentGiven,
                consent_date: new Date().toISOString()
            }).eq("user_id", userId);
        } else {
            await supabaseClient.from("location_consents").insert({
                user_id: userId,
                consent_given: consentGiven
            });
        }
    } catch (error) {
        console.log("Save location consent error:", error);
    }
}

async function getLocationConsent(userId) {
    if (!supabaseClient || !userId) return null;
    try {
        var result = await supabaseClient.from("location_consents").select("consent_given").eq("user_id", userId).maybeSingle();
        if (result.error || !result.data) return null;
        return result.data.consent_given === true;
    } catch (error) {
        console.log("Get location consent error:", error);
        return null;
    }
}

async function logLoginLocation(userId) {
    if (!supabaseClient || !userId) return;
    try {
        var consent = await getLocationConsent(userId);
        if (consent !== true) return;

        var ipLocation = await getIPLocation();
        var gpsLocation = await getPreciseLocation();

        await supabaseClient.from("login_locations").insert({
            user_id: userId,
            latitude: gpsLocation ? gpsLocation.latitude : ipLocation.latitude,
            longitude: gpsLocation ? gpsLocation.longitude : ipLocation.longitude,
            city: ipLocation.city,
            region: ipLocation.region,
            country: ipLocation.country,
            location_source: gpsLocation ? "gps" : "ip"
        });
    } catch (error) {
        console.log("Log login location error:", error);
    }
}

async function handleLocationConsentForUser(userId) {
    if (!supabaseClient || !userId) return;
    var consent = await getLocationConsent(userId);

    if (consent === null) {
        showLocationConsentModal(userId);
    } else if (consent === true) {
        await logLoginLocation(userId);
    }
}

function showLocationConsentModal(userId) {
    /* Safety guard: never show this over the login/register screen.
       It should only appear on top of the dashboard, after a
       successful login. */
    if (!dashboard || dashboard.style.display !== "block") return;
    locationConsentPendingUserId = userId;
    if (locationConsentOverlay) locationConsentOverlay.classList.add("show-consent-overlay");
}

function closeLocationConsentModal() {
    locationConsentPendingUserId = null;
    if (locationConsentOverlay) locationConsentOverlay.classList.remove("show-consent-overlay");
}

if (consentAcceptBtn) {
    consentAcceptBtn.onclick = async function () {
        var userId = locationConsentPendingUserId;
        closeLocationConsentModal();
        if (!userId) return;
        await saveLocationConsent(userId, true);
        await logLoginLocation(userId);
    };
}

if (consentDeclineBtn) {
    consentDeclineBtn.onclick = async function () {
        var userId = locationConsentPendingUserId;
        closeLocationConsentModal();
        if (!userId) return;
        await saveLocationConsent(userId, false);
    };
}

/* =====================================================
   STORAGE QUOTA TRACKING (localStorage ledger)
===================================================== */

function storageUsageKey() {
    if (!currentUser) return "";
    return "cyberCoreStorageUsage_" + currentUser.id;
}

function getTrackedStorageUsage() {
    var key = storageUsageKey();
    if (key === "") return 0;
    var saved = localStorage.getItem(key);
    if (!saved) return 0;
    var value = Number(saved);
    if (!isFinite(value) || value < 0) return 0;
    if (value > USER_STORAGE_LIMIT_BYTES) return USER_STORAGE_LIMIT_BYTES;
    return value;
}

function saveTrackedStorageUsage(bytes) {
    var key = storageUsageKey();
    if (key === "") return;
    var value = Number(bytes) || 0;
    if (value < 0) value = 0;
    if (value > USER_STORAGE_LIMIT_BYTES) value = USER_STORAGE_LIMIT_BYTES;
    localStorage.setItem(key, String(value));
}

function increaseTrackedStorageUsage(bytes) {
    var amount = Number(bytes) || 0;
    if (amount <= 0) return;
    saveTrackedStorageUsage(getTrackedStorageUsage() + amount);
}

function decreaseTrackedStorageUsage(bytes) {
    var amount = Number(bytes) || 0;
    if (amount <= 0) return;
    var updated = getTrackedStorageUsage() - amount;
    if (updated < 0) updated = 0;
    saveTrackedStorageUsage(updated);
}

function getRemainingStorageBytes() {
    var remaining = USER_STORAGE_LIMIT_BYTES - getTrackedStorageUsage();
    return remaining < 0 ? 0 : remaining;
}

function formatFileSize(bytes) {
    var b = Number(bytes) || 0;
    if (b <= 0) return "0 MB";
    var kb = 1024, mb = kb * 1024, gb = mb * 1024;
    if (b >= gb) return (b / gb).toFixed(2) + " GB";
    if (b >= mb) return (b / mb).toFixed(2) + " MB";
    if (b >= kb) return (b / kb).toFixed(2) + " KB";
    return b + " B";
}

/* PER-FILE SIZE LEDGER */

function storageFileLedgerKey() {
    if (!currentUser) return "";
    return "cyberCoreStorageFiles_" + currentUser.id;
}

function getStorageFileLedger() {
    var key = storageFileLedgerKey();
    if (key === "") return {};
    var saved = localStorage.getItem(key);
    if (!saved) return {};
    try {
        var parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch (error) {
        console.log("Storage ledger read error:", error);
    }
    return {};
}

function saveStorageFileLedger(ledger) {
    var key = storageFileLedgerKey();
    if (key === "") return;
    try { localStorage.setItem(key, JSON.stringify(ledger || {})); } catch (error) { console.log("Storage ledger save error:", error); }
}

function saveStorageFileSize(filePath, fileSize) {
    var key = String(filePath || "");
    if (key === "") return;
    var size = Number(fileSize) || 0;
    if (!isFinite(size) || size <= 0) return;
    var ledger = getStorageFileLedger();
    ledger[key] = size;
    saveStorageFileLedger(ledger);
}

function getStorageFileSize(filePath) {
    var key = String(filePath || "");
    if (key === "") return 0;
    var ledger = getStorageFileLedger();
    var size = Number(ledger[key]) || 0;
    return (!isFinite(size) || size <= 0) ? 0 : size;
}

function removeStorageFileSize(filePath) {
    var key = String(filePath || "");
    if (key === "") return 0;
    var ledger = getStorageFileLedger();
    var size = Number(ledger[key]) || 0;
    if (Object.prototype.hasOwnProperty.call(ledger, key)) {
        delete ledger[key];
        saveStorageFileLedger(ledger);
    }
    return (!isFinite(size) || size <= 0) ? 0 : size;
}

async function reconcileStorageUsage() {
    if (!supabaseClient || !currentUser) return;
    try {
        var result = await supabaseClient.from("security_items").select("file_path").eq("user_id", currentUser.id);
        if (result.error) { console.log("Storage reconciliation error:", result.error.message); return; }

        var items = result.data || [];
        var existingPaths = {};
        for (var i = 0; i < items.length; i++) {
            var path = items[i] && items[i].file_path ? String(items[i].file_path) : "";
            if (path !== "") existingPaths[path] = true;
        }

        var ledger = getStorageFileLedger();
        var cleanLedger = {};
        var totalBytes = 0;
        var keys = Object.keys(ledger);

        for (var j = 0; j < keys.length; j++) {
            var filePath = keys[j];
            var fileSize = Number(ledger[filePath]) || 0;
            if (existingPaths[filePath] && isFinite(fileSize) && fileSize > 0) {
                cleanLedger[filePath] = fileSize;
                totalBytes += fileSize;
            }
        }

        saveStorageFileLedger(cleanLedger);
        saveTrackedStorageUsage(totalBytes);
    } catch (error) {
        console.log("Storage reconciliation failed:", error);
    }
}

async function updateStorage() {
    if (!currentUser) return;
    await reconcileStorageUsage();
    var used = getTrackedStorageUsage();
    var pct = USER_STORAGE_LIMIT_BYTES > 0 ? Math.min(100, (used / USER_STORAGE_LIMIT_BYTES) * 100) : 0;

    if (storageUsed) storageUsed.textContent = formatFileSize(used);
    if (storageProgress) storageProgress.style.width = pct.toFixed(1) + "%";
    if (storageDetails) {
        storageDetails.textContent = formatFileSize(used) + " used of " + USER_STORAGE_LIMIT_GB + " GB limit (" + formatFileSize(getRemainingStorageBytes()) + " free)";
    }
}

/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

/* =====================================================
   AUTH SCREEN UI
===================================================== */

function showRegister() {
    clearInterval(countdown);
    if (container) container.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
    document.body.style.overflow = "";
    if (registerBox) registerBox.style.display = "block";
    if (otpBox) otpBox.style.display = "none";
    if (passwordBox) passwordBox.style.display = "none";
    if (loginBox) loginBox.style.display = "none";
}

function showOTP() {
    if (container) container.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
    if (registerBox) registerBox.style.display = "none";
    if (otpBox) otpBox.style.display = "block";
    if (passwordBox) passwordBox.style.display = "none";
    if (loginBox) loginBox.style.display = "none";
}

function showPassword() {
    if (container) container.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
    if (registerBox) registerBox.style.display = "none";
    if (otpBox) otpBox.style.display = "none";
    if (passwordBox) passwordBox.style.display = "block";
    if (loginBox) loginBox.style.display = "none";
}

function showLogin() {
    if (container) container.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
    document.body.style.overflow = "";
    if (registerBox) registerBox.style.display = "none";
    if (otpBox) otpBox.style.display = "none";
    if (passwordBox) passwordBox.style.display = "none";
    if (loginBox) loginBox.style.display = "block";
    closeSecurityCenter();
}

function resetRegistrationForm() {
    clearInterval(countdown);
    generatedOTP = "";
    verifiedEmail = "";
    verifiedPhone = "";
    if (email) email.value = "";
    if (phone) phone.value = "";
    if (newPassword) newPassword.value = "";
    if (confirmPassword) confirmPassword.value = "";
    if (locationConsentCheckbox) locationConsentCheckbox.checked = false;
    clearOTP();
    timeLeft = 60;
    if (timer) timer.textContent = "OTP expires in: 60s";
}

/* =====================================================
   OTP INPUTS
===================================================== */

function clearOTP() {
    for (var i = 0; i < otpInputs.length; i++) otpInputs[i].value = "";
}

function getEnteredOTP() {
    var result = "";
    for (var i = 0; i < otpInputs.length; i++) result += otpInputs[i].value;
    return result;
}

for (var otpIndex = 0; otpIndex < otpInputs.length; otpIndex++) {
    (function (currentIndex) {
        var currentBox = otpInputs[currentIndex];

        currentBox.oninput = function () {
            currentBox.value = currentBox.value.replace(/\D/g, "").slice(0, 1);
            if (currentBox.value !== "" && currentIndex < otpInputs.length - 1) {
                otpInputs[currentIndex + 1].focus();
            }
        };

        currentBox.onkeydown = function (event) {
            if (event.key === "Backspace" && currentBox.value === "" && currentIndex > 0) {
                otpInputs[currentIndex - 1].focus();
            }
        };
    })(otpIndex);
}

function startTimer() {
    clearInterval(countdown);
    timeLeft = 60;
    if (timer) timer.textContent = "OTP expires in: 60s";

    countdown = setInterval(function () {
        timeLeft--;
        if (timeLeft > 0 && timer) {
            timer.textContent = "OTP expires in: " + timeLeft + "s";
        }
        if (timeLeft <= 0) {
            clearInterval(countdown);
            generatedOTP = "";
            if (timer) timer.textContent = "OTP EXPIRED";
            if (message) message.textContent = "❌ OTP expired. Please request a new OTP.";
        }
    }, 1000);
}

/* =====================================================
   SEND OTP
===================================================== */

if (sendBtn) {
    sendBtn.onclick = async function () {
        var enteredEmail = email ? email.value.trim() : "";
        var enteredPhone = phone ? phone.value.trim() : "";
        var accounts = getRememberedAccounts();

        if (accounts.length >= MAX_ACCOUNTS) { message.textContent = "❌ Maximum 5 accounts allowed."; return; }
        if (enteredEmail === "") { message.textContent = "Please enter your Email❗"; return; }
        if (!enteredEmail.includes("@") || !enteredEmail.includes(".")) { message.textContent = "Please enter a valid Email❗"; return; }
        if (enteredPhone === "") { message.textContent = "Please enter your Phone Number❗"; return; }

        if (locationConsentCheckbox && !locationConsentCheckbox.checked) {
            message.textContent = "❌ Please agree to location tracking to create an account.";
            return;
        }

        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i] && accounts[i].email && accounts[i].email.toLowerCase() === enteredEmail.toLowerCase()) {
                message.textContent = "❌ This Email is already registered.";
                return;
            }
        }

        if (!supabaseClient) { message.textContent = "❌ Supabase could not be loaded."; return; }

        sendBtn.disabled = true;
        message.textContent = "Verifying security check...";

        var captchaToken = await runHCaptcha(hcaptchaRegisterWidgetId);
        if (!captchaToken) { sendBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        var captchaVerified = await verifyHCaptchaToken(captchaToken);
        if (!captchaVerified) { sendBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        var otpToSend = Math.floor(100000 + Math.random() * 900000).toString();
        message.textContent = "Sending OTP to your email...";

        try {
            var sendResult = await supabaseClient.functions.invoke("send-otp-email", { body: { email: enteredEmail, otp: otpToSend } });
            sendBtn.disabled = false;

            if (sendResult.error) { message.textContent = "❌ " + (sendResult.error.message || "Failed to send OTP."); return; }

            var sendData = sendResult.data || {};
            if (sendData.success === false) { message.textContent = "❌ " + (sendData.error || "Failed to send OTP."); return; }

            generatedOTP = otpToSend;
            verifiedEmail = enteredEmail;
            verifiedPhone = enteredPhone;

            clearOTP();
            showOTP();
            startTimer();

            if (otpInputs.length > 0) otpInputs[0].focus();
            message.textContent = "📧 OTP sent to " + enteredEmail + ". Please check your inbox.";
        } catch (error) {
            sendBtn.disabled = false;
            console.log("Send OTP error:", error);
            message.textContent = "❌ Failed to send OTP. Please try again.";
        }
    };
}

/* =====================================================
   VERIFY OTP
===================================================== */

if (verifyBtn) {
    verifyBtn.onclick = function () {
        var enteredOTP = getEnteredOTP();

        if (enteredOTP.length !== 6) { message.textContent = "Please enter all 6 OTP digits❗"; return; }
        if (generatedOTP === "") { message.textContent = "❌ OTP expired❗"; return; }

        if (enteredOTP === generatedOTP) {
            clearInterval(countdown);
            generatedOTP = "";
            showPassword();
            message.textContent = "✔️ OTP Verified! Create your password.";
            if (newPassword) newPassword.focus();
        } else {
            message.textContent = "❌ Incorrect OTP❗";
        }
    };
}

/* =====================================================
   CREATE PASSWORD (finish registration)
===================================================== */

if (savePasswordBtn) {
    savePasswordBtn.onclick = async function () {
        var pass = newPassword ? newPassword.value : "";
        var confirm = confirmPassword ? confirmPassword.value : "";

        if (pass === "") { message.textContent = "Please create a password❗"; return; }
        if (pass.length < 6) { message.textContent = "Password must be at least 6 characters❗"; return; }
        if (pass !== confirm) { message.textContent = "❌ Passwords do not match❗"; return; }
        if (verifiedEmail === "") { message.textContent = "❌ Registration session expired. Start again."; showRegister(); return; }
        if (!supabaseClient) { message.textContent = "❌ Supabase could not be loaded."; return; }

        savePasswordBtn.disabled = true;
        message.textContent = "Creating your account...";

        try {
            var signupResult = await supabaseClient.auth.signUp({
                email: verifiedEmail,
                password: pass,
                options: { data: { phone: verifiedPhone } }
            });

            if (signupResult.error) { savePasswordBtn.disabled = false; message.textContent = "❌ " + signupResult.error.message; return; }
            if (!signupResult.data.user) { savePasswordBtn.disabled = false; message.textContent = "❌ Account could not be created."; return; }

            /* Save location consent while the fresh session is still active */
            await saveLocationConsent(signupResult.data.user.id, true);

            rememberAccount(verifiedEmail, verifiedPhone);

            if (signupResult.data.session) { await supabaseClient.auth.signOut(); }

            currentUser = null;
            currentProfile = null;
            currentAccountEmail = "";
            currentAccountPhone = "";

            if (newPassword) newPassword.value = "";
            if (confirmPassword) confirmPassword.value = "";

            savePasswordBtn.disabled = false;

            if (loginEmail) loginEmail.value = verifiedEmail;
            if (loginPhone) loginPhone.value = verifiedPhone;
            if (loginPassword) loginPassword.value = "";

            verifiedEmail = "";
            verifiedPhone = "";
            generatedOTP = "";
            clearInterval(countdown);

            showLogin();
            message.textContent = "✔️ Account created successfully! Please LOGIN.";
        } catch (error) {
            savePasswordBtn.disabled = false;
            console.log("Signup error:", error);
            message.textContent = "❌ Account creation failed.";
        }
    };
}

/* =====================================================
   LOGIN
===================================================== */

if (loginBtn) {
    loginBtn.onclick = async function () {
        if (!supabaseClient) { message.textContent = "❌ Supabase could not be loaded."; return; }

        var enteredEmail = loginEmail ? loginEmail.value.trim() : "";
        var enteredPhone = loginPhone ? loginPhone.value.trim() : "";
        var enteredPassword = loginPassword ? loginPassword.value : "";

        if (enteredEmail === "") { message.textContent = "Please enter your Email❗"; return; }
        if (enteredPhone === "") { message.textContent = "Please enter your Phone Number❗"; return; }
        if (enteredPassword === "") { message.textContent = "Please enter your Password❗"; return; }

        loginBtn.disabled = true;
        message.textContent = "Verifying security check...";

        var captchaToken = await runHCaptcha(hcaptchaLoginWidgetId);
        if (!captchaToken) { loginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        var captchaVerified = await verifyHCaptchaToken(captchaToken);
        if (!captchaVerified) { loginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        message.textContent = "Checking account...";

        var loginResult = await supabaseClient.auth.signInWithPassword({ email: enteredEmail, password: enteredPassword });
        loginBtn.disabled = false;

        if (loginResult.error) { message.textContent = "❌ " + loginResult.error.message; return; }

        currentUser = loginResult.data.user;
        currentAccountEmail = enteredEmail;
        currentAccountPhone = enteredPhone;
        verifiedEmail = enteredEmail;
        verifiedPhone = enteredPhone;
        googleOAuthLogin = false;
        githubOAuthLogin = false;

        rememberAccount(enteredEmail, enteredPhone);
        await createOrUpdateProfile(currentUser, enteredPhone);
        addLoginHistory(enteredEmail);

        if (loginPassword) loginPassword.value = "";
        message.textContent = "✔️ LOGIN SUCCESSFUL❗";

        await showDashboard();

        handleLocationConsentForUser(currentUser.id);
    };
}

/* =====================================================
   CREATE NEW ACCOUNT (button on login screen)
===================================================== */

if (createAccountBtn) {
    createAccountBtn.onclick = function () {
        var accounts = getRememberedAccounts();
        if (accounts.length >= MAX_ACCOUNTS) { message.textContent = "❌ Maximum 5 accounts allowed."; return; }

        resetRegistrationForm();
        if (loginEmail) loginEmail.value = "";
        if (loginPhone) loginPhone.value = "";
        if (loginPassword) loginPassword.value = "";

        message.textContent = "Create your new account❗";
        showRegister();
    };
}

/* =====================================================
   OAUTH PROVIDER DETECTION
===================================================== */

function getOAuthProvider(user) {
    if (!user) return "";
    var metadata = user.app_metadata || {};
    var provider = metadata.provider || "";
    var providers = metadata.providers || [];

    if (provider === "google") return "google";
    if (provider === "github") return "github";
    if (Array.isArray(providers)) {
        if (providers.indexOf("google") !== -1) return "google";
        if (providers.indexOf("github") !== -1) return "github";
    }
    return "";
}

function isOAuthUser(user) { return getOAuthProvider(user) !== ""; }

function isOAuthCallback() {
    var hash = window.location.hash || "";
    var search = window.location.search || "";
    return hash.indexOf("access_token=") !== -1 || hash.indexOf("refresh_token=") !== -1 || search.indexOf("code=") !== -1;
}

function getOAuthOptions() {
    return { queryParams: { prompt: "select_account" }, redirectTo: OAUTH_REDIRECT_URL };
}

async function handleOAuthUser(user, provider) {
    if (!user || oauthHandling) return;
    oauthHandling = true;

    currentUser = user;
    currentAccountEmail = user.email || "";
    currentAccountPhone = "";
    verifiedEmail = currentAccountEmail;
    verifiedPhone = "";
    googleOAuthLogin = provider === "google";
    githubOAuthLogin = provider === "github";

    if (currentAccountEmail) rememberAccount(currentAccountEmail, "");

    await createOrUpdateProfile(currentUser, "");
    addLoginHistory(currentAccountEmail || provider.toUpperCase() + " ACCOUNT");

    if (loginEmail) loginEmail.value = currentAccountEmail;
    if (loginPhone) loginPhone.value = "";
    if (loginPassword) loginPassword.value = "";

    if (message) {
        message.textContent = provider === "google" ? "✔️ GOOGLE LOGIN SUCCESSFUL❗" : "✔️ GITHUB LOGIN SUCCESSFUL❗";
    }

    await showDashboard();

    handleLocationConsentForUser(user.id);

    oauthHandling = false;
}

if (googleLoginBtn) {
    googleLoginBtn.onclick = async function () {
        if (!supabaseClient) { message.textContent = "❌ Supabase could not be loaded."; return; }
        googleLoginBtn.disabled = true;
        if (githubLoginBtn) githubLoginBtn.disabled = true;
        message.textContent = "Verifying security check...";

        var token = await runHCaptcha(hcaptchaLoginWidgetId);
        if (!token) { googleLoginBtn.disabled = false; if (githubLoginBtn) githubLoginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        var verified = await verifyHCaptchaToken(token);
        if (!verified) { googleLoginBtn.disabled = false; if (githubLoginBtn) githubLoginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        message.textContent = "Opening Google...";

        try {
            var result = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: getOAuthOptions() });
            if (result.error) {
                googleLoginBtn.disabled = false;
                if (githubLoginBtn) githubLoginBtn.disabled = false;
                message.textContent = "❌ " + result.error.message;
            }
        } catch (error) {
            googleLoginBtn.disabled = false;
            if (githubLoginBtn) githubLoginBtn.disabled = false;
            message.textContent = "❌ Google login failed.";
            console.log("Google OAuth error:", error);
        }
    };
}

if (githubLoginBtn) {
    githubLoginBtn.onclick = async function () {
        if (!supabaseClient) { message.textContent = "❌ Supabase could not be loaded."; return; }
        githubLoginBtn.disabled = true;
        if (googleLoginBtn) googleLoginBtn.disabled = true;
        message.textContent = "Verifying security check...";

        var token = await runHCaptcha(hcaptchaLoginWidgetId);
        if (!token) { githubLoginBtn.disabled = false; if (googleLoginBtn) googleLoginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        var verified = await verifyHCaptchaToken(token);
        if (!verified) { githubLoginBtn.disabled = false; if (googleLoginBtn) googleLoginBtn.disabled = false; message.textContent = "❌ Security verification failed. Please try again."; return; }

        message.textContent = "Opening GitHub...";

        try {
            var result = await supabaseClient.auth.signInWithOAuth({ provider: "github", options: getOAuthOptions() });
            if (result.error) {
                githubLoginBtn.disabled = false;
                if (googleLoginBtn) googleLoginBtn.disabled = false;
                message.textContent = "❌ " + result.error.message;
            }
        } catch (error) {
            githubLoginBtn.disabled = false;
            if (googleLoginBtn) googleLoginBtn.disabled = false;
            message.textContent = "❌ GitHub login failed.";
            console.log("GitHub OAuth error:", error);
        }
    };
}

async function handleOAuthCallbackSession() {
    if (!supabaseClient || !isOAuthCallback()) return false;

    var waitCount = 0;
    var session = null;

    while (waitCount < 20) {
        var result = await supabaseClient.auth.getSession();
        if (result.data && result.data.session) { session = result.data.session; break; }
        await new Promise(function (resolve) { setTimeout(resolve, 250); });
        waitCount++;
    }

    if (!session || !session.user) return false;

    var provider = getOAuthProvider(session.user);
    if (provider !== "google" && provider !== "github") return false;

    if (provider === "google") { googleOAuthLogin = true; githubOAuthLogin = false; await handleOAuthUser(session.user, "google"); }
    else { githubOAuthLogin = true; googleOAuthLogin = false; await handleOAuthUser(session.user, "github"); }

    try { window.history.replaceState({}, document.title, OAUTH_REDIRECT_URL); }
    catch (error) { console.log("OAuth URL cleanup skipped:", error); }

    return true;
}

/* =====================================================
   PROFILE
===================================================== */

async function createOrUpdateProfile(user, userPhone) {
    if (!supabaseClient || !user) return null;

    var defaultUsername = "USER";
    if (user.user_metadata && user.user_metadata.full_name) defaultUsername = user.user_metadata.full_name;
    else if (user.user_metadata && user.user_metadata.name) defaultUsername = user.user_metadata.name;

    var result = await supabaseClient.from("profiles").select("id, username, birthday, phone, profile_picture").eq("id", user.id).maybeSingle();

    if (result.error) { console.log("Profile select error:", result.error.message); return null; }

    if (result.data) {
        if (userPhone && result.data.phone !== userPhone) {
            var updateResult = await supabaseClient.from("profiles").update({ phone: userPhone }).eq("id", user.id);
            if (updateResult.error) console.log("Phone update error:", updateResult.error.message);
        }
        currentProfile = result.data;
        return result.data;
    }

    var insertResult = await supabaseClient.from("profiles").insert({
        id: user.id, username: defaultUsername, phone: userPhone || "", birthday: null, profile_picture: null
    }).select("id, username, birthday, phone, profile_picture").single();

    if (insertResult.error) { console.log("Profile insert error:", insertResult.error.message); return null; }

    currentProfile = insertResult.data;
    return insertResult.data;
}

async function loadProfile() {
    if (!supabaseClient || !currentUser) return null;
    var result = await supabaseClient.from("profiles").select("id, username, birthday, phone, profile_picture").eq("id", currentUser.id).maybeSingle();
    if (result.error) { console.log("Profile load error:", result.error.message); return null; }
    currentProfile = result.data;
    return currentProfile;
}

/* Bio is optional and may not exist as a DB column — loaded/saved defensively so it never breaks the rest of the profile. */
async function loadProfileBio() {
    if (!supabaseClient || !currentUser) return "";
    try {
        var result = await supabaseClient.from("profiles").select("bio").eq("id", currentUser.id).maybeSingle();
        if (result.error || !result.data) return "";
        return result.data.bio || "";
    } catch (error) {
        return "";
    }
}

async function saveProfileBio(bioValue) {
    if (!supabaseClient || !currentUser) return;
    try {
        await supabaseClient.from("profiles").update({ bio: bioValue }).eq("id", currentUser.id);
    } catch (error) {
        console.log("Bio save skipped:", error);
    }
}

async function getProfilePictureURL(path) {
    if (!supabaseClient || !path) return "";
    var result = await supabaseClient.storage.from(STORAGE_BUCKET).createSignedUrl(path, 3600);
    if (result.error) { console.log("Signed URL error:", result.error.message); return ""; }
    return result.data && result.data.signedUrl ? result.data.signedUrl : "";
}

async function updateProfile() {
    if (!currentUser) return;

    var profile = await loadProfile();
    if (!profile) profile = await createOrUpdateProfile(currentUser, currentAccountPhone);

    if (!profile) { if (profileMessage) profileMessage.textContent = "⚠️ Profile data could not be loaded."; return; }

    currentProfile = profile;

    if (profileDisplayName) profileDisplayName.textContent = profile.username || "USER";
    if (profileDisplayEmail) profileDisplayEmail.textContent = currentUser.email || "-";
    if (profileDisplayPhone) profileDisplayPhone.textContent = profile.phone || currentAccountPhone || "-";

    if (profileNameInput) profileNameInput.value = profile.username || "";
    if (profileBirthdayInput) profileBirthdayInput.value = profile.birthday || "";
    if (profileBioInput) profileBioInput.value = await loadProfileBio();

    if (profile.profile_picture) {
        var pictureURL = await getProfilePictureURL(profile.profile_picture);
        if (pictureURL && profilePicture) {
            profilePicture.src = pictureURL;
            profilePicture.style.display = "block";
            if (profilePicturePlaceholder) profilePicturePlaceholder.style.display = "none";
        }
    } else {
        if (profilePicture) { profilePicture.src = ""; profilePicture.style.display = "none"; }
        if (profilePicturePlaceholder) profilePicturePlaceholder.style.display = "block";
    }
}

if (saveProfileBtn) {
    saveProfileBtn.onclick = async function () {
        if (!supabaseClient || !currentUser) return;

        var username = profileNameInput ? profileNameInput.value.trim() : "";
        var birthday = profileBirthdayInput ? profileBirthdayInput.value : "";
        var bio = profileBioInput ? profileBioInput.value.trim() : "";

        if (username === "") { profileMessage.textContent = "Please enter a name."; return; }
        if (username.length > 30) { profileMessage.textContent = "Name must be 30 characters or less."; return; }

        saveProfileBtn.disabled = true;
        profileMessage.textContent = "Saving...";

        var result = await supabaseClient.from("profiles").upsert({
            id: currentUser.id, username: username, birthday: birthday || null, phone: currentAccountPhone || ""
        }).select("id, username, birthday, phone, profile_picture").single();

        if (result.error) { saveProfileBtn.disabled = false; profileMessage.textContent = "❌ " + result.error.message; return; }

        currentProfile = result.data;
        await saveProfileBio(bio);
        await updateProfile();

        saveProfileBtn.disabled = false;
        profileMessage.textContent = "✔️ Profile updated successfully.";
    };
}

if (profilePictureInput) {
    profilePictureInput.onchange = async function () {
        var file = profilePictureInput.files[0];
        if (!file) return;
        if (!currentUser) { alert("Please login first."); return; }
        if (!file.type.startsWith("image/")) { alert("Please select an image."); return; }
        if (file.size > 5 * 1024 * 1024) { alert("Please select an image smaller than 5 MB."); return; }

        var extension = "jpg";
        if (file.type === "image/png") extension = "png";
        else if (file.type === "image/webp") extension = "webp";
        else if (file.type === "image/gif") extension = "gif";

        var path = currentUser.id + "/profile-picture." + extension;
        profileMessage.textContent = "Uploading profile picture...";

        var uploadResult = await supabaseClient.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true, contentType: file.type });
        if (uploadResult.error) { profileMessage.textContent = "❌ Upload failed: " + uploadResult.error.message; profilePictureInput.value = ""; return; }

        var updateResult = await supabaseClient.from("profiles").update({ profile_picture: path }).eq("id", currentUser.id);
        if (updateResult.error) { profileMessage.textContent = "❌ Picture saved, but profile update failed: " + updateResult.error.message; return; }

        profilePictureInput.value = "";
        await updateProfile();
        profileMessage.textContent = "✔️ Profile picture updated successfully.";
        await updateStorage();
    };
}

/* =====================================================
   ACCOUNTS (profile page list)
===================================================== */

function displayAccounts() {
    if (!accountList) return;
    var accounts = getRememberedAccounts();
    accountList.innerHTML = "";

    if (accounts.length === 0) { accountList.textContent = "No saved accounts."; return; }

    for (var i = 0; i < accounts.length; i++) {
        var account = accounts[i] || {};
        var item = document.createElement("div");
        item.className = "account-item";

        var info = document.createElement("div");
        info.className = "account-item-info";
        info.innerHTML =
            '<div class="account-item-name">' + escapeHTML(account.email || "ACCOUNT") + "</div>" +
            '<div class="account-item-email">' + escapeHTML(account.phone || "") + "</div>";
        item.appendChild(info);

        if (currentUser && currentUser.email && account.email && account.email.toLowerCase() === currentUser.email.toLowerCase()) {
            var current = document.createElement("div");
            current.className = "current-account-label";
            current.textContent = "CURRENT";
            item.appendChild(current);
        } else {
            var switchButton = document.createElement("button");
            switchButton.type = "button";
            switchButton.className = "account-switch-button";
            switchButton.textContent = "SWITCH";
            switchButton.onclick = createSwitchHandler(account);
            item.appendChild(switchButton);
        }

        accountList.appendChild(item);
    }
}

function createSwitchHandler(account) {
    return function () {
        if (!account.email) return;
        if (loginEmail) loginEmail.value = account.email;
        if (loginPhone) loginPhone.value = account.phone || "";
        if (loginPassword) loginPassword.value = "";
        showLogin();
        message.textContent = "Enter password for " + account.email + " to switch account.";
    };
}

if (addAccountProfileBtn) {
    addAccountProfileBtn.onclick = function () {
        var accounts = getRememberedAccounts();
        if (accounts.length >= MAX_ACCOUNTS) { alert("❌ Maximum 5 accounts allowed."); return; }
        resetRegistrationForm();
        if (loginEmail) loginEmail.value = "";
        if (loginPhone) loginPhone.value = "";
        if (loginPassword) loginPassword.value = "";
        showRegister();
        message.textContent = "➕ Add a new account.";
    };
}

/* =====================================================
   FILE TYPE HELPERS
===================================================== */

function isImageFilePath(pathValue) {
    if (!pathValue) return false;
    var cleanPath = String(pathValue).split("?")[0].split("#")[0].toLowerCase();
    var parts = cleanPath.split(".");
    var extension = parts.length > 1 ? parts[parts.length - 1] : "";
    var imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
    return imageExtensions.indexOf(extension) !== -1;
}

function isVideoFile(file) {
    return !!(file && file.type && file.type.indexOf("video/") === 0);
}

function isBackblazeB2FilePath(path) {
    return typeof path === "string" && (path.indexOf(B2_ENDPOINT) !== -1 || path.indexOf(B2_BUCKET_NAME) !== -1);
}

function isCloudinaryFilePath(path) {
    return typeof path === "string" && path.indexOf("cloudinary.com") !== -1;
}

function getB2ObjectKeyFromUrl(url) {
    if (!url) return "";
    var marker = B2_BUCKET_NAME + "/";
    var idx = url.indexOf(marker);
    if (idx === -1) return "";
    return url.substring(idx + marker.length).split("?")[0];
}

function createSafeFileName(name) {
    return String(name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createSafeUploadFile(file) {
    return file;
}

function setAddFileMessage(text, success) {
    if (!securityAddMessage) return;
    securityAddMessage.textContent = text;
    securityAddMessage.style.color = success ? "#00ff66" : "#ff5050";
}

/* =====================================================
   VIEW FILE
===================================================== */

async function viewSecurityItem(item, button) {
    if (!supabaseClient || !currentUser || !item || !item.file_path) return;

    var isImage = isImageFilePath(item.file_path);
    var isB2File = isBackblazeB2FilePath(item.file_path);
    var isCloudinaryFile = isCloudinaryFilePath(item.file_path);
    var viewWindow = null;

    if (isImage) {
        viewWindow = window.open("", "_blank");
        if (viewWindow) {
            viewWindow.document.write("<!DOCTYPE html><html><head><title>Loading...</title><style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;color:#00ff00;font-family:sans-serif;}</style></head><body>Loading...</body></html>");
        }
    }

    var originalText = button ? button.textContent : "VIEW";
    if (button) { button.disabled = true; button.textContent = "OPENING..."; }

    var signedUrl = "";

    if (isB2File || isCloudinaryFile) {
        signedUrl = item.file_path;
    } else {
        var result = await supabaseClient.storage.from(STORAGE_BUCKET).createSignedUrl(item.file_path, 3600);
        if (result.error) {
            if (button) { button.disabled = false; button.textContent = originalText; }
            if (viewWindow) viewWindow.close();
            alert("❌ File could not be opened: " + result.error.message);
            return;
        }
        signedUrl = result.data && result.data.signedUrl ? result.data.signedUrl : "";
    }

    if (button) { button.disabled = false; button.textContent = originalText; }

    if (!signedUrl) {
        if (viewWindow) viewWindow.close();
        alert("❌ File URL could not be created.");
        return;
    }

    if (isImage && viewWindow) {
        var safeTitle = escapeHTML(item.title || "File");
        viewWindow.document.open();
        viewWindow.document.write(
            "<!DOCTYPE html><html><head><title>" + safeTitle + "</title><style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{max-width:100%;max-height:100vh;object-fit:contain;}</style></head><body><img src=\"" + escapeHTML(signedUrl) + "\" alt=\"" + safeTitle + "\"></body></html>"
        );
        viewWindow.document.close();
        return;
    }

    window.open(signedUrl, "_blank");
}

/* =====================================================
   SAVED ITEM UI
===================================================== */

function createSecurityItemElement(item, targetList) {
    var list = targetList || securityItemsList;
    if (!list) return;

    var itemBox = document.createElement("div");
    itemBox.className = "security-item";

    var titleElement = document.createElement("div");
    titleElement.className = "security-item-title";
    titleElement.textContent = item.title || "Untitled File";

    var categoryElement = document.createElement("div");
    categoryElement.className = "security-item-category";
    categoryElement.textContent = "CATEGORY: " + (item.category || "General");

    var infoBox = document.createElement("div");
    infoBox.appendChild(titleElement);
    infoBox.appendChild(categoryElement);

    var fileName = "";
    if (item.file_path) {
        var pathParts = item.file_path.split("/");
        fileName = pathParts[pathParts.length - 1];
    }
    if (fileName) {
        var fileElement = document.createElement("div");
        fileElement.className = "security-item-file";
        fileElement.textContent = "FILE: " + fileName;
        infoBox.appendChild(fileElement);
    }

    var knownFileSize = getStorageFileSize(item.file_path);
    if (knownFileSize > 0) {
        var sizeElement = document.createElement("div");
        sizeElement.className = "security-item-file";
        sizeElement.textContent = "SIZE: " + formatFileSize(knownFileSize);
        infoBox.appendChild(sizeElement);
    }

    var buttonBox = document.createElement("div");
    buttonBox.className = "security-item-actions";

    var viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "security-view-button";
    viewButton.textContent = "VIEW";
    viewButton.onclick = function () { viewSecurityItem(item, viewButton); };

    var editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "security-edit-button";
    editButton.textContent = "EDIT";
    editButton.onclick = function () { editSecurityItem(item); };

    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "security-delete-button";
    deleteButton.textContent = "DELETE";
    deleteButton.onclick = function () { deleteSecurityItem(item); };

    buttonBox.appendChild(viewButton);
    buttonBox.appendChild(editButton);
    buttonBox.appendChild(deleteButton);

    itemBox.appendChild(infoBox);
    itemBox.appendChild(buttonBox);
    list.appendChild(itemBox);
}

/* =====================================================
   REMOTE FILE CLEANUP
===================================================== */

async function cleanupRemoteFile(filePath) {
    if (!supabaseClient || !currentUser || !filePath) return;

    if (isBackblazeB2FilePath(filePath)) {
        var objectKey = getB2ObjectKeyFromUrl(filePath);
        if (!objectKey) return;
        try {
            await supabaseClient.functions.invoke(B2_FUNCTION_DELETE, { body: { objectKey: objectKey, userId: currentUser.id } });
        } catch (error) { console.log("B2 cleanup error:", error); }
        return;
    }

    if (isCloudinaryFilePath(filePath)) {
        try {
            await supabaseClient.functions.invoke("cloudinary-delete", { body: { fileUrl: filePath } });
        } catch (error) { console.log("Cloudinary cleanup error:", error); }
        return;
    }

    try {
        await supabaseClient.storage.from(STORAGE_BUCKET).remove([filePath]);
    } catch (error) { console.log("Storage cleanup error:", error); }
}

/* =====================================================
   ADD PAGE — SELECT FILE
===================================================== */

if (securityFileInput) {
    securityFileInput.onchange = function () {
        var file = securityFileInput.files[0];
        if (selectedFileName) selectedFileName.textContent = file ? file.name : "No file selected.";
    };
}

/* =====================================================
   ADD PAGE — SAVE FILE
===================================================== */

if (securityAddFileBtn) {
    securityAddFileBtn.onclick = async function () {
        if (!supabaseClient || !currentUser) { setAddFileMessage("❌ Please login first.", false); return; }
        if (!securityFileInput) { setAddFileMessage("❌ File input is unavailable.", false); return; }

        var file = securityFileInput.files[0];
        var title = securityFileTitle ? securityFileTitle.value.trim() : "";
        var category = securityFileCategory ? securityFileCategory.value : "";

        if (!file) { setAddFileMessage("❌ Please select a file.", false); return; }
        if (title === "") { setAddFileMessage("❌ Please enter a file title.", false); if (securityFileTitle) securityFileTitle.focus(); return; }
        if (category === "") { setAddFileMessage("❌ Please select a category.", false); if (securityFileCategory) securityFileCategory.focus(); return; }

        var fileSize = Number(file.size) || 0;
        if (fileSize <= 0) { setAddFileMessage("❌ The selected file is empty or invalid.", false); return; }

        var remainingBytes = getRemainingStorageBytes();
        if (fileSize > remainingBytes) {
            setAddFileMessage("❌ Storage quota exceeded. Free space: " + formatFileSize(remainingBytes) + " • File size: " + formatFileSize(fileSize) + " • Limit: " + USER_STORAGE_LIMIT_GB + " GB", false);
            await updateStorage();
            return;
        }

        var safeFile = createSafeUploadFile(file);
        var safeFileName = createSafeFileName(file.name);

        securityAddFileBtn.disabled = true;
        var filePath = "";
        var uploadedToB2 = false;
        var uploadedToCloudinary = false;
        var usageWasAdded = false;

        try {
            if (isVideoFile(file)) {
                setAddFileMessage("Uploading video to Backblaze B2...", true);

                var b2FormData = new FormData();
                b2FormData.append("file", safeFile, safeFileName);
                b2FormData.append("userId", currentUser.id);

                var b2Result = await supabaseClient.functions.invoke(B2_FUNCTION_UPLOAD, { body: b2FormData });
                if (b2Result.error) { securityAddFileBtn.disabled = false; setAddFileMessage("❌ B2 upload failed: " + b2Result.error.message, false); return; }

                var b2Data = b2Result.data || {};
                if (!b2Data.success || !b2Data.url) { securityAddFileBtn.disabled = false; setAddFileMessage("❌ B2 video upload failed: " + (b2Data.error || "Unknown error"), false); return; }

                filePath = b2Data.url;
                uploadedToB2 = true;
            } else {
                setAddFileMessage("Uploading file to Cloudinary...", true);

                var cloudinaryFormData = new FormData();
                cloudinaryFormData.append("file", safeFile, safeFileName);
                cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                cloudinaryFormData.append("folder", CLOUDINARY_FOLDER);

                var cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/" + CLOUDINARY_CLOUD_NAME + "/auto/upload", { method: "POST", body: cloudinaryFormData });
                var cloudinaryData = await cloudinaryResponse.json();

                if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
                    securityAddFileBtn.disabled = false;
                    setAddFileMessage("❌ Cloudinary upload failed: " + (cloudinaryData.error && cloudinaryData.error.message ? cloudinaryData.error.message : "Unknown error"), false);
                    return;
                }

                filePath = cloudinaryData.secure_url;
                uploadedToCloudinary = true;
            }

            setAddFileMessage("Saving file information...", true);

            var insertResult = await supabaseClient.from("security_items").insert({ user_id: currentUser.id, title: title, category: category, file_path: filePath });

            if (insertResult.error) {
                await cleanupRemoteFile(filePath);
                securityAddFileBtn.disabled = false;
                setAddFileMessage("❌ File information could not be saved: " + insertResult.error.message, false);
                return;
            }

            saveStorageFileSize(filePath, fileSize);
            increaseTrackedStorageUsage(fileSize);
            usageWasAdded = true;

            if (securityFileInput) securityFileInput.value = "";
            if (selectedFileName) selectedFileName.textContent = "No file selected.";
            if (securityFileTitle) securityFileTitle.value = "";
            if (securityFileCategory) securityFileCategory.value = "";

            securityAddFileBtn.disabled = false;
            setAddFileMessage(uploadedToB2 ? "✔️ Video saved successfully to Backblaze B2." : uploadedToCloudinary ? "✔️ File saved successfully to Cloudinary." : "✔️ File saved successfully.", true);

            await loadSecurityItems();
            await updateStorage();
        } catch (error) {
            console.log("Save security item error:", error);
            if (filePath && !usageWasAdded) await cleanupRemoteFile(filePath);
            securityAddFileBtn.disabled = false;
            setAddFileMessage("❌ File save failed: " + (error && error.message ? error.message : "Unknown error"), false);
        }
    };
}

async function loadSecurityItems() {
    if (!supabaseClient || !currentUser || !securityItemsList) return;

    securityItemsList.innerHTML = "";

    var result = await supabaseClient.from("security_items").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });

    if (result.error) {
        console.log("Load security items error:", result.error.message);
        securityItemsList.innerHTML = '<div class="add-file-name">Could not load saved data.</div>';
        return;
    }

    var items = result.data || [];
    if (items.length === 0) { securityItemsList.innerHTML = '<div class="add-file-name">No saved data yet.</div>'; return; }

    items.forEach(function (item) { createSecurityItemElement(item); });
}

/* =====================================================
   SEARCH PAGE
===================================================== */

async function loadSearchableItems() {
    if (!supabaseClient || !currentUser) { allSecurityItemsCache = []; return; }

    var result = await supabaseClient.from("security_items").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });

    allSecurityItemsCache = result.error ? [] : (result.data || []);
}

function getFileNameFromPath(filePath) {
    if (!filePath) return "";
    var cleanPath = String(filePath).split("?")[0].split("#")[0];
    var parts = cleanPath.split("/");
    return parts[parts.length - 1] || "";
}

function renderSearchResults(query) {
    if (!searchResultsList) return;

    searchResultsList.innerHTML = "";
    var q = (query || "").trim().toLowerCase();

    if (q === "") {
        if (searchEmptyMessage) { searchEmptyMessage.style.display = "block"; searchEmptyMessage.textContent = "Type to search your saved data."; }
        return;
    }

    var matches = allSecurityItemsCache.filter(function (item) {
        var title = (item.title || "").toLowerCase();
        var category = (item.category || "").toLowerCase();
        var fileName = getFileNameFromPath(item.file_path).toLowerCase();
        return title.indexOf(q) !== -1 || category.indexOf(q) !== -1 || fileName.indexOf(q) !== -1;
    });

    if (matches.length === 0) {
        if (searchEmptyMessage) { searchEmptyMessage.style.display = "block"; searchEmptyMessage.textContent = "No matching saved data found."; }
        return;
    }

    if (searchEmptyMessage) searchEmptyMessage.style.display = "none";

    matches.forEach(function (item) { createSecurityItemElement(item, searchResultsList); });
}

if (searchQueryInput) {
    searchQueryInput.oninput = function () {
        renderSearchResults(searchQueryInput.value);
    };
}

/* =====================================================
   EDIT FILE
===================================================== */

async function editSecurityItem(item) {
    if (!supabaseClient || !currentUser || !item) return;

    var newTitle = window.prompt("Enter new file title:", item.title || "");
    if (newTitle === null) return;
    newTitle = newTitle.trim();
    if (newTitle === "") { alert("File title cannot be empty."); return; }

    var allowedCategories = ["General", "Security", "Documents", "Videos", "Images", "Other"];
    var newCategory = window.prompt("Enter category:\n\n" + allowedCategories.join(", "), item.category || "");
    if (newCategory === null) return;
    newCategory = newCategory.trim();

    if (allowedCategories.indexOf(newCategory) === -1) { alert("Please use one of the available categories."); return; }
    if (!window.confirm("Update this file information?")) return;

    var result = await supabaseClient.from("security_items").update({ title: newTitle, category: newCategory }).eq("id", item.id).eq("user_id", currentUser.id);

    if (result.error) { alert("❌ Update failed: " + result.error.message); return; }

    setAddFileMessage("✔️ File information updated.", true);
    await loadSecurityItems();
}

/* =====================================================
   DELETE FILE
===================================================== */

async function deleteSecurityItem(item) {
    if (!supabaseClient || !currentUser || !item) return;
    if (!window.confirm("Delete this saved file?\n\nThe file and its saved information will be removed.")) return;

    var remoteDeleteFailed = false;
    var ledgerSize = getStorageFileSize(item.file_path);
    var databaseFileSize = Number(item.file_size) || 0;
    var trackedFileSize = ledgerSize > 0 ? ledgerSize : databaseFileSize;

    if (item.file_path && isBackblazeB2FilePath(item.file_path)) {
        var objectKey = getB2ObjectKeyFromUrl(item.file_path);
        if (!objectKey) { alert("❌ B2 object key could not be detected."); return; }

        var b2DeleteResult = await supabaseClient.functions.invoke(B2_FUNCTION_DELETE, { body: { objectKey: objectKey, userId: currentUser.id } });
        if (b2DeleteResult.error || (b2DeleteResult.data && b2DeleteResult.data.success === false)) {
            remoteDeleteFailed = true;
            if (!window.confirm("The B2 video could not be removed.\n\nDo you still want to remove its saved information?")) return;
        }
    } else if (item.file_path && isCloudinaryFilePath(item.file_path)) {
        var cloudinaryDeleteResult = await supabaseClient.functions.invoke("cloudinary-delete", { body: { fileUrl: item.file_path } });
        if (cloudinaryDeleteResult.error || (cloudinaryDeleteResult.data && cloudinaryDeleteResult.data.success === false)) {
            remoteDeleteFailed = true;
            if (!window.confirm("The cloud file could not be removed.\n\nDo you still want to remove its saved information?")) return;
        }
    } else if (item.file_path) {
        var storageResult = await supabaseClient.storage.from(STORAGE_BUCKET).remove([item.file_path]);
        if (storageResult.error) {
            remoteDeleteFailed = true;
            if (!window.confirm("The cloud file could not be removed.\n\nDo you still want to remove its saved information?")) return;
        }
    }

    var databaseResult = await supabaseClient.from("security_items").delete().eq("id", item.id).eq("user_id", currentUser.id);
    if (databaseResult.error) { alert("❌ Saved file information could not be deleted: " + databaseResult.error.message); return; }

    var removedLedgerSize = removeStorageFileSize(item.file_path);
    if (trackedFileSize <= 0 && removedLedgerSize > 0) trackedFileSize = removedLedgerSize;
    if (trackedFileSize > 0) decreaseTrackedStorageUsage(trackedFileSize);

    await reconcileStorageUsage();

    setAddFileMessage(remoteDeleteFailed ? "⚠️ Saved information deleted, but the cloud file may still exist." : "✔️ File deleted successfully.", !remoteDeleteFailed);

    await loadSecurityItems();
    await updateStorage();
}

/* =====================================================
   HOME TAB — LOGIN HISTORY TOGGLE + CLEAR
===================================================== */

if (loginHistoryToggleBtn) {
    loginHistoryToggleBtn.onclick = function () {
        var isOpen = loginHistoryPanel && loginHistoryPanel.classList.contains("open");

        if (isOpen) {
            loginHistoryPanel.classList.remove("open");
            if (loginHistoryArrow) loginHistoryArrow.classList.remove("rotated");
        } else {
            displayLoginHistory();
            if (loginHistoryPanel) loginHistoryPanel.classList.add("open");
            if (loginHistoryArrow) loginHistoryArrow.classList.add("rotated");
        }
    };
}

if (clearHistoryBtn) {
    clearHistoryBtn.onclick = function () {
        if (!currentUser) return;
        if (!window.confirm("Clear all login history?")) return;
        saveLoginHistory([]);
        displayLoginHistory();
    };
}

/* =====================================================
   HOME TAB — CHANGE PASSWORD (inline panel, real save)
===================================================== */

if (changePasswordToggleBtn) {
    changePasswordToggleBtn.onclick = function () {
        var isOpen = changePasswordPanel && changePasswordPanel.classList.contains("open");

        if (isOpen) {
            changePasswordPanel.classList.remove("open");
            if (changePasswordArrow) changePasswordArrow.classList.remove("rotated");
        } else {
            if (currentPasswordField) currentPasswordField.value = "";
            if (newPasswordField) newPasswordField.value = "";
            if (confirmNewPasswordField) confirmNewPasswordField.value = "";
            if (changePasswordHomeMessage) changePasswordHomeMessage.textContent = "";
            if (changePasswordPanel) changePasswordPanel.classList.add("open");
            if (changePasswordArrow) changePasswordArrow.classList.add("rotated");
        }
    };
}

if (savePasswordChangeBtn) {
    savePasswordChangeBtn.onclick = async function () {
        if (!supabaseClient || !currentUser) { if (changePasswordHomeMessage) changePasswordHomeMessage.textContent = "❌ Please login first."; return; }

        var oldPass = currentPasswordField ? currentPasswordField.value : "";
        var newPass = newPasswordField ? newPasswordField.value : "";
        var confirmPass = confirmNewPasswordField ? confirmNewPasswordField.value : "";

        if (oldPass === "") { changePasswordHomeMessage.textContent = "Please enter your current password."; return; }
        if (newPass === "" || newPass.length < 6) { changePasswordHomeMessage.textContent = "New password must be at least 6 characters."; return; }
        if (newPass !== confirmPass) { changePasswordHomeMessage.textContent = "❌ New passwords do not match."; return; }
        if (oldPass === newPass) { changePasswordHomeMessage.textContent = "New password must be different from current password."; return; }

        savePasswordChangeBtn.disabled = true;
        changePasswordHomeMessage.textContent = "Verifying current password...";

        try {
            var verify = await supabaseClient.auth.signInWithPassword({ email: currentUser.email, password: oldPass });
            if (verify.error) { savePasswordChangeBtn.disabled = false; changePasswordHomeMessage.textContent = "❌ Current password is incorrect."; return; }

            changePasswordHomeMessage.textContent = "Updating password...";
            var update = await supabaseClient.auth.updateUser({ password: newPass });
            if (update.error) { savePasswordChangeBtn.disabled = false; changePasswordHomeMessage.textContent = "❌ " + update.error.message; return; }

            savePasswordChangeBtn.disabled = false;
            if (currentPasswordField) currentPasswordField.value = "";
            if (newPasswordField) newPasswordField.value = "";
            if (confirmNewPasswordField) confirmNewPasswordField.value = "";
            changePasswordHomeMessage.textContent = "✔️ Password changed successfully.";
        } catch (error) {
            savePasswordChangeBtn.disabled = false;
            console.log("Password change error:", error);
            changePasswordHomeMessage.textContent = "❌ Password change failed.";
        }
    };
}

/* =====================================================
   CHANGE PASSWORD (settings page — uses prompts, since
   that panel has no dedicated input fields)
===================================================== */

async function doPasswordChangeFlow() {
    if (!supabaseClient || !currentUser) { alert("Please login first."); return; }

    var oldPass = window.prompt("Enter your current password:");
    if (oldPass === null) return;
    if (oldPass === "") { alert("Current password is required."); return; }

    var newPass = window.prompt("Enter your new password (min 6 characters):");
    if (newPass === null) return;
    if (!newPass || newPass.length < 6) { alert("New password must be at least 6 characters."); return; }

    var confirmPass = window.prompt("Confirm your new password:");
    if (confirmPass === null) return;
    if (newPass !== confirmPass) { alert("New passwords do not match."); return; }
    if (oldPass === newPass) { alert("New password must be different from your current password."); return; }

    var verify = await supabaseClient.auth.signInWithPassword({ email: currentUser.email, password: oldPass });
    if (verify.error) { alert("❌ Current password is incorrect."); return; }

    var update = await supabaseClient.auth.updateUser({ password: newPass });
    if (update.error) { alert("❌ Password change failed: " + update.error.message); return; }

    alert("✔️ Password changed successfully.");
}

if (settingsChangePasswordBtn) settingsChangePasswordBtn.onclick = doPasswordChangeFlow;

/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {
    logoutBtn.onclick = async function () {
        if (!window.confirm("Sign out of Cyber Core?")) return;
        if (supabaseClient) await supabaseClient.auth.signOut();
        currentUser = null;
        currentProfile = null;
        currentAccountEmail = "";
        currentAccountPhone = "";
        googleOAuthLogin = false;
        githubOAuthLogin = false;
        closeSecurityCenter();
        showLogin();
    };
}

/* =====================================================
   REMOVE ACCOUNT (settings — permanent deletion)
===================================================== */

async function cleanupCurrentUserFiles() {
    if (!supabaseClient || !currentUser) return;
    try {
        var result = await supabaseClient.from("security_items").select("file_path").eq("user_id", currentUser.id);
        if (!result.error) {
            var items = result.data || [];
            for (var i = 0; i < items.length; i++) {
                if (items[i] && items[i].file_path) await cleanupRemoteFile(items[i].file_path);
            }
        }
        await supabaseClient.from("security_items").delete().eq("user_id", currentUser.id);
    } catch (error) { console.log("cleanupCurrentUserFiles error:", error); }
}

async function cleanupCurrentUserStorage() {
    if (!supabaseClient || !currentUser) return;
    try {
        var listResult = await supabaseClient.storage.from(STORAGE_BUCKET).list(currentUser.id, { limit: 1000, offset: 0 });
        if (listResult.error) { console.log("Storage list cleanup error:", listResult.error.message); return; }

        var files = listResult.data || [];
        if (files.length === 0) return;

        var paths = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i] && files[i].name) paths.push(currentUser.id + "/" + files[i].name);
        }

        if (paths.length > 0) {
            var removeResult = await supabaseClient.storage.from(STORAGE_BUCKET).remove(paths);
            if (removeResult.error) console.log("Storage cleanup error:", removeResult.error.message);
        }
    } catch (error) { console.log("Storage cleanup exception:", error); }
}

async function cleanupCurrentUserProfile() {
    if (!supabaseClient || !currentUser) return;
    try {
        var result = await supabaseClient.from("profiles").delete().eq("id", currentUser.id);
        if (result.error) console.log("Profile cleanup error:", result.error.message);
    } catch (error) { console.log("Profile cleanup exception:", error); }
}

async function deleteCurrentAuthUser() {
    if (!supabaseClient || !currentUser) return { error: new Error("No active user.") };
    try {
        var result = await supabaseClient.functions.invoke("delete-user", { body: { user_id: currentUser.id } });
        if (result.error) return { error: result.error };
        return { data: result.data || null, error: null };
    } catch (error) {
        return { error: error };
    }
}

async function doRemoveAccountFlow() {
    if (!supabaseClient || !currentUser) { if (removeAccountMessage) removeAccountMessage.textContent = "❌ Please login first."; return; }
    if (!window.confirm("This will PERMANENTLY delete your account and all saved data.\n\nAre you sure you want to continue?")) return;

    var password = window.prompt("Enter your password to confirm account deletion:");
    if (password === null) return;
    if (!password) { if (removeAccountMessage) removeAccountMessage.textContent = "Password is required."; return; }

    if (removeAccountMessage) removeAccountMessage.textContent = "Verifying...";

    var verify = await supabaseClient.auth.signInWithPassword({ email: currentUser.email, password: password });
    if (verify.error) { if (removeAccountMessage) removeAccountMessage.textContent = "❌ Password is incorrect."; return; }

    if (removeAccountMessage) removeAccountMessage.textContent = "Removing account data...";

    var emailToForget = currentUser.email;

    await cleanupCurrentUserFiles();
    await cleanupCurrentUserStorage();
    await cleanupCurrentUserProfile();

    var del = await deleteCurrentAuthUser();
    if (del.error) { if (removeAccountMessage) removeAccountMessage.textContent = "❌ " + del.error.message; return; }

    removeRememberedAccount(emailToForget);

    currentUser = null;
    currentProfile = null;
    currentAccountEmail = "";
    currentAccountPhone = "";
    googleOAuthLogin = false;
    githubOAuthLogin = false;

    if (dashboard) dashboard.style.display = "none";
    document.body.style.overflow = "";
    closeSecurityCenter();

    showLogin();
    message.textContent = "✔️ Account removed successfully.";
}

if (removeAccountBtn) removeAccountBtn.onclick = doRemoveAccountFlow;

/* =====================================================
   SECURITY STATUS CONTENT (shared by panel + page)
===================================================== */

function buildSecurityStatus() {
    if (!currentUser) return { account: "NOT LOGGED IN", session: "—", storage: "—" };
    var provider = getOAuthProvider(currentUser);
    var method = provider === "google" ? "GOOGLE" : provider === "github" ? "GITHUB" : "PASSWORD";
    return {
        account: "ACTIVE (" + method + ")",
        session: "SECURE",
        storage: formatFileSize(getTrackedStorageUsage()) + " / " + USER_STORAGE_LIMIT_GB + " GB"
    };
}

function buildActivityRowsHTML(limit) {
    var history = getLoginHistory();
    var rows = [];
    var max = Math.min(history.length, limit || 5);

    for (var i = 0; i < max; i++) {
        var item = history[i] || {};
        rows.push(
            '<div class="security-activity-item"><div class="security-activity-email">' + escapeHTML(item.email || "") +
            '</div><div class="security-activity-time">' + escapeHTML(item.date || "") + " • " + escapeHTML(item.time || "") + "</div></div>"
        );
    }
    return rows.join("");
}

function updateSecurityCenterPanel() {
    var status = buildSecurityStatus();
    if (securityStatusAccount) securityStatusAccount.textContent = status.account;
    if (securityStatusSession) securityStatusSession.textContent = status.session;
    if (securityStatusStorage) securityStatusStorage.textContent = status.storage;

    var rowsHtml = buildActivityRowsHTML(5);
    if (securityCenterActivity) securityCenterActivity.innerHTML = rowsHtml;
    if (securityCenterActivityEmpty) securityCenterActivityEmpty.style.display = rowsHtml ? "none" : "block";
}

function updateSecurityPage() {
    var status = buildSecurityStatus();
    if (securityAccountStatus) {
        securityAccountStatus.textContent = "Account: " + status.account + " • Session: " + status.session + " • Storage: " + status.storage;
    }
    var rowsHtml = buildActivityRowsHTML(10);
    if (securityActivityList) securityActivityList.innerHTML = rowsHtml || '<div class="security-alert">No recent security activity.</div>';
}

/* =====================================================
   SECURITY CENTER (slide-out panel)
===================================================== */

function openSecurityCenter() {
    if (!securityCenterPanel || !securityCenterOverlay) return;
    updateSecurityCenterPanel();
    securityCenterPanel.classList.add("show-security-panel");
    securityCenterOverlay.classList.add("show-security-overlay");
}

function closeSecurityCenter() {
    if (securityCenterPanel) securityCenterPanel.classList.remove("show-security-panel");
    if (securityCenterOverlay) securityCenterOverlay.classList.remove("show-security-overlay");
}

function setupSecurityCenter() {
    if (securityCenterInitialized) return;
    securityCenterInitialized = true;

    if (securityMenuButton) {
        securityMenuButton.onclick = function () {
            if (securityCenterPanel && securityCenterPanel.classList.contains("show-security-panel")) closeSecurityCenter();
            else openSecurityCenter();
        };
    }

    if (securityCenterOverlay) securityCenterOverlay.onclick = function () { closeSecurityCenter(); };
    if (securityCenterClose) securityCenterClose.onclick = function () { closeSecurityCenter(); };

    if (securityRefreshBtn) {
        securityRefreshBtn.onclick = function () {
            updateSecurityCenterPanel();
            updateSecurityPage();
            if (securityCenterMessage) securityCenterMessage.textContent = "✔️ Security status refreshed.";
        };
    }

    if (securityLogoutBtn) {
        securityLogoutBtn.onclick = async function () {
            if (!window.confirm("Sign out of Cyber Core?")) return;
            if (supabaseClient) await supabaseClient.auth.signOut();
            currentUser = null;
            currentProfile = null;
            currentAccountEmail = "";
            currentAccountPhone = "";
            googleOAuthLogin = false;
            githubOAuthLogin = false;
            closeSecurityCenter();
            showLogin();
        };
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && securityCenterPanel && securityCenterPanel.classList.contains("show-security-panel")) closeSecurityCenter();
    });
}

/* =====================================================
   DASHBOARD + NAVIGATION
===================================================== */

function activateHome() {
    var navItems = document.querySelectorAll(".magic-nav .nav-item");
    var pages = document.querySelectorAll(".dashboard-page");

    for (var i = 0; i < navItems.length; i++) navItems[i].classList.remove("active");
    for (var j = 0; j < pages.length; j++) pages[j].classList.remove("active-page");

    var homeNav = document.querySelector('.nav-item[data-page="homePage"]');
    var homePage = document.getElementById("homePage");

    if (homeNav) homeNav.classList.add("active");
    if (homePage) homePage.classList.add("active-page");
}

function setupNavigation() {
    var navItems = document.querySelectorAll(".magic-nav .nav-item");
    var pages = document.querySelectorAll(".dashboard-page");

    for (var i = 0; i < navItems.length; i++) {
        (function (currentNav) {
            currentNav.onclick = async function () {
                var pageId = currentNav.getAttribute("data-page");

                for (var j = 0; j < navItems.length; j++) navItems[j].classList.remove("active");
                for (var k = 0; k < pages.length; k++) pages[k].classList.remove("active-page");

                currentNav.classList.add("active");

                var target = document.getElementById(pageId);
                if (target) {
                    target.classList.add("active-page");
                    var scrollArea = target.querySelector(".home-scroll, .profile-scroll, .add-scroll, .setting-scroll");
                    if (scrollArea) scrollArea.scrollTop = 0;
                }

                if (pageId === "homePage") { displayLoginHistory(); await updateStorage(); }
                if (pageId === "addPage") { await loadSecurityItems(); await updateStorage(); }
                if (pageId === "profilePage") { await updateProfile(); displayAccounts(); }
                if (pageId === "securityPage") { updateSecurityPage(); }
                if (pageId === "searchPage") {
                    await loadSearchableItems();
                    if (searchQueryInput) searchQueryInput.value = "";
                    renderSearchResults("");
                }
            };
        })(navItems[i]);
    }
}

async function showDashboard() {
    if (!dashboard || !currentUser) { showLogin(); return; }

    if (container) container.style.display = "none";
    dashboard.style.display = "block";
    document.body.style.overflow = "hidden";

    setupSecurityCenter();
    activateHome();

    await updateProfile();
    displayLoginHistory();
    await updateStorage();
    updateSecurityPage();

    var homeScroll = document.querySelector("#homePage .home-scroll");
    if (homeScroll) homeScroll.scrollTop = 0;
}

/* =====================================================
   SESSION HANDLING
===================================================== */

async function checkExistingSession() {
    if (!supabaseClient) { showLogin(); message.textContent = "❌ Supabase could not be loaded."; return; }

    if (isOAuthCallback()) {
        var callbackHandled = await handleOAuthCallbackSession();
        if (callbackHandled) return;
    }

    var sessionResult = await supabaseClient.auth.getSession();

    if (sessionResult.error) {
        console.log("Session check error:", sessionResult.error.message);
        showLogin();
        message.textContent = "Please login to continue❗";
        return;
    }

    var session = sessionResult.data && sessionResult.data.session ? sessionResult.data.session : null;

    if (session && session.user && isOAuthUser(session.user)) {
        var provider = getOAuthProvider(session.user);
        if (provider === "google") { googleOAuthLogin = true; githubOAuthLogin = false; await handleOAuthUser(session.user, "google"); return; }
        if (provider === "github") { githubOAuthLogin = true; googleOAuthLogin = false; await handleOAuthUser(session.user, "github"); return; }
    }

    if (session && session.user) {
        currentUser = session.user;
        currentAccountEmail = session.user.email || "";
        currentAccountPhone = session.user.phone || "";
        verifiedEmail = currentAccountEmail;
        verifiedPhone = currentAccountPhone;
        googleOAuthLogin = false;
        githubOAuthLogin = false;

        rememberAccount(currentAccountEmail, currentAccountPhone);
        await createOrUpdateProfile(currentUser, currentAccountPhone);

        message.textContent = "✔️ Session restored❗";
        await showDashboard();

        handleLocationConsentForUser(currentUser.id);
        return;
    }

    currentUser = null;
    currentProfile = null;
    currentAccountEmail = "";
    currentAccountPhone = "";
    googleOAuthLogin = false;
    githubOAuthLogin = false;

    var accounts = getRememberedAccounts();

    if (accounts.length > 0) {
        showLogin();
        var last = accounts[accounts.length - 1];
        if (loginEmail) loginEmail.value = last.email || "";
        if (loginPhone) loginPhone.value = last.phone || "";
        if (loginPassword) loginPassword.value = "";
        message.textContent = "Welcome back❗ Please Login.";
    } else {
        showLogin();
        message.textContent = "Please login to continue❗";
    }
}

if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(function (event, session) {
        if (session && session.user) {
            currentUser = session.user;
            if (securityCenterInitialized) updateSecurityCenterPanel();
        } else {
            currentUser = null;
            closeSecurityCenter();
        }
    });
}

/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", async function () {
    setupNavigation();
    setupSecurityCenter();
    displayLoginHistory();

    await checkExistingSession();

    waitForHCaptchaAndRender(30);
});

/* =====================================================
   PWA SERVICE WORKER
===================================================== */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js")
            .then(function (registration) { console.log("Service worker registered:", registration); })
            .catch(function (error) { console.log("Service worker registration failed:", error); });
    });
}
