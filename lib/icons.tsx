import type { LucideIcon, LucideProps } from "lucide-react";
import {
  AlertTriangle,
  Atom,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  Edit2,
  Edit3,
  Eye,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Pencil,
  Play,
  Plus,
  Puzzle,
  Search,
  Sparkles,
  Star,
  Stars,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
  Video,
  VideoIcon,
  VideoOff,
  X,
} from "lucide-react";
import { iconStroke } from "./utils";
import type { TopicType } from "./types";

export interface IconProps extends Omit<LucideProps, "ref"> {
  /** The lucide icon component to render. */
  icon: LucideIcon;
  /** Pixel size. Drives the stroke-width rule (<24 → 1.5, >=24 → 2). */
  size?: number;
}

/**
 * Single source of truth for SVG icons. Enforces the stroke-weight rule so
 * every icon in the app respects 1.5px (<24) / 2px (>=24) automatically.
 * Color is left to `currentColor` so callers bind via text-sk-* tokens.
 */
export function Icon({ icon: IconCmp, size = 20, strokeWidth, ...rest }: IconProps) {
  return <IconCmp size={size} strokeWidth={strokeWidth ?? iconStroke(size)} {...rest} />;
}

/**
 * Map a topic type to its icon (used in Saved panel + Topic-Types badges).
 * These mirror the SKO DS `LMS / Topic-Types Badge` component 1:1 — the
 * comment on each case is the Untitled UI icon name used in Figma, and the
 * lucide glyph returned is its direct equivalent.
 */
export function topicTypeIcon(type: TopicType): LucideIcon {
  switch (type) {
    case "Video":
      return Play; // play
    case "Reading":
      return BookOpen; // book-open-01
    case "Quiz":
      return HelpCircle; // help-circle
    case "Lab":
      return Atom; // atom-01
    case "Podcast":
      return Music; // music-note-01
    case "Lesson Page":
      return Layers; // no DS badge variant — kept as-is
    case "VILT-Live Session":
      return Video; // video-recorder
    case "VILT-Recording":
      return VideoOff; // video-recorder-off
    case "Activity":
      return Lightbulb; // lightbulb-02
    case "Project":
      return Briefcase; // briefcase-01
    case "Practice Assignment":
      return Pencil; // edit-02
    case "Graded Assignment":
      return Award; // award-01
    case "Peer-graded":
      return Users; // users-01
    case "Peer Review":
      return Eye; // eye
    case "Discussion Prompt":
      return MessageCircle; // message-circle-01
    default:
      return BookOpen;
  }
}

export {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  Edit2,
  Edit3,
  FileText,
  Info,
  Lock,
  MessageCircle,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Plus,
  Puzzle,
  Search,
  Sparkles,
  Star,
  Stars,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
  Video,
  VideoIcon,
  X,
};
