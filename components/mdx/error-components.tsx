import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";

interface NotFoundSectionProps {
  badge?: string;
  icon?: keyof typeof LucideIcons;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

export const NotFoundSection: React.FC<NotFoundSectionProps> = ({ 
  badge = "404 Error",
  icon = "Ghost",
  title,
  description,
  buttonText = "Go Home",
  buttonHref = "/"
}) => {
  const Icon = LucideIcons[icon] as React.ComponentType<any>;
  
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted min-h-[60vh] flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center">
          <Badge className="mb-4" variant="outline">
            {badge}
          </Badge>
          <Icon className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8" dangerouslySetInnerHTML={{ __html: description }} />
          <Button asChild size="lg">
            <Link 
              href={buttonHref}
              target={buttonHref.startsWith("http") ? "_blank" : undefined}
              rel={buttonHref.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
