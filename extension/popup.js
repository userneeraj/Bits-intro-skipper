document.addEventListener("DOMContentLoaded", () => {
    const skipCheckbox = document.getElementById("toggleSkip");
    const muteCheckbox = document.getElementById("toggleMute");

    // Get the saved states for both toggles
    chrome.storage.sync.get(["skipEnabled", "muteEnabled"], (data) => {
        skipCheckbox.checked = data.skipEnabled ?? true;
        muteCheckbox.checked = data.muteEnabled ?? false; // Default is off
    });

    // Listen for changes on the skip toggle
    skipCheckbox.addEventListener("change", () => {
        chrome.storage.sync.set({ skipEnabled: skipCheckbox.checked });
    });

    // Listen for changes on the mute toggle
    muteCheckbox.addEventListener("change", () => {
        chrome.storage.sync.set({ muteEnabled: muteCheckbox.checked });
    });
});