import React, { useState } from "react";

const Calculate = () => {
    const [currency , setCorrency] = useState('USD')
    const [convert , setConvert] = useState("EUR")
  return (
    <div>
      <div>
        <input type="number" />
        <select value={currency} name="currency" id="1">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <select value={convert} name="currency" id="1">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
      </div>
      <p>sss</p>
    </div>
  );
};

export default Calculate;
