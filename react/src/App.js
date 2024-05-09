import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./arena/global/Topbar";
import { Sidebar } from "./arena/global/Sidebar";
import Dashboard from "./arena/dashboard";
import Team from "./arena/team";
import Invoices from "./arena/invoices";
import Contacts from "./arena/contacts";
import Bar from "./arena/bar";
import Form from "./arena/form";
import Line from "./arena/line";
import Pie from "./arena/pie";
import FAQ from "./arena/faq";
import OpVisit from "./arena/Registration/OpVisit";
import ErAdmission from "./arena/Registration/erAdmission";
import BILLING from "./arena/Billing";
import MEDICATIONDISPENSE from "./arena/pharmacy/medicationDispense";
import MEDICATIONRETURN from "./arena/pharmacy/medicationReturn";
import INVENTORY from "./arena/pharmacy/inventory";
import MEDICALRECORDS from "./arena/doctor/medicalRecords";
import MYPATIENTS from "./arena/doctor/myPatients";
import Geography from "./arena/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./arena/auth/Login";
import Signup from "./arena/auth/Signup";
import OpManagment from "./arena/Registration/OpManagment";
import Emr from "./arena/doctor/EMR";
import ADMIN from "./arena/admin";
import MANAGESTOCK from "./arena/pharmacy/inventory/manageStock";
import OPENINGSTOCK from "./arena/pharmacy/inventory/openingStock";
import IPD from "./arena/ipd";
import IP from "./arena/ip";
import INCOMING from "./arena/incoming";
import BEDVIEW from "./arena/bedView";
import HOSPITALPRICEMASTER from "./arena/hospitalPriceMaster";
import SERVICEMASTER from "./arena/serviceMaster";
import STAFFMASTER from "./arena/StaffMaster";
import ADDSTAFF from "./arena/StaffMaster/addStaff";
import MANAGESTAFF from "./arena/StaffMaster/manageStaff";
import ROLEMASTER from "./arena/roleMaster";
import DIAGNOSIS from "./arena/bedView/diagnosis";

function App() {
  const [auth, setAuth] = useState(false);
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const [people, setPeople] = useState(null);
  const handleSetPeople = (data) => {
    setPeople(data);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setAuth} setPeople={handleSetPeople} />} />
      <Route path="/signup" element={<Signup setAuth={setAuth} />} />
      <Route
        path="*"
        element={
          auth ? (

            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                  <Sidebar people={people} isSidebar={isSidebar} />
                  <main className="content">
                    <Topbar setIsSidebar={setIsSidebar} />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/form" element={<Form />} />
                      <Route path="/bar" element={<Bar />} />
                      <Route path="/pie" element={<Pie />} />
                      <Route path="/line" element={<Line />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/OpVisit" element={<OpVisit />} />
                      <Route path="/erAdmission" element={<ErAdmission />} />
                      <Route path="/billing" element={<BILLING />} />
                      <Route path="/medicationDispense" element={<MEDICATIONDISPENSE />} />
                      <Route path="/medicationReturn" element={<MEDICATIONRETURN />} />
                      <Route path="/inventory" element={<INVENTORY />} />
                      <Route path="/medicalRecords" element={<MEDICALRECORDS />} />
                      <Route path="/myPatients" element={<MYPATIENTS />} />
                      <Route path="/geography" element={<Geography />} />
                      <Route path="/OpManagment" element={<OpManagment />} />
                      <Route path="/EMR" element={<Emr />} />
                      <Route path="/priceMaster" element={<ADMIN />} />
                      <Route path="/manageStock" element={<MANAGESTOCK />} />
                      <Route path="/openingStock" element={<OPENINGSTOCK />} />
                      <Route path="/ipd" element={<IPD />} />
                      <Route path="/ip" element={<IP />} />
                      <Route path="/incoming" element={<INCOMING />} />
                      <Route path="/bedView" element={<BEDVIEW />} />
                      <Route path="/hospitalPriceMaster" element={<HOSPITALPRICEMASTER />} />
                      <Route path="/serviceMaster" element={<SERVICEMASTER />} />
                      <Route path="/staffMaster" element={<STAFFMASTER />} />
                      <Route path="/manageStaff" element={<MANAGESTAFF />} />
                      <Route path="/addStaff" element={<ADDSTAFF />} />
                      <Route path="/roleMaster" element={<ROLEMASTER />} />
                      <Route path="/diagnosis" element={<DIAGNOSIS />} />
                    </Routes>
                  </main>
                </div>
              </ThemeProvider>
            </ColorModeContext.Provider>
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
    </Routes>

  );
}

export default App;