"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { ArchiveIcon, CheckIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Testimonial } from "./testimonial-card";

type Status = Testimonial["status"];

const DONE: Record<Status, string> = {
  approved: "Approved. It joins your widget within about a minute.",
  archived: "Archived. It leaves your widget within about a minute.",
  pending: "Moved back to pending.",
};

function DeleteButton({ testimonial }: { testimonial: Testimonial }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const remove = useMutation(api.testimonials.remove);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await remove({ id: testimonial._id });
      setOpen(false);
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Couldn't delete the testimonial");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive-ghost"
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Trash2Icon data-icon="inline-start" />
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this testimonial?</DialogTitle>
            <DialogDescription>
              {testimonial.customerName}&apos;s testimonial and photo are deleted for good.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={() => {
                void handleDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** The review buttons for a testimonial, depending on where it is now. */
export function TestimonialActions({ testimonial }: { testimonial: Testimonial }) {
  const setStatus = useMutation(api.testimonials.setStatus);

  const update = async (status: Status) => {
    try {
      await setStatus({ id: testimonial._id, status });
      return true;
    } catch {
      toast.error("Couldn't update the testimonial");
      return false;
    }
  };

  const move = async (status: Status) => {
    const previous = testimonial.status;
    if (await update(status)) {
      toast.success(DONE[status], {
        action: {
          label: "Undo",
          onClick: () => {
            void update(previous);
          },
        },
      });
    }
  };

  const button = (status: Status, label: string, primary = false) => {
    const Icon = { approved: CheckIcon, archived: ArchiveIcon, pending: UndoIcon }[status];
    return (
      <Button
        key={status}
        type="button"
        variant={primary ? "default" : "ghost"}
        size="sm"
        className={primary ? undefined : "text-muted-foreground"}
        onClick={() => {
          void move(status);
        }}
      >
        <Icon data-icon="inline-start" />
        {label}
      </Button>
    );
  };

  if (testimonial.status === "pending") {
    return [button("approved", "Approve", true), button("archived", "Archive")];
  }
  if (testimonial.status === "approved") {
    return button("archived", "Archive");
  }
  return [button("approved", "Approve"), <DeleteButton key="delete" testimonial={testimonial} />];
}
