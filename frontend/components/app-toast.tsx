"use client";

import { toast, type ExternalToast } from "sonner";

type ToastMessage = {
  title: string;
  description?: string;
};

function success(message: ToastMessage, options?: ExternalToast) {
  return toast.success(message.title, {
    description: message.description,
    ...options,
  });
}

function error(message: ToastMessage, options?: ExternalToast) {
  return toast.error(message.title, {
    description: message.description,
    ...options,
  });
}

export const appToast = {
  success,
  error,
};

export const userToast = {
  created: () =>
    success({
      title: "User created",
      description: "The user has been added successfully.",
    }),
  updated: () =>
    success({
      title: "User updated",
      description: "Your changes have been saved successfully.",
    }),
  deleted: () =>
    success({
      title: "User deleted",
      description: "The user has been removed successfully.",
    }),
};

export const authToast = {
  signedIn: () =>
    success({
      title: "Signed in",
      description: "Welcome back!",
    }),
  signedUp: () =>
    success({
      title: "Account created",
      description: "Your account is ready.",
    }),
  signedOut: () =>
    success({
      title: "Signed out",
      description: "You have been logged out.",
    }),
  error: (description?: string) =>
    error({
      title: "Authentication failed",
      description: description ?? "Please try again.",
    }),
};
