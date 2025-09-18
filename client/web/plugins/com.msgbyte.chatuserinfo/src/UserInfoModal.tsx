import React from 'react';
import {
  ModalWrapper,
  useModalContext,
  getCachedUserInfo,
  getCachedConverseInfo,
  getGlobalState,
} from '@capital/common';
import {
  Avatar,
  Button,
  Space,
  Tag,
  Divider,
  Icon,
  UserName,
} from '@capital/component';
import { Translate } from './translate';

interface UserInfoModalProps {
  converseId: string;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = React.memo(
  ({ converseId }) => {
    const { closeModal } = useModalContext();
    const [userInfos, setUserInfos] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const loadUserInfo = async () => {
        try {
          setLoading(true);
          setError(null);

          // 获取会话信息
          const converseInfo = await getCachedConverseInfo(converseId);
          if (!converseInfo) {
            throw new Error('无法获取会话信息');
          }

          // 获取当前用户ID
          const globalState = getGlobalState();
          const currentUserId = globalState.user?.info?._id;

          if (!currentUserId) {
            throw new Error('无法获取当前用户信息');
          }

          // 过滤掉当前用户，获取其他成员的ID
          const otherUserIds = converseInfo.members.filter(
            (memberId: string) => memberId !== currentUserId
          );

          if (otherUserIds.length === 0) {
            throw new Error('没有找到其他用户');
          }

          // 获取所有其他用户的信息
          const usersInfo = await Promise.all(
            otherUserIds.map(async (userId: string) => {
              return await getCachedUserInfo(userId);
            })
          );

          setUserInfos(usersInfo.filter(Boolean)); // 过滤掉null/undefined
        } catch (err) {
          console.error('获取用户信息失败:', err);
          setError(err instanceof Error ? err.message : '获取用户信息失败');
        } finally {
          setLoading(false);
        }
      };

      loadUserInfo();
    }, [converseId]);

    if (loading) {
      return (
        <ModalWrapper title={Translate.viewUserInfo}>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>加载中...</span>
            </div>
          </div>
        </ModalWrapper>
      );
    }

    if (error) {
      return (
        <ModalWrapper title={Translate.viewUserInfo}>
          <div className="p-4 text-center">
            <div className="text-red-500 mb-4">
              <Icon icon="mdi:alert-circle" className="text-2xl mb-2" />
              <p>{error}</p>
            </div>
            <Button onClick={closeModal} type="primary">
              {Translate.close}
            </Button>
          </div>
        </ModalWrapper>
      );
    }

    if (userInfos.length === 0) {
      return (
        <ModalWrapper title={Translate.viewUserInfo}>
          <div className="p-4 text-center">
            <p>{Translate.noUserInfo}</p>
            <Button onClick={closeModal} type="primary" className="mt-4">
              {Translate.close}
            </Button>
          </div>
        </ModalWrapper>
      );
    }

    return (
      <ModalWrapper title={Translate.viewUserInfo}>
        <div className="max-h-96 overflow-y-auto p-4">
          {userInfos.map((userInfo, index) => (
            <div key={userInfo._id} className="mb-6">
              {/* 用户头像和基本信息 */}
              <div className="flex items-start space-x-4 mb-4">
                <Avatar
                  size={80}
                  src={userInfo.avatar}
                  name={userInfo.nickname}
                />
                <div className="flex-1">
                  <div className="text-xl mb-2">
                    <span className="font-semibold">
                      <UserName userId={userInfo._id} />
                    </span>
                    <span className="opacity-60 ml-1">
                      #{userInfo.discriminator}
                    </span>
                  </div>

                  <Space size={4} wrap={true} className="mb-2">
                    {userInfo.type === 'openapiBot' && (
                      <Tag color="orange">{Translate.openApiBot}</Tag>
                    )}

                    {userInfo.type === 'pluginBot' && (
                      <Tag color="orange">{Translate.pluginBot}</Tag>
                    )}

                    {userInfo.temporary && (
                      <Tag color="processing">{Translate.guest}</Tag>
                    )}
                  </Space>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <Icon icon="mdi:account" className="mr-2" />
                  <span className="font-medium">{Translate.userId}:</span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                    {userInfo._id}
                  </code>
                </div>

                {userInfo.email && (
                  <div className="flex items-center">
                    <Icon icon="mdi:email" className="mr-2" />
                    <span className="font-medium">{Translate.email}:</span>
                    <span className="ml-2">{userInfo.email}</span>
                  </div>
                )}

                {userInfo.createdAt && (
                  <div className="flex items-center">
                    <Icon icon="mdi:clock" className="mr-2" />
                    <span className="font-medium">
                      {Translate.registrationTime}:
                    </span>
                    <span className="ml-2">
                      {new Date(userInfo.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {userInfo.updatedAt && (
                  <div className="flex items-center">
                    <Icon icon="mdi:update" className="mr-2" />
                    <span className="font-medium">{Translate.lastUpdate}:</span>
                    <span className="ml-2">
                      {new Date(userInfo.updatedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* 如果有多个用户，添加分隔线 */}
              {index < userInfos.length - 1 && <Divider className="my-4" />}
            </div>
          ))}
        </div>

        <div className="text-right p-4 border-t">
          <Button onClick={closeModal} type="primary">
            {Translate.close}
          </Button>
        </div>
      </ModalWrapper>
    );
  }
);
UserInfoModal.displayName = 'UserInfoModal';
