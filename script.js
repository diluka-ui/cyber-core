// @ts-nocheck
"use strict";

/* =====================================================
CYBER CORE - SUPABASE VERSION
GOOGLE + GITHUB OAUTH
===================================================== */

/* =====================================================
SUPABASE CONFIG
===================================================== */

var SUPABASE_URL =
"https://zlysjkpstaushfjgnvxi.supabase.co";

var SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_45K-dyeWhUXpjOioTgPw_A_7R-t1gKu";

var supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient ===
    "function"
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

}

/* =====================================================
CONFIG
===================================================== */

var HELP_WHATSAPP_NUMBER =
"94715874334";

var STORAGE_BUCKET =
"cyber-files";

var MAX_ACCOUNTS =
5;

var STORAGE_REFERENCE_GB =
36;

/* =====================================================
CLOUDINARY CONFIG
===================================================== */

var CLOUDINARY_CLOUD_NAME =
"am04nwhi";

var CLOUDINARY_UPLOAD_PRESET =
"cyber_core_upload";

/* =====================================================
OAUTH CONFIG
===================================================== */

var OAUTH_REDIRECT_URL =
"https://diluka-ui.github.io/cyber-core/";

/* =====================================================
VARIABLES
===================================================== */

var generatedOTP = "";

var countdown = null;

var timeLeft = 60;

var verifiedEmail = "";

var verifiedPhone = "";

var currentUser = null;

var currentProfile = null;

var rememberedAccounts = [];

var currentAccountEmail = "";

var currentAccountPhone = "";

var googleOAuthLogin = false;

var githubOAuthLogin = false;

/*
Prevent duplicate OAuth handling.
*/

var oauthHandling =
false;

var oauthCallbackHandled =
false;

/* =====================================================
ELEMENTS
===================================================== */

var container =
document.querySelector(".container");

var registerBox =
document.getElementById("registerBox");

var email =
document.getElementById("email");

var phone =
document.getElementById("phone");

var sendBtn =
document.getElementById("sendBtn");

var otpBox =
document.getElementById("otpBox");

var verifyBtn =
document.getElementById("verifyBtn");

var timer =
document.getElementById("timer");

var passwordBox =
document.getElementById("passwordBox");

var newPassword =
document.getElementById("newPassword");

var confirmPassword =
document.getElementById("confirmPassword");

var saveBtn =
document.getElementById("savePasswordBtn");

var loginBox =
document.getElementById("loginBox");

var loginEmail =
document.getElementById("loginEmail");

var loginPhone =
document.getElementById("loginPhone");

var loginPassword =
document.getElementById("loginPassword");

var loginBtn =
document.getElementById("loginBtn");

var googleLoginBtn =
document.getElementById("googleLoginBtn");

var githubLoginBtn =
document.getElementById("githubLoginBtn");

var createAccountBtn =
document.getElementById("createAccountBtn");

var message =
document.getElementById("message");

var dashboard =
document.getElementById("dashboard");

/* =====================================================
HOME
===================================================== */

var loginHistoryBtn =
document.getElementById(
    "loginHistoryBtn"
);

var loginHistoryBox =
document.getElementById(
    "loginHistoryBox"
);

var loginHistoryContent =
document.getElementById(
    "loginHistoryContent"
);

var clearHistoryBtn =
document.getElementById(
    "clearHistoryBtn"
);

var changePasswordBtn =
document.getElementById(
    "changePasswordBtn"
);

var changePasswordBox =
document.getElementById(
    "changePasswordBox"
);

var oldPassword =
document.getElementById(
    "oldPassword"
);

var changeNewPassword =
document.getElementById(
    "changeNewPassword"
);

var changeConfirmPassword =
document.getElementById(
    "changeConfirmPassword"
);

var saveChangedPasswordBtn =
document.getElementById(
    "saveChangedPasswordBtn"
);

var changePasswordMessage =
document.getElementById(
    "changePasswordMessage"
);

var storageBtn =
document.getElementById(
    "storageBtn"
);

var storageBox =
document.getElementById(
    "storageBox"
);

var storageUsed =
document.getElementById(
    "storageUsed"
);

var storageProgress =
document.getElementById(
    "storageProgress"
);

var storageDetails =
document.getElementById(
    "storageDetails"
);

/* =====================================================
ADD PAGE
FILE + TITLE + CATEGORY
===================================================== */

var addFileInput =
document.getElementById(
    "addFileInput"
);

var addFileName =
document.getElementById(
    "addFileName"
);

var addTitle =
document.getElementById(
    "addTitle"
);

var addCategory =
document.getElementById(
    "addCategory"
);

var saveFileBtn =
document.getElementById(
    "saveFileBtn"
);

var addFileMessage =
document.getElementById(
    "addFileMessage"
);

var securityItemsList =
document.getElementById(
    "securityItemsList"
);

/* =====================================================
PROFILE
===================================================== */

var profilePicture =
document.getElementById(
    "profilePicture"
);

var profilePicturePlaceholder =
document.getElementById(
    "profilePicturePlaceholder"
);

var profilePictureInput =
document.getElementById(
    "profilePictureInput"
);

var profileUsername =
document.getElementById(
    "profileUsername"
);

var profileEmail =
document.getElementById(
    "profileEmail"
);

var profilePhone =
document.getElementById(
    "profilePhone"
);

var profileBirthday =
document.getElementById(
    "profileBirthday"
);

var editUsername =
document.getElementById(
    "editUsername"
);

var editBirthday =
document.getElementById(
    "editBirthday"
);

var saveProfileBtn =
document.getElementById(
    "saveProfileBtn"
);

var profileMessage =
document.getElementById(
    "profileMessage"
);

var accountChangeBtn =
document.getElementById(
    "accountChangeBtn"
);

var accountChangeBox =
document.getElementById(
    "accountChangeBox"
);

var accountList =
document.getElementById(
    "accountList"
);

var addAccountBtn =
document.getElementById(
    "addAccountBtn"
);

var helpCenterBtn =
document.getElementById(
    "helpCenterBtn"
);

var removeAccountBtn =
document.getElementById(
    "removeAccountBtn"
);

/* =====================================================
OTP INPUTS
===================================================== */

var otpInputs =
document.querySelectorAll(
    ".otp-digit"
);

/* =====================================================
REMEMBERED ACCOUNTS
===================================================== */

function getRememberedAccounts() {

    var saved =
        localStorage.getItem(
            "cyberCoreAccounts"
        );

    if (!saved) {
        return [];
    }

    try {

        var parsed =
            JSON.parse(saved);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    } catch (error) {

        localStorage.removeItem(
            "cyberCoreAccounts"
        );
    }

    return [];
}

function saveRememberedAccounts(
    accounts
) {

    localStorage.setItem(
        "cyberCoreAccounts",
        JSON.stringify(accounts)
    );

}

function rememberAccount(
    userEmail,
    userPhone
) {

    if (!userEmail) {
        return;
    }

    var accounts =
        getRememberedAccounts();

    var found = false;

    var i = 0;

    while (i < accounts.length) {

        if (
            accounts[i].email &&
            accounts[i].email.toLowerCase() ===
            userEmail.toLowerCase()
        ) {

            accounts[i].phone =
                userPhone || "";

            found = true;

            break;
        }

        i++;
    }

    if (!found) {

        accounts.push({
            email: userEmail,
            phone: userPhone || ""
        });
    }

    if (
        accounts.length >
        MAX_ACCOUNTS
    ) {

        accounts =
            accounts.slice(
                accounts.length -
                MAX_ACCOUNTS
            );
    }

    saveRememberedAccounts(
        accounts
    );

}

function removeRememberedAccount(
    userEmail
) {

    if (!userEmail) {
        return;
    }

    var accounts =
        getRememberedAccounts();

    var filtered = [];

    var i = 0;

    while (i < accounts.length) {

        if (
            !accounts[i].email ||
            accounts[i].email.toLowerCase() !==
            userEmail.toLowerCase()
        ) {

            filtered.push(
                accounts[i]
            );
        }

        i++;
    }

    saveRememberedAccounts(
        filtered
    );

}

/* =====================================================
SAFE OLD LOCAL ACCOUNT CLEANUP
===================================================== */

function removeOldLocalTestAccounts() {

    var saved =
        localStorage.getItem(
            "cyberCoreAccounts"
        );

    if (!saved) {
        return;
    }

    try {

        var accounts =
            JSON.parse(saved);

        if (!Array.isArray(accounts)) {
            return;
        }

        var cleanAccounts = [];

        var i = 0;

        while (i < accounts.length) {

            var account =
                accounts[i];

            if (
                account &&
                Object.prototype.hasOwnProperty.call(
                    account,
                    "password"
                )
            ) {

                i++;

                continue;
            }

            cleanAccounts.push(
                account
            );

            i++;
        }

        localStorage.setItem(
            "cyberCoreAccounts",
            JSON.stringify(cleanAccounts)
        );

    } catch (error) {

        console.log(
            "Old local account cleanup error:",
            error
        );
    }

}

