import { RotateCw } from 'lucide-react';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { AutomationTestingProps } from '@/types';

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

export function StopButton({
  disabled,
  size,
  children,
  isLoading,
  loadingText = 'Stopping',
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
        disabled={disabled || isLoading}
        onClick={() => handleClick()}
        icon={RotateCw}
        className="!m-0 btn btn-xs btn-light"
        data-cy={dataCy}
      >
        {children || 'Stop'}
      </Button>
    );
  }

  return (
    <LoadingButton
      size={size}
      disabled={disabled}
      onClick={() => handleClick()}
      icon={RotateCw}
      className="!m-0 btn btn-xs btn-light"
      data-cy={dataCy}
      isLoading={isLoading}
      loadingText={loadingText}
    >
      {children || 'Stop'}
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
