"use client";

import { Camera, Check, UserIcon, X } from "lucide-react";
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
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/image-crop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div>
      <div className="flex flex-col items-start gap-2">
        <Label>Picture (Optional)</Label>
        <div className="relative inline-block">
          <Avatar className="size-20">
            <AvatarImage src={value} alt="Your picture" />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <Button
            type="button"
            size="sm"
            className="absolute right-0 bottom-0 size-8 rounded-full p-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Choose a picture</span>
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
            <div className="py-4">
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
                <div className="my-8 flex flex-col items-center justify-center">
                  <ImageCropContent />
                </div>
                <div className="flex items-center justify-between gap-2 pt-4">
                  <ImageCropApply asChild>
                    <Button variant="outline" size="icon">
                      <Check />
                      <span className="sr-only">Apply</span>
                    </Button>
                  </ImageCropApply>
                  <ImageCropReset asChild>
                    <Button variant="outline" size="sm">
                      Reset
                    </Button>
                  </ImageCropReset>
                  <Button onClick={closeDialog} size="icon" type="button" variant="outline">
                    <X className="size-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              </ImageCrop>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
