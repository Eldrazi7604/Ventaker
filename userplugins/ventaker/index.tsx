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
    intervalRate: {
        type: OptionType.NUMBER,
        description: "The rate (in seconds) at which to check for new backgrounds",
        restartNeeded: false
    },
    mainColor: {
        type: OptionType.STRING,
        description: "Main Background Color",
        default: "rgba(0,0,0,0.2)",
        restartNeeded: true
    },
    secondaryColor: {
        type: OptionType.STRING,
        description: "Secondary Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: true
    },
    tertiaryColor: {
        type: OptionType.STRING,
        description: "Tertiary Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: true
    },
    titleBackground: {
        type: OptionType.STRING,
        description: "Title Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: true
    },
    chatHeaderBackground: {
        type: OptionType.STRING,
        description: "Chat Header Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: true
    },
    sidebarBackground: {
        type: OptionType.STRING,
        description: "Sidebar Background Color",
        default: "rgba(0,0,0,0.4)",
        restartNeeded: true
    },
    messageBackground: {
        type: OptionType.STRING,
        description: "Message Background Color",
        default: "rgba(0,0,0,0.2)",
        restartNeeded: true
    },
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
    console.log("Applying styles with settings:", settings);
    let styleElement = document.getElementById("ventaker-custom-styles");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "ventaker-custom-styles";
        document.head.appendChild(styleElement);
    }

    // Pretty shit time :3 (most of this is unused, just incase I want more options in the furture also becuase, fuck you.)
    styleElement.innerHTML = `
        :root {
            --main-color: #E91E63;
            --hover-color: #1e63b3;
            --success-color: #43b581;
            --danger-color: #982929;
            --url-color: var(--main-color);
            --online-color: #43b581;
            --idle-color: #faa61a;
            --dnd-color: #982929;
            --streaming-color: #593695;
            --offline-color: #808080;
            --text-normal: rgb(220, 221, 222);
            --text-muted: rgb(114, 118, 125);
            --channels-width: 220px;
            --members-width: 240px;
            --background-shading: 100%;
            --background-overlay: rgba(0, 0, 0, 0.4);
            --background-size: cover;
            --background-repeat: no-repeat;
            --background-attachment: fixed;
            --background-brightness: 100%;
            --background-contrast: 100%;
            --background-saturation: 100%;
            --background-invert: 0%;
            --background-grayscale: 0%;
            --background-sepia: 0%;
            --background-blur: 0px;
            --channel-unread: var(--main-color);
            --channel-color: rgba(255, 255, 255, 0.3);
            --channel-text-selected: #fff;
            --muted-color: rgba(255, 255, 255, 0.1);
            --backdrop-overlay: rgba(0, 0, 0, 0.8);
            --backdrop-position: var(--background-position);
            --backdrop-size: var(--background-size)
            --backdrop-repeat: var(--background-repeat);
            --backdrop-attachment: var(--background-attachment);
            --backdrop-brightness: var(--background-brightness);
            --backdrop-contrast: var(--background-contrast);
            --backdrop-saturation: var(--background-saturation);
            --backdrop-invert: var(--background-invert);
            --backdrop-grayscale: var(--background-grayscale);
            --backdrop-sepia: var(--background-sepia);
            --backdrop-blur: var(--background-blur);
            --user-popout-position: var(--background-position);
            --user-popout-size: var(--background-size);
            --user-popout-repeat: var(--background-repeat);
            --user-popout-attachment: var(--background-attachment);
            --user-popout-brightness: var(--background-brightness);
            --user-popout-contrast: var(--background-contrast);
            --user-popout-saturation: var(--background-saturation);
            --user-popout-invert: var(--background-invert);
            --user-popout-grayscale: var(--background-grayscale);
            --user-popout-sepia: var(--background-sepia);
            --user-popout-blur: calc(var(--background-blur) + 3px);
            --user-popout-overlay: rgba(0, 0, 0, 0.6);
            --main-font: gg sans, Helvetica Neue, Helvetica, Arial, sans-serif;
            --code-font: Consolas, Liberation Mono, Menlo, Courier, monospace;
            --user-modal-position: var(--background-position);
            --user-modal-size: var(--background-size);
            --user-modal-repeat: var(--background-repeat);
            --user-modal-attachment: var(--background-attachment);
            --user-modal-brightness: var(--background-brightness);
            --user-modal-contrast: var(--background-contrast);
            --user-modal-saturation: var(--background-saturation);
            --user-modal-invert: var(--background-invert);
            --user-modal-grayscale: var(--background-grayscale);
            --user-modal-sepia: var(--background-sepia);
            --user-modal-blur: calc(var(--background-blur) + 3px);
            --background-primary: ${settings.store.mainColor};
            --background-secondary: ${settings.store.secondaryColor};
            --background-tertiary: ${settings.store.tertiaryColor};
        }
        body {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat;
        }
        .titleBar-1it3bQ {
            background: ${settings.store.titleBackground} !important;
        }
        .container-ZMc96U.themed-Hp1KC_ {
            background: ${settings.store.chatHeaderBackground} !important;
        }
        .scroller-3X7KbA {
            background: ${settings.store.sidebarBackground} !important;
        }
        .messageListItem-ZZ7v6g {
            background: ${settings.store.messageBackground} !important;
        }
        :root {
            --main-color:  #2780e6;
            --hover-color:  #1e63b3;
            --success-color:  #43b581;
            --danger-color:  #982929;
            --channel-unread:  var(--main-color);
            --channel-color:  rgba(255,  255,  255,  0.3);
            --muted-color:  rgba(255,  255,  255,  0.1);
            --channel-text-selected:  #fff;
            --url-color:  var(--main-color);
            --online-color:  #43b581;
            --idle-color:  #faa61a;
            --dnd-color:  #982929;
            --offline-color:  #808080;
            --streaming-color:  #593695;
            --main-font:  gg sans,  Helvetica Neue,  Helvetica,  Arial,  sans-serif;
            --code-font:  Consolas,  Liberation Mono,  Menlo,  Courier,  monospace;
            --font-display:  var(--main-font);
            --text-normal:  rgb(220,  221,  222);
            --text-muted:  rgb(114,  118,  125);
            --channels-width:  220px;
            --members-width:  240px;
            --background-shading:  100%;
            --background-overlay:  rgba(0,  0,  0,  0.6);
            --background-position:  center;
            --background-size:  cover;
            --background-repeat:  no-repeat;
            --background-attachment:  fixed;
            --background-brightness:  100%;
            --background-contrast:  100%;
            --background-saturation:  100%;
            --background-invert:  0%;
            --background-grayscale:  0%;
            --background-sepia:  0%;
            --background-blur:  0px;
            --backdrop-overlay:  rgba(0,  0,  0,  0.8);
            --backdrop-position:  var(--background-position);
            --backdrop-size:  var(--background-size);
            --backdrop-repeat:  var(--background-repeat);
            --backdrop-attachment:  var(--background-attachment);
            --backdrop-brightness:  var(--background-brightness);
            --backdrop-contrast:  var(--background-contrast);
            --backdrop-saturation:  var(--background-saturation);
            --backdrop-invert:  var(--background-invert);
            --backdrop-grayscale:  var(--background-grayscale);
            --backdrop-sepia:  var(--background-sepia);
            --backdrop-blur:  var(--background-blur);
            --user-popout-position:  var(--background-position);
            --user-popout-size:  var(--background-size);
            --user-popout-repeat:  var(--background-repeat);
            --user-popout-attachment:  var(--background-attachment);
            --user-popout-brightness:  var(--background-brightness);
            --user-popout-contrast:  var(--background-contrast);
            --user-popout-saturation:  var(--background-saturation);
            --user-popout-invert:  var(--background-invert);
            --user-popout-grayscale:  var(--background-grayscale);
            --user-popout-sepia:  var(--background-sepia);
            --user-popout-blur:  calc(var(--background-blur) + 3px);
            --user-popout-overlay:  rgba(0,  0,  0,  0.65);
            --user-modal-position:  var(--background-position);
            --user-modal-size:  var(--background-size);
            --user-modal-repeat:  var(--background-repeat);
            --user-modal-attachment:  var(--background-attachment);
            --user-modal-brightness:  var(--background-brightness);
            --user-modal-contrast:  var(--background-contrast);
            --user-modal-saturation:  var(--background-saturation);
            --user-modal-invert:  var(--background-invert);
            --user-modal-grayscale:  var(--background-grayscale);
            --user-modal-sepia:  var(--background-sepia);
            --user-modal-blur:  calc(var(--background-blur) + 3px);
            --home-icon:  url(https://clearvision.github.io/icons/discord.svg);
            --home-position:  center;
            --home-size:  40px;
            --popout-color:  rgba(0,  0,  0,  0.8);
            --modal-color:  rgba(0,  0,  0,  0.5);
            --bd-blue:  var(--main-color);
            --bd-blue-hover:  var(--hover-color);
            --bd-blue-active:  var(--hover-color);
            --font-primary:  var(--main-font);
            --font-code:  var(--code-font);
        }
        @keyframes cv-fade-in {
            from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
        }@keyframes cv-fade-to-1 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.1;
        }
        }@keyframes cv-fade-to-2 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.2;
        }
        }@keyframes cv-fade-to-3 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.3;
        }
        }@keyframes cv-fade-to-4 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.4;
        }
        }@keyframes cv-fade-to-5 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.5;
        }
        }@keyframes cv-fade-to-6 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.6;
        }
        }@keyframes cv-fade-to-7 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.7;
        }
        }@keyframes cv-fade-to-8 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.8;
        }
        }@keyframes cv-fade-to-9 {
            from {
            opacity: 0;
        }
        to {
            opacity: 0.9;
        }
        }@keyframes cv-slide-top {
            from {
            top: 100%}
        to {
            top: 0;
        }
        }@keyframes cv-slide-right {
            from {
            right: 100%}
        to {
            right: 0;
        }
        }@keyframes cv-slide-bottom {
            from {
            bottom: 100%}
        to {
            bottom: 0;
        }
        }@keyframes cv-slide-left {
            from {
            left: 100%}
        to {
            left: 0;
        }
        }@keyframes cv-channel-select {
            from {
            right: 100%;
            background-color: rgba(0, 0, 0, 0);
        }
        to {
            right: 0;
            background-color: var(--main-color);
        }
        }@keyframes cv-message-jump {
            from {
            background: rgba(255, 255, 255, .3);
        }
        to {
            background: rgba(0, 0, 0, 0);
        }
        }@keyframes cv-update-spin {
            from {
            transform: rotateZ(0) scaleX(-1);
        }
        to {
            transform: rotateZ(360deg) scaleX(-1);
        }
        }@keyframes cv-update-downloading {
            0% {
            background-size: 24px, 10px 0;
        }
        50% {
            background-position: center, 50% 10px;
            background-size: 24px, 10px 10px;
        }
        100% {
            background-position: center, 50% 20px;
            background-size: 24px, 10px 0;
        }
        }@keyframes cv-spin {
            from {
            transform: rotateZ(0);
        }
        to {
            transform: rotateZ(360deg);
        }
        }@keyframes cv-spinner-glow {
            from {
            filter: drop-shadow(0 0 3px var(--main-color));
        }
        to {
            filter: drop-shadow(0 0 3px var(--main-color)) drop-shadow(0 0 15px var(--main-color));
        }
        }@keyframes cv-spinner-pulse {
            from {
            transform: scale(0.8);
            opacity: .3;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-fold-y {
            from {
            transform: rotateX(-90deg);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-fold-x {
            from {
            transform: rotateY(-90deg);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-slide-top {
            from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-slide-bottom {
            from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-slide-left {
            from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-menu-slide-right {
            from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: none;
            opacity: 1;
        }
        }@keyframes cv-shadow-pulse {
            0% {
            box-shadow: 0 0 6px 2px var(--main-color);
        }
        50% {
            box-shadow: 0 0 10px 2px var(--main-color);
        }
        100% {
            box-shadow: 0 0 6px 2px var(--main-color);
        }
        }@keyframes cv-shake {
            0%, 100% {
            transform: none;
        }
        15%, 45%, 75% {
            transform: translate3d(-13px,  -8px,  0px);
        }
        30%, 60%, 90% {
            transform: translate3d(13px,  8px,  0px);
        }
        }.appMount_ea7e65 {
            background: var(--background-overlay);
        }
        .app_a01fb1, body {
            background: rgba(0, 0, 0, 0);
        }
        .bg_d4b6c5 {
            filter: grayscale(var(--background-grayscale)) sepia(var(--background-sepia)) invert(var(--background-invert)) brightness(var(--background-brightness)) contrast(var(--background-contrast)) saturate(var(--background-saturation)) blur(var(--background-blur));
            z-index: -9999;
        }
        .appMount_ea7e65 .layers_d4b6c5, .appMount_ea7e65 .layer_d4b6c5 {
            background: rgba(0, 0, 0, 0);
        }
        .container_a4d4d9 .base_a4d4d9 {
            border-radius: 0;
        }
        .backdrop_e4f2ae {
            background: var(--backdrop-overlay);
        }
        .loading_cea94f {
            background-color: rgba(0, 0, 0, 0);
        }
        .loading_cea94f:before, .loading_cea94f:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: 3px solid rgba(0, 0, 0, 0);
            border-radius: 50%;
            margin: auto;
            filter: drop-shadow(0 0 3px var(--main-color));
            animation: cv-spin 1s ease-in-out infinite;
        }
        .loading_cea94f:before {
            height: 26px;
            width: 26px;
            border-left-color: var(--main-color);
            border-right-color: var(--main-color);
        }
        .loading_cea94f:after {
            height: 16px;
            width: 16px;
            border-top-color: var(--main-color);
            border-bottom-color: var(--main-color);
            animation-direction: reverse;
        }
        body, button, input, select, textarea, ::placeholder {
            font-family: var(--main-font);
        }
        ::selection {
            color: #fff;
            background: var(--main-color);
        }
        .notice_be03aa {
            border-radius: 3px;
        }
        .notice_be03aa.colorDefault__438d3 {
            background: rgba(67, 181, 129, .6);
        }
        .notice_be03aa.colorDanger__5d2e7 {
            background: rgba(240, 71, 71, .6);
        }
        .notice_be03aa.colorStreamerMode_be03aa {
            background: rgba(145, 70, 255, .6);
        }
        .notice_be03aa .textLink_d572b7 {
            color: #fff;
        }
        .notice_be03aa.notice_a50047 {
            background: rgba(0, 0, 0, .6);
        }
        .typeWindows_a934d8 {
            height: 18px;
            width: 100vw;
            margin: 0;
            padding-top: 2px;
            padding-bottom: 2px;
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            box-shadow: 0 0 20px rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .typeWindows_a934d8>.wordmark_a934d8 {
            position: static;
            margin-right: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            pointer-events: none;
            user-select: none;
            order: 1;
        }
        .typeWindows_a934d8>.wordmark_a934d8:before, .typeWindows_a934d8>.wordmark_a934d8:after {
            margin-left: 3px;
            font-weight: 600;
            white-space: nowrap;
            order: 1;
        }
        .typeWindows_a934d8>.wordmark_a934d8:before {
            content: "Ventaker";
            color: rgba(255, 255, 255, .7);
            font-size: 14px;
            text-shadow: 0 0 3px #000;
        }
        .typeWindows_a934d8>.wordmark_a934d8:after {
            content: "v1.0.2";
            color: rgba(255, 255, 255, .3);
            font-family: var(--code-font);
            font-size: 10px;
        }
        .typeWindows_a934d8>.wordmark_a934d8>svg {
            filter: drop-shadow(0 0 5px var(--main-color));
            margin-top: 6px;
        }
        .typeWindows_a934d8>.wordmark_a934d8>svg>g>path {
            fill: var(--main-color);
        }
        .typeWindows_a934d8>.wordmark_a934d8>svg>g>path:first-child {
            d: path("M3.57642276, 0.141304348 L0, 0.141304348 L0, 4.22826087 L2.38069106, 6.40217391 L2.38069106, 2.43478261 L3.66260163, 2.43478261 C4.47052846, 2.43478261 4.86910569, 2.83695652 4.86910569, 3.4673913 L4.86910569, 6.5 C4.86910569, 7.13043478 4.49207317, 7.55434783 3.66260163, 7.55434783 L0, 7.55434783 L0, 9.85869565 L3.57642276, 9.85869565 C5.49390244, 9.86956522 7.29288618, 8.90217391 7.29288618, 6.66304348 L7.29288618, 3.39130435 C7.29288618, 1.13043478 5.49390244, 0.141304348 3.57642276, 0.141304348 Z M22.3310976, 6.67391304 L22.3310976, 3.32608696 C22.3310976, 2.11956522 24.4640244, 1.83695652 25.1103659, 3.05434783 L27.0817073, 2.23913043 C26.3168699, 0.510869565 24.8949187, 0 23.7207317, 0 C21.803252, 0 19.9073171, 1.13043478 19.9073171, 3.32608696 L19.9073171, 6.67391304 C19.9073171, 8.88043478 21.803252, 10 23.6776423, 10 C24.8841463, 10 26.3276423, 9.39130435 27.1247967, 7.81521739 L25.0134146, 6.82608696 C24.4963415, 8.17391304 22.3310976, 7.84782609 22.3310976, 6.67391304 Z M15.8030488, 3.7826087 C15.0597561, 3.61956522 14.5642276, 3.34782609 14.5319106, 2.88043478 C14.575, 1.75 16.2878049, 1.7173913 17.2896341, 2.79347826 L18.8731707, 1.55434783 C17.8821138, 0.326086957 16.7617886, 0 15.598374, 0 C13.8424797, 0 12.1404472, 1 12.1404472, 2.91304348 C12.1404472, 4.77173913 13.5408537, 5.76086957 15.0813008, 6 C15.8676829, 6.10869565 16.7402439, 6.42391304 16.7186992, 6.97826087 C16.654065, 8.02173913 14.5426829, 7.9673913 13.5839431, 6.7826087 L12.0650407, 8.23913043 C12.9591463, 9.40217391 14.1764228, 10 15.3182927, 10 C17.074187, 10 19.0239837, 8.9673913 19.0993902, 7.08695652 C19.2071138, 4.69565217 17.5050813, 4.09782609 15.8030488, 3.7826087 Z M8.59634146, 9.85869565 L11.0093496, 9.85869565 L11.0093496, 0.141304348 L8.59634146, 0.141304348 L8.59634146, 9.85869565 Z M49.2835366, 0.141304348 L45.7071138, 0.141304348 L45.7071138, 4.22826087 L48.0878049, 6.40217391 L48.0878049, 2.43478261 L49.3589431, 2.43478261 C50.1668699, 2.43478261 50.5654472, 2.83695652 50.5654472, 3.4673913 L50.5654472, 6.5 C50.5654472, 7.13043478 50.1884146, 7.55434783 49.3589431, 7.55434783 L45.6963415, 7.55434783 L45.6963415, 9.85869565 L49.2727642, 9.85869565 C51.1902439, 9.86956522 52.9892276, 8.90217391 52.9892276, 6.66304348 L52.9892276, 3.39130435 C53, 1.13043478 51.2010163, 0.141304348 49.2835366, 0.141304348 Z M31.7353659, 0 C29.753252, 0 27.7819106, 1.09782609 27.7819106, 3.33695652 L27.7819106, 6.66304348 C27.7819106, 8.89130435 29.7640244, 10 31.7569106, 10 C33.7390244, 10 35.7103659, 8.89130435 35.7103659, 6.66304348 L35.7103659, 3.33695652 C35.7103659, 1.10869565 33.7174797, 0 31.7353659, 0 Z M33.2865854, 6.66304348 C33.2865854, 7.35869565 32.5109756, 7.7173913 31.7461382, 7.7173913 C30.9705285, 7.7173913 30.1949187, 7.36956522 30.1949187, 6.66304348 L30.1949187, 3.33695652 C30.1949187, 2.61956522 30.9489837, 2.23913043 31.7030488, 2.23913043 C32.4894309, 2.23913043 33.2865854, 2.58695652 33.2865854, 3.33695652 L33.2865854, 6.66304348 Z M44.3605691, 3.33695652 C44.3067073, 1.05434783 42.7770325, 0.141304348 40.8056911, 0.141304348 L36.9815041, 0.141304348 L36.9815041, 9.86956522 L39.4268293, 9.86956522 L39.4268293, 6.77173913 L39.8577236, 6.77173913 L42.0768293, 9.85869565 L45.0930894, 9.85869565 L42.4861789, 6.52173913 C43.6495935, 6.15217391 44.3605691, 5.14130435 44.3605691, 3.33695652 Z M40.8487805, 4.65217391 L39.4268293, 4.65217391 L39.4268293, 2.43478261 L40.8487805, 2.43478261 C42.3784553, 2.43478261 42.3784553, 4.65217391 40.8487805, 4.65217391 Z");
        }
        .typeWindows_a934d8>.wordmark_a934d8>svg>g>path:not(:first-child) {
            display: none;
        }
        .typeWindows_a934d8>.winButton_a934d8 {
            top: -2px;
            opacity: .7;
            transition: all .15s ease-in-out;
        }
        .typeWindows_a934d8>.winButton_a934d8:hover {
            background: rgba(255, 255, 255, .1);
            opacity: 1;
        }
        .typeWindows_a934d8>.winButtonClose_a934d8:hover {
            background: var(--danger-color);
        }
        .typeMacOS_a934d8 {
            width: 70px;
            height: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
        }
        .typeMacOS_a934d8.unfocused_a934d8 .macButton_a934d8 {
            background: rgba(255, 255, 255, .7);
        }
        .typeMacOS_a934d8>.macButtons_a934d8 {
            padding: 0 10px;
        }
        .typeMacOS_a934d8:before, .typeMacOS_a934d8:after {
            margin: 0 2px;
            font-size: 10px;
            order: 1;
        }
        .typeMacOS_a934d8:before {
            content: "CV";
            color: var(--main-color);
            font-weight: 700;
            text-shadow: 0 0 3px;
        }
        .typeMacOS_a934d8:after {
            content: "6.9.0";
            color: rgba(255, 255, 255, .3);
        }
        .tabBar_f1fd9c {
            border-bottom: none;
        }
        .prompt_c6b11b {
            background: var(--background-overlay);
        }
        .selectValuePill_e25377 {
            background: rgba(0, 0, 0, .2);
            border: 1px solid var(--main-color);
        }
        .optionButtonWrapper_bd5e1f {
            border: 2px solid var(--main-color);
        }
        .optionButtonWrapper_bd5e1f:hover {
            border: 2px solid var(--hover-color);
        }
        .optionButtonWrapper_bd5e1f.selected_bd5e1f {
            border: 2px solid var(--success-color);
            background: rgba(0, 0, 0, .2);
        }
        .profileCard_c6b11b {
            background: var(--background-overlay);
        }
        .role_c6b11b {
            background: rgba(0, 0, 0, .2);
        }
        .container_b55df8 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .selectAll_f04d06 .text-xs-medium_d3e0f1 {
            color: rgba(255, 255, 255, .5) !important;
            transition: all .15s ease-in-out;
        }
        .channelRow_f04d06 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .channelRow_f04d06:hover:not(.disabled_f04d06) {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .mainTableContainer_dd2627, .mainTableContainer_e23072 {
            background: var(--background-overlay);
            border: 1px solid var(--main-color);
            box-shadow: none;
        }
        .table_aabef9 {
            border-top: 1px solid var(--main-color);
        }
        .memberRowContainer_a39fe9:hover td {
            background: var(--hover-color);
        }
        .button_a39fe9 {
            background: var(--main-color);
        }
        .button_a39fe9:hover {
            background: var(--hover-color);
        }
        .button_a39fe9:nth-child(2) path~path, .button_a39fe9:nth-child(1) path {
            fill: #fff;
        }
        .otherRoles_a39fe9 {
            background: var(--background-overlay);
        }
        .pageButton_b48941>span {
            color: #fff;
        }
        .chatHeaderBar_efb691 {
            background: rgba(0, 0, 0, 0);
        }
        .homeContainer_e85cee .userProfileOuterThemed_c69a7b {
            background: rgba(0, 0, 0, 0);
        }
        .homeContainer_e85cee .userCardInner_c69a7b, .homeContainer_e85cee .avatarBackground_a1289e, .homeContainer_e85cee .action_e3f878, .homeContainer_e85cee .sidebarCardWrapper_e85cee, .homeContainer_e85cee .row_b53f4f {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .homeContainer_e85cee .action_e3f878:hover {
            background: var(--hover-color);
        }
        .homeContainer_e85cee .headerIcon_d32e26 {
            background: var(--main-color);
            border: 4px solid rgba(0, 0, 0, 0);
        }
        .homeContainer_e85cee .icon_f11207 {
            position: relative;
            background-clip: padding-box;
            background-color: none;
            background-position: center center;
            background-size: 100% 100%}
        .homeContainer_e85cee .channelIconContainer_e3f878, .homeContainer_e85cee .rulesIconContainer_e3f878 {
            background: var(--main-color);
        }
        .homeContainer_e85cee .channelIconContainer_e3f878>svg>path, .homeContainer_e85cee .rulesIconContainer_e3f878>svg>path {
            fill: #fff;
        }
        .homeContainer_e85cee .checkCircleCompleted_e3f878>path {
            fill: var(--success-color);
        }
        .banner_d29eee {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .iconCircle_d29eee {
            background: var(--main-color);
        }
        .scroller_fca846 {
            background: var(--background-overlay);
        }
        .tierInfoContainer_ecba8f {
            background: rgba(0, 0, 0, .4);
        }
        .subscriptionPerks_ecba8f, .roleMessagePreview_ecba8f {
            background: rgba(0, 0, 0, .2);
        }
        .navButtons_cd377c {
            background: rgba(0, 0, 0, .4);
        }
        .prompt_cd377c, .termsFieldBody_cd377c {
            background: rgba(0, 0, 0, .3);
        }
        .overlay_cd377c {
            display: none;
        }
        .sidebar_a4d4d9 {
            width: var(--channels-width);
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .platform-win .sidebar_a4d4d9 {
            border-radius: 0;
        }
        .theme-dark .container_ee69e0 {
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .container_ee69e0 .header_fd6364 {
            height: 48px;
            color: #fff;
            font-family: var(--main-font);
            font-weight: 600;
            text-shadow: 0 0 3px #000;
        }
        .theme-dark .container_ee69e0 .header_fd6364:hover {
            background-color: rgba(255, 255, 255, .1);
        }
        .theme-dark .container_ee69e0 .animatedContainer_fd6364 {
            background: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .theme-dark .container_ee69e0 .bannerImage_fd6364 {
            width: var(--channels-width);
            -webkit-mask: linear-gradient(to bottom,  #000,  transparent);
            mask: linear-gradient(to bottom,  #000,  transparent);
        }
        .theme-dark .container_ee69e0 .spine_e1e976 {
            color: var(--main-color);
        }
        .theme-dark .container_ee69e0 .spineBorder_e1e976 {
            background: var(--main-color);
        }
        .theme-dark .progressBarContainer_c75f85 {
            background-color: rgba(0, 0, 0, .4);
        }
        .link_d8bfb3 {
            transition: all .15s ease-in-out;
        }
        .link_d8bfb3 {
            position: relative;
            background: rgba(0, 0, 0, 0) !important;
        }
        .link_d8bfb3:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transition: all .15s ease-in-out;
            z-index: -1;
            pointer-events: none;
            border-radius: 4px;
        }
        .link_d8bfb3:after {
            content: "";
            position: absolute;
            top: 0;
            right: 100%;
            bottom: 0;
            left: 0;
            opacity: .9;
            transition: all .3s ease-in-out;
            z-index: -1;
            pointer-events: none;
            border-radius: 4px;
        }
        .link_d8bfb3 .icon_d8bfb3 {
            width: 18px;
            height: 18px;
            margin-right: 3px;
            color: var(--channel-color);
            opacity: 1;
            transition: all .15s ease-in-out;
        }
        .link_d8bfb3 .icon_d8bfb3>path {
            opacity: .7;
        }
        .link_d8bfb3 .icon_d8bfb3>path:last-of-type {
            opacity: 1;
        }
        .link_d8bfb3 .name_d8bfb3 {
            color: var(--channel-color);
            transition: all .15s ease-in-out;
        }
        .children_d8bfb3 {
            margin-left: 1px;
            animation: cv-fade-to-3 .15s ease-in-out;
        }
        .actionIcon_f6f816 {
            color: #fff;
            opacity: .3;
            transition: all .15s ease-in-out;
        }
        .actionIcon_f6f816 path {
            fill: #fff;
        }
        .actionIcon_f6f816:hover {
            opacity: .7;
        }
        .statusText_e66732, .pencilIcon_e66732 {
            color: #fff;
        }
        .wrapper_d8bfb3:hover .name_d8bfb3, .wrapper_d8bfb3:hover .icon_d8bfb3 {
            color: #fff;
        }
        .wrapper_d8bfb3:hover .link_d8bfb3 {
            background: var(--bg-overlay-hover,  var(--background-modifier-hover));
        }
        .wrapper_d8bfb3:hover .link_d8bfb3:before {
            background: rgba(255, 255, 255, .1);
        }
        .containerDefault_f6f816 .wrapper_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3, .containerDefault_f6f816 .wrapper_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: rgba(255, 255, 255, .7);
        }
        .wrapper_d8bfb3.modeUnreadImportant_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: var(--channel-unread);
            text-shadow: 0 0 3px;
        }
        .wrapper_d8bfb3.modeUnreadImportant_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3 {
            color: var(--channel-unread);
            filter: drop-shadow(0 0 3px);
            opacity: 1;
        }
        .wrapper_d8bfb3.modeUnreadImportant_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: var(--channel-text-selected);
        }
        .wrapper_d8bfb3.modeUnreadImportant_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3 {
            color: var(--channel-text-selected);
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .name_d8bfb3, .wrapper_d8bfb3.modeSelected_d8bfb3 .icon_d8bfb3 {
            color: #fff;
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3:before {
            background: rgba(255, 255, 255, .1);
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3:after {
            right: 0;
            background: var(--main-color);
            animation: cv-channel-select .3s ease-in-out;
        }
        .containerDefault_f6f816 .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3 .icon_d8bfb3, .containerDefault_f6f816 .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3 .name_d8bfb3 {
            color: var(--channel-text-selected);
        }
        .containerDefault_f6f816 .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3 .live_e17fae {
            color: var(--channel-text-selected) !important;
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3 .actionIcon_f6f816 {
            opacity: .7;
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .link_d8bfb3 .actionIcon_f6f816:hover {
            opacity: 1;
        }
        .wrapper_d8bfb3.modeSelected_d8bfb3 .text-xs-medium_d3e0f1, .wrapper_d8bfb3.modeSelected_d8bfb3 .text-xs-normal__46d75 {
            color: #fff !important;
        }
        .wrapper_d8bfb3.modeConnected_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: var(--main-color);
            text-shadow: 0 0 3px;
        }
        .wrapper_d8bfb3.modeConnected_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3 {
            color: var(--main-color);
            filter: drop-shadow(0 0 3px);
        }
        .wrapper_d8bfb3.modeMuted_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3, .wrapper_d8bfb3.modeMuted_d8bfb3 .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: var(--muted-color);
        }
        .wrapper_d8bfb3.modeMuted_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3:before {
            background: rgba(255, 255, 255, .07);
        }
        .containerDefault_f6f816 .wrapper_d8bfb3.modeMuted_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .icon_d8bfb3, .containerDefault_f6f816 .wrapper_d8bfb3.modeMuted_d8bfb3:hover .link_d8bfb3 .linkTop_d8bfb3 .name_d8bfb3 {
            color: var(--channel-color);
        }
        .unread_d8bfb3 {
            display: none;
        }
        .live_e17fae {
            background-color: var(--main-color) !important;
        }
        .users_a5bc92, .total_a5bc92 {
            width: 24px;
            color: rgba(255, 255, 255, .3);
            font-weight: 600;
            text-align: right;
            transition: all .15s ease-in-out;
        }
        .users_a5bc92 {
            padding: 0 4px 0 6px;
            background: rgba(0, 0, 0, .15);
        }
        .total_a5bc92 {
            padding: 0 6px 0 4px;
            background: rgba(255, 255, 255, .04);
            box-shadow: inset 1px 0 rgba(255, 255, 255, .07);
        }
        .total_a5bc92:after {
            display: none;
        }
        .modeConnected_d8bfb3 .users_a5bc92 {
            color: var(--main-color);
            text-shadow: 0 0 1px;
        }
        .listDefault_cdc675 {
            padding-left: 24px;
        }
        .listDefault_cdc675 .clickable_cdc675:hover .content_cdc675 {
            background: rgba(0, 0, 0, .04);
        }
        .voiceUser_cdc675 {
            z-index: 1;
        }
        .voiceUser_cdc675 .content_cdc675 {
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .voiceUser_cdc675 .avatarSpeaking_cdc675 {
            position: relative;
            transition: all .1s ease-in-out;
        }
        .voiceUser_cdc675 .avatarSpeaking_cdc675:after {
            content: "";
            position: absolute;
            height: 1.7em;
            background: linear-gradient(to right,  var(--main-color) 10%,  transparent);
            opacity: .5;
            transition: all .1s ease-in-out, width .15s ease-in-out;
            pointer-events: none;
            z-index: -1;
            border-radius: 999px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .voiceUser_cdc675 .avatarSpeaking_cdc675 {
            box-shadow: 0 0 0 2px var(--main-color), inset 0 0 3px rgba(0, 0, 0, .5);
        }
        .voiceUser_cdc675 .avatarSpeaking_cdc675:after {
            top: -2px;
            bottom: -2px;
            width: 150px;
        }
        .voiceUser_cdc675 .username_cdc675 {
            color: rgba(255, 255, 255, .5);
            transition: all .1s ease-in-out;
        }
        .voiceUser_cdc675 .usernameSpeaking_cdc675 {
            color: #fff !important;
        }
        .voiceChannelsButton_a08117:hover {
            background: var(--hover-color);
            transition: ease-in-out .15s;
        }
        .voiceChannelsButton_a08117>.text-sm-medium__726be {
            color: #fff;
        }
        .icon_c47562 {
            width: 18px;
            height: 18px;
            margin-right: 3px;
            color: rgba(255, 255, 255, .3);
        }
        .moreUsers_c47562 {
            padding: 0 4px;
            background: rgba(0, 0, 0, .3);
            border-radius: 10px;
        }
        .containerDragAfter_a08117:before, .containerDragBefore_a08117:before, .containerDragAfter_a08117:after, .containerDragBefore_a08117:after, .containerDragAfter_f6f816:before, .containerDragBefore_f6f816:before, .containerDragAfter_f6f816:after, .containerDragBefore_f6f816:after {
            background: var(--main-color);
            border-radius: 0;
        }
        .containerUserOver_f6f816:after {
            background: var(--main-color);
            border-color: rgba(0, 0, 0, 0);
            opacity: .1;
        }
        .containerDefault_a08117, .containerDragAfter_a08117, .containerDragBefore_a08117, .containerUserOver__91b97 {
            padding-top: 16px;
        }
        .wrapper_a08117 {
            padding-left: 10px;
            padding-right: 0;
            transition: all .3s ease-in-out;
        }
        .icon_a08117 {
            display: none;
        }
        .name_a08117 {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--main-color);
            font-weight: 700;
            text-align: center;
            transition: all .3s ease-in-out;
            opacity: .7;
        }
        .name_a08117:before {
            content: "";
            height: 2px;
            flex-grow: 1;
            transition: all .3s ease-in-out;
            background: linear-gradient(to left,  var(--main-color) 50%,  transparent);
            margin-right: 5px;
        }
        .name_a08117:after {
            content: "";
            height: 2px;
            flex-grow: 1;
            transition: all .3s ease-in-out;
            background: linear-gradient(to right,  var(--main-color) 50%,  transparent);
            margin-left: 5px;
        }
        .mainContent_a08117:hover .name_a08117 {
            opacity: 1;
        }
        .sidebar_a4d4d9 .containerDefault_a08117 .wrapper_a08117 .name_a08117, .sidebar_a4d4d9 .containerDragAfter_a08117 .wrapper_a08117 .name_a08117, .sidebar_a4d4d9 .containerDragBefore_a08117 .wrapper_a08117 .name_a08117, .sidebar_a4d4d9 .containerUserOver__91b97 .wrapper_a08117 .name_a08117 {
            color: var(--main-color);
        }
        .children_a08117 {
            margin-left: 3px;
        }
        .collapsed_a08117 .name_a08117:before, .collapsed_a08117 .name_a08117:after {
            flex-grow: 0;
        }
        .muted_a08117 {
            opacity: .5;
        }
        .addButtonIcon_a08117 {
            color: var(--main-color);
            opacity: .7;
            transition: all .3s ease-in-out;
        }
        .addButtonIcon_a08117:hover {
            color: var(--main-color);
            opacity: 1;
        }
        .button_ccfa44, .buttonIcon_ccfa44 {
            color: var(--url-color);
        }
        .unread_c10249, .mention_c10249 {
            position: relative;
            background: rgba(0, 0, 0, 0);
        }
        .unread_c10249:after, .mention_c10249:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: var(--main-color);
            border-radius: 3px;
            opacity: .9;
            z-index: -1;
            transition: all .15s ease-in-out;
        }
        .unread_c10249:hover:after, .mention_c10249:hover:after {
            opacity: 1;
        }
        .panels_a4d4d9 {
            background: rgba(0, 0, 0, 0);
        }
        .panels_a4d4d9>:first-child {
            box-shadow: 0 -2px 10px rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .theme-dark .panel_bf1a22 {
            background-color: rgba(0, 0, 0, 0);
        }
        .container_b2ca13>.flex_ec1a20 {
            background: rgba(0, 0, 0, .3);
            border-radius: 15px;
        }
        .container_b2ca13>.flex_ec1a20>:nth-child(n+2) {
            position: relative;
            margin-left: -1px;
        }
        .container_b2ca13>.flex_ec1a20>:nth-child(n+2):before {
            content: "";
            position: absolute;
            left: 0;
            top: 2px;
            bottom: 2px;
            width: 1px;
            background: rgba(255, 255, 255, .2);
        }
        .theme-dark .avatarWrapper_b2ca13 {
            min-width: calc(var(--channels-width) - 120px);
        }
        .theme-dark .avatarWrapper_b2ca13:hover {
            background-color: rgba(255, 255, 255, .1);
        }
        button.button_f67531 {
            width: 32px;
            height: 32px;
            opacity: 1;
        }
        button.button_f67531>.contents_dd4f85>svg {
            background-position: center;
            background-size: 18px;
            background-repeat: no-repeat;
            color: #fff;
            opacity: .5;
            transition: all .1s ease-in-out;
        }
        button.button_f67531>.contents_dd4f85>svg>path[fill*="var(--interactive-normal)"] {
            fill: #fff;
        }
        button.button_f67531.enabled_f67531:hover {
            background: rgba(0, 0, 0, 0);
        }
        button.button_f67531:hover>.contents_dd4f85>svg {
            opacity: .7;
        }
        button.button_f67531.disabled_f67531>.contents_dd4f85>svg {
            opacity: .1;
        }
        .actionButtons_adcaac {
            grid-gap: 6px;
        }
        .button_adcaac.buttonColor_adcaac {
            padding: 0;
        }
        .button_adcaac.buttonColor_adcaac.buttonActive_adcaac {
            background-color: #fff;
            color: var(--main-color);
        }
        .button_adcaac.buttonColor_adcaac.buttonActive_adcaac:hover {
            background: rgba(255, 255, 255, .95);
            color: var(--hover-color);
        }
        .button_adcaac.buttonColor_adcaac.buttonActive_adcaac .lottieIcon_f73ef7 {
            --__lottieIconColor:  var(--main-color) !important;
        }
        .theme-dark .container_b2ca13 {
            position: relative;
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .container_b2ca13 .withTagAsButton_b2ca13, .theme-dark .container_b2ca13 .withTagless_b2ca13 {
            min-width: calc(100% - 100px);
            width: auto;
        }
        .theme-dark .container_b2ca13 .withTagAsButton_b2ca13:hover, .theme-dark .container_b2ca13 .withTagless_b2ca13:hover {
            background-color: rgba(0, 0, 0, .3);
            color: #fff;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13 {
            width: 32px !important;
            height: 32px !important;
            transition: all .15s ease-in-out;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13:after {
            content: "Status";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            color: #fff;
            font-size: 5px;
            font-weight: 700;
            text-align: center;
            line-height: 32px;
            text-transform: uppercase;
            opacity: 0;
            transition: all .15s ease-in-out;
            pointer-events: none;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13 foreignObject {
            transition: all .15s ease-in-out;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13:hover {
            opacity: 1;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13:hover:after {
            font-size: 10px;
            opacity: 1;
        }
        .theme-dark .container_b2ca13 .avatar_b2ca13:hover foreignObject {
            opacity: .5;
        }
        .theme-dark .container_b2ca13 .title_d1da5f {
            color: #fff;
        }
        .container_adcaac {
            border-color: rgba(0, 0, 0, 0);
            background: rgba(0, 0, 0, 0);
        }
        .container_adcaac>.flex_ec1a20 {
            background: rgba(0, 0, 0, .3);
            border-radius: 5px;
            padding: 5px;
        }
        .container_adcaac .inner_adcaac .rtcConnectionStatus_c0cb95 .ping_c0cb95 {
            width: 16px;
            height: 16px;
            margin-right: 3px;
            background-size: 16px;
        }
        .container_adcaac .channel_adcaac {
            color: rgba(255, 255, 255, .3);
            opacity: 1;
            transition: all .15s ease-in-out;
        }
        .container_adcaac .channel_adcaac:hover {
            color: rgba(255, 255, 255, .5);
            text-decoration: none;
        }
        .activityPanel_a4d4d9 {
            border-color: rgba(0, 0, 0, 0);
        }
        .activityPanel_a4d4d9 .actions_bf1a22 {
            background: rgba(0, 0, 0, .3);
            border-radius: 15px;
        }
        .activityPanel_a4d4d9 .actions_bf1a22>:nth-child(n+2) {
            position: relative;
            margin-left: -1px;
        }
        .activityPanel_a4d4d9 .actions_bf1a22>:nth-child(n+2):before {
            content: "";
            position: absolute;
            left: 0;
            top: 2px;
            bottom: 2px;
            width: 1px;
            background: rgba(255, 255, 255, .2);
        }
        .liveBadge_bf1a22 {
            background-color: var(--main-color);
        }
        .noiseCancellationPopout_adcaac {
            background-color: rgba(0, 0, 0, .7);
        }
        .privateChannels_f0963d {
            background: rgba(0, 0, 0, 0);
        }
        .privateChannels_f0963d .scroller_c47fa9 {
            background: rgba(0, 0, 0, 0);
        }
        .privateChannelsHeaderContainer_c47fa9 {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--main-color);
            font-weight: 700;
            text-align: center;
        }
        .privateChannelsHeaderContainer_c47fa9:before {
            content: "";
            height: 2px;
            flex-grow: 1;
            transition: all .3s ease-in-out;
            background: linear-gradient(to left,  var(--main-color) 50%,  transparent);
            margin-right: 5px;
        }
        .privateChannelsHeaderContainer_c47fa9:after {
            content: "";
            height: 2px;
            flex-grow: 1;
            transition: all .3s ease-in-out;
            background: linear-gradient(to right,  var(--main-color) 50%,  transparent);
            margin-left: 5px;
        }
        .privateChannelsHeaderContainer_c47fa9 .headerText_c47fa9 {
            overflow: visible;
        }
        .privateChannelsHeaderContainer_c47fa9 .privateChannelRecipientsInviteButtonIcon_c47fa9 {
            color: var(--main-color);
            transition: all .1s ease-in-out;
        }
        .privateChannelsHeaderContainer_c47fa9 .privateChannelRecipientsInviteButtonIcon_c47fa9:hover {
            color: var(--hover-color);
        }
        .channel_c91bad {
            max-width: none;
        }
        .interactive_c91bad {
            position: relative;
            z-index: 1;
        }
        .interactive_c91bad:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 3px;
            transition: all .15s ease-in-out;
            z-index: -1;
            pointer-events: none;
        }
        .interactive_c91bad:after {
            content: "";
            position: absolute;
            top: 0;
            right: 100%;
            bottom: 0;
            left: 0;
            border-radius: 3px;
            opacity: .9;
            transition: all .3s ease-in-out;
            z-index: -1;
            pointer-events: none;
        }
        .interactive_c91bad .linkButtonIcon_c91bad, .interactive_c91bad .name_f9647d {
            color: rgba(255, 255, 255, .4);
            font-size: 14px;
            transition: all .15s ease-in-out;
            overflow: hidden;
        }
        .interactive_c91bad .activityText_c91bad strong {
            color: var(--main-color);
            font-weight: 700;
            transition: all .15s ease-in-out;
        }
        .interactive_c91bad .closeButton_c91bad {
            color: #fff;
        }
        .interactive_c91bad:hover {
            background: rgba(0, 0, 0, 0);
        }
        .interactive_c91bad:hover:before {
            background: rgba(255, 255, 255, .1);
        }
        .interactive_c91bad:hover .linkButtonIcon_c91bad, .interactive_c91bad:hover .name_f9647d {
            color: rgba(255, 255, 255, .7);
        }
        .interactive_c91bad:hover .closeButton_c91bad {
            opacity: .3;
        }
        .interactive_c91bad:hover .closeButton_c91bad:hover {
            opacity: .7;
        }
        .interactive_c91bad.interactiveSelected_c91bad {
            background: rgba(0, 0, 0, 0);
        }
        .interactive_c91bad.interactiveSelected_c91bad:before {
            background: rgba(255, 255, 255, .1);
        }
        .interactive_c91bad.interactiveSelected_c91bad:after {
            right: 0;
            background: var(--main-color);
            animation: cv-channel-select .3s ease-in-out;
        }
        .interactive_c91bad.interactiveSelected_c91bad .linkButtonIcon_c91bad, .interactive_c91bad.interactiveSelected_c91bad .name_f9647d {
            color: #fff;
        }
        .interactive_c91bad.interactiveSelected_c91bad .activityEmoji_c91bad, .interactive_c91bad.interactiveSelected_c91bad .icon_ad923e {
            filter: drop-shadow(0 0 3px rgba(0,  0,  0,  0.7));
        }
        .interactive_c91bad.interactiveSelected_c91bad .activityText_c91bad strong {
            color: #fff;
        }
        .interactive_c91bad.interactiveSelected_c91bad .closeButton_c91bad {
            opacity: .7;
        }
        .interactive_c91bad.interactiveSelected_c91bad .closeButton_c91bad:hover {
            opacity: 1;
        }
        .interactive_c91bad .highlighted_f9647d .name_f9647d {
            color: #fff;
        }
        .container_b572de {
            background: var(--background-overlay);
        }
        .empty_c47fa9 {
            fill: rgba(255, 255, 255, .15);
        }
        .searchBar_f0963d .searchBarComponent_f0963d {
            background: rgba(255, 255, 255, .1);
            color: rgba(255, 255, 255, .3);
        }
        .base_a4d4d9 .chat_a7d72e {
            background: rgba(0, 0, 0, 0);
        }
        .base_a4d4d9 .page_d20375 {
            background: rgba(0, 0, 0, 0) !important;
        }
        .chatContent_a7d72e, .resizeHandle_d1c246 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
        }
        .chat_a7d72e .content_a7d72e {
            background: rgba(0, 0, 0, 0);
        }
        .chat_a7d72e .content_a7d72e:before {
            box-shadow: none;
        }
        .content_a7d72e>.wrapper_fbb822 {
            background: rgba(0, 0, 0, .5);
        }
        .gatedContent_b9693a .image_b9693a {
            filter: hue-rotate(-47deg) saturate(2);
            opacity: .5;
        }
        .gatedContent_b9693a .title_b9693a {
            color: var(--danger-color);
            font-weight: 600;
            text-shadow: 0 0 3px #000;
        }
        .gatedContent_b9693a .description_b9693a {
            color: rgba(255, 255, 255, .7);
        }
        .emptyChannelIcon_c2668b {
            background-color: var(--main-color);
        }
        .role_deddac {
            background: rgba(0, 0, 0, 0);
        }
        .role_deddac .roleColor_deddac {
            position: absolute;
            height: 100%;
            width: 100%;
            margin: 0;
            right: -1px;
            border-radius: 3px;
            z-index: -1;
            opacity: .2;
        }
        .role_deddac:hover {
            background-color: rgba(0, 0, 0, 0);
        }
        .role_deddac:hover .roleColor_deddac {
            opacity: .3;
        }
        .base_a4d4d9 .noChannel_e1ef5f {
            background: rgba(0, 0, 0, .5);
        }
        .noChannel_e1ef5f .image_a3747e {
            filter: grayscale(1) brightness(2);
            opacity: .3;
        }
        .noChannel_e1ef5f .title_a3747e {
            color: rgba(255, 255, 255, .5);
        }
        .noChannel_e1ef5f .text_a3747e {
            color: rgba(255, 255, 255, .3);
        }
        .wrapper_cdfd51, .wrapper_b211c6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .uploadModalIn_f82cc7 .uploadDropModal_f82cc7 .bgScale_f82cc7 {
            background-color: var(--main-color);
        }
        .uploadModalIn_f82cc7 .uploadDropModal_f82cc7 .inner_f82cc7 {
            border: 2px dashed rgba(255, 255, 255, .5);
        }
        div[aria-checked=true] .mentionButton_b11c5e {
            color: var(--main-color) !important;
        }
        .container_fb4810 {
            background-color: rgba(0, 0, 0, 0);
        }
        .iconWrapper_ec583a {
            background-color: var(--main-color);
        }
        .iconWrapper_ec583a svg path {
            fill: #fff;
        }
        .newMessagesBar_cf58b5 {
            z-index: 999;
            background: rgba(0, 0, 0, 0);
            transition: all .15s ease-in-out;
        }
        .newMessagesBar_cf58b5:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: var(--main-color);
            border-radius: 0 0 3px 3px;
            opacity: .8;
            z-index: -1;
            transition: all .15s ease-in-out;
        }
        .newMessagesBar_cf58b5:hover:before, .newMessagesBar_cf58b5:active:before {
            opacity: 1;
        }
        .newMessagesBar_cf58b5:active {
            padding-top: 0;
            transform: scale(0.99);
        }
        .newMessagesBar_cf58b5 button {
            color: #fff;
        }
        .jumpToPresentBar_cf58b5 {
            background: rgba(0, 0, 0, .7);
            border-radius: 3px;
            transition: all .15s ease-in-out;
            padding-bottom: 0px;
            max-height: 24px;
        }
        .jumpToPresentBar_cf58b5>button {
            color: rgba(255, 255, 255, .7);
            transition: inherit;
        }
        .jumpToPresentBar_cf58b5:hover {
            background: var(--main-color);
        }
        .jumpToPresentBar_cf58b5:hover>button {
            color: #fff;
        }
        .jumpToPresentBar_cf58b5:active {
            transform: scale(0.99);
        }
        .messagesErrorBar_cf58b5 {
            background: var(--danger-color);
            border-radius: 3px;
            transition: all .15s ease-in-out;
            padding-bottom: 0px;
        }
        .bar_eba0ba {
            background-color: var(--main-color);
        }
        .bar_eba0ba>* {
            color: #fff !important;
        }
        .wrapper_d880dc {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.8));
        }
        .wrapper_d880dc.minimum_d880dc {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.8));
        }
        .callContainer_d880dc {
            background-color: rgba(0, 0, 0, 0);
        }
        .tile_dc5fc4 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.7));
        }
        .button_e5cc00 {
            background-color: var(--main-color);
        }
        .button_e5cc00:hover {
            background-color: var(--hover-color);
        }
        .tile_ba4b17 {
            background-color: rgba(0, 0, 0, 0);
        }
        .participantsButton_b83b18 {
            background-color: rgba(0, 0, 0, .4);
        }
        .participantsButton_b83b18:hover {
            background-color: rgba(0, 0, 0, .6);
        }
        .border_ba4b17.speaking_ba4b17 {
            box-shadow: inset 0 0 0 2px var(--main-color);
        }
        .cta_cdef0d, .status_ba4b17.interactive_ba4b17 {
            background-color: var(--main-color);
        }
        .cta_cdef0d:hover, .status_ba4b17.interactive_ba4b17:hover {
            background-color: var(--hover-color);
        }
        .overlayTitle_ba4b17 {
            background: var(--main-color);
            border-radius: 100px;
        }
        .overlayTitle_ba4b17:hover {
            background: var(--hover-color);
        }
        .videoWrapper_ba4b17 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.7));
        }
        .button_dd4f85.centerButton_ef18ee {
            border-radius: 50%}
        .colorable_ef18ee.primaryDark_ef18ee {
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
        }
        .colorable_ef18ee.primaryDark_ef18ee:hover {
            background-color: var(--hover-color);
            color: #fff;
        }
        .colorable_ef18ee.white_ef18ee {
            color: #fff;
            background-color: var(--main-color);
        }
        .colorable_ef18ee.white_ef18ee:hover {
            background-color: var(--hover-color);
        }
        .colorable_ef18ee.white_ef18ee.active_ef18ee {
            background-color: var(--hover-color);
        }
        .colorable_ef18ee.white_ef18ee.active_ef18ee:hover {
            background-color: var(--hover-color);
        }
        .colorable_ef18ee.white_ef18ee .centerIcon_ef18ee {
            color: #fff;
        }
        .colorable_ef18ee.white_ef18ee .centerIcon_ef18ee.active_ef18ee {
            color: var(--main-color);
        }
        .colorable_ef18ee.red_ef18ee {
            background-color: var(--danger-color);
        }
        .isUnread_fc5f50 .content_fc5f50 {
            color: var(--main-color);
        }
        .unreadPill_fc5f50 {
            background-color: var(--main-color);
            top: -6px;
        }
        .unreadPillCapStroke_fc5f50 {
            fill: var(--main-color);
            color: var(--main-color);
        }
        .content_fc5f50 {
            background: rgba(0, 0, 0, 0);
            color: var(--main-color);
        }
        .divider_fc5f50 {
            border: none;
            height: 1px;
            background: var(--background-modifier-accent);
        }
        .divider_fc5f50.isUnread_fc5f50 {
            border: none;
            height: 1px;
            background: var(--main-color);
        }
        .divider_fc5f50.isUnread_fc5f50:has(.content_fc5f50) {
            border: none;
            height: 1px;
            background: radial-gradient(circle at 50% 50%,  rgba(0,  0,  0,  0) 55px,  var(--main-color) 55px);
        }
        .divider_fc5f50:has(.content_fc5f50) {
            border: none;
            height: 1px;
            background: radial-gradient(circle at 50% 50%,  rgba(0,  0,  0,  0) 55px,  var(--background-modifier-accent) 55px);
        }
        .iconBackground_e5ee5b {
            background-color: var(--main-color);
        }
        .container_ed4410 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
        }
        .callContainer_ed4410, .scroller_bb12d2 {
            background-color: rgba(0, 0, 0, 0);
        }
        .gradientContainer_dd069c {
            background-image: none;
        }
        .separator_e5ee5b {
            background-color: var(--main-color);
        }
        .participants_a07d72 {
            background-color: rgba(0, 0, 0, 0);
        }
        .rowContainer_f3a5b1 {
            background: rgba(0, 0, 0, 0);
        }
        .tileContainer_e1522e {
            background-color: rgba(0, 0, 0, .4);
        }
        .tileContainer_e1522e:hover {
            background-color: rgba(255, 255, 255, .05);
        }
        .toast_dbb3d0 .messageContentWrapper_dbb3d0 {
            background-color: rgba(0, 0, 0, .8);
        }
        .toast_dbb3d0 .messageContentWrapper_dbb3d0:hover {
            background-color: rgba(0, 0, 0, .6);
        }
        .voiceUser_cdc675 {
            padding-top: 4px;
        }
        .overlap_cdc675 .avatar_cdc675 {
            border: none;
        }
        .audienceContainer_ac3629 {
            background-color: rgba(0, 0, 0, .8);
            border: rgba(0, 0, 0, .8);
        }
        .audienceContainer_ac3629 .audienceIconContainer_ac3629 {
            background: var(--main-color);
        }
        .audienceContainer_ac3629 .audienceIcon_ac3629 {
            color: #fff;
        }
        .audienceContainer_ac3629 .text-sm-medium__726be {
            color: rgba(255, 255, 255, .9) !important;
        }
        .container_dc3fc4 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .container_dc3fc4:hover {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .primaryButtonColor_e12b21 {
            background: var(--main-color);
        }
        .primaryButtonColor_e12b21:hover {
            background: var(--hover-color);
        }
        .stageListenerPill_a6ae3c {
            background: var(--main-color);
        }
        .stageListenerPill_a6ae3c .text-xs-normal__46d75 {
            color: #fff !important;
        }
        .stageListenerPill_a6ae3c>svg {
            color: #fff;
        }
        .topicFormItem_c8fe09 .input_f8bc55 {
            background: rgba(0, 0, 0, .4);
            box-shadow: 0 0 0 2px var(--main-color);
        }
        .topicFormItem_c8fe09 .textInput_c8fe09 {
            background: rgba(0, 0, 0, 0);
        }
        .container_f7ece4 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .background_b42a48 {
            background-color: var(--main-color);
        }
        .background_b42a48 .foreground_b42a48 {
            color: #fff;
        }
        .form_a7d72e {
            margin-top: 1px;
        }
        .form_a7d72e:before, .form_a7d72e:after {
            display: none;
        }
        .form_a7d72e .charcounter {
            color: rgba(255, 255, 255, .3);
        }
        .channelTextArea_d0696b {
            background: rgba(0, 0, 0, .6);
            transition: all .15s ease-in-out;
        }
        .channelTextArea_d0696b:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .channelTextArea_d0696b .scrollableContainer_d0696b {
            background: rgba(0, 0, 0, 0);
            border: 2px solid rgba(0, 0, 0, 0);
        }
        .channelTextArea_d0696b .attachButton_f298d4 {
            padding: 10px 10px 10px 12px;
        }
        .channelTextArea_d0696b .attachButton_f298d4 .attachButtonPlus_f298d4 {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .channelTextArea_d0696b .attachButton_f298d4:hover .attachButtonPlus_f298d4 {
            color: rgba(255, 255, 255, .9);
        }
        .channelTextArea_d0696b .textArea_d0696b .placeholder_a552a6 {
            color: rgba(255, 255, 255, .4);
        }
        .channelTextArea_d0696b .textArea_d0696b.textAreaSlate_d0696b {
            margin-left: 10px;
        }
        .channelTextArea_d0696b .button_cecf00 {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .channelTextArea_d0696b .button_cecf00:hover {
            color: rgba(255, 255, 255, .9);
        }
        .channelTextArea_d0696b .typing_d7ebeb {
            background: rgba(0, 0, 0, 0);
        }
        .channelTextArea_d0696b .typing_d7ebeb .text_d7ebeb {
            color: rgba(255, 255, 255, .5);
        }
        .channelTextArea_d0696b .typing_d7ebeb .text_d7ebeb>strong {
            color: rgba(255, 255, 255, .7);
            font-weight: 700;
        }
        .fakeLink_cdb578 {
            color: var(--url-color);
        }
        .wrapper_faf5ab {
            background-color: rgba(0, 0, 0, .6);
        }
        .attachedBars_d0696b {
            background: rgba(0, 0, 0, 0);
        }
        .stackedAttachedBar_d0696b {
            border-bottom: 1px solid rgba(255, 255, 255, .07);
        }
        .replyBar_b11c5e, .threadSuggestionBar_b11c5e {
            background: rgba(0, 0, 0, 0);
            border: 2px solid rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .closeButton_b11c5e {
            padding: 8px 16px 8px 4px;
            margin-left: 4px;
        }
        .separator_b11c5e {
            visibility: hidden;
            height: 0px;
            width: 0px;
        }
        .theme-dark .optionPill_d4df8b {
            background-color: rgba(255, 255, 255, .05);
            border-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .optionPill_d4df8b.selectedPill_d4df8b {
            border-color: var(--main-color) !important;
        }
        .theme-dark .optionPillKey_d4df8b {
            background-color: rgba(255, 255, 255, .07);
        }
        .upload_df1eaf {
            background-color: rgba(0, 0, 0, 0);
        }
        .spamBanner_c1da2c {
            background: rgba(0, 0, 0, .6);
        }
        .container_c06a56 {
            background: rgba(0, 0, 0, .5);
        }
        .container_c06a56 .iconContainer_c06a56 {
            background: rgba(0, 0, 0, .2);
        }
        .before_inlineCode_cdb578, .after_inlineCode_cdb578 {
            background: rgba(255, 255, 255, .05);
            padding: 3.5px .5px;
        }
        .inlineCode_cdb578 {
            background: rgba(255, 255, 255, .1);
            padding: 3.5px .5px;
        }
        .theme-dark .autocomplete_f23da8 {
            background: rgba(0, 0, 0, 0);
            overflow: hidden;
        }
        .autocomplete_f23da8 .autocompleteInner_f23da8 {
            background: var(--popout-color);
            animation: cv-menu-slide-bottom .2s ease-in-out;
            transform-origin: 50% 100%}
        .autocomplete_f23da8 .contentTitle_f23da8 {
            color: rgba(255, 255, 255, .5);
        }
        .autocomplete_f23da8 .iconForeground_f23da8 {
            fill: rgba(255, 255, 255, .3);
        }
        .autocomplete_f23da8 [aria-selected=true].clickable_f23da8 .base_f23da8, .autocomplete_f23da8 [aria-disabled=false].clickable_f23da8 .base_f23da8:hover {
            background: var(--main-color);
        }
        .autocomplete_f23da8 .base_f23da8 .text-xs-medium_d3e0f1, .autocomplete_f23da8 .base_f23da8 .text-xs-normal__46d75 {
            color: #fff !important;
        }
        .autocomplete_f23da8 .iconForeground_f23da8 {
            fill: rgba(255, 255, 255, .7);
        }
        .autocomplete_f23da8 .autocompleteRowContentSecondary_f23da8, .autocomplete_f23da8 .autocompleteRowSubheading_f23da8 {
            color: #fff;
        }
        .wrapper_efd8e6, .list_efd8e6, .categoryHeader_fe2299 {
            background-color: rgba(0, 0, 0, 0);
        }
        .selected_c9d951 {
            background-color: var(--main-color);
        }
        .selected_c9d951:hover {
            background-color: var(--main-color);
        }
        .theme-dark .option_bea3ee {
            background-color: rgba(0, 0, 0, .5);
        }
        .optionals_e18e73 {
            border: none;
        }
        .optionalCount_e18e73 {
            color: rgba(255, 255, 255, .7);
        }
        .nitroTopDividerContainer_e8f337, .premiumEmoji_d4ce86, .premiumHeader_f73c14 {
            display: none;
        }
        .autocomplete_f23da8:has(.base_f23da8+.nitroTopDividerContainer_e8f337) {
            display: none;
        }
        .sidebarContianer_d2194f .theme-dark .container_d936aa {
            background-color: rgba(0, 0, 0, .4);
        }
        .sidebarContianer_d2194f .theme-dark .topRow_d936aa, .sidebarContianer_d2194f .theme-dark .bottomRowAction_d936aa {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        .sidebarContianer_d2194f .theme-dark .bottomRowAction_d936aa:not(.bottomRowActionDisabled_d936aa) .innerBottomRowAction_d936aa {
            background-color: rgba(255, 255, 255, .05);
        }
        .sidebarContianer_d2194f .theme-dark .container_f51af4 {
            background-color: rgba(0, 0, 0, .4) !important;
        }
        .sidebarContianer_d2194f .theme-dark .header_f51af4 {
            background-color: rgba(0, 0, 0, 0) !important;
            box-shadow: none;
        }
        .sidebarContianer_d2194f .theme-dark .modInfoItem_ce9fb9 {
            background-color: rgba(0, 0, 0, .4);
        }
        .sidebarContianer_d2194f .theme-dark .modInfoAction_ce9fb9:hover {
            background-color: rgba(255, 255, 255, .05);
        }
        .sidebarContianer_d2194f .theme-dark .permissionChiplet_a507b4 {
            background-color: rgba(255, 255, 255, .07);
        }
        .sidebarContianer_d2194f .theme-dark .elevatedPermission_a507b4 {
            background-color: rgba(255, 255, 255, .07);
            color: var(--danger-color) !important;
        }
        .sidebarContianer_d2194f .theme-dark .innerContainer_f328ee li>div {
            background-color: rgba(0, 0, 0, .4) !important;
        }
        .sidebarContianer_d2194f .theme-dark .permissionItemContainer_f38b88 {
            background-color: rgba(0, 0, 0, .4);
        }
        .sidebarContianer_d2194f .theme-dark .permissionItemContainer_f38b88.elevatedPermission_f38b88 {
            background-color: rgba(0, 0, 0, .6);
            border: 1px solid rgba(255, 255, 255, .05);
        }
        .numberBadge_df8943, .textBadge_df8943 {
            background: var(--main-color) !important;
            box-shadow: 0 0 10px -3px var(--main-color), 0 0 0 1px var(--main-color);
            color: #fff;
            font-weight: 600;
            text-shadow: 0 1px 0 rgba(0, 0, 0, .25);
            transition: all .3s ease-in-out;
        }
        .numberBadge_df8943 {
            font-size: 12px;
            line-height: 12px;
        }
        .modeSelected_d8bfb3 .numberBadge_df8943, .modeSelected_d8bfb3 .textBadge_df8943, .interactiveSelected_c91bad .numberBadge_df8943, .interactiveSelected_c91bad .textBadge_df8943, .selected_a0 .numberBadge_df8943, .selected_a0 .textBadge_df8943 {
            background: #fff !important;
            box-shadow: none;
            color: var(--main-color);
            mix-blend-mode: screen;
        }
        .flowerStarContainer_ff7d90 {
            color: var(--main-color);
        }
        .flowerStarContainer_ff7d90 .icon_db1980 {
            color: #fff;
        }
        .flowerStarContainer_ff7d90 .childContainer_ff7d90>svg {
            color: #fff;
        }
        .gameVerifiedIcon_fd966d>svg>path {
            fill: var(--main-color);
        }
        .redesignIconChildContainer_ff7d90 path[fill="var(--primary-500)"] {
            fill: rgba(0, 0, 0, .9);
        }
        .premiumTrialAcknowledgedBadge_b089d3 {
            background-color: var(--main-color);
        }
        .button_dd4f85 {
            border-radius: 3px;
            transition: all .3s ease-in-out;
        }
        .lookFilled_dd4f85.colorBrand_dd4f85, .lookFilled_dd4f85.colorGreen_dd4f85, .lookFilled_dd4f85.colorBrandNew__8872c, .lookFilled_dd4f85.buttonColor_d4af21, .lookFilled_dd4f85.colorPrimary_dd4f85 {
            background: var(--main-color);
            color: #fff;
        }
        .lookFilled_dd4f85.colorBrand_dd4f85:hover, .lookFilled_dd4f85.colorGreen_dd4f85:hover, .lookFilled_dd4f85.colorBrandNew__8872c:hover, .lookFilled_dd4f85.buttonColor_d4af21:hover, .lookFilled_dd4f85.colorPrimary_dd4f85:hover {
            background: var(--hover-color);
        }
        .lookFilled_dd4f85.colorBrand_dd4f85:disabled, .lookFilled_dd4f85.colorGreen_dd4f85:disabled, .lookFilled_dd4f85.colorBrandNew__8872c:disabled, .lookFilled_dd4f85.buttonColor_d4af21:disabled, .lookFilled_dd4f85.colorPrimary_dd4f85:disabled {
            background: var(--danger-color) !important;
        }
        .lookFilled_dd4f85.colorBrand_dd4f85:active, .lookFilled_dd4f85.colorGreen_dd4f85:active, .lookFilled_dd4f85.colorBrandNew__8872c:active, .lookFilled_dd4f85.buttonColor_d4af21:active, .lookFilled_dd4f85.colorPrimary_dd4f85:active {
            background: var(--success-color);
        }
        .lookFilled_dd4f85.colorRed_dd4f85 {
            background-color: var(--danger-color);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85 {
            background: rgba(255, 255, 255, .1);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85>.contents_dd4f85 {
            color: var(--main-color);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:hover {
            background: rgba(255, 255, 255, .2) !important;
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:hover>.contents_dd4f85 {
            color: #fff;
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:disabled {
            background: rgba(255, 255, 255, .1) !important;
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:disabled>.contents_dd4f85 {
            color: rgba(255, 255, 255, .5);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85 {
            background: #fff;
            color: var(--main-color);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:hover, .lookFilled_dd4f85.colorWhite_dd4f85:active {
            background: rgba(255, 255, 255, .95);
            color: var(--hover-color);
        }
        .lookFilled_dd4f85.colorWhite_dd4f85:disabled {
            background: rgba(255, 255, 255, .3);
        }
        .container_b558d0 .lookFilled_dd4f85.colorGreen_dd4f85 {
            background-color: var(--success-color);
        }
        .container_b558d0 .lookFilled_dd4f85.colorGreen_dd4f85:hover, .container_b558d0 .lookFilled_dd4f85.colorGreen_dd4f85:active {
            background-color: hsl(139,  calc(var(--saturation-factor,  1) * 47.1%),  33.3%);
        }
        .lookInverted_a299dc.colorBrand_dd4f85, .lookInverted_a299dc.colorGreen_dd4f85 {
            background: #fff;
            color: var(--main-color);
        }
        .lookInverted_a299dc.colorBrand_dd4f85:hover, .lookInverted_a299dc.colorBrand_dd4f85:active, .lookInverted_a299dc.colorGreen_dd4f85:hover, .lookInverted_a299dc.colorGreen_dd4f85:active {
            background: rgba(255, 255, 255, .95);
            color: var(--hover-color);
        }
        .lookInverted_a299dc.colorBrand_dd4f85:disabled, .lookInverted_a299dc.colorGreen_dd4f85:disabled {
            background: rgba(255, 255, 255, .3);
        }
        .lookOutlined_dd4f85.colorWhite_dd4f85, .lookOutlined_dd4f85.colorPrimary_dd4f85, .lookOutlined_dd4f85.colorGreen_dd4f85, .lookOutlined_dd4f85.colorBrand_dd4f85 {
            border-color: var(--main-color);
            color: rgba(255, 255, 255, .8);
        }
        .lookOutlined_dd4f85.colorWhite_dd4f85:hover, .lookOutlined_dd4f85.colorPrimary_dd4f85:hover, .lookOutlined_dd4f85.colorGreen_dd4f85:hover, .lookOutlined_dd4f85.colorBrand_dd4f85:hover {
            background-color: rgba(0, 0, 0, 0);
            border-color: var(--hover-color);
            color: #fff;
        }
        .lookOutlined_dd4f85.colorRed_dd4f85 {
            border-color: var(--danger-color);
            color: rgba(255, 255, 255, .8);
        }
        .lookOutlined_dd4f85.colorRed_dd4f85:hover {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }
        .lookLink_dd4f85.colorWhite_dd4f85, .lookLink_dd4f85.colorPrimary_dd4f85 {
            color: #fff;
        }
        .lookLink_dd4f85.colorBrand_dd4f85 {
            color: var(--main-color);
        }
        .lookLink_dd4f85.colorLink_dd4f85 {
            color: var(--url-color);
        }
        .lookLink_dd4f85.colorLink_dd4f85:disabled:hover .contents_dd4f85 {
            text-decoration: none;
        }
        .lookLink_dd4f85.colorRed_dd4f85 {
            color: var(--danger-color);
        }
        .lookLink_dd4f85:hover .contents_dd4f85 {
            background-image: none;
            text-decoration: underline;
        }
        .button_e258f5 {
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
        }
        .button_e258f5:hover:not(.disabled_e258f5) {
            background-color: var(--hover-color);
            color: #fff;
        }
        .theme-dark .checkbox_f6cde8 {
            border-color: rgba(255, 255, 255, .5);
        }
        .theme-dark .checkbox_f6cde8.checked_f6cde8 {
            background-color: rgba(0, 0, 0, 0) !important;
            border-color: var(--main-color) !important;
        }
        .theme-dark .checkbox_f6cde8.checked_f6cde8>svg>path {
            fill: #fff;
        }
        .inputWrapper_f8bc55 {
            padding: 2px;
        }
        .input_f8bc55 {
            color: var(--text-normal);
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .input_f8bc55::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .input_f8bc55:hover {
            border: none;
        }
        .input_f8bc55:focus, .input_f8bc55.focused_f8bc55 {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .input_f8bc55.inputField_cc6ddd {
            border: none;
            box-shadow: none;
            background: none;
        }
        .input_f8bc55 .multiInputField_aefbba {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .copyInput_cedfaf .input_f8bc55 {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .theme-dark .pageButton_b48941.activeButton_b48941 {
            background-color: var(--main-color);
        }
        .theme-dark .pageButton_b48941:hover {
            background-color: var(--hover-color);
        }
        .theme-dark .pageButton_b48941:hover:disabled {
            background-color: rgba(0, 0, 0, 0);
        }
        .endButton_b48941:disabled {
            border-color: var(--main-color);
            color: #fff;
            opacity: .5;
            cursor: not-allowed;
        }
        .endButton_b48941:not(:disabled):hover {
            border-color: var(--hover-color);
        }
        .item_eb92a8 {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }
        .item_eb92a8:hover:not([aria-checked=true]):not(.disabled_eb92a8) {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }
        .item_eb92a8 .radioBar_eb92a8 {
            background-color: rgba(0, 0, 0, .4);
            border-left: 3px solid var(--radio-bar-accent-color);
            transition: all .15s ease-in-out;
        }
        [aria-checked=true].item_eb92a8 .radioBar_eb92a8 {
            background-color: var(--radio-bar-accent-color,  var(--main-color));
        }
        .item_eb92a8 .radioIconForeground_eb92a8 {
            color: #fff;
        }
        [style*="--radio-bar-accent-color:var(--green-360)"].radioBar_eb92a8 {
            --radio-bar-accent-color:  #43b581 !important;
        }
        [style*="--radio-bar-accent-color:var(--yellow-360)"].radioBar_eb92a8 {
            --radio-bar-accent-color:  #faa61a !important;
        }
        [style*="--radio-bar-accent-color:var(--red-400)"].radioBar_eb92a8 {
            --radio-bar-accent-color:  #982929 !important;
        }
        .auto_eed6a8, .auto_c49869, .thin_eed6a8, .thin_c49869 {
            scrollbar-width: unset !important;
            scrollbar-color: unset !important;
        }
        .auto_eed6a8::-webkit-scrollbar {
            width: 14px;
        }
        .thin_eed6a8::-webkit-scrollbar {
            width: 10px;
        }
        .none_eed6a8::-webkit-scrollbar {
            width: 0px;
        }
        ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track, ::-webkit-scrollbar-track-piece {
            border: 3px solid rgba(0, 0, 0, 0) !important;
            border-radius: 7px !important;
            background-clip: padding-box !important;
        }
        ::-webkit-scrollbar-thumb {
            background-color: var(--main-color) !important;
        }
        ::-webkit-scrollbar-thumb:active {
            background-color: var(--hover-color) !important;
        }
        ::-webkit-scrollbar-track, ::-webkit-scrollbar-track-piece {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        .membersWrap_cbd271 .scrollerBase_eed6a8::-webkit-scrollbar-thumb, .membersWrap_cbd271 .scrollerBase_eed6a8::-webkit-scrollbar-track-piece {
            visibility: hidden;
        }
        .membersWrap_cbd271 .scrollerBase_eed6a8:hover::-webkit-scrollbar-thumb, .membersWrap_cbd271 .scrollerBase_eed6a8:hover::-webkit-scrollbar-track-piece {
            visibility: visible;
        }
        .chat_a7d72e .scrollerBase_eed6a8::-webkit-scrollbar-track-piece, .membersWrap_cbd271 .scrollerBase_eed6a8::-webkit-scrollbar-track-piece {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3)) !important;
        }
        textarea::-webkit-scrollbar {
            display: none;
        }
        .modalContent_c5828f::-webkit-scrollbar {
            width: 0;
        }
        .slider_c7a159 .bar_c7a159 {
            background: rgba(255, 255, 255, .04);
            transition: all .15s ease-in-out;
        }
        .slider_c7a159 .barFill_c7a159 {
            background: var(--main-color);
        }
        .slider_c7a159 .grabber_c7a159 {
            background: #fff;
            border: none;
            border-radius: 5px;
            box-shadow: 0 0 1px 1px rgba(0, 0, 0, .3);
        }
        .slider_c7a159:focus .grabber_c7a159 {
            box-shadow: 0 0 3px 3px var(--hover-color);
        }
        .loadingPopout_a8c724 {
            background-color: rgba(0, 0, 0, .6);
        }
        .wanderingCubes_b6db20 .item_b6db20 {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            animation: none;
            filter: drop-shadow(0 0 3px var(--main-color));
        }
        .wanderingCubes_b6db20 .item_b6db20:before, .wanderingCubes_b6db20 .item_b6db20:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: 3px solid rgba(0, 0, 0, 0);
            border-radius: 50%}
        .wanderingCubes_b6db20 .item_b6db20:before {
            animation: cv-spin 1s ease-in-out infinite;
        }
        .wanderingCubes_b6db20 .item_b6db20:after {
            border-color: var(--main-color);
            opacity: .1;
        }
        .wanderingCubes_b6db20 .item_b6db20:first-child:before {
            border-left-color: var(--main-color);
            border-right-color: var(--main-color);
        }
        .wanderingCubes_b6db20 .item_b6db20:last-child {
            width: calc(100% - 10px);
            height: calc(100% - 10px);
            margin: 5px;
        }
        .wanderingCubes_b6db20 .item_b6db20:last-child:before {
            border-top-color: var(--main-color);
            border-bottom-color: var(--main-color);
            animation-direction: reverse;
        }
        .spinningCircle_b6db20 .path_b6db20 {
            stroke: var(--main-color);
        }
        .spinningCircle_b6db20 .path_b6db20 .path3_b6db20 {
            opacity: .2;
        }
        .spinner_eb1ca6 {
            background-color: rgba(0, 0, 0, .6);
        }
        .pulsingEllipsis_b6db20 .item_b6db20 {
            background-color: var(--main-color);
        }
        .container_cebd1c {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        .container_cebd1c:before {
            background-color: rgba(255, 255, 255, .15);
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: inherit;
            transition: all .1s ease-in-out;
        }
        .container_cebd1c.checked_cebd1c:before {
            background-color: var(--main-color);
        }
        .container_cebd1c path {
            fill: var(--main-color);
        }
        .top_a0 .brand_a0.item_a0:hover {
            border-bottom-color: var(--hover-color);
        }
        .top_a0 .brand_a0.item_a0.selected_a0, .top_a0 .brand_a0.item_a0:active {
            border-bottom-color: var(--main-color);
        }
        .topPill_a0 .themed_a0.item_a0, .side_a0 .themed_a0.item_a0 {
            color: rgba(255, 255, 255, .5);
            transition: all .3s ease-in-out;
        }
        .topPill_a0 .themed_a0.item_a0:hover:not(.disabled_a0), .side_a0 .themed_a0.item_a0:hover:not(.disabled_a0) {
            background-color: rgba(255, 255, 255, .1);
            color: rgba(255, 255, 255, .7);
        }
        .topPill_a0 .themed_a0.selected_a0.item_a0, .side_a0 .themed_a0.selected_a0.item_a0 {
            background-color: var(--main-color);
            color: #fff;
        }
        .topPill_a0 .themed_a0.selected_a0.item_a0:hover:not(.disabled_a0), .side_a0 .themed_a0.selected_a0.item_a0:hover:not(.disabled_a0) {
            background-color: var(--main-color);
            color: #fff;
        }
        .theme-dark .tooltip_b6c360 {
            padding: 5px 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
            border-radius: 3px;
            font-size: 13px;
            font-weight: 600;
        }
        .theme-dark .tooltip_b6c360 .tooltipContent_b6c360 {
            padding: 0;
        }
        .theme-dark .tooltip_b6c360.tooltipPrimary_b6c360, .theme-dark .tooltip_b6c360.tooltipNested_b6c360 {
            background: rgba(0, 0, 0, .9);
        }
        .theme-dark .tooltip_b6c360.tooltipPrimary_b6c360>.tooltipPointer_b6c360, .theme-dark .tooltip_b6c360.tooltipNested_b6c360>.tooltipPointer_b6c360 {
            border-top-color: rgba(0, 0, 0, .9);
        }
        .theme-dark .tooltip_b6c360.tooltipBrand_b6c360 {
            background: var(--main-color);
        }
        .theme-dark .tooltip_b6c360.tooltipBrand_b6c360>.tooltipPointer_b6c360 {
            border-top-color: var(--main-color);
        }
        .theme-dark .tooltip_b6c360.tooltipRed_b6c360 {
            background: var(--danger-color);
        }
        .theme-dark .tooltip_b6c360.tooltipRed_b6c360>.tooltipPointer_b6c360 {
            border-top-color: var(--danger-color);
        }
        .theme-dark .tooltip_b6c360.tooltipGreen_b6c360 {
            background: var(--success-color);
        }
        .theme-dark .tooltip_b6c360.tooltipGreen_b6c360>.tooltipPointer_b6c360 {
            border-top-color: var(--success-color);
        }
        .theme-dark .tooltip_b6c360.tooltipTop_b6c360 {
            animation: cv-menu-fold-y .15s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 50% 100%}
        .theme-dark .tooltip_b6c360.tooltipBottom_b6c360 {
            animation: cv-menu-fold-y .15s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 50% 0;
        }
        .theme-dark .tooltip_b6c360.tooltipRight_b6c360 {
            animation: cv-menu-fold-x .15s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 0 50%}
        .theme-dark .tooltip_b6c360.tooltipLeft_b6c360 {
            animation: cv-menu-fold-x .15s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 100% 50%}
        .theme-dark .tooltip_b6c360 .hub_db1980>.icon_db1980>circle {
            fill: var(--main-color);
        }
        .tooltip_f4c8b7 {
            background: rgba(0, 0, 0, .9);
        }
        .tooltip_f4c8b7>.tooltipPointer_f4c8b7 {
            border-top-color: rgba(0, 0, 0, .9);
        }
        .upsellTooltipWrapper_dafa63 {
            background-color: rgba(0, 0, 0, .8);
        }
        .upsellTooltipWrapper_dafa63.caretTopCenter_dafa63:after {
            border-bottom-color: rgba(0, 0, 0, .8);
        }
        .reactionTooltip_fba897 {
            background: rgba(0, 0, 0, .9);
            padding: 5px 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
            border-radius: 3px;
            font-size: 13px;
        }
        .container_be6a5c {
            background: rgba(0, 0, 0, .9);
        }
        .tooltipPointer_be6a5c {
            border-right-color: rgba(0, 0, 0, .9);
        }
        .container_cfbfb9 {
            background-color: rgba(255, 255, 255, .1);
        }
        .layer_d4b6c5 .wrapper_fea3ef {
            background-color: rgba(0, 0, 0, 0);
        }
        .platform-osx .unreadMentionsIndicatorTop_fea3ef {
            top: 24px;
        }
        .platform-osx .wrapper_fea3ef {
            margin-top: 0;
            padding-top: 48px;
        }
        .platform-osx .wrapper_fea3ef:before {
            content: "";
            height: 48px;
            margin-top: -48px;
        }
        .wrapper_fea3ef {
            box-shadow: inset 0 0 20px rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .theme-dark .scroller_fea3ef {
            background: rgba(0, 0, 0, 0);
        }
        .tree_fea3ef {
            outline: none;
        }
        .childWrapper_f90abb>svg {
            width: 100%;
            height: 100%;
            background: var(--home-icon) var(--home-position)/var(--home-size) no-repeat;
        }
        .childWrapper_f90abb>svg>path {
            display: none;
        }
        .icon_f90abb {
            background-color: rgba(0, 0, 0, .3);
        }
        .childWrapper_f90abb {
            background-color: rgba(0, 0, 0, .3);
            color: rgba(255, 255, 255, .7);
            transition: all .3s ease-in-out;
        }
        .wrapper_f90abb:hover .childWrapper_f90abb, .wrapper_f90abb.selected_f90abb .childWrapper_f90abb {
            background-color: var(--main-color);
            color: #fff;
        }
        .pill_a5ad63 {
            overflow: visible;
        }
        .item_fd07a3 {
            width: 12px;
            margin-left: -6px;
            border-radius: 20px;
            background: var(--main-color);
            box-shadow: 0 0 20px -1px var(--main-color);
        }
        [style*="height: 8px"].item_fd07a3 {
            height: 10px !important;
        }
        .dragInner_f734d8 {
            background: rgba(255, 255, 255, .1);
        }
        .iconBadge_c96c45 {
            background: rgba(0, 0, 0, .7);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, .7);
        }
        .iconBadge_c96c45 .icon_df8943 {
            padding: 1px;
            color: var(--main-color);
            filter: drop-shadow(0 0 3px var(--main-color));
        }
        .iconBadge_c96c45.isCurrentUserConnected_c96c45 {
            background: var(--main-color);
            box-shadow: 0 0 0 1px var(--main-color);
        }
        .iconBadge_c96c45.isCurrentUserConnected_c96c45 .icon_df8943 {
            color: #fff;
        }
        .folder_bc7085 {
            background-color: rgba(0, 0, 0, 0);
            transition: all .3s ease-in-out;
        }
        .folder_bc7085.hover_bc7085 {
            background-color: rgba(255, 255, 255, .1);
        }
        .noIcon_f11207 {
            background: rgba(0, 0, 0, .4);
        }
        .expandedFolderBackground_bc7085 {
            background: rgba(255, 255, 255, .07);
            border-radius: 16px 16px 24px 24px;
            transition: background-color .3s ease-in-out;
        }
        .circleIconButton_db6521 {
            background: rgba(0, 0, 0, .3);
            color: rgba(255, 255, 255, .7);
            transition: all .3s ease-in-out;
        }
        .circleIconButton_db6521:hover, .circleIconButton_db6521.selected_db6521 {
            background: var(--main-color);
            color: #fff;
        }
        .guildsError__32e67 {
            background: rgba(0, 0, 0, .5);
            border: 2px solid var(--danger-color);
            color: #fff;
            transition: all .3s ease-in-out;
        }
        .guildsError__32e67:hover {
            background: var(--danger-color);
            border-color: var(--danger-color);
        }
        .guildSeparator_d0c57e {
            background: rgba(255, 255, 255, .1);
        }
        .base_a4d4d9 .container_e44302 {
            height: 48px;
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            box-shadow: 0 0 10px rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            color: rgba(255, 255, 255, .5);
        }
        .base_a4d4d9 .chatHeaderBar_e2f46e {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            box-shadow: 0 0 10px rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            color: rgba(255, 255, 255, .5);
        }
        .container_e44302 .children_e44302 {
            -webkit-mask: linear-gradient(to left,  transparent,  #000 20px);
            mask: linear-gradient(to left,  transparent,  #000 20px);
        }
        .container_e44302 .children_e44302:after {
            display: none;
        }
        .container_e44302 .children_e44302 .icon_e44302 {
            color: var(--main-color);
            filter: drop-shadow(0 0 3px);
            width: 22px;
        }
        .container_e44302 .title_e44302 {
            margin-left: 0;
            color: #fff;
            text-shadow: 0 0 3px #000;
            font-family: var(--main-font);
        }
        .container_e44302 .topic_bf3bbb {
            color: rgba(255, 255, 255, .5);
        }
        .container_e44302 .topic_bf3bbb a {
            color: var(--main-color);
            transition: all .1s ease-in-out;
        }
        .container_e44302 .topic_bf3bbb a:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .container_e44302 .akaBadge_d6c26f {
            background: rgba(255, 255, 255, .1);
            color: #fff;
        }
        .container_e44302 .nicknames_d6c26f {
            color: rgba(255, 255, 255, .5);
        }
        .container_e44302 .divider_e44302 {
            background: rgba(255, 255, 255, .1);
        }
        .iconWrapper_e44302 {
            margin: 0 1px;
            padding: 2px 3px;
            box-sizing: content-box;
        }
        .iconWrapper_e44302>svg>foreignObject {
            mask: none;
        }
        .content_ed23b8 a {
            color: var(--main-color);
        }
        .input_f8b740:focus {
            background: rgba(0, 0, 0, 0);
            box-shadow: inset 0 0 0 1px var(--main-color);
        }
        .outer_f8b740:hover .input_f8b740 {
            box-shadow: inset 0 0 0 1px var(--main-color);
        }
        .breadcrumbs_bac619 {
            margin-left: 2px;
        }
        .breadcrumbs_bac619 .breadcrumb_dacdd0 {
            margin: 0 3px;
            transition: all .15s ease-in-out;
        }
        .breadcrumbs_bac619 .breadcrumbArrow__58361 {
            transition: all .15s ease-in-out;
        }
        .breadcrumbs_bac619 .breadcrumbWrapper__75797 {
            color: rgba(255, 255, 255, .3);
        }
        .breadcrumbs_bac619 .breadcrumbWrapper__75797:hover .breadcrumb_dacdd0 {
            color: rgba(255, 255, 255, .7);
            text-decoration: none;
        }
        .breadcrumbs_bac619 .breadcrumbWrapper__75797:hover .breadcrumbArrow__58361.directionRight_f48d4e {
            color: rgba(255, 255, 255, .7);
            transform: rotateY(180deg) rotateZ(-90deg) translateY(3px);
        }
        .searchBar_a46bef, .searchBar_e0264e {
            background-color: rgba(255, 255, 255, .07);
            border-radius: 3px;
            transition: width .2s ease-in-out .1s;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            margin: 2px;
        }
        .searchBar_a46bef:focus-within, .searchBar_e0264e:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
            transition: all .15s ease-in-out;
        }
        .search_a46bef .searchFilter_b0fa94, .search_a46bef .searchAnswer_b0fa94 {
            background: var(--main-color);
            color: #fff;
        }
        .search_a46bef .searchFilter_b0fa94 {
            padding: 0 3px;
        }
        .search_a46bef .searchAnswer_b0fa94 {
            margin: 0 2px 0 0;
            padding: 0 3px 0 0;
        }
        .icon_c18ec9 {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .backButton_b56bbc {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .backButton_b56bbc:hover {
            color: #fff;
        }
        .container_eedf95 .queryContainer_eedf95 .keybindShortcutSearchPopout_c90023>span {
            display: none;
        }
        .toolbar_e44302 .iconWrapper_e44302 {
            border-radius: 3px;
            transition: all .3s ease-in-out;
        }
        .toolbar_e44302 .iconWrapper_e44302 .icon_e44302 {
            color: #fff;
            opacity: .5;
            transition: all .15s ease-in-out;
        }
        .toolbar_e44302 .iconWrapper_e44302.selected_e44302 {
            background: rgba(255, 255, 255, .1);
        }
        .toolbar_e44302 .iconWrapper_e44302.selected_e44302 .icon_e44302 {
            opacity: .7;
        }
        .toolbar_e44302 .iconWrapper_e44302.clickable_e44302:hover .icon_e44302 {
            opacity: 1;
        }
        .toolbar_e44302 .iconWrapper_e44302>svg:not(.icon_e44302) {
            color: var(--main-color);
            filter: drop-shadow(0 0 5px);
            transition: filter .3s ease-in-out;
        }
        .toolbar_e44302 .iconWrapper_e44302:hover>svg:not(.icon_e44302) {
            filter: drop-shadow(0 0 5px) drop-shadow(0 0 10px);
        }
        .toolbar_e44302 .iconWrapper_e44302 .iconBadge_e44302 {
            background-color: var(--main-color);
        }
        .theme-dark .container_c2739c {
            background-color: rgba(0, 0, 0, 0);
        }
        .peopleColumn_c2739c {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .searchBar_e0840f {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            border: none;
        }
        .searchBar_e0840f:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .peopleListItem_d51464 {
            border-top: 1px solid rgba(255, 255, 255, .1);
        }
        .peopleListItem_d51464:hover, .peopleListItem_d51464.active_d51464 {
            background-color: rgba(255, 255, 255, .05);
        }
        .activity_f7ebfd {
            color: rgba(255, 255, 255, .5);
        }
        .activity_f7ebfd strong {
            color: var(--main-color);
        }
        .container_aef5fd {
            background: rgba(0, 0, 0, .2);
            border: 2px solid var(--main-color);
        }
        .container_aef5fd:hover {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--hover-color);
        }
        .actionButton_e01b91 {
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
        }
        .actionButton_e01b91.highlight_e01b91 {
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
        }
        .actionButton_e01b91:hover {
            background-color: var(--hover-color);
            color: #fff;
        }
        .actionButton_e01b91.actionAccept_e01b91 {
            color: var(--success-color);
        }
        .actionButton_e01b91.actionAccept_e01b91:hover {
            background-color: var(--success-color);
            color: #fff !important;
        }
        .actionButton_e01b91.actionDeny_e01b91 {
            color: var(--danger-color);
        }
        .actionButton_e01b91.actionDeny_e01b91:hover {
            background-color: var(--danger-color);
            color: #fff !important;
        }
        [aria-controls=add_friend-tab][aria-selected=false].item_a0 {
            background-color: var(--success-color) !important;
            color: #fff !important;
        }
        [aria-controls=add_friend-tab][aria-selected=true].item_a0 {
            background-color: rgba(0, 0, 0, 0) !important;
            color: var(--success-color) !important;
            box-shadow: 0 0 0 1px var(--success-color) inset;
        }
        [aria-controls=add_friend-tab][aria-selected=true].item_a0:before {
            content: "";
            position: absolute;
            background-color: var(--success-color);
            opacity: .2;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .addFriendInputWrapper_de812f {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            border: none;
        }
        .addFriendInputWrapper_de812f:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .addFriendInputWrapper_de812f .input_f8bc55 {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .addFriendInputWrapper_de812f .input_f8bc55:focus, .addFriendInputWrapper_de812f .input_f8bc55.focused_f8bc55 {
            box-shadow: none;
        }
        .addFriendInput_de812f::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .addFriendHint_de812f {
            color: rgba(255, 255, 255, .3);
        }
        .nowPlayingColumn_c2739c {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .container_bf550a {
            background-color: rgba(0, 0, 0, 0);
        }
        .scroller_bf550a {
            border-left: none;
        }
        .consentCard_ea523e {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .outer_c0f6a6 {
            background-color: rgba(0, 0, 0, .4);
            border: 1px solid rgba(0, 0, 0, 0);
        }
        .theme-dark .outer_c0f6a6.interactive_c0f6a6:hover, .theme-dark .outer_c0f6a6.active_c0f6a6 {
            background-color: rgba(0, 0, 0, .6);
        }
        .theme-dark .inset_c0f6a6 {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .partyMemberOverflow_b448f2 {
            background-color: var(--background-overlay);
        }
        .section_cd82a7 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .applicationStreamingPreviewWrapper_cd82a7 {
            background-color: rgba(0, 0, 0, 0);
        }
        .emptyCard_f02fcf {
            background-color: rgba(0, 0, 0, .4);
        }
        .emptyText_f02fcf {
            color: rgba(255, 255, 255, .3);
        }
        .userProfileOuterUnthemed_c69a7b {
            background-color: rgba(0, 0, 0, .4);
        }
        .userProfileOuterUnthemed_c69a7b .userPanelInnerThemed_c69a7b {
            background: rgba(0, 0, 0, 0);
        }
        .userProfileOuterUnthemed_c69a7b .overlayBackground_c69a7b {
            background: rgba(0, 0, 0, .4);
        }
        .scroller_ad8f79 {
            background: rgba(0, 0, 0, 0);
        }
        .header_f1629a {
            background-color: rgba(0, 0, 0, 0);
            border-bottom: 1px solid rgba(255, 255, 255, .07);
        }
        .header_f1629a>.headerCell_f1629a {
            border-left-color: rgba(255, 255, 255, .07);
            color: rgba(255, 255, 255, .3);
            transition: all .3s ease-in-out;
        }
        .header_f1629a>.headerCell_f1629a:hover:not(.headerCellSorted_f1629a) {
            color: rgba(255, 255, 255, .5);
        }
        .header_f1629a>.headerCellSorted_f1629a {
            color: rgba(255, 255, 255, .7);
        }
        .rowWrapper_f1629a {
            background-color: rgba(0, 0, 0, 0);
            border-radius: 0;
            transition: all .15s ease-in-out;
        }
        .rowWrapper_f1629a {
            margin: 0 20px;
            padding: 0;
        }
        .rowWrapper_f1629a+.rowWrapper_f1629a>.row_f1629a {
            margin-top: -1px;
            border-top: 1px solid rgba(255, 255, 255, .04);
        }
        .rowWrapper_f1629a:hover {
            background-color: rgba(0, 0, 0, .3);
        }
        .row_f1629a {
            margin: 0;
            color: rgba(255, 255, 255, .7);
        }
        .row_f1629a .actionsCell_f1629a .button_dd4f85 {
            background-color: rgba(255, 255, 255, .07);
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .row_f1629a .actionsCell_f1629a:hover .button_dd4f85:hover {
            background-color: var(--main-color);
            color: #fff;
        }
        .textCell_f1629a {
            color: rgba(255, 255, 255, .5);
        }
        .lastPlayedCellNew_f1629a {
            color: var(--main-color);
        }
        .settingIcon_f1629a {
            color: #fff;
            opacity: .5;
            transition: all .15s ease-in-out;
        }
        .settingIcon_f1629a:hover {
            opacity: 1;
        }
        .rowWrapperDim_f1629a .nameBodyCell_f1629a, .rowWrapperDim_f1629a .textCell_f1629a, .rowWrapperDim_f1629a .settingIcon_f1629a {
            transition: all .15s ease-in-out;
        }
        .scroller_c100ff {
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .installationPath_d037ef {
            box-shadow: 0 1px 0 0 rgba(255, 255, 255, .06);
        }
        .theme-dark .background_cd2edd {
            stroke: rgba(0, 0, 0, .6);
        }
        .theme-dark .foreground_cd2edd {
            stroke: var(--main-color);
        }
        .theme-dark .defaultIndicator_d037ef {
            background-color: var(--main-color);
        }
        .applicationStore_cecc86 {
            background-color: rgba(0, 0, 0, 0);
        }
        .scroller_a8b566, .mainPageScroller_ed2e7b {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
            right: 0%;
            transition: all .5s ease-in-out;
        }
        .scroller_a8b566:has(+.allPerksScroller_ed2e7b.open_ed2e7b), .mainPageScroller_ed2e7b:has(+.allPerksScroller_ed2e7b.open_ed2e7b) {
            right: 100%}
        .card_c21997 {
            background-color: rgba(0, 0, 0, .4);
        }
        .card_c21997:hover {
            background-color: rgba(0, 0, 0, .6);
        }
        .seeAllPerksButton_ed2e7b {
            background-color: rgba(0, 0, 0, .6);
        }
        .giftNitro_ed2e7b {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .textContainer_d8f41e {
            background-image: none;
        }
        .innerWrapper_c511e4 {
            background-color: rgba(0, 0, 0, .8);
        }
        .allPerksScroller_ed2e7b {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            transition: all .5s ease-in-out;
        }
        .backButton_acb067 {
            background-color: rgba(0, 0, 0, .6);
        }
        .backButton_acb067:hover {
            background-color: rgba(0, 0, 0, .8);
        }
        .theme-dark .leftArrow_b9d4cd, .theme-dark .rightArrow_b9d4cd {
            background-color: rgba(0, 0, 0, .6);
        }
        .arrowIcon_b9d4cd {
            fill: rgba(255, 255, 255, .7);
        }
        .theme-dark .inactiveArrow_b9d4cd {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .inactiveArrow_b9d4cd .arrowIcon_b9d4cd {
            fill: rgba(255, 255, 255, .3);
        }
        .cardProgressBar_b9d4cd {
            background-color: rgba(0, 0, 0, .6);
        }
        .dot_b9d4cd {
            background-color: rgba(255, 255, 255, .5);
        }
        .selectedDot_b9d4cd {
            background-color: #fff;
        }
        .selected_f3abf4, .selected_cc7518, .active_a5de62.messageRequestItem_a5de62, .messageRequestItem_a5de62:hover {
            background: var(--hover-color);
            animation: cv-fade-to-8 .3s ease-in-out;
        }
        .hamBanner_d1cafc {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .container_cbd271 {
            background-color: rgba(0, 0, 0, 0);
        }
        .membersWrap_cbd271 {
            min-width: auto;
            min-height: 100%;
            flex-basis: var(--members-width);
        }
        .members_cbd271 {
            width: var(--members-width);
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
        }
        .membersListNotices__0bcb6 {
            width: var(--members-width);
        }
        .members_cbd271 .membersGroup_cbd271 {
            padding-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--main-color);
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            transition: all .15s ease-in-out;
            opacity: .7;
        }
        .members_cbd271 .membersGroup_cbd271:hover {
            opacity: 1;
        }
        .members_cbd271 .membersGroup_cbd271:before {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to left,  currentColor 50%,  transparent);
            margin-right: 5px;
        }
        .members_cbd271 .membersGroup_cbd271:after {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to right,  currentColor 50%,  transparent);
            margin-left: 5px;
        }
        .members_cbd271 .member_cbd271 {
            max-width: calc(var(--members-width) - 16px);
            background: rgba(0, 0, 0, 0);
            backface-visibility: hidden;
        }
        .members_cbd271 .member_cbd271.offline_a31c43 .avatar_e9f61e {
            filter: grayscale(100%) blur(1px);
            transition: all .5s ease-in-out;
        }
        .members_cbd271 .member_cbd271.offline_a31c43:hover .avatar_e9f61e {
            filter: none;
        }
        .members_cbd271 .member_cbd271 .layout_e9f61e {
            position: relative;
            background: rgba(0, 0, 0, 0);
            transition: all .15s ease-in-out, transform .1s ease-in-out;
            z-index: 1;
        }
        .members_cbd271 .member_cbd271 .layout_e9f61e:active {
            transform: scale(0.9);
        }
        .members_cbd271 .member_cbd271 .username_a31c43>span {
            max-width: 100%;
            overflow: visible;
            transition: all .15s ease-in-out;
        }
        .members_cbd271 .member_cbd271 .username_a31c43>span:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right,  hsla(0deg,  0%,  100%,  0.07) 90%,  transparent);
            border-radius: 3px;
            opacity: 0;
            transition: all .15s ease-in-out;
            z-index: -1;
            pointer-events: none;
        }
        .members_cbd271 .member_cbd271 .username_a31c43>span:after {
            content: "";
            position: absolute;
            top: 0;
            right: 100%;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right,  var(--main-color) 90%,  transparent);
            border-radius: 3px;
            opacity: .8;
            transition: all .3s ease-in-out;
            z-index: -1;
            pointer-events: none;
        }
        .members_cbd271 .member_cbd271 .username_a31c43>span[style^="color:"]:before, .members_cbd271 .member_cbd271 .username_a31c43>span[style^="color:"]:after {
            background: linear-gradient(to right,  currentColor 90%,  transparent);
        }
        .members_cbd271 .member_cbd271:hover .username_a31c43>span:before, .members_cbd271 .member_cbd271.selected_e9f61e .username_a31c43>span:before {
            opacity: 1;
        }
        .members_cbd271 .member_cbd271:hover .username_a31c43>span[style^="color:"]:before, .members_cbd271 .member_cbd271.selected_e9f61e .username_a31c43>span[style^="color:"]:before {
            opacity: .07;
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .username_a31c43>span {
            -webkit-text-fill-color: #fff;
            text-shadow: 0 0 3px rgba(0, 0, 0, .7);
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .username_a31c43>span:after {
            right: 0;
        }
        .members_cbd271 .member_cbd271 .name_e9f61e {
            font-size: 14px;
            color: rgba(255, 255, 255, .6);
            transition: all .15s ease-in-out;
            overflow: hidden;
        }
        .members_cbd271 .member_cbd271 .activityText_a31c43 {
            color: rgba(255, 255, 255, .4);
            transition: all .15s ease-in-out;
        }
        .members_cbd271 .member_cbd271 .activityText_a31c43 strong {
            color: var(--main-color);
            font-weight: 700;
            transition: all .15s ease-in-out;
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .name_e9f61e {
            color: #fff;
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .activityText_a31c43 {
            text-shadow: 0 0 3px rgba(0, 0, 0, .7);
            color: rgba(255, 255, 255, .7);
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .activityText_a31c43 strong {
            color: #fff;
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .ownerIcon_a31c43 {
            filter: drop-shadow(0 0 3px rgba(0,  0,  0,  0.7));
            opacity: .7;
        }
        .members_cbd271 .member_cbd271.selected_e9f61e .icon_ad923e, .members_cbd271 .member_cbd271.selected_e9f61e .activityEmoji_a31c43 {
            filter: drop-shadow(0 0 3px rgba(0,  0,  0,  0.7));
        }
        .members_cbd271 .memberGroupsPlaceholder_cbd271 {
            margin: 0 25%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-basis: 50%;
            color: rgba(255, 255, 255, .3);
        }
        .members_cbd271 .memberGroupsPlaceholder_cbd271:before, .members_cbd271 .memberGroupsPlaceholder_cbd271:after {
            content: "";
            height: 2px;
            flex-grow: 1;
        }
        .members_cbd271 .memberGroupsPlaceholder_cbd271:before {
            background: linear-gradient(to left,  currentColor 50%,  transparent);
            margin-right: calc(50% + 5px);
            margin-left: -50%}
        .members_cbd271 .memberGroupsPlaceholder_cbd271:after {
            background: linear-gradient(to right,  currentColor 50%,  transparent);
            margin-right: -50%;
            margin-left: calc(50% + 5px);
        }
        .members_cbd271 .memberGroupsPlaceholder_cbd271, .members_cbd271 .placeholderAvatar_fb03e5, .members_cbd271 .placeholderUsername_a43b87, .members_cbd271 .mulitplePlaceholderUsername_fb03e5 {
            background: rgba(255, 255, 255, .3);
        }
        .addMembersIcon_d9b498 {
            background-color: var(--background-overlay);
        }
        .emptyStateHeader_b767ed {
            padding-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--main-color) !important;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            transition: all .15s ease-in-out;
            opacity: 1;
        }
        .emptyStateHeader_b767ed:before {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to left,  currentColor 50%,  transparent);
            margin-right: 5px;
        }
        .emptyStateHeader_b767ed:after {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to right,  currentColor 50%,  transparent);
            margin-left: 5px;
        }
        .emptyStateIcon_b767ed {
            background-color: var(--main-color);
            color: #fff;
        }
        .container_c64476 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
            border: 2px solid rgba(0, 0, 0, 0);
        }
        .container_c64476:hover {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
            border: 2px solid var(--hover-color);
        }
        .contents_ec86aa>img~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: none;
            color: currentcolor;
            text-shadow: 0 0 2px currentcolor;
            border: 1px solid;
            border-radius: 6px;
            margin-left: 8px;
            background-color: rgba(255, 255, 255, .07);
            font-size: 10px;
            padding: 0 5px;
        }
        .contents_ec86aa>img[src*="194151269399527425"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="194151269399527425"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Admin"}
        .contents_ec86aa>img[src*="144881947557101568"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="144881947557101568"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Admin"}
        .contents_ec86aa>img[src*="332394843743584256"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="332394843743584256"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Team"}
        .contents_ec86aa>img[src*="240437190339854337"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="240437190339854337"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Team"}
        .contents_ec86aa>img[src*="126652966265421824"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="126652966265421824"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Team"}
        .contents_ec86aa>img[src*="393900343135830016"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="393900343135830016"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Team"}
        .contents_ec86aa>img[src*="335677038830682112"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="335677038830682112"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Team"}
        .contents_ec86aa>img[src*="195270435015884800"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="195270435015884800"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="236579127090610176"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="236579127090610176"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="97797564866236416"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="97797564866236416"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="150750980097441792"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="150750980097441792"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="213067580531933196"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="213067580531933196"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="858800346884997142"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="858800346884997142"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="310468127534350347"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="310468127534350347"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="384167892012498944"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="384167892012498944"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Contributor"}
        .contents_ec86aa>img[src*="262989909411758080"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="262989909411758080"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="168551219135119361"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="168551219135119361"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="241500427105992704"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="241500427105992704"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="151995147150819328"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="151995147150819328"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="157699533134888961"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="157699533134888961"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="157492606752784384"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="157492606752784384"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="174525242939670528"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="174525242939670528"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="78890013378486272"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="78890013378486272"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="213263668312408066"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="213263668312408066"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="152431535914614785"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="152431535914614785"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="112619227466182656"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="112619227466182656"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="297873043265552384"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="297873043265552384"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="258031697646321666"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="258031697646321666"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="109933711142719488"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="109933711142719488"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="251260900252712962"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="251260900252712962"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="199184208319610880"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="199184208319610880"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="122731339890950145"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="122731339890950145"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="436228721033216009"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="436228721033216009"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="66214870705516544"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="66214870705516544"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="172426681800196096"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="172426681800196096"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="158311402677731328"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="158311402677731328"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="284122164582416385"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="284122164582416385"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="107965218868457472"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="107965218868457472"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="183795147236966412"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="183795147236966412"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="245133485688225793"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="245133485688225793"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Donator"}
        .contents_ec86aa>img[src*="538745942493495298"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="538745942493495298"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Translator"}
        .contents_ec86aa>img[src*="265627010733178892"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="265627010733178892"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "CV Guide Maker"}
        .contents_ec86aa>img[src*="309976820109803520"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after, .messageContent_ec86aa>img[src*="309976820109803520"]~.header_ec86aa>.headerText_ec86aa>.username_ec86aa::after {
            content: "Former CV Team"}
        .container_a1531c {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .answerSelectionIcon_cf2c85 .radioForeground_b97e9a {
            fill: var(--main-color);
        }
        .answer_cf2c85 .answerInner_cf2c85.currentlyVoting_cf2c85.selected_cf2c85 {
            outline: 2px solid var(--main-color);
        }
        .answer_cf2c85:hover .answerInner_cf2c85.currentlyVoting_cf2c85 {
            outline: 2px solid var(--hover-color);
        }
        .secondaryButtonPresentation_a1531c {
            background-color: var(--main-color);
        }
        .message_d5deea .avatar_ec86aa {
            transition: all .3s ease-in-out, transform .1s ease-in-out;
        }
        .message_d5deea .avatar_ec86aa:active {
            transform: scale(0.9);
        }
        .message_d5deea .timestamp_ec86aa {
            text-align: center;
            color: rgba(255, 255, 255, .5);
        }
        .message_d5deea .contents_ec86aa, .message_d5deea .messageContent_ec86aa {
            color: var(--text-normal);
        }
        .message_d5deea .container_e62b38 {
            color: rgba(255, 255, 255, .5);
        }
        .message_d5deea .markup_d6076c .blockquoteDivider_d6076c {
            background: rgba(255, 255, 255, .2);
            border-radius: 0;
        }
        .inlineMediaEmbed_ad0b71 {
            max-width: max-content;
        }
        .spoilerMarkdownContent_a3d0f7 {
            background-color: rgba(0, 0, 0, .8);
        }
        .markup_d6076c a, .anchor_af404b {
            color: var(--url-color);
        }
        .content_e62b38 .actionAnchor_e62b38 {
            color: var(--url-color);
        }
        .theme-dark .tile_ab47a1 {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .tile_ab47a1:hover {
            background-color: rgba(0, 0, 0, .4);
        }
        .repliedMessage_ec86aa:before {
            border-color: var(--main-color);
        }
        .repliedMessage_ec86aa .repliedTextPreview_ec86aa {
            opacity: .7;
        }
        .repliedMessage_ec86aa .repliedTextPreview_ec86aa.clickable_ec86aa:hover {
            opacity: 1;
        }
        .repliedMessage_ec86aa .repliedTextPreview_ec86aa .repliedTextContent_ec86aa {
            color: #fff;
        }
        .repliedMessage_ec86aa .repliedTextPreview_ec86aa .repliedTextPlaceholder_ec86aa {
            color: var(--main-color);
        }
        .repliedMessage_ec86aa.executedCommand_ec86aa .appLauncherOnboardingCommandName_ec86aa {
            color: var(--main-color);
            background: rgba(0, 0, 0, 0);
            text-decoration: underline;
        }
        .repliedMessage_ec86aa.executedCommand_ec86aa .appLauncherOnboardingCommandName_ec86aa:hover {
            color: var(--hover-color);
            background: rgba(0, 0, 0, 0);
        }
        .repliedMessage_ec86aa.executedCommand_ec86aa .commandName_ec86aa {
            color: var(--main-color);
        }
        .icon_f054bd {
            color: var(--main-color);
            filter: drop-shadow(0 0 3px);
            height: 22px;
            width: 22px;
        }
        .container_c15230 {
            background-color: rgba(0, 0, 0, .4);
        }
        .cta_c15230 {
            color: var(--main-color);
        }
        .cozy_ec86aa.hasThread_ec86aa:after {
            border-color: var(--main-color);
        }
        .jump_d5deea {
            background-color: var(--main-color);
            color: #fff;
        }
        .jump_d5deea:hover {
            background-color: var(--hover-color);
            color: #fff;
        }
        .wrapper_ef319f {
            background-color: rgba(0, 0, 0, 0);
        }
        .wrapper_ef319f .button_ef319f {
            color: rgba(255, 255, 255, .7);
        }
        .wrapper_ef319f .button_ef319f:hover, .wrapper_ef319f .button_ef319f.selected_ef319f {
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
        }
        .theme-dark .operations_ed9386 {
            color: rgba(255, 255, 255, .5);
        }
        .theme-dark .operations_ed9386>a {
            color: var(--main-color);
        }
        .replying_d5deea {
            background-color: rgba(255, 255, 255, .05);
        }
        .mouse-mode.full-motion .replying_d5deea:hover {
            background-color: rgba(255, 255, 255, .08);
        }
        .replying_d5deea:before {
            background-color: var(--main-color);
        }
        .compactButton_fcbce6, .compactButtonDisabled_fcbce6 {
            background-color: var(--main-color);
        }
        .compactButton_fcbce6:hover {
            background-color: var(--hover-color);
        }
        .bumpBox_ca33de {
            background: rgba(0, 0, 0, .4);
        }
        .icon_ca33de, .tagline_ca33de {
            color: #fff;
        }
        .closeIcon_ca33de, .hidePermanently_ca33de {
            color: rgba(255, 255, 255, .4) !important;
        }
        .embedCard_c6cefd, .footerContainer_bf4197 {
            background-color: rgba(0, 0, 0, .4);
        }
        .embedCard_c6cefd.selected_bf4197 {
            background-color: rgba(0, 0, 0, .4);
        }
        .footerAction_bf4197 .text-xs-normal__46d75, .footerAction_bf4197 .footerIcon_bf4197 path {
            color: var(--url-color);
        }
        .invite_cdcad9 .header_cdcad9 {
            color: rgba(255, 255, 255, .5);
        }
        .invite_cdcad9 .partyStatus_cdcad9 {
            color: #fff;
        }
        .invite_cdcad9 .helpIcon_cdcad9 {
            display: flex;
            background: rgba(255, 255, 255, .07);
            transition: all .15s ease-in-out;
            opacity: 0;
        }
        .invite_cdcad9:hover .helpIcon_cdcad9 {
            opacity: .7;
        }
        .invite_cdcad9:hover .helpIcon_cdcad9:hover {
            opacity: 1;
        }
        .invite_cdcad9 .artworkSpotifySessionEnded_cdcad9 {
            filter: grayscale(1) brightness(2);
            opacity: .3;
        }
        .invite_cdcad9 .partyMemberEmpty_cdcad9 {
            background: rgba(255, 255, 255, .07);
        }
        .theme-dark .attachment_a4623d {
            background: rgba(255, 255, 255, .06);
            border-color: rgba(255, 255, 255, .08);
        }
        .icon_a4623d {
            width: 30px;
            height: 30px;
            box-sizing: border-box;
            padding-left: 30px;
            background-image: url(https://clearvision.github.io/icons/file.svg);
            background-position: center;
            background-size: 100%;
            background-repeat: no-repeat;
            opacity: .5;
        }
        :not(.embedWrapper_b558d0)>[title=unknown].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_upload.svg);
        }
        [title=document].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_document.svg);
        }
        [title=archive].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_archive.svg);
        }
        [title=code].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_code.svg);
        }
        [title=webcode].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_webcode.svg);
        }
        [title=ai].icon_a4623d, [title=ps].icon_a4623d, [title=photoshop].icon_a4623d, [title=sketch].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_image.svg);
        }
        [title=ae].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_video.svg);
        }
        [title=spreadsheet].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_table.svg);
        }
        [title=acrobat].icon_a4623d {
            background-image: url(https://clearvision.github.io/icons/file_pdf.svg);
        }
        .fileNameLink_a4623d {
            color: var(--main-color);
            transition: all .1s ease-in-out;
        }
        .fileNameLink_a4623d:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .downloadButton__3fb6d, .cancelButton_a4623d {
            color: rgba(255, 255, 255, .3);
            transition: all .15s ease-in-out;
        }
        .downloadButton__3fb6d:hover, .cancelButton_a4623d:hover {
            color: rgba(255, 255, 255, .5);
        }
        .metadata_a4623d {
            color: rgba(255, 255, 255, .3);
        }
        .attachment_a4623d .filename_a4623d {
            color: rgba(255, 255, 255, .7);
        }
        .attachment_a4623d .size_a4623d {
            color: rgba(255, 255, 255, .3);
        }
        .progress_a4623d {
            background: rgba(255, 255, 255, .04) !important;
        }
        .progressBar_c6473a {
            background: var(--main-color) !important;
        }
        .blockedAction_c09d0f {
            color: var(--main-color);
        }
        .blockedSystemMessage_c09d0f:hover .blockedAction_c09d0f {
            color: var(--hover-color);
        }
        .expanded_c09d0f {
            background: rgba(255, 255, 255, .1);
            border-radius: 7px;
            transition: all .15s ease-in-out;
        }
        .expanded_c09d0f+.divider_fc5f50 {
            margin-top: 25px;
        }
        .divider_fc5f50+.expanded_c09d0f {
            margin-top: 25px;
        }
        .blockedAction_c09d0f {
            color: var(--main-color);
        }
        .blockedSystemMessage_c09d0f:hover .blockedAction_c09d0f {
            color: var(--hover-color);
        }
        .markup_d6076c code.inline {
            padding: 3.5px 7.5px;
            background-color: rgba(255, 255, 255, .1);
            border-radius: 3px;
            color: rgba(255, 255, 255, .7);
            font-family: var(--code-font);
            line-height: 22px;
        }
        .markup_d6076c code.inline+pre {
            margin-top: -1px;
        }
        .markup_d6076c .codeActions_d6076c {
            z-index: 999;
        }
        .markup_d6076c code {
            border: 1px solid rgba(0, 0, 0, 0);
        }
        pre {
            padding: 0;
            background: rgba(0, 0, 0, 0);
            border: 2px solid rgba(255, 255, 255, .05);
            border-radius: 8px;
            font-family: var(--code-font);
        }
        pre .hljs {
            position: relative;
            padding: 6px;
            background: rgba(0, 0, 0, .42);
            border: none;
            color: rgba(255, 255, 255, .7);
        }
        pre .hljs:before {
            height: 10px;
            color: rgba(255, 255, 255, .3);
            line-height: 10px;
            opacity: 1;
        }
        code {
            font-family: var(--code-font);
        }
        .hljs:before {
            display: block;
            float: right;
            text-align: right;
            line-height: 100%;
            opacity: .5;
            pointer-events: none;
        }
        .hljs[class~="1c"i]:before {
            content: "1C:Enterprise"}
        .hljs[class~=abnf i]:before {
            content: "ABNF"}
        .hljs[class~=accesslog i]:before {
            content: "Access Log"}
        .hljs[class~=as i]:before, .hljs[class~=actionscript i]:before {
            content: "ActionScript"}
        .hljs[class~=ada i]:before {
            content: "Ada"}
        .hljs[class~=apacheconf i]:before, .hljs[class~=apache i]:before {
            content: "Apache"}
        .hljs[class~=osascript i]:before, .hljs[class~=applescript i]:before {
            content: "Applescript"}
        .hljs[class~=arduino i]:before {
            content: "Arduino"}
        .hljs[class~=arm i]:before, .hljs[class~=armasm i]:before {
            content: "ARM Assembly"}
        .hljs[class~=adoc i]:before, .hljs[class~=asciidoc i]:before {
            content: "AsciiDoc"}
        .hljs[class~=aspectj i]:before {
            content: "AspectJ"}
        .hljs[class~=atom i]:before {
            content: "Atom Feed (XML)"}
        .hljs[class~=autohotkey i]:before {
            content: "AutoHotkey"}
        .hljs[class~=autoit i]:before {
            content: "AutoIt"}
        .hljs[class~=avrasm i]:before {
            content: "AVR Assembler"}
        .hljs[class~=awk i]:before {
            content: "awk"}
        .hljs[class~=axapta i]:before {
            content: "Axapta"}
        .hljs[class~=zsh i]:before, .hljs[class~=sh i]:before, .hljs[class~=bash i]:before {
            content: "Bash"}
        .hljs[class~=basic i]:before {
            content: "Basic"}
        .hljs[class~=cmd i]:before, .hljs[class~=bat i]:before, .hljs[class~=dos i]:before {
            content: "Batch"}
        .hljs[class~=bf i]:before, .hljs[class~=bnf i]:before {
            content: "BNF"}
        .hljs[class~=brainfuck i]:before {
            content: "Brainfuck"}
        .hljs[class~=h i]:before, .hljs[class~=c i]:before {
            content: "C/C++"}
        .hljs[class~=hpp i]:before, .hljs[class~=cpp i]:before, .hljs[class~=cc i]:before {
            content: "C++"}
        .hljs[class~=csharp i]:before, .hljs[class~=cs i]:before {
            content: "C#"}
        .hljs[class~=cal i]:before {
            content: "C/AL"}
        .hljs[class~=capnp i]:before, .hljs[class~=capnproto i]:before {
            content: "Cap'n Proto"}
        .hljs[class~=ceylon i]:before {
            content: "Ceylon"}
        .hljs[class~=dcl i]:before, .hljs[class~=icl i]:before, .hljs[class~=clean i]:before {
            content: "Clean"}
        .hljs[class~=clj i]:before, .hljs[class~=clojure i]:before {
            content: "Clojure"}
        .hljs[class~=clojure-repl i]:before {
            content: "Clojure REPL"}
        .hljs[class~=cmake i]:before {
            content: "CMake"}
        .hljs[class~=iced i]:before, .hljs[class~=cson i]:before, .hljs[class~=coffee i]:before, .hljs[class~=coffeescript i]:before {
            content: "CoffeeScript"}
        .hljs[class~=coq i]:before {
            content: "Coq"}
        .hljs[class~=cls i]:before, .hljs[class~=cos i]:before {
            content: "Caché Object Script"}
        .hljs[class~=podspec i]:before {
            content: "CocoaPod"}
        .hljs[class~=pcmk i]:before, .hljs[class~=crm i]:before, .hljs[class~=crmsh i]:before {
            content: "crmsh"}
        .hljs[class~=cr i]:before, .hljs[class~=crystal i]:before {
            content: "Crystal"}
        .hljs[class~=csp i]:before {
            content: "CSP"}
        .hljs[class~=css i]:before {
            content: "CSS"}
        .hljs[class~=d i]:before {
            content: "D"}
        .hljs[class~=dart i]:before {
            content: "Dart"}
        .hljs[class~=dpr i]:before, .hljs[class~=dfm i]:before, .hljs[class~=delphi i]:before {
            content: "Delphi (Object Pascal)"}
        .hljs[class~=patch i]:before, .hljs[class~=diff i]:before {
            content: "Diff"}
        .hljs[class~=django i]:before {
            content: "Django"}
        .hljs[class~=zone i]:before, .hljs[class~=bind i]:before, .hljs[class~=dns i]:before {
            content: "DNS Zone File"}
        .hljs[class~=docker i]:before, .hljs[class~=dockerfile i]:before {
            content: "Dockerfile"}
        .hljs[class~=dsconfig i]:before {
            content: "dsconfig"}
        .hljs[class~=dts i]:before {
            content: "Device Tree"}
        .hljs[class~=dst i]:before, .hljs[class~=dust i]:before {
            content: "Dust"}
        .hljs[class~=ebnf i]:before {
            content: "EBNF"}
        .hljs[class~=elixir i]:before {
            content: "Elixir"}
        .hljs[class~=elm i]:before {
            content: "Elm"}
        .hljs[class~=erb i]:before {
            content: "eRuby"}
        .hljs[class~=erl i]:before, .hljs[class~=erlang i]:before {
            content: "Erlang"}
        .hljs[class~=erlang-repl i]:before {
            content: "Erlang REPL"}
        .hljs[class~=xlsx i]:before, .hljs[class~=xls i]:before, .hljs[class~=excel i]:before {
            content: "Excel"}
        .hljs[class~=fsharp i]:before, .hljs[class~=fs i]:before {
            content: "F#"}
        .hljs[class~=fix i]:before {
            content: "Fix"}
        .hljs[class~=flix i]:before {
            content: "Flix"}
        .hljs[class~=f95 i]:before, .hljs[class~=f90 i]:before, .hljs[class~=fortran i]:before {
            content: "Fortran"}
        .hljs[class~=gms i]:before, .hljs[class~=gams i]:before {
            content: "GAMS"}
        .hljs[class~=gss i]:before, .hljs[class~=gauss i]:before {
            content: "GAUSS"}
        .hljs[class~=nc i]:before, .hljs[class~=gcode i]:before {
            content: "G-code"}
        .hljs[class~=feature i]:before, .hljs[class~=gherkin i]:before {
            content: "Gherkin"}
        .hljs[class~=glsl i]:before {
            content: "GLSL"}
        .hljs[class~=golang i]:before, .hljs[class~=go i]:before {
            content: "Go"}
        .hljs[class~=golo i]:before {
            content: "Golo"}
        .hljs[class~=gradle i]:before {
            content: "Gradle"}
        .hljs[class~=groovy i]:before {
            content: "Groovy"}
        .hljs[class~=haml i]:before {
            content: "Haml"}
        .hljs[class~=hbs i]:before, .hljs[class~=handlebars i]:before {
            content: "Handlebars"}
        .hljs[class~=hs i]:before, .hljs[class~=haskell i]:before {
            content: "Haskell"}
        .hljs[class~=hx i]:before, .hljs[class~=haxe i]:before {
            content: "Haxe"}
        .hljs[class~=hsp i]:before {
            content: "HSP"}
        .hljs[class~=html i]:before {
            content: "HTML"}
        .hljs[class~=htmlbars i]:before {
            content: "HTMLBars"}
        .hljs[class~=http i]:before {
            content: "HTTP"}
        .hljs[class~=https i]:before {
            content: "HTTPS"}
        .hljs[class~=hylang i]:before, .hljs[class~=hy i]:before {
            content: "Hy"}
        .hljs[class~=i7 i]:before, .hljs[class~=inform7 i]:before {
            content: "Inform7"}
        .hljs[class~=ini i]:before {
            content: "INI"}
        .hljs[class~=irb i]:before {
            content: "IRB"}
        .hljs[class~=irpf90 i]:before {
            content: "IRPF90"}
        .hljs[class~=jsp i]:before, .hljs[class~=java i]:before {
            content: "Java"}
        .hljs[class~=jsx i]:before, .hljs[class~=js i]:before, .hljs[class~=javascript i]:before {
            content: "JavaScript/JSX"}
        .hljs[class~=xjb i]:before {
            content: "JAXB (XML)"}
        .hljs[class~=wildfly-cli i]:before, .hljs[class~=jboss-cli i]:before {
            content: "JBoss CLI"}
        .hljs[class~=jinja i]:before {
            content: "Jinja"}
        .hljs[class~=json i]:before {
            content: "JSON"}
        .hljs[class~=julia i]:before {
            content: "Julia"}
        .hljs[class~=julia-repl i]:before {
            content: "Julia REPL"}
        .hljs[class~=kotlin i]:before {
            content: "Kotlin"}
        .hljs[class~=ls i]:before, .hljs[class~=lassoscript i]:before, .hljs[class~=lasso i]:before {
            content: "Lasso"}
        .hljs[class~=ldif i]:before {
            content: "LDIF"}
        .hljs[class~=leaf i]:before {
            content: "Leaf"}
        .hljs[class~=less i]:before {
            content: "Less"}
        .hljs[class~=lisp i]:before {
            content: "Lisp"}
        .hljs[class~=livecodeserver i]:before {
            content: "LiveCode Server"}
        .hljs[class~=ls i]:before, .hljs[class~=livescript i]:before {
            content: "LiveScript"}
        .hljs[class~=llvm i]:before {
            content: "LLVM IR"}
        .hljs[class~=lsl i]:before {
            content: "LSL"}
        .hljs[class~=lua i]:before {
            content: "Lua"}
        .hljs[class~=mak i]:before, .hljs[class~=mk i]:before, .hljs[class~=makefile i]:before {
            content: "Makefile"}
        .hljs[class~=mkdown i]:before, .hljs[class~=mkd i]:before, .hljs[class~=md i]:before, .hljs[class~=markdown i]:before {
            content: "Markdown"}
        .hljs[class~=mma i]:before, .hljs[class~=mathematica i]:before {
            content: "Mathematica"}
        .hljs[class~=matlab i]:before {
            content: "MatLab"}
        .hljs[class~=maxima i]:before {
            content: "Maxima"}
        .hljs[class~=mel i]:before {
            content: "MEL"}
        .hljs[class~=moo i]:before, .hljs[class~=m i]:before, .hljs[class~=mercury i]:before {
            content: "Mercury"}
        .hljs[class~=mips i]:before, .hljs[class~=mipsasm i]:before {
            content: "MIPS Assembly"}
        .hljs[class~=mikrotik i]:before, .hljs[class~=routeros i]:before {
            content: "Mikrotik RouterOS"}
        .hljs[class~=mizar i]:before {
            content: "Mizar"}
        .hljs[class~=mojolicious i]:before {
            content: "Mojolicious"}
        .hljs[class~=monkey i]:before {
            content: "Monkey"}
        .hljs[class~=moon i]:before, .hljs[class~=moonscript i]:before {
            content: "MoonScript"}
        .hljs[class~=n1ql i]:before {
            content: "N1QL"}
        .hljs[class~=nginxconf i]:before, .hljs[class~=nginx i]:before {
            content: "Nginx"}
        .hljs[class~=nim i]:before, .hljs[class~=nimrod i]:before {
            content: "Nimrod"}
        .hljs[class~=nixos i]:before, .hljs[class~=nix i]:before {
            content: "Nix"}
        .hljs[class~=nsis i]:before {
            content: "NSIS"}
        .hljs[class~=mm i]:before, .hljs[class~=obj-c i]:before, .hljs[class~=objc i]:before, .hljs[class~=objectivec i]:before {
            content: "Objective-C"}
        .hljs[class~=ml i]:before, .hljs[class~=ocaml i]:before {
            content: "OCaml"}
        .hljs[class~=scad i]:before, .hljs[class~=openscad i]:before {
            content: "OpenSCAD"}
        .hljs[class~=ruleslanguage i]:before {
            content: "Oracle Rules Language"}
        .hljs[class~=oxygene i]:before {
            content: "Oxygene"}
        .hljs[class~=parser3 i]:before {
            content: "Parser3"}
        .hljs[class~=lpr i]:before, .hljs[class~=lfm i]:before, .hljs[class~=lazarus i]:before, .hljs[class~=freepascal i]:before, .hljs[class~=pas i]:before, .hljs[class~=pascal i]:before {
            content: "Pascal/Object Pascal"}
        .hljs[class~=pm i]:before, .hljs[class~=pl i]:before, .hljs[class~=perl i]:before {
            content: "Perl"}
        .hljs[class~=pf i]:before {
            content: "OpenBSD PF"}
        .hljs[class~=php6 i]:before, .hljs[class~=php5 i]:before, .hljs[class~=php4 i]:before, .hljs[class~=php3 i]:before, .hljs[class~=php i]:before {
            content: "PHP"}
        .hljs[class~=pony i]:before {
            content: "Pony"}
        .hljs[class~=ps i]:before, .hljs[class~=powershell i]:before {
            content: "PowerShell"}
        .hljs[class~=processing i]:before {
            content: "Processing"}
        .hljs[class~=prolog i]:before {
            content: "Prolog"}
        .hljs[class~=plist i]:before {
            content: "Property List"}
        .hljs[class~=protobuf i]:before {
            content: "Protocol Buffers"}
        .hljs[class~=pp i]:before, .hljs[class~=puppet i]:before {
            content: "Puppet"}
        .hljs[class~=pbi i]:before, .hljs[class~=pb i]:before, .hljs[class~=purebasic i]:before {
            content: "PureBASIC"}
        .hljs[class~=gyp i]:before, .hljs[class~=py i]:before, .hljs[class~=python i]:before {
            content: "Python"}
        .hljs[class~=profile i]:before {
            content: "Python profile"}
        .hljs[class~=kdb i]:before, .hljs[class~=k i]:before, .hljs[class~=q i]:before {
            content: "Q"}
        .hljs[class~=qt i]:before, .hljs[class~=qml i]:before {
            content: "QML"}
        .hljs[class~=r i]:before {
            content: "R"}
        .hljs[class~=rib i]:before {
            content: "RenderMan RIB"}
        .hljs[class~=rsl i]:before {
            content: "RenderMan RSL"}
        .hljs[class~=instances i]:before, .hljs[class~=graph i]:before, .hljs[class~=roboconf i]:before {
            content: "Roboconf"}
        .hljs[class~=rss i]:before {
            content: "RSS Feed (XML)"}
        .hljs[class~=rb i]:before, .hljs[class~=ruby i]:before {
            content: "Ruby"}
        .hljs[class~=thor i]:before {
            content: "Thor (Ruby)"}
        .hljs[class~=gemspec i]:before {
            content: "Ruby Gem"}
        .hljs[class~=rs i]:before, .hljs[class~=rust i]:before {
            content: "Rust"}
        .hljs[class~=scala i]:before {
            content: "Scala"}
        .hljs[class~=scheme i]:before {
            content: "Scheme"}
        .hljs[class~=sci i]:before, .hljs[class~=scilab i]:before {
            content: "Scilab"}
        .hljs[class~=scss i]:before {
            content: "SCSS"}
        .hljs[class~=console i]:before, .hljs[class~=shell i]:before {
            content: "Shell"}
        .hljs[class~=smali i]:before {
            content: "Smali"}
        .hljs[class~=st i]:before, .hljs[class~=smalltalk i]:before {
            content: "Smalltalk"}
        .hljs[class~=ml i]:before, .hljs[class~=sml i]:before {
            content: "SML"}
        .hljs[class~=sqf i]:before {
            content: "SQF"}
        .hljs[class~=sql i]:before {
            content: "SQL"}
        .hljs[class~=stan i]:before {
            content: "Stan"}
        .hljs[class~=ado i]:before, .hljs[class~=do i]:before, .hljs[class~=stata i]:before {
            content: "Stata"}
        .hljs[class~=p21 i]:before, .hljs[class~=stp i]:before, .hljs[class~=step i]:before, .hljs[class~=step21 i]:before {
            content: "STEP Part 21"}
        .hljs[class~=styl i]:before, .hljs[class~=stylus i]:before {
            content: "Stylus"}
        .hljs[class~=subunit i]:before {
            content: "SubUnit"}
        .hljs[class~=swift i]:before {
            content: "Swift"}
        .hljs[class~=taggerscript i]:before {
            content: "Tagger Script"}
        .hljs[class~=tap i]:before {
            content: "TAP"}
        .hljs[class~=tk i]:before, .hljs[class~=tcl i]:before {
            content: "Tcl"}
        .hljs[class~=tex i]:before {
            content: "TeX"}
        .hljs[class~=thrift i]:before {
            content: "Thrift"}
        .hljs[class~=toml i]:before {
            content: "TOML"}
        .hljs[class~=tp i]:before {
            content: "TP"}
        .hljs[class~=craftcms i]:before, .hljs[class~=twig i]:before {
            content: "Twig"}
        .hljs[class~=ts i]:before, .hljs[class~=typescript i]:before {
            content: "TypeScript"}
        .hljs[class~=vala i]:before {
            content: "Vala"}
        .hljs[class~=vb i]:before, .hljs[class~=vbnet i]:before {
            content: "VB.NET"}
        .hljs[class~=vbs i]:before, .hljs[class~=vbscript i]:before {
            content: "VBScript"}
        .hljs[class~=vbscript-html i]:before {
            content: "VBScript HTML"}
        .hljs[class~=svh i]:before, .hljs[class~=sv i]:before, .hljs[class~=v i]:before, .hljs[class~=verilog i]:before {
            content: "Verilog"}
        .hljs[class~=vhdl i]:before {
            content: "VHDL"}
        .hljs[class~=vim i]:before {
            content: "Vim Script"}
        .hljs[class~=x86asm i]:before {
            content: "x86 Assembly"}
        .hljs[class~=tao i]:before, .hljs[class~=xl i]:before {
            content: "XL"}
        .hljs[class~=xpath i]:before, .hljs[class~=xq i]:before, .hljs[class~=xquery i]:before {
            content: "XQuery"}
        .hljs[class~=yml i]:before, .hljs[class~=yaml i]:before {
            content: "YAML"}
        .hljs[class~=xhtml i]:before {
            content: "XHTML"}
        .hljs[class~=xml i]:before {
            content: "XML"}
        .hljs[class~=xsd i]:before {
            content: "XML Schema"}
        .hljs[class~=xsl i]:before {
            content: "XSL"}
        .hljs[class~=zep i]:before, .hljs[class~=zephir i]:before {
            content: "Zephir"}
        .embed_ad0b71 .embedFieldName_ad0b71, .embed_ad0b71 .embedTitle_ad0b71 {
            color: #fff !important;
        }
        .embed_ad0b71 .embedProvider_ad0b71 {
            color: rgba(255, 255, 255, .7) !important;
        }
        .embed_ad0b71 .embedDescription_ad0b71, .embed_ad0b71 .embedFieldValue_ad0b71 {
            color: rgba(255, 255, 255, .7);
        }
        .embed_ad0b71 .embedLink_ad0b71 {
            color: var(--main-color);
            transition: all .1s ease-in-out;
        }
        .embed_ad0b71 .embedLink_ad0b71:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .embed_ad0b71 .embedTitleLink_ad0b71 {
            color: var(--main-color) !important;
        }
        .embed_ad0b71 .embedVideoActions_ad0b71 .wrapper_c8da25 {
            background: rgba(0, 0, 0, .5);
            color: #fff;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, .5);
        }
        .embed_ad0b71 a>code.inline {
            color: var(--main-color);
        }
        .embed_ad0b71 .embedFooterText_ad0b71 {
            color: rgba(255, 255, 255, .5);
        }
        .embed_ad0b71 .embedFooterSeparator_ad0b71 {
            color: rgba(255, 255, 255, .07);
        }
        .embedFull_ad0b71 {
            background: rgba(0, 0, 0, .3);
        }
        .imageError_d4597d {
            filter: grayscale(1) brightness(2);
            opacity: .3;
        }
        .hoverButtonGroup_ab8b23 {
            background-color: rgba(0, 0, 0, .5);
        }
        .hoverButtonGroup_ab8b23 .hoverButton_ab8b23 {
            color: #fff;
        }
        .theme-dark .wrapper_b9fe76 {
            background: rgba(0, 0, 0, .4);
            border-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .wrapper_b9fe76 .h5_c46f6a {
            color: rgba(255, 255, 255, .5);
        }
        .theme-dark .wrapper_b9fe76 .guildName_b9fe76 {
            color: var(--main-color);
            transition: all .1s ease-in-out;
        }
        .theme-dark .wrapper_b9fe76 .guildName_b9fe76:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .theme-dark .wrapper_b9fe76 .guildIcon_b9fe76 {
            background-color: rgba(255, 255, 255, .04);
        }
        .theme-dark .wrapper_b9fe76 .guildIconExpired_b9fe76 {
            position: relative;
            background-size: 0;
            background: rgba(255, 255, 255, .04);
        }
        .theme-dark .wrapper_b9fe76 .guildIconExpired_b9fe76:before, .theme-dark .wrapper_b9fe76 .guildIconExpired_b9fe76:after {
            content: "";
            position: absolute;
            top: 10%;
            bottom: 10%;
            left: 50%;
            width: 6px;
            background: var(--danger-color);
            border-radius: 1px;
        }
        .theme-dark .wrapper_b9fe76 .guildIconExpired_b9fe76:after {
            transform: translateX(-50%) rotate(45deg);
        }
        .theme-dark .wrapper_b9fe76 .guildIconExpired_b9fe76:before {
            transform: translateX(-50%) rotate(-45deg);
        }
        .theme-dark .wrapper_b9fe76 .guildDetail_b9fe76 {
            padding-left: 1px;
            margin-left: -1px;
            color: rgba(255, 255, 255, .3);
        }
        .theme-dark .wrapper_b9fe76 .statusOnline_b9fe76 {
            background: var(--online-color);
            color: var(--online-color);
        }
        .theme-dark .wrapper_b9fe76 .statusOffline_b9fe76 {
            background: var(--offline-color);
            color: var(--offline-color);
        }
        .theme-dark .wrapper_b9fe76 .button_b9fe76 {
            border-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .wrapper_b9fe76 .lookFilled_dd4f85.colorGreen_dd4f85 {
            background: rgba(0, 0, 0, 0);
            border: 1px solid var(--success-color);
            transition: all .3s ease-in-out;
        }
        .theme-dark .wrapper_b9fe76 .lookFilled_dd4f85.colorGreen_dd4f85:hover {
            background: var(--success-color);
        }
        .theme-dark .wrapper_b9fe76 .lookFilled_dd4f85.colorBrand_dd4f85 {
            background: rgba(0, 0, 0, 0);
            border: 1px solid var(--danger-color);
            transition: all .3s ease-in-out;
        }
        .theme-dark .wrapper_b9fe76 .lookFilled_dd4f85.colorBrand_dd4f85:hover {
            background: var(--danger-color);
        }
        .theme-dark .wrapper_f72aac {
            background-color: rgba(0, 0, 0, .4);
            border-color: rgba(0, 0, 0, 0);
        }
        .audioControls_f72aac {
            background: rgba(0, 0, 0, 0);
        }
        .videoControls_f72aac {
            background: rgba(0, 0, 0, .6);
        }
        .wrapper_f72aac .metadataDownload_f72aac, .wrapper_f72aac .controlIcon_f72aac {
            opacity: .5;
            transition: all .15s ease-in-out;
        }
        .wrapper_f72aac .metadataDownload_f72aac:hover, .wrapper_f72aac .controlIcon_f72aac:hover {
            opacity: 1;
        }
        .audioMetadata_f72aac:before {
            content: "";
            width: 36px;
            height: 36px;
            background: url(https://clearvision.github.io/icons/file_music.svg) center/100% no-repeat;
            opacity: .5;
        }
        .audioMetadata_f72aac .metadataSize_f72aac {
            color: rgba(255, 255, 255, .3);
        }
        .mediaBarWrapperVolume_d12f5a {
            background: rgba(255, 255, 255, .07);
        }
        .mediaBarWrapperVolume_d12f5a:before, .mediaBarWrapperVolume_d12f5a:after {
            background: rgba(255, 255, 255, .07);
        }
        .buffer_d12f5a {
            background: rgba(255, 255, 255, .04);
            opacity: 1;
        }
        .buffer_d12f5a:before, .buffer_d12f5a:after {
            background: rgba(255, 255, 255, .04);
            opacity: 1;
        }
        .mediaBarGrabber_d12f5a, .mediaBarProgress_d12f5a {
            background: var(--main-color);
            transition: background .15s ease-in-out;
        }
        .mediaBarProgress_d12f5a:before, .mediaBarProgress_d12f5a:after {
            background: var(--main-color);
        }
        .mediaBarPreview_d12f5a {
            background: #fff;
            opacity: 0;
            transition: opacity .15s ease-in-out;
        }
        .mediaBarPreview_d12f5a:before, .mediaBarPreview_d12f5a:after {
            background: #fff;
        }
        .bubble_d12f5a {
            background: var(--main-color);
            box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
            color: #fff;
            transform: translateX(-50%) rotateX(-90deg);
            transform-origin: 50% 100%;
            transition: all .15s ease-in-out, left 0s;
        }
        .bubble_d12f5a:before {
            border-top-color: var(--main-color);
        }
        .mediaBarInteraction_d12f5a:hover .mediaBarGrabber_d12f5a {
            background: var(--main-color);
        }
        .mediaBarInteraction_d12f5a:hover .mediaBarPreview_d12f5a {
            opacity: .1;
        }
        .mediaBarInteractionDragging_d12f5a .mediaBarProgress_d12f5a, .mediaBarInteractionDragging_d12f5a .mediaBarGrabber_d12f5a, .mediaBarInteractionDragging_d12f5a .bubble_d12f5a {
            background: var(--hover-color);
        }
        .mediaBarInteractionDragging_d12f5a .bubble_d12f5a:before {
            border-top-color: var(--hover-color);
        }
        .mediaBarInteraction_d12f5a:hover .mediaBarWrapperVolume_d12f5a, .mediaBarInteractionDragging_d12f5a .mediaBarWrapperVolume_d12f5a {
            box-shadow: none;
            filter: drop-shadow(0 0 1px rgba(0,  0,  0,  0.3));
        }
        .mediaBarInteraction_d12f5a:hover .bubble_d12f5a, .mediaBarInteractionDragging_d12f5a .bubble_d12f5a {
            transform: translateX(-50%);
        }
        .hoverButtonGroup_ab8b23 {
            background-color: rgba(0, 0, 0, .6);
        }
        .theme-dark .container_d6cb89 {
            background: rgba(0, 0, 0, .6);
        }
        .theme-dark .container_d6cb89:not(.playing_d6cb89) .playButtonContainer_d6cb89 {
            background: var(--main-color);
        }
        .theme-dark .container_d6cb89:not(.playing_d6cb89) .playButtonContainer_d6cb89:hover, .theme-dark .container_d6cb89:not(.playing_d6cb89) .playButtonContainer_d6cb89:active {
            background: var(--hover-color);
        }
        .playButtonContainer_d6cb89:active .playIcon_d6cb89 {
            color: #fff;
        }
        .ripple_d6cb89 {
            background-color: rgba(0, 0, 0, 0);
        }
        .playing_d6cb89 .playButtonContainer_d6cb89 {
            background: #fff;
        }
        .playing_d6cb89 .playIcon_d6cb89 {
            color: var(--main-color);
        }
        .wrapper_bf1b19 {
            padding: 1px 4px;
            border-radius: 5px;
            line-height: 22px;
            white-space: nowrap;
            transition: all .15s ease-in-out;
            background-color: var(--main-color);
            color: #fff;
        }
        .wrapper_bf1b19:hover {
            background-color: var(--hover-color);
        }
        .wrapper_bf1b19.icon_b52c3f {
            padding-left: 1.2rem;
        }
        .mentioned_d5deea .mention.interactive {
            background-color: rgba(255, 255, 255, .1);
            color: var(--main-color);
        }
        .mentioned_d5deea .mention.interactive:hover {
            background-color: rgba(255, 255, 255, .07);
            color: var(--hover-color);
            text-decoration: none;
        }
        .message_d5deea.mentioned_d5deea {
            background-color: rgba(255, 255, 255, .05);
        }
        .message_d5deea.mentioned_d5deea.selected_d5deea, .mouse-mode.full-motion .message_d5deea.mentioned_d5deea:hover {
            background-color: rgba(255, 255, 255, .08);
        }
        .message_d5deea.mentioned_d5deea::before {
            background-color: var(--main-color);
        }
        .icon_b52c3f path {
            fill: #fff;
        }
        .reaction_ec6b19 {
            background-color: rgba(255, 255, 255, .05);
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .reaction_ec6b19:hover {
            background-color: rgba(255, 255, 255, .2);
        }
        .reaction_ec6b19:hover .reactionCount_ec6b19 {
            color: rgba(255, 255, 255, .9);
        }
        .reaction_ec6b19 .reactionCount_ec6b19 {
            color: rgba(255, 255, 255, .4);
        }
        .reaction_ec6b19.reactionMe_ec6b19 {
            background-color: rgba(255, 255, 255, .1);
            border-color: rgba(0, 0, 0, 0);
        }
        .reaction_ec6b19.reactionMe_ec6b19 .reactionCount_ec6b19 {
            color: var(--main-color);
        }
        .reaction_ec6b19.reactionMe_ec6b19:hover {
            background-color: rgba(255, 255, 255, .2);
        }
        .reaction_ec6b19.reactionMe_ec6b19:hover .reactionCount_ec6b19 {
            color: var(--hover-color);
        }
        .reaction_f61c73 {
            background-color: rgba(255, 255, 255, .05);
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .reaction_f61c73:hover {
            background-color: rgba(255, 255, 255, .2);
        }
        .reaction_f61c73:hover .reactionCount_f61c73 {
            color: rgba(255, 255, 255, .9);
        }
        .reaction_f61c73 .reactionCount_f61c73 {
            color: rgba(255, 255, 255, .4);
        }
        .reaction_f61c73.reactionMe_f61c73 {
            background-color: rgba(255, 255, 255, .1);
            border-color: rgba(0, 0, 0, 0);
        }
        .reaction_f61c73.reactionMe_f61c73 .reactionCount_f61c73 {
            color: var(--main-color);
        }
        .reaction_f61c73.reactionMe_f61c73:hover {
            background-color: rgba(255, 255, 255, .2);
        }
        .reaction_f61c73.reactionMe_f61c73:hover .reactionCount_f61c73 {
            color: var(--hover-color);
        }
        .addReactButton_b385c8 {
            background-color: rgba(255, 255, 255, .05);
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .addReactButton_b385c8:hover {
            background-color: rgba(255, 255, 255, .2);
            border-color: rgba(255, 255, 255, .2);
            color: #fff;
        }
        .textContainer_ad9cbd {
            background-color: rgba(0, 0, 0, .42);
            border: 2px solid rgba(255, 255, 255, .05);
            border-radius: 8px 8px 0 0;
        }
        .footer_ad9cbd {
            background-color: rgba(255, 255, 255, .1);
            border: none;
        }
        .attachmentName_ad9cbd {
            color: rgba(255, 255, 255, .7);
        }
        .attachmentName_ad9cbd:hover {
            color: rgba(255, 255, 255, .9);
        }
        .formattedSize_ad9cbd {
            color: rgba(255, 255, 255, .5);
            margin: 0 5px;
        }
        .formattedSize_ad9cbd:hover {
            color: rgba(255, 255, 255, .7);
        }
        .modalTextContainer_ad9cbd {
            background-color: rgba(0, 0, 0, .5);
            border: none;
        }
        .languageSelector_ad9cbd {
            background-color: var(--popout-color);
        }
        .theme-dark .modal_ed23b8, .theme-dark .root_f9a4c9 {
            background: rgba(0, 0, 0, .5);
            box-shadow: none;
        }
        .theme-dark .modal_ed23b8 .footer_f9a4c9, .theme-dark .modal_ed23b8 .footer_f82cc7, .theme-dark .modal_ed23b8 .guildSidebar_a74b6f, .theme-dark .modal_ed23b8 .formFieldWrapper_ff716d, .theme-dark .modal_ed23b8 .settingsFormFieldWrapper__3ff83, .theme-dark .root_f9a4c9 .footer_f9a4c9, .theme-dark .root_f9a4c9 .footer_f82cc7, .theme-dark .root_f9a4c9 .guildSidebar_a74b6f, .theme-dark .root_f9a4c9 .formFieldWrapper_ff716d, .theme-dark .root_f9a4c9 .settingsFormFieldWrapper__3ff83 {
            background: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        .header_fa4e6d {
            background-color: rgba(0, 0, 0, 0);
        }
        .circle_c1cfd2 {
            background-color: var(--main-color);
        }
        .card_cc2c09 {
            background-color: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .card_cc2c09:hover {
            background-color: rgba(0, 0, 0, .4);
            border: 2px solid var(--hover-color);
        }
        .newBadgeText_d6a475 {
            color: #fff;
        }
        .eventStatusContainer_d6a475 svg path {
            fill: var(--main-color);
        }
        .rsvpCount_a4ec62 {
            background-color: var(--main-color);
        }
        .rsvpCount_a4ec62 .rsvpIcon_a4ec62 {
            color: #fff;
        }
        .container_a31cc1 .item_a0:hover {
            border-bottom-color: var(--hover-color);
        }
        .container_a31cc1 .item_a0.selected_a0, .container_a31cc1 .item_a0:active {
            border-bottom-color: var(--main-color);
        }
        .contentContainer_b747e2 {
            background: rgba(0, 0, 0, 0);
        }
        .circle_b5365d {
            background-color: var(--main-color);
        }
        .progressBar_f2ceaa {
            background-color: rgba(255, 255, 255, .3);
        }
        .progressBar_f2ceaa.selectedProgressBar_f2ceaa {
            background-color: var(--main-color);
        }
        .progressBar_f2ceaa+.colorMuted_fbc755 {
            color: rgba(255, 255, 255, .3);
        }
        .progressBar_f2ceaa+.colorBrand_fbc755 {
            color: var(--main-color);
        }
        .container_c811f3 {
            background-color: rgba(0, 0, 0, 0);
        }
        .textInput_b229b0 {
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .previewCard_f9a98f {
            background-color: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .theme-light .container_a4d79f .defaultColor_e9e35f {
            color: #fff;
        }
        .theme-light .container_a4d79f .text-sm-normal__95a78 {
            color: rgba(255, 255, 255, .7) !important;
        }
        .theme-light .container_a4d79f .input_f8bc55 {
            color: #dcddde;
        }
        .container_a47d49 {
            background-color: var(--main-color);
        }
        .container_a47d49:hover {
            background-color: var(--hover-color);
        }
        .container_a47d49 .text_a47d49 {
            color: #fff;
        }
        .container_a47d49 .arrow_a47d49 {
            filter: brightness(0) invert(1);
        }
        .optionHeader_fc9dae {
            color: rgba(255, 255, 255, .7) !important;
        }
        .iconContainer_a2aef9>svg>circle {
            fill: var(--main-color);
        }
        .backButton_c1ee6b .contents_dd4f85, .backButton_f5507e .contents_dd4f85 {
            color: rgba(255, 255, 255, .7);
        }
        .backButton_c1ee6b .contents_dd4f85:hover, .backButton_f5507e .contents_dd4f85:hover {
            color: #fff;
            text-decoration: underline;
        }
        .input_e8a9c7 {
            background-color: rgba(0, 0, 0, 0);
        }
        .sampleLink_e8a9c7 {
            color: var(--main-color);
            font-weight: 500;
        }
        .rowContainer_e8a9c7 {
            background-color: var(--main-color);
        }
        .rowContainer_e8a9c7:hover {
            background-color: var(--hover-color);
        }
        .rowContainer_e8a9c7 .rowText_e8a9c7 {
            color: #fff;
        }
        .rowContainer_e8a9c7 .rowArrow_e8a9c7 {
            filter: brightness(0) invert(1);
        }
        .theme-dark .keyboardShortcutsModal_ad95dc {
            background-color: rgba(0, 0, 0, .5);
        }
        .theme-dark .combo_c90023 .key_c90023 {
            background: rgba(0, 0, 0, 0);
            border: 1px solid var(--hover-color);
            border-radius: 3px;
            box-shadow: inset 0 -4px var(--main-color);
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
            cursor: pointer;
        }
        .theme-dark .combo_c90023 .key_c90023:hover {
            background: var(--hover-color);
            color: #fff;
        }
        .theme-dark .combo_c90023 .key_c90023:active {
            border: 1px solid var(--hover-color);
            box-shadow: inset 0 -2px var(--main-color);
            color: rgba(255, 255, 255, .7);
        }
        .theme-dark .message_ddcc45 {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .theme-dark .scroller_f2bfbb, .theme-dark .reactors_f2bfbb {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .reactionDefault_f2bfbb {
            margin-bottom: 10px;
        }
        .theme-dark .reactionSelected_f2bfbb {
            background-color: var(--main-color);
            margin-bottom: 10px;
        }
        .theme-dark .reactionSelected_f2bfbb .colorStandard_fbc755 {
            color: #fff;
        }
        .quickswitcher_f4e139 {
            background-color: rgba(0, 0, 0, .5);
        }
        .input_f4e139 {
            background-color: rgba(255, 255, 255, .07);
        }
        .scroller_f4e139 {
            background-color: rgba(0, 0, 0, 0);
            margin-top: 10px;
        }
        .scroller_f4e139::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        [aria-selected=true].result_f14193 {
            background: var(--background-modifier-hover);
        }
        .wrapper_dc0b29 {
            background: var(--main-color);
        }
        .paymentNote_cc6017, .wrapper_bfc2c6, .body_bf926b {
            background-color: rgba(0, 0, 0, 0);
        }
        .table_df16c1 {
            background-color: rgba(0, 0, 0, .4);
        }
        .planOptionDiscount_bd3462 {
            background-color: var(--main-color);
        }
        .cardNumberWrapper_c04e45 {
            padding: 2px;
        }
        .cardInput_c04e45 {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .cardInputFocused_c04e45 {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .theme-dark .iconWrapper_cc6793 {
            background: rgba(0, 0, 0, .4);
        }
        .icon_cc6793 {
            color: #fff;
        }
        .icon_cc6793:hover {
            color: #fff;
            background-color: var(--hover-color);
        }
        .actions_f8746a .input_f8bc55 {
            box-shadow: none;
        }
        .content_cc6017 {
            background: rgba(0, 0, 0, 0);
        }
        .content_cc6017 .upsellFooter_a26a1a {
            background: rgba(0, 0, 0, .4);
        }
        .perksList_cf948e {
            background: rgba(0, 0, 0, .4);
        }
        .theme-dark .contentWrapper_ed5743 {
            background: rgba(0, 0, 0, .5);
        }
        .pillIconOnline_b83a05 {
            background-color: var(--online-color);
        }
        .pillIconTotal_b83a05 {
            background-color: var(--offline-color);
        }
        .item_aa2afb.selectorButtonSelected_aa7dff {
            background: var(--main-color);
            border-color: var(--main-color);
        }
        .item_aa2afb:not(.selectorButtonSelected_aa7dff) {
            background: rgba(0, 0, 0, .4);
            border-color: var(--main-color);
        }
        .banReasonOtherClickable_e6c06b {
            background-color: rgba(255, 255, 255, .05);
            border: 2px solid rgba(0, 0, 0, 0);
            transition: all .15s ease-in-out;
            color: #fff;
        }
        .banReasonOtherClickable_e6c06b:hover {
            background-color: rgba(255, 255, 255, .07);
            color: #fff;
            border: 2px solid var(--hover-color);
        }
        .theme-dark .root_f9a4c9 .authBox_b83a05, .theme-dark .root_f9a4c9 .navRow_be9398 {
            background-color: rgba(0, 0, 0, 0);
        }
        .modalHeader_cd3d24, .modalDivider_cd3d24 {
            background: rgba(0, 0, 0, .4);
        }
        .activityTag_d46b95 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
        }
        .activityItem_d46b95 {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .activityItem_d46b95:hover {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--hover-color);
        }
        .activityItem_d46b95.disabled_d46b95 {
            background: rgba(0, 0, 0, .4);
        }
        .scrollTierBackground_f09e45 {
            background: rgba(0, 0, 0, 0);
        }
        .authorize_c5a065 {
            background-color: rgba(0, 0, 0, 0);
            border-radius: 5px;
        }
        .authorize_c5a065.inApp_c5a065 {
            background-color: rgba(0, 0, 0, 0);
        }
        .iconWrapper_cf14a8 {
            background-color: rgba(255, 255, 255, .15);
        }
        .footer_c5a065 {
            background-color: rgba(0, 0, 0, 0);
        }
        .picker_cd703d {
            background-color: var(--popout-color);
        }
        .picker_cd703d .soundButton_f40049, .picker_cd703d .categoryIcon_ceda83.selected_ceda83 {
            background-color: var(--main-color);
        }
        .picker_cd703d .soundButton_f40049:hover {
            background-color: var(--hover-color);
        }
        .picker_cd703d .keybindHint_c66e5e {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .text-sm-normal__95a78 {
            color: var(--text-normal) !important;
        }
        .modalHeaderCustomGift_a27f2f {
            background: rgba(0, 0, 0, 0);
            border-bottom: 1.5px solid var(--main-color);
        }
        .iconBackground_e4d3f1 {
            background: var(--main-color);
        }
        .iconBackground_e4d3f1>svg {
            fill: #fff;
        }
        .spinner_b0f29a {
            background: rgba(0, 0, 0, .4);
        }
        .modal_a74b6f {
            background: rgba(0, 0, 0, 0);
        }
        .termsRow_bd5b94 {
            border-color: var(--main-color);
        }
        .fieldBackground_bd5b94 {
            background: var(--background-overlay);
            border-color: var(--main-color);
        }
        .fieldBackground_bd5b94:hover:not(:focus) {
            border-color: var(--hover-color);
            background: var(--background-overlay);
        }
        .footer_cf5d0a {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .guildPopout_cf5d0a {
            background-color: rgba(0, 0, 0, .8);
        }
        .emojiCounter_cf5d0a {
            background-color: var(--main-color);
            color: var(--text-normal) !important;
        }
        .layer_cd0de5::after {
            background: var(--background-overlay);
        }
        .segmentControlOption_d7ec26 {
            color: rgba(255, 255, 255, .7);
        }
        .theme-dark .segmentControlOption_d7ec26.tabItemSelected_a18ec1 {
            color: var(--main-color);
            border-bottom: 2px solid var(--main-color);
        }
        .tile_d7ec26:hover .sourceThumbnail_d7ec26 {
            box-shadow: inset 0 0 0 2px var(--hover-color);
        }
        .tile_d7ec26 .sourceThumbnail_d7ec26.selected_d7ec26 {
            box-shadow: inset 0 0 0 2px var(--main-color);
        }
        .card_f30ffe {
            background-color: rgba(255, 255, 255, .07);
            border: 2px solid rgba(255, 255, 255, .09);
        }
        .theme-dark .selectorButton_a78967 {
            background-color: rgba(255, 255, 255, .07);
            border-color: rgba(255, 255, 255, .09);
        }
        .theme-dark .selectorButton_a78967:before {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .selectorButton_a78967:hover {
            background-color: var(--hover-color);
        }
        .theme-dark .selectorButton_a78967.selectorButtonSelected_a78967 {
            background-color: var(--main-color);
        }
        .theme-dark .selectorButton_a78967.premiumUpsell_a78967:hover {
            background-color: #c269c3;
        }
        .theme-dark .selectorButton_a78967.premiumUpsell_a78967:hover .enhancedSelectorNitroText_a78967 {
            color: #fff;
        }
        .enhancedBanner_f59576 {
            background: rgba(0, 0, 0, 0);
        }
        .channelRow_b89a4c {
            background: rgba(0, 0, 0, .4);
        }
        .channelRow_b89a4c:hover {
            background: var(--hover-color);
            opacity: .8;
        }
        .upload_df1eaf.sizeClip_df1eaf {
            background-color: rgba(0, 0, 0, 0);
        }
        .gameIcon_f394e5 {
            color: var(--main-color);
        }
        .text-md-semibold__8664f {
            color: #fff !important;
        }
        .clipForm_b00e1b {
            background: rgba(0, 0, 0, 0);
        }
        .root_a1f5c2 {
            background: rgba(0, 0, 0, 0);
        }
        .root_e48bd3 {
            background: rgba(0, 0, 0, 0);
        }
        .userCountPill_e48bd3 {
            background-color: rgba(0, 0, 0, .8);
        }
        .timePillBackground_bb2184 {
            background-color: var(--main-color);
        }
        .playPauseButtonWrapper_bb2184 {
            background-color: rgba(0, 0, 0, .8);
        }
        .dragHandle_bb2184 {
            background-color: var(--main-color);
        }
        .container_c94b03 {
            background: rgba(0, 0, 0, .8);
        }
        .modal_a60b1b {
            background-color: rgba(0, 0, 0, .5) !important;
        }
        .modal_a60b1b .container_e664f3 {
            background-color: rgba(0, 0, 0, 0);
        }
        .container_acb8b3 {
            background-color: rgba(0, 0, 0, .3);
            border: 2px solid var(--main-color);
        }
        .container_acb8b3:hover {
            border: 2px solid var(--hover-color);
        }
        .theme-dark [style*=transform].root_f9a4c9:has(.userProfileModalOuter_c69a7b) {
            transform: none !important;
            z-index: 0;
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b {
            background: rgba(0, 0, 0, 0);
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .overlayBackground_c69a7b {
            background-color: rgba(0, 0, 0, .4);
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .userProfileModalInner_c69a7b {
            background: rgba(0, 0, 0, .7);
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .userProfileModalInner_c69a7b::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: var(--user-modal-image) var(--user-modal-position)/var(--user-modal-size) var(--user-modal-repeat) var(--user-modal-attachment);
            filter: grayscale(var(--user-modal-grayscale)) sepia(var(--user-modal-sepia)) invert(var(--user-modal-invert)) brightness(var(--user-modal-brightness)) contrast(var(--user-modal-contrast)) saturate(var(--user-modal-saturation)) blur(var(--user-modal-blur));
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .banner_c3e427 {
            -webkit-mask: linear-gradient(to bottom,  #000,  transparent 93%);
            mask: linear-gradient(to bottom,  #000,  transparent 93%);
        }
        .root_f9a4c9 .bannerPremium_c3e427 {
            -webkit-mask: linear-gradient(to bottom,  #000 50%,  transparent);
            mask: linear-gradient(to bottom,  #000 50%,  transparent);
        }
        .badgeList_ec3b75 {
            background-color: rgba(0, 0, 0, .4);
        }
        .tabBarContainer_b9fccc {
            padding: 0 20px;
            border-color: rgba(255, 255, 255, .04);
        }
        .tabBar_c1519f {
            border-color: rgba(255, 255, 255, .04);
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0 {
            position: relative;
            height: 30px;
            padding: 5px 10px 0;
            transition: color .15s ease-in-out;
            z-index: 1;
            border-bottom-width: 2px;
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(to top,  transparent,  hsla(0deg,  0%,  100%,  0.05) 50%);
            border-radius: 3px 3px 0 0;
            opacity: 0;
            transition: all .15s ease-in-out, bottom .2s ease-in-out;
            z-index: -1;
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0:after {
            content: "";
            position: absolute;
            top: 100%;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(255, 255, 255, .07);
            border-radius: 3px 3px 0 0;
            transition: all .2s ease-in-out;
            z-index: -1;
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0:hover:before {
            opacity: 1;
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0.selected_a0:after {
            top: 0;
            animation: cv-slide-top .2s ease-in-out;
        }
        .root_f9a4c9 .userProfileOuter_c69a7b .item_a0.selected_a0:before {
            bottom: 100%;
            animation: cv-slide-bottom .2s ease-in-out reverse;
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .item_a0:hover {
            border-bottom-color: var(--hover-color);
        }
        .root_f9a4c9 .userProfileOuterUnthemed_c69a7b .item_a0.selected_a0 {
            border-bottom-color: var(--main-color);
        }
        .root_f9a4c9 .userProfileOuterThemed_c69a7b .item_a0:hover {
            border-bottom-color: var(--profile-gradient-secondary-color);
        }
        .root_f9a4c9 .userProfileOuterThemed_c69a7b .item_a0.selected_a0 {
            border-bottom-color: var(--profile-gradient-primary-color);
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .userInfoSection_a24910+.userInfoSection_a24910 {
            border-color: rgba(255, 255, 255, .04);
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .userInfoSection_a24910>.userInfoSectionHeader_a24910 {
            color: rgba(255, 255, 255, .7);
        }
        .connectedAccounts_f3eb60 .connectedAccountContainer_f3eb60 {
            position: relative;
            background: rgba(255, 255, 255, .04);
            border-color: rgba(0, 0, 0, 0);
            border-radius: 5px;
            transition: all .15s ease-in-out;
        }
        .connectedAccounts_f3eb60 .connectedAccountContainer_f3eb60:hover {
            background: rgba(255, 255, 255, .07);
        }
        .connectedAccounts_f3eb60 .connectedAccountContainer_f3eb60:hover .connectedAccountOpenIcon_f3eb60 {
            opacity: .7;
        }
        .connectedAccounts_f3eb60 .connectedAccountContainer_f3eb60:active {
            transform: scale(0.95);
        }
        .connectedAccountVerifiedIcon_f3eb60 {
            background: url(https://clearvision.github.io/icons/verified.svg) center/18px no-repeat;
            opacity: .5;
            z-index: 1;
        }
        .connectedAccountVerifiedIcon_f3eb60 .flowerStar_ff7d90 {
            opacity: 0;
        }
        .connectedAccountVerifiedIcon_f3eb60 .childContainer_ff7d90 {
            display: none;
        }
        .connectedAccountOpenIcon_f3eb60 {
            background: url(https://clearvision.github.io/icons/popout.svg) center/18px no-repeat;
            opacity: .3;
            transition: all .15s ease-in-out;
            transform: none;
        }
        .connectedAccountOpenIcon_f3eb60>polygon {
            display: none;
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .listScroller_e4be58 .listRow_e4be58 {
            position: relative;
            color: rgba(255, 255, 255, .5);
            transition: all .15s ease-in-out;
            z-index: 1;
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .listScroller_e4be58 .listRow_e4be58:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right,  transparent,  hsla(0deg,  0%,  100%,  0.04) 10%,  hsla(0deg,  0%,  100%,  0.04) 90%,  transparent);
            opacity: 0;
            transition: inherit;
            z-index: -1;
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .listScroller_e4be58 .listRow_e4be58:hover {
            background: rgba(0, 0, 0, 0);
            color: rgba(255, 255, 255, .7);
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .listScroller_e4be58 .listRow_e4be58:hover:after {
            opacity: 1;
        }
        .userProfileModalOuter_c69a7b.userProfileOuterUnthemed_c69a7b .listScroller_e4be58 .listRow_e4be58:active {
            transform: scale(0.97);
        }
        .note_c2dcc6 textarea:focus {
            background-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .directoryContainer_da3f59 {
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .directoryContainer_da3f59:before {
            content: "";
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: fixed;
            z-index: -1;
            filter: grayscale(var(--background-grayscale)) sepia(var(--background-sepia)) invert(var(--background-invert)) brightness(var(--background-brightness)) contrast(var(--background-contrast)) saturate(var(--background-saturation)) blur(var(--background-blur));
        }
        .category_d7acc7 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .category_d7acc7:hover {
            background: var(--hover-color);
        }
        .card_e90143, .container_f9d8eb {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .container_d9c848 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .container_d9c848.clickable_d9c848:hover {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.6));
            color: #fff;
        }
        .container_d9c848.clickable_d9c848:hover .text-md-normal__6e567 {
            color: #fff;
        }
        .container_bf1c84 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .theme-dark .search_aabd24 {
            background: rgba(255, 255, 255, .07) !important;
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .theme-dark .search_aabd24:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
            transition: all .15s ease-in-out;
        }
        .theme-dark .search_aabd24 .input_f8bc55 {
            color: #fff;
            box-shadow: none;
        }
        .theme-dark .search_aabd24 .input_f8bc55::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .category_fa8ebf.activeCategory_fa8ebf {
            background: var(--main-color);
        }
        .category_d169f5 {
            background-color: rgba(255, 255, 255, .1);
        }
        .category_d169f5:hover {
            background-color: rgba(255, 255, 255, .15);
        }
        .card_b5d566 {
            background-color: rgba(0, 0, 0, .6);
        }
        .list_e0307d, .list_a06168, .intentsContainer_f6d180, .cardHeader_a11d84, .benefitsContainer_a11d84 {
            background: rgba(0, 0, 0, .4);
        }
        .commandName_e0307d {
            background: rgba(0, 0, 0, 0);
            border: 1px solid var(--main-color);
        }
        .shop_e77fa3 {
            background-color: rgba(0, 0, 0, 0);
        }
        .shopScroll_e77fa3 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .pageWrapper_e77fa3 {
            background-color: rgba(0, 0, 0, 0);
        }
        .headerBar_d8354c {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        .skeleton_b0ceed {
            background-color: rgba(255, 255, 255, .07);
        }
        .bannerBody_b0ceed, .cardBody_b0ceed {
            background-color: rgba(0, 0, 0, .4);
        }
        .cardAvatar_b0ceed, .cardTitle_b0ceed, .cardDescription_b0ceed, .cardSummary_b0ceed {
            background-color: rgba(255, 255, 255, .07);
        }
        .shopCard_b37971, .shopCard_c23530 {
            background-color: rgba(0, 0, 0, .4) !important;
            border-color: var(--main-color) !important;
        }
        .shopCard_b37971:hover, .shopCard_c23530:hover {
            background-color: rgba(0, 0, 0, .6) !important;
            border-color: var(--hover-color) !important;
        }
        .darkCardBackground_b37971, .darkCardBackground_c23530 {
            background-color: rgba(0, 0, 0, .6);
        }
        .collectibleInfoContainer_c5828f {
            background-color: rgba(0, 0, 0, 0);
        }
        .chatPreview_c5828f {
            left: 0;
            bottom: 0;
            margin: 10px auto 0 auto;
        }
        .mockInput_c5828f {
            background-color: rgba(255, 255, 255, .07);
        }
        .container_e1e1a4 {
            background: var(--background-overlay);
            border: 2px solid var(--main-color);
        }
        .container_e1e1a4:hover {
            background: var(--background-overlay);
            border: 2px solid var(--hover-color);
        }
        .selected_ff1414 {
            background: var(--main-color);
        }
        .buttonWhite_b105e9 {
            color: var(--text-normal) !important;
            background-color: var(--main-color) !important;
            border-color: rgba(0, 0, 0, 0) !important;
        }
        .buttonWhite_b105e9:hover {
            background-color: var(--hover-color) !important;
            color: var(--text-normal) !important;
        }
        .lookInverted_a299dc.colorBrand_dd4f85 {
            background: var(--main-color);
            color: var(--text-normal);
        }
        .lookInverted_a299dc.colorBrand_dd4f85:hover {
            background: var(--hover-color);
            color: var(--text-normal);
        }
        .shyButton_a25714 {
            background: radial-gradient(ellipse at 120% 200%,  var(--main-color) 10%,  transparent 70%);
        }
        .whatsNewSectionBackground_a8b566 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.8));
        }
        .base_a4d4d9 .pageWrapper_a3a4ce, .base_a4d4d9 .scroller_a39aa3 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
        }
        .categoryItem_c72b37.selectedCategoryItem_c72b37 .itemInner_c72b37 {
            background-color: var(--main-color);
        }
        .search_f69601 .searchBox_f69601 {
            background: rgba(0, 0, 0, .6);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .search_f69601 .searchBox_f69601:focus-within {
            border: none;
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .search_f69601 .searchBox_f69601 .input_f8bc55 {
            border: none;
            box-shadow: none;
        }
        .search_f69601 .searchBox_f69601 .searchBoxInput_f69601 {
            color: var(--text-normal);
        }
        .search_f69601 .searchBox_f69601 .searchBoxInput_f69601::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .search_f69601 .searchBox_f69601 .searchIcon_f69601 {
            color: var(--main-color);
        }
        .theme-dark .card_eb1ca6, .theme-dark .container_f11cbf, .theme-dark .iconMask_eb1ca6 {
            background-color: rgba(0, 0, 0, .4);
            transition: all .15s ease-in-out;
        }
        .theme-dark .card_eb1ca6:hover, .theme-dark .card_eb1ca6:hover .iconMask_eb1ca6, .theme-dark .container_f11cbf:hover, .theme-dark .container_f11cbf:hover .iconMask_eb1ca6, .theme-dark .iconMask_eb1ca6:hover, .theme-dark .iconMask_eb1ca6:hover .iconMask_eb1ca6 {
            background-color: rgba(0, 0, 0, .6);
        }
        .loading_eb1ca6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .guildList_c8c448 .spinner_b6db20 {
            background-color: rgba(0, 0, 0, .8);
        }
        .dotOnline_eb1ca6 {
            background-color: var(--online-color);
        }
        .dotOffline_eb1ca6 {
            background-color: var(--offline-color);
        }
        .categoryPill_f69601.selected_f69601 {
            background-color: var(--main-color);
        }
        .emptyContainer_e37a20 {
            background-color: rgba(0, 0, 0, .6);
        }
        .theme-dark .container_a6d69a {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
        }
        .header_a6d69a {
            background-color: rgba(0, 0, 0, 0);
        }
        .title_c1668f {
            font-family: var(--main-font);
            font-weight: 300;
            padding: 0 5px 0 5px;
            border-radius: 4px;
        }
        .matchingPostsRow_a6d69a {
            background-color: rgba(0, 0, 0, .3);
        }
        .uploadInput_a15d29 {
            background: var(--main-color);
            transition: all .15s ease-in-out;
        }
        .uploadInput_a15d29:hover {
            background: var(--hover-color);
            transition: all .15s ease-in-out;
        }
        .uploadIcon_a15d29 {
            color: #fff;
        }
        .icon_a03b48 {
            background: var(--main-color);
            color: #fff;
        }
        .container_a039eb {
            background-color: rgba(0, 0, 0, .4);
        }
        .stepContainer_a039eb {
            background-color: rgba(255, 255, 255, .07);
            border: 2px solid var(--main-color);
        }
        .stepContainer_a039eb:hover {
            background-color: rgba(255, 255, 255, .09);
            border: 2px solid var(--hover-color);
        }
        .stepStatus_a039eb {
            background-color: rgba(0, 0, 0, 0) !important;
        }
        .container_a57509 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
            border: 2px solid var(--main-color);
        }
        .container_a57509:hover {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.3));
            border: 2px solid var(--hover-color);
        }
        .container_a57509.isOpen_a57509 {
            background: rgba(0, 0, 0, .3);
            border: 2px solid var(--success-color);
        }
        .contentPreview_a57509 {
            background-color: rgba(255, 255, 255, .05);
            border-color: rgba(255, 255, 255, .09);
        }
        .theme-dark .container_d331f1, .theme-dark .increasedActivityMainCard_e53744 {
            background: rgba(0, 0, 0, .3);
            border: 2px solid var(--main-color);
        }
        .theme-dark .container_d331f1:hover, .theme-dark .increasedActivityMainCard_e53744:hover {
            background: rgba(0, 0, 0, .3);
            border: 2px solid var(--hover-color);
        }
        .theme-dark .container_d331f1.isOpen_d331f1, .theme-dark .increasedActivityMainCard_e53744.isOpen_d331f1 {
            background: rgba(0, 0, 0, .3);
            border: 2px solid var(--success-color);
        }
        .replies__1b03e {
            background-color: rgba(255, 255, 255, .05);
            border-color: 2px solid var(--main-color);
        }
        .replies__1b03e:hover {
            background-color: rgba(255, 255, 255, .05);
            border-color: 2px solid var(--hover-color);
        }
        .pinIcon_f451cd {
            background-color: var(--main-color);
        }
        .loadingCard_a6d69a {
            background: rgba(0, 0, 0, .3);
        }
        .theme-dark .pill_c993da, .theme-dark .increasedActivityPill__2620e {
            background: rgba(0, 0, 0, .6);
            border: 2px solid var(--main-color);
        }
        .theme-dark .pill_c993da.clickable_c993da:not(.disabled_c993da):hover, .theme-dark .increasedActivityPill__2620e.clickable_c993da:not(.disabled_c993da):hover {
            background: rgba(0, 0, 0, 0);
            border: 2px solid var(--hover-color);
        }
        .theme-dark .pill_c993da.selected_c993da, .theme-dark .increasedActivityPill__2620e.selected_c993da {
            border: 2px solid var(--success-color);
        }
        .theme-dark .increasedActivityPill__2620e {
            border-radius: 20px;
            height: 32px;
            width: fit-content;
            text-align: center;
            padding: 0 10px;
        }
        .messageCountIcon_d331f1>svg {
            color: var(--channel-color);
        }
        .newMessageCount_d331f1 {
            color: var(--main-color) !important;
        }
        .dots_a57509, .dots_d331f1 {
            background-color: rgba(0, 0, 0, .6);
            border: 2px solid var(--main-color) !important;
        }
        .container_ae4f46 {
            background: rgba(0, 0, 0, .7);
        }
        .container_ae4f46 .countContainer_ae4f46 {
            background-color: var(--main-color);
        }
        .container_ae4f46 .clear_ae4f46 {
            color: var(--main-color);
        }
        .container_ae4f46 .clear_ae4f46:hover {
            color: var(--hover-color);
        }
        .countContainer_a6d69a {
            background: var(--main-color);
        }
        .sortDropdown_a6d69a {
            background-color: var(--main-color);
        }
        .sortDropdown_a6d69a .sortDropdownInner_a6d69a, .sortDropdown_a6d69a .sortDropdownText_a6d69a {
            color: #fff !important;
        }
        .container_d0f4b1 {
            background-color: rgba(0, 0, 0, 0);
        }
        .tagsButton_a6d69a {
            background-color: rgba(0, 0, 0, .3);
        }
        .tagsButton_a6d69a .tagsButtonInner_a6d69a {
            color: #fff;
        }
        .theme-dark .textContentFooter_a57509 {
            background: rgba(0, 0, 0, 0);
        }
        .container_ddbb27 {
            background: rgba(0, 0, 0, .3);
            border: 2px solid var(--main-color);
        }
        .container_ddbb27 .descriptionContainer_ddbb27 {
            background: rgba(0, 0, 0, .3);
        }
        .container_ddbb27 .gradient_ddbb27 {
            background: linear-gradient(0deg,  rgba(0,  0,  0,  0.8),  transparent);
        }
        .container_ddbb27 .linkContainer_ddbb27 {
            background: rgba(0, 0, 0, .8);
        }
        .container_ddbb27 .heading-lg-bold_f5eeaa, .container_ddbb27 .heading-lg-semibold__58a54 {
            color: var(--main-color);
        }
        .container_d1c246 {
            background: rgba(0, 0, 0, 0);
        }
        .container_d1c246.floating_d1c246 {
            background-color: rgba(0, 0, 0, .6);
            border-color: rgba(255, 255, 255, .07);
        }
        .iconWrapper_e378b3 {
            background: var(--main-color);
        }
        .container_b385c8, .divider_af45f8, .box_af45f8 {
            background-color: rgba(0, 0, 0, 0);
        }
        .box_af45f8:after {
            border-color: rgba(0, 0, 0, 0);
        }
        .buttonInner_b385c8 {
            background-color: rgba(255, 255, 255, .05);
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .buttonInner_b385c8:hover {
            background-color: rgba(255, 255, 255, .2);
            border-color: rgba(255, 255, 255, .2);
            color: #fff;
        }
        .buttonInner_b385c8.active_b385c8 {
            color: var(--main-color);
        }
        .buttonInner_b385c8.active_b385c8:hover {
            color: var(--hover-color);
        }
        .theme-dark .staticToolbar_de3e42 {
            background: rgba(0, 0, 0, .6);
        }
        .theme-dark .staticToolbar_de3e42>.channelTextArea_d0696b {
            border-radius: 0 0 8px 8px;
        }
        .addTags_faaca1 {
            background: var(--main-color);
        }
        .container_a03b48 {
            background-color: rgba(0, 0, 0, 0);
        }
        .cta_a03b48 {
            color: var(--main-color);
        }
        .theme-dark .cta_a03b48:hover {
            color: var(--hover-color);
        }
        .container_d66623, .previewContainer_d66623 {
            background-color: rgba(0, 0, 0, 0);
        }
        .tag_d66623, .post_d66623, .preview_d66623 {
            background-color: rgba(255, 255, 255, .09);
        }
        .forumPostIcon_d66623, .bottomSeparator_d66623 {
            background-color: rgba(0, 0, 0, 0);
        }
        .chatInput_d66623 {
            background-color: rgba(0, 0, 0, .4);
        }
        .newPostsButton_a6d69a {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .newPostsButton_a6d69a .text-md-medium_a84e09 {
            color: var(--main-color) !important;
        }
        .theme-dark .authBox_b83a05 {
            background-color: rgba(0, 0, 0, .8);
        }
        .theme-dark .authBox_b83a05 a {
            color: var(--url-color);
        }
        .list_f20a46 {
            background-color: rgba(255, 255, 255, .07);
        }
        .startOverButton_c6cd4b {
            color: var(--url-color);
        }
        .container_d10a58 {
            background-color: rgba(0, 0, 0, 0);
        }
        .optionContainer_e3f8c2 {
            background-color: var(--main-color);
        }
        .optionContainer_e3f8c2:hover {
            background-color: var(--hover-color);
        }
        .optionContainer_e3f8c2 .optionArrow_e3f8c2 {
            color: #fff;
        }
        .optionContainer_e3f8c2 span {
            color: #fff;
        }
        .channelIcon_e3f8c2, .channelTitleIcon_e3f8c2 {
            color: #fff;
        }
        .theme-dark .notice_dd5a33 {
            background-color: rgba(0, 0, 0, 0);
        }
        .container_a9480d {
            background-color: rgba(0, 0, 0, .8);
        }
        .button_dd5a33:hover {
            background-color: var(--hover-color);
        }
        .card_f9902b {
            background-color: rgba(0, 0, 0, .4);
        }
        .checkmark_f9902b {
            background-color: var(--main-color);
        }
        .communityInfoPill_fd6364 {
            background: rgba(0, 0, 0, .6);
        }
        .container_c68a2c, .container__29699 {
            background: rgba(0, 0, 0, 0);
        }
        .icon_ac2d0d {
            border: 4px solid rgba(0, 0, 0, 0);
        }
        .interactiveCard_d92364.selected__142a3 {
            border: 1px solid var(--main-color);
        }
        .interactiveCard_d92364:hover {
            border: 1px solid var(--hover-color);
        }
        .interactiveCard_d92364:active {
            border: 1px solid var(--hover-color);
        }
        .card_d4f6c7 {
            background: rgba(0, 0, 0, .4);
        }
        .iconContainer__1b9f0 {
            background: var(--main-color);
            color: #fff;
        }
        .container__55cc1:hover {
            background: var(--hover-color);
        }
        .conversationRoot_bed0b3:after, .replySpine__081f6 {
            border-left: 2px solid var(--main-color);
        }
        .conversationMessage__3c425:after {
            border-left: 2px solid var(--main-color);
            border-bottom: 2px solid var(--main-color);
        }
        .innerWrapper_aecbd6 {
            background: rgba(0, 0, 0, .8);
        }
        .topPerksCard_adc107 {
            background: rgba(0, 0, 0, .4);
        }
        .card_d1fdce {
            background: rgba(0, 0, 0, .2);
        }
        .wrapper_e55051 {
            background: rgba(0, 0, 0, .4);
        }
        .scroller_a50853 {
            background: rgba(0, 0, 0, 0);
        }
        .headerWave_a586c4>path {
            display: none;
        }
        .bodyWave_a586c4>path {
            fill: rgba(0, 0, 0, .8) !important;
        }
        .perks_fcea2f {
            background-color: rgba(0, 0, 0, .4);
        }
        .base_a4d4d9 .pageContainer_a9a262 {
            background: rgba(0,  0,  0,  calc(var(--background-shading) * 0.5));
        }
        .optionItem__7394f.selected_e9f61e .layout_e9f61e {
            background-color: var(--main-color);
        }
        .avatar__30fd0>svg>path {
            fill: var(--interactive-active);
        }
        .tabBar_d33b18 {
            margin-bottom: 0;
        }
        .card_f18d6c {
            background-color: rgba(0, 0, 0, .4);
            transition: all .15s ease-in-out;
        }
        .card_f18d6c:hover {
            background-color: rgba(0, 0, 0, .6);
        }
        .card_f18d6c .iconMask_f18d6c {
            background-color: rgba(0, 0, 0, .4);
            transition: all .15s ease-in-out;
        }
        .card_f18d6c .icon_f18d6c {
            background-color: var(--main-color);
            color: #fff;
        }
        .splash_f18d6c {
            background: rgba(0, 0, 0, 0);
        }
        .debugPanelStandalone_feab95 {
            background-color: var(--popout-color);
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .popoutText_c73c22>strong {
            color: var(--main-color);
        }
        .popoutText_c73c22.popoutTextDetails_c73c22 {
            color: rgba(255, 255, 255, .5);
        }
        .drawerSizingWrapper_af5dbb {
            min-width: 430px;
        }
        .contentWrapper_af5dbb {
            background-color: var(--popout-color);
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .navButtonActive_af5dbb {
            background-color: var(--main-color);
        }
        .header_c6ee36 {
            background-color: var(--popout-color);
        }
        .emojiPicker_c6ee36 {
            background-color: var(--popout-color);
            min-width: 430px;
            border-radius: 0;
        }
        .emojiPicker_c6ee36 .header_c6ee36 {
            background: rgba(0, 0, 0, 0);
        }
        .searchBar_c6ee36 {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            margin-top: 2px;
        }
        .searchBar_c6ee36:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
            transition: all .15s ease-in-out;
        }
        .searchBar_c6ee36:focus-within .input_effbe2 {
            color: #fff;
        }
        .searchBar_c6ee36:focus-within .input_effbe2::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .diversitySelectorOptions_cce80d {
            border: none;
            padding: 2px;
            background-color: rgba(0, 0, 0, .8);
        }
        .diversitySelectorOptions_cce80d .diversityEmojiItem_cce80d {
            border-radius: 3px;
            transition: all .15s ease-in-out;
        }
        .diversitySelectorOptions_cce80d .diversityEmojiItem_cce80d:hover {
            background-color: rgba(255, 255, 255, .07);
        }
        .wrapper_e06857 {
            background-color: rgba(0, 0, 0, 0);
        }
        .wrapper_e06857 .header_e06857 {
            color: #fff;
        }
        .emojiItem_fbfedd {
            border-radius: 3px;
            transition: all .15s ease-in-out, filter 0s;
        }
        .emojiItem_fbfedd.emojiItemSelected_fbfedd {
            background-color: rgba(255, 255, 255, .07);
        }
        .emojiItem_fbfedd.emojiItemDisabled__843ea {
            filter: grayscale(1);
        }
        .theme-dark .imageLoading_b000dd {
            background-image: none;
        }
        .inspector_c3120f {
            background-color: rgba(0, 0, 0, 0);
        }
        .categoryList_c6ee36, .wrapper_ba23fe {
            background-color: rgba(0, 0, 0, 0);
        }
        .categoryItem_dfa278:hover {
            background-color: rgba(255, 255, 255, .07);
            border-radius: 4px;
        }
        .categoryItem_dfa278.categoryItemDefaultCategorySelected_dfa278 {
            background-color: rgba(255, 255, 255, .07);
            border-radius: 4px;
        }
        .categoryIcon_dfa278 {
            color: rgba(255, 255, 255, .7);
        }
        .categoryItemDefaultCategorySelected_dfa278 .categoryIcon_dfa278 {
            color: #fff;
        }
        .guildIcon_bfabc4 {
            background-color: rgba(0, 0, 0, 0);
        }
        .unicodeShortcut_dfa278 {
            background-color: var(--main-color);
        }
        .unicodeShortcut_dfa278 svg {
            color: rgba(255, 255, 255, .9);
        }
        .unicodeShortcut_dfa278:hover {
            background-color: var(--hover-color);
        }
        .unicodeShortcut_dfa278:hover svg {
            color: #fff;
        }
        .premiumPromo_ca9b56 {
            background-color: rgba(0, 0, 0, .9);
        }
        .premiumPromoClose_ca9b56 {
            filter: brightness(0) invert(1);
            opacity: .6;
        }
        .premiumPromoClose_ca9b56:hover {
            opacity: .8;
        }
        .premiumPromoTitle_ca9b56 {
            color: #fff;
        }
        .upsell_b6ac1a {
            background-color: rgba(0, 0, 0, 0);
        }
        .categoryItemLockIconContainer_bfabc4 {
            background: var(--main-color);
            border-color: var(--main-color);
        }
        .upsellContainer_a3bc57 {
            background: var(--background-overlay);
            border: 2px solid var(--main-color);
        }
        .premiumRetentionNotice_fa8a68 {
            background-color: rgba(255, 255, 255, .1);
        }
        .header_b56bbc {
            background-color: rgba(0, 0, 0, 0);
        }
        .searchBar_b56bbc {
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            margin-top: 2px;
        }
        .searchBar_b56bbc:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
            transition: all .15s ease-in-out;
        }
        .input_c18ec9::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .content_b56bbc .categoryFade_af1167, .content_b56bbc .categoryFadeBlurple_af1167 {
            transition: all .15s ease-in-out;
        }
        .content_b56bbc .categoryFade_af1167:hover {
            background: rgba(0, 0, 0, .7);
        }
        .content_b56bbc .categoryFadeBlurple_af1167 {
            background: rgba(0, 0, 0, 0);
        }
        .content_b56bbc .categoryFadeBlurple_af1167:hover {
            background: rgba(0, 0, 0, 0);
        }
        .content_b56bbc .categoryFadeBlurple_af1167:after {
            content: "";
            width: 100%;
            height: 100%;
            display: block;
            background: var(--main-color);
            border-radius: 4px;
            opacity: .7;
        }
        .content_b56bbc .categoryText_af1167 {
            color: #fff;
            filter: drop-shadow(0 1px 1px rgba(0,  0,  0,  0.7));
        }
        .content_b56bbc .result_bad108:after {
            transition: all .15s ease-in-out;
        }
        .content_b56bbc [style*="background-color:"].result_bad108 {
            background: var(--main-color) !important;
        }
        .content_b56bbc [style*="background-color: rgb(179,  174,  255)"].result_bad108 {
            filter: brightness(1.3);
        }
        .content_b56bbc [style*="background-color: rgb(115,  142,  245)"].result_bad108 {
            filter: grayscale(0.3);
        }
        .content_b56bbc [style*="background-color: rgb(146,  154,  250)"].result_bad108 {
            filter: brightness(0.7);
        }
        .content_b56bbc .result_bad108:hover:after {
            box-shadow: inset 0 0 0 2px var(--main-color), inset 0 0 0 3px rgba(0, 0, 0, .3);
        }
        .content_b56bbc .theme-dark .focused_bad108:after, .content_b56bbc .theme-dark .result_bad108:hover:after {
            box-shadow: inset 0 0 0 2px var(--main-color), inset 0 0 0 3px rgba(0, 0, 0, .7);
        }
        .content_b56bbc .emptyHintCard_bad108 {
            background: rgba(255, 255, 255, .04);
            color: rgba(255, 255, 255, .5);
        }
        .content_b56bbc .endContainer_bad108:after {
            filter: grayscale(1) brightness(0.7);
            opacity: .3;
        }
        .searchSuggestion_de4721 {
            background: rgba(255, 255, 255, .04);
        }
        .theme-dark .popout_e6af9c.root_f9a4c9 {
            background-color: var(--popout-color);
        }
        .searchBar_e6af9c .searchBarComponent_e6af9c {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .tag_effbe2 {
            background: var(--main-color);
            color: #fff;
        }
        .friend_ebf869 {
            transition: all .15s ease-in-out;
        }
        .theme-dark .friend_ebf869.friendSelected_ebf869 {
            background: rgba(255, 255, 255, .1);
        }
        .theme-dark .friend_ebf869.friendSelected_ebf869 .nickname_ebf869 {
            color: #fff;
        }
        .theme-dark .friend_ebf869.friendSelected_ebf869 .discordTag_ebf869 {
            color: rgba(255, 255, 255, .5);
        }
        .nickname_ebf869 {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .discordTag_ebf869 {
            color: rgba(255, 255, 255, .3);
            opacity: 1;
            transition: all .15s ease-in-out;
        }
        .footerSeparator_e6af9c {
            box-shadow: 0 -1px 0 rgba(255, 255, 255, .04);
        }
        .theme-dark .contentWarningPopout_fa823b {
            background-color: var(--popout-color);
        }
        .theme-dark .footer_fa823b {
            background-color: rgba(0, 0, 0, 0);
        }
        .menu_d90b3d {
            background-color: var(--popout-color);
            animation: cv-menu-fold-y .2s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 50% 0;
        }
        .menu_d90b3d .item_d90b3d {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .menu_d90b3d .item_d90b3d.focused_d90b3d {
            background-color: var(--hover-color);
            color: #fff;
        }
        .menu_d90b3d .item_d90b3d.focused_d90b3d .checkbox_d90b3d, .menu_d90b3d .item_d90b3d.focused_d90b3d .radioSelection_d90b3d {
            color: #fff;
        }
        .menu_d90b3d .item_d90b3d.focused_d90b3d .check_d90b3d {
            fill: var(--main-color);
        }
        .menu_d90b3d .item_d90b3d.colorDefault_d90b3d:active:not(.hideInteraction_d90b3d) {
            background-color: var(--hover-color);
            color: #fff;
            border-color: var(--hover-color);
        }
        .menu_d90b3d .item_d90b3d .checkbox_d90b3d, .menu_d90b3d .item_d90b3d .radioSelection_d90b3d {
            color: var(--main-color);
        }
        .menu_d90b3d .colorBrand_d90b3d {
            color: var(--main-color);
        }
        .menu_d90b3d .colorDanger_d90b3d {
            color: var(--danger-color);
        }
        .menu_d90b3d .colorDanger_d90b3d.focused_d90b3d {
            background-color: var(--danger-color);
            color: #fff;
        }
        .menu_d90b3d .colorDanger_d90b3d.focused_d90b3d .icon_d90b3d {
            transform: rotateY(180deg);
            transition: all .15s ease-in-out;
        }
        .button_a24e84 {
            background-color: rgba(0, 0, 0, 0);
        }
        .button_a24e84.focused_a24e84, .button_a24e84:hover {
            background-color: rgba(0, 0, 0, 0);
        }
        .button_a24e84.focused_a24e84 {
            box-shadow: 0 0 2px 2px var(--hover-color);
        }
        .premiumUpsell_aae531 {
            background-color: rgba(0, 0, 0, 0);
        }
        .popout_c5b389 {
            background-color: rgba(0, 0, 0, .8);
        }
        .popout_c5b389 .row_c5b389:hover {
            background-color: var(--hover-color);
        }
        .popout_c5b389 .more_c5b389 {
            color: var(--main-color);
        }
        .option_ee4ca6 {
            color: #fff;
            background: var(--main-color);
            border-bottom: 1px solid rgba(255, 255, 255, .08);
            transition: all .15s ease-in-out;
        }
        .option_ee4ca6:hover {
            background: var(--hover-color);
        }
        #account-status-picker--online.item_d90b3d:not(.focused_d90b3d) .status_c7d26b {
            background-color: var(--online-color);
        }
        #account-status-picker--online.item_d90b3d.focused_d90b3d {
            background-color: var(--online-color);
        }
        #account-status-picker--idle.item_d90b3d:not(.focused_d90b3d) .status_c7d26b {
            background-color: var(--idle-color);
        }
        #account-status-picker--idle.item_d90b3d.focused_d90b3d {
            background-color: var(--idle-color);
        }
        #account-status-picker--dnd.item_d90b3d:not(.focused_d90b3d) .status_c7d26b {
            background-color: var(--dnd-color);
        }
        #account-status-picker--dnd.item_d90b3d.focused_d90b3d {
            background-color: var(--dnd-color);
        }
        #account-status-picker--invisible.item_d90b3d:not(.focused_d90b3d) .status_c7d26b {
            background-color: var(--offline-color);
        }
        #account-status-picker--invisible.item_d90b3d.focused_d90b3d {
            background-color: var(--offline-color);
        }
        .activeIcon_e1268c path {
            fill: var(--main-color);
        }
        .focused_d90b3d .activeIcon_e1268c circle {
            fill: var(--main-color);
        }
        .theme-dark .regionSelectPopout_ccb5ca {
            background-color: var(--popout-color);
        }
        .theme-dark .regionSelectPopout_ccb5ca .quickSelectPopoutOption_abbf45 {
            background-color: rgba(0, 0, 0, 0);
            border: none;
        }
        .theme-dark .regionSelectPopout_ccb5ca .selected.quickSelectPopoutOption_abbf45 {
            background-color: var(--main-color);
        }
        .theme-dark .regionSelectPopout_ccb5ca .quickSelectPopoutOption_abbf45:hover {
            background-color: var(--hover-color);
        }
        .theme-dark .regionSelectPopout_ccb5ca .quickSelectPopoutOption_abbf45 .regionSelectName_ccb5ca {
            color: #fff;
        }
        .messagesPopoutWrap_ac90a2, .recentMentionsPopout_ddb5b4 {
            background-color: var(--popout-color);
            animation: cv-menu-fold-y .2s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 50% 0;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .header_ac90a2, .footer_ac90a2 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .header_ac90a2 .tabBar_f0cd33 .tab_f0cd33 {
            color: #fff;
        }
        .theme-dark .header_ac90a2 .tabBar_f0cd33 .tab_f0cd33.active_f0cd33 {
            background-color: var(--main-color);
        }
        .theme-dark .header_ac90a2 .tabBar_f0cd33 .tab_f0cd33:hover:not(.active_f0cd33) {
            background-color: rgba(255, 255, 255, .06);
            color: #fff;
        }
        .channelHeader_f3978e {
            background: rgba(0, 0, 0, .8);
            padding-right: 10px;
            padding-left: 20px;
        }
        .guildIcon_f3978e {
            background-color: rgba(0, 0, 0, 0);
        }
        .messageGroupWrapper_ac90a2 {
            margin: 0;
            background-color: rgba(0, 0, 0, 0);
            border: none;
            border-bottom: solid 1px rgba(255, 255, 255, .04);
            border-radius: 0;
            transition: all .15s ease-in-out;
        }
        .messageGroupWrapper_ac90a2:last-child {
            border-bottom: none;
        }
        .messageGroupWrapper_ac90a2+.messageGroupWrapper_ac90a2 {
            margin-top: -1px;
        }
        .jumpButton_ac90a2 {
            background-color: var(--main-color);
            color: #fff;
        }
        .jumpButton_ac90a2:hover {
            background-color: var(--hover-color);
            color: #fff;
        }
        .container_ddb5b4 {
            margin: 0;
            background-color: rgba(0, 0, 0, 0);
            border: none;
            border-bottom: solid 1px rgba(255, 255, 255, .08);
            border-radius: 0;
        }
        .messageContainer_ddb5b4 {
            background: rgba(0, 0, 0, 0);
            padding-right: 10px;
            padding-left: 20px;
        }
        .jumpButton_ac3dc2 {
            background-color: var(--main-color);
        }
        .jumpButton_ac3dc2 .text_ac3dc2 {
            color: #fff;
        }
        .jumpButton_ac3dc2:hover {
            background-color: var(--hover-color);
        }
        .jumpButton_ac3dc2:hover .text_ac3dc2 {
            color: #fff;
        }
        .icon_b0914a {
            background-color: var(--main-color);
            color: #fff;
        }
        .tutorial_f1c3d9 {
            background: rgba(0, 0, 0, 0);
            border-bottom: solid 1px rgba(255, 255, 255, .08);
        }
        .tutorialIcon_f1c3d9 {
            background-color: var(--main-color);
            color: #fff;
        }
        .channel_d09ffd {
            margin: 0;
            background-color: rgba(0, 0, 0, 0);
            border: none;
            border-bottom: solid 1px rgba(255, 255, 255, .08);
            border-radius: 0;
        }
        .messages_c06487 {
            background: rgba(0, 0, 0, 0);
            padding-right: 10px;
            padding-left: 20px;
        }
        .collapseButton_d09ffd {
            padding-left: 9px;
        }
        .container_fe1358 {
            background: rgba(0, 0, 0, 0);
        }
        .friendRequestsButton_c0c071 {
            background: var(--main-color);
            color: #fff;
        }
        .friendRequestsButton_c0c071:hover {
            background: var(--hover-color);
        }
        .forumPost_c53f2f {
            background: rgba(0, 0, 0, .1);
            border: 2px solid var(--main-color);
        }
        .forumPost_c53f2f:hover {
            border: 2px solid var(--hover-color);
        }
        .unread_fd8ff1 {
            background-color: var(--main-color);
        }
        .calloutContainer_fd8ff1 {
            background-color: hsla(0,  0%,  30%,  calc(var(--background-shading) * 0.5));
        }
        .popoutContainer_cf58b5 {
            background-color: var(--popout-color);
        }
        .emojiSection_e58351 {
            background-color: rgba(0, 0, 0, 0);
        }
        .guildSection_e58351 {
            background-color: rgba(0, 0, 0, 0);
        }
        .toolbar_de3e42 {
            background-color: var(--popout-color);
        }
        .toolbar_de3e42::before {
            border-top: 8px solid rgba(0, 0, 0, .8);
        }
        .button_de3e42:hover {
            background-color: rgba(255, 255, 255, .05);
        }
        .icon_de3e42 {
            color: rgba(255, 255, 255, .7);
        }
        .theme-dark .streamPreview_adbea6 {
            background-color: var(--popout-color);
        }
        .theme-dark .previewContainer_adbea6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .watchButton_adbea6 {
            border-color: var(--main-color);
            color: rgba(255, 255, 255, .8);
        }
        .theme-dark .watchButton_adbea6:not([disabled]):hover {
            border-color: var(--hover-color);
            color: #fff;
        }
        .popout_d201be, .popout_a9414b {
            background-color: var(--popout-color);
        }
        .iconWidget_a9414b {
            background-color: rgba(255, 255, 255, .07);
            border-color: rgba(255, 255, 255, .09);
        }
        .iconWidget_a9414b:hover {
            background-color: rgba(255, 255, 255, .07);
            border-color: var(--hover-color);
        }
        .setCustomButton_a9414b {
            background-color: var(--main-color);
            border-color: rgba(0, 0, 0, 0);
        }
        .setCustomButton_a9414b:hover {
            background-color: var(--hover-color);
            border-color: rgba(0, 0, 0, 0);
        }
        .sidebarContainer_e5b5f9 {
            background: rgba(0, 0, 0, 0);
        }
        .root_ee4ca6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .problemInfo_b58b14 .option_ee4ca6 {
            color: #fff;
            background: rgba(255, 255, 255, .03);
            border: 1px solid rgba(255, 255, 255, .05);
            border-top: none;
        }
        .problemInfo_b58b14 .option_ee4ca6:first-child {
            border-top: 1px solid rgba(255, 255, 255, .05);
        }
        .problemInfo_b58b14 .option_ee4ca6:hover {
            background: rgba(255, 255, 255, .06);
        }
        .editor_bcfa1e {
            background: var(--background-overlay);
            border-left: 5px solid var(--main-color);
        }
        .interactionsContainer_a35965 {
            background: var(--background-overlay);
        }
        .shareToChannelButton_a35965 {
            background: var(--main-color);
        }
        .shareToChannelButton_a35965 path {
            fill: #fff;
        }
        .theme-dark .container_eedf95 {
            background-color: var(--popout-color);
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            animation: cv-menu-fold-y .2s cubic-bezier(0.2,  0.6,  0.5,  1.1) .1s backwards;
            transform-origin: 50% 0;
        }
        .container_eedf95>.resultsGroup_b0286e:after {
            border-top: 1px solid rgba(0, 0, 0, 0);
        }
        .container_eedf95>.resultsGroup_b0286e+.resultsGroup_b0286e:after {
            border-top-color: rgba(255, 255, 255, .04);
        }
        .container_eedf95>.resultsGroup_b0286e>.header_b0286e {
            color: var(--main-color);
            font-weight: 700;
        }
        .container_eedf95>.resultsGroup_b0286e>.searchLearnMore_b0286e, .container_eedf95>.resultsGroup_b0286e>.searchClearHistory_b0286e {
            opacity: .5;
            transition: all .15s ease-in-out;
        }
        .container_eedf95>.resultsGroup_b0286e>.searchLearnMore_b0286e:hover, .container_eedf95>.resultsGroup_b0286e>.searchClearHistory_b0286e:hover {
            opacity: 1;
        }
        .container_eedf95>.resultsGroup_b0286e>.searchLearnMore_b0286e>a, .container_eedf95>.resultsGroup_b0286e>.searchClearHistory_b0286e>a {
            color: #fff;
        }
        .container_eedf95 .option_b0286e {
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e:after {
            display: none;
        }
        .container_eedf95 .option_b0286e .plusIcon_b0286e {
            display: block;
            color: #fff;
            opacity: 0;
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e:hover .plusIcon_b0286e {
            opacity: .7;
        }
        .container_eedf95 .option_b0286e .filter_b0286e {
            color: rgba(255, 255, 255, .3);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e .answer_b0286e {
            color: rgba(255, 255, 255, .5);
            font-weight: 500;
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e .nonText_b0286e {
            color: rgba(255, 255, 255, .5);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e>strong {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 [aria-selected=true].option_b0286e {
            background-color: rgba(255, 255, 255, .1);
        }
        .container_eedf95 [aria-selected=true].option_b0286e .plusIcon_b0286e {
            opacity: .3;
        }
        .container_eedf95 [aria-selected=true].option_b0286e .plusIcon_b0286e:hover {
            opacity: .7;
        }
        .container_eedf95 [aria-selected=true].option_b0286e .filter_b0286e {
            color: rgba(255, 255, 255, .5);
        }
        .container_eedf95 [aria-selected=true].option_b0286e .answer_b0286e, .container_eedf95 [aria-selected=true].option_b0286e .nonText_b0286e {
            color: rgba(255, 255, 255, .7);
        }
        .container_eedf95 [aria-selected=true].option_b0286e>strong {
            color: #fff;
        }
        .container_eedf95 .option_b0286e.user_b0286e .displayedNick_b0286e {
            color: rgba(255, 255, 255, .5);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e.user_b0286e .displayUsername_b0286e {
            color: rgba(255, 255, 255, .3);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e>.resultChannel_b0286e>strong {
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .option_b0286e>.resultChannel_b0286e>.searchResultChannelIcon_b0286e, .container_eedf95 .option_b0286e>.resultChannel_b0286e>.searchResultChannelCategory_b0286e {
            color: rgba(255, 255, 255, .3);
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .queryContainer_eedf95 {
            background-color: var(--main-color);
        }
        .container_eedf95 .queryContainer_eedf95>.queryText_eedf95 {
            color: rgba(255, 255, 255, .7);
        }
        .container_eedf95 .queryContainer_eedf95>.queryText_eedf95>strong {
            color: #fff;
        }
        .container_eedf95 .datePicker_b0286e .datePickerHint_b0286e {
            border-top: 1px solid rgba(255, 255, 255, .04);
        }
        .container_eedf95 .datePicker_b0286e .datePickerHint_b0286e .hint_b0286e {
            color: rgba(255, 255, 255, .7);
        }
        .container_eedf95 .datePicker_b0286e .datePickerHint_b0286e .hintValue_b0286e {
            background-color: var(--main-color);
            color: #fff;
            transition: all .15s ease-in-out;
        }
        .container_eedf95 .datePicker_b0286e .datePickerHint_b0286e .hintValue_b0286e:hover {
            background-color: var(--hover-color);
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker, .theme-dark .calendarPicker_be05cd .react-datepicker__header {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.8));
        }
        .theme-dark .calendarPicker_be05cd>.react-datepicker .react-datepicker__navigation {
            background-color: rgba(255, 255, 255, .1);
            border: 1px solid rgba(0, 0, 0, 0);
            opacity: .7;
            transition: all .15s ease-in-out;
        }
        .theme-dark .calendarPicker_be05cd>.react-datepicker .react-datepicker__navigation:hover {
            background-color: var(--main-color);
            opacity: 1;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__current-month {
            border-bottom: 1px solid rgba(255, 255, 255, .04);
            color: var(--main-color);
            font-weight: 600;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__day-name {
            color: rgba(255, 255, 255, .7);
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day {
            background-color: rgba(255, 255, 255, .1);
            border-left: 1px solid rgba(255, 255, 255, .04);
            border-top: 1px solid rgba(255, 255, 255, .04);
            color: rgba(255, 255, 255, .7);
            transition: all .15s ease-in-out;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day:last-of-type {
            border-right: 1px solid rgba(255, 255, 255, .04);
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day:hover {
            background-color: var(--main-color);
            color: #fff;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--selected {
            box-shadow: inset 0 -3px var(--main-color);
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--selected:after {
            display: none;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--today {
            color: var(--main-color);
            font-weight: 700;
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--disabled, .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--outside-month {
            background-color: rgba(0, 0, 0, 0);
            color: rgba(255, 255, 255, .1);
        }
        .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--disabled:hover, .theme-dark .calendarPicker_be05cd .react-datepicker__week>.react-datepicker__day--outside-month:hover {
            background-color: rgba(0, 0, 0, 0);
            color: rgba(255, 255, 255, .1);
        }
        .container_effbe2 {
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            margin-top: 2px;
        }
        .container_effbe2:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
            transition: all .15s ease-in-out;
        }
        .container_effbe2 .input_effbe2 {
            color: #fff;
        }
        .container_effbe2 .input_effbe2::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .stickerCategoryGeneric_a7a485 {
            color: rgba(255, 255, 255, .7);
        }
        .stickerCategoryGeneric_a7a485:hover {
            background-color: rgba(255, 255, 255, .07);
            border-radius: 4px;
        }
        .stickerCategoryGenericSelected_a7a485 {
            background-color: var(--main-color);
            color: #fff;
        }
        .row_a708c4 {
            column-gap: 8px !important;
        }
        .stickerInspected_a708c4 .inspectedIndicator_a708c4 {
            background-color: var(--main-color);
        }
        .theme-dark .containerBackground_ccd3df {
            opacity: 1;
            background-color: rgba(0, 0, 0, .8);
            border: none;
        }
        .maskBackground_ccd3df {
            background: var(--hover-color);
        }
        .layer_cd0de5 .container_e664f3 {
            background-color: var(--popout-color);
            animation: cv-menu-fold-y .2s cubic-bezier(0.2,  0.6,  0.5,  1.1);
            transform-origin: 50% 0;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .searchBox_e664f3 {
            background: rgba(255, 255, 255, .07);
        }
        .searchBox_e664f3::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .header_e664f3 {
            background-color: rgba(0, 0, 0, 0);
        }
        .icon_ebd74a {
            background-color: var(--main-color);
            color: #fff;
        }
        .full-motion .translate_f88ae3:has(.userPopoutOuter_c69a7b) {
            transform: unset !important;
            position: relative;
            z-index: 0;
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b {
            background: rgba(0, 0, 0, 0);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b .userPopoutInner_c69a7b {
            background: var(--user-popout-overlay);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b .userPopoutOverlayBackground_c69a7b {
            background-color: rgba(0, 0, 0, .4);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b:not(.profileCustomizationPreview_ab876d) .userPopoutInner_c69a7b::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: var(--user-popout-image) var(--user-popout-position)/var(--user-popout-size) var(--user-popout-repeat) var(--user-popout-attachment);
            filter: grayscale(var(--user-popout-grayscale)) sepia(var(--user-popout-sepia)) invert(var(--user-popout-invert)) brightness(var(--user-popout-brightness)) contrast(var(--user-popout-contrast)) saturate(var(--user-popout-saturation)) blur(var(--user-popout-blur));
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .animatorLeft_f88ae3>.userPopoutOuter_c69a7b {
            transform-origin: 100% 50%}
        .userPopoutOuter_c69a7b .banner_c3e427:not(.bannerPremium_c3e427) {
            -webkit-mask: linear-gradient(to bottom,  #000,  transparent 93%);
            mask: linear-gradient(to bottom,  #000,  transparent 93%);
        }
        .userPopoutOuter_c69a7b .bannerPremium_c3e427 {
            -webkit-mask: linear-gradient(to bottom,  #000 50%,  transparent);
            mask: linear-gradient(to bottom,  #000 50%,  transparent);
        }
        .profileBadges_f89da9 {
            background-color: rgba(0, 0, 0, .4);
        }
        .userProfileOuterUnthemed_c69a7b .statusBubbleOuter_d0a252 {
            background-color: rgba(0, 0, 0, .6);
            border-color: rgba(0, 0, 0, 0);
        }
        .userProfileOuterUnthemed_c69a7b .statusBubbleOuter_d0a252::before {
            background-color: rgba(0, 0, 0, .6);
            border-color: rgba(0, 0, 0, 0);
            border-radius: 16px 16px 0 0;
            height: 8.5px;
        }
        .userProfileOuterUnthemed_c69a7b .statusBubbleOuter_d0a252::after {
            background-color: rgba(0, 0, 0, .6);
            border-color: rgba(0, 0, 0, 0);
        }
        .userProfileOuterUnthemed_c69a7b .statusBubble_d0a252 {
            background-color: rgba(0, 0, 0, 0);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b .activity_cd74cc {
            background-color: rgba(0, 0, 0, .4);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b .buttonColor_cd74cc {
            background-color: var(--main-color);
        }
        .note_c90ad7 textarea:focus {
            background-color: rgba(255, 255, 255, .07);
        }
        .userPopoutOuter_c69a7b.userProfileOuterUnthemed_c69a7b .menu_d4e7c2 {
            background-color: rgba(0, 0, 0, .4);
        }
        .container_e88961 {
            background: var(--popout-color);
        }
        .container_c23582 {
            background: var(--main-color);
        }
        .container_c23582 .text-sm-normal__95a78 {
            color: #fff !important;
        }
        .container_c23582>svg {
            color: #fff;
        }
        .errorPage_dd2aa2 {
            background: rgba(0, 0, 0, 0);
            box-shadow: inset 0 0 50vmin 10px var(--danger-color);
        }
        .errorPage_dd2aa2 .contents_dd4f85 {
            height: 16px;
            font-size: 0;
        }
        .errorPage_dd2aa2 .contents_dd4f85:after {
            content: "Respawn at last Checkpoint";
            font-size: 14px;
        }
        .image_b06619 {
            display: none;
        }
        .text_b06619 {
            width: auto;
            color: rgba(255, 255, 255, .7);
        }
        .text_b06619 h4 {
            height: 150px;
            width: 100vw;
            background: rgba(0, 0, 0, .5);
            box-shadow: 0 0 30px 15px rgba(0, 0, 0, .5);
            color: var(--danger-color);
            font-family: Georgia, "Times New Roman", Times, serif;
            font-size: 0;
            font-weight: normal;
            line-height: 150px;
        }
        .text_b06619 h4:after {
            content: "YOU DIED";
            font-size: 150px;
        }
        .text_b06619 .note_b06619 {
            font-size: 0;
            white-space: pre-line;
        }
        .note_b06619>div>p {
            margin: 0;
        }
        .note_b06619>div>p:before, .note_b06619>div>p:after {
            margin-bottom: 14px;
            display: block;
            font-size: 16px;
        }
        .note_b06619>div>p:first-child:before {
            content: "Looks like you got slaughtered by an Error Level 9000."}
        .note_b06619>div>p:first-child:after {
            content: "Might have been one of your plugins?"}
        .note_b06619>div>p:last-child:after {
            content: "Press Ctrl + Shift + I or Cmd + Alt + I to check Console for errors."}
        .container_e40c16 {
            background: rgba(0, 0, 0, .9);
        }
        .links_e40c16 {
            color: var(--main-color);
            opacity: 1 !important;
            transition: all .1s ease-in-out;
        }
        .links_e40c16:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .content_a7d72e .searchResultsWrap_c2b47d {
            background-color: rgba(0, 0, 0, .6);
        }
        .searchResultsWrap_c2b47d>.searchHeader_b7c924 {
            background-color: rgba(0, 0, 0, .3);
            box-shadow: 0 0 10px rgba(0, 0, 0, .3);
        }
        .searchResultsWrap_c2b47d .searchResult_ddc613 {
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, .04);
            background-color: rgba(0, 0, 0, 0);
        }
        .searchResultsWrap_c2b47d .searchResult_ddc613:before, .searchResultsWrap_c2b47d .searchResult_ddc613:after {
            display: none;
        }
        .searchResultsWrap_c2b47d .searchResult_ddc613+.searchResult_ddc613 {
            margin-top: -1px;
        }
        .searchResultsWrap_c2b47d .button_ddc613 {
            background-color: rgba(255, 255, 255, .04);
            color: rgba(255, 255, 255, .5);
            border-radius: 3px;
            transition: all .3s ease-in-out;
        }
        .searchResultsWrap_c2b47d .button_ddc613:hover {
            background-color: var(--main-color);
            color: #fff;
            transition-duration: .15s;
        }
        .searchResultsWrap_c2b47d .highlight {
            position: relative;
            padding: 0 2px;
            background-color: var(--hover-color);
            border-radius: 3px;
            color: #fff;
            text-shadow: 0 0 3px;
        }
        .resultsBlocked_a9e225 {
            background-color: rgba(0, 0, 0, 0);
            border: none;
        }
        .connection_e2a436 {
            background-color: rgba(0, 0, 0, .4);
        }
        .connectionHeader_e2a436 {
            background-color: rgba(0, 0, 0, 0);
        }
        .connection_e2a436:has([alt*=Reddit].connectionIcon_e2a436) {
            background-color: rgba(255, 69, 0, .5);
        }
        .connection_e2a436:has([alt*=Steam].connectionIcon_e2a436) {
            background-color: rgba(0, 0, 0, .5);
        }
        .connection_e2a436:has([alt*=Twitter].connectionIcon_e2a436) {
            background-color: rgba(0, 158, 247, .5);
        }
        .connection_e2a436:has([alt*=Spotify].connectionIcon_e2a436) {
            background-color: rgba(29, 185, 84, .5);
        }
        .connection_e2a436:has([alt*="Xbox Live"].connectionIcon_e2a436) {
            background-color: rgba(16, 124, 16, .5);
        }
        .connection_e2a436:has([alt*="Battle.net"].connectionIcon_e2a436) {
            background-color: rgba(5, 102, 176, .5);
        }
        .connection_e2a436:has([alt*=Facebook].connectionIcon_e2a436) {
            background-color: rgba(24, 119, 242, .5);
        }
        .connection_e2a436:has([alt*=GitHub].connectionIcon_e2a436) {
            background-color: rgba(34, 34, 34, .5);
        }
        .connection_e2a436:has([alt*=Twitch].connectionIcon_e2a436) {
            background-color: rgba(145, 70, 255, .5);
        }
        .connection_e2a436:has([alt*=YouTube].connectionIcon_e2a436) {
            background-color: rgba(255, 0, 0, .5);
        }
        .connectionHeader_e2a436:has([alt*=Reddit].connectionIcon_e2a436) {
            background-color: rgba(255, 69, 0, .2);
        }
        .connectionHeader_e2a436:has([alt*=Steam].connectionIcon_e2a436) {
            background-color: rgba(0, 0, 0, .2);
        }
        .connectionHeader_e2a436:has([alt*=Twitter].connectionIcon_e2a436) {
            background-color: rgba(0, 158, 247, .2);
        }
        .connectionHeader_e2a436:has([alt*=Spotify].connectionIcon_e2a436) {
            background-color: rgba(29, 185, 84, .2);
        }
        .connectionHeader_e2a436:has([alt*="Xbox Live"].connectionIcon_e2a436) {
            background-color: rgba(16, 124, 16, .2);
        }
        .connectionHeader_e2a436:has([alt*="Battle.net"].connectionIcon_e2a436) {
            background-color: rgba(5, 102, 176, .2);
        }
        .connectionHeader_e2a436:has([alt*=Facebook].connectionIcon_e2a436) {
            background-color: rgba(24, 119, 242, .2);
        }
        .connectionHeader_e2a436:has([alt*=GitHub].connectionIcon_e2a436) {
            background-color: rgba(34, 34, 34, .2);
        }
        .connectionHeader_e2a436:has([alt*=Twitch].connectionIcon_e2a436) {
            background-color: rgba(145, 70, 255, .2);
        }
        .connectionHeader_e2a436:has([alt*=YouTube].connectionIcon_e2a436) {
            background-color: rgba(255, 0, 0, .2);
        }
        .connectionAccountLabel_e2a436 {
            color: rgba(255, 255, 255, .7) !important;
        }
        .connectionDelete_e2a436 {
            color: rgba(255, 255, 255, .7);
        }
        .metadataContainer_e2a436 {
            background-color: rgba(255, 255, 255, .1);
        }
        .sidebar_c25c6d .header_a0:has(.category_c394c4) {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            grid-template-rows: .5fr .5fr;
            padding: 20px 0;
        }
        .sidebar_c25c6d .header_a0::before {
            grid-column: 1/2;
            grid-row: 2/3;
        }
        .sidebar_c25c6d .header_a0:after {
            grid-column: 3/4;
            grid-row: 2/3;
        }
        .headerText_a0:has(.category_c394c4) {
            grid-column: 2/3;
            grid-row: 1/3;
            display: grid;
            grid-template-columns: min-content 1fr;
            grid-template-rows: 1.5fr 1fr;
            column-gap: 2px;
            justify-items: center;
        }
        .category_c394c4 {
            color: var(--main-color) !important;
            margin: 0;
            grid-column: 1/3;
            grid-row: 1/2;
        }
        .category_c394c4::before {
            content: "< "}
        .category_c394c4:after {
            content: " >"}
        .group_e3c4bb {
            border: 1px solid rgba(255, 255, 255, .07);
        }
        .item_e3c4bb {
            background-color: rgba(0, 0, 0, .4);
            border-color: rgba(255, 255, 255, .07);
            cursor: pointer;
        }
        .item_e3c4bb.selected_e3c4bb.deny_e3c4bb {
            background-color: rgba(240, 71, 71, .6);
            border-color: #f04747;
        }
        .item_e3c4bb.selected_e3c4bb.passthrough_e3c4bb {
            background-color: rgba(250, 166, 26, .6);
            border-color: #faa61a;
        }
        .item_e3c4bb.selected_e3c4bb.allow_e3c4bb {
            background-color: rgba(67, 181, 129, .6);
            border-color: #43b581;
        }
        .settingCard_dd864e {
            background-color: rgba(0, 0, 0, .4);
        }
        .settingCard_dd864e.active_dd864e {
            background-color: rgba(0, 0, 0, .4);
        }
        .cardFolder_dd864e {
            background-color: rgba(0, 0, 0, 0);
        }
        .iconWrapper_d5408a {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .header_bcd8cb, .theme-dark .container_bcd8cb .sectionTag_bcd8cb {
            background-color: var(--popout-color);
        }
        .row_bcd8cb.selected_bcd8cb .rowInner_bcd8cb {
            background-color: rgba(255, 255, 255, .1);
        }
        .standardSidebarView_c25c6d>.contentRegion_c25c6d {
            background: rgba(0, 0, 0, 0);
        }
        .contentRegion_c25c6d .contentRegionScroller_c25c6d, .contentRegion_c25c6d .scroller_e9196a {
            background: rgba(0, 0, 0, 0);
        }
        .theme-dark .closeButton_df5532 {
            border-color: rgba(255, 255, 255, .4);
        }
        .theme-dark .closeButton_df5532:hover {
            border-color: rgba(255, 255, 255, .6);
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .closeButton_df5532>svg>path {
            fill: rgba(255, 255, 255, .6);
        }
        .theme-dark .keybind_df5532 {
            color: rgba(255, 255, 255, .6);
        }
        .container_b6cd66 {
            background-color: rgba(0, 0, 0, .8) !important;
        }
        .imageUploaderInner_de76e4 {
            background-color: rgba(255, 255, 255, .05);
        }
        .theme-dark .imageUploaderIcon_de76e4 {
            background-color: var(--main-color);
            background-image: none;
        }
        .theme-dark .imageUploaderIcon_de76e4:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-image: url(https://discord.com/assets/d5c25e76af04cea8997e4a060572feae.svg);
            background-repeat: no-repeat;
            background-position: 50%;
            filter: brightness(0) invert(1);
            pointer-events: none;
        }
        .theme-dark .card_a298b8:not(.outline_a298b8), .theme-dark .card_a298b8.outline_a298b8 {
            background-color: rgba(0, 0, 0, .4);
            border-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .card_a298b8 a {
            color: var(--url-color);
        }
        .theme-dark .customColorPicker_b91d66 {
            background-color: rgba(0, 0, 0, .8);
            border-color: rgba(0, 0, 0, 0);
            border-radius: 5px;
        }
        [style*=transform].app_a01fb1 {
            transform: none !important;
        }
        [style*=transform].app_a01fb1 .bg_d4b6c5 {
            animation: cv-shake .5s ease-in;
        }
        .lookFilled_f6639d.select_f6639d {
            background-color: rgba(255, 255, 255, .07);
            border-color: rgba(255, 255, 255, .09);
        }
        .popout_f6639d {
            background-color: var(--popout-color);
            border: none;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .option_f6639d:hover, .option_f6639d:focus, .option_f6639d.focused_f6639d {
            background-color: rgba(255, 255, 255, .05);
            border: rgba(255, 255, 255, .07);
        }
        [aria-selected=true].option_f6639d:not(.option_f6639d.multi_f6639d) {
            background-color: var(--main-color);
        }
        [aria-selected=true].option_f6639d:not(.option_f6639d.multi_f6639d) .selectedIcon_f6639d circle {
            fill: var(--main-color);
        }
        [aria-selected=true].option_f6639d:not(.option_f6639d.multi_f6639d) path {
            fill: #fff;
        }
        .attendeeCTA_ca5ce6:after {
            content: "ClearVision easter egg,  please visit our server for a headpat :)";
            position: absolute;
            width: 100%;
            height: 100%;
            font-size: 1rem;
            color: rgba(255, 255, 255, .7);
            text-align: center;
            top: 130%;
            z-index: -1;
            left: 0;
        }
        .sidebar_c25c6d .item_a0:before {
            content: "";
            position: absolute;
            width: 0;
            height: 24px;
            left: 15px;
            margin-top: -2px;
            z-index: 999;
            transition: all .15s ease-in-out;
        }
        .sidebar_c25c6d .item_a0.selected_a0 {
            padding-left: 50px !important;
        }
        .sidebar_c25c6d .item_a0.selected_a0:before {
            width: 24px;
        }
        .sidebar_c25c6d [aria-controls=my-account-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/person.svg);
        }
        .sidebar_c25c6d [aria-controls=profile-customization-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/user_profile.svg);
        }
        .sidebar_c25c6d [aria-controls="privacy-&-safety-tab"].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/security.svg);
        }
        .sidebar_c25c6d [aria-controls=family-center-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/family.svg);
        }
        .sidebar_c25c6d [aria-controls=authorized-apps-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/apps.svg);
        }
        .sidebar_c25c6d [aria-controls=sessions-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/devices.svg);
        }
        .sidebar_c25c6d [aria-controls=connections-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/link.svg);
        }
        .sidebar_c25c6d [aria-controls=settings-clips-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/clips.svg);
        }
        .sidebar_c25c6d [aria-controls=friend-requests-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/person_add.svg);
        }
        .sidebar_c25c6d [aria-controls=discord-nitro-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/nitro.svg);
        }
        .sidebar_c25c6d [aria-controls=nitro-server-boost-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/server_boost.svg);
        }
        .sidebar_c25c6d [aria-controls=subscriptions-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/subscriptions.svg);
        }
        .sidebar_c25c6d [aria-controls=library-inventory-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/gift.svg);
        }
        .sidebar_c25c6d [aria-controls=billing-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/payment.svg);
        }
        .sidebar_c25c6d [aria-controls=appearance-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/camera.svg);
        }
        .sidebar_c25c6d [aria-controls=accessibility-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/accessibility.svg);
        }
        .sidebar_c25c6d [aria-controls="voice-&-video-tab"].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/mic.svg);
        }
        .sidebar_c25c6d [aria-controls="text-&-images-tab"].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/chat.svg);
        }
        .sidebar_c25c6d [aria-controls=notifications-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/notifications.svg);
        }
        .sidebar_c25c6d [aria-controls=keybinds-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/keyboard.svg);
        }
        .sidebar_c25c6d [aria-controls=language-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/language.svg);
        }
        .sidebar_c25c6d [aria-controls=windows-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/windows.svg);
        }
        .sidebar_c25c6d [aria-controls=linux-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/linux.svg);
        }
        .sidebar_c25c6d [aria-controls=streamer-mode-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/videocam.svg);
        }
        .sidebar_c25c6d [aria-controls=advanced-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/bug.svg);
        }
        .sidebar_c25c6d [aria-controls=activity-privacy-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/controller-off.svg);
        }
        .sidebar_c25c6d [aria-controls=game-activity-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/games.svg);
        }
        .sidebar_c25c6d [aria-controls=overlay-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/aspect_ratio.svg);
        }
        .sidebar_c25c6d [aria-controls=changelog-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/history.svg);
        }
        .sidebar_c25c6d [aria-controls=hypesquad-online-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/hypesquad.svg);
        }
        .sidebar_c25c6d [aria-controls=overview-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/info.svg);
        }
        .sidebar_c25c6d [aria-controls=roles-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/flag.svg);
        }
        .sidebar_c25c6d [aria-controls=emoji-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/emoji.svg);
        }
        .sidebar_c25c6d [aria-controls=stickers-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/sticker.svg);
        }
        .sidebar_c25c6d [aria-controls=soundboard-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/music.svg);
        }
        .sidebar_c25c6d [aria-controls=widget-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/widgets.svg);
        }
        .sidebar_c25c6d [aria-controls=guild_templates-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/website.svg);
        }
        .sidebar_c25c6d [aria-controls=vanity_url-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/link_plus.svg);
        }
        .sidebar_c25c6d [aria-controls=integrations-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/puzzle.svg);
        }
        .sidebar_c25c6d [aria-controls=moderation-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/security.svg);
        }
        .sidebar_c25c6d [aria-controls=safety-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/security.svg);
        }
        .sidebar_c25c6d [aria-controls=guild_automod-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/robot.svg);
        }
        .sidebar_c25c6d [aria-controls=audit_log-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/list.svg);
        }
        .sidebar_c25c6d [aria-controls=bans-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/hammer.svg);
        }
        .sidebar_c25c6d [aria-controls=community-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/people.svg);
        }
        .sidebar_c25c6d [aria-controls=onboarding-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/rocket_launch.svg);
        }
        .sidebar_c25c6d [aria-controls=analytics-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/insights.svg);
        }
        .sidebar_c25c6d [aria-controls=partner-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/handshake.svg);
        }
        .sidebar_c25c6d [aria-controls=discovery-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/explore.svg);
        }
        .sidebar_c25c6d [aria-controls=community_welcome-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/waving_hand.svg);
        }
        .sidebar_c25c6d [aria-controls=guild_premium-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/server_boost.svg);
        }
        .sidebar_c25c6d [aria-controls=role_subscriptions-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/subscriptions.svg);
        }
        .sidebar_c25c6d [aria-controls=members-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/group.svg);
        }
        .sidebar_c25c6d [aria-controls=instant_invites-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/person_add.svg);
        }
        .sidebar_c25c6d [aria-controls=permissions-tab].item_a0:before {
            background-image: url(https://clearvision.github.io/icons/rule.svg);
        }
        .educationUpsell_b5926e {
            background-color: var(--popout-color);
        }
        .educationUpsellArrow_b5926e {
            border-bottom-color: rgba(0, 0, 0, .8);
        }
        .progressBarContainer_a4e2c3 .progressBar_a4e2c3 {
            background-color: rgba(255, 255, 255, .3);
        }
        .progressBarContainer_a4e2c3 .progressBar_a4e2c3+.text-xs-medium_d3e0f1 {
            color: rgba(255, 255, 255, .3) !important;
        }
        .progressBarContainer_a4e2c3 .progressBarCurrent_a4e2c3 {
            background-color: var(--main-color);
        }
        .progressBarContainer_a4e2c3 .progressBarCurrent_a4e2c3+.text-xs-medium_d3e0f1 {
            color: var(--main-color) !important;
        }
        .progressBarContainer_a4e2c3:hover .progressBar_a4e2c3 {
            background-color: var(--hover-color);
        }
        .anchor_af404b .text-sm-medium__726be {
            color: #fff !important;
        }
        .container_b5926e {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4)) !important;
            box-shadow: none;
        }
        .channelRow_a33fd3 {
            background-color: rgba(0, 0, 0, .4);
        }
        .channelRow_a33fd3:hover:not(.disabled_a33fd3) {
            background-color: rgba(255, 255, 255, .05);
        }
        .separator_a33fd3 {
            margin: -1px 0 0;
            background-color: rgba(255, 255, 255, .05);
        }
        .header_fe51c5, .channelList_fe51c5 {
            background-color: rgba(0, 0, 0, .4);
        }
        .container_eff583 {
            background-color: rgba(0, 0, 0, 0);
        }
        .header_fe51c5 .text-xs-bold__5467c {
            color: var(--main-color) !important;
        }
        .progressBar_dfa3ef {
            background-color: var(--main-color) !important;
        }
        .icon_eff583 path[fill="var(--background-accent)"] {
            fill: var(--danger-color);
        }
        .icon_eff583 path[fill="var(--brand-500)"] {
            fill: var(--success-color);
        }
        .chattableIndicator_fe51c5 {
            background-color: var(--main-color);
        }
        .channelCoverage_df2e1e {
            background-color: rgba(0, 0, 0, .4);
        }
        .coverageProgress_df2e1e {
            background-color: var(--main-color) !important;
        }
        .channelCoverageDetails_df2e1e {
            background-color: rgba(0, 0, 0, 0);
        }
        .channelPill_df2e1e {
            border-radius: 20px;
            background-color: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .addPrompt_df2e1e {
            border-color: rgba(255, 255, 255, .3);
        }
        .addPrompt_df2e1e .plusIcon_df2e1e {
            color: var(--main-color);
        }
        .addPrompt_df2e1e .text-md-medium_a84e09 {
            color: var(--main-color) !important;
        }
        .addPrompt_df2e1e:hover {
            border-color: var(--hover-color);
        }
        .addPrompt_df2e1e:hover .plusIcon_df2e1e {
            color: var(--hover-color);
        }
        .addPrompt_df2e1e:hover .text-md-medium_a84e09 {
            color: var(--hover-color) !important;
        }
        .container_a90bed {
            background-color: rgba(0, 0, 0, .4);
            border: 2px solid var(--main-color);
        }
        .example_a90bed {
            background-color: rgba(0, 0, 0, .4);
            border-radius: 20px;
            border: 2px solid var(--main-color);
        }
        .resultsListContainer_debb5a {
            background-color: var(--popout-color);
            border: 1px solid rgba(255, 255, 255, .07);
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .badExampleIcon_e88228 {
            background-color: var(--main-color);
            color: #fff;
        }
        .actionItem_e88228, .resourceChannel_e88228 {
            background-color: rgba(0, 0, 0, .4);
        }
        .actionItemEmojiWrapper_e88228 {
            background-color: var(--main-color);
            color: #fff;
        }
        .addActionItem_e88228 {
            border-color: rgba(255, 255, 255, .3);
            color: var(--main-color);
        }
        .addActionItem_e88228 .text-md-normal__6e567 {
            color: var(--main-color);
        }
        .addActionItem_e88228:hover {
            background-color: rgba(0, 0, 0, 0);
            border-color: var(--hover-color);
            color: var(--hover-color);
        }
        .addActionItem_e88228:hover .text-md-normal__6e567 {
            color: var(--hover-color);
        }
        .pillContainer_a18ec1 {
            background-color: rgba(0, 0, 0, .4);
        }
        .pillContainer_a18ec1 .text-sm-medium__726be {
            color: #fff;
        }
        .pillItemSelected_a18ec1 {
            background-color: var(--main-color);
        }
        .reviewHeader_addbba, .onboardingStepContainer_a85c10 {
            background-color: rgba(0, 0, 0, .4);
        }
        .iconContainer_a85c10 {
            background-color: var(--main-color);
        }
        .channelIcon_a85c10 {
            color: #fff;
        }
        .channelRow_fdea3f {
            background-color: rgba(0, 0, 0, .4);
        }
        .deprivateTableBody_ac8d32 {
            background-color: rgba(0, 0, 0, .4);
        }
        .selectableChannelRow_ac8d32:hover {
            background-color: var(--hover-color);
        }
        .suggestedChannels_e88228 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .container_dcd0fd {
            background-color: rgba(0, 0, 0, 0);
            border: none;
        }
        .container_dcd0fd:hover {
            background-color: var(--hover-color);
        }
        .searchRowLabel_debb5a {
            background-color: rgba(0, 0, 0, .4);
        }
        .searchRowLabel_debb5a:hover {
            background-color: rgba(255, 255, 255, .05);
        }
        .availabilityIndicator_b29edb {
            background-color: var(--main-color);
            color: #fff;
        }
        .container_cc7b67 {
            background-color: var(--main-color);
            color: #fff;
        }
        .container_cc7b67:hover {
            background-color: var(--hover-color);
        }
        .container_c18ec9 {
            background-color: rgba(255, 255, 255, .07);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
            margin: 2px;
        }
        .container_c18ec9:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .icon_cc7b67 {
            background-color: rgba(0, 0, 0, .6);
        }
        .roleRow_a930f1:before, .roleRow_a930f1:last-child:after {
            background-color: rgba(255, 255, 255, .1);
        }
        .roleRow_a930f1:hover:not(.roleRowDisableHover_a930f1) {
            background-color: rgba(255, 255, 255, .05);
        }
        .button_e258f5 .roleRow_a930f1:hover:not(.roleRowDisableHover_a930f1) {
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
        }
        .button_e258f5 .roleRow_a930f1:hover:not(.roleRowDisableHover_a930f1):hover {
            background-color: var(--hover-color);
            color: #fff;
        }
        .titleContainer_e87574 {
            background-color: rgba(0, 0, 0, 0);
        }
        .header_bd05f1 {
            background-color: rgba(0, 0, 0, 0);
        }
        .header_bd05f1:before {
            content: "";
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            z-index: -1;
            filter: grayscale(var(--background-grayscale)) sepia(var(--background-sepia)) invert(var(--background-invert)) brightness(var(--background-brightness)) contrast(var(--background-contrast)) saturate(var(--background-saturation)) blur(var(--background-blur));
        }
        .header_bd05f1:after {
            content: "";
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            z-index: -1;
            background: var(--background-overlay);
        }
        .list_e87574 .row_e87574:hover:not(.disabled_a0) {
            background-color: rgba(255, 255, 255, .07);
        }
        .list_e87574 .row_e87574 .roleCircle_a26d7b::before, .list_e87574 .row_e87574 .roleCircle_f9575e::before {
            background-color: rgba(0, 0, 0, 0);
        }
        .list_e87574 .row_e87574.selected_a0 {
            background-color: rgba(0, 0, 0, 0);
        }
        .list_e87574 .row_e87574.selected_a0 .roleCircle_a26d7b::before, .list_e87574 .row_e87574.selected_a0 .roleCircle_f9575e::before {
            background-color: inherit;
        }
        .previewContainer_bdfce3 {
            background-color: rgba(0, 0, 0, .6);
        }
        .container_cbadbc {
            background-color: rgba(0, 0, 0, .8);
        }
        .theme-dark .emojiRow_dc1809:before, .theme-dark .emojiRemove_dc1809 {
            background-color: rgba(0, 0, 0, .4);
        }
        .emojiRow_dc1809:hover .emojiAliasPlaceholder_dc1809 {
            visibility: hidden;
        }
        .emojiRow_dc1809 .emojiAliasInput_dc1809 .emojiInput_dc1809 {
            color: var(--text-normal);
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .emojiRow_dc1809 .emojiAliasInput_dc1809:has(.emojiInput_dc1809:focus-within)+.emojiAliasPlaceholder_dc1809 {
            visibility: hidden;
        }
        .wrapper_d864ab {
            background-color: rgba(0, 0, 0, .4);
        }
        .wrapper_d864ab:hover {
            background-color: var(--hover-color);
        }
        .tierLock_da77bd {
            color: #fff;
            opacity: .3;
        }
        .changelog_abe1fa, .safetyChecklist_abe1fa {
            background-color: rgba(0, 0, 0, .4);
        }
        .valuePill_e1b877 {
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid var(--main-color);
        }
        .simpleItemWrapper_e1b877 {
            background-color: rgba(0, 0, 0, 0);
        }
        .textBadge_a7a160 {
            border: none;
            padding: 4px 6px;
        }
        .editCard_cd99d3 {
            background-color: rgba(0, 0, 0, .4);
        }
        .ruleIconContainer_ea28e2 {
            background-color: var(--main-color);
        }
        .ruleIcon_ea28e2 {
            color: #fff;
        }
        .actionContainer_cec7a5 {
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid var(--main-color);
        }
        .actionIcon_cec7a5, .actionTextHeader_cec7a5 {
            color: #fff !important;
        }
        .stepCountIcon_df95ff {
            background-color: rgba(255, 255, 255, .1);
        }
        .stepperContainer_fa2661 {
            background-color: rgba(255, 255, 255, .1);
        }
        .stepperContainer_fa2661 .input_f8bc55:focus {
            box-shadow: none;
        }
        .mentionLimitContainer_fa2661, .keywordListContainer_f9f552, .actionContainer_b6e944 {
            background-color: rgba(0, 0, 0, .4);
        }
        .collapseable_a3cc4a {
            background-color: rgba(0, 0, 0, .4);
        }
        .collapseable_a3cc4a:active {
            background-color: rgba(0, 0, 0, .6);
        }
        .collapseable_a3cc4a.toggled_a3cc4a:active {
            background-color: rgba(0, 0, 0, .6);
        }
        .container_e5c5d5, .clickableContainer_e5c5d5, .pointer_f573e6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .groupCollapsedContainer_f573e6 {
            background-color: rgba(0, 0, 0, 0);
            border: none;
        }
        .backgroundModifierContainer_e5c5d5.selected_e5c5d5 {
            background-color: rgba(255, 255, 255, .07);
        }
        .keywordsTextArea_bdc518, .textArea_bd9c39 {
            color: var(--text-normal);
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .keywordsTextArea_bdc518:focus, .textArea_bd9c39:focus {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .keywordsTextArea_bdc518::placeholder, .textArea_bd9c39::placeholder {
            color: rgba(255, 255, 255, .3);
        }
        .resultsListContainer_debb5a {
            background-color: rgba(0, 0, 0, .8);
            border: 1px solid rgba(255, 255, 255, .07);
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
        .searchRowLabel_debb5a {
            background-color: rgba(255, 255, 255, .1);
        }
        .channelIcon_debb5a {
            color: #fff;
        }
        .theme-dark .auditLog_eebd33 {
            border-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .header_eebd33 {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .headerExpanded_eebd33, .theme-dark .divider_eebd33, .theme-dark .changeDetails_eebd33 {
            background-color: rgba(0, 0, 0, .6);
        }
        .scrollerContainer_c90ddb {
            background-color: rgba(0, 0, 0, .4);
        }
        .bannedUser_c90ddb {
            background-color: rgba(255, 255, 255, .07);
        }
        .descriptionBox_c38f8d {
            background-color: rgba(0, 0, 0, .4);
        }
        .upsellContainer_d0de76 {
            background-color: rgba(0, 0, 0, .4);
        }
        .upsellFooter_d0de76 {
            background-color: rgba(0, 0, 0, 0);
        }
        .contentRegion_c25c6d .testimonialHeroContainer_d3081b {
            background-color: rgba(0, 0, 0, 0);
        }
        .contentRegion_c25c6d .quotes_d3081b {
            color: var(--main-color);
        }
        .contentRegion_c25c6d .testimonial_d3081b .text-sm-medium__726be {
            color: #fff !important;
        }
        .contentRegion_c25c6d .upsellPreview_aa7c25 {
            background-color: rgba(0, 0, 0, .4);
        }
        .contentRegion_c25c6d .previewListItem_aa7c25 {
            background-color: rgba(0, 0, 0, 0);
        }
        .contentRegion_c25c6d .previewListItem_aa7c25.selected_aa7c25 {
            background-color: rgba(255, 255, 255, .07);
        }
        .contentRegion_c25c6d .checkboxCircle_aa7c25 {
            background-color: var(--main-color);
        }
        .contentRegion_c25c6d .checkbox_aa7c25.selected_aa7c25 {
            background-color: rgba(0, 0, 0, 0);
            border-color: var(--main-color);
        }
        .contentRegion_c25c6d .userCardInner_c69a7b {
            background-color: rgba(0, 0, 0, .4);
        }
        .contentRegion_c25c6d .userCardInner_c69a7b.userProfileInnerThemedPremiumWithoutBanner_c69a7b, .contentRegion_c25c6d .userCardInner_c69a7b.userProfileInnerThemedWithBanner_c69a7b {
            background-color: rgba(0, 0, 0, 0);
        }
        .contentRegion_c25c6d .action_e3f878 {
            background-color: rgba(0, 0, 0, .4);
        }
        .contentRegion_c25c6d .channelIconContainer_e3f878 {
            background-color: var(--main-color);
        }
        .contentRegion_c25c6d .channelIconContainer_e3f878 svg {
            color: #fff;
        }
        .analyticsCard_d4b8cc {
            background-color: rgba(0, 0, 0, .4);
        }
        .developerPortalCtaWrapper_cfaf72 {
            background-color: rgba(0, 0, 0, 0);
        }
        .notEnoughMembersError_cfaf72 {
            background-color: var(--info-warning-background);
        }
        .memberInsightsContainer_cfaf72 {
            background-color: rgba(0, 0, 0, 0);
        }
        .insightsActions_cfaf72 {
            background-color: rgba(0, 0, 0, 0);
        }
        .guildDetails_b1a8d5 {
            background-color: rgba(0, 0, 0, .4);
        }
        .featureCard_b1a8d5, .featureIcon_b1a8d5 {
            background-color: rgba(0, 0, 0, .4);
        }
        .checkboxWrapper_f6cde8.row_f6cde8 {
            background-color: rgba(0, 0, 0, 0);
        }
        .checkboxWrapper_f6cde8.row_f6cde8.checked_f6cde8 {
            background-color: rgba(0, 0, 0, 0);
        }
        .checklist_d6d7a8 {
            background-color: rgba(0, 0, 0, .4);
        }
        .checklist_d6d7a8 .header_bd2368 {
            background-color: rgba(0, 0, 0, .4);
        }
        .checklist_d6d7a8 .separator_bd2368 {
            background-color: rgba(255, 255, 255, .06);
        }
        .enableContainer_a1879c, .previewContainer_dcd39d {
            background-color: rgba(0, 0, 0, .4);
        }
        .editCircle_a1879c {
            background-color: var(--main-color);
            color: #fff;
        }
        .welcomeChannel_dcd39d {
            background-color: rgba(255, 255, 255, .05);
        }
        .channelIcon_dcd39d {
            background-color: rgba(0, 0, 0, 0);
        }
        .card_ea91d1 {
            background-color: rgba(0, 0, 0, .4);
        }
        .howItWorksContainer_aa72d6, .howItWorksImageContainer_aa72d6 {
            background-color: rgba(0, 0, 0, 0);
        }
        .earningsPreviewContainer_da92c3, .avatarCard_da92c3 {
            background-color: rgba(255, 255, 255, .07) !important;
        }
        .emojisContainer_adff39 {
            background-color: rgba(0, 0, 0, 0);
        }
        .viewServerButton_adff39 {
            background-color: var(--main-color);
        }
        .theme-dark .background_a4fd01 {
            color: rgba(0, 0, 0, .4);
        }
        .theme-dark .tierInProgress_a4fd01 {
            background-color: rgba(0, 0, 0, .4);
            border: 3px solid #f47fff;
        }
        .theme-dark .tierHeaderLocked_da77bd, .theme-dark .tierHeaderUnlocked_da77bd, .theme-dark .tierBody_da77bd {
            background-color: rgba(0, 0, 0, .4);
        }
        .standardSidebarView_c25c6d {
            background: rgba(0, 0, 0, 0);
        }
        .sidebarRegion_c25c6d .sidebarRegionScroller_c25c6d {
            margin: 30px 8px 30px 0;
            background: rgba(0, 0, 0, 0);
            -webkit-mask-image: linear-gradient(to bottom,  transparent,  #000 5%,  #000 95%,  transparent);
            mask-image: linear-gradient(to bottom,  transparent,  #000 5%,  #000 95%,  transparent);
        }
        .sidebarRegion_c25c6d .sidebarRegionScroller_c25c6d::-webkit-scrollbar {
            width: 0 !important;
        }
        .sidebar_c25c6d {
            height: 100%;
            width: 260px;
            padding: 0px 6px 0px 20px;
        }
        .sidebar_c25c6d .header_a0 {
            color: var(--main-color);
            font-weight: 700;
            padding-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sidebar_c25c6d .header_a0:before {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to left,  var(--main-color) 50%,  transparent);
            margin-right: 5px;
        }
        .sidebar_c25c6d .header_a0:after {
            content: "";
            height: 2px;
            flex-grow: 1;
            background: linear-gradient(to right,  var(--main-color) 50%,  transparent);
            margin-left: 5px;
        }
        .sidebar_c25c6d .header_a0>span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .separator_a0 {
            background: rgba(255, 255, 255, .07);
        }
        .separator_a0:has(+.header_a0) {
            display: none;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0 {
            position: relative;
            padding: 8px 20px;
            color: var(--channel-color);
            margin: 0;
            background: rgba(0, 0, 0, 0);
            transition: all .15s ease-in-out;
            cursor: pointer;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0:before {
            opacity: .4;
            transition: inherit;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0:after {
            content: "";
            position: absolute;
            top: 0;
            right: 100%;
            bottom: 0;
            left: 0;
            opacity: .9;
            transition: all .3s ease-in-out;
            z-index: -1;
            pointer-events: none;
            border-radius: 4px;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0:hover {
            background: rgba(255, 255, 255, .07);
            color: rgba(255, 255, 255, .7);
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0:hover:before {
            opacity: .7;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0.selected_a0:before {
            opacity: 1;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0.selected_a0:after {
            right: 0;
            background: var(--main-color);
            animation: cv-channel-select .3s ease-in-out;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0.selected_a0 {
            background: rgba(0, 0, 0, 0);
            color: #fff;
            transition: all .15s ease-in-out, background .3s .2s;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0.selected_a0 .selectedBackground_ae3c77 {
            background-color: rgba(0, 0, 0, 0);
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 .item_a0 .text-md-normal__6e567 {
            color: #fff !important;
        }
        .standardSidebarView_c25c6d .sidebar_c25c6d .side_a0 [aria-selected=true].serverBoostTabItem_f7189e {
            background-color: var(--main-color) !important;
        }
        .socialLinks_c44e94 .link_c44e94 {
            color: rgba(255, 255, 255, .4);
        }
        .socialLinks_c44e94 .link_c44e94:hover {
            color: rgba(255, 255, 255, .7);
        }
        .accountProfileCard_b69b77 {
            background-color: rgba(0, 0, 0, .4);
        }
        .background_b69b77, .fieldList_b69b77 {
            background-color: rgba(0, 0, 0, 0);
        }
        .avatar_b69b77 {
            background: rgba(0, 0, 0, 0);
            border-color: rgba(0, 0, 0, 0);
        }
        .badgeList_b69b77 {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.4));
        }
        .phoneField_d4eb58 {
            background-color: rgba(255, 255, 255, .07);
            border: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .09);
        }
        .phoneField_d4eb58:focus-within {
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .phoneField_d4eb58 .inputField_d4eb58 {
            background-color: rgba(0, 0, 0, 0);
        }
        .optionBox_f2f431 {
            background-color: rgba(0, 0, 0, 0);
        }
        .contentCircle_f2f431 {
            background-color: var(--main-color);
            border: 2px solid var(--main-color);
        }
        .uploadIcon_f2f431 {
            padding: 0;
        }
        .gifIconContainer_f2f431 {
            background-color: var(--main-color);
        }
        .editingContainer_ba5b9e {
            background-color: rgba(0, 0, 0, 0);
        }
        .decorationGridItem_b35b54 {
            background-color: rgba(255, 255, 255, .05);
        }
        .decorationGridItem_b35b54:hover {
            background-color: rgba(255, 255, 255, .07);
        }
        .decorationGridItem_b35b54.selected_b35b54 {
            box-shadow: inset 0 0 0 2px var(--main-color);
        }
        .iconBadge_b35b54 {
            background-color: var(--main-color) !important;
        }
        .decorationPreview_aba31b, .smallDecorationPreviewsContainer_aba31b {
            background-color: rgba(255, 255, 255, .05);
        }
        .shopPreviewContainer_aba31b {
            background: rgba(0, 0, 0, 0);
            border: 2px solid var(--premium-tier-2-purple-for-gradients-2);
        }
        .effectGridItem_c80296 {
            background-color: rgba(255, 255, 255, .05);
        }
        .effectGridItem_c80296:hover {
            background-color: rgba(255, 255, 255, .07);
        }
        .effectGridItem_c80296.selected_c80296 {
            box-shadow: inset 0 0 0 2px var(--main-color);
        }
        .effectDescriptionNoGradient_a9d381, .effectDescriptionBorderWithGradient_a9d381, .effectDescriptionContainer_a9d381 {
            background: rgba(0, 0, 0, 0);
        }
        .effectDescriptionBorderWithGradient_a9d381 {
            border: 2px solid var(--premium-tier-2-purple-for-gradients-2);
        }
        .lockBadge_c80296 {
            background-color: var(--main-color) !important;
        }
        .premiumFeatureBorder_c6d722 {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--premium-tier-2-purple-for-gradients-2);
        }
        .premiumBackground_c6d722 {
            background: rgba(0, 0, 0, 0);
        }
        .upsellOverlayContainer_eb49af {
            background: rgba(0, 0, 0, .4);
            border: 2px solid var(--premium-tier-2-purple-for-gradients-2);
        }
        .theme-dark .upsellOverlay_eb49af {
            background: rgba(0, 0, 0, .4);
        }
        .theme-dark .container_f7ea1b.card_a298b8 {
            background-color: rgba(0, 0, 0, 0);
        }
        .avatarBackground_bb882a {
            background-color: rgba(0, 0, 0, 0);
        }
        .line_f7ea1b, .marker_f7ea1b {
            background-color: rgba(255, 255, 255, .1);
        }
        .marker_f7ea1b .empty_f7ea1b {
            background-color: rgba(255, 255, 255, .1);
        }
        .marker_f7ea1b svg circle {
            fill: #fff;
        }
        .container_b01337, .container_d7c696, .container_a2e886, .box_f70f48 {
            background-color: rgba(0, 0, 0, .4);
        }
        .circle_d7c696, .iconContainer_e677b7 {
            background-color: rgba(0, 0, 0, 0);
        }
        .row_e677b7 {
            background-color: rgba(255, 255, 255, .07);
        }
        .sessionIcon_c7a2c0 {
            background-color: var(--main-color);
            color: #fff;
        }
        .connectContainer_e2a436 {
            background-color: rgba(0, 0, 0, .4);
            border-color: rgba(255, 255, 255, .07);
        }
        .accountButtonInner_e2a436, .accountBtnInner_ec99f9 {
            background-color: rgba(255, 255, 255, .05);
        }
        .accountButtonInner_e2a436:hover, .accountBtnInner_ec99f9:hover {
            background-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .defaultIndicator_ede133 {
            background-color: var(--main-color);
        }
        .theme-dark .paymentPane_f66684, .theme-dark .paginator_f66684 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .bottomDivider_f66684 {
            border-color: rgba(0, 0, 0, .07);
        }
        .theme-dark .hoverablePayment_a28a08:hover {
            background-color: rgba(255, 255, 255, .05);
        }
        .theme-dark .payment_a28a08 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .payment_a28a08:not(.hoverablePayment_a28a08) {
            background-color: rgba(0, 0, 0, .4);
        }
        .theme-dark .expandedInfo_a28a08 {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .theme-dark .description_ede133, .theme-dark .descriptionWrapper_ede133 {
            color: #fff;
        }
        .perkCard_d611db {
            background-color: rgba(0, 0, 0, .4);
        }
        .giftCard_cf74b3 {
            background: rgba(0, 0, 0, .4);
        }
        .theme-dark .expandedProgressBarContainerSettingsPage_c88bb1 {
            background: rgba(0, 0, 0, .4);
            backdrop-filter: none;
        }
        .theme-dark :is(.noItemsIcon_a206c7, .noItemsIcon_e70817) {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark :is(.noItemsIcon_a206c7, .noItemsIcon_e70817)>g>:is(path, rect, circle) {
            fill-opacity: .8 !important;
            stroke-opacity: .8 !important;
        }
        .detailsBlock_a206c7 {
            background-color: rgba(0, 0, 0, .4);
        }
        .premiumSubscriptionAccountCredit_ca73a1 {
            background-color: rgba(0, 0, 0, .4);
        }
        .promotionCard_e8af36 {
            background-color: rgba(0, 0, 0, .4);
        }
        .copyInput_f549fd {
            background-color: rgba(255, 255, 255, .07);
        }
        .theme-dark .outerContainer_d7df05 {
            background-color: rgba(0, 0, 0, .4);
        }
        .gridProgressBar_d7df05 {
            color: var(--main-color) !important;
        }
        .wave_e74e54 {
            fill: rgba(0, 0, 0, .6);
        }
        .appliedBoostContainer_dba803 {
            background-color: rgba(0, 0, 0, 0);
        }
        .guildContainer_e0d799, .boostContainer_dba803, .wrapper_d4ec61, .boosterRecognitionCard_eaedb7, .faq_eaedb7 {
            background-color: rgba(0, 0, 0, .4);
        }
        .selectSearch_ac4952 {
            background-color: rgba(255, 255, 255, .07);
        }
        .selectGuildPseudoCta_ac4952 {
            background-color: var(--main-color);
        }
        .selectionCircle_cb7c27 {
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            box-shadow: inset 0 0 0 2px var(--main-color);
            top: -1px;
            left: -1px;
        }
        .checkmark_cb7c27 {
            color: var(--main-color);
        }
        .previewMessage_c31d36 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .micTest_e75a73 .container_e5cdf3 {
            background: var(--main-color) !important;
            mask-image: url("data:image/svg+xml;
            charset=utf-8, %3Csvg xmlns='http: //www.w3.org/2000/svg' width='8' height='20' fill='yellow'%3E%3Cpath fill-rule='evenodd' d='M 4 2 C 2.895 2 2 2.895 2 4 L 2 16 C 2 17.54 3.667 18.502 5 17.732 C 5.619 17.375 6 16.715 6 16 L 6 4 C 6 2.895 5.105 2 4 2 Z'/%3E%3C/svg%3E");
            -webkit-mask-image: url("data:image/svg+xml;
            charset=utf-8, %3Csvg xmlns='http: //www.w3.org/2000/svg' width='8' height='20' fill='yellow'%3E%3Cpath fill-rule='evenodd' d='M 4 2 C 2.895 2 2 2.895 2 4 L 2 16 C 2 17.54 3.667 18.502 5 17.732 C 5.619 17.375 6 16.715 6 16 L 6 4 C 6 2.895 5.105 2 4 2 Z'/%3E%3C/svg%3E");
        }
        .theme-dark .micTest_e75a73 .progress_e5cdf3 {
            background-color: rgba(0, 0, 0, .7);
        }
        .theme-dark .micTest_e75a73 .notches_e5cdf3 rect {
            fill: none;
        }
        .soundButtonSettingContainer_c801bb {
            background-color: rgba(255, 255, 255, .1);
        }
        .cameraWrapper_ff1ac9 {
            background-color: rgba(0, 0, 0, .7);
            border-color: rgba(255, 255, 255, .07);
        }
        .backgroundOption_ad7d79 {
            background-color: rgba(0, 0, 0, .7);
        }
        .backgroundOptionRing_ad7d79 {
            border: 2px solid var(--main-color);
        }
        .backgroundOptionInner_ad7d79 {
            background-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .nowPlaying_fd966d {
            background-color: rgba(67, 181, 129, .6);
        }
        .wrapper_d2da9c {
            border-color: var(--main-color);
        }
        .option_d2da9c {
            background-color: rgba(255, 255, 255, .05);
            opacity: 1;
        }
        .option_d2da9c:hover {
            background-color: rgba(255, 255, 255, .07);
            opacity: 1;
        }
        .option_d2da9c.selected_d2da9c {
            background-color: var(--main-color);
            border-color: var(--main-color);
        }
        .theme-dark .container_c67e31 {
            background-color: rgba(255, 255, 255, .05);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, .07);
            border-color: rgba(0, 0, 0, 0);
        }
        .theme-dark .container_c67e31:not(.containerDisabled_ebcd80):hover {
            border-color: rgba(0, 0, 0, 0);
            box-shadow: 0 0 2px 2px var(--main-color);
        }
        .theme-dark .container_c67e31.recording_ebcd80 {
            color: #fff;
            box-shadow: 0 0 2px 2px var(--main-color);
            animation: cv-shadow-pulse 1s ease-in infinite;
        }
        .theme-dark .notDetected_fd966d {
            background-color: rgba(0, 0, 0, .4);
            border: rgba(255, 255, 255, .07);
        }
        .theme-dark .addGamePopout_fd966d {
            background-color: rgba(0, 0, 0, .7);
        }
        .theme-dark .game_fd966d {
            box-shadow: 0 1px 0 0 rgba(255, 255, 255, .04);
        }
        .theme-dark .gameNameInput_fd966d:hover, .theme-dark .gameNameInput_fd966d:focus {
            background-color: rgba(255, 255, 255, .05);
            border: rgba(255, 255, 255, .07);
        }
        .activityUserPopoutV2_d5089b .nameNormal_d5089b, .activityProfileV2_d5089b .nameNormal_d5089b {
            color: var(--main-color);
            text-shadow: 0 0 5px rgba(0, 0, 0, .5);
            font-weight: 600;
        }
        .activityUserPopoutV2_d5089b .nameNormal_d5089b>.activityName_d5089b, .activityProfileV2_d5089b .nameNormal_d5089b>.activityName_d5089b {
            color: inherit;
        }
        .activityUserPopoutV2_d5089b .nameNormal_d5089b>.activityName_d5089b.bodyLink_d5089b:hover, .activityProfileV2_d5089b .nameNormal_d5089b>.activityName_d5089b.bodyLink_d5089b:hover {
            text-shadow: 0 0 5px rgba(0, 0, 0, .5), 0 0 1px;
        }
        .activityUserPopoutV2_d5089b .timestamp_d5089b, .activityProfileV2_d5089b .timestamp_d5089b {
            font-style: italic;
        }
        .activityUserPopoutV2_d5089b .bodyLink_d5089b, .activityProfileV2_d5089b .bodyLink_d5089b {
            transition: all .1s ease-in-out;
        }
        .activityUserPopoutV2_d5089b .bodyLink_d5089b:hover, .activityProfileV2_d5089b .bodyLink_d5089b:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        .mask_c51b4e {
            filter: drop-shadow(0 0 5px rgba(0,  0,  0,  0.5));
        }
        .botTag_a02df3 {
            padding: 1px 2px;
            background: rgba(255, 255, 255, .1);
            color: rgba(255, 255, 255, .6);
            font-weight: 700;
            text-shadow: 0 0 1px rgba(0, 0, 0, .3);
            border-radius: 3px;
        }
        .botTagInvert_a02df3 {
            padding: 2px 3px;
            background: rgba(0, 0, 0, .3);
            color: rgba(255, 255, 255, .8);
        }
        .member_cbd271 .botTag_a02df3 {
            transition: all .15s ease-in-out;
        }
        .role_e4010c, .role_f9575e {
            position: relative;
            display: flex;
            flex-direction: row-reverse;
            border-radius: 3px;
            transition: all .1s ease-in-out;
            background-color: rgba(0, 0, 0, 0);
            border-color: rgba(0, 0, 0, 0);
            cursor: default;
        }
        .role_e4010c>.roleName_e4010c, .role_f9575e>.roleName_e4010c, .role_e4010c>.roleName_f9575e, .role_f9575e>.roleName_f9575e {
            margin-right: 0;
            margin-left: 4px;
            color: rgba(255, 255, 255, .9);
            transition: all .1s ease-in-out;
        }
        .role_e4010c:hover .roleCircle_a26d7b:before, .role_f9575e:hover .roleCircle_a26d7b:before, .role_e4010c:hover .roleCircle_f9575e:before, .role_f9575e:hover .roleCircle_f9575e:before {
            opacity: .3;
        }
        .role_e4010c:hover>.roleName_e4010c, .role_f9575e:hover>.roleName_e4010c, .role_e4010c:hover>.roleName_f9575e, .role_f9575e:hover>.roleName_f9575e {
            color: #fff;
        }
        .roleRemoveButton_e4010c, .roleRemoveButton_f9575e {
            position: static;
        }
        .roleRemoveIcon_e4010c>path, .roleRemoveIcon_f9575e>path {
            margin-left: 2px;
            fill: #fff;
        }
        .roleRemoveIcon_e4010c, .roleRemoveIcon_f9575e {
            left: calc(100% - 7px);
        }
        .role_e4010c .roleCircle_a26d7b, .role_f9575e .roleCircle_a26d7b, .role_e4010c .roleCircle_f9575e, .role_f9575e .roleCircle_f9575e {
            width: 0 !important;
            height: 0 !important;
        }
        .role_e4010c .roleCircle_a26d7b:not(:empty), .role_f9575e .roleCircle_a26d7b:not(:empty), .role_e4010c .roleCircle_f9575e:not(:empty), .role_f9575e .roleCircle_f9575e:not(:empty) {
            margin-left: 6px;
        }
        .role_e4010c .roleCircle_a26d7b:before, .role_f9575e .roleCircle_a26d7b:before, .role_e4010c .roleCircle_f9575e:before, .role_f9575e .roleCircle_f9575e:before {
            content: "";
            border-radius: 3px;
            position: absolute;
            top: -1px;
            right: -1px;
            bottom: -1px;
            left: -1px;
            background: inherit;
            opacity: .2;
            transition: all .1s ease-in-out;
            pointer-events: none;
        }
        .addButton_e4010c, .button_edead5 {
            background: rgba(255, 255, 255, .1);
            transition: all .1s ease-in-out;
            cursor: pointer;
        }
        .addButton_e4010c>svg, .button_edead5>svg {
            width: 7px;
            height: 7px;
            color: rgba(255, 255, 255, .5);
            transition: inherit;
        }
        .addButton_e4010c:hover, .button_edead5:hover {
            background: rgba(255, 255, 255, .2);
        }
        .addButton_e4010c:hover>svg, .button_edead5:hover>svg {
            color: #fff;
        }
        .container_ac201b {
            background-color: rgba(0, 0, 0, .8);
            border: none;
        }
        [style*="rgb(128,  132,  142)"].status_c7d26b {
            background-color: var(--offline-color) !important;
        }
        [style*="rgb(35,  165,  90)"].status_c7d26b {
            background-color: var(--online-color) !important;
        }
        [style*="rgb(240,  178,  50)"].status_c7d26b {
            background-color: var(--idle-color) !important;
        }
        [style*="rgb(242,  63,  67)"].status_c7d26b {
            background-color: var(--dnd-color) !important;
        }
        [style*="rgb(89,  54,  149)"].status_c7d26b {
            background-color: var(--streaming-color) !important;
        }
        :is(.cursorDefault_c51b4e, .mask_c51b4e, .statusDot_ab876d) rect[fill*="#80848e"] {
            fill: var(--offline-color);
        }
        :is(.cursorDefault_c51b4e, .mask_c51b4e, .statusDot_ab876d) rect[fill*="#23a55a"] {
            fill: var(--online-color);
        }
        :is(.cursorDefault_c51b4e, .mask_c51b4e, .statusDot_ab876d) rect[fill*="#f0b232"] {
            fill: var(--idle-color);
        }
        :is(.cursorDefault_c51b4e, .mask_c51b4e, .statusDot_ab876d) rect[fill*="#f23f43"] {
            fill: var(--dnd-color);
        }
        :is(.cursorDefault_c51b4e, .mask_c51b4e, .statusDot_ab876d) rect[fill*="#593695"] {
            fill: var(--streaming-color);
        }
        .shiki-plain {
            background-color: rgba(0,  0,  0,  calc(var(--background-shading) * 0.2)) !important;
        }
        .shiki-container {
            background: rgba(0, 0, 0, .2) !important;
        }
        .shiki-btn {
            background-color: var(--main-color) !important;
            border-radius: 4px !important;
            right: 4px !important;
            bottom: 4px !important;
        }
        .shiki-btn:hover {
            background-color: var(--hover-color) !important;
            transition: ease-in-out .2s;
        }
        .theme-dark #vc-spotify-player {
            background: rgba(0, 0, 0, 0);
        }
        #vc-spotify-player {
            border-top: 1px solid var(--background-modifier-accent);
        }
        #vc-spotify-player:hover [class^=barFill__] {
            background-color: var(--hover-color);
            border-color: var(--hover-color);
            color: var(--hover-color);
        }
        #vc-spotify-progress-bar:hover>[class^=slider] [class^=grabber] {
            background-color: var(--hover-color);
            border-color: var(--hover-color);
            color: var(--hover-color);
        }
        #vc-spotify-progress-bar>[class^=slider] [class^=grabber] {
            background-color: var(--main-color);
            border-color: var(--main-color);
            color: var(--main-color);
            margin-top: 5px;
        }
        .shc-lock-screen-allowed-users-and-roles-container {
            background-color: rgba(0, 0, 0, .8);
        }
        .shc-lock-screen-allowed-users-and-roles-container button {
            background: var(--main-color);
            color: #fff;
            border-radius: 10px;
        }
        .shc-lock-screen-allowed-users-and-roles-container button:hover {
            background: var(--hover-color);
            color: #fff;
            border-radius: 10px;
        }
        .shc-lock-screen-container {
            background: rgba(0, 0, 0, 0);
        }
        .shc-lock-screen-allowed-users-and-roles-container .role_deddac {
            position: relative;
            background-color: rgba(0, 0, 0, 0);
        }
        .shc-lock-screen-allowed-users-and-roles-container .role_deddac .roleColor_deddac {
            z-index: 10;
        }
        .topicsPillContainer__2c107 {
            background: rgba(0, 0, 0, .6);
        }
        .topicsPillContainer__2c107:hover {
            background: rgba(0, 0, 0, .8);
        }
        .newTopicsBarContainer__8c1e3 {
            background-color: var(--main-color);
            opacity: .5;
        }
        .topicsPillCaret__46c3b {
            background: var(--main-color);
            color: #fff;
        }
        .topicsPillCaret__46c3b:hover {
            background: var(--hover-color);
            color: #fff;
        }
        .topicsPillTextSelected__717ea {
            background: rgba(0, 0, 0, .8);
        }
        .topicsDropdownHeading__6fa9b {
            background: rgba(0, 0, 0, .8);
        }
        .topicsScroller__64e73 {
            background: rgba(0, 0, 0, .8);
        }
        .container_df5675:hover {
            background: rgba(0, 0, 0, .8);
        }
        .thumbIcon__954fb {
            color: #fff;
            background: var(--main-color);
        }
        .summaryFeedbackWrapper_a4b82f {
            display: none;
        }
        .summaryEndIcon__71ddc {
            color: var(--main-color);
            background: rgba(0, 0, 0, 0);
            margin-right: 93.5%;
            width: 2.5rem;
            height: 3rem;
            font-weight: 900;
            margin-top: auto;
            margin-bottom: auto;
        }
        .summaryStartIcon_f4a16a {
            color: var(--main-color);
            width: 2.5rem;
            height: 3rem;
            font-weight: 900;
            margin-left: 42px;
        }
        .vc-addon-card {
            background: var(--background-overlay);
            border: 2px solid var(--main-color);
        }
        .vc-addon-card:hover {
            background: var(--background-overlay);
            border: 2px solid var(--hover-color);
        }
        .vc-plugins-info-button svg:not(:hover, :focus) {
            color: #fff;
        }
        .vc-notification-root {
            background-color: rgba(0, 0, 0, .8);
        }
        .vc-notification-root:hover {
            background-color: var(--hover-color);
        }
        .vc-author-modal-name {
            background: rgba(0, 0, 0, .4);
        }
        .vc-author-modal-name:before {
            background: rgba(0, 0, 0, .4);
        }
        .sidebar_c25c6d .vc-settings.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/vencord.svg);
        }
        .sidebar_c25c6d .vc-plugins.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/puzzle.svg);
        }
        .sidebar_c25c6d .vc-themes.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/palette.svg);
        }
        .sidebar_c25c6d .vc-updater.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/sync.svg);
        }
        .sidebar_c25c6d .vc-cloud.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/cloud_sync.svg);
        }
        .sidebar_c25c6d .vc-backup-restore.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/file_archive.svg);
        }
        .replugged-addon-card {
            background: var(--background-overlay);
        }
        .wrapper_ce1c1d {
            background: var(--background-overlay);
            border: 2px solid var(--main-color);
        }
        .bd-select, .bd-select.menu-open {
            background-color: rgba(0, 0, 0, .5);
        }
        .bd-switch input:checked+.bd-switch-body {
            --switch-color:  $main-color;
        }
        .bd-transparency {
            background: rgba(0, 0, 0, 0) !important;
        }
        .bd-search-wrapper {
            background-color: rgba(0, 0, 0, .4) !important;
        }
        .bd-select .bd-select-options {
            background-color: rgba(0, 0, 0, .4) !important;
            border: hidden !important;
        }
        .bd-select .bd-select-option:hover {
            background-color: rgba(255, 255, 255, .1) !important;
        }
        .bd-select .bd-select-option.selected {
            background-color: var(--main-color) !important;
        }
        .bd-settings-group.collapsible .bd-settings-title::before {
            background-color: var(--interactive-normal);
        }
        .bd-addon-list .bd-addon-card {
            background-color: rgba(0, 0, 0, .4) !important;
        }
        .bd-addon-list .bd-addon-header {
            background-color: rgba(0, 0, 0, .8);
        }
        .bd-button-filled.bd-button-color-brand, .bd-button {
            background-color: var(--main-color);
        }
        .bd-button-filled.bd-button-color-brand:hover, .bd-button:hover {
            background-color: var(--hover-color);
        }
        .bd-button-filled.bd-button-color-brand:active, .bd-button:active {
            background-color: var(--main-color);
        }
        .bd-button.bd-button-icon svg {
            fill: #fff;
        }
        .bd-addon-views .bd-view-button.selected {
            background-color: var(--main-color);
        }
        .bd-switch input:checked+.bd-switch-body {
            background-color: var(--main-color) !important;
        }
        .bd-switch-body {
            background-color: rgba(255, 255, 255, .15) !important;
        }
        .bd-switch-symbol {
            color: var(--main-color) !important;
        }
        .bd-toast {
            background-color: var(--main-color);
        }
        .bd-toast.toast-info {
            background-color: var(--main-color);
        }
        .bd-toast.toast-success {
            background-color: var(--main-color);
        }
        .bd-changelog-modal .bd-modal-content a, .bd-link {
            color: var(--url-color);
        }
        .bd-settings-title {
            color: #fff;
        }
        #bd-customcss-detach-container {
            background-color: rgba(0, 0, 0, 0);
        }
        #bd-editor-controls {
            background: var(--background-overlay);
        }
        .sidebar_c25c6d .bd-settings-tab.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/betterdiscord.svg);
        }
        .sidebar_c25c6d .bd-updates-tab.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/sync.svg);
        }
        .sidebar_c25c6d .bd-customcss-tab.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/code_braces.svg);
        }
        .sidebar_c25c6d .bd-plugins-tab.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/puzzle.svg);
        }
        .sidebar_c25c6d .bd-themes-tab.item_a0:before {
            background-image: url(https://clearvision.github.io/icons/palette.svg);
        }
        .bd-modal-root {
            background-color: var(--background-overlay);
        }
        .bd-modal-root .bd-modal-footer, .bd-modal-root .bd-modal-header {
            background-color: rgba(0, 0, 0, 0);
            box-shadow: none;
        }
        div#magane div.stickerWindow {
            border: 2px solid var(--main-color);
        }
        div#magane div.stickerWindow div.stickers h3.getStarted {
            color: #fff;
        }
        div#magane div.stickerWindow:not(:has(>[style^=display])) div.stickers *, div#magane div.stickerWindow:not(:has(>[style^=display])) div.packs-toolbar * {
            display: none;
        }
        div#magane .stickersModal .modal-content, div#magane .stickersModal .modal-card {
            background: rgba(0, 0, 0, 0);
        }
        div#magane .stickersModal .inputQuery {
            background: rgba(0, 0, 0, .2);
            border: 2px solid var(--main-color);
        }
        div#magane .button {
            background: var(--main-color);
            color: #fff;
        }
        div#magane div.stickerWindow:before {
            content: "";
            position: absolute;
            z-index: -999;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: var(--user-popout-image) var(--user-popout-position)/var(--user-popout-size) var(--user-popout-repeat) var(--user-popout-attachment);
            filter: grayscale(var(--user-popout-grayscale)) sepia(var(--user-popout-sepia)) invert(var(--user-popout-invert)) brightness(var(--user-popout-brightness)) contrast(var(--user-popout-contrast)) saturate(var(--user-popout-saturation)) blur(var(--user-popout-blur));
        }
        div#magane div.stickerWindow div.stickers, div#magane div.stickerWindow div.packs-toolbar {
            background: var(--background-overlay);
        }
        .replyer, .btn-quote, .citar-btn {
            background-color: rgba(0, 0, 0, .4) !important;
            border-radius: 3px;
            transition: background-color .3s ease-in-out;
        }
        .replyer:hover, .btn-quote:hover, .citar-btn:hover {
            background-color: var(--main-color) !important;
        }
        #pluginNotice #outdatedPlugins span {
            color: #fff;
            transition: all .1s ease-in-out;
        }
        #pluginNotice #outdatedPlugins span:hover {
            text-shadow: 0 0 1px;
            text-decoration: none !important;
        }
        #MemberCount {
            background: rgba(0, 0, 0, 0);
        }
        #MemberCount h3 {
            color: var(--text-normal);
            padding: 12px 0;
            flex-direction: column;
            font-size: 11px;
            font-weight: 600;
            text-align: center;
        }
        #MemberCount .membersGroup_cbd271:before, #MemberCount .membersGroup_cbd271:after {
            display: none;
        }
        #MemberCount .membercount-row {
            width: var(--members-width);
        }
        .hasCounter.membersWrap_cbd271 .members_cbd271 {
            padding-top: 30px;
            margin-top: 0;
        }
        .members_cbd271 .membersGroup_cbd271:has(.membercount-row) {
            opacity: 1;
        }
        .hljs .copybutton {
            background: rgba(255, 255, 255, .1) !important;
            color: rgba(255, 255, 255, .7) !important;
            border: none !important;
            border-top-left-radius: 3px;
            opacity: 0;
            transition: all .3s ease-in-out;
            user-select: none;
        }
        .hljs .copybutton:hover {
            color: #fff !important;
        }
        .hljs .copybutton:active {
            color: var(--main-color) !important;
        }
        .hljs:hover .copybutton {
            opacity: 1;
        }
        .hljs>.kawaii-linenumbers {
            list-style: none;
            counter-reset: linenumbers;
            border-left: 2.6ch solid rgba(255, 255, 255, .04);
            margin: -6px;
            padding: 6px;
        }
        .hljs>.kawaii-linenumbers>li {
            text-indent: -3ch;
            margin-left: 0;
            padding: 0;
            border: none;
        }
        .hljs>.kawaii-linenumbers>li:before {
            content: counter(linenumbers);
            counter-increment: linenumbers;
            color: rgba(255, 255, 255, .3);
            display: inline-block;
            width: 2ch;
            margin-right: .5ch;
            padding-right: .5ch;
            text-align: right;
            overflow: hidden;
            vertical-align: top;
            user-select: none;
        }
        .BE-badge {
            filter: drop-shadow(0 0 3px rgba(0,  0,  0,  0.7));
        }
        .creationDate, .joinedAtDate, .lastMessageDate {
            font-size: 10px;
            margin-bottom: -2px;
        }
        .theme-dark .avatarWrapper_b2ca13:has(+div>button:nth-child(4)) {
            min-width: 0px !important;
        }
        .owner-tag {
            color: rgba(255, 255, 255, .6);
        }
        .owner-tag[style*=background] {
            color: #fff;
        }
        .BE-badges+.owner-tag {
            margin-left: 0;
        }
        .BDFDB-tooltip>.tooltipTop_b6c360 {
            position: relative;
            margin-top: -36px;
        }
        .BDFDB-tooltip>.tooltipRight_b6c360 {
            position: relative;
            margin-left: 10px;
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
    name: "Ventaker",
    description: "Plugin that changes your Discord background to one from Walltaker",
    authors: [{ name: "Lumi", id: 633026209479000065n }],
    settings,
    startAt: StartAt.DOMContentLoaded,
    async start() {
        console.log("Plugin loaded with settings:", settings);
        const { link } = settings.store;
        const { intervalRate } = settings.store;
        startBackgroundUpdate(link, intervalRate);
        applyStyles(settings);
    }
});
