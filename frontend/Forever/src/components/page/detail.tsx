import { useEffect } from "react";
import DataLineChart from "../chart/dataLineChart";
import DataCard from "../dataCard";
import { useLocation } from "react-router-dom";
import DataTableChart from "../chart/dataTableChart";
import AppToolbar from "../appToolbar";

function Detail() {
  const location = useLocation();
  
  useEffect(() => {
    console.log(location.pathname + location.search + location.hash);
  }, [location]);
  
  return (
    <div id="detail" className="p-6 flex flex-col gap-6">
      <DataLineChart />
      <AppToolbar />
      <DataCard title="Summary of Inverstments">
        <DataTableChart tableType="cash"/>
      </DataCard>
    </div>
  );
}

export default Detail
