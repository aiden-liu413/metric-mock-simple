import React, {useEffect, useState} from 'react';
import {
  Button, Form,
  GetProp,
  Input, notification,
  Select,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Tooltip,
  Transfer,
  message,
  TransferProps, Space
} from 'antd'
import {alarmMock, ciList} from '@/services/ant-design-pro/api';
import localStorage from "localStorage";
import difference from 'lodash/difference';
import type {FormInstance} from 'antd/es/form';


type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource;
  leftColumns: TableColumnsType<any>;
  rightColumns: TableColumnsType<any>;
}

// Customize Table Transfer
const TableTransfer = ({leftColumns, rightColumns, ...restProps}: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({disabled: listDisabled || item.disabled}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({key}) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({key}, selected) {
          console.log(key + selected)
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          tableLayout='fixed'
          columns={columns}
          pagination={{pageSize: 10}}
          dataSource={filteredItems}
          size="small"
          style={{overflow: 'auto', maxHeight: 300, pointerEvents: listDisabled ? 'none' : undefined}}
          onRow={({key, disabled: itemDisabled}) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              try {
                onItemSelect(key as string, !listSelectedKeys.includes(key as string));
              } catch (e) {
                throw new Error("select table item failed");
              }
            },
          })}
        />
      );
    }}
  </Transfer>
);


export default () => {
  const [dataCenter, setDataCenter] = useState('');
  const [topic, setTopic] = useState('');
  const [dataCenterList, setDataCenterList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const formRef = React.useRef<FormInstance>(null);


  const handleSelectChange = (value) => {
    setDataCenter(value);

    getRoomData(value);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value: inputValue} = e.target;
    console.log('value:' + inputValue);
    setTopic(inputValue)
    localStorage.setItem("alarm.topic." + dataCenter, inputValue);
  };


  const handleTransferChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleTransferSearch: TransferProps['onSearch'] = (dir, value) => {
    console.log('search:', dir, value);
  };

  const handleTransferSubmit = () => {
    alarmMock({
      roomIdList: targetKeys.join(","),
      topic: topic
    }, {
      dataCenterId: dataCenter,
      accountId: '110',
      userId: '1'
    }).then(data => {
      message.success('MOCK 成功');
    })
    localStorage.setItem("alarm.targetKeys." + dataCenter, JSON.stringify(targetKeys));
  };

  const filterOption = (inputValue: string, option: RecordType) =>
    option.title.indexOf(inputValue) > -1;


  function getRoomData(dataCenterId) {
    ciList('room', {}, {
      dataCenterId: dataCenterId,
      accountId: '110',
      userId: '1'
    }).then(data => {
      setRoomList(data.data.map(item => {
        var temp = {};

        temp.title = item.ci_name;
        temp.key = item.ci_id;
        temp.chosen = false;
        temp.belongToDataCenter = item.belongToDataCenter.ciName;
        temp.belongToBuilding = item.belongToBuilding.ciName;
        temp.belongToStorey = item.belongToStorey.ciName;
        temp.content = item;

        return temp;
      }));

      let topicStr = localStorage.getItem("alarm.topic." + dataCenterId);
      console.log("topic-" + topicStr)
      if (null !== topicStr) {
        setTopic(topicStr)
        console.log("topic2-" + topicStr)
        formRef.current?.setFieldsValue({kafkaTopic: topicStr});

      }

      let itemStr = localStorage.getItem("alarm.targetKeys." + dataCenterId);
      if (null !== itemStr) {
        setTargetKeys(JSON.parse(itemStr))
      }
    })
  }

  function getDataCenterdata() {
    ciList('dataCenter', {}, {
      accountId: '110',
      userId: '1'
    }).then(data => {
      setDataCenterList(data.data.map(item => {
        var temp = {};

        temp.label = item.ci_name;
        temp.value = item.ci_id;
        return temp;
      }));
    })
  }

  const renderFooter: TransferProps['footer'] = (_, info) => {
    if (info?.direction === 'right') {
      return (
        <Button htmlType="submit" type="primary" style={{float: 'right', margin: 5}}>
          MOCK
        </Button>
      );
    }
  };

  const tableColumns = [
    {
      width: 100,
      dataIndex: 'title',
      title: 'ciName',
      ellipsis: true,
      fixed: 'left',
      render: (ciName) => (
        <Tooltip placement="topLeft" title={ciName}>
          {ciName}
        </Tooltip>
      ),
    },
    {
      width: 80,
      dataIndex: 'belongToDataCenter',
      title: '所属数据中心',
      fixed: 'left',
      ellipsis: true,
      render: (tag) =>
        <Tag>
          <Tooltip placement="topLeft" title={tag}>
            {tag}
          </Tooltip>
        </Tag>,
    },
    {
      /*width: 120,*/
      dataIndex: 'belongToBuilding',
      title: '所属楼宇',
      render: (tag) =>
        <Tag>
          <Tooltip placement="topLeft" title={tag}>
            {tag}
          </Tooltip>
        </Tag>,
    },
    {
      /*width: 120,*/
      dataIndex: 'belongToStorey',
      title: '所属楼层',
      render: (tag) =>
        <Tag>
          <Tooltip placement="topLeft" title={tag}>
            {tag}
          </Tooltip>
        </Tag>,
    }
  ];

  useEffect(() => {
    getDataCenterdata();
  }, [])

  return <>
    <Form
      ref={formRef}
      onFinish={handleTransferSubmit}
      name="trigger" style={{maxWidth: 600}} layout="vertical" autoComplete="off">
      <Space size={372}>
        <Form.Item
          hasFeedback
          label="数据中心"
          name="dataCenter"
          rules={[{required: true, message: '请选择数据中心!'}]}>
          <Select
            onChange={handleSelectChange}
            defaultValue=""
            style={{width: 200}}
            allowClear
            options={dataCenterList}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="kafka topic"
          name="kafkaTopic"
          id="kafkaTopic"
          value={topic}
          rules={[{required: true, message: '请填写kafka toipc!'}]}>
          <Input
            id="kafkaTopic"
            style={{width: 200}}
            onChange={handleTopicChange}/>
        </Form.Item>
      </Space>
      <Form.Item
        hasFeedback
        label="房间列表"
        style={{width: 1100, height: 450}}
        name="roomList">
        <TableTransfer
          dataSource={roomList}
          listStyle={{width: 400, height: 450}}
          /*listHeight={500}*/
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          onSearch={handleTransferSearch}
          render={(item) => item.title}
          footer={renderFooter}
          leftColumns={tableColumns}
          rightColumns={tableColumns}
        />
      </Form.Item>
    </Form>
  </>
};
