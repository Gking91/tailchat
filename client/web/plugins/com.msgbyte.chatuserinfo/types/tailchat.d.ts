/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="react" />

/**
 * 该文件由 Tailchat 自动生成
 * 用于插件的类型声明
 * 生成命令: pnpm run plugins:declaration:generate
 */

/**
 * Tailchat 通用
 */
declare module '@capital/common' {
  export const openModal: (
    content: React.ReactNode,
    props?: {
      closable?: boolean;
      maskClosable?: boolean;
      onCloseModal?: () => void;
    }
  ) => number;

  export const closeModal: any;
  export const ModalWrapper: any;
  export const useModalContext: any;
  export const useAppSelector: any;
  export const useUserId: any;
  export const useUserInfoList: any;
  export const UserBaseInfo: any;
  export const localTrans: any;
  export const regPluginPanelAction: any;
  export const getCachedUserInfo: any;
  export const getCachedConverseInfo: any;
  export const getGlobalState: any;
}

/**
 * Tailchat 组件
 */
declare module '@capital/component' {
  export const Button: any;
  export const Avatar: any;
  export const Space: any;
  export const Tag: any;
  export const Divider: any;
  export const Icon: React.FC<{ icon: string } & React.SVGProps<SVGSVGElement>>;
  export const UserName: React.FC<{
    userId: string;
    className?: string;
  }>;
}
