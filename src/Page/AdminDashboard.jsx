import { BsSearch } from "react-icons/bs";
const AdminDashboard = () => {
  const studentClick = () => {
    alert("Student Div Click");
  };
  return (
    <>
      <div className="searchbar">
        <input type="text" placeholder="Search.." />
        <BsSearch className="search-icon" />
      </div>
      <div className="adminMain">
        <div onClick={studentClick} className="adminInner">
          <h1>Student</h1>
        </div>
        <div className="adminInner">
          <h1>Supervisor</h1>
        </div>
        <div className="adminInner">
          <h1>Committe</h1>
        </div>
        <div className="adminInner">
          <h1>DAC</h1>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