removeOldLocalTestAccounts();

/* =====================================================
LOGIN HISTORY
===================================================== */

function historyKey() {

    if (!currentUser) {
        return "";
    }

    return (
        "cyberCoreLoginHistory_" +
        currentUser.id
    );

}

function getLoginHistory() {

    var key =
        historyKey();

    if (key === "") {
        return [];
    }

    var saved =
        localStorage.getItem(key);

    if (!saved) {
        return [];
    }

    try {

        var parsed =
            JSON.parse(saved);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    } catch (error) {

        localStorage.removeItem(key);
    }

    return [];
}

function saveLoginHistory(
    history
) {

    var key =
        historyKey();

    if (key === "") {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(history)
    );

}

function addLoginHistory(
    accountEmail
) {

    var history =
        getLoginHistory();

    var now =
        new Date();

    history.unshift({
        email:
            accountEmail ||
            "OAuth Account",
        date:
            now.toLocaleDateString(),
        time:
            now.toLocaleTimeString()
    });

    if (history.length > 20) {
        history.length = 20;
    }

    saveLoginHistory(
        history
    );

}

/* =====================================================
ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    var div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(text);

    return div.innerHTML;
}

/* =====================================================
DISPLAY LOGIN HISTORY
===================================================== */

function displayLoginHistory() {

    if (!loginHistoryContent) {
        return;
    }

    var history =
        getLoginHistory();

    if (history.length === 0) {

        loginHistoryContent.textContent =
            "No login history yet.";

        return;
    }

    loginHistoryContent.innerHTML =
        "";

    var i = 0;

    while (i < history.length) {

        var item =
            history[i];

        var row =
            document.createElement(
                "div"
            );

        row.className =
            "history-item";

        row.innerHTML =
            '<span class="history-number">' +
            "#" +
            (i + 1) +
            "</span><br>" +
            "LOGIN SUCCESSFUL<br>" +
            "Email: " +
            escapeHTML(
                item.email
            ) +
            "<br>" +
            escapeHTML(
                item.date
            ) +
            " • " +
            escapeHTML(
                item.time
            );

        loginHistoryContent.appendChild(
            row
        );

        i++;
    }

}

/* =====================================================
UI
===================================================== */

function showRegister() {

    clearInterval(countdown);

    if (container) {
        container.style.display =
            "flex";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

    document.body.style.overflow =
        "";

    if (registerBox) {
        registerBox.style.display =
            "block";
    }

    if (otpBox) {
        otpBox.style.display =
            "none";
    }

    if (passwordBox) {
        passwordBox.style.display =
            "none";
    }

    if (loginBox) {
        loginBox.style.display =
            "none";
    }

}

function showOTP() {

    if (container) {
        container.style.display =
            "flex";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

    if (registerBox) {
        registerBox.style.display =
            "none";
    }

    if (otpBox) {
        otpBox.style.display =
            "block";
    }

    if (passwordBox) {
        passwordBox.style.display =
            "none";
    }

    if (loginBox) {
        loginBox.style.display =
            "none";
    }

}

function showPassword() {

    if (container) {
        container.style.display =
            "flex";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

    if (registerBox) {
        registerBox.style.display =
            "none";
    }

    if (otpBox) {
        otpBox.style.display =
            "none";
    }

    if (passwordBox) {
        passwordBox.style.display =
            "block";
    }

    if (loginBox) {
        loginBox.style.display =
            "none";
    }

}

function showLogin() {

    if (container) {
        container.style.display =
            "flex";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

    document.body.style.overflow =
        "";

    if (registerBox) {
        registerBox.style.display =
            "none";
    }

    if (otpBox) {
        otpBox.style.display =
            "none";
    }

    if (passwordBox) {
        passwordBox.style.display =
            "none";
    }

    if (loginBox) {
        loginBox.style.display =
            "block";
    }

}

/* =====================================================
RESET REGISTRATION
===================================================== */

function resetRegistrationForm() {

    clearInterval(countdown);

    generatedOTP = "";

    verifiedEmail = "";

    verifiedPhone = "";

    if (email) {
        email.value = "";
    }

    if (phone) {
        phone.value = "";
    }

    if (newPassword) {
        newPassword.value = "";
    }

    if (confirmPassword) {
        confirmPassword.value = "";
    }

    clearOTP();

    timeLeft = 60;

    if (timer) {

        timer.textContent =
            "OTP expires in: 60s";
    }

}

/* =====================================================
OTP
===================================================== */

function clearOTP() {

    var i = 0;

    while (i < otpInputs.length) {

        otpInputs[i].value = "";

        i++;
    }

}

function getEnteredOTP() {

    var result = "";

    var i = 0;

    while (i < otpInputs.length) {

        result +=
            otpInputs[i].value;

        i++;
    }

    return result;
}

var otpIndex = 0;

while (
    otpIndex <
    otpInputs.length
) {

    (function (currentIndex) {

        var currentBox =
            otpInputs[currentIndex];

        currentBox.oninput =
            function () {

                currentBox.value =
                    currentBox.value
                        .replace(/\D/g, "")
                        .slice(0, 1);

                if (
                    currentBox.value !==
                    "" &&
                    currentIndex <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        currentIndex + 1
                    ].focus();
                }

            };

        currentBox.onkeydown =
            function (event) {

                if (
                    event.key ===
                    "Backspace" &&
                    currentBox.value ===
                    "" &&
                    currentIndex > 0
                ) {

                    otpInputs[
                        currentIndex - 1
                    ].focus();
                }

            };

    })(otpIndex);

    otpIndex++;

}

/* =====================================================
SEND OTP
===================================================== */

if (sendBtn) {

    sendBtn.onclick =
        function () {

            var enteredEmail =
                email.value.trim();

            var enteredPhone =
                phone.value.trim();

            var accounts =
                getRememberedAccounts();

            if (
                accounts.length >=
                MAX_ACCOUNTS
            ) {

                message.textContent =
                    "❌ Maximum 5 accounts allowed.";

                return;
            }

            if (
                enteredEmail === ""
            ) {

                message.textContent =
                    "Please enter your Email❗";

                return;
            }

            if (
                !enteredEmail.includes("@") ||
                !enteredEmail.includes(".")
            ) {

                message.textContent =
                    "Please enter a valid Email❗";

                return;
            }

            if (
                enteredPhone === ""
            ) {

                message.textContent =
                    "Please enter your Phone Number❗";

                return;
            }

            var i = 0;

            while (
                i < accounts.length
            ) {

                if (
                    accounts[i].email &&
                    accounts[i].email.toLowerCase() ===
                    enteredEmail.toLowerCase()
                ) {

                    message.textContent =
                        "❌ This Email is already registered.";

                    return;
                }

                i++;
            }

            generatedOTP =
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                ).toString();

            verifiedEmail =
                enteredEmail;

            verifiedPhone =
                enteredPhone;

            clearOTP();

            showOTP();

            message.textContent =
                "🔐 DEMO OTP: " +
                generatedOTP;

            startTimer();
        };

}

/* =====================================================
OTP TIMER
===================================================== */

function startTimer() {

    clearInterval(countdown);

    timeLeft = 60;

    if (timer) {

        timer.textContent =
            "OTP expires in: 60s";
    }

    countdown =
        setInterval(
            function () {

                timeLeft--;

                if (
                    timeLeft > 0 &&
                    timer
                ) {

                    timer.textContent =
                        "OTP expires in: " +
                        timeLeft +
                        "s";
                }

                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        countdown
                    );

                    generatedOTP = "";

                    if (timer) {

                        timer.textContent =
                            "OTP EXPIRED❗";
                    }

                    if (message) {

                        message.textContent =
                            "❌ OTP expired. Please request a new OTP♻️";
                    }
                }

            },
            1000
        );

}

/* =====================================================
VERIFY OTP
===================================================== */

if (verifyBtn) {

    verifyBtn.onclick =
        function () {

            var enteredOTP =
                getEnteredOTP();

            if (
                enteredOTP.length !==
                6
            ) {

                message.textContent =
                    "Please enter all 6 OTP numbers⚠";

                return;
            }

            if (
                generatedOTP === ""
            ) {

                message.textContent =
                    "❌ OTP expired❗";

                return;
            }

            if (
                enteredOTP ===
                generatedOTP
            ) {

                clearInterval(
                    countdown
                );

                generatedOTP = "";

                showPassword();

                message.textContent =
                    "✔️ OTP Verified! Create your password❗";

            } else {

                message.textContent =
                    "❌ Incorrect OTP❗";
            }

        };

}

/* =====================================================
CREATE / UPDATE PROFILE
===================================================== */

