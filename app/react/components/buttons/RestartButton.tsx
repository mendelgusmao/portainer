import { RotateCw } from 'lucide-react';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { AutomationTestingProps } from '@/types';

import { confirmDelete } from '@@/modals/confirm';

import { Button } from './Button';
import { LoadingButton } from './LoadingButton';

type ConfirmOrClick =
  | {
      confirmMessage: ReactNode;
      onConfirmed(): Promise<void> | void;
      onClick?: never;
    }
  | {
      confirmMessage?: never;
      onConfirmed?: never;
      /** if onClick is set, will skip confirmation (confirmation should be done on the parent) */
      onClick(): void;
    };

export function RestartButton({
  disabled,
  size,
  children,
  isLoading,
  loadingText = 'Restarting',
  'data-cy': dataCy,
  ...props
}: PropsWithChildren<
  AutomationTestingProps &
    ConfirmOrClick & {
      size?: ComponentProps<typeof Button>['size'];
      disabled?: boolean;
      isLoading?: boolean;
      loadingText?: string;
    }
>) {
  if (isLoading === undefined) {
    return (
      <Button
        size={size}
        color="warninglight"
        disabled={disabled || isLoading}
        onClick={() => handleClick()}
        icon={RotateCw}
        className="!m-0"
        data-cy={dataCy}
      >
        {children || 'Restart'}
      </Button>
    );
  }

  return (
    <LoadingButton
      size={size}
      color="warninglight"
      disabled={disabled}
      onClick={() => handleClick()}
      icon={RotateCw}
      className="!m-0"
      data-cy={dataCy}
      isLoading={isLoading}
      loadingText={loadingText}
    >
      {children || 'Restart'}
    </LoadingButton>
  );

  async function handleClick() {
    const { onConfirmed, onClick } = props;
    if (onClick) {
      return onClick();
    }

    return onConfirmed();
  }
}
