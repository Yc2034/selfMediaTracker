import React from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { CarouselComponent, CarouselItemsDirective, CarouselItemDirective } from "@syncfusion/ej2-react-navigations";

import { kanbanData, kanbanGrid } from '../data/charts/topicsData';
import { Header } from '../components';

const Kanban = () => (
  
  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header category="App" title="更新的主题和系列" />
    <KanbanComponent
      id="kanban"
      keyField="Status"
      dataSource={kanbanData}
      cardSettings={{ contentField: 'Summary', headerField: 'Id'}}
      swimlaneSettings={{ keyField: "Assignee" , allowDragAndDrop: true }}
      
    >
      <ColumnsDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {kanbanGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
      </ColumnsDirective>
    </KanbanComponent>

 
  </div>
);

export default Kanban;


class App extends React.Component {
    render() {
        return (<div className='control-container'>

      </div>);
    }
}