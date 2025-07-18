function handleVideo(video) {
    chrome.storage.sync.get(["skipEnabled", "muteEnabled"], (data) => {
        const isSkipEnabled = data.skipEnabled ?? true;
        const isMuteEnabled = data.muteEnabled ?? false;

        // --- Main Logic ---

        // 1. Primary Feature: Skipping
        if (isSkipEnabled) {
            if (video.currentTime < 10) {
                video.currentTime = 10;
            }
            // Once skipped, ensure it's not muted from a previous state
            if (video.muted) video.muted = false;
            return;
        }

        // 2. Backup Feature: Muting (only runs if skipping is disabled)
        if (isMuteEnabled) {
            if (video.currentTime < 10) {
                video.muted = true;
            } else {
                video.muted = false;
            }
        } else {
            // Ensure video is unmuted if the mute feature is turned off
            if (video.muted) video.muted = false;
        }
    });
}


// A wrapper function to call handleVideo, needed for the event listener.
function checkTime(event) {
    const video = event.target;
    // Stop checking if the video is paused and past the intro
    if (video.paused || video.currentTime >= 10.5) {
        // Final unmute check
        if (video.muted) {
            chrome.storage.sync.get("muteEnabled", (data) => {
                if (data.muteEnabled) video.muted = false;
            });
        }
        return;
    }
    handleVideo(video);
}

function attachListener(video) {
    if (video.dataset.skipListenerAttached) {
        return;
    }
    video.dataset.skipListenerAttached = "true";
    video.addEventListener("timeupdate", checkTime);
}

function monitorVideos() {
    document.querySelectorAll("video").forEach((video) => {
        attachListener(video);
    });
}

const observer = new MutationObserver(() => {
    monitorVideos();
});

observer.observe(document.body, { childList: true, subtree: true });

monitorVideos();