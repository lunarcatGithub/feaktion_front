import { useContext } from 'react';
import { AppContext, appType } from '~/Store/AppStore';
import { ViewContext } from '~/Store/ViewStore';
import { UploadContext } from '~/Store/UploadStore';
import { AuthContext } from '~/App';
import { AuthMainContext } from '~/Store/AuthStore';
import { HeaderContext } from '~/Store/HeaderStore';
import { AsyncContextReducer } from '~/Context/AsyncContext';

// types
import type { AsyncStorageContextReturnType as AsyncReturnType } from '~/Context/types/contextType';

export function useAppContext(): appType {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error('appContext not found');
  return appContext;
}

export function useViewerContext() {
  const viewContext = useContext(ViewContext);
  if (!viewContext) throw new Error('ViewContext not found');
  return viewContext;
}

export function useUploadContext() {
  const uploadContext = useContext(UploadContext);
  if (!uploadContext) throw new Error('ViewContext not found');
  return uploadContext;
}

export function useAuthContext() {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('ViewContext not found');
  return authContext;
}

export function useAuthMainContext() {
  const authMainContext = useContext(AuthMainContext);
  if (!authMainContext) throw new Error('AuthMainContext not found');
  return authMainContext;
}

export function useHeaderContext() {
  const headerContext = useContext(HeaderContext);
  if (!headerContext) throw new Error('HeaderContext not found');
  return headerContext;
}

export function useAsyncContext(): AsyncReturnType {
  const asyncContext = useContext(AsyncContextReducer);
  if (!asyncContext) throw new Error('asyncContext not found');
  return asyncContext;
}
