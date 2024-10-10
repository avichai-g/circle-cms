function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateBannerHTML(
  uniqueId: string,
  imageUrl: string,
  url: string,
  apiUrl: string,
  siteId: string
): string {
  const trackingId = generateShortId();
  const trackedUrl = `${url}${
    url.includes("?") ? "&" : "?"
  }trackingId=${trackingId}`;

  return `
    <style>
      .sideBanner-${uniqueId} {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 250px;
        height: auto;
        color: #ffffff;
        text-align: center;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        z-index: 9999;
        border-radius: 10px 0 0 10px;
        font-family: Arial, sans-serif;
      }
      .sideBanner-${uniqueId} .logo {
        width: 100px;
        height: 100px;
        background-color: #4C1B1B;
        border-radius: 50%;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
      }
      .sideBanner-${uniqueId} .title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .sideBanner-${uniqueId} .subtitle {
        font-size: 16px;
        margin-bottom: 15px;
      }
      .sideBanner-${uniqueId} img {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        margin-bottom: 15px;
      }
      .sideBanner-${uniqueId} .cta {
        background-color: #4C1B1B;
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        display: inline-block;
      }
    </style>
    <div class="sideBanner-${uniqueId}" onclick="
      window.open('${trackedUrl}', '_blank');
      fetch('${apiUrl}/api/user-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actionType: 'banner_click',
          data: {
            trackingId: '${trackingId}',
            url: '${url}',
            campaignType: 'sideBanner',
            siteId: '${siteId}',
          },
          origin: window.location.origin
        })
      }).catch(console.error);">
      <img src="${imageUrl}" alt="sideBanner" />
    </div>
  `;
}
