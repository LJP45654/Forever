<<<<<<< HEAD
import { useEffect } from "react";
=======
>>>>>>> origin/frontend
import DataLineChart from "../chart/dataLineChart";
import DataCard from "../dataCard";
import { useLocation } from "react-router-dom";
import DataTableChart from "../chart/dataTableChart";
<<<<<<< HEAD

function Detail() {
  const location = useLocation();
  
  useEffect(() => {
    console.log(location.pathname + location.search + location.hash);
  }, [location]);
  
  return (
    <div id="home" className="p-6 flex flex-col gap-6">
      <DataLineChart />
      <DataCard title="Summary of Cash">
      <DataTableChart tableType="cash" currencyFilter="USD" />
=======
import AppToolbar from "../appToolbar";

function Detail() {
  const location = useLocation();
  const title = location.pathname.split("/").pop();
  return (
    <div id="detail" className="p-6 flex flex-col gap-6">
      <DataLineChart
        url={`http://localhost:3001/api/${location.pathname}`}
        title={title as string}
      />
      <AppToolbar />
      <DataCard title="Summary of Inverstments">
        <DataTableChart tableType="cash" />
>>>>>>> origin/frontend
      </DataCard>
    </div>
  );
}

<<<<<<< HEAD
export default Detail
=======
export default Detail;
>>>>>>> origin/frontend
