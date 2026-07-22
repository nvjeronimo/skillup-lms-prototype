import type { LucideIcon, LucideProps } from "lucide-react";
import { TerminalSquare, Headphones,
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

/** Map a topic type to its representative icon (used in Saved panel + badges). */
export function topicTypeIcon(type: TopicType): LucideIcon {
  switch (type) {
    case "Video":
      return Play;
    case "Reading":
      return BookOpen;
    case "Quiz":
      return CheckSquare;
    case "Lab":
      return TerminalSquare;
    case "Podcast":
      return Headphones;
    case "VILT-Live Session":
    case "VILT-Recording":
      return VideoIcon;
    case "Activity":
      return Puzzle;
    case "Project":
      return Award;
    case "Practice Assignment":
    case "Graded Assignment":
      return Edit2;
    case "Peer-graded":
    case "Peer Review":
      return Users;
    case "Discussion Prompt":
      return MessageCircle;
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
