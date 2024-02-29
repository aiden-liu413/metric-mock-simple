import React, {useEffect, useState} from 'react';
import {Button, Select, Space, Transfer, TransferProps} from 'antd'
import {ciList} from '@/services/ant-design-pro/api';


export default () => {
  const [dataCenterList, setDataCenterList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleSelectChange = (value) => {
    console.log(`selected ${value}`);
    getRoomData(value);
  };

  const handleTransferChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleTransferSearch: TransferProps['onSearch'] = (dir, value) => {
    console.log('search:', dir, value);
  };

  const handleTransferSubmit = () => {
    console.log('search:', dir, value);
  };

  const filterOption = (inputValue: string, option: RecordType) =>
    option.title.indexOf(inputValue) > -1;


  function getRoomData(dataCenterId){
    ciList('room', {}, {
      dataCenterId: dataCenterId,
      accountId: '110',
      userId: '1'
    }).then(data=> {
      setRoomList(data.data.map(item => {
        var temp = {};

        temp.title = item.ci_name;
        temp.key = item.ci_id;
        temp.chosen = false;
        return temp;
      }));
    })
  }
  function getDataCenterdata(){
    ciList('dataCenter', {}, {
      accountId: '110',
      userId: '1'
    }).then(data=> {
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
        <Button type="primary"  style={{ float: 'right', margin: 5 }} onClick={handleTransferSubmit}>
          MOCK
        </Button>
      );
    }
  };

  useEffect(() => {
    getDataCenterdata();
  }, [])

  return (<>
    <Select
      onChange={handleSelectChange}
      defaultValue=""
      style={{width: 200}}
      allowClear
      /*value={dataCenterList[0]}*/
      options={dataCenterList}
    />
    <br/>
    <Transfer
      dataSource={roomList}
      listStyle={{width: 400, height: 500}}
      showSearch
      filterOption={filterOption}
      targetKeys={targetKeys}
      onChange={handleTransferChange}
      onSearch={handleTransferSearch}
      render={(item) => item.title}
      footer={renderFooter}
    />
  </>)
};
