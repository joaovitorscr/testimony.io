"use client";

import { MoreVertical, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cancelInvitation } from "@/server/actions/invitation";
import { removeMember } from "@/server/actions/member";

// Types
type Member = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
};

export function MembersList({
  members,
  invitations,
  currentUserId,
  isOwner,
}: {
  members: Member[];
  invitations: Invitation[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    const result = await removeMember(memberId);
    if (result.success) {
      toast.success("Member removed");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to remove member");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    const result = await cancelInvitation(invitationId);
    if (result.success) {
      toast.success("Invitation canceled");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to cancel invitation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-muted-foreground text-sm">
          Active Members
        </h4>
        <div className="space-y-4">
          {members.map((member) => {
            const canRemove = isOwner || member.user.id === currentUserId;

            return (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm leading-none">
                      {member.user.name}
                      {member.user.id === currentUserId && " (You)"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm capitalize">
                    {member.role}
                  </span>
                  {canRemove && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {member.user.id === currentUserId
                            ? "Leave"
                            : "Remove"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-muted-foreground text-sm">
            Pending Invitations
          </h4>
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <span className="font-medium text-muted-foreground text-sm">
                      {invitation.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-none">
                      {invitation.email}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Pending acceptance
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelInvitation(invitation.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
