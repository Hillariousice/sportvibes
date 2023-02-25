import rOtpVerify from "./Verifyuser.module.css";
import Card from "../../components/Card/Card";
import OTPInputField from 'react-otp-input';
import "./verify.css"
import { useState } from "react";

const Verifyuser = () => {
  const [otpValue, setOtpValue] = useState('');
  
  const handleChange = (value:any) => {
    setOtpValue(value);
  };
  
  const handleSubmit = (event:any) => {
    event.preventDefault();
    // add verification logic here
  };

  return (
    <div>
      <div className="cardfull">
      <div className="azeez">
      <h3 className="otphead">OTP Verification</h3>
            <p className="">Fill in your OTP Verification code</p>
            <form onSubmit={handleSubmit}>
                <div>
                    
                    <p className="tt">OTP</p>
                    <div className="OTP-field">

                    <OTPInputField
                     value={otpValue}
                     onChange={handleChange}
                     numInputs={4}
                     inputStyle={
                        {
                            boxSizing: "border-box",
                            height:"4.6rem",
                            width:"4.6rem",
                            padding:"14px",
                            margin:"10px 0",
                            border:"1px solid #d9d9d9",
                            outline:"none",
                            color:"black",
                            marginLeft: "4px"
                        }
                     }
                     shouldAutoFocus
                     focusStyle={{
                      color: "black"
                     }}
                    />
                       

                  
                    </div>
                    </div>
                    
               
                <div>
                    <div></div>
                    <div className=''>
                        <button className="bnn" type="submit" >Verify</button>
                    </div>
        
                </div>
            </form>
            <p>Didn't get OTP? <span className="new-btn-style">Resend OTP</span></p>
      </div>
      </div>
     
    </div>
   
  )
}

export default Verifyuser
