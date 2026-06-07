"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ForbiddenProps = {
  statusCode?: 403 | 404;
  title?: string;
  description?: string;
};

const defaults: Record<403 | 404, { title: string; description: string }> = {
  403: {
    title: "Access denied",
    description:
      "You do not have permission to view this page. Contact an administrator if you believe this is a mistake.",
  },
  404: {
    title: "Page not found",
    description:
      "The page you are looking for does not exist or may have been moved.",
  },
};

function goBackWithReload(fallbackHref = "/dashboard") {
  const referrer = document.referrer;
  if (referrer) {
    try {
      const previous = new URL(referrer);
      const current = new URL(window.location.href);
      if (
        previous.origin === current.origin &&
        previous.pathname !== current.pathname
      ) {
        window.location.assign(previous.href);
        return;
      }
    } catch {
      // ignore invalid referrer
    }
  }
  window.location.assign(fallbackHref);
}

export function Forbidden({
  statusCode = 403,
  title,
  description,
}: ForbiddenProps) {
  const preset = defaults[statusCode];

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" aria-hidden />
          </div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {statusCode}
          </p>
          <CardTitle className="text-2xl">{title ?? preset.title}</CardTitle>
          <CardDescription className="text-center">
            {description ?? preset.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" onClick={() => goBackWithReload()}>
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
