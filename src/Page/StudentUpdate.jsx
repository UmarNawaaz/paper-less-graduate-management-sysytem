import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../context/User";

const StudentUpdate = () => {

  let { user } = useContext(UserContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [commettis, setcommettis] = useState([]);
  const [commetti, setcommetti] = useState('');
  const [supervisor, setsupervisor] = useState(null);

  useEffect(() => {
    axios
      .get("/getUser/" + id)
      .then((result) => {
        console.log(result);
        setName(result.data.name);
        setCnic(result.data.cnic);
        setPhone(result.data.phone);
        setAddress(result.data.address);
        setEmail(result.data.email);
        setDepartment(result.data.department);
        setGender(result.data.gender);
        setsupervisor(result.data.supervisor);
        setcommetti(result.data.commetti_id);
        // Ensure that the 'name' value is properly assigned
      })
      .catch((err) => console.log(err));

    get_all_commetties();

  }, []);
  const SubmitData = (e) => {
    e.preventDefault();
    axios
      .put("/updateStudentData/" + id, { name, cnic, phone, address, email, department, gender, commetti })
      .then((result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          title: "Update Successfully",
          text: "Students Record Updated",
        });
        navigate("/admin/admin/studentRegisterData");
      })
      .catch((err) => console.log(err));
  };


  let get_all_commetties = async () => {
    const response = await axios.get("/get_all_commetties");
    setcommettis(response.data);
  }

  return (
    <>
      <div className="title">Update Student Data</div>
      <div>
        <form onSubmit={SubmitData}>
          <div className="studentForm">
            <div className="inputFields">
              <label>Name:</label>
              <br />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter First Name"
                required
              />
              <br />

              <br />
            </div>
            <div className="inputFields">
              <label>CNIC:</label>
              <br />
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="e.g 1310110873533"
                required
              />
              <br />
              {/* <div className="error-message" style={{ color: "red" }}>
                {errors.cnic}
              </div> */}
              <br />
            </div>
            <div className="inputFields">
              <label>Department:</label>
              <br />
              <select
                name="dept"
                id="dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value=""></option>
                <option value="CS">Computer Science</option>
                <option value="SE">Software Engineering</option>
                <option value="PHM">Pharmacy</option>
                <option value="CVE">Civil Engineering</option>
              </select>
            </div>

            <div className="inputFields">
              <label>Phone No:</label>
              <br />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92311-------"
                required
              />
              <br />
              {/* <div className="error-message" style={{ color: "red" }}>
                {errors.phone}
              </div> */}
              <br />
            </div>
            <div className="inputFields">
              <label>Email:</label>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter an Email"
                required
              />
              <br />
              <br />
            </div>

            <div className="inputFields">
              <label>Address:</label>
              <br />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g Orish Colony Nawasher"
                required
              />
              <br />
              <br />
            </div>

            {
              supervisor != null &&
              <div className="inputFields">
                <label>Select Commetti</label>
                <br />
                <select
                  name="dept"
                  id="dept"
                  value={commetti}
                  onChange={(e) => setcommetti(e.target.value)}
                  required
                >
                  <option value=""></option>
                  {
                    commettis.length > 0 &&
                    <>
                      {
                        commettis.map((item) => {
                          if (item.commetti_department == department) {
                            return <option value={item._id}>{item.commetti_title}</option>
                          }
                        })
                      }
                    </>
                  }
                </select>
              </div>
            }


            <div className="radioStyle">
              <label>Gender:</label>
              <br />
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
          <button className="formBtn" type="submit">
            Update Data
          </button>
        </form>
      </div>
    </>
  );
};

export default StudentUpdate;
