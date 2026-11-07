import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../lib/content';

export const FaqAccordion: React.FC<{
  items: readonly FaqItem[];
  onResetSearch?: () => void;
  searchQuery?: string;
}> = ({ items, onResetSearch, searchQuery }) => {
  // Only the first FAQ is opened by default; the rest stay closed until clicked manually.
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.length > 0 ? [items[0].id] : []
  );

  const firstItemId = items[0]?.id ?? '';

  useEffect(() => {
    setOpenIds(firstItemId ? [firstItemId] : []);
  }, [firstItemId, items.length]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-2">
        <p className="text-sm text-zinc-600">
          No questions matched {searchQuery ? `"${searchQuery}"` : 'your filter'}.
        </p>
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Show all questions
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
      {items.map((faq, index) => {
        const isOpen = openIds.includes(faq.id);
        const panelId = `faq-panel-${faq.id}`;
        const buttonId = `faq-btn-${faq.id}`;

        return (
          <div
            key={faq.id}
            className={`transition-colors ${isOpen ? 'bg-white' : 'bg-white hover:bg-zinc-50/70'}`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(faq.id)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-semibold text-blue-600">{faq.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Question {index + 1}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-zinc-900 font-display leading-snug">
                    {faq.question}
                  </div>
                </div>

                <span
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-150 ${
                    isOpen
                      ? 'border-blue-200 bg-blue-50 text-blue-600 rotate-180'
                      : 'border-zinc-200 bg-[#FAFAFA] text-zinc-500'
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100/80"
              >
                <div className="pt-3">{faq.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
