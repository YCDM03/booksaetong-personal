'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal } from 'antd';

type ConfirmType = {
  open: boolean;
  message: string;
  okHandlerFn: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function Confirm({ open = false, setOpen, message = '', okHandlerFn }: ConfirmType) {
  useEffect(() => {
    if (open) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [open]);

  const handleOk = () => {
    okHandlerFn();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      title=""
      onOk={handleOk}
      onCancel={handleCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <div className={'flex gap-2 justify-center'}>
          <CancelBtn />
          <OkBtn />
        </div>
      )}
    >
      <p className={'mt-[15px] text-lg'}> {message}</p>
    </Modal>
  );
}

export default Confirm;
