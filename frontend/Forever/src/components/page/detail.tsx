import DataLineChart from "../chart/dataLineChart";
import DataCard from "../dataCard";
import { useLocation } from "react-router-dom";
import DataTableChart from "../chart/dataTableChart";
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
      </DataCard>
    </div>
  );
}

export default Detail;
