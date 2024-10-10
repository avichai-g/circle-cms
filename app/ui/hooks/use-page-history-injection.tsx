import { useEffect } from "react";

export const usePageHistoryInjection = (
  injectionUrl: string,
  onBackButton: () => void,
  onTabClose: () => void
) => {
  useEffect(() => {
    if (window) {
      const currentPage = window.location.href;

      // Inject a page into the history stack
      window.history.replaceState({}, "", injectionUrl);
      window.history.pushState({}, "", currentPage);

      // Handle the back button press
      const handlePopState = () => {
        onBackButton();
      };

      // Show promotion modal on tab close or refresh
      const handleBeforeUnload = (event: any) => {
        onTabClose();
        event.preventDefault();
        event.returnValue = ""; // For some browsers, showing a confirmation dialog
      };

      // Listen for popstate and beforeunload events
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup event listeners when the component unmounts
      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [injectionUrl, onBackButton, onTabClose]);
};