async function createOrUpdateProfile(
    user,
    userPhone
) {

    if (
        !supabaseClient ||
        !user
    ) {
        return null;
    }

    var defaultUsername =
        "USER";

    if (
        user.user_metadata &&
        user.user_metadata.full_name
    ) {

        defaultUsername =
            user.user_metadata.full_name;

    } else if (
        user.user_metadata &&
        user.user_metadata.name
    ) {

        defaultUsername =
            user.user_metadata.name;
    }

    var result =
        await supabaseClient
            .from("profiles")
            .select(
                "id, username, birthday, phone, profile_picture"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();

    if (result.error) {

        console.log(
            "Profile select error:",
            result.error.message
        );

        return null;
    }

    if (result.data) {

        if (
            userPhone &&
            result.data.phone !==
            userPhone
        ) {

            var updateResult =
                await supabaseClient
                    .from("profiles")
                    .update({
                        phone:
                            userPhone
                    })
                    .eq(
                        "id",
                        user.id
                    );

            if (updateResult.error) {

                console.log(
                    "Phone update error:",
                    updateResult.error.message
                );
            }
        }

        return result.data;
    }

    var insertResult =
        await supabaseClient
            .from("profiles")
            .insert({
                id:
                    user.id,
                username:
                    defaultUsername,
                phone:
                    userPhone || "",
                birthday:
                    null,
                profile_picture:
                    null
            })
            .select(
                "id, username, birthday, phone, profile_picture"
            )
            .single();

    if (insertResult.error) {

        console.log(
            "Profile insert error:",
            insertResult.error.message
        );

        return null;
    }

    return insertResult.data;
}

/* =====================================================
LOAD PROFILE
===================================================== */

async function loadProfile() {

    if (
        !supabaseClient ||
        !currentUser
    ) {
        return null;
    }

    var result =
        await supabaseClient
            .from("profiles")
            .select(
                "id, username, birthday, phone, profile_picture"
            )
            .eq(
                "id",
                currentUser.id
            )
            .maybeSingle();

    if (result.error) {

        console.log(
            "Profile load error:",
            result.error.message
        );

        return null;
    }

    currentProfile =
        result.data;

    return currentProfile;
}

/* =====================================================
PROFILE PICTURE URL
===================================================== */

async function getProfilePictureURL(
    path
) {

    if (
        !supabaseClient ||
        !path
    ) {
        return "";
    }

    var result =
        await supabaseClient
            .storage
            .from(
                STORAGE_BUCKET
            )
            .createSignedUrl(
                path,
                3600
            );

    if (result.error) {

        console.log(
            "Signed URL error:",
            result.error.message
        );

        return "";
    }

    return (
        result.data.signedUrl ||
        ""
    );
}

/* =====================================================
UPDATE PROFILE UI
===================================================== */

async function updateProfile() {

    if (!currentUser) {
        return;
    }

    var profile =
        await loadProfile();

    if (!profile) {

        profile =
            await createOrUpdateProfile(
                currentUser,
                currentAccountPhone
            );
    }

    if (!profile) {

        if (profileMessage) {

            profileMessage.textContent =
                "⚠️ Profile data could not be loaded.";
        }

        return;
    }

    currentProfile =
        profile;

    if (profileUsername) {

        profileUsername.textContent =
            profile.username ||
            "USER";
    }

    if (profileEmail) {

        profileEmail.textContent =
            currentUser.email ||
            "-";
    }

    if (profilePhone) {

        profilePhone.textContent =
            profile.phone ||
            currentAccountPhone ||
            "-";
    }

    if (profileBirthday) {

        profileBirthday.textContent =
            profile.birthday ||
            "Not added";
    }

    if (editUsername) {

        editUsername.value =
            profile.username ||
            "USER";
    }

    if (editBirthday) {

        editBirthday.value =
            profile.birthday ||
            "";
    }

    if (
        profile.profile_picture &&
        profilePicture
    ) {

        var pictureURL =
            await getProfilePictureURL(
                profile.profile_picture
            );

        if (
            pictureURL !== ""
        ) {

            profilePicture.src =
                pictureURL;

            profilePicture.style.display =
                "block";

            if (
                profilePicturePlaceholder
            ) {

                profilePicturePlaceholder.style.display =
                    "none";
            }
        }

    } else {

        if (profilePicture) {

            profilePicture.src =
                "";

            profilePicture.style.display =
                "none";
        }

        if (
            profilePicturePlaceholder
        ) {

            profilePicturePlaceholder.style.display =
                "block";
        }
    }
}

/* =====================================================
SAVE PROFILE
===================================================== */

if (saveProfileBtn) {

    saveProfileBtn.onclick =
        async function () {

            if (
                !supabaseClient ||
                !currentUser
            ) {
                return;
            }

            var username =
                editUsername.value.trim();

            var birthday =
                editBirthday.value;

            if (
                username === ""
            ) {

                profileMessage.textContent =
                    "Please enter a username.";

                return;
            }

            if (
                username.length > 30
            ) {

                profileMessage.textContent =
                    "Username must be 30 characters or less.";

                return;
            }

            saveProfileBtn.disabled =
                true;

            profileMessage.textContent =
                "Saving...";

            var result =
                await supabaseClient
                    .from("profiles")
                    .upsert({
                        id:
                            currentUser.id,
                        username:
                            username,
                        birthday:
                            birthday ||
                            null,
                        phone:
                            currentAccountPhone ||
                            ""
                    })
                    .select(
                        "id, username, birthday, phone, profile_picture"
                    )
                    .single();

            saveProfileBtn.disabled =
                false;

            if (result.error) {

                profileMessage.textContent =
                    "❌ " +
                    result.error.message;

                return;
            }

            currentProfile =
                result.data;

            await updateProfile();

            profileMessage.textContent =
                "✔️ Profile updated successfully.";
        };

}

/* =====================================================
PROFILE PICTURE UPLOAD
===================================================== */

if (profilePictureInput) {

    profilePictureInput.onchange =
        async function () {

            var file =
                profilePictureInput.files[0];

            if (!file) {
                return;
            }

            if (!currentUser) {

                alert(
                    "Please login first."
                );

                return;
            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image."
                );

                return;
            }

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Please select an image smaller than 5 MB."
                );

                return;
            }

            var extension =
                "jpg";

            if (
                file.type ===
                "image/png"
            ) {

                extension =
                    "png";

            } else if (
                file.type ===
                "image/webp"
            ) {

                extension =
                    "webp";

            } else if (
                file.type ===
                "image/gif"
            ) {

                extension =
                    "gif";
            }

            var path =
                currentUser.id +
                "/profile-picture." +
                extension;

            profileMessage.textContent =
                "Uploading profile picture...";

            var uploadResult =
                await supabaseClient
                    .storage
                    .from(
                        STORAGE_BUCKET
                    )
                    .upload(
                        path,
                        file,
                        {
                            upsert: true,
                            contentType:
                                file.type
                        }
                    );

            if (
                uploadResult.error
            ) {

                profileMessage.textContent =
                    "❌ Upload failed: " +
                    uploadResult.error.message;

                profilePictureInput.value =
                    "";

                return;
            }

            var updateResult =
                await supabaseClient
                    .from("profiles")
                    .update({
                        profile_picture:
                            path
                    })
                    .eq(
                        "id",
                        currentUser.id
                    );

            if (
                updateResult.error
            ) {

                profileMessage.textContent =
                    "❌ Picture saved, but profile update failed: " +
                    updateResult.error.message;

                return;
            }

            profilePictureInput.value =
                "";

            await updateProfile();

            profileMessage.textContent =
                "✔️ Profile picture updated successfully.";

            updateStorage();
        };

}

/* =====================================================
NORMAL LOGIN
===================================================== */

if (loginBtn) {

    loginBtn.onclick =
        async function () {

            if (!supabaseClient) {

                message.textContent =
                    "❌ Supabase could not be loaded.";

                return;
            }

            var enteredEmail =
                loginEmail.value.trim();

            var enteredPhone =
                loginPhone.value.trim();

            var enteredPassword =
                loginPassword.value;

            if (
                enteredEmail === ""
            ) {

                message.textContent =
                    "Please enter your Email❗";

                return;
            }

            if (
                enteredPhone === ""
            ) {

                message.textContent =
                    "Please enter your Phone Number❗";

                return;
            }

            if (
                enteredPassword === ""
            ) {

                message.textContent =
                    "Please enter your Password❗";

                return;
            }

            loginBtn.disabled =
                true;

            message.textContent =
                "Checking account...";

            var loginResult =
                await supabaseClient.auth
                    .signInWithPassword({
                        email:
                            enteredEmail,
                        password:
                            enteredPassword
                    });

            loginBtn.disabled =
                false;

            if (
                loginResult.error
            ) {

                message.textContent =
                    "❌ " +
                    loginResult.error.message;

                return;
            }

            currentUser =
                loginResult.data.user;

            currentAccountEmail =
                enteredEmail;

            currentAccountPhone =
                enteredPhone;

            verifiedEmail =
                enteredEmail;

            verifiedPhone =
                enteredPhone;

            googleOAuthLogin =
                false;

            githubOAuthLogin =
                false;

            rememberAccount(
                enteredEmail,
                enteredPhone
            );

            await createOrUpdateProfile(
                currentUser,
                enteredPhone
            );

            addLoginHistory(
                enteredEmail
            );

            loginPassword.value =
                "";

            message.textContent =
                "✔️ LOGIN SUCCESSFUL❗";

            await showDashboard();
        };

}

