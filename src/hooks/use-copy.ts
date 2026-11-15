import { useEffect, useState } from "react";
import { toast } from "sonner";

/** Copies text to the clipboard; `copied` stays true for two seconds after. */
export function useCopy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = copied
      ? setTimeout(() => {
          setCopied(false);
        }, 2000)
      : undefined;
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it instead.");
    }
  };

  return { copied, copy };
}
