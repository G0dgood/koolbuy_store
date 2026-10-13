/* Admin light / dark theme. The choice is kept in localStorage and applied as
   .dark on <html> while the admin is open (the storefront is always light).
   A script in the root layout applies it before first paint, so a dark reload
   never flashes light. */

export type AdminTheme = "light" | "dark";

export const ADMIN_THEME_KEY = "koolbuy-admin-theme";
const EVENT = "koolbuy-admin-theme";

export const getAdminTheme = (): AdminTheme => {
  try {
    return localStorage.getItem(ADMIN_THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const applyAdminTheme = (theme: AdminTheme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const setAdminTheme = (theme: AdminTheme) => {
  try {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  } catch {
    /* not remembered, still applied */
  }
  applyAdminTheme(theme);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }));
};

/** Calls back when the theme is changed (from any component). */
export const onAdminThemeChange = (cb: (theme: AdminTheme) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent<AdminTheme>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};

/** Inline script for <head>: applies a saved dark theme on /admin pages before paint. */
export const ADMIN_THEME_BOOT_SCRIPT = `(function(){try{if(location.pathname.indexOf('/admin')===0&&localStorage.getItem('${ADMIN_THEME_KEY}')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
