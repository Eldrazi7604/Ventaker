/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType, StartAt } from "@utils/types";
let currentVideoUrl = null;

// Define the settings for the plugin
const settings = definePluginSettings({
    link: {
        type: OptionType.STRING,
        description: "Enter the link ID to connect your background to",
        restartNeeded: true
    },
    interval: {
        type: OptionType.NUMBER,
        description: "The rate (in seconds) at which to check for new backgrounds",
        restartNeeded: false
    },
    primaryBG: {
        type: OptionType.STRING,
        description: "Primary Background Color",
        default: "rgba(0,0,0,0.05)",
        restartNeeded: false
    },
    secondaryBG: {
        type: OptionType.STRING,
        description: "Secondary Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: false
    },
    tertiaryBG: {
        type: OptionType.STRING,
        description: "Tertiary Background Color",
        default: "rgba(0,0,0,0)",
        restartNeeded: false
    },
    titleBG: {
        type: OptionType.STRING,
        description: "Title Background Color",
        default: "rgba(0,0,0,0.9)",
        restartNeeded: false
    },
    chatheaderBG: {
        type: OptionType.STRING,
        description: "Chat Header Background Color",
        default: "rgba(0,0,0,0.7)",
        restartNeeded: false
    },
    sidebarBG: {
        type: OptionType.STRING,
        description: "Sidebar Background Color",
        default: "rgba(0,0,0,0.9)",
        restartNeeded: false
    },
    messageBG: {
        type: OptionType.STRING,
        description: "Message Background Color",
        default: "rgba(0,0,0,0.1)",
        restartNeeded: false
    },
    bgFit: {
        type: OptionType.STRING,
        description: "Background Fit",
        default: "auto 100vh",
        restartNeeded: false
    }
});

// Function to fetch the background URL from Walltaker
async function fetchBackgroundUrl(linkId) {
    const url = `https://walltaker.joi.how/links/${linkId}.json`;
    try {
        console.log(`Fetching background URL from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch background");
        const data = await response.json();
        console.log("Fetched data:", data);
        return data.post_url; // Assuming the JSON response has a 'post_url' property
    } catch (error) {
        console.error("Error fetching background:", error);
        return null;
    }
}

function setBackground(url) {
    console.log(`Setting background to: ${url}`);

    // Remove existing video element if any

    // Check if the URL is the same as the current video URL
    if (url === currentVideoUrl) {
        console.log("Same video URL, continuing playback.");
        return;
    }

    currentVideoUrl = url;


    let videoElement = document.getElementById("walltaker-video-background");

    if (!videoElement) {
        videoElement = document.createElement("video");
        videoElement.id = "walltaker-video-background";
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = false;
        videoElement.style.position = "fixed";
        videoElement.style.top = "0";
        videoElement.style.left = "0";
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover";
        videoElement.style.zIndex = "-1";
        document.body.appendChild(videoElement);
    }
    videoElement.src = url;
    videoElement.style.display = "block";
}


// Function to set the background in the Discord client
function setBackgroundImage(url) {
    console.log(`Setting background to: ${url}`);
    let styleElement = document.getElementById("walltaker-background");

    // Remove existing video element if any
    const videoElement = document.getElementById("walltaker-video-background");
    if (videoElement) {
        videoElement.remove();
        currentVideoUrl = null; // Reset the current video URL
    }

    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "walltaker-background";
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = `
        body {
            background-image: url('${url}') !important;
            background-size: cover !important;
        }
    `;
}

// Function to apply additional CSS styles
function applyStyles(settings) {
    console.error("Applying styles with settings:", settings);
    let styleElement = document.getElementById("walltaker-additional-styles");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "walltaker-additional-styles";
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = `
        :root {
            --background-primary: ${settings.store.primaryBG};
            --background-secondary: ${settings.store.secondaryBG};
            --background-tertiary: ${settings.store.tertiaryBG};
        }
        body {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat;
        }
        .titleBar-1it3bQ {
            background: ${settings.store.titleBG} !important;
        }
        .container-ZMc96U.themed-Hp1KC_ {
            background: ${settings.store.chatheaderBG} !important;
        }
        .scroller-3X7KbA {
            background: ${settings.store.sidebarBG} !important;
        }
        .messageListItem-ZZ7v6g {
            background: ${settings.store.messageBG} !important;
        }
    `;
}

// Function to periodically update the background
function startBackgroundUpdate(linkId, interval) {
    async function updateBackground() {
        console.error("Updating background...");
        const backgroundUrl = await fetchBackgroundUrl(linkId);
        if (backgroundUrl) {
            if (backgroundUrl.endsWith(".webm")) {
                setBackground(backgroundUrl);
            } else {
                setBackgroundImage(backgroundUrl);
            }
        }
    }

    updateBackground(); // Initial update
    setInterval(updateBackground, interval * 6000); // Convert minutes to milliseconds
}


// Plugin initialization
export default definePlugin({
    name: "WallCord",
    description: "Plugin that changes your Discord background to one from Walltaker",
    authors: [{ name: "Lumi", id: 633026209479000065n }],
    settings,
    startAt: StartAt.DOMContentLoaded,
    async start() {
        console.log("Plugin loaded with settings:", settings);
        const { link } = settings.store;
        const { interval } = settings.store;
        startBackgroundUpdate(link, interval);
        applyStyles(settings);
    }
});