/* =====================================================
OAUTH PROVIDER DETECTION
===================================================== */

function getOAuthProvider(
    user
) {

    if (!user) {
        return "";
    }

    var metadata =
        user.app_metadata || {};

    var provider =
        metadata.provider || "";

    var providers =
        metadata.providers || [];

    if (
        provider === "google"
    ) {

        return "google";
    }

    if (
        provider === "github"
    ) {

        return "github";
    }

    if (
        Array.isArray(providers)
    ) {

        if (
            providers.indexOf(
                "google"
            ) !== -1
        ) {

            return "google";
        }

        if (
            providers.indexOf(
                "github"
            ) !== -1
        ) {

            return "github";
        }
    }

    return "";
}

function isGoogleUser(
    user
) {

    return (
        getOAuthProvider(user) ===
        "google"
    );
}

function isGithubUser(
    user
) {

    return (
        getOAuthProvider(user) ===
        "github"
    );
}

function isOAuthUser(
    user
) {

    return (
        getOAuthProvider(user) !==
        ""
    );
}

/* =====================================================
OAUTH CALLBACK DETECTION
===================================================== */

function isOAuthCallback() {

    var hash =
        window.location.hash || "";

    var search =
        window.location.search || "";

    return (
        hash.indexOf(
            "access_token="
        ) !== -1 ||
        hash.indexOf(
            "refresh_token="
        ) !== -1 ||
        search.indexOf(
            "code="
        ) !== -1
    );
}

/* =====================================================
OAUTH REDIRECT OPTIONS
===================================================== */

function getOAuthOptions() {

    return {

        queryParams: {
            prompt:
                "select_account"
        },

        redirectTo:
            OAUTH_REDIRECT_URL

    };
}

/* =====================================================
HANDLE OAUTH USER
===================================================== */

async function handleOAuthUser(
    user,
    provider
) {

    if (
        !user ||
        oauthHandling
    ) {
        return;
    }

    oauthHandling =
        true;

    currentUser =
        user;

    currentAccountEmail =
        user.email || "";

    currentAccountPhone =
        "";

    verifiedEmail =
        currentAccountEmail;

    verifiedPhone =
        "";

    googleOAuthLogin =
        provider === "google";

    githubOAuthLogin =
        provider === "github";

    if (
        currentAccountEmail
    ) {

        rememberAccount(
            currentAccountEmail,
            ""
        );
    }

    await createOrUpdateProfile(
        currentUser,
        ""
    );

    addLoginHistory(
        currentAccountEmail ||
        provider.toUpperCase() +
        " ACCOUNT"
    );

    if (loginEmail) {

        loginEmail.value =
            currentAccountEmail;
    }

    if (loginPhone) {

        loginPhone.value =
            "";
    }

    if (loginPassword) {

        loginPassword.value =
            "";
    }

    if (provider === "google") {

        message.textContent =
            "✔️ GOOGLE LOGIN SUCCESSFUL❗";

    } else if (
        provider === "github"
    ) {

        message.textContent =
            "✔️ GITHUB LOGIN SUCCESSFUL❗";
    }

    await showDashboard();

    oauthCallbackHandled =
        true;

    oauthHandling =
        false;
}

/* =====================================================
HANDLE GOOGLE USER
===================================================== */

async function handleGoogleUser(
    user
) {

    await handleOAuthUser(
        user,
        "google"
    );
}

/* =====================================================
HANDLE GITHUB USER
===================================================== */

async function handleGithubUser(
    user
) {

    await handleOAuthUser(
        user,
        "github"
    );
}

/* =====================================================
GOOGLE LOGIN
===================================================== */

if (googleLoginBtn) {

    googleLoginBtn.onclick =
        async function () {

            if (!supabaseClient) {

                message.textContent =
                    "❌ Supabase could not be loaded.";

                return;
            }

            googleLoginBtn.disabled =
                true;

            if (githubLoginBtn) {

                githubLoginBtn.disabled =
                    true;
            }

            message.textContent =
                "Opening Google...";

            try {

                var result =
                    await supabaseClient.auth
                        .signInWithOAuth({
                            provider:
                                "google",
                            options:
                                getOAuthOptions()
                        });

                if (
                    result.error
                ) {

                    googleLoginBtn.disabled =
                        false;

                    if (githubLoginBtn) {

                        githubLoginBtn.disabled =
                            false;
                    }

                    message.textContent =
                        "❌ " +
                        result.error.message;

                    return;
                }

            } catch (error) {

                googleLoginBtn.disabled =
                    false;

                if (githubLoginBtn) {

                    githubLoginBtn.disabled =
                        false;
                }

                message.textContent =
                    "❌ Google login failed.";

                console.log(
                    "Google OAuth error:",
                    error
                );
            }
        };

}

/* =====================================================
GITHUB LOGIN
===================================================== */

if (githubLoginBtn) {

    githubLoginBtn.onclick =
        async function () {

            if (!supabaseClient) {

                message.textContent =
                    "❌ Supabase could not be loaded.";

                return;
            }

            githubLoginBtn.disabled =
                true;

            if (googleLoginBtn) {

                googleLoginBtn.disabled =
                    true;
            }

            message.textContent =
                "Opening GitHub...";

            try {

                var result =
                    await supabaseClient.auth
                        .signInWithOAuth({
                            provider:
                                "github",
                            options:
                                getOAuthOptions()
                        });

                if (
                    result.error
                ) {

                    githubLoginBtn.disabled =
                        false;

                    if (googleLoginBtn) {

                        googleLoginBtn.disabled =
                            false;
                    }

                    message.textContent =
                        "❌ " +
                        result.error.message;

                    return;
                }

            } catch (error) {

                githubLoginBtn.disabled =
                    false;

                if (googleLoginBtn) {

                    googleLoginBtn.disabled =
                        false;
                }

                message.textContent =
                    "❌ GitHub login failed.";

                console.log(
                    "GitHub OAuth error:",
                    error
                );
            }
        };

}

/* =====================================================
CREATE ACCOUNT
===================================================== */

if (saveBtn) {

    saveBtn.onclick =
        async function () {

            if (!supabaseClient) {

                message.textContent =
                    "❌ Supabase could not be loaded.";

                return;
            }

            var pass =
                newPassword.value;

            var confirm =
                confirmPassword.value;

            if (
                pass === ""
            ) {

                message.textContent =
                    "Please create a password❗";

                return;
            }

            if (
                pass.length < 6
            ) {

                message.textContent =
                    "Password must be at least 6 characters❗";

                return;
            }

            if (
                pass !== confirm
            ) {

                message.textContent =
                    "❌ Passwords do not match❗";

                return;
            }

            if (
                verifiedEmail === ""
            ) {

                message.textContent =
                    "❌ Registration session expired. Start again.";

                showRegister();

                return;
            }

            saveBtn.disabled =
                true;

            message.textContent =
                "Creating Supabase account...";

            try {

                var signupResult =
                    await supabaseClient.auth
                        .signUp({
                            email:
                                verifiedEmail,
                            password:
                                pass,
                            options: {
                                data: {
                                    phone:
                                        verifiedPhone
                                }
                            }
                        });

                if (
                    signupResult.error
                ) {

                    saveBtn.disabled =
                        false;

                    message.textContent =
                        "❌ " +
                        signupResult.error.message;

                    return;
                }

                var newUser =
                    signupResult.data.user;

                var newSession =
                    signupResult.data.session;

                if (!newUser) {

                    saveBtn.disabled =
                        false;

                    message.textContent =
                        "❌ Account could not be created.";

                    return;
                }

                rememberAccount(
                    verifiedEmail,
                    verifiedPhone
                );

                if (newSession) {

                    await supabaseClient.auth
                        .signOut();
                }

                currentUser =
                    null;

                currentProfile =
                    null;

                currentAccountEmail =
                    "";

                currentAccountPhone =
                    "";

                newPassword.value =
                    "";

                confirmPassword.value =
                    "";

                saveBtn.disabled =
                    false;

                loginEmail.value =
                    verifiedEmail;

                loginPhone.value =
                    verifiedPhone;

                loginPassword.value =
                    "";

                verifiedEmail =
                    "";

                verifiedPhone =
                    "";

                generatedOTP =
                    "";

                clearInterval(
                    countdown
                );

                showLogin();

                message.textContent =
                    "✔️ Account created successfully! Please LOGIN.";

            } catch (error) {

                saveBtn.disabled =
                    false;

                message.textContent =
                    "❌ Account creation failed.";

                console.log(
                    "Signup error:",
                    error
                );
            }
        };

}

