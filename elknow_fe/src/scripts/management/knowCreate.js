import React, {Component} from 'react';
import {
  Form, Select, InputNumber, Switch,
   Button, Upload, Icon, Input, DatePicker
} from 'antd';
import $ from 'jquery';

const FormItem = Form.Item;
const Option = Select.Option;

class KnowCreate extends Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let files = [];
        console.log('Received values of form: ', values);
         if(!!values.files&&values.files.length>0) {
            values.files.forEach((item, index) => {
                files.push(item.response);
            })
         }
         let data = {
                title: values.title,
                type: values.type,
                teacher: values.teacher,
                hours: !!values.hours?values.hours:0,
                isOnline: !!values.switch?1:0,
                abstract: values.abstract,
                cover: (!!values.cover&&!!values.cover[0])?values.cover[0].response:'',
                files: files.join(','),
                dateTime: values.dateTime?values.dateTime.toJSON():''
            };
         $.ajax({
            url: '//127.0.0.1:8000/course/save',
            type: 'post',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: res => {
                if(res.status === 0) {
                    
                } else {

                }
            }
        })
      }
    });
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          {...formItemLayout}
          label="标题"
        >{getFieldDecorator('title', {
            rules: [
              { required: true, message: '请输入知识标题!' },
            ],
          })(
          <Input placeholder="请输入知识标题"/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="知识类型"
          hasFeedback
        >
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: '请选择你的知识类型!' },
            ],
          })(
            <Select placeholder="请选择你的知识类型">
              <Option value="1">课程</Option>
              <Option value="2">报告</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="老师"
        >
        {getFieldDecorator('teacher', {
            rules: [
              { required: true, message: '请输入讲师名!' },
            ],
          })(
          <Input placeholder="请输入讲师名"/>)}
        </FormItem>

        {
            +this.props.form.getFieldValue('type') === 1?
            <FormItem
              {...formItemLayout}
              label="课时"
            >
              {getFieldDecorator('hours', { initialValue: 3 })(
                <InputNumber min={1} max={100} />
              )}
              <span className="ant-form-text"> 小时</span>
            </FormItem>:
            <FormItem
              {...formItemLayout}
              label="活动时间"
            >
              {getFieldDecorator('dateTime', {
                rules: [
                  { required: true, message: '请选择活动时间!' },
                ],
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label="是否发布上线"
        >
          {getFieldDecorator('switch', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="简介"
        >
          {getFieldDecorator('abstract', {
            rules: [
              { required: true, message: '请输入知识简介!' },
            ],
          })(
          <Input placeholder="请输入知识简介" type="textarea" rows={4}/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="知识封面"
        >
          {getFieldDecorator('cover', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="//localhost:8000/upload/" listType="picture" 
                withCredentials={true}>
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="附件（文件或者视频）"
        >
          <div className="dropbox">
            {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload.Dragger name="files" action="//localhost:8000/upload/">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

KnowCreate = Form.create()(KnowCreate);

export default KnowCreate;