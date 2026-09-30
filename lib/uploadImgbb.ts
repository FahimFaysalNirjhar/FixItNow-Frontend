export async function uploadImgbb(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const body = new FormData();
  body.append("image", file);

  try {
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_HOST_KEY}`,
      { method: "POST", body },
    );
    const result = await res.json();
    if (!result.success) {
      console.error("imgbb upload failed", result);
      return null;
    }
    return result.data.url as string;
  } catch (err) {
    console.error("imgbb upload error", err);
    return null;
  }
}