/* =====================================================
CREATE NEW ACCOUNT
===================================================== */

if (createAccountBtn) {

    createAccountBtn.onclick =
        function () {

            var accounts =
                getRememberedAccounts();

            if (
                accounts.length >=
                MAX_ACCOUNTS
            ) {

                message.textContent =
                    "❌ Maximum 5 accounts allowed.";

                return;
            }

            resetRegistrationForm();

            loginEmail.value =
                "";

            loginPhone.value =
                "";

            loginPassword.value =
                "";

            message.textContent =
                "Create your new account❗";

            showRegister();
        };

}

/* =====================================================
ADD ACCOUNT
===================================================== */

if (addAccountBtn) {

    addAccountBtn.onclick =
        function () {

            var accounts =
                getRememberedAccounts();

            if (
                accounts.length >=
                MAX_ACCOUNTS
            ) {

                alert(
                    "❌ Maximum 5 accounts allowed."
                );

                return;
            }

            resetRegistrationForm();

            loginEmail.value =
                "";

            loginPhone.value =
                "";

            loginPassword.value =
                "";

            showRegister();

            message.textContent =
                "➕ Add a new account.";
        };

}

/* =====================================================
DASHBOARD
===================================================== */

async function showDashboard() {

    if (!dashboard) {
        return;
    }

    if (!currentUser) {

        showLogin();

        return;
    }

    if (container) {

        container.style.display =
            "none";
    }

    dashboard.style.display =
        "block";

    document.body.style.overflow =
        "hidden";

    await updateProfile();

    displayLoginHistory();

    updateStorage();

    closeAllProfileBoxes();

    setupNavigation();

    activateHome();
}

/* =====================================================
NAVIGATION
===================================================== */

function activateHome() {

    var navItems =
        document.querySelectorAll(
            ".magic-nav .nav-item"
        );

    var pages =
        document.querySelectorAll(
            ".dashboard-page"
        );

    var i = 0;

    while (
        i < navItems.length
    ) {

        navItems[i].classList.remove(
            "active"
        );

        i++;
    }

    i = 0;

    while (
        i < pages.length
    ) {

        pages[i].classList.remove(
            "active-page"
        );

        i++;
    }

    var homeNav =
        document.querySelector(
            '.nav-item[data-page="homePage"]'
        );

    var homePage =
        document.getElementById(
            "homePage"
        );

    if (homeNav) {

        homeNav.classList.add(
            "active"
        );
    }

    if (homePage) {

        homePage.classList.add(
            "active-page"
        );
    }
}

function setupNavigation() {

    var navItems =
        document.querySelectorAll(
            ".magic-nav .nav-item"
        );

    var pages =
        document.querySelectorAll(
            ".dashboard-page"
        );

    var i = 0;

    while (
        i < navItems.length
    ) {

        (function (currentNav) {

            currentNav.onclick =
                async function () {

                    var pageId =
                        currentNav.getAttribute(
                            "data-page"
                        );

                    var j = 0;

                    while (
                        j <
                        navItems.length
                    ) {

                        navItems[j]
                            .classList
                            .remove(
                                "active"
                            );

                        j++;
                    }

                    j = 0;

                    while (
                        j <
                        pages.length
                    ) {

                        pages[j]
                            .classList
                            .remove(
                                "active-page"
                            );

                        j++;
                    }

                    currentNav
                        .classList
                        .add(
                            "active"
                        );

                    var target =
                        document.getElementById(
                            pageId
                        );

                    if (target) {

                        target.classList.add(
                            "active-page"
                        );
                    }

                    if (
                        pageId ===
                        "homePage"
                    ) {

                        displayLoginHistory();

                        updateStorage();
                    }

                    if (
                        pageId ===
                        "addPage"
                    ) {

                        await loadSecurityItems();

                        updateStorage();
                    }

                    if (
                        pageId ===
                        "profilePage"
                    ) {

                        await updateProfile();

                        displayAccounts();
                    }

                };

        })(navItems[i]);

        i++;
    }

}

/* =====================================================
CLOSE BOXES
===================================================== */

function closeAllProfileBoxes() {

    if (accountChangeBox) {

        accountChangeBox.classList.remove(
            "show-box"
        );
    }

    if (loginHistoryBox) {

        loginHistoryBox.classList.remove(
            "show-box"
        );
    }

    if (changePasswordBox) {

        changePasswordBox.classList.remove(
            "show-box"
        );
    }

    if (storageBox) {

        storageBox.classList.remove(
            "show-box"
        );
    }

}

/* =====================================================
LOGIN HISTORY BUTTON
===================================================== */

if (loginHistoryBtn) {

    loginHistoryBtn.onclick =
        function () {

            loginHistoryBox.classList.toggle(
                "show-box"
            );

            displayLoginHistory();
        };

}

if (clearHistoryBtn) {

    clearHistoryBtn.onclick =
        function () {

            var confirmed =
                window.confirm(
                    "Clear all login history?"
                );

            if (!confirmed) {
                return;
            }

            var key =
                historyKey();

            if (key !== "") {

                localStorage.removeItem(
                    key
                );
            }

            displayLoginHistory();
        };

}

/* =====================================================
CHANGE PASSWORD BOX
===================================================== */

if (changePasswordBtn) {

    changePasswordBtn.onclick =
        function () {

            changePasswordBox.classList.toggle(
                "show-box"
            );

            if (
                changePasswordBox.classList.contains(
                    "show-box"
                )
            ) {

                oldPassword.value =
                    "";

                changeNewPassword.value =
                    "";

                changeConfirmPassword.value =
                    "";

                changePasswordMessage.textContent =
                    "";
            }
        };

}

/* =====================================================
CHANGE PASSWORD
===================================================== */

if (saveChangedPasswordBtn) {

    saveChangedPasswordBtn.onclick =
        async function () {

            if (
                !supabaseClient ||
                !currentUser
            ) {
                return;
            }

            if (
                isGoogleUser(
                    currentUser
                )
            ) {

                changePasswordMessage.textContent =
                    "Google accounts should manage their password through Google.";

                return;
            }

            if (
                isGithubUser(
                    currentUser
                )
            ) {

                changePasswordMessage.textContent =
                    "GitHub accounts should manage their password through GitHub.";

                return;
            }

            var currentPass =
                oldPassword.value;

            var newPass =
                changeNewPassword.value;

            var confirmPass =
                changeConfirmPassword.value;

            if (
                currentPass === ""
            ) {

                changePasswordMessage.textContent =
                    "Please enter your current password.";

                return;
            }

            if (
                newPass === ""
            ) {

                changePasswordMessage.textContent =
                    "Please enter a new password.";

                return;
            }

            if (
                newPass.length < 6
            ) {

                changePasswordMessage.textContent =
                    "Password must be at least 6 characters.";

                return;
            }

            if (
                newPass !==
                confirmPass
            ) {

                changePasswordMessage.textContent =
                    "❌ New passwords do not match.";

                return;
            }

            if (
                newPass ===
                currentPass
            ) {

                changePasswordMessage.textContent =
                    "❌ New password must be different.";

                return;
            }

            saveChangedPasswordBtn.disabled =
                true;

            changePasswordMessage.textContent =
                "Checking current password...";

            var authCheck =
                await supabaseClient.auth
                    .signInWithPassword({
                        email:
                            currentUser.email,
                        password:
                            currentPass
                    });

            if (
                authCheck.error
            ) {

                saveChangedPasswordBtn.disabled =
                    false;

                changePasswordMessage.textContent =
                    "❌ Current password is incorrect.";

                return;
            }

            var updateResult =
                await supabaseClient.auth
                    .updateUser({
                        password:
                            newPass
                    });

            saveChangedPasswordBtn.disabled =
                false;

            if (
                updateResult.error
            ) {

                changePasswordMessage.textContent =
                    "❌ " +
                    updateResult.error.message;

                return;
            }

            oldPassword.value =
                "";

            changeNewPassword.value =
                "";

            changeConfirmPassword.value =
                "";

            changePasswordMessage.textContent =
                "✔️ Password changed successfully.";
        };

}

/* =====================================================
STORAGE
===================================================== */

