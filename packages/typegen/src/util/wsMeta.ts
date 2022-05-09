// Copyright 2017-2022 @polkadot/typegen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { WebSocket } from '@polkadot/x-ws';

export async function getMetadataViaWs (endpoint: string): Promise<HexString> {
  return new Promise((resolve): void => {
    try {
      const websocket = new WebSocket(endpoint);

      websocket.onclose = (event: { code: number; reason: string }): void => {
        console.error(`disconnected, code: '${event.code}' reason: '${event.reason}'`);
        process.exit(1);
      };

      websocket.onerror = (event: unknown): void => {
        console.error(event);
        process.exit(1);
      };

      websocket.onopen = (): void => {
        console.log('connected');
        websocket.send('{"id":"1","jsonrpc":"2.0","method":"state_getMetadata","params":[]}');
      };

      websocket.onmessage = (message: { data: string }): void => {
        resolve((JSON.parse(message.data) as { result: HexString }).result);
      };
    } catch (error) {
      process.exit(1);
    }
  });
}