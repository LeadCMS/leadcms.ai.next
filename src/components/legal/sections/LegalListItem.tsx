import React from "react";
import { CheckCircle } from "lucide-react";

export const LegalListItem: React.FC<React.PropsWithChildren> = ({ children }) => (
  <li className="flex items-start mb-1">
    <CheckCircle className="mr-2 h-4 w-4 text-primary mt-1 flex-shrink-0" />
    <span>{children}</span>
  </li>
);
