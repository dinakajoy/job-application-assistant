import type { AppProps } from "next/app";
import { JobProvider } from "@/context/JobContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JobProvider>
      <Component {...pageProps} />
    </JobProvider>
  );
}
