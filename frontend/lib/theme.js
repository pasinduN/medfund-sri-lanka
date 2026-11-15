export const THEME_KEY = "medfund-theme";

// Runs in <head> before the page is painted, so a dark-mode visitor never sees a white flash
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;