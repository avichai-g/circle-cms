function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateAbandonedBannerHTML(
  uniqueId: string,
  imageUrl: string,
  title: string,
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
      #circleAbondenedBanner-${uniqueId} {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s, visibility 0.5s;
      }

      #circleAbondenedBanner-${uniqueId}.show {
        opacity: 1;
        visibility: visible;
      }

      .modal-content-${uniqueId} {
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        text-align: center;
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .modal-content-${uniqueId}:hover {
        transform: scale(1.02);
      }

      .modal-content-${uniqueId} h2 {
        color: #4C1B1B;
        margin-bottom: 20px;
      }

      .modal-content-${uniqueId} img {
        max-width: 100%;
        height: auto;
        margin-bottom: 20px;
      }

      .close-${uniqueId} {
        color: #aaa;
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        z-index: 1;
      }

      .close-${uniqueId}:hover,
      .close-${uniqueId}:focus {
        color: #000;
        text-decoration: none;
      }

      .cta-${uniqueId} {
        background-color: #4C1B1B;
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        display: inline-block;
        transition: background-color 0.3s ease, color 0.3s ease;
        cursor: pointer;
      }

      .cta-${uniqueId}:hover {
        background-color: #ffffff;
        color: #4C1B1B;
      }
    </style>

    <div id="circleAbondenedBanner-${uniqueId}">
      <div class="modal-content-${uniqueId}" onclick="
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
              campaignType: 'abondenedBanner',
              siteId: '${siteId}',
            },
            origin: window.location.origin
          })
        }).catch(console.error);">
        <span class="close-${uniqueId}" onclick="event.stopPropagation(); document.getElementById('circleAbondenedBanner-${uniqueId}').classList.remove('show');">&times;</span>
        <h2>${title}</h2>
        <img src="${imageUrl}" alt="${title}" />
        <span class="cta-${uniqueId}">Learn More</span>
      </div>
    </div>
  `;
}
