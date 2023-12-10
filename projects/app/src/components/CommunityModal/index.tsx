import React from 'react';
import { Button, ModalFooter, ModalBody } from '@chakra-ui/react';
import MyModal from '../MyModal';
import { useTranslation } from 'next-i18next';
import Markdown from '../Markdown';
import { feConfigs } from '@/web/common/system/staticData';

const CommunityModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  // * 客服微信: [FastGPT GitHub](https://github.com/labring/FastGPT)\n
  const modalContent = "* 客服微信: ![](/imgs/wechat-l.jpg)";
  return (
    <MyModal
      isOpen={true}
      onClose={onClose}
      iconSrc="/imgs/modal/concat.svg"
      title={t('home.Community')}
    >
      <ModalBody textAlign={'center'}>
        <Markdown source={modalContent} />
      </ModalBody>

      <ModalFooter>
        <Button variant={'base'} onClick={onClose}>
          关闭
        </Button>
      </ModalFooter>
    </MyModal>
  );
};

export default CommunityModal;
