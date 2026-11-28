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
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border border-border">
          <AvatarImage src={value} alt="Your picture" />
          <AvatarFallback className="bg-muted">
            <UserIcon className="size-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <FieldLabel htmlFor="avatar">
            Picture <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <p className="text-xs text-muted-foreground">Shown next to your words.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera data-icon="inline-start" />
          {value === "" ? "Upload" : "Change"}
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