async function updateStorage() {

    if (
        !storageUsed ||
        !storageProgress ||
        !storageDetails
    ) {
        return;
    }

    if (
        !supabaseClient ||
        !currentUser
    ) {

        storageUsed.textContent =
            "0 KB";

        storageDetails.textContent =
            "Please login to check cloud storage.";

        storageProgress.style.width =
            "0%";

        return;
    }

    storageUsed.textContent =
        "Checking...";

    storageDetails.textContent =
        "Checking cloud storage...";

    var result =
        await supabaseClient
            .storage
            .from(
                STORAGE_BUCKET
            )
            .list(
                currentUser.id,
                {
                    limit: 1000,
                    offset: 0
                }
            );

    if (result.error) {

        storageUsed.textContent =
            "Unavailable";

        storageDetails.textContent =
            "Storage check failed.";

        storageProgress.style.width =
            "0%";

        console.log(
            "Storage list error:",
            result.error.message
        );

        return;
    }

    var files =
        result.data || [];

    var totalBytes =
        0;

    var i = 0;

    while (
        i < files.length
    ) {

        if (
            files[i] &&
            files[i].metadata &&
            typeof files[i].metadata.size ===
            "number"
        ) {

            totalBytes +=
                files[i].metadata.size;
        }

        i++;
    }

    var kb =
        totalBytes / 1024;

    var mb =
        kb / 1024;

    var display;

    if (mb >= 1) {

        display =
            mb.toFixed(2) +
            " MB";

    } else if (kb >= 1) {

        display =
            kb.toFixed(2) +
            " KB";

    } else {

        display =
            totalBytes.toFixed(0) +
            " B";
    }

    storageUsed.textContent =
        display;

    var referenceBytes =
        STORAGE_REFERENCE_GB *
        1024 *
        1024 *
        1024;

    var percent =
        (
            totalBytes /
            referenceBytes
        ) * 100;

    if (percent > 100) {
        percent = 100;
    }

    if (percent < 0) {
        percent = 0;
    }

    storageProgress.style.width =
        percent + "%";

    storageDetails.textContent =
        "Cloud storage used: " +
        display +
        " • Reference: " +
        STORAGE_REFERENCE_GB +
        " GB";

}

/* =====================================================
STORAGE BUTTON
===================================================== */

if (storageBtn) {

    storageBtn.onclick =
        function () {

            if (!storageBox) {
                return;
            }

            storageBox.classList.toggle(
                "show-box"
            );

            if (
                storageBox.classList.contains(
                    "show-box"
                )
            ) {

                updateStorage();
            }
        };

}

/* =====================================================
ADD PAGE - FILE NAME DISPLAY
===================================================== */

if (addFileInput) {

    addFileInput.onchange =
        function () {

            if (!addFileName) {
                return;
            }

            var file =
                addFileInput.files[0];

            if (!file) {

                addFileName.textContent =
                    "No file selected";

                return;
            }

            addFileName.textContent =
                file.name;
        };

}

/* =====================================================
ADD PAGE - MESSAGE
===================================================== */

function setAddFileMessage(
    text,
    success
) {

    if (!addFileMessage) {
        return;
    }

    addFileMessage.textContent =
        text;

    if (success) {

        addFileMessage.classList.add(
            "success-message"
        );

        addFileMessage.classList.remove(
            "error-message"
        );

    } else {

        addFileMessage.classList.add(
            "error-message"
        );

        addFileMessage.classList.remove(
            "success-message"
        );
    }

}

/* =====================================================
ADD PAGE - SAFE FILE NAME
===================================================== */

function createSafeFileName(
    fileName
) {

    var safeName =
        String(fileName || "")
            .replace(
                /[^\w.\-]/g,
                "_"
            );

    if (safeName === "") {
        safeName = "file";
    }

    return safeName;
}

/* =====================================================
ADD PAGE - FORMAT FILE SIZE
===================================================== */

function formatFileSize(
    bytes
) {

    var size =
        Number(bytes) || 0;

    if (size < 1024) {

        return (
            size.toFixed(0) +
            " B"
        );
    }

    if (size < 1024 * 1024) {

        return (
            (size / 1024).toFixed(2) +
            " KB"
        );
    }

    if (size < 1024 * 1024 * 1024) {

        return (
            (size / (1024 * 1024)).toFixed(2) +
            " MB"
        );
    }

    return (
        (size / (1024 * 1024 * 1024)).toFixed(2) +
        " GB"
    );
}

/* =====================================================
ADD PAGE - LOAD SAVED SECURITY ITEMS
===================================================== */

async function loadSecurityItems() {

    if (!securityItemsList) {
        return;
    }

    if (
        !supabaseClient ||
        !currentUser
    ) {

        securityItemsList.textContent =
            "Please login to view saved files.";

        return;
    }

    securityItemsList.textContent =
        "Loading saved files...";

    var result =
        await supabaseClient
            .from("security_items")
            .select("*")
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (result.error) {

        securityItemsList.textContent =
            "❌ Could not load saved files.";

        console.log(
            "Security items load error:",
            result.error.message
        );

        return;
    }

    var items =
        result.data || [];

    securityItemsList.innerHTML =
        "";

    if (items.length === 0) {

        securityItemsList.textContent =
            "No files saved yet.";

        return;
    }

    var i = 0;

    while (i < items.length) {

        createSecurityItemElement(
            items[i]
        );

        i++;
    }

}

/* =====================================================
ADD PAGE - VIEW FILE
===================================================== */

/* =====================================================
ADD PAGE - IMAGE FILE CHECK
===================================================== */

function isImageFilePath(
    filePath
) {

    var pathValue =
        String(filePath || "");

    var parts =
        pathValue.split(".");

    var extension =
        parts.length > 1
            ? parts[
                parts.length - 1
            ].toLowerCase()
            : "";

    var imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "bmp",
        "svg"
    ];

    return (
        imageExtensions.indexOf(
            extension
        ) !== -1
    );
}

/* =====================================================
ADD PAGE - VIEW FILE
===================================================== */

async function viewSecurityItem(
    item,
    button
) {

    if (
        !supabaseClient ||
        !currentUser ||
        !item ||
        !item.file_path
    ) {
        return;
    }

    var isImage =
        isImageFilePath(
            item.file_path
        );

    var isCloudinaryFile =
        item.file_path.indexOf(
            "http"
        ) === 0;

    var viewWindow =
        null;

    if (isImage) {

        viewWindow =
            window.open(
                "",
                "_blank"
            );

        if (viewWindow) {

            viewWindow.document.write(
                "<!DOCTYPE html><html><head><title>Loading...</title>" +
                "<style>body{margin:0;background:#000;" +
                "display:flex;align-items:center;justify-content:center;" +
                "min-height:100vh;color:#00ff00;" +
                "font-family:sans-serif;}</style></head>" +
                "<body>Loading...</body></html>"
            );
        }
    }

    var originalText =
        button
            ? button.textContent
            : "VIEW";

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "OPENING...";
    }

    var signedUrl =
        "";

    if (isCloudinaryFile) {

        signedUrl =
            item.file_path;

    } else {

        var result =
            await supabaseClient
                .storage
                .from(
                    STORAGE_BUCKET
                )
                .createSignedUrl(
                    item.file_path,
                    3600
                );

        if (result.error) {

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    originalText;
            }

            if (viewWindow) {

                viewWindow.close();
            }

            alert(
                "❌ File could not be opened: " +
                result.error.message
            );

            return;
        }

        signedUrl =
            result.data.signedUrl;
    }

    if (button) {

        button.disabled =
            false;

        button.textContent =
            originalText;
    }

    if (isImage) {

        if (viewWindow) {

            var safeTitle =
                escapeHTML(
                    item.title ||
                    "File"
                );

            viewWindow.document.open();

            viewWindow.document.write(
                "<!DOCTYPE html><html><head><title>" +
                safeTitle +
                "</title><style>" +
                "body{margin:0;background:#000;" +
                "display:flex;align-items:center;" +
                "justify-content:center;min-height:100vh;}" +
                "img{max-width:100%;max-height:100vh;" +
                "object-fit:contain;}" +
                "</style></head><body>" +
                "<img src=\"" +
                signedUrl +
                "\" alt=\"" +
                safeTitle +
                "\"></body></html>"
            );

            viewWindow.document.close();

            return;
        }

        window.open(
            signedUrl,
            "_blank"
        );

        return;
    }

    window.open(
        signedUrl,
        "_blank"
    );

}

/* =====================================================
ADD PAGE - CREATE SAVED ITEM UI
===================================================== */

