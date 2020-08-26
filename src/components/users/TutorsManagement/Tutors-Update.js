import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, InputNumber, Upload, DatePicker, message } from 'antd';
import { loadDetailTutorAction } from '../../../features/data/actions'
import { useDispatch, useSelector } from 'react-redux'

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export default function TutorsUpdate(props) {
    //console.log("param:", props.match.params.id)
    const [loadingImg, setLoadingImg] = useState(true);
    const [imgUrl, setImgUrl] = useState()
    //redux + hooks
    const dispatch = useDispatch();
    const data = useSelector(state => state.tutorsReducer.data);
    const loading = useSelector(state => state.tutorsReducer.loading)

    const uploadButton = () => (
        <div>
            {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {
        dispatch(loadDetailTutorAction(props.match.params.id))
        setImgUrl(data.avatar)
    }, [])
    const dateFormat = 'YYYY/MM/DD';
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not validate email!',
            number: '${label} is not a validate number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const normFile = e => {
        console.table('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoadingImg(true)
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                setImgUrl(imageUrl),
                setLoadingImg(false)
            );
        }
    };
    const onFinish = values => {
        console.table(values);
    };
    return (
        <div>
            {!loading && (
                <Form {...layout}
                    name="basic"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{
                        name: data.name,
                        age: data.age,
                        email: data.email,
                        phone: data.phone,
                        introduction: data.introduction,
                        date_of_birth: moment(data.date_of_birth, dateFormat)
                    }}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='email' label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='age' label="Age" rules={[{ type: 'number', min: 0, max: 100, required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name='phone' label="Phone" rules={[{ type: 'number', required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='introduction' label="Introduction">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name='date_of_birth' label="Date of birth">
                        <DatePicker format={dateFormat} />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="Avatar"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                    </Button>
                    </Form.Item>
                </Form>)
            }
        </div>
    )
}
