import dohLogo from "../../../assets/images/brand/dohLogo.png";
import eastAveLogo from "../../../assets/images/brand/eastAveLogo.png";
const ResultForm = ({ defaultValues }) => {
  const formStyle = {
    padding: "20px",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gridTemplateRows: "auto",
    gridTemplateAreas: `
      "header header header header meta"
      "content content content content content"
      "footer footer footer footer footer"
    `,
    gap: "10px",
    fontSize: "9px",
    border: "solid",
  };

  const headerStyle = {
    gridArea: "header",
    padding: "10px",
    textAlign: "center",
  };

  const metaStyle = {
    gridArea: "meta",
  };

  const contentStyle = {
    gridArea: "content",
    padding: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gridTemplateRows: "auto",
    gridTemplateAreas: `
      "name name ageGender ward date"
      "diagnosis diagnosis physician physician time"
      "temp hgb  fio2 . ."
      "pH pco2 po2 hco3 ."
      "be sao2 ctco2 . ."
      "oxygeneation oxygeneation hypoxema  . ."
      "mild moderate severe . ."
      "respiratory acidosis uncompensated mild2 ."
      "metabolic alkalosis partially-compensated moderate2 ."
      ". . fully-compensated severe2 ."
      ".  mixed mixed mixed ."
    `,
  };

  const fields = [
    { gridName: "name", label: "NAME:" },
    { gridName: "ageGender", label: "AGE/GENDER:" },
    { gridName: "ward", label: "WARD:" },
    { gridName: "date", label: "DATE:" },

    { gridName: "diagnosis", label: "DIAGNOSIS:" },
    { gridName: "physician", label: "PHYSICIAN:" },
    { gridName: "time", label: "TIME:" },
    { gridName: "temp", label: "TEMP:" },

    { gridName: "hgb", label: "HGB:" },
    { gridName: "fio2", label: "FIO2:" },
    { gridName: "pH", label: "pH:" },
    { gridName: "pco2", label: "pCO2:" },

    { gridName: "hco3", label: "HC03:" },
    { gridName: "be", label: "ABE:" },
    { gridName: "hgb", label: "HGB:" },
    { gridName: "sao2", label: "Sa02:" },

    { gridName: "ctco2", label: "ctC02:" },
    { gridName: "po2", label: "PO2" },
    { gridName: "oxygeneation", label: "ADEQUATE OXYGENATION:", box: true },
    { gridName: "hypoxema", label: "HYPOXEMA", box: true },
    { gridName: "mild", label: "MILD", box: true },
    { gridName: "moderate", label: "MODERATE", box: true },
    { gridName: "severe", label: "SEVERE", box: true },
    { gridName: "mild2", label: "MILD", box: true },
    { gridName: "moderate2", label: "MODERATE", box: true },
    { gridName: "severe2", label: "SEVERE", box: true },
    { gridName: "respiratory", label: "RESPIRATORY", box: true },
    { gridName: "acidosis", label: "ACIDOSIS", box: true },
    { gridName: "uncompensated", label: "UNCOMPENSATED", box: true },
    { gridName: "metabolic", label: "METABOLIC", box: true },
    { gridName: "alkalosis", label: "ALKALOSIS", box: true },
    { gridName: "mixed", label: "INTERPRETATION:" },

    {
      gridName: "partially-compensated",
      label: "PARTIALLY COMPENSATED",
      box: true,
    },
    {
      gridName: "fully-compensated",
      label: "FULLY COMPENSATED",
      box: true,
    },
  ];

  const footetFields = [
    {
      label: "PREPARED BY",
      value: defaultValues?.prepared_by,
      subLabel: "RESPIRATORY THERAPISTS ON DUTY",
    },
    {
      label: "INTERPRETED BY",
      value: defaultValues?.interpreted_by,
      subLabel: "PULMO CONSULTANT/PULMO RESIDENT",
    },
  ];
  const footerStyle = {
    gridArea: "footer",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
  };
  const fieldStyle = {
    display: "flex",
    gap: "3px",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: "4px",
  };
  const imageStyle = {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    backgroundColor: "grey",
  };

  return (
    <div style={formStyle} className="abg-form-result">
      <div style={headerStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          <div>
            <img src={dohLogo} style={imageStyle} alt="doh-logo" />
          </div>
          <div>
            <strong>Republic of the Philippines</strong>
            <br />
            <strong>DEPARTMENT OF HEALTH</strong>
            <br />
            <strong>East Avenue Medical Center</strong>
            <br />
            <br />
            <strong>PULMONARY SECTION</strong>
            <br />
            <strong style={{ textDecoration: "underline" }}>
              ARTERIAL BLOOD GAS OFFICIAL RESULT
            </strong>
          </div>
          <div>
            <img src={eastAveLogo} style={imageStyle} alt="east-ave-logo" />
          </div>
        </div>
      </div>
      <div style={metaStyle}>
        <ul style={{ margin: 0, padding: 0, textAlign: "center" }}>
          <li style={{ listStyle: "none", border: "1px solid" }}>
            Reference Code
          </li>
          <li style={{ listStyle: "none", border: "1px solid" }}>
            FM-MED-PUL-001
          </li>
          <li style={{ listStyle: "none", border: "1px solid" }}>Rev No:</li>
          <li style={{ listStyle: "none", border: "1px solid" }}>0</li>
          <li style={{ listStyle: "none", border: "1px solid" }}>
            Date Effective
          </li>
          <li style={{ listStyle: "none", border: "1px solid" }}>
            October 1, 2013
          </li>
        </ul>
      </div>
      <div style={contentStyle}>
        {fields?.map((item, index) => (
          <div
            key={index}
            style={{
              gridArea: item.gridName,
              ...fieldStyle,
              marginTop: item.gridName === "mixed" ? "2em" : "4px",
            }}
          >
            {item.box && (
              <>
                <div
                  style={{ height: "15px", width: "10px", border: "1px solid" }}
                ></div>
                <label style={{ width: "100%" }}>{item.label}</label>
              </>
            )}

            {!item.box && (
              <>
                <label>{item.label}</label>
                <label
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid black",
                    outline: "none",
                    height: "12px",
                  }}
                >
                  {defaultValues?.[item.gridName] || ""}
                </label>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <div style={{}}></div>
      </div>
      <div style={footerStyle}>
        {footetFields.map((item) => (
          <div style={{ width: "200px" }}>
            <label style={{ marginBottom: "1.5em" }}>{item.label}</label>
            <br />
            <p
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid black",
                outline: "none",
                height: "12px",
                marginBottom: "5px",
              }}
            >
              {item.value || ""}
            </p>
            <label>{item.subLabel}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultForm;
