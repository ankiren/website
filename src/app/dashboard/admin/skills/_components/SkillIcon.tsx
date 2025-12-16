"use client";

import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface SkillIconProps extends LucideProps {
  name?: string;
}

export function SkillIcon({ name, ...props }: SkillIconProps) {
  if (!name) {
    const FallbackIcon = LucideIcons.FileText;
    return <FallbackIcon {...props} />;
  }

  const IconComponent = LucideIcons[
    name as keyof typeof LucideIcons
  ] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    const FallbackIcon = LucideIcons.FileText;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}
