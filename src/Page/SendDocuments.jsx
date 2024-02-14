import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

const SendDocuments = () => {

  const [data, setData] = React.useState({
    name: "Muhammad Umar",
    dept: "Computer Science",
    supervisor: "Dr zia-Ur-Rehman",
    title: "PaperLess Graduate Research Managment System",
    pdf: "Download",
    Action: "Forward To Deen",
  });

  let [documents, setdocuments] = useState([]);
  let [updated, setupdated] = useState(false);

  let get_data = async () => {
    let response = await axios.get("http://localhost:5000/get_document_to_forward_deen");
    setdocuments(response.data);
  }

  const getuserbyid = async (id, type) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_user_by_id/${id}/${type}`);
      return response.data[0]
    } catch (error) {
      console.error(`Error fetching `, error)
      return null // or handle the error in an appropriate way
    }
  }

  const updatedata = async () => {

    const _data = await Promise.all(documents?.map(async (doc, index) => {
      let student = await getuserbyid(doc.student_id, 'student');
      let teacher = await getuserbyid(student.supervisor, 'teacher');
      doc['student'] = student;
      doc['supervisor_name'] = teacher.name
      return doc;
    }));
    setdocuments(_data);
    setupdated(true);
  }

  useEffect(() => {
    if (documents.length == 0) {
      get_data();
    }
    else if (documents.length > 0 && !updated) {
      updatedata();
    }
  }, [documents])

  return (
    <>
      <div className="title2"> Send Documents</div>
      <div>
        <table className="tableData">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Department</th>
              <th>Supervisor</th>
              <th>PDF</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              documents.length > 0 && updated &&
              <>
                {
                  documents.map((item, index) => {
                    return <>
                      <tr key={index}>
                        <td>{item.student.name}</td>
                        <td>{item.student.department}</td>
                        <td>{item.supervisor_name}</td>
                        <td>
                          <button >{item.pdfName.substring(13)}</button>
                        </td>
                        <td>
                          <button >Forward</button>
                        </td>
                      </tr>
                    </>
                  })
                }
              </>
            }

          </tbody>
        </table>
      </div>
    </>
  );
};

export default SendDocuments;
