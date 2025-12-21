"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

const inviteUserSchema = z.object({
  email: z.email(),
});

export function InviteDialog() {
  const [open, setOpen] = useState(false);

  const inviteUserMutation = api.project.inviteUser.useMutation();

  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof inviteUserSchema>) => {
    toast.promise(inviteUserMutation.mutateAsync(values), {
      loading: "Sending invitation...",
      success: "Invitation sent",
      error: (error) => {
        form.setError("email", {
          message: error.message,
        });

        return {
          message: "Failed to send invitation",
          description: error.message,
        };
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new member to this project.
          </DialogDescription>
        </DialogHeader>
        <form id="invite-user-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    required
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Field orientation="horizontal" className="mt-8 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={inviteUserMutation.isPending || !form.formState.isValid}
            >
              {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
