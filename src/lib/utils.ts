import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// localStorage utilities for member data
const MEMBERS_STORAGE_KEY = "moitjee-members";

export interface Member {
  id: string;
  nickname: string;
  location: string;
}

export function saveMembers(members: Member[]): void {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (error) {
    console.error("Failed to save members to localStorage:", error);
  }
}

export function loadMembers(): Member[] {
  try {
    const stored = localStorage.getItem(MEMBERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load members from localStorage:", error);
    return [];
  }
}
