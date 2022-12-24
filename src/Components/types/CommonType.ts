import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type OnScrollEvent = (
  event: NativeSyntheticEvent<NativeScrollEvent>,
) => void;
