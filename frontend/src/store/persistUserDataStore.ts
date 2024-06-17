import { StateCreator } from 'zustand';

export type UserDataType = {
  userName?: string;
  userImage?: string;
  userPhone?: string;
  userAddress?: string;
  userGender?: boolean;
  userBirthdate?: string;
  userRole?: string;
  userCreateTime?: string;
  userUpdateTime?: string;
  userEmail?: string;
  userToken?: string;
  tokenType?: string;
};

const initialValue: UserDataType = {
  userAddress: undefined,
  userBirthdate: undefined,
  userCreateTime: undefined,
  userGender: undefined,
  userImage: undefined,
  userName: undefined,
  userPhone: undefined,
  userRole: undefined,
  userUpdateTime: undefined,
  tokenType: undefined,
  userEmail: undefined,
  userToken: undefined,
};

export type UserDataAction = {
  setUserData: (val: UserDataType) => void;
  removeUserData: () => void;
};

export type UserDataSlice = UserDataType & UserDataAction;

export const createPersistUserDataSlice: StateCreator<
  UserDataSlice,
  [],
  [],
  UserDataSlice
> = set => ({
  ...initialValue,
  setUserData: val => set(state => ({ ...state, ...val })),
  removeUserData: () => {
    set(() => ({ ...initialValue }));
    localStorage.removeItem('user-data');
  },
});
