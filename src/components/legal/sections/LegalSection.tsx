import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ title, children }) => (
  <Card className="mb-8">
    <CardHeader className="pb-0 mb-0">
      <CardTitle className="text-2xl font-semibold m-0 p-0 leading-tight">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0 mt-[-4px]">{children}</CardContent>
  </Card>
);
