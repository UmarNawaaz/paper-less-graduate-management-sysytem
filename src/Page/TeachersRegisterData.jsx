import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdMarkEmailRead } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
export default function TeachersRegisterData() {
  const [teacher, setTeacher] = useState([]);
  useEffect(() => {
    axios
      .get("/getTeacherData")
      .then((result) => setTeacher(result.data))
      .catch((err) => console.log(err));
  });

  const DeleteData = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with deletion
        axios
          .delete(`/deleteTeacher/${id}`)
          .then((response) => {
            console.log(response);
            // window.location.reload();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };
  return (
    <div>
      <div className="title">Teachers Data</div>
      <table className="tableData">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qualifiaction</th>
            <th>Department</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone No</th>
            <th>Cnic No</th>
            <th>Provide Role & Send Password</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {teacher.map((teach, index) => (
            <tr key={index}>
              <td>{teach.name}</td>
              <td>{teach.qualification}</td>
              <td>{teach.department}</td>
              <td>{teach.email}</td>
              <td>{teach.gender}</td>
              <td>{teach.phone}</td>
              <td>{teach.cnic}</td>
              <td>
                <button>
                  <Link
                   to={`/admin/admin/second_Email/${teach._id}`}
                    style={{ color: "#00073D" }}
                  >
                    <MdMarkEmailRead
                      style={{ width: "50px", height: "40px" }}
                    />
                  </Link>
                </button>
              </td>
              <td>
                <button>
                  <Link style={{ color: "#00073D" }}
                  to={`/admin/admin/update_Teacher/${teach._id}`}
                  >
                    <GrUpdate style={{ width: "50px", height: "40px" }} />
                  </Link>
                </button>
              </td>
              <td>
                <button onClick={(e) => DeleteData(teach._id)}>
                  <Link style={{ color: "red", textDecoration: "none" }}>
                    <MdDeleteForever
                      style={{ width: "50px", height: "40px" }}
                    />
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
