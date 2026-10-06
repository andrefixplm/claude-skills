import { site } from "../data/content/site";

export function Footer() {
  return (
    <footer className="sr-only sm:not-sr-only sm:fixed sm:inset-x-0 sm:bottom-1 sm:z-10 sm:px-8 sm:text-center sm:text-[10px] sm:text-faint">
      {site.footer}
    </footer>
  );
}
