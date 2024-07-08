import React, { useEffect, useState } from "react";

const Calculate = () => {
  const [currency, setCorrency] = useState("EUR");
  const [convert, setConvert] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [isLoading , setIsLoading]= useState(false)
  useEffect(function(){
    async function curv() {
      setIsLoading(true)
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=${convert}`
      );
      const data = await res.json();
      setConverted(data.rates[convert]);
      setIsLoading(false)
    }
    if(currency === convert) return setConverted(amount)
    curv()
  }, [amount, currency, convert]);
  return (
    <div>
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={isLoading}
        />
        <select
          value={currency}
          name="currency"
          id="1"
          onChange={(e) => setCorrency(e.target.value)}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <select
          value={convert}
          name="currency"
          id="1"
          onChange={(e) => setConvert(e.target.value)}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
      </div>
      <p>{converted} {convert}</p>
    </div>
  );
};

export default Calculate;
