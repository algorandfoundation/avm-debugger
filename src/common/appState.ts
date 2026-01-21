import type { AvmValue, AvmKeyValue, ApplicationInitialStates } from '@algorandfoundation/algokit-utils/algod-client';
import { hexToBytes } from '@algorandfoundation/algokit-utils/common';
import { ByteArrayMap } from './utils';

export class AppState {
  globalState: ByteArrayMap<AvmValue>;
  localState: Map<string, ByteArrayMap<AvmValue>>;
  boxState: ByteArrayMap<AvmValue>;

  constructor() {
    this.globalState = new ByteArrayMap<AvmValue>();
    this.localState = new Map<string, ByteArrayMap<AvmValue>>();
    this.boxState = new ByteArrayMap<AvmValue>();
  }

  public globalStateArray(): AvmKeyValue[] {
    return createAvmKvArray(this.globalState);
  }

  public localStateArray(account: string): AvmKeyValue[] {
    const map = this.localState.get(account);
    if (!map) {
      return [];
    }
    return createAvmKvArray(map);
  }

  public boxStateArray(): AvmKeyValue[] {
    return createAvmKvArray(this.boxState);
  }

  public clone(): AppState {
    const clone = new AppState();
    clone.globalState = this.globalState.clone();
    clone.localState = new Map(
      Array.from(this.localState.entries(), ([key, value]) => [
        key,
        value.clone(),
      ]),
    );
    clone.boxState = this.boxState.clone();
    return clone;
  }

  public static fromAppInitialState(
    initialState: ApplicationInitialStates,
  ): AppState {
    const state = new AppState();

    if (initialState.appGlobals) {
      for (const { key, value } of initialState.appGlobals.kvs) {
        state.globalState.set(key, value);
      }
    }

    for (const appLocal of initialState.appLocals || []) {
      const map = new ByteArrayMap<AvmValue>();
      for (const { key, value } of appLocal.kvs) {
        map.set(key, value);
      }
      state.localState.set(appLocal.account!.toString(), map);
    }

    if (initialState.appBoxes) {
      for (const { key, value } of initialState.appBoxes.kvs) {
        state.boxState.set(key, value);
      }
    }

    return state;
  }
}

function createAvmKvArray(map: ByteArrayMap<AvmValue>): AvmKeyValue[] {
  return Array.from(map.entriesHex())
    .sort()
    .map(([key, value]) => ({
      key: hexToBytes(key),
      value,
    }));
}
