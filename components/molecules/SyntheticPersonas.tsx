import * as React from "react";
import { Users } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { FormModal } from "@/components/organisms/FormModal";
import { useLmsStore } from "@/lib/store";
import { ACTIVE_PERSONA, ACTIVE_PERSONA_ID } from "@/lib/persona-active";
import { useActivePersona } from "@/lib/persona-gate";
import { CONDITION_LABELS, PERSONAS, firstNameOf, type PersonaConditions, type PersonaId } from "@/lib/personas";
import {
  applyPlan,
  personaCookie,
  readKeptSettings,
  snapshotSettings,
  writeKeptSettings,
} from "@/lib/persona-settings";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import styles from "./SyntheticPersonas.module.css";

/*
 * Synthetic personas (Nelson, 25 Oct 2026: "Coloca o botão no submenu do profile para selecionar
 * os vários synthetic personas"): a row of the profile menu opens a modal with the seven test
 * lenses of 04-research/personas. One at a time (Nelson, same day: "Só podemos escolher uma
 * persona de cada vez"): picking one applies its conditions (settings the prototype already has)
 * and swaps the learner data for its own (lib/persona-overlay).
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


/** The labels of a persona's conditions; "No extra settings" when it brings none. */
function conditionLabels(conditions: PersonaConditions): string[] {
  return (Object.keys(conditions) as (keyof PersonaConditions)[])
    .filter((k) => conditions[k])
    .map((k) => CONDITION_LABELS[k]);
}

/** The menu row (DS Profile Menu row: 44 tall, 16 icon, body-medium/Medium text/muted), a group of its own. */
const MENU_ROW = `sk-text-body-medium-medium ${styles.menuRow}`;

/**
 * The profile menu's "Synthetic personas" row and, under it, who the prototype is showing
 * ("Viewing as Maya (P02)"), so a reviewer always sees it in the menu (no bar of its own).
 */
export function PersonasMenuRow({ onDone }: { onDone?: () => void }) {
  const active = useActivePersona();
  return (
    <div className={styles.group}>
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
        <span className={styles.menuLabel}>Synthetic personas</span>
      </button>
      {active ? (
        <p className={`sk-text-body-small-regular ${styles.viewingAs}`}>
          Viewing as {firstNameOf(active.name)} ({active.id})
        </p>
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
    if (ACTIVE_PERSONA?.conditions.mobile && useLmsStore.getState().deviceMode !== "mobile") {
      setDeviceMode("mobile");
    }
  }, [setDeviceMode]);
  return <SyntheticPersonasDialog open={open} onClose={() => setDialogOpen(false)} />;
}

function SyntheticPersonasDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [picked, setPicked] = React.useState<PersonaId | null>(null);
  React.useEffect(() => {
    if (open) setPicked(ACTIVE_PERSONA_ID);
  }, [open]);

  const apply = () => {
    if (!picked) return;
    const state = useLmsStore.getState();
    // Switching from another persona: its conditions go, the baseline kept at the first Apply comes back.
    const { settings, before } = applyPlan(
      picked,
      snapshotSettings({ ...state }),
      ACTIVE_PERSONA_ID ? readKeptSettings() : null,
    );
    writeKeptSettings(before);
    useLmsStore.setState(settings);
    document.cookie = personaCookie(picked);
    track("preview_toggle", { feature: "personas", value: picked });
    window.location.reload();
  };

  const clear = () => {
    // Nothing applied yet: Clear only empties the pick.
    if (!ACTIVE_PERSONA_ID) {
      setPicked(null);
      return;
    }
    const kept = readKeptSettings();
    if (kept) useLmsStore.setState(kept);
    writeKeptSettings(null);
    document.cookie = personaCookie(null);
    track("preview_toggle", { feature: "personas", value: "clear" });
    window.location.reload();
  };


  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Synthetic personas"
      description="Test lenses, not real learners. Pick one: the prototype takes their conditions and learner data."
      submitLabel="Apply"
      canSubmit={picked !== null && picked !== ACTIVE_PERSONA_ID}
      onSubmit={apply}
      secondaryAction={{ label: "Clear", onClick: clear, disabled: !ACTIVE_PERSONA_ID && !picked }}
    >
      {/* One choice: a radio group, real inputs under one name, so the arrow keys move the choice natively. */}
      <fieldset className={styles.list}>
        <legend className="sk-sr-only">Personas</legend>
        {PERSONAS.map((p) => {
          const checked = picked === p.id;
          const labels = conditionLabels(p.conditions);
          const summaryId = `persona-${p.id}-summary`;
          return (
            <label
              key={p.id}
              className={cn(styles.option, checked ? styles.checked : styles.unchecked)}
            >
              <input
                type="radio"
                name="synthetic-persona"
                value={p.id}
                checked={checked}
                onChange={() => setPicked(p.id)}
                aria-describedby={summaryId}
                className={styles.radio}
              />
              <span className={styles.details}>
                <span className={`sk-text-body-medium-semibold ${styles.name}`}>
                  {p.name} <span className={`sk-text-body-medium-regular ${styles.id}`}>· {p.id}</span>
                </span>
                <span className={`sk-text-body-small-medium ${styles.archetype}`}>{p.archetype}</span>
                <span id={summaryId} className={`sk-text-body-small-regular ${styles.summary}`}>
                  {p.summary}
                </span>
                <span className={styles.badges}>
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
      <p className={`sk-text-body-small-regular ${styles.note}`}>
        Apply reloads the page. Clear goes back to John Smith and to the settings you had before.
      </p>
    </FormModal>
  );
}
