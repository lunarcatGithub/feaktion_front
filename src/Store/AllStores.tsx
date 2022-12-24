import React from 'react';

// store
import AppStore from '@Store/AppStore';
import UploadStore from '@Store/UploadStore';
import ViewStore from '@Store/ViewStore';
import HeaderStore from '@Store/HeaderStore';
import { ToastReducerStore } from '@Store/ToastReducerStore';
import { AuthMainStore } from '@Store/AuthStore';

// context
import AsyncContext from '~/Context/AsyncContext';

export default function AllStores({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <AuthMainStore>
      <ToastReducerStore>
        <AppStore>
          <UploadStore>
            <ViewStore>
              <HeaderStore>
                <AsyncContext>{children}</AsyncContext>
              </HeaderStore>
            </ViewStore>
          </UploadStore>
        </AppStore>
      </ToastReducerStore>
    </AuthMainStore>
  );
}
