import React, { useState } from 'react';
import './App.css';
import { Calendar } from './components/Calendar/Calendar';
import './static/css/global.css';
import { formateDate } from './utils/helpers/date/formateDate';

export const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="App_container">
      <div className='date_container'>{formateDate(selectedDate, 'DD MM YYYY')}</div>
      <Calendar selectedDate={selectedDate} selectDate={(date) => setSelectedDate(date)} />
    </div>
  )
}

export default App;
