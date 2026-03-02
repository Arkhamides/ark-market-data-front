export const placeholder_image =
    "https://shop.raceya.fit/wp-content/uploads/2020/11/logo-placeholder.jpg";

export function handleImageError(e: Event) {
    const img = e.currentTarget as EventTarget & HTMLImageElement;
    img.src = placeholder_image;
}