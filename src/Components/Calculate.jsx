import React, { useEffect, useState } from "react";
import axios from "axios";
import './Calculate.css';

const Calculate = () => {
  const [currency, setCurrency] = useState("USD");  // ارز پایه
  const [convert, setConvert] = useState("IRR");    // ارز تبدیل‌شونده
  const [amount, setAmount] = useState(1);          // مبلغ ورودی
  const [converted, setConverted] = useState("");   // نتیجه‌ی تبدیل
  const [rateCurrencyToConvert, setRateCurrencyToConvert] = useState(""); // نرخ ارز پایه به ارز مقصد
  const [rateConvertToCurrency, setRateConvertToCurrency] = useState(""); // نرخ ارز مقصد به ارز پایه
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");           // پیغام خطا برای ورودی نامعتبر

  // اعتبارسنجی عددی بودن مقدار ورودی
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      setError("مقدار نامشخص است");
    } else {
      setError("");
      setAmount(Number(value));
    }
  };

  // انتخاب نماد ارز بر اساس انتخاب کاربر
  const currencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";
      case "IRR":
        return "ریال";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };

  // تابعی برای جابجایی ارزها
  const swapCurrencies = () => {
    const temp = currency;
    setCurrency(convert);
    setConvert(temp);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      async function fetchConversionRates() {
        setIsLoading(true);
        try {
          // درخواست برای تبدیل مقدار ورودی
          const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/15a23ce364c5c63f71f4f319/pair/${currency}/${convert}`
          );
          const data = response.data;
          setConverted((data.conversion_rate * amount).toFixed(2));

          // تنظیم نرخ ارز پایه به ارز مقصد
          setRateCurrencyToConvert(data.conversion_rate.toFixed(4));

          // درخواست برای نرخ برعکس (ارز مقصد به ارز پایه)
          const reverseResponse = await axios.get(
            `https://v6.exchangerate-api.com/v6/15a23ce364c5c63f71f4f319/pair/${convert}/${currency}`
          );
          const reverseData = reverseResponse.data;

          // تنظیم نرخ ارز مقصد به ارز پایه
          setRateConvertToCurrency(reverseData.conversion_rate.toFixed(4));
        } catch (error) {
          console.error("Error fetching the conversion rates:", error);
        }
        setIsLoading(false);
      }

      if (currency === convert) {
        setConverted(amount);
        setRateCurrencyToConvert(1);
        setRateConvertToCurrency(1);
      } else {
        fetchConversionRates();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [amount, currency, convert]);

  return (
    <div className="background">
      <div className="container">
        <div className="form">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* نمایش نماد ارز در کنار input */}
            <span>{currencySymbol()}</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              disabled={isLoading}
              style={{ marginLeft: '8px' }}  // فاصله بین نماد و input
            />
          </div>

          {/* نمایش پیام خطا در صورت وارد کردن ورودی نامعتبر */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={isLoading}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="IRR">IRR</option>
          </select>

          {/* دکمه برای جابجایی ارزها */}
          <button onClick={swapCurrencies} disabled={isLoading} style={{ margin: '10px' }}>
            Swap Currencies
          </button>

          <select
            value={convert}
            onChange={(e) => setConvert(e.target.value)}
            disabled={isLoading}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="IRR">IRR</option>
          </select>

          {/* نمایش تبدیل مقدار ورودی */}
          <p>{isLoading ? "Loading..." : `${amount} ${currency} = ${converted} ${convert}`}</p>
          
          {/* نمایش نرخ 1 واحد ارز پایه به ارز مقصد */}
          <p>{isLoading ? "Loading..." : `1 ${currency} = ${rateCurrencyToConvert} ${convert}`}</p>

          {/* نمایش نرخ 1 واحد ارز مقصد به ارز پایه */}
          <p>{isLoading ? "Loading..." : `1 ${convert} = ${rateConvertToCurrency} ${currency}`}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculate;