function createSecurityItemElement(
    item
) {

    if (!securityItemsList) {
        return;
    }

    var itemBox =
        document.createElement(
            "div"
        );

    itemBox.className =
        "security-item";

    var titleElement =
        document.createElement(
            "div"
        );

    titleElement.className =
        "security-item-title";

    titleElement.textContent =
        item.title ||
        "Untitled File";

    var categoryElement =
        document.createElement(
            "div"
        );

    categoryElement.className =
        "security-item-category";

    categoryElement.textContent =
        "CATEGORY: " +
        (
            item.category ||
            "Other"
        );

    var fileName =
        "";

    if (item.file_path) {

        var pathParts =
            item.file_path.split("/");

        fileName =
            pathParts[
                pathParts.length - 1
            ];
    }

    if (fileName) {

        var fileElement =
            document.createElement(
                "div"
            );

        fileElement.className =
            "security-item-file";

        fileElement.textContent =
            "FILE: " +
            fileName;

        itemBox.appendChild(
            fileElement
        );
    }

    var infoBox =
        document.createElement(
            "div"
        );

    infoBox.className =
        "security-item-info";

    infoBox.appendChild(
        titleElement
    );

    infoBox.appendChild(
        categoryElement
    );

    var buttonBox =
        document.createElement(
            "div"
        );

    buttonBox.className =
        "security-item-actions";

    var viewButton =
        document.createElement(
            "button"
        );

    viewButton.type =
        "button";

    viewButton.className =
        "security-view-button";

    viewButton.textContent =
        "VIEW";

    viewButton.onclick =
        function () {

            viewSecurityItem(
                item,
                viewButton
            );
        };

    buttonBox.appendChild(
        viewButton
    );

    var editButton =
        document.createElement(
            "button"
        );

    editButton.type =
        "button";

    editButton.className =
        "security-edit-button";

    editButton.textContent =
        "EDIT";

    editButton.onclick =
        function () {

            editSecurityItem(
                item
            );
        };

    var deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "security-delete-button";

    deleteButton.textContent =
        "DELETE";

    deleteButton.onclick =
        function () {

            deleteSecurityItem(
                item
            );
        };

    buttonBox.appendChild(
        editButton
    );

    buttonBox.appendChild(
        deleteButton
    );

    itemBox.appendChild(
        infoBox
    );

    itemBox.appendChild(
        buttonBox
    );

    securityItemsList.appendChild(
        itemBox
    );

}

/* =====================================================
ADD PAGE - SAVE FILE
===================================================== */

if (saveFileBtn) {

    saveFileBtn.onclick =
        async function () {

            if (
                !supabaseClient ||
                !currentUser
            ) {

                setAddFileMessage(
                    "❌ Please login first.",
                    false
                );

                return;
            }

            if (!addFileInput) {

                setAddFileMessage(
                    "❌ File input is unavailable.",
                    false
                );

                return;
            }

            var file =
                addFileInput.files[0];

            var title =
                addTitle
                    ? addTitle.value.trim()
                    : "";

            var category =
                addCategory
                    ? addCategory.value
                    : "";

            if (!file) {

                setAddFileMessage(
                    "❌ Please select a file.",
                    false
                );

                return;
            }

            if (title === "") {

                setAddFileMessage(
                    "❌ Please enter a file title.",
                    false
                );

                if (addTitle) {
                    addTitle.focus();
                }

                return;
            }

            if (category === "") {

                setAddFileMessage(
                    "❌ Please select a category.",
                    false
                );

                if (addCategory) {
                    addCategory.focus();
                }

                return;
            }

            saveFileBtn.disabled =
                true;

            setAddFileMessage(
                "Uploading file to Cloudinary...",
                true
            );

            try {

                var cloudinaryFormData =
                    new FormData();

                cloudinaryFormData.append(
                    "file",
                    file
                );

                cloudinaryFormData.append(
                    "upload_preset",
                    CLOUDINARY_UPLOAD_PRESET
                );

                var cloudinaryResponse =
                    await fetch(
                        "https://api.cloudinary.com/v1_1/" +
                        CLOUDINARY_CLOUD_NAME +
                        "/auto/upload",
                        {
                            method:
                                "POST",
                            body:
                                cloudinaryFormData
                        }
                    );

                var cloudinaryData =
                    await cloudinaryResponse.json();

                if (
                    !cloudinaryResponse.ok ||
                    !cloudinaryData.secure_url
                ) {

                    saveFileBtn.disabled =
                        false;

                    setAddFileMessage(
                        "❌ Cloudinary upload failed: " +
                        (
                            cloudinaryData.error &&
                            cloudinaryData.error.message
                                ? cloudinaryData.error.message
                                : "Unknown error"
                        ),
                        false
                    );

                    return;
                }

                var filePath =
                    cloudinaryData.secure_url;

                setAddFileMessage(
                    "Saving file information...",
                    true
                );

                var insertResult =
                    await supabaseClient
                        .from(
                            "security_items"
                        )
                        .insert({
                            user_id:
                                currentUser.id,
                            title:
                                title,
                            category:
                                category,
                            file_path:
                                filePath
                        });

                if (
                    insertResult.error
                ) {

                    saveFileBtn.disabled =
                        false;

                    setAddFileMessage(
                        "❌ File information could not be saved: " +
                        insertResult.error.message,
                        false
                    );

                    return;
                }

                if (addFileInput) {
                    addFileInput.value =
                        "";
                }

                if (addFileName) {

                    addFileName.textContent =
                        "No file selected";
                }

                if (addTitle) {
                    addTitle.value =
                        "";
                }

                if (addCategory) {
                    addCategory.value =
                        "";
                }

                saveFileBtn.disabled =
                    false;

                setAddFileMessage(
                    "✔️ File saved successfully.",
                    true
                );

                await loadSecurityItems();

                updateStorage();

            } catch (error) {

                saveFileBtn.disabled =
                    false;

                console.log(
                    "Save security item error:",
                    error
                );

                setAddFileMessage(
                    "❌ File save failed.",
                    false
                );
            }

        };

}

/* =====================================================
ADD PAGE - EDIT FILE
===================================================== */

async function editSecurityItem(
    item
) {

    if (
        !supabaseClient ||
        !currentUser ||
        !item
    ) {
        return;
    }

    var currentTitle =
        item.title ||
        "";

    var currentCategory =
        item.category ||
        "";

    var newTitle =
        window.prompt(
            "Enter new file title:",
            currentTitle
        );

    if (newTitle === null) {
        return;
    }

    newTitle =
        newTitle.trim();

    if (newTitle === "") {

        alert(
            "File title cannot be empty."
        );

        return;
    }

    var categoryText =
        "Documents, Photos, Videos, Accounts, Security, Personal, Other";

    var newCategory =
        window.prompt(
            "Enter category:\n\n" +
            categoryText,
            currentCategory
        );

    if (newCategory === null) {
        return;
    }

    newCategory =
        newCategory.trim();

    var allowedCategories = [
        "Documents",
        "Photos",
        "Videos",
        "Accounts",
        "Security",
        "Personal",
        "Other"
    ];

    if (
        allowedCategories.indexOf(
            newCategory
        ) === -1
    ) {

        alert(
            "Please use one of the available categories."
        );

        return;
    }

    var confirmed =
        window.confirm(
            "Update this file information?"
        );

    if (!confirmed) {
        return;
    }

    var result =
        await supabaseClient
            .from(
                "security_items"
            )
            .update({
                title:
                    newTitle,
                category:
                    newCategory
            })
            .eq(
                "id",
                item.id
            )
            .eq(
                "user_id",
                currentUser.id
            );

    if (result.error) {

        alert(
            "❌ Update failed: " +
            result.error.message
        );

        return;
    }

    if (addFileMessage) {

        setAddFileMessage(
            "✔️ File information updated.",
            true
        );
    }

    await loadSecurityItems();

}

/* =====================================================
ADD PAGE - DELETE FILE
===================================================== */

async function deleteSecurityItem(
    item
) {

    if (
        !supabaseClient ||
        !currentUser ||
        !item
    ) {
        return;
    }

    var confirmed =
        window.confirm(
            "Delete this saved file?\n\n" +
            "The file and its saved information will be removed."
        );

    if (!confirmed) {
        return;
    }

    var deleteButton =
        null;

    /*
    Storage file deletion.
    */

    if (
        item.file_path &&
        item.file_path.indexOf(
            "http"
        ) === 0
    ) {

        var cloudinaryDeleteResult =
            await supabaseClient
                .functions
                .invoke(
                    "cloudinary-delete",
                    {
                        body: {
                            fileUrl:
                                item.file_path
                        }
                    }
                );

        if (
            cloudinaryDeleteResult.error
        ) {

            console.log(
                "Cloudinary delete error:",
                cloudinaryDeleteResult.error.message
            );

            var continueDelete =
                window.confirm(
                    "The cloud file could not be removed.\n\n" +
                    "Do you still want to remove its saved information?"
                );

            if (!continueDelete) {
                return;
            }
        }

    } else if (
        item.file_path
    ) {

        var storageResult =
            await supabaseClient
                .storage
                .from(
                    STORAGE_BUCKET
                )
                .remove([
                    item.file_path
                ]);

        if (
            storageResult.error
        ) {

            console.log(
                "Storage file delete error:",
                storageResult.error.message
            );

            var continueDelete =
                window.confirm(
                    "The cloud file could not be removed.\n\n" +
                    "Do you still want to remove its saved information?"
                );

            if (!continueDelete) {
                return;
            }
        }
    }

    /*
    Database metadata deletion.
    */

    var databaseResult =
        await supabaseClient
            .from(
                "security_items"
            )
            .delete()
            .eq(
                "id",
                item.id
            )
            .eq(
                "user_id",
                currentUser.id
            );

    if (
        databaseResult.error
    ) {

        alert(
            "❌ Saved file information could not be deleted: " +
            databaseResult.error.message
        );

        return;
    }

    if (addFileMessage) {

        setAddFileMessage(
            "✔️ File deleted successfully.",
            true
        );
    }

    await loadSecurityItems();

    updateStorage();

}

