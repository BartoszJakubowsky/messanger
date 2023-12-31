import { type Session } from "next-auth";
import Head from "next/head";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { configureAbly } from "@ably-labs/react-hooks";
import "~/styles/globals.css";
import Sidebar from "~/components/ui/Sidebar";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  
const prefix = process.env.NEXTAUTH_URL ?? "";

const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
configureAbly({ authUrl: `${prefix}/api/createTokenRequest?clientId=${clientId}`, clientId: clientId });

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Mental Messanger</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Because there's not enough of them..." />
        <meta name="author" content="BartoszJakubovsky" />
        <meta name="copyright" content="Copyright owner one and only BartoszJakubowsy" />
      </Head>
      <main className="min-h-screen flex justify-center bg-blue-300 dark:bg-indigo-900 dark:text-gray-200  ">
        <Sidebar/>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};
export default api.withTRPC(MyApp);
