"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { 
  ChevronUp, 
  User, 
  LogOut,
  Home,
  FileCode2,
  Settings,
  Wallet,
  Receipt,
  AlertCircle,
  Bot
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
  {
    title: "Home",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Expenses",
    icon: Receipt,
    url: "/dashboard/expenses",
  },
  {
    title: "Income",
    icon: Wallet,
    url: "/dashboard/income",
  },
];

const toolsNav = [
  {
    title: "AI Assistant",
    icon: Bot,
    url: "/dashboard/chat",
  },
  {
    title: "Report Issue",
    icon: AlertCircle,
    url: "/dashboard/report",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex h-20 items-center justify-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
          <div className="flex items-center transition-opacity duration-200 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
            <Image
              src="/logo/logo.svg"
              alt="CurioPay Logo"
              width={360}
              height={120}
              className="h-16 w-auto"
              priority
            />
          </div>
          <div className="absolute opacity-0 transition-opacity duration-200 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-100">
            <Image
              src="/logo/logo.svg"
              alt="CurioPay Logo"
              width={240}
              height={80}
              className="h-12 w-auto"
              priority
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full">
              <div className="flex w-full items-center gap-2">
                <User className="h-4 w-4" />
                <span className="flex-1 truncate text-left transition-opacity duration-200 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0">
                  {session?.user?.name || 'User'}
                </span>
                <ChevronUp className="h-4 w-4 opacity-50 transition-opacity duration-200 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0" />
                <div className="absolute right-3 opacity-0 transition-opacity duration-200 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-100">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
