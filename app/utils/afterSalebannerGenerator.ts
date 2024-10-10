function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateAfterSaleBannerHTML(
  uniqueId: string,
  uploadedImagesWithUrls: { imageUrl: string | null; url: any }[],
  apiUrl: string,
  siteId: string
): string {
  const imageCount = uploadedImagesWithUrls.length;

  const imageContainers = uploadedImagesWithUrls
    .map((item, index) => {
      const trackingId = generateShortId();
      const trackedUrl = `${item.url}${
        item.url.includes("?") ? "&" : "?"
      }trackingId=${trackingId}`;

      return `
      <div class="image-container ${
        imageCount > 1 ? `multi-image-${imageCount}` : ""
      }"
           onclick="
             window.open('${trackedUrl}', '_blank');
             fetch('${apiUrl}/api/user-action', {
               method: 'POST',  
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 actionType: 'banner_click',
                 data: {
                   trackingId: '${trackingId}',
                   url: '${item.url}',
                   campaignType: 'afterSaleBanner',
                   siteId: '${siteId}',
                 },
                 origin: window.location.origin
               })
             }).catch(console.error);">
        <img src="${item.imageUrl}" alt="Banner Image ${index + 1}" />
      </div>
    `;
    })
    .join("");

  return `
    <style>
      .circleAfterSaleBanner-${uniqueId} {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .circleAfterSaleBanner-${uniqueId} .image-container {
        flex: 1;
        max-width: 100%;
        height: 300px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border-radius: 8px;
      }
      .circleAfterSaleBanner-${uniqueId} .multi-image-2 {
        flex-basis: calc(50% - 5px);
      }
      .circleAfterSaleBanner-${uniqueId} .multi-image-3 {
        flex-basis: calc(33.33% - 6.67px);
      }
      .circleAfterSaleBanner-${uniqueId} img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      .circleAfterSaleBanner-${uniqueId} .image-container:hover img {
        transform: scale(1.1);
      }

      /* Responsive styles */
      @media screen and (max-width: 768px) {
        .circleAfterSaleBanner-${uniqueId} .image-container,
        .circleAfterSaleBanner-${uniqueId} .multi-image-2,
        .circleAfterSaleBanner-${uniqueId} .multi-image-3 {
          flex-basis: 100%;
          height: 200px;
        }
      }
      @media screen and (max-width: 480px) {
        .circleAfterSaleBanner-${uniqueId} .image-container,
        .circleAfterSaleBanner-${uniqueId} .multi-image-2,
        .circleAfterSaleBanner-${uniqueId} .multi-image-3 {
          height: 150px;
        }
      }
    </style>
    <div class="circleAfterSaleBanner-${uniqueId}">
      ${imageContainers}
    </div>
  `;
}
