import React, { useState } from "react";
import registerBg from "../../assets/sport.jpeg";

import { Link } from "react-router-dom";
import userMode from "./Register.module.css";

import axios from "axios";
import "./Register.css"
import { toast } from "react-toastify";
const baseUrl = "http://localhost:4000";
 
const Register = () => {
  const [formData, setFormData] = useState({});
 
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  console.log(formData);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios
        .post(`${baseUrl}/users/signup`, formData)
        .then((res) => {
          const signature = res.data.signature;
 
          localStorage.setItem("signature", signature);
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.href = "/verify-user";
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.Error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="allpage">


      <div className="backgroundside">
        <img src={registerBg} alt="Sportvibes"  className="image"/>
        <h2 className={userMode.userregspor}>
         Sport is life
        </h2>
      </div>
 
<div className="sideform">
<form action="" onSubmit={handleSubmit}>

 
          <h3 className={userMode.signup_head} style={{marginBottom:"30px"}}> Signup</h3>
          <div>
            <label className={userMode.labels}>Interest</label>
            <input
              className={userMode.registerinputs}
              type="interest"
              name="interest"
              placeholder="Enter your interest"
              onChange={handleChange}
            />
          </div>
 
          <div>
            <label className={userMode.labels}>Phone Number</label>
            <input
              className={userMode.registerinputs}
              type="phone"
              placeholder="Enter your phone number"
              name="phone"
              onChange={handleChange}
            />
          </div>
 
          <div>
            <label className={userMode.labels}>Email</label>
            <input
              className={userMode.registerinputs}
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={handleChange}
            />
          </div>
 
          <div>
            <label className={userMode.labels}>Password</label>
            <input
              className={userMode.registerinputs}
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
            />
          </div>
 
          <div>
            <label className={userMode.labels}>Confirm password</label>
            <input
              className={userMode.registerinputs}
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              name="confirm_password"
            />
          </div>
 
          <div className={userMode.btn_container}>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button type="submit" className={userMode.btn_Reg} >
              Signup
            </button>
          </div>

</form>
     <div>
            <p className={userMode.pTag}>
              Already have an account?{" "}
              <Link
                to="/verifyuser"
                className="sign"
                style={{ textDecoration: "none", color: "blue" }}
              >
                Sign in
              </Link>
            </p>
          </div>
</div>
          


        </div>
  
  );
};
 
export default Register;

