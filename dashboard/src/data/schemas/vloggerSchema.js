
const gridEmployeeProfile = (props) => (
    <div className="flex items-center gap-2">
      <img
        className="rounded-full w-10 h-10"
        src={props.EmployeeImage}
        alt="vlogger"
      />
      <p>{props.Name}</p>
    </div>
  );
  
  
export const employeesGrid = [
    { headerText: '博主',
      width: '150',
      template: gridEmployeeProfile,
      textAlign: 'Center' },

    { field: 'Name',
      headerText: '',
      width: '0',
      textAlign: 'Center',
    },

    { field: 'Platform',
      headerText: '主要平台',
      width: '170',
      textAlign: 'Center',
    },

    { field: 'Styles',
      headerText: '风格',
      width: '120',
      textAlign: 'Center' },

    { field: 'FansNumber',
      headerText: '粉丝量级',
      width: '125',
      textAlign: 'Center' },

      { field: 'PostsNumber',
      headerText: '更新数',
      width: '135',
      textAlign: 'Center' },
  ];
  
   

