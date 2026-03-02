import { browser } from "$app/environment";
import { init, register } from "svelte-i18n";

const defaultLocale = "en";

register("en", () => import("./lang/en.json"));
register("ar", () => import("./lang/ar.json"));

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser ? window.navigator.language : defaultLocale,
});

import { derived } from "svelte/store";
import { locale } from "svelte-i18n";

export const isLocaleLoaded = derived(
  locale,
  ($locale) => typeof $locale === "string"
);
