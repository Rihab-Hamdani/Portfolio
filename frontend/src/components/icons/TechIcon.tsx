import {
  Atom,
  Bot,
  Boxes,
  Braces,
  Code2,
  Coffee,
  Container,
  Database,
  FileCode2,
  GitBranch,
  History,
  LayoutGrid,
  Layers,
  Leaf,
  MessageSquare,
  Network,
  Palette,
  Search,
  Send,
  Server,
  Sparkles,
  Table,
  Terminal,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { GithubIcon } from './BrandIcons';

const ICONS: Record<string, LucideIcon> = {
  coffee: Coffee,
  'file-code': FileCode2,
  braces: Braces,
  terminal: Terminal,
  database: Database,
  code: Code2,
  palette: Palette,
  atom: Atom,
  layout: LayoutGrid,
  wind: Wind,
  zap: Zap,
  leaf: Leaf,
  server: Server,
  network: Network,
  layers: Layers,
  search: Search,
  sparkles: Sparkles,
  bot: Bot,
  message: MessageSquare,
  boxes: Boxes,
  git: GitBranch,
  container: Container,
  history: History,
  table: Table,
  send: Send,
};

export const TECH_ICON_NAMES = [...Object.keys(ICONS), 'github'];

export function TechIcon({ name, className }: { name?: string; className?: string }) {
  if (name === 'github') return <GithubIcon className={className} />;
  const Icon = (name && ICONS[name]) || Wrench;
  return <Icon className={className} aria-hidden />;
}
