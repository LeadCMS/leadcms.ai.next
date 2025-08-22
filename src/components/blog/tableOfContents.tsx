import React, { useEffect, useState } from "react";
import { ChevronRight, List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ className = "" }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Extract all h2, h3, h4 headings from the article
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3, h4");
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      // Create an ID if one doesn't exist
      if (!heading.id) {
        const id = heading.textContent
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim() || `heading-${index}`;
        heading.id = id;
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setToc(tocItems);
  }, []);

  useEffect(() => {
    if (toc.length === 0) return;

    // Set up intersection observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Find the heading that's closest to the top of the viewport
          const sortedEntries = visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
          
          setActiveId(sortedEntries[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0% -70% 0%",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all headings
    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also set up a scroll listener as a fallback
    const handleScroll = () => {
      const headings = toc.map(item => ({
        ...item,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      if (headings.length === 0) return;

      // Find the heading that's currently most visible
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;
      
      let currentHeading = headings[0];
      for (const heading of headings) {
        if (heading.element!.offsetTop <= scrollPosition) {
          currentHeading = heading;
        } else {
          break;
        }
      }
      
      setActiveId(currentHeading.id);
    };

    // Initial call to set the active heading
    handleScroll();
    
    // Throttle scroll events
    let scrollTimeout: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScrollHandler);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScrollHandler);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden mb-4 sm:mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 sm:p-4 bg-background border border-muted rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 flex-shrink-0" />
            <span>Table of Contents</span>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="mt-2 bg-background border border-muted rounded-lg shadow-md overflow-hidden">
            <div className="max-h-80 overflow-y-auto p-3 sm:p-4">
              <ul className="space-y-1">
                {toc.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        scrollToHeading(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        block w-full text-left text-sm py-2 px-3 rounded transition-colors
                        ${item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : "pl-9"}
                        ${
                          activeId === item.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }
                      `}
                    >
                      <span className="line-clamp-2 break-words">{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Desktop TOC */}
      <nav className={`hidden lg:block ${className}`}>
        <div className="bg-background border border-muted rounded-lg p-4 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-muted">
            Table of Contents
          </h3>
          <ul className="space-y-1">
            {toc.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    block w-full text-left text-sm py-2 px-3 rounded transition-colors
                    ${item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : "pl-9"}
                    ${
                      activeId === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  <span className="break-words">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};
