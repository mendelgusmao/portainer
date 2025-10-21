import { Authorized } from '@/react/hooks/useUser';

import { AddButton, ButtonGroup } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';
import { Button } from '@@/buttons/Button';

import { DecoratedStack } from './types';
import { RefreshCw, RotateCw, Square } from 'lucide-react';

export function TableActions({
  selectedItems,
  onRemove,
  onRestart,
  onStop,
}: {
  selectedItems: Array<DecoratedStack>;
  onRemove: (items: Array<DecoratedStack>) => void;
  onRestart: (items: Array<DecoratedStack>) => void;
  onStop: (items: Array<DecoratedStack>) => void;
}) {
  return (
    <div className="flex gap-2">
      <ButtonGroup>
        <Authorized authorizations="PortainerStackCreate">
          <Button
            color="light"
            disabled={selectedItems.length === 0}
            onClick={() => onRestart(selectedItems)}
            data-cy="stack-restartStackButton"
            icon={RefreshCw}
          >
            Restart
          </Button>
        </Authorized>

        <Authorized authorizations="PortainerStackUpdate">
          <Button
            color="light"
            disabled={selectedItems.length === 0}
            onClick={() => onStop(selectedItems)}
            data-cy="stack-stopStackButton"
            icon={Square}
          >
            Stop
          </Button>
        </Authorized>

        <Authorized authorizations="PortainerStackDelete">
          <DeleteButton
            disabled={selectedItems.length === 0}
            onConfirmed={() => onRemove(selectedItems)}
            confirmMessage="Do you want to remove the selected stack(s)? Associated services will be removed as well."
            data-cy="stack-removeStackButton"
          />
        </Authorized>
      </ButtonGroup>

      <Authorized authorizations="PortainerStackCreate">
        <AddButton data-cy="stack-addStackButton" to=".newstack">
          Add stack
        </AddButton>
      </Authorized>
    </div>
  );
}
