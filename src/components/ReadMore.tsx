import React, { useState, type ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ExpandableContainerProps {
  title: JSX.Element | string;
  children: ReactNode;
  className?: string | null;
}

export default function Readmore({ title, children, className }: ExpandableContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const contentArray = React.Children.toArray(children);
  const visibleContent = contentArray.slice(0, -2);
  const hiddenContent = contentArray.slice(-2);

  return (
    <div className={cn(className)}>
      {visibleContent}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>{hiddenContent}</CollapsibleContent>
        <CollapsibleTrigger className={`flex w-full items-center justify-between text-md text-black underline underline-offset-4 ${!isOpen && 'read-more'}`}>
          {!isOpen ? 'Show more' : 'Show less'}
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
