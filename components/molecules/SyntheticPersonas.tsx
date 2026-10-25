"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { FormModal } from "@/components/organisms/FormModal";
import { useLmsStore } from "@/lib/store";
import { ACTIVE_PERSONA_IDS } from "@/lib/persona-active";
import { useActivePersonaIds } from "@/lib/persona-gate";
import {
  CONDITION_LABELS,
  PERSONAS,
  firstNameOf,
  getPersona,
  unionConditions,
  type PersonaConditions,
  type PersonaId,
} from "@/lib/personas";
import {
  applyPlan,
  personaCookie,
  readKeptSettings,
  snapshotSettings,
  writeKeptSettings,
} from "@/lib/persona-settings";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/*
 * Synthetic personas (Nelson, 25 Oct 2026: "Coloca o botão no submenu do profile para selecionar
 * os vários synthetic personas"): a row of the profile menu opens a modal with the seven test
 * lenses of 04-research/personas. Picking one or more applies their conditions (settings the
 * prototype already has) and swaps the learner data for the first one's (lib/persona-overlay).
 * The modal lives outside the menu (ResponsiveShell hosts it once), since the menu closes when
 * the row is pressed.
 */

/* ── Open state, shared by the row and the one host ─────────────────────────────────── */

let dialogOpen = false;
const listeners = new Set<() => void>();
function setDialogOpen(open: boolean) {
  dialogOpen = open;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** "Maya (P02) + Sara (P06)". */
export function viewingAs(ids: readonly PersonaId[]): string {
  return ids
    .map((id) => {
      const p = getPersona(id);
      return p ? `${firstNameOf(p.name)} (${p.id})` : id;
    })
    .join(" + ");
}

/** The labels of a persona's conditions; "No extra settings" when it brings none. */
function conditionLabels(conditions: PersonaConditions): string[] {
  return (Object.keys(conditions) as (keyof PersonaConditions)[])
    .filter((k) => conditions[k])
    .map((k) => CONDITION_LABELS[k]);
}

/** The menu row (DS Profile Menu row: 44 tall, 16 icon, body-medium/Medium text/muted), a group of its own. */
const MENU_ROW =
  "sk-text-body-medium-medium flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sko-text-muted transition-colors hover:bg-sko-bg-subtle hover:text-sko-text-default";

/**
 * The profile menu's "Synthetic personas" row: the count of active ones beside the label and,
 * under it, who the prototype is showing ("Viewing as Maya (P02) + Sara (P06)"), so a reviewer
 * always sees it in the menu (no bar of its own).
 */
export function PersonasMenuRow({ onDone }: { onDone?: () => void }) {
  const active = useActivePersonaIds();
  return (
    <div className="flex flex-col gap-1 border-t border-sko-border-subtle px-4 py-3">
      <button
        type="button"
        aria-haspopup="dialog"
        className={MENU_ROW}
        onClick={() => {
          onDone?.();
          setDialogOpen(true);
        }}
      >
        <Icon icon={Users} size={16} />
        <span className="flex-1">Synthetic personas</span>
        {active.length ? (
          <Badge color="brand" size="sm">
            <span className="sr-only">Active: </span>
            {active.length}
          </Badge>
        ) : null}
      </button>
      {active.length ? (
        <p className="sk-text-body-small-regular px-3 text-sko-text-subtle">Viewing as {viewingAs(active)}</p>
      ) : null}
    </div>
  );
}

/**
 * The modal and the persona conditions that do not survive a reload: rendered once, by
 * ResponsiveShell. The preview device is not kept by the store, so a persona that asks for the
 * 375 mobile preview sets it again on every load.
 */
export function SyntheticPersonasHost() {
  const open = React.useSyncExternalStore(subscribe, () => dialogOpen, () => false);
  const setDeviceMode = useLmsStore((s) => s.setDeviceMode);
  React.useEffect(() => {
    if (unionConditions(ACTIVE_PERSONA_IDS).mobile && useLmsStore.getState().deviceMode !== "mobile") {
      setDeviceMode("mobile");
    }
  }, [setDeviceMode]);
  return <SyntheticPersonasDialog open={open} onClose={() => setDialogOpen(false)} />;
}

function SyntheticPersonasDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [picked, setPicked] = React.useState<PersonaId[]>([]);
  React.useEffect(() => {
    if (open) setPicked([...ACTIVE_PERSONA_IDS]);
  }, [open]);

  const toggle = (id: PersonaId, on: boolean) =>
    setPicked((list) => (on ? (list.includes(id) ? list : [...list, id]) : list.filter((x) => x !== id)));

  const apply = () => {
    const state = useLmsStore.getState();
    const { settings, before } = applyPlan(
      picked,
      snapshotSettings({ ...state }),
      ACTIVE_PERSONA_IDS.length ? readKeptSettings() : null,
    );
    writeKeptSettings(before);
    useLmsStore.setState(settings);
    document.cookie = personaCookie(picked);
    track("preview_toggle", { feature: "personas", value: picked.join(",") });
    window.location.reload();
  };

  const clear = () => {
    // Nothing applied yet: Clear only empties the picks.
    if (ACTIVE_PERSONA_IDS.length === 0) {
      setPicked([]);
      return;
    }
    const kept = readKeptSettings();
    if (kept) useLmsStore.setState(kept);
    writeKeptSettings(null);
    document.cookie = personaCookie([]);
    track("preview_toggle", { feature: "personas", value: "clear" });
    window.location.reload();
  };

  const nothingOn = ACTIVE_PERSONA_IDS.length === 0;

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Synthetic personas"
      description="Test lenses, not real learners. Pick one or more: the prototype takes their conditions and the first one’s learner data."
      submitLabel="Apply"
      canSubmit={picked.length > 0}
      onSubmit={apply}
      secondaryAction={{ label: "Clear", onClick: clear, disabled: nothingOn && picked.length === 0 }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Personas</legend>
        {PERSONAS.map((p) => {
          const order = picked.indexOf(p.id);
          const checked = order >= 0;
          const labels = conditionLabels(p.conditions);
          const summaryId = `persona-${p.id}-summary`;
          return (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-control border px-3 py-2.5 transition-colors",
                checked ? "border-sko-border-primary bg-sko-bg-primary-soft" : "border-sko-border-subtle hover:bg-sko-bg-hover",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => toggle(p.id, e.target.checked)}
                aria-describedby={summaryId}
                className="mt-0.5 size-4 shrink-0 rounded-inner accent-[var(--color-bg-primary)]"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="sk-text-body-medium-semibold text-sko-text-default">
                    {p.name} <span className="sk-text-body-medium-regular text-sko-text-subtle">· {p.id}</span>
                  </span>
                  {order === 0 ? (
                    <Badge color="brand" size="sm">
                      Learner data
                    </Badge>
                  ) : null}
                </span>
                <span className="sk-text-body-small-medium text-sko-text-muted">{p.archetype}</span>
                <span id={summaryId} className="sk-text-body-small-regular text-sko-text-subtle">
                  {p.summary}
                </span>
                <span className="flex flex-wrap gap-1 pt-0.5">
                  {labels.length ? (
                    labels.map((l) => (
                      <Badge key={l} color="gray" size="sm">
                        {l}
                      </Badge>
                    ))
                  ) : (
                    <Badge color="gray" variant="modern" size="sm">
                      No extra settings
                    </Badge>
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="sk-text-body-small-regular text-sko-text-subtle">
        Apply reloads the page. Clear goes back to John Smith and to the settings you had before.
      </p>
    </FormModal>
  );
}
