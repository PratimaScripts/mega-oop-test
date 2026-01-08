import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

function confirmModal({ title = 'Confirm', message = "Are you sure?",
    onOKFunction = f => f, okText = "Ok", cancelText = "Cancel" }) {
    Modal.confirm({
        title: title,
        icon: <ExclamationCircleOutlined />,
        content: message,
        okText: okText,
        onOk: onOKFunction,
        cancelText: cancelText,
    });
}

export default confirmModal;