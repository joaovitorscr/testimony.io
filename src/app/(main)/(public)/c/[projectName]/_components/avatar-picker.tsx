"use client";

import { Camera, UserIcon } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/image-crop";
import { Input } from "@/components/ui/input";

/** Optional profile picture: pick a file, crop it to a circle, keep a data URL. */
export function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0) ?? null;
    if (file !== null) {
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  const closeDialog = () => {
    setSelectedFile(null);
  };

  return (
    <Field>
      <FieldLabel htmlFor="avatar">Picture (optional)</FieldLabel>
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={value} alt="Your picture" />
          <AvatarFallback>
            <UserIcon className="size-6 text-fg-faint" />
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera data-icon="inline-start" />
          {value === "" ? "Choose a picture" : "Change picture"}
        </Button>
      </div>

      <Input
        ref={fileInputRef}
        id="avatar"
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <Dialog
        open={selectedFile !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop your profile picture</DialogTitle>
            <DialogDescription>
              Adjust the crop area and click apply when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {selectedFile !== null && (
            <ImageCrop
              aspect={1}
              circularCrop
              file={selectedFile}
              maxImageSize={400 * 400}
              onCrop={(dataUrl) => {
                onChange(dataUrl);
                closeDialog();
              }}
            >
              <div className="flex justify-center py-4">
                <ImageCropContent />
              </div>
              <div className="flex items-center justify-end gap-2">
                <ImageCropReset asChild>
                  <Button variant="ghost" size="sm">
                    Reset
                  </Button>
                </ImageCropReset>
                <Button onClick={closeDialog} size="sm" type="button" variant="secondary">
                  Cancel
                </Button>
                <ImageCropApply asChild>
                  <Button size="sm">Apply</Button>
                </ImageCropApply>
              </div>
            </ImageCrop>
          )}
        </DialogContent>
      </Dialog>
    </Field>
  );
}
