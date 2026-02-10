"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Check,
  ImagePlusIcon,
  StarIcon,
  UploadIcon,
  UserIcon,
  X,
  XIcon,
} from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/image-crop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

const testimonialSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  rating: z.number().min(1, "Please rate your experience").max(5),
  text: z.string().min(10, "Please provide more detail (at least 10 chars)"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function TestimonialForm({ token }: { token: string }) {
  const createTestimonieMutation =
    api.testimonie.submitTestimonie.useMutation();

  const [croppedImageForDisplay, setCroppedImageForDisplay] =
    useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    mode: "onChange",
    defaultValues: {
      customerName: "",
      customerCompany: "",
      customerTitle: "",
      rating: 0,
      text: "",
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setIsDialogOpen(true);

      event.target.value = "";
    }
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    let avatarBase64: string | undefined;

    if (croppedImageForDisplay) {
      avatarBase64 = croppedImageForDisplay;
    }

    toast.promise(
      createTestimonieMutation.mutateAsync(
        {
          token,
          testimonie: {
            ...values,
            avatarBase64,
          },
        },
        {
          onError: (error) => {
            console.error(error);
          },
        },
      ),
      {
        loading: "Submitting testimonial...",
        success: "Testimonial submitted successfully!",
        error: "Failed to submit testimonial",
      },
    );
  };

  const handleCropComplete = (croppedImageBase64: string) => {
    setCroppedImageForDisplay(croppedImageBase64);
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setSelectedFile(null);
    }
  };

  if (createTestimonieMutation.isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h2 className="font-bold text-2xl">Thank You!</h2>
        <p className="text-muted-foreground">
          Your testimonial has been received.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <FieldGroup>
        <div>
          <div className="flex flex-col items-start gap-2">
            <Label>Picture (Optional)</Label>
            <div className="relative inline-block">
              <Avatar className="size-20">
                <AvatarImage
                  src={croppedImageForDisplay}
                  alt="Testimonial Avatar"
                />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                className="absolute right-0 bottom-0 size-8 rounded-full p-0"
                onClick={triggerFileSelect}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crop your profile picture</DialogTitle>
                <DialogDescription>
                  Adjust the crop area and click apply when you're done.
                </DialogDescription>
              </DialogHeader>

              {selectedFile && (
                <div className="py-4">
                  <ImageCrop
                    aspect={1}
                    circularCrop
                    file={selectedFile}
                    maxImageSize={400 * 400}
                    onCrop={handleCropComplete}
                  >
                    <div className="my-8 flex flex-col items-center justify-center">
                      <ImageCropContent />
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-4">
                      <ImageCropApply asChild>
                        <Button variant="outline" size="icon">
                          <Check />
                        </Button>
                      </ImageCropApply>
                      <ImageCropReset asChild>
                        <Button variant="outline" size="sm">
                          Reset
                        </Button>
                      </ImageCropReset>
                      <Button
                        onClick={() => setIsDialogOpen(false)}
                        size="icon"
                        type="button"
                        variant="outline"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </ImageCrop>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Rating */}
        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className={`rounded-full p-1 transition-colors ${
                      field.value >= star
                        ? "text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        field.value >= star ? "fill-primary" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text">Your Testimonial</FieldLabel>
              <Textarea
                {...field}
                id="text"
                placeholder="Share your experience..."
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="customerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customerName">Your Name</FieldLabel>
              <Input {...field} id="customerName" placeholder="John Doe" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="customerTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerTitle">
                  Job Title (Optional)
                </FieldLabel>
                <Input {...field} id="customerTitle" placeholder="CEO" />
              </Field>
            )}
          />

          <Controller
            name="customerCompany"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerCompany">
                  Company (Optional)
                </FieldLabel>
                <Input
                  {...field}
                  id="customerCompany"
                  placeholder="Acme Inc."
                />
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={createTestimonieMutation.isPending || !form.formState.isValid}
      >
        {createTestimonieMutation.isPending
          ? "Submitting..."
          : "Submit Testimonial"}
      </Button>
    </form>
  );
}
