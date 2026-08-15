import { useState } from "react";
import Button from "../shared/components/Button";
import FormCalendar from "../shared/components/FormCalendar";
import FormDropdown from "../shared/components/FormDropdown";
import FormTextArea from "../shared/components/FormTextArea";
import Sidebar from "../shared/components/Sidebar";
import TopBar from "../shared/components/TopBar";


const RequestLeave = () => {
  const leaveType = ['Annual', 'Casual', 'Sick', 'Maternity'];
  const [ annual, casual, sick, maternity ] = leaveType;

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div className='page-layout'>
        <Sidebar />
        <div className='page-main-view top-bar-profile'>
          <TopBar />
          <form onSubmit={handleSubmit} className='leave-request-form'>
            <FormDropdown id='leaveType' name='Leave Type' labelTitle='Leave Type'>
            <option value="">Select a leave type</option>
            {
              leaveType.map((type, id) => <option key={id} value={type}>{type}</option>)
            }
            </FormDropdown>
            <FormCalendar
              id='startDate'
              name='Start Date'
              type='date'
              labelTitle='Start Date'
            />
            <FormCalendar
              id='endDate'
              name='End Date'
              type='date'
              labelTitle='End Date'
            />
            <FormTextArea
              labelTitle='Reason'
              id='leaveReason'
              name='leaveReason'
            />
            <Button btnUniqueStyling='form-btn' />
          </form>
        </div>
      </div>
    </>
  )
};

export default RequestLeave;