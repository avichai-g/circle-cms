export async function uploadImageToCloudinary(
  file: File
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data.secure_url;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
}
