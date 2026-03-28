let isEnabled = true;

chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled !== undefined) {
        isEnabled = result.enabled;
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.enabled) {
        isEnabled = changes.enabled.newValue;
    }
});

// Intercept typing and pasting
document.addEventListener('input', (e) => {
    if (!isEnabled) return;

    // Check if the target is a typical text area or contenteditable
    const target = e.target;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable) {
        let text = target.value || target.innerText || target.textContent;

        // Use the SecretMatcher from matcher.js
        if (window.SecretMatcher) {
            const findings = window.SecretMatcher.detectSecrets(text);
            if (findings && findings.length > 0) {
                // Warning logic
                showWarningUI(target, findings);
            } else {
                removeWarningUI(target);
            }
        }
    }
}, true); // use capture phase

document.addEventListener('paste', (e) => {
    if (!isEnabled) return;

    let pasteText = (e.clipboardData || window.clipboardData).getData('text');
    if (window.SecretMatcher) {
        const findings = window.SecretMatcher.detectSecrets(pasteText);
        if (findings && findings.length > 0) {
            e.preventDefault(); // Block paste
            showToast(`⚠️ Blocked paste! Contains: ${findings.map(f => f.type).join(', ')}`);

            // Log to background
            chrome.runtime.sendMessage({
                action: "updateBlockedCount",
                count: findings.reduce((acc, f) => acc + f.count, 0)
            });
        }
    }
}, true);

// Utility to show visual warnings
function showWarningUI(element, findings) {
    element.style.border = '2px solid red';
    element.style.backgroundColor = '#ffe6e6';
    element.setAttribute('title', `Warning: Contains ${findings.map(f => f.type).join(', ')}`);
}

function removeWarningUI(element) {
    element.style.border = '';
    element.style.backgroundColor = '';
    element.removeAttribute('title');
}

function showToast(message) {
    let toast = document.getElementById('issueguard-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'issueguard-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff4d4d;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: sans-serif;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 4000);
}
