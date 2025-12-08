"use client";

import { ChevronsUpDown, Plus, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

import { useRouter } from "next/navigation";

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const { data: session, isPending: isPendingSession } =
    authClient.useSession();
  const { data: organizationList, isPending: isPendingOrganizationList } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isPendingActiveOrganization } =
    authClient.useActiveOrganization();

  const handleCreateOrganization = () => {};

  const handleSetActiveOrganization = (organizationId: string) => {
    authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  if (
    isPendingOrganizationList ||
    isPendingActiveOrganization ||
    isPendingSession
  ) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!session) {
    return null;
  }

  const { user } = session;

  if (!activeOrganization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar>
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Personal Account</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image ?? ""} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      Personal Account
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleCreateOrganization}>
                  <PlusIcon />
                  Create Organization
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeOrganization) {
    return <p>No Org</p>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar>
                  <AvatarImage
                    src={activeOrganization.logo ?? ""}
                    alt={activeOrganization.name}
                  />
                  <AvatarFallback>
                    {activeOrganization.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizationList?.map((organization) => (
              <DropdownMenuItem
                disabled={organization.id === activeOrganization.id}
                key={organization.id}
                className="gap-2 p-2"
                onClick={() => handleSetActiveOrganization(organization.id)}
              >
                <Avatar className="size-6">
                  <AvatarImage
                    src={organization.logo ?? ""}
                    alt={organization.name}
                  />
                  <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {organization.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-1"
              onClick={handleCreateOrganization}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create Organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
