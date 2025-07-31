import { useEffect } from "react";
import DataLineChart from "../chart/dataLineChart";
import DataCard from "../dataCard";
import { useLocation } from "react-router-dom";

function Detail() {
  const location = useLocation();
  
  useEffect(() => {
    console.log(location.pathname + location.search + location.hash);
  }, [location]);
  
  return (
    <div id="home" className="p-6 flex flex-col gap-6">
      <DataLineChart />
      <DataCard title="Summary of Inverstments">
        {/* <DataTableChart/> */}
      </DataCard>
    </div>
  );
}

export default Detail
