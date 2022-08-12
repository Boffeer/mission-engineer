if (matchMedia("prefers-color-scheme: dark").media == "not all") {
  document.documentElement.style.display = "none";
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="css/dark-theme.css">'
  );
  // '<link rel="stylesheet" href="css/dark-theme.css" onload="document.documentElement.style.display=``">'
} else {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="css/light-theme.css">'
  );
  // '<link rel="stylesheet" href="css/light-theme.css" onload="document.documentElement.style.display=\'\'">'
}
