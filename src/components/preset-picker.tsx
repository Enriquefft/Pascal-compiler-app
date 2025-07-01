"use client";

import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PascalTag, validPascalPresets, invalidPascalPresets } from "@/lib/pascal-presets";

function TagCombobox({
  value,
  onChange,
}: {
  value: PascalTag | null;
  onChange: (v: PascalTag | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = Object.values(PascalTag);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ?? "Filter by tag"}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tag..." />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {options.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => {
                    onChange(tag);
                    setOpen(false);
                  }}
                >
                  {tag}
                  <CheckIcon
                    className={cn(
                      "ml-auto size-4",
                      value === tag ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PresetPicker({
  onSelect,
}: {
  onSelect: (code: string) => void;
}) {
  const [tag, setTag] = useState<PascalTag | null>(null);
  const presets = useMemo(() => {
    const all = [...validPascalPresets, ...invalidPascalPresets];
    return tag ? all.filter((p) => p.tags.includes(tag)) : all;
  }, [tag]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TagCombobox value={tag} onChange={setTag} />
        {tag && (
          <Button variant="ghost" size="sm" onClick={() => setTag(null)}>
            Clear
          </Button>
        )}
      </div>
      <ScrollArea className="h-60 rounded-md border">
        <ul className="divide-y text-sm font-mono">
          {presets.map((preset, i) => (
            <li key={i} className="flex items-start justify-between gap-2 p-2">
              <span className="flex-1 whitespace-pre-wrap">
                {preset.code.split("\n")[0]}
                {preset.code.includes("\n") ? " ..." : ""}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelect(preset.code)}
              >
                <CopyIcon className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
