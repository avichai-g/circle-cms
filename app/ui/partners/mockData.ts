// mockData.ts
export interface GalleryItem {
  name: string;
  image: string;
  href: string;
}

export const galleryItems: GalleryItem[] = [
  {
    name: "All birds",
    image: "/images/allbirds.jpeg",
    href: "https://www.allbirds.com/",
  },
  {
    name: "Makiage",
    image: "/images/makiage.jpeg",
    href: "https://www.ilmakiage.co.il/",
  },
  {
    name: "Stitch Fix",
    image: "/images/stitch.png",
    href: "https://www.stitchfix.com/",
  },
  {
    name: "Chewy",
    image: "/images/chewy.png",
    href: "https://www.chewy.com/",
  },

  {
    name: "Warby Parker",
    image: "/images/warby.png",
    href: "https://www.warbyparker.com/",
  },
  {
    name: "Honest",
    image: "/images/honest.png",
    href: "https://www.honest.com/",
  },

  // {
  //   name: "Mac",
  //   image: "/images/mac.png",
  //   href: "https://www.maccosmetics.com/",
  // },
  // {
  //   name: "Seint",
  //   image: "/images/seint.png",
  //   href: "https://www.seintofficial.com/en",
  // },
  // {
  //   name: "Petco",
  //   image: "/images/petco.png",
  //   href: "https://www.petco.com/shop/en/petcostore",
  // },
];