/* =====================================================
ACCOUNT CHANGE
===================================================== */

if (accountChangeBtn) {

    accountChangeBtn.onclick =
        function () {

            var isOpen =
                accountChangeBox.classList.toggle(
                    "show-box"
                );

            if (isOpen) {

                displayAccounts();

                updateProfile();
            }
        };

}

/* =====================================================
DISPLAY ACCOUNTS
===================================================== */

async function displayAccounts() {

    if (!accountList) {
        return;
    }

    var accounts =
        getRememberedAccounts();

    accountList.innerHTML =
        "";

    if (
        accounts.length === 0
    ) {

        accountList.textContent =
            "No saved accounts.";

        return;
    }

    var i = 0;

    while (
        i < accounts.length
    ) {

        var account =
            accounts[i];

        var item =
            document.createElement(
                "div"
            );

        item.className =
            "account-item";

        var info =
            document.createElement(
                "div"
            );

        info.className =
            "account-item-info";

        var name =
            document.createElement(
                "div"
            );

        name.className =
            "account-item-name";

        name.textContent =
            account.email ||
            "ACCOUNT";

        var mail =
            document.createElement(
                "div"
            );

        mail.className =
            "account-item-email";

        mail.textContent =
            account.email ||
            "";

        info.appendChild(
            name
        );

        info.appendChild(
            mail
        );

        item.appendChild(
            info
        );

        if (
            currentUser &&
            account.email &&
            currentUser.email &&
            account.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        ) {

            var current =
                document.createElement(
                    "div"
                );

            current.className =
                "current-account-label";

            current.textContent =
                "CURRENT";

            item.appendChild(
                current
            );

        } else {

            var switchButton =
                document.createElement(
                    "button"
                );

            switchButton.type =
                "button";

            switchButton.className =
                "account-switch-button";

            switchButton.textContent =
                "SWITCH";

            switchButton.onclick =
                createSwitchHandler(
                    account
                );

            item.appendChild(
                switchButton
            );
        }

        accountList.appendChild(
            item
        );

        i++;
    }

}

/* =====================================================
SWITCH ACCOUNT
===================================================== */

function createSwitchHandler(
    account
) {

    return function () {

        if (!account.email) {
            return;
        }

        loginEmail.value =
            account.email;

        loginPhone.value =
            account.phone || "";

        loginPassword.value =
            "";

        showLogin();

        message.textContent =
            "Enter password for " +
            account.email +
            " to switch account.";
    };
}

/* =====================================================
HELP CENTER
===================================================== */

if (helpCenterBtn) {

    helpCenterBtn.onclick =
        function () {

            var confirmed =
                window.confirm(
                    "Open Help Center on WhatsApp?\n\n" +
                    "A message will be prepared for the Cyber Core Help Center."
                );

            if (!confirmed) {
                return;
            }

            var username =
                "User";

            if (
                currentProfile &&
                currentProfile.username
            ) {

                username =
                    currentProfile.username;
            }

            var accountEmail =
                currentUser &&
                currentUser.email
                    ? currentUser.email
                    : verifiedEmail;

            var text =
                "Hello Cyber Core Help Center,\n\n" +
                "I need help with my account.\n" +
                "Username: " +
                username +
                "\n" +
                "Email: " +
                accountEmail;

            var url =
                "https://wa.me/" +
                HELP_WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(
                    text
                );

            window.open(
                url,
                "_blank"
            );
        };

}

/* =====================================================
REMOVE ACCOUNT
===================================================== */

if (removeAccountBtn) {

    removeAccountBtn.onclick =
        async function () {

            if (!currentUser) {
                return;
            }

            var confirmed =
                window.confirm(
                    "Remove this account from this device?\n\n" +
                    "You will be signed out."
                );

            if (!confirmed) {
                return;
            }

            var userEmail =
                currentUser.email ||
                "";

            removeRememberedAccount(
                userEmail
            );

            await supabaseClient.auth
                .signOut();

            currentUser =
                null;

            currentProfile =
                null;

            currentAccountEmail =
                "";

            currentAccountPhone =
                "";

            googleOAuthLogin =
                false;

            githubOAuthLogin =
                false;

            loginEmail.value =
                "";

            loginPhone.value =
                "";

            loginPassword.value =
                "";

            showLogin();

            message.textContent =
                "✔️ Account removed from this device.";
        };

}

/* =====================================================
OAUTH CALLBACK SESSION HANDLER
===================================================== */

async function handleOAuthCallbackSession() {

    if (!supabaseClient) {
        return false;
    }

    if (
        !isOAuthCallback()
    ) {
        return false;
    }

    /*
       Give Supabase Auth a short moment to
       exchange the OAuth callback for a session.
    */

    var waitCount = 0;

    var session = null;

    while (
        waitCount < 20
    ) {

        var result =
            await supabaseClient.auth
                .getSession();

        if (
            result.data &&
            result.data.session
        ) {

            session =
                result.data.session;

            break;
        }

        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    250
                );

            }
        );

        waitCount++;
    }

    if (
        !session ||
        !session.user
    ) {

        return false;
    }

    var provider =
        getOAuthProvider(
            session.user
        );

    if (
        provider !== "google" &&
        provider !== "github"
    ) {

        return false;
    }

    /*
       This is the OAuth session created by
       the current callback. Handle it first.
    */

    if (
        provider === "google"
    ) {

        googleOAuthLogin =
            true;

        githubOAuthLogin =
            false;

        await handleGoogleUser(
            session.user
        );

    } else {

        githubOAuthLogin =
            true;

        googleOAuthLogin =
            false;

        await handleGithubUser(
            session.user
        );
    }

    /*
       Remove OAuth parameters from the
       browser address bar after processing.
    */

    try {

        window.history.replaceState(
            {},
            document.title,
            OAUTH_REDIRECT_URL
        );

    } catch (error) {

        console.log(
            "OAuth URL cleanup skipped:",
            error
        );
    }

    return true;
}

/* =====================================================
SUPABASE SESSION
===================================================== */

async function checkExistingSession() {

    if (!supabaseClient) {

        showRegister();

        message.textContent =
            "❌ Supabase could not be loaded.";

        return;
    }

    /*
       IMPORTANT:
       OAuth callback must be processed BEFORE
       normal existing-session logic.
    */

    if (
        isOAuthCallback()
    ) {

        var callbackHandled =
            await handleOAuthCallbackSession();

        if (
            callbackHandled
        ) {

            return;
        }
    }

    /*
       No OAuth callback:
       check the existing Supabase session.
    */

    var sessionResult =
        await supabaseClient.auth
            .getSession();

    if (
        sessionResult.error
    ) {

        console.log(
            "Session check error:",
            sessionResult.error.message
        );

        showLogin();

        message.textContent =
            "Please login to continue❗";

        return;
    }

    var session =
        sessionResult.data &&
        sessionResult.data.session
            ? sessionResult.data.session
            : null;

    /* =================================================
       OAUTH EXISTING SESSION
       ================================================= */

    if (
        session &&
        session.user &&
        isOAuthUser(
            session.user
        )
    ) {

        var provider =
            getOAuthProvider(
                session.user
            );

        if (
            provider ===
            "google"
        ) {

            googleOAuthLogin =
                true;

            githubOAuthLogin =
                false;

            await handleGoogleUser(
                session.user
            );

            return;
        }

        if (
            provider ===
            "github"
        ) {

            githubOAuthLogin =
                true;

            googleOAuthLogin =
                false;

            await handleGithubUser(
                session.user
            );

            return;
        }
    }

    /* =================================================
       NORMAL SESSION
       ================================================= */

    if (session) {

        await supabaseClient.auth
            .signOut();
    }

    currentUser =
        null;

    currentProfile =
        null;

    currentAccountEmail =
        "";

    currentAccountPhone =
        "";

    googleOAuthLogin =
        false;

    githubOAuthLogin =
        false;

    var accounts =
        getRememberedAccounts();

    if (
        accounts.length > 0
    ) {

        showLogin();

        loginEmail.value =
            accounts[
                accounts.length - 1
            ].email || "";

        loginPhone.value =
            accounts[
                accounts.length - 1
            ].phone || "";

        loginPassword.value =
            "";

        message.textContent =
            "Welcome back❗Please Login ♻️";

    } else {

        showLogin();

        message.textContent =
            "Please login to continue❗";
    }

}

/* =====================================================
AUTH STATE
===================================================== */

if (supabaseClient) {

    supabaseClient.auth
        .onAuthStateChange(
            function (
                event,
                session
            ) {

                /*
                   During OAuth callback the main
                   callback handler controls routing.
                   This listener only keeps the
                   current user synchronized.
                */

                if (
                    session &&
                    session.user
                ) {

                    currentUser =
                        session.user;

                } else {

                    currentUser =
                        null;
                }

            }
        );

}

/* ====================================================
START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkExistingSession();

    }
);
