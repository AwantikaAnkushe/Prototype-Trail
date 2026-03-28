document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const scanBtn = document.getElementById('scan-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsContainer = document.getElementById('results-container');

    scanBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text.trim()) {
            resultsContainer.innerHTML = '<p class="empty-state">Please enter some text to scan.</p>';
            textOutput.value = '';
            return;
        }

        if (window.SecretMatcher) {
            const findings = window.SecretMatcher.detectSecrets(text);
            const redacted = window.SecretMatcher.redactSecrets(text);

            textOutput.value = redacted;
            renderResults(findings);
        } else {
            console.error("SecretMatcher not loaded!");
            resultsContainer.innerHTML = '<p class="empty-state" style="color:red">Error: Matcher logic not loaded.</p>';
        }
    });

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        textOutput.value = '';
        resultsContainer.innerHTML = '<p class="empty-state">No secrets detected yet.</p>';
    });

    function renderResults(findings) {
        if (!findings || findings.length === 0) {
            resultsContainer.innerHTML = '<p class="empty-state" style="color: #059669; font-weight: bold;">✅ Clean! No sensitive information detected.</p>';
            return;
        }

        resultsContainer.innerHTML = '';
        findings.forEach(finding => {
            const item = document.createElement('div');
            item.className = 'result-item';

            const matchesHtml = finding.matches.map(m => `<div>${escapeHtml(m)}</div>`).join('');

            item.innerHTML = `
                <h3>🚨 ${finding.type.replace(/_/g, ' ')} detected</h3>
                <p>Found ${finding.count} instance(s).</p>
                <div class="matches">${matchesHtml}</div>
            `;
            resultsContainer.appendChild(item);
        });
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
