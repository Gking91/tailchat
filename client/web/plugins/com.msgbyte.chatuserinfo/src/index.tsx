import React from 'react';
import { regPluginPanelAction, openModal } from '@capital/common';
import { Translate } from './translate';
import { UserInfoModal } from './UserInfoModal';

const PLUGIN_ID = 'com.msgbyte.chatuserinfo';
const PLUGIN_NAME = 'Chat Userinfo';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);

// 注册DM面板操作按钮
regPluginPanelAction({
  name: 'chatuserinfo',
  label: Translate.viewUserInfo,
  icon: 'mdi:account-circle-outline',
  position: 'dm',
  onClick: ({ converseId }) => {
    openModal(<UserInfoModal converseId={converseId} />);
  },
});
