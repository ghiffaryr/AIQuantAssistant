import { create } from 'zustand';
import { CartSlice } from './storeType';
import { createCartSlice } from './cartStore';
import { WithSelectors } from '@/utils/type';
import { StoreApi, UseBoundStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import {
  UserDataSlice,
  UserDataType,
  createPersistUserDataSlice,
} from './persistUserDataStore';
import { DEV } from '@/env/env';

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
};

const omittedKey: (keyof UserDataType)[] = [
  'userAddress',
  'userBirthdate',
  'userCreateTime',
  'userGender',
  'userImage',
  'userName',
  'userPhone',
  'userRole',
  'userUpdateTime',
  'userEmail',
  'userToken',
  'tokenType',
];

const useBoundStoreBase = create<CartSlice & UserDataSlice>()(
  persist(
    (...a) => ({
      ...createPersistUserDataSlice(...a),
      ...createCartSlice(...a),
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            (omittedKey as string[]).includes(key),
          ),
        ),
    },
  ),
);

if (DEV) {
  mountStoreDevtool('Store', useBoundStoreBase);
}

const useBoundStore = createSelectors(useBoundStoreBase);

export default useBoundStore;
