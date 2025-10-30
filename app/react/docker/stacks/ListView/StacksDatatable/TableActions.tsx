import { Authorized } from '@/react/hooks/useUser';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';
import { RestartButton } from '@@/buttons/RestartButton';
import { StopButton } from '@@/buttons/StopButton';

import { DecoratedStack } from './types';

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
    <div className="flex items-center gap-2">
      <Authorized authorizations="PortainerStackUpdate">
        <RestartButton
          disabled={selectedItems.length === 0}
          onClick={() => onRestart(selectedItems)}
          data-cy="stack-restartStackButton"
        />
      </Authorized>

      <Authorized authorizations="PortainerStackUpdate">
        <StopButton
          disabled={selectedItems.length === 0}
          onClick={() => onStop(selectedItems)}
          data-cy="stack-stopStackButton"
        />
      </Authorized>

      <Authorized authorizations="PortainerStackDelete">
        <DeleteButton
          disabled={selectedItems.length === 0}
          onConfirmed={() => onRemove(selectedItems)}
          confirmMessage="Do you want to remove the selected stack(s)? Associated services will be removed as well."
          data-cy="stack-removeStackButton"
        />
      </Authorized>

      <Authorized authorizations="PortainerStackCreate">
        <AddButton data-cy="stack-addStackButton" to=".newstack">
          Add stack
        </AddButton>
      </Authorized>
    </div>
  );
}
