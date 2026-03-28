document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const blockedCountEl = document.getElementById('blocked-count');

    // Load initial state
    chrome.storage.local.get(['enabled', 'blockedCount'], (result) => {
        blockedCountEl.textContent = result.blockedCount || 0;

        let isEnabled = result.enabled !== undefined ? result.enabled : true;
        updateUI(isEnabled);

        toggleBtn.addEventListener('click', () => {
            isEnabled = !isEnabled;
            chrome.storage.local.set({ enabled: isEnabled }, () => {
                updateUI(isEnabled);
            });
        });
    });

    function updateUI(isEnabled) {
        if (isEnabled) {
            toggleBtn.textContent = 'Disable Protection';
            toggleBtn.classList.remove('disabled');
        } else {
            toggleBtn.textContent = 'Enable Protection';
            toggleBtn.classList.add('disabled');
        }
    }
});
