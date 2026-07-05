import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { Node } from '@/data/entities';

interface EntityActionsMenuProps {
  entity: Node;
  onEdit: (entity: Node) => void;
  onArchive: (entity: Node) => void;
  onRestore: (entity: Node) => void;
  onHistory: (entity: Node) => void;
  trigger?: React.ReactNode;
}

const EntityActionsMenu = ({ entity, onEdit, onArchive, onRestore, onHistory, trigger }: EntityActionsMenuProps) => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const isArchived = entity.status === 'Архив';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger ?? (
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            title={t('dict.app:actionsMenu')}
          >
            <Icon name="MoreVertical" size={16} />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-border w-56" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/entity/${entity.id}`)} className="gap-2">
          <Icon name="ExternalLink" size={15} className="text-primary" />
          {t('dict.app:viewAction')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(entity)} className="gap-2">
          <Icon name="Pencil" size={15} className="text-accent" />
          {t('dict.buttons:edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onHistory(entity)} className="gap-2">
          <Icon name="History" size={15} className="text-muted-foreground" />
          {t('dict.app:historyAction')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isArchived ? (
          <DropdownMenuItem onClick={() => onRestore(entity)} className="gap-2 text-primary focus:text-primary">
            <Icon name="RotateCcw" size={15} />
            {t('dict.buttons:restore')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onArchive(entity)} className="gap-2 text-amber-400 focus:text-amber-400">
            <Icon name="Archive" size={15} />
            {t('dict.buttons:archive')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EntityActionsMenu;
