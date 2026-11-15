import { MediaFrame } from "@/components/media-frame";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-400 gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
      <MediaFrame still="night" className="flex min-h-64 items-end p-6 md:p-11">
        <div className="flex max-w-145 flex-col gap-4">
          <p className="type-display">Collect the words your customers already say about you.</p>
          <p className="hidden text-lg text-light/80 sm:block">
            Send a link, get a testimonial back, and show it on your site with a single embed.
          </p>
        </div>
      </MediaFrame>
      <LoginForm className="md:px-6 md:py-2" />
    </main>
  );
}
