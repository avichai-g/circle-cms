"use client";

import React, { useState, useEffect } from "react";
import styles from "../../ui/pixel/pixels.module.css";

export default function PixelsPage() {
  const [siteId, setSiteId] = useState("");
  const [pixelScript, setPixelScript] = useState("");

  useEffect(() => {
    const storedSiteId = localStorage.getItem("siteId");
    if (storedSiteId) {
      setSiteId(storedSiteId);
    }
  }, []);

  const generatePixel = () => {
    if (!siteId) {
      alert("Site ID not found. Please make sure you're logged in.");
      return;
    }

    const script = `
<script>
(function() {
  const pixelConfig = {
    siteId: "${siteId}",
    pixelApiUrl: "https://circle-pixel-project.vercel.app/api/pixel"
  };

  function injectPixel() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = \`\${pixelConfig.pixelApiUrl}?siteId=\${encodeURIComponent(
      pixelConfig.siteId
    )}&path=\${encodeURIComponent(
      window.location.pathname + window.location.search
    )}\`;

    // Add a custom attribute to identify our script
    script.setAttribute('data-pixel-id', pixelConfig.siteId);

    // Remove only our existing pixel script
    const existingScript = document.querySelector(
      \`script[data-pixel-id="\${pixelConfig.siteId}"]\`
    );
    if (existingScript) {
      existingScript.remove();
    }

    document.body.appendChild(script);
  }

  function setupPixelInjection() {
    // Initial injection
    injectPixel();

    // Set up navigation event listeners
    window.addEventListener("popstate", injectPixel);
    window.addEventListener("hashchange", injectPixel);

    // For single-page applications using custom routing
    const originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      injectPixel();
    };

    // Re-inject on tab focus
    window.addEventListener("focus", injectPixel);

    // For frameworks that have their own routing events (optional)
    if (typeof document.addEventListener === "function") {
      document.addEventListener("DOMContentLoaded", injectPixel);
    }
  }

  // Run the setup
  setupPixelInjection();
})();
</script>`;

    setPixelScript(script);
  };

  const copyPixelScript = () => {
    navigator.clipboard
      .writeText(pixelScript)
      .then(() => alert("Pixel script copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className={styles.pixelContainer}>
      <h1>Pixel Management</h1>
      <p>Your Site ID: {siteId || "Not found"}</p>
      <div className={styles.pixelForm}>
        <button onClick={generatePixel} className={styles.generateButton}>
          Generate Pixel Script
        </button>
      </div>
      {pixelScript && (
        <div className={styles.pixelCodeSection}>
          <h2>Your Pixel Script</h2>
          <pre className={styles.pixelCodeDisplay}>{pixelScript}</pre>
          <button onClick={copyPixelScript} className={styles.copyButton}>
            Copy Pixel Script
          </button>
        </div>
      )}
    </div>
  );
}
