
export const gridOrderImage = (props) => (
    <div>
      <img
        className="rounded-xl h-20 md:ml-3"
        src={props.ProductImage}
        alt="order-item"
      />
    </div>
  );

  export const gridOrderStatus = (props) => (
    <button
      type="button"
      style={{ background: props.StatusBg }}
      className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
      {props.Status}
    </button>
  );
  
  
export const contextMenuItems = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Delete',
    'Save',
    'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport',
    'FirstPage',
    'PrevPage',
    'LastPage',
    'NextPage',
  ];
  
export const ordersGrid = [
    {
      headerText: 'Image',
      template: gridOrderImage,
      textAlign: 'Center',
      width: '120',
    },
    {
      field: 'OrderTitles',
      headerText: '题目',
      width: '150',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    { field: 'Author',
      headerText: '作者',
      width: '150',
      textAlign: 'Center',
    },
    {
      field: 'Platform',
      headerText: '平台',
      width: '120',
      textAlign: 'Center',
    },
    {
      field: 'Topics',
      headerText: '主题/赞',
      format: 'C2',
      textAlign: 'Center',

      width: '150',
    },
    {
      headerText: 'Status',
      template: gridOrderStatus,
      field: 'OrderItems',
      textAlign: 'Center',
      width: '120',
    },
 
  

  ];
  
  
 