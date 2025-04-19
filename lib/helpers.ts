export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load audio metadata"));
    };
  });
};

export const getAudioDurationFromUrl = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.src = url;

    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      reject(new Error("Could not load audio metadata from URL"));
    };
  });
};

export async function getFileSizeFromUrl(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: "HEAD" });

    if (!res.ok) {
      throw new Error(`Failed to fetch headers: ${res.status}`);
    }

    const len = res.headers.get("content-length");
    return len ? parseInt(len, 10) : 0;
  } catch (err) {
    return 0;
  }
}

export const toTitleCase = (text = ""): string => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
