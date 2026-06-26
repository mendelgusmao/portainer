import { useMutation } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { buildStackUrl } from '@/react/common/stacks/queries/buildUrl';
import { Stack } from '@/react/common/stacks/types';

type StartStackPayload = {
  id: Stack['Id'];
  environmentId?: number;
  forceRecreate?: boolean;
};

export function useStartStackMutation(options?: {
  forceRecreate?: boolean;
}) {
  return useMutation({
    mutationFn: (payload: StartStackPayload) =>
      startStack({
        ...payload,
        forceRecreate: payload.forceRecreate ?? options?.forceRecreate,
      }),
  });
}

async function startStack({
  id,
  environmentId,
  forceRecreate,
}: StartStackPayload) {
  try {
    const { data } = await axios.post<Stack>(
      buildStackUrl(id, 'start'),
      undefined,
      { params: { endpointId: environmentId, forceRecreate } }
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to start stack');
  }
}
