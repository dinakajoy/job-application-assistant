import { useEffect } from "react";
import type { AppProps } from "next/app";
import { JobProvider } from "@/context/JobContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const TAB_KEY = "jobgenie-tab-count";

    // Increase tab count
    const currentCount = parseInt(localStorage.getItem(TAB_KEY) || "0", 10);
    localStorage.setItem(TAB_KEY, (currentCount + 1).toString());

    const handleUnload = () => {
      // Decrease tab count
      const count = parseInt(localStorage.getItem(TAB_KEY) || "1", 10);
      if (count <= 1) {
        // Last tab — clear storage
        localStorage.clear();
      } else {
        localStorage.setItem(TAB_KEY, (count - 1).toString());
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload(); // Ensure cleanup on React unmount
    };
  }, []);

  return (
    <JobProvider>
      <Component {...pageProps} />
    </JobProvider>
  );
}
